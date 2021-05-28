'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class IsLike extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      IsLike.belongsTo(models.User)
      IsLike.belongsTo(models.Cat)
    }
  };
  IsLike.init({
    UserId: DataTypes.INTEGER,
    CatId: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'IsLike',
  });
  return IsLike;
};