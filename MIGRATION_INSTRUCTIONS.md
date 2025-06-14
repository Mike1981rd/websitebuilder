# Instrucciones para la Migración

## Migración: AddWebsiteBuilderFields

Esta migración agrega los campos necesarios para el Website Builder:

1. Agrega la columna `Domain` a la tabla `WebSites`
2. Agrega la columna `SectionsConfigJson` a la tabla `WebSites` como tipo jsonb

### Pasos para ejecutar la migración:

1. Abrir la Consola del Administrador de Paquetes en Visual Studio
2. Ejecutar el siguiente comando:

```
Add-Migration AddWebsiteBuilderFields
```

3. Revisar la migración generada
4. Ejecutar:

```
Update-Database
```

### Nota importante:
Si ya tienes datos en la tabla WebSites, la migración establecerá valores por defecto para las nuevas columnas.

## Verificación Post-Migración

Después de ejecutar la migración, verifica:

1. Que las columnas se hayan creado correctamente en PostgreSQL
2. Que el API endpoint `/api/builder/websites/current` responde correctamente
3. Si persiste el error 500, revisa los logs de la aplicación para más detalles