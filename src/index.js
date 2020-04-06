const { Readable } = require('stream');
const { join } = require('path');
const { createReadStream, readFile } = require('fs');
// 3rd party modules
const Promise = require('bluebird');
const Handlebars = require('handlebars');
const _ = require('lodash');
// application modules
const parser = require('./parser');
const Output = require('./Output');
const dummyLogger = require('./logger');

const { SyntaxError } = parser;


class PlantUmlToCode {
  constructor(stream, { logger = dummyLogger } = {}) {
    this._stream = stream;
    this.logger = logger;
    PlantUmlToCode._registerHandlebarsHelpers();
  }

  static _registerHandlebarsHelpers() {
    // helper to avoid escape rendering
    // Usage
    // {{SafeString this getName}} where 'this' is an class instance and 'getName' are instance function
    // or
    // {{SafeString this}} where 'this' is an string
    const SafeString = (context, method) => new Handlebars.SafeString(
      _.isFunction(method) ? method.call(context) : context,
    );
    Handlebars.registerHelper('SafeString', SafeString);

    // Workaround for an apparent bug in Handlebars: functions are not called with the parent scope
    // as context.
    //
    // Here the getFullName is found in the parent scope (Class), but it is called with the current
    // scope (Field) as context:
    //
    // {{#each getFields}}
    //   {{../getFullName}}
    // {{/each}}
    //
    // The following helper works around it:
    //
    // {{#each getFields}}
    //   {{#call ../this ../getFullName}}
    // {{/each}}
    Handlebars.registerHelper('call', (context, member) => member.call(context));
  }

  static fromString(str) {
    if (!_.isString(str)) {
      throw new TypeError('str should be an String');
    }
    const stream = new Readable();
    stream._read = () => {}; // redundant? see update below
    stream.push(str);
    stream.push(null);
    return new PlantUmlToCode(stream);
  }

  static fromFile(file) {
    return new PlantUmlToCode(createReadStream(file));
  }

  static async _readStream(stream) {
    const chunks = [];
    return new Promise((resolve, reject) => {
      stream.on('data', chunk => chunks.push(chunk));
      stream.on('error', reject);
      stream.on('end', () => resolve(Buffer.concat(chunks).toString('utf8')));
    });
  }

  async generate(lang = 'ecmascript6') {
    this.logger.silly('Reading puml data');
    try {
      const str = await PlantUmlToCode._readStream(this._stream);
      const files = await this._toCode(str, lang);
      return new Output(files, { logger: this.logger });
    } catch (error) {
      if (error instanceof SyntaxError) {
        const str = `line: ${error.location.start.line} column: ${error.location.start.column}: ${error}`;
        this.logger.error(str);
        throw new Error(str);
      }
      this.logger.error(error);
      throw error;
    }
  }

  static get templateFiles() {
    return _.reduce(PlantUmlToCode.languages, (acc, lang) => {
      acc[lang] = join(__dirname, 'templates', `${lang}.hbs`);
      return acc;
    }, {});
  }

  async _readTemplate(lang) {
    const tmpl = PlantUmlToCode.templateFiles[lang];
    this.logger.silly(`Read template: ${tmpl}`);
    let source = await Promise.fromCallback(cb => readFile(tmpl, cb));
    source = source.toString();
    return Handlebars.compile(source, { noEscape: true });
  }

  static get languages() {
    return _.keys(PlantUmlToCode.extensions);
  }

  static get extensions() {
    return {
      coffeescript: 'coffee',
      csharp: 'cs',
      ecmascript5: 'js',
      ecmascript6: 'js',
      java: 'java',
      php: 'php',
      python: 'py',
      ruby: 'rb',
      typescript: 'ts',
      cpp: 'h',
    };
  }

  static getExtension(lang) {
    return _.get(PlantUmlToCode.extensions, lang, 'js');
  }

  /**
   * @param {string} pegjs rules
   * @param {string} lang Target language
   * @returns {string} class code as a string
   * @private
   */
  async _toCode(data, lang) {
    const template = await this._readTemplate(lang);
    const aUMLBlocks = await parser(data);
    const files = {};
    const extension = PlantUmlToCode.getExtension(lang);
    aUMLBlocks.forEach((project) => {
      project.getClasses().forEach((element) => {
        files[`${element.getFullName()}.${extension}`] = template(element);
      });
    });
    return files;
  }
}

module.exports = PlantUmlToCode;
