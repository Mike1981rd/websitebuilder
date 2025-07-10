# Plan de Modularización - Website Builder

## 📋 Resumen Ejecutivo

Este documento describe la estrategia "Freeze & Modularize" para detener el crecimiento del archivo `website-builder.js` (actualmente 24,000+ líneas) y comenzar a desarrollar nuevos módulos de forma modular e independiente.

**Fecha de inicio**: Enero 2025  
**Módulo piloto**: Cart

---

## 🎯 Objetivos

1. **Detener el crecimiento** de website-builder.js
2. **Mantener la estabilidad** del código existente
3. **Facilitar el desarrollo** de nuevos módulos
4. **Mejorar la mantenibilidad** del proyecto
5. **Permitir transición gradual** sin riesgos

---

## 📂 Nueva Estructura de Archivos

```
/wwwroot/js/
├── website-builder.js              # 24,000 líneas - CONGELADO (solo se agrega loader)
├── website-builder-modules/        # Nueva carpeta para módulos
│   ├── cart.js                    # Módulo piloto
│   ├── product-grid.js            # Futuros módulos...
│   ├── testimonials.js
│   └── README.md                  # Documentación de la estructura
└── website-builder-loader.js      # (Opcional) Si el loader crece mucho
```

---

## 🏗️ Arquitectura del Sistema Modular

### 1. Estructura de un Módulo

Cada módulo es un archivo JavaScript independiente que sigue este patrón:

```javascript
// /wwwroot/js/website-builder-modules/[nombre-modulo].js
(function() {
    'use strict';
    
    // Asegurar namespace global
    window.WebsiteBuilderModules = window.WebsiteBuilderModules || {};
    
    window.WebsiteBuilderModules.NombreModulo = {
        // 1. Configuración del módulo
        config: {
            name: 'nombreModulo',           // ID único del módulo
            displayName: {                  // Nombres para mostrar
                es: 'Nombre en Español',
                en: 'Name in English'
            },
            icon: 'material_icon_name',     // Icono de Material Icons
            isFixed: false,                 // true = como header/footer, false = se puede agregar/quitar
            defaultSettings: {              // Configuración por defecto
                // propiedades del módulo
            }
        },
        
        // 2. Renderizar vista de configuración (panel lateral)
        renderSettings: function(data) {
            const currentLang = window.currentLanguage || 'es';
            const settings = data || this.config.defaultSettings;
            
            return `
                <div class="sidebar-back-header">
                    <button class="back-button" onclick="window.switchSidebarView('blockList')">
                        <i class="material-icons">arrow_back</i>
                    </button>
                    <h2 class="sidebar-title">${this.config.displayName[currentLang]}</h2>
                </div>
                <div class="settings-form">
                    <!-- HTML de configuración -->
                </div>
            `;
        },
        
        // 3. Renderizar en el preview (iframe central)
        renderPreview: function(settings) {
            return `
                <div class="${this.config.name}-section">
                    <!-- HTML para el preview -->
                </div>
            `;
        },
        
        // 4. Adjuntar event handlers
        attachEventHandlers: function() {
            // Event listeners específicos del módulo
            // Usar namespaces para evitar conflictos
            $(document).off(`change.${this.config.name}`).on(`change.${this.config.name}`, 
                `.${this.config.name}-setting`, (e) => {
                    this.handleSettingChange(e);
                });
        },
        
        // 5. Manejar cambios de configuración
        handleSettingChange: function(e) {
            // Lógica para manejar cambios
            window.hasPendingPageStructureChanges = true;
            window.updateSaveButtonState();
        },
        
        // 6. Guardar configuración
        saveSettings: function(settings) {
            if (!window.currentSectionsConfig) {
                window.currentSectionsConfig = {};
            }
            window.currentSectionsConfig[this.config.name] = settings;
            window.hasPendingPageStructureChanges = true;
        },
        
        // 7. Obtener configuración actual
        getCurrentSettings: function() {
            return window.currentSectionsConfig[this.config.name] || this.config.defaultSettings;
        }
    };
    
    // Auto-registrar el módulo cuando se carga el archivo
    if (window.registerWebsiteBuilderModule) {
        window.registerWebsiteBuilderModule(window.WebsiteBuilderModules.NombreModulo);
    }
})();
```

### 2. Sistema de Registro (Loader)

Este código se agrega UNA SOLA VEZ al final de `website-builder.js`:

