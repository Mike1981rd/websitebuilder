# 🚀 DOCUMENTACIÓN DEPLOYMENT AZURE - HOTEL23

## 📊 INFORMACIÓN GENERAL

**Fecha de Deployment**: 2 de Agosto 2025
**Proveedor**: Microsoft Azure
**Tipo de Servidor**: Máquina Virtual Linux (Ubuntu 22.04 LTS)
**URL de Producción**: http://20.169.209.166

## 🔐 CREDENCIALES Y ACCESOS

### Azure Account
- **Subscription ID**: da506dfa-c538-43ee-be1e-e0c9959a253b
- **Tenant ID**: 441738c9-c119-4f31-ad2a-ab3b177166d4
- **Subscription Name**: Azure subscription 1
- **Email**: lamiguita17@hotmail.com

### Servidor Linux (VM)
- **Nombre VM**: vm-aspnetcore-prod
- **IP Pública**: 20.169.209.166
- **Usuario SSH**: azureuser
- **Acceso SSH**: `ssh azureuser@20.169.209.166`
- **Claves SSH**: Generadas automáticamente en `~/.ssh/id_rsa` y `~/.ssh/id_rsa.pub`

### Base de Datos PostgreSQL
- **Host**: localhost (en el servidor)
- **Puerto**: 5432
- **Base de Datos**: Hotel (con H mayúscula)
- **Usuario**: hoteluser
- **Contraseña**: 123456
- **Usuario Admin PostgreSQL**: postgres

### Connection String Producción
```
Host=20.169.209.166;Database=Hotel;Username=hoteluser;Password=123456;Port=5432
```

## 💻 ESPECIFICACIONES DEL SERVIDOR

### Recursos Azure
- **Grupo de Recursos**: rg-aspnetcore-prod
- **Región**: East US
- **Tipo de VM**: Standard_B2s (2 vCPUs, 4 GB RAM)
- **Disco**: Premium SSD 30GB
- **Sistema Operativo**: Ubuntu 22.04 LTS

### Software Instalado
- **PostgreSQL**: 14
- **ASP.NET Core Runtime**: 8.0
- **Nginx**: 1.18.0
- **.NET**: 8.0.18

### Puertos Abiertos
- **22**: SSH
- **80**: HTTP (Nginx)
- **443**: HTTPS (configurado pero sin SSL)
- **5432**: PostgreSQL

## 📁 ESTRUCTURA DE ARCHIVOS

### Aplicación
- **Ubicación**: `/home/azureuser/hotel-app/`
- **Archivo Principal**: `Hotel.dll`
- **Logs**: `/home/azureuser/hotel-app/app.log`
- **Config Producción**: `appsettings.Production.json`

### Configuraciones
- **Nginx Config**: `/etc/nginx/sites-available/hotel23`
- **Systemd Service**: `/etc/systemd/system/hotel23.service` (creado pero no funcional)

## 🔧 CONFIGURACIÓN ACTUAL

### Aplicación ASP.NET Core
- **Puerto**: 5002 (interno)
- **Environment**: Production
- **URL**: http://0.0.0.0:5002
- **Ejecutándose como**: Proceso nohup (no como servicio systemd)

### Nginx Proxy Reverso
```nginx
server {
    listen 80;
    server_name 20.169.209.166;
    
    location / {
        proxy_pass http://localhost:5002;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection keep-alive;
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_set_header X-Real-IP $remote_addr;
        
        proxy_connect_timeout 600;
        proxy_send_timeout 600;
        proxy_read_timeout 600;
        send_timeout 600;
        
        proxy_buffer_size 128k;
        proxy_buffers 4 256k;
        proxy_busy_buffers_size 256k;
        
        client_max_body_size 100M;
    }
}
```

## 🐛 PROBLEMAS ENCONTRADOS Y SOLUCIONES

### 1. Base de Datos "Hotel" No Existía
**Problema**: PostgreSQL es case-sensitive. Se creó "hotel" pero la app buscaba "Hotel"
**Solución**: 
```bash
sudo -u postgres psql -c 'CREATE DATABASE "Hotel" OWNER hoteluser;'
```

### 2. Permisos de Base de Datos
**Error**: `permission denied for table Users`
**Causa**: Las tablas fueron creadas por usuario postgres, no por hoteluser
**Solución**:
```bash
sudo -u postgres psql -d "Hotel" -c "GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA public TO hoteluser;"
sudo -u postgres psql -d "Hotel" -c "GRANT ALL PRIVILEGES ON ALL SEQUENCES IN SCHEMA public TO hoteluser;"
sudo -u postgres psql -d "Hotel" -c "GRANT ALL PRIVILEGES ON SCHEMA public TO hoteluser;"
```

### 3. Puerto 5000 en Uso
**Problema**: La aplicación intentaba usar puerto 5000 que estaba ocupado
**Solución**: 
- Remover configuración Kestrel de appsettings.Production.json
- Usar variable de entorno ASPNETCORE_URLS=http://0.0.0.0:5002

