var admin = require("../firebaseAdmin.js"),
  http = require("http"),
  https = require("https");

function loginView(req, res) {
  res.render("login");
}

function login(req, res) {
  var data = JSON.stringify({
    email: req.body.email,
    password: req.body.password,
  });

  var options = {
    hostname: "backend-des.wenea.site",
    port: 443,
    path: "/api/3.0.2/user/login",
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Content-Length": Buffer.byteLength(data),
      "X-App-Version": "3.0.2",
    },
  };

  return _loginRequest(options, data).then(function (b) {
    return JSON.parse(b);
  });
}

function _loginRequest(options, data) {
  return new Promise(function (resolve, reject) {
    var resBody = "";

    var req = https.request(options, function (res) {
      res.setEncoding("utf8");

      res.on("data", function (chunk) {
        console.log("Response: " + chunk);
        resBody += chunk;
      });

      res.on("end", function () {
        // if (response.statusCode >= 200 && response.statusCode < 300) {
        //   res.status(200).json({ message: "Request successful" });
        // } else if (response.statusCode === 404) {
        //   res.status(404).json({
        //     error: "The requested resource was not found on this server",
        //   });
        // } else {
        //   console.error(
        //     "Request failed with status code: " + response.statusCode,
        //   );
        // }

        resolve(resBody);
      });
    });

    req.on("error", function (err) {
      reject(err);
    });

    req.write(data);
    req.end();
  });
}

// function _sendFCMToken() {
//   var post_data = JSON.stringify({
//     registration_id: userFCMToken,
//     type: "android",
//   });
//
//   var post_options = {
//     hostname: "backend-des.wenea.site",
//     port: 443,
//     path: "/api/3.0.2/user/fcm-devices",
//     method: "POST",
//     headers: {
//       "Content-Type": "application/json",
//       "Content-Length": Buffer.byteLength(post_data),
//       "X-App-Version": "3.0.2",
//       Authorization: "Bearer " + userToken,
//     },
//   };
//
//   var post_req = https.request(post_options, function (res) {
//     res.setEncoding("utf8");
//     res.on("data", function (chunk) {
//       console.log("Response: " + chunk);
//     });
//   });
//
//   post_req.write(post_data);
//   post_req.end();
// }

module.exports = { loginView: loginView, login: login };
