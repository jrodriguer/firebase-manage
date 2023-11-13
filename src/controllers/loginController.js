var admin = require('../firebaseAdmin.js'),
  http = require('http'),
  https = require('https')

function loginView(req, res) {
  res.render('login')
}

function login(req, res) {
  const data = JSON.stringify({
    email: req.body.email,
    password: req.body.password
  })

  const options = {
    hostname: 'backend-dehesa.wenea.site',
    port: 443,
    path: '/api/v7/user/login',
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Content-Length': Buffer.byteLength(data),
      'X-App-Version': '3.0.2'
    }
  }

  return new Promise(function (resolve, reject) {
    var responseBody = ''

    var req = http.request(options, function (res) {
      if (res.statusCode < 200 || res.statusCode > 299) {
        return reject(new Error('HTTP status code ' + res.statusCode))
      }

      res.setEncoding('utf8')

      res.on('data', function (chunk) {
        responseBody += chunk
      })

      res.on('end', function () {
        const resString = Buffer.concat(body).toString()
        resolve(resString)
        // if (res.statusCode >= 200 && res.statusCode < 300) {
        //   try {
        //     resolve(JSON.parse(responseBody))
        //   } catch (error) {
        //     reject(new Error('Failed to parse JSON response'))
        //   }
        // } else {
        //   reject(
        //     new Error('Request failed with status code: ' + res.statusCode)
        //   )
        // }
      })
    })

    req.on('error', function (err) {
      reject(err)
    })

    req.write(data)
    req.end()
  })
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

module.exports = { loginView: loginView, login: login }
