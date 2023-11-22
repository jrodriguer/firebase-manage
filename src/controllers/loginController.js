const https = require( "https" );

export function loginView( req, res ) {
  res.render( "login" );
}

export async function login( req, res, next ) {
  try {
    const requestData = JSON.stringify({ 
      email: req.body.email, password: req.body.password   
    });

    const requestOptions = {
      hostname: "backend-dehesa.wenea.site",
      port: 443,
      path: "/api/v7/user/login/",
      method: "POST",
      headers: { 
        "Content-Type": "application/json", 
        "Content-Length": Buffer.byteLength( requestData ) 
      }
    };
    
    const response = await request(requestData, requestOptions);
    console.log( response );
  }
  catch ( err ) {
    next( err );
  }
}

async function request( data, options ) {
  try {
    const response = await new Promise(( resolve, reject ) => {
      let req = https.request( options, ( res ) => {
        res.setEncoding('utf8');

        if ( res.statusCode < 200 || res.statusCode > 299 ) {
          return reject( new Error( "HTTP status code " + res.statusCode ));
        }

        const body = [];

        res.on( "data", ( chunk ) => {
          console.log( "Chunk data login" );
          body.push( chunk );
        });

        res.on( "end", () => {
          const resString = Buffer.concat( body ).toString();
          resolve( resString );
        });
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

    return response;
  }
  catch ( err ) {
    throw err;
  }
}
