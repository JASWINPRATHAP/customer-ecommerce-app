/**
 * API Gateway - Request Logger
 * service: gateway-service
 *
 * Dependencies: router.js
 * Logs all API requests for monitoring and debugging.
 */

class GatewayLogger {
  constructor() {
    this.logs = [];
  }

  logRequest(request) {
    const entry = {
      timestamp: new Date().toISOString(),
      method: request.method || 'GET',
      path: request.path || '/',
      ip: request.ip || '127.0.0.1',
      userAgent: request.headers?.['user-agent'] || 'unknown',
      correlationId: this.generateCorrelationId()
    };
    this.logs.push(entry);
    return entry;
  }

  generateCorrelationId() {
    return `req_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  getRecentLogs(count = 10) {
    return this.logs.slice(-count);
  }
}

module.exports = { GatewayLogger };
