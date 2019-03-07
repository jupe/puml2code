const Class = require('./Class');

class AbstractClass extends Class {
  isAbstract() { // eslint-disable-line class-methods-use-this
    return true;
  }
}
module.exports = AbstractClass;
