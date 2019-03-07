const nullLogger = new Proxy({}, {
  get: (m, level) => (line) => { // eslint-disable-line no-unused-vars
    console.log(`[${level}] ${line}`); // eslint-disable-line no-console
  },
});

module.exports = nullLogger;
