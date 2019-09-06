var FilmMolel = require('../models/film') ;
var DBView = require('../views/db_view')
var fs = require('fs')
function FilmController(sequelize){
    this.filmModel = new FilmMolel(sequelize) ;
}
FilmController.prototype.get = function(req,res,next){
    console.log('get') ;
    return this.filmModel.get(req.params['id']).then(function(dbfilm){
        return res.status(200).jsend.success(DBView.dbFilmToOutput(dbfilm));
    },next)
} ;
FilmController.prototype.getAll = function(req,res,next){
    console.log('getAll') ;
    return this.filmModel.get(req.query).then(function(dbfilms){
        return res.status(200).jsend.success(DBView.dbFilmsToOutput(dbfilms));
    },next)
} ;
FilmController.prototype.delete = function(req,res,next){
    console.log('delete') ;
    return this.filmModel.delete(req.params['id']).then(function(dbfilm){
        return res.status(200).jsend.success(DBView.dbFilmToOutput(dbfilm));
    },next)
} ;
FilmController.prototype.add = function(req,res,next){
    console.log('add') ;

    if(req.files && req.files.films){
        return this.filmModel.addFromFile(req.files.films).then(function(dbfilms){
            return res.status(201).jsend.success(DBView.dbFilmsToOutput(dbfilms));
        },function(err){
            if(err.name==='SequelizeUniqueConstraintError')
                throw new Error('Some of the films already exist in the base.') ;
            else throw err ;
        }).then(null,next) ;
    }
    return this.filmModel.add(req.body).then(function(dbfilm){
        return res.status(201).jsend.success(DBView.dbFilmToOutput(dbfilm));
    },function(err){
        if(err.name==='SequelizeUniqueConstraintError')
            throw new Error('The film already exists in the base.') ;
        else throw err ;
    }).then(null,next)
} ;
FilmController.prototype.editOrCreate = function(req,res,next){
    console.log('edit') ;
    return this.filmModel.editOrCreate(req.params['id'],req.body).then(function(dbfilm){
        return res.jsend.success(DBView.dbFilmToOutput(dbfilm));
    },next)
} ;
module.exports = FilmController ;