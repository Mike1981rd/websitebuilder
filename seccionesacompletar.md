# Plan de Implementación - Secciones a Completar

## 🎯 Objetivo Principal
Clonar la página web del Hotel Hodelpa Gran Almirante (https://www.hodelpa.com/es/gran-almirante) utilizando los módulos existentes del Website Builder, con mejoras específicas en Gallery y Multicolumn para lograr una réplica completa.

## 🏨 Análisis de la Página Hodelpa Gran Almirante

### Estructura de Secciones Identificadas:

#### 1. **Header con Navegación** ✅
- Logo del hotel a la izquierda
- Menú de navegación con dropdowns:
  - Habitaciones
  - Facilidades 
  - Eventos
  - Galería
  - Acerca de Nosotros
- Selector de idioma (ES)
- Iconos de contacto y redes sociales
- **Módulo a usar**: Header (completamente compatible)

#### 2. **Hero Section - #TuCasaEnSantiago** ✅
- Imagen de fondo grande
- Texto overlay con tagline "#TuCasaEnSantiago"
- Descripción breve de la experiencia del hotel
- Botón call-to-action
- **Módulo a usar**: Image with Text o Slideshow

#### 3. **Sección de Ofertas/Destacados** ✅
- Grid de 6 cards con ofertas especiales:
  - Descuento en masajes
  - Promociones del restaurante
  - Descuento TGI Fridays
  - Cigar lounge
  - Transporte al aeropuerto
  - Club Imperial
- Cada card tiene imagen, título y descripción
- **Módulo a usar**: Multicolumn o Featured Collection

#### 4. **Certificaciones y Premios** ⚠️
- Grid de logos de partners y certificaciones:
  - TripAdvisor
  - Booking.com
  - Expedia
  - Hotels.com
  - Certificaciones de calidad
- Logos en escala de grises con hover a color
- **Módulo a usar**: Gallery (requiere modo logos)

#### 5. **Servicios y Amenidades Detalladas** ⚠️
- Cards con información de servicios:
  - Piscina en rooftop
  - Restaurante con descuentos
  - Gimnasio
  - Salones de eventos
- Badges con promociones ("10% descuento")
- Iconos descriptivos
- **Módulo a usar**: Multicolumn (requiere modo service cards)

#### 6. **Testimonios de Clientes** ✅
- Reviews de TripAdvisor
- Calificación de 5 estrellas
- Comentarios cortos de huéspedes
- **Módulo a usar**: Testimonials

#### 7. **Galería de Imágenes** ✅
- Grid de fotos del hotel
- Vista expandible
- **Módulo a usar**: Gallery

#### 8. **Footer Completo** ✅
- Newsletter signup
- Links rápidos organizados en columnas
- Información de contacto
- Enlaces a redes sociales
- Copyright y avisos legales
- **Módulo a usar**: Footer

### Funcionalidades No Disponibles ❌:
1. ~~**Widget de reservas integrado**~~ ✅ **SOLUCIONADO**: No necesitamos widget externo. Featured Collection ya tiene botón "Reservar" que lleva al checkout con opción de fechas. Las páginas individuales de productos también tienen esta funcionalidad implementada.
2. **Feed de redes sociales en vivo** - Instagram/Facebook feed
3. **Chat de WhatsApp flotante** - Botón de chat persistente
4. **Menús dropdown complejos** - Submenús elaborados en navegación

### 📌 Aclaración Importante sobre el Objetivo:
**El objetivo es clonar la ESTRUCTURA y DISEÑO de la página Hodelpa**, no su contenido específico. Nuestro hotel tendrá:
- Sus propios colores corporativos (configurables via color schemes)
- Su propio logo e identidad visual
- Sus propias imágenes de habitaciones, servicios y facilidades
- Su propio contenido de texto y ofertas

Lo que buscamos replicar es:
- La distribución profesional de las secciones
- La jerarquía visual atractiva
- Los patrones de diseño modernos (cards, grids, badges)
- La experiencia de usuario fluida
- El aspecto premium y profesional

### Resumen de Compatibilidad:
- **Secciones completamente replicables**: 7/8 (87.5%) - incluyendo reservaciones
- **Secciones parcialmente replicables**: 2/8 (25%) - certificaciones y servicios
- **Con las mejoras propuestas**: 8/8 (100% del contenido estático y funcionalidad de reservas)

## 🎯 Objetivo Específico
Mejorar los módulos Gallery y Multicolumn para poder replicar la estructura y diseño profesional de la página Hodelpa, permitiendo que cualquier hotel pueda crear una presencia web de igual calidad pero con su propia identidad visual.

## 📋 Resumen Ejecutivo

### Gallery - Modo Logos
- **Objetivo**: Crear un modo especializado para mostrar logos de certificaciones, partners y premios
- **Tiempo estimado**: 3-4 horas
- **Prioridad**: Alta
- **Complejidad**: Media

### Multicolumn - Service Cards
- **Objetivo**: Transformar multicolumn en un sistema versátil de cards para servicios
- **Tiempo estimado**: 4-5 horas  
- **Prioridad**: Alta
- **Complejidad**: Media-Alta

---

## 🔧 IMPLEMENTACIÓN 1: Gallery - Modo Logos

### A. Campos a Agregar en Vista de Configuración

#### 1. Display Mode (Principal)
```javascript
// Ubicación: renderSettings() de gallery.js
<div class="settings-field">
    <label data-i18n="gallery.displayMode">Display mode</label>
    <select class="shopify-select" id="gallery-display-mode">
        <option value="gallery">Gallery (default)</option>
        <option value="logo-grid">Logo Grid</option>
        <option value="masonry">Masonry</option>
    </select>
</div>
```

#### 2. Logo Grid Settings (Condicional)
```javascript
// Solo visible cuando displayMode === 'logo-grid'
<div id="logo-grid-settings" style="display: none;">
    <!-- Logo Size -->
    <div class="settings-field">
        <label data-i18n="gallery.logoSize">Logo size</label>
        <select class="shopify-select" id="gallery-logo-size">
            <option value="small">Small (80x60px)</option>
            <option value="medium">Medium (120x80px)</option>
            <option value="large">Large (160x100px)</option>
            <option value="custom">Custom</option>
        </select>
    </div>

    <!-- Custom Size Fields -->
    <div id="custom-logo-size" style="display: none;">
        <div class="settings-field">
            <label data-i18n="gallery.logoWidth">Logo width (px)</label>
            <input type="number" id="gallery-logo-width" min="50" max="300" value="120">
        </div>
        <div class="settings-field">
            <label data-i18n="gallery.logoHeight">Logo height (px)</label>
            <input type="number" id="gallery-logo-height" min="40" max="200" value="80">
        </div>
    </div>

    <!-- Gap -->
    <div class="settings-field">
        <label data-i18n="gallery.logoGap">Gap between logos</label>
        <input type="range" id="gallery-logo-gap" min="10" max="50" value="20">
        <span class="range-value">20px</span>
    </div>

    <!-- Columns -->
    <div class="settings-field">
        <label data-i18n="gallery.columns.desktop">Desktop columns</label>
        <select class="shopify-select" id="gallery-desktop-columns">
            <option value="4">4</option>
            <option value="5">5</option>
            <option value="6" selected>6</option>
            <option value="7">7</option>
            <option value="8">8</option>
        </select>
    </div>

    <!-- Style Options -->
    <div class="settings-field">
        <label class="toggle-field">
            <span data-i18n="gallery.grayscaleFilter">Grayscale filter (color on hover)</span>
            <input type="checkbox" class="shopify-toggle" id="gallery-grayscale-filter">
            <label for="gallery-grayscale-filter" class="toggle-slider"></label>
        </label>
    </div>

    <!-- Hover Effect -->
    <div class="settings-field">
        <label data-i18n="gallery.hoverEffect">Hover effect</label>
        <select class="shopify-select" id="gallery-hover-effect">
            <option value="none">None</option>
            <option value="color">Show color (from grayscale)</option>
            <option value="zoom">Slight zoom</option>
            <option value="shadow">Soft shadow</option>
        </select>
    </div>
</div>
```

### B. Modificaciones en el Render

#### 1. CSS Dinámico para Logo Grid
```javascript
// En render() de gallery.js
if (config.displayMode === 'logo-grid') {
    const logoSize = config.logoSize || 'medium';
    const logoWidth = logoSize === 'custom' ? config.logoWidth : 
                     logoSize === 'small' ? 80 : 
                     logoSize === 'large' ? 160 : 120;
    const logoHeight = logoSize === 'custom' ? config.logoHeight :
                      logoSize === 'small' ? 60 :
                      logoSize === 'large' ? 100 : 80;
    
    html += `
        <style>
            #${uniqueId} .logo-grid {
                display: grid;
                grid-template-columns: repeat(${config.desktopColumns || 6}, 1fr);
                gap: ${config.logoGap || 20}px;
                padding: 40px 20px;
            }
            
            #${uniqueId} .logo-item {
                display: flex;
                align-items: center;
                justify-content: center;
                background: #fafafa;
                border-radius: 8px;
                padding: 10px;
                transition: all 0.3s ease;
                ${config.addBorder ? 'border: 1px solid #e0e0e0;' : ''}
            }
            
            #${uniqueId} .logo-item img {
                max-width: ${logoWidth}px;
                max-height: ${logoHeight}px;
                width: auto;
                height: auto;
                object-fit: contain;
                ${config.grayscaleFilter ? 'filter: grayscale(100%);' : ''}
                transition: all 0.3s ease;
            }
            
            ${config.grayscaleFilter ? `
                #${uniqueId} .logo-item:hover img {
                    filter: grayscale(0%);
                }
            ` : ''}
            
            ${config.hoverEffect === 'zoom' ? `
                #${uniqueId} .logo-item:hover {
                    transform: scale(1.05);
                }
            ` : ''}
            
            ${config.hoverEffect === 'shadow' ? `
                #${uniqueId} .logo-item:hover {
                    box-shadow: 0 5px 20px rgba(0,0,0,0.1);
                }
            ` : ''}
            
            @media (max-width: 768px) {
                #${uniqueId} .logo-grid {
                    grid-template-columns: repeat(${config.mobileColumns || 3}, 1fr);
                    gap: 15px;
                }
            }
        </style>
    `;
}
```

