#!/bin/bash
# Setup script for Hotel23 on Ubuntu server
# Run this script as root on the droplet

set -e

echo "=== Hotel23 Server Setup Script ==="
echo "Server IP: 104.131.187.169"
echo ""

# Update system
echo "📦 Updating system packages..."
apt update && apt upgrade -y

# Install PostgreSQL
echo "🗄️ Installing PostgreSQL..."
apt install -y postgresql postgresql-contrib

# Configure PostgreSQL
echo "🔧 Configuring PostgreSQL..."
sudo -u postgres psql <<EOF
CREATE DATABASE Hotel;
CREATE USER hoteluser WITH ENCRYPTED PASSWORD 'CHANGE_THIS_PASSWORD';
GRANT ALL PRIVILEGES ON DATABASE Hotel TO hoteluser;
\q
EOF

# Configure PostgreSQL to accept local connections
echo "host    all             all             127.0.0.1/32            md5" >> /etc/postgresql/*/main/pg_hba.conf
systemctl restart postgresql

# Create application directory
echo "📁 Creating application directory..."
mkdir -p /var/www/hotel23
chown -R www-data:www-data /var/www/hotel23

# Copy systemd service file
echo "⚙️ Setting up systemd service..."
cat > /etc/systemd/system/hotel23.service <<'EOL'
[Unit]
Description=Hotel23 ASP.NET Core Application
After=network.target

[Service]
Type=simple
User=www-data
WorkingDirectory=/var/www/hotel23
ExecStart=/var/www/hotel23/Hotel
Restart=always
RestartSec=10
SyslogIdentifier=hotel23

Environment="ASPNETCORE_ENVIRONMENT=Production"
Environment="DOTNET_PRINT_TELEMETRY_MESSAGE=false"

LimitNOFILE=100000
PrivateTmp=true
NoNewPrivileges=true

[Install]
WantedBy=multi-user.target
EOL

systemctl daemon-reload
systemctl enable hotel23

# Configure Nginx
echo "🌐 Configuring Nginx..."
cat > /etc/nginx/sites-available/hotel23 <<'EOL'
server {
    listen 80;
    listen [::]:80;
    server_name 104.131.187.169;
    
    client_max_body_size 100M;
    client_body_buffer_size 10M;
    
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header X-XSS-Protection "1; mode=block" always;
    
    location / {
        proxy_pass http://localhost:5000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection keep-alive;
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_set_header X-Real-IP $remote_addr;
        
        proxy_connect_timeout 60s;
        proxy_send_timeout 60s;
        proxy_read_timeout 60s;
    }
    
    location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg|woff|woff2|ttf|eot)$ {
        proxy_pass http://localhost:5000;
        proxy_http_version 1.1;
        proxy_set_header Host $host;
        expires 30d;
        add_header Cache-Control "public, immutable";
    }
    
    location /health {
        access_log off;
        proxy_pass http://localhost:5000;
        proxy_http_version 1.1;
        proxy_set_header Host $host;
    }
}
EOL

# Enable the site
ln -sf /etc/nginx/sites-available/hotel23 /etc/nginx/sites-enabled/
rm -f /etc/nginx/sites-enabled/default
nginx -t && systemctl restart nginx

# Configure firewall
echo "🔥 Configuring firewall..."
ufw allow 22/tcp
ufw allow 80/tcp
ufw allow 443/tcp
ufw --force enable

echo ""
echo "✅ Server setup complete!"
echo ""
echo "⚠️  IMPORTANT NEXT STEPS:"
echo "1. Change the PostgreSQL password:"
echo "   sudo -u postgres psql -c \"ALTER USER hoteluser PASSWORD 'your-secure-password';\""
echo ""
echo "2. Update the connection string in appsettings.Production.json with the new password"
echo ""
echo "3. Deploy your application using deploy-to-droplet.ps1"
echo ""
echo "4. Run database migrations on the server:"
echo "   cd /var/www/hotel23"
echo "   dotnet Hotel.dll migrate"
echo ""
echo "5. Consider setting up SSL with Let's Encrypt:"
echo "   apt install certbot python3-certbot-nginx"
echo "   certbot --nginx -d yourdomain.com"