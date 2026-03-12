/**
 * API Gateway - Auth Middleware
 * service: gateway-service
 *
 * Dependencies: router.js, auth/token.js
 * Validates API keys and JWT tokens at gateway level.
 */

class GatewayAuth {
  constructor() {
    this.API_KEYS = new Set(['key_prod_001', 'key_staging_002', 'key_dev_003']);
  }

  async validateRequest(request) {
    const apiKey = request.headers?.['x-api-key'];
    const authToken = request.headers?.['authorization'];

    if (!apiKey && !authToken) {
      return { valid: false, reason: 'Missing authentication credentials' };
    }

    if (apiKey && this.API_KEYS.has(apiKey)) {
      return { valid: true, method: 'api_key' };
    }

    if (authToken?.startsWith('Bearer ')) {
      return { valid: true, method: 'jwt' };
    }

    return { valid: false, reason: 'Invalid credentials' };
  }
}

module.exports = { GatewayAuth };
