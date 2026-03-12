/**
 * API Gateway - Router
 * service: gateway-service
 *
 * Dependencies: auth.js, logging.js
 * Routes incoming API requests to appropriate microservices.
 */

const { GatewayAuth } = require('./auth');
const { GatewayLogger } = require('./logging');

class APIRouter {
  constructor() {
    this.auth = new GatewayAuth();
    this.logger = new GatewayLogger();
    this.routes = {
      '/api/auth': 'auth-service',
      '/api/payment': 'payment-service',
      '/api/orders': 'order-service',
      '/api/cart': 'cart-service',
      '/api/inventory': 'inventory-service',
    };
  }

  async route(request) {
    this.logger.logRequest(request);

    // Authenticate request
    const authResult = await this.auth.validateRequest(request);
    if (!authResult.valid) {
      throw new Error(`GatewayError: Authentication failed - ${authResult.reason}`);
    }

    // Find target service
    const service = this.matchRoute(request.path);
    if (!service) {
      throw new Error(`GatewayError: Route not found - ${request.path}`);
    }

    return { targetService: service, authenticated: true };
  }

  matchRoute(path) {
    for (const [route, service] of Object.entries(this.routes)) {
      if (path.startsWith(route)) return service;
    }
    return null;
  }
}

module.exports = { APIRouter };
