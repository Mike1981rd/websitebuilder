# Script to check MCP configuration for Claude Desktop
Write-Host "🔍 Checking for Claude Desktop MCP Configuration" -ForegroundColor Cyan
Write-Host "================================================" -ForegroundColor Cyan

# Common paths to check
$paths = @(
    "$env:APPDATA\Claude\claude_desktop_config.json",
    "$env:LOCALAPPDATA\Claude\claude_desktop_config.json",
    "$env:USERPROFILE\.config\claude\claude_desktop_config.json",
    "$env:USERPROFILE\claude_desktop_config.json",
    "$env:APPDATA\claude-desktop\claude_desktop_config.json"
)

$found = $false

Write-Host "`n📁 Searching for configuration file..." -ForegroundColor Yellow

foreach ($path in $paths) {
    if (Test-Path $path) {
        $found = $true
        Write-Host "✅ Found configuration at: $path" -ForegroundColor Green
        Write-Host "`n📄 Configuration content:" -ForegroundColor Yellow
        Get-Content $path | Write-Host
        break
    }
}

if (-not $found) {
    Write-Host "❌ No claude_desktop_config.json found in common locations" -ForegroundColor Red
    
    Write-Host "`n🔍 Searching entire user profile..." -ForegroundColor Yellow
    $searchResult = Get-ChildItem -Path $env:USERPROFILE -Filter "claude_desktop_config.json" -Recurse -ErrorAction SilentlyContinue | Select-Object -First 1
    
    if ($searchResult) {
        Write-Host "✅ Found at: $($searchResult.FullName)" -ForegroundColor Green
        Write-Host "`n📄 Configuration content:" -ForegroundColor Yellow
        Get-Content $searchResult.FullName | Write-Host
    } else {
        Write-Host "❌ Configuration file not found anywhere" -ForegroundColor Red
        
        Write-Host "`n📝 To configure MCP for DigitalOcean:" -ForegroundColor Cyan
        Write-Host "1. Create file at: $env:APPDATA\Claude\claude_desktop_config.json" -ForegroundColor White
        Write-Host "2. Add the following configuration:" -ForegroundColor White
        
        $sampleConfig = @'
{
  "mcpServers": {
    "digitalocean": {
      "command": "npx",
      "args": [
        "-y",
        "@modelcontextprotocol/server-digitalocean"
      ],
      "env": {
        "DIGITALOCEAN_API_KEY": "your-api-key-here"
      }
    }
  }
}
'@
        Write-Host $sampleConfig -ForegroundColor Yellow
        
        Write-Host "`n3. Replace 'your-api-key-here' with your DigitalOcean API key" -ForegroundColor White
        Write-Host "4. Restart Claude Desktop" -ForegroundColor White
    }
}

Write-Host "`n🔧 Checking if MCP packages are installed..." -ForegroundColor Yellow
$npmList = npm list -g 2>$null | Select-String "modelcontextprotocol"
if ($npmList) {
    Write-Host "✅ Found MCP packages:" -ForegroundColor Green
    $npmList | ForEach-Object { Write-Host "   $_" }
} else {
    Write-Host "❌ No MCP packages found globally installed" -ForegroundColor Red
}

Write-Host "`nPress any key to exit..."
$null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")