const admin = require("firebase-admin");
const serviceAccount = require("../placeholders/service-account.json");

admin.initializeApp({ credential: admin.credential.cert(serviceAccount) });

const auth = admin.auth();

exports.module = { admin, auth };