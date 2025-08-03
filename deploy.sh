#!/bin/bash
# deploy.sh
# Script de deployment automatizado para Hotel23 - Azure App Service (WSL/Linux)
# Versión: 1.0
# Fecha: Agosto 2025

# Configuración del servidor
SERVER_IP="20.169.209.166"
SERVER_USER="azureuser"
APP_PATH="/home/azureuser/hotel-app"
PROJECT_PATH="/mnt/c/Users/hp/Documents/Visual Studio 2022/Projects/Hotel23"
PROJECT_NAME="Hotel.csproj"

# Colores para output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
CYAN='\033[0;36m'
GRAY='\033[0;37m'
NC='\033[0m' # No Color

# Parámetros por defecto
SKIP_BACKUP=false
QUICK_DEPLOY=false
COMMIT_MESSAGE="Update deployment $(date +'%Y-%m-%d %H:%M')"

# Procesar argumentos
while [[ $# -gt 0 ]]; do
    case $1 in
        --skip-backup)
            SKIP_BACKUP=true
            shift
            ;;
        --quick)
            QUICK_DEPLOY=true
            shift
            ;;
        --message)
            COMMIT_MESSAGE="$2"
            shift 2
            ;;
        *)
            echo -e "${RED}Argumento desconocido: $1${NC}"
            echo "Uso: ./deploy.sh [--skip-backup] [--quick] [--message 'mensaje']"
            exit 1
            ;;
    esac
done

echo ""
echo -e "${CYAN}🚀 INICIANDO DEPLOYMENT A AZURE - HOTEL23${NC}"
echo -e "${CYAN}=========================================${NC}"
echo -e "${GRAY}📅 Fecha: $(date +'%Y-%m-%d %H:%M:%S')${NC}"
echo -e "${GRAY}🎯 Servidor: $SERVER_IP${NC}"
echo -e "${GRAY}📁 Proyecto: $PROJECT_PATH${NC}"
echo ""

# Cambiar al directorio del proyecto
cd "$PROJECT_PATH"

# Verificar que estamos en el directorio correcto
if [ ! -f "$PROJECT_NAME" ]; then
    echo -e "${RED}❌ ERROR: No se encontró $PROJECT_NAME en el directorio actual${NC}"
    echo -e "${YELLOW}   Asegúrate de ejecutar este script desde la raíz del proyecto${NC}"
    exit 1
fi

# Verificar conexión SSH
echo -e "${YELLOW}🔐 Verificando conexión SSH...${NC}"
if ! ssh -o ConnectTimeout=5 -o BatchMode=yes ${SERVER_USER}@${SERVER_IP} "echo 'SSH OK'" > /dev/null 2>&1; then
    echo -e "${RED}❌ No se puede conectar al servidor via SSH${NC}"
    echo -e "${YELLOW}   Verifica tu configuración SSH${NC}"
    exit 1
fi
echo -e "${GREEN}✅ Conexión SSH verificada${NC}"

# Paso 1: Limpiar publicaciones anteriores
echo -e "${YELLOW}🧹 Limpiando publicaciones anteriores...${NC}"
rm -rf publish
rm -f hotel23-app.tar.gz

# Paso 2: Publicar aplicación
echo -e "${YELLOW}📦 Publicando aplicación...${NC}"
echo -e "${GRAY}   Esto puede tomar unos minutos...${NC}"

PUBLISH_ARGS="publish $PROJECT_NAME -c Release -o publish --runtime linux-x64 --self-contained false"

if [ "$QUICK_DEPLOY" = true ]; then
    PUBLISH_ARGS="$PUBLISH_ARGS --no-restore"
fi

if ! dotnet $PUBLISH_ARGS; then
    echo -e "${RED}❌ Error al publicar la aplicación${NC}"
    echo -e "${YELLOW}   Verifica que no hay errores de compilación${NC}"
    exit 1
fi

echo -e "${GREEN}✅ Publicación completada exitosamente${NC}"

# Paso 3: Comprimir archivos
echo -e "${YELLOW}🗜️  Comprimiendo archivos...${NC}"
tar -czf hotel23-app.tar.gz -C publish .

