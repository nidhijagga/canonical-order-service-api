const app = require('./app');
const { port } = require('./config');
const connectMongo = require('./lib/mongo');

async function start() {
  try {
    await connectMongo();
    app.listen(port, () => {
      console.log(`Server running on port ${port}`);
    });
  } catch (error) {
    console.error('Failed to start server', error);
    process.exit(1);
  }
}

start();
