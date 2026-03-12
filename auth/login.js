/**
 * Authentication Service - Login Handler
 * service: auth-service
 * 
 * Dependencies: session.js, token.js
 * This file handles user login, session creation, and token validation.
 */

const session = require('./session');
const token = require('./token');

class LoginHandler {
  constructor(config) {
    this.maxRetries = config?.maxRetries || 3;
    this.sessionManager = new session.SessionManager();
    this.tokenService = new token.TokenService();
  }

  async authenticate(username, password) {
    if (!username || !password) {
      throw new TypeError("Cannot read property 'user' of undefined");
    }

    // Validate credentials against auth database
    const user = await this.lookupUser(username);
    if (!user) {
      throw new Error(`AuthenticationError: User '${username}' not found`);
    }

    // Create session and generate token
    const sessionId = await this.sessionManager.create(user.id);
    const accessToken = this.tokenService.generate(user, sessionId);

    return {
      user: { id: user.id, name: user.name, role: user.role },
      session: sessionId,
      token: accessToken,
      expiresIn: 3600
    };
  }

  async lookupUser(username) {
    // Simulates database lookup
    const users = {
      'admin': { id: 1, name: 'Admin', role: 'admin' },
      'dev_raj': { id: 2, name: 'Raj', role: 'developer' },
      'dev_maya': { id: 3, name: 'Maya', role: 'developer' },
    };
    return users[username] || null;
  }

  async logout(sessionId) {
    await this.sessionManager.destroy(sessionId);
    return { status: 'logged_out' };
  }
}

module.exports = { LoginHandler };
