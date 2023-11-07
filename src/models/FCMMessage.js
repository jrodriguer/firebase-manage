/**
 * FCMMessage class.
 *
 * @constructor
 * @param {String} token - personal device token.
 * @param {String} title - title message to send.
 * @param {String} body - body message to send.
 * @param {String} topic - topic suscribe.
 */
function FCMMessage(token, title, body, topic) {
  this.token = token
  this.title = title
  this.body = body
  this.topic = 'all_users'
}

function buildMessage() {
  var message = {
    notification: {
      title: this.title,
      body: this.body,
    },
  }

  if (this.token !== '') {
    message.token = this.token
  } else {
    message.topic = this.topic
  }

  return message
}

module.exports = FCMMessage
