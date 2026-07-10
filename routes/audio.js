const express = require('express');
const router = express.Router();
const auth = require('./auth');
const AudioJob = require('../models/AudioJob');
const axios = require('axios');

const TTS_SERVER_URL = 'http://192.168.1.25:5000/api/tts';

async function generateAudioFromPrompt(prompt) {
  try {
    const response = await axios.post(TTS_SERVER_URL, { text: prompt });
    return response.data.audio_url || response.data.url || null;
  } catch (err) {
    console.error('LOCAL AUDIO ENGINE ERROR:', err.message);
    return null;
  }
}

router.post('/generate', auth, async (req, res) => {
  try {
    const { projectId, prompt } = req.body;
    if (!prompt) return res.status(400).json({ message: 'Prompt is required' });

    const job = await AudioJob.create({ 
        userId: req.user, 
        projectId: projectId || null, 
        prompt, 
        status: 'processing', 
        resultUrl: '' 
    });
    
    const resultUrl = await generateAudioFromPrompt(prompt);

    if (!resultUrl) {
      job.status = 'failed';
      await job.save();
      return res.json({ message: 'Audio failed', jobId: job._id });
    }

    job.status = 'done';
    job.resultUrl = resultUrl;
    await job.save();
    return res.json({ message: 'Audio done', jobId: job._id, resultUrl });
  } catch (err) {
    console.error('AUDIO ROUTE ERROR:', err.message);
    return res.status(500).json({ message: 'Server error in /audio/generate' });
  }
});

module.exports = router;