#### 2. HTML para Logo Grid
```javascript
// En render() cuando displayMode === 'logo-grid'
html += `<div class="logo-grid">`;
visibleImages.forEach(imageId => {
    const image = config.images[imageId];
    if (image && !image.isHidden) {
        const linkOpen = image.logoUrl ? `<a href="${image.logoUrl}" target="${config.openInNewTab ? '_blank' : '_self'}">` : '';
        const linkClose = image.logoUrl ? '</a>' : '';
        
        html += `
            ${linkOpen}
            <div class="logo-item" ${config.showTitleOnHover ? `title="${image.altText || ''}"` : ''}>
                <img src="${image.url}" alt="${image.altText || ''}" loading="lazy">
            </div>
            ${linkClose}
        `;
    }
});
html += `</div>`;
```

### C. Event Listeners

```javascript
// En attachEventListeners() de gallery.js

// Display Mode Change
$('#gallery-display-mode').off('change').on('change', function() {
    const mode = $(this).val();
    updateConfig('displayMode', mode);
    
    // Show/hide logo grid settings
    if (mode === 'logo-grid') {
        $('#logo-grid-settings').slideDown(200);
    } else {
        $('#logo-grid-settings').slideUp(200);
    }
});

// Logo Size Change
$('#gallery-logo-size').off('change').on('change', function() {
    const size = $(this).val();
    updateConfig('logoSize', size);
    
    if (size === 'custom') {
        $('#custom-logo-size').slideDown(200);
    } else {
        $('#custom-logo-size').slideUp(200);
    }
});

// Gap Slider
$('#gallery-logo-gap').off('input').on('input', function() {
    const value = $(this).val();
    $(this).next('.range-value').text(value + 'px');
    updateConfig('logoGap', parseInt(value));
});
```

