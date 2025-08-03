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

### 📊 ACTUALIZACIÓN DE BASE DE DATOS (MIGRACIONES)

**⚠️ IMPORTANTE**: Siempre actualizar la BD ANTES de actualizar el código.

#### Proceso Automático con Claude:
Cuando el usuario diga "hay nuevas tablas en la db" o "actualiza la db del servidor", seguir estos pasos:

1. **Verificar última migración en el servidor**:
```bash
ssh azureuser@20.169.209.166 'PGPASSWORD=123456 psql -h localhost -U hoteluser -d Hotel -c "SELECT \"MigrationId\" FROM \"__EFMigrationsHistory\" ORDER BY \"MigrationId\" DESC LIMIT 1;"'
```

2. **Listar migraciones locales pendientes**:
```bash
cd "/mnt/c/Users/hp/Documents/Visual Studio 2022/Projects/Hotel23"
find Migrations -name "*.cs" -not -name "*Designer.cs" -not -name "*ModelSnapshot.cs" | sort
```

3. **Para cada migración pendiente**:
   - Leer el archivo de migración .cs
   - Generar el SQL correspondiente basado en el método Up()
   - Crear archivo temporal con el SQL
   - Copiar al servidor: `scp archivo.sql azureuser@20.169.209.166:/home/azureuser/`
   - Ejecutar: `ssh azureuser@20.169.209.166 'PGPASSWORD=123456 psql -h localhost -U hoteluser -d Hotel -f /home/azureuser/archivo.sql'`
   - Agregar registro a __EFMigrationsHistory:
     ```sql
     INSERT INTO "__EFMigrationsHistory" ("MigrationId", "ProductVersion")
     VALUES ('NombreDeLaMigracion', '8.0.0');
     ```
   - Limpiar archivos temporales

4. **Verificar que se aplicó correctamente**:
```bash
ssh azureuser@20.169.209.166 'PGPASSWORD=123456 psql -h localhost -U hoteluser -d Hotel -c "\d \"NombreTabla\""'
```

#### Ejemplo Completo (Como se hizo con CustomDomains):
```bash
# 1. Crear SQL basado en la migración
# 2. Aplicar en servidor
ssh azureuser@20.169.209.166 'PGPASSWORD=123456 psql -h localhost -U hoteluser -d Hotel -f temp_migration.sql'
# 3. Verificar
ssh azureuser@20.169.209.166 'PGPASSWORD=123456 psql -h localhost -U hoteluser -d Hotel -c "\d \"CustomDomains\""'
```

### 🚀 ACTUALIZACIÓN DE CÓDIGO (DEPLOYMENT)

#### 📖 IMPORTANTE - ANTES DE ACTUALIZAR:
**⚠️ LEER PRIMERO: `TEST-DEPLOYMENT-GUIDE.md`** 
- Contiene instrucciones para probar el script sin riesgos
- Incluye el modo TestMode para simulación segura
- Explica cómo restaurar backups si algo sale mal

#### ⚠️ PROBLEMAS CONOCIDOS Y SOLUCIONES:

1. **Antes de hacer deployment**:
   - Verificar que `appsettings.Production.json` NO tenga sección "Kestrel"
   - Si existe, removerla completamente (causa conflictos de puerto)

2. **Si el deployment falla por puerto ocupado**:
   ```bash
   ssh azureuser@20.169.209.166 'pkill -9 dotnet || true'
   ```

3. **Scripts de deployment**:
   - El script PowerShell tiene problemas de sintaxis mixta
   - Por ahora, usar el proceso manual o el script Bash desde WSL

#### 📝 PROCESO MANUAL RECOMENDADO (más confiable):

```bash
# 1. Publicar desde Windows (PowerShell o CMD)
cd "C:\Users\hp\Documents\Visual Studio 2022\Projects\Hotel23"
dotnet publish Hotel.csproj -c Release -o publish --runtime linux-x64 --self-contained false

# 2. Comprimir y subir (desde WSL o Git Bash)
tar -czf hotel23-app.tar.gz -C publish .
scp hotel23-app.tar.gz azureuser@20.169.209.166:/home/azureuser/

# 3. En el servidor (todo en un comando)
ssh azureuser@20.169.209.166 '
pkill -9 dotnet || true
sleep 2
cd /home/azureuser
tar -xzf hotel23-app.tar.gz -C hotel-app
rm hotel23-app.tar.gz
cd hotel-app
ASPNETCORE_ENVIRONMENT=Production ASPNETCORE_URLS=http://0.0.0.0:5002 nohup dotnet Hotel.dll > app.log 2>&1 &
sleep 10
ps aux | grep -v grep | grep "dotnet Hotel.dll" && echo "✅ Deployment exitoso" || echo "❌ Error - revisar logs"
'

# 4. Verificar
curl -s -o /dev/null -w "%{http_code}" http://20.169.209.166
```

#### 🔧 CHECKLIST PRE-DEPLOYMENT:
- [ ] ¿Hay migraciones pendientes? Aplicarlas primero
- [ ] ¿El archivo appsettings.Production.json está limpio de Kestrel?
- [ ] ¿Hay procesos dotnet zombies en el servidor? (`ssh azureuser@20.169.209.166 'ps aux | grep dotnet'`)

**Script automatizado** (CORREGIDO - v2.0):
```powershell
# PRIMERO: Probar sin riesgos
.\deploy-to-azure.ps1 -TestMode

# DESPUÉS: Si todo OK, ejecutar real
.\deploy-to-azure.ps1
```

⚠️ **Ver `TEST-DEPLOYMENT-GUIDE.md` para instrucciones completas de prueba**

O manualmente:

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

### 📊 LECCIONES APRENDIDAS DEL DEPLOYMENT (03/08/2025):

1. **Configuración Kestrel es problemática**
   - NUNCA incluir configuración Kestrel en appsettings.Production.json
   - Usar solo variables de entorno para controlar puertos

2. **Procesos zombies son comunes**
   - Siempre usar `pkill -9 dotnet` antes de iniciar
   - No confiar en kill simple, usar -9 (SIGKILL)

3. **El orden importa**
   - SIEMPRE: Migraciones BD → Luego deployment código
   - NUNCA al revés (el código nuevo esperará tablas que no existen)

4. **Scripts necesitan mantenimiento**
   - El script PowerShell necesita reescribirse completamente
   - Por ahora, el proceso manual es más confiable

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