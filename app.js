var pjson = require('./package.json'),
    program = require('commander');

program
  .version(pjson.version)
  .usage('[-f <path> | -F <path>] -o <path>')
  .option('-f, --file <path>', 'file path')
  .option('-F, --folder <path>', 'folder path')
  .option('-o, --output <path>', 'output path')
  .parse(process.argv);

if(!process.argv.slice(2).length) {
    program.outputHelp();
}

if(program.file){

}
else if(program.folder){

}
