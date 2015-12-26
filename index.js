'use strict';
var extend = require('xtend');
var hashSuffix = require('./lib/hash');
var dashify = require('./lib/inline-prop-to-css');
var cssKey = require('./lib/css-symbol');
var hashKey = require('./lib/hash-symbol');
var arrayConcat = Array.prototype.concat;

module.exports = scopeStyles;
module.exports.getCss = require('./get-css');
module.exports.getHash = require('./get-hash');

function scopeStyles(config, obj) {
  if (arguments.length < 2) {
    obj = config;
    config = {};
  }
  config = extend({hash: hashSuffix(obj), prefix: '.'}, config);
  config.hash = config.hash ? config.hash : '';
  var result = {};
  result[cssKey] = '';
  result[hashKey] = config.hash;
  return Object.keys(obj).reduce(function(acc, key) {
    var selector = key + config.hash;
    var scoped = processObj({
      selector: selector,
      prefix: config.prefix
    }, obj[key]);
    acc[key] = selector;
    acc[cssKey] += scoped.join('\n') + '\n';
    return acc;
  }, result);
}

function processObj(name, obj, query) {
  var result = partitionProps(obj);
  var nested = result.nested;
  var classes = Object.keys(result.props).length ?
    [stringify(name, result.props, query)] : [];
  return arrayConcat.apply(classes, processNested(name, nested, query));
}

function processNested(name, nested, query) {
  return Object.keys(nested).map(function(key) {
    var val = nested[key];
    return isMediaQuery(key) ?
      processObj(name, val, key) : processObj({
        selector: name.selector + key,
        prefix: name.prefix
      }, val, query);
  });
}

function partitionProps(propsObj) {
  return Object.keys(propsObj).reduce(function(acc, key) {
    var val = propsObj[key];
    var dest = val && {
      string: 'props',
      object: 'nested'
    }[typeof val];
    if (dest) {
      acc[dest][key] = val;
    }
    return acc;
  }, {props: {}, nested: {}});
}

function isMediaQuery(key) {
  return key.substring(0, 6) === '@media';
}

/**
 * Stringification helpers
 */

function stringify(name, props, query) {
  return query ? makeMediaQuery(name, props, query) : makeClass(name, props);
}

function makeClass(name, props) {
  return name.prefix + name.selector + ' {\n'
    + inlineStyle(props) + '\n}';
}

function makeMediaQuery(name, props, query) {
  return query + ' {\n' + makeClass(name, props) + '\n}';
}

function inlineStyle(obj) {
  return '  ' + Object.keys(obj).map(function(prop) {
    return dashify(prop).concat(': ').concat(obj[prop])
  }).join(';\n  ');
}
