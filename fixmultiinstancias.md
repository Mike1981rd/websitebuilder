# Fix para Módulos Multi-Instancia - Website Builder

## 📋 Resumen Ejecutivo
**Problema**: Los módulos multi-instancia (como featured-collection) no actualizaban correctamente sus configuraciones al hacer click desde el preview debido a un problema de identificación de IDs.

**Solución**: Implementar lógica de búsqueda de ID real en el manejador de clicks del preview.

**Fecha**: Enero 2025

---

## 🔴 El Problema

### Síntomas
1. Al cambiar el color scheme en un módulo multi-instancia, el cambio NO se reflejaba en el preview
2. Los logs mostraban que se estaba usando el ID genérico `'featured-collection'` en lugar del ID específico de instancia `'featured-collection-1751984193158'`
3. Las actualizaciones se guardaban en la ubicación incorrecta de la estructura de datos

### Ejemplo del problema en logs
```
[PREVIEW CLICK] Clicked section: featured-collection
[FEATURED COLLECTION] Opening settings for ID: featured-collection
// ❌ Debería ser: featured-collection-1751984193158
```

### Causa Raíz
Los módulos multi-instancia tienen una arquitectura especial:
- **ID genérico**: `featured-collection` (usado en el HTML del preview)
- **ID de instancia**: `featured-collection-1751984193158` (usado en la estructura de datos)
- **Estructura de datos**: `currentSectionsConfig.featuredCollections[instanceId]`

Al hacer click desde el preview, solo llegaba el ID genérico, causando que las actualizaciones se guardaran en el lugar equivocado.

---

## ✅ La Solución

### Archivo modificado
`/wwwroot/js/website-builder.js` - Función del event listener de clicks en preview (aproximadamente línea 530)

### Código de la solución
```javascript
// Dentro del click handler del preview
$previewContainer.on('click', '.section-wrapper', function(e) {
    e.stopPropagation();
    const sectionId = $(this).data('section-id');
    let actualSectionId = sectionId;
    
    // CRITICAL FIX FOR MULTI-INSTANCE MODULES
    // Si solo tenemos el ID genérico (ej: 'featured-collection'), buscar el ID real
    if (sectionId === 'featured-collection') {
        // Método 1: Buscar en el DOM el wrapper con data-element-id
        const $wrapper = $(this).closest('[data-element-id]');
        if ($wrapper.length && $wrapper.data('element-id')) {
            actualSectionId = $wrapper.data('element-id');
            console.log('[PREVIEW CLICK] Found instance ID from wrapper:', actualSectionId);
        } else {
            // Método 2: Buscar en currentSectionsConfig
            const featuredCollections = window.currentSectionsConfig?.featuredCollections;
            if (featuredCollections) {
                const ids = Object.keys(featuredCollections).filter(id => id.startsWith('featured-collection-'));
                if (ids.length > 0) {
                    actualSectionId = ids[0]; // Usar el primer ID encontrado
                    console.log('[PREVIEW CLICK] Found instance ID from config:', actualSectionId);
                }
            }
        }
    }
    
    // Usar actualSectionId en lugar de sectionId
    console.log('[PREVIEW CLICK] Opening settings for:', actualSectionId);
    
    // Continuar con la lógica usando actualSectionId...
});
```

### Por qué funciona
1. **Método 1**: El módulo al renderizar incluye `data-element-id` con el ID real en su wrapper
2. **Método 2**: Si no encuentra el atributo, busca en la estructura de datos todas las instancias que empiecen con el prefijo del módulo

---

## 🔧 Cómo aplicar este fix a otros módulos multi-instancia

### 1. Identificar si tu módulo es multi-instancia
Un módulo es multi-instancia si:
- Puede agregarse múltiples veces a la misma página
- Usa IDs únicos con timestamp (ej: `modulo-1234567890`)
- Se guarda en un objeto/array en lugar de una propiedad directa

### 2. Agregar el fix al click handler
```javascript
// Agregar después de obtener sectionId
if (sectionId === 'tu-modulo') {
    // Buscar el ID real
    const $wrapper = $(this).closest('[data-element-id]');
    if ($wrapper.length && $wrapper.data('element-id')) {
        actualSectionId = $wrapper.data('element-id');
    } else {
        // Buscar en tu estructura de datos
        const instances = window.currentSectionsConfig?.tuModuloPlural;
        if (instances) {
            const ids = Object.keys(instances).filter(id => id.startsWith('tu-modulo-'));
            if (ids.length > 0) {
                actualSectionId = ids[0];
            }
        }
    }
}
```

### 3. Asegurar que el render incluya data-element-id
En la función render de tu módulo:
```javascript
render: function(config) {
    return `
        <div class="section-wrapper" 
             data-section-id="tu-modulo" 
             data-element-id="${config.id}">
            <!-- Contenido -->
        </div>
    `;
}
```

