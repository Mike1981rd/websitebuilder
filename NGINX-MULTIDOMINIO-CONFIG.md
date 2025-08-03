# 🌐 Configuración de Nginx para Múltiples Dominios - Hotel23

## 📅 Fecha de Implementación
**3 de Agosto 2025**
**Actualización a Wildcard**: 3 de Agosto 2025

## 🎯 Objetivo
Configurar nginx para permitir que la aplicación Hotel23 responda automáticamente a CUALQUIER dominio personalizado, sin necesidad de configuración manual en el servidor.

## 📊 Evolución de la Configuración

### Estado Inicial
- **Aplicación**: Corriendo en puerto 5002
- **Nginx**: Configurado solo para responder por IP (20.169.209.166)
- **Problema**: Los dominios personalizados no funcionaban

### Primera Solución (Dominios Específicos)
- Se configuró nginx con lista específica de dominios
- Requería actualización manual para cada dominio nuevo

### ✅ Solución Final (Wildcard - Automática)
- Nginx acepta CUALQUIER dominio automáticamente
- No requiere intervención en el servidor para dominios nuevos

## 🚀 Configuración Actual (Wildcard)

### 1. Backup de Configuración
```bash
sudo cp /etc/nginx/sites-available/hotel23 /etc/nginx/sites-available/hotel23.backup-$(date +%Y%m%d-%H%M%S)
```

### 2. Configuración Wildcard Automática
El archivo `/etc/nginx/sites-available/hotel23` contiene:

```nginx
server {
    listen 80;
    server_name _;
    
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

### 3. Aplicar Cambios
```bash
sudo nginx -t  # Verificar sintaxis
sudo systemctl reload nginx  # Recargar configuración
```

## 🔑 Elementos Clave de la Configuración

### server_name _
- El guión bajo (`_`) es un wildcard que acepta CUALQUIER dominio
- No es necesario especificar dominios individuales
- Nginx pasará cualquier petición a la aplicación

### proxy_set_header Host $host
**CRÍTICO**: Preserva el header Host original, permitiendo que la aplicación ASP.NET Core detecte qué dominio está siendo accedido y mostrar el sitio correspondiente.

## 🧪 Verificación

### 1. Verificar DNS
```bash
nslookup test2hotelwebsite.store 8.8.8.8
# Debe devolver: 20.169.209.166
```

### 2. Verificar Logs
```bash
sudo tail -f /var/log/nginx/access.log | grep test2hotelwebsite
```

### 3. Prueba con curl
```bash
curl -I -H "Host: test2hotelwebsite.store" http://20.169.209.166
# Debe devolver: HTTP/1.1 200 OK
```

## 📝 Para Agregar Nuevos Dominios (Proceso Simplificado)

### ✅ Pasos para el Usuario:

1. **En la aplicación Hotel23**:
   - Ir a `/CustomDomains`
   - Agregar el nuevo dominio
   - Activarlo

2. **En su registrador de dominios (Namecheap, GoDaddy, etc.)**:
   - Crear registro A apuntando a: `20.169.209.166`
   - Opcionalmente, crear registro A para www

3. **¡Listo!** 
   - El dominio funcionará automáticamente
   - NO se requiere acceso al servidor
   - NO se requiere modificar nginx

## 🚨 Troubleshooting

### Si un dominio no funciona:
1. **Verificar DNS**: 
   ```bash
   nslookup dominio.com
   # Debe devolver: 20.169.209.166
   ```

2. **Verificar archivo hosts local**:
   - Windows: `C:\Windows\System32\drivers\etc\hosts`
   - Asegurarse que NO tenga entradas para el dominio

3. **Verificar en la aplicación**:
   - El dominio debe estar agregado en `/CustomDomains`
   - El dominio debe estar marcado como activo

4. **Verificar logs**: 
   ```bash
   sudo tail -f /var/log/nginx/access.log
   sudo tail -f /home/azureuser/hotel-app/app.log
   ```

5. **Esperar propagación DNS**:
   - Los cambios DNS pueden tardar hasta 48 horas
   - Generalmente es mucho más rápido (minutos)

## 🔒 Próximos Pasos (Recomendados)

1. **Configurar HTTPS/SSL**:
   - Instalar certbot
   - Generar certificados Let's Encrypt para cada dominio
   - Configurar redirección HTTP → HTTPS

2. **Optimización**:
   - Considerar caché de dominios en la aplicación
   - Configurar rate limiting por dominio

## 💡 Notas Importantes

- **No se requirieron cambios en el código** de la aplicación
- La aplicación ya detectaba dominios correctamente mediante el header Host
- Con la configuración wildcard (`server_name _`), nginx acepta CUALQUIER dominio
- El sistema es completamente automático - usuarios pueden agregar dominios sin intervención técnica
- La seguridad está manejada por la aplicación (tabla CustomDomains)

## 🔐 Seguridad

- Aunque nginx acepta cualquier dominio, la aplicación valida contra la tabla `CustomDomains`
- Solo los dominios registrados y activos mostrarán el sitio correcto
- Dominios no registrados mostrarán el sitio por defecto o error

---
**Documentado por**: Claude Assistant
**Actualización Wildcard**: 3 de Agosto 2025
**Validado**: Funcionando en producción con configuración automática