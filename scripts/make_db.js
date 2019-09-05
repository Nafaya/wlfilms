//loading libraries
const path        = require('path') ;
const express     = require('express') ;
const _     = require('underscore') ;
const fs = require("fs");

process.env.NODE_ENV = process.env.NODE_ENV || 'development' ;
console.log("Environment: "+process.env.NODE_ENV) ;
const config = {
    path:path.normalize(__dirname),
    database:require('../app/config')('database')
} ;

var cls = require('continuation-local-storage'),
    namespace = cls.createNamespace('nafaya-namespace');
var Sequelize = require('nafaya-sequelize');
Sequelize.useCLS(namespace) ;
var sequelize = new Sequelize(config.database.database, config.database.username, config.database.password, config.database.options);
sequelize.import('../app/dbmodels') ;

var migrateFromFile = function(dbName, mysqlDumpFile) {
    console.log("Importing from " + mysqlDumpFile + "...");
    let queries = fs.readFileSync(mysqlDumpFile).toString().split(";");
    let sql = fs.readFileSync(mysqlDumpFile).toString() ;

    console.log("Importing dump file...");

    // Setup the DB to import data in bulk.
    let promise = sequelize.query("set FOREIGN_KEY_CHECKS=0"
    ).then(() => {
        console.log('1') ;
        return sequelize.query("set UNIQUE_CHECKS=0");
    }).then(() => {
        console.log('2') ;
        return sequelize.query("BEGIN");
    }).then(() => {
        console.log('3') ;
        return sequelize.query("DROP DATABASE IF EXISTS `"+config.database.database+"`");
    }).then(() => {
        console.log('4') ;
        return sequelize.query("CREATE DATABASE `"+config.database.database+"`");
    }).then(() => {
        console.log('5') ;
        return sequelize.query("USE `"+config.database.database+"`");
    });

    console.time("Importing mysql dump");
    console.log(queries) ;
    for (let query of queries) {
        query = query.trim();
        if (query.length !== 0 && !query.match(/\/\*/)) {
            promise = promise.then(() => {
                console.log("Executing: " + query);
                return sequelize.query(query, {raw: true});
            })
        }
    }
    promise = promise.then(()=>{
        return sequelize.query("COMMIT");
    }).then(()=>{
        return sequelize.query("set FOREIGN_KEY_CHECKS=1");
    }).then(()=>{
        return sequelize.query("set UNIQUE_CHECKS=1");
    }) ;
    return promise ;
};
migrateFromFile(config.database.database,path.normalize(path.join(__dirname,'../data/wlfilms.sql'))).then(function(){
    console.log('Finished!') ;
}) ;