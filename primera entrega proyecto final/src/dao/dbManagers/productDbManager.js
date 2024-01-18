const Product = require('../models/productModel');

class ProductDbManager {
  async getAllProducts() {
    return Product.find();
  }

  async addProduct(newProduct) {
    const product = new Product(newProduct);
    await product.save();
    return product;
  }
}

module.exports = ProductDbManager;