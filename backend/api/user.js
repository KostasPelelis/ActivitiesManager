var    
    bcrypt                  = require('bcrypt'),
    apiwrappers             = require('./apiwrappers'),
    processPOSTRequest      = apiwrappers.processPOSTRequest,
    getDatabaseConnection   = apiwrappers.getDatabaseConnection,
    error                   = apiwrappers.error,
    validate                = apiwrappers.validate,
    userExists              = apiwrappers.userExists,
    response                = require('./response')
;

module.exports = function(req, res) {
    switch(req.method) {
        case 'GET':
//            if(req.session && req.session.user) {
//                response(req.session.user, res);
//            } else {
//                response({}, res);
//            }
            break;
        case 'PUT':
//            processPOSTRequest(req, function(data) {
//                if(!data.firstName || data.firstName === '') {
//                    error('Please fill your first name.', res);
//                } else if(!data.lastName || data.lastName === '') {
//                    error('Please fill your last name.', res);
//                } else {
//                    getDatabaseConnection(function(db) {
//                        var collection = db.collection('users');
//                        if(data.password) {
//                            data.password = sha1(data.password);
//                        }
//                        collection.update(
//                            { email: req.session.user.email },
//                            { $set: data }, 
//                            function(err, result) {
//                                if(err) {
//                                    err('Error updating the data.');
//                                } else {
//                                    if(data.password) delete data.password;
//                                    for(var key in data) {
//                                    req.session.user[key] = data[key];
//                                }
//                                response({
//                                        success: 'OK'
//                                    }, res);
//                                }
//                            }
//                        );
//                    });
//                }
//            });
            break;
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
        case 'DELETE':
//            getDatabaseConnection(function(db) {
//                var collection = db.collection('users');
//                collection.remove(
//                    { email: req.session.user.email },
//                    function(err, docs) {
//                        delete req.session.user;
//                        response({
//                          success: 'OK'
//                        }, res);
//                    }
//                );
//            });
            break;
    };
}
