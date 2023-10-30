const admin = require("../firebaseAdmin");

const loginView = (req, res) => {
  res.render("login");
};

const retrieveUser = (req, res) => {
  const { email } = req.body;

  admin
    .auth()
    .getUserByEmail(email)
      .then((userRecord) => {
        console.log(`Successfully fetched user data: ${userRecord.toJSON()}`);

        res.status(200).json({ message: "Login successfully" });
      })
      .catch((error) => {
        console.log('Error fetching user data:', error);
        
        res.status(500).json({ error: "Login failed" });
      });
};

module.exports = { loginView, retrieveUser };