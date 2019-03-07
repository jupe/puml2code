const Field = require('./Field');


class Method extends Field {
  constructor(accessType, returnType, fieldName, aParameters, aNotes) {
    super(accessType, returnType, fieldName, aNotes);
    this.aParameters = aParameters;
    this.sReturnType = returnType;
  }

  isPrivate() {
    return this.getAccessType() === '-';
  }

  isPublic() {
    return this.getAccessType() === '+';
  }

  getReturnType() {
    return this.sReturnType;
  }

  needsReturnStatement() {
    return ['void', 'async'].indexOf(this.sReturnType) === -1;
  }

  isNotConstructor() {
    return ['constructor', '__init__'].indexOf(this.getName()) === -1;
  }

  isAsync() {
    return this.sReturnType === 'async';
  }

  getParameters() {
    return this.aParameters;
  }
}

module.exports = Method;
