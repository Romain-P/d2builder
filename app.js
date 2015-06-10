var pjson = require('./package.json'),
    enumCvt = require('./lib/converters/enum.js'),
    typeCvt = require('./lib/converters/type.js'),
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

//enumCvt.writeFiles(path.join(program.src, 'enums'), program.output);
typeCvt.writeFiles(path.join(program.src, 'types'), program.output);
