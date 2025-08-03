# DigitalOcean Droplet Setup Guide for ASP.NET Core

## Connection Details
- **IP Address**: 104.131.187.169
- **Username**: root
- **Password**: AllisoN@1710.#M

## Quick Setup Instructions

### Option 1: Using PowerShell Script (Recommended)
1. Open PowerShell as Administrator
2. Navigate to your project directory:
   ```powershell
   cd "C:\Users\hp\Documents\Visual Studio 2022\Projects\Hotel23"
   ```
3. Run the setup script:
   ```powershell
   .\connect-and-setup.ps1
   ```

### Option 2: Manual Setup

1. **Connect to your droplet**:
   ```bash
   ssh root@104.131.187.169
   ```
   Password: AllisoN@1710.#M

2. **Once connected, create the setup script**:
   ```bash
   nano setup-droplet.sh
   ```
   Copy the contents from `setup-droplet.sh` file

3. **Make it executable and run**:
   ```bash
   chmod +x setup-droplet.sh
   ./setup-droplet.sh
   ```

## What the Setup Script Does

1. **Updates system packages**
2. **Installs .NET 8 SDK and Runtime**
3. **Installs Nginx** for reverse proxy
4. **Configures firewall** (UFW) with proper ports
5. **Creates directories** for ASP.NET Core apps
6. **Creates service templates** for systemd
7. **Creates Nginx configuration templates**

## Deploying Your Hotel Application

### 1. Publish your application:
```bash
dotnet publish -c Release -o ./publish
```

### 2. Copy files to droplet:
```bash
scp -r ./publish/* root@104.131.187.169:/var/www/aspnetcore/hotel/
```

### 3. Create systemd service:
```bash
ssh root@104.131.187.169
cp /etc/systemd/system/aspnetcore-app.service.template /etc/systemd/system/hotel.service
nano /etc/systemd/system/hotel.service
```

Update the service file:
- Replace `YOUR_APP_NAME` with `hotel`
- Replace `YOUR_APP_NAME.dll` with `Hotel.dll`

### 4. Configure Nginx:
```bash
cp /etc/nginx/sites-available/aspnetcore.template /etc/nginx/sites-available/hotel
nano /etc/nginx/sites-available/hotel
```

Update:
- Replace `YOUR_DOMAIN` with your domain or IP address

Enable the site:
```bash
ln -s /etc/nginx/sites-available/hotel /etc/nginx/sites-enabled/
nginx -t
systemctl restart nginx
```

### 5. Start your application:
```bash
systemctl enable hotel.service
systemctl start hotel.service
systemctl status hotel.service
```

## Troubleshooting

### Check application logs:
```bash
journalctl -u hotel.service -f
```

### Check Nginx logs:
```bash
tail -f /var/log/nginx/error.log
```

### Test .NET installation:
```bash
dotnet --info
```

### Check if your app is running:
```bash
curl http://localhost:5000
```

## Security Recommendations

1. **Change default SSH port** (optional):
   ```bash
   nano /etc/ssh/sshd_config
   # Change Port 22 to another port
   systemctl restart sshd
   ```

2. **Create a non-root user** for deployment:
   ```bash
   adduser deploy
   usermod -aG sudo deploy
   ```

3. **Enable SSL with Let's Encrypt**:
   ```bash
   apt-get install certbot python3-certbot-nginx
   certbot --nginx -d yourdomain.com
   ```

## Useful Commands

- **Restart app**: `systemctl restart hotel.service`
- **View logs**: `journalctl -u hotel.service -n 100`
- **Check status**: `systemctl status hotel.service`
- **Restart Nginx**: `systemctl restart nginx`
- **Check ports**: `netstat -tlnp`