### 4. Backup PostgreSQL Incompatible
**Problema**: Backup en formato custom de PostgreSQL 17 no compatible con PostgreSQL 14
**Solución**: Crear backup en formato plain SQL:
```powershell
cd "C:\Program Files\PostgreSQL\17\bin"
.\pg_dump.exe -h localhost -U postgres -d Hotel --format=plain --no-owner --no-privileges -f C:\Users\hp\Desktop\hotel_backup_plain.sql
```

### 5. Servicio Systemd No Funciona
**Problema**: El servicio systemd falla al iniciar con timeout
**Workaround**: Ejecutar la aplicación directamente con nohup:
```bash
cd /home/azureuser/hotel-app
ASPNETCORE_ENVIRONMENT=Production ASPNETCORE_URLS=http://0.0.0.0:5002 nohup dotnet Hotel.dll > app.log 2>&1 &
```

## 🚀 COMANDOS ÚTILES

### Gestión de la Aplicación
```bash
# Ver si la app está ejecutándose
ps aux | grep dotnet | grep -v grep

# Detener la aplicación
ps aux | grep dotnet | grep -v grep | awk '{print $2}' | xargs kill -9

# Iniciar la aplicación
cd /home/azureuser/hotel-app
ASPNETCORE_ENVIRONMENT=Production ASPNETCORE_URLS=http://0.0.0.0:5002 nohup dotnet Hotel.dll > app.log 2>&1 &

# Ver logs
tail -f /home/azureuser/hotel-app/app.log

# Ver logs del sistema
sudo journalctl -n 50 | grep dotnet
```

### Gestión de Base de Datos
```bash
# Conectar a PostgreSQL como admin
sudo -u postgres psql

# Conectar a la base de datos Hotel
sudo -u postgres psql -d "Hotel"

# Listar tablas
\dt

# Ver usuarios de la BD
SELECT "UserName", "Email" FROM "Users";
```

### Gestión de Nginx
```bash
# Verificar configuración
sudo nginx -t

# Recargar configuración
sudo systemctl reload nginx

# Ver estado
sudo systemctl status nginx
```

## 💰 COSTOS MENSUALES

- **VM Standard_B2s**: $30.37/mes
- **Disco Premium SSD 30GB**: $5.89/mes
- **IP Pública Estática**: $3.65/mes
- **Total Fijo**: $39.91/mes
- **Transferencia de datos**: $0.087/GB después de 5GB gratis

## 📝 TAREAS PENDIENTES

1. **Configurar SSL/HTTPS**: Instalar Let's Encrypt para certificado SSL gratuito
2. **Configurar Dominio**: Apuntar un dominio real en lugar de usar IP
3. **Arreglar Servicio Systemd**: Para que la app se inicie automáticamente
4. **Configurar Backups Automáticos**: Para la base de datos
5. **Monitoreo**: Configurar alertas y monitoreo de la aplicación

## 🔄 PROCESO DE ACTUALIZACIÓN

1. **Publicar Nueva Versión Localmente**:
```powershell
dotnet publish Hotel.csproj -c Release -o publish --runtime linux-x64 --self-contained false
```

2. **Comprimir y Subir**:
```bash
tar -czf hotel23-app.tar.gz -C publish .
scp hotel23-app.tar.gz azureuser@20.169.209.166:/home/azureuser/
```

3. **En el Servidor**:
```bash
# Detener app actual
ps aux | grep dotnet | grep -v grep | awk '{print $2}' | xargs kill -9

# Backup actual
cp -r /home/azureuser/hotel-app /home/azureuser/hotel-app-backup-$(date +%Y%m%d)

# Extraer nueva versión
cd /home/azureuser
tar -xzf hotel23-app.tar.gz -C hotel-app

# Iniciar nueva versión
cd /home/azureuser/hotel-app
ASPNETCORE_ENVIRONMENT=Production ASPNETCORE_URLS=http://0.0.0.0:5002 nohup dotnet Hotel.dll > app.log 2>&1 &
```

## 🆘 TROUBLESHOOTING

### Si la aplicación no responde:
1. Verificar que esté ejecutándose: `ps aux | grep dotnet`
2. Revisar logs: `tail -100 /home/azureuser/hotel-app/app.log`
3. Verificar puerto: `sudo lsof -i :5002`
4. Verificar Nginx: `sudo systemctl status nginx`

### Si hay errores de base de datos:
1. Verificar conexión: `sudo -u postgres psql -d "Hotel" -c "\l"`
2. Verificar permisos: Ver sección de permisos arriba
3. Verificar que las tablas existan: `sudo -u postgres psql -d "Hotel" -c "\dt"`

### Si necesitas restaurar la BD nuevamente:
1. Crear backup plain SQL en local (ver arriba)
2. Copiar al servidor: `scp backup.sql azureuser@20.169.209.166:/tmp/`
3. Restaurar: `sudo -u postgres psql -d "Hotel" -f /tmp/backup.sql`
4. Aplicar permisos (ver arriba)

---
**Última actualización**: 2 de Agosto 2025
**Creado por**: Claude Assistant para Hotel23