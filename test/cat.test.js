const request = require("supertest");
const app = require("../app");
const { generateToken } = require("../helpers/jwt");
const { User, IsMatch, Cat } = require("../models");
const clearUser = require("./helper/clearUser");

let user_token = "";
let user2_token = "";
let cat_id = "";
let cat2_id = ""
let user_id = ""
let user2_id = ""

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
      user_id = data.id
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
      user2_id = data.id
      return Cat.create({
        name: "nala",
        gender: "female",
        age: 4,
        race: "siam",
        status: "true",
        profilePicture:
          "https://www.purina.co.uk/sites/default/files/2021-02/CAT%20BREED%20Hero%20Desktop_0015_Persian.jpg",
        description: "kucing ras persia lucu, umur 1 tahun dijamin sehat",
        UserId: user2_id
      })
    })
    .then((data)=>{
      // console.log(data, "<<<< INI LINE 74")
      cat2_id = data.dataValues.id
      
      done();
    })
    .catch((err) => {
      // console.log(err, "<<<<< INI LINE 77")
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

describe("POST/cat postCats SUCCESS", function () {
  it("responds with status 201", function (done) {
    let catsData = {
      name: "mengki",
      gender: "male",
      age: 4,
      race: "persian",
      status: "true",
      profilePicture:
        "https://www.purina.co.uk/sites/default/files/2021-02/CAT%20BREED%20Hero%20Desktop_0015_Persian.jpg",
      description: "kucing ras persia lucu, umur 1 tahun dijamin sehat",
    };
    request(app)
      .post("/cat")
      .send(catsData)
      .set("access_token", user_token)
      .then((response) => {
        let { body, status } = response;
        expect(status).toEqual(201);
        expect(typeof body).toEqual("object");
        expect(body).toHaveProperty("name");
        expect(body).toHaveProperty("gender");
        expect(body).toHaveProperty("age");
        expect(body).toHaveProperty("race");
        expect(body).toHaveProperty("status");
        expect(body).toHaveProperty("profilePicture");
        expect(body).toHaveProperty("description");
        cat_id = body.id;
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
      profilePicture:
        "https://www.purina.co.uk/sites/default/files/2021-02/CAT%20BREED%20Hero%20Desktop_0015_Persian.jpg",
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
      profilePicture:
        "https://www.purina.co.uk/sites/default/files/2021-02/CAT%20BREED%20Hero%20Desktop_0015_Persian.jpg",
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
        expect(body).toEqual([
          "Name should not be empty",
          "Gender should not be empty",
          "the minimum age is 1",
          "Race should not be empty",
        ]);
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
      profilePicture:
        "https://www.purina.co.uk/sites/default/files/2021-02/CAT%20BREED%20Hero%20Desktop_0015_Persian.jpg",
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

describe(`POST /cat/upload`, function () {
  it(`Success update data with status 201`, function (done) {
    
    request(app)
      .post(`/cat/upload`)
      .attach('catImage', './test/image1.png')
      .set("access_token", user_token)
      .end((err, res) => {
        if (err) {
          console.log('Error occured at PATCH users expIncrease test')
          done(err)
        }
        expect(res.status).toEqual(201)
        done()
      })
  }, 60000)
})

//LIKES
describe("POST/like to cat 1 success", function(){
  it("responds with status 201", function(done){
      let isLikes = {
        UserId: user_id,
        CatId: cat_id
      }                                                                                                               
  request(app)
    .post("/like")
    .send(isLikes)//kalau ngirim data memang harus sama, karena memang kalau dikirim dari FE userID nya card sama dengan yang punya kucing.
    .set("access_token", user2_token)
    .set("Accept", "application/json")
    .then((response) => {
    
      let { body, status } = response;
      // console.log(response, "<<<< INI LINE 283")
      expect(status).toEqual(201);
      expect(typeof body).toEqual("object");
   
      // expect(body).toHaveProperty("id");
      // expect(body).toHaveProperty("username");
      // expect(body).toHaveProperty("location")
      expect(body.message).toEqual("Cat Liked");
      done();
    })
    .catch((err) => {
      // console.log(err, "<<<<<< INI ERR YANG DARI LIKES")
      done(err);
    });
  })
})

describe("POST/like to cat 2 success", function(){
  it("responds with status 201", function(done){
      let isLikes = {
        UserId: user2_id,
        CatId: cat2_id
      }                                                                                                               
  request(app)
    .post("/like")
    .send(isLikes)
    .set("access_token", user_token)
    .set("Accept", "application/json")
    .then((response) => {
    
      let { body, status } = response;
      // console.log(response, "<<<< INI LINE 283")
      // console.log(body, "<<< LINE 320")
      expect(status).toEqual(200);
      expect(typeof body).toEqual("object");
      expect(body.message).toEqual("You got a new match!");
      // expect(body.message).toEqual("You got a new match!");
      done();
    })
    .catch((err) => {
      // console.log(err, "<<<<<< INI ERR YANG DARI LIKES")
      done(err);
    });
  })
})

//GET FRIEND
describe("GET/friend/:id getFriend SUCCESS ", function () {
  it("responds with status 200", function (done) {
    request(app)
      .get(`/friend/${user2_id}`)
      .set("access_token", user_token)
      .then((response) => {
        let { body, status } = response;
        expect(status).toEqual(200);
        expect(typeof body).toEqual("object");
        done();
      })
      .catch((err) => {
        done(err);
      });
  });
});



//GET
describe("GET/cat getCats SUCCESS ", function () {
  it("responds with status 200", function (done) {
    request(app)
      .get("/cat")
      .set("access_token", user_token)
      .then((response) => {
        let { body, status } = response;
        expect(status).toEqual(200);
        expect(typeof body).toEqual("object");
        done();
      })
      .catch((err) => {
        done(err);
      });
  });
});




describe("GET/cat getCats FAILED because of not having an access token", function () {
  it("responds with status 401", function (done) {
    request(app)
      .get("/cat")

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

//GET BY ID
describe("GET/cat:id getCatsById SUCCESS", function () {
  it("responds with status 200", function (done) {
    request(app)
      .get(`/cat/${cat_id}`)
      .set("access_token", user_token)
      .then((response) => {
        // console.log(response, "<<<<< INI RESPONSE")
        let { body, status } = response;
        expect(status).toEqual(200);
        expect(typeof body).toEqual("object");
        done();
      })
      .catch((err) => {
        done(err);
      });
  });
});

describe("GET/cat:id getCatsById FAILED because of not having an access token", function () {
  it("responds with status 200", function (done) {
    request(app)
      .get(`/cat/${cat_id}`)
      .then((response) => {
        // console.log(response, "<<<<< INI RESPONSE")
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

describe("GET/cat:id getCatsById FAILED to find cats", function () {
  it("responds with status 404", function (done) {
    request(app)
      .get(`/cat/0`)
      .set("access_token", user_token)
      .then((response) => {
        let { body, status } = response;
        //   console.log(body, "<<<<< INI RESPONSE")
        expect(status).toEqual(404);
        expect(body.message).toEqual("error not found");
        done();
      })
      .catch((err) => {
        done(err);
      });
  });
});

// IMG UPLOAD
// describe("POST/cat/upload imgupload SUCCESS", function () {
//   it("responds with status 201", function (done) {
//     // let catsData = {
//     //   catImage: "csFl6Y-M_400x400.jpg"
//     // };
//     request(app)
//       .post("/cat/upload")
//       // .send(catsData)
//       .attach('name', "csFl6Y-M_400x400.jpg")
//       .set("access_token", user_token)
//       .then((response) => {
//         let { body, status } = response;
//         expect(status).toEqual(400);
//         expect(typeof body).toEqual("object");
//         // expect(body).toHaveProperty("catImage");
//         // expect(body).toEqual(catsData.catImage);
//         done();
//       })
//       .catch((err) => {
//         done(err);
//       });
//   });
// });

describe("POST/cat/upload FAILED because of undefined file imgupload", function () {
  it("responds with status 400", function (done) {
    let catsData = {
      catImage: ""
    };
    request(app)
      .post("/cat/upload")
      .send(catsData)
      .set("access_token", user_token)
      .then((response) => {
        let { body, status } = response;
        expect(status).toEqual(400);
        expect(typeof body).toEqual("object");
        // expect(body).toHaveProperty("catImage");
        expect(body.msg).toEqual("bad request, no file is selected");
        done();
      })
      .catch((err) => {
        done(err);
      });
  });
});



//PUT
describe("PUT/cat putCats SUCCESS", function () {
  it("responds with status 200", function (done) {
    let catsData = {
      name: "mengkiW",
      gender: "male",
      age: 3,
      race: "persian",
      profilePicture:
        "https://www.purina.co.uk/sites/default/files/2021-02/CAT%20BREED%20Hero%20Desktop_0015_Persian.jpg",
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
        expect(body.name).toEqual(catsData.name);
        expect(body.gender).toEqual(catsData.gender);
        expect(body.age).toEqual(catsData.age);
        expect(body.race).toEqual(catsData.race);
        expect(body.profilePicture).toEqual(catsData.profilePicture);
        expect(body.description).toEqual(catsData.description);
        done();
      })
      .catch((err) => {
        done(err);
      });
  });
});

describe("PUT/cat putCats FAILED because of not having access token", function () {
  it("responds with status 401", function (done) {
    let catsData = {
      name: "mengkiW",
      gender: "male",
      age: 3,
      race: "persian",
      profilePicture:
        "https://www.purina.co.uk/sites/default/files/2021-02/CAT%20BREED%20Hero%20Desktop_0015_Persian.jpg",
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

describe("PUT/cat putCats FAILED because of an empty field or invalid value", function () {
  it("responds with status 400", function (done) {
    let catsData = {
      name: "",
      gender: "",
      age: -3,
      race: "",
      profilePicture:
        "https://www.purina.co.uk/sites/default/files/2021-02/CAT%20BREED%20Hero%20Desktop_0015_Persian.jpg",
      description: "kucing ras persia lucu, umur 1 tahun dijamin sehat",
    };
    request(app)
      .put(`/cat/${cat_id}`)
      .send(catsData)
      .set("access_token", user_token)
      .then((response) => {
        let { body, status } = response;
        expect(status).toEqual(400);
        expect(body).toEqual([
          "Name should not be empty",
          "Gender should not be empty",
          "the minimum age is 1",
          "Race should not be empty",
        ]);
        done();
      })
      .catch((err) => {
        done(err);
      });
  });
});

describe("PUT/cat putCats FAILED because of an invalid type", function () {
  it("responds with status 400", function (done) {
    let catsData = {
      name: "mengkiW",
      gender: "male",
      age: "tiga",
      race: "persian",
      profilePicture:
        "https://www.purina.co.uk/sites/default/files/2021-02/CAT%20BREED%20Hero%20Desktop_0015_Persian.jpg",
      description: "kucing ras persia lucu, umur 1 tahun dijamin sehat",
    };
    request(app)
      .put(`/cat/${cat_id}`)
      .send(catsData)
      .set("access_token", user_token)
      .then((response) => {
        let { body, status } = response;
        expect(status).toEqual(400);
        expect(body).toEqual(["Age must be number"]);
        done();
      })
      .catch((err) => {
        done(err);
      });
  });
});

describe("PUT/cat putCats FAILED because of wrong cat ID", function () {
  it("responds with status 404", function (done) {
    let catsData = {
      name: "mengkiW",
      gender: "male",
      age: 3,
      race: "persian",
      profilePicture:
        "https://www.purina.co.uk/sites/default/files/2021-02/CAT%20BREED%20Hero%20Desktop_0015_Persian.jpg",
      description: "kucing ras persia lucu, umur 1 tahun dijamin sehat",
    };
    request(app)
      .put(`/cat/0`)
      .send(catsData)
      .set("access_token", user_token)
      .then((response) => {
        let { body, status } = response;
        expect(status).toEqual(404);
        expect(body.message).toEqual("error not found");
        done();
      })
      .catch((err) => {
        done(err);
      });
  });
});

describe("PUT/cat putCats FAILED because of unauthorized", function () {
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
      .set("access_token", user2_token)
      .then((response) => {
        let { body, status } = response;
        // console.log(body)
        expect(status).toEqual(401);
        expect(body.message).toEqual("Not authorized!");
        done();
      })
      .catch((err) => {
        done(err);
      });
  });
});

//PATCH
describe("PATCH/cat patchCats SUCCESS", function () {
  it("responds with status 200", function (done) {
    let catsData = {
      status: false,
    };
    request(app)
      .patch(`/cat/${cat_id}`)
      .send(catsData)
      .set("access_token", user_token)
      .then((response) => {
        let { body, status } = response;
        //   console.log(body)
        expect(status).toEqual(200);
        expect(typeof body).toEqual("object");
        expect(body.status).toEqual(catsData.status);

        done();
      })
      .catch((err) => {
        done(err);
      });
  });
});

describe("PATCH/cat patchCats FAILED because of not having access token", function () {
  it("responds with status 401", function (done) {
    let catsData = {
      status: false,
    };
    request(app)
      .patch(`/cat/${cat_id}`)
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

describe("PATCH/cat patchCats FAILED because of wrong cat ID", function () {
  it("responds with status 404", function (done) {
    let catsData = {
      status: false,
    };
    request(app)
      .patch(`/cat/0`)
      .send(catsData)
      .set("access_token", user_token)
      .then((response) => {
        let { body, status } = response;
        expect(status).toEqual(404);
        expect(body.message).toEqual("error not found");
        done();
      })
      .catch((err) => {
        done(err);
      });
  });
});

describe("PATCH/cat patchCats FAILED because of an invalid type", function () {
  it("responds with status 400", function (done) {
    let catsData = {
      status: "ada",
    };
    request(app)
      .patch(`/cat/${cat_id}`)
      .send(catsData)
      .set("access_token", user_token)
      .then((response) => {
        let { body, status } = response;
        expect(status).toEqual(400);
        expect(body.message).toEqual("Invalid Input");
        done();
      })
      .catch((err) => {
        done(err);
      });
  });
});

describe("PATCH/cat patchCats FAILED because of unauthorized", function () {
  it("responds with status 401", function (done) {
      let catsData = {
        status: false
        };
     request(app)
     .patch(`/cat/${cat_id}`)
      .send(catsData)
      .set("access_token", user2_token)
      .then((response) => {
        let { body, status } = response;
        // console.log(body)
        expect(status).toEqual(401);
        expect(body.message).toEqual("Not authorized!");
        done();
      })
      .catch((err) => {
        done(err);
      });
  });
});

//DELETE
describe("DELETE/cat deleteCats SUCCESS ", function () {
  it("responds with status 200", function (done) {
    request(app)
      .delete(`/cat/${cat_id}`)
      .set("access_token", user_token)
      .then((response) => {
        let { body, status } = response;
        expect(status).toEqual(200);
        expect(body.message).toEqual("Cat successfully deleted");
        done();
      })
      .catch((err) => {
        done(err);
      });
  });
});

// describe("DELETE/cat deleteCats FAILED because of unauthorized", function () {
//   it("responds with status 401", function (done) {
//     request(app)
//       .delete(`/cat/${cat_id}`)
//       .set("access_token", user2_token)
//       .then((response) => {
//         let { body, status } = response;
//         console.log(body)
//         expect(status).toEqual(401);
//         expect(body.message).toEqual("Not authorized!");
//         done();
//       })
//       .catch((err) => {
//         done(err);
//       });
//   });
// });

describe("DELETE/cat deleteCats FAILED because of not having an access token ", function () {
  it("responds with status 401", function (done) {
    request(app)
      .delete(`/cat/${cat_id}`)
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

describe("DELETE/cat deleteCats FAILED because of wrong cat ID", function () {
  it("responds with status 404", function (done) {
    request(app)
      .delete(`/cat/0`)
      .set("access_token", user_token)
      .then((response) => {
        let { body, status } = response;
        expect(status).toEqual(404);
        expect(body.message).toEqual("error not found");
        done();
      })
      .catch((err) => {
        done(err);
      });
  });
});





