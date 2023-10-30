var express = require("express")

var messagingController = require("../controllers/messagingController");
var loginController = require("../controllers/loginController");

var router = express.Router();

router.get("/login", loginController.loginView);
router.get("/messaging", messagingController.messagingView);
router.post("/send-message", messagingController.sendMessage);

module.exports = router;