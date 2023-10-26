class FCMMessage {
  constructor(token, title, body, topic = "all_users") {
    this.token = token;
    this.title = title;
    this.body = body;
    this.topic = topic;
  }

  buildMessage() {
    const message = {
      notification: {
        title: this.title,
        body: this.body,
      },
    };

    if (this.token != "") {
      message.token = this.token;
    } else {
      message.topic = this.topic;
    }

    return message;
  }
}

module.exports = FCMMessage;