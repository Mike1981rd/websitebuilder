#!/bin/bash
# Auto-deployment script for Hotel23 on DigitalOcean Droplet
# This script performs all deployment steps automatically

set -e

DROPLET_IP="104.131.187.169"
APP_NAME="hotel23"
DB_NAME="Hotel"
DB_USER="hoteluser"
DB_PASS="Hotel23Secure2024!"
REMOTE_PATH="/var/www/$APP_NAME"

echo "🚀 Starting automatic deployment to $DROPLET_IP"

# Function to execute commands on the droplet
execute_remote() {
    ssh -o StrictHostKeyChecking=no root@$DROPLET_IP "$1"
}

# Function to copy files to the droplet
copy_to_remote() {
    scp -o StrictHostKeyChecking=no "$1" root@$DROPLET_IP:"$2"
}

echo "📦 Step 1: Installing PostgreSQL..."
execute_remote "apt update && apt install -y postgresql postgresql-contrib"

echo "🗄️ Step 2: Configuring PostgreSQL database..."
execute_remote "sudo -u postgres psql -c \"CREATE DATABASE $DB_NAME;\" || echo 'Database may already exist'"
execute_remote "sudo -u postgres psql -c \"CREATE USER $DB_USER WITH ENCRYPTED PASSWORD '$DB_PASS';\" || echo 'User may already exist'"
execute_remote "sudo -u postgres psql -c \"GRANT ALL PRIVILEGES ON DATABASE $DB_NAME TO $DB_USER;\""
execute_remote "echo 'host    all             all             127.0.0.1/32            md5' >> /etc/postgresql/*/main/pg_hba.conf"
execute_remote "systemctl restart postgresql"

echo "🔨 Step 3: Building application locally..."
cd /mnt/c/Users/hp/Documents/Visual Studio 2022/Projects/Hotel23
dotnet publish -c Release -o ./publish

echo "📤 Step 4: Uploading application to droplet..."
execute_remote "mkdir -p $REMOTE_PATH"
execute_remote "systemctl stop $APP_NAME || true"

# Create tar archive and upload
tar -czf hotel23-deploy.tar.gz -C ./publish .
copy_to_remote "hotel23-deploy.tar.gz" "/tmp/"
execute_remote "cd $REMOTE_PATH && tar -xzf /tmp/hotel23-deploy.tar.gz"
execute_remote "chmod +x $REMOTE_PATH/Hotel"
execute_remote "chown -R www-data:www-data $REMOTE_PATH"
rm hotel23-deploy.tar.gz

echo "⚙️ Step 5: Configuring systemd service..."
execute_remote "cat > /etc/systemd/system/$APP_NAME.service << 'EOF'
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
Environment=\"ASPNETCORE_ENVIRONMENT=Production\"
Environment=\"DOTNET_PRINT_TELEMETRY_MESSAGE=false\"
Environment=\"ConnectionStrings__DefaultConnection=Host=localhost;Database=$DB_NAME;Username=$DB_USER;Password=$DB_PASS\"

[Install]
WantedBy=multi-user.target
EOF"

execute_remote "systemctl daemon-reload"
execute_remote "systemctl enable $APP_NAME"

echo "🌐 Step 6: Configuring Nginx..."
execute_remote "cat > /etc/nginx/sites-available/$APP_NAME << 'EOF'
server {
    listen 80;
    listen [::]:80;
    server_name $DROPLET_IP;
    
    client_max_body_size 100M;
    
    location / {
        proxy_pass http://localhost:5000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade \$http_upgrade;
        proxy_set_header Connection keep-alive;
        proxy_set_header Host \$host;
        proxy_cache_bypass \$http_upgrade;
        proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto \$scheme;
    }
}
EOF"

execute_remote "ln -sf /etc/nginx/sites-available/$APP_NAME /etc/nginx/sites-enabled/"
execute_remote "rm -f /etc/nginx/sites-enabled/default"
execute_remote "nginx -t"

echo "🔥 Step 7: Configuring firewall..."
execute_remote "ufw allow 22/tcp && ufw allow 80/tcp && ufw allow 443/tcp && ufw --force enable"

echo "🚀 Step 8: Starting services..."
execute_remote "systemctl start $APP_NAME"
execute_remote "systemctl restart nginx"

echo "✅ Step 9: Verifying deployment..."
sleep 5
HTTP_STATUS=$(curl -s -o /dev/null -w "%{http_code}" http://$DROPLET_IP || echo "000")

if [ "$HTTP_STATUS" = "200" ] || [ "$HTTP_STATUS" = "302" ]; then
    echo "✅ Deployment successful! Application is running at http://$DROPLET_IP"
else
    echo "⚠️ Application returned HTTP status: $HTTP_STATUS"
    echo "Checking service status..."
    execute_remote "systemctl status $APP_NAME --no-pager"
fi

echo ""
echo "📋 Useful commands:"
echo "  Check logs: ssh root@$DROPLET_IP 'journalctl -u $APP_NAME -f'"
echo "  Restart app: ssh root@$DROPLET_IP 'systemctl restart $APP_NAME'"
echo "  Check status: ssh root@$DROPLET_IP 'systemctl status $APP_NAME'"