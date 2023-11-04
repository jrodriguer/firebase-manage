const admin = require('../firebaseAdmin')
const FCMMessage = require('../models/FCMMessage')

function messagingView (req, res) {
  res.render('messaging')
}

function sendMessage (req, res) {
  const token = req.body.token
  const title = req.body.title
  const body = req.body.body
  const fcmMessage = FCMMessage.call(token, title, body)
  const message = fcmMessage.buildMessage()

  admin
    .messaging()
    .send(message)
    .then(function (response) {
      console.log('Successfully sent message to topic:' + response)
      res.status(200).json({ message: 'Message sent successfully' })
    })
    .catch(function (error) {
      res.status(500).json({ error: 'Failed to send message' })
    })
}

module.exports = {
  messagingView,
  sendMessage
}
