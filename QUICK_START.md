# 🚀 Quick Start Guide

Get the ACSA Education Leadership Prep Tool running in **5 minutes**!

## Step 1: Configure OpenAI API (for AI Features)

### Get Your API Key
1. Visit **https://platform.openai.com/api-keys**
2. Sign in or create an account
3. Generate a new API key
4. Copy the key (starts with `sk-...`)

### Create .env File
In the project root, create a file named `.env`:
```bash
OPENAI_API_KEY=your-api-key-here
```

**Important:** Replace `your-api-key-here` with your actual API key.

### Verify Configuration
Make sure your `.env` file is in the root directory (same level as `index.html`).

✅ AI features will now work!

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
1. Verify `.env` file exists in project root
2. Check API key is correct (starts with `sk-...`)
3. Ensure you have OpenAI credits available
4. Check browser console (F12) for error messages
5. Verify API status at https://status.openai.com

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
3. Ensure your OpenAI API key is properly configured in `.env`
4. Try Chrome for best compatibility
5. Check OpenAI account has available credits

---

**Happy Interviewing! 🎓**
