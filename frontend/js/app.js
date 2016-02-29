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
