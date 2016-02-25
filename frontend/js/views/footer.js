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

