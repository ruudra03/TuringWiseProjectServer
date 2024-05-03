const express = require('express')
const router = express.Router()
const orgCardController = require('../controllers/orgCardController')
const verifyJWT = require('../middlewares/verifyJWT')

router.use(verifyJWT)

router.route('/')
    .get(orgCardController.getAllOrgCards)
    .post(orgCardController.createNewOrgCard)
    .patch(orgCardController.updateOrgCard)
    .delete(orgCardController.deleteOrgCard)

module.exports = router