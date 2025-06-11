const mongoose = require('mongoose');

const EntrySchema = new mongoose.Schema({
  date: { type: Date, default: Date.now },
  title: String,
  body: String,
  moodTags: [String],
  moodScore: { type: Number, min: -5, max: 5 },
  wordCount: Number,
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
});

EntrySchema.pre('save', function (next) {
  this.wordCount = this.body.split(' ').length;
  next();
});

module.exports = mongoose.model('Entry', EntrySchema);