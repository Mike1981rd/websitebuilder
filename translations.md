# Sistema de Traducciones - Hotel Admin

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