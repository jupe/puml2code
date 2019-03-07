// 3rd party modules
const String = require('String');
const Number = require('Number');

/**
 * Class Car
 */
class Car {
  /**
   * Constructor for Car
   */
  constructor() {
    this.model = undefined;
    this.make = undefined;
    this.year = undefined;
  }

  /**
   * @param { String } model TBD
   */
  setModel(model) {
    // TBD
  }

  /**
   * @param { String } make TBD
   */
  setMake(make) {
    // TBD
  }

  /**
   * @param { Number }  TBD
   */
  setYear(param0) {
    // TBD
  }

  /**
   */
  getModel() {
    return String;
  }

  /**
   */
  getMake() {
    return String;
  }

  /**
   */
  getYear() {
    return Number;
  }
}

module.exports = Car;

// 3rd party modules
const String = require('String');
const String1 = require('String1');
const String_2 = require('String_2');
const String2 = require('String2');

/**
 * Class NamesInThings
 */
class NamesInThings {
  /**
   * Constructor for NamesInThings
   */
  constructor() {
    this.field = undefined;
    this.field1 = undefined;
    this._some_private = undefined;
    this.field_2 = undefined;
  }

  /**
   */
  member() {
    // TBD
  }

  /**
   * @private
   */
  member2() {
    return String1;
  }

  /**
   */
  member3() {
    // TBD
  }

  /**
   * @private
   */
  member_s() {
    return String2;
  }
}

module.exports = NamesInThings;


/**
 * Class Toyota
 */
class Toyota extends Car {
  /**
   * Constructor for Toyota
   */
  constructor() {
    super();
  }
}

module.exports = Toyota;


/**
 * Class Honda
 */
class Honda extends Car {
  /**
   * Constructor for Honda
   */
  constructor() {
    super();
  }
}

module.exports = Honda;


/**
 * Class Ford
 */
class Ford extends Car {
  /**
   * Constructor for Ford
   */
  constructor() {
    super();
  }
}

module.exports = Ford;


/**
 * Class Hyundai
 */
class Hyundai extends Car {
  /**
   * Constructor for Hyundai
   */
  constructor() {
    super();
  }
}

module.exports = Hyundai;

