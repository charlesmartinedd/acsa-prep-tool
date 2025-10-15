// Utility Functions for ACSA Prep Tool

// Show loading spinner
function showSpinner(elementId) {
    const element = document.getElementById(elementId);
    if (element) {
        element.innerHTML = `
            <div class="flex justify-center items-center py-8">
                <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-navy"></div>
            </div>
        `;
    }
}

// Show toast notification
function showToast(message, type = 'info') {
    const colors = {
        info: 'bg-blue-500',
        success: 'bg-green-500',
        error: 'bg-red-500',
        warning: 'bg-yellow-500'
    };

    const toast = document.createElement('div');
    toast.className = `fixed bottom-4 right-4 ${colors[type]} text-white px-6 py-3 rounded-lg shadow-lg z-50 fade-in`;
    toast.innerHTML = `
        <div class="flex items-center space-x-2">
            <i class="fas fa-${type === 'success' ? 'check-circle' : type === 'error' ? 'exclamation-circle' : 'info-circle'}"></i>
            <span>${message}</span>
        </div>
    `;

    document.body.appendChild(toast);

    setTimeout(() => {
        toast.style.opacity = '0';
        setTimeout(() => toast.remove(), 300);
    }, 3000);
}

// Smart response system - instant static responses with optional AI enhancement
const smartResponses = {
    interview: {
        keywords: ['interview', 'question', 'ask', 'prepare'],
        response: `**Common Principal Interview Questions:**

• **Leadership Philosophy**: "Describe your leadership style and philosophy as a principal."

• **Change Management**: "Tell me about a time you implemented a significant change at your school."

• **Conflict Resolution**: "How do you handle conflict between staff members or with parents?"

• **Data-Driven**: "How do you use data to improve student outcomes?"

• **Teacher Development**: "Describe your approach to supporting and developing teachers."

**💡 Tip**: Use the **STAR method** for behavioral questions:
- **S**ituation: Set the context
- **T**ask: Explain your responsibility
- **A**ction: Describe what you did
- **R**esult: Share the outcome with metrics

Try our Interview Practice module for AI-scored feedback!`
    },
    resume: {
        keywords: ['resume', 'cv', 'write', 'summary', 'experience'],
        response: `**Resume Tips for Education Leaders:**

• **Strong Summary**: 3-5 sentences highlighting years of experience, key achievements, and leadership philosophy

• **Quantify Results**: Use numbers and metrics (e.g., "Improved graduation rates by 15%", "Led team of 50+ teachers")

• **Action Verbs**: Start bullets with: Led, Implemented, Developed, Achieved, Transformed

• **Leadership Focus**: Emphasize team building, change management, data-driven decisions

• **Education Section**: List highest degree first, include credential information

**📝 Try our Resume Builder** with pre-filled templates and AI suggestions!`
    },
    credentials: {
        keywords: ['credential', 'license', 'requirement', 'certification'],
        response: `**Administrative Services Credential (California):**

**Prerequisites:**
• Valid teaching credential
• 5+ years of successful teaching experience
• Bachelor's degree

**Program Requirements:**
• Complete approved credential program (university or district-based)
• Pass CPACE exam (California Preliminary Administrative Credential Examination)
• Complete leadership coursework and fieldwork

**Timeline**: Typically 1-2 years

**After Preliminary Credential:**
• Complete 2-year induction program
• Advance to Clear Administrative Services Credential

Visit the CTC website (ctc.ca.gov) for official requirements.`
    },
    leadership: {
        keywords: ['leadership', 'style', 'manage', 'lead'],
        response: `**Effective Leadership Styles for Principals:**

• **Instructional Leadership**: Focus on teaching and learning, classroom observations, professional development

• **Transformational**: Inspire and motivate, build shared vision, empower teachers

• **Distributed Leadership**: Share decision-making, build leadership capacity in others

• **Equity-Centered**: Prioritize closing opportunity gaps, culturally responsive practices

**Key Practices:**
- Build relationships and trust
- Communicate vision clearly
- Use data for decisions
- Support teacher growth
- Engage families and community

**Best Approach**: Adapt your style to context and needs!`
    },
    salary: {
        keywords: ['salary', 'pay', 'compensation', 'earn'],
        response: `**Education Leadership Salary Ranges (California):**

**Vice-Principal/Assistant Principal:**
• $90,000 - $130,000/year
• Varies by district size and location

**Principal:**
• Elementary: $110,000 - $150,000
• Middle School: $115,000 - $155,000
• High School: $120,000 - $170,000

**Superintendent:**
• Small District: $140,000 - $200,000
• Medium District: $180,000 - $250,000
• Large District: $220,000 - $350,000+

**Factors Affecting Salary:**
- District size and budget
- Location (urban vs rural)
- Experience level
- Additional responsibilities

Salaries typically higher in Bay Area, LA, San Diego.`
    },
    career: {
        keywords: ['career', 'path', 'become', 'transition', 'move'],
        response: `**Career Path to Principal:**

**Step 1: Teaching (5+ years)**
- Build classroom expertise
- Take on leadership roles (department chair, coach, committee lead)

**Step 2: Administrative Credential (1-2 years)**
- Enroll in credential program while teaching
- Complete coursework and fieldwork
- Pass CPACE exam

**Step 3: Entry Leadership Role**
- Assistant Principal or Dean position
- Gain experience with operations, discipline, scheduling

**Step 4: Principal**
- Apply for principal positions
- Typically need 2-3 years as AP
- Consider starting at smaller school

**Timeline**: 7-10 years from teacher to principal

**💡 Accelerate**: Take on leadership roles early, network with administrators, get a mentor!`
    }
};

