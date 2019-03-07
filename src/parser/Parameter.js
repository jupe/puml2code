class Parameter {
  constructor(returnType, memberName) {
    this.sReturnType = returnType;
    this.sParameterName = memberName;
  }

  getReturnType() {
    return this.sReturnType;
  }

  getName() {
    return this.sParameterName;
  }
}
module.exports = Parameter;
