const mongoose = require('mongoose');
const dotenv = require('dotenv');
dotenv.config();

const MONGO_DB = process.env.DATABASE_URI;

const connect = async () => {
  mongoose
      .connect(MONGO_DB, {useNewUrlParser: true, useUnifiedTopology: true});
};

module.exports = connect;
