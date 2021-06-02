const {Cat} = require("../models");

async function authorizationCat(req, res, next) {
    try {
      Cat.findByPk(+req.params.id)
        .then((data) => {
          if (data) {
            if (data.UserId === req.loggedUser.id) {
              next();
            } else {
              throw { name: "Not authorized!" };
            }
          } else {
            throw { name: "Cat not found" };
          }
        })
        .catch((err) => {
          next(err)
        });
    } catch (error) {
      next(error);
    }
  }

  module.exports = authorizationCat