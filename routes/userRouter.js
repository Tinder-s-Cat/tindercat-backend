const express = require('express')
const userRouter = express.Router()
const userController = require('../controller/userController')
const authentication = require('../Middlewares/authentication')

userRouter.post("/register", userController.register)
userRouter.post("/login", userController.login)

userRouter.use("/", authentication)
userRouter.post("/like", userController.postLikesToOneCat)
userRouter.get("/friend/:id", userController.readOneFriend)

module.exports = userRouter
