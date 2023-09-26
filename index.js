import admin from "firebase-admin";
import express, { urlencoded } from "express";
import bodyParser from "body-parser";
import path from "path";
import { request as _request } from "https";
import { google } from "googleapis";

import serviceAccount from "/home/jrr/code/study/firebasefcm/placeholders/service-account.json" assert { type: 'json' };
import getDirname from './utils.js';

const {
  project_id,
  client_email,
  private_key,
} = serviceAccount;

const host = "fcm.googleapis.com";
const url = "/v1/projects/" + project_id + "/messages:send";
const messagingScope = "https://www.googleapis.com/auth/firebase.messaging";
const scopes = [messagingScope];

const __dirname = getDirname(import.meta.url);

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

const app = express();
const PORT = process.env.PORT || 3000;

app.set("views", path.join(__dirname, "views"));
app.set("view engine", "pug");

app.use(bodyParser.json());
app.use(urlencoded({ extended: false }));



app.use(express.static(path.join(__dirname, "public")));

app.get("/", (req, res) => res.render("index"));


// TODO: Send messages to topics


// TODO: Send messages to device token client
app.post("/send-message", (req, res) => {
  const { deviceToken, title, message } = req.body;

  const notification = {
    title: title,
    body: message,
  };

  const payload = {
    notification,
  };

  admin
    .messaging()
    .sendToDevice(deviceToken, payload)
    .then((response) => {
      if (response.results[0].error) {
        console.error("Error sending message:", response.results[0].error);
        res.status(500).send("Error sending message");
      } else {
        console.log("Successfully sent message:", response);
        res.status(200).send("Message sent successfully");
      }
    })
    .catch((error) => {
      console.error("Error sending message:", error);
      res.status(500).send("Error sending message");
    });
});

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
