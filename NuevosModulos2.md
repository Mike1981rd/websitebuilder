# Guía de Estandarización para Nuevos Módulos - Website Builder (Parte 2)

## PUNTO #7: COLOR SCHEMES CONFIGURATION

### Sistema de Color Schemes
El sistema usa 5 esquemas de color predefinidos (scheme1 a scheme5). Los módulos deben respetar estos esquemas seleccionados.

### 7.1 OBTENER COLORES DEL SCHEME

**Función helper existente** (website-render-functions.js):
```javascript
// Esta función ya existe - NO redefinir
function getColorSchemeValues(schemeName) {
    // Busca primero en configuración personalizada
    // Luego en esquemas predefinidos
    return schemeColors;
}
```

**Estructura de colores retornados**:
```javascript
{
    background: '#ffffff',
    text: '#333333',
    foreground: '#f0f0f0',
    border: '#e5e5e5'
}
```

### 7.2 AGREGAR SELECT EN CONFIGURACIÓN

```javascript
// En renderSettings del módulo
<div class="settings-field" style="margin-bottom: 20px;">
    <label style="display: block; font-size: 13px; color: #202223; margin-bottom: 8px;">
        <span data-i18n="nombreModulo.fields.colorScheme">Esquema de color</span>
    </label>
    <select id="module-color-scheme" class="shopify-select" style="width: 100%;">
        <option value="scheme1" ${config.colorScheme === 'scheme1' ? 'selected' : ''}>Esquema 1</option>
        <option value="scheme2" ${config.colorScheme === 'scheme2' ? 'selected' : ''}>Esquema 2</option>
        <option value="scheme3" ${config.colorScheme === 'scheme3' ? 'selected' : ''}>Esquema 3</option>
        <option value="scheme4" ${config.colorScheme === 'scheme4' ? 'selected' : ''}>Esquema 4</option>
        <option value="scheme5" ${config.colorScheme === 'scheme5' ? 'selected' : ''}>Esquema 5</option>
    </select>
</div>
```

### 7.3 EVENT LISTENER PARA COLOR SCHEME

```javascript
// En attachEventListeners
$('#module-color-scheme').on('change', function() {
    updateConfig('colorScheme', $(this).val());
});
```

### 7.4 APLICAR COLORES EN RENDER

```javascript
// En función render del módulo
render: function(config) {
    if (!config || config.isHidden) return '';
    
    // Obtener colores del scheme seleccionado
    const selectedScheme = config.colorScheme || 'scheme1';
    const schemeColors = getColorSchemeValues(selectedScheme);
    
    return `
        <div class="module-container" style="background-color: ${schemeColors.background}; color: ${schemeColors.text};">
            ${config.title ? `<h2 style="color: ${schemeColors.text};">${config.title}</h2>` : ''}
            
            <!-- Usar colores en elementos -->
            <div style="border: 1px solid ${schemeColors.border};">
                <!-- Contenido -->
            </div>
            
            <!-- Foreground para fondos secundarios -->
            <div style="background-color: ${schemeColors.foreground};">
                <!-- Contenido con fondo secundario -->
            </div>
        </div>
    `;
}
```

### 7.5 COLOR SCHEME EN ELEMENTOS HIJOS

Si los hijos tienen su propio color scheme:

```javascript
// En configuración del hijo
<select id="child-color-scheme" class="shopify-select">
    <option value="inherit" ${child.colorScheme === 'inherit' ? 'selected' : ''}>Heredar del padre</option>
    <option value="scheme1" ${child.colorScheme === 'scheme1' ? 'selected' : ''}>Esquema 1</option>
    <!-- etc -->
</select>

// En render del hijo
function renderChild(child, parentConfig) {
    // Si es 'inherit', usar el del padre
    const childScheme = child.colorScheme === 'inherit' ? parentConfig.colorScheme : child.colorScheme;
    const schemeColors = getColorSchemeValues(childScheme || 'scheme1');
    
    return `
        <div style="background: ${schemeColors.background}; color: ${schemeColors.text};">
            <!-- Contenido del hijo -->
        </div>
    `;
}
```

### 7.6 COLORES ADICIONALES EN SCHEMES

