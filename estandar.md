# Estándar de Implementación - Website Builder

## 1. PROBLEMA CRÍTICO: Ubicación de Archivos de Preview

### Problema Documentado:
Al implementar multicolumn, el preview no se mostraba al hacer hover aunque el código era idéntico a slideshow.

### Causa Real:
- **Ubicación incorrecta**: El archivo estaba en `/TestImages/` 
- **Ubicación correcta**: DEBE estar en `/wwwroot/TestImages/`
- **Evidencia**: `slideshowpreview.png` estaba en `/wwwroot/TestImages/` y funcionaba

### Solución:
```bash
# Copiar archivo a la ubicación correcta
cp "/TestImages/archivo.png" "/wwwroot/TestImages/archivo.png"
```

### Lección Aprendida:
TODOS los archivos estáticos (imágenes, CSS, JS) DEBEN estar dentro de `/wwwroot/` para ser accesibles desde el navegador.

## 2. PROBLEMA: Funciones Duplicadas con Comportamiento Diferente

### Problema Documentado:
Existen DOS funciones `renderTemplateSections()`:
- **Primera** (línea 4846): Genérica, maneja todas las secciones
- **Segunda** (línea 5034): Solo maneja slideshow

### Impacto:
- Slideshow aparecía en el panel lateral
- Multicolumn NO aparecía porque la segunda función no lo conocía

### Solución Aplicada:
Agregar multicolumn a la segunda función (líneas 5096-5115)

### Estándar a Seguir:
- **NUNCA** duplicar funciones con el mismo nombre
- **SIEMPRE** verificar si existe una función antes de crear otra
- **USAR** nombres descriptivos: `renderTemplateSectionsForModal()` vs `renderAllTemplateSections()`

## 3. FLUJO CORRECTO: Agregar Nueva Sección desde Modal

### Prerrequisitos:
1. **Archivo de preview** en `/wwwroot/TestImages/`
2. **Definir sección** en array de secciones (línea ~6424)
3. **Agregar preview** al objeto previews (línea ~9854)
4. **Handler del click** para la nueva sección (línea ~10065)
5. **Actualizar** función `renderTemplateSections()` segunda versión

### Estructura del Preview:
```javascript
'nombreSeccion': '<div class="section-preview-image"><img src="/TestImages/archivo.png" alt="Nombre"></div>',
```

### Handler del Click:
```javascript
if (group === 'template' && sectionId === 'nombreSeccion') {
    if (!currentSectionsConfig.nombreSeccion) {
        // Inicializar configuración
        currentSectionsConfig.nombreSeccion = {
            id: 'nombreSeccion',
            isHidden: false,
            config: {
                // configuración por defecto
            }
        };
        
        // Agregar a sectionOrder
        if (!currentSectionsConfig.sectionOrder.includes('nombreSeccion')) {
            currentSectionsConfig.sectionOrder.push('nombreSeccion');
        }
        
        // Actualizar UI
        const templateSectionsHtml = renderTemplateSections();
        $('#template-sections-container').html(templateSectionsHtml + /* botón agregar */);
        
        // Marcar cambios
        hasPendingPageStructureChanges = true;
        updateSaveButtonState();
        renderPreview();
    }
}
```

## 4. ARQUITECTURA MODULAR OBLIGATORIA

### Para TODOS los módulos nuevos:
```
/wwwroot/js/website-builder/modules/[nombre-modulo].js
```

### Estructura del Módulo:
```javascript
window.WebsiteBuilderModules = window.WebsiteBuilderModules || {};
window.WebsiteBuilderModules.NombreModulo = {
    render: function(config) { },
    renderSettings: function(config) { },
    attachEventListeners: function() { },
    initialize: function() { }
};
```

### Integración:
1. Cargar script en Index.cshtml, PreviewTemplate.cshtml y Preview.cshtml
2. Usar `executeModuleFunction()` en switchSidebarView
3. Verificar si módulo existe antes de usar funciones legacy

## 5. CHECKLIST DE VERIFICACIÓN

Antes de reportar que algo no funciona:

- [ ] ¿El archivo de preview está en `/wwwroot/TestImages/`?
- [ ] ¿La consola muestra el log "Hovering over section: [nombre]"?
- [ ] ¿Agregaste la sección a AMBAS funciones renderTemplateSections()?
- [ ] ¿El handler del click verifica el sectionId correcto?
- [ ] ¿Hay errores 404 en Network para la imagen?
- [ ] ¿Hiciste refresh completo con Ctrl+F5?
- [ ] ¿Verificaste que no hay espacios en el nombre del archivo?

