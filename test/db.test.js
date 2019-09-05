var path = require('path') ;
var assert = require('chai').assert ;
describe('DB', function() {
    process.env.NODE_ENV = process.env.NODE_ENV || 'development' ;
    console.log("Environment: "+process.env.NODE_ENV) ;
    const config = {
        path:path.normalize(path.join(__dirname,'..')),
        database:require('../app/config')('database')
    } ;
    var cls = require('continuation-local-storage'),
        namespace = cls.createNamespace('nafaya-namespace');
    var Sequelize = require('sequelize');
    Sequelize.useCLS(namespace) ;
    var sequelize = new Sequelize(config.database.database, config.database.username, config.database.password, config.database.options);
    sequelize.import('../app/dbmodels') ;
    it('should have a Film model', function() {
        assert.exists(sequelize.models.Film);
    });
    it('check connection', async function() {
        var films = await sequelize.models.Film.findAll({},{limit:1}) ;
    });
});