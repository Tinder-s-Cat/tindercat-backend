const express = require('express')
const userRouter = express.Router()
const messageController = require('../controller/messageController')

userRouter.get("/matched", messageController.Matched)

module.exports = userRouter