const { Readable } = require('stream');
const { createInterface } = require('readline');
const { createReadStream, readFileSync } = require('fs');
// 3rd party modules
const Promise = require('bluebird');
const Handlebars = require('handlebars');
const _ = require('lodash');
const camelCase = require('camelcase');
// application modules
const Output = require('./Output');
const dummyLogger = require('./logger');


class PlantUmlToCode {
  constructor(stream, { logger = dummyLogger } = {}) {
    this._classes = {};
    this._currentClass = undefined;
    this._state = '_offHandler';
    this._title = '';
    this.input(stream);
    this.logger = logger;
  }

  get title() {
    return this._title;
  }

  input(stream) {
    this._stream = stream;
  }

  static fromString(str) {
    const stream = new Readable();
    stream._read = () => {}; // redundant? see update below
    stream.push(str);
    stream.push(null);
    return new PlantUmlToCode(stream);
  }

  static fromFile(file) {
    return new PlantUmlToCode(createReadStream(file));
  }

  async generate(lang) {
    this.logger.silly('Create interface');
    const lineReader = createInterface(this._stream);
    this.logger.silly('Read lines');
    await this._readLines(lineReader);
    this.logger.silly('Ready');
    this.logger.debug(this._classes);
    this.logger.debug('\n');
    return new Output(this._toSourceFiles(lang), { logger: this.logger });
  }

  _toSourceFiles(lang) {
    const files = {};
    _.each(this._classes, (cls) => {
      const filename = camelCase(cls.name, { pascalCase: true });
      files[`${filename}.js`] = this._toCode(cls, lang);
    });
    return files;
  }

  _readTemplates(lang) {
    const tmpl = `./src/templates/${lang}.tmpl`;
    this.logger.silly(`Read template: ${tmpl}`);
    const source = readFileSync(tmpl).toString();
    return Handlebars.compile(source);
  }

  /**
   *
   * @param {Object} cls class object
   * @param {string} lang Target language
   * @returns {string} class code as a string
   * @private
   */
  _toCode(cls, lang) {
    try {
      const template = this._readTemplates(lang);
      return this._toClassCode(cls, template);
    } catch(error)  {
      throw new Error(`Language ${lang} is not supported`);
    }
  }
  _toClassCode(cls, template) {
    this.logger.debug('Generate ES6 code');
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
    _.set(cls, 'imports', _.reduce(cls.methods, (acc, method) => {
      const tmp = _.reduce(method.parameters, (cAcc, module) => {
        if (module.name[0] === module.name[0].toUpperCase()) {
          cAcc.push({ module: module.name });
        }
        return cAcc;
      }, []);
      return _.merge(acc, tmp);
    }, []));

    // Render class template with content
    return template(cls);
  }

  _setState(state) {
    this._state = state;
    this.logger.debug(`New state: ${state}`);
  }

  async _readLines(lineReader) {
    lineReader.on('line', this._onLine.bind(this));
    let resolve = () => {};
    const pending = new Promise((_resolve) => {
      resolve = _resolve;
    });
    process.once('SIGINT', resolve);
    process.once('SIGTERM', resolve);
    lineReader.on('close', resolve);
    return pending;
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
      const parameters = PlantUmlToCode._parseParameters(paramStr);
      const privacy = PlantUmlToCode.PrivacyMap[privacyKey];
      this.logger.debug(`[${this._currentClass.name}].method:`, privacy, asyncronous, type, name, parameters);
      return this._addMethod(name, privacy, asyncronous, parameters, type);
    }
    // detect class variables
    // #Queue _queue
    m = line.match(/([+#-])?(([\S]+)([\s]+))?([\S]+)/);
    if (m) {
      const [, privacyKey,, type,, name, notes] = m;
      const privacy = PlantUmlToCode.PrivacyMap[privacyKey];
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

module.exports = PlantUmlToCode;