Algunos módulos usan colores adicionales:
```javascript
// Botones sólidos
background: ${schemeColors['solid-button'] || schemeColors.primary || '#121212'};
color: ${schemeColors['solid-button-text'] || '#FFFFFF'};

// Enlaces (ahora tienen color propio en cada scheme)
color: ${schemeColors.link || schemeColors.text};
```

### 7.7 PROBLEMA DOCUMENTADO Y RESUELTO

**Problema**: Header no respetaba los color schemes seleccionados
**Causa**: La variable `currentGlobalThemeSettings` no estaba disponible globalmente para `website-render-functions.js`
**Solución**: Hacer la variable disponible globalmente
```javascript
window.currentGlobalThemeSettings = currentGlobalThemeSettings;
```

### 7.8 IMPORTANTE: SOLO USAR SCHEME 1-5

**Documentado en CLAUDE.md**:
- Primary/Secondary/Contrasting están ocultos
- Solo usar scheme1, scheme2, scheme3, scheme4, scheme5
- Nunca usar 'primary', 'secondary' (no existen)

### 7.9 COLOR SCHEMES PREDEFINIDOS

Cada scheme tiene estos colores base:
- **Scheme 1**: Default/Classic (fondo blanco)
- **Scheme 2**: Light Gray  
- **Scheme 3**: Dark (fondo oscuro)
- **Scheme 4**: Blue-Gray
- **Scheme 5**: Beige/Brown

### 7.10 EJEMPLO COMPLETO - MÓDULO CON COLOR SCHEME

```javascript
window.WebsiteBuilderModules.NombreModulo = {
    render: function(config) {
        if (!config || config.isHidden) return '';
        
        const schemeColors = getColorSchemeValues(config.colorScheme || 'scheme1');
        
        // Aplicar colores del scheme en todo el módulo
        return `
            <div class="module-wrapper" style="background: ${schemeColors.background};">
                <div class="module-container">
                    ${config.heading ? `
                        <h2 style="color: ${schemeColors.text}; text-align: ${config.contentAlignment || 'center'};">
                            ${config.heading}
                        </h2>
                    ` : ''}
                    
                    ${config.body ? `
                        <p style="color: ${schemeColors.text}; opacity: 0.8;">
                            ${config.body}
                        </p>
                    ` : ''}
                    
                    <!-- Elementos con foreground -->
                    <div class="module-cards" style="background: ${schemeColors.foreground}; border: 1px solid ${schemeColors.border};">
                        <!-- Contenido -->
                    </div>
                </div>
            </div>
        `;
    }
};
```

### Verificación del Punto #7
- [ ] Usar getColorSchemeValues() existente
- [ ] Select con scheme1-5 (NO primary/secondary)
- [ ] Valor por defecto 'scheme1'
- [ ] Aplicar colores en todos los elementos
- [ ] Opción 'inherit' para hijos si aplica
- [ ] background, text, foreground, border aplicados
- [ ] Event listener actualiza con updateConfig

## PUNTO #8: SISTEMA DE TIPOGRAFÍA

### Tipos de Tipografía Disponibles
El sistema maneja **3 tipos de tipografía**:
- **`body`** - Textos generales y contenido
- **`heading`** - Títulos y encabezados
- **`menu`** - Elementos de navegación (raramente usado en módulos)

### 8.1 IDENTIFICAR QUÉ TIPO USAR

**Usar `heading`** para:
- Elementos `<h1>`, `<h2>`, `<h3>`, etc.
- Títulos principales de secciones
- Títulos de cards o elementos destacados
- Cualquier texto que funcione como título

**Usar `body`** para:
- Párrafos `<p>`
- Descripciones
- Contenido de cards
- Textos de botones
- Labels y textos secundarios
- TODO lo que no sea título

### 8.2 OBTENER TIPOGRAFÍA DEL SISTEMA

```javascript
// En función render del módulo
const headingTypography = currentGlobalThemeSettings?.typography?.heading || {};
const bodyTypography = currentGlobalThemeSettings?.typography?.body || {};

// Convertir valores a nombres de fuente reales
const headingFont = window.getFontNameFromValueSafe ? 
    window.getFontNameFromValueSafe(headingTypography.font || 'helvetica') : 
    'Helvetica';

const bodyFont = window.getFontNameFromValueSafe ? 
    window.getFontNameFromValueSafe(bodyTypography.font || 'roboto') : 
    'Roboto';
```

### 8.3 APLICAR TIPOGRAFÍA COMPLETA

