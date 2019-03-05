## PlantUML code generator (puml2code)

Tool that convert Plantuml -text file that represent UML diagram to code.

### Project status
**HEAVILY IN PROGRESS**

- [ ] core implementation
- [ ] CLI interface
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

### Example
```
const PlantUmlToCode = require('puml2code');
const platnuml = PlantUmlToCode.fromFile('./file.puml');
platnuml.generate()
    .then((out) => out.print());
```
Output:
```
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