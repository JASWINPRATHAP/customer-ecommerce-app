/**
 * Authentication Service - Token Service
 * service: auth-service
 * 
 * Dependencies: session.js, config/auth.yml
 * Generates and validates JWT tokens for API access.
 */

const crypto = require('crypto');

const JWT_SECRET = 'enterprise-secret-key-2026';
const TOKEN_EXPIRY = 3600; // seconds

class TokenService {
  generate(user, sessionId) {
    const header = Buffer.from(JSON.stringify({ alg: 'HS256', typ: 'JWT' })).toString('base64');
    const payload = Buffer.from(JSON.stringify({
      sub: user.id,
      name: user.name,
      role: user.role,
      session: sessionId,
      iat: Math.floor(Date.now() / 1000),
      exp: Math.floor(Date.now() / 1000) + TOKEN_EXPIRY
    })).toString('base64');

    const signature = crypto
      .createHmac('sha256', JWT_SECRET)
      .update(`${header}.${payload}`)
      .digest('base64');

    return `${header}.${payload}.${signature}`;
  }

  validate(token) {
    if (!token || typeof token !== 'string') {
      throw new TypeError("Cannot read property 'token' of null");
    }

    const parts = token.split('.');
    if (parts.length !== 3) {
      throw new Error('TokenError: Malformed JWT token');
    }

    const payload = JSON.parse(Buffer.from(parts[1], 'base64').toString());
    
    if (payload.exp < Math.floor(Date.now() / 1000)) {
      throw new Error('TokenError: Token expired');
    }

    return payload;
  }
}

module.exports = { TokenService };
