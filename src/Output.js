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

  print(log = console.log) { // eslint-disable-line no-console
    _.each(this._files, (content, file) => {
      log(`${file}:`);
      log(`${content}\n`);
    });
  }

  async save(path) {
    this.logger.debug(`Write files ${_.map(this._files, (content, file) => file)} to path: ${path}`);
    const writer = (content, file) => Promise.fromCallback(cb => writeFile(join(path, file), content, cb));
    const pendings = _.map(this._files, writer);
    return Promise.all(pendings);
  }
}

module.exports = Output;