### D. Campos adicionales por imagen

```javascript
// En renderImageSettings() cuando displayMode === 'logo-grid'
if (window.currentSectionsConfig.gallery?.displayMode === 'logo-grid') {
    settingsHtml += `
        <div class="settings-field">
            <label data-i18n="gallery.image.logoUrl">Logo link URL</label>
            <input type="url" 
                   class="gallery-image-logo-url" 
                   data-image-id="${image.id}"
                   value="${image.logoUrl || ''}"
                   placeholder="https://...">
        </div>
        
        <div class="settings-field">
            <label data-i18n="gallery.image.altText">Logo alt text</label>
            <input type="text" 
                   class="gallery-image-alt-text" 
                   data-image-id="${image.id}"
                   value="${image.altText || ''}"
                   placeholder="Company name">
        </div>
    `;
}
```

---

## 🔧 IMPLEMENTACIÓN 2: Multicolumn - Service Cards

### A. Campos a Agregar en Vista de Configuración

#### 1. Card Style (Principal)
```javascript
// En renderAppearanceSettings() de multicolumn.js
<div class="settings-field">
    <label data-i18n="multicolumn.cardStyle">Card style</label>
    <select class="shopify-select" id="multicolumn-card-style">
        <option value="basic">Basic (default)</option>
        <option value="service-cards">Service Cards</option>
        <option value="feature-cards">Feature Cards</option>
        <option value="icon-cards">Icon Cards</option>
    </select>
</div>
```

