const {Cat, User} = require ('../models')
const { upload } = require('../helpers/imgUpload')
class catController {
    static getCats(req,res,next){
        Cat.findAll({
          include: {
            model: User,
            required: true
          }
        })
            .then((data) => {
              res.status(200).json(data);
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
    static imgUpload(req, res, next) {
        // call helper to upload image
        upload(req, res, (err) => {
          if (err) {
              console.log(err, ">>>>> err upload image")
              next(err);
          } else {
              if (req.file === undefined) {
                  res.status(400).json({ msg : "bad request, no file is selected" });
              } else {
                  res.status(201).json(req.file.filename);
              }
          }
        })
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