'use strict';

var fs = require('fs');
var path = require('path');
var test = require('tape');

var scopeStyles = require('../');
var getCss = scopeStyles.getCss;
var getHash = scopeStyles.getHash;

var tests = [
  'basic',
  'falsy-values',
  'nest-inside-media',
  'no-hash',
  'override-hash',
  'prefix'
];

tests.forEach(testFromName);

function testFromName(name) {
  var fixtures = getFixtures(name);
  runTest(name, fixtures.source, fixtures.expected, fixtures.opts);
}

function runTest(name, source, expected, opts) {
  test('test ' + name, function t(assert) {
    var result = opts ? scopeStyles(opts, source) : scopeStyles(source);
    assert.equal(getCss(result), expected.css, 'css matches expected');
    assert.deepEqual(result, expected.json.object, 'object matches expected');
    assert.equal(getHash(result), expected.json.hash, 'hash matches expected');
    assert.end();
  });
}

function getFixtures(name) {
  var sourcePath = path.join(__dirname, name + '.source.js');
  var optsPath = path.join(__dirname, name + '.options.json');
  var jsonPath = path.join(__dirname, name + '.expected.json');
  var cssPath = path.join(__dirname, name + '.expected.css');

  return {
    source: require(sourcePath),
    opts: moduleExists(optsPath) ? require(optsPath) : null,
    expected: {
      json: require(jsonPath),
      css: fs.readFileSync(cssPath, 'utf8')
    }
  }
}

function moduleExists(name) {
  try {
    return Boolean(require.resolve(name));
  } catch(e) {
    return false;
  }
}
