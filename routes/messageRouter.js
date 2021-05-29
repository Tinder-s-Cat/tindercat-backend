const express = require('express')
const messgaeRouter = express.Router()
const messageController = require('../controller/messageController')
const authentication = require("../Middlewares/authentication");
const authMsg = require("../Middlewares/authorizationMessage");


messgaeRouter.use(authentication);
messgaeRouter.get("/matched", messageController.getMatched)
messgaeRouter.get("/chatroom", messageController.getChatroom)

// messgaeRouter.get("/chatroom/:id/:isMatchId", messageController.getMessage)
// messgaeRouter.use(authMsg);
messgaeRouter.get("/chatroom/:id/:isMatchId", authMsg, messageController.getMessage)
messgaeRouter.post("/chatroom/:id", messageController.postMessage)

module.exports = messgaeRouter