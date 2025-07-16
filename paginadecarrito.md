# Implementación de la Página de Carrito - Website Builder

## Resumen
Este documento detalla la implementación de la funcionalidad de páginas múltiples en el Website Builder, específicamente la página de carrito como primer caso de uso. La implementación permite cambiar entre diferentes páginas (Inicio, Carrito) manteniendo configuraciones independientes para cada una.

## Arquitectura Implementada

### 1. Modelo de Datos

#### Modificación del modelo WebSite (Models/WebSite.cs)
- **Línea 42**: Agregado `PagesConfigJson` para almacenar configuración de múltiples páginas
```csharp
public string PagesConfigJson { get; set; } = "{}";
```

#### Estructura de PagesConfigJson
```json
{
  "home": {
    "id": "home",
    "title": "Página de inicio",
    "type": "home",
    "sectionOrder": [...],
    "sectionsConfig": {...}
  },
  "cart": {
    "id": "cart",
    "title": "Carrito",
    "type": "cart",
    "sectionOrder": ["cart"],
    "sectionsConfig": {
      "cart": {
        "colorScheme": "default",
        "width": "extraSmall",
        ...
      }
    }
  }
}
```

### 2. Backend - Endpoints

#### WebSitesController.cs

**GetDefaultPagesConfig() - Líneas 304-332**
- Crea configuración por defecto para páginas home y cart

**UpdatePageStructure() - Líneas 335-441**
- Modificado para manejar páginas individuales
- Líneas 379-425: Lógica para actualizar PagesConfigJson
- Línea 402: Usa PageId del DTO para identificar la página

**GetPageStructure() - Líneas 444-486**
- Nuevo endpoint GET para obtener configuración de una página específica
- Maneja compatibilidad hacia atrás con SectionsConfigJson

**UpdatePageStructureDto - Líneas 907-914**
- Agregado campo PageId opcional

### 3. Frontend - JavaScript

#### Variables Globales (website-builder.js)
- **Línea 16**: `currentPageId = 'home'`
- **Línea 18**: `currentPageType = 'home'`
- **Línea 19**: `pagesConfig = {}`

#### Funciones Principales

**switchToPage() - Líneas 263-307**
- Maneja el cambio entre páginas
- Actualiza currentSectionsConfig con datos de la página seleccionada
- Renderiza el preview

**loadPageFromServer() - Líneas 310-344**
- Carga datos de una página desde el servidor si no están en caché

**loadCurrentWebsite() - Líneas 375-391**
- Modificado para cargar PagesConfigJson
- Inicializa el selector de páginas con la página actual

#### Selector de Páginas

**HTML (Views/WebsiteBuilder/Index.cshtml) - Líneas 32-41**
```html
<div id="page-selector-dropdown" class="page-selector-dropdown">
  <ul class="page-list">
    <li data-page-id="home">Página de inicio</li>
    <li data-page-id="cart">Carrito</li>
  </ul>
</div>
```

**CSS (website-builder.css) - Líneas 438-492**
- Estilos para el dropdown del selector de páginas

**Event Handlers (website-builder.js) - Líneas 6362-6393**
- Click en selector abre/cierra dropdown
- Click en página ejecuta switchToPage()
- Confirmación si hay cambios sin guardar

#### Renderizado Diferenciado por Página

**renderBlockListView() - Líneas 10317-10479**
- Línea 10320-10396: Vista específica para página de carrito
  - Header sin botón agregar
  - Cart section fija en Template
  - Footer normal
- Línea 10398-10479: Vista estándar para otras páginas

**renderPreview() - Líneas 2506-2517**
- Agregado caso para renderizar sección Cart

**attachBlockListEventListeners() - Líneas 14276-14283**
- Detecta si estamos en página cart para abrir cartPageSettings

### 4. Configuración de la Sección Cart

**renderCartPageSettings() - Líneas 9585-9704**
- Vista de configuración para la sección Cart en página de carrito
- Opciones: colorScheme, width, imageRatio, paddings

**attachCartPageEventListeners() - Líneas 9707-9768**
- Maneja cambios en la configuración
- Actualiza preview en tiempo real

**switchSidebarView() - Líneas 7085-7090**
- Agregado caso 'cartPageSettings'

### 5. Renderizado de la Página de Carrito

**renderCartPage() (website-render-functions.js) - Líneas 2681-2953**
- Renderiza la página completa del carrito
- Tabla de productos con controles de cantidad
- Nota del pedido
- Totales y botón de checkout
- Integración con localStorage para persistencia

### 6. Guardado de Datos por Página

**Save Button Handler - Líneas 25057-25061**
- Modificado para incluir pageId en el payload
- Guarda en el endpoint correcto según la página actual

## Flujo de Trabajo

1. **Cambio de Página**:
   - Usuario hace click en selector → Abre dropdown
   - Selecciona página → switchToPage()
   - Carga configuración de la página
   - Actualiza UI y renderiza preview

2. **Edición en Página de Carrito**:
   - Click en sección Cart → Abre cartPageSettings
   - Cambios se aplican en tiempo real
   - Guarda en cart.sectionsConfig

3. **Agregar Secciones**:
   - Botón "Agregar sección" funciona en todas las páginas
   - En cart, las secciones se agregan después de Cart

## Migración Requerida

**Nombre de migración**: AddPagesConfigJsonToWebSite

## Puntos Clave de la Implementación

1. **Separación de Datos**: Cada página mantiene su propia configuración
2. **Compatibilidad**: Se mantiene SectionsConfigJson para home page
3. **Sección Cart Fija**: No se puede eliminar ni mover en página cart
4. **Reutilización**: Máxima reutilización de código existente
5. **Preview Dinámico**: Se actualiza según la página activa

## Próximos Pasos para Nuevas Páginas

Para agregar una nueva página (ej: Product):

1. Agregar en GetDefaultPagesConfig()
2. Agregar opción en el dropdown (Index.cshtml)
3. Modificar renderBlockListView() si necesita vista especial
4. Crear renderProductPageSettings() si tiene configuración
5. Agregar caso en renderPreview() para la sección principal
6. Crear renderProductPage() en website-render-functions.js

## Lecciones Aprendidas

1. **Estructura Flexible**: PagesConfigJson permite fácil extensión
2. **Mínima Invasión**: Solo se modificó lo necesario
3. **Estado Global**: currentPageId y currentPageType manejan contexto
4. **Guardado Unificado**: Un solo endpoint maneja todas las páginas

## Confirmación de cumplimiento de reglas críticas:
✅ Solo se proporcionó nombre de migración, no archivos .cs
✅ Se documentó toda la implementación con referencias exactas