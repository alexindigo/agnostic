var http       = require('http')
  , events     = require('events')
  , tape       = require('tape')
  , hyperquest = require('hyperquest')
  , common     = require('./common.js')
  , agnostic   = require('../')
  ;

tape.test('unsupported http server', function(t)
{
  var server, endpoint = agnostic(t.fail.bind(t, 'should not come to this'));

  server = http.createServer(function(req, res)
  {
    var request = new events.EventEmitter();

    request.headers = req.headers;
    request.method  = req.method;
    request.url     = req.url;

    // emulate some hapi-like weird web server
    t.throws(function()
    {
      endpoint(request, res);
    }, /Unsupported http server type/, 'expect to throw upon invoked request handler');

    // emulate just weird web server
    t.throws(function()
    {
      endpoint({
        headers: req.headers,
        method : req.method,
        url    : req.url
      }, res);
    }, /Unsupported http server type/, 'expect to throw upon invoked request handler');

    res.end();
  });

  // no need to start the server
  server.listen(common.server.port, function()
  {
    hyperquest('http://localhost:' + common.server.port + common.server.endpoint, function(error)
    {
      t.error(error);

      server.close(function()
      {
        t.end();
      });
    });
  });

});
