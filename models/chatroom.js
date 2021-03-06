'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class ChatRoom extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      ChatRoom.hasMany(models.Message)
      ChatRoom.belongsTo(models.IsMatch)
    }
  };
  ChatRoom.init({
    IsMatchId: {
      type : DataTypes.INTEGER,
      references: {
        model: "IsMatches",
        key: "id",
      },
      onDelete: "CASCADE",
      onUpdate: "CASCADE"
    },
    uid: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'ChatRoom',
  });
  return ChatRoom;
};