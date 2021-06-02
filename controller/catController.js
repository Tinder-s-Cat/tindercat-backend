const {Cat, User, IsMatch} = require ('../models')
const sequelize = require('../models').sequelize
const { Op } = require("sequelize");

const distance =require('../Middlewares/geolib')
const { uploadFile } = require ("../helpers/S3")

class catController {
  static getCats(req,res,next){
    console.log(req.query)
    const randLikerLength = Math.floor(Math.random() * 5) + 1
    const randCatsLength = Math.floor(Math.random() * 10) + 5
    let loggedUserCats = []
    let likerCats = []
    let likerCatsId = []
    let anotherCats = []
    let likerId = []
    Cat.findAll({
      where: {
        UserId: req.loggedUser.id
      }
    })
      .then((userCats) => {
        loggedUserCats = userCats.map((cats)=>cats.dataValues.id)
        return  IsMatch.findAll({
          where: {
            OwnerId: req.loggedUser.id,
            status: "pending"
          },
          order: sequelize.random(), // get random id_liker who like our cats
          limit: randLikerLength // get 1-5 length ofid_liker who like our cats
        })
      })
      .then((likedCat) =>{
        // console.log("Liked car>>>>>>>", likedCat);
        likerId = likedCat.map((data) => data.dataValues.UserId)
        console.log(typeof(req.query.gender)=== "undefined")
        // likerCatsId = likedCat.map((data) => data.dataValues.id)
        // console.log("liked cat>>>>>>>", likerId , randLikerLength, randCatsLength, "<<<<<<<<< liked chat");
        // console.log(" liker user >>>>>>>>>>>>>", likerId, loggedUserCats, likerId.concat(loggedUserCats), "<<<<<<<<<<<<< liker user ");
        if(likerId.length>0){
         console.log('MASUK SINI')
          if(typeof(req.query.gender) != "undefined" && typeof(req.query.gender) != "null"){
            // console.log('MASUK')
            // console.log(" gender >>>>>>>>>>>>>", req.query.gender, "<<<<<<<<<<<<< gender ");
            return Cat.findAll({
              where: {
                id: {
                  [Op.notIn]: loggedUserCats,
                },
                UserId: {
                  [Op.in]:likerId
                },
                gender: req.query.gender
              }, //get cats except loggedUser Cats
              include: {
                model: User,
                required: true
              },
              order: sequelize.random(),
              limit: randLikerLength
            })
          } else {
            // console.log(">>>>>>>> NOT Have Input Gender <<<<<<<<<<");
            return Cat.findAll({
              where: {
                id: {
                  [Op.notIn]: loggedUserCats,
                },
                UserId: {
                  [Op.in]:likerId
                }
              }, //get cats except loggedUser Cats
              include: {
                model: User,
                required: true
              },
              order: sequelize.random(),
              limit: randLikerLength
            })
          }
        } else return []
      })
      .then((liker)=>{
        likerCats = liker.map((cats)=>cats)
        likerCatsId = liker.map((cats)=>cats.dataValues.id)
        // console.log(">>>>>> likerCatsId ", likerCatsId);
        if(req.query.gender){
          return Cat.findAll({
            where: {
              id: {[Op.notIn]: loggedUserCats.concat(likerCatsId)}, //get cats except loggedUser Cats
              gender: req.query.gender
            }, 
            include: {
              model: User,
              required: true
            },
            order: [
              ['createdAt', 'DESC']
            ],
            order: sequelize.random(),
            limit: randCatsLength
          })
        } else {
          return Cat.findAll({
            where: {
              id: {[Op.notIn]: loggedUserCats.concat(likerCatsId)}, //get cats except loggedUser Cats
            }, 
            include: {
              model: User,
              required: true
            },
            order: [
              ['createdAt', 'DESC']
            ],
            order: sequelize.random(),
            limit: randCatsLength
          })
        }
      })
      .then((data) => {
        anotherCats = data.map((cats)=>cats)
        let showCard = likerCats.concat(anotherCats)
        showCard.forEach((el)=>{
          el.dataValues.distance = distance({
            latitude: parseFloat(req.loggedUser.lat),
            longitude: parseFloat(req.loggedUser.lng)
          },
          {
            latitude: parseFloat(el.dataValues.User.dataValues.lat),
            longitude: parseFloat(el.dataValues.User.dataValues.lng)
          })
        })

        res.status(200).json(showCard);
      })
      .catch((err) => {
        next(err);
      });

    }
    static getCatsById(req,res,next){
      Cat.findByPk(+req.params.id, {
        include: {
          model: User,
          required: true
        }
      })
      .then((data) => {
        if (data) {
          res.status(200).json(data);
        } else {
          throw { name: "Cat not found" };
        }
      })
      .catch((err) => {
        next(err);
      });

    }
    static postCats(req,res,next){
      let input = {
        name: req.body.name,
        gender: req.body.gender,
        age: req.body.age,
        race: req.body.race,
        status: req.body.status,
        profilePicture: req.body.profilePicture,
        description: req.body.description,
        UserId: req.loggedUser.id
      };
      Cat.create(input)
        .then((data) => {
          // console.log(data, "<<< INI DATA")
          res.status(201).json(data);
        })
        .catch((err) => {
          if (err.name === "SequelizeValidationError") {
            next(err);
          } else {
            next(err);
          }
        });
        
    }

