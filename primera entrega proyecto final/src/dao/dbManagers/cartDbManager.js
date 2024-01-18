const Cart = require('../models/cartModel');

class CartDbManager {
  async getAllCarts() {
    return Cart.find().populate('products');
  }

  async addCart(newCart) {
    const cart = new Cart(newCart);
    await cart.save();
    return cart;
  }
}

module.exports = CartDbManager;