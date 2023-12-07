import admin from '../firebaseAdmin.js';
import FCMMessage from '../models/FCMMessage.js';

export const sendMessage = ( req, res ) => {
  const token = req.body.token,
    title = req.body.title,
    body = req.body.body;
  const fcmMessage = FCMMessage.call( token, title, body );
  const message = fcmMessage.buildMessage();

  admin
    .messaging()
    .send( message )
    .then(( response ) => {
      res.status( 200 ).json({ 
        message: "Message sent successfully" 
      });
    })
    .catch(( error ) => {
      res.status( 500 ).json({ 
        error: "Failed to send message" 
      });
    });
};
