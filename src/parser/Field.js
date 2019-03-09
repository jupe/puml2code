class Field {
  constructor(accessType, returnType, fieldName) {
    this.sAccessType = accessType;
    this.sReturnType = returnType;
    this.sFieldName = fieldName;
    this.bInterface = false;
  }

  setInterface() {
    this.bInterface = true;
  }

  isInterface() {
    return this.bInterface;
  }

  getAccessType() {
    return this.sAccessType;
  }

  getReturnType() {
    return this.sReturnType;
  }

  getName() {
    return this.sFieldName;
  }

  isNotConstructor() {
    return ['constructor', '__init__'].indexOf(this.getName()) === -1;
  }

  getParameters() { // eslint-disable-line class-methods-use-this
    return [];
  }
}
module.exports = Field;
