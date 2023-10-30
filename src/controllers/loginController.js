var admin = require("firebase-admin");
var serviceAccount = require("../../placeholders/service-account.json");

admin.initializeApp({ credential: admin.credential.cert(serviceAccount) });

const loginView = (req, res) => {
  res.render("login");
};

module.exports = loginView;