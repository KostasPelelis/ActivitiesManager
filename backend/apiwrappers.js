var _MongoClient = require('mongodb').MongoClient;
var _database;
var _getDatabaseConnection = function(callback) {
    if(_database) {
        callback(_database);
        return;
    } else {
        _MongoClient.connect(process.env.ACTIVITIES_DB_URI, function(err, db) {
            if(err) {
                throw err;
            }
            _database = db;
            callback(_database);
        });
    }
}

var _querystring = require('querystring');
var _processPOSTRequest = function(request, callback) {
    var body = '';
    request.on('data', function(data) {
        body += data;
    });
    request.on('end', function() {
        callback(_querystring.parse(body));
    });
}

var _validator = require('validator');
var _validate = function(dataType, data) {
    switch (dataType) {
    case 'username':
        if  (!_validator.isLength(data, {min: 4, max: 20}) ||
            (!_validator.isAlphanumeric(data))) return false;
        break;
    case 'email':
        if (!_validator.isEmail(data)) return false;
        break;
    case 'password':
        if  (!_validator.isLength(data + '', {min: 6, max: 20})) return false;
        break;
    }
    return true;
}


var _error = function(message, res) {
    res.writeHead(500, {'Content-Type': 'application/json'});
    res.end(JSON.stringify({error: message}) + '\n');
}

module.exports = {
    processPOSTRequest: _processPOSTRequest,
    getDatabaseConnection: _getDatabaseConnection,
    validate: _validate,
    error: _error,
}
