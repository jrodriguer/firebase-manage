import admin from "firebase-admin";
import express, { urlencoded } from "express";
import bodyParser from "body-parser";
import path from "path";
import { request as _request } from "https";
import * as fs from "fs";

import serviceAccount from "/home/jrr/code/study/firebasefcm/placeholders/service-account.json" assert { type: "json" };
import { getDirname } from "./utils.js";
import ca from "/home/jrr/code/project/wenea-app-capacitor/src/assets/i18n/ca.json" assert { type: "json" };
import de from "/home/jrr/code/project/wenea-app-capacitor/src/assets/i18n/de.json" assert { type: "json" };
import en from "/home/jrr/code/project/wenea-app-capacitor/src/assets/i18n/en.json" assert { type: "json" };
import es from "/home/jrr/code/project/wenea-app-capacitor/src/assets/i18n/es.json" assert { type: "json" };
import eu from "/home/jrr/code/project/wenea-app-capacitor/src/assets/i18n/eu.json" assert { type: "json" };
import fr from "/home/jrr/code/project/wenea-app-capacitor/src/assets/i18n/fr.json" assert { type: "json" };
import gl from "/home/jrr/code/project/wenea-app-capacitor/src/assets/i18n/gl.json" assert { type: "json" };
import pt from "/home/jrr/code/project/wenea-app-capacitor/src/assets/i18n/pt.json" assert { type: "json" };

const __dirname = getDirname(import.meta.url);

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

const app = express();
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});

app.set("views", path.join(__dirname, "views"));
app.set("view engine", "pug");

app.use(bodyParser.json());
app.use(urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, "public")));

app.get("/", (req, res) => res.render("index"));
app.get("/translations", (req, res) => res.render("translations"));

/*
 *  FCM
 * */

app.post("/send-message-topic", (req, res) => {
  const { title, body } = req.body;
  const topic = "all_users";
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

app.post("/send-message-device", (req, res) => {
  const { deviceToken, title, body } = req.body;

  console.log({ deviceToken, title, body });

  admin
    .messaging()
    .sendToDevice(
      [deviceToken],
      {
        data: {
          foo: "bar",
        },
        notification: {
          title,
          body,
        },
      },
      {
        // Required for background/terminated app state messages on iOS and android
        contentAvailable: true,
        priority: "high",
      },
    )
    .then((res) => {
      if (res.failureCount) {
        console.log("Failed", res.results[0].error);
      } else {
        console.log("Success");
      }
    })
    .catch((err) => {
      console.log("Error:", err);
    });
});

/*
 * REMOTE CONFIG
 * */

let merged = { ...ca, ...de, ...en, ...es, ...eu, ...fr, ...gl, ...pt };

let config = {
  conditions: [
    {
      name: "For English Android Users",
      expression: "device.os == 'android' && device.language in ['en']",
      tagColor: "CYAN",
    },
    {
      name: "For Portugal Android Users",
      expression: "device.os == 'android' && device.country in ['PT']",
      tagColor: "GREEN",
    },
    {
      name: "For Catalan Android Users",
      expression: "device.os == 'android' && device.language in ['ca']",
      tagColor: "ORANGE",
    },
    {
      name: "For Deutch Android Users",
      expression: "device.os == 'android' && device.country in ['DE']",
      tagColor: "PURPLE",
    },
    {
      name: "For French Android Users",
      expression: "device.os == 'android' && device.language in ['fr']",
      tagColor: "BLUE",
    },
    {
      name: "For Galician Android Users",
      expression: "device.os == 'android' && device.language in ['gl']",
      tagColor: "PINK",
    },
    {
      name: "For Vasque Android Users",
      expression: "device.os == 'android' && device.language in ['eu']",
      tagColor: "BROWN",
    },
  ],
  parameters: {},
  version: {
    versionNumber: "1",
    updateTime: "2023-10-13T10:14:34.232466Z",
    updateUser: {
      email: "juliorodriguezramirez@gmail.com",
    },
    updateOrigin: "CONSOLE",
    updateType: "INCREMENTAL_UPDATE",
  },
};

app.get("/download-template", () => {
  admin
    .remoteConfig()
    .getTemplate()
    .then((template) => {
      console.log("ETag from server: " + template.etag);
      const templateStr = JSON.stringify(template);
      console.log(templateStr);
      // fs.writeFileSync("config.json", templateStr);
    })
    .catch((err) => {
      console.error("Unable to get template");
      console.error(err);
    });
});

app.get("/list-versions", () => {
  admin
    .remoteConfig()
    .listVersions()
    .then((listVersionsResult) => {
      console.log("Successfully fetched the list of versions");
      listVersionsResult.versions.forEach((version) => {
        console.log("version", JSON.stringify(version));
      });
    })
    .catch((error) => {
      console.log(error);
    });
});

// for (let key in merged.generic) {
//   config.parameters[`generic_${key}`] = {
//     defaultValue: {
//       value: es.generic[key],
//     },
//     conditionalValues: {
//       "For English Android Users": {
//         value: en.generic[key],
//       },
//       "For Portugal Android Users": {
//         value: pt.generic[key],
//       },
//       "For Catalan Android Users": {
//         value: ca.generic[key],
//       },
//       "For Deutch Android Users": {
//         value: de.generic[key],
//       },
//       "For French Android Users": {
//         value: fr.generic[key],
//       },
//       "For Galician Android Users": {
//         value: gl.generic[key],
//       },
//       "For Vasque Android Users": {
//         value: eu.generic[key],
//       },
//     },
//     valueType: "STRING",
//   };
// }
//
// let json = JSON.stringify(config, null, 2);
//
// fs.writeFileSync("remote-config.json", json, "UTF8", function (err) {
//   if (err) throw err;
//   console.log("complete");
// });
