var _ = require('underscore'),
    messageCvt = _.clone(require('./base.js')),
    fs = require('fs-extra'),
    check = require('syntax-error'),
    template = fs.readFileSync('./lib/templates/message.tpl').toString();

messageCvt.getFileContent = function(data){
  var className = messageCvt.getClassName(data);
  var fileData = parseWithTemplate(data);
  var err = check(fileData);

  if(err){
    throw new Error(className + ' -> ' + err + '\n' + fileData);
  }
  return fileData;
};

function parseWithTemplate (data) {
  var id = getMessageId(data),
      varList = messageCvt.getVars(data),
      className = messageCvt.getClassName(data),
      str = _.clone(template),
      functionList = messageCvt.getFunctions(data);

  str = replace(str, 'id', id);
  str = replace(str, 'serialize', functionList['serializeAs_' + className]);
  str = replace(str, 'deserialize', functionList['deserializeAs_' + className]);
  str = replace(str, 'classname', className);
  str = replace(str, 'vars', varList.map(function (v) {
    var str = 'this.' + v.name;
    if(v.type.indexOf('Vector') > -1){
      str += ' = []';
    }
    else if(v.value){
      str += ' = ' + v.value;
    }
    return str + ';';
  }).join(''));
  if(str.indexOf('super.') > -1){
    var abstractClassName = str.match(/super.serializeAs_\w+\(output\);/g)[0].split('_')[1].replace('(output);', '');
    var dir = getAbstractDir(abstractClassName, messageCvt.getImports(data), messageCvt.getPackage(data))
    str = str.replace(/super\./g, 'this.').replace('d2com.networkMessage', 'require(\'' + dir + messageCvt.formatFileName(abstractClassName) + '\').class');
  }
  return str;
}

function getAbstractDir (name, imports, package) {
  var dir = './', imp = getImportByClassname(name, imports), selected;
  if(imp === null){
    return dir;
  }
  dir = '';
  var imps = imp.split('.'), pkgs = package.split('.');
  var found = false;
  for(var i = imps.length - 2; i !== 0; i--){
    if(imps[i].indexOf(pkgs[pkgs.length - 2]) > -1){
      found = true;
      selected = i;
      break;
    }
    dir += '../'
  }
  
  if(!found){
    dir = '../';

    for(var i = imps.length - 2; i !== 0; i--){
      if(imps[i].indexOf(pkgs[pkgs.length - 3]) > -1){
        found = true;
        selected = i;
        break;
      }
      dir += '../'
    }
  }

  dir = dir !== '' ? dir : '../'
  for(var i = selected + 1; i < imps.length - 1; i++){
    dir += imps[i] + '/';
  }
  
  return dir;
}

function getImportByClassname (name, imports) {
  for(var i = 0; i < imports.length; i++){
    if(imports[i].indexOf(name) > -1){
      return imports[i];
    }
  }

  return null;
}

function replace(str, key, content){
  var regex = new RegExp("_" + key + "_", "g");
  return str.replace(regex, content);
}

function getMessageId (data) {
  data = String(data);
  return data.match(/protocolId:uint = [0-9]+/g)[0].split(' = ')[1];
}

module.exports = messageCvt;
