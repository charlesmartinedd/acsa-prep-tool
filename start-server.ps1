# Start ACSA Prep Tool Server with GPT-5
# This script ensures the correct OpenAI API key is used

Write-Host "============================================================" -ForegroundColor Cyan
Write-Host "🚀 Starting ACSA Prep Tool Server..." -ForegroundColor Cyan
Write-Host "============================================================`n" -ForegroundColor Cyan

# Read API key from .env file
$envFile = Get-Content .env
$apiKey = ($envFile | Where-Object { $_ -match 'OPENAI_API_KEY=(.+)' }) -replace 'OPENAI_API_KEY=', ''

if (-not $apiKey) {
    Write-Host "❌ ERROR: No API key found in .env file!" -ForegroundColor Red
    exit 1
}

Write-Host "✅ API Key loaded from .env file" -ForegroundColor Green
Write-Host "🤖 Model: GPT-5" -ForegroundColor Yellow
Write-Host "🌡️  Temperature: 1`n" -ForegroundColor Yellow

# Set environment variable for this session only
$env:OPENAI_API_KEY = $apiKey

# Start the server
Write-Host "Starting Node.js server on port 4000...`n" -ForegroundColor Green

node server.js
