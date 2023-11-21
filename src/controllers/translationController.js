const admin = require( "firebase-admin" );
const fs = require( "fs" );
const https = require( "https" );
const multer = require( "multer" );
const util = require( "util" );
const readFile = util.promisify( fs.readFile );
const validator = require( "../utils/validator.js" );

const config = admin.remoteConfig();
const upload = multer({ 
  dest: "uploads/" 
});

export function translationView( req, res ) {
  res.render( "translation" );
}

export function listVersions( req, res, next ) {
  admin
    .remoteConfig()
    .listVersions()
    .then(( listVersionsResult ) => {
      var versions = [];
      listVersionsResult.versions.forEach(( version ) => {
        versions.push( version );
      });
      res.send( versions );
    }, next );
}

export function downloadTemplate( req, res, next ) {
  admin
    .remoteConfig()
    .getTemplate()
    .then(( template ) => {
      console.log( "ETag from server: " + template.etag );
      res.send( template );
      res.sendStatus( 200 );
    }, next );
}

function validateInputRemoteConfigTemplate( template ) {
  // The object must have valid parameters, parameter groups, conditions, and an etag.
  const templateCopy = structuredClone( template );
  if ( !validator.isNonNullObject( templateCopy )) {
    throw new FirebaseRemoteConfigError( "Invalid Remote Config template" );
  }
  if ( !validator.isNonEmptyString( templateCopy.etag )) {
    throw new FirebaseRemoteConfigError( "ETag must be a non-empty string." );
  }
  if ( !validator.isNonNullObject( templateCopy.parameters )) {
    throw new FirebaseRemoteConfigError( "Remote Config parameters must be a non-null object" );
  }
  if ( !validator.isNonNullObject( templateCopy.parameterGroups )) {
    throw new FirebaseRemoteConfigError( 
      "Remote Config parameter groups must be a non-null object" 
    );
  }
  if ( !validator.isArray( templateCopy.conditions )) {
    throw new FirebaseRemoteConfigError( "Remote Config conditions must be an array" );
  }
  if ( typeof templateCopy.version !== "undefined" ) {
    templateCopy.version = { 
      description: templateCopy.version.description 
    };
  }
  return templateCopy;
}

export async function getAndUpdateTemplate( req, res, next ) {
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

    let isValid = await validateInputRemoteConfigTemplate( template );
    if ( !isValid ) {
      // TODO: We define a custom class that extends Error to represent the 400 Bad Request error.
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

export async function publishTemplate( req, res, next ) {
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
    try {
      template = validateInputRemoteConfigTemplate( template );
    }
    catch ( err ) {
      throw new FirebaseRemoteConfigError( err.message );
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

class FirebaseRemoteConfigError extends Error {
  constructor( message ) {
    super( message );
    this.name = "FirebaseRemoteConfigError";
    this.status = 400;
  }
}
