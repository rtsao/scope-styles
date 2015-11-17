'use strict';

var fs = require('fs');
var path = require('path');
var test = require('tape');

var scopeStyles = require('../');
var getCss = scopeStyles.getCss;

var tests = [
  {
    name: 'basic'
  },
  {
    name: 'no-hash',
    opts: {hash: false}
  }
];

tests.forEach(testFromConfig);

function testFromConfig(config) {
  var fixtures = getFixtures(config.name);
  runTest(config.name, fixtures.source, fixtures.expected, config.opts);
}

function runTest(name, source, expected, opts) {
  test('test ' + name, function t(assert) {
    var result = opts ? scopeStyles(opts, source) : scopeStyles(source);
    assert.equal(getCss(result), expected.css, 'css matches expected');
    assert.deepEqual(result, expected.json, 'object matches expected');
    assert.end();
  });
}

function getFixtures(name) {
  var sourcePath = './' + name + '.source.js';
  var jsonPath = path.join(__dirname, name + '.expected.json');
  var cssPath = path.join(__dirname, name + '.expected.css');

  return {
    source: require(sourcePath),
    expected: {
      json: require(jsonPath),
      css: removeTrailingNewline(fs.readFileSync(cssPath, 'utf8'))
    }
  }
}

function removeTrailingNewline(str) {
  return str.substring(0, str.length - 1);
}
