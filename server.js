var
    https   = require('https'),
    Assets  = require('./backend/assets'),
    API     = require('./backend/api'),
    Default = require('./backend/default'),
    Router  = require('./frontend/js/lib/router')()
;

Router
    .add('api', API)
    .add('static', Assets)
    .add(Default)


var
    port = 9000,
    host = '127.0.0.1'
;

const options = {
    key: fs.readFileSync('.httpskeys/privkey.pem'),
    cert: fs.readFileSync('.httpskeys/cert.pem')
};

var process = function (req, res) {
    console.log('[' + req.method + ']', req.url);
    Router.check(req.url, [req, res]); 
}

var app = https.createServer(options, process).listen(port, host);
console.info('Server running on ' + host + ':' + port);
