const Field = require('./Field');
const Method = require('./Method');

class Class {
  constructor(className, members, note) {
    this.cExtends = null;
    this.members = members || [];
    this.className = className;
    this.sNote = note;
    this.nNamespace = null;
  }

  getNativeModules() { // eslint-disable-line class-methods-use-this
    return [];
  }

  get3rdPartyModules() { // eslint-disable-line class-methods-use-this
    const types = this.members
        .map(member => member.getReturnType())
        .filter(type => ['void', 'async'].indexOf(type)===-1);
    return types;
  }

  getAppModules() { // eslint-disable-line class-methods-use-this
    return [];
  }

  getNote() {
    return this.sNote;
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
    for (let i = 0, { length } = this.members; i < length; i += 1) {
      if (this.members[i] instanceof Method) {
        return true;
      }
    }
    return false;
  }

  /**
   *
   * @returns {T[]}
   * @private
   */
  getMethods() {
    const aResult = this.members.filter(file => file instanceof Method);
    return aResult;
  }

  hasFields() {
    const hasFields = !this.members.find(file => (!(file instanceof Method) && (file instanceof Field)));
    return hasFields;
  }

  getFields() {
    const aResult = [];
    for (let i = 0, { length } = this.members; i < length; i += 1) {
      if (!(this.members[i] instanceof Method) && this.members[i] instanceof Field) {
        aResult.push(this.members[i]);
      }
    }
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
