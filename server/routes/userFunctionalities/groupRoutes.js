const groupController = require('../../controllers/groupController')
const express = require('express')
const { requireAuth } = require('../../middlewares/authmiddleware')
const router = express.Router()


router.post('/create_group',requireAuth,groupController.create_group)
router.get('/groups', requireAuth, groupController.get_groups);

module.exports = router;

