# Navigation Setup - Documentación de Implementación

## Resumen
Este documento detalla la implementación de la funcionalidad de navegación del header, específicamente la conexión de links del menú con la opción de Colecciones como piloto.

## Archivos Modificados y Líneas de Código

### 1. `/wwwroot/js/website-builder.js`

#### Expansión del Dropdown de Colecciones
**Líneas: ~28100-28150**
```javascript
// Handler para items con submenú (Collections, Products, etc.)
$(document).on('click', '.link-suggestions-dropdown li.has-submenu', function(e) {
    e.preventDefault();
    e.stopPropagation();
    
    const $item = $(this);
    const $dropdown = $item.closest('.link-suggestions-dropdown');
    const url = $item.data('url');
    
    if (url === '/collections') {
        // Cargar y mostrar submenú de colecciones
        loadCollectionsSubmenu($item, $dropdown);
    }
});
```

#### Función para Cargar Submenú de Colecciones
**Líneas: ~28200-28250**
```javascript
function loadCollectionsSubmenu($parentItem, $dropdown) {
    const $submenu = $('<ul class="link-submenu"></ul>');
    
    // Agregar "Todas las colecciones"
    $submenu.append(`
        <li data-url="/collections">
            <span>${translations[currentLanguage]['all_collections'] || 'Todas las colecciones'}</span>
        </li>
    `);
    
    // Cargar colecciones dinámicamente
    $.ajax({
        url: '/api/builder/collections',
        method: 'GET',
        success: function(collections) {
            collections.forEach(collection => {
                $submenu.append(`
                    <li data-url="/collections/${collection.handle}">
                        <span>${collection.name}</span>
                    </li>
                `);
            });
        }
    });
    
    // Mostrar submenú
    $parentItem.find('.link-submenu').remove();
    $parentItem.append($submenu);
}
```

#### Event Handlers para Dropdown en Modo Edición
**Líneas: ~28300-28350**
- Agregado `.edit-item-url` a todos los event handlers del dropdown
- Creación dinámica de dropdown para formularios inline

#### Solución de Ancho del Menú
**Líneas en CSS: ~28400**
```css
.link-suggestions-dropdown {
    min-width: 400px; /* Aumentado de 'right: 0' */
}
```

### 2. `/Controllers/CollectionsController.cs`

#### Endpoint API para Website Builder
**Líneas: 636-658**
```csharp
// GET: api/builder/collections
[HttpGet]
[Route("api/builder/collections")]
public async Task<IActionResult> GetCollectionsForBuilder()
{
    try
    {
        var collections = await _context.Collections
            .Where(c => c.IsActive)
            .OrderBy(c => c.Title)
            .Select(c => new
            {
                id = c.Id,
                name = c.Title,
                handle = c.Handle
            })
            .ToListAsync();

        return Json(collections);
    }
    catch (Exception ex)
    {
        _logger.LogError(ex, "Error al obtener colecciones para builder");
        return Json(new[] { new { id = 0, name = "Error al cargar colecciones", handle = "" } });
    }
}
```

#### Endpoint para Búsqueda de Colecciones (usado en página /collections)
**Líneas: 592-631**
```csharp
// GET: api/builder/collections/search
[HttpGet]
[Route("api/builder/collections/search")]
[AllowAnonymous]
public async Task<IActionResult> SearchCollectionsForBuilder(string query = "")
{
    try
    {
        var collectionsQuery = _context.Collections
            .Include(c => c.CollectionProducts) // IMPORTANTE: Incluir relación
            .Where(c => c.IsActive);

        if (!string.IsNullOrWhiteSpace(query))
        {
            collectionsQuery = collectionsQuery.Where(c => 
                c.Title.ToLower().Contains(query.ToLower()) || 
                c.Handle.ToLower().Contains(query.ToLower())
            );
        }

        var collections = await collectionsQuery
            .Take(20)
            .Select(c => new
            {
                c.Id,
                c.Title,
                c.Handle,
                c.ImageUrl,
                ProductCount = c.CollectionProducts.Count() // PROBLEMA: Retorna undefined
            })
            .ToListAsync();

        return Json(new { success = true, collections });
    }
    catch (Exception ex)
    {
        _logger.LogError(ex, "Error al buscar colecciones para builder");
        return Json(new { success = false, message = "Error al buscar colecciones" });
    }
}
```

### 3. `/Program.cs`

#### Ruta para Página de Colecciones
**Líneas: Agregar después de otras rutas del website builder**
```csharp
app.MapControllerRoute(
    name: "collections",
    pattern: "collections",
    defaults: new { controller = "WebsiteBuilder", action = "Preview" });
```

### 4. `/Controllers/WebsiteBuilderController.cs`

