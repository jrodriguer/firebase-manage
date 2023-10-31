var admin = require("../firebaseAdmin");

function loginView(req, res) {
  res.render("login");
}

function retrieveUser(req, res) {
  var email = req.body.email;

  admin
    .auth()
    .getUserByEmail(email)
    .then(function (userRecord) {
      console.log("Successfully fetched user data:" + userRecord.toJSON());
      res.status(200).json({ message: "Login successfully" });
    })
    .catch(function (error) {
      console.log("Error fetching user data:" + error);
      res.status(500).json({ error: "Login failed" });
    });
}

exports.loginView = loginView;
exports.retrieveUser = retrieveUser;
