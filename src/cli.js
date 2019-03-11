// 3rd party modules
const _ = require('lodash');
const program = require('commander');
// application modules
const Puml = require('./');
const logger = require('./logger');

const options = new RegExp(`^(${_.reduce(Puml.languages, (acc, ext) => `${acc}${ext}|`, '')})$`, 'i');
const parseArgs = argv => program
  .version('0.1.0')
  .option('-i, --input [file]', 'input .puml file, or "stdin"')
  .option('-l, --lang [lang]', 'Optional output source code language', options, 'ecmascript6')
  .option('-o, --out [path]', 'Output path. When not given output is printed to console.')
  .on('--help', () => {
    const print = console.log; // eslint-disable-line no-console
    print('');
    print(`Supported languages: ${Puml.languages.join(', ')}`);
    print('');
    print('Examples:');
    print('  $ puml2code -i input.puml -l ecmascript6');
    print('  $ puml2code -h');
    print('Use DEBUG=puml2code env variable to get traces. Example:');
    print('  $ DEBUG=puml2code puml2code -i input.puml');
  })
  .parse(argv);

const fromStdin = () => {
  process.stdin.resume();
  process.stdin.setEncoding('utf8');
  return Promise.resolve(new Puml(process.stdin));
};
const fromFile = input => Promise.resolve(Puml.fromFile(input));


const getSource = (args) => {
  if (!args.input) {
    console.error('Error: input option is required'); // eslint-disable-line no-console
    args.help();
  }
  if (args.input !== 'stdin') {
    logger.debug(`Reading file: ${args.input}`); // eslint-disable-line no-console
    return fromFile(args.input);
  }
  console.log('Reading puml from stdin..'); // eslint-disable-line no-console
  return fromStdin();
};

const execute = async (argv = process.argv, printer = console.log) => { // eslint-disable-line no-console
  let args = { removeAllListeners: () => {} };
  try {
    args = parseArgs(argv);
    const puml = await getSource(args);
    const output = await puml.generate(args.lang);
    if (args.out) {
      await output.save(args.out);
    } else {
      output.print(printer);
    }
    logger.debug('ready');
    args.removeAllListeners();
    return 0;
  } catch (error) {
    logger.error(error);
    args.removeAllListeners();
    throw error;
  }
};
module.exports = execute;
module.exports.parseArgs = parseArgs;

if (require.main === module) {
  execute();
}
