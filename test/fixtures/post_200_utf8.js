module.exports = {
  'method': 'POST',
  'headers': {
    'host': 'localhost',
    'accept': '*/*',
    'content-type': 'application/json'
  },
  'body': {
    'message': {
      'text': 'the naïve assumption'
    }
  },

  requestHandler: function(req, res)
  {
    res(200, {object: req.body.message.text});
  },

  'expected':
  {
    'status': 200,
    'body'  : '{"object":"the naïve assumption"}',
    'headers': {
      'content-type': 'application/json'
    }
  }
};
