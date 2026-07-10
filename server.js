const express = require('express');
const cors = require("cors");
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');
const axios = require('axios');

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

// --------------------
// ROUTES
// --------------------
app.use('/auth', require('./routes/auth'));
app.use('/projects', require('./routes/projects'));
app.use('/music', require('./routes/music'));
app.use('/video', require('./routes/video'));
app.use('/audio', require('./routes/audio'));

// --------------------
// COMFYUI BRIDGE
// --------------------
app.post('/api/generate-ai', async (req, res) => {
    try {
        const { prompt_data } = req.body;
        const response = await axios.post('http://127.0.0.1:8188/prompt', {
            prompt: prompt_data
        });
        res.json({ status: 'Job Started', prompt_id: response.data.prompt_id });
    } catch (error) {
        console.error('ComfyUI Bridge Error:', error.message);
        res.status(500).json({ error: 'ComfyUI is unreachable' });
    }
});

// --------------------
// MONGO CONNECTION
// --------------------
const MONGO_URI = process.env.MONGO_URI;

mongoose.connect(MONGO_URI, {
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
