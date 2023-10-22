// import admin from "firebase-admin";
// import bodyParser from "body-parser";
// import express, { urlencoded } from "express";
// import path from "path";

// import { getDirname } from "./utils.js";
// import serviceAccount from "./placeholders/service-account.json" assert { type: "json" };

var p = require("body-parser");
var express = require("express");
var fs = require("fs");
var join = require("path").join;

var {getDirname} = require("./utils");

// admin.initializeApp({
//   credential: admin.credential.cert(serviceAccount),
// });

var app = express();
app.set("view engine", "pug");

// const __dirname = getDirname(import.meta.url);

app.use(p.json());
app.use(express.urlencoded({ extended: false }));
// app.use(function (req, res, next) {
//   res.header("Access-Control-Allow-Origin", "*");
//   res.header(
//     "Access-Control-Allow-Methods",
//     "GET,PUT,POST,DELETE,PATCH,OPTIONS",
//   );
//   res.header(
//     "Access-Control-Allow-Headers",
//     "Content-Type, Authorization, Content-Length, X-Requested-With",
//   );
//   // allow preflight
//   if (req.method === "OPTIONS") {
//     res.send(200);
//   } else {
//     next();
// });

app.set("views", join(__dirname, "views"));
// app.use(express.static(path.join(__dirname, "public")));

app.use("/", require("./routes/messaging"));

const PORT = process.env.PORT || 3000;

app.listen(PORT, function() {
  console.log(`Server running at http://localhost:${PORT}`);
});
