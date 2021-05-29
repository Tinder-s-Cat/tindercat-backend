const { comparePassword } = require("../helpers/bcrypt");
const { generateToken, verifyToken } = require("../helpers/jwt")
const {User, IsMatch, Cat, IsLike} = require ('../models');
const cat = require("../models/cat");

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
			console.log(new Date());
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
            
            if (data === null) {
              throw { name: "Unauthorized" };
            } else {
              let decode = comparePassword(password, data.password);
              if (decode) {
                let payload = {
                  id: data.id,
                  email: data.email,
                };
                res.status(200).json({ access_token: generateToken(payload) });
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
	// 	console.log("masuk id", id);
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
				res.status(200).json(selectedUser)
			})
			.catch((err) => {
				next(err)
			})
	}

	static postLikesToOneCat(req, res, next) {
		const { UserId, CatId } = req.body
		IsLike.findOne({
			where:{
				UserId,
				CatId
			}
		})
			.then((islikes) => {
				if(islikes===null){
					return IsLike.create({
						UserId,
						CatId
					},next)
				} else {
					res.status(400).json({message: 'Cat Ready Liked'})
				}
			})
			.then(() => {
				res.status(200).json({message: "Cat Liked"})
			})
			.catch((err)=>{
				next(err)
			})
	}
}
module.exports = userController