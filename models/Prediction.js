const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const PredictionSchema = new Schema({
  sensorData: { type: Array, required: true }, // Array of 24 sensor values
  predictedLife: { type: Number, required: true },
  createdAt: { type: Date, default: Date.now },
  user: { type: Schema.Types.ObjectId, ref: 'User', required: true }
});

module.exports = mongoose.model('Prediction', PredictionSchema);
