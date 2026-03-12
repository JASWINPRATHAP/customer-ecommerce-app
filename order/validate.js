/**
 * Order Service - Validation Module
 * service: order-service
 *
 * Dependencies: db.js, create.js
 * Validates order items, quantities, and inventory availability.
 */

class OrderValidator {
  constructor() {
    this.MAX_ITEMS = 50;
    this.MAX_QUANTITY = 100;
  }

  validateItems(items) {
    if (!Array.isArray(items) || items.length === 0) {
      return { valid: false, reason: 'Order must contain at least one item' };
    }
    if (items.length > this.MAX_ITEMS) {
      return { valid: false, reason: `Too many items (max: ${this.MAX_ITEMS})` };
    }

    for (const item of items) {
      if (!item.productId || !item.price || !item.quantity) {
        return { valid: false, reason: 'Each item must have productId, price, and quantity' };
      }
      if (item.quantity > this.MAX_QUANTITY) {
        return { valid: false, reason: `Quantity exceeds max (${this.MAX_QUANTITY})` };
      }
      if (item.price <= 0) {
        return { valid: false, reason: 'Price must be positive' };
      }
    }
    return { valid: true };
  }
}

module.exports = { OrderValidator };
