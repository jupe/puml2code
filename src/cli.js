// 3rd party modules
const program = require('commander');
// application modules
const Puml = require('./');

program
  .version('0.1.0')
  .option('-i, --input [file]', 'input .puml file')
  .option('-l, --lang [lang]', 'select output code language', /^(es6|c)$/i, 'es6')
  .option('-o, --out [path]', 'Output path', 'console')
  .parse(process.argv);

const fromStdin = () => {
  process.stdin.resume();
  process.stdin.setEncoding('utf8');
  return Promise.resolve(new Puml(process.stdin));
};
const fromFile = input => Promise.resolve(Puml.fromFile(input));

let source;
if (process.stdin.isTTY) {
  if (program.input) {
    console.log(`Reading file: ${program.input}`); // eslint-disable-line no-console
    source = fromFile(program.input);
  } else {
    console.log('Reading puml from stdin..'); // eslint-disable-line no-console
    source = fromStdin();
  }
} else {
  console.log('Reading puml from stdin..'); // eslint-disable-line no-console
  source = fromStdin();
}

source
  .then(puml => puml.generate(program.lang))
  .then((output) => {
    if (program.out === 'console') {
      return output.print();
    }
    return output.save(program.output);
  })
  .then(() => {
    console.log('Ready.'); // eslint-disable-line no-console
  });
