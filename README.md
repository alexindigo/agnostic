# agnostic

A library that allows other projects to be agnostic of particular http server implementation.

*Notice of change of ownership: Starting version 1.0.0 this package has changed it's owner and goals. Old version (0.0.0) is still available on npm via `npm install agnostic@0.0.0` or on [github](https://github.com/dtudury/agnostic). Thank you.*

## Install

```
npm install --save agnostic
```

## Example

```javascript
var agnostic = require('agnostic');
var express  = require('express');

var app = express();

app.all('/my-endpoint', agnostic(function(request, respond)
{
  // `respond` is a function with the following signature:
  // `respond([code], [content[, options]]);`
}));

// start the server
app.listen(common.server.port);
```

TBW.

## License

Agnostic is licensed under the MIT license.
