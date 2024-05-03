const express = require('express')
const router = express.Router()
const researchController = require('../controllers/researchController')
const verifyJWT = require('../middlewares/verifyJWT')

router.use(verifyJWT)

router.route('/')
    .get(researchController.getAllResearches)
    .post(researchController.createNewResearch)
    .patch(researchController.updateResearch)
    .delete(researchController.deleteResearch)

module.exports = router