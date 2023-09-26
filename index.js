import admin from "firebase-admin";
import express, { urlencoded } from "express";
import bodyParser from "body-parser";
import path from "path";
import { request as _request } from "https";
import { google } from "googleapis";

import serviceAccount from "/home/jrr/code/study/firebasefcm/placeholders/service-account.json" assert { type: 'json' };
import {getFilename, getDirname} from './utils.js';

const {
  project_id,
  client_email,
  private_key,
} = serviceAccount;

const host = "fcm.googleapis.com";
const url = "/v1/projects/" + project_id + "/messages:send";
const messagingScope = "https://www.googleapis.com/auth/firebase.messaging";
const scopes = [messagingScope];


const __filename = getFilename(import.meta.url);
console.log('__filename: ', __filename);
const __dirname = getDirname(import.meta.url);
console.log('__dirname: ', __dirname);


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


// TODO: Send messages to clients that are subscribed to the `allusers` topic
function getAccessToken() {
  return new Promise(function (resolve, reject) {
    const jwtClient = new google.auth.JWT(
      client_email,
      null,
      private_key,
      scopes,
      null,
    );
    jwtClient.authorize(function (err, tokens) {
      if (err) {
        reject(err);
        return;
      }
      resolve(tokens.access_token);
    });
  });
}

app.post("/send-fcm-message", (req, res) => {
  const { title, message } = req.body;

  const notification = {
    title: title,
    body: message,
  };

  const payload = {
    message: {
      topic: "allusers",
      notification,
    },
  };

  getAccessToken().then(function (accessToken) {
    const options = {
      hostname: host,
      path: url,
      method: "POST",
      headers: {
        Authorization: "Bearer " + accessToken,
      },
    };

    const request = request(options, function (resp) {
      resp.setEncoding("utf8");
      resp.on("data", function (data) {
        console.log("Message sent to Firebase for delivery, response:");
        console.log(data);
      });
    });

    request.on("error", function (err) {
      console.log("Unable to send message to Firebase");
      console.log(err);
    });

    request.write(JSON.stringify(payload));
    request.end();
  });
});


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
