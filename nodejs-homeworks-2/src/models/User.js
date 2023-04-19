const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema(
    {
      _id: String,
      username: String,
      createdDate: Date,
    }, {
      versionKey: false,
    },
);

module.exports = mongoose.model('User', UserSchema);
