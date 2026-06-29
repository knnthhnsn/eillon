# Agent-Reach — finish login (run after signing in to Reddit/X in browser)

# 1. Log in in the browser tabs that opened (Reddit + X), then run this script:

$env:Path += ";C:\Users\kenne\AppData\Roaming\Python\Python313\Scripts"

Write-Host "`n=== Step 1: Import cookies from Chrome (use edge if you use Edge) ===" -ForegroundColor Cyan
Write-Host "Make sure you are logged into Reddit and X in Chrome first.`n"

agent-reach configure --from-browser chrome

Write-Host "`n=== Step 2: Optional Reddit CLI login (if Reddit still blocked) ===" -ForegroundColor Cyan
Write-Host "Run manually if needed: rdt login`n"

Write-Host "=== Step 3: Verify ===" -ForegroundColor Cyan
agent-reach doctor

Write-Host "`nDone. Daily Growth Compass can use Reddit/YouTube/web search for demand research." -ForegroundColor Green
