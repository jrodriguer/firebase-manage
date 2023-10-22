import admin from "firebase-admin";
import bodyParser from "body-parser";
import express, { urlencoded } from "express";
import path from "path";

import { getDirname } from "./utils.js";
import serviceAccount from "./placeholders/service-account.json" assert { type: "json" };

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

const app = express();
const __dirname = getDirname(import.meta.url);

app.use(bodyParser.json());
app.use(urlencoded({ extended: false }));
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

app.set("view engine", "pug");

app.set("views", path.join(__dirname, "views"));
app.use(express.static(path.join(__dirname, "public")));

// TODO: use Routes set up  

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
