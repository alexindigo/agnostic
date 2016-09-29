var express    = require('express')
  , bodyParser = require('body-parser')
  , tape       = require('tape')
  , common     = require('./common.js')
  , agnostic   = require('../')

  , bodyParserOptions = { limit: 100 }
  ;

tape.test('express as route, no parser', function(t)
{
  var server
    , app   = express()
    ;

  // plug-in request handlers
  Object.keys(common.requests).forEach(function(id)
  {
    app.all([common.server.endpoint, id].join('/'), agnostic(common.requests[id].requestHandler));
  });

  // start the server
  server = app.listen(common.server.port, function()
  {
    common.sendAllRequests.call(t, 'express', function(error, responded)
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

tape.test('express as route, with bodyParser middleware', function(t)
{
  var server
    , app   = express()
    ;

  // made it parse input from start
  app.use(bodyParser.json(bodyParserOptions));

  // plug-in request handlers
  Object.keys(common.requests).forEach(function(id)
  {
    app.all([common.server.endpoint, id].join('/'), agnostic(common.requests[id].requestHandler));
  });

  // start the server
  server = app.listen(common.server.port, function()
  {
    common.sendAllRequests.call(t, 'express', function(error, responded)
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
