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
    name: 'nest-inside-media'
  },
  {
    name: 'no-hash',
    opts: {hash: false}
  },
  {
    name: 'override-hash',
    opts: {hash: '_hello'}
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
      css: fs.readFileSync(cssPath, 'utf8')
    }
  }
}
