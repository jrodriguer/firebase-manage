import * as admin from "firebase-admin";
import serviceAccount from "firebase-admin";

admin.initializeApp({ credential: admin.credential.cert(serviceAccount) })

export default admin;