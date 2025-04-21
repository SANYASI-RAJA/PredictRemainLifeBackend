const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const CacheSchema = new Schema({
  sensorHash: { type: String, required: true, unique: true },
  prediction: { type: Number, required: true },
  createdAt: { type: Date, default: Date.now, expires: 3600 } // Cache expires after 1 hour
});

module.exports = mongoose.model('Cache', CacheSchema);