#### 2. Service Card Settings (Condicional)
```javascript
// Solo visible cuando cardStyle === 'service-cards'
<div id="service-card-settings" style="display: none;">
    <!-- Card Height -->
    <div class="settings-field">
        <label data-i18n="multicolumn.cardHeight">Card height</label>
        <select class="shopify-select" id="multicolumn-card-height">
            <option value="auto">Auto</option>
            <option value="uniform">Uniform (match tallest)</option>
            <option value="fixed">Fixed height</option>
        </select>
    </div>

    <!-- Fixed Height Input -->
    <div id="fixed-height-input" style="display: none;">
        <div class="settings-field">
            <label data-i18n="multicolumn.fixedHeight">Fixed height (px)</label>
            <input type="number" id="multicolumn-fixed-height" min="200" max="600" value="350">
        </div>
    </div>

    <!-- Card Hover Effect -->
    <div class="settings-field">
        <label data-i18n="multicolumn.cardHoverEffect">Card hover effect</label>
        <select class="shopify-select" id="multicolumn-card-hover">
            <option value="none">None</option>
            <option value="lift">Lift shadow</option>
            <option value="zoom-image">Zoom image</option>
            <option value="darken">Darken overlay</option>
        </select>
    </div>

    <!-- Badge Settings -->
    <div class="settings-field">
        <label class="toggle-field">
            <span data-i18n="multicolumn.enableBadges">Enable badges</span>
            <input type="checkbox" class="shopify-toggle" id="multicolumn-enable-badges">
            <label for="multicolumn-enable-badges" class="toggle-slider"></label>
        </label>
    </div>

    <div id="badge-settings" style="display: none;">
        <div class="settings-field">
            <label data-i18n="multicolumn.badgePosition">Badge position</label>
            <select class="shopify-select" id="multicolumn-badge-position">
                <option value="top-left">Top left</option>
                <option value="top-right">Top right</option>
                <option value="bottom-left">Bottom left</option>
                <option value="bottom-right">Bottom right</option>
            </select>
        </div>

        <div class="settings-field">
            <label data-i18n="multicolumn.badgeStyle">Badge style</label>
            <select class="shopify-select" id="multicolumn-badge-style">
                <option value="solid">Solid color</option>
                <option value="gradient">Gradient</option>
                <option value="outline">Outline</option>
            </select>
        </div>
    </div>
</div>
```

