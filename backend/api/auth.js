var
    apiwrappers             = require('./apiwrappers'),
    response               = require('./response'),
    bcrypt                  = require('bcrypt'),
    jsonwebtoken            = require('jsonwebtoken'),
    getDatabaseConnection   = apiwrappers.getDatabaseConnection,
    processPOSTrequest      = apiwrappers.processPOSTRequest,
    error                   = apiwrappers.error
;

_comparePwds = function(new_password, password, callback) {
    bcrypt.compare(new_password, password, function(err, isMatch) {
        if(err) return callback(err);
        callback(null, isMatch);
    });
}

_authenticate = function(data, res) {
    getDatabaseConnection(function(db) {
        db.collection('users').findOne({
            "username": data.username 
        }, function(err, user){
            if(!user) {
                error('User'+ data.username +' was not found', res);
            } else {
                _comparePwds(data.password, user.password, function(err, isMatch) {
                    if(err) {
                        error('Error while authenticating', res);
                    }
                    if(!isMatch) {
                        error('Incorrect Password', res);
                    }
                    else {
                        var secret = process.env.NODE_SECRET_KEY;
                        var token = jsonwebtoken.sign(user, secret, {
                            expiresIn: (60 * 60 * 24)
                        });
                        response({
                            success: true,
                            message: 'Succefully authenticated',
                            token: token
                        }, res);
                    }
                });
            }
        });
    });
}

module.exports = function(request, res) {
    processPOSTrequest(request, function(data) {
        _authenticate(data, res);
    });
}
