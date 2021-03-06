# TINDER FOR CATS
## Available endpoints

> USER
- `POST /register`
- `POST /login`
- `GET /friend/:id`
- `POST /like`


> CATS
- `GET CATS /cat`
- `GET CATS BY ID /cat/:id`
- `POST CATS /cat`
- `PUT CATS /cat/:id`
- `PATCH CATS /cat/:id`
- `DELETE CATS /cat/:id`

> MESSAGE
- `GET FRIENDS /friend`
- `GET CHATROOM /chatroom/:id/:isMatchId`
- `POST MESSAGE /chatroom/:id/:isMatchId`


## RESTful endpoints

### POST /register

> create user

_Request Header_

```
    not needed
```

_Request Body_

```
{
    email:"test3@mail.com"
    password:"password"
    location:"jakarta barat",
    lat: "6.1599934",
    lng: "106.6872183",
    username:"test3",
    profilePicture:"https://c.files.bbci.co.uk/12A9B/production/_111434467_gettyimages-1143489763.jpg"
}
```

_Response (201 - Created)_

```
{
    "id": 5,
    "email": "test3@mail.com",
    "username": "test3",
    "password": "$2b$10$PN5fyS/GRiW9jl3royKszuDofYvbaOd5hv6mJvjfNPbdYN1h5e5ze",
    "location": "jakarta barat",
    "profilePicture": "https://c.files.bbci.co.uk/12A9B/production/_111434467_gettyimages-1143489763.jpg",
    "updatedAt": "2021-05-29T09:39:38.016Z",
    "createdAt": "2021-05-29T09:39:38.016Z"
}
```

### POST /login

> login user

_Request Header_

```
    not needed
```

_Request Body_

```
{
    email : "test3@mail.com",
    password : "password"
}
```

_Response (200 - OK)_

```
{
    {
    "access_token": <access_token>,
    "id": 5,
    "username": "test3",
    "location": "jakarta barat",
    "profilePicture": "https://c.files.bbci.co.uk/12A9B/production/_111434467_gettyimages-1143489763.jpg"
}
}
```

### GET FRIEND BY ID /friend/:id

>Get friend based on user id

_Request Header_

```
    access_token(string)
```

_Request Params_

```
    id=[integer]
```

_Response (200 - OK)_

```
{
    "id": 1,
    "username": "test",
    "location": "pekanbaru",
    "lat": "0.5941795",
    "lng": "101.6436178",
    "email": "test@mail.com",
    "password": "$2b$10$dFBXeqe6OOAo9cDIP3yPb.uu2e9sGUlxpt4Hq6OjBDDj.tgpOe0Za",
    "profilePicture": "tes",
    "createdAt": "2021-05-29T04:22:54.437Z",
    "updatedAt": "2021-05-29T04:22:54.437Z",
    "Cats": [
        {
            "id": 1,
            "UserId": 1,
            "name": "milo",
            "gender": "male",
            "age": 2,
            "race": "persia",
            "status": true,
            "profilePicture": "asd",
            "description": "asd",
            "createdAt": "2021-05-29T05:47:30.870Z",
            "updatedAt": "2021-05-29T05:47:30.870Z",
            "IsLike": {
                "id": 1,
                "UserId": 1,
                "CatId": 1,
                "createdAt": "2021-05-29T05:47:30.870Z",
                "updatedAt": "2021-05-29T05:47:30.870Z"
            }
        },
        {
            "id": 2,
            "UserId": 1,
            "name": "milky",
            "gender": "male",
            "age": 2,
            "race": "persia",
            "status": true,
            "profilePicture": "asd",
            "description": "asd",
            "createdAt": "2021-05-29T05:47:30.870Z",
            "updatedAt": "2021-05-29T05:47:30.870Z",
            "IsLike": {
                "id": 2,
                "UserId": 1,
                "CatId": 2,
                "createdAt": "2021-05-29T08:32:57.406Z",
                "updatedAt": "2021-05-29T08:32:57.406Z"
            }
        },
        {
            "id": 3,
            "UserId": 1,
            "name": "ucing",
            "gender": "female",
            "age": 2,
            "race": "persia",
            "status": true,
            "profilePicture": "asd",
            "description": "asd",
            "createdAt": "2021-05-29T05:47:30.870Z",
            "updatedAt": "2021-05-29T05:47:30.870Z",
            "IsLike": {
                "id": 3,
                "UserId": 1,
                "CatId": 3,
                "createdAt": "2021-05-29T10:42:28.288Z",
                "updatedAt": "2021-05-29T10:42:28.288Z"
            }
        }
    ],
    "distance": 26
}
```

### POST LIKE /like

> add like to islikes and add or update status to ismatches

_Request Header_

```
    access_token(string)
```

_Request Body_

```
{
    UserId:1
    CatId:2
}
```

_Response (200 - OK)_

```
{
    "message": "Congratulation You Are Match"
}
```



### GET CATS /cat

> fetch all cat data

_Request Header_

```
    access_token(string)
```

_Request Body_

```
    not needed
```

_Response (200 - OK)_

