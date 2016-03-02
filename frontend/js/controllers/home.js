module.exports = Ractive.extend({
    template: require('../../templates/home'),
    components: {
        loginTpl: require('./login'),
        navBar: require('../views/navBar')
    },
    onrender: function() {
        this.on('addNewPlace', function() {
            console.log('Adding new Place');
            if(!userModel.isLogged()) {
                $('.ui.modal')
                    .modal({
                        blurring: true
                    })
                    .modal('show');
            }
        });
        this.on('login', function() {
            console.log('User Login Succesfully');
            $('.ui.modal').modal('hide');
        });
        this.on('logout', function() {
            
        });
        console.info('Home Page Rendered!');
    }
});
