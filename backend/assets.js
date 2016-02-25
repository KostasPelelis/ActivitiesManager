var
    path = require('path'),
    util = require('util'),
    fs   = require('fs')
;


var mimes = {
    'css': 'text/css',
    'ttf': 'application/x-font-truetype',
    'woff2': 'application/font-woff2',
    'html': 'text/html',
    'js': 'text/javascript',
    'map': 'text/javascript',
    'ico': 'image/icon',
    'json': 'application/json',
    'jpg': 'image/jpeg',
    'jpeg': 'image/jpeg',
    'png': 'image/png',
};

var files = {};
var disable_cache = true;

module.exports = function(request, response) {

    /* Error Handler */    
    var sendError = function(message, code) {
        if(code == undefined) {
            code = 404;
        }
        response.writeHead(code, {'Content-Type': 'text/html'});
        response.end(message);
    }
    
    /* File Server */
    var serve = function(file) {
        var contentType = 'text/plain';
        var fileExtension = file.ext.toLowerCase();
        if(mimes[fileExtension] == undefined){
            log.warn('Unknown file extension -> ' + fileExtension);
        }
        else {
            contentType = mimes[fileExtension];
        }
        response.writeHead(200, {'Content-Type': contentType});
        response.end(file.content);
    }
    
    /* File Reader */
    var readFile = function(filePath) {
        if(files[filePath] && !disable_cache) {
            serve(files[filePath]);
        }
        else {
            fs.readFile(filePath, function(err,data) {
                if(err) {
                    console.error(err);
                    sendError('Error While Reading File ' + filePath);
                    return;
                }
                files[filePath] = {
                    ext: filePath.split(".").pop(),
                    content: data
                }
                serve(files[filePath]);
            });
        }
    }
    readFile(path.normalize(__dirname + '/..' + request.url));
}
