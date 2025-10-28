const mongoose = require('mongoose');

const versionSchema = new mongoose.Schema({
  versionNumber: { type: Number, required: true },
  content: { type: String, required: true },
  message: { type: String }, // commit message or reason for change
  author: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  status: { type: String, enum: ['pending', 'approved', 'rejected'], default: 'pending' },
  reviewers: [{
    reviewer: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    action: { type: String, enum: ['approved', 'rejected'] },
    comment: String,
    date: Date
  }],
  createdAt: { type: Date, default: Date.now }
});

const documentSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: String,
  versions: [versionSchema],
  currentVersion: versionSchema,
  owner: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }
}, { timestamps: true });

documentSchema.methods.addVersion = function (newVersionData) {
  const versionNumber = this.versions.length + 1;
  const version = { ...newVersionData, versionNumber };
  this.versions.push(version);
  this.currentVersion = version;
  return this.save();
};

module.exports = mongoose.model('Document', documentSchema);
