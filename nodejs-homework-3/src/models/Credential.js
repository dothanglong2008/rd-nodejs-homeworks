const {default: mongoose} = require('mongoose');

const {Schema} = mongoose;

const credentialSchema = new Schema({
  email: String,
  password: String,
});
const Credential = mongoose.model('Credential',
    credentialSchema);
module.exports = Credential;
