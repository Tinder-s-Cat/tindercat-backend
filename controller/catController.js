const {Cat, User, IsMatch} = require ('../models')
const sequelize = require('../models').sequelize
const { Op } = require("sequelize");
const { uploadFile } = require ("../helpers/S3")


class catController {
  static getCats(req,res,next){
    const randLikerLength = Math.floor(Math.random() * 5) + 1
    const randCatsLength = Math.floor(Math.random() * 10) + 5
    let loggedUserCats = []
    let likerCats = []
    let anotherCats = []
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
        const likerId = likedCat.map((data) => data.dataValues.UserId)
        // console.log("liked cat>>>>>>>", likerId , randLikerLength, randCatsLength, "<<<<<<<<< liked chat");
        if(likerId.length>0){
          return Cat.findAll({
            where: { id: {
              [Op.notIn]: loggedUserCats,
              [Op.in]:likerId
            } }, //get cats except loggedUser Cats
            include: {
              model: User,
              required: true
            },
            order: [
              ['createdAt', 'DESC']
            ]
          })
        } else return []
      })
      .then((liker)=>{
        likerCats = liker.map((cats)=>cats)
        return Cat.findAll({
          where: { id: {[Op.notIn]: loggedUserCats} }, //get cats except loggedUser Cats
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
      })
      .then((data) => {
        anotherCats = data.map((cats)=>cats)
        const showCard = likerCats.concat(anotherCats)
        // const dataid = data.map((el)=>el.dataValues.id)
        // console.log(dataid, "<<<<<<<");
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
    static async imgUpload(req, res, next) {
        const file = req.file;
        console.log(file, ">>>>>file")
        const result = await uploadFile(file)
        if (result) {
          console.log(result)
          res.status(201).json({ 
            message: "image is sucessfully uploaded",
            img : result.Location
          });
        } else {
          next(err);
        }
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
              if (err.name === "SequelizeValidationError") {
                next(err);
              } else {
                next(err);
              }
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