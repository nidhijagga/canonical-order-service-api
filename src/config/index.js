require('dotenv').config();

const requiredEnv = ['WEBHOOK_SECRET', 'DATABASE_PATH'];

requiredEnv.forEach((key) => {
  if (!process.env[key]) {
    throw new Error(`Missing required environment variable: ${key}`);
  }
});

module.exports = {
  port: Number(process.env.PORT) || 8000,
  webhookSecret: process.env.WEBHOOK_SECRET,
  databasePath: process.env.DATABASE_PATH,
};
