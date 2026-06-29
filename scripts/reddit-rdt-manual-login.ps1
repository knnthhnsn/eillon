# Manual Reddit login for rdt-cli (Windows — when rdt login can't read Chrome cookies)
#
# Why: Chrome 127+ encrypts cookies; CLI tools often fail with "No Reddit cookies found"
# even when you are logged in. The js_challenge URL in your address bar is normal after
# Reddit's bot check — it does not mean you are logged out.

$cfgDir = Join-Path $env:USERPROFILE ".config\rdt-cli"
$credFile = Join-Path $cfgDir "credential.json"
New-Item -ItemType Directory -Force -Path $cfgDir | Out-Null

Write-Host @"

=== Reddit manual login for Agent-Reach / rdt-cli ===

1. In Chrome, stay logged in at https://www.reddit.com
2. Install Cookie-Editor (one time):
   https://chromewebstore.google.com/detail/cookie-editor/hlkenndednhfkekhgcdicdfddnkalmdm
3. On reddit.com, click Cookie-Editor icon
4. Search for cookie name: reddit_session
5. Copy the VALUE (long string) — not the name

"@ -ForegroundColor Cyan

$session = Read-Host "Paste reddit_session VALUE here"
$session = $session.Trim().Trim('"')
if (-not $session) {
  Write-Host "No value entered. Aborting." -ForegroundColor Red
  exit 1
}

$username = Read-Host "Your Reddit username (optional, press Enter to skip)"
$username = $username.Trim()

$cred = @{
  cookies = @{ reddit_session = $session }
  source = "manual"
  username = if ($username) { $username } else { $null }
  modhash = $null
  saved_at = [int][double]::Parse((Get-Date -UFormat %s))
  last_verified_at = $null
}

$json = $cred | ConvertTo-Json -Depth 4 -Compress:$false
[System.IO.File]::WriteAllText($credFile, $json, [System.Text.UTF8Encoding]::new($false))
Write-Host "`nWrote $credFile (UTF-8, no BOM)" -ForegroundColor Green

$env:Path += ";C:\Users\kenne\AppData\Roaming\Python\Python313\Scripts"
Write-Host "`nVerifying..." -ForegroundColor Cyan
rdt status --json
Write-Host "`nIf authenticated is true, run: agent-reach doctor" -ForegroundColor Yellow
