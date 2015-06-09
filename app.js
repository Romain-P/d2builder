var pjson = require('./package.json'),
    enumCvt = require('./lib/converters/enum.js'),
    program = require('commander');

program
  .version(pjson.version)
  .usage('[-f <path> | -F <path>] -o <path>')
  .option('-f, --file <path>', 'file path')
  .option('-F, --folder <path>', 'folder path')
  .option('-o, --output <path>', 'output path')
  .parse(process.argv);

if(!program.output || (!program.file && !program.folder)) {
    program.outputHelp();
}

if(program.file){
    enumCvt.writeFile(program.file, program.output);
}
else if(program.folder){

}
