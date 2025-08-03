# 🐘 PostgreSQL MCP Server - Plan de Implementación

## 📋 ¿QUÉ ES UN MCP?

MCP (Model Context Protocol) es un protocolo que permite a Claude Code conectarse directamente con servicios externos como bases de datos, APIs, etc.

## 🎯 OBJETIVO

Crear un servidor MCP personalizado que permita a Claude Code:
- ✅ Conectarse directamente a tu PostgreSQL local
- ✅ Ejecutar queries
- ✅ Ver estructura de tablas
- ✅ Hacer backups
- ✅ Gestionar migraciones
- ✅ Administrar usuarios y permisos

## 🏗️ ESTRUCTURA BÁSICA DE UN MCP

```javascript
// postgresql-mcp/index.js
import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import pg from 'pg';

class PostgreSQLServer {
  constructor() {
    this.server = new Server({
      name: 'postgresql-mcp',
      version: '1.0.0',
    });
    
    this.setupHandlers();
  }

  setupHandlers() {
    // Herramienta para ejecutar queries
    this.server.setRequestHandler('tools/list', async () => ({
      tools: [
        {
          name: 'query',
          description: 'Execute a PostgreSQL query',
          inputSchema: {
            type: 'object',
            properties: {
              query: { type: 'string' },
              database: { type: 'string' }
            },
            required: ['query']
          }
        },
        {
          name: 'list_tables',
          description: 'List all tables in a database',
          inputSchema: {
            type: 'object',
            properties: {
              database: { type: 'string' }
            }
          }
        },
        {
          name: 'describe_table',
          description: 'Get table structure',
          inputSchema: {
            type: 'object',
            properties: {
              table: { type: 'string' },
              database: { type: 'string' }
            },
            required: ['table']
          }
        }
      ]
    }));

    // Implementar las herramientas
    this.server.setRequestHandler('tools/call', async (request) => {
      const { name, arguments: args } = request.params;
      
      switch (name) {
        case 'query':
          return await this.executeQuery(args.query, args.database);
        case 'list_tables':
          return await this.listTables(args.database);
        case 'describe_table':
          return await this.describeTable(args.table, args.database);
        default:
          throw new Error(`Unknown tool: ${name}`);
      }
    });
  }

  async executeQuery(query, database = 'Hotel') {
    const client = new pg.Client({
      host: 'localhost',
      port: 5432,
      database: database,
      user: 'postgres',
      password: '123456'
    });

    try {
      await client.connect();
      const result = await client.query(query);
      return {
        content: [{
          type: 'text',
          text: JSON.stringify(result.rows, null, 2)
        }]
      };
    } finally {
      await client.end();
    }
  }

  async listTables(database = 'Hotel') {
    const query = `
      SELECT tablename 
      FROM pg_tables 
      WHERE schemaname = 'public' 
      ORDER BY tablename
    `;
    return this.executeQuery(query, database);
  }

  async describeTable(table, database = 'Hotel') {
    const query = `
      SELECT column_name, data_type, is_nullable, column_default
      FROM information_schema.columns
      WHERE table_name = '${table}'
      ORDER BY ordinal_position
    `;
    return this.executeQuery(query, database);
  }

  async run() {
    const transport = new StdioServerTransport();
    await this.server.connect(transport);
  }
}

// Iniciar servidor
const server = new PostgreSQLServer();
server.run();
```

## 📦 INSTALACIÓN PROPUESTA

### 1. Crear el proyecto
```bash
mkdir postgresql-mcp
cd postgresql-mcp
npm init -y
npm install @modelcontextprotocol/sdk pg
```

### 2. Crear archivo package.json
```json
{
  "name": "postgresql-mcp",
  "version": "1.0.0",
  "type": "module",
  "bin": {
    "postgresql-mcp": "./index.js"
  },
  "dependencies": {
    "@modelcontextprotocol/sdk": "^0.5.0",
    "pg": "^8.11.0"
  }
}
```

### 3. Configurar en Claude Code
Agregar a `claude_desktop_config.json`:
```json
{
  "mcpServers": {
    "postgresql": {
      "command": "node",
      "args": ["C:\\Users\\hp\\postgresql-mcp\\index.js"],
      "env": {
        "PGHOST": "localhost",
        "PGUSER": "postgres",
        "PGPASSWORD": "123456",
        "PGDATABASE": "Hotel"
      }
    }
  }
}
```

## 🚀 FUNCIONALIDADES ADICIONALES A IMPLEMENTAR

1. **Backup Automático**
   ```javascript
   {
     name: 'backup_database',
     description: 'Create a backup of the database',
     inputSchema: {
       type: 'object',
       properties: {
         database: { type: 'string' },
         format: { type: 'string', enum: ['sql', 'custom'] }
       }
     }
   }
   ```

2. **Gestión de Usuarios**
   ```javascript
   {
     name: 'create_user',
     description: 'Create a new PostgreSQL user',
     inputSchema: {
       type: 'object',
       properties: {
         username: { type: 'string' },
         password: { type: 'string' },
         privileges: { type: 'array' }
       }
     }
   }
   ```

3. **Migraciones**
   ```javascript
   {
     name: 'apply_migration',
     description: 'Apply SQL migration file',
     inputSchema: {
       type: 'object',
       properties: {
         file: { type: 'string' },
         database: { type: 'string' }
       }
     }
   }
   ```

## 🔒 SEGURIDAD

1. **Validación de Queries**: Prevenir SQL injection
2. **Límites**: Restringir operaciones peligrosas
3. **Logs**: Registrar todas las operaciones
4. **Conexiones**: Pool de conexiones para eficiencia

## 📚 RECURSOS

- [MCP SDK Documentation](https://github.com/modelcontextprotocol/sdk)
- [PostgreSQL Node.js Driver](https://node-postgres.com/)
- [MCP Examples](https://github.com/modelcontextprotocol/servers)

## 🎯 BENEFICIOS

Con este MCP, podrías decirme:
- "Muéstrame todos los usuarios"
- "Crea una tabla nueva"
- "Haz backup de la base de datos"
- "Aplica esta migración"

Y yo podría ejecutarlo directamente sin necesitar que copies comandos.

## 📝 PRÓXIMOS PASOS

1. **Crear estructura básica** del proyecto
2. **Implementar funciones core** (query, list, describe)
3. **Probar con Claude Code**
4. **Agregar funcionalidades** avanzadas
5. **Publicar en npm** para compartir con la comunidad

---
**Nota**: Este es un plan inicial. El desarrollo real requeriría iteración y pruebas.