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

## Problemas y Soluciones - Página de Productos de Colección

### PROBLEMA 1: Navegación incorrecta al hacer click en cards de colección
**Síntoma**: Al hacer click en un card de colección, navegaba a `/products/{handle}` en lugar de `/collections/{handle}`

**Causa**: El controlador WebsiteBuilderController detectaba cualquier URL con handle como página de producto:
```csharp
// INCORRECTO
if (!string.IsNullOrEmpty(handle) || Request.Path.Value?.StartsWith("/products/", StringComparison.OrdinalIgnoreCase) == true)
{
    page = "product"; // Esto capturaba TODAS las rutas con handle
}
```

**Solución**: Cambiar la lógica para ser más específica:
```csharp
// CORRECTO
if (Request.Path.Value?.StartsWith("/products/", StringComparison.OrdinalIgnoreCase) == true && !string.IsNullOrEmpty(handle))
{
    page = "product";
}
else if (Request.Path.Value?.StartsWith("/collections/", StringComparison.OrdinalIgnoreCase) == true && !string.IsNullOrEmpty(handle))
{
    page = "collection";
}
```

### PROBLEMA 2: Página mostrando solo header y footer sin contenido
**Síntoma**: La página de productos de colección mostraba solo header y footer

**Causa**: Faltaba el caso 'collection' en la función `renderPreviewContent` de Preview.cshtml

**Solución**: Agregar el caso en Preview.cshtml:
```javascript
} else if (sectionId === 'collection') {
    // Render individual collection page
    const handle = '@ViewBag.CollectionHandle';
    if (handle && window.parent.renderCollectionPage) {
        return window.parent.renderCollectionPage({ handle: handle });
    }
}
```

Y cargar los datos después del renderizado:
```javascript
if (currentPageId === 'collection') {
    setTimeout(() => {
        const handle = '@ViewBag.CollectionHandle';
        if (handle && window.parent.loadCollectionProductsData) {
            window.parent.loadCollectionProductsData(handle);
        }
    }, 100);
}
```

### PROBLEMA 3: CSS no se aplicaba al preview
**Síntoma**: Los estilos de la página de productos no se veían en el preview

**Causa**: El archivo CSS no estaba incluido en Preview.cshtml

**Solución**: Agregar el CSS con cache busting:
```html
<link rel="stylesheet" href="~/css/website-builder.css?v=@DateTime.Now.Ticks" />
```

### PROBLEMA 4: Pérdida del diseño original al implementar filtros
**Síntoma**: Después de agregar la funcionalidad de filtros, los cards de productos perdieron:
- Estrellas de rating
- Formato de moneda ($2,500.00 USD)
- Badges de descuento
- Estructura HTML completa

**Causa**: La función `renderProductsGrid` fue reescrita de forma muy básica, perdiendo todo el HTML del diseño original

**Solución**: Restaurar la función completa con:
1. Formato de precio usando `Intl.NumberFormat`
2. Generación de estrellas SVG con rating
3. Badge de descuento calculado dinámicamente
4. Estructura HTML completa con todas las clases CSS

```javascript
// Formatear precios
const formatPrice = (price) => {
    return new Intl.NumberFormat('es-DO', {
        style: 'currency',
        currency: 'USD',
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
    }).format(price);
};

// Generar estrellas
const starsHtml = Array(5).fill(0).map((_, i) => 
    `<svg class="star-icon ${i < rating ? 'filled' : ''}" width="12" height="12" viewBox="0 0 12 12">
        <path d="..." fill="currentColor"/>
    </svg>`
).join('');
```

### PROBLEMA 5: Error de compilación con Product.IsActive
**Síntoma**: Error CS1061: 'Product' does not contain a definition for 'IsActive'

**Causa**: El modelo Product usa `Status` (string) en lugar de `IsActive` (bool)

**Solución**: Cambiar la condición:
```csharp
// INCORRECTO
.Where(p => p.IsActive)

// CORRECTO
.Where(p => p.Status == "active")
```

## Implementación de Filtros y Ordenamiento

### Panel de Filtros (Offcanvas)
Se implementó un panel lateral que se desliza desde la izquierda con:
- Botón de cerrar (X)
- Selector de ordenamiento integrado
- Slider de rango de precio con dos controles

