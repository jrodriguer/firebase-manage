import express from "express";
import parser from "body-parser";
import router from "./routes/apiRoutes.js";

const app = express();
const { urlencoded } = parser;

app.use( urlencoded({
  extended: true 
}));
app.use( parser.json());

app.use(( req, res, next ) => {
  res.header( 
    "Access-Control-Allow-Origin", 
    "http://localhost:4200"
  ),
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
app.use( "/", router );

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

const PORT = process.env.PORT || 8080;

app.listen( PORT, function() {
  console.log( "Server running at http://localhost:" + PORT );
});
