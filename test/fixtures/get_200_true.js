module.exports = {
  'method': 'GET',
  'headers': {
    'host': 'localhost',
    'accept': '*/*',
  },

  requestHandler: function(req, res)
  {
    res(true);
  },

  'expected':
  {
    'status': 200,
    'body'  : '1',
    headers :
    {
      'content-type': 'text/plain'
    }
  }
};
