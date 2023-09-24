const admin = require("firebase-admin");
const express = require("express");
const bodyParser = require("body-parser");
const path = require("path");

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


app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(bodyParser.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));

app.get('/', (req, res) => res.render('index'));

// TODO: Send meessaging to FCM with token

// TODO: Send messaging to FCM 
app.post('/send-message', (req, res) => {
  const { device, title, message } = req.body;

  const notification = {
    title: title,
    body: message,
  }

  const payload = {
    // message: {
    // topic: 'allusers',
    notification
    // }
  };

  console.log({ device, payload })

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

