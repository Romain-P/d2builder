var fs = require('fs-extra');

module.exports = function (filename, options) {
  var data = fs.readFileSync(filename).toString();
  for(var i = 0; i < options.length; i++){
    var option = options[i];
    data = data.replace('<' + option.key + '>', option.value);
  }
  
  return data;
}