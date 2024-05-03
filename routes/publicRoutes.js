const express = require('express')
const router = express.Router()
const userController = require('../controllers/userController')
const articleController = require('../controllers/articleController')
const researchController = require('../controllers/researchController')

router.route('/signup')
    .post(userController.createNewUser)

router.route('/articles')
    .get(articleController.getAllArticles)

router.route('/researches')
    .get(researchController.getAllResearches)

module.exports = router