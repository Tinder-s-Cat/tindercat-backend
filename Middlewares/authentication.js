const { verifyToken } = require("../helpers/jwt");
const { User } = require("../models");

async function authentication(req, res, next) {
  try {
    const access_token = req.headers.access_token;
    if (access_token) {
      let decode = verifyToken(access_token);
      let data = await User.findOne({
        where: { email: decode.email },
      });
      if (data) {
        req.loggedUser = {
          id: data.id,
          email: data.email,
          username: data.username,
          location: data.location,
          profilePicture: data.profilePicture,
          // lat: data.lat,
          // lng: data.lng
        };
        next();
      } 
      // else {
      //   throw { name: "Unauthorized" };
      // }
    } else {
      throw { name: "not logged in" };
    }
  } catch (error) {
    next(error);
  }
}
module.exports = authentication;
