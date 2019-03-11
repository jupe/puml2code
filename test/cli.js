// native modules
const { readFileSync } = require('fs');
// 3rd party modules
const chai = require('chai');
const { stub } = require('sinon');
const chaiAsPromised = require('chai-as-promised');
// module under test
const cli = require('../src/cli');
const { languages, getExtension } = require('../src');

const { expect } = chai;
chai.use(chaiAsPromised);


describe('cli', () => {
  let exit;
  beforeEach(() => {
    exit = stub(process, 'exit');
  });
  afterEach(() => {
    exit.restore();
  });
  it('version', async () => {
    process.exit.callsFake(() => {
      throw new Error('ok');
    });
    await cli(['node', 'puml2code', '-V']).catch(() => {});
    expect(process.exit.calledOnceWith(0)).to.be.true;
  });
  it('help', async () => {
    process.exit.callsFake(() => {
      throw new Error('ok');
    });
    await cli(['node', 'puml2code', '-h']).catch(() => {});
    expect(process.exit.calledOnceWith(0)).to.be.true;
  });
  it('invalid args', () => {
    process.exit.callsFake(() => {
      throw new Error('ok');
    });
    cli(['node', 'puml2code', '-a']);
    expect(process.exit.calledOnceWith(1)).to.be.true;
  });
  describe('input', () => {
    languages.forEach((lang) => {
      it(`${lang}`, async () => {
        let stdout = '';
        const input = './test/data/car.puml';
        const printer = (data) => { stdout += `${data}\n`; };
        const shoulFile = `./test/data/car.${lang}.${getExtension(lang)}`;
        const retcode = await cli(['node', 'puml2code', '-l', lang, '-i', input], printer);
        expect(stdout).to.be.equal(readFileSync(shoulFile).toString());
        expect(retcode).to.be.equal(0);
      });
    });
  });
});
