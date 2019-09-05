const path = require('path') ;
function PageController(sequelize){
}
PageController.prototype.index = function(req,res){
    res.sendFile(path.join(__dirname, '../public/index.html'));
} ;
module.exports = PageController ;