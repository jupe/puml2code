// native modules
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
    process.exit.throws(new Error('oh'));
  });
  afterEach(() => {
    exit.restore();
  });
  it('version', () => {
    expect(() => cli(['node', 'puml2code', '-V'])).to.throw(Error);
    expect(process.exit.calledOnceWith(0)).to.be.true;
  });
  it('help', () => {
    expect(() => cli(['node', 'puml2code', '-h'])).to.throw(Error);
    expect(process.exit.calledOnceWith(0)).to.be.true;
  });
  describe('input', () => {
    it('file', () => {
      expect(cli(['node', 'puml2code', '-i', './test/data/simple.puml'])).to.be.fulfilled;
      expect(process.exit.called).to.be.false;
    });
  });
});
