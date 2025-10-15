# 🚀 Quick Start Guide

Get the ACSA Education Leadership Prep Tool running in **5 minutes**!

## Step 1: Setup Ollama (for AI Features)

### Install Ollama
Visit **https://ollama.com** and download for your OS.

### Pull Llama 3 Model
```bash
ollama pull llama3
```

### Start Ollama Server
```bash
ollama serve
```

**Keep this terminal running!** The AI features need Ollama to be active.

### Verify Ollama is Working
Open in browser: `http://localhost:11434/api/version`

You should see version information. ✅

---

## Step 2: Start the App

### Navigate to Project
```bash
cd acsa-tool
```

### Start a Web Server

**Option A - Python (easiest)**
```bash
python -m http.server 8000
```

**Option B - Node.js**
```bash
npx http-server -p 8000
```

**Option C - VS Code**
- Install "Live Server" extension
- Right-click `index.html` → "Open with Live Server"

---

## Step 3: Open in Browser

Go to: **http://localhost:8000**

**Use Chrome for best experience** (especially for voice features)

---

## ✅ Test Each Feature

### 1. Home Chatbot
- Type a question like: "What are common principal interview questions?"
- Should get an AI response within a few seconds

### 2. Resume Builder
- Click "Resume" in navigation
- Select a template (Principal/Vice-Principal/Superintendent)
- Fill in personal info
- Try "Get AI Suggestions" for summary
- Download PDF

### 3. Interview Practice
- Click "Interview" in navigation
- Select role and level
- Generate questions
- Try voice recording (click microphone)
- Submit answer and review feedback

### 4. Career Chat
- Click "Career Chat" in navigation
- Try a quick question button
- Ask follow-up questions

### 5. Resources
- Click "Resources" in navigation
- Search for topics
- Filter by category

---

## 🐛 Troubleshooting

### AI Not Working?
```bash
# Check Ollama is running
ollama serve

# Verify model is installed
ollama list

# Should see "llama3" in the list
```

### Voice Not Working?
- Use **Chrome** browser
- Grant microphone permissions when prompted
- Try the "type instead" option as fallback

### Page Not Loading?
- Don't use `file://` protocol (must use web server)
- Check you're on `http://localhost:8000` not just opening the HTML file
- Try a different port: `python -m http.server 8001`

---

## 🎉 You're All Set!

The tool is now ready to help you prepare for your education leadership interview.

**Next Steps:**
1. Build your resume with a template
2. Practice 7 interview questions
3. Chat with the career advisor about your path
4. Explore the resources page

**Pro Tips:**
- Data auto-saves every 30 seconds
- Try voice input for realistic interview practice
- Use AI suggestions throughout for better content
- Check the main README.md for detailed documentation

---

## 📧 Need Help?

1. Check the full **README.md** for detailed troubleshooting
2. Verify browser console (F12 → Console) for errors
3. Ensure Ollama is running with `ollama serve`
4. Try Chrome for best compatibility

---

**Happy Interviewing! 🎓**