```javascript
// ========== MODULAR SYSTEM LOADER - NO AGREGAR MÁS CÓDIGO DESPUÉS DE ESTO ==========
// Todos los nuevos módulos deben ir en archivos separados en /website-builder-modules/

window.WebsiteBuilderModules = window.WebsiteBuilderModules || {};
window.registeredModules = window.registeredModules || {};

window.registerWebsiteBuilderModule = function(module) {
    if (!module || !module.config || !module.config.name) {
        console.error('[MODULE LOADER] Invalid module registration:', module);
        return false;
    }
    
    const moduleName = module.config.name;
    
    // Prevenir registro duplicado
    if (window.registeredModules[moduleName]) {
        console.warn(`[MODULE LOADER] Module '${moduleName}' already registered`);
        return false;
    }
    
    // 1. Registrar traducciones
    if (module.config.displayName && translations) {
        Object.keys(module.config.displayName).forEach(lang => {
            if (translations[lang]) {
                translations[lang][`sections.${moduleName}`] = module.config.displayName[lang];
            }
        });
    }
    
    // 2. Extender switchSidebarView para manejar la vista del módulo
    const originalSwitchView = window.switchSidebarView;
    window.switchSidebarView = function(viewName, data) {
        if (viewName === `${moduleName}Settings`) {
            previousSidebarView = currentSidebarView;
            currentSidebarView = viewName;
            
            try {
                const html = module.renderSettings(data);
                $('#sidebar-dynamic-content').html(html);
                
                if (module.attachEventHandlers) {
                    setTimeout(() => {
                        module.attachEventHandlers();
                    }, 0);
                }
                
                setTimeout(applyTranslations, 0);
                console.log(`[MODULE LOADER] Loaded view: ${viewName}`);
            } catch (error) {
                console.error(`[MODULE LOADER] Error rendering ${viewName}:`, error);
            }
            return;
        }
        
        // Llamar a la función original para otros views
        return originalSwitchView.apply(this, arguments);
    };
    
    // 3. Registrar función de renderizado para el preview
    if (module.renderPreview) {
        window[`render${moduleName.charAt(0).toUpperCase() + moduleName.slice(1)}`] = function(settings) {
            return module.renderPreview(settings);
        };
    }
    
    // 4. Marcar como registrado
    window.registeredModules[moduleName] = module;
    
    console.log(`[MODULE LOADER] Successfully registered module: ${moduleName}`);
    return true;
};

// ========== FIN DEL LOADER - NO AGREGAR MÁS CÓDIGO ==========
```

---

## 📝 Implementación Paso a Paso

### Fase 1: Preparación (Una sola vez)

1. **Agregar el loader a website-builder.js**
   - Ir al final del archivo (línea ~24,000)
   - Pegar el código del loader
   - Agregar comentarios de advertencia

2. **Crear estructura de carpetas**
   ```bash
   mkdir /wwwroot/js/website-builder-modules
   ```

3. **Actualizar .gitignore** (si es necesario)
   ```
   # No ignorar los módulos
   !/wwwroot/js/website-builder-modules/
   ```

### Fase 2: Crear un Nuevo Módulo (Cart como ejemplo)

1. **Crear archivo del módulo**
   ```
   /wwwroot/js/website-builder-modules/cart.js
   ```

2. **Implementar el módulo siguiendo la estructura**
   - Copiar la plantilla de estructura
   - Implementar cada método según necesidades

3. **Registrar en el HTML**
   En `Views/WebsiteBuilder/Index.cshtml`, agregar después de website-builder.js:
   ```html
   <script src="~/js/website-builder.js"></script>
   <script src="~/js/website-builder-modules/cart.js"></script>
   ```

4. **Actualizar funciones existentes** (si es necesario)
   - En `renderBlockListView()`: Ya está el HTML del cart
   - En `attachBlockListEventListeners()`: Ya está el click handler

---

## ✅ Ventajas del Sistema

1. **Aislamiento**: Cada módulo es independiente
2. **Versionado**: Cambios en un módulo no afectan otros
3. **Testing**: Posible testear módulos individualmente
4. **Colaboración**: Menos conflictos en git
5. **Performance**: Potencial para lazy loading futuro
6. **Debugging**: Más fácil encontrar problemas

---

## ⚠️ Consideraciones y Limitaciones

