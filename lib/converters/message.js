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
    var dir = messageCvt.resolvePath(messageCvt.getPackage(data), messageCvt.getImportByClassname(abstractClassName, data));
    str = str.replace(/super\./g, 'this.').replace('d2com.networkMessage', 'require(\'' + dir + messageCvt.formatFileName(abstractClassName) + '\')');
  }
  return str;
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
