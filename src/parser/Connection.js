
class Connection {
  constructor(leftObject, connector, rightObject) {
    this.leftObject = leftObject;
    this.connector = connector;
    this.pNamespace = null;
    this.rightObject = rightObject;
  }

  setNamespace(namespace) {
    this.pNamespace = namespace;
  }

  getConnector() {
    return this.connector;
  }

  getNamespace() {
    return this.pNamespace;
  }
}

module.exports = Connection;