// Get instant smart response based on keywords
function getSmartResponse(userMessage) {
    const messageLower = userMessage.toLowerCase();

    // Check each category for keyword matches
    for (const [category, data] of Object.entries(smartResponses)) {
        for (const keyword of data.keywords) {
            if (messageLower.includes(keyword)) {
                return data.response;
            }
        }
    }

    // Default helpful response
    return `I can help you with:

• **Interview preparation** - Common questions and STAR method
• **Resume writing** - Templates and tips for education leaders
• **Credentials** - Requirements for administrative credentials
• **Leadership styles** - Effective approaches for principals
• **Career paths** - Steps to become a principal or superintendent
• **Salary information** - Typical ranges for education leaders

What specific topic would you like to know more about?

*💡 You can also use our Resume Builder and Interview Practice tools!*`;
}

// Ask ChatGPT via API - Works both locally and on Vercel!
async function askOllama(prompt, conversationHistory = []) {
    try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 30000); // 30 second timeout

        // Use relative path so it works locally and on Vercel
        const apiUrl = window.location.hostname === 'localhost'
            ? 'http://localhost:5555/api/chat'  // Local development
            : '/api/chat';  // Production (Vercel)

        const response = await fetch(apiUrl, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                prompt: prompt,
                conversationHistory: conversationHistory
            }),
            signal: controller.signal
        });

        clearTimeout(timeoutId);

        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            throw new Error(`API error: ${response.status} - ${errorData.error || 'Unknown error'}`);
        }

        const data = await response.json();

        if (!data.response) {
            throw new Error('No response from AI');
        }

        return data.response;

    } catch (error) {
        console.error('ChatGPT API error:', error);

        // Fallback to smart response if server is down
        const smartResponse = getSmartResponse(prompt);
        showToast('Using instant response (ChatGPT unavailable)', 'info');
        return smartResponse;
    }
}

// Check if Ollama is available
async function checkOllamaStatus() {
    try {
        const response = await fetch('http://localhost:11434/api/version', {
            method: 'GET'
        });
        return response.ok;
    } catch (error) {
        return false;
    }
}

// Format text with line breaks and bullets
function formatAIResponse(text) {
    if (!text) return '';

    // Convert bullet points
    text = text.replace(/^\* /gm, '• ');
    text = text.replace(/^- /gm, '• ');

    // Convert numbered lists
    text = text.replace(/^(\d+)\. /gm, '$1. ');

    // Add line breaks for paragraphs
    text = text.replace(/\n\n/g, '<br><br>');
    text = text.replace(/\n/g, '<br>');

    return text;
}

