/**
 * Cart Service - Total Calculator
 * service: cart-service
 *
 * Dependencies: add.js, remove.js
 * Calculates subtotal, tax, discounts, and final total.
 */

class CartCalculator {
  constructor() {
    this.TAX_RATE = 0.08; // 8% tax
    this.FREE_SHIPPING_THRESHOLD = 50.00;
    this.SHIPPING_COST = 5.99;
  }

  calculate(items) {
    const subtotal = items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const tax = subtotal * this.TAX_RATE;
    const shipping = subtotal >= this.FREE_SHIPPING_THRESHOLD ? 0 : this.SHIPPING_COST;
    const total = subtotal + tax + shipping;

    return {
      subtotal: Math.round(subtotal * 100) / 100,
      tax: Math.round(tax * 100) / 100,
      shipping,
      total: Math.round(total * 100) / 100,
      itemCount: items.reduce((sum, item) => sum + item.quantity, 0)
    };
  }
}

module.exports = { CartCalculator };
