var admin = require( "firebase-admin" ),
  multer = require( "multer" ),
  fs = require( "fs" );

var config = admin.remoteConfig();
var upload = multer({ dest: "uploads/" });

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

function validateTemplate( template ) {
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

      validateTemplate( template )
        .then( function( isValid ) {
          if ( !isValid ) {
            throw new Error( "Template is invalid" );
          }
          return config.publishTemplate( template );
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

function getAndUpdateTemplate( req, res, next ) {
  var { 
    name, 
    expression,
    parameter,
    defaultValue,
    conditionalValue 
  } = req.body;

  try {
    var template = config.getTemplate();
    template.conditions.push({
      name: name, 
      expression: expression,
      tagColor: "BLUE"
    });
    template.parameters[parameter] = { defaultValue: { value: defaultValue },
      conditionalValues: { name: { value: conditionalValue } } };

    validateTemplate( template )
      .then( function( isValid ) {
        if ( !isValid ) {
          throw new Error( "Template is invalid" );
        }
        return config.publishTemplate( template );
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

module.exports = { 
  translationView: translationView, 
  downloadTemplate: downloadTemplate,
  listVersions: listVersions,
  publishTemplate: publishTemplate,
  getAndUpdateTemplate: getAndUpdateTemplate
};
