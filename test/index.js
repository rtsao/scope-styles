'use strict';

var fs = require('fs');
var path = require('path');
var test = require('tape');

var scopeStyles = require('../');
var getCss = scopeStyles.getCss;
var getHash = scopeStyles.getHash;

var extensions = {
  source: '.source.js',
  opts: '.options.json',
  json: '.expected.json',
  css: '.expected.css'
};

var fixtureRegex = new RegExp(extensions.source + '$');
var matchesFixture = fixtureRegex.test.bind(fixtureRegex);

var tests = fs.readdirSync('test')
  .filter(matchesFixture)
  .map(function toName(file) {
    return path.basename(file, extensions.source);
  });

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
  var sourcePath = fixturePath(name, extensions.source);
  var optsPath = fixturePath(name, extensions.opts);
  var jsonPath = fixturePath(name, extensions.json);
  var cssPath = fixturePath(name, extensions.css);

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

function fixturePath(name, ext) {
  return path.join(__dirname, name + ext);
}
