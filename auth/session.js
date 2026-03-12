/**
 * Authentication Service - Session Manager
 * service: auth-service
 * 
 * Dependencies: token.js, login.js
 * Manages user sessions with Redis-backed store.
 */

const crypto = require('crypto');

class SessionManager {
  constructor() {
    this.sessions = new Map();
    this.SESSION_TTL = 3600000; // 1 hour in ms
  }

  async create(userId) {
    const sessionId = crypto.randomBytes(32).toString('hex');
    this.sessions.set(sessionId, {
      userId,
      createdAt: Date.now(),
      expiresAt: Date.now() + this.SESSION_TTL,
      isActive: true
    });
    return sessionId;
  }

  async validate(sessionId) {
    const session = this.sessions.get(sessionId);
    if (!session) {
      throw new Error('SessionError: Invalid session ID');
    }
    if (Date.now() > session.expiresAt) {
      this.sessions.delete(sessionId);
      throw new Error('SessionError: Session expired');
    }
    return session;
  }

  async destroy(sessionId) {
    this.sessions.delete(sessionId);
    return true;
  }

  async refresh(sessionId) {
    const session = await this.validate(sessionId);
    session.expiresAt = Date.now() + this.SESSION_TTL;
    return session;
  }
}

module.exports = { SessionManager };
