// Career Advisor Chat Logic

const careerChat = {
    conversationHistory: [],
    isRecording: false,
    recognition: null,

    init() {
        this.loadHistory();
        this.setupEventListeners();
        this.checkAIStatus();
    },

    loadHistory() {
        const saved = utils.loadFromStorage('career_chat_history', []);
        this.conversationHistory = saved;

        // Display saved messages (limit to last 10 for brevity)
        const recentHistory = saved.slice(-10);
        recentHistory.forEach(msg => {
            if (msg.role !== 'system') {
                this.displayMessage(msg.content, msg.role === 'user');
            }
        });

        if (recentHistory.length > 0) {
            utils.scrollToBottom('career-chat-messages');
        }
    },

    saveHistory() {
        utils.saveToStorage('career_chat_history', this.conversationHistory);
    },

    setupEventListeners() {
        const input = document.getElementById('career-chat-input');
        const sendBtn = document.getElementById('career-chat-send');
        const clearBtn = document.getElementById('clear-chat');
        const voiceBtn = document.getElementById('voice-input-btn');
        const stopVoiceBtn = document.getElementById('stop-voice-btn');
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

        // Clear chat
        clearBtn.addEventListener('click', () => this.clearChat());

        // Voice input
        voiceBtn.addEventListener('click', () => this.startVoiceInput());
        stopVoiceBtn.addEventListener('click', () => this.stopVoiceInput());
    },

    async checkAIStatus() {
        const isAvailable = await utils.checkOllamaStatus();
        if (!isAvailable) {
            this.displayMessage(
                '⚠️ <strong>AI is currently offline.</strong><br><br>To enable AI features:<br>1. Install Ollama from <a href="https://ollama.com" target="_blank" class="underline text-navy-light">ollama.com</a><br>2. Run: <code class="bg-gray-200 px-2 py-1 rounded">ollama pull llama3</code><br>3. Run: <code class="bg-gray-200 px-2 py-1 rounded">ollama serve</code><br><br>You can still explore other features of the app!',
                false
            );
        }
    },

    async sendMessage() {
        const input = document.getElementById('career-chat-input');
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
    },

    async getAIResponse(message) {
        // Build comprehensive system prompt
        const systemPrompt = `You are an expert career advisor specializing in K-12 education leadership. You provide practical, actionable guidance for teachers and administrators pursuing leadership roles such as:
- Principal
- Vice-Principal/Assistant Principal
- Superintendent
- District-level administrators

Your expertise includes:
- California education credential requirements (Administrative Services Credential, etc.)
- Career path guidance and timeline expectations
- Leadership development strategies
- Interview and resume preparation
- Salary ranges and advancement opportunities
- District culture and organizational dynamics
- Work-life balance in education leadership

IMPORTANT CONSTRAINTS:
- Provide ONLY factual, verified information about California K-12 education leadership
- When discussing credentials, reference ONLY official CTC (California Commission on Teacher Credentialing) requirements
- Do NOT invent salary figures - provide only general ranges based on established data
- Do NOT make up timelines, requirements, or policies
- If uncertain about specific details, acknowledge the limitation and suggest official resources
- Base all advice on standard, well-established practices in California education
- Do NOT create fictional scenarios, statistics, or examples

Guidelines:
- Keep responses concise (under 150 words) unless asked for detail
- Use bullet points for clarity
- Provide specific, actionable advice based on real requirements
- Reference actual California credential requirements when discussing paths
- Be encouraging but realistic and factual about challenges
- Suggest follow-up questions when appropriate
- If asked about app features, guide users to Resume Builder, Interview Practice, or Resources

Remember: You're speaking to dedicated education professionals. Be professional, practical, supportive, and above all, ACCURATE.`;

        // Build prompt with conversation context (last 8 exchanges)
        const recentHistory = this.conversationHistory.slice(-16); // Last 8 exchanges (user + assistant)
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
        const container = document.getElementById('career-chat-messages');

        const messageDiv = document.createElement('div');
        messageDiv.className = `flex ${isUser ? 'justify-end' : 'justify-start'} chat-bubble`;

        const bubble = document.createElement('div');
        bubble.className = `max-w-md ${isUser ? 'max-w-sm' : ''}`;

        const innerBubble = document.createElement('div');
        innerBubble.className = `${isUser ? 'bg-gradient-to-r from-blue-800 to-blue-600 text-white' : 'bg-gray-200 text-gray-800'} rounded-lg px-5 py-4 shadow-md`;

        if (!isUser) {
            innerBubble.innerHTML = `
                <div class="flex items-center gap-2 mb-2">
                    <div class="bg-navy text-white rounded-full w-8 h-8 flex items-center justify-center">
                        <i class="fas fa-robot text-sm"></i>
                    </div>
                    <p class="font-medium text-sm text-navy">Career Advisor</p>
                </div>
                <div class="leading-relaxed">${utils.formatAIResponse(content)}</div>
            `;
        } else {
            innerBubble.innerHTML = `
                <div class="flex items-center gap-2 mb-2">
                    <div class="bg-white text-navy rounded-full w-8 h-8 flex items-center justify-center">
                        <i class="fas fa-user text-sm"></i>
                    </div>
                    <p class="font-medium text-sm opacity-90">You</p>
                </div>
                <div class="leading-relaxed">${utils.sanitizeHTML(content)}</div>
            `;
        }

        bubble.appendChild(innerBubble);
        messageDiv.appendChild(bubble);
        container.appendChild(messageDiv);

        // Scroll to bottom
        utils.scrollToBottom('career-chat-messages');
    },

    showTypingIndicator() {
        const container = document.getElementById('career-chat-messages');

        const indicator = document.createElement('div');
        indicator.id = 'typing-indicator';
        indicator.className = 'flex justify-start';

        indicator.innerHTML = `
            <div class="max-w-md">
                <div class="bg-gray-200 text-gray-800 rounded-lg px-5 py-4 shadow-md">
                    <div class="flex items-center gap-2 mb-2">
                        <div class="bg-navy text-white rounded-full w-8 h-8 flex items-center justify-center">
                            <i class="fas fa-robot text-sm"></i>
                        </div>
                        <p class="font-medium text-sm text-navy">Career Advisor</p>
                    </div>
                    <div class="flex space-x-1">
                        <div class="w-2 h-2 bg-navy rounded-full animate-bounce" style="animation-delay: 0s"></div>
                        <div class="w-2 h-2 bg-navy rounded-full animate-bounce" style="animation-delay: 0.2s"></div>
                        <div class="w-2 h-2 bg-navy rounded-full animate-bounce" style="animation-delay: 0.4s"></div>
                    </div>
                </div>
            </div>
        `;

        container.appendChild(indicator);
        utils.scrollToBottom('career-chat-messages');
    },

    removeTypingIndicator() {
        const indicator = document.getElementById('typing-indicator');
        if (indicator) {
            indicator.remove();
        }
    },

    startVoiceInput() {
        if (this.isRecording) return;

        // Setup speech recognition
        this.recognition = utils.setupSpeechRecognition(
            (transcript) => this.handleVoiceTranscript(transcript),
            (error) => this.handleVoiceError(error)
        );

        if (!this.recognition) return;

        this.recognition.start();
        this.isRecording = true;

        // Update UI
        document.getElementById('voice-input-btn').classList.add('hidden');
        document.getElementById('stop-voice-btn').classList.remove('hidden');
        document.getElementById('voice-status').textContent = 'Listening... 🎤';
        document.getElementById('voice-status').classList.add('text-red-500', 'font-medium');
    },

    stopVoiceInput() {
        if (!this.isRecording) return;

        if (this.recognition) {
            this.recognition.stop();
        }

        this.isRecording = false;

        // Update UI
        document.getElementById('voice-input-btn').classList.remove('hidden');
        document.getElementById('stop-voice-btn').classList.add('hidden');
        document.getElementById('voice-status').textContent = '';
        document.getElementById('voice-status').classList.remove('text-red-500', 'font-medium');
    },

    handleVoiceTranscript(transcript) {
        // Set input value
        const input = document.getElementById('career-chat-input');
        input.value = transcript;

        // Stop recording
        this.stopVoiceInput();

        // Auto-send if transcript is long enough
        if (transcript.length > 10) {
            this.sendMessage();
        }
    },

    handleVoiceError(error) {
        this.stopVoiceInput();

        if (error === 'not-allowed') {
            utils.showToast('Microphone access denied. Please enable it in browser settings.', 'error');
        } else {
            utils.showToast('Voice input error. Please try again.', 'error');
        }
    },

    clearChat() {
        if (confirm('Clear all chat history? This cannot be undone.')) {
            this.conversationHistory = [];
            this.saveHistory();

            // Clear UI
            const container = document.getElementById('career-chat-messages');
            container.innerHTML = `
                <div class="flex justify-start chat-bubble">
                    <div class="max-w-md">
                        <div class="bg-gray-200 text-gray-800 rounded-lg px-5 py-4 shadow-md">
                            <div class="flex items-center gap-2 mb-2">
                                <div class="bg-navy text-white rounded-full w-8 h-8 flex items-center justify-center">
                                    <i class="fas fa-robot text-sm"></i>
                                </div>
                                <p class="font-medium text-sm text-navy">Career Advisor</p>
                            </div>
                            <p class="leading-relaxed">
                                👋 Welcome! I'm your AI career advisor for K-12 education leadership. I can help you with:
                                <br><br>
                                • Career path guidance and credential requirements
                                <br>• Leadership development strategies
                                <br>• Interview and resume advice
                                <br>• District-specific guidance
                                <br>• Salary and advancement insights
                                <br><br>
                                What would you like to know?
                            </p>
                        </div>
                    </div>
                </div>
            `;

            utils.showToast('Chat history cleared', 'success');
        }
    }
};

// Initialize when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => careerChat.init());
} else {
    careerChat.init();
}
