var glob = require('glob'),
    asReader = require('./as-reader.js'),
    constants = require('./constants.js'),
    path = require('path'),
    fs = require('fs-extra'),
    beautify = require('js-beautify').js_beautify;

var defaultStrategy = require('./strategies/js-strategy.js');

module.exports = function (src, output, strategy) {
  strategy = strategy || defaultStrategy;
  if(!strategy.enumConverter){
    throw new Error('EnumConverter not implemented in strategy');
  }
  if(!strategy.messageConverter){
    throw new Error('messageConverter not implemented in strategy');
  }
  if(!strategy.typeConverter){
    throw new Error('typeConverter not implemented in strategy');
  }
  convert(strategy.enumConverter, path.join(src, constants.src.metadata), path.join(output, constants.output.metadata));
  convert(strategy.enumConverter, path.join(src, constants.src.protocolConstants), path.join(output, constants.output.protocolConstants));
  convertAll(strategy.enumConverter, path.join(src, constants.src.enum), path.join(output, constants.output.enum));
  return this;
};

function convert(converter, filename, output) {
  var asClass = asReader(filename);
  var data = beautify(converter(asClass));
  var pathResolved = resolveFilename(filename, output);
  fs.outputFile(pathResolved, data, { indent_size: 2 }, function (err) {
    if(err){
      throw err;
    }
  });
};

function convertAll(converter, src, output) {
  var self = this;
  glob(path.join(src, '**/*.as'), function( err, files ) {
    files.forEach(function (file) {
      var o = output + file.replace(src, '').replace('.as', '.js');
      convert(converter, file, o);
    });
  });
};

function resolveFilename (filename, output) {
  var basename = path.basename(filename, '.as');
  var str = basename[0].toLowerCase();
  for(var i = 1; i < basename.length; i++){
    var char = basename[i];
    if(char === char.toUpperCase()){
      str += '-';
    }
    str += char.toLowerCase();
  }
  
  return output.replace(basename, str);
}