### Funcionalidad de Ordenamiento
Opciones implementadas:
- Más vendidos (orden original)
- Alfabéticamente A-Z
- Alfabéticamente Z-A  
- Precio: menor a mayor
- Precio: mayor a menor

### Slider de Precio
- Doble slider para seleccionar rango mínimo y máximo
- Se ajusta automáticamente al rango de precios de los productos
- Actualización en tiempo real del grid de productos
- Prevención de cruce de valores (min no puede ser mayor que max)

### Sincronización de Controles
- El selector de ordenamiento principal se sincroniza con el del panel de filtros
- Los cambios en cualquiera actualiza ambos
- El contador de productos se actualiza con los filtros aplicados

## Rutas y Endpoints Implementados

### Rutas en Program.cs
```csharp
// Página de lista de colecciones
app.MapControllerRoute(
    name: "collections",
    pattern: "collections",
    defaults: new { controller = "WebsiteBuilder", action = "Preview" });

// Página de productos de una colección
app.MapControllerRoute(
    name: "collection",
    pattern: "collections/{handle}",
    defaults: new { controller = "WebsiteBuilder", action = "Preview" });
```

### API Endpoints
```csharp
// Obtener productos de una colección específica
[HttpGet]
[Route("api/builder/collections/{handle}/products")]
public async Task<IActionResult> GetCollectionProducts(string handle)
```

## Lecciones Aprendidas - Filtros y UI

### 1. Preservar Funcionalidad al Agregar Features
- **SIEMPRE** hacer backup del código funcional antes de agregar nuevas características
- Al refactorizar funciones, mantener TODA la funcionalidad original
- Documentar qué hace cada parte del código antes de modificarlo

### 2. Gestión de Estado en Filtros
- Mantener arrays separados: `originalProducts` (inmutable) y `currentProducts` (mutable)
- Los filtros de precio deben trabajar sobre `originalProducts`
- El ordenamiento se aplica después del filtrado

### 3. CSS para Paneles Offcanvas
- Usar `position: fixed` con overlay de fondo semi-transparente
- Animar con `transform: translateX()` para deslizamiento suave
- Z-index alto (9999) para asegurar que esté sobre todo
- Diferentes anchos para diferentes breakpoints responsivos

### 4. Sincronización de UI
- Cuando hay controles duplicados (selectores de ordenamiento), mantenerlos sincronizados
- Usar IDs únicos para cada control
- Actualizar programáticamente el valor de ambos cuando uno cambia

## Estado Final de la Implementación

✅ Navegación completa: Menú → Lista de colecciones → Productos de colección
✅ Página de productos con diseño completo (imágenes, estrellas, precios formateados)
✅ Panel de filtros con UI según diseño proporcionado
✅ Ordenamiento funcional (alfabético, precio)
✅ Slider de precio con rango dinámico
✅ Sincronización entre controles de ordenamiento
✅ Diseño responsivo
✅ Sin elementos de marca (removidos vendor "Aurora", badges "Oferta", "3 Colors")

## Implementación de Políticas - Navegación y Páginas

### Resumen
Este documento detalla la implementación completa de la funcionalidad de navegación de políticas, siguiendo el mismo patrón exitoso usado para colecciones. Permite a los usuarios asignar enlaces de políticas a elementos del menú y visualizar páginas de políticas con el diseño completo del sitio.

### Archivos Modificados y Líneas de Código

### 1. `/Controllers/PoliciesController.cs`

