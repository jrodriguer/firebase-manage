var admin = require("firebase-admin");
var serviceAccount = require("../../placeholders/service-account.json");

admin.initializeApp({credential: admin.credential.cert(serviceAccount)});

const sendMessageToTopic = ({title, body, topic}) => {
  const message = {
    notification: {
      title,
      body,
    },
    topic,
  };

  return admin.messaging().send(message);
}

const sendMessageToDevice = (title, body, token) => {
  const message = {
    notification: {
      title,
      body,
    },
    token
  };

  return admin.messaging().send(message);
};

module.exports = {sendMessageToTopic, sendMessageToDevice};