**Para títulos (heading)**:
```javascript
<h2 style="
    font-family: ${headingFont}, serif;
    font-size: ${headingTypography.fontSize || '36px'};
    ${headingTypography.uppercase ? 'text-transform: uppercase;' : ''}
    letter-spacing: ${headingTypography.letterSpacing || '0px'};
    font-weight: 600;
    color: ${schemeColors.text};
">${config.title}</h2>
```

**Para contenido (body)**:
```javascript
<p style="
    font-family: ${bodyFont}, sans-serif;
    font-size: ${bodyTypography.fontSize || '16px'};
    ${bodyTypography.uppercase ? 'text-transform: uppercase;' : ''}
    letter-spacing: ${bodyTypography.letterSpacing || '0px'};
    line-height: 1.5;
    color: ${schemeColors.text};
    opacity: 0.8;
">${config.description}</p>
```

### 8.4 TAMAÑOS PROPORCIONALES

Para textos secundarios o variaciones:
```javascript
// Subtítulos (60% del heading)
const headingSize = parseInt(headingTypography.fontSize || '36');
const subheadingSize = Math.round(headingSize * 0.6) + 'px';

// Texto pequeño (80% del body)
const bodySize = parseInt(bodyTypography.fontSize || '16');
const smallTextSize = Math.round(bodySize * 0.8) + 'px';

// Texto grande (120% del body)
const largeTextSize = Math.round(bodySize * 1.2) + 'px';
```

### 8.5 EJEMPLO COMPLETO - MÓDULO CON TIPOGRAFÍA

```javascript
render: function(config) {
    if (!config || config.isHidden) return '';
    
    // Color scheme
    const schemeColors = getColorSchemeValues(config.colorScheme || 'scheme1');
    
    // Tipografía
    const headingTypography = currentGlobalThemeSettings?.typography?.heading || {};
    const bodyTypography = currentGlobalThemeSettings?.typography?.body || {};
    
    const headingFont = window.getFontNameFromValueSafe ? 
        window.getFontNameFromValueSafe(headingTypography.font || 'helvetica') : 
        'Helvetica';
    
    const bodyFont = window.getFontNameFromValueSafe ? 
        window.getFontNameFromValueSafe(bodyTypography.font || 'roboto') : 
        'Roboto';
    
    return `
        <div class="module-container" style="background: ${schemeColors.background};">
            ${config.title ? `
                <h2 style="
                    font-family: ${headingFont}, serif;
                    font-size: ${headingTypography.fontSize || '36px'};
                    ${headingTypography.uppercase ? 'text-transform: uppercase;' : ''}
                    letter-spacing: ${headingTypography.letterSpacing || '0px'};
                    font-weight: 600;
                    color: ${schemeColors.text};
                    margin: 0 0 20px 0;
                ">${config.title}</h2>
            ` : ''}
            
            ${config.subtitle ? `
                <h3 style="
                    font-family: ${headingFont}, serif;
                    font-size: ${Math.round(parseInt(headingTypography.fontSize || '36') * 0.6)}px;
                    color: ${schemeColors.text};
                    opacity: 0.9;
                    margin: 0 0 15px 0;
                ">${config.subtitle}</h3>
            ` : ''}
            
            ${config.content ? `
                <p style="
                    font-family: ${bodyFont}, sans-serif;
                    font-size: ${bodyTypography.fontSize || '16px'};
                    ${bodyTypography.uppercase ? 'text-transform: uppercase;' : ''}
                    letter-spacing: ${bodyTypography.letterSpacing || '0px'};
                    line-height: 1.5;
                    color: ${schemeColors.text};
                    opacity: 0.8;
                ">${config.content}</p>
            ` : ''}
            
            ${config.buttonText ? `
                <button style="
                    font-family: ${bodyFont}, sans-serif;
                    font-size: ${bodyTypography.fontSize || '16px'};
                    ${bodyTypography.uppercase ? 'text-transform: uppercase;' : ''}
                    letter-spacing: ${bodyTypography.letterSpacing || '0px'};
                    background: ${schemeColors['solid-button'] || '#121212'};
                    color: ${schemeColors['solid-button-text'] || '#FFFFFF'};
                    padding: 12px 24px;
                    border: none;
                    border-radius: 4px;
                    cursor: pointer;
                ">${config.buttonText}</button>
            ` : ''}
        </div>
    `;
}
```

