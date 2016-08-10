module.exports = {
  'method': 'POST',
  'headers': {
    'host': 'localhost',
    'accept': '*/*',
    'content-type': 'application/json'
  },
  'body': {
    'subject': '42'
  },

  requestHandler: function(req, res)
  {
    res(200, {object: req.body.subject * 3});
  },

  'expected':
  {
    'status': 200,
    'body'  : '{"object":126}',
    'headers': {
      'content-type': 'application/json'
    }
  }
};
