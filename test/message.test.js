const request = require("supertest");
const app = require("../app");
const { generateToken } = require("../helpers/jwt");
const { User } = require("../models");
const clearUser = require("./helper/clearUser");

let user_token = "";
let user2_token = "";

beforeAll(function (done) {
    User.create({
      email: "test@mail.com",
      username: "test",
      password: "password",
      location: "jakarta selatan",
      profilePicture:
        "https://i.natgeofe.com/n/f0dccaca-174b-48a5-b944-9bcddf913645/01-cat-questions-nationalgeographic_1228126.jpg",
    })
      .then((data) => {
        return User.findOne({
          where: {
            email: data.email,
          },
        });
      })
      .then((data) => {
        let payload = {
          id: data.id,
          email: data.email,
        };
        const access_token = generateToken(payload);
        user_token = access_token;
        return User.create({
          email: "test2@mail.com",
          username: "test2",
          password: "password",
          location: "jakarta barat",
          profilePicture:
            "https://i.natgeofe.com/n/f0dccaca-174b-48a5-b944-9bcddf913645/01-cat-questions-nationalgeographic_1228126.jpg",
        });
      })
      .then((data) => {
        return User.findOne({
          where: {
            email: data.email,
          },
        });
      })
      .then((data) => {
        let payload = {
          id: data.id,
          email: data.email,
        };
        const access_token = generateToken(payload);
        user2_token = access_token;
        done();
      })
      .catch((err) => {
        done(err);
      });
  });