# 🚀 Deployment Guide

## Deploy to Vercel (Recommended - FREE!)

### Step 1: Create GitHub Account (if needed)
1. Go to https://github.com
2. Sign up for free account

### Step 2: Deploy to Vercel
1. Go to https://vercel.com
2. Click "Sign Up" and use your GitHub account
3. Click "Import Project"
4. Select "Import Git Repository"
5. Paste your GitHub repo URL: `https://github.com/YOUR_USERNAME/acsa-prep-tool`
6. Click "Import"

### Step 3: Configure Environment Variables
**CRITICAL**: Add your OpenAI API key as an environment variable:

1. In Vercel project settings, go to "Environment Variables"
2. Add new variable:
   - **Name**: `OPENAI_API_KEY`
   - **Value**: `sk-proj-your-actual-key-here`
   - **Environment**: Production, Preview, Development (select all)
3. Click "Save"

### Step 4: Deploy
1. Click "Deploy"
2. Wait 1-2 minutes for build
3. Your site will be live at: `https://your-project-name.vercel.app`

### Step 5: Share with Your Wife! 🎉
Send her the Vercel URL and she can use it anywhere, anytime!

---

## Local Development

### Prerequisites
- Node.js installed
- Your OpenAI API key

### Setup
```bash
# Install dependencies
npm install

# Create .env file
cp .env.example .env

# Add your API key to .env file
# OPENAI_API_KEY=sk-your-key-here

# Start development server (for testing the serverless function locally)
npm start

# In another terminal, start web server
python -m http.server 8000
```

---

## 🔒 Security Notes

**NEVER commit your `.env` file or API key to Git!**

The `.gitignore` file protects you, but double-check:
- API key should ONLY be in Vercel environment variables
- Never share your API key publicly
- Regenerate key if it's ever exposed

---

## 💡 Free Tier Limits

**Vercel**:
- Unlimited bandwidth
- 100 GB-hours serverless function execution per month
- Automatic HTTPS
- Free custom domain support

**OpenAI (ChatGPT API)**:
- Pay as you go (very cheap for personal use)
- ~$0.002 per 1000 tokens
- Typical conversation: $0.01-0.05
- Set spending limits at: https://platform.openai.com/account/billing/limits

---

## 🐛 Troubleshooting

**Issue**: API calls failing
- Check environment variable is set in Vercel
- Verify API key is valid at https://platform.openai.com
- Check browser console (F12) for errors

**Issue**: Site not loading
- Clear browser cache (Ctrl + Shift + R)
- Check Vercel deployment logs
- Verify all files were pushed to GitHub

---

**Questions?** Open an issue on GitHub!
