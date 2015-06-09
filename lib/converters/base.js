var beautify = require('js-beautify').js_beautify,
    fs = require('fs-extra'),
    path = require('path'),
    glob = require( 'glob' );

module.exports = {

    writeFile: function(filename, outputFolder){
        outputFolder = outputFolder || './output';
        fs.readFile(filename, function read(err, data) {
            if (err) {
                throw err;
            }
            var output = path.join(outputFolder, filename.replace('.as', '.js'));
            if(!this.getFileContent){
                throw new Error('getFileContent(data) not implemented');
            }
            fs.outputFile(output, beautify(this.getFileContent(data.toString()), { indent_size: 2 }), function (err) {
                if(err){
                    throw err;
                }
            });
        });
    },

    writeFiles: function(inputFolder, outputFolder){
        glob( inputFolder + '**/*.as', function( err, files ) {
            files.forEach(function (file) {
              this.writeFile(file, outputFolder);
            });
        });
    }
}
