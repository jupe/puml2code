const {createInterface} = require('readline');
const {createReadStream, readFileSync} = require('fs');
// 3rd party modules
const Handlebars = require('handlebars');
const _ = require('lodash');
const camelCase = require('camelcase');


const dummyLogger = {debug: console.log, silly: console.log};


class Output {
    constructor(files, {logger}) {
        this.logger= logger;
        this._files = files;
    }
    print() {
        _.each(this._files, (content, file) => {
           this.logger.debug(`${file}:`);
           this.logger.debug(`${content}\n\n`);
        });
    }
    save(path) {

    }

}

class PlantUmlCodeGenerator {
    constructor(stream, {logger=dummyLogger}={}) {
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
        const Readable = require('stream').Readable;
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
        return new Output(this._toSourceFiles(), {logger: this.logger});
    }
    _toSourceFiles() {
        const files = {};
        _.each(this._classes, (cls) => {
           const filename = camelCase(cls.name, {pascalCase: true});
           files[`${filename}.js`] = this._toCode(cls);
        });
        return files;
    }

    _readTemplates() {
        const source = readFileSync('./src/templates/class.tmpl').toString();
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

         // generate getters
         _.each(cls.methods, (method) => {
             Object.defineProperty(method, "parametersCamelCase", {
                get() {
                   return _.map(method.parameters, opt => opt.camelCase);
                }
             });
             Object.defineProperty(method, "parametersCamelCaseJoined", {
                get() {
                   return _.map(method.parameters, param => param.camelCase)
                       .join(', ');
                }
             });
         });
         // figure out dependencies
         cls.imports =  _.reduce(cls.methods, (acc, cls, name) => {
                const tmp = _.reduce(cls.parameters, (cAcc, module) => {
                    if(module.name[0] === module.name[0].toUpperCase()) {
                        cAcc.push({module: module.name});
                    }
                    return cAcc;
                }, []);
                return _.merge(acc, tmp);
             }, []);
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
        let newState = this[this._state](line);
        if (newState) {
            this._setState(newState);
        }
    }
    _offHandler(line) {
        if (line.match(/@startuml/)) {
            return '_idleHandler';
        }
    }

    _idleHandler(line) {
        let m = line.match(/class ([\S]+)[\s]+?\{?/);
        if (m) {
            const className = m[1];
            this.logger.debug(`New class: ${className}`);
            this._classes[className] = {
                name: className,
                methods: {
                },
                variables: {
                }
            };
            this._currentClass = this._classes[className];
            return '_classHandler';
        }
        m = line.match(/title\s+([\S\s]+)/);
        if (m) {
            this._title = m[1];
        }
    }
    _classHandler(line) {
         let m = line.match(/^([\s]+)?\}/);
         if (m) {
             this._currentClass = undefined;
             return '_idleHandler';
         }

         const privacyMap = {
             '-': '_',
             '#': '__',
             '+': '',
             'async': 'async'
         };

         // detect class methods
         // +constructor(queue, resources)
         m = line.match(/([+#-])(async)?([\S]+(?=\s))?[\s]*([\S]+(?=\())\((.*)\)/);
         if (m) {
             let [,privacyKey, asyncronous, type, name, parameters] = m;
             parameters = parameters ? parameters.split(', ') : [];
             parameters = _.reduce(parameters, (acc, param) => {
                 acc.push({
                     name: param,
                     camelCase: camelCase(param)
                 });
                 return acc;
             }, []);
             const privacy = privacyMap[privacyKey];
             this.logger.debug(`[${this._currentClass.name}].method:`, privacy, asyncronous, type, name, parameters);
             this._currentClass.methods[name] = {
                 name,
                 isNotConstructor: name !== 'constructor',
                 privacy,
                 asyncronous,
                 parameters,
                 type
             };
             return;
         }
         // detect class variables
         // #Queue _queue
         m = line.match(/([+#-])?(([\S]+)([\s]+))?([\S]+)/);
         if (m) {
             const [,privacyKey,, type,, name] = m;
             const privacy = privacyMap[privacyKey];
             this.logger.debug(`[${this._currentClass.name}].var:`, privacy, type, name);
             this._currentClass.variables[name] = {
                 name,
                 type,
                 privacy
             };
             return;
         }
    }
}

module.exports = PlantUmlCodeGenerator;