if [ ! -f "hotel23-app.tar.gz" ]; then
    echo -e "${RED}❌ Error al comprimir los archivos${NC}"
    exit 1
fi

FILE_SIZE=$(du -h hotel23-app.tar.gz | cut -f1)
echo -e "${GREEN}✅ Archivo comprimido: $FILE_SIZE${NC}"

# Paso 4: Subir al servidor
echo -e "${YELLOW}📤 Subiendo archivos al servidor...${NC}"
echo -e "${GRAY}   Esto puede tomar unos minutos dependiendo de la conexión...${NC}"

if ! scp hotel23-app.tar.gz ${SERVER_USER}@${SERVER_IP}:/home/${SERVER_USER}/; then
    echo -e "${RED}❌ Error al subir archivos al servidor${NC}"
    exit 1
fi

echo -e "${GREEN}✅ Archivos subidos exitosamente${NC}"

# Paso 5: Ejecutar comandos en el servidor
echo -e "${YELLOW}🔧 Ejecutando deployment en el servidor...${NC}"

# Preparar script remoto
REMOTE_SCRIPT=$(cat << 'ENDSCRIPT'
#!/bin/bash
set -e

echo "🔄 Iniciando proceso de deployment..."

# Verificar si la aplicación está corriendo
PID=$(ps aux | grep 'dotnet Hotel.dll' | grep -v grep | awk '{print $2}' | head -1)

if [ ! -z "$PID" ]; then
    echo "⏹️  Deteniendo aplicación actual (PID: $PID)..."
    kill -15 $PID 2>/dev/null || true
    sleep 3
    # Forzar si aún está corriendo
    kill -9 $PID 2>/dev/null || true
else
    echo "ℹ️  La aplicación no está corriendo actualmente"
fi

ENDSCRIPT
)

# Agregar backup si no se omite
if [ "$SKIP_BACKUP" = false ]; then
    REMOTE_SCRIPT+=$(cat << 'ENDSCRIPT'

echo "💾 Creando backup..."
BACKUP_DIR="/home/azureuser/hotel-app-backup-$(date +%Y%m%d_%H%M%S)"
if [ -d "/home/azureuser/hotel-app" ]; then
    cp -r "/home/azureuser/hotel-app" "$BACKUP_DIR"
    echo "✅ Backup creado en: $BACKUP_DIR"
    
    # Mantener solo los últimos 3 backups
    echo "🧹 Limpiando backups antiguos..."
    ls -dt /home/azureuser/hotel-app-backup-* | tail -n +4 | xargs -r rm -rf
fi
ENDSCRIPT
)
else
    REMOTE_SCRIPT+="
echo '⚡ Saltando backup (--skip-backup activado)'"
fi

