module.exports = Ractive.extend({
    onconstruct: function() {
        var self = this;
        self.set('name', userModel.get('userName'));
        self.set('isLoggged', userModel.isLogged());
    },
    template: require('../../templates/navBar')
});
