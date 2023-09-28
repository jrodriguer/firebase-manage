import admin from "firebase-admin";
import express, { urlencoded } from "express";
import bodyParser from "body-parser";
import path from "path";
import { request as _request } from "https";

import serviceAccount from "/home/jrr/code/study/firebasefcm/placeholders/service-account.json" assert { type: "json" };
import { getDirname } from "./utils.js";

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
app.post("/send-message-topic", (req, res) => {
  const { title, body } = req.body;
  const topic = "all-users";
  const message = {
    notification: {
      title,
      body,
    },
    topic,
  };

  admin
    .messaging()
    .send(message)
    .then(function (response) {
      console.log("Successfully sent message:", response);
    })
    .catch(function (error) {
      console.log("Error sending message:", error);
    });
});

// TODO: Send messages to device token client
app.post("/send-message-device", (req, res) => {
  const { deviceToken, title, body } = req.body;
  const payload = {
    notification: {
      title,
      body,
    },
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
