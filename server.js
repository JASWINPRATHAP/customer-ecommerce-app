const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const path = require('path');

// Microservice logic files
const { LoginHandler } = require('./auth/login');
const { PaymentProcessor } = require('./payment/process');
const { OrderService } = require('./order/create');
const { CartService } = require('./cart/add');

const app = express();
const PORT = process.env.PORT || 3000;
const INCIDENT_TOOL_URL = process.env.INCIDENT_TOOL_URL || 'http://localhost:8000';

app.use(cors());
app.use(bodyParser.json());

// Initialize services
// Using realistic configurations for the demo
const authService = new LoginHandler({ maxRetries: 5 });
const paymentService = new PaymentProcessor();
const orderService = new OrderService();
const cartService = new CartService();

// --- API ROUTES ---

// Serve Storefront
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

// Auth Login
app.post('/api/auth/login', async (req, res) => {
  try {
    const { username, password } = req.body;
    const result = await authService.authenticate(username, password);
    res.json(result);
  } catch (err) {
    console.error(`[AUTH ERROR] ${err.message}`);
    res.status(401).json({ error: err.message, stack: err.stack });
    
    // Webhook to our Incident Tool
    triggerIncidentWebhook(err, 'auth/login.js', 42, 'auth-service');
  }
});

// Process Payment (THIS CRASHES DELIBERATELY)
app.post('/api/payment/pay', async (req, res) => {
  try {
    const { orderId, amount, walletId } = req.body;
    const result = await paymentService.processPayment(orderId, amount, walletId);
    res.json(result);
  } catch (err) {
    console.error(`[PAYMENT ERROR] ${err.message}`);
    res.status(500).json({ error: err.message, stack: err.stack });
    
    // Webhook to our Incident Tool
    triggerIncidentWebhook(err, 'payment/process.js', 24, 'payment-service');
  }
});

// Create Order
app.post('/api/order/create', async (req, res) => {
  try {
    const { userId, items, walletId } = req.body;
    const result = await orderService.createOrder(userId, items, walletId);
    res.json(result);
  } catch (err) {
    console.error(`[ORDER ERROR] ${err.message}`);
    res.status(500).json({ error: err.message });
  }
});

// Webhook to the Incident Tool (SUMMA Dashboard)
async function triggerIncidentWebhook(err, file, line, service) {
  const logPayload = {
    log_text: `ERROR ${err.name}: ${err.message}\nat ${file}:${line}\nservice: ${service}\ntimestamp: ${new Date().toISOString()}`
  };
  
  try {
    const axios = require('axios');
    await axios.post(`${INCIDENT_TOOL_URL}/parse-log`, logPayload);
    console.log(`[INCIDENT PUSHED] Telemetry sent to: ${INCIDENT_TOOL_URL}`);
  } catch (webhookErr) {
    console.warn(`[WEBHOOK FAILED] Could not reach SUMMA: ${webhookErr.message}`);
  }
}

app.listen(PORT, () => {
  console.log(`🚀 Customer-Ecommerce Microservice Live on http://localhost:${PORT}`);
});