#### Detección de Ruta de Colecciones
**Líneas: En el método Preview(), agregar después de otros if**
```csharp
if (Request.Path.Value?.Equals("/collections", StringComparison.OrdinalIgnoreCase) == true)
{
    page = "collections";
}
```

### 5. `/wwwroot/js/website-render-functions.js`

#### Función para Renderizar Página de Colecciones
**Líneas: Agregar nueva función**
```javascript
window.renderCollectionsPage = function(config = {}) {
    console.log('[DEBUG] renderCollectionsPage called');
    
    // HTML de la página
    const html = `
        <div class="collections-page">
            <div class="collections-header">
                <h1>${translations[currentLanguage]['all_collections'] || 'Todas las colecciones'}</h1>
            </div>
            <div class="collections-grid" id="collections-grid">
                <div class="loading-state">
                    ${translations[currentLanguage]['loading_collections'] || 'Cargando colecciones...'}
                </div>
            </div>
        </div>
    `;
    
    console.log('[DEBUG] Returning collections HTML');
    return html;
};

// Función separada para cargar datos
window.loadCollectionsData = function() {
    console.log('[DEBUG] loadCollectionsData called');
    
    $.ajax({
        url: '/api/builder/collections/search',
        method: 'GET',
        success: function(response) {
            if (response.success && response.collections) {
                const grid = document.getElementById('collections-grid');
                if (!grid) return;
                
                let html = '';
                response.collections.forEach(collection => {
                    html += `
                        <div class="collection-card">
                            <a href="/collections/${collection.Handle || collection.handle}">
                                <div class="collection-image">
                                    ${collection.ImageUrl ? 
                                        `<img src="${collection.ImageUrl}" alt="${collection.Title}">` : 
                                        '<div class="no-image"><i class="fas fa-image"></i></div>'
                                    }
                                </div>
                                <div class="collection-info">
                                    <h3>${collection.Title || collection.title}</h3>
                                    <p>${collection.ProductCount || 0} productos</p>
                                </div>
                            </a>
                        </div>
                    `;
                });
                
                grid.innerHTML = html || '<p>No se encontraron colecciones</p>';
            }
        }
    });
};
```

### 6. `/Views/WebsiteBuilder/Preview.cshtml`

#### Manejo de Página de Colecciones
**Líneas: En el script de inicialización**
```javascript
// Detectar si es página de colecciones
if (page === 'collections') {
    window.parent.currentPageData = {
        sectionOrder: ['header', 'collections', 'footer'],
        sections: {
            header: { /* config del header */ },
            collections: { type: 'collections' },
            footer: { /* config del footer */ }
        }
    };
    
    // Renderizar después de que el DOM esté listo
    setTimeout(() => {
        window.parent.renderPreview();
        // Cargar datos después de renderizar
        setTimeout(() => {
            if (window.parent.loadCollectionsData) {
                window.parent.loadCollectionsData();
            }
        }, 100);
    }, 100);
}
```

### 7. `/wwwroot/css/website-builder.css`

#### Estilos para Submenú de Links
**Líneas: Agregar nuevos estilos**
```css
.link-submenu {
    margin-left: 20px;
    margin-top: 5px;
    list-style: none;
    padding: 0;
}

.link-submenu li {
    padding: 8px 12px;
    cursor: pointer;
    font-size: 14px;
}

.link-submenu li:hover {
    background-color: #f5f5f5;
}

/* Fix para ancho del dropdown */
.link-suggestions-dropdown {
    min-width: 400px;
    max-width: 500px;
}
```

## Problema Actual

### PROBLEMA PRINCIPAL: Los cards de colecciones no muestran nombres ni imágenes
La página está mostrando 4 cards de colecciones correctamente, pero los cards aparecen vacíos - sin nombres de colección ni imágenes.

**Síntomas observados:**
- Se renderizan 4 cards (cantidad correcta según las colecciones en la BD)
- Los cards están vacíos - no muestran el título de la colección
- Las imágenes no se muestran (solo el ícono placeholder)
- El ProductCount también muestra "undefined productos" (problema secundario)

**Logs del navegador:**
```
API response: Object { success: true, collections: Array(4) }
Collections array: Array(4) [ {...}, {...}, {...}, {...} ]
First collection: Object { Id: 11, Title: "Libros de misterio", Handle: "libros-de-misterio", ImageUrl: "", ProductCount: undefined }
```

### Análisis del problema principal:
En `website-render-functions.js`, el código está intentando acceder a las propiedades con diferentes cases:
```javascript
// Línea problemática en renderCollectionsPage
<h3>${collection.Title || collection.title}</h3>  // Intenta ambos cases
<a href="/collections/${collection.Handle || collection.handle}">  // Intenta ambos cases
```

