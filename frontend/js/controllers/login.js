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
