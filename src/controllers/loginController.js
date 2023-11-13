var https = require( "https" );

function loginView( req, res ) {
  res.render( "login" );
}

function login( res, req ) {
  var data = JSON.stringify({ email: req.body.email, password: req.body.password });

  var options = {
    hostname: "backend-dehesa.wenea.site",
    port: 443,
    path: "/api/v7/user/login",
    method: "POST",
    headers: { "Content-Type": "application/json", "Content-Length": Buffer.byteLength( data ) }
  };

  return new Promise( function( resolve, reject ) {
    var responseBody = "";
    var req = https.request( options, function( res ) {
      if( res.statusCode < 200 || res.statusCode > 299 ) {
        return reject( new Error( "HTTP status code " + res.statusCode ));
      }

      res.setEncoding( "utf8" );

      res.on( "data", function( chunk ) {
        responseBody += chunk;
      });

      res.on( "end", function() {
        var resString = Buffer.concat( responseBody ).toString();
        resolve( resString );
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
      });
    });

    req.on( "error", function( err ) {
      reject( err );
    });

    req.write( data );
    req.end();
  });
}

module.exports = { loginView: loginView, login: login };
