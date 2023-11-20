const express = require( "express" );
const messagingController = require( "../controllers/messagingController" );
const loginController = require( "../controllers/loginController" );
const translationController = require( "../controllers/translationController" );

const router = express.Router();

router.get( "/", loginController.loginView );
router.post( "/login", loginController.login );

router.get( "/messaging", messagingController.messagingView );
router.post( "/send-message", messagingController.sendMessage );

router.get( "/translations", translationController.translationView );
router.get( "/download-template", translationController.downloadTemplate );
router.get( "/list-versions", translationController.listVersions );
router.post( "/publish-template", translationController.publishTemplate );
router.put( "/update-template", translationController.getAndUpdateTemplate );

module.exports = router;
