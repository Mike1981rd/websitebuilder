# Bug de Drag & Drop - Website Builder

## Descripción del Problema
Después de mover una sección en el panel lateral usando drag & drop y guardar, la sección regresa a su posición anterior cuando se recarga la página o se vuelve a cargar desde el servidor. El orden no persiste correctamente.

## Estado Actual
- **Visual**: El drag & drop funciona correctamente en la UI
- **Datos**: Se actualiza `currentSectionsConfig.sectionOrder` correctamente
- **Guardado**: Se envía al servidor el orden correcto
- **Problema**: Al recargar desde el servidor, vuelve al orden anterior

## Detalles Técnicos Clave

### Archivos Principales
- **JavaScript principal**: `/wwwroot/js/website-builder.js` (28,000+ líneas)
- **Controller**: `/Controllers/WebsiteBuilderController.cs`
- **API Controller**: `/Controllers/API/WebSitesController.cs`

### Variables de Orden
```javascript
// Variables globales que manejan el orden
currentSectionsConfig.sectionOrder = ['announcement', 'header', 'slideshow', ...];
currentSectionsConfig.announcementOrder = ['announcement-1', 'announcement-2', ...];
pagesConfig[pageId].sectionOrder = [...];
```

### Flujo del Drag & Drop

1. **Inicialización del Sortable** (líneas ~18810-18865):
```javascript
$container.sortable({
    items: '> .sidebar-subsection',
    handle: '.drag-handle',
    connectWith: '#header-sections-container, #template-sections-container, #footer-sections-container',
    stop: function(e, ui) {
        // Actualiza el orden
        const newOrder = [];
        $('.sidebar-section-content').find('> .sidebar-subsection').each(function() {
            const sectionId = $(this).data('section-id') || $(this).data('block-type') || $(this).data('element-id');
            if (sectionId && !newOrder.includes(sectionId)) {
                newOrder.push(sectionId);
            }
        });
        
        currentSectionsConfig.sectionOrder = newOrder;
        
        // CRITICAL: También actualiza pagesConfig
        if (pagesConfig && pagesConfig[currentPageId]) {
            pagesConfig[currentPageId].sectionOrder = newOrder;
        }
        
        hasPendingPageStructureChanges = true;
        updateSaveButtonState();
        renderPreview();
    }
});
```

2. **Guardado al Servidor** (líneas ~27584):
```javascript
// Se envía la estructura completa de la página
const pagePayload = {
    pageStructureJson: JSON.stringify({
        blocks: currentPageBlocks,
        sectionsConfig: currentSectionsConfig,
        sectionOrder: currentSectionsConfig.sectionOrder
    }),
    pageId: currentPageId
};

fetch(`/api/builder/websites/${currentWebsiteId}/pages/${currentPageId}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(pagePayload)
});
```

3. **Recarga desde Servidor** (línea ~27734):
```javascript
// PROBLEMA: Después de guardar en home page, se recarga todo desde el servidor
if (currentPageId === 'home') {
    setTimeout(() => {
        loadCurrentWebsite().then(() => {
            // Esto sobrescribe el orden que acabamos de guardar
            renderPreview();
            window.switchSidebarView('blockList', window.getUpdatedPageData());
        });
    }, 100);
}
```

## Sistema de Reglas de Padres/Hijos

El sistema tiene validaciones robustas para prevenir configuraciones inválidas:

1. **Prevención de anidamiento incorrecto**:
   - Padres no pueden ser hijos de otros padres
   - Hijos no pueden contener otros padres
   - Validación en tiempo real durante el drag

2. **Contenedores con hijos**:
   - `announcement` → `announcement-items-wrapper`
   - `slideshow` → `slideshow-slides-wrapper`
   - `multicolumn` → `multicolumn-columns-wrapper`
   - `imageWithText` → `imageWithText-blocks-wrapper`
   - `testimonials` → `testimonials-items-wrapper`
   - `accordion` → `accordion-items-wrapper`
   - `gallery` → `gallery-items-wrapper`

3. **Manejo durante drag** (líneas ~18200-18235):
```javascript
// Se almacenan referencias a los wrappers de hijos antes del drag
headerChildWrapperRefs.set('barra-anuncios', $announcementWrapper);

// Durante el drag se ocultan y separan los hijos
start: function(e, ui) {
    const $childWrapper = headerChildWrapperRefs.get(elementId);
    if ($childWrapper) {
        $childWrapper.hide();
        ui.item.data('detached-wrapper', $childWrapper.detach());
    }
}

