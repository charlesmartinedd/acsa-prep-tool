// Vercel Serverless Function for OpenAI Text-to-Speech API proxy
module.exports = async function handler(req, res) {
    // Enable CORS
    res.setHeader('Access-Control-Allow-Credentials', true);
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
    res.setHeader('Access-Control-Allow-Headers', 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version');

    // Handle preflight
    if (req.method === 'OPTIONS') {
        res.status(200).end();
        return;
    }

    // Only allow POST
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    try {
        const { text, voice = 'nova', model = 'tts-1', speed = 1.0 } = req.body;

        // Validate input
        if (!text) {
            return res.status(400).json({ error: 'Text is required' });
        }

        // Get API key from environment variable
        const OPENAI_API_KEY = process.env.OPENAI_API_KEY;

        if (!OPENAI_API_KEY) {
            return res.status(500).json({ error: 'OpenAI API key not configured' });
        }

        // Call OpenAI TTS API
        const response = await fetch('https://api.openai.com/v1/audio/speech', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${OPENAI_API_KEY}`
            },
            body: JSON.stringify({
                model: model,
                input: text,
                voice: voice,
                speed: speed
            })
        });

        if (!response.ok) {
            const errorData = await response.json();
            console.error('OpenAI TTS API Error:', errorData);
            return res.status(response.status).json({
                error: errorData.error?.message || 'OpenAI TTS API error'
            });
        }

        // Get audio data as buffer
        const audioBuffer = await response.arrayBuffer();

        // Set proper audio headers
        res.setHeader('Content-Type', 'audio/mpeg');
        res.setHeader('Content-Length', audioBuffer.byteLength);

        // Send audio data
        return res.status(200).send(Buffer.from(audioBuffer));

    } catch (error) {
        console.error('TTS Server Error:', error);
        return res.status(500).json({ error: error.message || 'Internal server error' });
    }
}
