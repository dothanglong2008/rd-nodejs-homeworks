const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const CredentialSchema = new Schema({
  username: String,
  password: String,
}, {
  versionKey: false,
});

module.exports = mongoose.model('Credential', CredentialSchema);
