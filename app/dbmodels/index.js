function setup(sequelize, DataTypes) {
  require('./film')(sequelize, DataTypes);
  require('./dependencies')(sequelize, DataTypes);
  return sequelize;
}

module.exports = setup ;
