var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var methodOverride = require('method-override');
var compress = require('compression');
var fileUpload = require('express-fileupload');
var jsend = require('jsend');
var path = require('path');
module.exports = (function (app,config,sequelize) {
    app.use(function(req,res,next){
        req.sequelize = sequelize ;
        next() ;
    }) ;
    app.disable('etag') ;
    app.disable('x-powered-by') ;
    app.set("layout extractScripts", true) ;
    app.use(compress());


    app.use(cookieParser());
    app.use(bodyParser.urlencoded({ limit:'50mb', extended: false }));
    app.use(bodyParser.json({ limit:'50mb'}));
    app.use(fileUpload({
        preserveExtension:true,
        //limits: { fileSize: 50 * 1024 * 1024 }
    }));
    app.use(methodOverride());
    app.use(jsend.middleware);
}) ;
