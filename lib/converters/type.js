var typeCvt = require('./base.js'),
    fs = require('fs-extra'),
    template = fs.readFileSync('./lib/templates/type.tpl').toString();

typeCvt.getFileContent = function(data){
    var outputVars = '';
    return outputVars;
};

module.exports = typeCvt;