### 8.6 PROPIEDADES DE TIPOGRAFÍA

Cada tipo tiene estas propiedades:
```javascript
{
    font: 'roboto',           // Valor del selector
    fontSize: '16px',         // Tamaño de fuente
    uppercase: false,         // Texto en mayúsculas
    letterSpacing: '0px'      // Espaciado entre letras
}
```

### 8.7 CASOS ESPECIALES

**Announcement Bar**: Solo usa `body` (es contenido, no título)
**Slideshow**: Usa `heading` para títulos y `body` para descripciones
**Cards**: Título de card usa `heading`, contenido usa `body`
**Botones**: Siempre usan `body`

### Verificación del Punto #8
- [ ] Identificar correctamente heading vs body
- [ ] Obtener tipografía de currentGlobalThemeSettings
- [ ] Usar getFontNameFromValueSafe() para conversión
- [ ] Aplicar las 4 propiedades (font, size, uppercase, spacing)
- [ ] Tamaños proporcionales para variaciones
- [ ] Fallbacks por defecto (helvetica/roboto)
- [ ] Combinar con color scheme para color de texto

## PUNTO #9: RESPONSIVIDAD MÓVIL

### Concepto Crítico: ID Único
**SIEMPRE generar ID único para evitar conflictos de estilos**:
```javascript
const uniqueId = 'module-' + Date.now();
```

### 9.1 BREAKPOINTS ESTÁNDAR

```css
@media (max-width: 768px) { /* Tablet y móvil */ }
@media (max-width: 480px) { /* Móvil pequeño */ }
```

### 9.2 ESTRUCTURA BASE CON MEDIA QUERIES

```javascript
render: function(config) {
    const uniqueId = 'module-' + Date.now();
    
    return `
        <style>
            /* Estilos desktop aquí */
            
            /* Media queries para móvil */
            @media (max-width: 768px) {
                #${uniqueId} {
                    padding: 30px 0 !important; /* vs 60px desktop */
                }
                
                #${uniqueId} .container {
                    padding: 0 15px !important;
                }
                
                #${uniqueId} h2 {
                    font-size: 24px !important; /* vs 36px desktop */
                    margin-bottom: 15px !important;
                    line-height: 1.3 !important;
                }
                
                #${uniqueId} p {
                    font-size: 14px !important; /* vs 16px desktop */
                    margin-bottom: 20px !important;
                    line-height: 1.4 !important;
                }
                
                #${uniqueId} .icon {
                    font-size: 36px !important; /* vs 48px desktop */
                }
            }
            
            @media (max-width: 480px) {
                #${uniqueId} .container {
                    padding: 0 10px !important;
                }
                
                #${uniqueId} h2 {
                    font-size: 20px !important;
                }
                
                #${uniqueId} p {
                    font-size: 13px !important;
                }
            }
        </style>
        
        <div id="${uniqueId}" class="module-wrapper">
            <!-- Contenido del módulo -->
        </div>
    `;
}
```

### 9.3 CONFIGURACIÓN DE LAYOUT MÓVIL

Si tu módulo tiene elementos múltiples (cards, columnas):

```javascript
// En renderSettings
<div class="settings-field">
    <label>
        <span data-i18n="module.fields.mobileLayout">Layout móvil</span>
    </label>
    <select id="module-mobile-layout" class="shopify-select">
        <option value="1column" ${config.mobileLayout === '1column' ? 'selected' : ''}>1 columna</option>
        <option value="carousel" ${config.mobileLayout === 'carousel' ? 'selected' : ''}>Carousel</option>
        <option value="2columns" ${config.mobileLayout === '2columns' ? 'selected' : ''}>2 columnas</option>
    </select>
</div>

// Espaciado móvil
<div class="settings-field">
    <label>Espacio entre elementos (móvil)</label>
    <input type="range" id="mobile-space" min="8" max="32" value="${config.mobileSpacing || 16}">
</div>
```

### 9.4 IMPLEMENTAR CAROUSEL MÓVIL

