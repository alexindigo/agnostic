module.exports = {
  'method': 'POST',
  'headers': {
    'host': 'localhost',
    'accept': '*/*',
    'content-type': 'text/html'
  },
  'body': '<html><body>42</body></html>',

  requestHandler: function(req, res)
  {
    res(req.body.match(/<body>[^<]+<\/body>/)[0]);
  },

  'expected':
  {
    'status': 200,
    'body'  : '<body>42</body>',
    'headers': {
      'content-type': 'text/html'
    }
  }
};
