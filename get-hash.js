'use strict';

var hashKey = require('./lib/hash-symbol');

module.exports = function getHash(object) {
  return object[hashKey];
}
