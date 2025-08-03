# 🔄 PLAN DE AUTOMATIZACIÓN PARA DEPLOYMENT DE CAMBIOS

## 📋 OBJETIVO
Crear un proceso automatizado para subir cambios del código fuente al servidor Azure con un solo comando, minimizando errores y tiempo de deployment.

## 🎯 ESTRATEGIA DE AUTOMATIZACIÓN

### Opción 1: Script PowerShell (Recomendado para Windows)
Crear un script `deploy-to-azure.ps1` que ejecute todo el proceso automáticamente.

### Opción 2: Script Bash para WSL
Crear un script `deploy.sh` que funcione desde WSL/Linux.

### Opción 3: GitHub Actions (CI/CD)
Configurar pipeline automatizado que se ejecute al hacer push a main.

## 📝 SCRIPT PROPUESTO: `deploy-to-azure.ps1`

```powershell
# deploy-to-azure.ps1
param(
    [Parameter(Mandatory=$false)]
    [string]$CommitMessage = "Update deployment",
    
    [Parameter(Mandatory=$false)]
    [switch]$SkipBackup = $false,
    
    [Parameter(Mandatory=$false)]
    [switch]$RunMigrations = $false
)

# Configuración
$ServerIP = "20.169.209.166"
$ServerUser = "azureuser"
$AppPath = "/home/azureuser/hotel-app"
$ProjectPath = "C:\Users\hp\Documents\Visual Studio 2022\Projects\Hotel23"

Write-Host "🚀 INICIANDO DEPLOYMENT A AZURE" -ForegroundColor Cyan
Write-Host "================================" -ForegroundColor Cyan

# Paso 1: Publicar aplicación
Write-Host "📦 Publicando aplicación..." -ForegroundColor Yellow
Set-Location $ProjectPath
dotnet publish Hotel.csproj -c Release -o publish --runtime linux-x64 --self-contained false

if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Error al publicar la aplicación" -ForegroundColor Red
    exit 1
}

# Paso 2: Comprimir archivos
Write-Host "🗜️ Comprimiendo archivos..." -ForegroundColor Yellow
tar -czf hotel23-app.tar.gz -C publish .

# Paso 3: Subir al servidor
Write-Host "📤 Subiendo archivos al servidor..." -ForegroundColor Yellow
scp hotel23-app.tar.gz "${ServerUser}@${ServerIP}:/home/${ServerUser}/"

# Paso 4: Ejecutar comandos en el servidor
Write-Host "🔧 Ejecutando deployment en el servidor..." -ForegroundColor Yellow

$remoteCommands = @"
# Detener aplicación actual
echo '⏹️ Deteniendo aplicación actual...'
ps aux | grep 'dotnet Hotel.dll' | grep -v grep | awk '{print \$2}' | xargs -r kill -9

# Backup si no se omite
$(if (-not $SkipBackup) {
    "echo '💾 Creando backup...'
    cp -r $AppPath ${AppPath}-backup-\$(date +%Y%m%d_%H%M%S)"
})

# Extraer nueva versión
echo '📂 Extrayendo nueva versión...'
cd /home/$ServerUser
tar -xzf hotel23-app.tar.gz -C hotel-app
rm hotel23-app.tar.gz

# Aplicar migraciones si se solicita
$(if ($RunMigrations) {
    "echo '🗄️ Aplicando migraciones de base de datos...'
    cd $AppPath
    # Aquí iría el comando de migraciones cuando se implemente"
})

# Iniciar aplicación
echo '▶️ Iniciando aplicación...'
cd $AppPath
ASPNETCORE_ENVIRONMENT=Production ASPNETCORE_URLS=http://0.0.0.0:5002 nohup dotnet Hotel.dll > app.log 2>&1 &
sleep 5

# Verificar que esté corriendo
if ps aux | grep -v grep | grep 'dotnet Hotel.dll' > /dev/null; then
    echo '✅ Aplicación iniciada correctamente'
else
    echo '❌ Error al iniciar la aplicación'
    tail -20 app.log
    exit 1
fi
"@

ssh "${ServerUser}@${ServerIP}" $remoteCommands

# Paso 5: Verificar deployment
Write-Host "🔍 Verificando deployment..." -ForegroundColor Yellow
$response = Invoke-WebRequest -Uri "http://$ServerIP" -UseBasicParsing -TimeoutSec 10

if ($response.StatusCode -eq 200) {
    Write-Host "✅ DEPLOYMENT COMPLETADO EXITOSAMENTE" -ForegroundColor Green
    Write-Host "🌐 La aplicación está disponible en: http://$ServerIP" -ForegroundColor Green
} else {
    Write-Host "❌ Error al verificar el deployment" -ForegroundColor Red
}

# Limpiar archivos locales
Remove-Item hotel23-app.tar.gz -ErrorAction SilentlyContinue
```

## 🛠️ SCRIPT ALTERNATIVO BASH: `deploy.sh`

