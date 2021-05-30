const {IsMatch} = require("../models");
const { Op } = require("sequelize");

async function authChatroom(req, res, next) {
  try {
    let id = +req.params.isMatchId;
    const findIsMatch = await IsMatch.findOne({
      where :  {
        status : "Match",
        id : id
      }
    })
    if (findIsMatch) {
      let data = findIsMatch.dataValues;
        if (data.UserId === req.loggedUser.id || data.OwnerId === req.loggedUser.id) {
          next()
        } else {
          throw { name: "Not authorized!" };
        }
    } else {
      throw { name: "Not authorized!" };
    }
  } catch (error) {
      next(error)
  }
}

module.exports = authChatroom