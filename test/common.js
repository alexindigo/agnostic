var path       = require('path')
  , glob       = require('glob')
  , rawBody    = require('raw-body')
  , asynckit   = require('asynckit')
  , hyperquest = require('hyperquest')
  ;

// expose suite methods
var common = module.exports =
{
  server: {
    endpoint: '/endpoint',
    port    : 56789
  },

  // shared methods
  requestHandler: requestHandler,

  sendRequest: sendRequest,
  sendAllRequests: sendAllRequests,
  sendRequestByName: sendRequestByName,

  // test requests
  requests: {}
};

// load request fixtures
glob.sync(path.join(__dirname, './fixtures/*.js')).forEach(function(file)
{
  common.requests[path.basename(file, '.js')] = require(file);
});

/**
 * Test subject request handler
 *
 * @this  test
 * @param {agnostic.request} request - agnostic request object
 * @param {function} respond - agnostic response function
 */
function requestHandler(request, respond)
{
console.log('GOT', request.body);

  respond(200, {ok: 'dokey'});
}

/**
 * Runs all the requests through
 *
 * @this  test
 * @param {function} callback - invoked after all requests finished
 */
function sendAllRequests(callback)
{
  asynckit.parallel(common.requests, sendRequest.bind(this), callback);
}

/**
 * Sends provided (by name) request with specified method, headers and body
 * to the simulated backend
 *
 * @this  test
 * @param {string} name - name of the request
 * @param {function} callback - invoke on response from the simulated server
 */
function sendRequestByName(name, callback)
{
  if (!common.requests[name]) throw new Error('Unsupported request: ' + name + '.');

  sendRequest.call(this, common.requests[name], name, callback);
}

/**
 * Sends request with specified method, headers and body
 * to the simulated backend
 *
 * @this  test
 * @param {object} config - config for the request
 * @param {function} callback - invoke on response from the simulated server
 */
function sendRequest(config, id, callback)
{
  var body
    , request
    , url     = path.join(common.server.endpoint, id) + (config.query || '')
    , options = {
      method  : config.method,
      headers : config.headers
    }
    ;

  if (['HEAD', 'GET'].indexOf(config.method) == -1)
  {
    body = typeof config.body == 'string' ? config.body : JSON.stringify(config.body);
    options.headers['content-length'] = body.length;
  }

  request = hyperquest('http://localhost:' + common.server.port + url, options, function(error, response)
  {
    this.error(error);

    this.equal(response.statusCode, config.expected.status, 'expected response with the ' + config.expected.status + ' status code');

    if (!config.expected.body)
    {
      // shortcut here
      callback(null, response);
      return;
    }

    rawBody(response, {
      length  : response.headers['content-length'] || 0,
      encoding: 'utf8'
    }, function(err, content)
    {
      this.error(err);

      this.equal(content, config.expected.body, 'expect content to be the same with body');

      // everything is clear
      callback(null, response);
    }.bind(this));
  }.bind(this));

  request.write(body || '');
}
