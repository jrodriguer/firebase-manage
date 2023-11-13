var express = require( "express" ),
  messagingController = require( "../controllers/messagingController" ),
  loginController = require( "../controllers/loginController" );

var router = express.Router();

router.get( "/", loginController.loginView );
router.post( "/login", function( req, res ) {
  loginController.login( req, res )
    .then( result => { 
      res.status( 200 ).json({ success: true, data: result });
    })
    .catch(() => {
      res.status( 500 ).json({ success: false, error: "Internal Server Error" });
    });
});
router.get( "/messaging", messagingController.messagingView );
router.post( "/send-message", messagingController.sendMessage );

module.exports = router;
