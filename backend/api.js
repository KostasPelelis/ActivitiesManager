var 
    jwt = require('jsonwebtoken')
    router = require('../frontend/js/lib/router')(),
    error = require('./apiwrappers').error,
    authenticate = require('./api/auth'),
    users = require('./api/user'),
    response = require('./response')
;


router
    .add('api/auth', authenticate)
    .add('api/user/:username', users)
    .add('api/user', users)
    .add('api', function(request, res) {
        var token = request.body && request.body.token ? request.body.token :
                    request.query && request.query.token ? request.query.token :
                    request.headers['x-access-token'] ? request.headers['x-access-token'] : false;
        if(token) {
            jwt.verify(token, process.env.NODE_SECRET_KEY, function(err, decoded) {
                if(err) {
                    error('Failed to authenticate token', res);
                }
                request.decoded = decoded;
                response({success: true}, res); 
            });
        } else {
            error('No token provided', res);
        }
    })
    .add('api/version', function(request, res) {
        response({
            version: '0.1'
        }, res);
    });

module.exports = function(request, result) {
    router.check(request.url, [request, result]);
}

