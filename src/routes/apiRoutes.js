var express = require('express'),
  messagingController = require('../controllers/messagingController'),
  loginController = require('../controllers/loginController')

var router = express.Router()

router.get('/', loginController.loginView)
router.post('/login', async function (req, res) {
  try {
    const result = await loginController.login(req, res);
  } catch (err) {
    res.status(500).json({ success: false, error: 'Internal Server Error:' });
  }
});
router.get('/messaging', messagingController.messagingView)
router.post('/send-message', messagingController.sendMessage)

module.exports = router
