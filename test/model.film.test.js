var path = require('path') ;
var assert = require('chai').assert ;
describe('#Models', function() {
    describe('#Film', function() {
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

        var FilmModel = require('../app/models/film') ;
        var filmModel = new FilmModel(sequelize) ;
        after(function(){
            sequelize.close(true) ;
        }) ;
        it('should parse result fine', async function(){
            var original_str = "Title: Charade\n" +
                "Release Year: 1953\n" +
                "Format: DVD\n" +
                "Stars: Audrey Hepburn, Cary Grant, Walter Matthau, James Coburn, George Kennedy" ;
            var result = [
                {
                    name: 'Charade',
                    realized_at:'1953',
                    format:'DVD',
                    actors:'Audrey Hepburn, Cary Grant, Walter Matthau, James Coburn, George Kennedy',
                }
            ] ;
            var parsed_result = await filmModel.parseStrToFilms(original_str) ;
            assert.exists(parsed_result) ;
            assert.equal(parsed_result.length,1) ;
            assert.equal(parsed_result[0].name,'Charade') ;
            assert.equal(parsed_result[0].realized_at,'1953') ;
            assert.equal(parsed_result[0].format,'DVD') ;
            assert.equal(parsed_result[0].actors,'Audrey Hepburn, Cary Grant, Walter Matthau, James Coburn, George Kennedy') ;
        }) ;
    }) ;
});