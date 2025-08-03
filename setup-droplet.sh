#!/bin/bash

# ASP.NET Core Setup Script for Ubuntu/Debian
# This script will configure your DigitalOcean droplet for ASP.NET Core

echo "========================================="
echo "ASP.NET Core Setup Script for Ubuntu"
echo "========================================="

# Update system packages
echo "1. Updating system packages..."
apt-get update && apt-get upgrade -y

# Install required dependencies
echo "2. Installing required dependencies..."
apt-get install -y wget apt-transport-https software-properties-common

# Add Microsoft package repository
echo "3. Adding Microsoft package repository..."
wget https://packages.microsoft.com/config/ubuntu/$(lsb_release -rs)/packages-microsoft-prod.deb -O packages-microsoft-prod.deb
dpkg -i packages-microsoft-prod.deb
rm packages-microsoft-prod.deb

# Update package list with Microsoft packages
apt-get update

# Install .NET 8 SDK and Runtime
echo "4. Installing .NET 8 SDK and Runtime..."
apt-get install -y dotnet-sdk-8.0
apt-get install -y aspnetcore-runtime-8.0

# Install Nginx for reverse proxy
echo "5. Installing Nginx..."
apt-get install -y nginx

# Install UFW firewall
echo "6. Configuring firewall..."
apt-get install -y ufw
ufw allow 22/tcp  # SSH
ufw allow 80/tcp  # HTTP
ufw allow 443/tcp # HTTPS
ufw --force enable

# Create directory for ASP.NET Core apps
echo "7. Creating directory for ASP.NET Core applications..."
mkdir -p /var/www/aspnetcore
chown -R www-data:www-data /var/www/aspnetcore

# Create a sample systemd service file template
echo "8. Creating systemd service template..."
cat > /etc/systemd/system/aspnetcore-app.service.template << 'EOF'
[Unit]
Description=ASP.NET Core Application
After=network.target

[Service]
WorkingDirectory=/var/www/aspnetcore/YOUR_APP_NAME
ExecStart=/usr/bin/dotnet /var/www/aspnetcore/YOUR_APP_NAME/YOUR_APP_NAME.dll
Restart=always
RestartSec=10
KillSignal=SIGINT
SyslogIdentifier=dotnet-YOUR_APP_NAME
User=www-data
Environment=ASPNETCORE_ENVIRONMENT=Production
Environment=DOTNET_PRINT_TELEMETRY_MESSAGE=false

[Install]
WantedBy=multi-user.target
EOF

# Create Nginx configuration template
echo "9. Creating Nginx configuration template..."
cat > /etc/nginx/sites-available/aspnetcore.template << 'EOF'
server {
    listen 80;
    server_name YOUR_DOMAIN;
    location / {
        proxy_pass http://localhost:5000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection keep-alive;
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
EOF

# Test .NET installation
echo "10. Testing .NET installation..."
dotnet --version

echo "========================================="
echo "Setup completed successfully!"
echo "========================================="
echo ""
echo "Next steps:"
echo "1. Upload your ASP.NET Core application to /var/www/aspnetcore/YOUR_APP_NAME"
echo "2. Copy and modify the systemd service template:"
echo "   cp /etc/systemd/system/aspnetcore-app.service.template /etc/systemd/system/YOUR_APP_NAME.service"
echo "3. Copy and modify the Nginx configuration:"
echo "   cp /etc/nginx/sites-available/aspnetcore.template /etc/nginx/sites-available/YOUR_APP_NAME"
echo "   ln -s /etc/nginx/sites-available/YOUR_APP_NAME /etc/nginx/sites-enabled/"
echo "4. Start your application:"
echo "   systemctl enable YOUR_APP_NAME.service"
echo "   systemctl start YOUR_APP_NAME.service"
echo "5. Restart Nginx:"
echo "   systemctl restart nginx"
echo ""
echo "Server Information:"
echo "- .NET Version: $(dotnet --version 2>/dev/null || echo 'Not installed yet')"
echo "- Server IP: 104.131.187.169"
echo "- Nginx Status: $(systemctl is-active nginx 2>/dev/null || echo 'Not installed yet')"