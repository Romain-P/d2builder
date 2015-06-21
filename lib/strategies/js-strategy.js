var JsDiff = require('diff');
var template = require('../template-manager.js');

module.exports = {
  enumConverter: function (asClass) {
    return template('./lib/templates/enum.tpl', [
      {key: 'vars', value: formatEnumConstants(asClass)}
    ]);
  },

  messageConverter: function (asClass) {
    return 'coucou';
  },

  typeConverter: function (asClass) {
    return 'coucou';
  }
}

function formatEnumConstants (asClass) {
  var str = '';
  var keys = Object.keys(asClass.constants);
  for(var i = 0; i < keys.length; i++){
    if(i !== 0){
      str += ',\n'
    }
    str += formatEnumConstant(asClass.constants[keys[i]]);
  }
  return str;
}

function formatEnumConstant (c) {
  return c.name + ': ' + c.value;
}

function formatImports (asClass) {

  return '';
}

function formatImport (asClass, dep) {
  return '';
}

function resolveDependencyPath(cdir, tdir, output) {
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
    return this.resolveDependencyPath(_.without(cdir, _.first(cdir)), tdir, output);
  }
  if(_.isEmpty(output)){
    output = './';
  }
  if(tdir.length > 0){
    output += _.first(tdir) + '/';
    return this.resolveDependencyPath(cdir, _.without(tdir, _.first(tdir)), output);
  }

  return output.replace('//', '../../');
}