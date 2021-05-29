const express = require('express')
const userRouter = express.Router()
const messageController = require('../controller/messageController')

userRouter.get("/matched", messageController.getMatched)
userRouter.get("/chatroom", messageController.getChatroom)
userRouter.get("/chatroom/:id", messageController.getMessage)
userRouter.post("/chatroom/:id", messageController.postMessage)

module.exports = userRouter