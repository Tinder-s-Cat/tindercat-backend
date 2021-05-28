'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      User.hasMany(models.Cat)
      User.hasMany(models.IsLike)
      User.hasMany(models.Message)
    }
  };
  User.init({
    username: {
      type: DataTypes.STRING,
      validate : {
        notEmpty : {
          msg : "Username should not be empty"
        }
      }
    },
    location: {
    type: DataTypes.STRING,
    validate : {
      notEmpty : {
        msg : "Location should not be empty"
      }
    }
  },
    email: {
      type : DataTypes.STRING,
      validate : {
        isEmail : {
          msg : "Email is incorrect"
        },
        notEmpty : {
          msg : "Email should not be empty"
        }
      }
    },
    password: {
      type: DataTypes.STRING,
      validate : {
        notEmpty : {
          msg : "Password should not be empty"
        }
      }
    },
    profilePicture: DataTypes.TEXT
  }, {
    sequelize,
    modelName: 'User',
  });
  return User;
};