const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const cookieParser  = require('cookie-parser');

// Load environment variables
dotenv.config();

// Connect to MongoDB
connectDB();

const app = express();

// Middlewares
app.use(cookieParser());
app.use(express.json());
app.use(cors({
  origin: 'https://predict-remain-life-frontend.vercel.app', // your frontend URL
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true,                // if you're using cookies or auth headers
  methods: ['GET','POST','PUT','DELETE','OPTIONS']
}));
app.use(morgan('dev'));
// app.options("*", cors());

// Routes
app.use('/api/auth', require('./routes/auth'));

app.use('/api/predictions', require('./routes/prediction'));

// Global Error Handling Middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Server Error', error: err.message });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