#### Endpoints API para Website Builder
**Líneas: 178-258**
```csharp
// GET: api/builder/policies
[HttpGet]
[Route("api/builder/policies")]
[AllowAnonymous] // Permitir acceso anónimo para el Website Builder
public async Task<IActionResult> GetPoliciesForBuilder()
{
    try
    {
        var company = await _context.Companies.FirstOrDefaultAsync();
        if (company == null)
        {
            return Json(new[] { new { id = 0, name = "Error: No hay empresa configurada", handle = "" } });
        }

        var policy = await _context.Policies
            .FirstOrDefaultAsync(p => p.CompanyId == company.Id);

        var policies = new List<object>();

        if (policy != null)
        {
            // Agregar cada política con su handle y nombre
            if (!string.IsNullOrWhiteSpace(policy.RefundPolicyContent))
            {
                policies.Add(new
                {
                    id = "refund",
                    name = "Política de devoluciones",
                    handle = "refund"
                });
            }

            if (!string.IsNullOrWhiteSpace(policy.PrivacyPolicyContent))
            {
                policies.Add(new
                {
                    id = "privacy",
                    name = "Política de privacidad",
                    handle = "privacy"
                });
            }

            if (!string.IsNullOrWhiteSpace(policy.TermsOfServiceContent))
            {
                policies.Add(new
                {
                    id = "terms",
                    name = "Términos del servicio",
                    handle = "terms"
                });
            }

            if (!string.IsNullOrWhiteSpace(policy.ShippingPolicyContent))
            {
                policies.Add(new
                {
                    id = "shipping",
                    name = "Política de envío",
                    handle = "shipping"
                });
            }

            if (!string.IsNullOrWhiteSpace(policy.ContactInformationContent))
            {
                policies.Add(new
                {
                    id = "contact",
                    name = "Información de contacto",
                    handle = "contact"
                });
            }
        }

        return Json(policies);
    }
    catch (Exception ex)
    {
        _logger.LogError(ex, "Error al obtener políticas para builder");
        return Json(new[] { new { id = 0, name = "Error al cargar políticas", handle = "" } });
    }
}
```

#### Endpoint para Contenido Individual de Política
**Líneas: 260-312**
```csharp
// GET: api/builder/policies/{type}
[HttpGet]
[Route("api/builder/policies/{type}")]
[AllowAnonymous]
public async Task<IActionResult> GetPolicyContent(string type)
{
    try
    {
        // Validar que el tipo de política sea válido
        var validTypes = new[] { "refund", "privacy", "terms", "shipping", "contact" };
        if (!validTypes.Contains(type.ToLower()))
        {
            return Json(new { success = false, message = "Tipo de política no válido" });
        }

        var company = await _context.Companies.FirstOrDefaultAsync();
        if (company == null)
        {
            return Json(new { success = false, message = "No se ha configurado la empresa" });
        }

        var policy = await _context.Policies
            .FirstOrDefaultAsync(p => p.CompanyId == company.Id);

        if (policy == null)
        {
            return Json(new { success = false, message = "No se encontraron políticas" });
        }

        string content = type.ToLower() switch
        {
            "refund" => policy.RefundPolicyContent,
            "privacy" => policy.PrivacyPolicyContent,
            "terms" => policy.TermsOfServiceContent,
            "shipping" => policy.ShippingPolicyContent,
            "contact" => policy.ContactInformationContent,
            _ => ""
        };

        return Json(new
        {
            success = true,
            type = type,
            title = GetPolicyTitle(type),
            content = content
        });
    }
    catch (Exception ex)
    {
        _logger.LogError(ex, "Error al obtener contenido de política");
        return Json(new { success = false, message = "Error al cargar la política" });
    }
}
```

### 2. `/wwwroot/js/website-builder.js`

