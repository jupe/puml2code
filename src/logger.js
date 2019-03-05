const nullLogger = new Proxy({}, {
  get: () => (line) => { // eslint-disable-line no-unused-vars
    // console.log(line); // eslint-disable-line console-print
  },
});

module.exports = nullLogger;
