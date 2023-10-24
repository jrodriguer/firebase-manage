var express = require("express")

var messagingController = require("../controllers/messagings");

var router = express.Router();

router.get("/messaging", messagingController.messagingView);

module.exports = router;
