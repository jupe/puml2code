// 3rd party modules
const program = require('commander');
// application modules
const Puml = require('./');


const parseArgs = argv => program
  .version('0.1.0')
  .option('-i, --input [file]', 'input .puml file')
  .option('-l, --lang [lang]', 'select output code language', /^(es6|py2)$/i, 'es6')
  .option('-o, --out [path]', 'Output path', 'console')
  .parse(argv);

const fromStdin = () => {
  process.stdin.resume();
  process.stdin.setEncoding('utf8');
  return Promise.resolve(new Puml(process.stdin));
};
const fromFile = input => Promise.resolve(Puml.fromFile(input));


const getSource = (args) => {
  if (args.input) {
    console.log(`Reading file: ${args.input}`); // eslint-disable-line no-console
    return fromFile(args.input);
  }
  console.log('Reading puml from stdin..'); // eslint-disable-line no-console
  return fromStdin();
};

module.exports = (argv = process.argv) => {
  const args = parseArgs(argv);
  return getSource(args)
    .then(puml => puml.generate(args.lang))
    .then((output) => {
      if (args.out === 'console') {
        return output.print();
      }
      return output.save(args.output);
    })
    .then(() => {
      console.log('Ready.'); // eslint-disable-line no-console
    });
};
module.exports.parseArgs = parseArgs;
