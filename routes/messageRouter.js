const express = require('express')
const userRouter = express.Router()
const messageController = require('../controller/messageController')

userRouter.get("/matched", messageController.Matched)
userRouter.get("/chatroom", messageController.Chatroom)

module.exports = userRouter