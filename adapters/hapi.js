// Public API
module.exports = {
  request : requestAdapter,
  response: responseAdapter
};

/**
 * Hapi-specific adapter for agnostic based libraries,
 * makes request object into lowest common denominator
 *
 * @this    agnostic.options
 * @param   {EventEmitter} request - request object as tailored for agnostic request handlers
 * @param   {EventEmitter} rawRequest - request object as seen in Express
 * @returns {object} - server agnostic request object
 */
function requestAdapter(request, rawRequest)
{
  // Hapi's decided to make http methods lowercase
  request.method = rawRequest.raw.req.method;
  // and parse url into an object
  request.url = rawRequest.raw.req.url;

  return request;
}

/**
 * Updated response object with provided data
 *
 * @param {function} reply - response object as seen in Express
 * @param {number} code - http code for the response
 * @param {string} content - content to output with the response
 * @param {object} options - extra options to augment response object with
 */
function responseAdapter(reply, code, content, options)
{
  // Buffer -> ??? -> application/octet-stream
  // check hapi
  var response = reply(content).code(code);

  Object.keys(options.headers).forEach(function(name)
  {
    response.header(name, options.headers[name]);
  });
}
