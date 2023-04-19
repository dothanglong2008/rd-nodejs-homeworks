const {default: mongoose} = require('mongoose');

const {Schema} = mongoose;

const userSchema = new Schema({
  role: String,
  email: String,
  created_date: Date,
  password: String,
});
const User = mongoose.model('User', userSchema);
module.exports = User;
