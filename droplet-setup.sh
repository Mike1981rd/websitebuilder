#!/bin/bash
# Complete setup script for Hotel23 on DigitalOcean Droplet
# Execute this directly on the droplet

set -e

# Configuration
APP_NAME="hotel23"
DB_NAME="Hotel"
DB_USER="hoteluser"
DB_PASS="Hotel23Secure2024!"
REMOTE_PATH="/var/www/$APP_NAME"

echo "🚀 Hotel23 Droplet Setup"
echo "========================"

# Step 1: Update system and install PostgreSQL
echo -e "\n📦 Installing PostgreSQL..."
apt update
apt install -y postgresql postgresql-contrib

# Step 2: Configure PostgreSQL
echo -e "\n🗄️ Configuring PostgreSQL..."
sudo -u postgres psql << EOF
CREATE DATABASE $DB_NAME;
CREATE USER $DB_USER WITH ENCRYPTED PASSWORD '$DB_PASS';
GRANT ALL PRIVILEGES ON DATABASE $DB_NAME TO $DB_USER;
\q
EOF

# Configure PostgreSQL authentication
PG_VERSION=$(ls /etc/postgresql/)
PG_CONFIG="/etc/postgresql/$PG_VERSION/main/pg_hba.conf"
if ! grep -q "127.0.0.1/32" $PG_CONFIG; then
    echo "host    all             all             127.0.0.1/32            md5" >> $PG_CONFIG
fi
systemctl restart postgresql

# Step 3: Create application directory
echo -e "\n📁 Creating application directory..."
mkdir -p $REMOTE_PATH
chown -R www-data:www-data $REMOTE_PATH

# Step 4: Create systemd service
echo -e "\n⚙️ Creating systemd service..."
cat > /etc/systemd/system/$APP_NAME.service << EOF
[Unit]
Description=Hotel23 ASP.NET Core Application
After=network.target

[Service]
Type=simple
User=www-data
WorkingDirectory=$REMOTE_PATH
ExecStart=$REMOTE_PATH/Hotel
Restart=always
RestartSec=10
SyslogIdentifier=$APP_NAME
Environment="ASPNETCORE_ENVIRONMENT=Production"
Environment="DOTNET_PRINT_TELEMETRY_MESSAGE=false"

[Install]
WantedBy=multi-user.target
EOF

systemctl daemon-reload
systemctl enable $APP_NAME

# Step 5: Configure Nginx
echo -e "\n🌐 Configuring Nginx..."
cat > /etc/nginx/sites-available/$APP_NAME << 'EOF'
server {
    listen 80;
    listen [::]:80;
    server_name _;
    
    client_max_body_size 100M;
    client_body_buffer_size 10M;
    
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
        expires 30d;
        add_header Cache-Control "public, immutable";
    }
}
EOF

ln -sf /etc/nginx/sites-available/$APP_NAME /etc/nginx/sites-enabled/
rm -f /etc/nginx/sites-enabled/default
nginx -t

# Step 6: Configure firewall
echo -e "\n🔥 Configuring firewall..."
ufw allow 22/tcp
ufw allow 80/tcp
ufw allow 443/tcp
echo "y" | ufw enable

# Step 7: Create deployment helper script
echo -e "\n📝 Creating deployment helper..."
cat > /usr/local/bin/deploy-hotel23 << 'EOF'
#!/bin/bash
# Helper script to deploy updates

if [ -z "$1" ]; then
    echo "Usage: deploy-hotel23 /path/to/archive.tar.gz"
    exit 1
fi

ARCHIVE=$1
APP_PATH=/var/www/hotel23

echo "Stopping application..."
systemctl stop hotel23

echo "Extracting new version..."
cd $APP_PATH
rm -rf *
tar -xzf $ARCHIVE

echo "Setting permissions..."
chmod +x Hotel
chown -R www-data:www-data .

echo "Starting application..."
systemctl start hotel23
systemctl restart nginx

echo "Deployment complete!"
systemctl status hotel23 --no-pager
EOF

chmod +x /usr/local/bin/deploy-hotel23

echo -e "\n✅ Server setup complete!"
echo -e "\n📋 Next steps:"
echo "1. Upload your application to /tmp/hotel23.tar.gz"
echo "2. Run: deploy-hotel23 /tmp/hotel23.tar.gz"
echo "3. Access your application at http://$(curl -s ifconfig.me)"
echo -e "\n🔧 Useful commands:"
echo "  - systemctl status hotel23"
echo "  - journalctl -u hotel23 -f"
echo "  - systemctl restart hotel23"