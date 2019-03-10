class Parameter {
  constructor(returnType, memberName, defaultValue) {
    this.sReturnType = returnType;
    this.sParameterName = memberName;
    this.sDefaultValue = defaultValue;
  }

  getDefaultValue() {
    return this.sDefaultValue;
  }

  getReturnType() {
    return this.sReturnType;
  }

  getName() {
    return this.sParameterName;
  }
}
module.exports = Parameter;
