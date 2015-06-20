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
  var ns;
  if((ns = getNamespace(data)))
  {
    asClass.namespace = ns;
  }
  asClass.properties = getProperties(data);
  return asClass;
};

function getClassInfo (data) {
  var loc = data.match(/public class [\w| ]+/g) || [];
  var result = loc ? loc[0].split(' ') : [];
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

function getNamespace (data) {
  var result = data.match(/package [\w|.]+/g);
  return result ? result[0].replace('package ', '') : undefined;
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

function getProperties (data) {
  var loc = data.match(/private var (.)+;/g) || [];
  var loc1 = data.match(/public var (.)+;/g) || [];
  var privateVariables = loc.map(function (v) {
    v = v.replace('private var ', '');
    v = parseVariable(v);
    v.visivility = 'private';
    return v;
  });
  var publicVariables = loc1.map(function (v) {
    v = v.replace('public var ', '');
    v = parseVariable(v);
    v.visivility = 'public';
    return v;
  });
  return publicVariables.concat(privateVariables);
}

function parseVariable (data) {
  var loc = data.split(':');
  var variable = {};
  variable.name = loc[0];
  var loc1 = loc[1].replace(';', '').split(' = ');
  variable.type = loc1[0];
  if(loc1.length > 1){
    variable.value = loc1[1];
  }
  return variable;
}