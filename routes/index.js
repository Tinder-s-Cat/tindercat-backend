const express = require('express')
const router = express.Router()
const userRouter = require('./userRouter')
const catRouter = require ('./catRouter')

// router.get('/', (req, res) => {
//     res.send('Hello World!')
//   })

router.use('/', userRouter)
router.use('/cat', catRouter)

module.exports = router