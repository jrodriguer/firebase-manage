const admin = require("firebase-admin");
const express = require("express");
const bodyParser = require("body-parser");

const PROJECT_ID = '<YOUR-PROJECT-ID>';
const HOST = 'fcm.googleapis.com';
const PATH = '/v1/projects/' + PROJECT_ID + '/messages:send';
const MESSAGING_SCOPE = 'https://www.googleapis.com/auth/firebase.messaging';
const SCOPES = [MESSAGING_SCOPE];

const serviceAccount = require("/home/jrodriguer/code/study/firebasefcm/placeholders/service-account.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

const app = express();
const PORT = process.env.PORT || 3000;

app.use(bodyParser.json());

async function sendMessageToDevice(token, payload) {
  try {
    const response = await admin.messaging().sendToDevice(token, payload);
    console.log('Message sent successfully:', response);
  } catch (error) {
    console.error('Error sending message:', error);
  }
}

app.post('/send-message', (req, res) => {
  const { token, message } = req.body;

  const payload = {
    notification: {
      title: 'FCM Test',
      body: message,
    },
  };

  admin
    .messaging()
    .sendToDevice(token, payload)
    .then((response) => {
      console.log('Successfully sent message:', response);
      res.status(200).send('Message sent successfully');
    })
    .catch((error) => {
      console.error('Error sending message:', error);
      res.status(500).send('Error sending message');
    });
});

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});

