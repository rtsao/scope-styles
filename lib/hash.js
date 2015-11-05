'use strict';

var hashObj = require('object-hash');
var baseX = require('base-x');

var BASE62 = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
var MAX_HASH_LENGTH = 5;

var encoder = baseX(BASE62).encode;

function hash(obj) {
  return encoder(hashObj(obj, {algorithm: 'md5', encoding: 'buffer'}));
}

module.exports = function hashSuffix(obj) {
  return '_' + hash(obj).substr(0, MAX_HASH_LENGTH);
}
