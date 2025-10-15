// Home Page Chatbot

const homeChat = {
    conversationHistory: [],

    init() {
        this.loadHistory();
        this.setupEventListeners();
        this.checkAIStatus();
    },

    loadHistory() {
        const saved = utils.loadFromStorage('home_chat_history', []);
        this.conversationHistory = saved;

        // Display saved messages (limit to last 5 for brevity)
        const recentHistory = saved.slice(-5);
        recentHistory.forEach(msg => {
            if (msg.role !== 'system') {
                this.displayMessage(msg.content, msg.role === 'user');
            }
        });
    },

    saveHistory() {
        utils.saveToStorage('home_chat_history', this.conversationHistory);
    },

    setupEventListeners() {
        const input = document.getElementById('home-chat-input');
        const sendBtn = document.getElementById('home-chat-send');
        const quickQuestions = document.querySelectorAll('.quick-question');

        // Send message on button click
        sendBtn.addEventListener('click', () => this.sendMessage());

        // Send message on Enter key
        input.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                this.sendMessage();
            }
        });

        // Quick question buttons
        quickQuestions.forEach(btn => {
            btn.addEventListener('click', () => {
                const question = btn.getAttribute('data-question');
                input.value = question;
                this.sendMessage();
            });
        });
    },

    async checkAIStatus() {
        const isAvailable = await utils.checkOllamaStatus();
        if (!isAvailable) {
            this.displayMessage(
                '⚠️ <strong>AI is offline.</strong> Make sure Ollama is running:<br>1. Open terminal<br>2. Run: <code class="bg-gray-200 px-2 py-1 rounded">ollama serve</code><br><br>You can still explore the app features!',
                false
            );
        }
    },

    async sendMessage() {
        const input = document.getElementById('home-chat-input');
        const message = input.value.trim();

        if (!message) return;

        // Display user message
        this.displayMessage(message, true);

        // Add to history
        this.conversationHistory.push({
            role: 'user',
            content: message
        });

        // Clear input
        input.value = '';

        // Show typing indicator
        this.showTypingIndicator();

        // Get AI response
        const response = await this.getAIResponse(message);

        // Remove typing indicator
        this.removeTypingIndicator();

        // Display AI response
        this.displayMessage(response, false);

        // Add to history
        this.conversationHistory.push({
            role: 'assistant',
            content: response
        });

        // Save history
        this.saveHistory();

        // Add feedback buttons
        this.addFeedbackButtons();
    },

    async getAIResponse(message) {
        // Build system prompt
        const systemPrompt = `You are a helpful assistant for education leadership preparation. You help K-12 education professionals (principals, vice-principals, superintendents) with:
- Interview preparation and common questions
- Resume and career advice
- Leadership strategies and best practices
- Guidance on using this prep tool

Keep responses brief (under 100 words), practical, and use bullet points when appropriate. If the question is about app features, guide users to the right section (Resume Builder, Interview Practice, Career Chat, or Resources).

Be encouraging and professional.`;

        // Build prompt with history context (last 3 exchanges)
        const recentHistory = this.conversationHistory.slice(-6); // Last 3 exchanges (user + assistant)
        let contextPrompt = systemPrompt + '\n\nConversation history:\n';

        recentHistory.forEach(msg => {
            contextPrompt += `${msg.role === 'user' ? 'User' : 'Assistant'}: ${msg.content}\n`;
        });

        contextPrompt += `User: ${message}\nAssistant:`;

        // Call Ollama
        const response = await utils.askOllama(contextPrompt);

        return response;
    },

    displayMessage(content, isUser) {
        const container = document.getElementById('home-chat-messages');

        const messageDiv = document.createElement('div');
        messageDiv.className = `flex ${isUser ? 'justify-end' : 'justify-start'} chat-bubble`;

        const bubble = document.createElement('div');
        bubble.className = `${isUser ? 'bg-gradient-to-r from-blue-800 to-blue-600 text-white' : 'bg-gray-200 text-gray-800'} rounded-lg px-4 py-3 max-w-md shadow-md`;

        if (!isUser) {
            bubble.innerHTML = `
                <p class="font-medium text-sm text-navy mb-1">AI Assistant</p>
                <div class="leading-relaxed">${utils.formatAIResponse(content)}</div>
            `;
        } else {
            bubble.innerHTML = `
                <p class="font-medium text-sm opacity-80 mb-1">You</p>
                <div class="leading-relaxed">${utils.sanitizeHTML(content)}</div>
            `;
        }

        messageDiv.appendChild(bubble);
        container.appendChild(messageDiv);

        // Scroll to bottom
        utils.scrollToBottom('home-chat-messages');
    },

    showTypingIndicator() {
        const container = document.getElementById('home-chat-messages');

        const indicator = document.createElement('div');
        indicator.id = 'typing-indicator';
        indicator.className = 'flex justify-start';

        indicator.innerHTML = `
            <div class="bg-gray-200 text-gray-800 rounded-lg px-4 py-3 shadow-md">
                <p class="font-medium text-sm text-navy mb-1">AI Assistant</p>
                <div class="flex space-x-1">
                    <div class="w-2 h-2 bg-navy rounded-full animate-bounce" style="animation-delay: 0s"></div>
                    <div class="w-2 h-2 bg-navy rounded-full animate-bounce" style="animation-delay: 0.2s"></div>
                    <div class="w-2 h-2 bg-navy rounded-full animate-bounce" style="animation-delay: 0.4s"></div>
                </div>
            </div>
        `;

        container.appendChild(indicator);
        utils.scrollToBottom('home-chat-messages');
    },

    removeTypingIndicator() {
        const indicator = document.getElementById('typing-indicator');
        if (indicator) {
            indicator.remove();
        }
    },

    addFeedbackButtons() {
        // Add thumbs up/down buttons to last AI message
        const messages = document.getElementById('home-chat-messages');
        const lastBubble = messages.querySelector('.bg-gray-200:last-of-type');

        if (lastBubble && !lastBubble.querySelector('.feedback-buttons')) {
            const feedbackDiv = document.createElement('div');
            feedbackDiv.className = 'feedback-buttons mt-2 flex space-x-2';
            feedbackDiv.innerHTML = `
                <button class="feedback-btn text-gray-500 hover:text-green-500 transition-colors" data-feedback="positive">
                    <i class="fas fa-thumbs-up"></i>
                </button>
                <button class="feedback-btn text-gray-500 hover:text-red-500 transition-colors" data-feedback="negative">
                    <i class="fas fa-thumbs-down"></i>
                </button>
            `;

            lastBubble.appendChild(feedbackDiv);

            // Add feedback listeners
            feedbackDiv.querySelectorAll('.feedback-btn').forEach(btn => {
                btn.addEventListener('click', (e) => {
                    const feedback = e.currentTarget.getAttribute('data-feedback');
                    this.handleFeedback(feedback);
                    e.currentTarget.classList.add(feedback === 'positive' ? 'text-green-500' : 'text-red-500');
                    e.currentTarget.disabled = true;
                });
            });
        }
    },

    handleFeedback(type) {
        console.log(`User feedback: ${type}`);
        utils.showToast('Thank you for your feedback!', 'success');

        // In production, you'd send this to analytics
        const feedbackData = {
            type,
            lastMessage: this.conversationHistory[this.conversationHistory.length - 1],
            timestamp: new Date().toISOString()
        };

        // Save to local storage for demo
        const allFeedback = utils.loadFromStorage('chat_feedback', []);
        allFeedback.push(feedbackData);
        utils.saveToStorage('chat_feedback', allFeedback);
    }
};

// Initialize when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => homeChat.init());
} else {
    homeChat.init();
}
