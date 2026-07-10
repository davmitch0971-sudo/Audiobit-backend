const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const connectDB = require('./config/db');

dotenv.config();
const app = express();

// Connect to MongoDB
connectDB();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/projects', require('./routes/projects'));
app.use('/api/music', require('./routes/music'));
app.use('/api/video', require('./routes/video'));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`AudioBit backend running on port ${PORT}`));
