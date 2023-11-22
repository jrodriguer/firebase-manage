export class FCMMessage {
  constructor( token, title, body, topic ) {
    this.token = token;
    this.title = title;
    this.body = body;
    this.topic = "all_users";
  }

  buildMessage() {
    const message = {
      notification: {
        title: this.title,
        body: this.body
      }
    };

    if ( !this.token ) {
      message.token = this.token;
    } 
    else {
      message.topic = this.topic;
    }

    return message;
  }

  get token() {
    return this.token;
  }

  get title() {
    return this.title;
  }

  get body() {
    return this.body;
  }

  get topic() {
    return this.topic;
  }
}
