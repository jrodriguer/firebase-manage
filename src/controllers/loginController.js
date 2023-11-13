var https = require( "https" );

function loginView( req, res ) {
  res.render( "login" );
}

function login( req, res ) {
  var data = JSON.stringify({ email: req.body.email, password: req.body.password });

  var options = {
    hostname: "backend-dehesa.wenea.site",
    port: 443,
    path: "/api/v7/user/login",
    method: "POST",
    headers: { "Content-Type": "application/json", "Content-Length": Buffer.byteLength( data ) }
  };

  var request = https.request( options, function( response ) {
    var responseBody = "";
    response.setEncoding( "utf8" );

    response.on( "data", function( chunk ) {
      responseBody += chunk;
    });

    response.on( "end", function() {
      if ( response.statusCode >= 200 && response.statusCode < 300 ) {
        try {
          var parsedResponse = JSON.parse( responseBody );
          res.status( response.statusCode ).json( parsedResponse );
        }
        catch ( err ) {
          res.status( 500 ).json({ error: "Failed to parse JSON response" });
        }
      } 
      else {
        res.status( response.statusCode ).json({ error: "Request failed" });
      }
    });
  });

  request.on( "error", function( err ) {
    res.status( 500 ).json({ error: err.message });
  });

  request.write( data );
  request.end();
}

module.exports = { loginView: loginView, login: login };
