const _     = require('underscore') ;
const path     = require('path') ;
module.exports = function(name, env=process.env.NODE_ENV || 'development'){
    var config = require(path.join(__dirname,name)) ;
    return _.defaults(config[env]||{},config['defaults']) ;
};