### B. Modificaciones por Columna

```javascript
// En renderColumnSettings() añadir:

// Badge Section
if (window.currentSectionsConfig.multicolumn?.cardStyle === 'service-cards' && 
    window.currentSectionsConfig.multicolumn?.enableBadges) {
    html += `
        <div class="settings-group">
            <h4 style="font-size: 13px; font-weight: 500; color: #5c5e60;">Badge</h4>
            
            <div class="settings-field">
                <label data-i18n="multicolumn.column.badgeText">Badge text</label>
                <input type="text" 
                       id="column-badge-text-${column.id}"
                       value="${column.badgeText || ''}"
                       placeholder="10% OFF">
            </div>
            
            <div class="settings-field">
                <label data-i18n="multicolumn.column.badgeColor">Badge color</label>
                <input type="color" 
                       id="column-badge-color-${column.id}"
                       value="${column.badgeColor || '#ff0000'}">
            </div>
        </div>
    `;
}

// Icon Section
html += `
    <div class="settings-group">
        <h4 style="font-size: 13px; font-weight: 500; color: #5c5e60;">Icon</h4>
        
        <div class="settings-field">
            <label class="toggle-field">
                <span data-i18n="multicolumn.column.showIcon">Show icon</span>
                <input type="checkbox" 
                       class="shopify-toggle" 
                       id="column-show-icon-${column.id}"
                       ${column.showIcon ? 'checked' : ''}>
                <label for="column-show-icon-${column.id}" class="toggle-slider"></label>
            </label>
        </div>
        
        <div id="icon-settings-${column.id}" style="${column.showIcon ? '' : 'display: none;'}">
            <div class="settings-field">
                <label data-i18n="multicolumn.column.icon">Icon</label>
                <select class="shopify-select" id="column-icon-${column.id}">
                    <option value="star">Star</option>
                    <option value="check_circle">Check Circle</option>
                    <option value="local_offer">Tag/Offer</option>
                    <option value="hotel">Hotel</option>
                    <option value="restaurant">Restaurant</option>
                    <option value="pool">Pool</option>
                    <option value="spa">Spa</option>
                    <option value="fitness_center">Gym</option>
                    <option value="wifi">WiFi</option>
                    <option value="local_parking">Parking</option>
                </select>
            </div>
        </div>
    </div>
`;

// Enhanced Content
html += `
    <div class="settings-group">
        <h4 style="font-size: 13px; font-weight: 500; color: #5c5e60;">Enhanced Content</h4>
        
        <div class="settings-field">
            <label data-i18n="multicolumn.column.subtitle">Subtitle</label>
            <input type="text" 
                   id="column-subtitle-${column.id}"
                   value="${column.subtitle || ''}"
                   placeholder="Additional descriptive text">
        </div>
        
        <div class="settings-field">
            <label data-i18n="multicolumn.column.buttonText">Button text</label>
            <input type="text" 
                   id="column-button-text-${column.id}"
                   value="${column.buttonText || ''}"
                   placeholder="Learn more">
        </div>
        
        <div class="settings-field">
            <label data-i18n="multicolumn.column.buttonUrl">Button URL</label>
            <input type="url" 
                   id="column-button-url-${column.id}"
                   value="${column.buttonUrl || ''}"
                   placeholder="https://...">
        </div>
        
        <div class="settings-field">
            <label data-i18n="multicolumn.column.buttonStyle">Button style</label>
            <select class="shopify-select" id="column-button-style-${column.id}">
                <option value="link">Link</option>
                <option value="outline">Outline</option>
                <option value="solid">Solid</option>
            </select>
        </div>
    </div>
