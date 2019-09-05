const path = require('path') ;
function PageController(sequelize){
}
PageController.prototype.index = function(req,res){
    if(process.env.NODE_ENV==='production'){
        res.sendFile(path.join(__dirname, '../public/index.production.html'));
    }else{
        res.sendFile(path.join(__dirname, '../public/index.html'));
    }
} ;
module.exports = PageController ;