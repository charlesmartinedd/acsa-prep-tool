# ACSA Education Leadership Prep Tool

A comprehensive, interactive web application designed to help ACSA (Association of California School Administrators) members prepare for education leadership roles including Principal, Vice-Principal, and Superintendent positions.

![Version](https://img.shields.io/badge/version-2.0.0-blue.svg)
![Status](https://img.shields.io/badge/status-production--ready-green.svg)

## 🌟 Features

### 1. **Home Page with AI Chatbot**
- Beautiful, minimal chatbot widget for quick questions
- Context-aware responses about interviews, resumes, and leadership
- Feedback system for continuous improvement
- Fully responsive design

### 2. **Resume Builder**
- **Pre-filled Templates**: Choose from Principal, Vice-Principal, or Superintendent templates
- **AI-Powered Suggestions**:
  - Auto-generate professional summaries
  - Get tailored skill suggestions
  - Generate achievement bullets for experience sections
- **Live Preview**: See changes in real-time with professional formatting
- **Drag & Drop**: Reorder sections with SortableJS
- **PDF Export**: Download beautiful, formatted PDFs with jsPDF
- **Auto-save**: Progress saved to localStorage every 30 seconds

### 3. **Interview Practice Module**
- **Role & Level Selection**: Customize questions based on your target role
- **AI Question Generation**: 7 tailored questions (behavioral, leadership, scenario-based)
- **Voice Input**: Record answers with speech recognition (Web Speech API)
  - Confidence tracking
  - 60-second recording limit
  - Text input fallback
- **AI Feedback & Scoring**:
  - Detailed feedback on each answer
  - 1-10 scoring on clarity, relevance, and leadership
  - STAR method evaluation
  - Generative follow-up questions
- **Progress Tracking**: Visual progress bar and session resume
- **Summary Report**:
  - Overall score calculation
  - Question-by-question breakdown
  - Improvement tips
  - Retry weak questions (score < 7)
  - Download summary as text file

### 4. **Career Advisor Chatbot**
- Dedicated chat interface for in-depth career guidance
- Quick question buttons for common topics
- Voice input option
- Conversation history with context awareness
- Topics covered:
  - Career path planning
  - Credential requirements
  - Leadership development
  - Salary expectations
  - Interview and resume advice

### 5. **Resources Page**
- 18+ curated resources across 5 categories:
  - Credentials & Licensing
  - Professional Organizations
  - Leadership Development
  - Interview Preparation
  - Books & Publications
- Search and filter functionality
- Interactive cards with hover effects
- Direct links to official sources

## 🎨 Design Features (2025 UI/UX Trends)

- **Dynamic Minimalism**: Clean, adaptive interfaces with generous white space
- **Functional AI**: Interfaces that explain, adapt, and guide users
- **Soothing Colors**: Navy gradients with soft whites for calm professionalism
- **Bold Typography**: Roboto font family for clear hierarchy
- **Personalized Elements**: Adaptive chat responses and contextual suggestions
- **Smooth Animations**: Fade-ins, hover effects, and transitions
- **Mobile Responsive**: Works beautifully on all screen sizes

## 🚀 Quick Start

### Prerequisites

1. **Ollama with Llama 3** (for AI features)
   ```bash
   # Install Ollama from https://ollama.com

   # Pull Llama 3 model
   ollama pull llama3

   # Start Ollama server
   ollama serve
   ```

2. **Modern Web Browser** (Chrome, Firefox, Edge, Safari)
   - For voice features, Chrome is recommended

### Installation

1. **Extract or Clone the Project**
   ```bash
   cd acsa-tool
   ```

2. **Start a Local Web Server**

   Option A - Python:
   ```bash
   # Python 3
   python -m http.server 8000

   # Python 2
   python -m SimpleHTTPServer 8000
   ```

   Option B - Node.js:
   ```bash
   npx http-server -p 8000
   ```

   Option C - VS Code Live Server extension

3. **Open in Browser**
   ```
   http://localhost:8000
   ```

4. **Verify Ollama is Running**
   - Check that the chatbot responds (may show offline warning if not)
   - Verify at: `http://localhost:11434/api/version`

## 📁 Project Structure

```
acsa-tool/
├── index.html              # Home page with embedded chatbot
├── resume.html             # Resume builder
├── interview.html          # Interview practice module
├── career-chat.html        # Career advisor chatbot
├── resources.html          # Resources page
├── js/
│   ├── utils.js           # Shared utilities (AI, storage, voice, etc.)
│   ├── home-chat.js       # Home page chatbot logic
│   ├── resume.js          # Resume builder logic
│   ├── interview.js       # Interview practice logic
│   ├── career-chat.js     # Career chat logic
│   └── resources.js       # Resources page logic
├── css/                   # (Tailwind via CDN)
└── README.md              # This file
```

## 🔧 Technologies Used

### Frontend
- **HTML5** + **Vanilla JavaScript**: Fast, no build step required
- **Tailwind CSS** (via CDN): Modern, utility-first styling
- **Google Fonts**: Roboto for professional typography
- **Font Awesome**: Beautiful icons

### Libraries (via CDN)
- **SortableJS**: Drag-and-drop functionality
- **jsPDF**: PDF generation for resumes

### AI & APIs
- **Ollama** + **Llama 3**: Local, private AI (free)
  - API endpoint: `http://localhost:11434/api/generate`
- **Web Speech API**: Voice recognition and text-to-speech (built into browsers)

### Storage
- **localStorage**: Client-side data persistence
- **Auto-save**: Every 30 seconds for resume and interviews

## 🎯 Usage Guide

### Resume Builder
1. **Select a Template**: Choose Principal, Vice-Principal, or Superintendent
2. **Fill in Details**: Complete all sections (auto-saves every 30s)
3. **Get AI Suggestions**:
   - Summary: Click "Get AI Suggestions" for professional summaries
   - Skills: Click "Get AI Suggestions" for relevant skills
   - Experience Bullets: Click "AI Suggest" on any experience section
4. **Reorder Sections**: Drag the grip icons to reorder items
5. **Preview**: Check the live preview on the right
6. **Download PDF**: Click "Download PDF" when ready

### Interview Practice
1. **Setup**: Select your role and experience level
2. **Generate Questions**: Click "Generate Questions & Start Interview"
3. **Answer Questions**:
   - **Voice**: Click microphone, speak for up to 60 seconds
   - **Text**: Toggle to "type instead" and use text input
4. **Review Feedback**: Read AI feedback and your score (1-10)
5. **Follow-up** (optional): Answer the follow-up question for deeper practice
6. **Repeat**: Continue through all 7 questions
7. **Summary**: Review your performance, retry weak questions, or download summary

### Career Chat
1. **Ask Questions**: Type or use voice input
2. **Quick Questions**: Click pre-defined buttons for common topics
3. **Follow-up**: Continue the conversation for more detailed guidance
4. **Clear History**: Reset the conversation anytime

### Resources
1. **Browse**: Scroll through curated resources
2. **Search**: Use the search bar for keywords
3. **Filter**: Select a category from the dropdown
4. **Learn More**: Click cards to visit official sources

## ⚙️ Configuration

### AI Settings (in `js/utils.js`)

```javascript
// Ollama API endpoint
const OLLAMA_URL = 'http://localhost:11434/api/generate';

// Request timeout (ms)
const AI_TIMEOUT = 10000;

// Model name
const AI_MODEL = 'llama3';
```

### Voice Settings

```javascript
// Recording timeout (interview.js)
const RECORDING_TIMEOUT = 60000; // 60 seconds

// Speech recognition language
recognition.lang = 'en-US';
```

## 🐛 Troubleshooting

### AI Features Not Working

**Problem**: Chatbot shows "AI offline" message

**Solutions**:
1. Verify Ollama is installed and running:
   ```bash
   ollama serve
   ```
2. Check Ollama is accessible:
   ```bash
   curl http://localhost:11434/api/version
   ```
3. Ensure Llama 3 model is pulled:
   ```bash
   ollama pull llama3
   ```
4. Check browser console for errors (F12 → Console)

### Voice Features Not Working

**Problem**: Microphone button doesn't work

**Solutions**:
1. Use Chrome (best support for Web Speech API)
2. Grant microphone permissions when prompted
3. Check browser settings → Privacy & Security → Microphone
4. Try HTTPS (some browsers require secure context)
5. Use text input fallback instead

### PDF Export Issues

**Problem**: PDF doesn't download or looks incorrect

**Solutions**:
1. Check browser console for jsPDF errors
2. Verify jsPDF loaded: Check Network tab (F12)
3. Try a different browser
4. Ensure resume has content before exporting

### Data Not Saving

**Problem**: Progress lost on page refresh

**Solutions**:
1. Check localStorage is enabled (not in private/incognito mode)
2. Browser console: `localStorage.getItem('resume_data')`
3. Clear corrupted data: `localStorage.clear()` and restart
4. Check browser storage settings

### CORS Errors

**Problem**: "Access to fetch has been blocked by CORS policy"

**Solutions**:
1. Use a proper local server (not `file://` protocol)
2. Python: `python -m http.server 8000`
3. Node: `npx http-server -p 8000`
4. VS Code: Install "Live Server" extension

## 📊 Browser Compatibility

| Feature | Chrome | Firefox | Edge | Safari |
|---------|--------|---------|------|--------|
| Core App | ✅ | ✅ | ✅ | ✅ |
| Voice Input | ✅ | ⚠️ | ✅ | ⚠️ |
| Voice Output | ✅ | ✅ | ✅ | ✅ |
| PDF Export | ✅ | ✅ | ✅ | ✅ |
| Drag & Drop | ✅ | ✅ | ✅ | ✅ |

✅ Full support | ⚠️ Limited support

**Recommendation**: Use **Chrome** for the best experience, especially for voice features.

## 🔒 Privacy & Security

- **Local AI**: All AI processing happens locally via Ollama (no data sent to external servers)
- **localStorage**: Data stored only in your browser
- **No Account Required**: No sign-up or personal data collection
- **No Tracking**: No analytics or tracking cookies
- **Open Source**: All code is visible and auditable

## 🎓 Educational Use

This tool is designed for:
- ACSA members preparing for leadership interviews
- Aspiring principals and administrators
- Current educators exploring leadership roles
- Education leadership credential programs

**Note**: This is a practice tool. Always verify credential requirements and interview strategies with official sources and mentors.

## 🚀 Future Enhancements

Potential features for future versions:
- [ ] Backend database for cross-device sync
- [ ] User accounts and progress tracking
- [ ] Video interview practice with webcam
- [ ] Cover letter generator
- [ ] Mock interview scheduling with real administrators
- [ ] District-specific question banks
- [ ] Mobile app versions (iOS/Android)

## 📝 License

This project is created for educational purposes for ACSA members.

## 🙏 Acknowledgments

- **ACSA** - Association of California School Administrators
- **Ollama** - Local AI inference
- **Tailwind CSS** - Utility-first CSS framework
- **Font Awesome** - Icon library
- **SortableJS** - Drag-and-drop library
- **jsPDF** - PDF generation

## 📞 Support

For issues or questions:
1. Check this README troubleshooting section
2. Review browser console for errors (F12 → Console)
3. Verify Ollama setup: `ollama serve` and `ollama pull llama3`
4. Test in Chrome for best compatibility

---

**Built with ❤️ for Education Leaders**

*Version 2.0.0 - January 2025*

## Version 2.0.0 Release Notes

**Major Update: Enhanced AI Accuracy and Constraint System**

- ✅ **Temperature reduced from 0.7 to 0.0** - Eliminates AI hallucinations and creative responses
- ✅ **Interview Feedback** - Now evaluates only actual candidate responses, no assumptions
- ✅ **Resume Summary** - Uses only data from user's resume, no invented content
- ✅ **Resume Bullets** - Provides templates with placeholders instead of fictional achievements
- ✅ **Skills Suggestions** - Limited to standard, commonly-required skills only
- ✅ **Interview Questions** - Generates only commonly-asked, realistic questions
- ✅ **Chat Systems** - Enhanced with strict factual constraints
- ✅ **All AI prompts** - Updated with "IMPORTANT CONSTRAINTS" sections to prevent hallucinations

This version prioritizes **accuracy and factuality** over creativity, ensuring users receive reliable, trustworthy guidance based on real data and established practices.
