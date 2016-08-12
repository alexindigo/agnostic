var os       = require('os')
  , batcher  = require('batcher')
  , grid     = require('./compatibility.json')
  , versions = process.versions.node.split('.')
  , supported
  , jobs
  , command
  ;

// istanbul doesn't play nice on windows
if (os.platform() == 'win32')
{
  command = 'npm install ${name}@${version} && tape test/test-${name}*.js | tap-spec';
}
else
{
  command = 'npm install ${name}@${version} && istanbul cover --include-pid tape -- test/test-${name}*.js | tap-spec';
}

// find most specific version
versions.forEach(function(v)
{
  versions.full = (versions.full ? [versions.full, v].join('.') : v);

  if (grid[versions.full])
  {
    supported = grid[versions.full];
  }
});

jobs = Object.keys(supported).map(function(name)
{
  return batcher.forEach({ name: name, version: supported[name] }).command(command);
});

// run all the versions one by one
batcher(jobs);
