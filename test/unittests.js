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
  it('SM', () => {
    const puml = new Puml();
    spy(puml, '_setState');
    expect(puml._state).to.be.equal('_offHandler');
    puml._onLine('@startuml');
    expect(puml._state).to.be.equal('_idleHandler');
    puml._onLine('class a {');
    expect(puml._state).to.be.equal('_classHandler');
    puml._onLine('}');
    expect(puml._state).to.be.equal('_idleHandler');
    puml._onLine('@enduml');
    expect(puml._state).to.be.equal('_offHandler');
  });
  describe('handlers', () => {
    let puml;
    beforeEach(() => {
      puml = new Puml();
    });
    it('_offHandler', () => {
      expect(puml._offHandler('')).to.be.undefined;
      expect(puml._offHandler('@startuml')).to.be.equal('_idleHandler');
    });
    it('_idleHandler', () => {
      spy(puml, '_addClass');
      spy(puml, '_setTitle');
      expect(puml._idleHandler('')).to.be.undefined;
      expect(puml._addClass.called).to.be.false;
      expect(puml._idleHandler('class Test')).to.be.undefined;
      expect(puml._addClass.called).to.be.false;
      expect(puml._idleHandler('class Test {')).to.be.equal('_classHandler');
      expect(puml._addClass.called).to.be.true;
      expect(puml._addClass.calledOnceWith('Test')).to.be.true;

      expect(puml._idleHandler('title mytitle')).to.be.undefined;
      expect(puml._setTitle.calledOnceWith('mytitle')).to.be.true;
      expect(puml.title).to.be.equal('mytitle');
    });
    describe('_classHandler', () => {
      beforeEach(() => {
        spy(puml, '_outOfClass');
        spy(puml, '_addVariable');
        spy(puml, '_addMethod');
        puml._addClass('myClass');
      });
      it('outOfClass', () => {
        expect(puml._classHandler('}')).to.be.equal('_idleHandler');
        expect(puml._outOfClass.calledOnceWith()).to.be.true;
      });
      it('unknown line', () => {
        expect(puml._classHandler('')).to.be.undefined;
      });
      describe('variables', () => {
        it('private with type', () => {
          expect(puml._classHandler('-Test test')).to.be.undefined;
          expect(puml._addVariable.getCall(0).args).to.be.deep.equal([
            'test',
            'Test',
            '_',
            undefined,
          ]);
        });
        it('public with type', () => {
          expect(puml._classHandler('+Test test')).to.be.undefined;
          expect(puml._addVariable.getCall(0).args).to.be.deep.equal([
            'test',
            'Test',
            '',
            undefined,
          ]);
        });
        it('protected with type', () => {
          expect(puml._classHandler('#Test test')).to.be.undefined;
          expect(puml._addVariable.getCall(0).args).to.be.deep.equal([
            'test',
            'Test',
            '__',
            undefined,
          ]);
        });
        it('public', () => {
          expect(puml._classHandler('+test')).to.be.undefined;
          expect(puml._addVariable.getCall(0).args).to.be.deep.equal([
            'test',
            undefined,
            '',
            undefined,
          ]);
        });
        it('private', () => {
          expect(puml._classHandler('-test')).to.be.undefined;
          expect(puml._addVariable.getCall(0).args).to.be.deep.equal([
            'test',
            undefined,
            '_',
            undefined,
          ]);
        });
        it('protected', () => {
          expect(puml._classHandler('#test')).to.be.undefined;
          expect(puml._addVariable.getCall(0).args).to.be.deep.equal([
            'test',
            undefined,
            '__',
            undefined,
          ]);
        });
        it('public no prefix', () => {
          expect(puml._classHandler('test')).to.be.undefined;
          expect(puml._addVariable.getCall(0).args).to.be.deep.equal([
            'test',
            undefined,
            undefined,
            undefined,
          ]);
        });
      });
      describe('methods', () => {
        it('public with type', () => {
          expect(puml._classHandler('+Test test()')).to.be.undefined;
          expect(puml._addMethod.getCall(0).args).to.be.deep.equal([
            'test',
            '',
            undefined,
            [],
            'Test',
          ]);
        });
        it('public', () => {
          expect(puml._classHandler('+test()')).to.be.undefined;
          expect(puml._addMethod.getCall(0).args).to.be.deep.equal([
            'test',
            '',
            undefined,
            [],
            undefined,
          ]);
        });
        it('private with type', () => {
          expect(puml._classHandler('-Test test()')).to.be.undefined;
          expect(puml._addMethod.getCall(0).args).to.be.deep.equal([
            'test',
            '_',
            undefined,
            [],
            'Test',
          ]);
        });
        it('private', () => {
          expect(puml._classHandler('-test()')).to.be.undefined;
          expect(puml._addMethod.getCall(0).args).to.be.deep.equal([
            'test',
            '_',
            undefined,
            [],
            undefined,
          ]);
        });
        it('protected with type', () => {
          expect(puml._classHandler('#Test test()')).to.be.undefined;
          expect(puml._addMethod.getCall(0).args).to.be.deep.equal([
            'test',
            '__',
            undefined,
            [],
            'Test',
          ]);
        });
        it('protected', () => {
          expect(puml._classHandler('#test()')).to.be.undefined;
          expect(puml._addMethod.getCall(0).args).to.be.deep.equal([
            'test',
            '__',
            undefined,
            [],
            undefined,
          ]);
        });
        it('with parameters', () => {
          expect(puml._classHandler('+test(a, b, c)')).to.be.undefined;
          expect(puml._addMethod.getCall(0).args).to.be.deep.equal([
            'test',
            '',
            undefined,
            [{
              camelCase: 'a',
              name: 'a',
              notes: 'TBD',
            },
            {
              camelCase: 'b',
              name: 'b',
              notes: 'TBD',
            },
            {
              camelCase: 'c',
              name: 'c',
              notes: 'TBD',
            }],
            undefined,
          ]);
        });
      });
    });
  });
  describe('_toCode', () => {
    let puml;
    beforeEach(() => {
      puml = new Puml();
    });
    it('unknown', () => {
      expect(() => puml._toCode({}, 'unknown')).to.throw(TypeError);
    });
  });

  describe('from', () => {
    it('String with invalid parameter', () => {
      expect(() => Puml.fromString({})).to.throw();
    });
    it('String', async () => {
      const puml = Puml.fromString('@startuml\nclass Hep {\n}\n@enduml\n');
      const output = await puml.generate('es6');
      expect(output).to.be.ok;
      const log = spy();
      output.print(log);
      expect(log.calledTwice).to.be.true;
    });
    it('File', async () => {
      const puml = Puml.fromFile(path.join(__dirname, './data/simple.puml'));
      const output = await puml.generate('es6');
      expect(output).to.be.ok;
      const log = spy();
      output.print(log);
      expect(log.calledTwice).to.be.true;
    });
    it('File not found', () => {
      expect(() => Puml.fromFile('not-exists.puml')).to.be.throw;
    });
  });
});
