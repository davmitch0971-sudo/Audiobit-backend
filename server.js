const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');

dotenv.config();

const app = express();
app.use(express.json());
app.use(cors());

// --------------------
// ROUTES
// --------------------
app.use('/auth', require('./routes/auth'));
app.use('/projects', require('./routes/projects'));
app.use('/music', require('./routes/music'));
app.use('/video', require('./routes/video'));
app.use('/audio', require('./routes/audio'));   // 🔥 NEW AUDIO ROUTE

// --------------------
// MONGO CONNECTION
// --------------------
const MONGO_URI = process.env.MONGO_URI;

mongoose.connect(MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => console.log('MongoDB connected'))
.catch(err => console.error('MongoDB error:', err.message));

// --------------------
// SERVER START
// --------------------
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`Loaded MONGO_URI: ${MONGO_URI}`);
});
