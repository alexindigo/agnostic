module.exports = {
  'method': 'GET',
  'headers': {
    'host': 'localhost',
    'accept': '*/*',
  },

  requestHandler: function(req, res)
  {
    res(278, false);
  },

  'expected':
  {
    'status': 278,
    'body'  : '0',
    headers :
    {
      'content-type': 'text/plain'
    }
  }
};
