const { Message, IsMatch, ChatRoom, User } = require('../models')
const { v4: uuidv4 } = require('uuid');
const { Op } = require("sequelize");
class MessageController {
    
    //to show the matched users
    static getMatched(req, res, next) {
        IsMatch.findAll({
            include : [{
                model : User,
                as : 'User',
                attributes : ['id', 'username', 'location', 'email', 'profilePicture']
            },
            {
                model : User,
                as : 'Owner',
                attributes : ['id', 'username', 'location', 'email', 'profilePicture']
            }
        ], where : {
            status : "Match",
            [Op.or] : [
                {
                    UserId : {
                        [Op.eq] : req.loggedUser.id
                    }
                },
                {
                    OwnerId : {
                        [Op.eq] : req.loggedUser.id
                    }
                }
            ]
        }
        })
        .then(data => {
            res.status(200).json(data)
        })
        .catch((err) => {
            console.log(err, "error ni")
            next(err);
        });
    }

    //show chatroom based on matched user
    static getChatroom(req, res, next) {
        ChatRoom.findAll({
            include: [{
                model: IsMatch,
                include: [
                    {
                    model : User,
                    as : 'User',
                    attributes : ['id', 'username', 'location', 'email', 'profilePicture']
                    },
                    {
                        model : User,
                        as : 'Owner',
                        attributes : ['id', 'username', 'location', 'email', 'profilePicture']
                    }
                ]
            }]
        
        })
        .then(data => {
            res.status(200).json(data)
        })
        .catch((err) => {
            console.log(err, "error ni")
            next(err);
        });
    }

    //getting message based on ChatRoom
    static getMessage(req, res, next) {
        let id = req.params.id
        Message.findAll({
            where : {
                ChatRoomId : id
            }
        })
        .then(data => {
            res.status(200).json(data)
        })
        .catch((err) => {
            console.log(err, "error ni")
            next(err);
        });
    }
}

module.exports = MessageController