var IncomingMessage = require('http').IncomingMessage
    // helpers
  , merge           = require('deeply')
    // modules
  , defaults        = require('./defaults.js')
  , normalize       = require('./lib/normalize.js')
    // adapters
  , express         = require('./adapters/express.js')
  , hapi            = require('./adapters/hapi.js')
  , http            = require('./adapters/http.js')
  , restify         = require('./adapters/restify.js')
  ;

// Public API
module.exports = agnostic;

agnostic.adapter  = requestHandlerAdapter;
agnostic.defaults = defaults;

/**
 * Wraps provided request handler with adapter function
 *
 * @param   {function} requestHandler - http-server agnostic function to wrap
 * @param   {object} [options] - list of options to bake into request handler
 * @returns {function} - wrapped function
 */
function agnostic(requestHandler, options)
{
  options = merge(agnostic.defaults, options || {});

  return requestHandlerAdapter.bind(options, requestHandler);
}

/**
 * Selects proper adapter based on request object specific properties
 *
 * @this    agnostic.options
 * @param   {function} requestHandler - original (server-agnostic) handler
 * @param   {object} rawRequest - server specific request object
 * @param   {object|function} rawResponse - server specific response object, or function in case of Hapi
 */
function requestHandlerAdapter(requestHandler, rawRequest, rawResponse)
{
  var adapter;

  // address the elephant in the room
  // be normal
  if (rawRequest instanceof IncomingMessage)
  {
    // `restify` being a good citizen, identifies itself
    if (rawRequest.serverName == 'restify')
    {
      adapter = restify;
    }
    // express, or something pretending to be,
    // it'd better be :)
    else if (typeof rawRequest.next == 'function')
    {
      rawRequest.serverName = 'express';
      adapter = express;
    }
    // assume everything else either native http.
    // or something pretending to be it very hard
    else
    {
      rawRequest.serverName = 'http';
      adapter = http;
    }
  }
  // or hapi-like
  else if (typeof rawRequest.server == 'object' && typeof rawRequest.server.info == 'object')
  {
    rawRequest.serverName = 'hapi';
    adapter = hapi;
  }

  if (!adapter)
  {
    // nothing found, booo
    throw new TypeError('agnostic: Unsupported http server type. Please open new issue to add support for your server. https://github.com/alexindigo/agnostic/issues');
  }

  // invoke chosen adapter with normalized body
  normalize.request.call(this, rawRequest, function(error, request)
  {
    if (error)
    {
      // terminate earlier – as input error
      normalize.response.call(this, adapter.response, rawResponse, request)(400);
      return;
    }

    requestHandler(adapter.request.call(this, request, rawRequest), normalize.response.call(this, adapter.response, rawResponse, request));

  }.bind(this));
}
