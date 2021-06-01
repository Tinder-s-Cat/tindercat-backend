const { comparePassword } = require("../helpers/bcrypt");
const { v4: uuidv4 } = require('uuid');
const { generateToken, verifyToken } = require("../helpers/jwt")
const {User, IsMatch, Cat, IsLike, ChatRoom} = require ('../models');
const cat = require("../models/cat");
const distance =require('../middlewares/geolib')


class userController {
    static register (req,res,next){
        let input = {
            email: req.body.email,
            username: req.body.username,
            password: req.body.password,
            location: req.body.location,
            profilePicture: req.body.profilePicture
        }
        User.create(input)
        .then((data)=>{
            res.status(201).json(data)
        })
        .catch((err) => {
            if (err.name === "SequelizeValidationError") {
              next(err);
            } else {
              next(err);
            }
          });
    }

    static login(req, res, next) {
        let { email, password } = req.body;
        User.findOne({
          where: {
            email,
          },
        })
          .then((data) => {
            // console.log(data)
            if (data === null) {
              throw { name: "Unauthorized" };
            } else {
              let decode = comparePassword(password, data.password);
              if (decode) {
                let payload = {
                  id: data.id,
                  email: data.email,
                };
                res.status(200).json({ access_token: generateToken(payload), id: data.id, username: data.username, location: data.location, profilePicture: data.profilePicture, lat:data.lat, lng: data.lng});
              } 
              else {
                throw { name: "Unauthorized" };
              }
            }
          })
          .catch((err) => {
            next(err);
          });
      	}
	// static readAll(req, res, next) {
	// 	const { id } = req.loggedUser
	// 	IsMatch.findAll({
	// 		where:{
	// 			UserId: id
	// 		}, include: {
	// 			model: User
	// 		}
	// 	})
	// 		.then((dataUserMatches) => {
	// 			res.status(200).json(dataUserMatches)
	// 		})
	// 		.catch((err)=>{
	// 			next(err)
	// 		})
	// }

	static readOneFriend(req, res, next) {
		User.findOne({
			where: {
				id: +req.params.id
			}, include: [
				{
					model: Cat,
					include: [IsLike] 
				}
			]
		})
			.then((selectedUser) => {
        selectedUser.dataValues.distance = distance({
          latitude: parseFloat(req.loggedUser.lat),
          longitude: parseFloat(req.loggedUser.lng)
        },
        {
          latitude: parseFloat(selectedUser.dataValues.lat),
          longitude: parseFloat(selectedUser.dataValues.lng)
        })
				res.status(200).json(selectedUser)
			})
			.catch((err) => {
				next(err)
			})
	}

	static postLikesToOneCat(req, res, next) {
		const { UserId, CatId } = req.body
    let idMatchToRoom = undefined
    let message = "Cat Liked"
		IsLike.findOne({
			where:{
				UserId: req.loggedUser.id,
				CatId
			}
		})
			.then((islikes) => {
        // console.log(islikes, "<<< INI DI ISLIKES")
				if(islikes===null){
          // console.log("<<< INI DI ISLIKES NULL")
					return IsLike.create({
						UserId: req.loggedUser.id,
						CatId
					},next)
				} 
			})
			.then(() => {
        // console.log( "<<< MASUK THEN SETELAH ISLIKES")
        return IsMatch.findOne({
          where: {
            UserId,
            OwnerId: +req.loggedUser.id
          }
        })
				// res.status(200).json({message: "Cat Liked"})
			})
      .then((isMatches) => {
        // console.log(isMatches, "<<< INI DI ISMATCHES")
        if(isMatches===null){
          // console.log( "<<< MASUK ISMATCH NULL")
          return IsMatch.create({
            UserId : +req.loggedUser.id,
            OwnerId: UserId,
            status: "pending"
          }, next)
        } else {
          // console.log( "<<< MASUK ELSE ISMATCHES ")
          message = "You got a new match!"
          return IsMatch.update({
            status: "match"
          },
          {
            where: {
              UserId,
              OwnerId: +req.loggedUser.id,
            },
            returning: true,
            plain: true
          })
        }
      })
      .then((dataMatch) => {
        // console.log(dataMatch, "<<< INI DI DATAMATCH")
        if(message==="You got a new match!"){
        //   console.log(">>>>>>>>>dataMacth", dataMatch[1].dataValues.id);
        // } else {
        //   res.status(200).json({message})
        // console.log("MASUK DATAMATCH")
        idMatchToRoom = dataMatch[1].dataValues.id
        console.log(idMatchToRoom)
        return ChatRoom.findOne({
          where: {
            IsMatchId: dataMatch[1].dataValues.id
          }
        })
        //  return ChatRoom.create({
        //   uid: uuidv4(),
        //   IsMatchId: dataMatch[1].dataValues.id
        //  })
        } else {
          // console.log("MASUK DATAMATCH ELSE")
          res.status(201).json({message})
        }
      })
      .then((isReadyRoom)=>{
        // console.log(isReadyRoom, "<<< MASUK ISREADYROOM")
        if(isReadyRoom===null) {
          // console.log("<<< INI DI ISREADYROOM NULL")
          return ChatRoom.create({
              uid: uuidv4(),
              IsMatchId: idMatchToRoom
             })
        } else {
          // console.log( "<<< INI DI ISREADYROOM ELSE")
          res.status(200).json({message: "It seems like you really like this user's cat 😻"})
        }
      })
      .then(() => {
        res.status(200).json({message})
      })
			.catch((err)=>{
				next(err)
			})
	}
}
module.exports = userController