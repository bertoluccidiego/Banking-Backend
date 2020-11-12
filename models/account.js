const mongoose = require('mongoose');

const { Schema } = mongoose;

const accountSchema = new Schema({
  owner: {
    type: Schema.Types.ObjectId,
    ref: 'User',
  },
  balance: {
    type: Number,
    default: 10000,
  },
  movements: [
    {
      type: Schema.Types.ObjectId,
      ref: 'Movement',
    },
  ],
  creationDate: Date,
});

module.exports = mongoose.model('Account', accountSchema);
