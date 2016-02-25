var 
    Router      = require('./lib/router')(),
    Register    = require('./controllers/register'),
    Home        = require('./controllers/home'),
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

window.onload = function() {
    userModel = new UserModel();
    body = document.querySelector('body .container');
    Router
        .add('home', function() {
            var home = new Home();
            showPage(home);
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
