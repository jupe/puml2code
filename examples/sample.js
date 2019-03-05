const PlantUmlToCode = require('../src');


const platnuml = PlantUmlToCode.fromFile('./examples/sample.puml');
platnuml.generate()
  .then(out => out.print());
