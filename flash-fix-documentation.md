# Documentación del Fix del Flash de Demo Product

## Fecha: 4 de Agosto de 2025

## Resumen del Problema

### Síntomas
1. **Flash de "Demo Product"**: Al hacer click en un producto desde Featured Collection, Collection Page o Products Page, se muestra brevemente "Demo Product" antes de cargar el producto real
2. **Comportamiento inconsistente**: Featured Collection parece funcionar mejor que las otras páginas
3. **Experiencia de usuario deficiente**: El usuario ve un cambio visual molesto durante la navegación

### Contexto Técnico
- El Product Container inicialmente muestra un producto demo mientras carga el producto real vía API
- La navegación es instantánea, pero la carga de datos tiene latencia
- El problema afecta tanto al preview del editor como a los dominios personalizados

## Análisis del Problema

### Flujo Actual
1. Usuario hace click en producto → navega a `/products/[handle]`
2. Product Container se renderiza inmediatamente con demo product
3. Product Container detecta el handle y hace llamada API
4. Se actualiza el contenido con el producto real
5. **Problema**: El usuario ve el cambio de demo → real

### Diagnóstico de Logs
```
[PRODUCT-CONTAINER] Using demo product as fallback
[PRODUCT-CONTAINER] Product loaded by handle: Object
[PRODUCT-CONTAINER] Product loaded from config handle: Honeymoon
[PRODUCT-CONTAINER] Re-rendering preview content with loaded product
```

## Soluciones Implementadas

### 1. Sistema de Loading State en Product Container
**Archivo**: `/wwwroot/js/website-builder/modules/product-container.js`
**Líneas**: 191-201

En lugar de mostrar demo product, ahora retorna un spinner de carga:
```javascript
// Return loading state instead of demo product
return `
    <div class="section-wrapper product-container-section" style="padding: 40px 0;">
        <div class="container" style="max-width: 1200px; margin: 0 auto; padding: 0 20px;">
            <div class="product-loading" style="text-align: center; padding: 60px 20px;">
                <div class="spinner" style="width: 40px; height: 40px; border: 3px solid #f3f3f3; border-top: 3px solid #333; border-radius: 50%; animation: spin 1s linear infinite; margin: 0 auto 20px;"></div>
                <style>@keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }</style>
                <p style="color: #666;">Cargando producto...</p>
            </div>
        </div>
    </div>
`;
```

### 2. Sistema de Delays Diferenciados
**Archivo**: `/Views/WebsiteBuilder/Preview.cshtml`
**Líneas**: 296-301

Se implementaron delays configurables por contexto:
```javascript
window.NAVIGATION_DELAYS = {
    featuredCollection: parseInt(localStorage.getItem('featuredDelay') || '75'),
    collectionPage: parseInt(localStorage.getItem('collectionDelay') || '150'),
    productsPage: parseInt(localStorage.getItem('productsDelay') || '150'),
    default: parseInt(localStorage.getItem('productNavDelay') || '150')
};
```

### 3. UI de Configuración de Delays
**Archivo**: `/Views/WebsiteBuilder/Preview.cshtml`
**Líneas**: 1630-1692

Se agregó un panel de configuración con sliders independientes para ajustar los delays:
- Featured Collection: 75ms (recomendado para servidores rápidos)
- Collection Page: 150ms (balance entre velocidad y estabilidad)
- Products Page: 150ms

### 4. Event Listeners con Loading State
**Archivo**: `/Views/WebsiteBuilder/Preview.cshtml`
**Líneas**: 1810-1894

Los enlaces de productos ahora:
1. Previenen navegación inmediata
2. Muestran estado de carga (opacity: 0.6)
3. Navegan después del delay configurado

### 5. MutationObserver para Contenido Dinámico
**Archivo**: `/Views/WebsiteBuilder/Preview.cshtml`
**Líneas**: 1897-1964

Se agregó un observador que detecta productos cargados dinámicamente vía AJAX y les aplica el sistema de delays automáticamente.

### 6. Implementación en Dominios Personalizados
**Archivo**: `/Views/WebsiteBuilder/PreviewTemplate.cshtml`
**Líneas**: 336-427

Se replicó el sistema en dominios personalizados con delays optimizados:
```javascript
window.NAVIGATION_DELAYS = {
    featuredCollection: 50,    // Más rápido para producción
    collectionPage: 100,       // Balanced speed
    productsPage: 100,         // Balanced speed
    default: 100               // Default delay
};
```

## Estado Actual

### ✅ Lo que funciona:
1. **Loading state**: Product Container muestra spinner en lugar de demo product
2. **Sistema de delays**: Implementado y configurable
3. **Featured Collection**: Parece funcionar mejor con el sistema actual
4. **UI de configuración**: Panel funcional para ajustar delays

### ❌ Lo que no funciona completamente:
1. **Collection/Products Pages**: Siguen mostrando el flash a pesar de los delays
2. **Timing inconsistente**: El problema persiste incluso con delays aplicados

### 🔍 Hipótesis del problema restante:
1. Los productos en Collection/Products pages podrían estar navegando antes de que se apliquen los event listeners
2. Podría haber múltiples listeners en conflicto
3. El timing entre la navegación y la carga del Product Container no está sincronizado correctamente

## Próximos Pasos Sugeridos

### 1. Debugging Adicional
- Agregar más logs para verificar que los event listeners se están aplicando
- Verificar el orden de ejecución de scripts
- Revisar si hay otros event listeners que interfieren

### 2. Solución Alternativa: Preload Agresivo
```javascript
// Precargar producto al hacer hover
link.addEventListener('mouseenter', function() {
    const handle = this.href.split('/products/')[1];
    fetch(`/api/builder/products/by-handle/${handle}`)
        .then(r => r.json())
        .then(product => {
            // Guardar en cache global
            window.productCache = window.productCache || {};
            window.productCache[handle] = product;
        });
});
```

### 3. Solución Nuclear: Navegación SPA
En lugar de navegación tradicional, implementar navegación tipo SPA que:
1. Intercepte clicks
2. Cargue el producto vía AJAX
3. Actualice el contenido sin recargar página
4. Use History API para actualizar URL

### 4. Optimización del Product Container
Modificar Product Container para:
1. Verificar cache antes de mostrar loading state
2. Si el producto está en cache, renderizar inmediatamente
3. Solo mostrar loading si realmente necesita cargar

## Archivos Modificados

1. `/wwwroot/js/website-builder/modules/product-container.js`
2. `/Views/WebsiteBuilder/Preview.cshtml`
3. `/Views/WebsiteBuilder/PreviewTemplate.cshtml`
4. `/wwwroot/js/website-render-functions.js` (corrección de sintaxis)

## Notas de la Sesión

- Se identificó que el fix original estaba en el loading state del Product Container
- Se implementó un sistema completo de delays configurables
- Se extendió la solución a dominios personalizados
- El problema persiste específicamente en Collection/Products pages
- Featured Collection parece funcionar mejor, posiblemente por su implementación diferente

## Referencias

- Conversación original sobre el fix: Documentado en `/previewrealproductos.md`
- Sistema de reservaciones relacionado: `/sessioncontinuity.md`