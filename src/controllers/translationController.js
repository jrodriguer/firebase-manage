const admin = require( "firebase-admin" );
const fs = require( "fs" );
const https = require( "https" );
const multer = require( "multer" );
const util = require( "util" );
const readFile = util.promisify( fs.readFile );

const config = admin.remoteConfig();
const upload = multer({ 
  dest: "uploads/" 
});

function translationView( req, res ) {
  res.render( "translation" );
}

function listVersions( req, res, next ) {
  admin
    .remoteConfig()
    .listVersions()
    .then(( listVersionsResult ) => {
      var versions = [];
      listVersionsResult.versions.forEach( function( version ) {
        versions.push( version );
      });
      res.send( versions );
    }, next );
}

function downloadTemplate( req, res, next ) {
  admin
    .remoteConfig()
    .getTemplate()
    .then(( template ) => {
      console.log( "ETag from server: " + template.etag );
      res.send( template );
      res.sendStatus( 200 );
    }, next );
}

function _validateTemplate( template ) {
  return new Promise(( resolve, reject ) => {
    config 
      .validateTemplate( template )
      .then(() => {
        resolve( true );
      })
      .catch(( err ) => {
        resolve( false );
      });
  });
}

async function getAndUpdateTemplate( req, res, next ) {
  let { name, 
    expression,
    parameter,
    defaultValue,
    conditionalValue } = req.body;

  try {
    let template = await config.getTemplate();
    template.conditions.push({
      name: name, 
      expression: expression,
      tagColor: "BLUE"
    });
    template.parameters[parameter] = { 
      defaultValue: { 
        value: defaultValue 
      },
      conditionalValues: { 
        [name]: { 
          value: conditionalValue 
        } 
      } 
    };

    let isValid = await _validateTemplate( template );
    if ( !isValid ) {
      // TODO: We define a custom BadRequestError class that extends Error to represent the 400 Bad Request error.
      throw new Error( "Template is invalid." );
    }

    let updatedTemplate = await config.publishTemplate( template );
    res.status( 200 ).send( "Template updated." );
    console.log( "ETag from server: " + updatedTemplate.etag );
  }
  catch ( err ) {
    console.error( "Unable update template." );
    return next( err );
  }
}

async function publishTemplate( req, res, next ) {
  try {
    await new Promise(( resolve, reject ) => {
      upload.single( "publish" )( req, res, ( err ) => {
        if ( err ) {
          return reject( new Error( "Error uploading file." ));
        }
        if ( !req.file ) {
          throw new Error( "No file uploaded." );
        }
        resolve();
      });
    });

    const fileContent = await readFile( req.file.path, "UTF8" );
    let template = config.createTemplateFromJSON( fileContent );

    // TODO: Bad validation, udpate for "step to step" validator. 
    let isValid = await _validateTemplate( template );
    if ( !isValid ) {
      // TODO: We define a custom BadRequestError class that extends Error to represent the 400 Bad Request error.
      throw new Error( "Template is invalid." );
    }

    let publishedTemplate = await config.publishTemplate( template );
    res.status( 200 ).send( "Template published." );
    console.log( "ETag from server: " + publishedTemplate.etag );
  } 
  catch ( err ) {
    console.error( "Unable to publish template." );
    next( err );
  }
}

function _sendPutRequest( template, etag, validateOnly ) {
  var path = "remoteConfig";
  if ( validateOnly ) {
    path += "?validate_only=true";
  }

  var data = {
    conditions: template.conditions,
    parameters: template.parameters,
    parameterGroups: template.parameterGroups,
    version: template.version
  };

  var options = {
    hostname: "firebaseremoteconfig.googleapis.com",
    port: 443,
    path: "/v1/projects/flutter-news-app-6a808/" + path,
    method: "POST",
    headers: { 
      "Content-Type": "application/json; UTF8",
      "X-Firebase-Client": "firebase-manage/1.0.0",
      "Accept-Encoding": "gzip",
      "If-Match": etag
    }
  };

  return new Promise(( resolve, reject ) => {
    var req = https.request( options, ( res ) => {
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
}

module.exports = { 
  translationView: translationView, 
  downloadTemplate: downloadTemplate,
  listVersions: listVersions,
  publishTemplate: publishTemplate,
  getAndUpdateTemplate: getAndUpdateTemplate
};
