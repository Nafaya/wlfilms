const path     = require('path') ;
const express     = require('express') ;
var FilmController = require('../controllers/film') ;
var PageController = require('../controllers/page') ;

module.exports = function (app, config, sequelize) {
    var filmController = new FilmController(sequelize) ;
    var pageController = new PageController(sequelize) ;
    app.get('/films/:id',filmController.get.bind(filmController));
    app.get('/films',filmController.getAll.bind(filmController));
    app.delete('/films/:id',filmController.delete.bind(filmController));
    app.put('/films/:id',filmController.editOrCreate.bind(filmController));
    app.post('/films',filmController.add.bind(filmController));

    app.get('/',pageController.index.bind(pageController));
    app.use('/static/css',express.static(path.join(__dirname,'../public/css')));
    if(process.env.NODE_ENV==='production'){
        app.use('/static/js',express.static(path.join(__dirname,'../public/compiled-js')));
    }else{
        app.use('/static/js',express.static(path.join(__dirname,'../public/js')));
        console.log(path.join(__dirname,'../public/js')) ;
    }

	app.use(function(err, req, res, next) {
	    console.log(err) ;
        return res.jsend.error(err);
	});
};