`;
```

### C. CSS para Service Cards

```javascript
// En render() cuando cardStyle === 'service-cards'
const cardHeight = config.cardHeight || 'auto';
const fixedHeight = config.fixedHeight || 350;

html += `
    <style>
        #${uniqueId} .service-card {
            position: relative;
            background: white;
            border-radius: 12px;
            overflow: hidden;
            box-shadow: 0 2px 10px rgba(0,0,0,0.08);
            transition: all 0.3s ease;
            ${cardHeight === 'fixed' ? `height: ${fixedHeight}px;` : ''}
            ${cardHeight === 'uniform' ? 'height: 100%;' : ''}
        }
        
        ${config.cardHoverEffect === 'lift' ? `
            #${uniqueId} .service-card:hover {
                transform: translateY(-5px);
                box-shadow: 0 5px 25px rgba(0,0,0,0.15);
            }
        ` : ''}
        
        ${config.cardHoverEffect === 'zoom-image' ? `
            #${uniqueId} .service-card .card-image img {
                transition: transform 0.3s ease;
            }
            #${uniqueId} .service-card:hover .card-image img {
                transform: scale(1.1);
            }
        ` : ''}
        
        #${uniqueId} .card-badge {
            position: absolute;
            ${config.badgePosition === 'top-left' ? 'top: 15px; left: 15px;' : ''}
            ${config.badgePosition === 'top-right' ? 'top: 15px; right: 15px;' : ''}
            ${config.badgePosition === 'bottom-left' ? 'bottom: 15px; left: 15px;' : ''}
            ${config.badgePosition === 'bottom-right' ? 'bottom: 15px; right: 15px;' : ''}
            padding: 5px 15px;
            border-radius: 20px;
            font-size: 12px;
            font-weight: 600;
            z-index: 2;
            ${config.badgeStyle === 'solid' ? `
                background: var(--badge-color);
                color: var(--badge-text-color);
            ` : ''}
            ${config.badgeStyle === 'outline' ? `
                background: white;
                border: 2px solid var(--badge-color);
                color: var(--badge-color);
            ` : ''}
            ${config.badgeStyle === 'gradient' ? `
                background: linear-gradient(135deg, var(--badge-color), var(--badge-color-dark));
                color: white;
            ` : ''}
        }
        
        #${uniqueId} .card-icon {
            display: inline-flex;
            align-items: center;
            justify-content: center;
            width: 40px;
            height: 40px;
            background: rgba(var(--primary-rgb), 0.1);
            border-radius: 50%;
            margin-bottom: 10px;
        }
        
        #${uniqueId} .card-content {
            padding: 20px;
        }
        
        #${uniqueId} .card-subtitle {
            font-size: 14px;
            color: #666;
            margin-top: 5px;
        }
        
        #${uniqueId} .card-button {
            margin-top: 15px;
            display: inline-block;
            padding: 8px 20px;
            border-radius: 20px;
            text-decoration: none;
            font-size: 14px;
            transition: all 0.3s ease;
        }
        
        #${uniqueId} .card-button.style-link {
            color: var(--primary);
            text-decoration: underline;
        }
        
        #${uniqueId} .card-button.style-outline {
            border: 1px solid var(--primary);
            color: var(--primary);
        }
        
        #${uniqueId} .card-button.style-solid {
            background: var(--primary);
            color: white;
        }
    </style>
`;
```

### D. HTML para Service Cards

