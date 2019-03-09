const Class = require('./Class');

class InterfaceClass extends Class {
  constructor(...args) {
    super(...args);
    this.members.forEach((member) => {
      member.setInterface();
    });
  }

  isInterface() { // eslint-disable-line class-methods-use-this
    return true;
  }
}
module.exports = InterfaceClass;
