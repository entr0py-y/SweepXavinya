require('dotenv').config({ path: '.env.local' });
const express = require('express');
const bodyParser = require('body-parser');
const verifyCleanup = require('./api/verify-cleanup.js');
const chat = require('./api/chat.js');

const app = express();
const port = Number(process.env.PORT) || 49879;

app.use(bodyParser.json({ limit: '50mb' }));
app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }));

// Handle API
app.post('/api/verify-cleanup', async (req, res) => {
  try {
    await verifyCleanup(req, res);
  } catch (error) {
    console.error('API Error:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.post('/api/chat', async (req, res) => {
  try {
    await chat(req, res);
  } catch (error) {
    console.error('Chat API Error:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Serve frontend
app.use(express.static(__dirname));

app.listen(port, () => {
  console.log(`Local Express server running on http://localhost:${port}`);
});
