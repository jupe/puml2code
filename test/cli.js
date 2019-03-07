// native modules
// 3rd party modules
const chai = require('chai');
const { stub } = require('sinon');
const chaiAsPromised = require('chai-as-promised');
// module under test
const cli = require('../src/cli');
const Output = require('../src/Output');

const { expect } = chai;
chai.use(chaiAsPromised);


describe('cli', () => {
  let exit, outputPrinter;
  beforeEach(() => {
    exit = stub(process, 'exit');
    process.exit.throws(new Error('oh'));
  });
  afterEach(() => {
    exit.restore();
  });
  /*
  beforeEach(() => {
    outputPrinter = stub(Output, 'printer').get(() => (data) => {
      console.log('output', data)
    });
  });
  afterEach(() => {
    outputPrinter.restore();
  });*/
  it('version', () => {
    expect(() => cli(['node', 'puml2code', '-V'])).to.throw(Error);
    expect(process.exit.calledOnceWith(0)).to.be.true;
  });
  it('help', () => {
    expect(() => cli(['node', 'puml2code', '-h'])).to.throw(Error);
    expect(process.exit.calledOnceWith(0)).to.be.true;
  });
  it('invalid args', () => {
    expect(() => cli(['node', 'puml2code', '-a'])).to.throw(Error);
    expect(process.exit.calledOnceWith(1)).to.be.true;
  });
  describe('input', () => {
    it.only('file', () => {
      expect(cli(['node', 'puml2code', '-i', './test/data/simple.puml'])).to.be.fulfilled;
      expect(process.exit.calledOnceWith(0)).to.be.false;
    });
  });
});
