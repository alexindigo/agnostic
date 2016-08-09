module.exports = {
  'method': 'POST',
  'headers': {
    'host': 'localhost',
    'accept': '*/*',
    'content-type': 'application/json'
  },
  'body': '{ broken json }',

  requestHandler: function(req, res)
  {
    res(200, {should_not: 'been here'});
  },

  'expected':
  {
    'status': 400
  }
};