Pero según los logs, la API está retornando las propiedades con PascalCase (Title, Handle), sin embargo algo está fallando en el renderizado.

### Posibles causas:
1. **Problema de timing**: Los datos pueden estar llegando después de que se renderiza el HTML
2. **Problema de scope**: La variable `collection` puede no estar definida correctamente en el forEach
3. **Problema de template literals**: Puede haber un error en cómo se están interpolando las variables

### Próximos pasos para resolver (EN ORDEN DE PRIORIDAD):
1. **URGENTE**: Agregar console.log dentro del forEach para ver exactamente qué contiene cada `collection`
2. **URGENTE**: Verificar que el HTML se está generando correctamente antes de asignarlo al grid
3. Revisar si hay errores de JavaScript en la consola durante el renderizado
4. Después de resolver el problema principal, abordar el ProductCount undefined

## Solución Implementada - Problema de Visualización

### Causa Raíz del Problema
ASP.NET Core por defecto serializa las propiedades JSON en **camelCase**, pero el código JavaScript estaba intentando acceder a las propiedades en **PascalCase**. Esto causaba que `collection.Title` fuera `undefined` porque la propiedad real era `collection.title`.

### Cambios Realizados

#### 1. Controller - Consistencia en Serialización
**Archivo**: `/Controllers/CollectionsController.cs`  
**Líneas**: 614-622

**Antes**:
```csharp
.Select(c => new
{
    c.Id,
    c.Title,
    c.Handle,
    c.ImageUrl,
    ProductCount = c.CollectionProducts.Count()
})
```

**Después**:
```csharp
.Select(c => new
{
    id = c.Id,
    title = c.Title,
    handle = c.Handle,
    imageUrl = c.ImageUrl,
    productCount = c.CollectionProducts.Count()
})
```

#### 2. JavaScript - Uso de camelCase
**Archivo**: `/wwwroot/js/website-render-functions.js`  
**Líneas**: 3107-3128

**Antes**:
```javascript
<h3>${collection.Title || collection.title || 'Sin título'}</h3>
<p>${collection.ProductCount !== undefined ? collection.ProductCount : '0'} productos</p>
```

**Después**:
```javascript
<h3>${collection.title || 'Sin título'}</h3>
<p>${collection.productCount !== undefined ? collection.productCount : '0'} productos</p>
```

### Lección Aprendida - IMPORTANTE para Futuras Implementaciones

#### Regla de Oro para APIs en ASP.NET Core:
1. **SIEMPRE usar camelCase** en las propiedades de objetos anónimos que se retornan como JSON
2. **Ser explícito** con los nombres de propiedades: usar `propertyName = c.PropertyName` en lugar de solo `c.PropertyName`
3. **Mantener consistencia** entre backend y frontend sobre el formato de las propiedades

#### Patrón Recomendado para Endpoints API:
```csharp
// ✅ CORRECTO - Explícito y en camelCase
.Select(c => new
{
    id = c.Id,
    title = c.Title,
    handle = c.Handle,
    // etc...
})

// ❌ INCORRECTO - Puede causar inconsistencias
.Select(c => new
{
    c.Id,      // Puede serializarse como "id" o "Id" dependiendo de la configuración
    c.Title,   // Puede serializarse como "title" o "Title"
    // etc...
})
```

#### En el Frontend JavaScript:
```javascript
// ✅ CORRECTO - Usar camelCase consistentemente
collection.title
collection.handle
collection.productCount

// ❌ EVITAR - No intentar ambos casos
collection.Title || collection.title  // Innecesario si somos consistentes
```

### Herramientas de Debug Útiles
Cuando trabajemos con APIs, siempre agregar logs para verificar la estructura de datos:
```javascript
console.log('Collection properties:', Object.keys(collection));
console.log('Full collection object:', collection);
```

Esto ayuda a identificar rápidamente discrepancias entre lo esperado y lo recibido.

## Solución Implementada - Navegación de Submenús

### Problema
Los submenús no navegaban correctamente cuando se les asignaba un enlace (como "/collections"). El click no hacía nada.

### Causa
El elemento padre del menú tenía un `e.preventDefault()` en su event listener (línea 4685) que se propagaba a los elementos hijos (submenús), bloqueando la navegación.

### Solución Implementada
**Archivo**: `/wwwroot/js/website-builder.js`  
**Nueva función**: `attachSubmenuClickHandlers` (líneas 4629-4652)

1. Se agregó una nueva función que se ejecuta después de `attachDropdownMenuListeners`
2. La función encuentra todos los elementos de submenú (tanto desktop como móvil)
3. Agrega un event listener con `e.stopPropagation()` para prevenir que el evento se propague al padre
4. Permite que la navegación ocurra naturalmente dentro del iframe (igual que los elementos principales del menú)

