const mongoose = require('mongoose');

require('dotenv').config();

module.exports = async function databaseConnection() {
  try {
    await mongoose.set('strictQuery', true);
    await mongoose.connect(process.env.URL, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    console.log('Database connection successfully established');
  } catch (err) {
    console.error(err.message);
    process.exit(1);
  }
};
