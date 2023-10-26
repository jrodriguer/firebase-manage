var admin = require("firebase-admin");
var FCMMessage = require("../models/FCMMessage");
var serviceAccount = require("../../placeholders/service-account.json");

admin.initializeApp({credential: admin.credential.cert(serviceAccount)});

const messagingView = (req, res) => {
  res.render('messaging');
};

const sendMessage = (req, res) => {
  const {token, title, body} = req.body;
  const fcmMessage = new FCMMessage(token, title, body);
  const message = fcmMessage.buildMessage();

  admin
    .messaging() 
    .send(message)
    .then((response) => {
        console.log("Successfully sent message to topic:", response);
        res.status(200).json({message: 'Message sent successfully'});
    })
    .catch((error) => {
        res.status(500).json({error: 'Failed to send message'});
    })
};

module.exports = {messagingView, sendMessage};