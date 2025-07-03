# Flujo Real para Construcción de Módulos v2 - Website Builder

## 🚨 PROBLEMAS RESUELTOS Y DOCUMENTADOS

### 📌 PROBLEMA #1: Drag & Drop permite colocar elementos padre dentro de otros padres

**Fecha de resolución**: Enero 2025

#### Descripción del problema
Al hacer drag & drop de elementos en las template sections, se detectó un comportamiento inconsistente:
- **Arrastrando de arriba → abajo**: Permitía incorrectamente que un módulo padre se colocara DENTRO de otro padre (como hijo)
- **Arrastrando de abajo → arriba**: Funcionaba correctamente y restringía este comportamiento

Esto rompía la jerarquía correcta del sistema:
- ✅ **Correcto**: Padre → Hijos
- ❌ **Incorrecto**: Padre → Padre → Hijos

#### Síntomas
1. Módulos como Gallery, Multicolumn, Accordion podían arrastrarse dentro de otros módulos padre
2. La estructura se corrompía visualmente en el panel lateral
3. Al guardar, podían ocurrir errores o comportamientos inesperados

#### Causa raíz
jQuery UI Sortable no estaba validando correctamente las posiciones de drop cuando el movimiento era rápido o cuando el elemento se colocaba justo entre un padre y su wrapper hijo. Las validaciones existentes (`sort`, `beforeStop`, `receive`) no capturaban todos los casos edge.

#### Solución implementada
Se implementó una estrategia de validación multicapa con auto-corrección:

##### 1. **Nuevo evento `update`** (líneas 14863-14912)
```javascript
update: function(e, ui) {
    const childWrappers = [
        'multicolumn-columns-wrapper',
        'imageWithText-blocks-wrapper',
        'testimonials-items-wrapper',
        'accordion-items-wrapper',
        'gallery-images-wrapper',
        'slideshow-slides-wrapper',
        // etc...
    ];
    
    // Verificar si algún padre terminó dentro de un wrapper hijo
    let invalidPlacement = false;
    childWrappers.forEach(wrapperId => {
        const $wrapper = $('#' + wrapperId);
        if ($wrapper.length) {
            const $parentSectionsInside = $wrapper.find('> .sidebar-subsection[data-section-id]');
            if ($parentSectionsInside.length > 0) {
                invalidPlacement = true;
                // Auto-corregir: mover el padre fuera del wrapper
                $parentSectionsInside.each(function() {
                    $(this).insertAfter($wrapper);
                });
            }
        }
    });
    
    if (invalidPlacement) {
        $(this).sortable('cancel');
        // Feedback visual
        ui.item.css('background-color', '#ffcccc');
        setTimeout(() => ui.item.css('background-color', ''), 500);
    }
}
```

##### 2. **Mejora en `beforeStop`** (líneas 14791-14849)
Se añadió validación para detectar cuando se intenta colocar un elemento entre un padre y su wrapper:
```javascript
// Verificar posición relativa
const $prev = $placeholder.prev();
const $next = $placeholder.next();

if ($prev.length && $prev.hasClass('sidebar-subsection')) {
    const prevId = $prev.data('section-id');
    const expectedWrapperId = prevId + '-...-wrapper';
    
    if ($next.length && $next.attr('id') === expectedWrapperId) {
        console.log('[DRAG&DROP] INVALID: Trying to place between parent and its wrapper');
        invalidPosition = true;
    }
}
```

##### 3. **Mejora en `over`** (líneas 14756-14784)
Prevención proactiva al hacer hover sobre contenedores hijos:
```javascript
over: function(e, ui) {
    const containerId = $container.attr('id');
    
    if (childWrappers.includes(containerId) || containerId?.includes('-wrapper')) {
        ui.placeholder.hide();
        $container.css('background-color', '#ffcccc'); // Feedback visual inmediato
    }
}
```

#### Resultado
- El sistema ahora **auto-corrige** cualquier colocación inválida
- Aunque visualmente puede parecer que permite el drop momentáneamente, el elemento se reposiciona automáticamente a una ubicación válida
- La estructura siempre queda correcta al guardar

#### Lecciones aprendidas
1. **jQuery UI Sortable tiene limitaciones**: No siempre es posible prevenir completamente los drops inválidos en tiempo real
2. **Estrategia "detectar y corregir"**: Es más robusta que intentar prevenir todos los casos
3. **Validación multicapa**: Combinar múltiples eventos (`over`, `sort`, `beforeStop`, `update`) proporciona mejor cobertura
4. **Auto-corrección**: Es mejor mover elementos mal colocados que simplemente cancelar la operación

#### Testing
Para verificar que el fix funciona:
1. Agregar varios módulos con hijos (Gallery, Multicolumn, Accordion)
2. Intentar arrastrar un módulo padre dentro de otro, tanto de arriba hacia abajo como de abajo hacia arriba
3. Observar:
   - Placeholder se oculta sobre wrappers hijos
   - Fondo rojo aparece como feedback
   - Elemento se auto-corrige si se coloca incorrectamente
   - Estructura final siempre es válida

#### Archivos modificados
- `/wwwroot/js/website-builder.js` - Función `initializeDragAndDropSimple()` líneas 14450-14980

---

## 📋 ÍNDICE DE PROBLEMAS RESUELTOS

1. **Drag & Drop permite colocar padres dentro de otros padres** - [Ver arriba](#problema-1-drag--drop-permite-colocar-elementos-padre-dentro-de-otros-padres)

---

## 🔧 CÓMO USAR ESTE DOCUMENTO

Este documento complementa `FLUJO-REAL-MODULOS.md` y se enfoca específicamente en problemas complejos resueltos que requieren documentación detallada.

Cuando encuentres y resuelvas un problema complejo:
1. Agrégalo a este documento con la fecha
2. Incluye: descripción, síntomas, causa, solución, código relevante
3. Actualiza el índice
4. Referencia este documento en commits relacionados

---

*Última actualización: Enero 2025*