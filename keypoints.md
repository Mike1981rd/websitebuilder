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

## 📝 Notas Finales

Este documento debe mantenerse actualizado cuando se agreguen nuevos patrones o se modifiquen los existentes. Es la referencia principal para mantener consistencia en todo el proyecto Hotel Admin.