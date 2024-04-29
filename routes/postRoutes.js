const express = require('express')
const router = express.Router()
const postController = require('../controllers/postController')
const verifyJWT = require('../middlewares/verifyJWT')

router.use(verifyJWT)

router.route('/')
    .get(postController.getAllPosts)
    .post(postController.createNewPost)
    .patch(postController.updatePost)
    .delete(postController.deletePost)

module.exports = router