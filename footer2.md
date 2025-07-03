# Implementación de Sincronización de Menús en el Footer

## Resumen
Este documento detalla cómo se implementó la sincronización de menús en los bloques del footer del Website Builder, permitiendo que los bloques de tipo "menu" muestren el contenido real de los menús creados en el sistema.

## Problema Original
Los bloques de menú en el footer mostraban datos hardcodeados (mock data) en lugar del contenido real de los menús seleccionados por el usuario, aunque el select para elegir menús ya existía en la configuración.

## Solución Implementada

### 1. Estructura de Datos de los Menús

Los menús en el sistema tienen la siguiente estructura:
```javascript
{
    id: 'menu-123456',
    name: 'Footer Menu',
    handle: 'footer-menu',
    items: [
        {
            id: 123456,
            label: 'Términos y Condiciones',  // Nota: usa 'label', no 'text'
            url: '/terms',
            target: '_self',
            isHidden: false,
            level: 1,
            order: 0
        }
    ]
}
```

### 2. Ubicación de los Datos de Menús

Los menús pueden estar en dos lugares:
- `window.currentMenusData` - Array global de menús
- `window.currentGlobalThemeSettings.menus` - Dentro de la configuración del tema

### 3. Modificaciones en el Módulo del Footer

**Archivo:** `/wwwroot/js/website-builder/modules/footer.js`

#### Cambios en la función `renderBlock` para el caso 'menu':

```javascript
case 'menu':
    // Get real menu items if menuId is set
    let menuItems = [];
    
    // Check both sources for menu data - same as header
    let menusData = window.currentMenusData;
    if (!menusData || menusData.length === 0) {
        if (window.currentGlobalThemeSettings && window.currentGlobalThemeSettings.menus) {
            menusData = window.currentGlobalThemeSettings.menus;
        }
    }
    
    if (block.menuId && menusData && Array.isArray(menusData)) {
        const selectedMenu = menusData.find(menu => menu.id === block.menuId);
        if (selectedMenu) {
            const items = selectedMenu.items || selectedMenu.menuItems || [];
            
            if (items.length > 0) {
                menuItems = items
                    .filter(item => !item.isHidden && (!item.level || item.level === 1))
                    .sort((a, b) => (a.order || 0) - (b.order || 0))
                    .map(item => ({
                        text: item.text || item.label || item.name || '',
                        url: item.url || item.link || '#'
                    }));
            }
        }
    }
    
    // Render the menu
    content = `
        ${block.heading || block.title ? `<h3 class="footer-block-title">${block.heading || block.title}</h3>` : ''}
        ${menuItems.length > 0 ? `
            <ul class="footer-menu">
                ${menuItems.map(item => `<li><a href="${item.url}">${item.text}</a></li>`).join('')}
            </ul>
        ` : ''}
    `;
    break;
```

### 4. Puntos Clave de la Implementación

#### a) Búsqueda de Datos en Múltiples Fuentes
El código busca los menús primero en `currentMenusData` y si no encuentra datos, busca en `currentGlobalThemeSettings.menus`. Esto es importante porque los datos pueden estar en cualquiera de los dos lugares dependiendo de cómo se carguen.

#### b) Manejo de Diferentes Estructuras de Propiedades
Los items del menú pueden tener diferentes nombres de propiedades:
- El texto puede estar en: `text`, `label`, o `name`
- La URL puede estar en: `url` o `link`
- Los items pueden estar en: `items` o `menuItems`

#### c) Filtrado de Items
Solo se muestran items que:
- No están ocultos (`!item.isHidden`)
- Son de nivel 1 o no tienen nivel especificado
- Están ordenados por su propiedad `order`

### 5. Inicialización de Datos

**Archivo:** `/wwwroot/js/website-builder.js`

Se agregó la carga de menús al inicio de la aplicación:
```javascript
$(document).ready(async function() {
    // Load current website data first
    await loadCurrentWebsite();
    
    // Load menus data to make it available globally
    await loadMenusData();
    
    // ... resto del código
});
```

### 6. Paso de Datos al iFrame del Preview

Los datos de menús se pasan al iframe del preview junto con otros datos globales:
```javascript
if (previewIframe.contentWindow) {
    previewIframe.contentWindow.currentMenusData = currentMenusData;
    // ... otros datos
}
```

### 7. Event Handler del Select de Menús

El select ya tenía un handler que actualiza la configuración y renderiza el preview:
```javascript
$('#footer-menu-select').on('change', function() {
    const selectedMenuId = $(this).val();
    
    if (currentSectionsConfig.footer?.blocks?.[blockId]) {
        currentSectionsConfig.footer.blocks[blockId].menuId = selectedMenuId;
        hasPendingPageStructureChanges = true;
        updateSaveButtonState();
        renderPreview();
    }
});
```

## Flujo Completo

1. **Usuario selecciona un menú** en el dropdown del bloque menu del footer
2. **Se guarda el `menuId`** en la configuración del bloque
3. **Se llama a `renderPreview()`** que actualiza el preview
4. **Los datos de menús se pasan al iframe** junto con la configuración
5. **El módulo del footer busca el menú** por su ID en los datos disponibles
6. **Se extraen y procesan los items** del menú seleccionado
7. **Se renderizan los items** en el HTML del footer

## Troubleshooting

Si los menús no se muestran:

1. **Verificar que los datos de menús estén cargados:**
   - Revisar en consola: `console.log(window.currentMenusData)`
   - Revisar: `console.log(window.currentGlobalThemeSettings.menus)`

2. **Verificar la estructura de los items:**
   - Los items deben tener `label` (no `text`)
   - Deben tener `url` definida

3. **Verificar que el menuId se esté guardando:**
   - Revisar: `currentSectionsConfig.footer.blocks[blockId].menuId`

4. **Verificar que los datos lleguen al iframe:**
   - En el iframe: `console.log(window.currentMenusData)`

## Diferencias con el Header

El header usa la misma lógica pero con algunas diferencias:
- Tiene una función especializada `renderMenuItemsForHeader` para manejar submenús
- Aplica estilos más complejos (hover effects, dropdowns)
- El footer solo muestra items de nivel 1 en una lista simple

## Notas para el Futuro

- Los menús usan `label` para el texto, no `text`
- Siempre verificar ambas fuentes de datos (currentMenusData y globalThemeSettings)
- El footer no soporta submenús (solo nivel 1)
- Los datos deben pasarse al iframe antes de renderizar