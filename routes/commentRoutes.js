const express = require('express')
const router = express.Router()
const commentController = require('../controllers/commentController')
const verifyJWT = require('../middlewares/verifyJWT')

router.use(verifyJWT)

router.route('/')
    .get(commentController.getAllContentComments)
    .post(commentController.createNewContentComment)
    .patch(commentController.updateContentComment)
    .delete(commentController.deleteContentComment)

module.exports = router