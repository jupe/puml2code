const debug = require('debug')('puml2code');

const nullLogger = new Proxy({}, {
  get: (m, level) => (line) => { // eslint-disable-line no-unused-vars
    debug(`[${level}] ${line}`);
  },
});

module.exports = nullLogger;
