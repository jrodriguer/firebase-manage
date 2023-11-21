const bodyParser = require( "body-parser" );
const express = require( "express" );
const join = require( "path" ).join;
const apiRoutes = require( "./routes/apiRoutes" );

const app = express();

app.set( "view engine", "pug" );
app.set( "views", join( __dirname, "views" ));

app.use( bodyParser.urlencoded({
  extended: true 
}));
app.use( bodyParser.json());
app.use(( req, res, next ) => {
  res.header( "Access-Control-Allow-Origin", "*" ),
  res.header(
    "Access-Control-Allow-Methods",
    "GET,PUT,POST,DELETE,PATCH,OPTIONS"
  );
  res.header(
    "Access-Control-Allow-Headers",
    "Content-Type, Authorization, Content-Length, X-Requested-With"
  );

  if ( req.method === "OPTIONS" ) {
    res.send( 200 );
  } 
  else {
    next();
  }
});
app.use( express.static( "public" ));
app.use( "/", apiRoutes );
app.use(( error, req, res, next ) => {
  if ( res.headersSent ) {
    return next( error );
  }

  res.status( error.status || 500 );
  res.json({ 
    status: error.status || 500,
    message: error.message,
    stack: error.stack
  });
});

const PORT = process.env.PORT || 3000;

app.listen( PORT, function() {
  console.log( "Server running at http://localhost:" + PORT );
});
