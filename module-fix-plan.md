# Plan de Fix para Módulos del Website Builder

## Problema Identificado
Múltiples módulos presentan el mismo problema que tenía el header:
1. Al guardar cambios, se recargan los datos desde el servidor
2. Esto sobrescribe los cambios locales con datos antiguos
3. Los usuarios deben refrescar la página para ver sus cambios

## Módulos Afectados

### 1. Contact Form (`contactFormSettings`)
- **Estado actual**: Sin caso específico en post-guardado
- **Síntoma**: Cambios requieren refresh de página

### 2. Gallery (`gallerySettings`)
- **Estado actual**: Línea 28010 - Recarga desde servidor en página home
- **Síntoma**: Cambios se revierten después de guardar

### 3. Rich Text (`richTextSettings`)
- **Estado actual**: Sin caso específico en post-guardado
- **Síntoma**: Cambios requieren refresh de página

### 4. Testimonials (`testimonialsSettings`)
- **Estado actual**: Línea 27947 - Ya tiene fix parcial pero sin renderPreview()
- **Síntoma**: Vista se mantiene pero preview no se actualiza

### 5. Multicolumn (`multicolumnSettings`)
- **Estado actual**: Línea 27943 - Solo refresca vista sin renderPreview()
- **Síntoma**: Vista se mantiene pero preview no se actualiza

### 6. Image with Text (`imageWithTextSettings`)
- **Estado actual**: Línea 27833 - Recarga desde servidor
- **Síntoma**: Cambios se revierten después de guardar

### 7. Accordion/FAQ (`accordionSettings`)
- **Estado actual**: Línea 27957 - Recarga desde servidor en página home
- **Síntoma**: Cambios se revierten después de guardar

### 8. Featured Product (`featuredProductSettings`)
- **Estado actual**: Sin caso específico en post-guardado
- **Síntoma**: Cambios requieren refresh de página

### 9. Image Banner (`imageBannerSettings`)
- **Estado actual**: Línea 28063 - Recarga desde servidor en página home
- **Síntoma**: Cambios se revierten después de guardar

## Solución a Aplicar

Para cada módulo, agregar un caso en el bloque de manejo post-guardado siguiendo este patrón:

```javascript
} else if (currentSidebarView === 'moduleNameSettings') {
    // Mantener la vista abierta después de guardar
    console.log('[DEBUG] Staying in module name settings view after save');
    // Don't reload from server, just refresh the view with current data
    window.switchSidebarView('moduleNameSettings');
    
    // Force re-render preview to show the changes
    setTimeout(() => {
        console.log('[DEBUG] Force re-rendering preview after module name save');
        window.renderPreview();
    }, 100);
}
```

## Casos Especiales

### Módulos con Datos Adicionales
Algunos módulos como Contact Form necesitan pasar datos adicionales:

```javascript
} else if (currentSidebarView === 'contactFormSettings') {
    console.log('[DEBUG] Staying in contact form settings view after save');
    const contactFormId = window.currentContactFormId; // Necesitamos mantener el ID
    window.switchSidebarView('contactFormSettings', { 
        contactFormId: contactFormId,
        config: window.currentSectionsConfig?.contactForms?.[contactFormId]
    });
    
    setTimeout(() => {
        console.log('[DEBUG] Force re-rendering preview after contact form save');
        window.renderPreview();
    }, 100);
}
```

## Orden de Implementación

1. **Prioridad Alta** (Revierten cambios):
   - Image with Text
   - Gallery 
   - Accordion
   - Image Banner

2. **Prioridad Media** (No actualizan preview):
   - Testimonials (agregar renderPreview)
   - Multicolumn (agregar renderPreview)

3. **Prioridad Normal** (Sin caso específico):
   - Contact Form
   - Rich Text
   - Featured Product

## Verificación Post-Implementación

Para cada módulo verificar:
1. ✓ Los cambios persisten en la UI después de guardar
2. ✓ El preview se actualiza inmediatamente
3. ✓ No hay recarga desde el servidor
4. ✓ Los datos específicos del módulo se mantienen (IDs, configs, etc.)

## Notas Adicionales

- Algunos módulos pueden necesitar mantener variables globales (como `window.currentContactFormId`)
- Verificar que cada módulo pase los datos necesarios al refrescar la vista
- Mantener consistencia en los mensajes de debug