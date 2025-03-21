const express = require('express');
const gtts = require('node-gtts');
const path = require('path');
const fs = require('fs');
const app = express();

// Middleware
app.use(express.json());
app.use(express.static('.', { maxAge: '1h' }));

// Error handler middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ error: 'Something went wrong!' });
});

// Health check endpoint
app.get('/api/health', (req, res) => {
    res.json({ status: 'ok' });
});

// TTS endpoint
app.post('/api/tts', async (req, res) => {
    try {
        const { text, lang = 'en' } = req.body;
        
        if (!text) {
            return res.status(400).json({ error: 'Text is required' });
        }

        // Create temp directory if it doesn't exist
        const tempDir = path.join(process.cwd(), 'temp');
        if (!fs.existsSync(tempDir)) {
            fs.mkdirSync(tempDir, { recursive: true });
        }

        const tempFile = path.join(tempDir, `speech-${Date.now()}.mp3`);
        const tts = gtts(lang);

        // Create and send file
        tts.save(tempFile, text, () => {
            res.download(tempFile, 'speech.mp3', (err) => {
                // Clean up temp file
                fs.unlink(tempFile, (deleteErr) => {
                    if (deleteErr) console.error('Error deleting temp file:', deleteErr);
                });
                
                if (err) {
                    console.error('Error sending file:', err);
                    return res.status(500).json({ error: 'Error sending audio file' });
                }
            });
        });
    } catch (error) {
        console.error('TTS error:', error);
        res.status(500).json({ error: 'TTS processing failed' });
    }
});

// Handle production mode
if (process.env.NODE_ENV === 'production') {
    app.use(express.static('.')); 
    app.get('*', (req, res) => {
        res.sendFile(path.resolve(__dirname, 'index.html'));
    });
}

const PORT = process.env.PORT || 3000;
app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on port ${PORT}`);
});

// Handle unhandled rejections
process.on('unhandledRejection', (err) => {
    console.error('Unhandled rejection:', err);
});