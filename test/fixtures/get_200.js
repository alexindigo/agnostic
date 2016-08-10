var util = require('util');

module.exports = {
  'method': 'GET',
  'headers': {
    'host': 'localhost',
    'accept': '*/*'
  },
  'query': '?a=42',

  requestHandler: function(req, res)
  {
    res(200, req.query.a * 2);
  },

  'expected':
  {
    'status': 200,
    'body'  : '84',
    'headers': {
      'content-type': 'text/plain'
    }
  }
};
