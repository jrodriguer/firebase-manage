var express = require( "express" ),
  messagingController = require( "../controllers/messagingController" ),
  loginController = require( "../controllers/loginController" ),
  translationController = require( "../controllers/translationController" );

var router = express.Router();

router.get( "/", loginController.loginView );
router.post( "/login", loginController.login );

router.get( "/messaging", messagingController.messagingView );
router.post( "/send-message", messagingController.sendMessage );

router.get( "/translation", translationController.translationView );
router.get( "/download-template", translationController.downloadTemplate );
router.get( "/list-versions", translationController.listVersions );
router.post( "/publish-template", translationController.publishTemplate );

module.exports = router;