// Después del drag se re-adjuntan los hijos
stop: function(e, ui) {
    const $detachedWrapper = ui.item.data('detached-wrapper');
    if ($detachedWrapper) {
        $detachedWrapper.insertAfter(ui.item).show();
    }
}
```

## Posibles Causas del Bug

1. **Timing Issue**: El guardado al servidor podría no completarse antes de la recarga
2. **Caché del Servidor**: El servidor podría estar devolviendo datos en caché
3. **Deserialización**: El orden podría perderse durante la deserialización en el backend
4. **loadCurrentWebsite()**: Esta función podría estar cargando datos antiguos o incorrectos

## Contexto del Proyecto

### Estado General
- 90% completado con deadline en 4 días
- Website Builder con JSON gigante (problema conocido con Entity Framework)
- Se usa SQL directo para guardar debido a limitaciones de EF con JSONB grandes

### Restricciones Críticas
- **NO refactorizar** el sistema actual
- **NO modificar** el método `UpdateGlobalThemeSettings` (líneas 212-228 de WebSitesController.cs)
- **Solo fixes mínimos** para resolver el problema específico

### Archivos Relacionados
- `/colorscheme.md` - Documentación del bug del JSON gigante
- `/bugs.md` - Lista de bugs ya resueltos
- `/CLAUDE.md` - Reglas críticas del proyecto

## Investigación Necesaria

1. **Verificar el timing del guardado**:
   - ¿Se completa el PUT antes de loadCurrentWebsite()?
   - ¿Hay algún await faltante?

2. **Revisar loadCurrentWebsite()**:
   - ¿De dónde obtiene los datos?
   - ¿Respeta el sectionOrder guardado?

3. **Backend WebSitesController**:
   - ¿Cómo deserializa pageStructureJson?
   - ¿Preserva correctamente sectionOrder?

4. **Verificar si el problema es solo en home page**:
   - El código solo recarga desde servidor en home
   - ¿Funciona correctamente en otras páginas?

## Logs de Debug Disponibles

El sistema tiene múltiples logs que pueden ayudar:
```javascript
console.log('[DRAG&DROP] Updated both currentSectionsConfig and pagesConfig sectionOrder:', newOrder);
console.log('[DEBUG] sectionOrder being saved:', sectionOrder);
console.log('[DEBUG] SectionOrder being saved:', currentSectionsConfig.sectionOrder);
```

## Solución Propuesta (Pendiente de Investigación)

1. **Opción A**: Evitar la recarga desde servidor después de guardar
2. **Opción B**: Asegurar que loadCurrentWebsite() preserve el orden local
3. **Opción C**: Agregar un delay mayor antes de recargar para asegurar que el servidor procesó el cambio
4. **Opción D**: Guardar el orden en una variable temporal y restaurarlo después de loadCurrentWebsite()

## Notas Adicionales

- El problema funcionaba correctamente antes según el usuario
- Es crítico mantener la solución simple debido al deadline
- El sistema de reglas padres/hijos debe seguir funcionando correctamente

## IMPORTANTE: Mismo Patrón que Bugs Ya Resueltos

Este bug es **exactamente el mismo patrón** que los bugs que resolvimos en los módulos individuales (header, rich text, gallery, etc.):

### Similitudes:
1. **Síntoma idéntico**: Los cambios se guardan correctamente pero se revierten después
2. **Causa raíz idéntica**: `loadCurrentWebsite()` recarga datos del servidor y sobrescribe cambios locales
3. **Ubicación del problema**: Línea ~27734 en el flujo general de guardado

### Diferencia clave:
- **En módulos individuales**: Removimos `loadCurrentWebsite()` de cada caso específico
- **En drag & drop**: El problema está en el flujo general cuando `currentPageId === 'home'`

### Solución probable (mismo approach):
```javascript
// ANTES (línea ~27734):
if (currentPageId === 'home') {
    setTimeout(() => {
        loadCurrentWebsite().then(() => {
            // Esto sobrescribe el orden recién guardado
            renderPreview();
            window.switchSidebarView('blockList', window.getUpdatedPageData());
        });
    }, 100);
}

// DESPUÉS (solución probable):
if (currentPageId === 'home') {
    // No recargar desde servidor, mantener datos locales
    renderPreview();
    window.switchSidebarView('blockList', window.getUpdatedPageData());
}
```

**Nota para la próxima sesión**: Ya resolvimos este mismo patrón ~20 veces en diferentes módulos. La solución es consistente: evitar la recarga innecesaria desde el servidor después de guardar.