## 6. DEBUGGING EFECTIVO

### Logs clave a buscar:
```javascript
console.log('Hovering over section:', sectionId);  // Al hacer hover
console.log('[DEBUG] Section item clicked');       // Al hacer click
console.log('[DEBUG] Adding [nombre] section');    // Al procesar
```

### Si no aparecen estos logs:
1. El evento no se está disparando
2. Verificar que el elemento tiene `data-section-id`
3. Verificar que el modal tiene clase `add-section-modal`

## 7. PROBLEMA: Botón Delete No Funciona para Nuevos Módulos

### Problema Documentado:
El botón de eliminar no funcionaba para multicolumn aunque sí para slideshow.

### Causa Real:
- El handler de delete (línea 8589) tiene lógica hardcodeada SOLO para slideshow
- No hay caso genérico para otros módulos
- Cada módulo nuevo debe agregarse manualmente al handler

### Código del Problema:
```javascript
// SOLO maneja slideshow
if (section === 'slideshow' && currentSectionsConfig.slideshow) {
    delete currentSectionsConfig.slideshow;
    // ... resto del código
}
// NO HAY ELSE para otros módulos!
```

### Solución Correcta:
```javascript
if (section === 'slideshow' && currentSectionsConfig.slideshow) {
    // ... código slideshow
} else if (section === 'multicolumn' && currentSectionsConfig.multicolumn) {
    delete currentSectionsConfig.multicolumn;
    const index = currentSectionsConfig.sectionOrder.indexOf('multicolumn');
    if (index > -1) {
        currentSectionsConfig.sectionOrder.splice(index, 1);
    }
}
```

### Estándar a Seguir:
- **MEJOR**: Crear handler genérico que funcione con cualquier sección
- **ACTUAL**: Agregar cada módulo nuevo al if/else del delete handler

### IMPLEMENTACIÓN CORRECTA - Borrar Elemento del Panel:
Para que el botón delete funcione con un nuevo módulo, debes:

1. **Agregar el caso en el handler de delete** (línea ~8620):
```javascript
else if (section === 'tuModulo' && currentSectionsConfig.tuModulo) {
    delete currentSectionsConfig.tuModulo;
    // Remover del array de orden
    const index = currentSectionsConfig.sectionOrder.indexOf('tuModulo');
    if (index > -1) {
        currentSectionsConfig.sectionOrder.splice(index, 1);
    }
}
```

2. **El botón delete en el HTML debe tener**:
```html
<button class="action-icon delete-section" data-section="tuModulo" title="Delete">
    <i class="material-icons">delete</i>
</button>
```

3. **Elementos críticos**:
- `data-section="tuModulo"` - DEBE coincidir con el nombre en currentSectionsConfig
- Clase `delete-section` - Para que el handler lo detecte
- El handler ya maneja: fadeOut, renderPreview(), y hasPendingPageStructureChanges

4. **NO OLVIDAR**:
- Borrar de `currentSectionsConfig.tuModulo`
- Borrar de `currentSectionsConfig.sectionOrder`
- El DOM se borra automáticamente con fadeOut

## 8. PROBLEMA: Orden de Secciones en Preview No Respeta Panel Lateral

### Problema Documentado:
Al agregar multicolumn, aparecía correctamente al final en el panel lateral pero en el preview aparecía justo después del header, desplazando otras secciones.

### Causa Real:
El código insertaba nuevas secciones justo después del header sin importar el orden visual:
```javascript
// PROBLEMA: Fuerza inserción después del header
const headerIndex = currentSectionsConfig.sectionOrder.indexOf('header');
if (headerIndex >= 0) {
    currentSectionsConfig.sectionOrder.splice(headerIndex + 1, 0, 'multicolumn');
}
```

### Solución Correcta:
```javascript
// CORRECTO: Agregar al final para respetar orden visual
if (!currentSectionsConfig.sectionOrder.includes('multicolumn')) {
    currentSectionsConfig.sectionOrder.push('multicolumn');
}
```

### Estándar a Seguir:
- **SIEMPRE** agregar nuevas secciones al final con `.push()`
- **NUNCA** forzar posiciones específicas a menos que el usuario lo pida
- El orden en `sectionOrder` debe coincidir con el orden visual del panel

## 9. PROBLEMA CRÍTICO: Doble Scroll en Vistas de Configuración

### Problema Documentado:
Las vistas de configuración mostraban doble scroll (uno interno y otro externo), creando un scroll infinito con espacio en blanco. Además, la flecha y título no se mostraban correctamente en horizontal.

