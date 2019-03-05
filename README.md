## PlantUML code generator (puml2code)

Tool that convert Plantuml -text file that represent UML diagram to code.

### Project status
**POC/IN PROGRESS**

- [ ] core implementation
- [x] CLI interface
- [x] JS interface
- [ ] unit tests
- [ ] e2e tests
- [ ] documentation

### Supported features
* output: file/console per class
* ES6 class
* imports based on parameter
* camelCase conversion
* private variables (with underscore prefix)
* methods with parameters
* code documentation

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