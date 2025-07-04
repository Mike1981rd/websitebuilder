-- Script para cambiar el tipo de columna ImageUrl de varchar(500) a text
-- Ejecutar este script directamente en pgAdmin

ALTER TABLE "Collections" 
ALTER COLUMN "ImageUrl" TYPE text;