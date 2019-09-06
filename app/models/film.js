var Promise = require('bluebird') ;
var _ = require('underscore') ;
var fs = require('fs') ;
var Sequelize = require('nafaya-sequelize');
function FilmModel(sequelize){
    this.sequelize = sequelize ;
}
FilmModel.prototype.delete = function(id){
    var self = this ;
    var sequelize = self.sequelize ;
    var Film = sequelize.models.Film ;

    return Film.findByPk(id).then(function(dbfilm){
        if(!dbfilm) throw new Error('No such film.') ;
        return Film.destroy({
            where:{id:id}
        }).then(function(){
            return dbfilm ;
        })
    }) ;
} ;
FilmModel.prototype.get = function(obj){
    var self = this ;
    var sequelize = self.sequelize ;
    var Film = sequelize.models.Film ;

    if(Number.isInteger(obj)) return Film.findByPk(obj) ;
    var query_obj = {
        where:{},
        order:[['name','ASC']]
    } ;
    if(obj.query){
        if(obj.queryTarget==='actors'){
            query_obj.where.actors = {[Sequelize.Op.like]:'%'+obj.query+'%'}
        }else{
            query_obj.where.name = {[Sequelize.Op.like]:'%'+obj.query+'%'}
        }
    }
    return Film.findAll(query_obj) ;
} ;
FilmModel.prototype.add = function(data){
    var self = this ;
    var sequelize = self.sequelize ;
    var Film = sequelize.models.Film ;
    var filmsData = null ;
    if(Array.isArray(data)){
        filmsData = data ;
    } else {
        filmsData = [data] ;
    }
    return Promise.each(filmsData,function(filmData){
        return self.checkFilmInfo(filmData) ;
    }).then(function(){
        return Film.bulkCreate(filmsData,{returning:true, individualHooks: true}).then(function(dbfilms){
            if(Array.isArray(data)){
                return dbfilms ;
            } else {
                return dbfilms[0] ;
            }
        })
    })
} ;
FilmModel.prototype.checkFilmInfo = function(film, updating=false){
    let keys = _.keys(film) ;
    if(!updating||film.hasOwnProperty('name')){
        if(!film.name)
            throw new Error('Fill the name.') ;
    }
    if(!updating||film.hasOwnProperty('realized_at')){
        if(!film.realized_at)
            throw new Error('Fill the realized_at field.') ;
        let year = parseInt(film.realized_at) ;
        if(isNaN(year))
            throw new Error('Realized at field must be a year number.') ;
        let currentYear = (new Date()).getFullYear()+1 ;
        if(year<1850||year>currentYear)
            throw new Error('Realized at field must be between 1850 and '+currentYear+'.') ;
    }
    if(!updating||film.hasOwnProperty('format')){
        if(!film.format)
            throw new Error('Fill the format field.') ;
    }
    if(!updating||film.hasOwnProperty('actors')) {
        if (!film.actors) {
            throw new Error('Fill the actors field.');
            let actors = film.actors.split(/[\n,]/).map((str) => {
                str = str.trim();
                if (!str) throw new Error('Wrong actors format.');
                return str;
            });
            film.actors = actors.join(', ');
        }
    }
    return true;
} ;
FilmModel.prototype.editOrCreate = function(id,_filmData){
    var self = this ;
    var sequelize = self.sequelize ;
    var Film = sequelize.models.Film ;
    var filmData = _.pick(_filmData,['name','realized_at','format','actors']) ;
    return Promise.resolve().then(function(){
        this.checkFilmInfo(filmData, true) ;
    }).then(function(){
        return Film.findByPk(id) ;
    }).then(function(dbfilm){
        if(!dbfilm) throw new Error('No such film.') ;
        return dbfilm.update(filmData) ;
    })
} ;
FilmModel.prototype.addFromFile = function(file){
    return this.parseStrToFilms(file.data.toString()).then((filmsData)=>{
        return this.add(filmsData) ;
    })
} ;
/*
*Parse next format:
*
*
*
Title: Blazing Saddles
Release Year: 1974
Format: VHS
Stars: Mel Brooks, Clevon Little, Harvey Korman, Gene Wilder, Slim Pickens, Madeline Kahn

Title: Casablanca
Release Year: 1942
Format: DVD
Stars: Humphrey Bogart, Ingrid Bergman, Claude Rains, Peter Lorre

Title: Charade
Release Year: 1953
Format: DVD
Stars: Audrey Hepburn, Cary Grant, Walter Matthau, James Coburn, George Kennedy
*/
FilmModel.prototype.parseStrToFilms = function(str){
    var assos = {
        'Title':'name',
        'Release Year':'realized_at',
        'Format':'format',
        'Stars':'actors'
    }
    var current_filmData = {} ;
    var filledFields = {} ;
    var filledFieldsNum = 0 ;
    var regexp =  /^\s*([ \t\w]+):([^\n]+)/ ;
    var match ;
    var filmsData = [] ;
    while(match = regexp.exec(str)){
        var name = match[1].trim() ;
        var value = match[2].trim() ;
        if(!assos[name]) throw new Error('Wrong file format.') ;
        if(filledFields[name]) throw new Error('Wrong file format.') ;
        filledFields[name] = true ;
        current_filmData[assos[name]] = value ;
        filledFieldsNum++ ;
        if(filledFieldsNum===4){
            filmsData.push(current_filmData) ;
            current_filmData = {} ;
            filledFields = {} ;
            filledFieldsNum = 0 ;
        }
        str = str.slice(match[0].length+match.index) ;
    }
    if(filledFieldsNum) throw new Error('Wrong file format.') ;
    return Promise.resolve(filmsData) ;
} ;
module.exports = FilmModel ;