#### Handler para Políticas en el Dropdown de Links
**Líneas: 28465-28556**
```javascript
} else if (url === '/policies') {
    console.log('[DEBUG] Policies item clicked');
    // Check if submenu already exists
    let $submenu = $item.find('.link-submenu');
    console.log('[DEBUG] Submenu exists:', $submenu.length > 0);
    
    if ($submenu.length === 0) {
        console.log('[DEBUG] Creating new submenu for policies');
        // Create submenu structure
        const submenuHtml = `
            <ul class="link-submenu" style="display: none;">
                <li data-url="/policies">
                    <i class="material-icons">gavel</i>
                    <span>Todas las políticas</span>
                </li>
                <li class="submenu-loading">
                    <i class="material-icons rotating">sync</i>
                    <span>Cargando políticas...</span>
                </li>
            </ul>
        `;
        
        $item.append(submenuHtml);
        $submenu = $item.find('.link-submenu');
        console.log('[DEBUG] Submenu created:', $submenu.length);
        
        // Load policies from API
        $.ajax({
            url: '/api/builder/policies',
            method: 'GET',
            success: function(policies) {
                console.log('[DEBUG] Policies API response:', policies);
                // Remove loading indicator
                $submenu.find('.submenu-loading').remove();
                
                // Add individual policies
                if (policies && policies.length > 0) {
                    policies.forEach(function(policy) {
                        const policyHtml = `
                            <li data-url="/policies/${policy.handle}">
                                <i class="material-icons">description</i>
                                <span>${policy.name}</span>
                            </li>
                        `;
                        $submenu.append(policyHtml);
                    });
                    console.log('[DEBUG] Added', policies.length, 'policies to submenu');
                } else {
                    $submenu.append('<li class="no-items"><span>No hay políticas configuradas</span></li>');
                }
                
                // Add click handler for submenu items
                $submenu.find('li:not(.no-items)').on('click', function(e) {
                    e.stopPropagation();
                    const subUrl = $(this).data('url');
                    const dropdownId = $dropdown.attr('id');
                    
                    let $input;
                    if (dropdownId.startsWith('link-suggestions-submenu-')) {
                        const parentId = dropdownId.replace('link-suggestions-submenu-', '');
                        $input = $(`#submenu-url-${parentId}`);
                    } else if (dropdownId.startsWith('link-suggestions-inline-')) {
                        // For inline edit dropdowns
                        $input = $dropdown.parent().find('.edit-item-url');
                    } else {
                        const inputId = dropdownId === 'link-suggestions-create' ? 'new-item-url-create' : 'new-item-url-edit';
                        $input = $('#' + inputId);
                    }
                    
                    if ($input.length) {
                        $input.val(subUrl);
                    }
                    // Clear the keep-open flag before hiding
                    $dropdown.data('keep-open', false);
                    $dropdown.fadeOut(200);
                });
            },
            error: function(xhr, status, error) {
                console.log('[DEBUG] Policies API error:', status, error);
                $submenu.find('.submenu-loading').html('<span>Error al cargar políticas</span>');
            }
        });
    }
    
    // Toggle submenu visibility
    console.log('[DEBUG] About to toggle submenu, current display:', $submenu.css('display'));
    $submenu.slideToggle(200, function() {
        console.log('[DEBUG] Submenu toggled, new display:', $submenu.css('display'));
    });
    $item.toggleClass('expanded');
    console.log('[DEBUG] Item expanded:', $item.hasClass('expanded'));
}
```

### 3. `/Program.cs`

#### Rutas para Páginas de Políticas
**Líneas: 121-129**
```csharp
app.MapControllerRoute(
    name: "policies",
    pattern: "policies",
    defaults: new { controller = "WebsiteBuilder", action = "Preview" });

app.MapControllerRoute(
    name: "policy",
    pattern: "policies/{type}",
    defaults: new { controller = "WebsiteBuilder", action = "Preview" });
```

### 4. `/Controllers/WebsiteBuilderController.cs`

#### Detección de Rutas de Políticas
**Líneas: 52-63**
```csharp
// Check if this is being accessed via /policies route
if (Request.Path.Value?.Equals("/policies", StringComparison.OrdinalIgnoreCase) == true)
{
    page = "policies";
}

// Check if this is being accessed via /policies/{type} route
if (Request.Path.Value?.StartsWith("/policies/", StringComparison.OrdinalIgnoreCase) == true)
{
    page = "policy"; // singular for individual policy
    ViewBag.PolicyType = type; // Use the type parameter
}
```

**NOTA IMPORTANTE**: Se agregó el parámetro `string type = null` a la firma del método `Preview` en la línea 24:
```csharp
public IActionResult Preview(string page = null, string handle = null, string type = null)
```

### 5. `/wwwroot/js/website-render-functions.js`

#### Función para Renderizar Lista de Políticas
**Líneas: 3724-3814**
```javascript
// ==================== POLICIES PAGE (ALL POLICIES) ====================
function renderPoliciesPage(config = {}) {
    console.log('[DEBUG] renderPoliciesPage called');
    
    const html = `
        <div class="policies-page">
            <div class="policies-container">
                <div class="policies-header">
                    <h1>${translations[currentLanguage]['all_policies'] || 'Políticas'}</h1>
                </div>
                <div class="policies-grid" id="policies-grid">
                    <div class="loading-state">
                        ${translations[currentLanguage]['loading_policies'] || 'Cargando políticas...'}
                    </div>
                </div>
            </div>
        </div>
    `;
    
    console.log('[DEBUG] Returning policies HTML');
    return html;
}