# Continuar con el resto del script
REMOTE_SCRIPT+=$(cat << 'ENDSCRIPT'

# Crear directorio si no existe
if [ ! -d "/home/azureuser/hotel-app" ]; then
    echo "📁 Creando directorio de aplicación..."
    mkdir -p "/home/azureuser/hotel-app"
fi

# Extraer nueva versión
echo "📂 Extrayendo nueva versión..."
cd /home/azureuser
tar -xzf hotel23-app.tar.gz -C hotel-app
rm hotel23-app.tar.gz

# Aplicar permisos
echo "🔐 Aplicando permisos..."
chmod +x /home/azureuser/hotel-app/Hotel

# Verificar archivo de configuración
if [ ! -f "/home/azureuser/hotel-app/appsettings.Production.json" ]; then
    echo "⚠️  ADVERTENCIA: No se encontró appsettings.Production.json"
fi

# Verificar que el puerto esté libre
if lsof -i:5002 > /dev/null 2>&1; then
    echo "⚠️  Puerto 5002 en uso, liberando..."
    fuser -k 5002/tcp || true
    sleep 2
fi

# Iniciar aplicación
echo "▶️  Iniciando aplicación..."
cd /home/azureuser/hotel-app

# Limpiar logs antiguos
if [ -f app.log ]; then
    mv app.log app.log.$(date +%Y%m%d_%H%M%S)
    # Mantener solo los últimos 5 logs
    ls -t app.log.* 2>/dev/null | tail -n +6 | xargs -r rm -f
fi

# Iniciar con nohup
export ASPNETCORE_ENVIRONMENT=Production
export ASPNETCORE_URLS=http://0.0.0.0:5002
nohup dotnet Hotel.dll > app.log 2>&1 &

echo "⏳ Esperando que la aplicación inicie..."
sleep 8

# Verificar que esté corriendo
for i in {1..5}; do
    if ps aux | grep -v grep | grep 'dotnet Hotel.dll' > /dev/null; then
        echo "✅ Aplicación iniciada correctamente"
        
        # Mostrar últimas líneas del log
        echo ""
        echo "📋 Últimas líneas del log:"
        echo "------------------------"
        tail -5 app.log
        echo "------------------------"
        
        # Verificar el puerto
        if lsof -i:5002 > /dev/null 2>&1; then
            echo "✅ Puerto 5002 activo y escuchando"
        else
            echo "⚠️  La aplicación está corriendo pero el puerto 5002 no responde aún"
        fi
        
        exit 0
    fi
    echo "   Intento $i/5..."
    sleep 2
done

echo "❌ Error al iniciar la aplicación"
echo "📋 Log de errores:"
echo "------------------------"
tail -20 app.log
echo "------------------------"
exit 1
ENDSCRIPT
)

# Ejecutar script remoto
if ! ssh ${SERVER_USER}@${SERVER_IP} "$REMOTE_SCRIPT"; then
    echo -e "${RED}❌ Error durante el deployment en el servidor${NC}"
    exit 1
fi

# Paso 6: Verificar deployment
echo ""
echo -e "${YELLOW}🔍 Verificando deployment...${NC}"

# Esperar un poco más para que la aplicación esté completamente lista
sleep 3

# Verificar con curl
if curl -s -o /dev/null -w "%{http_code}" http://${SERVER_IP} | grep -q "200"; then
    echo ""
    echo -e "${GREEN}✅ DEPLOYMENT COMPLETADO EXITOSAMENTE${NC}"
    echo -e "${GREEN}=========================================${NC}"
    echo -e "${CYAN}🌐 URL de la aplicación: http://$SERVER_IP${NC}"
    echo -e "${GRAY}📝 Mensaje: $COMMIT_MESSAGE${NC}"
    echo ""
    
    # Mostrar información adicional
    if [ "$SKIP_BACKUP" = true ]; then
        echo -e "${YELLOW}⚡ Modo rápido: No se creó backup${NC}"
    fi
    
    # Preguntar si abrir en navegador
    echo -n "¿Deseas abrir la aplicación en el navegador? (S/N): "
    read -r OPEN_BROWSER
    if [[ "$OPEN_BROWSER" =~ ^[Ss]$ ]]; then
        if command -v xdg-open > /dev/null; then
            xdg-open "http://$SERVER_IP"
        elif command -v open > /dev/null; then
            open "http://$SERVER_IP"
        else
            echo -e "${YELLOW}No se pudo detectar el comando para abrir el navegador${NC}"
        fi
    fi
else
    echo -e "${YELLOW}⚠️  La aplicación puede estar iniciándose aún...${NC}"
    echo -e "${YELLOW}   Intenta acceder manualmente a: http://$SERVER_IP${NC}"
    echo -e "${GRAY}   O ejecuta: ssh ${SERVER_USER}@${SERVER_IP} 'tail -50 /home/azureuser/hotel-app/app.log'${NC}"
fi

# Limpiar archivos locales
echo -e "${YELLOW}🧹 Limpiando archivos temporales...${NC}"
rm -f hotel23-app.tar.gz
if [ "$QUICK_DEPLOY" = false ]; then
    rm -rf publish
fi

echo -e "${GREEN}✅ Proceso completado${NC}"

# Agregar al historial
echo "$(date +'%Y-%m-%d %H:%M:%S') | $COMMIT_MESSAGE | Success" >> deployments.log