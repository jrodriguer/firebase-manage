var express = require("express")

var messagingController = require("../controllers/messagingController");

var router = express.Router();

router.get("/messaging", messagingController.messagingView);
router.post("/send-message-topic", messagingController.sendMessageToTopic);
router.post("/send-message-device", messagingController.sendMessageToDevice);

module.exports = router;