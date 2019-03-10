// native modules
const { join } = require('path');
const { writeFile, mkdir } = require('fs');
// 3rd party modules
const Promise = require('bluebird');
const _ = require('lodash');


class Output {
  constructor(files, { logger }) {
    this.logger = logger;
    this._files = files;
  }

  print(printer = console.log) { // eslint-disable-line no-console
    _.each(this._files, (content, file) => {
      this.logger.info(`${file}:`);
      printer(`${content}`);
    });
  }

  static mkdir(path) {
    return new Promise(
      (resolve, reject) => mkdir(path,
        err => ((err && err.code !== 'EEXIST') ? reject(err) : resolve())),
    );
  }

  async save(path) {
    await Output.mkdir(path); // ensure that folder exists or create it
    this.logger.debug(`Write files ${_.map(this._files, (content, file) => file)} to path: ${path}`);
    const writer = (content, file) => Promise.fromCallback(cb => writeFile(join(path, file), content, cb));
    const pendings = _.map(this._files, writer);
    return Promise.all(pendings);
  }
}

module.exports = Output;
