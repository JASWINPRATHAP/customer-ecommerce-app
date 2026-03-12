/**
 * Payment Service - Database Layer
 * service: payment-service
 *
 * Dependencies: validate.js, config/db.yml
 * Handles wallet lookups and transaction CRUD operations.
 */

class PaymentDB {
  constructor() {
    this.transactions = new Map();
    this.wallets = new Map([
      ['wallet_001', { id: 'wallet_001', ownerId: 1, balance: 5000.00, currency: 'USD' }],
      ['wallet_002', { id: 'wallet_002', ownerId: 2, balance: 1200.00, currency: 'USD' }],
      ['wallet_003', { id: 'wallet_003', ownerId: 3, balance: 350.00, currency: 'INR' }],
    ]);
    this.txCounter = 1000;
  }

  async getWallet(walletId) {
    const wallet = this.wallets.get(walletId);
    if (!wallet) {
      throw new Error(`DatabaseError: Wallet '${walletId}' not found`);
    }
    return wallet;
  }

  async createTransaction(data) {
    const id = `txn_${++this.txCounter}`;
    const txn = { id, ...data };
    this.transactions.set(id, txn);
    
    // Deduct from wallet
    const wallet = this.wallets.get(data.walletId);
    if (wallet) {
      wallet.balance -= data.amount;
    }
    return txn;
  }

  async getTransaction(transactionId) {
    return this.transactions.get(transactionId) || null;
  }

  async updateTransaction(transactionId, updates) {
    const txn = this.transactions.get(transactionId);
    if (!txn) throw new Error('TransactionNotFoundError');
    Object.assign(txn, updates);
    return txn;
  }
}

module.exports = { PaymentDB };
