const { comparePassword } = require("../helpers/bcrypt");
const { v4: uuidv4 } = require("uuid");
const { generateToken, verifyToken } = require("../helpers/jwt");
const { User, IsMatch, Cat, IsLike, ChatRoom } = require("../models");
const cat = require("../models/cat");
const distance = require("../Middlewares/geolib");

class userController {
  static register(req, res, next) {
    let input = {
      email: req.body.email,
      username: req.body.username,
      password: req.body.password,
      location: req.body.location,
      profilePicture: req.body.profilePicture,
      lat: req.body.lat,
      lng: req.body.lng,
    };
    User.create(input)
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
            res.status(200).json({
              access_token: generateToken(payload),
              id: data.id,
              username: data.username,
              location: data.location,
              profilePicture: data.profilePicture,
              lat: data.lat,
              lng: data.lng,
            });
          } else {
            throw { name: "Unauthorized" };
          }
        }
      })
      .catch((err) => {
        next(err);
      });
  }

  static readOneFriend(req, res, next) {
    User.findOne({
      where: {
        id: +req.params.id,
      },
      include: [
        {
          model: Cat,
          include: [IsLike],
        },
      ],
    })
      .then((selectedUser) => {
        selectedUser.dataValues.distance = distance(
          {
            latitude: parseFloat(req.loggedUser.lat),
            longitude: parseFloat(req.loggedUser.lng),
          },
          {
            latitude: parseFloat(selectedUser.dataValues.lat),
            longitude: parseFloat(selectedUser.dataValues.lng),
          }
        );
        res.status(200).json(selectedUser);
      })
      .catch((err) => {
        next(err);
      });
  }

  static postLikesToOneCat(req, res, next) {
    const { UserId, CatId } = req.body;
    let idMatchToRoom = undefined;
    let message = "Cat Liked";
    IsLike.findOne({
      where: {
        UserId: req.loggedUser.id,
        CatId,
      },
    })
      .then((islikes) => {
        if (islikes === null) {
          return IsLike.create(
            {
              UserId: req.loggedUser.id,
              CatId,
            },
            next
          );
        }
      })
      .then(() => {
        return IsMatch.findOne({
          where: {
            UserId,
            OwnerId: +req.loggedUser.id,
          },
        });
      })
      .then((isMatches) => {
        if (isMatches === null) {
          return IsMatch.create(
            {
              UserId: +req.loggedUser.id,
              OwnerId: UserId,
              status: "pending",
            },
            next
          );
        } else {
          message = "You got a new match!";
          return IsMatch.update(
            {
              status: "match",
            },
            {
              where: {
                UserId,
                OwnerId: +req.loggedUser.id,
              },
              returning: true,
              plain: true,
            }
          );
        }
      })
      .then((dataMatch) => {
        if (message === "You got a new match!") {
          idMatchToRoom = dataMatch[1].dataValues.id;

          return ChatRoom.findOne({
            where: {
              IsMatchId: dataMatch[1].dataValues.id,
            },
          });
        } else {
          res.status(201).json({ message });
        }
      })
      .then((isReadyRoom) => {
        if (isReadyRoom === null) {
          return ChatRoom.create({
            uid: uuidv4(),
            IsMatchId: idMatchToRoom,
          });
        } else {
          res.status(200).json({
            message: "It seems like you really like this user's cat 😻",
          });
        }
      })
      .then(() => {
        res.status(200).json({ message });
      })
      .catch((err) => {
        next(err);
      });
  }
}
module.exports = userController;
