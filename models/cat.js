'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Cat extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Cat.belongsTo(models.User),
      Cat.hasMany(models.IsLike)
    }
  };
  Cat.init({
    UserId: DataTypes.INTEGER,
    name: {
      type: DataTypes.STRING,
      validate : {
        notEmpty : {
          args: true,
          msg : "Name should not be empty"
        }
      }
    },
    gender: {
      type: DataTypes.STRING,
      validate : {
        notEmpty : {
          args: true,
          msg : "Gender should not be empty"
        }
      }
    },
    age: {
      type: DataTypes.INTEGER,
      validate : {
        notEmpty : {
          args: true,
          msg : "Age should not be empty"
        },
        isNumeric: {args: true, msg: "Age must be number"},
        min: { args: 1, msg: "the minimum age is 1" },
      }
    },
    race: {
      type: DataTypes.STRING,
      validate : {
        notEmpty : {
          args: true,
          msg : "Race should not be empty"
        }
      }
    },
    status: {
      type: DataTypes.BOOLEAN,
      defaultValue: true
    },
    profilePicture: {
      type: DataTypes.TEXT,
      validate : {
        notEmpty : {
          args: true,
          msg : "Profile picture should not be empty"
        }
      }
    },
    description: {
      type: DataTypes.STRING,
      validate : {
        notEmpty : {
          args: true,
          msg : "Description should not be empty"
        }
      }
    },
  }, {
    sequelize,
    modelName: 'Cat',
  });
  return Cat;
};