**Cambios específicos**:
- Línea 3576: Se agregó la llamada a `attachSubmenuClickHandlers(previewDoc)`
- Líneas 4629-4652: Nueva función que maneja clicks en submenús
- Soporta tanto menús desktop (`.menu-dropdown-content a`) como móvil (`.drawer-dropdown-submenu-item`)
- La clave es solo detener la propagación, NO prevenir el comportamiento por defecto del enlace

## Navegación de Submenús - Estado Final

### ✅ FUNCIONA EN PREVIEW REAL
Los submenús navegan correctamente cuando se visualiza el sitio fuera del editor.

### ⚠️ PENDIENTE EN EDITOR
La navegación de submenús en el contexto del editor del website builder requiere trabajo adicional. Los elementos principales del menú funcionan porque recargan el iframe completo con los parámetros correctos.

## Patrón para Implementar Nuevas Páginas (IMPORTANTE)

Para implementar navegación a nuevas páginas (Products, Pages, etc.), seguir estos pasos:

### 1. Crear la Ruta en ASP.NET Core
**Archivo**: `Program.cs`
```csharp
app.MapControllerRoute(
    name: "products",
    pattern: "products",
    defaults: new { controller = "WebsiteBuilder", action = "Preview" });
```

### 2. Detectar la Ruta en el Controller
**Archivo**: `Controllers/WebsiteBuilderController.cs`
```csharp
if (Request.Path.Value?.Equals("/products", StringComparison.OrdinalIgnoreCase) == true)
{
    page = "products";
}
```

### 3. Manejar la Página en Preview.cshtml
**Archivo**: `Views/WebsiteBuilder/Preview.cshtml`
```javascript
else if (currentPageId === 'products') {
    // Special handling for products page
    currentSectionsConfig = {
        ...currentSectionsConfig,
        sectionOrder: ['header', 'products', 'footer'],
        // configuración específica
    };
}
```

### 4. Crear la Función de Renderizado
**Archivo**: `wwwroot/js/website-render-functions.js`
```javascript
function renderProductsPage(config = {}) {
    // Implementación del renderizado
}
window.renderProductsPage = renderProductsPage;
```

### 5. Crear el Endpoint API (si necesita datos)
**Archivo**: Controller correspondiente
```csharp
[HttpGet]
[Route("api/builder/products/search")]
public async Task<IActionResult> SearchProductsForBuilder()
{
    // Retornar datos en camelCase
}
```

## Lecciones Aprendidas

### 1. Serialización JSON
- **SIEMPRE** usar camelCase explícito en los endpoints API
- Ejemplo: `title = c.Title` en lugar de solo `c.Title`

### 2. Navegación en Submenús
- Los submenús requieren `e.stopPropagation()` para evitar que el padre bloquee la navegación
- En preview real funciona correctamente
- En el editor requiere manejo especial (pendiente de optimizar)

### 3. Renderizado Dinámico
- Usar `setTimeout` después de actualizar innerHTML para aplicar traducciones
- Cargar datos DESPUÉS de renderizar el HTML base

## Estado de las Tareas

✅ Implementar expansión del dropdown de Colecciones con opción 'Todas las colecciones'
✅ Crear ruta /collections en ASP.NET Core  
✅ Implementar página de lista de colecciones con datos reales
✅ Arreglar problema del dropdown que se cierra al hacer clic en Colecciones
✅ Resolver visibilidad del submenú de colecciones
✅ Arreglar carga dinámica de colecciones en la página /collections
✅ Resolver problema de visualización de nombres e imágenes (camelCase vs PascalCase)
✅ Resolver problema de ProductCount undefined
✅ Rediseñar página de colecciones para coincidir con el diseño objetivo
✅ Resolver problema de navegación en submenús (funciona en preview real)
⚠️ Navegación de submenús en editor (pendiente - no crítico)
⏳ Agregar página collections al sistema de páginas del website builder
⏳ Testear navegación completa desde menú hasta página de colecciones

## Próximas Implementaciones

### Products Page
- Seguir el mismo patrón que Collections
- Endpoint: `/api/builder/products/search`
- Renderizado: `renderProductsPage()`

### Individual Collection Pages
- Ruta: `/collections/{handle}`
- Necesita pasar el handle al controller
- Cargar productos de esa colección específica

### Individual Product Pages
- Ruta: `/products/{handle}`
- Ya parcialmente implementado
- Necesita completar el renderizado

### Pages (CMS)
- Decidir estructura de páginas estáticas
- Implementar sistema CMS básico si es necesario