const admin = require("firebase-admin");
const serviceAccount = require("../placeholders/service-account.json");

admin.initializeApp({ credential: admin.credential.cert(serviceAccount) });

exports.module = admin;