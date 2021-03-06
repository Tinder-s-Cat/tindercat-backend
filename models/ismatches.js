'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class IsMatch extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      IsMatch.hasOne(models.ChatRoom)
      IsMatch.belongsTo(models.User, {
        foreignKey : {
          name : 'UserId',
          allowNull : false
        },
        targetKey : "id",
        as : "User"
      })
      IsMatch.belongsTo(models.User, {
        foreignKey : {
          name : 'OwnerId',
          allowNull : false
        },
        targetKey : "id",
        as : "Owner"
      })
    }
  };
  IsMatch.init({
    UserId: DataTypes.INTEGER,
    OwnerId: DataTypes.INTEGER,
    status: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'IsMatch',
  });
  return IsMatch;
};