var fs = require('fs-extra'),
    _ = require('underscore');
var AsReader = function () {
};

module.exports = new AsReader();
module.exports.AsReader = AsReader;

AsReader.prototype.read = function (filename) {
  var data = fs.readFileSync(filename).toString();
  var asClass = {};
  var info = getClassInfo(data);
  if(info.class){
    asClass.class = info.class;
  }
  if(info.super){
    asClass.super = info.super;
  }
  if(info.interface){
    asClass.interface = info.interface;
  }
  asClass.imports = getImports(data);
  return asClass;
};

function getClassInfo (data) {
  var result = data.match(/public class [\w| ]+/g)[0].split(' ') || [];
  var info = {};

  for(var i = 0; i < result.length; i++){
    switch(result[i]) {
      case 'class':
        info.class = result[i + 1];
        break;
      case 'extends':
        info.super = result[i + 1];
        break;
      case 'implements':
        info.interface = result[i + 1];
        break;
    }
  }
  return info;
}

function getImports (data) {
  var result = data.match(/import [\w|.]+;/g) || [];
  return result.map(function (e) {
    var loc = e.replace('import ', '').split('.');
    return {
      class: _.last(loc),
      namespace: _.without(loc, _.last(loc)).join('.')
    };
  });
}