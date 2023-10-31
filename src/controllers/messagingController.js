var admin = require("../firebaseAdmin"),
  FCMMessage = require("../models/FCMMessage");

function messagingView(req, res) {
  res.render("messaging");
}

function sendMessage(req, res) {
  var token = req.body.token,
    title = req.body.title,
    body = req.body.body;
  var fcmMessage = new FCMMessage(token, title, body);
  var message = fcmMessage.buildMessage();

  admin
    .messaging()
    .send(message)
    .then(function (response) {
      console.log("Successfully sent message to topic:" + response);
      res.status(200).json({ message: "Message sent successfully" });
    })
    .catch(function (error) {
      res.status(500).json({ error: "Failed to send message" });
    });
}

exports.messagingView = messagingView;
exports.sendMessage = sendMessage;