### Lo que SÍ puede hacer un módulo:
- Acceder a variables globales (currentSectionsConfig, translations, etc.)
- Usar jQuery y funciones utilitarias existentes
- Llamar a funciones del core (renderPreview, updateSaveButtonState, etc.)
- Registrar sus propios event handlers

### Lo que NO debe hacer un módulo:
- Modificar el DOM fuera de su scope
- Sobrescribir funciones globales sin respaldarlas
- Crear variables globales sin namespace
- Depender de otros módulos (mantener independencia)

### Dependencias que debe conocer:
- jQuery (disponible globalmente)
- Material Icons (para iconos)
- Variables globales del Website Builder
- Sistema de traducciones

---

## 🔄 Plan de Migración (Opcional)

### Módulos candidatos para migración futura:
1. **Prioridad Alta** (módulos complejos que cambien frecuentemente)
   - Featured Collection
   - Product Grid
   - Gallery

2. **Prioridad Media** (módulos estables pero grandes)
   - Testimonials
   - Accordion
   - Newsletter

3. **Prioridad Baja** (módulos simples o que no cambian)
   - Rich Text
   - Spacer
   - Divider

### Proceso de migración:
1. Crear nuevo archivo modular
2. Copiar código del módulo desde website-builder.js
3. Adaptar a la nueva estructura
4. Probar exhaustivamente
5. Comentar código viejo (no eliminar inmediatamente)
6. Después de 1-2 sprints estables, eliminar código viejo

---

## 📊 Métricas de Éxito

- **Inmediato**: Cart funciona correctamente como módulo independiente
- **1 mes**: 3-5 nuevos módulos desarrollados modularmente
- **3 meses**: website-builder.js no ha crecido
- **6 meses**: Posible migración de 2-3 módulos legacy

---

## 🚀 Siguientes Pasos

1. ✅ Documentar plan (este documento)
2. ✅ Implementar loader en website-builder.js (línea 26441)
3. ✅ Crear módulo Cart como piloto (/wwwroot/js/website-builder-modules/cart.js)
4. ✅ Registrar módulo en Index.cshtml
5. ✅ Agregar estilos CSS para Cart
6. ⏳ Validar funcionamiento
7. ⏳ Documentar lecciones aprendidas
8. ⏳ Continuar con próximos módulos

## 📊 Estado de Implementación

### Módulo Cart - Piloto
- **Archivo**: `/wwwroot/js/website-builder-modules/cart.js`
- **Líneas**: ~500 líneas (vs 500-1500 en módulos legacy)
- **Features implementadas**:
  - Configuración completa del cart (color scheme, image ratio, toggles)
  - Vista completa siguiendo vistassetup.md
  - Sistema de traducciones integrado
  - Preview funcional
  - Event handlers con namespaces
  - Integración con sistema de guardado
- **Estado**: ✅ Implementado, syntax error corregido

### Desafíos Encontrados y Soluciones

#### 1. Timing de Carga del Módulo
**Problema**: Los módulos intentaban registrarse antes de que el loader estuviera disponible.
**Causa**: El loader estaba dentro de `$(document).ready()`, ejecutándose después de que los módulos se cargaran.
**Solución**: Mover el loader fuera de `$(document).ready()` para que esté disponible inmediatamente.

#### 2. Error de Sintaxis al Mover el Loader
**Problema**: "Unexpected token '}'" en línea 26441.
**Causa**: Al mover el loader, se dejó un `});` extra que no correspondía a ninguna apertura.
**Solución**: Agregar el cierre correcto del primer `$(document).ready()` block.

#### 3. Estructura del Archivo Principal
**Problema**: Con 26,000+ líneas, es difícil identificar dónde termina cada bloque de código.
**Solución**: Agregar comentarios claros indicando el fin de bloques importantes como `// End of $(document).ready()`.

#### 4. Variables Globales Duplicadas
**Problema**: "Identifier 'previousSidebarView' has already been declared" al cargar el módulo.
**Causa**: El loader intentaba redeclarar variables globales que ya existían al inicio del archivo.
**Solución**: Eliminar las declaraciones duplicadas y usar directamente las variables globales existentes.

---

## 📚 Referencias y Ejemplos

### Ejemplo Completo: Módulo Cart (Referencia)

El módulo Cart es nuestra implementación de referencia que muestra todas las características del sistema modular.

