var express = require("express")

var messagingController = require("../controllers/messagingController");

var router = express.Router();

router.get("/messaging", messagingController.messagingView);
router.post("/send-message/:id?", messagingController.sendMessage);

module.exports = router;