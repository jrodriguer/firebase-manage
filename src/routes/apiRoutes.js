import * as express from "express";
import { loginView, login } from "../controllers/loginController.js";
import { messagingView, sendMessage } from "../controllers/messagingController.js";
import { 
  translationView,
  downloadTemplate,
  listVersions,
  publishTemplate, 
  getAndUpdateTemplate 
} from "../controllers/translationController.js";

const router = express.Router();

router.get( "/", loginView );
router.post( "/login", login );

router.get( "/messaging", messagingView );
router.post( "/send-message", sendMessage );

router.get( "/translations", translationView );
router.get( "/download-template", downloadTemplate );
router.get( "/list-versions", listVersions );
router.post( "/publish-template", publishTemplate );
router.put( "/update-template", getAndUpdateTemplate );

export default router;