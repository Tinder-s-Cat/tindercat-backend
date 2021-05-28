const request = require("supertest");
const app = require("../app");
const { generateToken } = require("../helpers/jwt");
const { User } = require("../models");
const clearUser = require("./helper/clearUser");

let user_token = ""
let cat_id = ""

beforeAll(function (done) {
    User.create({
        email: "test@mail.com",
        username: "test",
        password: "password",
        location: "jakarta selatan",
        profilePicture: "https://i.natgeofe.com/n/f0dccaca-174b-48a5-b944-9bcddf913645/01-cat-questions-nationalgeographic_1228126.jpg"
   
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
        user_token = access_token
        done()
      })
      .catch((err)=>{
        done(err)
        });
})

afterAll(function (done) {
    clearUser()
      .then(function () {
        done();
      })
      .catch((err)=>{
        done(err)
    });
  });

  describe("POST/cat postCats SUCCESS", function () {
    it("responds with status 201", function (done) {
      let catsData = {
        name: "mengki",
        gender: "male",
        age: 4,
        race: "persian",
        status: "true",
        profilePicture: "https://www.purina.co.uk/sites/default/files/2021-02/CAT%20BREED%20Hero%20Desktop_0015_Persian.jpg",
        description: "kucing ras persia lucu, umur 1 tahun dijamin sehat",
      };
       request(app)
        .post("/cat")
        .send(catsData)
        .set("access_token", user_token)
        .then((response) => {
          let { body, status } = response;
        //   console.log(body)
          expect(status).toEqual(201);
          expect(typeof body).toEqual("object");
          expect(body).toHaveProperty("name");
          expect(body).toHaveProperty("gender");
          expect(body).toHaveProperty("age");
          expect(body).toHaveProperty("race");
          expect(body).toHaveProperty("status");
          expect(body).toHaveProperty("profilePicture");
          expect(body).toHaveProperty("description");
          cat_id = body.id
          done();
        })
        .catch((err) => {
            done(err);
          });
    });
  });

  describe("POST/cat postCats FAILED because of not having access token", function () {
    it("responds with status 401", function (done) {
        let catsData = {
            name: "mengki",
            gender: "male",
            age: 4,
            race: "persian",
            status: "true",
            profilePicture: "https://www.purina.co.uk/sites/default/files/2021-02/CAT%20BREED%20Hero%20Desktop_0015_Persian.jpg",
            description: "kucing ras persia lucu, umur 1 tahun dijamin sehat",
          };
       request(app)
        .post("/cat")
        .send(catsData)
        .then((response) => {
          let { body, status } = response;
          expect(status).toEqual(401);
          expect(body.message).toEqual("please login first");
          done();
        })
        .catch((err) => {
          done(err);
        });
    });
  });

  describe("POST/cat postCats FAILED because of having an empty field or invalid value ", function () {
    it("responds with status 400", function (done) {
        let catsData = {
            name: "",
            gender: "",
            age: -1,
            race: "",
            status: "true",
            profilePicture: "https://www.purina.co.uk/sites/default/files/2021-02/CAT%20BREED%20Hero%20Desktop_0015_Persian.jpg",
            description: "kucing ras persia lucu, umur 1 tahun dijamin sehat",
          };
        //   let expected = ["Name should not be empty", "Gender should not be empty", "Age should not be empty", "Age must be number", "the minimum age is 1", "Race should not be empty", "Profile picture should not be empty", "Description should not be empty"]
       request(app)
        .post("/cat")
        .send(catsData)
        .set("access_token", user_token)
        .then((response) => {
          let { body, status } = response;
        //   console.log(body, "YANG INI <<<<")
          expect(status).toEqual(400);
          expect(body).toEqual(["Name should not be empty", "Gender should not be empty", "the minimum age is 1", "Race should not be empty"]);
          done();
        })
        .catch((err) => {
            // console.log(err, "INI ERRORNYA")
          done(err);
        });
    });
  });

  describe("POST/cat postCats FAILED because of having an invalid type", function () {
    it("responds with status 400", function (done) {
        let catsData = {
            name: "mengki",
            gender: "male",
            age: "empat",
            race: "persian",
            status: "true",
            profilePicture: "https://www.purina.co.uk/sites/default/files/2021-02/CAT%20BREED%20Hero%20Desktop_0015_Persian.jpg",
            description: "kucing ras persia lucu, umur 1 tahun dijamin sehat",
          };
        //   let expected = ["Name should not be empty", "Gender should not be empty", "Age should not be empty", "Age must be number", "the minimum age is 1", "Race should not be empty", "Profile picture should not be empty", "Description should not be empty"]
       request(app)
        .post("/cat")
        .send(catsData)
        .set("access_token", user_token)
        .then((response) => {
          let { body, status } = response;
        //   console.log(body, "YANG INI <<<<")
          expect(status).toEqual(400);
          expect(body).toEqual(["Age must be number"]);
          done();
        })
        .catch((err) => {
            // console.log(err, "INI ERRORNYA")
          done(err);
        });
    });
  });



  //GET
  describe('getCats SUCCESS GET/cat', function(){
    it('responds with status 200', function(done){
         request (app)
        .get('/cat')
        .set('access_token', user_token)
        .then(response=>{
          let { body, status } = response;
          expect(status).toEqual(200);
          expect(typeof body).toEqual('object');
          done(); 
        })
        .catch((err) => {
          done(err);
        });
    })
})