```bash
#!/bin/bash

# deploy.sh
SERVER_IP="20.169.209.166"
SERVER_USER="azureuser"
APP_PATH="/home/azureuser/hotel-app"
PROJECT_PATH="/mnt/c/Users/hp/Documents/Visual Studio 2022/Projects/Hotel23"

# Colores para output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
CYAN='\033[0;36m'
NC='\033[0m'

echo -e "${CYAN}🚀 INICIANDO DEPLOYMENT A AZURE${NC}"
echo -e "${CYAN}================================${NC}"

# Cambiar al directorio del proyecto
cd "$PROJECT_PATH"

# Paso 1: Publicar
echo -e "${YELLOW}📦 Publicando aplicación...${NC}"
dotnet publish Hotel.csproj -c Release -o publish --runtime linux-x64 --self-contained false

if [ $? -ne 0 ]; then
    echo -e "${RED}❌ Error al publicar la aplicación${NC}"
    exit 1
fi

# Paso 2: Comprimir
echo -e "${YELLOW}🗜️ Comprimiendo archivos...${NC}"
tar -czf hotel23-app.tar.gz -C publish .

# Paso 3: Subir
echo -e "${YELLOW}📤 Subiendo archivos al servidor...${NC}"
scp hotel23-app.tar.gz ${SERVER_USER}@${SERVER_IP}:/home/${SERVER_USER}/

# Paso 4: Deploy remoto
echo -e "${YELLOW}🔧 Ejecutando deployment en el servidor...${NC}"
ssh ${SERVER_USER}@${SERVER_IP} << 'ENDSSH'
# Detener app
echo "⏹️ Deteniendo aplicación actual..."
ps aux | grep 'dotnet Hotel.dll' | grep -v grep | awk '{print $2}' | xargs -r kill -9

# Backup
echo "💾 Creando backup..."
cp -r /home/azureuser/hotel-app /home/azureuser/hotel-app-backup-$(date +%Y%m%d_%H%M%S)

# Extraer
echo "📂 Extrayendo nueva versión..."
cd /home/azureuser
tar -xzf hotel23-app.tar.gz -C hotel-app
rm hotel23-app.tar.gz

# Iniciar
echo "▶️ Iniciando aplicación..."
cd /home/azureuser/hotel-app
ASPNETCORE_ENVIRONMENT=Production ASPNETCORE_URLS=http://0.0.0.0:5002 nohup dotnet Hotel.dll > app.log 2>&1 &
sleep 5

# Verificar
if ps aux | grep -v grep | grep 'dotnet Hotel.dll' > /dev/null; then
    echo "✅ Aplicación iniciada correctamente"
else
    echo "❌ Error al iniciar la aplicación"
    tail -20 app.log
    exit 1
fi
ENDSSH

# Paso 5: Verificar
echo -e "${YELLOW}🔍 Verificando deployment...${NC}"
if curl -s -o /dev/null -w "%{http_code}" http://${SERVER_IP} | grep -q "200"; then
    echo -e "${GREEN}✅ DEPLOYMENT COMPLETADO EXITOSAMENTE${NC}"
    echo -e "${GREEN}🌐 La aplicación está disponible en: http://${SERVER_IP}${NC}"
else
    echo -e "${RED}❌ Error al verificar el deployment${NC}"
fi

# Limpiar
rm -f hotel23-app.tar.gz
```

## 🔧 CONFIGURACIÓN INICIAL

### Para PowerShell:
1. Guardar el script como `deploy-to-azure.ps1` en la raíz del proyecto
2. Ejecutar una vez: `Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser`
3. Uso: `.\deploy-to-azure.ps1`

### Para Bash:
1. Guardar el script como `deploy.sh` en la raíz del proyecto
2. Dar permisos: `chmod +x deploy.sh`
3. Uso: `./deploy.sh`

## 🎮 OPCIONES DE USO

### PowerShell con parámetros:
```powershell
# Deploy normal con backup
.\deploy-to-azure.ps1

# Deploy sin backup (más rápido)
.\deploy-to-azure.ps1 -SkipBackup

# Deploy con migraciones (cuando se implemente)
.\deploy-to-azure.ps1 -RunMigrations

# Deploy con mensaje personalizado
.\deploy-to-azure.ps1 -CommitMessage "Agregada funcionalidad X"
```

## 🚀 MEJORAS FUTURAS

1. **Validación Pre-Deploy**
   - Ejecutar tests antes de publicar
   - Verificar que no hay cambios sin commitear
   - Validar que la build es exitosa

2. **Rollback Automático**
   - Si falla el deployment, restaurar backup automáticamente
   - Mantener últimas 3 versiones para rollback rápido

3. **Notificaciones**
   - Enviar email/Slack cuando se complete el deployment
   - Alertas si falla el proceso

4. **Migraciones de BD**
   - Detectar si hay migraciones pendientes
   - Aplicarlas automáticamente con confirmación

5. **Zero-Downtime Deployment**
   - Implementar blue-green deployment
   - Health checks antes de cambiar tráfico

6. **Logs y Monitoreo**
   - Guardar logs de cada deployment
   - Integrar con sistema de monitoreo

## 📊 BENEFICIOS DE LA AUTOMATIZACIÓN

- **Tiempo**: De 10-15 minutos manual a 2-3 minutos automatizado
- **Errores**: Elimina errores humanos en el proceso
- **Consistencia**: Mismo proceso cada vez
- **Trazabilidad**: Logs de cada deployment
- **Rollback**: Fácil volver a versión anterior

## 🔐 CONSIDERACIONES DE SEGURIDAD

1. **SSH Keys**: Ya configuradas, no requiere contraseña
2. **Permisos**: Script solo tiene acceso a carpetas necesarias
3. **Validación**: Verificar integridad de archivos antes de deploy
4. **Backups**: Siempre crear backup antes de actualizar

## 📝 NOTAS PARA IMPLEMENTACIÓN

- Empezar con el script básico y agregar features gradualmente
- Probar en ambiente de staging primero (cuando se tenga)
- Documentar cada deployment en un log
- Considerar usar herramientas como Ansible o Terraform para mayor escalabilidad

---
**Creado**: 2 de Agosto 2025
**Para**: Sesión de trabajo nocturna de Hotel23