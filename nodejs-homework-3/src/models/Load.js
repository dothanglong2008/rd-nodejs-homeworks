const {default: mongoose} = require('mongoose');

const {Schema} = mongoose;

const loadSchema = new Schema({
  created_by: String,
  assigned_to: String,
  status: {
    type: String,
    enum: ['NEW', 'POSTED', 'ASSIGNED', 'SHIPPED'],
  },
  state: {
    type: String,
    enum: ['En route to Pick Up',
      'Arrived to Pick Up',
      'En route to delivery',
      'Arrived to delivery'],
  },
  name: String,
  payload: Number,
  pickup_address: String,
  delivery_address: String,
  dimensions: {
    width: Number,
    length: Number,
    height: Number,
  },
  logs: [{
    message: String,
    time: Date,
  }],
  created_date: Date,
});
const Load = mongoose.model('Load', loadSchema);
module.exports = Load;
