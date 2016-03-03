var
    path = require('path'),
    util = require('util'),
    fs   = require('fs')
;


var mimes = {
    '.css': 'text/css',
    '.ttf': 'application/x-font-truetype',
    '.woff2': 'application/font-woff2',
    '.html': 'text/html',
    '.js': 'text/javascript',
    '.map': 'text/javascript',
    '.ico': 'image/icon',
    '.json': 'application/json',
    '.jpg': 'image/jpeg',
    '.jpeg': 'image/jpeg',
    '.png': 'image/png',
};

var disable_cache = true;

var cache = {
    store: {},
    maxSize: 1024 * 1024 * 30,          // 30 Mbs of cache
    maxAge: 1000 * 60 * 60,             // 1 Hour max age
    cleanAfter: 1000 * 60 * 60 * 2,     // Clean after 2 hours
    cleanedAt: 0,
    clean: function(now) {
        if(now - this.cleanAfter > this.cleanedAt) {
            console.log('Cleaning Cache');
            this.cleanedAt = now;
            var self = this;
            Object.keys(this.store).forEach(function(file) {
                if(now > self.store[file].timestamp + self.maxAge) {
                    delete self.store[file];
                }
            });
        }
    }
}

module.exports = function(request, response) {

    /* Error Handler */    
    var sendError = function(message, code) {
        if(code == undefined) {
            code = 404;
        }
        response.writeHead(code, {'Content-Type': 'text/html'});
        response.end(message);
    }
    
    var streamFile = function(file) {
        var stream = fs.createReadStream(file).once('open', function() {
            response.writeHead(200, {'ContentType': mimes[path.extname(file)]});
            this.pipe(response);
        })
        .once('error', function(e) {
            response.writeHead(500);
            response.end('Server Error');
        });

        if(!disable_cache) {
            fs.stat(file, function(err, stats) {
                if(stats.size < cache.maxSize) {
                    var bufferOffset = 0;
                    cache.store[file] = {
                        content: new Buffer(stats.size),
                        timestamp: Date.now()
                    };
                    stream.on('data', function(data) {
                        data.copy(cache.store[file].content, bufferOffset);
                        bufferOffset += data.length;
                    });
                }
            });
        }
    };
    
    var serve = function(filePath) {
        fs.exists(filePath, function(exists) {
            if(exists) {
                if(mimes[path.extname(filePath)]) {
                    if(!disable_cache && cache.store[filePath]) {
                        console.log('Found file ' + filePath + ' in cache');
                        response.writeHead(200, {'ContentType': mimes[path.extname(filePath)]});
                        response.end(cache.store[filePath].content);
                    } else {
                        console.log('Starting streaming session for file ' + filePath);
                        streamFile(filePath)
                    }

                } else {
                    sendError('Unsupported Mime ' + mimes[path.extname(filepath)], 500);    
                }
            } else {
                response.writeHead(404);
                response.end('Page Not Found');
            }
        });
        cache.clean(Date.now());
    };

    serve(path.normalize(__dirname + '/..' + request.url));
}
