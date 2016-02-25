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
