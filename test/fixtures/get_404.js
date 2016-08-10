module.exports = {
  'method': 'GET',
  'headers': {
    'host': 'localhost',
    'accept': '*/*'
  },

  requestHandler: function(req, res)
  {
    res(404);
  },

  'expected':
  {
    'status': 404,
    'body'  : 'Not Found',
    'headers': {
      'content-type': 'text/plain'
    }
  }
};
