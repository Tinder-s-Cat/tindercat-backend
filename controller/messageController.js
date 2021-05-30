const { Message, IsMatch, ChatRoom, User } = require('../models')
const { v4: uuidv4 } = require('uuid');
const { Op } = require("sequelize");
class MessageController {
    
    //to show the matched users - gakdipake
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

    //show list of chatroom based on matched user
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
            }]
        
        })
        .then(data => {
            let friends = [];
            data.forEach(el => {
                let matchObj = el.IsMatch;
                if (matchObj.UserId !== req.loggedUser.id) {
                    let newObj = {
                        id : el.id,
                        UserId : matchObj.UserId,
                        username : matchObj.User.dataValues.username,
                        location : matchObj.User.dataValues.location,
                        email : matchObj.User.dataValues.email,
                        profilePicture : matchObj.User.dataValues.profilePicture
                    }
                    friends.push(newObj)
                } else {
                    let newObj = {
                        id : el.id,
                        UserId : matchObj.OwnerId,
                        username : matchObj.Owner.dataValues.username,
                        location : matchObj.Owner.dataValues.location,
                        email : matchObj.Owner.dataValues.email,
                        profilePicture : matchObj.Owner.dataValues.profilePicture
                    }
                    friends.push(newObj)
                }
            });
            res.status(200).json(friends)
        })
        .catch((err) => {
            console.log(err, "error ni")
            next(err);
        });
    }

    //GET CHATROOM (SHOWS ALL MESSAGE BETWEEN 2 USERS) BASED ON ChatroomId AND isMatchId
    static getMessage(req, res, next) {
        let id = req.params.id
        let isMatchId = req.params.isMatchId
        console.log(isMatchId, ">>>>isMatchId")
        Message.findAll({
            include : [
                {
                    model : User,
                    attributes : ['id', 'username', 'location', 'email', 'profilePicture']
                }
            ], where : {
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

    static postMessage(req, res, next) {
        let id = req.params.id
        let data = {
            UserId : 1,
            ChatRoomId : id,
            message : req.body.message
        }
        Message.create(data)
        .then(data => {
            res.status(201).json(data)
        })
        .catch((err) => {
            console.log(err, "error ni")
            next(err);
        });
    }
}

module.exports = MessageController