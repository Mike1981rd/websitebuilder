#!/bin/bash

echo "========================================"
echo "Verificación del Servidor Digital Ocean"
echo "========================================"
echo ""

# Colors
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m'

echo "1. SISTEMA OPERATIVO:"
echo "---------------------"
cat /etc/os-release | grep -E "^(NAME|VERSION)="
echo ""

echo "2. .NET RUNTIME:"
echo "---------------------"
if command -v dotnet >/dev/null 2>&1; then
    echo -e "${GREEN}✓ .NET instalado${NC}"
    dotnet --version
    echo "Runtimes:"
    dotnet --list-runtimes
else
    echo -e "${RED}✗ .NET NO instalado${NC}"
fi
echo ""

echo "3. POSTGRESQL:"
echo "---------------------"
if command -v psql >/dev/null 2>&1; then
    echo -e "${GREEN}✓ PostgreSQL instalado${NC}"
    psql --version
    if systemctl is-active --quiet postgresql; then
        echo -e "${GREEN}✓ PostgreSQL ejecutándose${NC}"
    else
        echo -e "${YELLOW}⚠ PostgreSQL NO ejecutándose${NC}"
    fi
else
    echo -e "${RED}✗ PostgreSQL NO instalado${NC}"
fi
echo ""

echo "4. NGINX:"
echo "---------------------"
if command -v nginx >/dev/null 2>&1; then
    echo -e "${GREEN}✓ Nginx instalado${NC}"
    nginx -v
    if systemctl is-active --quiet nginx; then
        echo -e "${GREEN}✓ Nginx ejecutándose${NC}"
    else
        echo -e "${YELLOW}⚠ Nginx NO ejecutándose${NC}"
    fi
else
    echo -e "${RED}✗ Nginx NO instalado${NC}"
fi
echo ""

echo "5. APLICACIONES EXISTENTES:"
echo "---------------------"
echo "En /var/www:"
ls -la /var/www/ 2>/dev/null || echo "Directorio no existe"
echo ""
echo "En /opt:"
ls -la /opt/ 2>/dev/null || echo "Directorio no existe"
echo ""

echo "6. RECURSOS DEL SISTEMA:"
echo "---------------------"
echo "Espacio en disco:"
df -h | grep -E "^/dev/"
echo ""
echo "Memoria RAM:"
free -h
echo ""

echo "7. PUERTOS ABIERTOS:"
echo "---------------------"
ss -tlnp | grep -E "(:80|:443|:5432|:5000)" 2>/dev/null || netstat -tlnp | grep -E "(:80|:443|:5432|:5000)" 2>/dev/null
echo ""

echo "========================================"
echo "FIN DE LA VERIFICACIÓN"
echo "========================================"