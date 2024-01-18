const Message = require('../models/messageModel');

class MessageDbManager {
  async getAllMessages() {
    return Message.find();
  }

  async addMessage(newMessage) {
    const message = new Message(newMessage);
    await message.save();
    return message;
  }
}

module.exports = MessageDbManager;