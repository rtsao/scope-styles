'use strict';

var regex = /[A-Z]/g;

/**
 * Converts a style object property name to its CSS property name equivalent,
 * taking into account the exception of `-ms` vendor prefixes
 * @param  {string} prop - Style object property name, e.g. `WebkitTransition`
 * @return {string}      - CSS property name, e.g. `-webkit-transition`
 */
function toCSSProp(prop) {
  var dashed = prop.replace(regex, '-$&').toLowerCase();
  return dashed[0] === 'm' && dashed[1] === 's' ? '-' + dashed : dashed;
}

module.exports = toCSSProp;
