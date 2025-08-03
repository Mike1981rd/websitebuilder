# 🌐 CONFIGURACIÓN DE DOMINIOS NAMECHEAP → AZURE

**Fecha de creación**: 3 de Agosto 2025  
**Dominios comprados**: 2 de Agosto 2025 (tarde)  
**Objetivo**: Configurar dominios reales para sistema y website  

## 📋 INFORMACIÓN DE DOMINIOS

### Dominio del Sistema Administrativo
- **Dominio**: `test1hotelwebsite.online`
- **Propósito**: Acceso al panel administrativo (login, gestión)
- **URL final**: `http://test1hotelwebsite.online`
- **Usuarios**: Solo administradores con credenciales

### Dominio del Website Público
- **Dominio**: `test2hotelwebsite.store`
- **Propósito**: Website del hotel para huéspedes
- **URL final**: `http://test2hotelwebsite.store`
- **Usuarios**: Público general sin autenticación

### Servidor Azure
- **IP**: `20.169.209.166`
- **OS**: Ubuntu 22.04 LTS
- **Web Server**: Nginx
- **App**: ASP.NET Core 8.0 en puerto 5002

## 🎯 PLAN DE IMPLEMENTACIÓN DETALLADO

### FASE 0: ESTADO INICIAL
- ✅ Código con CustomDomains y middleware desplegado
- ✅ Nginx configurado solo para IP: `server_name 20.169.209.166;`
- ✅ Sistema funcionando en `http://20.169.209.166`
- ✅ Dominios comprados hace 24+ horas (propagación completa)

---

## 🔵 FASE 1: DOMINIO PARA SISTEMA ADMINISTRATIVO

### Paso 1.1: Verificar Estado Actual (Claude)
```bash
# Conectar al servidor
ssh azureuser@20.169.209.166

# Verificar configuración actual de Nginx
cat /etc/nginx/sites-available/hotel23 | grep server_name

# Verificar app funcionando
ps aux | grep dotnet
curl -I http://localhost:5002

# Verificar appsettings actual
cat /home/azureuser/hotel-app/appsettings.Production.json | grep -A10 SystemDomains
```

### Paso 1.2: Actualizar Nginx (Claude)
```bash
# Editar configuración
sudo nano /etc/nginx/sites-available/hotel23

# Buscar la línea:
server_name 20.169.209.166;

# Cambiar a:
server_name 20.169.209.166 test1hotelwebsite.online www.test1hotelwebsite.online;

# Guardar: Ctrl+O, Enter, Ctrl+X

# Verificar sintaxis
sudo nginx -t

# Si dice "syntax is ok":
sudo systemctl reload nginx

# Verificar que Nginx esté activo
sudo systemctl status nginx
```

### Paso 1.3: Actualizar appsettings.Production.json (Claude)
```bash
# Hacer backup primero
cp /home/azureuser/hotel-app/appsettings.Production.json /home/azureuser/hotel-app/appsettings.Production.json.bak

# Editar archivo
nano /home/azureuser/hotel-app/appsettings.Production.json

# Buscar o agregar la sección SystemDomains:
{
  "ConnectionStrings": {
    "DefaultConnection": "Host=20.169.209.166;Database=Hotel;Username=hoteluser;Password=123456;Port=5432"
  },
  "Logging": {
    "LogLevel": {
      "Default": "Warning",
      "Microsoft.AspNetCore": "Warning",
      "Microsoft.EntityFrameworkCore": "Warning"
    }
  },
  "AllowedHosts": "*",
  "SystemDomains": {
    "AllowedHosts": [
      "localhost",
      "127.0.0.1",
      "20.169.209.166",
      "test1hotelwebsite.online",
      "www.test1hotelwebsite.online"
    ]
  }
}

# Guardar cambios
```

### Paso 1.4: Reiniciar Aplicación (Claude)
```bash
# Encontrar proceso actual
ps aux | grep dotnet | grep -v grep

# Anotar el PID y detener
kill -9 [PID]

# O usar one-liner
ps aux | grep dotnet | grep -v grep | awk '{print $2}' | xargs kill -9

# Iniciar aplicación
cd /home/azureuser/hotel-app
ASPNETCORE_ENVIRONMENT=Production ASPNETCORE_URLS=http://0.0.0.0:5002 nohup dotnet Hotel.dll > app.log 2>&1 &

# Verificar que inició
sleep 5
tail -20 app.log

# Verificar proceso corriendo
ps aux | grep dotnet | grep -v grep
```

