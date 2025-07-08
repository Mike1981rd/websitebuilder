# Plan de Implementación - Módulo de Páginas

## 1. Visión General

El módulo de Páginas permitirá a los usuarios crear y gestionar páginas de contenido (About Us, Privacy Policy, Terms, etc.) que luego serán consumidas por el Website Builder para mostrarlas con el diseño del sitio web.

### Flujo Principal:
1. **Módulo Páginas**: CRUD de páginas con contenido enriquecido
2. **Website Builder**: Consume y renderiza las páginas con el tema aplicado

## 2. Modelo de Datos

### Entidad Page
```csharp
public class Page
{
    public int Id { get; set; }
    
    // Información básica
    public string Title { get; set; }  // Required
    public string Handle { get; set; } // URL slug único (ej: "about-us")
    public string Content { get; set; } // HTML del editor rico
    
    // Estado y visibilidad
    public PageStatus Status { get; set; } = PageStatus.Draft;
    public DateTime? PublishDate { get; set; }
    public bool IsVisible { get; set; } = true;
    
    // SEO
    public string? MetaTitle { get; set; }
    public string? MetaDescription { get; set; }
    
    // Organización
    public int DisplayOrder { get; set; } = 0;
    public string? TemplateName { get; set; } = "default";
    
    // Auditoría
    public DateTime CreatedAt { get; set; }
    public DateTime UpdatedAt { get; set; }
    
    // Relación con Company (multi-tenant)
    public int CompanyId { get; set; }
    public Company Company { get; set; }
}

public enum PageStatus
{
    Draft = 0,
    Published = 1,
    Scheduled = 2
}
```

### Configuración en HotelDbContext
```csharp
// En OnModelCreating
modelBuilder.Entity<Page>()
    .HasIndex(p => new { p.CompanyId, p.Handle })
    .IsUnique();

modelBuilder.Entity<Page>()
    .Property(p => p.Content)
    .HasColumnType("text");
```

## 3. Estructura de Vistas

### Index.cshtml - Lista de Páginas
- **Header**: Título + botón "Crear página"
- **Barra de búsqueda**: Filtrar por título
- **Tabla responsiva**:
  - Título (enlace a Edit)
  - Handle/URL
  - Estado (badge con colores)
  - Fecha de actualización
  - Acciones (Edit, Delete)
- **Paginación** si hay muchas páginas

### Create.cshtml / Edit.cshtml
- **Campos del formulario**:
  1. **Información básica**
     - Título (required)
     - Handle (auto-generado desde título, editable)
  
  2. **Contenido**
     - Editor de texto enriquecido (reutilizar del proyecto)
  
  3. **Visibilidad**
     - Estado: Borrador/Publicado/Programado
     - Fecha de publicación (si es programado)
     - Checkbox "Visible en el sitio"
  
  4. **SEO** (sección colapsable)
     - Meta título
     - Meta descripción
     - Preview del snippet de búsqueda
  
  5. **Configuración avanzada** (sección colapsable)
     - Plantilla (select con opciones)
     - Orden de visualización

### Delete.cshtml
- Confirmación estándar con información de la página

## 4. Controller - PagesController

### Acciones principales:
```csharp
[Authorize]
public class PagesController : Controller
{
    // GET: Pages
    public async Task<IActionResult> Index(string searchTerm, int page = 1)
    
    // GET: Pages/Create
    public IActionResult Create()
    
    // POST: Pages/Create
    [HttpPost]
    [ValidateAntiForgeryToken]
    public async Task<IActionResult> Create(Page page)
    
    // GET: Pages/Edit/5
    public async Task<IActionResult> Edit(int? id)
    
    // POST: Pages/Edit/5
    [HttpPost]
    [ValidateAntiForgeryToken]
    public async Task<IActionResult> Edit(int id, Page page)
    
    // GET: Pages/Delete/5
    public async Task<IActionResult> Delete(int? id)
    
    // POST: Pages/Delete/5
    [HttpPost, ActionName("Delete")]
    [ValidateAntiForgeryToken]
    public async Task<IActionResult> DeleteConfirmed(int id)
    
    // Método auxiliar para generar handle único
    private async Task<string> GenerateUniqueHandle(string title, int? excludeId = null)
}
```

### Patrones a seguir:
- Multi-tenant: Filtrar siempre por CompanyId
- Mensajes: TempData["SuccessMessage"] y TempData["ErrorMessage"]
- Redirección post-save: Siempre a Index
- Validaciones: ModelState para campos requeridos

## 5. UI/UX - Siguiendo Patrones del Proyecto

### Sistema de Colores del Theme (CRÍTICO)

#### ✅ Elementos que DEBEN usar var(--primary):

