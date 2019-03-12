
const Class = require('./Class');
const AbstractClass = require('./AbstractClass');
const InterfaceClass = require('./InterfaceClass');
const Connection = require('./Connection');

class Namespace {
  constructor(namespaceName, fileLines) {
    this.namespaceName = namespaceName;
    this.aItems = fileLines;
    this.nNamespace = null;
    this.init();
  }

  getName() {
    return this.namespaceName;
  }

  getItems() {
    return this.aItems;
  }

  setNamespace(namespace) {
    this.nNamespace = namespace;
  }

  getNamespace() {
    return this.nNamespace;
  }

  getFullName() {
    const aFull = [this.getName()];
    let nSpace = this.getNamespace();
    while (nSpace !== null) {
      aFull.unshift(nSpace.getName());
      nSpace = nSpace.getNamespace();
    }
    return aFull.join('.');
  }

  init() {
    for (let i = 0, { length } = this.aItems; i < length; i += 1) {
      if (this.aItems[i] instanceof Namespace) {
        this.aItems[i].setNamespace(this);
      } else if (this.aItems[i] instanceof Class || this.aItems[i] instanceof AbstractClass
          || this.aItems[i] instanceof InterfaceClass) {
        this.aItems[i].setNamespace(this);
      } else if (this.aItems[i] instanceof Connection) {
        this.aItems[i].setNamespace(this);
      }
    }
  }
}
module.exports = Namespace;