```javascript
// En los estilos
@media (max-width: 768px) {
    #${uniqueId} .grid {
        ${mobileLayout === 'carousel' ? `
            display: flex !important;
            overflow-x: auto !important;
            scroll-snap-type: x mandatory !important;
            -webkit-overflow-scrolling: touch !important;
            gap: ${mobileSpacing}px !important;
            padding-bottom: 10px !important;
        ` : mobileLayout === '2columns' ? `
            grid-template-columns: repeat(2, 1fr) !important;
            gap: ${mobileSpacing}px !important;
        ` : `
            grid-template-columns: 1fr !important;
            gap: ${mobileSpacing}px !important;
        `}
    }
    
    ${mobileLayout === 'carousel' ? `
        #${uniqueId} .grid-item {
            flex: 0 0 85% !important;
            scroll-snap-align: start !important;
        }
        
        /* Scrollbar personalizado */
        #${uniqueId} .grid::-webkit-scrollbar {
            height: 6px;
        }
        
        #${uniqueId} .grid::-webkit-scrollbar-thumb {
            background: rgba(0,0,0,0.2);
            border-radius: 3px;
        }
    ` : ''}
}
```

### 9.5 AJUSTES DE TIPOGRAFÍA MÓVIL

**Tamaños recomendados**:
- Títulos H1: `28px` móvil vs `48px` desktop
- Títulos H2: `24px` móvil vs `36px` desktop  
- Títulos H3: `20px` móvil vs `28px` desktop
- Párrafos: `14px` móvil vs `16px` desktop
- Texto pequeño: `12px` móvil vs `14px` desktop

### 9.6 EJEMPLO COMPLETO - MÓDULO RESPONSIVO

```javascript
render: function(config) {
    const uniqueId = 'module-' + Date.now();
    const mobileLayout = config.mobileLayout || '1column';
    const mobileSpacing = config.mobileSpacing || 16;
    
    return `
        <style>
            #${uniqueId} {
                padding: ${config.topPadding || 60}px 0 ${config.bottomPadding || 60}px;
            }
            
            #${uniqueId} .grid {
                display: grid;
                grid-template-columns: repeat(${config.columns || 3}, 1fr);
                gap: ${config.spacing || 24}px;
            }
            
            @media (max-width: 768px) {
                #${uniqueId} {
                    padding: 30px 0 !important;
                }
                
                #${uniqueId} .grid {
                    ${mobileLayout === 'carousel' ? `
                        display: flex !important;
                        overflow-x: auto !important;
                        scroll-snap-type: x mandatory !important;
                        -webkit-overflow-scrolling: touch !important;
                    ` : mobileLayout === '2columns' ? `
                        grid-template-columns: repeat(2, 1fr) !important;
                    ` : `
                        grid-template-columns: 1fr !important;
                    `}
                    gap: ${mobileSpacing}px !important;
                }
                
                ${mobileLayout === 'carousel' ? `
                    #${uniqueId} .grid-item {
                        flex: 0 0 85% !important;
                        scroll-snap-align: start !important;
                    }
                ` : ''}
                
                #${uniqueId} h2 {
                    font-size: 24px !important;
                }
                
                #${uniqueId} p {
                    font-size: 14px !important;
                }
            }
            
            @media (max-width: 480px) {
                #${uniqueId} .grid {
                    grid-template-columns: 1fr !important;
                }
                
                #${uniqueId} h2 {
                    font-size: 20px !important;
                }
            }
        </style>
        
        <div id="${uniqueId}">
            <!-- Contenido -->
        </div>
    `;
}
```

### 9.7 PUNTOS CRÍTICOS

1. **ID único**: Sin esto, los estilos afectan todas las instancias
2. **!important**: Necesario para sobrescribir Materialize/otros CSS
3. **Padding contenedor**: Reducir en móvil (30px vs 60px)
4. **Line-height**: Reducir para mejor legibilidad móvil
5. **Carousel**: Mostrar 85% para indicar más contenido

### Verificación del Punto #9
- [ ] ID único generado con Date.now()
- [ ] Media queries para 768px y 480px
- [ ] Configuración de mobile layout en settings
- [ ] Reducción de tamaños de fuente
- [ ] Ajuste de padding/márgenes
- [ ] Carousel móvil si aplica
- [ ] Scrollbar personalizado para carousel
- [ ] Test con ícono preview móvil

## PUNTO #10: PREVIEW REAL (ÍCONO DEL OJO)

### Para que tu módulo aparezca en el preview real necesitas:

### 10.1 CARGAR EL SCRIPT EN 3 ARCHIVOS

