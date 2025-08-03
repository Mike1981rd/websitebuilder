# 🚀 Guía de Despliegue Hotel23 - DigitalOcean Droplet

## 📋 Información del Servidor
- **IP**: 104.131.187.169
- **Sistema**: Ubuntu con .NET 8 y Nginx preinstalados
- **Base de datos**: PostgreSQL (se instalará)

## 🔧 Paso 1: Configuración Inicial del Servidor

### Conectarse al servidor
```bash
ssh root@104.131.187.169
```

### Ejecutar el script de configuración
1. Copiar el script al servidor:
```bash
# Desde tu máquina local
scp setup-server.sh root@104.131.187.169:/tmp/
```

2. Ejecutar el script en el servidor:
```bash
ssh root@104.131.187.169
chmod +x /tmp/setup-server.sh
/tmp/setup-server.sh
```

Este script instalará:
- PostgreSQL
- Configuración de base de datos
- Servicio systemd
- Configuración de Nginx
- Firewall

## 🔑 Paso 2: Configurar Base de Datos

### Cambiar la contraseña de PostgreSQL
```bash
sudo -u postgres psql -c "ALTER USER hoteluser PASSWORD 'tu-contraseña-segura';"
```

### Verificar la conexión
```bash
psql -h localhost -U hoteluser -d Hotel
```

## 📦 Paso 3: Desplegar la Aplicación

### Desde Windows (PowerShell)
1. Abrir PowerShell como administrador
2. Navegar al directorio del proyecto:
```powershell
cd "C:\Users\hp\Documents\Visual Studio 2022\Projects\Hotel23"
```

3. Actualizar la contraseña en `appsettings.Production.json`

4. Ejecutar el script de despliegue:
```powershell
.\deploy-to-droplet.ps1 -SSHKey "ruta\a\tu\llave\ssh" -DBPassword "tu-contraseña-db"
```

### Verificar el despliegue
```bash
# En el servidor
systemctl status hotel23
journalctl -u hotel23 -f
```

## 🗄️ Paso 4: Migraciones de Base de Datos

### Opción 1: Ejecutar migraciones desde el servidor
```bash
cd /var/www/hotel23
dotnet Hotel.dll migrate
```

### Opción 2: Ejecutar migraciones desde tu máquina local
Actualizar temporalmente la cadena de conexión para apuntar al servidor remoto:
```json
"Host=104.131.187.169;Database=Hotel;Username=hoteluser;Password=tu-contraseña"
```

Luego ejecutar:
```bash
dotnet ef database update
```

## 🌐 Paso 5: Verificar la Aplicación

1. Abrir navegador: http://104.131.187.169
2. Verificar logs si hay problemas:
```bash
journalctl -u hotel23 -n 100
tail -f /var/log/nginx/error.log
```

## 🔒 Paso 6: Configuración de SSL (Opcional)

Para usar HTTPS con un dominio:
```bash
apt install certbot python3-certbot-nginx
certbot --nginx -d tudominio.com
```

## 🛠️ Comandos Útiles

### Gestión del servicio
```bash
# Iniciar
systemctl start hotel23

# Detener
systemctl stop hotel23

# Reiniciar
systemctl restart hotel23

# Ver estado
systemctl status hotel23

# Ver logs
journalctl -u hotel23 -f
```

### Actualizar la aplicación
1. Ejecutar el script de despliegue nuevamente
2. La aplicación se actualizará automáticamente

### Verificar Nginx
```bash
nginx -t
systemctl restart nginx
```

## ⚠️ Solución de Problemas

### La aplicación no inicia
1. Verificar logs: `journalctl -u hotel23 -n 50`
2. Verificar permisos: `ls -la /var/www/hotel23`
3. Verificar conexión a base de datos

### Error 502 Bad Gateway
1. Verificar que la aplicación esté ejecutándose: `systemctl status hotel23`
2. Verificar que esté escuchando en puerto 5000: `netstat -tlnp | grep 5000`
3. Revisar configuración de Nginx

### Base de datos no conecta
1. Verificar que PostgreSQL esté activo: `systemctl status postgresql`
2. Verificar credenciales en `appsettings.Production.json`
3. Verificar configuración de pg_hba.conf

## 📝 Notas Importantes

1. **Seguridad**: Cambiar SIEMPRE las contraseñas por defecto
2. **Backups**: Configurar backups automáticos de la base de datos
3. **Monitoreo**: Considerar instalar herramientas de monitoreo
4. **Actualizaciones**: Mantener el sistema y paquetes actualizados

## 🆘 Soporte

Si encuentras problemas:
1. Revisar los logs del servicio
2. Verificar la configuración de Nginx
3. Asegurarse de que todas las dependencias estén instaladas
4. Verificar que los puertos necesarios estén abiertos en el firewall