```
[
    {
        "id": 5,
        "UserId": 2,
        "name": "black",
        "gender": "female",
        "age": 2,
        "race": "anggora",
        "status": true,
        "profilePicture": "asda",
        "description": "asd",
        "createdAt": "2021-05-29T05:47:30.870Z",
        "updatedAt": "2021-05-29T05:47:30.870Z",
        "User": {
            "id": 2,
            "username": "asd",
            "location": "pekanbaru",
            "lat": "0.8293671",
            "lng": "101.3443131",
            "email": "asd@mail.com",
            "password": "$2b$10$aENfJudDMNNbXJbHP9y5zOgqpgxjGEe5j.AtSV5dhD8p.F9mq6p7G",
            "profilePicture": "asd",
            "createdAt": "2021-05-29T05:47:30.870Z",
            "updatedAt": "2021-05-29T05:47:30.870Z"
        },
        "distance": 20
    },
    {
        "id": 1,
        "UserId": 1,
        "name": "milo",
        "gender": "male",
        "age": 2,
        "race": "persia",
        "status": true,
        "profilePicture": "asd",
        "description": "asd",
        "createdAt": "2021-05-29T05:47:30.870Z",
        "updatedAt": "2021-05-29T05:47:30.870Z",
        "User": {
            "id": 1,
            "username": "test",
            "location": "pekanbaru",
            "lat": "0.5941795",
            "lng": "101.6436178",
            "email": "test@mail.com",
            "password": "$2b$10$dFBXeqe6OOAo9cDIP3yPb.uu2e9sGUlxpt4Hq6OjBDDj.tgpOe0Za",
            "profilePicture": "tes",
            "createdAt": "2021-05-29T04:22:54.437Z",
            "updatedAt": "2021-05-29T04:22:54.437Z"
        },
        "distance": 26
    },
    {
        "id": 2,
        "UserId": 1,
        "name": "milky",
        "gender": "male",
        "age": 2,
        "race": "persia",
        "status": true,
        "profilePicture": "asd",
        "description": "asd",
        "createdAt": "2021-05-29T05:47:30.870Z",
        "updatedAt": "2021-05-29T05:47:30.870Z",
        "User": {
            "id": 1,
            "username": "test",
            "location": "pekanbaru",
            "lat": "0.5941795",
            "lng": "101.6436178",
            "email": "test@mail.com",
            "password": "$2b$10$dFBXeqe6OOAo9cDIP3yPb.uu2e9sGUlxpt4Hq6OjBDDj.tgpOe0Za",
            "profilePicture": "tes",
            "createdAt": "2021-05-29T04:22:54.437Z",
            "updatedAt": "2021-05-29T04:22:54.437Z"
        },
        "distance": 26
    }
]
```
### GET CATS BY ID /cat/:id

>Get cat based on cat id

_Request Header_

```
    access_token(string)
```

_Request Params_

```
    id=[integer]
```

_Request Body_

```
{
    name:"Pikachu"
    gender:"female"
    age:"3"
    race:"sphynx"
    profilePicture:"https://upload.wikimedia.org/wikipedia/commons/thumb/0/0c/American_Shorthair.jpg/1200px-American_Shorthair.jpg"
    description:"ayo kenalan!!"
}
```

_Response (200 - OK)_

```
{
    "status": true,
    "id": 4,
    "name": "Pikachu",
    "gender": "female",
    "age": 3,
    "race": "sphynx",
    "profilePicture": "https://upload.wikimedia.org/wikipedia/commons/thumb/0/0c/American_Shorthair.jpg/1200px-American_Shorthair.jpg",
    "description": "ayo kenalan!!",
    "UserId": 2,
    "updatedAt": "2021-05-29T09:13:22.324Z",
    "createdAt": "2021-05-29T09:13:22.324Z"
}
```

### POST CATS /cat

> add cat to user's cat list

_Request Header_

```
    access_token(string)
```

_Request Body_

```
{
    name:"Pikachu"
    gender:"female"
    age:"3"
    race:"sphynx"
    profilePicture:"https://upload.wikimedia.org/wikipedia/commons/thumb/0/0c/American_Shorthair.jpg/1200px-American_Shorthair.jpg"
    description:"ayo kenalan!!"
}
```

_Response (200 - OK)_

```
{
    "status": true,
    "id": 4,
    "name": "Pikachu",
    "gender": "female",
    "age": 3,
    "race": "sphynx",
    "profilePicture": "https://upload.wikimedia.org/wikipedia/commons/thumb/0/0c/American_Shorthair.jpg/1200px-American_Shorthair.jpg",
    "description": "ayo kenalan!!",
    "UserId": 2,
    "updatedAt": "2021-05-29T09:13:22.324Z",
    "createdAt": "2021-05-29T09:13:22.324Z"
}
```

### PUT CATS /cat/:id

> edit cat based on id

_Request Header_

```
    access_token(string)
```

_Request Body_

```
{

    "name": "Pikachu",
    "gender": "female",
    "age": 2,
    "race": "sphynx",
    "profilePicture": "https://upload.wikimedia.org/wikipedia/commons/thumb/0/0c/American_Shorthair.jpg/1200px-American_Shorthair.jpg",
    "description": "ayo kenalan!!"

}
```

