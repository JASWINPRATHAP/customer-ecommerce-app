/**
 * Cart Service - Remove Item Handler
 * service: cart-service
 *
 * Dependencies: total.js, add.js
 * Handles removing items and clearing cart.
 */

class CartRemover {
  removeItem(cart, productId) {
    if (!cart || !cart.items) {
      throw new TypeError("Cannot read property 'items' of undefined");
    }
    cart.items = cart.items.filter(i => i.productId !== productId);
    return cart;
  }

  clearCart(cart) {
    cart.items = [];
    return cart;
  }
}

module.exports = { CartRemover };
