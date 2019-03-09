const Namespace = require('./Namespace');
const Class = require('./Class');
const AbstractClass = require('./AbstractClass');
const InterfaceClass = require('./InterfaceClass');
const Connection = require('./Connection');
const Package = require('./Package');
const Extension = require('./Extension');

class UMLBlock {
  constructor(fileLines) {
    this.aNamespaces = []; // contains all defined namespaces
    this.aPackages = []; // contains all defined packages
    this.aClasses = []; // contains all defined classes
    this.aConnections = []; // contains all defined connections

    this.aItems = fileLines;

    this.populateGlobals(this);
    this.setupConnections();
  }

  getClasses() {
    return this.aClasses;
  }

  getItems() {
    return this.aItems;
  }

  setupConnections() {
    for (let i = 0, { length } = this.aConnections; i < length; i += 1) {
      this.setupConnection(this.aConnections[i]);
    }
  }

  setupConnection(connection) {
    let cLeft = null;
    let cRight = null;
    for (let i = 0, { length } = this.aClasses; i < length; i += 1) {
      if (connection.leftObject.indexOf('.') !== -1) {
        if (connection.leftObject.indexOf('.') === 0) {
          if (this.aClasses[i].getNamespace() === null
              && this.aClasses[i].getName() === connection.leftObject.substring(1)) {
            cLeft = this.aClasses[i];
          }
        } else if (this.aClasses[i].getFullName() === connection.leftObject) {
          cLeft = this.aClasses[i];
        }
      } else if (this.aClasses[i].getName() === connection.leftObject
          && this.aClasses[i].getNamespace() === connection.getNamespace()) {
        cLeft = this.aClasses[i];
      }

      if (connection.rightObject.indexOf('.') !== -1) {
        if (connection.rightObject.indexOf('.') === 0) {
          if (this.aClasses[i].getNamespace() === null
              && this.aClasses[i].getName() === connection.rightObject.substring(1)) {
            cRight = this.aClasses[i];
          }
        } else if (this.aClasses[i].getFullName() === connection.rightObject) {
          cRight = this.aClasses[i];
        }
      } else if (this.aClasses[i].getName() === connection.rightObject
          && this.aClasses[i].getNamespace() === connection.getNamespace()) {
        cRight = this.aClasses[i];
      }
    }

    if (cLeft !== null && cRight !== null) {
      if (connection.getConnector() instanceof Extension) {
        if (connection.getConnector().isLeft()) {
          cRight.setExtends(cLeft);
        } else {
          cLeft.setExtends(cRight);
        }
      }
    }
  }

  populateGlobals(item) {
    const items = item.getItems();

    for (let i = 0, { length } = items; i < length; i += 1) {
      if (items[i] instanceof Namespace) {
        this.aNamespaces.push(items[i]);
        this.populateGlobals(items[i]);
      } else if (items[i] instanceof Class || items[i] instanceof AbstractClass || items[i] instanceof InterfaceClass) {
        this.aClasses.push(items[i]);
      } else if (items[i] instanceof Package) {
        this.aPackages.push(items[i]);
        this.populateGlobals(items[i]);
      } else if (items[i] instanceof Connection) {
        this.aConnections.push(items[i]);
      } else {
        throw new Error('Unknown type');
      }
    }
  }
}
module.exports = UMLBlock;
