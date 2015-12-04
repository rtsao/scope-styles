'use strict';

var cssKey = require('./lib/css-symbol');

module.exports = function getCss(object) {
  return object[cssKey];
}
