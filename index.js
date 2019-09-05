//load libraries
const path        = require('path') ;
const express     = require('express') ;
const _     = require('underscore') ;
const winston     = require('winston') ;
var environment = require('./app/config/environment') ;
var routes      = require('./app/config/routes') ;

//load config files
process.env.NODE_ENV = process.env.NODE_ENV || 'development' ;
console.log("Environment: "+process.env.NODE_ENV) ;
const config = {
    path:path.normalize(__dirname),
    app:require('./app/config')('app'),
    server:require('./app/config')('server'),
    database:require('./app/config')('database')
} ;

/*var Winston = require("winston") ;
const logger = winston.createLogger({
    level: config.app.winston.level||'info',
    transports: [
        //
        // - Write to all logs with level `info` and below to `combined.log`
        // - Write all logs error (and below) to `error.log`.
        //
        new (Winston.transports.Console)({
            colorize: true,
            level: 'debug',
            json: false
        }),
        new winston.transports.File({
            filename: path.normalize(path.join(__dirname,'temp/logs/error.log')),
            level: 'error',
            timestamp: true,
            json: true
        }),
        new winston.transports.File({
            filename: path.normalize(path.join(__dirname,'temp/logs/combined.log')),
            timestamp: true,
            json: true
        })
    ]
});
if (process.env.NODE_ENV !== 'production') {
    logger.add(new winston.transports.Console({
        colorize: true,
        format: winston.format.simple()
    }));
}*/

var cls = require('continuation-local-storage'),
    namespace = cls.createNamespace('nafaya-namespace');
var Sequelize = require('nafaya-sequelize');
Sequelize.useCLS(namespace) ;
var sequelize = new Sequelize(config.database.database, config.database.username, config.database.password, config.database.options);
sequelize.import('app/dbmodels') ;

global.config = config ;
global.logger = logger ;

console.log('Server starting...') ;
var app = express();

environment(app,config,sequelize);
routes(app,config,sequelize);
app.listen(config.server.port, function () {
    console.log("Listening on port " + config.server.port);
}).on('error', function (e) {
    console.log(e.stack);
    process.exit();
});