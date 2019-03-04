const PlantUmlCodeGenerator = require('../src');


const platnuml = PlantUmlCodeGenerator.fromFile('./examples/sample.puml');
platnuml.generate()
    .then((out) => out.print());