// Function to load policies data
window.loadPoliciesData = function() {
    console.log('[DEBUG] loadPoliciesData called');
    
    $.ajax({
        url: '/api/builder/policies',
        method: 'GET',
        success: function(policies) {
            console.log('[DEBUG] Policies API response:', policies);
            const grid = document.getElementById('policies-grid');
            if (!grid) return;
            
            let html = '';
            
            // Always show "All policies" first
            html += `
                <div class="policy-card">
                    <a href="/policies">
                        <div class="policy-icon">
                            <i class="material-icons">gavel</i>
                        </div>
                        <div class="policy-info">
                            <h3>${translations[currentLanguage]['all_policies'] || 'Todas las políticas'}</h3>
                            <p>${translations[currentLanguage]['view_all_policies'] || 'Ver todas nuestras políticas'}</p>
                        </div>
                    </a>
                </div>
            `;
            
            if (policies && policies.length > 0) {
                policies.forEach(policy => {
                    const iconMap = {
                        'refund': 'autorenew',
                        'privacy': 'lock',
                        'terms': 'description',
                        'shipping': 'local_shipping',
                        'contact': 'contact_mail'
                    };
                    
                    html += `
                        <div class="policy-card">
                            <a href="/policies/${policy.handle}">
                                <div class="policy-icon">
                                    <i class="material-icons">${iconMap[policy.handle] || 'description'}</i>
                                </div>
                                <div class="policy-info">
                                    <h3>${policy.name}</h3>
                                    <p>${translations[currentLanguage]['read_more'] || 'Leer más'}</p>
                                </div>
                            </a>
                        </div>
                    `;
                });
            } else {
                html = '<p class="no-policies">' + (translations[currentLanguage]['no_policies_configured'] || 'No hay políticas configuradas') + '</p>';
            }
            
            grid.innerHTML = html;
        },
        error: function(xhr, status, error) {
            console.error('[DEBUG] Error loading policies:', error);
            const grid = document.getElementById('policies-grid');
            if (grid) {
                grid.innerHTML = '<p class="error-message">' + (translations[currentLanguage]['error_loading_policies'] || 'Error al cargar las políticas') + '</p>';
            }
        }
    });
};
```

#### Función para Renderizar Política Individual
**Líneas: 3816-3907**
```javascript
// ==================== POLICY PAGE (SINGULAR - POLICY CONTENT) ====================
function renderPolicyPage(config = {}) {
    console.log('[DEBUG] renderPolicyPage called with config:', config);
    
    const type = config.type || '';
    if (!type) {
        console.error('[DEBUG] No policy type provided');
        return '<div class="error-message">No se especificó el tipo de política</div>';
    }
    
    // HTML base de la página
    const html = `
        <div class="policy-page" data-policy-type="${type}">
            <div class="policy-container">
                <div class="policy-header">
                    <h1 id="policy-title">${translations[currentLanguage]['loading'] || 'Cargando...'}</h1>
                </div>
                <div class="policy-content" id="policy-content">
                    <div class="loading-state">
                        ${translations[currentLanguage]['loading_policy'] || 'Cargando política...'}
                    </div>
                </div>
            </div>
        </div>
    `;
    
    console.log('[DEBUG] Returning policy HTML');
    return html;
}

// Function to load individual policy content
window.loadPolicyContent = function(type) {
    console.log('[DEBUG] loadPolicyContent called for type:', type);
    
    $.ajax({
        url: `/api/builder/policies/${type}`,
        method: 'GET',
        success: function(response) {
            console.log('[DEBUG] Policy content API response:', response);
            
            if (response.success) {
                // Update title
                const titleElement = document.getElementById('policy-title');
                if (titleElement) {
                    titleElement.textContent = response.title;
                }
                
                // Update content
                const contentElement = document.getElementById('policy-content');
                if (contentElement) {
                    if (response.content) {
                        // Convert newlines to paragraphs for better formatting
                        const formattedContent = response.content
                            .split('\n\n')
                            .filter(p => p.trim())
                            .map(p => `<p>${p.trim()}</p>`)
                            .join('');
                        
                        contentElement.innerHTML = `
                            <div class="policy-text">
                                ${formattedContent}
                            </div>
                        `;
                    } else {
                        contentElement.innerHTML = `
                            <p class="no-content">${translations[currentLanguage]['no_policy_content'] || 'Esta política aún no ha sido configurada.'}</p>
                        `;
                    }
                }
            } else {
                const contentElement = document.getElementById('policy-content');
                if (contentElement) {
                    contentElement.innerHTML = `
                        <p class="error-message">${response.message || 'Error al cargar la política'}</p>
                    `;
                }
            }
        },
        error: function(xhr, status, error) {
            console.error('[DEBUG] Error loading policy content:', error);
            const contentElement = document.getElementById('policy-content');
            if (contentElement) {
                contentElement.innerHTML = `
                    <p class="error-message">${translations[currentLanguage]['error_loading_policy'] || 'Error al cargar la política'}</p>
                `;
            }
        }
    });
};

