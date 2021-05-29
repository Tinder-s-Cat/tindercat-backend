const { Message, IsMatch, ChatRoom, User } = require('../models')

class MessageController {
    //to show the matched users
    static Matched(req, res, next) {
        IsMatch.findAll({
            include : {
                model : User,
                attributes : ['username']
            }
        })
        .then(data => {
            console.log(data)
            res.status(200).json(data)
        })
        .catch((err) => {
            console.log(err, "error ni")
            next(err);
        });
    }
}

module.exports = MessageController