'use strict';

var hashSuffix = require('./lib/hash');
var dashify = require('./lib/inline-prop-to-css');
var cssKey = require('./lib/css-symbol');

module.exports = scopeStyles;
module.exports.getCss = require('./get-css');

function scopeStyles(config, obj) {
  if (arguments.length < 2) {
    obj = config;
    config = {hash: true};
  }
  var suffix = config.hash ? hashSuffix(obj) : '';
  var result = {};
  result[cssKey] = '';
  return Object.keys(obj).reduce(function(acc, key) {
    var fn = isMediaQuery(key) ? processMediaQuery : processClass;
    var scoped = fn(obj[key], key, suffix);
    acc[key] = scoped.scopedName;
    acc[cssKey] += scoped.css;
    return acc;
  }, result);
}

function processClass(obj, className, suffix) {
  var result = partitionProps(obj);
  var nested = result.nested;
  var nestedClasses = Object.keys(nested).map(function(name) {
    var fn = isMediaQuery(name) ? makeMediaQuery : makeClass;
    return fn(className, suffix, nested[name], name);
  }).join('');

  return {
    css: makeClass(className, suffix, result.props) + nestedClasses,
    scopedName: className + suffix
  };
}

function processMediaQuery(obj, className, suffix) {
  var result = partitionProps(obj);
  var nested = result.nested;
  var nestedClasses = Object.keys(nested).map(function(name) {
    return makeClass(name, suffix, nested[name]);
  }).join('');

  return {
    css: className + ' {\n' + nestedClasses + '}\n',
    scopedName: className + suffix
  }
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
  }, {
    props: {},
    nested: {}
  });
}

function makeMediaQuery(name, suffix, props, media) {
  return media + ' {\n' + makeClass(name, suffix, props) + '}';
}

function isMediaQuery(key) {
  return key.substring(0, 6) === '@media';
}

function makeClass(name, suffix, props, subname) {
  var fullSuffix = subname ? suffix + subname : suffix;
  return '.' + name + fullSuffix + ' {\n  ' + inlineStyle(props) + '\n}\n';
}

function inlineStyle(obj) {
  return Object.keys(obj).map(function(prop) {
    return dashify(prop).concat(': ').concat(obj[prop])
  }).join(';\n  ');
}
