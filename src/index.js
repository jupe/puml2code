const {createInterface} = require('readline');
const {createReadStream} = require('fs');
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

    /**
     *
     * @param cls
     * @returns {string}
     * @private
     */
    _toCode(cls) {
         let str = '';
         const deps = _.reduce(cls.methods, (acc, cls, name) => {
            const tmp = _.reduce(cls.parameters, (cAcc, param) => {
                if(param[0] === param[0].toUpperCase()) {
                    cAcc[param] = true;
                }
                return cAcc;
            }, {});
            return _.merge(acc, tmp);
        }, {});
        str += '// native modules\n'
        str += '// 3rd party modules\n'
        str += '// application modules\n'
        _.each(deps, (__, dep) => {
            str += `const ${dep} = require('./${dep}');\n`;
        });
        str += `\n\n/**\n * Class ${cls.name}\n */\n`;


        str += `class ${cls.name} {\n`;
        if (_.keys(cls.variables).length > 0 || _.has(cls.methods, 'constructor')) {

            str += '    /**\n';
            str += '     * TBD\n';
            str += '     */\n';
            str += '    constructor(';
            let ctrParameters = [];
            if (cls.methods.constructor) {
                ctrParameters= cls.methods.constructor.parameters || [];
                str += _.map(ctrParameters, _.toLower).join(', ');
            }
            str += ') {\n';

            _.each(cls.variables, (variable, name) => {
                const _name = camelCase(name);
                const privacy = variable.privacy;
                const value = ctrParameters.indexOf(_name) >= 0 ? _name : 'undefined';
                str += `        this.${privacy}${_name} = ${value};\n`;
            });
            str += `    }\n\n`;
        }
        _.each(cls.methods, (method, name) => {
            if (name === 'constructor') return;
            str += '    /**\n'
            _.each(method.parameters, (param) => {
                str += `     * @param ${param} TBD\n`;
            });
            if (method.type) {
                str += `     * @return ${method.type} TBD\n`
            }
            const parameters = _.map(method.parameters, _.toLower).join(', ');
            str += '     */\n';
            str += `    ${method.privacy}${name}(${parameters}) {\n`;
            str += `        // TBD\n`;
            str += `    }\n\n`;
        });
        str += '}\n';
        return str;
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
             const privacy = privacyMap[privacyKey];
             this.logger.debug(`[${this._currentClass.name}].method:`, privacy, asyncronous, type, name, parameters);
             this._currentClass.methods[name] = {
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
                 type,
                 privacy
             };
             return;
         }
    }
}

module.exports = PlantUmlCodeGenerator;