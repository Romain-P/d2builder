var beautify = require('js-beautify').js_beautify,
    fs = require('fs-extra'),
    path = require('path'),
    glob = require( 'glob' ),
    JsDiff = require('diff'),
    _ = require('underscore');

module.exports = {

  writeFile: function(filename, outputFolder){
    outputFolder = outputFolder || './output';
    var self = this;
    if(!self.getFileContent){
      throw new Error('getFileContent(data) not implemented');
    }
    fs.readFile(filename, function read(err, data) {
      if (err) {
        throw err;
      }

      var formatted = self.formatFileName(path.basename(outputFolder, '.js'));
      var finalPath = outputFolder.replace(path.basename(outputFolder), formatted);

      fs.outputFile(finalPath, beautify(self.getFileContent(data.toString()), { indent_size: 2 }), function (err) {
        if(err){
          throw err;
        }
      });
    });
  },

  writeFiles: function(inputFolder, outputFolder){
    var self = this;
    glob(path.join(inputFolder, '**/*.as'), function( err, files ) {
      files.forEach(function (file) {
        self.writeFile(file, outputFolder + file.replace(inputFolder, '').replace('.as', '.js'));
      });
    });
  },

  getFunctions: function (content) {
    content = String(content);
    var data = content.split('\n').map(function (str) {
      return str.trim();
    });
    var dic = {};
    for(var i = 0; i < data.length; i++){
      if(data[i].indexOf('function') > -1){
        dic[getFunctionName(data[i])] = getFunctionBody(data, i + 2);
      }
    }
    return dic;
  },

  getVars: function (data) {
    data = String(data);
    var result = data.match(/public var ([a-z]|[A-Z]|_|[0-9])+:(.)+/g);
    return result === null ? [] : result
      .map(function (str) {
      str = str.replace('public var ', '').replace(';', '');
      var loc = str.split(' = '),
          loc2 = loc[0].split(':');
      var loc3 =  { name: loc2[0], type: loc2[1]};
      if(loc[1]){
        loc3.value = loc[1];
      }
      else if(loc3.type.indexOf('Vector') > -1){
        loc3.value = [];
      }
      return loc3;
    });
  },

  getClassName: function (data) {
    data = String(data);
    return data.match(/class \w+/g)[0].replace('class ', '');
  },

  formatFileName: function (filename) {
    var str = filename[0].toLowerCase();
    for(var i = 1; i < filename.length; i++){
      var char = filename[i];
      if(char === char.toUpperCase()){
        str += '-';
      }
      str += char.toLowerCase();
    }
    return str + '.js';
  },

  getPackage: function (data) {
    return data.match(/package (.)+/g)[0].replace('package ', '').replace(';', '');
  },

  getImports: function (data) {
    return data.match(/import (.)+/g).map(function (d) {
      return d.replace('import ', '').replace(';', '');
    });
  },

  getImportByClassname: function (name, data) {
    var imports = this.getImports(data);
    for(var i = 0; i < imports.length; i++){
      if(imports[i].indexOf(name) > -1){
        return imports[i].replace('.' + name, '');
      }
    }

    return null;
  },

  resolvePath: function (cdir, tdir, output) {
    if(!cdir || !tdir){
      return './';
    }
    if(!output){
      var dif = JsDiff.diffWords(cdir, tdir)[0].value;
      cdir = cdir.replace(dif, '').split('.');
      tdir = tdir.replace(dif, '').split('.');
      output = '';
    }
    if(cdir.length > 0){
      output += '../';
      return this.resolvePath(_.without(cdir, _.first(cdir)), tdir, output);
    }
    if(_.isEmpty(output)){
      output = './';
    }
    if(tdir.length > 0){
      output += _.first(tdir) + '/';
      return this.resolvePath(cdir, _.without(tdir, _.first(tdir)), output);
    }

    return output.replace('//', '../../');
  }
}

function getFunctionName (data) {
  return data.match(/\w+\(/g)[0].replace('(', '');
}

function getFunctionBody (data, index) {
  var str = '', count = 1;
  do{
    if(data[index].indexOf('{') > -1){
      count++;
    }
    if(data[index].indexOf('}') > -1){
      count--;
    }
    str += data[index];
    index++;
  }
  while(count !== 0);
  return parseFunctionBody(str.substring(0, str.length - 1));
}

function parseFunctionBody (data) {
  return data[0] === '}' ? '' : data.replace(/ as \w+/g, '').replace(/:(uint|int);/g, ' = 0;').replace(/:[\w|*]+/g, '').replace('super.', 'this.');
}