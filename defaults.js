var logger = require('bole')('agnostic');

// agnostic's default options
module.exports =
{
  // default logger
  logger: logger,

  // request handling related options
  request:
  {
    contentType  : 'text/plain',
    contentLength: 0,

    bodyMaxLength: 1000 * 1024,
    bodyEncoding : 'utf8'
  },

  response:
  {
    statusCode  : 200,
    contentType : 'text/plain'
  },

  // default parsing (as per `content-type` request header)
  parsers:
  {
    'application/json': JSON.parse
  },

  // default stringifiers (as per `precise-typeof` classification)
  stringifiers:
  {
    'object'   : JSON.stringify,
    'array'    : JSON.stringify,
    // send null and undefined as empty strings
    'null'     : '',
    'undefined': '',
    // send booleans as 0 or 1
    'boolean'  : function(b) { return b ? '1' : '0'; }
  },

  // default content types (as per `precise-typeof` classification)
  contentMimeTypes:
  {
    'string': 'text/html',
    'object': 'application/json',
    'array' : 'application/json'
  }
};
