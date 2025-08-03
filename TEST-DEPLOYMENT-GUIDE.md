# 🧪 GUÍA DE PRUEBA DEL SCRIPT DE DEPLOYMENT

## 🎯 Cómo probar el script sin romper producción

### 1️⃣ **MODO DE PRUEBA (TestMode)**

El script corregido incluye un parámetro `-TestMode` que simula todo el proceso SIN hacer cambios reales:

```powershell
# Ejecutar en modo prueba - NO hace cambios reales
.\deploy-to-azure.ps1 -TestMode
```

Este modo:
- ✅ Verifica conexión SSH
- ✅ Verifica configuración problemática (Kestrel)
- ✅ Simula todos los pasos
- ❌ NO compila realmente
- ❌ NO sube archivos
- ❌ NO modifica el servidor

### 2️⃣ **PRUEBA PARCIAL CON BUILD LOCAL**

Puedes probar solo la compilación sin afectar el servidor:

```powershell
# Solo compilar y comprimir, sin subir
.\deploy-to-azure.ps1 -TestMode

# Verificar que se creó el archivo
dir hotel23-app.tar.gz
```

### 3️⃣ **PRUEBA COMPLETA SEGURA**

Para la próxima actualización real, usa estos pasos seguros:

#### Paso 1: Verificar configuración
```powershell
# Primero, modo prueba para verificar todo
.\deploy-to-azure.ps1 -TestMode
```

#### Paso 2: Si todo se ve bien, ejecutar con backup
```powershell
# Ejecutar deployment real CON backup (por seguridad)
.\deploy-to-azure.ps1 -CommitMessage "Prueba de script corregido"
```

#### Paso 3: Si algo sale mal, restaurar backup
```bash
# Conectar al servidor
ssh azureuser@20.169.209.166

# Ver backups disponibles
ls -la /home/azureuser/hotel-app-backup-*

# Restaurar el más reciente
cp -r /home/azureuser/hotel-app-backup-YYYYMMDD_HHMMSS/* /home/azureuser/hotel-app/

# Reiniciar aplicación
cd /home/azureuser/hotel-app
pkill -9 dotnet
ASPNETCORE_ENVIRONMENT=Production ASPNETCORE_URLS=http://0.0.0.0:5002 nohup dotnet Hotel.dll > app.log 2>&1 &
```

## 🔍 VERIFICACIONES PRE-DEPLOYMENT

Antes de ejecutar el script real:

1. **Verificar appsettings.Production.json**
   ```powershell
   # El script ahora detecta y advierte sobre Kestrel
   cat appsettings.Production.json | Select-String "Kestrel"
   ```

2. **Verificar procesos en el servidor**
   ```bash
   ssh azureuser@20.169.209.166 'ps aux | grep dotnet'
   ```

3. **Verificar espacio en disco**
   ```bash
   ssh azureuser@20.169.209.166 'df -h'
   ```

## 🛡️ CARACTERÍSTICAS DE SEGURIDAD DEL SCRIPT

1. **Detección de Kestrel**: Advierte si hay configuración problemática
2. **Limpieza de procesos**: Usa `pkill -9` para asegurar limpieza
3. **Verificación de puerto**: Chequea y libera puerto 5002
4. **Backups automáticos**: Mantiene últimos 3 backups
5. **Logs detallados**: Todo queda registrado con timestamps
6. **Manejo de errores**: Try-catch con limpieza automática

## 📊 PARÁMETROS DISPONIBLES

```powershell
# Modo prueba - simula sin cambios
.\deploy-to-azure.ps1 -TestMode

# Sin backup (más rápido, menos seguro)
.\deploy-to-azure.ps1 -SkipBackup

# Usar build existente (no recompila)
.\deploy-to-azure.ps1 -SkipBuild

# Mensaje personalizado
.\deploy-to-azure.ps1 -CommitMessage "Fix: Corrección de bug X"

# Combinaciones
.\deploy-to-azure.ps1 -TestMode -SkipBackup
.\deploy-to-azure.ps1 -SkipBuild -CommitMessage "Hotfix rápido"
```

## ✅ CAMBIOS PRINCIPALES EN EL SCRIPT

1. **PowerShell puro**: Sin mezcla de sintaxis Bash
2. **Función SSH dedicada**: `Invoke-SSHCommand` maneja todos los comandos
3. **Verificación de Kestrel**: Detecta y advierte configuración problemática
4. **pkill -9 dotnet**: Limpieza agresiva de procesos
5. **TestMode**: Permite simulación segura
6. **Mejor logging**: Con timestamps y colores

## 🚨 SI ALGO SALE MAL

1. **Script falla al inicio**: Verificar que estás en la carpeta del proyecto
2. **Error de SSH**: Verificar conexión `ssh azureuser@20.169.209.166`
3. **Puerto ocupado**: El script ahora limpia automáticamente
4. **App no inicia**: Revisar logs con el comando mostrado en pantalla

---
**Creado**: 3 de Agosto 2025
**Para**: Prueba segura del script de deployment corregido