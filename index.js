import admin from "firebase-admin";
import express, { urlencoded } from "express";
import bodyParser from "body-parser";
import path from "path";
import { request as _request } from "https";
import * as fs from "fs";
import multer from "multer";
import serviceAccount from "./placeholders/service-account.json" assert { type: "json" };
import { getDirname } from "./utils.js";

const __dirname = getDirname(import.meta.url);

const upload = multer({ dest: "uploads/" });

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
app.use(function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Methods",
    "GET,PUT,POST,DELETE,PATCH,OPTIONS",
  );
  res.header(
    "Access-Control-Allow-Headers",
    "Content-Type, Authorization, Content-Length, X-Requested-With",
  );
  // allow preflight
  if (req.method === "OPTIONS") {
    res.send(200);
  } else {
    next();
  }
});

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

app.post("/send-message-device", (req, res, next) => {
  const { deviceToken, title, body } = req.body;

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
    .catch((err) => nex(err));
});

/*
 * REMOTE CONFIG
 * */

app.get("/download-template", (req, res, next) => {
  admin
    .remoteConfig()
    .getTemplate()
    .then((template) => {
      console.log("ETag from server: " + template.etag);
      res.send(JSON.stringify(template));
    })
    .catch((err) => nex(err));
});

app.get("/list-versions", (req, res, next) => {
  admin
    .remoteConfig()
    .listVersions()
    .then((listVersionsResult) => {
      console.log("Successfully fetched the list of versions");

      let versions = [];
      listVersionsResult.versions.forEach((version) => {
        versions.push(version);
      });

      res.send(versions);
    })
    .catch((err) => nex(err));
});

function validateTemplate(template) {
  return admin
    .remoteConfig()
    .validateTemplate(template)
    .then(function (validatedTemplate) {
      console.log("Template was valid and safe to use");
      return true;
    })
    .catch(function (err) {
      console.error("Template is invalid and cannot be published");
      console.error(err);
      return false;
    });
}

app.post(
  "/publish-template",
  upload.single("publish"),
  async (req, res, next) => {
    const config = admin.remoteConfig();
    let template;

    try {
      if (!req.file) {
        throw new Error("No file uploaded");
      }

      const fileContent = fs.readFileSync(req.file.path, "UTF8");
      template = config.createTemplateFromJSON(fileContent);

      const isValid = await validateTemplate(template);
      if (!isValid) {
        return nex(new Error("Template is invalid"));
      }
    } catch (err) {
      return next(new Error(err));
    }

    config
      .publishTemplate(template)
      .then((updatedTemplate) => {
        console.log("Template has been published");
        console.log("ETag from server: " + updatedTemplate.etag);
        res.status(200).send("Template has been published");
      })
      .catch((err) => {
        console.error("Failed to publish template: ", err);
        next(err);
      });
  },
);
