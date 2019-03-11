[![npm version](https://badge.fury.io/js/puml2code.svg)](https://badge.fury.io/js/puml2code)
[![CircleCI](https://circleci.com/gh/jupe/puml2code/tree/master.svg?style=svg)](https://circleci.com/gh/jupe/puml2code/tree/master)
[![JavaScript Style Guide](https://img.shields.io/badge/code_style-standard-brightgreen.svg)](https://standardjs.com)
[![License badge](https://img.shields.io/badge/license-MIT-blue.svg)](https://img.shields.io) [![Greenkeeper badge](https://badges.greenkeeper.io/jupe/puml2code.svg)](https://greenkeeper.io/)


## PlantUML code generator (puml2code)

a command line utility that convert Plantuml -text file that represent class UML diagram to source code.
puml parser based on [plantuml-code-generator](https://github.com/bafolts/plantuml-code-generator) but is rewritten with es6.

### Installation

```
$ npm i -g puml2code
```

### Supported output languages
* [CoffeeScript](test/data/car.coffeescript.coffee) (coffeescript)
* [C#](test/data/car.csharp.cs) (csharp)
* [ECMAScript5](test/data/car.ecmascript5.js) (javascript)
* [ECMAScript6](test/data/car.ecmascript6.js) (javascript2.0) [default]
* [Java](test/data/car.java.java) (java)
* [PHP](test/data/car.php.php) (php)
* [Ruby](test/data/car.ruby.rb) (ruby)
* [TypeScript](test/data/car.typescript.ts) (typescript)

### Supported features
* output: file per class/console
* es6 extended with:
  * code documentation
  * imports based on parameter
  * methods with parameters
* template engine: [handlebars](http://handlebarsjs.com)
* puml parser engine: [pegjs](http://pegjs.org)

### Usage

```
$ puml2code -h
Usage: puml2code [options]

Options:
  -V, --version       output the version number
  -i, --input [file]  input .puml file, or "stdin"
  -l, --lang [lang]   Optional output source code language (default: "ecmascript6")
  -o, --out [path]    Output path. When not given output is printed to console.
  -h, --help          output usage information

Supported languages: coffeescript, csharp, ecmascript5, ecmascript6, java, php, python, ruby, typescript

Examples:
  $ puml2code -i input.puml -l ecmascript6
  $ puml2code -h
Use DEBUG=puml2code env variable to get traces. Example:
  $ DEBUG=puml2code puml2code -i input.puml
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
See more output examples [here](examples)


### LICENSE:
[MIT](LICENSE)
