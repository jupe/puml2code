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
* [CoffeeScript](test/data/coffeescript.coffee) (coffeescript)
* [C#](test/data/csharp.cs) (csharp)
* [ECMAScript5](test/data/ecmascript5.js) (javascript)
* [ECMAScript6](test/data/ecmascript6.js) (javascript2.0) [default]
* [Java](test/data/java.java) (java)
* [PHP](test/data/php.php) (php)
* [Ruby](test/data/ruby.rb) (ruby)
* [TypeScript](test/data/typescript.ts) (typescript)

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
See more output examples [here](examples)

### LICENSE:
[MIT](LICENSE)