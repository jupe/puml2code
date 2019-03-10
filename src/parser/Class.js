const _ = require('lodash');
const Field = require('./Field');
const Method = require('./Method');

class Class {
  constructor(className, members) {
    this.cExtends = null;
    this.members = members || [];
    this.className = className;
    this.nNamespace = null;
  }

  static splitArrays(acc, dep) {
    // List<Value> -> [List, Value]
    const parts = dep.split('<');
    parts.forEach((part) => {
      acc.push(_.trimEnd(part, '>'));
    });
    return acc;
  }

  _getDependencies() {
    const returnTypes = this.members.map(member => member.getReturnType());
    const parameterTypes = this.members
      .reduce((acc, member) => [...acc, ...member.getParameters()], [])
      .map(params => params.getReturnType());
    const ignoreModules = ['void', 'async'];
    const all = [...returnTypes, ...parameterTypes]
      .reduce(Class.splitArrays, [])
      .filter(type => ignoreModules.indexOf(type) === -1);

    return _.uniq(all);
  }

  static get langNativeModules() {
    return {
      ecmascript6: ['EventEmitter'],
    };
  }

  getNativeModules() {
    // how to select language specific native modules..
    const nativeModules = Class.langNativeModules.ecmascript6;
    const allDeps = this._getDependencies();
    const isValid = dep => nativeModules.indexOf(dep) !== -1;
    return _.uniq(_.filter(allDeps, isValid));
  }

  get3rdPartyModules() {
    // figure out 3rd party dependencies
    const native = this.getNativeModules();
    const allDeps = this._getDependencies();
    const isValid = dep => native.indexOf(dep) === -1;
    return _.filter(allDeps, isValid);
  }

  getAppModules() {
    const native = this.getNativeModules();
    const extDep = this.get3rdPartyModules();
    const exluded = [...native, ...extDep];
    return _.without(this._getDependencies(), ...exluded);
  }

  setExtends(className) {
    this.cExtends = className;
  }

  getExtends() {
    return this.cExtends;
  }

  setNamespace(namespace) {
    this.nNamespace = namespace;
  }

  getNamespace() {
    return this.nNamespace;
  }

  isAbstract() { // eslint-disable-line class-methods-use-this
    return false;
  }

  isInterface() { // eslint-disable-line class-methods-use-this
    return false;
  }

  getName() {
    return this.className;
  }

  getConstructorArgs() {
    const methods = this.getMethods();
    const cs = methods.find(method => method.getName() === 'constructor');
    if (cs) {
      return cs.getParameters();
    }
    return [];
  }

  hasMethods() {
    return !!this.getMethods().length;
  }

  /**
   * get methods
   * @returns {[Method>]} list of Method's
   * @private
   */
  getMethods() {
    const aResult = this.members.filter(file => file instanceof Method);
    return aResult;
  }

  hasFields() {
    return !!this.getFields().length;
  }

  getFields() {
    const aResult = this.members.filter(file => (!(file instanceof Method) && (file instanceof Field)));
    return aResult;
  }

  getFullName() {
    if (this.getNamespace() !== null) {
      return `${this.getNamespace().getFullName()}.${this.getName()}`;
    }
    return this.getName();
  }
}
module.exports = Class;