    static async postCatAndImage(req,res,next){
      const { name, gender, age, race, description } = req.body;
      if (name && gender && age && race && description) {
        if (req.file) {
          const file = req.file;
          console.log(file, ">>>>>file")
          const result = await uploadFile(file)
          if (result) {
            console.log(result)
            let input = {
              name: req.body.name,
              gender: req.body.gender,
              age: req.body.age,
              race: req.body.race,
              profilePicture: result.Location,
              description: req.body.description,
              UserId: req.loggedUser.id
            };
            Cat.create(input)
            .then((data) => {
              res.status(201).json(data);
            })
            .catch((err) => {
              next(err)
            });
          } else {
            next(err);
          } 
        } else {
          res.status(500).json({ message : "all data is required"});
        } 
      } else {
        res.status(500).json({ message : "all data is required"});
      }
        
    }
    
    static putCats(req,res,next){
      let input = {
        name: req.body.name,
        gender: req.body.gender,
        age: req.body.age,
        race: req.body.race,
        profilePicture: req.body.profilePicture,
        description: req.body.description,
      };
      Cat.update(input, {
        where: { id: req.params.id },
      })
        .then((data) => {
          if (data[0] === 1) {
            return Cat.findOne({
              where: { id: req.params.id },
            });
          } 
          // else {
          //   throw { name: "Cat not found" };
          // }
        })
        .then((editedData) => {
          res.status(200).json(editedData);
        })
        .catch((err) => {
          if (err.name === "SequelizeValidationError") {
            next(err);
          } else {
            next(err);
          }
        });
  
    }
    static patchCats(req,res,next){
      let input = {
        status: req.body.status
      };
      Cat.update(input, {
        where: { id: req.params.id },
      })
        .then((data) => {
          if (data[0] === 1) {
            return Cat.findOne({
              where: { id: req.params.id },
            });
          } 
          // else {
          //   throw { name: "Cat not found" };
          // }
        })
        .then((editedData) => {
          res.status(200).json(editedData);
        })
        .catch((err) => {
          if (err.name === "SequelizeValidationError") {
            next(err);
          } else {
            next(err);
          }
        });
        
    }
    static deleteCats(req,res,next){
      Cat.destroy({
        where: {id: req.params.id}
      })
      .then((data)=>{
        if (data === 1){
          res.status(200).json({ message: "Cat successfully deleted" });
        } 
        // else {
        //   throw { name: "Cat not found" };
        // }
      })
      .catch((err) => {
        next(err);
      });
    }
}
module.exports = catController