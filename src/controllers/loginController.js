const https = require( "https" );

function loginView( req, res ) {
  res.render( "login" );
}

function login( req, res ) {
  var data = JSON.stringify({ 
    email: req.body.email, password: req.body.password 
  });

  var options = {
    hostname: "backend-dehesa.wenea.site",
    port: 443,
    path: "/api/v7/user/login",
    method: "POST",
    headers: { 
      "Content-Type": "application/json", 
      "Content-Length": Buffer.byteLength( data ) 
    }
  };

  return new Promise(( resolve, reject ) => {
    let req = https.request( options, ( res ) => {
      if ( res.statusCode < 200 || res.statusCode > 299 ) {
        return reject( new Error( "HTTP status code " + res.statusCode ));
      }

      const body = [];

      res.on( "data", ( chunk ) => {
        console.log( "Chunk data firebase remote config" );
        body.push( chunk );
      });

      res.on( "end", () => {
        const resString = Buffer.concat( body ).toString();
        resolve( resString );
      });

      req.on( "error", ( err ) => {
        reject( err );
      });

      req.on( "timeout", () => {
        req.destroy();
        reject( new Error( "req time out" ));
      });

      req.write( JSON.stringify( data ));
      req.end(); 
    });
  });
}

module.exports = { 
  loginView: loginView, login: login 
};
