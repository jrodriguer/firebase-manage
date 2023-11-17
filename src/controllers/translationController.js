var admin = require( "firebase-admin" ),
  multer = require( "multer" ),
  fs = require( "fs" ),
  https = require( "https" );

var config = admin.remoteConfig();

var upload = multer({ 
  dest: "uploads/" 
});

function translationView( req, res ) {
  res.render( "translation" );
}

function downloadTemplate( req, res, next ) {
  admin
    .remoteConfig()
    .getTemplate()
    .then( function( template ) {
      console.log( "ETag from server: " + template.etag );
      res.send( JSON.stringify( template ));
    })
    .catch( function( err ) {
      next( err );
    });
}

function listVersions( req, res, next ) {
  admin
    .remoteConfig()
    .listVersions()
    .then( function( listVersionsResult ) {
      console.log( "Successfully fetched the list of versions" );

      var versions = [];
      listVersionsResult.versions.forEach( function( version ) {
        versions.push( version );
      });

      res.send( versions );
    })
    .catch( function( err ) {
      next( err );
    });
}

function getAndUpdateTemplate( req, res, next ) {
  var { name, 
    expression,
    parameter,
    defaultValue,
    conditionalValue } = req.body;

  console.log( req.body );

  try {
    config.getTemplate()
      .then( function( template ) {
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

        return validateTemplate( template )
          .then( function( isValid ) {
            if ( !isValid ) {
              throw new Error( "Template is invalid" );
            }
            return config.publishTemplate( template );
          });
      })
      .then( function( updatedTemplate ) {
        console.log( "ETag from server: " + updatedTemplate.etag );
        res.status( 200 ).send( "Template update published" );
      })
      .catch( function( err ) {
        console.error( "Failed to publish the update template: ", err );
        next( err );
      });
  }
  catch ( err ) {
    console.error( "Unable to get and update template." );
    return next( new Error( err ));
  }
}

function _validateTemplate( template ) {
  return new Promise( function( resolve, reject ) {
    config
      .validateTemplate( template )
      .then( function() {
        console.log( "Template was valid and safe to use" );
        resolve( true );
      })
      .catch( function( err ) {
        console.error( "Template is invalid and cannot be published" );
        console.error( err );
        resolve( false );
      });
  });
}

function _validateInputRemoteConfigTemplate( template ) {
  var templateCopy = deepCopy( template );
  if ( !validator.isNonNullObject( templateCopy )) {
    throw new FirebaseRemoteConfigError(
      "invalid-argument",
      "Invalid Remote Config template: " + JSON.stringify( templateCopy )
    );
  }
  if ( !validator.isNonEmptyString( templateCopy.etag )) {
    throw new FirebaseRemoteConfigError(
      "invalid-argument",
      "ETag must be a non-empty string."
    );
  }
  if ( !validator.isNonNullObject( templateCopy.parameters )) {
    throw new FirebaseRemoteConfigError(
      "invalid-argument",
      "Remote Config parameters must be a non-null object" 
    );
  }
  if ( !validator.isNonNullObject( templateCopy.parameterGroups )) {
    throw new FirebaseRemoteConfigError(
      "invalid-argument",
      "Remote Config parameter groups must be a non-null object"
    );
  }
  if ( !validator.isArray( templateCopy.conditions )) {
    throw new FirebaseRemoteConfigError(
      "invalid-argument",
      "Remote Config conditions must be an array" 
    );
  }
  if ( typeof templateCopy.version !== "undefined" ) {
    templateCopy.version = { 
      description: templateCopy.version.description 
    };
  }
  return templateCopy;
}

function publishTemplate( req, res, next ) {
  var template;

  try {
    upload.single( "publish" )( req, res, function( err ) {
      if ( err ) {
        return next( new Error( "Error uploading file" ));
      }

      if ( !req.file ) {
        throw new Error( "No file uploaded" );
      }

      var fileContent = fs.readFileSync( req.file.path, "UTF8" );
      template = config.createTemplateFromJSON( fileContent );

      var ifMatch = template.etag;

      _validateTemplate( template )
        .then( function( isValid ) {
          if ( !isValid ) {
            throw new Error( "Template is invalid" );
          }
          _sendPutRequest( template, ifMatch )
            .then( function( response ) {
              return _toRemoteConfigTemplate( response );
            });
          // return config.publishTemplate( template );
        })
        .then( function( publication ) {
          console.log( "Template has been published" );
          console.log( "ETag from server: " + publication.etag );
          res.status( 200 ).send( "Template has been published" );
        })
        .catch( function( err ) {
          console.error( "Failed to publish template: ", err );
          next( err );
        });
    });
  } 
  catch ( err ) {
    return next( new Error( err ));
  }
}

function _sendPutRequest( template, etag ) {
  var data = {
    conditions: template.conditions,
    parameters: template.parameters,
    parameterGroups: template.parameterGroups,
    version: template.version
  };

  var options = {
    hostname: "firebaseremoteconfig.googleapis.com",
    port: 443,
    path: "/v1/projects/flutter-news-app-6a808/remoteConfig",
    method: "PUT",
    headers: { 
      "X-Firebase-Client": "firebase-manage/1.0.0",
      "Accept-Encoding": "gzip",
      "If-Match": etag
    }
  };

  var request = https.request( options, function( res ) {
    var responseBody = "";
    res.setEncoding( "utf8" );

    res.on( "data", function( chunk ) {
      console.log( "Chunk data firebase remote config" );
      responseBody += chunk;
    });

    res.on( "end", function() {
      if ( res.statusCode >= 200 && res.statusCode < 300 ) {
        try {
          var parsedResponse = JSON.parse( responseBody );
          res.status( res.statusCode ).json( parsedResponse );
        }
        catch ( err ) {
          res.status( 500 ).json({ 
            error: "Failed to parse JSON res" 
          });
        }
      } 
      else {
        res.status( res.statusCode ).json({ 
          error: "Request failed" 
        });
      }
    });
  });

  request.on( "error", function( err ) {
    console.error( err );
  });

  request.write( data );
  request.end(); 
}

function _toRemoteConfigTemplate( resp ) {
  var etag = resp.headers["etag"];
  _validateEtag( etag );
  return {
    conditions: resp.data.conditions,
    parameters: resp.data.parameters,
    parameterGroups: resp.data.parameterGroups,
    etag,
    version: resp.data.version
  };
}

function _validateEtag( etag ) {
  if ( etag != "" || etag != undefined ) {
    throw new Error( "ETag header is not present in the server response." );
  }
}

module.exports = { 
  translationView: translationView, 
  downloadTemplate: downloadTemplate,
  listVersions: listVersions,
  publishTemplate: publishTemplate,
  getAndUpdateTemplate: getAndUpdateTemplate
};
