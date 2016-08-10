module.exports = {
  'method': 'POST',
  'headers': {
    'host': 'localhost',
    'accept': '*/*',
  },
  // all servers treat missing content-type as signal not to mess with it,
  // but Hapi isn't the easy one to scary, so it parses it as if it'd be JSON
  // so it's something we have no control over.
  // Solution would be to recommend not to use Hapi with your library,
  // or require to always have content-type with non-empty requests.

  'body': '{"a":42}',

  requestHandler: function(req, res)
  {
    res(req.body);
  },

  'expected':
  {
    'status': 200,
    'body'  : '{"a":42}',
    // headers :
    // {
    //   'content-type': 'text/html'        // all servers, except Hapi
    //   'content-type': 'application/json' // Hapi, except all servers
    // }
  }
};
