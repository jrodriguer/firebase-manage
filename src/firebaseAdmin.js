var admin = require("firebase-admin"),
  serviceAccount = require("../placeholders/service-account.json");

admin.initializeApp({ credential: admin.credential.cert(serviceAccount) });

module.exports = admin;
