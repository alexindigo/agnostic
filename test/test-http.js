var path     = require('path')
  , http     = require('http')
  , tape     = require('tape')
  , common   = require('./common.js')
  , agnostic = require('../')
  ;

tape.test('http.createServer, no parser', function(t)
{
  var server, endpoints = {};

  // plug-in request handlers
  Object.keys(common.requests).forEach(function(id)
  {
    endpoints[path.join(common.server.endpoint, id)] = agnostic(common.requests[id].requestHandler);
  });

  server = http.createServer(function(req, res)
  {
    var url = req.url.split('?')[0];

    if (typeof endpoints[url] == 'function')
    {
      endpoints[url](req, res);
      return;
    }

    t.fail('It should not be like this :(');
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
