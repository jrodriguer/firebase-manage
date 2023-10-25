var FCMMessage = require("../models/FCMMessage");
var messagingService = require("../services/messagingService");

const messagingView = (req, res) => {
  res.render('messaging');
};

const sendMessageToTopic = (req, res) => {
  const {title, body} = req.body;
  // TODO: Remove hard code topic
  const topic = "all_users";
  const message = new FCMMessage(title, body, topic);

  messagingService
    .sendMessageToTopic(message)
    .then((response) => {
        console.log("Successfully sent message to topic:", response);
        res.status(200).json({message: 'Message sent successfully'});
    })
    .catch((error) => {
        res.status(500).json({error: 'Failed to send message'});
    })
};

const sendMessageToDevice = async (req, res, next) => {};

module.exports = {messagingView, sendMessageToTopic, sendMessageToDevice};