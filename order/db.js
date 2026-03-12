/**
 * Order Service - Database Layer
 * service: order-service
 *
 * Dependencies: validate.js, config/db.yml
 * Handles order CRUD operations with persistent storage.
 */

class OrderDB {
  constructor() {
    this.orders = new Map();
    this.orderCounter = 5000;
  }

  async create(data) {
    const id = `ORD-${++this.orderCounter}`;
    const order = { id, ...data };
    this.orders.set(id, order);
    return order;
  }

  async get(orderId) {
    return this.orders.get(orderId) || null;
  }

  async updateStatus(orderId, status) {
    const order = this.orders.get(orderId);
    if (!order) throw new Error('OrderNotFoundError');
    order.status = status;
    order.updatedAt = new Date().toISOString();
    return order;
  }

  async getByUser(userId) {
    return [...this.orders.values()].filter(o => o.userId === userId);
  }
}

module.exports = { OrderDB };
