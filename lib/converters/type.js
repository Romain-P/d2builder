var _ = require('underscore'),
    typeCvt = _.clone(require('./base.js')),
    fs = require('fs-extra'),
    check = require('syntax-error'),
    template = fs.readFileSync('./lib/templates/type.tpl').toString();

typeCvt.getFileContent = function(data){
    var className = typeCvt.getClassName(data);
    var fileData = parseWithTemplate(data);
    var err = check(fileData);

    if(err){
        throw new Error(className + ' -> ' + err + '\n' + fileData);
    }

    return fileData;
};

function parseWithTemplate (data) {
  var id = getTypeId(data),
      varList = typeCvt.getVars(data),
      className = typeCvt.getClassName(data),
      str = _.clone(template),
      functionList = typeCvt.getFunctions(data);

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
  
  var result = str.match(/this.serializeAs_\w+\(output\);/g);
  var abstractClassName = result ? result[0].split('_')[1].replace('(output);', '') : '';
  console.log(abstractClassName, className);
  if(!_.isEmpty(className) && abstractClassName != className){
    var dir = typeCvt.resolvePath(typeCvt.getPackage(data), typeCvt.getImportByClassname(abstractClassName, data));
    str = str.replace('_dir_', dir + typeCvt.formatFileName(abstractClassName));
  }
  else{
    str = str.replace("var BaseMessage = require('_dir_').class,", '').replace("util = require('util');", '').replace('util.inherits(' + className + ', BaseMessage);', '');
  }
  
  return str;
}

function replace(str, key, content){
    var regex = new RegExp("_" + key + "_", "g");
    return str.replace(regex, content);
}

function getTypeId (data) {
  data = String(data);
  return data.match(/protocolId:uint = [0-9]+/g)[0].split(' = ')[1];
}

module.exports = typeCvt;