### Paso 1.5: Verificación Fase 1 (Claude)
```bash
# Test 1: Verificar respuesta local
curl -I http://localhost:5002

# Test 2: Verificar logs del middleware
tail -50 app.log | grep CustomDomainMiddleware

# Test 3: Verificar que detecte dominio del sistema
# Esperar a que el usuario configure DNS y luego:
curl -H "Host: test1hotelwebsite.online" http://localhost:5002 -I

# Deberías ver en logs:
# [CustomDomainMiddleware] System domain detected: test1hotelwebsite.online
```

### ⏸️ CHECKPOINT FASE 1
**Antes de continuar a Fase 2, verificar**:
- ✅ `http://20.169.209.166` → Sigue funcionando
- ✅ `http://test1hotelwebsite.online` → Muestra login
- ✅ Logs muestran "System domain detected"
- ✅ No hay errores en app.log

---

## 🟢 FASE 2: DOMINIO PARA WEBSITE PÚBLICO

### Paso 2.1: Usuario Agrega Dominio en Sistema
**El usuario debe**:
1. Entrar a `http://test1hotelwebsite.online`
2. Navegar a: **Dominios Personalizados**
3. Click en **"Crear Nuevo Dominio"**
4. Ingresar: `test2hotelwebsite.store`
5. Marcar: **"Activar inmediatamente"**
6. Guardar

### Paso 2.2: Verificar en Base de Datos (Claude)
```bash
# Conectar a PostgreSQL
PGPASSWORD=123456 psql -h localhost -U hoteluser -d Hotel

# Verificar dominio creado
SELECT * FROM "CustomDomains";

# Debería mostrar:
# DomainName: test2hotelwebsite.store
# IsActive: true
# Status: active

# Salir
\q
```

### Paso 2.3: Actualizar Nginx para Aceptar Cualquier Dominio (Claude)
```bash
# Editar configuración
sudo nano /etc/nginx/sites-available/hotel23

# Cambiar la línea server_name de:
server_name 20.169.209.166 test1hotelwebsite.online www.test1hotelwebsite.online;

# A:
server_name _;

# Guardar: Ctrl+O, Enter, Ctrl+X

# Verificar y recargar
sudo nginx -t
sudo systemctl reload nginx
```

**¿Por qué `server_name _;`?**
- `_` es un wildcard que acepta CUALQUIER dominio
- El middleware CustomDomain se encarga de validar
- Permite agregar futuros dominios sin tocar Nginx

### Paso 2.4: Verificación Fase 2 (Claude)
```bash
# Test 1: Verificar que sistema sigue funcionando
curl -H "Host: test1hotelwebsite.online" http://localhost:5002 -I

# Test 2: Verificar dominio personalizado
curl -H "Host: test2hotelwebsite.store" http://localhost:5002 -I

# Test 3: Revisar logs
tail -50 app.log | grep test2hotelwebsite

# Deberías ver:
# [CustomDomainMiddleware] Processing request for host: test2hotelwebsite.store
# [CustomDomainMiddleware] Custom domain found: test2hotelwebsite.store

# Test 4: Verificar que redirige a preview
curl -H "Host: test2hotelwebsite.store" http://localhost:5002 -v 2>&1 | grep Location

# Debería mostrar:
# Location: /WebsiteBuilder/Preview
```

### ⏸️ CHECKPOINT FINAL
**Verificar que**:
- ✅ `http://test1hotelwebsite.online` → Sistema admin (login)
- ✅ `http://test2hotelwebsite.store` → Preview del hotel
- ✅ Ambos funcionan simultáneamente
- ✅ No hay errores en logs

---

## 🚨 PLAN DE ROLLBACK

### Si Fase 1 Falla:
```bash
# 1. Restaurar Nginx
sudo nano /etc/nginx/sites-available/hotel23
# Cambiar a: server_name 20.169.209.166;
sudo nginx -t && sudo systemctl reload nginx

# 2. Restaurar appsettings
cp /home/azureuser/hotel-app/appsettings.Production.json.bak /home/azureuser/hotel-app/appsettings.Production.json

# 3. Reiniciar app
ps aux | grep dotnet | grep -v grep | awk '{print $2}' | xargs kill -9
cd /home/azureuser/hotel-app
ASPNETCORE_ENVIRONMENT=Production ASPNETCORE_URLS=http://0.0.0.0:5002 nohup dotnet Hotel.dll > app.log 2>&1 &
```

