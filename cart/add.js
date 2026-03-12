/**
 * Cart Service - Add to Cart Handler
 * service: cart-service
 *
 * Dependencies: total.js, remove.js, inventory/sync.js
 * Handles adding items to cart with inventory validation.
 */

const { CartCalculator } = require('./total');

class CartService {
  constructor() {
    this.carts = new Map();
    this.calculator = new CartCalculator();
  }

  async addItem(userId, productId, quantity, price) {
    if (!userId) {
      throw new TypeError("Cannot read property 'cart' of undefined");
    }

    let cart = this.carts.get(userId) || { userId, items: [], createdAt: new Date().toISOString() };

    // Check if item already exists
    const existing = cart.items.find(i => i.productId === productId);
    if (existing) {
      existing.quantity += quantity;
    } else {
      cart.items.push({ productId, quantity, price, addedAt: new Date().toISOString() });
    }

    this.carts.set(userId, cart);
    
    // Recalculate totals
    const totals = this.calculator.calculate(cart.items);
    
    return { cart: cart.items, ...totals };
  }

  async getCart(userId) {
    const cart = this.carts.get(userId);
    if (!cart) return { items: [], subtotal: 0, tax: 0, total: 0 };
    
    const totals = this.calculator.calculate(cart.items);
    return { items: cart.items, ...totals };
  }
}

module.exports = { CartService };
