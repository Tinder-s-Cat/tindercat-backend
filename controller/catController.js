const {Cat} = require ('../models')

class catController {
    static getCats(req,res,next){
        Cat.findAll()
            .then((data) => {
              res.status(200).json(data);
            })
            .catch((err) => {
              next(err);
            });

    }
    static getCatsById(req,res,next){
      Cat.findByPk(+req.params.id)
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
          } else {
            throw { name: "Cat not found" };
          }
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

        
    }
    static deleteCats(req,res,next){

        
    }
}
module.exports = catController