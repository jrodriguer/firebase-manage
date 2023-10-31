var express = require("express"),
  messagingController = require("../controllers/messagingController"),
  loginController = require("../controllers/loginController");

var router = express.Router();

router.get("/", loginController.loginView);
router.post("/retrieve-user", loginController.retrieveUser);
router.get("/messaging", messagingController.messagingView);
router.post("/send-message", messagingController.sendMessage);

module.exports = router;
