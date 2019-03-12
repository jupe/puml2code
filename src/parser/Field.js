class Field {
  constructor(accessType, returnType, fieldName, abstract) {
    this.sAccessType = accessType;
    this.sReturnType = returnType;
    this.sFieldName = fieldName;
    this.bInterface = false;
    this.bAbstract = !!abstract;
    this.isConstructor = undefined;
  }

  isPrivate() {
    return this.getAccessType() === '-';
  }

  isProtected() {
    return this.getAccessType() === '#';
  }

  isPublic() {
    return this.getAccessType() === '+';
  }

  setIsConstructor(isConstructor) {
    this.isConstructor = isConstructor;
  }

  isNotConstructor() {
    return !this.isConstructor(this.getName());
  }

  setInterface() {
    this.bInterface = true;
  }

  isAbstract() {
    return this.bAbstract;
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

  getParameters() { // eslint-disable-line class-methods-use-this
    return [];
  }
}
module.exports = Field;
