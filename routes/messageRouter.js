const express = require('express')
const messgaeRouter = express.Router()
const messageController = require('../controller/messageController')
const authentication = require("../Middlewares/authentication");
const authChatroom = require("../Middlewares/authorizationChatroom");


messgaeRouter.use(authentication);
messgaeRouter.get("/friend", messageController.getChatroom)

messgaeRouter.get("/chatroom/:id/:isMatchId", authChatroom, messageController.getMessage)
messgaeRouter.post("/chatroom/:id/:isMatchId", authChatroom, messageController.postMessage)

module.exports = messgaeRouter