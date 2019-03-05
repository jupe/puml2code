const nullLogger = new Proxy({}, {get: () => (line) => {
    // console.log(line); // eslint-disable-line console-print
}});

module.exports = nullLogger;