const {default: mongoose} = require('mongoose');

const {Schema} = mongoose;

const registrationCredentialSchema = new Schema({
  email: String,
  password: String,
  role: {
    type: String,
    enum: ['SHIPPER', 'DRIVER'],
  },
});
const RegistrationCredential = mongoose.model('User',
    registrationCredentialSchema);
module.exports = RegistrationCredential;
