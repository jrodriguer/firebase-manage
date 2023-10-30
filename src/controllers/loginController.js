const { auth } = require("../firebaseAdmin");

const loginView = (req, res) => {
  res.render("login");
};

const signIn = (req, res) => {
  const { email, password } = req.body;

  auth 
    .signInWithEmailAndPassword(firebase.auth, email, password)
      .then((userCredential) => {
        const user = userCredential.user;
        console.log({ user })

        res.status(200).json({ message: "Login successfully" });
      })
      .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
        console.log({ errorCode, errorMessage })

        res.status(500).json({ error: "Login failed" });
      });
};

module.exports = { loginView, signIn };