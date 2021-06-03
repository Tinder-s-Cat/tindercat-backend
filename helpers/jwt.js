const jwt = require('jsonwebtoken')
const JWT_SECRET = process.env.JWT_SECRET

function generateToken(payload){
  console.log("here");
  return jwt.sign(payload,JWT_SECRET)
}

function verifyToken(token){
  return jwt.verify(token,JWT_SECRET)
}

module.exports = {generateToken,verifyToken}