---

## 🔴 PROBLEMA ADICIONAL: ID no llega a las funciones de renderizado

### Fecha de resolución: Enero 2025

### Descripción del problema
Incluso después de implementar el fix anterior, los cambios de configuración NO se reflejaban en el preview. El problema era que el ID de la instancia no se estaba pasando a las funciones de renderizado internas del módulo.

### Síntomas
- Los cambios en color scheme, layout (grid/carousel), etc. no se actualizaban en el preview
- El atributo `data-element-id` aparecía vacío o con un ID temporal nuevo
- Los cambios se guardaban correctamente pero el preview no los mostraba

### Causa raíz
El módulo tenía la siguiente estructura:
```javascript
render: function(config) {
    // config tiene el ID pero settings no
    let settings = config.config;
    
    // Las funciones de renderizado recibían settings SIN el ID
    return this.renderProductsView(settings, schemeColors);
}
```

### Solución implementada
Pasar explícitamente el ID a las funciones de renderizado:

```javascript
render: function(config) {
    let settings;
    if (config.config) {
        settings = config.config;
    } else {
        settings = config;
    }
    
    // CRÍTICO: Pasar el ID de la instancia
    if (hasProducts) {
        settings.id = config.id; // <-- AGREGAR ESTA LÍNEA
        return this.renderProductsView(settings, schemeColors);
    } else if (hasCollections) {
        settings.id = config.id; // <-- AGREGAR ESTA LÍNEA
        return this.renderCollectionView(settings, schemeColors);
    } else {
        settings.id = config.id; // <-- AGREGAR ESTA LÍNEA
        return this.renderEmptyState(settings, schemeColors);
    }
}
```

Y luego en CADA función de renderizado usar el ID:
```javascript
renderProductsView: function(settings, schemeColors) {
    return `
        <div class="section-wrapper" 
             data-section-id="featured-collection" 
             data-element-id="${settings.id || uniqueId}"> <!-- USAR settings.id -->
    `;
}
```

### Checklist completo para módulos multi-instancia
- [ ] El click handler del preview busca el ID real de la instancia
- [ ] La función `render()` principal pasa el ID a las subfunciones
- [ ] TODAS las subfunciones de renderizado incluyen `data-element-id="${settings.id}"`
- [ ] El módulo guarda el ID en una variable global (ej: `window.currentFeaturedCollectionId`)
- [ ] Los event listeners usan el ID correcto al guardar cambios

### Estructura correcta de datos
```javascript
// Estructura en currentSectionsConfig
currentSectionsConfig.featuredCollections = {
    'featured-collection-1234567890': {
        id: 'featured-collection-1234567890',  // <-- CRÍTICO: debe tener el ID
        isHidden: false,
        config: {
            colorScheme: 'scheme1',
            // ... resto de configuración
        }
    }
}
```

---

## 📊 Módulos afectados conocidos
- `featured-collection` ✅ (Fixed)
- `featured-product` ⚠️ (Puede necesitar el mismo fix)
- Cualquier módulo que permita múltiples instancias

---

## 🧪 Cómo probar el fix
1. Agregar múltiples instancias del módulo
2. Hacer click en una instancia desde el preview
3. Cambiar una configuración (ej: color scheme)
4. Verificar que el cambio se refleja inmediatamente en el preview
5. Revisar los logs para confirmar que se usa el ID correcto

### Logs esperados después del fix
```
[PREVIEW CLICK] Clicked section: featured-collection
[PREVIEW CLICK] Found instance ID from wrapper: featured-collection-1751984193158
[PREVIEW CLICK] Opening settings for: featured-collection-1751984193158
```

---

## ⚠️ Advertencias
- NO aplicar este fix a módulos de instancia única (header, announcement-bar, etc.)
- Si un módulo tiene múltiples instancias, TODAS deben tener IDs únicos
- La estructura de datos debe ser consistente (objeto con keys de instanceId)

---

## 📝 Notas adicionales
Este problema es específico de la arquitectura del Website Builder donde:
- El preview renderiza HTML con IDs genéricos para simplicidad
- La configuración usa IDs específicos para permitir múltiples instancias
- El click handler debe hacer el mapeo entre ambos

---

## 🚨 Resumen de los dos problemas principales

### Problema 1: Click handler no encuentra el ID correcto
**Síntoma**: Al hacer click desde el preview, se usa el ID genérico
**Fix**: Implementar búsqueda de ID en el click handler

### Problema 2: ID no llega a las funciones de renderizado
**Síntoma**: Aunque el click funciona, los cambios no se ven en el preview
**Fix**: Pasar explícitamente `settings.id = config.id` antes de llamar a subfunciones

Ambos fixes son necesarios para que los módulos multi-instancia funcionen correctamente.

**Última actualización**: Enero 2025