[![CircleCI](https://circleci.com/gh/jupe/puml2code/tree/master.svg?style=svg)](https://circleci.com/gh/jupe/puml2code/tree/master)
[![JavaScript Style Guide](https://img.shields.io/badge/code_style-standard-brightgreen.svg)](https://standardjs.com)
[![License badge](https://img.shields.io/badge/license-MIT-blue.svg)](https://img.shields.io)


## PlantUML code generator (puml2code)

Tool that convert Plantuml -text file that represent class UML diagram to source code.

### Project status
**POC/IN PROGRESS**

- [x] core implementation
- [x] CLI interface
- [x] JS interface
- [x] ES6 output
- [ ] unit tests
- [ ] e2e tests
- [ ] documentation

### Installation

```
$ npm i -g puml2code
```

### Supported features
* output: file per class/console
* target language: es6 with code documentation
  * imports based on parameter
  * camelCase conversion
  * private variables (with underscore prefix)
  * methods with parameters

### Usage

```
$ Usage: cli [options]

Options:
  -V, --version       output the version number
  -i, --input [file]  input .puml file
  -l, --lang [lang]   select output code language (default: "es6")
  -o, --out [path]    Output path (default: "console")
  -h, --help          output usage information

```

e.g.
```
$ puml2code -i myfile.puml

Scheduler.js:
// native modules
// 3rd party modules
// application modules
const Queue = require('./Queue');
const Resources = require('./Resources');


/**
 * Class Scheduler
 */
class Scheduler {
    /**
     * TBD
     */
    constructor(queue, resources) {
        this._queue = query;
        this._resoures = resources;
    }

    /**
     * @param {Queue} queue TBD
     */
    _test(queue) {
        // TBD
    }

    /**
     * @param {Queue} queue TBD
     */
    __protected(queue) {
        // TBD
    }
}
```
[examples](examples/sample.js)

### LICENSE:
[MIT](LICENSE)