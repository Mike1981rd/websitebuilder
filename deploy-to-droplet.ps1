# Deploy Hotel23 to DigitalOcean Droplet
# Server: 104.131.187.169

param(
    [Parameter(Mandatory=$true)]
    [string]$SSHKey,
    
    [Parameter(Mandatory=$false)]
    [string]$DBPassword = "your-production-db-password"
)

$ServerIP = "104.131.187.169"
$AppName = "hotel23"
$RemoteAppPath = "/var/www/$AppName"
$LocalPath = $PSScriptRoot

Write-Host "Starting deployment to $ServerIP..." -ForegroundColor Green

# Build the application
Write-Host "Building the application..." -ForegroundColor Yellow
dotnet publish -c Release -o ./publish

if ($LASTEXITCODE -ne 0) {
    Write-Host "Build failed!" -ForegroundColor Red
    exit 1
}

# Create deployment package
Write-Host "Creating deployment package..." -ForegroundColor Yellow
$publishPath = Join-Path $LocalPath "publish"
$zipPath = Join-Path $LocalPath "hotel23-deploy.zip"

if (Test-Path $zipPath) {
    Remove-Item $zipPath
}

Compress-Archive -Path "$publishPath/*" -DestinationPath $zipPath

# Copy to server
Write-Host "Copying files to server..." -ForegroundColor Yellow
scp -i $SSHKey $zipPath root@${ServerIP}:/tmp/

# Deploy on server
Write-Host "Deploying on server..." -ForegroundColor Yellow
$deployScript = @"
#!/bin/bash
set -e

echo 'Creating application directory...'
mkdir -p $RemoteAppPath

echo 'Stopping existing service...'
systemctl stop $AppName || true

echo 'Extracting files...'
cd $RemoteAppPath
rm -rf *
unzip /tmp/hotel23-deploy.zip

echo 'Setting permissions...'
chmod +x Hotel

echo 'Cleaning up...'
rm /tmp/hotel23-deploy.zip

echo 'Starting service...'
systemctl start $AppName || echo 'Service not configured yet'

echo 'Deployment complete!'
"@

# Save deploy script locally and copy to server
$deployScriptPath = Join-Path $LocalPath "remote-deploy.sh"
$deployScript | Out-File -FilePath $deployScriptPath -Encoding UTF8 -NoNewline

# Execute deployment
ssh -i $SSHKey root@$ServerIP 'bash -s' < $deployScriptPath

# Cleanup
Remove-Item $zipPath
Remove-Item $deployScriptPath

Write-Host "Deployment completed successfully!" -ForegroundColor Green
Write-Host "Next steps:" -ForegroundColor Yellow
Write-Host "1. Configure the database connection string on the server" -ForegroundColor White
Write-Host "2. Set up the systemd service if not already done" -ForegroundColor White
Write-Host "3. Configure Nginx if not already done" -ForegroundColor White