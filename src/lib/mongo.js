const mongoose = require('mongoose');
const { databasePath } = require('../config');

let connectionPromise;

async function connectMongo() {
  if (connectionPromise) {
    return connectionPromise;
  }

  mongoose.set('strictQuery', true);

  connectionPromise = mongoose
    .connect(databasePath, {
      serverSelectionTimeoutMS: 5000,
    })
    .then(() => mongoose.connection)
    .catch((error) => {
      connectionPromise = undefined;
      throw error;
    });

  return connectionPromise;
}

module.exports = connectMongo;
