module.exports = Ractive.extend({
    template: require('../../templates/navBar'),
    oninit: function() {
        var self = this;
        self.set('isLogged', userModel.isLogged());
        self.set('uname', userModel.getName());
    }
});
