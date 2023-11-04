const express = require('express')
const messagingController = require('../controllers/messagingController')
const loginController = require('../controllers/loginController')

const router = express.Router()

router.get('/', loginController.loginView)
router.post('/login', loginController.login)
router.get('/messaging', messagingController.messagingView)
router.post('/send-message', messagingController.sendMessage)

module.exports = router
