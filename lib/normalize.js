var url     = require('url')
  , http    = require('http')
  , merge   = require('deeply')
  , typeOf  = require('precise-typeof')
  , rawBody = require('raw-body')
  ;

// Public API
module.exports =
{
  request : normalizeRequest,
  response: normalizeResponse
};

/**
 * Normalizes body of the request
 *
 * @private
 * @this  agnostic.options
 * @param {object} request - server specific request object
 * @param {function} callback - invoked after body parsing is done (either successfully or not)
 */
function normalizeRequest(request, callback)
{
  var options = {
    length  : request.headers['content-length'] || this.request.contentLength,
    limit   : this.request.bodyMaxLength,
    encoding: this.request.bodyEncoding
  };

  if (request.serverName == 'hapi' || ['HEAD', 'GET'].indexOf(request.method) != -1 || request.complete)
  {
    // hapi uses `request.payload`
    request.body = request.body || request.payload;
    callback(null, request.body);
    return;
  }

  rawBody(request, options, function(error, body)
  {
    if (error) return callback(error);

    // take on query string
    // TODO: Hapi has it (request.url) as object (of course) :)
    request.query = request.query || url.parse(request.url, true).query || {};

    parseBody.call(this, body, request.headers['content-type'] || this.request.contentType, function(err, parsed)
    {
      // set request.body to whatever we have
      request.body = parsed;

      // pass it upstream
      callback(err, request.body);
    });
  }.bind(this));
}

/**
 * Parses provided body with async API
 *
 * @private
 * @this  agnostic.options
 * @param {string} body - request body to parse
 * @param {string} contentType - content type of the body
 * @param {function} callback - invoked with parsed content
 */
function parseBody(body, contentType, callback)
{
  var err = null, parser = this.parsers[contentType];

  if (typeOf(parser) != 'function')
  {
    callback(null, body);
    return;
  }

  try
  {
    body = parser(body);
  }
  catch (e)
  {
    err  = e;
    body = {};
  }

  callback(err, body);
}

/**
 * Normalizes response signature
 *
 * @this    agnostic.options
 * @param   {function} adapter - server specific adapter that consumer normalized response call
 * @param   {object|function} response - server specific response object (or function n Hapi's case)
 * @returns {function} - wrapped adapter with variable signature
 */
function normalizeResponse(adapter, response)
{
  return wrapResponse.bind(this, adapter, response);
}

/**
 * Wraps provided adapter with response
 * and offers flexible api function
 *
 * Signature:
 * response([code], [content[, options]])
 *
 * @this  agnostic.options
 * @param {function} adapter - server specific adapter that consumer normalized response call
 * @param {object|function} response - server specific response object (or function n Hapi's case)
 * @param {number} [code] - http code for the response
 * @param {string|object|array} [content] - content to output with the response
 * @param {object} [options] - extra options to augment response object with
 */
function wrapResponse(adapter, response, code, content, options)
{
  var contentType, contentMimeType;

  // requires magic
  if (arguments.length < 5)
  {
    // case 1. `code` is omitted
    if (typeOf(code) != 'number')
    {
      options = content;
      content = code;
      code    = this.response.statusCode;
    }

    // case 2. no content
    if (!content)
    {
      // use default content-type
      contentMimeType = this.response.contentType;
      content         = http.STATUS_CODES[code] || code.toString();
    }

    // case 3. no options
    if (!options)
    {
      options = {};
    }
  }

  // should be separate function?
  contentType = typeOf(content);

  // guess mime-type
  contentMimeType = contentMimeType || this.contentMimeTypes[contentType] || this.response.contentType;

  // make content string
  if (contentType != 'string')
  {
    if (typeof(this.stringifiers[contentType]) == 'function')
    {
      // TODO: either add catch here, or remove from parsers
      content = this.stringifiers[contentType](content);
    }
    else if (typeof(this.stringifiers[contentType]) == 'string')
    {
      content = this.stringifiers[contentType];
    }
    else
    {
      this.logger.warn({message: 'Unable to find stringifiers for non string content type', contentType: contentType});
      // poor man's stringifier
      content = content.toString();
    }
  }

  // adjust options
  options = merge({headers: {'content-type': contentMimeType}}, options);

  // do the ting
  adapter.call(this, response, code, content, options);
}
