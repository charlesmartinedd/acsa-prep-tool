# 🚀 Quick GitHub & Vercel Deployment

Your code is ready! Follow these **5 simple steps** to deploy:

---

## Step 1: Create GitHub Repository (2 minutes)

1. Go to: **https://github.com/new**
2. Fill in:
   - **Repository name**: `acsa-prep-tool`
   - **Description**: `AI-powered education leadership prep tool`
   - **Visibility**: Public
3. Click "**Create repository**"
4. **STOP** - Don't initialize with README (we already have files)

---

## Step 2: Push Your Code to GitHub (1 minute)

Copy and paste these commands **one at a time**:

```bash
cd /c/Users/MarieLexisDad/pai/projects/acsa-tool

git remote add origin https://github.com/YOUR_GITHUB_USERNAME/acsa-prep-tool.git

git push -u origin master
```

**Replace** `YOUR_GITHUB_USERNAME` with your actual GitHub username!

---

## Step 3: Deploy to Vercel (3 minutes)

1. Go to: **https://vercel.com/signup**
2. Click "**Continue with GitHub**"
3. Authorize Vercel to access your GitHub
4. On Vercel dashboard, click "**Add New**" → "**Project**"
5. Find `acsa-prep-tool` in the list
6. Click "**Import**"
7. Vercel will auto-detect settings - just click "**Deploy**"

---

## Step 4: Add Your API Key (CRITICAL!)

1. While deployment is running, click "**Environment Variables**" tab
2. Add new variable:
   - **Key**: `OPENAI_API_KEY`
   - **Value**: `your-openai-api-key-from-platform-openai-com`
   - **Environments**: Check all three boxes (Production, Preview, Development)
3. Click "**Save**"
4. Click "**Redeploy**" to apply the environment variable

---

## Step 5: Share with Your Wife! 🎉

1. Wait for deployment to finish (1-2 minutes)
2. Vercel will show you the live URL: `https://acsa-prep-tool.vercel.app`
3. Click the URL to test it
4. Send the link to your wife!

---

## ✅ What She Gets:

✨ **Beautiful AI-powered tool** with:
- Resume builder with professional templates
- Interview practice with real-time AI feedback
- Career advisor chatbot
- Voice input for realistic practice
- Resources for education leadership

📱 **Works everywhere**:
- Desktop, tablet, phone
- Any browser
- No installation needed
- Always up-to-date

---

## 🔒 Security Reminder

**IMPORTANT**: After you deploy, consider:
1. Rotating your OpenAI API key (generate a new one)
2. Setting usage limits at: https://platform.openai.com/account/billing/limits
3. The old key is still in `server.js` on your computer - that's fine, just don't commit it!

---

## 💰 Cost Estimate

**Vercel**: FREE (unlimited for personal use)

**OpenAI API**:
- Typical conversation: $0.01-0.05
- Resume suggestions: $0.02-0.03
- Interview practice (7 questions): $0.10-0.20
- **Monthly estimate** (moderate use): $2-5

Set spending limit at: https://platform.openai.com/account/billing/limits

---

## 🐛 Troubleshooting

**Problem**: "Requires authentication" when pushing to GitHub
- Solution: Run `git config --global user.name "Your Name"` and `git config --global user.email "your@email.com"`

**Problem**: API calls fail on deployed site
- Solution: Make sure you added `OPENAI_API_KEY` environment variable in Vercel and clicked "Redeploy"

**Problem**: Site loads but looks broken
- Solution: Hard refresh (Ctrl + Shift + R) to clear cache

---

## 🎓 You're Done!

Your wife can now:
1. Build her resume with AI help
2. Practice interviews with voice input
3. Get career guidance anytime
4. Access it from anywhere on any device

**Share the Vercel URL with her and make her day!** ❤️
