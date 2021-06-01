if (process.env.NODE_ENV !== "production"){
  require ("dotenv").config()
}
const express = require('express')
const app = express()
const port = 3000
const cors = require ('cors')
const router = require ('./routes/index')
const errorhandler = require('./Middlewares/ErrorHandler')

app.use(express.json())
app.use(express.static('./public'));
app.use(cors())
app.use(express.urlencoded({extended:false}))
app.use(router)
app.use(errorhandler)

// app.listen(port, () => {
//   console.log(`Example app listening at http://localhost:${port}`)
// })

module.exports = app