var path   = require('path')
  , Hapi   = require('hapi')
  , tape   = require('tape')
  , common = require('./common.js')
  , agnostic   = require('../')
  ;

tape.test('hapi as route, with default body parser', function(t)
{
  var server = new Hapi.Server();

  // setup hapi server
  server.connection({ port: common.server.port });

  // plug-in request handlers
  Object.keys(common.requests).forEach(function(id)
  {
    // plug-in fbbot
    server.route({
      method : ['GET', 'POST'], // Hapi uses GET handler for HEAD requests
      path   : path.join(common.server.endpoint, id),
      handler: agnostic(common.requests[id].requestHandler)
    });
  });

  // start the server
  server.start(function(err)
  {
    t.error(err);

    common.sendAllRequests.call(t, function(error, responded)
    {
      t.error(error);

      t.equal(Object.keys(responded).length, Object.keys(common.requests).length, 'expect same number of responses as requests');

      server.stop(function()
      {
        t.end();
      });
    });

  });

});
