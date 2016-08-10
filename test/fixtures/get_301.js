module.exports = {
  'method': 'GET',
  'headers': {
    'host': 'localhost'
  },

  requestHandler: function(req, res)
  {
    res(301, null, {headers: {location: 'http://agnostic.way/'}});
  },

  'expected':
  {
    'status': 301,
    headers:
    {
      location: 'http://agnostic.way/'
    }
  }
};
