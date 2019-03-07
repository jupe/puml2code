// 3rd party modules
const _ = require('lodash');
const program = require('commander');
// application modules
const Puml = require('./');
const logger = require('./logger');

const options = new RegExp(`^(${_.reduce(Puml.languages, (acc, ext) => `${acc}${ext}|`, '')})$`, 'i');
const parseArgs = argv => program
  .version('0.1.0')
  .option('-i, --input [file]', 'input .puml file')
  .option('-l, --lang [lang]', 'select output code language', options, 'ecmascript6')
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
    logger.debug(`Reading file: ${args.input}`); // eslint-disable-line no-console
    return fromFile(args.input);
  }
  console.log('Reading puml from stdin..'); // eslint-disable-line no-console
  return fromStdin();
};

const execute = async (argv = process.argv, printer = console.log) => { // eslint-disable-line no-console
  try {
    const args = parseArgs(argv);
    const puml = await getSource(args);
    const output = await puml.generate(args.lang);
    if (args.out === 'console') {
      output.print(printer);
    } else {
      await output.save(args.output);
    }
    logger.debug('ready');
    return 0;
  } catch (error) {
    logger.error(error);
    return 1;
  }
};
module.exports = execute;
module.exports.parseArgs = parseArgs;

if (require.main === module) {
  execute();
}
