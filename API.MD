# TINDER FOR CATS
## Available endpoints

- `POST /register`
- `POST /login`

- `GET CATS /cat`
- `GET CATS BY ID /cat/:id`
- `POST CATS /cat`
- `PUT CATS /cat/:id`
- `PATCH CATS /cat/:id`
- `DELETE CATS /cat/:id`


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
    location:"jakarta barat"
    username:"test3"
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
        "id": 1,
        "UserId": 1,
        "name": "mengki",
        "gender": "male",
        "age": 3,
        "race": "domestic",
        "status": true,
        "profilePicture": "https://upload.wikimedia.org/wikipedia/commons/thumb/0/0c/American_Shorthair.jpg/1200px-American_Shorthair.jpg",
        "description": "kucing jantan umur 3 tahun cari pasangan, dijamin sehat",
        "createdAt": "2021-05-29T06:29:31.709Z",
        "updatedAt": "2021-05-29T06:29:31.709Z",
        "User": {
            "id": 1,
            "username": "test3",
            "location": "jakarta barat",
            "email": "test3@mail.com",
            "password": "$2b$10$vMGN3Ns/F1GqsNeZqBapDuhlVwjv1pqnhlgSEnlTJwunjtCdA3ZOq",
            "profilePicture": "https://c.files.bbci.co.uk/12A9B/production/_111434467_gettyimages-1143489763.jpg",
            "createdAt": "2021-05-29T06:08:35.987Z",
            "updatedAt": "2021-05-29T06:08:35.987Z"
        }
    },
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
        "updatedAt": "2021-05-29T09:21:24.122Z",
        "User": {
            "id": 2,
            "username": "test3",
            "location": "jakarta barat",
            "email": "test3@mail.com",
            "password": "$2b$10$DtDM3H1OKMLrKsj1iwcYFuvFzTOZgldr57VfJiOLRqWcWKUVeeuwy",
            "profilePicture": "https://c.files.bbci.co.uk/12A9B/production/_111434467_gettyimages-1143489763.jpg",
            "createdAt": "2021-05-29T09:11:52.415Z",
            "updatedAt": "2021-05-29T09:11:52.415Z"
        }
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