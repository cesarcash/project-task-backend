const mongoose = require('mongoose');

const taskSchema = new mongoose.Schema({

  title: {
    type: String,
    required: true,
    minLength: 2
  },
  description: {
    type: String,
    required: true,
    minLength: 3
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  endDate: {
    type: Date,
    required: true
  },
  status: {
    type: String,
    enum: ['pending','in progress','completed'],
    required: true
  },
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  }

});

module.exports = mongoose.model('Task', taskSchema);