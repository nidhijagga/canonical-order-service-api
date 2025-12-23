const express = require('express');
const healthRoute = require('./routes/health');
const webhookRoute = require('./routes/webhooks');

const app = express();

app.use(express.json());
app.use('/api', healthRoute);
app.use(webhookRoute);

// 404 handler
app.use((req, res) => {
  res.status(404).json({ error: 'Not found' });
});

module.exports = app;
