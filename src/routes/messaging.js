var express = require("express")

var {messagingView} = require("../controllers/messagingController");

var router = express.Router();

router.get("/messaging", messagingView);

module.exports = router;
