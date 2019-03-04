const {expect} = require('chai');
const Puml = require('../src');


describe('pumlgen', function () {
    it('ok', function () {
       const puml = new Puml();
       expect(puml).is.ok;
    });
});
