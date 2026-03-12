/**
 * Payment Service - Process Handler
 * service: payment-service
 *
 * Dependencies: validate.js, db.js, config/stripe.yml
 * Handles payment processing, wallet transactions, and refunds.
 */

const { PaymentValidator } = require('./validate');
const { PaymentDB } = require('./db');

class PaymentProcessor {
  constructor() {
    this.validator = new PaymentValidator();
    this.db = new PaymentDB();
    this.STRIPE_FEE_PERCENT = 2.9;
  }

  async processPayment(orderId, amount, walletId) {
    // BUG SCENARIO: If walletId is null, this crashes
    if (!walletId) {
      throw new TypeError("Cannot read property 'wallet' of null");
    }

    // Validate payment details
    const validation = this.validator.validateAmount(amount);
    if (!validation.valid) {
      throw new Error(`PaymentError: ${validation.reason}`);
    }

    // Check wallet balance
    const wallet = await this.db.getWallet(walletId);
    if (wallet.balance < amount) {
      throw new Error('InsufficientFundsError: Wallet balance too low');
    }

    // Calculate fees
    const fee = amount * (this.STRIPE_FEE_PERCENT / 100);
    const netAmount = amount - fee;

    // Process transaction
    const txn = await this.db.createTransaction({
      orderId,
      walletId,
      amount,
      fee,
      netAmount,
      status: 'completed',
      timestamp: new Date().toISOString()
    });

    return { transactionId: txn.id, status: 'success', netAmount };
  }

  async refund(transactionId) {
    const txn = await this.db.getTransaction(transactionId);
    if (!txn) throw new Error('TransactionNotFoundError');
    
    await this.db.updateTransaction(transactionId, { status: 'refunded' });
    return { status: 'refunded', amount: txn.amount };
  }
}

module.exports = { PaymentProcessor };
