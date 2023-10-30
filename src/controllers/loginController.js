var admin = require("firebase-admin");

const loginView = (req, res) => {
  res.render("login");
};

module.exports = loginView;