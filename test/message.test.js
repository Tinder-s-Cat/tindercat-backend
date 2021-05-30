const request = require("supertest");
const app = require("../app");
const { generateToken } = require("../helpers/jwt");
const { User } = require("../models");
const clearUser = require("./helper/clearUser");

let user_token = "";
let user2_token = "";
let chatroomId = "";
let isMatchId = "";

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

afterAll(function (done) {
  clearUser()
    .then(function () {
      done();
    })
    .catch((err) => {
      done(err);
    });
});

//GET /friend success
describe("getFriends SUCCESS GET/friend", function () {
  it("responds with status 200", function (done) {
    request(app)
      .get("/friend")
      .set("access_token", user_token)
      .then((response) => {
        let { body, status } = response;
        expect(status).toEqual(200);
        if (body.length >  0) {
          expect(body[0]).toHaveProperty("id")
          expect(body[0]).toHaveProperty("UserId")
          expect(body[0]).toHaveProperty("username")
          expect(body[0]).toHaveProperty("location")
          expect(body[0]).toHaveProperty("email")
          expect(body[0]).toHaveProperty("profilePicture")
        }
        expect(typeof body).toEqual("object");
        done();
      })
      .catch((err) => {
        done(err);
      });
  });
});

//GET /friend fail
describe("getFriends FAIL GET/friend", function () {
  it("responds with status 500", function (done) {
    request(app)
      .get("/friend")
      .set("access_token", user_token+"1")
      .then((response) => {
        let { body, status } = response;
        expect(status).toEqual(500);
        expect(body).toHaveProperty("message", "invalid signature");
        done();
      })
      .catch((err) => {
        done(err);
      });
  });
});

describe("getFriends FAIL GET/friend", function () {
  it("responds with status 500", function (done) {
    request(app)
      .get("/friend/")
      .set("access_token", user_token+"1")
      .then((response) => {
        let { body, status } = response;
        expect(status).toEqual(500);
        expect(body).toHaveProperty("message", "invalid signature");
        done();
      })
      .catch((err) => {
        done(err);
      });
  });
});