var admin = require("../firebaseAdmin"),
  http = require("http"),
  https = require("https");

function loginView(req, res) {
  res.render("login");
}

function login(req, res) {
  var email = req.body.email,
    password = req.body.password;

  // TODO: Add WENEA_USER_LOGIN https post request
  var post_options = {
    path: "/",
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-App-Version": WENEA_VERSION,
    },
  };

  var post_req = https.request(post_options, function (res) {
    res.setEncoding("utf8");
    res.on("data", function (chunk) {
      console.log("Response: " + chunk);
    });
  });
}

exports.loginView = loginView;
exports.login = login;
