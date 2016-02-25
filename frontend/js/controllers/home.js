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