window.renderPoliciesPage = renderPoliciesPage;
window.renderPolicyPage = renderPolicyPage;
```

### 6. `/Views/WebsiteBuilder/Preview.cshtml`

#### Configuración de Páginas de Políticas
**Líneas: 498-538**
```javascript
} else if (currentPageId === 'policies') {
    // Special handling for policies list page
    console.log('[PREVIEW] Loading policies page configuration');
    // Keep existing header and footer configurations
    const existingHeader = currentSectionsConfig.header || {};
    const existingFooter = currentSectionsConfig.footer || {};
    
    // Policies page should show header, policies list, and footer
    currentSectionsConfig = {
        ...currentSectionsConfig,
        sectionOrder: ['header', 'policies', 'footer'],
        header: existingHeader,
        footer: existingFooter,
        policies: {
            isHidden: false,
            colorScheme: 'scheme1'
        }
    };
    console.log('[PREVIEW] Policies page config set:', currentSectionsConfig);
} else if (currentPageId === 'policy') {
    // Special handling for individual policy page
    console.log('[PREVIEW] Loading individual policy page configuration');
    const policyType = '@ViewBag.PolicyType';
    console.log('[PREVIEW] Policy type:', policyType);
    
    // Keep existing header and footer configurations
    const existingHeader = currentSectionsConfig.header || {};
    const existingFooter = currentSectionsConfig.footer || {};
    
    // Policy page should show header, policy content, and footer
    currentSectionsConfig = {
        ...currentSectionsConfig,
        sectionOrder: ['header', 'policy', 'footer'],
        header: existingHeader,
        footer: existingFooter,
        policy: {
            isHidden: false,
            type: policyType
        }
    };
    console.log('[PREVIEW] Policy page config set:', currentSectionsConfig);
}
```

#### Renderizado de Secciones de Políticas
**Líneas: 1260-1307**
```javascript
} else if (sectionId === 'policies') {
    console.log('[PREVIEW] Processing policies list section');
    const policiesConfig = currentSectionsConfig.policies;
    
    if (policiesConfig && !policiesConfig.isHidden) {
        // Render policies list page
        if (window.renderPoliciesPage && typeof window.renderPoliciesPage === 'function') {
            console.log('[PREVIEW] Rendering policies with renderPoliciesPage');
            finalHtml += window.renderPoliciesPage(policiesConfig);
        } else {
            console.log('[PREVIEW] renderPoliciesPage not available, using fallback');
            finalHtml += `
                <div class="section-wrapper policies-section" style="padding: 40px 0; background: #f5f5f5;">
                    <div class="container" style="max-width: 1200px; margin: 0 auto; padding: 0 20px;">
                        <div style="text-align: center; color: #666;">
                            <i class="material-icons" style="font-size: 48px; margin-bottom: 16px;">gavel</i>
                            <h3>Políticas</h3>
                            <p>La página de políticas está cargando...</p>
                        </div>
                    </div>
                </div>
            `;
        }
    }
} else if (sectionId === 'policy') {
    console.log('[PREVIEW] Processing individual policy section');
    const policyConfig = currentSectionsConfig.policy;
    
    if (policyConfig && !policyConfig.isHidden) {
        // Render individual policy page
        if (window.renderPolicyPage && typeof window.renderPolicyPage === 'function') {
            console.log('[PREVIEW] Rendering policy with renderPolicyPage');
            finalHtml += window.renderPolicyPage(policyConfig);
        } else {
            console.log('[PREVIEW] renderPolicyPage not available, using fallback');
            finalHtml += `
                <div class="section-wrapper policy-section" style="padding: 40px 0; background: #f5f5f5;">
                    <div class="container" style="max-width: 1200px; margin: 0 auto; padding: 0 20px;">
                        <div style="text-align: center; color: #666;">
                            <i class="material-icons" style="font-size: 48px; margin-bottom: 16px;">description</i>
                            <h3>Política</h3>
                            <p>El contenido de la política está cargando...</p>
                        </div>
                    </div>
                </div>
            `;
        }
    }
}
```

#### Carga de Datos Después del Renderizado
**Líneas: 1405-1418**
```javascript
// Load policies data if on policies page
if (currentPageId === 'policies' && window.loadPoliciesData) {
    console.log('[PREVIEW] Loading policies data...');
    window.loadPoliciesData();
}

