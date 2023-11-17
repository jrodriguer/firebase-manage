var bodyParser = require( "body-parser" ),
  express = require( "express" ),
  join = require( "path" ).join,
  apiRoutes = require( "./routes/apiRoutes" );

var app = express();

app.set( "view engine", "pug" );
app.set( "views", join(__dirname, "views" ));

app.use( bodyParser.json());
app.use( express.urlencoded({
  extended: false 
}));
app.use( function( req, res, next ) {
  res.header( "Access-Control-Allow-Origin", "*" ),
  res.header(
    "Access-Control-Allow-Methods",
    "GET,PUT,POST,DELETE,PATCH,OPTIONS"
  );
  res.header(
    "Access-Control-Allow-Headers",
    "Content-Type, Authorization, Content-Length, X-Requested-With"
  );
  // allow preflight
  if ( req.method === "OPTIONS" ) {
    res.send( 200 );
  } 
  else {
    next();
  }
});

app.use( express.static( "public" ));

app.use( "/", apiRoutes );

var PORT = process.env.PORT || 3000;

app.listen( PORT, function() {
  console.log( "Server running at http://localhost:" + PORT );
});
