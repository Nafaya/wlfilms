var path = require('path') ;
var fs = require('fs') ;
if (!fs.existsSync(path.normalize(path.join(__dirname,'../temp')))){
    fs.mkdirSync(path.normalize(path.join(__dirname,'../temp')));
}
if (!fs.existsSync(path.normalize(path.join(__dirname,'../temp/logs')))){
    fs.mkdirSync(path.normalize(path.join(__dirname,'../temp/logs')));
}