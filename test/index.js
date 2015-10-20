'use strict';

var fs = require('fs');
var path = require('path');
var test = require('tape');
var scopeStyles = require('../');

test('basic functionality', function(t) {

  var basicTest = getFixtures('basic');
  var result = scopeStyles(basicTest.source);
  var expected = basicTest.expected;

  t.equal(result.css, expected, 'css matches expected');
  t.ok(result.exports, 'exports exists');
  t.ok(result.exports.foo, 'class foo exists in exports');
  t.ok(result.exports.bar, 'class bar exists in exports');
  t.equal(result.exports.foo, 'foo_4c06c', 'foo is correctly scoped');
  t.equal(result.exports.bar, 'bar_4c06c', 'bar is correctly scoped');
  t.end();
});


function getFixtures(name) {
  var expectedPath = path.join(__dirname, name + '.expected.css');
  var sourcePath = './' + name + '.source.js';

  return {
    source: require(sourcePath),
    expected: removeTrailingNewline(fs.readFileSync(expectedPath, 'utf8'))
  }
}

function removeTrailingNewline(str) {
  return str.substring(0, str.length - 1);
}
