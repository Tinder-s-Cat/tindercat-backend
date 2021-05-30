const request = require("supertest");
const app = require("../app");
const { generateToken } = require("../helpers/jwt");
const { User, ChatRoom, IsMatch, Message } = require("../models");
const clearUser = require("./helper/clearUser");

let user_token = "";
let user2_token = "";
let chatroomId = "";
let isMatchId = "";
let messageId = "";
let user1 = {};

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
        user1 = data;
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
        return IsMatch.create({
            UserId : data.id,
            OwnerId : user1.id,
            status : "match"
        })
        // done();
      })
      .then(data => {
        isMatchId = data.id;
        return ChatRoom.create({
          IsMatchId : data.id
        })
      })
      .then(data => {
        chatroomId = data.id
        return Message.create({
          message : "message here"
        })
      })
      .then(data => {
        messageId = data.id;
        done();
      })
      .catch((err) => {
        done(err);
      });
});

afterAll(function (done) {
  if(process.env.NODE_ENV === 'test') {
    User.destroy({ where : {}})
    IsMatch.destroy({ where : {}})
    Message.destroy({ where : {}})
    ChatRoom.destroy({ where : {}})
    .then(() => {
      done()
    })
    .catch(err => {
      done(err)
    })
  }
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
        let friends = [];
        if (body.length >  0) {
          chatroomId = body[0].id;
          expect(body[0]).toHaveProperty("id")
          expect(body[0]).toHaveProperty("UserId")
          // expect(body[0]).toHaveProperty("IsMatchId")
          // expect(body[0]).toHaveProperty("username")
          // expect(body[0]).toHaveProperty("location")
          // expect(body[0]).toHaveProperty("email")
          // expect(body[0]).toHaveProperty("profilePicture")
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
      .set("access_key", user_token+"1")
      .then((response) => {
        let { body, status } = response;
        expect(status).toEqual(401);
        done();
      })
      .catch((err) => {
        done(err);
      });
  });
});

describe("SUCCESS /GET chatroom/:id/:isMatch", function () {
  it("responds with status 200", function (done) {
    console.log(chatroomId, ">>>>chatroomid")
    request(app)
      .get(`/chatroom/${chatroomId}/${isMatchId}`)
      .set("access_token", user_token)
      .then((response) => {
        let { body, status } = response;
        expect(status).toEqual(200);
        // expect(body).toHaveProperty("message", "invalid signature");
        done();
      })
      .catch((err) => {
        done(err);
      });
  });
});

describe("FAIL /GET chatroom/:id/:isMatch", function () {
  it("responds with status 401", function (done) {
    request(app)
      .get(`/chatroom/${chatroomId}/${isMatchId+1}`)
      .set("access_token", user_token)
      .then((response) => {
        let { body, status } = response;
        expect(status).toEqual(401);
        done();
      })
      .catch((err) => {
        done(err);
      });
  });
});

describe("SUCCESS /POST chatroom/:id/:isMatch", function () {
  it("responds with status 201", function (done) {
    let input = {
      message : "pesan ke match"
    }
    console.log(chatroomId, ">>>>chatroomid")
    request(app)
      .post(`/chatroom/${chatroomId}/${isMatchId}`)
      .send(input)
      .set("access_token", user_token)
      .then((response) => {
        let { body, status } = response;
        expect(status).toEqual(201);
        // expect(body).toHaveProperty("message", "invalid signature");
        done();
      })
      .catch((err) => {
        done(err);
      });
  });
});

describe("FAIL /POST chatroom/:id/:isMatch", function () {
  it("responds with status 401", function (done) {
    let input = {
      message : "pesan ke match"
    }
    request(app)
      .post(`/chatroom/${chatroomId+1}/${isMatchId+1}`)
      .send(input)
      .set("access_token", user_token)
      .then((response) => {
        let { body, status } = response;
        expect(status).toEqual(401);
        expect(body).toHaveProperty("message", "Not authorized!");
        done();
      })
      .catch((err) => {
        done(err);
      });
  });
});