//GET BY ID
describe('getCatsById SUCCESS GET/cat:id', function(){
    it('responds with status 200', function(done){
         request (app)
        .get(`/cat/${cat_id}`)
        .set('access_token', user_token)
        .then(response=>{
            // console.log(response, "<<<<< INI RESPONSE")
          let { body, status } = response;
          expect(status).toEqual(200);
          expect(typeof body).toEqual('object');
          done(); 
        })
        .catch((err) => {
          done(err);
        });
    })
})

describe('getCatsById FAILED to find cats GET/cat:id', function(){
    it('responds with status 404', function(done){
         request (app)
        .get(`/cat/0`)
        .set('access_token', user_token)
        .then(response=>{
            
          let { body, status } = response;
        //   console.log(body, "<<<<< INI RESPONSE")
          expect(status).toEqual(404);
          expect(body.message).toEqual('error not found');
          done(); 
        })
        .catch((err) => {
          done(err);
        });
    })
})


//PUT
describe("PUT/cat putCats SUCCESS", function () {
    it("responds with status 200", function (done) {
      let catsData = {
        name: "mengkiW",
        gender: "male",
        age: 3,
        race: "persian",
        profilePicture: "https://www.purina.co.uk/sites/default/files/2021-02/CAT%20BREED%20Hero%20Desktop_0015_Persian.jpg",
        description: "kucing ras persia lucu, umur 1 tahun dijamin sehat",
      };
       request(app)
        .put(`/cat/${cat_id}`)
        .send(catsData)
        .set("access_token", user_token)
        .then((response) => {
          let { body, status } = response;
        //   console.log(body)
          expect(status).toEqual(200);
          expect(typeof body).toEqual("object");
          expect(body).toHaveProperty("name");
          expect(body).toHaveProperty("gender");
          expect(body).toHaveProperty("age");
          expect(body).toHaveProperty("race");
          expect(body).toHaveProperty("status");
          expect(body).toHaveProperty("profilePicture");
          expect(body).toHaveProperty("description");
          done();
        })
        .catch((err) => {
            done(err);
          });
    });
  });

  describe("PUT/cat FAILED because of not having access token", function () {
    it("responds with status 401", function (done) {
        let catsData = {
            name: "mengkiW",
            gender: "male",
            age: 3,
            race: "persian",
            profilePicture: "https://www.purina.co.uk/sites/default/files/2021-02/CAT%20BREED%20Hero%20Desktop_0015_Persian.jpg",
            description: "kucing ras persia lucu, umur 1 tahun dijamin sehat",
          };
       request(app)
       .put(`/cat/${cat_id}`)
        .send(catsData)
        .then((response) => {
          let { body, status } = response;
          expect(status).toEqual(401);
          expect(body.message).toEqual("please login first");
          done();
        })
        .catch((err) => {
          done(err);
        });
    });
  });

  describe("PUT/cat FAILED because of an empty field or invalid value", function () {
    it("responds with status 400", function (done) {
        let catsData = {
            name: "",
            gender: "",
            age: -3,
            race: "",
            profilePicture: "https://www.purina.co.uk/sites/default/files/2021-02/CAT%20BREED%20Hero%20Desktop_0015_Persian.jpg",
            description: "kucing ras persia lucu, umur 1 tahun dijamin sehat",
          };
       request(app)
       .put(`/cat/${cat_id}`)
        .send(catsData)
        .set("access_token", user_token)
        .then((response) => {
          let { body, status } = response;
          expect(status).toEqual(400);
          expect(body).toEqual(["Name should not be empty", "Gender should not be empty", "the minimum age is 1", "Race should not be empty"]);
          done();
        })
        .catch((err) => {
          done(err);
        });
    });
  });