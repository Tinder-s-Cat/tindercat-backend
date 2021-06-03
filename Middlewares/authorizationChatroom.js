const {IsMatch, ChatRoom} = require("../models");

async function authChatroom(req, res, next) {
  try {
    let isMatchId = +req.params.isMatchId;
    let chatroomId = +req.params.id;
    const findIsMatch = await IsMatch.findOne({
      where :  {
        status : "match",
        id : isMatchId
      }
    })
    const findChatRoom = await ChatRoom.findOne({
      where :  {
        id : chatroomId,
      }
    })
    if (findIsMatch) {
      let data = findIsMatch.dataValues;
        if ((data.UserId === req.loggedUser.id || data.OwnerId === req.loggedUser.id) && findChatRoom.dataValues.IsMatchId === isMatchId) {
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