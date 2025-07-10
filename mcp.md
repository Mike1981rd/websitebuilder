# 🔌 Plan de Implementación MCP - Hotel Admin

**Fecha de inicio**: Enero 2025  
**Objetivo**: Crear un servidor MCP que permita a Claude interactuar con todo el sistema Hotel Admin sin modificar el código existente.

## 📋 Resumen Ejecutivo

MCP (Model Context Protocol) permitirá que Claude pueda:
- Gestionar empresas, usuarios y roles
- Crear productos y colecciones
- Construir sitios web completos usando el Website Builder
- Ejecutar tareas administrativas
- Todo esto SIN modificar una sola línea del código actual

## 🏗️ Arquitectura

```
┌─────────────┐     ┌──────────────┐     ┌─────────────────┐
│   Claude    │ ←→  │  MCP Server  │ ←→  │  Hotel Admin    │
│             │     │ (Node.js)    │     │ (ASP.NET Core)  │
└─────────────┘     └──────────────┘     └─────────────────┘
                           ↓
                    ┌──────────────┐
                    │ package.json │
                    │ mcp-server.js│
                    └──────────────┘
```

## 📁 Estructura de Archivos (NO invasiva)

```
/Hotel23/
├── [Todo tu proyecto actual sin cambios]
└── mcp/                              # Nueva carpeta
    ├── hotel-mcp-server.js          # Servidor principal
    ├── package.json                 # Dependencias
    ├── config.json                  # Configuración
    └── tools/                       # Herramientas organizadas
        ├── company-tools.js
        ├── user-tools.js
        ├── product-tools.js
        └── website-builder-tools.js
```

## 🛠️ Herramientas a Implementar

### Fase 1: Herramientas Básicas (Esta noche)
```javascript
// 1. Gestión de Empresa
- company_get_current    // Obtener empresa actual
- company_create         // Crear nueva empresa
- company_update         // Actualizar datos

// 2. Navegación
- navigate_to_module     // Ir a cualquier módulo
- get_current_state      // Estado actual del sistema

// 3. Website Builder Básico
- website_get_config     // Obtener configuración actual
- website_add_section    // Agregar sección
- website_preview        // Obtener preview
```

### Fase 2: Herramientas de Productos (Próxima sesión)
```javascript
// 4. Productos y Colecciones
- collection_create      // Crear colección
- collection_list        // Listar colecciones
- product_create         // Crear producto
- product_bulk_create    // Crear múltiples productos
- product_update         // Actualizar producto

// 5. Website Builder Avanzado
- website_configure_section  // Configurar sección específica
- website_reorder_sections   // Reordenar secciones
- website_save              // Guardar cambios
- website_publish           // Publicar sitio
```

### Fase 3: Herramientas Avanzadas
```javascript
// 6. Usuarios y Permisos
- user_create            // Crear usuario
- role_create            // Crear rol
- role_assign_permissions // Asignar permisos

// 7. Utilidades
- generate_test_data     // Generar datos de prueba
- database_backup        // Backup de BD
- clear_cache           // Limpiar caché
- view_logs             // Ver logs
```

## 💻 Implementación Paso a Paso

### 1. Setup Inicial
```bash
# Crear carpeta MCP
mkdir mcp
cd mcp

# Inicializar proyecto Node.js
npm init -y

# Instalar dependencias
npm install @modelcontextprotocol/server-nodejs
npm install node-fetch
npm install puppeteer  # Para interactuar con el browser si es necesario
```

### 2. Estructura Básica del Servidor
```javascript
// hotel-mcp-server.js
import { MCPServer } from '@modelcontextprotocol/server-nodejs';

const server = new MCPServer({
  name: 'hotel-admin',
  version: '1.0.0',
  description: 'MCP Server for Hotel Admin System'
});

// Configuración
const config = {
  baseUrl: process.env.HOTEL_BASE_URL || 'https://localhost:5001',
  apiKey: process.env.HOTEL_API_KEY || '',
  projectPath: 'C:/Users/hp/Documents/Visual Studio 2022/Projects/Hotel23'
};

// Iniciar servidor
server.start();
```

