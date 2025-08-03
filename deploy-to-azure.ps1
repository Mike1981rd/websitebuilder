# deploy-to-azure.ps1
# Script de deployment automatizado para Hotel23 - Azure App Service
# Versión: 2.0 - Corregido
# Fecha: Agosto 2025

param(
    [Parameter(Mandatory=$false)]
    [string]$CommitMessage = "Update deployment $(Get-Date -Format 'yyyy-MM-dd HH:mm')",
    
    [Parameter(Mandatory=$false)]
    [switch]$SkipBackup = $false,
    
    [Parameter(Mandatory=$false)]
    [switch]$TestMode = $false,
    
    [Parameter(Mandatory=$false)]
    [switch]$SkipBuild = $false
)

# Configuración del servidor
$ServerIP = "20.169.209.166"
$ServerUser = "azureuser"
$AppPath = "/home/azureuser/hotel-app"
$ProjectPath = Get-Location
$ProjectName = "Hotel.csproj"

# Registrar tiempo de inicio
$startTime = Get-Date

# Función para logging con colores
function Write-ColorLog {
    param(
        [string]$Message,
        [string]$Level = "Info"
    )
    
    $timestamp = Get-Date -Format "HH:mm:ss"
    switch ($Level) {
        "Success" { Write-Host "[$timestamp] $Message" -ForegroundColor Green }
        "Error" { Write-Host "[$timestamp] $Message" -ForegroundColor Red }
        "Warning" { Write-Host "[$timestamp] $Message" -ForegroundColor Yellow }
        "Info" { Write-Host "[$timestamp] $Message" -ForegroundColor Cyan }
        default { Write-Host "[$timestamp] $Message" }
    }
}

# Función para ejecutar comandos SSH
function Invoke-SSHCommand {
    param(
        [string]$Command,
        [string]$Description = ""
    )
    
    if ($Description) {
        Write-ColorLog $Description -Level "Info"
    }
    
    $sshCommand = "ssh $ServerUser@$ServerIP '$Command'"
    
    if ($TestMode) {
        Write-ColorLog "TEST MODE - Would execute: $Command" -Level "Warning"
        return $true
    }
    
    $result = ssh "$ServerUser@$ServerIP" "$Command" 2>&1
    $exitCode = $LASTEXITCODE
    
    if ($exitCode -eq 0) {
        return $result
    } else {
        throw "SSH command failed: $result"
    }
}

Write-Host ""
Write-ColorLog "🚀 INICIANDO DEPLOYMENT A AZURE - HOTEL23" -Level "Info"
Write-Host "=========================================" -ForegroundColor Cyan
Write-ColorLog "📅 Fecha: $(Get-Date -Format 'yyyy-MM-dd HH:mm:ss')"
Write-ColorLog "🎯 Servidor: $ServerIP"
Write-ColorLog "📁 Proyecto: $ProjectPath"

if ($TestMode) {
    Write-ColorLog "⚠️  MODO DE PRUEBA ACTIVADO - No se realizarán cambios reales" -Level "Warning"
}
Write-Host ""

# Verificar que estamos en el directorio correcto
if (-not (Test-Path $ProjectName)) {
    Write-ColorLog "❌ ERROR: No se encontró $ProjectName en el directorio actual" -Level "Error"
    Write-ColorLog "   Asegúrate de ejecutar este script desde la raíz del proyecto" -Level "Warning"
    exit 1
}

# Verificar configuración problemática
Write-ColorLog "🔍 Verificando configuración..." -Level "Info"
$prodConfig = Get-Content "appsettings.Production.json" -Raw | ConvertFrom-Json
if ($prodConfig.Kestrel) {
    Write-ColorLog "⚠️  ADVERTENCIA: Se detectó configuración Kestrel en appsettings.Production.json" -Level "Warning"
    Write-ColorLog "   Esto puede causar conflictos de puerto. Considera remover esta sección." -Level "Warning"
    
    if (-not $TestMode) {
        $response = Read-Host "¿Deseas continuar de todos modos? (S/N)"
        if ($response -ne "S" -and $response -ne "s") {
            Write-ColorLog "Deployment cancelado por el usuario" -Level "Warning"
            exit 0
        }
    }
}