### Si Fase 2 Falla:
```bash
# 1. Volver a dominios específicos en Nginx
sudo nano /etc/nginx/sites-available/hotel23
# Cambiar a: server_name 20.169.209.166 test1hotelwebsite.online www.test1hotelwebsite.online;
sudo nginx -t && sudo systemctl reload nginx

# 2. Desactivar dominio en BD (opcional)
PGPASSWORD=123456 psql -h localhost -U hoteluser -d Hotel -c "UPDATE \"CustomDomains\" SET \"IsActive\" = false WHERE \"DomainName\" = 'test2hotelwebsite.store';"
```

---

## 📊 LOGS Y DEBUGGING

### Comandos Útiles Durante la Implementación:
```bash
# Ver logs en tiempo real
tail -f /home/azureuser/hotel-app/app.log

# Filtrar solo CustomDomain
tail -f /home/azureuser/hotel-app/app.log | grep CustomDomain

# Ver errores de Nginx
sudo tail -f /var/log/nginx/error.log

# Test rápido con curl
curl -H "Host: test1hotelwebsite.online" http://20.169.209.166 -I
curl -H "Host: test2hotelwebsite.store" http://20.169.209.166 -I

# Ver todas las conexiones activas
sudo netstat -tlnp | grep :80
sudo netstat -tlnp | grep :5002
```

### Qué Buscar en los Logs:

**Para dominio del sistema**:
```
[CustomDomainMiddleware] Processing request for host: test1hotelwebsite.online
[CustomDomainMiddleware] System domain detected: test1hotelwebsite.online, bypassing custom domain check
```

**Para dominio personalizado**:
```
[CustomDomainMiddleware] Processing request for host: test2hotelwebsite.store
[CustomDomainMiddleware] Custom domain found: test2hotelwebsite.store (ID: 1, WebSiteId: 1)
[CustomDomainMiddleware] Root path requested for custom domain, redirecting to /WebsiteBuilder/Preview
```

---

## ⏱️ TIMELINE DETALLADO

| Tiempo | Actividad | Responsable |
|--------|-----------|-------------|
| 0:00 | Configurar DNS en Namecheap | Usuario |
| 0:10 | Verificar estado actual del servidor | Claude |
| 0:15 | Actualizar Nginx para Fase 1 | Claude |
| 0:20 | Actualizar appsettings.Production.json | Claude |
| 0:25 | Reiniciar aplicación | Claude |
| 0:30 | Esperar propagación DNS | Ambos |
| 1:00 | Verificar Fase 1 funcionando | Ambos |
| 1:10 | Agregar dominio en sistema | Usuario |
| 1:15 | Verificar dominio en BD | Claude |
| 1:20 | Actualizar Nginx a wildcard | Claude |
| 1:25 | Verificación final | Ambos |
| 1:30 | ✅ Completado | - |

---

## 🔑 INFORMACIÓN CRÍTICA

### Credenciales y Accesos:
- **SSH**: `ssh azureuser@20.169.209.166`
- **PostgreSQL**: Usuario: `hoteluser`, Password: `123456`
- **Sistema Admin**: Usuario y password del sistema Hotel23

### Archivos Clave:
- **Nginx Config**: `/etc/nginx/sites-available/hotel23`
- **App Settings**: `/home/azureuser/hotel-app/appsettings.Production.json`
- **App Log**: `/home/azureuser/hotel-app/app.log`

### Puertos:
- **80**: Nginx (público)
- **5002**: Aplicación .NET (interno)
- **5432**: PostgreSQL

---

## ✅ CRITERIOS DE ÉXITO

La implementación es exitosa cuando:

1. **Sistema Administrativo**:
   - `http://test1hotelwebsite.online` → Login page
   - `http://www.test1hotelwebsite.online` → Login page
   - Pueden hacer login y gestionar

2. **Website Público**:
   - `http://test2hotelwebsite.store` → Preview del hotel
   - `http://www.test2hotelwebsite.store` → Preview del hotel
   - Navegación completa funcionando

3. **Técnicamente**:
   - No hay errores en app.log
   - Nginx status = active
   - CustomDomainMiddleware procesando correctamente

---

**IMPORTANTE**: Este documento contiene TODO lo necesario para implementar los dominios. Si lo lees en 6 meses, podrás ejecutar exactamente los mismos pasos.

---

**Documento creado**: 3 de Agosto 2025  
**Para implementación**: Próxima sesión