#### Características implementadas:
- ✅ Configuración completa con múltiples tipos de campos
- ✅ Sistema de traducciones integrado (es/en)
- ✅ Preview funcional en el iframe
- ✅ Event handlers con namespaces para evitar conflictos
- ✅ Integración con el sistema de guardado
- ✅ Manejo de estado y configuración por defecto
- ✅ Estilos CSS específicos del módulo

#### Estructura del módulo Cart:

```javascript
// Archivo: /wwwroot/js/website-builder-modules/cart.js
(function() {
    'use strict';
    
    window.WebsiteBuilderModules = window.WebsiteBuilderModules || {};
    
    window.WebsiteBuilderModules.Cart = {
        // 1. CONFIGURACIÓN DEL MÓDULO
        config: {
            name: 'cart',                    // ID único (usar en todos lados)
            displayName: {                   // Nombres para UI
                es: 'Carrito',
                en: 'Cart'
            },
            icon: 'shopping_cart',           // Material Icons
            isFixed: true,                   // true = no se puede eliminar
            defaultSettings: {               // Valores por defecto
                cartType: 'drawer',
                position: 'right',
                showItemCount: true,
                showSubtotal: true,
                // ... más configuraciones
            }
        },
        
        // 2. RENDERIZAR VISTA DE CONFIGURACIÓN
        renderSettings: function(data) {
            // Obtener idioma actual
            const currentLang = window.currentLanguage || 'es';
            
            // Obtener configuración actual o usar defaults
            const settings = (window.currentSectionsConfig && window.currentSectionsConfig.cart) 
                ? window.currentSectionsConfig.cart 
                : this.config.defaultSettings;
            
            // HTML del formulario de configuración
            return `
                <div class="sidebar-back-header">
                    <button class="back-button" onclick="window.switchSidebarView('blockList')">
                        <i class="material-icons">arrow_back</i>
                    </button>
                    <h2 class="sidebar-title">${this.config.displayName[currentLang]}</h2>
                </div>
                <div class="settings-form cart-settings-form">
                    <!-- Campos del formulario -->
                </div>
            `;
        },
        
        // 3. RENDERIZAR PREVIEW
        renderPreview: function(settings) {
            // Renderizar vista previa para el iframe
            return `<div class="cart-preview-section">...</div>`;
        },
        
        // 4. ADJUNTAR EVENT HANDLERS
        attachEventHandlers: function() {
            const self = this;
            
            // Usar namespaces para evitar conflictos
            $(document).off('change.cart').on('change.cart', '.cart-setting', function() {
                self.handleSettingChange();
            });
        },
        
        // 5. MANEJAR CAMBIOS
        handleSettingChange: function() {
            // Actualizar configuración
            const settings = this.getCurrentSettings();
            // ... actualizar settings desde el formulario
            
            // Guardar
            this.saveSettings(settings);
            
            // Actualizar preview
            if (window.renderPreview) {
                window.renderPreview();
            }
        },
        
        // 6. GUARDAR CONFIGURACIÓN
        saveSettings: function(settings) {
            window.currentSectionsConfig.cart = settings;
            window.hasPendingPageStructureChanges = true;
            window.updateSaveButtonState();
        },
        
        // 7. OBTENER CONFIGURACIÓN ACTUAL
        getCurrentSettings: function() {
            // Retornar configuración actual con defaults para valores faltantes
        }
    };
    
    // AUTO-REGISTRO
    if (window.registerWebsiteBuilderModule) {
        window.registerWebsiteBuilderModule(window.WebsiteBuilderModules.Cart);
    }
})();
```

#### Tipos de campos implementados en Cart:

1. **Select/Dropdown**:
   ```javascript
   <select id="cart-type" class="form-control cart-setting">
       <option value="drawer">Cajón lateral</option>
       <option value="modal">Modal</option>
   </select>
   ```

2. **Checkboxes**:
   ```javascript
   <input type="checkbox" id="cart-show-item-count" class="cart-setting-checkbox">
   ```

3. **Input numérico**:
   ```javascript
   <input type="number" id="cart-free-shipping-threshold" min="0" step="1">
   ```

4. **Input de texto con idioma**:
   ```javascript
   <input type="text" id="cart-empty-message" data-lang="${currentLang}">
   ```

5. **Visibilidad condicional**:
   ```javascript
   <div id="cart-position-group" style="${settings.cartType !== 'drawer' ? 'display: none;' : ''}">
   ```

