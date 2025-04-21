const Prediction = require('../models/Prediction');
const Cache = require('../models/Cache');
const User = require('../models/User');
const crypto = require('crypto');
const axios = require('axios');

// Simulated ML API call – replace this with your actual API integration
const callMLApi = async (Data) => {
  try {
    // Replace with your actual ML API endpointz
    const response = await axios.post('https://predictremainlifeml.onrender.com/predict/', { data:Data });
    console.log(response);
    // Assuming your API returns the predicted life in response.data.predictedLife
    return response.data.RUL_prediction;
  } catch (error) {
    throw new Error('ML API call failed: ' + error.message);
  }
};

exports.getPrediction = async (req, res) => {
  
    // console.log('🧠 Body:', req.body);
  const sensorData = req.body.data; // Expecting an array of 24 numbers
  if (!sensorData || sensorData.length !== 24) {
    return res.status(400).json({ message: `Invalid sensor data` });
  }

  // Create a hash of sensorData to use for caching
  const sensorHash = crypto.createHash('md5').update(JSON.stringify(sensorData)).digest('hex');
console.log('a');
  try {
    // Check for cached result
    
    let cached = await Cache.findOne({ sensorHash });
    
    if (cached) {
      // Save prediction to user's search history
      const prediction = new Prediction({
        sensorData,
        predictedLife: cached.prediction,
        user: req.user.id
      });
      
      await prediction.save();
      await User.findByIdAndUpdate(req.user.id, { $push: { searchHistory: { prediction: prediction._id } } });
      
      return res.json({ predictedLife: cached.prediction, cached: true });
      
    }

    // If not cached, call the ML API
    const predictedLife = await callMLApi(sensorData);

    // Save the new prediction in cache
    const newCache = new Cache({ sensorHash, prediction: predictedLife });
    await newCache.save();

    // Save prediction in the database and update user history
    console.log("📦 sensorData:", sensorData);
console.log("📈 predictedLife:", predictedLife);
console.log("👤 userID:", req.user?.id);
    const prediction = new Prediction({
      sensorData,
      predictedLife,
      user: req.user.id
    });
    await prediction.save();
    await User.findByIdAndUpdate(req.user.id, { $push: { searchHistory: { prediction: prediction._id } }}, { new: true  });
    console.log('b');
    res.json({ predictedLife, cached: false });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

exports.getHistory = async (req, res) => {
  try {
    console.log('e');
    // const user = await User.findById(req.user.id).populate({
    //   path: 'searchHistory.prediction',
    //   options: { sort: { createdAt: -1 }, limit: 10 }
    // });

    const user = await User.findById(req.user.id).populate('searchHistory.prediction');

// Sort the searchHistory array manually using the `prediction.createdAt`
const sortedHistory = user.searchHistory
  .filter(entry => entry.prediction) // Make sure prediction is populated
  .sort((a, b) => new Date(b.prediction.createdAt) - new Date(a.prediction.createdAt))
  .slice(0, 10); // Take only the latest 10
    console.log('f');
    res.json({ history: sortedHistory  });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};
