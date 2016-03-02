var    
    bcrypt                  = require('bcrypt'),
    apiwrappers             = require('../apiwrappers'),
    processPOSTRequest      = apiwrappers.processPOSTRequest,
    getDatabaseConnection   = apiwrappers.getDatabaseConnection,
    error                   = apiwrappers.error,
    validate                = apiwrappers.validate,
    userExists              = apiwrappers.userExists,
    response                = require('../response')
;

module.exports = function(req, res) {
    switch(req.method) {
    case 'POST':
        processPOSTRequest(req, function(data) {
            if( !data.username ||
                data.username === '' ||
                !validate('username', data.username))
                error('Invalid or missing username!', res);
            else if(!data.email || 
                data.email === '' ||
                !validate('email', data.email))
                error('Invalid or missing email.', res);
            else if(!data.password || 
                data.password === '' ||
                !validate('password'))
                error('Invalid or missing password', res);
            else {
                getDatabaseConnection(function(db) {
                    db.collection('users').findOne( {
                        $or: [
                            {"username": data.username},
                            {"email": data.email}
                        ]
                    }, function(err, result) {
                        if(result) { 
                            error('User with that username or email already exists', res);
                        } else {
                            data.password = bcrypt.hashSync(data.password, 10);
                            db.collection('users').insert(data, function(err, docs) {
                                response({
                                    success: 'OK'
                                }, res);
                            });
                        }
                    });
                });
            }
        });
        break;
    }
}