// Save data to localStorage
function saveToStorage(key, data) {
    try {
        localStorage.setItem(key, JSON.stringify(data));
        return true;
    } catch (error) {
        console.error('Storage error:', error);
        showToast('Error saving data', 'error');
        return false;
    }
}

// Load data from localStorage
function loadFromStorage(key, defaultValue = null) {
    try {
        const data = localStorage.getItem(key);
        return data ? JSON.parse(data) : defaultValue;
    } catch (error) {
        console.error('Storage error:', error);
        return defaultValue;
    }
}

// Auto-save functionality
let autoSaveTimeout;
function setupAutoSave(key, getDataFn, interval = 30000) {
    if (autoSaveTimeout) clearInterval(autoSaveTimeout);

    autoSaveTimeout = setInterval(() => {
        const data = getDataFn();
        if (saveToStorage(key, data)) {
            console.log(`Auto-saved ${key}`);
        }
    }, interval);

    // Save on page unload
    window.addEventListener('beforeunload', () => {
        const data = getDataFn();
        saveToStorage(key, data);
    });
}

// Validate required fields
function validateForm(formId) {
    const form = document.getElementById(formId);
    if (!form) return false;

    const inputs = form.querySelectorAll('[required]');
    let isValid = true;

    inputs.forEach(input => {
        if (!input.value.trim()) {
            input.classList.add('border-red-500');
            isValid = false;
        } else {
            input.classList.remove('border-red-500');
        }
    });

    if (!isValid) {
        showToast('Please fill in all required fields', 'warning');
    }

    return isValid;
}

// Sanitize HTML to prevent XSS
function sanitizeHTML(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

// Generate unique ID
function generateId() {
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
}

// Format date for display
function formatDate(date) {
    if (!date) return '';
    const d = new Date(date);
    return d.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
}

// Scroll to bottom of element (for chat)
function scrollToBottom(elementId) {
    const element = document.getElementById(elementId);
    if (element) {
        element.scrollTop = element.scrollHeight;
    }
}

// Voice speech recognition setup
function setupSpeechRecognition(onResult, onError) {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;

    if (!SpeechRecognition) {
        showToast('Speech recognition not supported in this browser', 'error');
        return null;
    }

    const recognition = new SpeechRecognition();
    recognition.continuous = false;
    recognition.interimResults = false;
    recognition.lang = 'en-US';

    recognition.onresult = (event) => {
        const transcript = event.results[0][0].transcript;
        const confidence = event.results[0][0].confidence;

        if (confidence < 0.7) {
            showToast('Low confidence - Please speak more clearly', 'warning');
        }

        onResult(transcript, confidence);
    };

    recognition.onerror = (event) => {
        console.error('Speech recognition error:', event.error);
        if (onError) onError(event.error);
    };

    return recognition;
}

// Text-to-speech
function speak(text, rate = 1.0, pitch = 1.0) {
    if (!window.speechSynthesis) {
        showToast('Text-to-speech not supported in this browser', 'error');
        return;
    }

    // Cancel any ongoing speech
    window.speechSynthesis.cancel();

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = rate;
    utterance.pitch = pitch;

    // Use a good quality voice if available
    const voices = window.speechSynthesis.getVoices();
    const preferredVoice = voices.find(voice => voice.lang === 'en-US' && voice.name.includes('Google'));
    if (preferredVoice) {
        utterance.voice = preferredVoice;
    }

    window.speechSynthesis.speak(utterance);
}

// Stop speech
function stopSpeaking() {
    if (window.speechSynthesis) {
        window.speechSynthesis.cancel();
    }
}

// Export utilities
window.utils = {
    showSpinner,
    showToast,
    askOllama,
    checkOllamaStatus,
    formatAIResponse,
    saveToStorage,
    loadFromStorage,
    setupAutoSave,
    validateForm,
    sanitizeHTML,
    generateId,
    formatDate,
    scrollToBottom,
    setupSpeechRecognition,
    speak,
    stopSpeaking
};
