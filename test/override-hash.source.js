'use strict';

var styles = {
  foo: {
    fontWeight: 'bold'
  },
  bar: {
    color: 'blue',
    fontSize: '15px',
    backgroundColor: '#fff',
    transition: 'width 500ms ease',
    ':after': {
      color: 'green',
      content: "''"
    },
    '@media (max-width: 600px)': {
      color: 'orange'
    }
  }
};

module.exports = styles;
