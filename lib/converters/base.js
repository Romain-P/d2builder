var beautify = require('js-beautify').js_beautify,
    fs = require('fs-extra'),
    path = require('path'),
    glob = require( 'glob' );

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
            var output = path.join(outputFolder, path.basename(filename, '.as').concat('.js'));
            fs.outputFile(output, beautify(self.getFileContent(data.toString()), { indent_size: 2 }), function (err) {
                if(err){
                    throw err;
                }
            });
        });
    },

    writeFiles: function(inputFolder, outputFolder){
        var self = this;
        glob( inputFolder + '**/*.as', function( err, files ) {
            files.forEach(function (file) {
              self.writeFile(file, outputFolder);
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
    }
}

function getFunctionName (data) {
  return data.match(/\w+\(/g)[0].replace('(', '');
}

function getFunctionBody (data, index) {
  var str = '';
  do{
    str += data[index];
    index++;
  }
  while(data[index] !== '}');
  return parseFunctionBody(str);
}

function parseFunctionBody (data) {
  return data[0] === '}' ? '' : data.replace(/ as \w+/g, '').replace(/var /g, '').replace(/:\w+/g, '');
}
