/**
 * Payment Service - Validation Module
 * service: payment-service
 *
 * Dependencies: db.js, process.js
 * Validates payment amounts, currencies, and wallet ownership.
 */

class PaymentValidator {
  constructor() {
    this.MIN_AMOUNT = 0.50;
    this.MAX_AMOUNT = 999999.99;
    this.SUPPORTED_CURRENCIES = ['USD', 'EUR', 'GBP', 'INR'];
  }

  validateAmount(amount, currency = 'USD') {
    if (typeof amount !== 'number' || isNaN(amount)) {
      return { valid: false, reason: 'Amount must be a valid number' };
    }
    if (amount < this.MIN_AMOUNT) {
      return { valid: false, reason: `Amount below minimum (${this.MIN_AMOUNT})` };
    }
    if (amount > this.MAX_AMOUNT) {
      return { valid: false, reason: `Amount exceeds maximum (${this.MAX_AMOUNT})` };
    }
    if (!this.SUPPORTED_CURRENCIES.includes(currency)) {
      return { valid: false, reason: `Unsupported currency: ${currency}` };
    }
    return { valid: true };
  }

  validateWalletOwnership(wallet, userId) {
    // BUG SCENARIO: Missing null check on wallet
    if (wallet.ownerId !== userId) {
      throw new Error('AuthorizationError: Wallet does not belong to user');
    }
    return true;
  }
}

module.exports = { PaymentValidator };
