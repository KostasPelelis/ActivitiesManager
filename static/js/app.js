(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);throw new Error("Cannot find module '"+o+"'")}var f=n[o]={exports:{}};t[o][0].call(f.exports,function(e){var n=t[o][1][e];return s(n?n:e)},f,f.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
module.exports = Ractive.extend({
    template: require('../../templates/home'),
    components: {
    },
    onrender: function() {
        this.on('create', function(result, error) {
            if(error) {
                self.set('error', error.error);
            } else {
                self.set('error', false);
                window.location.href = '/register';
            }
        });
        console.info('Home Page Rendered!');
    }
});

},{"../../templates/home":12}],2:[function(require,module,exports){
module.exports = Ractive.extend({
    template: require('../../templates/login'),
    components: {
        footerTemplate: require('../views/footer')
    },
    onrender: function() {
        var self = this;
        this.observe('username',userModel.setter('value.username'));
        this.observe('password',userModel.setter('value.password'));
        this.on('login', function() {
            userModel.authenticate(function(error, result) {
                if(error) {
                    self.set('error', error.error);
                } else {
                    self.set('error', false);
                    self.set('success', 'Login Succeful.');
                    var token = result.token;
                    userModel.set('authToken', token);
                    window.localStorage.setItem('auth:token', token);
                }
            });
    });
    }
});

},{"../../templates/login":13,"../views/footer":10}],3:[function(require,module,exports){
module.exports = Ractive.extend({
    template: require('../../templates/register'),
    components: {
        footerTemplate: require('../views/footer')
    },
    onrender: function() {
        var self = this;
        this.observe('username',userModel.setter('value.username'));
        this.observe('email',userModel.setter('value.email'));
        this.observe('password',userModel.setter('value.password'));
        this.on('register', function() {
            userModel.create(function(error, reusult) {
                if(error) {
                    self.set('error', error.error);
                } else {
                    self.set('error', false);
                    self.set('success', 'Registration successful.Click <a href="/login">here</a> to login.');
                }
            });
        console.info('Registration Page Rendered!');
        });
    }
});

},{"../../templates/register":14,"../views/footer":10}],4:[function(require,module,exports){
var 
    Router      = require('./lib/router')(),
    Register    = require('./controllers/register'),
    Home        = require('./controllers/home'),
    Login       = require('./controllers/login'),
    UserModel   = require('./models/user')
;
    
var 
    currentPage,
    body
;

var showPage = function(newPage) {
    if(currentPage) { currentPage.teardown(); }
    currentPage = newPage;
    body.innerHTML = '';
    currentPage.render(body);
    currentPage.on('navigation.goto', function(e, route) {
        router.navigate(route);
    });
}

var showModel = function(model, entryID) {
    var entry = document.getElementById(entryID);
    entry.innerHTML = '';
    model.render(entry);
}

window.onload = function() {
    userModel = new UserModel();
    body = document.querySelector('body .container');
    Router
        .add('home', function() {
            var home = new Home();
            var login = new Login();
            showPage(home);
            showModel(login, 'login-container');
        })
        .add('register', function() {
            var reg = new Register();
            showPage(reg);
        })
        .add(function() {
            Router.navigate('home');
        })
        .listen()
        .check();
}

},{"./controllers/home":1,"./controllers/login":2,"./controllers/register":3,"./lib/router":6,"./models/user":9}],5:[function(require,module,exports){
module.exports = {
  request: function(ops) {
    if(typeof ops == 'string') ops = { url: ops };
    ops.url = ops.url || '';
    console.log('Performing new Ajax requesti @ ' + ops.url);
    ops.method = ops.method || 'get'
    ops.data = ops.data || {};
    var getParams = function(data, url) {
      var arr = [], str;
      for(var name in data) {
        arr.push(name + '=' + encodeURIComponent(data[name]));
      }
      str = arr.join('&');
      if(str != '') {
        return url ? (url.indexOf('?') < 0 ? '?' + str : '&' + str) : str;
      }
      return '';
    }
    var api = {
      host: {},
      process: function(ops) {
        var self = this;
        this.xhr = null;
        if(window.ActiveXObject) { this.xhr = new ActiveXObject('Microsoft.XMLHTTP'); }
        else if(window.XMLHttpRequest) { this.xhr = new XMLHttpRequest(); }
        if(this.xhr) {
          this.xhr.onreadystatechange = function() {
            if(self.xhr.readyState == 4 && self.xhr.status == 200) {
              var result = self.xhr.responseText;
              if(ops.json === true && typeof JSON != 'undefined') {
                result = JSON.parse(result);
              }
              self.doneCallback && self.doneCallback.apply(self.host, [result, self.xhr]);
            } else if(self.xhr.readyState == 4) {
              self.failCallback && self.failCallback.apply(self.host, [self.xhr]);
            }
            self.alwaysCallback && self.alwaysCallback.apply(self.host, [self.xhr]);
          }
        }
        if(ops.method == 'get') {
          this.xhr.open("GET", ops.url + getParams(ops.data, ops.url), true);
        } else {
          if(ops.formData) {
            this.xhr.open(ops.method, ops.url);
          } else {
            this.xhr.open(ops.method, ops.url, true);
            this.setHeaders({
              'X-Requested-With': 'XMLHttpRequest',
              'Content-type': 'application/x-www-form-urlencoded'
            });
          }
        }
        if(ops.headers && typeof ops.headers == 'object') {
          this.setHeaders(ops.headers);
        }       
        setTimeout(function() {
          if(ops.formData) {
            self.xhr.send(ops.formData); 
          } else {
            ops.method == 'get' ? self.xhr.send() : self.xhr.send(getParams(ops.data)); 
          }
        }, 20);
        return this;
      },
      done: function(callback) {
        this.doneCallback = callback;
        return this;
      },
      fail: function(callback) {
        this.failCallback = callback;
        return this;
      },
      always: function(callback) {
        this.alwaysCallback = callback;
        return this;
      },
      setHeaders: function(headers) {
        for(var name in headers) {
          this.xhr && this.xhr.setRequestHeader(name, headers[name]);
        }
      }
    }
    return api.process(ops);
  }
}

},{}],6:[function(require,module,exports){
/*
 * Website Router
 * -------------------------------------------
 *  
 * A generic class that handles
 * the routing and the navigation within
 * the web application. It supports 3 actions
 * add : Add a new route to the website
 * check : Check if a route/function is valid
 * listen : Wait for changes in the url and 
 * triger the appropriate events
 *
 */


module.exports = function() {
    return {
        routes: [],
        root: '/',
        getFragment: function() {
            var fragment = '';
            fragment = this.clearSlashes(decodeURI(location.pathname + location.search));
            fragment = fragment.replace(/\?(.*)$/, '');
            fragment = this.root !== '/' ? fragment.replace(this.root, '') : fragment;
            return this.clearSlashes(fragment);
        },
        add: function(path, handler) {
            // A path can have either a callback
            // handler or it can be a handler
            if(typeof path === 'function') {
                handler = path;
                path = '';
            }
            console.info('Adding new route: ' + path);
            this.routes.push({
                path: path,
                handler: handler
            });
            return this;
        },
        check: function(fragment, params) {
            var _fragment, vars;
            if(typeof fragment !== 'undefined') {
                _fragment = fragment.replace(/^\//, '');
            }
            else {
                _fragment = this.getFragment();
            }
            // For each route check if it contatins variables
            // like /scores/:user/:id
            for(var i = 0; i < this.routes.length; i++) {
                var match, path = this.routes[i].path;
                // Remove the initial and last slashes
                path = path.replace(/^\//, '');
                // Find all variables which are formated
                // /:var1/:var2/path/
                vars = path.match(/:[^\s/]+/g);
                var r = new RegExp('^' + path.replace(/:[^\s/]+/g, '([\\w-]+)'));
                match = _fragment.match(r);
                if(match) {
                    match.shift();
                    var matchObj = {};
                    if(vars) {
                        for(j = 0; j < vars.length; j++){
                            var v = vars[j];
                            matchObj[v.substr(1, v.length)] = match[j];
                        }
                    }
                    this.routes[i].handler.apply({}, (params || []).concat([matchObj]));
                    return this;
                }
            }
        },
        listen: function() {
            var self = this;
            var current = self.getFragment();
            var fn = function() {
                if(current !== self.getFragment()) {
                    current = self.getFragment();
                    self.check(current);
                }
            }
            clearInterval(this.interval);
            this.interval = setInterval(fn, 50);
            return this;
        },
        clearSlashes: function(path) {
            return path.toString().replace(/\/$/, '').replace(/^\//, '');
        },
        navigate: function(path) {
            path = path ? path : '';
            history.pushState(null, null, this.root + this.clearSlashes(path));
            return this;
        }
    }
}

},{}],7:[function(require,module,exports){
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

},{"../lib/Ajax":5}],8:[function(require,module,exports){
var 
    Base = require('./Base')
;


module.exports = Base.extend({
    data: {
        url: '/api/version'
    }
});



},{"./Base":7}],9:[function(require,module,exports){
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

},{"../lib/Ajax":5,"./Base":7}],10:[function(require,module,exports){
var 
    VersionModel = require('../models/Version')
;

module.exports = Ractive.extend({
    template: require('../../templates/footer'),
    onrender: function() {
        var versionModel = new VersionModel();
        versionModel.bindComponent(this).fetch();
    }
});


},{"../../templates/footer":11,"../models/Version":8}],11:[function(require,module,exports){
module.exports = {"v":3,"t":[{"t":7,"e":"div","a":{"class":"footer"},"f":[{"t":7,"e":"div","a":{"class":"ui inverted vertical footer segment"},"f":[{"t":7,"e":"div","a":{"class":"ui horizontal list"},"f":[{"t":7,"e":"div","a":{"class":"item"},"f":[{"t":7,"e":"i","a":{"class":"large html5 centered icon"}}]}," ",{"t":7,"e":"div","a":{"class":"item"},"f":[{"t":7,"e":"i","a":{"class":"large css3 centered icon"}}]}]}]}]}]}
},{}],12:[function(require,module,exports){
module.exports = {"v":3,"t":[{"t":7,"e":"div","a":{"id":"login-container"},"f":[]}," ",{"t":7,"e":"div","a":{"class":"ui grid"},"f":[{"t":7,"e":"div","a":{"class":"two wide column"},"f":[]}," ",{"t":7,"e":"div","a":{"class":"four wide column"},"f":[{"t":7,"e":"h4","f":["ADD FRIENDS"]}," ",{"t":7,"e":"p","f":["Add the email of your friends you want to share your trip with"]}," ",{"t":7,"e":"div","a":{"class":"add-friends"},"f":[{"t":7,"e":"div","a":{"class":"ui input add"},"f":[{"t":7,"e":"input","a":{"type":"text","placeholder":"Email or Username"}}]}," ",{"t":7,"e":"button","a":{"class":"ui blue button"},"f":["ADD"]}," ",{"t":7,"e":"div","a":{"class":"add-body"},"f":[{"t":7,"e":"p","f":["Friends So Far:"]}]}]}," ",{"t":7,"e":"h4","f":["ADD DESTINATION"]}," ",{"t":7,"e":"p","f":["Add the destinatons your trip is going to have"]}," ",{"t":7,"e":"div","a":{"class":"add-places"},"f":[{"t":7,"e":"p","f":["Search for your place"]}," ",{"t":7,"e":"div","a":{"class":"ui fluid icon input add-place"},"f":[{"t":7,"e":"input","a":{"type":"text","placeholder":"Destination Name"}}," ",{"t":7,"e":"i","a":{"class":"inverted circular search link blue icon"}}]}," ",{"t":7,"e":"div","a":{"class":"ui grid"},"f":[{"t":7,"e":"div","a":{"class":"eight wide column start-date"},"f":[{"t":7,"e":"p","f":["Begin At:"]}," ",{"t":7,"e":"div","a":{"class":"ui icon input fluid"},"f":[{"t":7,"e":"input","a":{"type":"text","placeholder":"15/01/2016"}}," ",{"t":7,"e":"i","a":{"class":"calendar icon"},"f":[]}]}]}," ",{"t":7,"e":"div","a":{"class":"eight wide column end-date"},"f":[{"t":7,"e":"p","f":["Leave At:"]}," ",{"t":7,"e":"div","a":{"class":"ui icon input fluid"},"f":[{"t":7,"e":"input","a":{"type":"text","placeholder":"27/02/2016"}}," ",{"t":7,"e":"i","a":{"class":"calendar icon"},"f":[]}]}]}," ",{"t":7,"e":"div","a":{"class":"sixteen wide column end-date"},"f":[{"t":7,"e":"p","f":["We will travel with:"]}," ",{"t":7,"e":"div","a":{"class":"ui icon input fluid"},"f":[{"t":7,"e":"input","a":{"type":"text","placeholder":"Transportation"}}," ",{"t":7,"e":"i","a":{"class":"plane icon"},"f":[]}]}]}," ",{"t":7,"e":"div","a":{"class":"ten wide column end-date"},"f":[{"t":7,"e":"p","f":["Estimated Cost:"]}," ",{"t":7,"e":"div","a":{"class":"ui icon input fluid"},"f":[{"t":7,"e":"input","a":{"type":"text","placeholder":"Cost"}}," ",{"t":7,"e":"i","a":{"class":"euro icon"},"f":[]}]}]}," ",{"t":7,"e":"div","a":{"class":"eight wide column end-date"},"f":[{"t":7,"e":"button","a":{"class":"ui green button fluid"},"f":["ADD PLACE"]}]}]}]}]}," ",{"t":7,"e":"div","a":{"class":"ten wide column"},"f":[{"t":7,"e":"iframe","a":{"src":"https://www.google.com/maps/embed?pb=!1m14!1m12!1m3!1d295111.11422058253!2d24.972747426560392!3d54.69984791098937!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!5e0!3m2!1sen!2sus!4v1456406421655","width":"853","height":"700","frameborder":"0","style":"border:0","allowfullscreen":0}}]}]}]}
},{}],13:[function(require,module,exports){
module.exports = {"v":3,"t":[{"t":7,"e":"div","a":{"class":"ui modal"},"f":[{"t":7,"e":"div","a":{"class":"login-form"},"f":[{"t":7,"e":"form","a":{"class":"ui form"},"f":[{"t":4,"f":[{"t":7,"e":"div","a":{"class":"error"},"f":[{"t":2,"r":"error"}]}],"n":50,"x":{"r":["error"],"s":"_0&&_0!=\"\""}}," ",{"t":4,"f":[{"t":7,"e":"div","a":{"class":"success"},"f":[{"t":3,"r":"success"}]}],"n":50,"x":{"r":["success"],"s":"_0&&_0!=\"\""}},{"t":4,"n":51,"f":[{"t":7,"e":"div","a":{"class":"register-title"},"f":[{"t":7,"e":"h2","f":["Login"]}]}," ",{"t":7,"e":"div","a":{"id":"username","class":"ui fluid left icon input"},"f":[{"t":7,"e":"i","a":{"class":"user icon"}}," ",{"t":7,"e":"input","a":{"type":"text","id":"username","value":[{"t":2,"r":"username"}],"placeholder":"Username"}}]}," ",{"t":7,"e":"div","a":{"id":"pwd","class":"ui fluid left icon input"},"f":[{"t":7,"e":"i","a":{"class":"lock icon"}}," ",{"t":7,"e":"input","a":{"type":"password","value":[{"t":2,"r":"password"}],"placeholder":"Password"}}]}," ",{"t":7,"e":"input","a":{"type":"button","class":"fluid ui button","value":"Submit"},"v":{"click":"login"}}],"x":{"r":["success"],"s":"_0&&_0!=\"\""}}]}]}]}]}
},{}],14:[function(require,module,exports){
module.exports = {"v":3,"t":[{"t":7,"e":"div","a":{"class":"register-form"},"f":[{"t":7,"e":"form","a":{"class":"ui form"},"f":[{"t":4,"f":[{"t":7,"e":"div","a":{"class":"error"},"f":[{"t":2,"r":"error"}]}],"n":50,"x":{"r":["error"],"s":"_0&&_0!=\"\""}}," ",{"t":4,"f":[{"t":7,"e":"div","a":{"class":"success"},"f":[{"t":3,"r":"success"}]}],"n":50,"x":{"r":["success"],"s":"_0&&_0!=\"\""}},{"t":4,"n":51,"f":[{"t":7,"e":"div","a":{"class":"register-title"},"f":[{"t":7,"e":"h2","f":["Register!"]}]}," ",{"t":7,"e":"div","a":{"id":"username","class":"ui fluid left icon input"},"f":[{"t":7,"e":"i","a":{"class":"user icon"}}," ",{"t":7,"e":"input","a":{"type":"text","id":"username","value":[{"t":2,"r":"username"}],"placeholder":"Username"}}]}," ",{"t":7,"e":"div","a":{"id":"email","class":"ui fluid left icon input"},"f":[{"t":7,"e":"i","a":{"class":"mail icon"}}," ",{"t":7,"e":"input","a":{"type":"email","id":"email","value":[{"t":2,"r":"email"}],"placeholder":"Email"}}]}," ",{"t":7,"e":"div","a":{"id":"pwd","class":"ui fluid left icon input"},"f":[{"t":7,"e":"i","a":{"class":"lock icon"}}," ",{"t":7,"e":"input","a":{"type":"password","value":[{"t":2,"r":"password"}],"placeholder":"Password"}}]}," ",{"t":7,"e":"input","a":{"type":"button","class":"fluid ui button","value":"Submit"},"v":{"click":"register"}}],"x":{"r":["success"],"s":"_0&&_0!=\"\""}}]}]}," ",{"t":7,"e":"footerTemplate"}]}
},{}]},{},[4])