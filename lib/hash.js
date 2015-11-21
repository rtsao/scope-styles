'use strict';

var base62 = require('base62');
var stringHash = require('string-hash');

module.exports = function hashSuffix(obj) {
  return '_' + base62.encode(stringHash(JSON.stringify(obj)));
}
