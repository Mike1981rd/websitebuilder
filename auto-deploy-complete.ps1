# Automatic deployment script for Hotel23
# This script uses SSH to execute all commands on the droplet

$ErrorActionPreference = "Stop"

$DropletIP = "104.131.187.169"
$AppName = "hotel23"
$DBName = "Hotel"
$DBUser = "hoteluser"
$DBPass = "Hotel23Secure2024!"
$RemotePath = "/var/www/$AppName"

Write-Host "🚀 Starting automatic deployment to $DropletIP" -ForegroundColor Green

# Function to execute SSH commands
function Execute-SSHCommand {
    param([string]$Command)
    ssh -o StrictHostKeyChecking=no root@$DropletIP $Command
    if ($LASTEXITCODE -ne 0) {
        Write-Host "Warning: Command may have encountered an issue" -ForegroundColor Yellow
    }
}

# Step 1: Install PostgreSQL
Write-Host "`n📦 Step 1: Installing PostgreSQL..." -ForegroundColor Yellow
Execute-SSHCommand "apt update; apt install -y postgresql postgresql-contrib unzip"

# Step 2: Configure PostgreSQL
Write-Host "`n🗄️ Step 2: Configuring PostgreSQL database..." -ForegroundColor Yellow
Execute-SSHCommand "sudo -u postgres psql -c \`"CREATE DATABASE $DBName;\`" 2>/dev/null"
Execute-SSHCommand "sudo -u postgres psql -c \`"CREATE USER $DBUser WITH ENCRYPTED PASSWORD '$DBPass';\`" 2>/dev/null"
Execute-SSHCommand "sudo -u postgres psql -c \`"GRANT ALL PRIVILEGES ON DATABASE $DBName TO $DBUser;\`""
Execute-SSHCommand "if ! grep -q '127.0.0.1/32' /etc/postgresql/*/main/pg_hba.conf; then echo 'host    all             all             127.0.0.1/32            md5' >> /etc/postgresql/*/main/pg_hba.conf; fi"
Execute-SSHCommand "systemctl restart postgresql"

# Step 3: Build application
Write-Host "`n🔨 Step 3: Building application locally..." -ForegroundColor Yellow
Push-Location $PSScriptRoot
dotnet publish -c Release -o ./publish

# Update production settings
$prodSettings = @{
    ConnectionStrings = @{
        DefaultConnection = "Host=localhost;Database=$DBName;Username=$DBUser;Password=$DBPass"
    }
    Logging = @{
        LogLevel = @{
            Default = "Warning"
            "Microsoft.AspNetCore" = "Warning"
        }
    }
    AllowedHosts = "*"
    Kestrel = @{
        Endpoints = @{
            Http = @{
                Url = "http://localhost:5000"
            }
        }
    }
} | ConvertTo-Json -Depth 10

$prodSettings | Out-File -FilePath "./publish/appsettings.Production.json" -Encoding UTF8

# Step 4: Upload application
Write-Host "`n📤 Step 4: Uploading application to droplet..." -ForegroundColor Yellow
Execute-SSHCommand "mkdir -p $RemotePath"
Execute-SSHCommand "systemctl stop $AppName 2>/dev/null"

# Create and upload archive
Write-Host "Creating deployment archive..." -ForegroundColor Gray
Compress-Archive -Path "./publish/*" -DestinationPath "./hotel23-deploy.zip" -Force

Write-Host "Uploading to server..." -ForegroundColor Gray
scp -o StrictHostKeyChecking=no ./hotel23-deploy.zip root@${DropletIP}:/tmp/

Write-Host "Extracting on server..." -ForegroundColor Gray
Execute-SSHCommand "cd $RemotePath; rm -rf *; unzip -o /tmp/hotel23-deploy.zip"
Execute-SSHCommand "chmod +x $RemotePath/Hotel"
Execute-SSHCommand "chown -R www-data:www-data $RemotePath"
Execute-SSHCommand "rm /tmp/hotel23-deploy.zip"

