// Cart Module for Website Builder
// This is the first modular implementation following the new architecture

(function() {
    'use strict';
    
    // Ensure global namespace
    window.WebsiteBuilderModules = window.WebsiteBuilderModules || {};
    
    window.WebsiteBuilderModules.Cart = {
        // Module configuration
        config: {
            name: 'cart',
            displayName: {
                es: 'Carrito',
                en: 'Cart'
            },
            icon: 'shopping_cart',
            isFixed: true, // Like header/footer - cannot be removed
            defaultSettings: {
                // General settings
                colorScheme: 'secondary',
                imageRatio: 'default',
                showOrderNotes: true,
                showTaxesAndShipping: true,
                
                // Drawer specific settings
                showAs: 'drawer-only', // drawer-only, modal, full-page
                showProgressBar: true,
                freeShippingGoal: 0,
                progressBarGradient: 'gradient-linear',
                darkenImageBackground: true,
                edgeRounding: 'size-2-4px',
                
                // Text customization
                emptyCartMessage: {
                    es: 'Tu carrito está vacío',
                    en: 'Your cart is empty'
                },
                continueShoppingText: {
                    es: 'Continuar comprando',
                    en: 'Continue shopping'
                },
                checkoutButtonText: {
                    es: 'Finalizar compra',
                    en: 'Checkout'
                },
                
                // Advanced settings
                customCSS: ''
            }
        },
        
        // Render settings view (sidebar panel)
        renderSettings: function(data) {
            const currentLang = window.currentLanguage || 'es';
            const settings = (window.currentSectionsConfig && window.currentSectionsConfig.cart) 
                ? window.currentSectionsConfig.cart 
                : this.config.defaultSettings;
            
            console.log('[CART MODULE] Rendering settings with:', settings);
            
            return `
                <div style="display: flex; flex-direction: column; height: 100%; position: relative; overflow: hidden;">
                    <!-- Header con flecha de regreso -->
                    <div class="sidebar-view-header" style="position: relative; z-index: 10;">
                        <button class="back-to-sections-btn">
                            <i class="material-icons">arrow_back</i>
                        </button>
                        <h3 data-i18n="cart.drawer.title">${currentLang === 'es' ? 'Cart drawer' : 'Cart drawer'}</h3>
                        <button class="view-menu-btn" style="position: absolute; right: 10px; top: 10px; background: none; border: none; cursor: pointer; padding: 5px;">
                            <i class="material-icons">more_vert</i>
                        </button>
                    </div>
                    
                    <!-- Contenido con scroll -->
                    <div style="padding: 20px; overflow-y: auto; overflow-x: hidden; flex: 1; height: calc(100% - 60px); box-sizing: border-box;">
                        
                        <!-- Don't remove message -->
                        <div style="background-color: #fef8e7; border: 1px solid #f5e6c8; border-radius: 4px; padding: 12px; margin-bottom: 20px; font-size: 13px; color: #5c5e60;">
                            <span data-i18n="cart.warning.dontRemove">
                                ${currentLang === 'es' ? 'NO ELIMINES el bloque \'Items\' para el funcionamiento correcto del carrito' : 'DON\'T REMOVE the \'Items\' block for correct cart operation'}
                            </span>
                        </div>
                        
                        <!-- Color scheme -->
                        <div class="form-group">
                            <label style="font-size: 13px; font-weight: 500; margin-bottom: 8px; color: #5c5e60; display: block;" 
                                   data-i18n="cart.settings.colorScheme">${currentLang === 'es' ? 'Esquema de color' : 'Color scheme'}</label>
                            <select class="shopify-select" id="cart-color-scheme" 
                                    style="width: 100%; padding: 8px 12px; border: 1px solid #e0e0e0; border-radius: 4px; background: white;">
                                <option value="primary" ${settings.colorScheme === 'primary' ? 'selected' : ''} 
                                        data-i18n="cart.colorScheme.primary">Primary</option>
                                <option value="secondary" ${settings.colorScheme === 'secondary' ? 'selected' : ''} 
                                        data-i18n="cart.colorScheme.secondary">Secondary</option>
                                <option value="tertiary" ${settings.colorScheme === 'tertiary' ? 'selected' : ''} 
                                        data-i18n="cart.colorScheme.tertiary">Tertiary</option>
                            </select>
                            <div style="font-size: 12px; color: #2962ff; margin-top: 5px;">
                                <span data-i18n="cart.settings.learnAbout">${currentLang === 'es' ? 'Aprende sobre' : 'Learn about'}</span>
                                <a href="#" style="color: #2962ff;" data-i18n="cart.settings.colorSchemes">
                                    ${currentLang === 'es' ? 'esquemas de color' : 'color schemes'}
                                </a>
                            </div>
                        </div>
                        
                        <!-- Image ratio -->
                        <div class="form-group" style="margin-top: 20px;">
                            <label style="font-size: 13px; font-weight: 500; margin-bottom: 8px; color: #5c5e60; display: block;" 
                                   data-i18n="cart.settings.imageRatio">${currentLang === 'es' ? 'Relación de imagen' : 'Image ratio'}</label>
                            <select class="shopify-select" id="cart-image-ratio" 
                                    style="width: 100%; padding: 8px 12px; border: 1px solid #e0e0e0; border-radius: 4px; background: white;">
                                <option value="default" ${settings.imageRatio === 'default' ? 'selected' : ''} 
                                        data-i18n="cart.imageRatio.default">Default</option>
                                <option value="portrait" ${settings.imageRatio === 'portrait' ? 'selected' : ''} 
                                        data-i18n="cart.imageRatio.portrait">Portrait</option>
                                <option value="square" ${settings.imageRatio === 'square' ? 'selected' : ''} 
                                        data-i18n="cart.imageRatio.square">Square</option>
                            </select>
                        </div>
                        
                        <!-- Show order notes toggle -->
                        <div class="form-group" style="margin-top: 20px;">
                            <label class="toggle-field">
                                <span data-i18n="cart.settings.showOrderNotes">${currentLang === 'es' ? 'Mostrar notas del pedido' : 'Show order notes'}</span>
                                <input type="checkbox" class="shopify-toggle" id="cart-show-order-notes" ${settings.showOrderNotes ? 'checked' : ''}>
                                <label for="cart-show-order-notes" class="toggle-slider"></label>
                            </label>
                        </div>
                        
                        <!-- Show taxes and shipping costs toggle -->
                        <div class="form-group" style="margin-top: 16px;">
                            <label class="toggle-field">
                                <span data-i18n="cart.settings.showTaxesAndShipping">${currentLang === 'es' ? 'Mostrar impuestos y costos de envío' : 'Show taxes and shipping costs'}</span>
                                <input type="checkbox" class="shopify-toggle" id="cart-show-taxes-shipping" ${settings.showTaxesAndShipping ? 'checked' : ''}>
                                <label for="cart-show-taxes-shipping" class="toggle-slider"></label>
                            </label>
                        </div>
                        
                        <!-- Configuración del tema expandible -->
                        <div class="form-group" style="margin-top: 24px;">
                            <details class="shopify-details">
                                <summary style="cursor: pointer; padding: 12px 0; font-size: 14px; font-weight: 500; color: #303030; display: flex; align-items: center; justify-content: space-between;">
                                    <span data-i18n="cart.sections.themeConfig">${currentLang === 'es' ? 'Configuración del tema' : 'Theme configuration'}</span>
                                    <i class="material-icons" style="font-size: 20px;">expand_more</i>
                                </summary>
                                <div style="padding-top: 16px;">
                                    
                                    <!-- Show as -->
                                    <div class="form-group">
                                        <label style="font-size: 13px; font-weight: 500; margin-bottom: 8px; color: #5c5e60; display: block;" 
                                               data-i18n="cart.settings.showAs">${currentLang === 'es' ? 'Mostrar como' : 'Show as'}</label>
                                        <select class="shopify-select" id="cart-show-as" 
                                                style="width: 100%; padding: 8px 12px; border: 1px solid #e0e0e0; border-radius: 4px; background: white;">
                                            <option value="drawer-only" ${settings.showAs === 'drawer-only' ? 'selected' : ''} 
                                                    data-i18n="cart.showAs.drawerOnly">${currentLang === 'es' ? 'Solo cajón' : 'Drawer only'}</option>
                                            <option value="modal" ${settings.showAs === 'modal' ? 'selected' : ''} 
                                                    data-i18n="cart.showAs.modal">Modal</option>
                                            <option value="full-page" ${settings.showAs === 'full-page' ? 'selected' : ''} 
                                                    data-i18n="cart.showAs.fullPage">${currentLang === 'es' ? 'Página completa' : 'Full page'}</option>
                                        </select>
                                        <div style="font-size: 12px; color: #2962ff; margin-top: 5px;">
                                            <span data-i18n="cart.settings.learnAbout">${currentLang === 'es' ? 'Aprende sobre' : 'Learn about'}</span>
                                            <a href="#" style="color: #2962ff;" data-i18n="cart.settings.cartView">
                                                ${currentLang === 'es' ? 'vista del carrito' : 'cart view'}
                                            </a>
                                        </div>
                                    </div>
                                    
                                    <!-- Show progress bar toggle -->
                                    <div class="form-group" style="margin-top: 16px;">
                                        <label class="toggle-field">
                                            <span data-i18n="cart.settings.showProgressBar">${currentLang === 'es' ? 'Mostrar barra de progreso' : 'Show progress bar'}</span>
                                            <input type="checkbox" class="shopify-toggle" id="cart-show-progress-bar" ${settings.showProgressBar ? 'checked' : ''}>
                                            <label for="cart-show-progress-bar" class="toggle-slider"></label>
                                        </label>
                                    </div>
                                    
                                    <!-- Free shipping goal (shown only if progress bar is enabled) -->
                                    <div class="form-group" style="margin-top: 16px; ${!settings.showProgressBar ? 'display: none;' : ''}" id="free-shipping-goal-group">
                                        <label style="font-size: 13px; font-weight: 500; margin-bottom: 8px; color: #5c5e60; display: block;" 
                                               data-i18n="cart.settings.freeShippingGoal">${currentLang === 'es' ? 'Meta de envío gratis' : 'Free shipping goal'}</label>
                                        <input type="number" 
                                               id="cart-free-shipping-goal" 
                                               value="${settings.freeShippingGoal || 0}"
                                               placeholder="0"
                                               style="width: 100%; padding: 8px 12px; border: 1px solid #e0e0e0; border-radius: 4px;"
                                               min="0"
                                               step="1">
                                        <div style="font-size: 12px; color: #666; margin-top: 5px;">
                                            <span data-i18n="cart.settings.freeShippingHelp">
                                                ${currentLang === 'es' ? 'Este es el valor en la moneda de tu tienda. Configura tu' : 'This is the value in your store\'s main currency. Set up your'}
                                            </span>
                                            <a href="#" style="color: #2962ff;" data-i18n="cart.settings.shippingRates">
                                                ${currentLang === 'es' ? 'tarifas de envío' : 'shipping rates'}
                                            </a>
                                            <span data-i18n="cart.settings.orAutomatic">
                                                ${currentLang === 'es' ? 'o' : 'or'}
                                            </span>
                                            <a href="#" style="color: #2962ff;" data-i18n="cart.settings.automaticFreeShipping">
                                                ${currentLang === 'es' ? 'descuento automático de envío gratis' : 'automatic free shipping discount'}
                                            </a>
                                            <span data-i18n="cart.settings.toMatchGoal">
                                                ${currentLang === 'es' ? 'para que coincida con la meta.' : 'to match the goal.'}
                                            </span>
                                        </div>
                                    </div>
                                    
                                    <!-- Progress bar gradient (shown only if progress bar is enabled) -->
                                    <div class="form-group" style="margin-top: 16px; ${!settings.showProgressBar ? 'display: none;' : ''}" id="progress-bar-gradient-group">
                                        <label style="font-size: 13px; font-weight: 500; margin-bottom: 8px; color: #5c5e60; display: block;" 
                                               data-i18n="cart.settings.progressBarGradient">${currentLang === 'es' ? 'Degradado de la barra de progreso' : 'Progress bar gradient'}</label>
                                        <select class="shopify-select" id="cart-progress-gradient" 
                                                style="width: 100%; padding: 8px 12px; border: 1px solid #e0e0e0; border-radius: 4px; background: white;">
                                            <option value="gradient-linear" ${settings.progressBarGradient === 'gradient-linear' ? 'selected' : ''} 
                                                    data-i18n="cart.gradient.linear">🟡 ${currentLang === 'es' ? 'Degradado lineal' : 'Linear gradient'}</option>
                                            <option value="gradient-radial" ${settings.progressBarGradient === 'gradient-radial' ? 'selected' : ''} 
                                                    data-i18n="cart.gradient.radial">${currentLang === 'es' ? 'Degradado radial' : 'Radial gradient'}</option>
                                            <option value="solid-color" ${settings.progressBarGradient === 'solid-color' ? 'selected' : ''} 
                                                    data-i18n="cart.gradient.solid">${currentLang === 'es' ? 'Color sólido' : 'Solid color'}</option>
                                        </select>
                                    </div>
                                    
                                    <!-- Darken image background toggle -->
                                    <div class="form-group" style="margin-top: 16px;">
                                        <label class="toggle-field">
                                            <span data-i18n="cart.settings.darkenImageBg">${currentLang === 'es' ? 'Oscurecer fondo de imagen' : 'Darken image background'}</span>
                                            <input type="checkbox" class="shopify-toggle" id="cart-darken-image-bg" ${settings.darkenImageBackground ? 'checked' : ''}>
                                            <label for="cart-darken-image-bg" class="toggle-slider"></label>
                                        </label>
                                        <div style="font-size: 12px; color: #666; margin-top: 5px; margin-left: 0;">
                                            <span data-i18n="cart.settings.darkenImageHelp">
                                                ${currentLang === 'es' ? 'Para imágenes de productos con color inicialmente blanco o transparente' : 'For product images with initially white or transparent color'}
                                            </span>
                                        </div>
                                    </div>
                                    
                                    <!-- Edge rounding -->
                                    <div class="form-group" style="margin-top: 20px;">
                                        <label style="font-size: 13px; font-weight: 500; margin-bottom: 8px; color: #5c5e60; display: block;" 
                                               data-i18n="cart.settings.edgeRounding">${currentLang === 'es' ? 'Redondeo de bordes' : 'Edge rounding'}</label>
                                        <select class="shopify-select" id="cart-edge-rounding" 
                                                style="width: 100%; padding: 8px 12px; border: 1px solid #e0e0e0; border-radius: 4px; background: white;">
                                            <option value="size-2-4px" ${settings.edgeRounding === 'size-2-4px' ? 'selected' : ''} 
                                                    data-i18n="cart.edgeRounding.size2">${currentLang === 'es' ? 'Tamaño 2 - 4px' : 'Size 2 - 4px'}</option>
                                            <option value="size-1-2px" ${settings.edgeRounding === 'size-1-2px' ? 'selected' : ''} 
                                                    data-i18n="cart.edgeRounding.size1">${currentLang === 'es' ? 'Tamaño 1 - 2px' : 'Size 1 - 2px'}</option>
                                            <option value="size-3-8px" ${settings.edgeRounding === 'size-3-8px' ? 'selected' : ''} 
                                                    data-i18n="cart.edgeRounding.size3">${currentLang === 'es' ? 'Tamaño 3 - 8px' : 'Size 3 - 8px'}</option>
                                            <option value="none" ${settings.edgeRounding === 'none' ? 'selected' : ''} 
                                                    data-i18n="cart.edgeRounding.none">${currentLang === 'es' ? 'Sin redondeo' : 'No rounding'}</option>
                                        </select>
                                        <div style="font-size: 12px; color: #666; margin-top: 5px;">
                                            <span data-i18n="cart.settings.edgeRoundingHelp">
                                                ${currentLang === 'es' ? 'Se aplica a tarjetas, botones, esquinas de sección y otros elementos' : 'Applies to cards, buttons, section corners, and other elements'}
                                            </span>
                                        </div>
                                    </div>
                                    
                                </div>
                            </details>
                        </div>
                        
                        <!-- CSS personalizado expandible -->
                        <div class="form-group" style="margin-top: 16px;">
                            <details class="shopify-details">
                                <summary style="cursor: pointer; padding: 12px 0; font-size: 14px; font-weight: 500; color: #303030; display: flex; align-items: center; justify-content: space-between;">
                                    <span data-i18n="cart.sections.customCSS">${currentLang === 'es' ? 'CSS personalizado' : 'Custom CSS'}</span>
                                    <i class="material-icons" style="font-size: 20px;">expand_more</i>
                                </summary>
                                <div style="padding-top: 16px;">
                                    <textarea id="cart-custom-css" 
                                              placeholder=".cart-drawer { }"
                                              style="width: 100%; min-height: 120px; padding: 12px; border: 1px solid #e0e0e0; border-radius: 4px; font-family: 'Monaco', 'Consolas', monospace; font-size: 13px;"
                                    >${settings.customCSS || ''}</textarea>
                                    <div style="font-size: 12px; color: #666; margin-top: 5px;">
                                        <span data-i18n="cart.settings.customCSSHelp">
                                            ${currentLang === 'es' ? 'Agrega CSS personalizado para modificar el estilo del carrito' : 'Add custom CSS to modify cart styling'}
                                        </span>
                                    </div>
                                </div>
                            </details>
                        </div>
                        
                    </div>
                </div>
            `;
        },
        
        // Render preview (for the iframe)
        renderPreview: function(settings) {
            if (!settings) {
                settings = this.config.defaultSettings;
            }
            
            const currentLang = window.currentLanguage || 'es';
            
            // Get color scheme values
            const schemeColors = window.getColorSchemeValues ? 
                window.getColorSchemeValues(settings.colorScheme || 'scheme1') : 
                { background: '#ffffff', text: '#000000' };
            
            // For preview, we'll show a simplified cart icon/button
            return `
                <div class="cart-preview-section" style="
                    position: fixed;
                    bottom: 20px;
                    ${settings.position === 'left' ? 'left' : 'right'}: 20px;
                    z-index: 1000;
                ">
                    <div class="cart-button" style="
                        background-color: ${schemeColors.background};
                        color: ${schemeColors.text};
                        border: 1px solid ${schemeColors.text}20;
                        border-radius: 8px;
                        padding: 12px 20px;
                        display: flex;
                        align-items: center;
                        gap: 8px;
                        cursor: pointer;
                        box-shadow: 0 2px 8px rgba(0,0,0,0.1);
                        transition: all 0.3s ease;
                    ">
                        <i class="material-icons" style="font-size: 20px;">shopping_cart</i>
                        ${settings.showItemCount ? '<span class="cart-count" style="font-weight: 500;">(0)</span>' : ''}
                        ${settings.showSubtotal ? '<span class="cart-subtotal" style="font-weight: 500;">$0.00</span>' : ''}
                    </div>
                </div>
            `;
        },
        
        // Attach event handlers
        attachEventHandlers: function() {
            const self = this;
            
            // Apply translations FIRST
            setTimeout(applyTranslations, 0);
            
            // Back button - ALWAYS navigates to blockList
            $('.back-to-sections-btn').off('click.cart').on('click.cart', function() {
                window.switchSidebarView('blockList');
            });
            
            // Helper function to update configuration
            const updateConfig = (key, value) => {
                // Initialize structure if it doesn't exist
                if (!window.currentSectionsConfig.cart) {
                    window.currentSectionsConfig.cart = JSON.parse(JSON.stringify(self.config.defaultSettings));
                }
                
                // Update value
                window.currentSectionsConfig.cart[key] = value;
                
                // CRITICAL: Use setter function, NOT direct assignment
                window.setHasPendingPageStructureChanges(true);
                window.updateSaveButtonState();
                window.renderPreview();
                
                console.log('[CART MODULE] Updated setting:', key, '=', value);
            };
            
            // Color scheme dropdown
            $('#cart-color-scheme').off('change.cart').on('change.cart', function() {
                updateConfig('colorScheme', $(this).val());
            });
            
            // Image ratio dropdown
            $('#cart-image-ratio').off('change.cart').on('change.cart', function() {
                updateConfig('imageRatio', $(this).val());
            });
            
            // Show order notes toggle
            $('#cart-show-order-notes').off('change.cart').on('change.cart', function() {
                updateConfig('showOrderNotes', $(this).is(':checked'));
            });
            
            // Show taxes and shipping toggle
            $('#cart-show-taxes-shipping').off('change.cart').on('change.cart', function() {
                updateConfig('showTaxesAndShipping', $(this).is(':checked'));
            });
            
            // Show as dropdown
            $('#cart-show-as').off('change.cart').on('change.cart', function() {
                updateConfig('showAs', $(this).val());
            });
            
            // Show progress bar toggle - with conditional field visibility
            $('#cart-show-progress-bar').off('change.cart').on('change.cart', function() {
                const isChecked = $(this).is(':checked');
                updateConfig('showProgressBar', isChecked);
                
                // Show/hide dependent fields
                if (isChecked) {
                    $('#free-shipping-goal-group').show();
                    $('#progress-bar-gradient-group').show();
                } else {
                    $('#free-shipping-goal-group').hide();
                    $('#progress-bar-gradient-group').hide();
                }
            });
            
            // Free shipping goal input
            $('#cart-free-shipping-goal').off('input.cart').on('input.cart', function() {
                updateConfig('freeShippingGoal', parseInt($(this).val()) || 0);
            });
            
            // Progress bar gradient dropdown
            $('#cart-progress-gradient').off('change.cart').on('change.cart', function() {
                updateConfig('progressBarGradient', $(this).val());
            });
            
            // Darken image background toggle
            $('#cart-darken-image-bg').off('change.cart').on('change.cart', function() {
                updateConfig('darkenImageBackground', $(this).is(':checked'));
            });
            
            // Edge rounding dropdown
            $('#cart-edge-rounding').off('change.cart').on('change.cart', function() {
                updateConfig('edgeRounding', $(this).val());
            });
            
            // Custom CSS textarea
            $('#cart-custom-css').off('input.cart').on('input.cart', function() {
                updateConfig('customCSS', $(this).val());
            });
            
            // Handle details/summary animation for expandable sections
            $('details.shopify-details').off('toggle.cart').on('toggle.cart', function() {
                const $icon = $(this).find('summary i.material-icons');
                if ($(this).prop('open')) {
                    $icon.text('expand_less');
                } else {
                    $icon.text('expand_more');
                }
            });
            
            // Prevent default link behavior
            $('a[href="#"]').off('click.cart').on('click.cart', function(e) {
                e.preventDefault();
            });
        },
        
        
        // Save settings
        saveSettings: function(settings) {
            if (!window.currentSectionsConfig) {
                window.currentSectionsConfig = {};
            }
            
            window.currentSectionsConfig.cart = settings;
            window.hasPendingPageStructureChanges = true;
            
            if (window.updateSaveButtonState) {
                window.updateSaveButtonState();
            }
        },
        
        // Get current settings
        getCurrentSettings: function() {
            if (window.currentSectionsConfig && window.currentSectionsConfig.cart) {
                // Ensure all properties exist
                const settings = window.currentSectionsConfig.cart;
                
                // Ensure text objects exist for both languages
                if (!settings.emptyCartMessage) settings.emptyCartMessage = {};
                if (!settings.continueShoppingText) settings.continueShoppingText = {};
                if (!settings.checkoutButtonText) settings.checkoutButtonText = {};
                if (!settings.freeShippingMessage) settings.freeShippingMessage = {};
                
                // Set defaults for missing language entries
                ['es', 'en'].forEach(lang => {
                    if (!settings.emptyCartMessage[lang]) {
                        settings.emptyCartMessage[lang] = this.config.defaultSettings.emptyCartMessage[lang];
                    }
                    if (!settings.continueShoppingText[lang]) {
                        settings.continueShoppingText[lang] = this.config.defaultSettings.continueShoppingText[lang];
                    }
                    if (!settings.checkoutButtonText[lang]) {
                        settings.checkoutButtonText[lang] = this.config.defaultSettings.checkoutButtonText[lang];
                    }
                    if (!settings.freeShippingMessage[lang]) {
                        settings.freeShippingMessage[lang] = this.config.defaultSettings.freeShippingMessage[lang];
                    }
                });
                
                return settings;
            }
            
            // Return a deep copy of default settings
            return JSON.parse(JSON.stringify(this.config.defaultSettings));
        }
    };
    
    // Auto-register the module when the file loads
    if (window.registerWebsiteBuilderModule) {
        window.registerWebsiteBuilderModule(window.WebsiteBuilderModules.Cart);
        console.log('[CART MODULE] Module loaded and registered');
    } else {
        console.warn('[CART MODULE] Module loader not found. Waiting for registration...');
        // Try again after DOM is ready
        document.addEventListener('DOMContentLoaded', function() {
            if (window.registerWebsiteBuilderModule) {
                window.registerWebsiteBuilderModule(window.WebsiteBuilderModules.Cart);
                console.log('[CART MODULE] Module registered after DOM ready');
            }
        });
    }
})();