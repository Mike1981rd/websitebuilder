# 📋 Plan de Implementación - Módulo de Productos

## 🎯 Objetivo
Implementar el módulo de Productos siguiendo la guía productos.md, respetando todos los patrones del proyecto y asegurando una experiencia similar a Shopify.

## 📅 Fases de Implementación

### FASE 1: Preparación y Base de Datos (2-3 horas)
**Objetivo**: Crear la estructura de datos y modelos necesarios

#### 1.1 Crear Modelos
- [ ] Crear `Models/Product.cs` con todas las propiedades
- [ ] Crear `Models/ProductImage.cs`
- [ ] Crear `Models/ProductVideo.cs`
- [ ] Crear `Models/ProductVariant.cs`
- [ ] Crear `Models/InventoryLocation.cs`

#### 1.2 Actualizar DbContext
- [ ] Agregar DbSets para Product, ProductImage, ProductVideo, ProductVariant
- [ ] Configurar relaciones en OnModelCreating
- [ ] Configurar índices únicos (Handle, SKU)
- [ ] Actualizar relación CollectionProduct existente

#### 1.3 Crear Migración
- [ ] Ejecutar: Add-Migration AddProductsModule
- [ ] Revisar la migración generada
- [ ] Ejecutar: Update-Database

### FASE 2: Controller Base y Vista Index (3-4 horas)
**Objetivo**: Crear el controller y la vista principal de listado

#### 2.1 Crear ProductsController
- [ ] Crear `Controllers/ProductsController.cs`
- [ ] Implementar método Index con paginación
- [ ] Agregar [Authorize] al controller
- [ ] Inyectar dependencias necesarias

#### 2.2 Crear Vista Index
- [ ] Crear carpeta `Views/Products`
- [ ] Crear `Views/Products/Index.cshtml`
- [ ] Implementar diseño con métricas superiores
- [ ] Agregar tabs (Todos, Activos, Borradores, Archivados)
- [ ] Crear tabla con checkboxes y columnas según diseño
- [ ] Implementar búsqueda y filtros
- [ ] Agregar botones de acción (Exportar, Importar, Agregar)
- [ ] Aplicar estilos usando `var(--primary)`

#### 2.3 Agregar al Menú
- [ ] Modificar `_MaterializeExactLayout.cshtml`
- [ ] Agregar item de menú después de Collections
- [ ] Agregar traducciones al objeto global

#### 2.4 Implementar Traducciones
- [ ] Agregar objeto de traducciones en Index.cshtml
- [ ] Implementar todas las keys necesarias (es/en)
- [ ] Probar cambio de idioma

### FASE 3: Create Básico (4-5 horas)
**Objetivo**: Implementar creación de productos sin variantes

#### 3.1 Método Create GET
- [ ] Implementar acción Create en controller
- [ ] Cargar lista de Collections disponibles

#### 3.2 Vista Create
- [ ] Crear `Views/Products/Create.cshtml`
- [ ] Implementar layout de dos columnas
- [ ] Sección principal:
  - [ ] Campo de título
  - [ ] Editor de texto enriquecido para descripción
  - [ ] Área de drag & drop para imágenes
  - [ ] Campos de precio
  - [ ] Campos de inventario
  - [ ] Campos de envío
- [ ] Sidebar derecha:
  - [ ] Estado (Activo/Borrador)
  - [ ] Tipo de producto
  - [ ] Proveedor
  - [ ] Checkboxes de Collections
  - [ ] Tags

#### 3.3 Método Create POST
- [ ] Implementar ÚNICA validación: título requerido
- [ ] Generar Handle automáticamente
- [ ] Procesar y guardar imágenes en base64
- [ ] Asignar valores por defecto a campos NOT NULL
- [ ] Guardar relaciones con Collections
- [ ] Mensajes de éxito/error con TempData

### FASE 4: Sistema de Imágenes (3-4 horas)
**Objetivo**: Implementar manejo completo de imágenes múltiples

#### 4.1 Frontend de Imágenes
- [ ] Implementar drag & drop con preview
- [ ] Validar tamaño máximo (25MB)
- [ ] Limitar a 10 imágenes
- [ ] Ordenamiento con drag & drop
- [ ] Botón eliminar en cada imagen
- [ ] Indicador de progreso al cargar

#### 4.2 Backend de Imágenes
- [ ] Método para procesar imágenes base64
- [ ] Redimensionar si es necesario
- [ ] Guardar en tabla ProductImages con position
- [ ] Actualizar posiciones al reordenar

### FASE 5: Edit y Delete (3-4 horas)
**Objetivo**: Completar el CRUD básico

#### 5.1 Método Edit GET
- [ ] Cargar producto con Include de imágenes
- [ ] Cargar Collections seleccionadas
- [ ] Preparar ViewData necesario

#### 5.2 Vista Edit
- [ ] Crear `Views/Products/Edit.cshtml`
- [ ] Reutilizar estructura de Create
- [ ] Mostrar imágenes existentes
- [ ] Permitir agregar/eliminar imágenes
- [ ] Preservar datos en campos

#### 5.3 Método Edit POST
- [ ] NO asignar empty strings (campos ya tienen valores)
- [ ] Actualizar solo campos modificados
- [ ] Procesar nuevas imágenes
- [ ] Actualizar Collections
- [ ] UpdatedAt = DateTime.UtcNow

#### 5.4 Método Delete
- [ ] Confirmación con JavaScript
- [ ] Eliminar en cascada (imágenes, variantes)
- [ ] Mensaje de confirmación

