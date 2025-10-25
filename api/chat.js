// Vercel Serverless Function for ChatGPT API proxy
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
        // Support both old format (prompt + conversationHistory) and new format (messages array)
        // Using GPT-5 (latest model released August 2025) for best quality responses
        // Note: GPT-5 only supports temperature = 1 (default)
        const { prompt, conversationHistory = [], messages: directMessages, model = 'gpt-5', temperature = 1, maxTokens = 500 } = req.body;

        // Get API key from environment variable (secure!)
        const OPENAI_API_KEY = process.env.OPENAI_API_KEY;

        if (!OPENAI_API_KEY) {
            return res.status(500).json({ error: 'OpenAI API key not configured' });
        }

        // Build messages array - support both formats
        let messages;
        if (directMessages && Array.isArray(directMessages)) {
            // New format: messages array already provided
            messages = directMessages;
        } else if (prompt) {
            // Old format: build from prompt + conversationHistory
            messages = [
                {
                    role: 'system',
                    content: 'You are an expert education leadership coach helping K-12 administrators prepare for principal, vice-principal, and superintendent positions. Provide practical, actionable advice based on California education standards and ACSA best practices.'
                },
                ...conversationHistory,
                {
                    role: 'user',
                    content: prompt
                }
            ];
        } else {
            return res.status(400).json({ error: 'Either prompt or messages is required' });
        }

        // Call OpenAI API
        const response = await fetch('https://api.openai.com/v1/chat/completions', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${OPENAI_API_KEY}`
            },
            body: JSON.stringify({
                model: model,
                messages: messages,
                temperature: temperature,
                max_completion_tokens: maxTokens  // GPT-5 uses max_completion_tokens instead of max_tokens
            })
        });

        if (!response.ok) {
            const errorData = await response.json();
            console.error('OpenAI API Error:', errorData);
            return res.status(response.status).json({
                error: errorData.error?.message || 'OpenAI API error'
            });
        }

        const data = await response.json();
        const aiResponse = data.choices[0].message.content;

        return res.status(200).json({ response: aiResponse });

    } catch (error) {
        console.error('Server Error:', error);
        return res.status(500).json({ error: error.message || 'Internal server error' });
    }
}
