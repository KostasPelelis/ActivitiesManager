var 
    Base = require('./Base'),
    ajax = require('../lib/Ajax')
;


module.exports = Base.extend({
    data: {
        url: '/api/user',
        authURL: 'api/auth',
        authToken: null
    },
    authenticate: function(callback) {
        var self = this;
        ajax.request({
            url: self.get('authURL'),
            method: 'POST',
            data: this.get('value'),
            json: true
        })
        .done(function(result) {
            if(callback) {
                callback(null, result);
            }
        })
        .fail(function(xhr) {
            if(callback) {
                callback(JSON.parse(xhr.responseText));
            }
        });
        return this;
    },
    dummyRequest: function() {
        var self = this;
        if(self.isLogged()) console.log('Found active token');
        ajax.request({
            url: 'api',
            method: 'GET',
            headers: {'x-access-token': self.get('authToken')}
        })
        .done(function(result) {
        })
        .fail(function(xhr) {
        });
    },
    logout: function() {
        var self = this;
        if(self.get('authToken')) {
            self.set('authToken', null);
        }
        if(window.localStorage.getItem('auth:token')) {
            window.localStorage.removeItem('auth:token');
        }
    },
    isLogged: function() {
        var self = this;
        if(self.get('authToken') == null) {
            console.warn('Didnt found active token, searching in storage');
            self.set('authToken', window.localStorage.getItem('auth:token'));    
        }
        return self.get('authToken') != null;
    }
});
