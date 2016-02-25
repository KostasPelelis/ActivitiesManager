var 
    router = require('../frontend/js/lib/router')(),
    response = require('./response'),
    users = require('./user')
;


router.
    add('api/version', function(request, res) {
        response({
            version: '0.1'
        }, res);
    })
    .add('api/user', function(request, res) {
        console.info('Users' + request.method);
        users(request, res);        
    })
    .add(function(request, res) {
        response({
            success: true
        },res)
    });

module.exports = function(request, result) {
    router.check(request.url, [request, result]);
}

