var admin = require("firebase-admin");

admin.initializeApp({
  credential: admin.credential.cert(require "../../placeholders/service-account.json"),
});

exports.sendMessageToTopic = function(title, body, topic) {
  const message = {
    notification: {
      title,
      body,
    },
    topic,
  };

  return admin.messaging().send(message);
}

exports.sendMessageToDevice = function(title, body, token) {
  const message = {
    notification: {
      title,
      body,
    },
    token
  };

  return admin.messaging().send(message);
}
