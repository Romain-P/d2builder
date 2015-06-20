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

  var knowType = ['uint', 'int', 'Boolean', 'String', 'Number'], deps = '';

  str = replace(str, 'id', id);
  str = replace(str, 'serialize', functionList['serializeAs_' + className]);
  str = replace(str, 'deserialize', functionList['deserializeAs_' + className]);
  str = replace(str, 'classname', className);
  str = replace(str, 'vars', varList.map(function (v) {
    var str = 'this.' + v.name;
    if(v.type.indexOf('Vector') > -1){
      str += ' = []';
    }
    else if(_.contains(knowType, v.type)){
      str += ' = ' + v.value;
    }
    else if(v.type.indexOf('ByteArray') > -1){
      str += ' = new Buffer(32)';
    }
    else{
      str += ' = new ' + v.type + '()';
      var depPath = messageCvt.resolvePath(messageCvt.getPackage(data), messageCvt.getImportByClassname(v.type, data));
      deps += 'var ' + v.type + ' = require(\'' + depPath + messageCvt.formatFileName(v.type) + '\');';
    }
    return str + ';';
  }).join(''));
  str = replace(str, 'deps', deps);
  var result = str.match(/super.serializeAs_\w+\(output\);/g);
  if(result){
    var abstractClassName = result[0].split('_')[1].replace('(output);', '');
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
