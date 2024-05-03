const express = require('express')
const router = express.Router()
const imageController = require('../controllers/imageController')
const verifyJWT = require('../middlewares/verifyJWT')

router.use(verifyJWT)

router.route('/')
    .post(imageController.createNewImage)

module.exports = router