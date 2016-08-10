module.exports = {
  'method': 'HEAD',
  'headers': {
    'host': 'localhost'
  },

  requestHandler: function(req, res)
  {
    res(418);
  },

  'expected':
  {
    'status': 418,
    'body'  : ''
  }
};
