import * as express from "express";
import { sendMessage } from "../controllers/messagingController.js";
import { 
  downloadTemplate,
  listVersions,
  publishTemplate, 
  getAndUpdateTemplate 
} from "../controllers/translationController.js";

const router = express.Router();

router.post( "/send-message", sendMessage );
router.get( "/download-template", downloadTemplate );
router.get( "/list-versions", listVersions );
router.post( "/publish-template", publishTemplate );
router.put( "/update-template", getAndUpdateTemplate );

export default router;