# Configuración SSH MCP Server

## ✅ Instalación Completada
- SSH MCP Server instalado: `@idletoaster/ssh-mcp-server`
- Configuración añadida a Claude Desktop

## 🔧 Pasos para Configurar

### 1. Editar el archivo de configuración SSH
Edita el archivo: `C:\Users\hp\.ssh-mcp-config.json`

Reemplaza estos valores con los de tu servidor:
```json
{
  "connections": [
    {
      "name": "digital-ocean-server",
      "host": "TU_IP_DEL_SERVIDOR",  // <- Pon la IP de tu droplet aquí
      "port": 22,
      "username": "root",              // <- O el usuario que uses
      "privateKeyPath": "C:\\Users\\hp\\.ssh\\id_rsa"  // <- Ruta a tu clave SSH
    }
  ],
  "defaultConnection": "digital-ocean-server"
}
```

### 2. Opciones de Autenticación

#### Opción A: Usar clave SSH (Recomendado)
```json
"privateKeyPath": "C:\\Users\\hp\\.ssh\\id_rsa"
```

#### Opción B: Usar contraseña
```json
"password": "tu_contraseña_aqui"
```

### 3. Si NO tienes clave SSH, créala:
```powershell
# En PowerShell
ssh-keygen -t rsa -b 4096 -C "tu_email@ejemplo.com"

# Copia la clave pública a tu servidor
type C:\Users\hp\.ssh\id_rsa.pub | ssh root@TU_IP_SERVIDOR "mkdir -p ~/.ssh && cat >> ~/.ssh/authorized_keys"
```

### 4. Reiniciar Claude Desktop
1. Cierra Claude Desktop completamente
2. Abre Claude Desktop
3. Deberías ver "ssh-server" en la parte inferior izquierda

## 🚀 Uso del SSH MCP

Una vez configurado, podré:
- Ejecutar comandos en tu servidor
- Transferir archivos
- Configurar servicios
- Hacer el deployment de tu aplicación

## ⚠️ Importante
- Asegúrate de que tu servidor permita conexiones SSH en el puerto 22
- Si usas un puerto diferente, cámbialo en la configuración
- La IP debe ser la IP pública de tu droplet de Digital Ocean