### 3. Implementar Primera Herramienta
```javascript
// Ejemplo: Obtener empresa actual
server.addTool({
  name: 'company_get_current',
  description: 'Obtiene los datos de la empresa actual',
  parameters: {},
  handler: async () => {
    try {
      const response = await fetch(`${config.baseUrl}/api/company/current`);
      const data = await response.json();
      return {
        success: true,
        company: data
      };
    } catch (error) {
      return {
        success: false,
        error: error.message
      };
    }
  }
});
```

## 🔧 Configuración en Claude Desktop

```json
// claude_desktop_config.json
{
  "mcpServers": {
    "hotel-admin": {
      "command": "node",
      "args": ["C:/Users/hp/Documents/Visual Studio 2022/Projects/Hotel23/mcp/hotel-mcp-server.js"],
      "env": {
        "HOTEL_BASE_URL": "https://localhost:5001",
        "NODE_ENV": "development"
      }
    }
  }
}
```

## 📊 Casos de Uso

### Caso 1: Crear Tienda de Ropa Completa
```
Usuario: "Claude, crea una tienda online de ropa con 20 productos"

Claude ejecuta:
1. company_create({ name: "Fashion Store", ruc: "12345678" })
2. collection_create({ name: "Verano 2025" })
3. product_bulk_create({ count: 20, collection: "Verano 2025" })
4. website_add_section({ type: "slideshow" })
5. website_add_section({ type: "featured-collection" })
6. website_configure_section({ id: "featured-1", collection: "Verano 2025" })
7. website_save()
```

### Caso 2: Configurar Website Builder
```
Usuario: "Construye una página de inicio con slideshow y productos destacados"

Claude ejecuta:
1. navigate_to_module({ module: "website-builder" })
2. website_get_config()
3. website_add_section({ type: "header", config: {...} })
4. website_add_section({ type: "slideshow", config: {...} })
5. website_preview()
6. website_save()
```

## ✅ Ventajas de este Enfoque

1. **CERO invasión**: No tocamos el código del proyecto
2. **Flexibilidad**: Podemos agregar herramientas sin modificar Hotel Admin
3. **Debugging**: Fácil de probar y depurar
4. **Escalable**: Agregar nuevas herramientas es trivial
5. **Reversible**: Si no funciona, solo borramos la carpeta mcp/

## 🚀 Plan de Implementación - Esta Noche

### Hora 1: Setup
- [ ] Crear carpeta mcp/
- [ ] Instalar dependencias
- [ ] Crear estructura básica del servidor
- [ ] Configurar en Claude Desktop

### Hora 2: Herramientas Básicas
- [ ] Implementar company_get_current
- [ ] Implementar navigate_to_module
- [ ] Implementar website_get_config
- [ ] Probar que Claude puede acceder a las herramientas

### Hora 3: Website Builder
- [ ] Implementar website_add_section
- [ ] Implementar website_preview
- [ ] Probar creación de página simple
- [ ] Documentar resultados

## 📝 Notas Importantes

1. **Autenticación**: Por ahora usaremos la sesión del browser
2. **CORS**: Puede necesitar configuración si hay problemas
3. **SSL**: localhost con HTTPS puede requerir certificados
4. **Logs**: Implementar logging detallado desde el inicio

## 🎯 Objetivo Final

Poder decirle a Claude:
> "Crea una tienda online completa de zapatos con 50 productos, 5 colecciones, slideshow en la página principal y configuración de colores azules"

Y que Claude ejecute todo automáticamente usando las herramientas MCP.

---

**Próximos pasos**: 
1. Crear carpeta mcp/
2. Comenzar con el setup básico
3. Implementar primera herramienta
4. Probar conexión con Claude