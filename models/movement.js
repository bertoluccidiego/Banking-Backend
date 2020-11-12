const mongoose = require('mongoose');

const { Schema } = mongoose;

const movementSchema = new Schema({
  date: Date,
  from: {
    type: Schema.Types.ObjectId,
    ref: 'Account',
  },
  to: {
    type: Schema.Types.ObjectId,
    ref: 'Account',
  },
  amount: Number,
});

module.exports = mongoose.model('Movement', movementSchema);
