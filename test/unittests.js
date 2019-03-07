// native modules
const path = require('path');
// 3rd party modules
const chai = require('chai');
const { spy } = require('sinon');
const chaiAsPromised = require('chai-as-promised');


const { expect } = chai;
chai.use(chaiAsPromised);
// modules under test
const Puml = require('../src');


describe('pumlgen', () => {
  it('ok', () => {
    const puml = new Puml();
    expect(puml).is.ok;
    expect(Puml.fromFile).to.be.an('function');
    expect(Puml.fromString).to.be.an('function');
  });

  describe('_toCode', () => {
    let puml;
    beforeEach(() => {
      puml = new Puml();
    });
    it('unknown', () => {
      expect(puml._toCode({}, 'unknown')).to.eventually.rejectedWith(TypeError);
    });
  });

  describe('from', () => {
    it('String with invalid parameter', () => {
      expect(() => Puml.fromString({})).to.throw();
    });
    it('String', async () => {
      const puml = Puml.fromString('@startuml\nclass Hep {\n}\n@enduml\n');
      const output = await puml.generate('ecmascript6');
      expect(output).to.be.ok;
      const log = spy();
      output.print(log);
      expect(log.calledOnce).to.be.true;
    });
    it('File', async () => {
      const puml = Puml.fromFile(path.join(__dirname, './data/simple.puml'));
      const output = await puml.generate('ecmascript6');
      expect(output).to.be.ok;
      const log = spy();
      output.print(log);
      expect(log.calledOnce).to.be.true;
    });
    it('File not found', () => {
      expect(() => Puml.fromFile('not-exists.puml')).to.be.throw;
    });
  });
});
