import admin from '../firebaseAdmin.js';
import * as validator from "../utils.js";
import fs from "fs";
import multer from "multer";
import util from "util";

const { promisify } = util;
const readFile = promisify( fs.readFile );

const config = admin.remoteConfig();

const upload = multer({ 
  dest: "uploads/" 
});

export const listVersions = ( req, res, next ) => {
  admin
    .remoteConfig()
    .listVersions()
    .then(( listVersionsResult ) => {
      var versions = [];
      listVersionsResult.versions.forEach(( version ) => {
        versions.push( version );
      });
      res.send( versions );
    }, next ); // Send to centralized Express error handling.
};

export const downloadTemplate = ( req, res, next ) => {
  admin
    .remoteConfig()
    .getTemplate()
    .then(( template ) => {
      console.log( "ETag from server: " + template.etag );
      res.send( template );
      res.sendStatus( 200 );
    }, next );
};

export const validateInputRemoteConfigTemplate = ( template ) => {
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

export const getAndUpdateTemplate = async ( req, res, next ) => {
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
    
    try {
      template = validateInputRemoteConfigTemplate( template );
    }
    catch ( err ) {
      throw new FirebaseRemoteConfigError( err.message );
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

export const publishTemplate = async ( req, res, next ) => {
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
};

class FirebaseRemoteConfigError extends Error {
  constructor( message ) {
    super( message );
    this.name = "FirebaseRemoteConfigError";
    this.status = 400;
  }
}
