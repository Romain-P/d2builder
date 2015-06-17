var pjson = require('./package.json'),
    constants = require('./lib/constants.js'),
    enumCvt = require('./lib/converters/enum.js'),
    typeCvt = require('./lib/converters/type.js'),
    messageCvt = require('./lib/converters/message.js'),
    path = require('path'),
    program = require('commander');

program
  .version(pjson.version)
  .usage('-s <path> -o <path>')
  .option('-s, --src <path>', 'directory path')
  .option('-o, --output <path>', 'output path')
  .parse(process.argv);

if(!program.output || !program.src) {
    program.outputHelp();
}

/*
enumCvt.writeFiles(path.join(program.src, constants.src.enum), path.join(program.output, constants.output.enum));
enumCvt.writeFile(path.join(program.src, constants.src.metadata), path.join(program.output, constants.output.metadata));
enumCvt.writeFile(path.join(program.src, constants.src.protocolConstants), path.join(program.output, constants.output.protocolConstants));
typeCvt.writeFiles(path.join(program.src, constants.src.type), path.join(program.output, constants.output.type));
*/
messageCvt.writeFiles(path.join(program.src, constants.src.message), path.join(program.output, constants.output.message));
