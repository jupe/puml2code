// native modules
const { join } = require('path');
const { writeFile } = require('fs');
// 3rd party modules
const _ = require('lodash');


class Output {
  constructor(files, { logger }) {
    this.logger = logger;
    this._files = files;
  }

  print(log = console.log) {
    _.each(this._files, (content, file) => {
      log(`${file}:`); // eslint-disable-line no-console
      log(`${content}\n`); // eslint-disable-line no-console
    });
  }

  async save(path) {
    const writer = (content, file) => Promise.fromCallback(cb => writeFile(join(path, file), content, cb));
    const pendings = _.map(this._files, writer);
    return Promise.all(pendings);
  }
}

module.exports = Output;
