var restify  = require('restify')
  , tape     = require('tape')
  , common   = require('./common.js')
  , agnostic = require('../')

  , bodyParserOptions = { maxBodySize: 1024 * 1000 }
  ;

// Restify options
// https://gist.github.com/LeCoupa/0664e885fd74152d1f90

tape.test('restify as route, no parser', function(t)
{
  var server = restify.createServer();

  // plug-in request handlers
  Object.keys(common.requests).forEach(function(id)
  {
    var endpoint = [common.server.endpoint, id].join('/')
      , handler  = agnostic(common.requests[id].requestHandler)
      ;
    server.get(endpoint, handler);
    server.head(endpoint, handler);
    server.post(endpoint, handler);
  });

  // start the server
  server.listen(common.server.port, function()
  {
    common.sendAllRequests.call(t, function(error, responded)
    {
      t.error(error);

      t.equal(Object.keys(responded).length, Object.keys(common.requests).length, 'expect same number of responses as requests');

      server.close(function()
      {
        t.end();
      });
    });
  });
});

tape.test('restify as route, with bodyParser middleware', function(t)
{
  var server = restify.createServer();

  // made it parse input from start
  server.use(restify.bodyParser(bodyParserOptions));

  // plug-in request handlers
  Object.keys(common.requests).forEach(function(id)
  {
    var endpoint = [common.server.endpoint, id].join('/')
      , handler  = agnostic(common.requests[id].requestHandler)
      ;
    server.get(endpoint, handler);
    server.head(endpoint, handler);
    server.post(endpoint, handler);
  });

  // start the server
  server.listen(common.server.port, function()
  {
    common.sendAllRequests.call(t, function(error, responded)
    {
      t.error(error);

      t.equal(Object.keys(responded).length, Object.keys(common.requests).length, 'expect same number of responses as requests');

      server.close(function()
      {
        t.end();
      });
    });
  });
});
