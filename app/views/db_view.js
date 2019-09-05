module.exports = {
    dbFilmToOutput:function(dbfilm){
        return {
            id:dbfilm.id,
            name:dbfilm.name,
            realized_at:dbfilm.realized_at,
            format:dbfilm.format,
            actors:dbfilm.actors.split(', '),
        }
    },
    dbFilmsToOutput:function(dbfilms){
        return dbfilms.map((dbfilm)=>this.dbFilmToOutput(dbfilm))
    }
} ;