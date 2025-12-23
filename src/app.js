const express = require('express');
const cors = require('cors');
const healthRoute = require('./routes/health');
const webhookRoute = require('./routes/webhooks');
const ordersRoute = require('./routes/orders');

const app = express();

app.use(cors());
app.use(express.json());
app.use('/api', healthRoute);
app.use(webhookRoute);
app.use(ordersRoute);

// 404 handler
app.use((req, res) => {
  res.status(404).json({ error: 'Not found' });
});

module.exports = app;
