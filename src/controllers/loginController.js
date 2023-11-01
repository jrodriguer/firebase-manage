var admin = require("../firebaseAdmin.js"),
  http = require("http"),
  https = require("https");

function loginView(req, res) {
  res.render("login");
}

function login(req, res) {
  var post_data = JSON.stringify({
    email: req.body.email,
    password: req.body.password,
  });

  var post_options = {
    hostname: "backend-des.wenea.site",
    port: 443,
    path: "/api/3.0.2/user/login",
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Content-Length": Buffer.byteLength(post_data),
      "X-App-Version": "3.0.2",
    },
  };

  var post_req = https.request(post_options, function (response) {
    response.setEncoding("utf8");
    response.on("data", function (chunk) {
      console.log("Response: " + chunk);
    });
    response.on("end", function () {
      if (res.statusCode >= 200 && res.statusCode < 300) {
        res.status(200).json({ message: "Request successful" });
      } else if (res.statusCode === 404) {
        res.status(404).json({
          error: "The requested resource was not found on this server",
        });
      } else {
        console.error("Request failed with status code: " + res.statusCode);
      }
    });
  });

  // post_req.on("error", function (err) {
  //   console.error("Error: " + err);
  // });

  post_req.write(post_data);
  post_req.end();
}

function _sendFCMToken() {
  var post_data = JSON.stringify({
    registration_id: userFCMToken,
    type: "android",
  });

  var post_options = {
    hostname: "backend-des.wenea.site",
    port: 443,
    path: "/api/3.0.2/user/fcm-devices",
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Content-Length": Buffer.byteLength(post_data),
      "X-App-Version": "3.0.2",
      Authorization: "Bearer " + userToken,
    },
  };

  var post_req = https.request(post_options, function (res) {
    res.setEncoding("utf8");
    res.on("data", function (chunk) {
      console.log("Response: " + chunk);
    });
  });

  post_req.write(post_data);
  post_req.end();
}

// function _buildTokenHeader(token) {
//     let header = new HttpHeaders({
//       "Content-Type": "application/json",
//       Authorization: "Token " + token,
//       "X-App-Version": WENEA_VERSION,
//     });
//     return header;
//   }

// function _buildSelfTokenHeader() {
//   var header;
//   if (this.isLoggedIn()) {
//     header = this.buildTokenHeader(this.userToken);
//   } else {
//     header = BASE_REST_HEADER;
//   }
//   return header;
// }

exports.loginView = loginView;
exports.login = login;
