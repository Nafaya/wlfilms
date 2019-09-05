module.exports = function(sequelize, DataTypes) {
  var Film =  sequelize.define("Film", {
    id: {
      primaryKey: true,
      type: DataTypes.BIGINT,
      field:'id',
      autoIncrement: true
    },
    name: {
      type: DataTypes.STRING(255),
      field:'name'
    },
    realized_at: {
      type: DataTypes.INTEGER,
      field:'realized_at'
    },
    format: {
      type: DataTypes.STRING(16),
      field:'format'
    },
    actors: {
      type: DataTypes.TEXT,
      field:'actors'
    }
  },{
    timestamps: false,
    tableName:'wlfilms'
  }) ;
  return Film ;
} ;