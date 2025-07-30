-- Script para verificar permisos en la base de datos PostgreSQL
-- Ejecutar en pgAdmin o cualquier cliente PostgreSQL

-- 1. Ver TODOS los permisos en la tabla
SELECT * FROM "Permissions" 
ORDER BY "Id";

-- 2. Contar total de permisos
SELECT COUNT(*) as "Total Permisos" 
FROM "Permissions";

-- 3. Ver específicamente los permisos de Reservations
SELECT * FROM "Permissions" 
WHERE "Module" = 'Reservations';

-- 4. Ver el último ID usado
SELECT MAX("Id") as "Último ID" 
FROM "Permissions";

-- 5. Ver permisos agrupados por módulo
SELECT "Module", COUNT(*) as "Cantidad" 
FROM "Permissions" 
GROUP BY "Module" 
ORDER BY "Module";

-- 6. Verificar si la migración se ejecutó
SELECT * FROM "__EFMigrationsHistory" 
WHERE "MigrationId" LIKE '%InsertReservationsPermissions%';

-- 7. Ver las últimas 5 migraciones ejecutadas
SELECT * FROM "__EFMigrationsHistory" 
ORDER BY "MigrationId" DESC 
LIMIT 5;

-- 8. Verificar si existen los IDs 28, 29, 30
SELECT * FROM "Permissions" 
WHERE "Id" IN (28, 29, 30);

-- 9. Ver todos los permisos con su módulo y acción
SELECT "Id", "Module", "Action", "Description" 
FROM "Permissions" 
ORDER BY "DisplayOrder", "Module", "Id";