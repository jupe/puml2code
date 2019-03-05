const { join } = require('path');
const { createInterface } = require('readline');
const { createReadStream, readFileSync, writeFile } = require('fs');
// 3rd party modules
const Promise = require('bluebird');
const Handlebars = require('handlebars');
const _ = require('lodash');
const camelCase = require('camelcase');


const dummyLogger = { debug: console.log, silly: console.log };


class Output {
  constructor(files, { logger }) {
    this.logger = logger;
    this._files = files;
  }

  print() {
    _.each(this._files, (content, file) => {
      this.logger.debug(`${file}:`);
      this.logger.debug(`${content}\n\n`);
    });
  }

  async save(path) {
    const pendings = _.map(this._files, (content, file) => Promise.fromCallback(cb => writeFile(join(path, file), content, cb)));
    return Promise.all(pendings);
  }
}

class PlantUmlCodeGenerator {
  constructor(stream, { logger = dummyLogger } = {}) {
    this._classes = {};
    this._currentClass;
    this._state = '_offHandler';
    this._title = '';
    this.input(stream);
    this.logger = logger;
  }

  input(stream) {
    this._stream = stream;
  }

  static fromString(str) {
    const { Readable } = require('stream');
    const stream = new Readable();
    stream._read = () => {}; // redundant? see update below
    stream.push(str);
    stream.push(null);
    return new PlantUmlCodeGenerator(stream);
  }

  static fromFile(file) {
    return new PlantUmlCodeGenerator(createReadStream(file));
  }

  async generate() {
    this.logger.silly('Create interface');
    const lineReader = createInterface(this._stream);
    this.logger.silly('Read lines');
    await this._readLines(lineReader);
    this.logger.silly('Ready');
    this.logger.debug(this._classes);
    this.logger.debug('\n');
    return new Output(this._toSourceFiles(), { logger: this.logger });
  }

  _toSourceFiles() {
    const files = {};
    _.each(this._classes, (cls) => {
      const filename = camelCase(cls.name, { pascalCase: true });
      files[`${filename}.js`] = this._toCode(cls);
    });
    return files;
  }

  _readTemplates() {
    const tmpl = './src/templates/class.tmpl';
    this.logger.silly(`Read template: ${tmpl}`);
    const source = readFileSync(tmpl).toString();
    return Handlebars.compile(source);
  }

  /**
     *
     * @param cls
     * @returns {string}
     * @private
     */
  _toCode(cls) {
    const template = this._readTemplates();

    Handlebars.registerHelper('raw', options => options.fn());

    // generate getters
    _.each(cls.methods, (method) => {
      Object.defineProperty(method, 'parametersCamelCase', {
        get() {
          return _.map(method.parameters, opt => opt.camelCase);
        },
      });
      Object.defineProperty(method, 'parametersCamelCaseJoined', {
        get() {
          return _.map(method.parameters, param => param.camelCase)
            .join(', ');
        },
      });
    });
    // figure out dependencies
    cls.imports = _.reduce(cls.methods, (acc, cls) => {
      const tmp = _.reduce(cls.parameters, (cAcc, module) => {
        if (module.name[0] === module.name[0].toUpperCase()) {
          cAcc.push({ module: module.name });
        }
        return cAcc;
      }, []);
      return _.merge(acc, tmp);
    }, []);

    // Render class template with content
    return template(cls);
  }

  _setState(state) {
    this._state = state;
    this.logger.debug(`New state: ${state}`);
  }

  async _readLines(lineReader) {
    lineReader.on('line', this._onLine.bind(this));
    return new Promise(resolve => lineReader.on('close', resolve));
  }

  _onLine(line) {
    this.logger.debug(`LINE: ${line}`);
    const newState = this[this._state](line);
    if (newState) {
      this._setState(newState);
    }
  }

  _offHandler(line) {
    if (line.match(/@startuml/)) {
      this.logger.silly('end of startuml');
      return '_idleHandler';
    }
    return undefined;
  }

  _idleHandler(line) {
    let m = line.match(/class ([\S]+)[\s]+?\{?/);
    if (m) {
      const className = m[1];
      this.logger.debug(`New class: ${className}`);
      this._addClass(className);
      return '_classHandler';
    }
    m = line.match(/title\s+([\S\s]+)/);
    if (m) {
      return this._setTitle(m[1]);
    }
    return undefined;
  }

  _classHandler(line) {
    let m = line.match(/^([\s]+)?}/);
    if (m) {
      return this._outOfClass();
    }

    // detect class methods
    // +constructor(queue, resources)
    m = line.match(/([+#-])(async)?([\S]+(?=\s))?[\s]*([\S]+(?=\())\((.*)\)/);
    if (m) {
      const [, privacyKey, asyncronous, type, name, paramStr] = m;
      const parameters = PlantUmlCodeGenerator._parseParameters(paramStr);
      const privacy = PlantUmlCodeGenerator.PrivacyMap[privacyKey];
      this.logger.debug(`[${this._currentClass.name}].method:`, privacy, asyncronous, type, name, parameters);
      return this._addMethod(name, privacy, asyncronous, parameters, type);
    }
    // detect class variables
    // #Queue _queue
    m = line.match(/([+#-])?(([\S]+)([\s]+))?([\S]+)/);
    if (m) {
      const [, privacyKey,, type,, name, notes] = m;
      const privacy = PlantUmlCodeGenerator.PrivacyMap[privacyKey];
      this.logger.debug(`[${this._currentClass.name}].var:`, privacy, type, name);
      return this._addVariable(name, type, privacy, notes);
    }
    return undefined;
  }

  // Helpers

  _setTitle(title) {
    this._title = title;
  }

  static get PrivacyMap() {
    return {
      '-': '_',
      '#': '__',
      '+': '',
    };
  }

  static _parseParameters(str) {
    const parameters = str ? str.split(', ') : [];
    return _.reduce(parameters, (acc, param) => {
      acc.push({
        name: param,
        get camelCase() { return camelCase(param); },
        get notes() { return 'TBD'; },
      });
      return acc;
    }, []);
  }

  _addClass(className) {
    this._classes[className] = {
      name: className,
      methods: {},
      variables: {},
    };
    this._currentClass = this._classes[className];
  }

  _outOfClass() {
    this._currentClass = undefined;
    return '_idleHandler';
  }

  _addMethod(name, privacy, asyncronous, parameters, type, notes) {
    this._currentClass.methods[name] = {
      name,
      isNotConstructor: name !== 'constructor',
      privacy,
      asyncronous,
      parameters,
      type,
      notes,
    };
  }

  _addVariable(name, type, privacy, notes) {
    this._currentClass.variables[name] = {
      name,
      type,
      privacy,
      notes,
    };
  }
}

module.exports = PlantUmlCodeGenerator;
