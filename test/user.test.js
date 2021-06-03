const request = require ("supertest")
const app = require ('../app')
const clearUser = require ('./helper/clearUser')

let friend_id = ""
let user_id = ""


beforeAll(function (done) {
    clearUser()
      .then(function () {
        done();
      })
      .catch((err)=>{
          done(err)
      });
  });

afterAll(function (done) {
    clearUser()
      .then(function () {
        done();
      })
      .catch((err)=>{
          done(err)
      });
  });

//successfully register
describe("POST /register success", function(){
    it("responds with status 201 and return an object with id, username, location, email, profile picture", function(done){
        let userData = {
            email: "test@mail.com",
            username: "test",
            password: "password",
            location: "jakarta selatan",
            profilePicture: "https://i.natgeofe.com/n/f0dccaca-174b-48a5-b944-9bcddf913645/01-cat-questions-nationalgeographic_1228126.jpg"
        }
    request(app)
      .post("/register")
      .send(userData)
      .set("Accept", "application/json")
      .then((response) => {
        let { body, status } = response;
        expect(status).toEqual(201);
        expect(typeof body).toEqual("object");
        expect(body).toHaveProperty("username");
        expect(body).toHaveProperty("location");
        expect(body).toHaveProperty("email");
        expect(body).toHaveProperty("profilePicture");

        done();
      })
      .catch((err) => {
        done(err);
      });
    })
})

//existing email or password
describe("POST /register failed because of existing email / username", function () {
    it("responds with status 400", function (done) {
      let userData = {
        email: "test@mail.com",
        username: "test",
        password: "password",
        location: "jakarta selatan",
        profilePicture: "https://i.natgeofe.com/n/f0dccaca-174b-48a5-b944-9bcddf913645/01-cat-questions-nationalgeographic_1228126.jpg"
      };
     request(app)
        .post("/register")
        .send(userData)
        .set("Accept", "application/json")
        .then((response) => {
          let { body, status } = response;
          expect(status).toEqual(400);
          expect(typeof body).toEqual("object");
          expect(body).toHaveProperty("message");
          expect(body.message).toEqual("Email / Username already exist");
          done();
        })
        .catch((err) => {
          done(err);
        });
    });
})

//empty email or password
describe("POST /register register failed because of empty fields", function () {
    it("responds with status 400", function (done) {
      let userData = {
        email: "",
        username: "",
        password: "",
        location: "",
        profilePicture: ""
      };
     request(app)
        .post("/register")
        .send(userData)
        .set("Accept", "application/json")
        .then((response) => {
          let { body, status } = response;
          expect(status).toEqual(400);
          expect(typeof body).toEqual("object");
          expect(body).toEqual(["Username should not be empty", "Location should not be empty", "Email is incorrect", "Email should not be empty", "Password should not be empty"]);
          done();
        })
        .catch((err) => {
          done(err);
        });
    });
  });


   //login success
   describe("POST /login successfully login", function () {
    it("responds with status 200", function (done) {
      let userData = {
        email: "test@mail.com",
        password: "password",
      };
     request(app)
        .post("/login")
        .send(userData)
        .set("Accept", "application/json")
        .then((response) => {
          let { body, status } = response;
          expect(status).toEqual(200);
          expect(body).toHaveProperty("access_token");
          user_id = body.id
          done();
        })
        .catch((err) => {
          done(err);
        });
    });
  });

    //login failed 
    describe("POST /login login failed because of invalid email or password ", function () {
        it("responds with status 401", function (done) {
          let userData = {
            email: "test@mail.co",
            password: "passwor",
          };
           request(app)
            .post("/login")
            .send(userData)
            .set("Accept", "application/json")
            .then((response) => {
              let { body, status } = response;
              expect(status).toEqual(401);
              expect(body.message).toEqual("Invalid email / password");
              done();
            })
            .catch((err) => {
                
              done(err);
            });
        });
      });

   
    
    



