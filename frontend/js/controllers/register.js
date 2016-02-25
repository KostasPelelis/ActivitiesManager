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
