const Field = require('./Field');


class Method extends Field {
  constructor(accessType, returnType, fieldName, aParameters) {
    super(accessType, returnType, fieldName);
    this.aParameters = aParameters;
    this.sReturnType = returnType;
  }

  getReturnType() {
    return this.sReturnType;
  }

  needsReturnStatement() {
    return ['void', 'async'].indexOf(this.sReturnType) === -1;
  }

  isAsync() {
    return this.sReturnType === 'async';
  }

  isLambda() {
    return this.sFieldName.startsWith('*');
  }

  getParameters() {
    return this.aParameters;
  }
}

module.exports = Method;
