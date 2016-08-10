// Public API
module.exports = {
  request : requestAdapter,
  response: responseAdapter
};

/**
 * Express-specific adapter for agnostic based libraries,
 * makes request object into lowest common denominator
 *
 * @this    agnostic.options
 * @param   {EventEmitter} request - request object as tailored for agnostic request handlers
 * @param   {http.IncomingMessage} rawRequest - request object as seen in Express
 * @returns {object} - server agnostic request object
 */
function requestAdapter(request)
{
  return request;
}

/**
 * Updated response object with provided data
 *
 * @param {http.ServerResponse} response - response object as seen in Express
 * @param {number} code - http code for the response
 * @param {string} content - content to output with the response
 * @param {object} options - extra options to augment response object with
 */
function responseAdapter(response, code, content, options)
{
  // Buffer -> ??? -> application/octet-stream
  // check restify
  response.status(code);

  Object.keys(options.headers).forEach(function(name)
  {
    response.header(name, options.headers[name]);
  });

  response.end(content);
}