#### Patrones importantes del módulo:

1. **Namespace en eventos**: Usar `.cart` para todos los eventos
2. **Referencias a `this`**: Guardar `const self = this` cuando sea necesario
3. **Validación de funciones globales**: Verificar que existan antes de llamarlas
4. **Deep copy de defaults**: Para evitar mutar el objeto original
5. **Logs de debug**: Incluir console.log con prefijo [CART MODULE]

### Ejemplo: Módulo Mínimo
```javascript
// Para módulos simples sin configuración
(function() {
    window.WebsiteBuilderModules = window.WebsiteBuilderModules || {};
    
    window.WebsiteBuilderModules.Divider = {
        config: {
            name: 'divider',
            displayName: { es: 'Divisor', en: 'Divider' },
            isFixed: false
        },
        renderPreview: function(settings) {
            return `<hr style="margin: 20px 0; border-color: #e5e5e5;">`;
        }
    };
    
    if (window.registerWebsiteBuilderModule) {
        window.registerWebsiteBuilderModule(window.WebsiteBuilderModules.Divider);
    }
})();
```

## 📋 Checklist para Nuevos Módulos

Usa este checklist cuando crees un nuevo módulo:

### Estructura básica
- [ ] Crear archivo en `/wwwroot/js/website-builder-modules/[nombre].js`
- [ ] Envolver todo en IIFE: `(function() { ... })();`
- [ ] Usar modo estricto: `'use strict';`
- [ ] Namespace global: `window.WebsiteBuilderModules = window.WebsiteBuilderModules || {};`

### Configuración del módulo
- [ ] `config.name`: ID único en minúsculas (sin guiones si es posible)
- [ ] `config.displayName`: Objeto con traducciones es/en
- [ ] `config.icon`: Nombre del Material Icon
- [ ] `config.isFixed`: true para módulos que no se pueden eliminar
- [ ] `config.defaultSettings`: Objeto con todos los valores por defecto

### Métodos requeridos
- [ ] `renderSettings()`: Retorna HTML de la vista de configuración
- [ ] `renderPreview()`: Retorna HTML para el iframe de preview
- [ ] `attachEventHandlers()`: Adjunta listeners con namespaces
- [ ] `handleSettingChange()`: Procesa cambios en la configuración
- [ ] `saveSettings()`: Guarda en currentSectionsConfig
- [ ] `getCurrentSettings()`: Obtiene config actual con defaults

### Traducciones
- [ ] Usar `window.currentLanguage || 'es'` para obtener idioma
- [ ] Incluir textos en ambos idiomas en defaultSettings
- [ ] Usar `data-i18n` en elementos estáticos
- [ ] Actualizar textos dinámicos según idioma actual

### Event Handlers
- [ ] Usar namespaces: `.nombremodulo` (ej: `.cart`)
- [ ] Hacer `.off()` antes de `.on()` para evitar duplicados
- [ ] Guardar referencia `const self = this` cuando sea necesario
- [ ] Llamar `handleSettingChange()` en cada cambio

### Integración
- [ ] Llamar `window.updateSaveButtonState()` al guardar
- [ ] Llamar `window.renderPreview()` después de cambios
- [ ] Verificar que funciones globales existan antes de llamarlas
- [ ] Auto-registro al final del archivo

### CSS (si es necesario)
- [ ] Agregar estilos en `/wwwroot/css/website-builder.css`
- [ ] Usar prefijo para evitar conflictos (ej: `.cart-settings-form`)
- [ ] Seguir convenciones de Shopify para consistencia

### Testing
- [ ] El módulo aparece en el panel lateral
- [ ] Click abre la vista de configuración
- [ ] Todos los campos funcionan correctamente
- [ ] Los cambios se reflejan en el preview
- [ ] El botón guardar se activa con cambios
- [ ] Los datos se persisten después de guardar

## 🎯 Mejores Prácticas

### 1. Nombres y IDs
```javascript
// ✅ BIEN - Consistente
config: { name: 'cart' }
id="cart-type"
class="cart-setting"
$(document).on('change.cart')

// ❌ MAL - Inconsistente  
config: { name: 'shopping-cart' }
id="cartType"
class="cart_setting"
```

