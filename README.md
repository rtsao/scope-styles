# scope-styles

[![build status][build-badge]][build-href]
[![coverage status][coverage-badge]][coverage-href]
[![dependencies status][deps-badge]][deps-href]
[![code climate gpa][code-climate-badge]][code-climate-href]

`scope-styles` is a utility that converts inline style objects into scoped css, which can be either embedded into the page or extracted into an external css bundle. Works with [Radium](https://github.com/FormidableLabs/radium)-compatibile inline style objects. Pairs well with [inline-style-prefixer](https://github.com/rofrischmann/inline-style-prefixer).

# usage

**styles.js**
```javascript
module.exports = styles;

var styles = {
  foo: {
    fontWeight: 'bold',
    fontSize: '15px'
  },
  bar: {
    color: 'red',
    backgroundColor: '#ccc',
    transition: 'all 500ms ease',
    ':hover': {
      color: 'green'
    },
    '@media (max-width: 600px)': {
      color: 'blue'
    }
  }
};
```

**component.js**
```javascript
var scopeStyles = require('scope-styles');
var insertCss = require('insert-css');

var styles = require('./styles');
var scoped = scopeStyles(styles);

// create elements
var div1 = document.createElement('div');
div1.className = scoped.foo;
var div2 = document.createElement('div');
div2.className = scoped.bar;

// inject scoped css into page
var css = scopeStyles.getCss(scoped);
insertCss(css);

// render
document.body.appendChild(div1);
document.body.appendChild(div2);

```

**rendered output**
```html
<html>
  <head>
    <style>
      .foo_1ctUW {
        font-weight: bold;
        font-size: 15px
      }
      .bar_1ctUW {
        color: red;
        background-color: #ccc;
        transition: all 500ms ease
      }
      .bar_1ctUW:hover {
        color: green
      }
      @media (max-width: 600px) {
      .bar_1ctUW {
        color: blue
      }
      }
    </style>
  </head>
  <body>
    <div class="foo_1ctUW"></div>
    <div class="bar_1ctUW"></div>
  </body>
</html>
```

### see also
* https://github.com/rtsao/scope-styles-inject
* https://github.com/rtsao/scope-styles-injectify
* https://github.com/rtsao/scope-styles-extractify


[build-badge]: https://travis-ci.org/rtsao/scope-styles.svg?branch=master
[build-href]: https://travis-ci.org/rtsao/scope-styles
[coverage-badge]: https://coveralls.io/repos/rtsao/scope-styles/badge.svg?branch=master&service=github
[coverage-href]: https://coveralls.io/github/rtsao/scope-styles?branch=master
[deps-badge]: https://david-dm.org/rtsao/scope-styles.svg
[deps-href]: https://david-dm.org/rtsao/scope-styles
[code-climate-badge]: https://codeclimate.com/github/rtsao/scope-styles/badges/gpa.svg
[code-climate-href]: https://codeclimate.com/github/rtsao/scope-styles
