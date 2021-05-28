const { comparePassword } = require("../helpers/bcrypt");
const { generateToken, verifyToken } = require("../helpers/jwt")
const {User} = require ('../models')

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
              console.log(data)
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
              } else {
                  console.log('masuk')
                throw { name: "Unauthorized" };
              }
            }
          })
          .catch((err) => {
            next(err);
          });
      }
}
module.exports = userController