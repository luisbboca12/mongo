// dao/dao.js
const mongoose = require('mongoose');
const { ProductDbManager, CartDbManager, MessageDbManager } = require('./dbManagers');

class Dao {
  constructor() {
    mongoose.connect('mongodb+srv://luib1218:<PASSWORD>@cluster0.yvghbq2.mongodb.net/<DATABASE> ', {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    this.productDbManager = new ProductDbManager();
    this.cartDbManager = new CartDbManager();
    this.messageDbManager = new MessageDbManager();
  }

  // Métodos para acceder a los datos (ejemplos, ajustar según tus necesidades)
  async getAllProducts() {
    return this.productDbManager.getAllProducts();
  }

  async addProduct(newProduct) {
    return this.productDbManager.addProduct(newProduct);
  }

  async getAllCarts() {
    return this.cartDbManager.getAllCarts();
  }

  async addCart(newCart) {
    return this.cartDbManager.addCart(newCart);
  }

  async getAllMessages() {
    return this.messageDbManager.getAllMessages();
  }

  async addMessage(newMessage) {
    return this.messageDbManager.addMessage(newMessage);
  }
}

module.exports = Dao;
