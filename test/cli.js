// native modules
const { readFileSync } = require('fs');
// 3rd party modules
const chai = require('chai');
const { stub } = require('sinon');
const chaiAsPromised = require('chai-as-promised');
// module under test
const cli = require('../src/cli');

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
    await cli(['node', 'puml2code', '-V']);
    expect(process.exit.calledOnceWith(0)).to.be.true;
  });
  it('help', async () => {
    process.exit.callsFake(() => {
      throw new Error('ok');
    });
    await cli(['node', 'puml2code', '-h']);
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
    it('file', async () => {
      let stdout;
      const printer = (data) => { stdout = data; };
      const retcode = await cli(['node', 'puml2code', '-i', './test/data/simple.puml'], printer);
      expect(stdout).to.be.equal(readFileSync('./test/data/simple.js').toString());
      expect(retcode).to.be.equal(0);
    });
  });
});
