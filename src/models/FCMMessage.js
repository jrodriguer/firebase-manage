/**
 * FCMMessage class.
 *
 * @constructor
 * @param {String} token - personal device token.
 * @param {String} title - title message to send.
 * @param {String} body - body message to send.
 * @param {String} topic - topic suscribe.
 */
function FCMMessage (token, title, body, topic) {
  this.token = token
  this.title = title
  this.body = body
  this.topic = 'all_users'
}

function buildMessage () {
  const message = {
    notification: {
      title: this.title,
      body: this.body
    }
  }

  if (!this.token) {
    message.token = this.token
  } else {
    message.topic = this.topic
  }

  return message
}

FCMMessage.prototype.getToken = function () {
  return this.token
}

FCMMessage.prototype.getTitle = function () {
  return this.title
}

FCMMessage.prototype.getBody = function () {
  return this.body
}

FCMMessage.prototype.getTopic = function () {
  return this.topic
}

module.exports = FCMMessage