Remove-Item ./hotel23-deploy.zip

# Step 5: Configure systemd service
Write-Host "`n⚙️ Step 5: Configuring systemd service..." -ForegroundColor Yellow
$serviceContent = @"
[Unit]
Description=Hotel23 ASP.NET Core Application
After=network.target

[Service]
Type=simple
User=www-data
WorkingDirectory=$RemotePath
ExecStart=$RemotePath/Hotel
Restart=always
RestartSec=10
SyslogIdentifier=$AppName
Environment="ASPNETCORE_ENVIRONMENT=Production"
Environment="DOTNET_PRINT_TELEMETRY_MESSAGE=false"

[Install]
WantedBy=multi-user.target
"@

$serviceContent | ssh root@$DropletIP "cat > /etc/systemd/system/$AppName.service"
Execute-SSHCommand "systemctl daemon-reload"
Execute-SSHCommand "systemctl enable $AppName"

# Step 6: Configure Nginx
Write-Host "`n🌐 Step 6: Configuring Nginx..." -ForegroundColor Yellow
$nginxConfig = @"
server {
    listen 80;
    listen [::]:80;
    server_name $DropletIP;
    
    client_max_body_size 100M;
    
    location / {
        proxy_pass http://localhost:5000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade `$http_upgrade;
        proxy_set_header Connection keep-alive;
        proxy_set_header Host `$host;
        proxy_cache_bypass `$http_upgrade;
        proxy_set_header X-Forwarded-For `$proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto `$scheme;
    }
}
"@

$nginxConfig | ssh root@$DropletIP "cat > /etc/nginx/sites-available/$AppName"
Execute-SSHCommand "ln -sf /etc/nginx/sites-available/$AppName /etc/nginx/sites-enabled/"
Execute-SSHCommand "rm -f /etc/nginx/sites-enabled/default"
Execute-SSHCommand "nginx -t"

# Step 7: Configure firewall
Write-Host "`n🔥 Step 7: Configuring firewall..." -ForegroundColor Yellow
Execute-SSHCommand "ufw allow 22/tcp; ufw allow 80/tcp; ufw allow 443/tcp; echo 'y' | ufw enable"

# Step 8: Start services
Write-Host "`n🚀 Step 8: Starting services..." -ForegroundColor Yellow
Execute-SSHCommand "systemctl start $AppName"
Execute-SSHCommand "systemctl restart nginx"

# Step 9: Run migrations
Write-Host "`n🗃️ Step 9: Running database migrations..." -ForegroundColor Yellow
Execute-SSHCommand "cd $RemotePath; dotnet Hotel.dll --migrate 2>/dev/null"

# Step 10: Verify deployment
Write-Host "`n✅ Step 10: Verifying deployment..." -ForegroundColor Yellow
Start-Sleep -Seconds 5

try {
    $response = Invoke-WebRequest -Uri "http://$DropletIP" -UseBasicParsing -TimeoutSec 10
    if ($response.StatusCode -eq 200 -or $response.StatusCode -eq 302) {
        Write-Host "`n✅ Deployment successful!" -ForegroundColor Green
        Write-Host "🌐 Application is running at: http://$DropletIP" -ForegroundColor Cyan
    }
} catch {
    Write-Host "`n⚠️ Could not verify application status" -ForegroundColor Yellow
    Write-Host "Checking service status..." -ForegroundColor Yellow
    Execute-SSHCommand "systemctl status $AppName --no-pager | head -20"
}

Pop-Location

Write-Host "`n📋 Useful commands:" -ForegroundColor Cyan
Write-Host "  Check logs: ssh root@$DropletIP 'journalctl -u $AppName -f'" -ForegroundColor White
Write-Host "  Restart app: ssh root@$DropletIP 'systemctl restart $AppName'" -ForegroundColor White
Write-Host "  Check status: ssh root@$DropletIP 'systemctl status $AppName'" -ForegroundColor White
Write-Host "`nPress any key to exit..."
$null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")