try {
    # Paso 1: Verificar conexión SSH
    Write-ColorLog "🔐 Verificando conexión SSH..." -Level "Info"
    $sshTest = Invoke-SSHCommand -Command "echo 'SSH OK'" -Description ""
    if ($sshTest -match "SSH OK") {
        Write-ColorLog "✅ Conexión SSH verificada" -Level "Success"
    }

    # Paso 2: Limpiar publicaciones anteriores
    if (-not $SkipBuild) {
        Write-ColorLog "🧹 Limpiando publicaciones anteriores..." -Level "Info"
        if (Test-Path "publish") {
            Remove-Item -Path "publish" -Recurse -Force
        }
        if (Test-Path "hotel23-app.tar.gz") {
            Remove-Item -Path "hotel23-app.tar.gz" -Force
        }

        # Paso 3: Publicar aplicación
        Write-ColorLog "📦 Publicando aplicación..." -Level "Info"
        Write-ColorLog "   Esto puede tomar unos minutos..." -Level "Info"

        $publishArgs = @(
            "publish"
            $ProjectName
            "-c", "Release"
            "-o", "publish"
            "--runtime", "linux-x64"
            "--self-contained", "false"
        )

        if (-not $TestMode) {
            $publishResult = & dotnet $publishArgs 2>&1
            if ($LASTEXITCODE -ne 0) {
                Write-ColorLog "❌ Error al publicar la aplicación" -Level "Error"
                Write-ColorLog $publishResult -Level "Error"
                exit 1
            }
        }

        Write-ColorLog "✅ Publicación completada exitosamente" -Level "Success"

        # Paso 4: Comprimir archivos
        Write-ColorLog "🗜️  Comprimiendo archivos..." -Level "Info"
        
        if (-not $TestMode) {
            tar -czf hotel23-app.tar.gz -C publish .
            
            if (-not (Test-Path "hotel23-app.tar.gz")) {
                Write-ColorLog "❌ Error al comprimir los archivos" -Level "Error"
                exit 1
            }
            
            $fileSize = (Get-Item "hotel23-app.tar.gz").Length / 1MB
            Write-ColorLog "✅ Archivo comprimido: $([math]::Round($fileSize, 2)) MB" -Level "Success"
        }
    } else {
        Write-ColorLog "⚡ Saltando build (usando build anterior)" -Level "Warning"
        if (-not (Test-Path "hotel23-app.tar.gz")) {
            Write-ColorLog "❌ No se encontró hotel23-app.tar.gz" -Level "Error"
            exit 1
        }
    }

    # Paso 5: Subir al servidor
    if (-not $TestMode) {
        Write-ColorLog "📤 Subiendo archivos al servidor..." -Level "Info"
        Write-ColorLog "   Esto puede tomar unos minutos dependiendo de la conexión..." -Level "Info"
        
        scp hotel23-app.tar.gz "${ServerUser}@${ServerIP}:/home/${ServerUser}/" 2>&1 | Out-Null
        
        if ($LASTEXITCODE -ne 0) {
            Write-ColorLog "❌ Error al subir archivos al servidor" -Level "Error"
            exit 1
        }
        
        Write-ColorLog "✅ Archivos subidos exitosamente" -Level "Success"
    }

    # Paso 6: Ejecutar deployment en el servidor
    Write-ColorLog "🔧 Ejecutando deployment en el servidor..." -Level "Info"
    
    # Detener aplicación actual y limpiar procesos
    Write-ColorLog "⏹️  Deteniendo aplicación actual..." -Level "Info"
    Invoke-SSHCommand -Command "pkill -9 dotnet || true" | Out-Null
    Start-Sleep -Seconds 2
    
    # Verificar que el puerto esté libre
    $portCheck = Invoke-SSHCommand -Command "lsof -i:5002 2>/dev/null || echo 'Puerto libre'"
    if ($portCheck -notmatch "Puerto libre") {
        Write-ColorLog "⚠️  Puerto 5002 aún ocupado, forzando liberación..." -Level "Warning"
        Invoke-SSHCommand -Command "fuser -k 5002/tcp 2>/dev/null || true" | Out-Null
        Start-Sleep -Seconds 2
    }
    
    # Crear backup si no se omite
    if (-not $SkipBackup -and -not $TestMode) {
        Write-ColorLog "💾 Creando backup..." -Level "Info"
        $backupName = "hotel-app-backup-$(Get-Date -Format 'yyyyMMdd_HHmmss')"
        Invoke-SSHCommand -Command "cp -r $AppPath /home/$ServerUser/$backupName 2>/dev/null || true" | Out-Null
        
        # Mantener solo los últimos 3 backups
        Write-ColorLog "🧹 Limpiando backups antiguos..." -Level "Info"
        Invoke-SSHCommand -Command "ls -dt /home/$ServerUser/hotel-app-backup-* 2>/dev/null | tail -n +4 | xargs -r rm -rf" | Out-Null
    }
    
    # Extraer nueva versión
    if (-not $TestMode) {
        Write-ColorLog "📂 Extrayendo nueva versión..." -Level "Info"
        Invoke-SSHCommand -Command "cd /home/$ServerUser && tar -xzf hotel23-app.tar.gz -C hotel-app" | Out-Null
        Invoke-SSHCommand -Command "rm /home/$ServerUser/hotel23-app.tar.gz" | Out-Null
    }
    
    # Iniciar aplicación
    Write-ColorLog "▶️  Iniciando aplicación..." -Level "Info"
    
    if (-not $TestMode) {
        $startCommand = @"
cd $AppPath
export ASPNETCORE_ENVIRONMENT=Production
export ASPNETCORE_URLS=http://0.0.0.0:5002
nohup dotnet Hotel.dll > app.log 2>&1 &
"@
        
        Invoke-SSHCommand -Command $startCommand | Out-Null
        
        Write-ColorLog "⏳ Esperando que la aplicación inicie..." -Level "Info"
        Start-Sleep -Seconds 10
        
        # Verificar que esté corriendo
        $processCheck = Invoke-SSHCommand -Command "ps aux | grep -v grep | grep 'dotnet Hotel.dll'"
        
        if ($processCheck) {
            Write-ColorLog "✅ Aplicación iniciada correctamente" -Level "Success"
            
            # Mostrar últimas líneas del log
            Write-ColorLog "📋 Últimas líneas del log:" -Level "Info"
            $logs = Invoke-SSHCommand -Command "tail -5 $AppPath/app.log"
            Write-Host $logs
            
            # Verificar el puerto
            $portStatus = Invoke-SSHCommand -Command "lsof -i:5002 2>/dev/null"
            if ($portStatus) {
                Write-ColorLog "✅ Puerto 5002 activo y escuchando" -Level "Success"
            }
        } else {
            Write-ColorLog "❌ Error al iniciar la aplicación" -Level "Error"
            $errorLogs = Invoke-SSHCommand -Command "tail -20 $AppPath/app.log"
            Write-Host $errorLogs
            exit 1
        }
    }

    # Paso 7: Verificar deployment
    Write-ColorLog "🔍 Verificando deployment..." -Level "Info"
    Start-Sleep -Seconds 3
    
    if (-not $TestMode) {
        try {
            $response = Invoke-WebRequest -Uri "http://$ServerIP" -UseBasicParsing -TimeoutSec 15
            
            if ($response.StatusCode -eq 200) {
                Write-Host ""
                Write-ColorLog "✅ DEPLOYMENT COMPLETADO EXITOSAMENTE" -Level "Success"
                Write-Host "=========================================" -ForegroundColor Green
                Write-ColorLog "🌐 URL de la aplicación: http://$ServerIP" -Level "Info"
                Write-ColorLog "📝 Mensaje: $CommitMessage"
                
                $duration = [math]::Round(((Get-Date) - $startTime).TotalSeconds, 2)
                Write-ColorLog "⏱️  Tiempo total: $duration segundos"
                Write-Host ""
                
                if ($SkipBackup) {
                    Write-ColorLog "⚡ Backup omitido por solicitud" -Level "Warning"
                }
            } else {
                Write-ColorLog "⚠️  La aplicación respondió con código: $($response.StatusCode)" -Level "Warning"
            }
        } catch {
            Write-ColorLog "⚠️  No se pudo verificar el deployment automáticamente" -Level "Warning"
            Write-ColorLog "   Verifica manualmente en: http://$ServerIP" -Level "Info"
        }
    }

} catch {
    Write-ColorLog "❌ ERROR: $_" -Level "Error"
    exit 1
} finally {
    # Limpiar archivos locales
    if (Test-Path "hotel23-app.tar.gz") {
        Write-ColorLog "🧹 Limpiando archivos temporales..." -Level "Info"
        Remove-Item "hotel23-app.tar.gz" -ErrorAction SilentlyContinue
    }
}

# Guardar en log
if (-not $TestMode) {
    $logEntry = "$(Get-Date -Format 'yyyy-MM-dd HH:mm:ss') | $CommitMessage | Success | $([math]::Round(((Get-Date) - $startTime).TotalSeconds, 2))s"
    $logEntry | Out-File -FilePath "deployments.log" -Append
}

Write-ColorLog "✅ Proceso completado" -Level "Success"