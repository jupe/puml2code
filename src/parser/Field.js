class Field {
  constructor(accessType, returnType, fieldName, note) {
    this.sAccessType = accessType;
    this.sReturnType = returnType;
    this.sFieldName = fieldName;
    this.sNote = note;
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

  getNote() {
    return this.sNote;
  }

  isNotConstructor() {
    return ['constructor', '__init__'].indexOf(this.getName()) === -1;
  }

  getParameters() { // eslint-disable-line class-methods-use-this
    return [];
  }
}
module.exports = Field;
