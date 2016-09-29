module.exports = {
  'method': 'POST',
  'headers': {
    'host': 'localhost'
  },
  'body': '{ body payload is too long, but still handled properly and with a meaningful response code and human readable error message }',

  requestHandler: function(req, res)
  {
    res(200, {should_not: 'been here'});
  },

  'expected':
  {
    'status': 413,
    'body': 'request entity too large'
  },

  'expected.hapi':
  {
    'status': 400,
    'body': '{"statusCode":400,"error":"Bad Request","message":"Payload content length greater than maximum allowed: 100"}'
  }
};