_Request Params_

```
    id=[integer]
```

_Response (200 - OK)_

```
{
    "id": 4,
    "UserId": 2,
    "name": "Pikachu",
    "gender": "female",
    "age": 2,
    "race": "sphynx",
    "status": true,
    "profilePicture": "https://upload.wikimedia.org/wikipedia/commons/thumb/0/0c/American_Shorthair.jpg/1200px-American_Shorthair.jpg",
    "description": "ayo kenalan!!",
    "createdAt": "2021-05-29T09:13:22.324Z",
    "updatedAt": "2021-05-29T09:21:24.122Z"
}
```

### PATCH CATS /cat/:id

> edit cat based on id

_Request Header_

```
    access_token(string)
```

_Request Body_

```
{

    status: false

}
```

_Request Params_

```
    id=[integer]
```

_Response (200 - OK)_

```
{
    "id": 2,
    "UserId": 1,
    "name": "Vodka",
    "gender": "female",
    "age": 2,
    "race": "persian",
    "status": false,
    "profilePicture": "https://upload.wikimedia.org/wikipedia/commons/thumb/0/0c/American_Shorthair.jpg/1200px-American_Shorthair.jpg",
    "description": "vodka mencari teman bermain :)",
    "createdAt": "2021-05-29T06:35:36.967Z",
    "updatedAt": "2021-05-29T15:52:10.497Z"
}
```

### DELETE CATS /cat/:id

> delete cat based on ID

_Request Header_

```
    access_token(string)
```

_Request Body_

```
{

    not needed

}
```

_Request Params_

```
    id=[integer]
```

_Response (200 - OK)_

```
{
  message: "Cat successfully deleted"
}
```

### GET FRIENDS /friend

> GET ALL MATCHED USER

_Request Header_

```
    access_token(string)
```

_Request Body_

```
{

    not needed

}
```

_Response (200 - OK)_

```
[
    {
        "id": 2 [represents ChatroomId],
        "UserId": 2,
        "username": "fadel",
        "location": "Jakarta",
        "email": "fadel@mail.com",
        "profilePicture": "https://lh3.googleusercontent.com/ogw/ADGmqu9v_mymcX9xsd3tpF4AtS8Na3XMCi6dv-hg3BFFVw=s192-c-mo"
    },
    {
        "id": 4,
        "UserId": 1,
        "username": "emiliakhaer",
        "location": "Jakarta",
        "email": "emil@mail.com",
        "profilePicture": "https://lh3.googleusercontent.com/ogw/ADGmqu9v_mymcX9xsd3tpF4AtS8Na3XMCi6dv-hg3BFFVw=s192-c-mo"
    }
]
```

### GET CHATROOM /chatroom/:id/:isMatchId

> SHOWS ALL MESSAGE BETWEEN 2 USERS BASED ON ChatroomId AND isMatchId

_Request Header_

```
    access_token(string)
```

_Request Params_

```
    id=[integer (ChatroomId)]
    isMatchId=[integer (IsMatchId)]
```

_Request Body_

```
{

    not needed

}
```

_Response (200 - OK)_

```
[
  {
        "id": 5,
        "ChatRoomId": 2,
        "UserId": 3,
        "message": "aku khaer",
        "createdAt": "2021-05-29T08:54:59.949Z",
        "updatedAt": "2021-05-29T08:54:59.949Z",
        "User": {
            "id": 3,
            "username": "khaer",
            "location": "Jakarta",
            "email": "k@mail.com",
            "profilePicture": "https://lh3.googleusercontent.com/ogw/ADGmqu9v_mymcX9xsd3tpF4AtS8Na3XMCi6dv-hg3BFFVw=s192-c-mo"
        }
    },
    {
        "id": 8,
        "ChatRoomId": 2,
        "UserId": 1,
        "message": "kucing aku namanya lope / female",
        "createdAt": "2021-05-29T15:56:08.651Z",
        "updatedAt": "2021-05-29T15:56:08.651Z",
        "User": {
            "id": 1,
            "username": "emiliakhaer",
            "location": "Jakarta",
            "email": "emil@mail.com",
            "profilePicture": "https://lh3.googleusercontent.com/ogw/ADGmqu9v_mymcX9xsd3tpF4AtS8Na3XMCi6dv-hg3BFFVw=s192-c-mo"
        }
    }
]
```

### POST MESSAGE /chatroom/:id/:isMatchId

> POST A MESSAGE TO CHATROOM; BASED ON ChatroomId AND isMatchId

_Request Header_

```
    access_token(string)
```

_Request Params_

```
    id=[integer (ChatroomId)]
    isMatchId=[integer (IsMatchId)]
```

_Request Body_

```
{
    "message" : "kucing aku namanya lope / female"
}
```

_Response (200 - OK)_

```
{
    "id": 8,
    "UserId": 1,
    "ChatRoomId": 2,
    "message": "kucing aku namanya lope / female",
    "updatedAt": "2021-05-29T15:56:08.651Z",
    "createdAt": "2021-05-29T15:56:08.651Z"
}
```
