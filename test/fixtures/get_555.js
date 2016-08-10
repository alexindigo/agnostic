module.exports = {
  'method': 'GET',
  'headers': {
    'host': 'localhost'
  },

  requestHandler: function(req, res)
  {
    res(555);
  },

  'expected':
  {
    'status': 555,
    'body'  : '555',
    'headers': {
      'content-type': 'text/plain'
    }
  }
};
