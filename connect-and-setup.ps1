# PowerShell script to connect to DigitalOcean droplet and setup ASP.NET Core

$dropletIP = "104.131.187.169"
$username = "root"
$localSetupScript = "setup-droplet.sh"
$remoteSetupScript = "/root/setup-droplet.sh"

Write-Host "=========================================" -ForegroundColor Green
Write-Host "DigitalOcean Droplet Setup for ASP.NET Core" -ForegroundColor Green
Write-Host "=========================================" -ForegroundColor Green

Write-Host "`nThis script will:"
Write-Host "1. Copy the setup script to your droplet"
Write-Host "2. Connect you to the droplet via SSH"
Write-Host "3. You'll need to run the setup script manually"

Write-Host "`nPress any key to continue..." -ForegroundColor Yellow
$null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")

# Copy setup script to droplet using SCP
Write-Host "`nCopying setup script to droplet..." -ForegroundColor Cyan
Write-Host "You'll be prompted for the root password (AllisoN@1710.#M)" -ForegroundColor Yellow

# Use pscp if available, otherwise use scp
$scpCommand = "scp"
if (Get-Command pscp -ErrorAction SilentlyContinue) {
    $scpCommand = "pscp"
}

& $scpCommand $localSetupScript "${username}@${dropletIP}:${remoteSetupScript}"

if ($LASTEXITCODE -eq 0) {
    Write-Host "`nSetup script copied successfully!" -ForegroundColor Green
    
    Write-Host "`nNow connecting to your droplet..." -ForegroundColor Cyan
    Write-Host "Once connected, run these commands:" -ForegroundColor Yellow
    Write-Host "  chmod +x setup-droplet.sh" -ForegroundColor White
    Write-Host "  ./setup-droplet.sh" -ForegroundColor White
    Write-Host "`nPassword: AllisoN@1710.#M" -ForegroundColor Yellow
    
    # Connect via SSH
    ssh "${username}@${dropletIP}"
} else {
    Write-Host "`nFailed to copy setup script. Please check your connection." -ForegroundColor Red
    Write-Host "You can manually connect using: ssh root@104.131.187.169" -ForegroundColor Yellow
}