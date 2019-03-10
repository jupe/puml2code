const Promise = require('bluebird');
const parser = require('./plantuml');

module.exports = data => Promise.try(() => parser.parse(data));
module.exports.SyntaxError = parser.SyntaxError;
