# 📘 Guía de Configuración del Servidor - Hotel23

## 🎯 Requisitos del Servidor

- **Sistema Operativo**: Ubuntu 20.04+ o similar
- **Nginx**: 1.18.0 o superior
- **Puerto de la aplicación**: 5002 (configurable)
- **ASP.NET Core Runtime**: 8.0

## 🔧 Configuración de Nginx para Dominios Múltiples

### 1. Crear archivo de configuración nginx

Crear el archivo `/etc/nginx/sites-available/hotel23` con el siguiente contenido:

```nginx
server {
    listen 80;
    server_name _;  # Acepta CUALQUIER dominio
    
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

### 2. Activar la configuración

```bash
# Crear enlace simbólico
sudo ln -s /etc/nginx/sites-available/hotel23 /etc/nginx/sites-enabled/

# Verificar sintaxis
sudo nginx -t

# Recargar nginx
sudo systemctl reload nginx
```

### 3. Configurar la aplicación

En `appsettings.Production.json`, agregar:

```json
{
  "SystemDomains": {
    "AllowedHosts": [
      "localhost",
      "127.0.0.1",
      "SU_IP_DEL_SERVIDOR",
      "su-dominio-administrativo.com"
    ]
  }
}
```

Reemplazar:
- `SU_IP_DEL_SERVIDOR` con la IP pública del servidor
- `su-dominio-administrativo.com` con el dominio del sistema administrativo

## 📝 Cómo Agregar Dominios Personalizados

### Para el Administrador:

1. **En la aplicación Hotel23**:
   - Ir a Menú → Dominios
   - Clic en "Agregar Dominio"
   - Ingresar el dominio (ej: www.mihotel.com)
   - Activar el dominio

2. **Configurar DNS en el registrador** (Namecheap, GoDaddy, etc.):
   ```
   Type: A Record
   Host: @
   Value: [IP_DEL_SERVIDOR]
   TTL: Automatic

   Type: A Record  
   Host: www
   Value: [IP_DEL_SERVIDOR]
   TTL: Automatic
   ```

3. **¡Listo!** El dominio funcionará automáticamente en 10-30 minutos

## 🚀 Iniciar la Aplicación

### Opción 1: Con systemd (Recomendado)

Crear archivo `/etc/systemd/system/hotel23.service`:

```ini
[Unit]
Description=Hotel23 ASP.NET Core App
After=network.target

[Service]
WorkingDirectory=/ruta/a/la/aplicacion
ExecStart=/usr/bin/dotnet /ruta/a/la/aplicacion/Hotel.dll
Restart=always
RestartSec=10
User=www-data
Environment=ASPNETCORE_ENVIRONMENT=Production
Environment=ASPNETCORE_URLS=http://localhost:5002

[Install]
WantedBy=multi-user.target
```

Luego:
```bash
sudo systemctl enable hotel23
sudo systemctl start hotel23
```

### Opción 2: Con nohup (Temporal)

```bash
cd /ruta/a/la/aplicacion
ASPNETCORE_ENVIRONMENT=Production ASPNETCORE_URLS=http://0.0.0.0:5002 nohup dotnet Hotel.dll > app.log 2>&1 &
```

## 🔍 Verificación

### 1. Verificar que nginx esté funcionando:
```bash
sudo systemctl status nginx
```

### 2. Verificar que la aplicación esté corriendo:
```bash
# Con systemd
sudo systemctl status hotel23

# Con nohup
ps aux | grep dotnet
```

### 3. Ver logs:
```bash
# Logs de nginx
sudo tail -f /var/log/nginx/access.log
sudo tail -f /var/log/nginx/error.log

# Logs de la aplicación
tail -f /ruta/a/la/aplicacion/app.log
```

## ❗ Solución de Problemas

### El dominio no funciona:

1. **Verificar DNS**:
   ```bash
   nslookup dominio.com
   # Debe mostrar la IP del servidor
   ```

2. **Verificar que el dominio esté activo en la aplicación**:
   - Entrar al panel de administración
   - Verificar que el dominio esté marcado como "Activo"

3. **Esperar propagación DNS**:
   - Los cambios DNS pueden tardar hasta 48 horas
   - Normalmente es mucho más rápido (10-30 minutos)

### Error 502 Bad Gateway:

1. Verificar que la aplicación esté corriendo
2. Verificar el puerto en la configuración (debe coincidir con ASPNETCORE_URLS)
3. Revisar logs de la aplicación

## 🔒 Seguridad

1. **Firewall**: Asegurar que solo los puertos 80, 443 y 22 (SSH) estén abiertos
2. **HTTPS**: Se recomienda instalar certificados SSL con Let's Encrypt
3. **Actualizaciones**: Mantener el sistema y nginx actualizados

## 📞 Soporte

Si necesita ayuda adicional con la configuración, contacte al equipo de desarrollo con:
- Logs de nginx
- Logs de la aplicación
- Captura del error específico

---
**Última actualización**: 3 de Agosto 2025