**Los mismos 3 archivos del Punto #1**:
1. `/Views/WebsiteBuilder/Index.cshtml`
2. `/Views/WebsiteBuilder/PreviewTemplate.cshtml`  
3. `/Views/WebsiteBuilder/Preview.cshtml`

```html
<!-- En cada archivo, después de website-render-functions.js -->
<script src="~/js/website-builder/modules/nombre-modulo.js?v=@DateTime.Now.Ticks"></script>
```

### 10.2 AGREGAR CASO EN renderPreviewContent

**Archivo**: `/Views/WebsiteBuilder/Preview.cshtml`
**Ubicación**: Dentro de la función `renderPreviewContent()`, alrededor de línea 500

```javascript
// Buscar donde están los otros casos (announcement, header, slideshow, multicolumn)
else if (sectionId === 'nombreModulo') {
    const nombreModuloConfig = currentSectionsConfig.nombreModulo;
    if (nombreModuloConfig && !nombreModuloConfig.isHidden) {
        // Usar el módulo si existe
        if (window.WebsiteBuilderModules && 
            window.WebsiteBuilderModules.NombreModulo && 
            window.WebsiteBuilderModules.NombreModulo.render) {
            finalHtml += window.WebsiteBuilderModules.NombreModulo.render(nombreModuloConfig);
        } else {
            // Fallback si tienes función legacy
            if (typeof renderNombreModulo === 'function') {
                finalHtml += renderNombreModulo(nombreModuloConfig);
            }
        }
    }
}
```

### 10.3 VERIFICAR QUE RENDER DEVUELVE STRING

**En tu módulo**:
```javascript
window.WebsiteBuilderModules.NombreModulo = {
    render: function(config) {
        // CRÍTICO: Debe devolver un string HTML
        if (!config || config.isHidden) return ''; // Devuelve string vacío
        
        // Tu lógica...
        
        return `<div>...</div>`; // SIEMPRE devolver string
    }
};
```

### 10.4 ESTRUCTURA CORRECTA PARA PREVIEW

Tu función render debe incluir:
```javascript
render: function(config) {
    if (!config || config.isHidden) return '';
    
    // NO incluir section-header-tag (pestañas azules) en preview real
    const isInEditor = (typeof window !== 'undefined' && 
                       window.parent !== window && 
                       window.parent.document && 
                       window.parent.document.getElementById('preview-iframe'));
    
    return `
        <div class="section-wrapper" data-section-id="nombreModulo">
            ${isInEditor ? `
                <div class="section-header-tag">
                    <span class="material-symbols-outlined">icon</span>
                    Nombre Módulo
                </div>
            ` : ''}
            
            <!-- Contenido del módulo -->
        </div>
    `;
}
```

### 10.5 DEBUGGING SI NO APARECE

Si tu módulo no aparece en el preview real, agrega estos logs:

```javascript
// En renderPreviewContent (Preview.cshtml)
console.log('[PREVIEW] Processing:', sectionId);
console.log('[PREVIEW] Config exists:', !!currentSectionsConfig.nombreModulo);
console.log('[PREVIEW] Module exists:', !!window.WebsiteBuilderModules?.NombreModulo);
console.log('[PREVIEW] Render exists:', !!window.WebsiteBuilderModules?.NombreModulo?.render);
```

### 10.6 VERIFICACIÓN COMPLETA

1. **En el editor**: Agregar módulo desde el modal
2. **En iframe del editor**: Debe aparecer con pestaña azul
3. **Click ícono del ojo**: Abre preview en nueva pestaña
4. **En preview real**: Debe aparecer SIN pestaña azul
5. **Consola**: No debe haber errores 404 ni undefined

### 10.7 ORDEN DE APARICIÓN

Los módulos aparecen según `currentSectionsConfig.sectionOrder`:
- Si tu módulo no está en este array, no aparecerá
- El orden del array determina el orden visual
- Se agrega automáticamente al usar el modal (Punto #2)

### Verificación del Punto #10
- [ ] Script cargado en los 3 archivos .cshtml
- [ ] Caso agregado en renderPreviewContent
- [ ] sectionId coincide exactamente ('nombreModulo')
- [ ] render() devuelve string HTML
- [ ] Manejo de isHidden
- [ ] NO mostrar section-header-tag en preview real
- [ ] Verificar en consola que módulo existe
- [ ] Probar con ícono del ojo