### 2. Manejo de Estado
```javascript
// ✅ BIEN - Deep copy para evitar mutación
getCurrentSettings: function() {
    return JSON.parse(JSON.stringify(this.config.defaultSettings));
}

// ❌ MAL - Retorna referencia directa
getCurrentSettings: function() {
    return this.config.defaultSettings; // Puede mutar el original
}
```

### 3. Traducciones
```javascript
// ✅ BIEN - Soporta ambos idiomas
emptyCartMessage: {
    es: 'Tu carrito está vacío',
    en: 'Your cart is empty'
}

// ❌ MAL - Solo un idioma
emptyCartMessage: 'Tu carrito está vacío'
```

### 4. Event Handlers
```javascript
// ✅ BIEN - Con namespace y limpieza
$(document).off('change.cart').on('change.cart', '.cart-setting', function() {

// ❌ MAL - Sin namespace, puede causar duplicados
$(document).on('change', '.cart-setting', function() {
```

### 5. Logs de Debug
```javascript
// ✅ BIEN - Con prefijo identificable
console.log('[CART MODULE] Settings updated:', settings);

// ❌ MAL - Sin contexto
console.log('updated', settings);
```

## 🚀 Plantilla para Copiar

```javascript
// [NOMBRE] Module for Website Builder
(function() {
    'use strict';
    
    window.WebsiteBuilderModules = window.WebsiteBuilderModules || {};
    
    window.WebsiteBuilderModules.[NombreCapitalizado] = {
        config: {
            name: '[nombre]',
            displayName: {
                es: '[Nombre en Español]',
                en: '[Name in English]'
            },
            icon: '[material_icon_name]',
            isFixed: false,
            defaultSettings: {
                // Agregar configuraciones por defecto
            }
        },
        
        renderSettings: function(data) {
            const currentLang = window.currentLanguage || 'es';
            const settings = (window.currentSectionsConfig && window.currentSectionsConfig.[nombre]) 
                ? window.currentSectionsConfig.[nombre] 
                : this.config.defaultSettings;
            
            return `
                <div class="sidebar-back-header">
                    <button class="back-button" onclick="window.switchSidebarView('blockList')">
                        <i class="material-icons">arrow_back</i>
                    </button>
                    <h2 class="sidebar-title">${this.config.displayName[currentLang]}</h2>
                </div>
                <div class="settings-form [nombre]-settings-form">
                    <!-- Agregar campos del formulario -->
                </div>
            `;
        },
        
        renderPreview: function(settings) {
            if (!settings) settings = this.config.defaultSettings;
            return `<div class="[nombre]-preview"><!-- Preview HTML --></div>`;
        },
        
        attachEventHandlers: function() {
            const self = this;
            
            $(document).off('change.[nombre]').on('change.[nombre]', '.[nombre]-setting', function() {
                self.handleSettingChange();
            });
        },
        
        handleSettingChange: function() {
            const settings = this.getCurrentSettings();
            // Actualizar settings desde formulario
            
            this.saveSettings(settings);
            
            if (window.renderPreview) {
                window.renderPreview();
            }
        },
        
        saveSettings: function(settings) {
            if (!window.currentSectionsConfig) {
                window.currentSectionsConfig = {};
            }
            window.currentSectionsConfig.[nombre] = settings;
            window.hasPendingPageStructureChanges = true;
            
            if (window.updateSaveButtonState) {
                window.updateSaveButtonState();
            }
        },
        
        getCurrentSettings: function() {
            if (window.currentSectionsConfig && window.currentSectionsConfig.[nombre]) {
                return window.currentSectionsConfig.[nombre];
            }
            return JSON.parse(JSON.stringify(this.config.defaultSettings));
        }
    };
    
    // Auto-registro
    if (window.registerWebsiteBuilderModule) {
        window.registerWebsiteBuilderModule(window.WebsiteBuilderModules.[NombreCapitalizado]);
        console.log('[[NOMBRE] MODULE] Module loaded and registered');
    } else {
        document.addEventListener('DOMContentLoaded', function() {
            if (window.registerWebsiteBuilderModule) {
                window.registerWebsiteBuilderModule(window.WebsiteBuilderModules.[NombreCapitalizado]);
                console.log('[[NOMBRE] MODULE] Module registered after DOM ready');
            }
        });
    }
})();
```

---

**Autor**: Claude  
**Fecha**: Enero 2025  
**Estado**: ✅ Implementado con módulo Cart como piloto
**Última actualización**: Módulo Cart completamente funcional