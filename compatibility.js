var batcher  = require('batcher')
  , grid     = require('./compatibility.json')
  , versions = process.versions.node.split('.')
  , supported
  , commands
  ;

// find most specific version
versions.forEach(function(v)
{
  versions.full = (versions.full ? [versions.full, v].join('.') : v);

  if (grid[versions.full])
  {
    supported = grid[versions.full];
  }
});

commands = Object.keys(supported).map(function(name)
{
  return batcher.forEach({ name: name, version: supported[name] }).command('npm install ${name}@${version} && tape test/test-${name}*.js | tap-spec');
});

// run all the versions one by one
batcher(commands);
