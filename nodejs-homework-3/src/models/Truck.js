const {default: mongoose} = require('mongoose');

const {Schema} = mongoose;

const truckSchema = new Schema({
  created_by: String,
  assigned_to: String,
  type: {
    type: String,
    enum: ['SPRINTER', 'SMALL STRAIGHT', 'LARGE STRAIGHT'],
  },
  status: {
    type: String,
    enum: ['OL', 'IS'],
  },
  created_date: Date,
});
const Truck = mongoose.model('Truck', truckSchema);
module.exports = Truck;
