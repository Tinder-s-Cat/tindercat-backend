'use strict';
const {
  Model
} = require('sequelize');
const { hashPassword } = require('../helpers/bcrypt');
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
      User.hasMany(models.IsMatch)
    }
  };
  User.init({
    username: {
      type: DataTypes.STRING,
      unique: { args: true, msg: "username already exists" },
      validate : {
        notEmpty : {
          args: true,
          msg : "Username should not be empty"
        }
      }
    },
    location: {
      type: DataTypes.STRING,
      validate : {
        notEmpty : {
          args: true,
          msg : "Location should not be empty"
        }
      }
    },
    lat: {
      type: DataTypes.STRING,
    },
    lng: {
      type: DataTypes.STRING,
    },
    email: {
      type : DataTypes.STRING,
      unique: { args: true, msg: "email already exists" },
      validate : {
        isEmail : {
          msg : "Email is incorrect"
        },
        notEmpty : {
          args: true,
          msg : "Email should not be empty"
        }
      }
    },
    password: {
      type: DataTypes.STRING,
      validate : {
        notEmpty : {
          args: true,
          msg : "Password should not be empty"
        }
      }
    },
    profilePicture: DataTypes.TEXT
  }, {
    sequelize,
    modelName: 'User',
    hooks: {
      beforeCreate(instances) {
        instances.password = hashPassword(instances.password);
      },
    },
  });
  return User;
};