// Load policy content if on individual policy page
if (currentPageId === 'policy' && window.loadPolicyContent) {
    const policyType = currentSectionsConfig.policy?.type;
    if (policyType) {
        console.log('[PREVIEW] Loading policy content for type:', policyType);
        window.loadPolicyContent(policyType);
    }
}
```

### 7. `/wwwroot/css/website-builder.css`

#### Estilos para Páginas de Políticas
**Líneas: 9520-9674**
```css
/* ==================== POLICIES STYLES ==================== */
.policies-page {
    min-height: 400px;
    padding: 40px 0;
}

.policies-container {
    max-width: 1200px;
    margin: 0 auto;
    padding: 0 20px;
}

.policies-header {
    text-align: center;
    margin-bottom: 40px;
}

.policies-header h1 {
    font-size: 32px;
    margin: 0;
    color: #333;
}

.policies-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
    gap: 30px;
    margin-top: 40px;
}

.policy-card {
    background: #fff;
    border: 1px solid #e0e0e0;
    border-radius: 8px;
    padding: 30px;
    text-align: center;
    transition: all 0.3s ease;
    cursor: pointer;
}

.policy-card:hover {
    box-shadow: 0 4px 12px rgba(0,0,0,0.1);
    transform: translateY(-2px);
}

.policy-card a {
    text-decoration: none;
    color: inherit;
    display: block;
}

.policy-icon {
    width: 60px;
    height: 60px;
    margin: 0 auto 20px;
    background: #f5f5f5;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
}

.policy-icon i {
    font-size: 28px;
    color: #666;
}

.policy-info h3 {
    font-size: 18px;
    margin: 0 0 10px 0;
    color: #333;
}

.policy-info p {
    margin: 0;
    color: #666;
    font-size: 14px;
}

/* Individual Policy Page */
.policy-page {
    min-height: 400px;
    padding: 60px 0;
    background: #fff;
}

.policy-container {
    max-width: 800px;
    margin: 0 auto;
    padding: 0 20px;
}

.policy-header {
    margin-bottom: 40px;
}

.policy-header h1 {
    font-size: 36px;
    margin: 0;
    color: #333;
    line-height: 1.2;
}

.policy-content {
    font-size: 16px;
    line-height: 1.8;
    color: #444;
}

.policy-text p {
    margin-bottom: 20px;
}

.policy-text p:last-child {
    margin-bottom: 0;
}

.no-policies,
.no-content {
    text-align: center;
    color: #666;
    padding: 40px 20px;
    font-size: 16px;
}

.error-message {
    text-align: center;
    color: #d32f2f;
    padding: 40px 20px;
    font-size: 16px;
}

.loading-state {
    text-align: center;
    padding: 40px 20px;
    color: #666;
    font-size: 16px;
}