### FASE 6: Sistema de Variantes (6-8 horas)
**Objetivo**: Implementar el sistema completo de variantes

#### 6.1 UI de Variantes en Create/Edit
- [ ] Sección para agregar opciones (máx 3)
- [ ] Valores para cada opción
- [ ] Generar combinaciones automáticamente
- [ ] Grid de variantes con campos editables

#### 6.2 Vista Individual de Variante
- [ ] Crear `Views/Products/EditVariant.cshtml`
- [ ] Implementar diseño según imagen de referencia
- [ ] Campos específicos por variante
- [ ] Inventario por ubicación
- [ ] Metadatos Google Shopping

#### 6.3 Backend de Variantes
- [ ] Método para generar combinaciones
- [ ] Guardar variantes con el producto
- [ ] Actualizar variantes existentes
- [ ] Eliminar variantes no usadas

### FASE 7: Videos y Features Avanzadas (4-5 horas)
**Objetivo**: Agregar funcionalidades adicionales

#### 7.1 Sistema de Videos
- [ ] UI para agregar videos (YouTube, Vimeo, MP4)
- [ ] Validar URLs de YouTube/Vimeo
- [ ] Upload de MP4 con límite 1GB
- [ ] Preview de videos
- [ ] Guardar en ProductVideos

#### 7.2 SEO y Metadatos
- [ ] Campos SEO en formulario
- [ ] Preview de Google
- [ ] Validar longitud de meta tags
- [ ] Handle único y amigable

#### 7.3 Importación CSV
- [ ] Vista para upload de CSV
- [ ] Procesar archivo con validaciones
- [ ] Mostrar errores por fila
- [ ] Importar en lotes

### FASE 8: Testing y Optimización (2-3 horas)
**Objetivo**: Asegurar calidad y rendimiento

#### 8.1 Testing Funcional
- [ ] Crear producto simple
- [ ] Crear producto con variantes
- [ ] Editar todos los campos
- [ ] Eliminar productos
- [ ] Probar con múltiples imágenes/videos

#### 8.2 Testing de UI
- [ ] Responsividad en móviles
- [ ] Dark mode
- [ ] Cambio de color primario
- [ ] Traducciones es/en

#### 8.3 Optimización
- [ ] Lazy loading de imágenes
- [ ] Paginación eficiente
- [ ] Índices en base de datos
- [ ] Caché donde sea apropiado

## 🚀 Orden de Ejecución Recomendado

### Semana 1
1. **Día 1**: Fase 1 completa (Base de datos)
2. **Día 2**: Fase 2 completa (Index)
3. **Día 3-4**: Fase 3 completa (Create básico)
4. **Día 5**: Fase 4 completa (Imágenes)

### Semana 2
1. **Día 6**: Fase 5 completa (Edit/Delete)
2. **Día 7-8**: Fase 6 parcial (Variantes básicas)
3. **Día 9**: Fase 6 completa (Variantes avanzadas)
4. **Día 10**: Fase 7 y 8 (Videos, Testing)

## 📝 Checkpoints Importantes

### Después de Fase 2
- ✓ Se puede ver la lista de productos
- ✓ Menú y navegación funcionan
- ✓ Traducciones aplicadas

### Después de Fase 3
- ✓ Se pueden crear productos básicos
- ✓ Imágenes se guardan correctamente
- ✓ Validaciones funcionan

### Después de Fase 5
- ✓ CRUD completo funcional
- ✓ Sin errores de campos NULL
- ✓ Navegación fluida

### Después de Fase 6
- ✓ Variantes se generan correctamente
- ✓ Cada variante tiene sus propios datos
- ✓ UI intuitiva para variantes

## 🔧 Herramientas y Recursos Necesarios

1. **Visual Studio 2022** con las extensiones necesarias
2. **pgAdmin** para verificar datos
3. **Navegador** con DevTools para debugging
4. **Postman** para probar APIs (si se implementan)

## ⚠️ Puntos Críticos a Recordar

1. **Migraciones**: Solo proporcionar nombre, no crear archivos .cs
2. **Campos NOT NULL**: Asignar "" en Create, no tocar en Edit
3. **Colores**: Siempre usar `var(--primary)`
4. **Iconos**: Solo Font Awesome, no Material Icons
5. **Traducciones**: Sistema del layout, no del Website Builder
6. **Imágenes**: Base64 en campo TEXT
7. **DateTime**: Siempre usar DateTime.UtcNow
8. **VALIDACIÓN**: Solo el título es requerido (como en Shopify)

## 📊 Métricas de Éxito

- [ ] Todos los tests pasan
- [ ] No hay errores en consola
- [ ] Rendimiento < 2s para cargar Index
- [ ] Funciona en Chrome, Firefox, Edge
- [ ] Responsive en móviles
- [ ] Traducciones completas
- [ ] Colores del theme aplicados
- [ ] Usuario puede crear/editar/eliminar productos
- [ ] Variantes funcionan correctamente
- [ ] Imágenes y videos se manejan bien

## 🎉 Entregables Finales

1. **Código fuente** completo y funcional
2. **Migración** ejecutada en base de datos
3. **Documentación** actualizada si se encuentran nuevos patrones
4. **Screenshots** de las vistas principales
5. **Lista de issues** conocidos (si los hay)

---

Este plan puede ajustarse según el avance real y los obstáculos encontrados durante la implementación.