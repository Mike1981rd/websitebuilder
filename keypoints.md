# 🔑 Key Points - Hotel Admin Project

Este documento contiene puntos clave y patrones importantes del proyecto Hotel Admin que deben seguirse para mantener consistencia.

## 📑 Tabla de Contenidos

1. [Sistema de Traducciones](#sistema-de-traducciones)
2. [Sistema de Íconos](#sistema-de-íconos)
3. [Editor de Texto Enriquecido](#editor-de-texto-enriquecido)
4. [Sistema de Colores del Theme](#sistema-de-colores-del-theme)

---

# Sistema de Traducciones

## Resumen Ejecutivo
El sistema tiene DOS métodos diferentes de traducción según el contexto:
1. **Módulos regulares** (fuera de Website Builder): Usan el sistema global del layout
2. **Website Builder**: Usa su propio sistema interno con `applyTranslations()`

## 1. Traducciones en Módulos Regulares (Empresa, Roles, Collections, etc.)

### Ubicación y Estructura
- **Archivo principal**: `/Views/Shared/_MaterializeExactLayout.cshtml`
- **Objeto global**: `translations` (definido en el layout ~línea 600)
- **Función principal**: `translatePage(lang)` (definida en el layout ~línea 936)
- **localStorage key**: `preferredLanguage`

### Implementación Paso a Paso

#### 1. En tu vista Razor (.cshtml):
```javascript
// Define tus traducciones locales
const myModuleTranslations = {
    es: {
        'myModule.title': 'Mi Módulo',
        'myModule.save': 'Guardar',
        'myModule.cancel': 'Cancelar'
    },
    en: {
        'myModule.title': 'My Module',
        'myModule.save': 'Save',
        'myModule.cancel': 'Cancel'
    }
};

// IMPORTANTE: Fusionar con el objeto global ANTES del DOMContentLoaded
if (typeof translations !== 'undefined') {
    if (!translations.es) translations.es = {};
    if (!translations.en) translations.en = {};
    
    Object.assign(translations.es, myModuleTranslations.es);
    Object.assign(translations.en, myModuleTranslations.en);
}

// Aplicar traducciones después de que el DOM esté listo
document.addEventListener('DOMContentLoaded', function() {
    if (typeof translatePage === 'function') {
        const currentLang = localStorage.getItem('preferredLanguage') || 'es';
        translatePage(currentLang);
    }
});
```

#### 2. En tu HTML:
```html
<!-- Textos -->
<h1 data-i18n="myModule.title">Mi Módulo</h1>

<!-- Placeholders -->
<input type="text" data-i18n-placeholder="myModule.search" placeholder="Buscar...">

<!-- Títulos (tooltips) -->
<button data-i18n-title="myModule.helpTooltip" title="Ayuda">?</button>
```

### Ejemplo Completo - Collections Index:
```javascript
const collectionTranslations = {
    es: {
        collections: "Colecciones",
        create_collection: "Crear colección",
        search_collections: "Buscar colecciones...",
        // ... más traducciones
    },
    en: {
        collections: "Collections",
        create_collection: "Create collection",
        search_collections: "Search collections...",
        // ... más traducciones
    }
};

// Fusionar ANTES del DOMContentLoaded
if (typeof translations !== 'undefined') {
    if (!translations.es) translations.es = {};
    if (!translations.en) translations.en = {};
    
    Object.assign(translations.es, collectionTranslations.es);
    Object.assign(translations.en, collectionTranslations.en);
}

// Aplicar después del DOM ready
document.addEventListener('DOMContentLoaded', function() {
    if (typeof translatePage === 'function') {
        const currentLang = localStorage.getItem('preferredLanguage') || 'es';
        translatePage(currentLang);
    }
});
```

### Agregar Item al Menú con Traducción:
1. En `_MaterializeExactLayout.cshtml`, agregar el item del menú (~línea 63):
```html
<li class="menu-item">
    <a href="@Url.Action("Index", "MyModule")" class="menu-link">
        <i class="menu-icon fas fa-icon"></i>
        <span class="menu-text" data-i18n="menu.myModule">Mi Módulo</span>
        <span class="menu-tooltip" data-i18n="menu.myModule">Mi Módulo</span>
    </a>
</li>
```

2. Agregar las traducciones al objeto global del layout (~línea 609):
```javascript
es: {
    // ... otras traducciones
    'menu.myModule': 'Mi Módulo',
},
en: {
    // ... otras traducciones  
    'menu.myModule': 'My Module',
}
```

## 2. Traducciones en Website Builder

### Ubicación y Estructura
- **Archivo principal**: `/wwwroot/js/website-builder.js`
- **Variables globales**: `currentLanguage`, `translations`
- **Función principal**: `applyTranslations()`
- **localStorage key**: `selectedLanguage` (diferente al sistema regular!)

### Implementación en Website Builder:

#### 1. Definir traducciones en el módulo:
```javascript
// En tu función de renderizado
function renderMyBuilderModule() {
    const moduleTranslations = {
        es: {
            'builder.myFeature': 'Mi Característica',
            'builder.settings': 'Configuración'
        },
        en: {
            'builder.myFeature': 'My Feature',
            'builder.settings': 'Settings'
        }
    };
    
    // HTML con data-i18n
    const html = `
        <div>
            <h3 data-i18n="builder.myFeature">Mi Característica</h3>
            <button data-i18n="builder.settings">Configuración</button>
        </div>
    `;
    
    document.getElementById('container').innerHTML = html;
    
    // IMPORTANTE: Aplicar traducciones después de insertar HTML
    setTimeout(applyTranslations, 0);
}
```

#### 2. Para textos dinámicos:
```javascript
// Usar el objeto translations con currentLanguage
const buttonText = translations[currentLanguage]['builder.save'] || 'Save';
```

### Eventos de Cambio de Idioma en Website Builder:
```javascript
// Escuchar cambios de idioma desde el layout principal
document.addEventListener('languageChanged', function(e) {
    currentLanguage = e.detail.language;
    // Re-renderizar tu vista si es necesario
    renderCurrentView();
});
```

## 3. Diferencias Clave Entre Ambos Sistemas

| Aspecto | Módulos Regulares | Website Builder |
|---------|-------------------|-----------------|
| Función principal | `translatePage()` | `applyTranslations()` |
| Objeto de traducciones | Global `translations` del layout | Local `translations` en website-builder.js |
| localStorage key | `preferredLanguage` | `selectedLanguage` |
| Momento de aplicación | Al cargar página + manual | Después de cada render dinámico |
| Ámbito | Toda la página | Solo elementos del builder |

## 4. Errores Comunes y Soluciones

### Error: "applyTranslations function not found"
**Causa**: Estás usando `applyTranslations()` fuera del Website Builder
**Solución**: Usa `translatePage()` en su lugar

### Error: Las traducciones no se aplican
**Posibles causas**:
1. No fusionaste las traducciones con el objeto global
2. Usaste el localStorage key incorrecto
3. Llamaste la función antes de insertar el HTML

### Error: Texto muestra la key en lugar de la traducción
**Causa**: La key no existe en el objeto de traducciones
**Solución**: Verificar que agregaste la traducción en ambos idiomas

## 5. Checklist Rápido para Nuevos Módulos

### Para Módulos Regulares:
- [ ] Definir objeto de traducciones local con es/en
- [ ] Fusionar con `translations` global ANTES del DOMContentLoaded
- [ ] Agregar `data-i18n` a elementos HTML
- [ ] Llamar `translatePage()` en DOMContentLoaded
- [ ] Usar `localStorage.getItem('preferredLanguage')`
- [ ] Si es item de menú, agregar traducciones al layout

### Para Website Builder:
- [ ] Agregar traducciones al objeto local del módulo
- [ ] Usar `data-i18n` en HTML dinámico
- [ ] Llamar `setTimeout(applyTranslations, 0)` después de innerHTML
- [ ] Para textos dinámicos usar `translations[currentLanguage]['key']`
- [ ] Escuchar evento `languageChanged` si necesitas re-render

## 6. Ejemplo de Migración

Si necesitas mover un módulo del Website Builder al sistema regular:

```javascript
// ANTES (Website Builder)
function renderModule() {
    $('#container').html('<h1 data-i18n="title">Título</h1>');
    setTimeout(applyTranslations, 0);
}

// DESPUÉS (Módulo Regular)
// En tu vista .cshtml:
const moduleTranslations = {
    es: { 'module.title': 'Título' },
    en: { 'module.title': 'Title' }
};

if (typeof translations !== 'undefined') {
    Object.assign(translations.es, moduleTranslations.es);
    Object.assign(translations.en, moduleTranslations.en);
}

document.addEventListener('DOMContentLoaded', function() {
    if (typeof translatePage === 'function') {
        const currentLang = localStorage.getItem('preferredLanguage') || 'es';
        translatePage(currentLang);
    }
});
```

## 7. Tips de Performance

1. **Módulos Regulares**: Las traducciones se aplican una vez al cargar
2. **Website Builder**: Minimiza llamadas a `applyTranslations()` agrupando cambios
3. **Ambos**: Usa keys descriptivas y consistentes (module.section.element)

## 8. Debugging

Para verificar qué sistema usar:
```javascript
console.log('¿Estoy en Website Builder?', typeof applyTranslations === 'function');
console.log('¿Tengo acceso al sistema regular?', typeof translatePage === 'function');
console.log('Idioma actual (regular):', localStorage.getItem('preferredLanguage'));
console.log('Idioma actual (builder):', localStorage.getItem('selectedLanguage'));
```

---

**Regla de Oro**: Si tu módulo está en una vista Razor normal (.cshtml) con el layout `_MaterializeExactLayout`, usa el sistema regular. Si estás trabajando dentro del Website Builder (manipulando el DOM dinámicamente), usa el sistema del builder.

---

# Layout y Panel Lateral - Configuración Obligatoria

## Problema Común
Al crear un nuevo módulo, si no se especifica el layout correcto, el panel lateral desaparece y los estilos no se aplican correctamente. La aplicación usa un layout por defecto que no incluye estos elementos.

## Solución Requerida

### 1. En TODAS las vistas del módulo (.cshtml)
Agregar la línea del layout en el bloque `@{}`:

```csharp
@{
    ViewData["Title"] = "Título de la Vista";
    Layout = "_MaterializeExactLayout";  // ← CRÍTICO: Sin esto se pierde el panel lateral
}
```

### 2. En el Layout Principal (_MaterializeExactLayout.cshtml)
Agregar el link al CSS del módulo en la sección `<head>`:

```html
<link rel="stylesheet" href="~/css/tu-modulo.css" asp-append-version="true" />
```

### Ejemplo Completo - Módulo Customers

**Views/Customers/Index.cshtml:**
```csharp
@model IEnumerable<Hotel.Models.Guest>

@{
    ViewData["Title"] = "Clientes";
    Layout = "_MaterializeExactLayout";  // ← Sin esto, no hay panel lateral
}
```

**Views/Shared/_MaterializeExactLayout.cshtml:**
```html
<link rel="stylesheet" href="~/css/roles.css" asp-append-version="true" />
<link rel="stylesheet" href="~/css/customers.css" asp-append-version="true" />  <!-- ← CSS del módulo -->
```

### Checklist para Nuevos Módulos
- [ ] Agregar `Layout = "_MaterializeExactLayout";` en TODAS las vistas
- [ ] Crear archivo CSS en `/wwwroot/css/nombre-modulo.css`
- [ ] Agregar link al CSS en `_MaterializeExactLayout.cshtml`
- [ ] Verificar que el panel lateral se mantiene visible
- [ ] Confirmar que los estilos se aplican correctamente

### Módulos que YA usan este patrón correctamente:
- ✅ Roles
- ✅ Collections
- ✅ Customers (después del fix)
- ✅ Empresa
- ✅ WebsiteBuilder (usa _WebsiteBuilderLayout que es especial)

**IMPORTANTE**: Sin especificar el layout, ASP.NET usa un layout por defecto minimalista que NO incluye el panel lateral ni los estilos del proyecto.

---

# Estructura UI Estándar para Módulos CRUD

## Problema Común
Al crear nuevos módulos CRUD (Create, Read, Update, Delete), es fácil crear interfaces inconsistentes que no siguen el diseño establecido del proyecto. Esto resulta en módulos que se ven diferentes entre sí y no respetan el sistema de colores.

## Estructura HTML Requerida para Index.cshtml

### 1. Page Header
```html
<div class="page-header">
    <nav class="breadcrumb-container" aria-label="breadcrumb">
        <ol class="breadcrumb">
            <li class="breadcrumb-item"><a href="@Url.Action("Index", "Home")" data-i18n="breadcrumb.home">Home</a></li>
            <li class="breadcrumb-item active" aria-current="page" data-i18n="module.title">Módulo</li>
        </ol>
    </nav>
    <div class="page-title-container">
        <h1 class="page-title" data-i18n="module.title">Título del Módulo</h1>
        <button class="btn btn-create" onclick="window.location.href='@Url.Action("Create", "Controller")'">
            <i class="fas fa-plus"></i>
            <span data-i18n="module.create">Crear Nuevo</span>
        </button>
    </div>
</div>
```

### 2. Card Contenedor
```html
<div class="card">
    <div class="card-content">
        <!-- Contenido aquí -->
    </div>
</div>
```

### 3. Controles de Tabla
```html
<div class="table-controls">
    <div class="search-container">
        <input type="text" 
               id="searchInput" 
               class="form-control search-input" 
               data-i18n-placeholder="module.searchPlaceholder"
               placeholder="Buscar...">
    </div>
    <div class="table-actions">
        <button class="btn btn-secondary" id="exportBtn">
            <i class="fas fa-download"></i>
            <span data-i18n="module.export">Exportar</span>
        </button>
    </div>
</div>
```

### 4. Tabla Responsiva
```html
<div class="table-responsive">
    <table class="table table-hover" id="moduleTable">
        <thead>
            <tr>
                <th></th> <!-- Para checkbox si es necesario -->
                <th data-i18n="module.column1">Columna 1</th>
                <th data-i18n="module.column2">Columna 2</th>
                <th data-i18n="module.actions">Acciones</th>
            </tr>
        </thead>
        <tbody>
            <!-- Filas aquí -->
        </tbody>
    </table>
</div>
```

### 5. Estado Vacío
```html
@if (!Model.Any())
{
    <div class="empty-state">
        <i class="fas fa-icon empty-state-icon"></i>
        <h3 data-i18n="module.noRecords">No hay registros</h3>
        <p data-i18n="module.noRecordsDesc">Comienza creando tu primer registro</p>
        <button class="btn btn-primary" onclick="window.location.href='@Url.Action("Create")'">
            <i class="fas fa-plus"></i>
            <span data-i18n="module.createFirst">Crear primero</span>
        </button>
    </div>
}
```

## Clases CSS Obligatorias

### Botones (SIEMPRE usar var(--primary))
```css
/* Botón principal de crear */
.btn-create {
    background-color: var(--primary);  /* OBLIGATORIO */
    color: #ffffff;
    border: none;
    padding: 10px 20px;
    border-radius: 6px;
    font-size: 14px;
    font-weight: 500;
    display: inline-flex;
    align-items: center;
    gap: 8px;
    cursor: pointer;
    transition: all 0.3s ease;
}

.btn-create:hover {
    background-color: var(--primary);  /* OBLIGATORIO */
    opacity: 0.9;
}

/* Otros botones estándar */
.btn-primary { /* Acciones principales */ }
.btn-secondary { /* Acciones secundarias */ }
.btn-danger { /* Acciones destructivas */ }
.btn-icon { /* Botones solo ícono */ }
```

### Estructura Base
```css
/* Card contenedor */
.card {
    background-color: #ffffff;
    border-radius: 8px;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    margin-bottom: 20px;
    overflow: hidden;
}

.card-content {
    padding: 25px;
}

/* Tabla */
.table {
    width: 100%;
    border-collapse: collapse;
}

.table thead th {
    background-color: #f8f9fa;
    font-weight: 600;
    color: #666;
    padding: 12px 16px;
    text-align: left;
    font-size: 13px;
    text-transform: uppercase;
    letter-spacing: 0.5px;
    border-bottom: 2px solid #e9ecef;
}

.table tbody td {
    padding: 16px;
    border-bottom: 1px solid #f0f0f0;
    vertical-align: middle;
}
```

### Dark Mode
```css
body.dark-mode .card {
    background-color: #3a3c55;  /* NO #282A42 para cards */
    color: #e0e0e0;
}
```

## Posicionamiento del Botón "Agregar" en Index

### 🔴 Problema Común
El botón "Agregar" puede aparecer centrado o mal posicionado si se intenta colocar en el header de la página. Esto ocurre cuando no hay un título visible o estructura adecuada.

### ✅ Solución Correcta
Colocar el botón dentro del card junto con los controles de búsqueda y exportar:

```html
<!-- CORRECTO: Botón dentro del card -->
<div class="card">
    <div class="card-content">
        <div class="table-controls">
            <div class="search-container">
                <input type="text" class="form-control search-input" placeholder="Buscar...">
            </div>
            <div class="table-actions">
                <button class="btn btn-create" onclick="window.location.href='@Url.Action("Create")'">
                    <i class="fas fa-plus"></i>
                    <span>Agregar</span>
                </button>
                <button class="btn btn-secondary">
                    <i class="fas fa-download"></i>
                    <span>Exportar</span>
                </button>
            </div>
        </div>
        <!-- Resto del contenido -->
    </div>
</div>
```

### ❌ Evitar
```html
<!-- INCORRECTO: Botón en page-header sin título -->
<div class="page-header">
    <nav class="breadcrumb-container">...</nav>
    <div class="page-title-container">
        <button class="btn btn-create">Agregar</button> <!-- Aparece centrado -->
    </div>
</div>
```

### CSS Necesario
```css
.table-controls {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 20px;
    gap: 20px;
}

.search-container {
    flex: 1;
    max-width: 400px;
}

.table-actions {
    display: flex;
    gap: 0.5rem;
}
```

## Checklist UI para Nuevos Módulos

### Estructura
- [ ] Vista usa `Layout = "_MaterializeExactLayout"`
- [ ] CSS del módulo agregado en el layout
- [ ] Page header con breadcrumb
- [ ] Botón crear con clase `btn-create` **dentro del card**
- [ ] Contenido en `.card` > `.card-content`
- [ ] Tabla con clases correctas
- [ ] Estado vacío implementado

### Estilos
- [ ] Botón crear usa `var(--primary)` NO color hardcodeado
- [ ] Enlaces usan `var(--primary)`
- [ ] Checkboxes usan `accent-color: var(--primary)`
- [ ] Focus states usan `var(--primary)`
- [ ] Dark mode funciona correctamente

### Funcionalidad
- [ ] Búsqueda en tabla funciona
- [ ] Traducciones implementadas
- [ ] Modales de confirmación
- [ ] Mensajes de éxito/error

## Ejemplo de Referencia

Para ver una implementación correcta completa, revisar:
- `/Views/Customers/Index.cshtml` - Estructura HTML (después del fix)
- `/wwwroot/css/customers.css` - Estilos siguiendo el sistema

## Errores Comunes a Evitar

1. **NO hardcodear colores**: Siempre usar `var(--primary)`
2. **NO crear nuevas clases de botones**: Usar las existentes
3. **NO omitir el card contenedor**: Mantiene consistencia visual
4. **NO usar estilos inline**: Todo en el archivo CSS del módulo
5. **NO olvidar dark mode**: Probar siempre ambos modos
6. **NO poner botón "Agregar" en page-header sin título**: Colocarlo dentro del card con los controles de tabla

---

# Estándares de Tablas y Listas de Datos

## Problema Común
Al crear tablas de datos en diferentes módulos, se crean estilos inconsistentes en iconos de acción, tamaños de fuente, avatares y espaciados. Esto causa que cada módulo se vea diferente.

## Estándares OBLIGATORIOS - Basados en Tabla de Usuarios (Roles)

### 1. Estructura de Tabla HTML
```html
<div class="table-responsive">
    <table class="table table-hover" id="moduleTable">
        <thead>
            <tr>
                <th></th> <!-- Para checkbox -->
                <th data-i18n="table.column1">COLUMNA 1</th>
                <th data-i18n="table.actions">ACCIONES</th>
            </tr>
        </thead>
        <tbody>
            <!-- Filas aquí -->
        </tbody>
    </table>
</div>
```

### 2. Estilos CSS de Tabla
```css
.table thead th {
    text-align: left;
    padding: 1rem;
    font-weight: 600;
    color: #666;
    font-size: 0.75rem;  /* 12px */
    text-transform: uppercase;
    letter-spacing: 0.5px;
    border-bottom: 1px solid #e0e0e0;
}

.table tbody td {
    padding: 1rem;
    border-bottom: 1px solid #f5f5f9;
}
```

### 3. Información de Usuario/Entidad
```html
<td>
    <div class="user-info">  <!-- o entity-info -->
        <img src="avatar.jpg" alt="Name" class="user-avatar-small" />
        <div class="user-details">
            <div class="user-name">Nombre Completo</div>
            <div class="user-email">email@ejemplo.com</div>
        </div>
    </div>
</td>
```

#### Estilos de Avatar
```css
.user-avatar-small {
    width: 48px;
    height: 48px;
    border-radius: 50%;
    object-fit: cover;
    border: 2px solid #e0e0e0;
}
```

#### Tamaños de Fuente Estándar
```css
.user-name {
    font-weight: 600;
    color: #444564;
    font-size: 0.875rem;  /* 14px */
}

.user-email {
    color: #a5a3ae;
    font-size: 0.75rem;   /* 12px */
}

/* Si necesitas mostrar username o ID */
.user-username {
    color: #697a8d;
    font-size: 0.8125rem; /* 13px */
}
```

### 4. Botones de Acción ESTÁNDAR
```html
<td>
    <div class="action-buttons">
        <button class="btn-action" onclick="editEntity(id)" title="Editar">
            <i class="fas fa-edit"></i>
        </button>
        <button class="btn-action" onclick="toggleStatus(id)" title="Inactivar">
            <i class="fas fa-ban"></i>  <!-- NO usar fa-trash -->
        </button>
    </div>
</td>
```

#### Estilos OBLIGATORIOS para Botones
```css
.action-buttons {
    display: flex;
    gap: 0.25rem;
}

.btn-action {
    background: none;
    border: none;
    padding: 0.5rem;
    cursor: pointer;
    color: #a5a3ae;
    transition: all 0.3s ease;
    border-radius: 0.25rem;
}

.btn-action:hover {
    background: #f5f5f9;
    color: #666;
}
```

### 5. Iconos Correctos
- **Editar**: `fas fa-edit` (lápiz simple)
- **Inactivar/Eliminar**: `fas fa-ban` (círculo prohibido)
- **Activar**: `fas fa-check-circle`
- **Ver detalles**: `fas fa-eye`
- **Configuración**: `fas fa-cog`

**NUNCA USAR**: `fa-trash` (bote de basura) para acciones de eliminar/inactivar

### 6. Badges de Estado
```html
<span class="status-badge active">Activo</span>
```

```css
.status-badge {
    padding: 0.25rem 0.75rem;
    border-radius: 0.25rem;
    font-size: 0.75rem;
    font-weight: 500;
}

.status-badge.active {
    background: #e8f5e9;
    color: #388e3c;
}

.status-badge.inactive {
    background: #f5f5f5;
    color: #666;
}
```

### 7. Checkboxes
```css
.user-checkbox {
    width: 18px;
    height: 18px;
    cursor: pointer;
}
```

## Checklist para Nuevas Tablas
- [ ] Usar padding `1rem` en celdas
- [ ] Fuente de headers: `0.75rem` uppercase
- [ ] Avatar: 48px con borde 2px solid #e0e0e0
- [ ] Nombre: `0.875rem`, Email: `0.75rem`
- [ ] Botones sin borde, color `#a5a3ae`
- [ ] Usar `fa-ban` NO `fa-trash`
- [ ] Hover de botones: background `#f5f5f9`
- [ ] Status badges con padding `0.25rem 0.75rem`

## Módulos de Referencia
- **✅ CORRECTO**: Vista de usuarios en `/Roles/Index`
- **❌ EVITAR**: Estilos personalizados diferentes en cada módulo

## ⚠️ ADVERTENCIA CRÍTICA - Enlaces y Selectores CSS

### Problema Común
Al estilizar enlaces en módulos, usar selectores demasiado generales puede afectar elementos fuera del módulo, como el panel lateral.

### ❌ NUNCA HACER ESTO:
```css
/* MALO - Afecta TODOS los enlaces de la página */
a {
    color: var(--primary);
}

/* MALO - Afecta enlaces en todo el sitio */
a:not(.btn-action) {
    color: var(--primary);
}
```

### ✅ SIEMPRE HACER ESTO:
```css
/* CORRECTO - Solo afecta enlaces dentro del módulo */
.card a:not(.btn-action) {
    color: var(--primary);
}

/* CORRECTO - Usar contenedor específico del módulo */
.customers-container a {
    color: var(--primary);
}

/* CORRECTO - Ser específico con el contexto */
.table a, .customer-details a {
    color: var(--primary);
}
```

### Regla de Oro
**SIEMPRE** limitar el alcance de tus selectores CSS al contenedor del módulo para evitar efectos secundarios en otros elementos del sistema, especialmente:
- Panel lateral (debe mantener enlaces blancos)
- Navegación principal
- Breadcrumbs
- Otros módulos

---

# Sistema de Íconos

## Resumen
El proyecto utiliza **Font Awesome 6.4.0** para todos los íconos. NO uses Material Icons ya que no están cargados en el proyecto.

## Ubicación de la Carga
```html
<!-- En _MaterializeExactLayout.cshtml línea 8 -->
<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css" />
```

## Uso Correcto de Íconos

### ✅ CORRECTO - Font Awesome
```html
<!-- Iconos sólidos (fas) -->
<i class="fas fa-save"></i>
<i class="fas fa-user"></i>
<i class="fas fa-bold"></i>

<!-- Iconos regulares (far) -->
<i class="far fa-file"></i>
<i class="far fa-calendar"></i>

<!-- Iconos de marcas (fab) -->
<i class="fab fa-github"></i>
```

### ❌ INCORRECTO - Material Icons
```html
<!-- NO USES ESTO - No funcionará -->
<i class="material-icons">save</i>
<i class="material-icons">person</i>
```

## Tamaños Recomendados

### Para botones en toolbars
```css
.editor-btn i {
    font-size: 14px;  /* Tamaño estándar para toolbars */
}
```

### Para íconos destacados
```css
.upload-icon {
    font-size: 48px;  /* Iconos grandes de upload */
}

.menu-icon {
    font-size: 20px;  /* Iconos del menú lateral */
}
```

## Íconos Comunes y sus Equivalencias

| Función | Font Awesome | ~~Material Icons~~ |
|---------|--------------|-------------------|
| Guardar | `fas fa-save` | ~~save~~ |
| Editar | `fas fa-edit` | ~~edit~~ |
| Eliminar | `fas fa-trash` | ~~delete~~ |
| Agregar | `fas fa-plus` | ~~add~~ |
| Buscar | `fas fa-search` | ~~search~~ |
| Configuración | `fas fa-cog` | ~~settings~~ |
| Usuario | `fas fa-user` | ~~person~~ |
| Cerrar | `fas fa-times` | ~~close~~ |
| Menú | `fas fa-bars` | ~~menu~~ |
| Home | `fas fa-home` | ~~home~~ |

## Ejemplo Completo - Toolbar de Editor
```html
<div class="editor-toolbar">
    <button class="editor-btn" data-command="bold">
        <i class="fas fa-bold"></i>
    </button>
    <button class="editor-btn" data-command="italic">
        <i class="fas fa-italic"></i>
    </button>
    <button class="editor-btn" data-command="underline">
        <i class="fas fa-underline"></i>
    </button>
</div>
```

## Colores de Íconos

### Heredar color del contenedor
```css
.btn i {
    color: inherit;  /* Hereda el color del botón */
}
```

### Color específico
```css
.danger-icon {
    color: #dc3545;  /* Rojo para acciones peligrosas */
}

.success-icon {
    color: #28a745;  /* Verde para éxito */
}
```

---

# Editor de Texto Enriquecido

## Implementación Nativa con ContentEditable

El proyecto usa un editor de texto enriquecido nativo basado en `contenteditable` en lugar de librerías externas. Esto evita problemas de licencias y mantiene el control total sobre la funcionalidad.

## Estructura HTML del Editor

```html
<div class="editor-container">
    <!-- Toolbar con grupos de herramientas -->
    <div class="editor-toolbar">
        <!-- Selector de formato -->
        <div class="toolbar-group">
            <select class="format-select" id="formatBlock">
                <option value="p">Párrafo</option>
                <option value="h1">Título 1</option>
                <option value="h2">Título 2</option>
                <option value="h3">Título 3</option>
                <option value="h4">Título 4</option>
            </select>
        </div>
        
        <div class="toolbar-separator"></div>
        
        <!-- Formato de texto -->
        <div class="toolbar-group">
            <button type="button" class="editor-btn" data-command="bold" title="Negrita (Ctrl+B)">
                <i class="fas fa-bold"></i>
            </button>
            <button type="button" class="editor-btn" data-command="italic" title="Cursiva (Ctrl+I)">
                <i class="fas fa-italic"></i>
            </button>
            <button type="button" class="editor-btn" data-command="underline" title="Subrayado (Ctrl+U)">
                <i class="fas fa-underline"></i>
            </button>
            <button type="button" class="editor-btn" data-command="strikethrough" title="Tachado">
                <i class="fas fa-strikethrough"></i>
            </button>
        </div>
        
        <!-- Más grupos... -->
    </div>
    
    <!-- Área de contenido editable -->
    <div class="editor-content" 
         contenteditable="true" 
         id="descriptionEditor" 
         data-placeholder="Escribe aquí..."></div>
</div>

<!-- Campo oculto para el formulario -->
<textarea name="Description" style="display: none;"></textarea>
```

## CSS Moderno para el Editor

### Contenedor Principal
```css
.editor-container {
    border: 1px solid #e5e7eb;
    border-radius: 8px;
    overflow: hidden;
    background-color: #fff;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
    transition: all 0.2s;
}

.editor-container:focus-within {
    border-color: var(--primary);
    box-shadow: 0 0 0 3px rgba(233, 30, 99, 0.1);
}
```

### Toolbar Estilo Notion/Medium
```css
.editor-toolbar {
    background-color: #f8f9fa;
    border-bottom: 1px solid #e5e7eb;
    padding: 0;
    display: flex;
    align-items: center;
    min-height: 48px;
    flex-wrap: wrap;
}

.toolbar-group {
    display: flex;
    align-items: center;
    padding: 8px 4px;
    gap: 2px;
}

.toolbar-separator {
    width: 1px;
    height: 24px;
    background-color: #dee2e6;
    margin: 0 4px;
}
```

### Botones del Editor
```css
.editor-btn {
    padding: 0;
    width: 34px;
    height: 34px;
    background: none;
    border: 1px solid transparent;
    border-radius: 6px;
    cursor: pointer;
    color: #495057;
    transition: all 0.2s;
    display: inline-flex;
    align-items: center;
    justify-content: center;
}

.editor-btn:hover {
    background-color: #e9ecef;
    color: #212529;
}

.editor-btn.active {
    background-color: var(--primary);
    color: #fff;
}
```

### Área de Contenido
```css
.editor-content {
    min-height: 300px;
    padding: 20px;
    font-size: 16px;
    line-height: 1.8;
    color: #212529;
}

.editor-content:focus {
    outline: none;
}

/* Placeholder cuando está vacío */
.editor-content:empty:before {
    content: attr(data-placeholder);
    color: #adb5bd;
    pointer-events: none;
    position: absolute;
}
```

## JavaScript del Editor

### Inicialización y Comandos
```javascript
const descriptionEditor = document.getElementById('descriptionEditor');
const descriptionTextarea = document.querySelector('textarea[name="Description"]');

// Botones de la toolbar
document.querySelectorAll('.editor-btn[data-command]').forEach(btn => {
    btn.addEventListener('click', function(e) {
        e.preventDefault();
        const command = this.dataset.command;
        
        if (command === 'createLink') {
            const url = prompt('Ingrese la URL del enlace:');
            if (url) {
                document.execCommand(command, false, url);
            }
        } else if (command === 'insertImage') {
            const url = prompt('Ingrese la URL de la imagen:');
            if (url) {
                document.execCommand('insertHTML', false, `<img src="${url}" style="max-width: 100%;">`);
            }
        } else {
            document.execCommand(command, false, null);
        }
        
        descriptionEditor.focus();
        updateDescription();
        updateActiveStates();
    });
});
```

### Estados Activos de Botones
```javascript
function updateActiveStates() {
    document.querySelectorAll('.editor-btn[data-command]').forEach(btn => {
        const command = btn.dataset.command;
        const isActive = document.queryCommandState(command);
        if (isActive) {
            btn.classList.add('active');
        } else {
            btn.classList.remove('active');
        }
    });
}

// Actualizar en cambios de selección
document.addEventListener('selectionchange', function() {
    if (document.activeElement === descriptionEditor) {
        updateActiveStates();
    }
});
```

### Atajos de Teclado
```javascript
descriptionEditor.addEventListener('keydown', function(e) {
    if (e.ctrlKey || e.metaKey) {
        switch(e.key.toLowerCase()) {
            case 'b':
                e.preventDefault();
                document.execCommand('bold', false, null);
                updateActiveStates();
                break;
            case 'i':
                e.preventDefault();
                document.execCommand('italic', false, null);
                updateActiveStates();
                break;
            case 'u':
                e.preventDefault();
                document.execCommand('underline', false, null);
                updateActiveStates();
                break;
            case 'k':
                e.preventDefault();
                const url = prompt('Ingrese la URL del enlace:');
                if (url) {
                    document.execCommand('createLink', false, url);
                }
                break;
        }
    }
});
```

### Sincronización con Textarea
```javascript
function updateDescription() {
    descriptionTextarea.value = descriptionEditor.innerHTML;
}

// Actualizar en cada cambio
descriptionEditor.addEventListener('input', updateDescription);
descriptionEditor.addEventListener('blur', updateDescription);
```

## Grupos de Herramientas Recomendados

1. **Formato de Párrafo**: Dropdown con p, h1-h4
2. **Formato de Texto**: Bold, Italic, Underline, Strikethrough
3. **Listas**: Bulleted, Numbered, Indent, Outdent
4. **Alineación**: Left, Center, Right, Justify
5. **Enlaces**: Insert Link, Remove Link, Insert Image
6. **Utilidades**: Clear Formatting

## Ventajas de Esta Implementación

1. **Sin dependencias externas**: No hay problemas de licencias
2. **Control total**: Puedes personalizar cada aspecto
3. **Ligero**: Solo CSS y JavaScript vanilla
4. **Compatible**: Funciona en todos los navegadores modernos
5. **Mantenible**: Código simple y directo

---

# Sistema de Colores del Theme

## Variable CSS Principal

El proyecto usa una variable CSS `--primary` que permite personalización del color principal en toda la interfaz.

### Definición Base
```css
/* En materialize-exact.css */
:root {
    --primary: #e91e63;  /* Rosa/Pink por defecto */
}
```

### Personalización del Usuario
- Los usuarios pueden cambiar el color usando el panel flotante de configuración
- El color elegido se guarda en `localStorage` con la key `primaryColor`
- Se aplica dinámicamente al cargar la página

## Implementación en Nuevos Módulos

### ✅ Elementos que DEBEN usar el color primario:

#### 1. Botones Principales
```css
.btn-primary, .btn-create, .btn-save {
    background-color: var(--primary);
    color: #ffffff;
}

.btn-primary:hover {
    background-color: var(--primary);
    opacity: 0.9;
}
```

#### 2. Checkboxes y Radio Buttons
```css
input[type="checkbox"]:checked {
    background-color: var(--primary);
    border-color: var(--primary);
}

input[type="radio"]:checked {
    background-color: var(--primary);
    border-color: var(--primary);
}
```

#### 3. Enlaces Importantes
```css
.important-link {
    color: var(--primary);
}

.important-link:hover {
    color: var(--primary);
    opacity: 0.8;
}
```

#### 4. Elementos de Selección Activos
```css
.nav-item.active {
    border-bottom: 2px solid var(--primary);
}

.menu-item.selected {
    background-color: var(--primary);
    color: white;
}
```

#### 5. Focus States
```css
.form-control:focus {
    border-color: var(--primary);
    box-shadow: 0 0 0 3px rgba(233, 30, 99, 0.1);
}
```

### ❌ Elementos que NO deben usar el color primario:

- Textos de contenido general
- Fondos de cards o contenedores
- Bordes estándar
- Elementos de navegación secundarios
- Íconos informativos
- Separadores

## Ejemplo Completo - Botón de Crear

### Antes (Incorrecto)
```css
.btn-create {
    background-color: #000000;  /* ❌ Color hardcodeado */
    color: #ffffff;
}
```

### Después (Correcto)
```css
.btn-create {
    background-color: var(--primary);  /* ✅ Usa variable CSS */
    color: #ffffff;
}

.btn-create:hover {
    background-color: var(--primary);
    opacity: 0.9;
}
```

## Cómo Funciona el Sistema

### 1. Panel de Personalización
- Botón flotante con ícono de engranaje
- Permite seleccionar colores predefinidos o personalizado
- Guarda automáticamente en localStorage

### 2. Carga del Color al Iniciar
```javascript
// En _MaterializeExactLayout.cshtml
const savedColor = localStorage.getItem('primaryColor');
if (savedColor) {
    document.documentElement.style.setProperty('--primary', savedColor);
}
```

### 3. Actualización Dinámica
Cuando el usuario cambia el color, se actualiza inmediatamente en toda la interfaz sin recargar la página.

## Colores Predefinidos Disponibles

- Rosa (default): #e91e63
- Azul: #2196F3
- Verde: #4CAF50
- Naranja: #FF9800
- Morado: #9C27B0
- Personalizado: Selector de color

## Testing del Color Theme

Para verificar que tu módulo respeta el sistema de themes:

1. Abre la aplicación
2. Haz clic en el botón de configuración (engranaje)
3. Cambia el color principal
4. Verifica que todos los elementos interactivos de tu módulo cambien al nuevo color
5. Los elementos que no deben cambiar permanecen igual

## Referencia Visual

Módulos que implementan correctamente el sistema:
- **Roles**: Todos los botones y elementos activos
- **Collections**: Botones de crear, checkboxes, enlaces

---

# Agregar Nueva Sección Fija al Website Builder (Cart como ejemplo)

## Resumen
Cuando necesitas agregar una nueva sección fija (como Header, Footer, Cart) al panel lateral del Website Builder, debes modificar varios lugares específicos en website-builder.js (archivo de 24,000+ líneas) y crear un módulo independiente.

## Ejemplo Completo: Implementación de Cart

### 1. Crear Módulo Independiente

**Archivo**: `/wwwroot/js/website-builder-modules/cart.js`
- Estructura modular siguiendo el patrón IIFE
- Auto-registro del módulo
- Funciones principales: `renderSettings()`, `renderPreview()`, `attachEventHandlers()`

### 2. Agregar Traducciones

**Ubicación**: website-builder.js
- **Español**: Línea 4636 (dentro del objeto translations.es)
- **Inglés**: Línea 5484 (dentro del objeto translations.en)

```javascript
// En español (línea 4636)
'sections.cart': 'Carrito',

// En inglés (línea 5484)
'sections.cart': 'Cart',
```

### 3. Agregar HTML de la Sección al Panel Lateral

**Ubicación**: website-builder.js - función `renderBlockListView()` 
- **Línea**: 10085-10099
- **Posición**: Entre Header y Template sections

```javascript
<!-- Cart Section -->
<div class="sidebar-section expanded">
    <div class="sidebar-section-header">
        <div class="section-title-wrapper">
            <span class="section-title" data-i18n="sections.cart">Carrito</span>
        </div>
        <i class="material-icons section-expand-icon">chevron_right</i>
    </div>
    <div class="sidebar-section-content" id="cart-sections-container">
        <div class="sidebar-subsection" data-block-type="cart" data-section-id="cart">
            <i class="material-icons" style="font-size: 16px;">shopping_cart</i>
            <span class="subsection-text" data-i18n="sections.cart">Carrito</span>
        </div>
    </div>
</div>
```

### 4. Agregar Click Handler

**Ubicación**: website-builder.js - función `attachBlockListEventListeners()`
- **Línea**: 13761-13764

```javascript
// Handle cart click
else if (blockType === 'cart') {
    console.log('[DEBUG] Cart section clicked, opening settings');
    switchSidebarView('cartSettings');
}
```

### 5. Agregar Vista en switchSidebarView

**Ubicación**: website-builder.js - función `switchSidebarView()`
- **Línea**: 6830-6835

```javascript
} else if (viewName === 'cartSettings') {
    // Cart settings view
    console.log('[DEBUG] Rendering cart settings');
    dynamicContentArea.innerHTML = renderCartSettings();
    attachCartEventListeners();
    setTimeout(applyTranslations, 0);
}
```

### 6. Crear Función de Renderizado

**Ubicación**: website-builder.js
- **Línea**: 9325 (función `renderCartSettings()`)

```javascript
function renderCartSettings() {
    // Usar el módulo si está disponible
    if (window.WebsiteBuilderModules && window.WebsiteBuilderModules.Cart) {
        const cartModule = window.WebsiteBuilderModules.Cart;
        const settings = cartModule.getCurrentSettings();
        return cartModule.renderSettings(settings);
    }
    
    // Fallback si el módulo no está cargado
    return '<div>Error: Cart module not loaded</div>';
}
```

### 7. Crear Event Listeners

**Ubicación**: website-builder.js
- Función `attachCartEventListeners()` que delega al módulo

```javascript
function attachCartEventListeners() {
    if (window.WebsiteBuilderModules && window.WebsiteBuilderModules.Cart) {
        window.WebsiteBuilderModules.Cart.attachEventHandlers();
    }
}
```

### 8. Cargar el Módulo

**Ubicación**: Views/WebsiteBuilder/Index.cshtml
- Agregar script tag para cargar el módulo

```html
<script src="~/js/website-builder-modules/cart.js"></script>
```

## Estructura del Módulo Cart

### Configuración Principal
- `name`: Identificador único ('cart')
- `isFixed`: true (no se puede eliminar como header/footer)
- `defaultSettings`: Objeto con todas las configuraciones por defecto

### Funciones Principales
1. **renderSettings()**: Genera HTML para el panel de configuración
2. **renderPreview()**: Genera HTML para el preview (actualmente simplificado)
3. **attachEventHandlers()**: Adjunta todos los event listeners
4. **getCurrentSettings()**: Obtiene configuración actual o defaults
5. **saveSettings()**: Guarda configuración (usa el sistema global)

### Características Implementadas
- Color scheme selector
- Image ratio options
- Show/hide toggles para order notes y taxes
- Configuración expandible del tema
- Progress bar con objetivo de envío gratis
- CSS personalizado
- Todos los campos se guardan correctamente en `currentSectionsConfig.cart`

## Notas Importantes

- **Secciones Fijas vs Dinámicas**: Cart, Header y Footer son secciones fijas (no se pueden agregar/eliminar/reordenar)
- **Iconos**: Para secciones fijas NO agregues iconos de acción (visibility toggle, add, delete)
- **Traducciones**: Siempre agrega en ambos idiomas usando el sistema de Website Builder (`applyTranslations()`)
- **Consistencia**: Usa el mismo nombre en todos lados (cart, cartSettings, etc.)
- **Archivo Grande**: website-builder.js tiene 24,000+ líneas, siempre documenta números de línea exactos
- **Modularización**: Nuevas secciones deben seguir el patrón modular como cart.js

## Patrón de Implementación Recomendado

1. **Primero**: Crear el módulo independiente en `/wwwroot/js/website-builder-modules/`
2. **Segundo**: Agregar traducciones en ambos idiomas
3. **Tercero**: Agregar HTML de la sección al panel lateral
4. **Cuarto**: Implementar click handler
5. **Quinto**: Agregar caso en switchSidebarView
6. **Sexto**: Crear funciones de renderizado y event listeners que deleguen al módulo
7. **Último**: Cargar el módulo en Index.cshtml

---

## 📝 Notas Finales

Este documento debe mantenerse actualizado cuando se agreguen nuevos patrones o se modifiquen los existentes. Es la referencia principal para mantener consistencia en todo el proyecto Hotel Admin.