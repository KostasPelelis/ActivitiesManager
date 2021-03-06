var 
    ajax = require('../lib/Ajax')
;

module.exports = Ractive.extend({
    data: {
        value: null,
        url: ''
    },
    create: function(callback) {
        var self = this;
        ajax.request({
            url: self.get('url'),
            method: 'POST',
            data: this.get('value'),
            json: true
        })
        .done(function(result) {
            console.log('success' + result);
            if(callback) {
                callback(null, result);
            }
        })
        .fail(function(xhr) {
            console.log('Error json');
            console.log(xhr);
            if(callback) {
                callback(JSON.parse(xhr.responseText));
            }
        });
        return this;
    },
    save: function(callback) {
        var self = this;
        ajax.request({
            url: self.get('url'),
            method: 'PUT',
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
    remove: function(callback) {
        var self = this;
        ajax.request({
            url: self.get('url'),
            method: 'DELETE',
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
    fetch: function() {
        var self = this;
        ajax.request({
            url: self.get('url'),
            json: true
        })
        .done(function(result) {
            self.set('value', result);
        })
        .fail(function(xhr) {
            self.fire('Error while fetching ' + self.get('url'))
        });
        return this;
    },
    bindComponent: function(component) {
        if(component) {
            this.observe('value', function(v) {
                for(var key in v) {
                    component.set(key, v[key]);
                }
            },{ 
                init: false 
            });
        }
        return this;
    },
    setter: function(key) {
        var self = this;
        return function(v) {
            self.set(key, v);
        }
    }
});
