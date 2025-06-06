# Memoria del Proyecto Hotel

## Reglas Importantes

### Migraciones de Entity Framework
- **REGLA CRÍTICA**: Los archivos de migración deben ser preparados por Claude
- Solo proporcionar el nombre de la migración al usuario
- El usuario ejecutará el comando de migración desde Visual Studio
- NO ejecutar comandos `dotnet ef` directamente

## Configuración de Base de Datos
- Base de datos: Hotel (PostgreSQL)
- Usuario: postgres
- Contraseña: 123456
- La base de datos ya está creada en pgAdmin

## Estructura del Proyecto
- ASP.NET Core 8.0
- Entity Framework Core con PostgreSQL
- Modelos creados: Room, RoomType, Guest, Reservation, Payment, Company
- DbContext: HotelDbContext

## Patrones y Estándares Implementados

### Arquitectura y Patrones
1. **Single-Entity Pattern** (Empresa): FirstOrDefaultAsync(), crear si no existe
2. **Fechas PostgreSQL**: Usar `DateTime.UtcNow`
3. **Redirección Post-Save**: Siempre a `ExactIndex`
4. **Validaciones Opcionales**: Remove ModelState si campo vacío

### UI/UX
5. **Mensajes**: TempData["SuccessMessage"] y TempData["ErrorMessage"]
6. **Breadcrumbs**: Home/[Módulo] - Home enlaza a ExactIndex
7. **Dark Mode**: Fondo #282A42, cards color original
8. **Botones**: Solo un set al final, Guardar usa var(--primary)
9. **Requeridos**: `<span class="required-asterisk">*</span>`
10. **Traducciones**: Agregar en _MaterializeExactLayout translations object