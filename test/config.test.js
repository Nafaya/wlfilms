var path = require('path') ;
var assert = require('chai').assert ;
describe('#Config', function() {
    describe('#Database', function() {
        describe('#Development', function() {
            var config = {
                database:require('../app/config')('database','development')
            } ;
            it('should load a config obj', function() {
                assert.exists(config.database);
            });
            it('should have a database property', function() {
                assert.exists(config.database.database);
            });
            it('should have a username property', function() {
                assert.exists(config.database.username);
            });
            it('should have a username password', function() {
                assert.exists(config.database.password);
            });
            it('should have a username options', function() {
                assert.exists(config.database.options);
            });
        });
        describe('#Production', function() {
            var config = {
                database:require('../app/config')('database','production')
            } ;
            it('should load a config obj', function() {
                assert.exists(config.database);
            });
            it('should have a database property', function() {
                assert.exists(config.database.database);
            });
            it('should have a username property', function() {
                assert.exists(config.database.username);
            });
            it('should have a username password', function() {
                assert.exists(config.database.password);
            });
            it('should have a username options', function() {
                assert.exists(config.database.options);
            });
        });
        describe('#Testing', function() {
            var config = {
                database:require('../app/config')('database','testing')
            } ;
            it('should load a config obj', function() {
                assert.exists(config.database);
            });
            it('should have a database property', function() {
                assert.exists(config.database.database);
            });
            it('should have a username property', function() {
                assert.exists(config.database.username);
            });
            it('should have a username password', function() {
                assert.exists(config.database.password);
            });
            it('should have a username options', function() {
                assert.exists(config.database.options);
            });
        });
    }) ;
    describe('#server', function() {
        describe('#Development', function() {
            var config = {
                server:require('../app/config')('server','development')
            } ;
            it('should load a config obj', function() {
                assert.exists(config.server);
            });
            it('should have a port property', function() {
                assert.exists(config.server.port);
            });
        });
        describe('#Production', function() {
            var config = {
                server:require('../app/config')('server','production')
            } ;
            it('should load a config obj', function() {
                assert.exists(config.server);
            });
            it('should have a port property', function() {
                assert.exists(config.server.port);
            });
        });
        describe('#Testing', function() {
            var config = {
                server:require('../app/config')('server','testing')
            } ;
            it('should load a config obj', function() {
                assert.exists(config.server);
            });
            it('should have a port property', function() {
                assert.exists(config.server.port);
            });
        });
    }) ;
    describe('#application', function() {
        describe('#Development', function() {
            var config = {
                app:require('../app/config')('app','development')
            } ;
            it('should load a config obj', function() {
                assert.exists(config.app);
            });
        });
        describe('#Production', function() {
            var config = {
                app:require('../app/config')('app','production')
            } ;
            it('should load a config obj', function() {
                assert.exists(config.app);
            });
        });
        describe('#Testing', function() {
            var config = {
                app:require('../app/config')('app','testing')
            } ;
            it('should load a config obj', function() {
                assert.exists(config.app);
            });
        });
    }) ;
});