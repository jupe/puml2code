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

  print() {
    _.each(this._files, (content, file) => {
      this.logger.debug(`${file}:`);
      this.logger.debug(`${content}\n\n`);
    });
  }

  async save(path) {
    const writer = (content, file) => Promise.fromCallback(cb => writeFile(join(path, file), content, cb));
    const pendings = _.map(this._files, writer);
    return Promise.all(pendings);
  }
}

module.exports = Output;
