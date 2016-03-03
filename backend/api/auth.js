var
    apiwrappers             = require('../apiwrappers'),
    response               = require('../response'),
    bcrypt                  = require('bcrypt'),
    crypto                  = require('crypto'),
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



_updateUserToken = function(db, username, token, callback) {
    var hashedToken = crypto.createHash('md5').update(token).digest('hex')
    db.collection('users').updateOne(
        {"username": username},
        {
            $set: {"auth:token": token},
            $currentDate: {"lastModified": true}
        }, function(err, results) {
            if(err) {
               callback(err, results); 
            } else {
                console.log('Updated user token');
                callback(null, results);
            }
        }
    );
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
                        _updateUserToken(db, data.username, token, function(err, results) {
                            response({
                                success: true,
                                message: 'Succefully authenticated',
                                token: token
                            }, res);
                        });
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
