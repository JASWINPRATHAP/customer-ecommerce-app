/**
 * Order Service - Create Order Handler
 * service: order-service
 *
 * Dependencies: validate.js, db.js, payment/process.js
 * Creates orders, validates items, and triggers payment processing.
 */

const { OrderValidator } = require('./validate');
const { OrderDB } = require('./db');
const { PaymentProcessor } = require('../payment/process');

class OrderService {
  constructor() {
    this.validator = new OrderValidator();
    this.db = new OrderDB();
    this.paymentProcessor = new PaymentProcessor();
  }

  async createOrder(userId, items, walletId) {
    // Validate items
    const validation = this.validator.validateItems(items);
    if (!validation.valid) {
      throw new Error(`OrderValidationError: ${validation.reason}`);
    }

    // Calculate total
    const total = items.reduce((sum, item) => sum + (item.price * item.quantity), 0);

    // Create order record
    const order = await this.db.create({
      userId,
      items,
      total,
      status: 'pending',
      createdAt: new Date().toISOString()
    });

    // Process payment
    try {
      const payment = await this.paymentProcessor.processPayment(order.id, total, walletId);
      await this.db.updateStatus(order.id, 'confirmed');
      return { orderId: order.id, status: 'confirmed', payment };
    } catch (err) {
      await this.db.updateStatus(order.id, 'payment_failed');
      throw new Error(`OrderError: Payment failed - ${err.message}`);
    }
  }

  async cancelOrder(orderId) {
    const order = await this.db.get(orderId);
    if (!order) throw new Error('OrderNotFoundError');
    if (order.status === 'shipped') throw new Error('OrderError: Cannot cancel shipped order');
    
    await this.db.updateStatus(orderId, 'cancelled');
    return { orderId, status: 'cancelled' };
  }
}

module.exports = { OrderService };
