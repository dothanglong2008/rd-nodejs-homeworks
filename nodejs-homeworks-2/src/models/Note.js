const mongoose = require('mongoose');

// Define a schema
const Schema = mongoose.Schema;

const NoteSchema = new Schema({
  _id: String,
  userId: String,
  completed: Boolean,
  text: String,
  createdDate: Date,
}, {
  versionKey: false,
});

module.exports = mongoose.model('Note', NoteSchema);
