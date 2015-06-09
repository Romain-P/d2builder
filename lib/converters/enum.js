var enumCvt = require('./base.js'),
    fs = require('fs-extra'),
    template = fs.readFileSync('./lib/templates/enum.tpl').toString();

enumCvt.getFileContent = function(data){
    var outputVars = '',
        enumVars = parseEnumVars(data);

    for(var i = 0; i < enumVars.length; i++){
        if(i > 0){
            outputVars += ',\n';
        }
        outputVars += enumVars[i].name + ': ' + enumVars[i].value;
    }

    return template.replace('[vars]', outputVars);
};

function parseEnumName (data) {
    return data.toString().match(/class (.)+\n/g)[0].split(' ')[1];
}

function parseEnumVars (data) {
    return data.toString().match(/([A-Z]|[a-z]|_|[0-9])+:(.)+ = (-?[0-9]|"(.)+")+/g).map(function (str) {
        return {name: str.match(/([A-Z]|[a-z]|_|[0-9])+:/g)[0].replace(':', ''), value: str.match(/= (-?[0-9]|"(.)+")+/g)[0].replace('= ', '')};
    });
}

module.exports = enumCvt;