### Causa Real:
- El contenedor `sidebar-dynamic-content` YA tiene su propio scroll
- Agregar otro contenedor con scroll crea conflicto
- Los estilos CSS de `.sidebar-view-header` requieren estructura específica

### Solución CORRECTA:
```javascript
return `
    <div style="display: flex; flex-direction: column; height: 100%; position: relative; overflow: hidden;">
        <div class="sidebar-view-header" style="position: relative; z-index: 10;">
            <button class="back-to-sections-btn">
                <i class="material-icons">arrow_back</i>
            </button>
            <h3>Título</h3>
        </div>
        
        <div style="padding: 20px; overflow-y: auto; overflow-x: hidden; flex: 1; height: calc(100% - 60px); box-sizing: border-box;">
            <!-- Contenido aquí -->
        </div>
    </div>
`;
```

### Elementos CRÍTICOS:
1. **Contenedor principal**: `overflow: hidden` (NO auto, NO scroll)
2. **Header**: Usar clase `sidebar-view-header` con estructura exacta
3. **Contenido**: 
   - `overflow-y: auto` para scroll vertical
   - `overflow-x: hidden` para evitar scroll horizontal
   - `height: calc(100% - 60px)` para restar altura del header
   - `box-sizing: border-box` para incluir padding en el cálculo

### NUNCA HACER:
- NO quitar el contenedor wrapper principal
- NO poner scroll en el contenedor principal
- NO usar estilos inline para el header (la clase CSS ya los tiene)
- NO olvidar el `calc(100% - 60px)` en el contenido

### Tiempo Perdido: 2+ HORAS
Por no entender que `sidebar-dynamic-content` ya maneja su propio scroll y que agregar otro contenedor con scroll crea el problema.

## 10. TIEMPO PERDIDO DOCUMENTADO

### Multicolumn - 2+ horas perdidas por:
1. **30 min** - Preview con imagen en carpeta incorrecta
2. **45 min** - Función renderTemplateSections duplicada
3. **45 min** - Diagnóstico incorrecto del problema
4. **15 min** - Espacios en nombres de archivo
5. **10 min** - Delete button no funcionaba (handler incompleto)

### Lección Principal:
**SIEMPRE** comparar línea por línea con un módulo que SÍ funciona antes de crear código nuevo.

## 11. PROBLEMA: Variables Globales No Accesibles desde Módulos

### Problema Documentado:
Al hacer click en columnas individuales del módulo multicolumn, aparecía el error:
```
[MULTICOLUMN] Multicolumn not found in currentSectionsConfig
[MULTICOLUMN] currentSectionsConfig: undefined
```

### Causa Real:
- `currentSectionsConfig` estaba declarado con `let` en el scope global de website-builder.js
- NO estaba asignado a `window`, por lo que los módulos externos no podían accederlo
- Los módulos en archivos separados no tienen acceso directo a las variables del archivo principal

### Código del Problema:
```javascript
// En website-builder.js
let currentSectionsConfig = { /* ... */ };

// En multicolumn.js
if (!window.currentSectionsConfig) { // undefined!
    console.error('[MULTICOLUMN] Multicolumn not found');
}
```

### Solución Aplicada:

1. **Hacer la variable accesible globalmente** (después de la declaración):
```javascript
let currentSectionsConfig = { /* ... */ };

// Make currentSectionsConfig globally accessible
window.currentSectionsConfig = currentSectionsConfig;
```

2. **Actualizar TODAS las reasignaciones**:
```javascript
// Cada vez que se reasigna
currentSectionsConfig = nuevaConfig;
window.currentSectionsConfig = currentSectionsConfig; // CRÍTICO!
```

3. **En el módulo, intentar ambos scopes**:
```javascript
// Try to access from parent scope or window
const sectionsConfig = (typeof currentSectionsConfig !== 'undefined' ? 
    currentSectionsConfig : window.currentSectionsConfig);
```

### Lugares Clave Actualizados:
- Línea ~134: Después de la declaración inicial
- Línea ~360: Después del $.extend con defaults
- Línea ~446: En el catch del error parsing
- Línea ~458: Cuando no hay datos y se usan defaults
- Línea ~488: Cuando se carga desde sectionsConfigJson

### Estándar a Seguir:
- **SIEMPRE** asignar variables globales a `window` si serán usadas por módulos externos
- **VERIFICAR** todas las reasignaciones para mantener sincronizado
- **MÓDULOS** deben intentar acceder tanto al scope local como a window

### Tiempo Perdido: 30+ minutos
Por no entender que los módulos en archivos separados no tienen acceso automático a las variables del archivo principal, incluso si son globales.