```javascript
// En renderColumn() cuando cardStyle === 'service-cards'
return `
    <div class="service-card">
        ${column.badgeText && config.enableBadges ? `
            <div class="card-badge" style="--badge-color: ${column.badgeColor || '#ff0000'}; --badge-text-color: ${column.badgeTextColor || '#ffffff'};">
                ${column.badgeText}
            </div>
        ` : ''}
        
        ${column.image ? `
            <div class="card-image">
                <img src="${column.image}" alt="${column.title || ''}">
            </div>
        ` : ''}
        
        <div class="card-content">
            ${column.showIcon && column.icon ? `
                <div class="card-icon">
                    <i class="material-icons" style="color: var(--primary);">${column.icon}</i>
                </div>
            ` : ''}
            
            ${column.title ? `<h3>${column.title}</h3>` : ''}
            ${column.subtitle ? `<p class="card-subtitle">${column.subtitle}</p>` : ''}
            ${column.content ? `<p>${column.content}</p>` : ''}
            
            ${column.buttonText && column.buttonUrl ? `
                <a href="${column.buttonUrl}" 
                   class="card-button style-${column.buttonStyle || 'link'}"
                   target="${config.openLinksInNewTab ? '_blank' : '_self'}">
                    ${column.buttonText}
                </a>
            ` : ''}
        </div>
    </div>
`;
```

---

## 📅 Cronograma de Implementación

### Fase 1: Gallery - Modo Logos (3-4 horas)
1. **Hora 1**: Implementar campos en vista de configuración
2. **Hora 2**: Crear lógica de renderizado para logo grid
3. **Hora 3**: Implementar event listeners y guardar configuración
4. **Hora 4**: Testing y ajustes de CSS responsive

### Fase 2: Multicolumn - Service Cards (4-5 horas)
1. **Hora 1**: Implementar selector de card style y settings condicionales
2. **Hora 2**: Agregar campos por columna (badges, icons, buttons)
3. **Hora 3**: Crear CSS y estructura HTML para service cards
4. **Hora 4**: Implementar event listeners y lógica de guardado
5. **Hora 5**: Testing completo y ajustes finales

---

## ⚠️ Consideraciones Importantes

### 1. Compatibilidad hacia atrás
- Los cambios deben ser **aditivos**, no modificar comportamiento existente
- Valores por defecto deben mantener la apariencia actual
- Verificar que galleries y multicolumns existentes sigan funcionando

### 2. Performance
- Lazy loading para imágenes en logo grid
- CSS optimizado sin selectores complejos
- Event listeners con namespaces para evitar conflictos

### 3. Responsive Design
- Logo grid debe adaptarse elegantemente en móviles
- Service cards deben ser totalmente responsive
- Probar en diferentes tamaños de pantalla

### 4. Accesibilidad
- Alt text obligatorio para logos
- Roles ARIA apropiados
- Navegación por teclado funcional

---

## ✅ Checklist de Verificación

### Gallery - Logo Grid
- [ ] Display mode selector funciona correctamente
- [ ] Settings condicionales se muestran/ocultan
- [ ] Logo grid se renderiza con tamaños correctos
- [ ] Grayscale filter funciona on hover
- [ ] Enlaces de logos abren correctamente
- [ ] Responsive en móviles (3 columnas)
- [ ] Se guarda y carga configuración correctamente

### Multicolumn - Service Cards
- [ ] Card style selector funciona
- [ ] Badges se muestran en posición correcta
- [ ] Iconos se renderizan correctamente
- [ ] Botones tienen estilos apropiados
- [ ] Card height uniform funciona
- [ ] Hover effects funcionan suavemente
- [ ] Responsive mantiene diseño coherente
- [ ] Todos los campos se guardan y cargan

---

## 🚀 Resultado Esperado

Al completar estas implementaciones, podremos replicar:

1. **Sección de Certificaciones**: Grid profesional de logos con efecto grayscale, perfecta para mostrar partners, certificaciones y premios

2. **Sección de Servicios**: Cards elegantes con badges promocionales, iconos descriptivos y call-to-actions, ideal para amenidades y servicios del hotel

Esto nos permitirá clonar el 95% de la página de Hodelpa Gran Almirante usando los módulos existentes mejorados.