/* Responsive */
@media (max-width: 768px) {
    .policies-grid {
        grid-template-columns: 1fr;
        gap: 20px;
    }
    
    .policy-header h1 {
        font-size: 28px;
    }
    
    .policy-container {
        padding: 0 15px;
    }
}
```

## Características Implementadas

### Sistema de Navegación Inteligente
1. **Carga dinámica**: Solo muestra políticas que tienen contenido configurado
2. **Submenú expandible**: Al hacer click en "Políticas" se muestran las opciones disponibles
3. **Opción "Todas las políticas"**: Siempre aparece primero en el submenú
4. **Handler de clicks**: Inserta correctamente la URL seleccionada en el campo de enlace

### Iconos Distintivos por Tipo
```javascript
const iconMap = {
    'refund': 'autorenew',      // 🔄 Devoluciones
    'privacy': 'lock',          // 🔒 Privacidad
    'terms': 'description',     // 📄 Términos
    'shipping': 'local_shipping', // 🚚 Envío
    'contact': 'contact_mail'   // ✉️ Contacto
};
```

### Formateo de Contenido
El contenido de las políticas se formatea automáticamente:
- Convierte saltos de línea dobles en párrafos HTML
- Elimina espacios en blanco innecesarios
- Mantiene una estructura de lectura limpia

### Estados de la Interfaz
1. **Estado de carga**: Muestra mensaje mientras se cargan las políticas
2. **Estado vacío**: Mensaje cuando no hay políticas configuradas
3. **Estado de error**: Mensajes descriptivos si algo falla
4. **Estado sin contenido**: Mensaje específico cuando una política individual no tiene contenido

## Patrón de Implementación para Futuras Páginas

### 1. Backend - Controller
```csharp
// Agregar endpoints API con camelCase explícito
[HttpGet]
[Route("api/builder/[entity]")]
[AllowAnonymous]
public async Task<IActionResult> Get[Entity]ForBuilder()
{
    // Retornar siempre con propiedades en camelCase
    return Json(new { id = x.Id, name = x.Name, handle = x.Handle });
}
```

### 2. Frontend - JavaScript Handler
```javascript
else if (url === '/[entity]') {
    // Implementar carga dinámica del submenú
    // Usar AJAX para cargar desde API
    // Agregar handlers para clicks en items del submenú
}
```

### 3. Rutas - Program.cs
```csharp
app.MapControllerRoute(
    name: "[entity]",
    pattern: "[entity]",
    defaults: new { controller = "WebsiteBuilder", action = "Preview" });
```

### 4. Detección - WebsiteBuilderController
```csharp
if (Request.Path.Value?.Equals("/[entity]", StringComparison.OrdinalIgnoreCase) == true)
{
    page = "[entity]";
}
```

### 5. Renderizado - website-render-functions.js
```javascript
function render[Entity]Page(config = {}) {
    // Implementar HTML base
}

window.load[Entity]Data = function() {
    // Implementar carga AJAX de datos
}
```

### 6. Vista - Preview.cshtml
- Agregar configuración de página en la sección de inicialización
- Agregar caso en renderPreviewContent
- Agregar carga de datos después del renderizado

### 7. Estilos - website-builder.css
- Mantener consistencia con el diseño existente
- Usar grid para layouts de múltiples elementos
- Implementar diseño responsivo

## Lecciones Aprendidas

### 1. Consistencia en Serialización JSON
**SIEMPRE** usar camelCase explícito en los endpoints:
```csharp
// ✅ CORRECTO
new { id = p.Id, name = p.Name, handle = p.Handle }

// ❌ EVITAR
new { p.Id, p.Name, p.Handle }
```

### 2. Validación de Contenido
Solo mostrar elementos que tienen contenido real:
```csharp
if (!string.IsNullOrWhiteSpace(policy.RefundPolicyContent))
{
    policies.Add(new { ... });
}
```

### 3. Manejo de Estados
Siempre implementar todos los estados posibles:
- Loading
- Empty
- Error
- Success

### 4. Formateo de Texto
Convertir texto plano en HTML bien estructurado:
```javascript
const formattedContent = response.content
    .split('\n\n')
    .filter(p => p.trim())
    .map(p => `<p>${p.trim()}</p>`)
    .join('');
```

### 5. Debug Logs
Mantener logs detallados durante el desarrollo:
```javascript
console.log('[DEBUG] Policies API response:', policies);
console.log('[DEBUG] Added', policies.length, 'policies to submenu');
```

## Estado de Implementación

✅ Endpoints API funcionando correctamente
✅ Submenú expandible en el dropdown de navegación
✅ Página de lista de políticas con grid responsivo
✅ Páginas individuales de políticas con contenido formateado
✅ Manejo completo de estados (carga, vacío, error)
✅ Integración con sistema de traducciones
✅ Estilos CSS consistentes con el diseño del sitio
✅ Navegación funcional desde menú hasta páginas de políticas

## Próximos Pasos Recomendados

1. **Implementar Pages (CMS)**:
   - Seguir el mismo patrón de políticas
   - Crear modelo Page si no existe
   - Implementar CRUD básico
   - Agregar editor de contenido

2. **Mejorar el Editor de Políticas**:
   - Agregar editor WYSIWYG
   - Preview en tiempo real
   - Historial de cambios

3. **Optimizaciones**:
   - Cache de políticas
   - Lazy loading de contenido
   - Compresión de respuestas

4. **SEO**:
   - Meta tags dinámicos
   - URLs canónicas
   - Schema markup para políticas legales