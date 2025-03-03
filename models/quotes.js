const mongoose = require('mongoose');

const quoteSchema = new mongoose.Schema({

  author: {
    type: String,
    required: true,
    minLength: 2
  },
  content: {
    type: String,
    required: true,
    minLength: 3
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  tags: {
    type: [String],
    default: [],
  },
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  }

});

module.exports = mongoose.model('Quote', quoteSchema);