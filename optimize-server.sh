#!/bin/bash
# Server optimization script for Hotel23

echo "=== Optimizing Hotel23 Server ==="

# 1. Clean up PostgreSQL connections
echo "Cleaning up idle PostgreSQL connections..."
ssh azureuser@20.169.209.166 'sudo -u postgres psql -d Hotel -c "SELECT pg_terminate_backend(pid) FROM pg_stat_activity WHERE datname = '"'"'Hotel'"'"' AND state = '"'"'idle'"'"' AND state_change < current_timestamp - interval '"'"'10 minutes'"'"';"'

# 2. Restart PostgreSQL to free memory
echo "Restarting PostgreSQL..."
ssh azureuser@20.169.209.166 'sudo systemctl restart postgresql'

# 3. Clear system caches
echo "Clearing system caches..."
ssh azureuser@20.169.209.166 'sync && echo 3 | sudo tee /proc/sys/vm/drop_caches'

# 4. Stop current dotnet process
echo "Stopping current application..."
ssh azureuser@20.169.209.166 'pkill -9 dotnet || true'

# 5. Wait a moment
sleep 3

# 6. Start application with memory limits
echo "Starting application with optimized settings..."
ssh azureuser@20.169.209.166 'cd /home/azureuser/hotel-app && ASPNETCORE_ENVIRONMENT=Production ASPNETCORE_URLS=http://0.0.0.0:5002 DOTNET_GCHeapHardLimit=0xC0000000 nohup dotnet Hotel.dll > app.log 2>&1 &'

# 7. Check status
sleep 5
echo "Checking application status..."
ssh azureuser@20.169.209.166 'ps aux | grep dotnet | grep -v grep'

# 8. Check memory usage
echo -e "\nMemory status after optimization:"
ssh azureuser@20.169.209.166 'free -h'

echo -e "\nOptimization complete!"