1. **Botón "Añadir página" (Index)**:
```css
.btn-create {
    background-color: var(--primary);  /* NO usar negro como Shopify */
    color: #ffffff;
}

.btn-create:hover {
    background-color: var(--primary);
    opacity: 0.9;
}
```

2. **Botón "Guardar" (Create/Edit)**:
```css
.btn-save, .btn-primary {
    background-color: var(--primary);
    color: #ffffff;
}
```

3. **Radio buttons de Visibilidad**:
```css
input[type="radio"]:checked {
    background-color: var(--primary);
    border-color: var(--primary);
}
```

4. **Enlaces importantes y tabs activos**:
```css
.tab.active {
    border-bottom: 2px solid var(--primary);
}

.page-title-link:hover {
    color: var(--primary);
}
```

5. **Focus states en formularios**:
```css
.form-control:focus {
    border-color: var(--primary);
    box-shadow: 0 0 0 3px rgba(233, 30, 99, 0.1);
}
```

#### ❌ Elementos que NO deben usar el color primario:
- Badges de estado (mantener verde para "Visible")
- Textos de contenido
- Fondos de cards
- Bordes estándar de inputs
- Iconos informativos

### Estados de Páginas
- Publicado: Badge verde (#28a745)
- Borrador: Badge gris (#6c757d)
- Programado: Badge azul (#17a2b8)
- Visible/Oculto: Badge verde/gris

### Iconos (Font Awesome 6.4.0)
- Crear: `fas fa-plus`
- Editar: `fas fa-edit`
- Eliminar: `fas fa-trash`
- Páginas (menú): `fas fa-file-alt`
- SEO: `fas fa-search`
- Calendario: `fas fa-calendar`

### Dark Mode
- Fondo principal: #282A42
- Cards: Mantener color original
- Inputs: Estilos consistentes con otros módulos

### Responsividad
- Tabla con scroll horizontal en móvil
- Formularios con layout vertical en pantallas pequeñas
- Editor de texto adaptativo

## 6. Sistema de Traducciones (Módulo Regular - NO Website Builder)

### Implementación según keypoints.md:

1. **Definir traducciones locales en la vista (.cshtml)**:
```javascript
const pagesTranslations = {
    es: {
        'pages.title': 'Páginas',
        'pages.create': 'Crear página',
        'pages.search': 'Buscar páginas...',
        'pages.status.draft': 'Borrador',
        'pages.status.published': 'Publicado',
        'pages.status.scheduled': 'Programado',
        'pages.form.title': 'Título',
        'pages.form.handle': 'URL amigable',
        'pages.form.content': 'Contenido',
        'pages.form.visibility': 'Visibilidad',
        'pages.form.seo': 'SEO',
        'pages.form.save': 'Guardar',
        'pages.form.cancel': 'Cancelar',
        'pages.form.visible': 'Visible',
        'pages.form.hidden': 'Oculto',
        'pages.form.template': 'Plantilla',
        'pages.form.defaultTemplate': 'Página predeterminada',
        'pages.form.metafields': 'Metacampos',
        'pages.form.searchEngines': 'Publicación en motores de búsqueda',
        'pages.form.searchEnginesDesc': 'Agregar un título y una descripción para ver cómo podría aparecer esta página en una publicación de motor de búsqueda',
        'pages.table.title': 'Título',
        'pages.table.visibility': 'Visibilidad',
        'pages.table.content': 'Contenido',
        'pages.table.updated': 'Actualización',
        'pages.actions.edit': 'Editar',
        'pages.actions.delete': 'Eliminar',
        'pages.filter.all': 'Todo',
        'pages.info.link': 'Más información sobre páginas'
    },
    en: {
        'pages.title': 'Pages',
        'pages.create': 'Create page',
        'pages.search': 'Search pages...',
        'pages.status.draft': 'Draft',
        'pages.status.published': 'Published',
        'pages.status.scheduled': 'Scheduled',
        'pages.form.title': 'Title',
        'pages.form.handle': 'URL handle',
        'pages.form.content': 'Content',
        'pages.form.visibility': 'Visibility',
        'pages.form.seo': 'SEO',
        'pages.form.save': 'Save',
        'pages.form.cancel': 'Cancel',
        'pages.form.visible': 'Visible',
        'pages.form.hidden': 'Hidden',
        'pages.form.template': 'Template',
        'pages.form.defaultTemplate': 'Default page',
        'pages.form.metafields': 'Metafields',
        'pages.form.searchEngines': 'Search engine listing',
        'pages.form.searchEnginesDesc': 'Add a title and description to see how this page might appear in a search engine listing',
        'pages.table.title': 'Title',
        'pages.table.visibility': 'Visibility',
        'pages.table.content': 'Content',
        'pages.table.updated': 'Updated',
        'pages.actions.edit': 'Edit',
        'pages.actions.delete': 'Delete',
        'pages.filter.all': 'All',
        'pages.info.link': 'Learn more about pages'
    }
};
```

2. **Fusionar con el objeto global ANTES del DOMContentLoaded**:
```javascript
// IMPORTANTE: Esto debe ir ANTES del DOMContentLoaded
if (typeof translations !== 'undefined') {
    if (!translations.es) translations.es = {};
    if (!translations.en) translations.en = {};
    
    Object.assign(translations.es, pagesTranslations.es);
    Object.assign(translations.en, pagesTranslations.en);
}
```

3. **Aplicar traducciones después del DOM ready**:
```javascript
document.addEventListener('DOMContentLoaded', function() {
    if (typeof translatePage === 'function') {
        const currentLang = localStorage.getItem('preferredLanguage') || 'es';
        translatePage(currentLang);
    }
});
```

4. **En el HTML, usar data attributes**:
```html
<!-- Textos -->
<h1 data-i18n="pages.title">Páginas</h1>
<button data-i18n="pages.create">Crear página</button>

<!-- Placeholders -->
<input type="text" data-i18n-placeholder="pages.search" placeholder="Buscar páginas...">

<!-- Títulos (tooltips) -->
<button data-i18n-title="pages.deleteTooltip" title="Eliminar página">
    <i class="fas fa-trash"></i>
</button>
```

### Agregar al menú lateral:

1. **En `_MaterializeExactLayout.cshtml` - Agregar el item del menú (~línea 63)**:
```html
<li class="menu-item">
    <a href="@Url.Action("Index", "Pages")" class="menu-link">
        <i class="menu-icon fas fa-file-alt"></i>
        <span class="menu-text" data-i18n="menu.pages">Páginas</span>
        <span class="menu-tooltip" data-i18n="menu.pages">Páginas</span>
    </a>
</li>
```

2. **En `_MaterializeExactLayout.cshtml` - Agregar traducciones al objeto global (~línea 609)**:
```javascript
es: {
    // ... otras traducciones existentes
    'menu.pages': 'Páginas',
},
en: {
    // ... otras traducciones existentes  
    'menu.pages': 'Pages',
}
```

### Notas importantes del sistema de traducciones:
- **NO usar `applyTranslations()`** - esa es solo para Website Builder
- **Usar `translatePage()`** - función del layout principal
- **localStorage key**: `preferredLanguage` (NO `selectedLanguage`)
- Las traducciones se fusionan con el objeto global del layout
- Aplicar después del DOMContentLoaded

## 7. Editor de Texto Enriquecido

Reutilizar la implementación existente del proyecto con ContentEditable:

### HTML estructura:
```html
<div class="editor-container">
    <div class="editor-toolbar">
        <!-- Grupos de herramientas existentes -->
    </div>
    <div class="editor-content" 
         contenteditable="true" 
         id="contentEditor" 
         data-placeholder="Escribe el contenido de tu página aquí...">
    </div>
</div>
<textarea asp-for="Content" style="display: none;"></textarea>
```

### JavaScript:
- Sincronización con textarea oculto
- Comandos de formato
- Inserción de imágenes y enlaces
- Atajos de teclado

## 8. Funcionalidades Adicionales

### Auto-generación de Handle
```javascript
$('#Title').on('blur', function() {
    const title = $(this).val();
    const handle = $('#Handle');
    
    if (!handle.val() || handle.data('auto-generated')) {
        const slug = title.toLowerCase()
            .replace(/[^a-z0-9]+/g, '-')
            .replace(/^-+|-+$/g, '');
        
        handle.val(slug);
        handle.data('auto-generated', true);
    }
});

$('#Handle').on('input', function() {
    $(this).data('auto-generated', false);
});
```

### Preview de SEO
```javascript
function updateSeoPreview() {
    const title = $('#MetaTitle').val() || $('#Title').val();
    const description = $('#MetaDescription').val() || 'Sin descripción';
    const handle = $('#Handle').val();
    
    $('#seo-preview-title').text(title);
    $('#seo-preview-url').text(`tusitio.com/pages/${handle}`);
    $('#seo-preview-description').text(description);
}
```

## 9. Integración con Website Builder

### API Endpoint para Website Builder:
```csharp
[ApiController]
[Route("api/builder/pages")]
public class BuilderPagesController : ControllerBase
{
    [HttpGet]
    public async Task<IActionResult> GetPublishedPages()
    {
        var pages = await _context.Pages
            .Where(p => p.CompanyId == GetCurrentCompanyId() 
                     && p.Status == PageStatus.Published
                     && p.IsVisible)
            .OrderBy(p => p.DisplayOrder)
            .ThenBy(p => p.Title)
            .Select(p => new {
                p.Id,
                p.Title,
                p.Handle,
                p.MetaTitle,
                p.MetaDescription
            })
            .ToListAsync();
            
        return Ok(pages);
    }
    
    [HttpGet("{handle}")]
    public async Task<IActionResult> GetPageByHandle(string handle)
    {
        var page = await _context.Pages
            .FirstOrDefaultAsync(p => p.CompanyId == GetCurrentCompanyId() 
                                   && p.Handle == handle
                                   && p.Status == PageStatus.Published);
                                   
        if (page == null) return NotFound();
        
        return Ok(page);
    }
}
```

### En Website Builder:
- Selector de páginas en la navegación
- Renderizado del contenido con el tema aplicado
- Respeto de meta tags para SEO

## 10. Migraciones Necesarias

### Primera migración - Crear tabla Pages:
**Nombre de migración**: `CreatePagesTable`

### Campos de la tabla:
- Id (int, PK)
- Title (nvarchar(200), not null)
- Handle (nvarchar(200), not null)
- Content (text)
- Status (int, not null, default: 0)
- PublishDate (datetime2, nullable)
- IsVisible (bit, not null, default: 1)
- MetaTitle (nvarchar(160), nullable)
- MetaDescription (nvarchar(320), nullable)
- DisplayOrder (int, not null, default: 0)
- TemplateName (nvarchar(50), nullable)
- CreatedAt (datetime2, not null)
- UpdatedAt (datetime2, not null)
- CompanyId (int, not null, FK)

### Índices:
- Único compuesto en (CompanyId, Handle)
- Índice en Status para filtrado rápido

## 11. Validaciones

### Backend (Modelo):
```csharp
[Required(ErrorMessage = "El título es requerido")]
[StringLength(200)]
public string Title { get; set; }

[Required(ErrorMessage = "La URL es requerida")]
[StringLength(200)]
[RegularExpression(@"^[a-z0-9-]+$", ErrorMessage = "La URL solo puede contener letras minúsculas, números y guiones")]
public string Handle { get; set; }

[StringLength(160)]
public string? MetaTitle { get; set; }

[StringLength(320)]
public string? MetaDescription { get; set; }
```

### Frontend:
- Validación en tiempo real del handle
- Límites de caracteres visibles
- Mensajes de error traducidos

## 12. Seguridad

- Sanitización del contenido HTML (prevenir XSS)
- Validación de permisos por CompanyId
- CSRF tokens en formularios
- Escape de contenido en vistas

## 13. Performance

- Paginación en Index (10-20 páginas por página)
- Lazy loading del contenido en la lista
- Cache de páginas publicadas para el Website Builder
- Índices apropiados en la base de datos

## 14. Testing Manual

### Casos de prueba principales:
1. Crear página con todos los campos
2. Editar página existente
3. Eliminar página
4. Búsqueda por título
5. Cambio de estados
6. Publicación programada
7. Generación automática de handle
8. Duplicación de handles (debe fallar)
9. Integración con Website Builder

## 15. Adaptaciones Visuales respecto a Shopify

### Diferencias clave con la UI de Shopify:
1. **Botón "Añadir página"**: 
   - Shopify: Fondo negro
   - Nuestro sistema: `background-color: var(--primary)` (respeta el tema del usuario)

2. **Botón "Guardar"**:
   - Shopify: Gris claro
   - Nuestro sistema: `background-color: var(--primary)`

3. **Radio buttons y checkboxes**:
   - Aplicar color primario cuando están seleccionados

4. **Enlaces de títulos en la tabla**:
   - Hover con `color: var(--primary)` en lugar del azul estándar

### Testing del sistema de colores:
1. Cambiar el color en el panel de configuración (engranaje)
2. Verificar que botones principales cambien al nuevo color
3. Confirmar que badges de estado mantengan sus colores (verde/gris/azul)

## 16. Orden de Implementación

1. Modelo y migración
2. Controller básico con CRUD
3. Vistas Index y Delete
4. Vista Create con formulario básico
5. Vista Edit
6. Editor de texto enriquecido
7. Auto-generación de handle
8. SEO y preview
9. Sistema de estados
10. Traducciones
11. API para Website Builder
12. Testing completo

## Notas Importantes

- Mantener consistencia con módulos existentes (Collections, Products)
- Seguir patrones de UI/UX establecidos
- No olvidar las reglas críticas del proyecto
- Probar en modo oscuro y responsivo
- Verificar traducciones en ambos idiomas