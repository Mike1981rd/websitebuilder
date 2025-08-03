# 🚀 Plan de Optimización de Velocidad - Hotel23

## 📅 Fecha: 3 de Agosto 2025

## 🎯 Objetivo
Mejorar dramáticamente la velocidad de carga del sitio web implementando compresión de respuestas y optimizaciones basadas en las mejores prácticas de Shopify y WordPress.

## 📊 Situación Actual
- **Problema principal**: El endpoint `/api/builder/websites/current` devuelve 16.4 MB sin comprimir
- **Tiempo de carga**: 3-5 segundos (inaceptable)
- **Servidor**: Azure Standard_B2s (2 vCPUs, 4 GB RAM)
- **Sin compresión**: La aplicación no tiene ResponseCompression habilitada

## 🔧 Plan de Implementación

### Fase 1: Compresión de Respuestas (PRIORIDAD ALTA)

#### 1.1 Modificar Program.cs
**Ubicación**: Líneas específicas donde agregar código
- **Using**: Después de línea 9
- **Services**: Después de línea 42
- **Middleware**: Antes de `app.UseRouting()`

**Código a agregar**:
```csharp
// Using
using Microsoft.AspNetCore.ResponseCompression;

// Services
builder.Services.AddResponseCompression(options =>
{
    options.EnableForHttps = true;
    options.Providers.Add<BrotliCompressionProvider>();
    options.Providers.Add<GzipCompressionProvider>();
    options.MimeTypes = ResponseCompressionDefaults.MimeTypes.Concat(new[] 
    {
        "application/json",
        "text/json",
        "text/css",
        "application/javascript",
        "text/javascript",
        "text/html",
        "text/xml",
        "application/xml"
    });
});

builder.Services.Configure<BrotliCompressionProviderOptions>(options =>
{
    options.Level = System.IO.Compression.CompressionLevel.Optimal;
});

builder.Services.Configure<GzipCompressionProviderOptions>(options =>
{
    options.Level = System.IO.Compression.CompressionLevel.Optimal;
});

// Middleware
app.UseResponseCompression();
```

#### 1.2 Headers de Cache para APIs
**Archivo**: `Controllers/Api/BuilderController.cs`
**Método**: `GetCurrentWebsite`

Agregar:
```csharp
Response.Headers.Add("Cache-Control", "public, max-age=300"); // 5 minutos
Response.Headers.Add("Vary", "Accept-Encoding");
```

### Fase 2: Optimización de Assets Estáticos

#### 2.1 Configuración de Static Files
**Archivo**: `Program.cs`
**Ubicación**: Donde está `app.UseStaticFiles()`

```csharp
app.UseStaticFiles(new StaticFileOptions
{
    OnPrepareResponse = ctx =>
    {
        var headers = ctx.Context.Response.Headers;
        
        // Cache por 1 año para assets con version
        if (ctx.Context.Request.Path.Value.Contains("?v="))
        {
            headers["Cache-Control"] = "public,max-age=31536000,immutable";
        }
        // Cache por 1 hora para otros static files
        else
        {
            headers["Cache-Control"] = "public,max-age=3600";
        }
    }
});
```

### Fase 3: Lazy Loading de Módulos JavaScript

#### 3.1 Modificar website-builder.js
**Estrategia**: Cargar módulos solo cuando se necesiten

```javascript
// En lugar de cargar todos los módulos al inicio
// Implementar carga dinámica:
async function loadModuleOnDemand(moduleName) {
    if (!window.loadedModules[moduleName]) {
        const script = document.createElement('script');
        script.src = `/js/website-builder/modules/${moduleName}.js`;
        document.head.appendChild(script);
        window.loadedModules[moduleName] = true;
    }
}
```

## 📋 Proceso de Deployment

### 1. Preparación Local (5 minutos)
```powershell
# Compilar
dotnet build -c Release

# Publicar
dotnet publish Hotel.csproj -c Release -o publish --runtime linux-x64 --self-contained false
```

### 2. Comprimir Archivos (2 minutos)
```powershell
# En PowerShell
Compress-Archive -Path publish\* -DestinationPath hotel23-optimized.zip -Force
```

### 3. Backup en Servidor (3 minutos)
```bash
ssh azureuser@20.169.209.166
mkdir -p ~/backups
cp -r /home/azureuser/hotel-app /home/azureuser/backups/hotel-app-before-optimization-$(date +%Y%m%d-%H%M%S)
```

### 4. Subir y Desplegar (5 minutos)
```powershell
# Desde local
scp hotel23-optimized.zip azureuser@20.169.209.166:/home/azureuser/
```

```bash
# En servidor
cd /home/azureuser
unzip -o hotel23-optimized.zip -d hotel-app-new/

# Detener app actual
ps aux | grep dotnet | grep -v grep | awk '{print $2}' | xargs kill -9

# Reemplazar
rm -rf hotel-app-old
mv hotel-app hotel-app-old
mv hotel-app-new hotel-app

# Iniciar
cd hotel-app
ASPNETCORE_ENVIRONMENT=Production ASPNETCORE_URLS=http://0.0.0.0:5002 nohup dotnet Hotel.dll > app.log 2>&1 &
```

## 🎯 Resultados Esperados

### Métricas de Mejora
| Recurso | Tamaño Actual | Tamaño Comprimido | Reducción |
|---------|---------------|-------------------|-----------|
| JSON API | 16.4 MB | ~500 KB | 97% |
| CSS Files | 191 KB | ~40 KB | 79% |
| JS Files | 200-206 KB c/u | ~60 KB c/u | 70% |

### Tiempo de Carga
- **Antes**: 3-5 segundos
- **Después**: 0.5-1 segundo
- **Mejora**: 80-90% más rápido

## 🔄 Plan de Rollback

Si algo sale mal:
```bash
# Detener app nueva
ps aux | grep dotnet | grep -v grep | awk '{print $2}' | xargs kill -9

# Restaurar backup
cd /home/azureuser
rm -rf hotel-app
cp -r hotel-app-old hotel-app

# Reiniciar
cd hotel-app
ASPNETCORE_ENVIRONMENT=Production ASPNETCORE_URLS=http://0.0.0.0:5002 nohup dotnet Hotel.dll > app.log 2>&1 &
```

## ✅ Checklist de Implementación

- [ ] Modificar Program.cs con ResponseCompression
- [ ] Agregar headers de cache en BuilderController
- [ ] Configurar StaticFiles con cache headers
- [ ] Compilar y publicar localmente
- [ ] Crear backup en servidor
- [ ] Subir nueva versión
- [ ] Detener app actual
- [ ] Desplegar nueva versión
- [ ] Verificar mejoras de velocidad
- [ ] Monitorear logs por errores

## 🚨 Consideraciones Importantes

1. **NO es invasivo**: Solo agrega compresión, no cambia lógica
2. **Fácil rollback**: Backup completo antes de cambios
3. **Mejora dramática**: 97% reducción en payload principal
4. **Sin costo adicional**: No requiere upgrade de servidor

## 📊 Monitoreo Post-Implementación

### Comandos de Verificación
```bash
# Ver si compresión funciona
curl -H "Accept-Encoding: gzip" -I http://test2hotelwebsite.store/api/builder/websites/current | grep -i encoding

# Medir tiempo de respuesta
time curl -s -o /dev/null http://test2hotelwebsite.store

# Ver logs
tail -f /home/azureuser/hotel-app/app.log
```

---

**Estado**: Listo para implementar
**Tiempo estimado**: 20 minutos total
**Riesgo**: Bajo (cambios no invasivos)