#!/bin/bash

echo "========================================"
echo "Verificación de Requisitos para Hotel23"
echo "========================================"
echo ""

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Function to check if a command exists
command_exists() {
    command -v "$1" >/dev/null 2>&1
}

# Check OS
echo "1. INFORMACIÓN DEL SISTEMA:"
echo "-------------------------"
cat /etc/os-release | grep -E "^(NAME|VERSION)="
uname -r
echo ""

# Check .NET Runtime
echo "2. .NET RUNTIME:"
echo "-------------------------"
if command_exists dotnet; then
    echo -e "${GREEN}✓ .NET está instalado${NC}"
    dotnet --list-runtimes
    echo ""
    echo "SDKs instalados:"
    dotnet --list-sdks
else
    echo -e "${RED}✗ .NET NO está instalado${NC}"
    echo "  Necesitas instalar .NET 8.0 Runtime"
fi
echo ""

# Check PostgreSQL
echo "3. POSTGRESQL:"
echo "-------------------------"
if command_exists psql; then
    echo -e "${GREEN}✓ PostgreSQL está instalado${NC}"
    psql --version
    
    # Check if PostgreSQL service is running
    if systemctl is-active --quiet postgresql; then
        echo -e "${GREEN}✓ PostgreSQL está ejecutándose${NC}"
    else
        echo -e "${YELLOW}⚠ PostgreSQL está instalado pero NO está ejecutándose${NC}"
    fi
else
    echo -e "${RED}✗ PostgreSQL NO está instalado${NC}"
fi
echo ""

# Check Nginx
echo "4. NGINX:"
echo "-------------------------"
if command_exists nginx; then
    echo -e "${GREEN}✓ Nginx está instalado${NC}"
    nginx -v
    
    if systemctl is-active --quiet nginx; then
        echo -e "${GREEN}✓ Nginx está ejecutándose${NC}"
    else
        echo -e "${YELLOW}⚠ Nginx está instalado pero NO está ejecutándose${NC}"
    fi
else
    echo -e "${RED}✗ Nginx NO está instalado${NC}"
fi
echo ""

# Check Firewall
echo "5. FIREWALL:"
echo "-------------------------"
if command_exists ufw; then
    echo "Estado del firewall UFW:"
    sudo ufw status
elif command_exists firewall-cmd; then
    echo "Estado del firewall:"
    sudo firewall-cmd --list-all
else
    echo -e "${YELLOW}⚠ No se detectó firewall configurado${NC}"
fi
echo ""

# Check required ports
echo "6. PUERTOS NECESARIOS:"
echo "-------------------------"
echo "Verificando puertos abiertos..."
echo "Puerto 80 (HTTP):"
ss -tlnp | grep :80 || echo -e "${YELLOW}  Puerto 80 no está escuchando${NC}"
echo "Puerto 443 (HTTPS):"
ss -tlnp | grep :443 || echo -e "${YELLOW}  Puerto 443 no está escuchando${NC}"
echo "Puerto 5432 (PostgreSQL):"
ss -tlnp | grep :5432 || echo -e "${YELLOW}  Puerto 5432 no está escuchando${NC}"
echo ""

# Check disk space
echo "7. ESPACIO EN DISCO:"
echo "-------------------------"
df -h | grep -E "^/dev/"
echo ""

# Check RAM
echo "8. MEMORIA RAM:"
echo "-------------------------"
free -h
echo ""

# Summary
echo "========================================"
echo "RESUMEN DE COMPONENTES FALTANTES:"
echo "========================================"
echo ""

if ! command_exists dotnet; then
    echo -e "${RED}1. Instalar .NET 8.0 Runtime${NC}"
fi

if ! command_exists psql; then
    echo -e "${RED}2. Instalar PostgreSQL${NC}"
fi

if ! command_exists nginx; then
    echo -e "${RED}3. Instalar Nginx${NC}"
fi

echo ""
echo "Para ver los comandos de instalación, ejecuta:"
echo "./install-dependencies.sh"