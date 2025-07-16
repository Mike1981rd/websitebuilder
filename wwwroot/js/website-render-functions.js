// Funciones de renderizado compartidas entre el editor y el preview

// No declarar currentGlobalThemeSettings aquí, ya que se espera que esté disponible globalmente
// desde website-builder.js o desde el contexto donde se use este archivo

// Función para renderizar featured collection
function renderFeaturedCollection(config) {
    if (!config || config.isHidden) return '';
    
    const schemeColors = getColorSchemeValues(config.config?.colorScheme || 'scheme1');
    
    // Estructura básica con 4 productos dummy
    const productsHtml = Array(4).fill().map((_, index) => `
        <div class="featured-collection-product" style="text-align: center;">
            <div class="product-image-container" style="
                width: 100%;
                aspect-ratio: 1;
                background-color: #c8a961;
                display: flex;
                align-items: center;
                justify-content: center;
                border-radius: 4px;
                margin-bottom: 16px;
                position: relative;
                overflow: hidden;
            ">
                <svg width="80" height="80" viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M40 20C45.523 20 50 24.477 50 30V50C50 55.523 45.523 60 40 60C34.477 60 30 55.523 30 50V30C30 24.477 34.477 20 40 20Z" fill="#FDF4E3" opacity="0.5"/>
                </svg>
            </div>
            <div class="product-info" style="text-align: left;">
                <h3 class="product-title" style="
                    font-size: 16px;
                    font-weight: 400;
                    margin: 0 0 4px 0;
                    color: ${schemeColors.text};
                ">Nombre de producto</h3>
                <p class="product-vendor" style="
                    font-size: 14px;
                    color: ${schemeColors.text};
                    opacity: 0.7;
                    margin: 0 0 8px 0;
                ">Proveedor</p>
                <div class="product-rating" style="margin-bottom: 8px;">
                    ${Array(5).fill().map(() => '<span style="color: #ddd; font-size: 16px;">★</span>').join('')}
                </div>
                <p class="product-price" style="
                    font-size: 16px;
                    font-weight: 500;
                    margin: 0;
                    color: ${schemeColors.text};
                ">$0.00 USD</p>
            </div>
        </div>
    `).join('');
    
    return `
        <div class="section-wrapper featured-collection-section" data-section-id="featured-collection" style="
            background-color: ${schemeColors.background};
            padding: 48px 0;
        ">
            <div class="section-header-tag">
                <i class="material-icons" style="font-size: 16px;">view_module</i>
                <span>Featured collection</span>
            </div>
            <div class="container" style="
                max-width: 1200px;
                margin: 0 auto;
                padding: 0 24px;
            ">
                <h2 style="
                    text-align: center;
                    font-size: 32px;
                    font-weight: 400;
                    margin: 0 0 32px 0;
                    color: ${schemeColors.text};
                ">${config.config?.title || 'Featured collection'}</h2>
                <div class="featured-collection-grid" style="
                    display: grid;
                    grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
                    gap: 32px;
                    margin-bottom: 32px;
                ">
                    ${productsHtml}
                </div>
            </div>
        </div>
    `;
}

// Color schemes predefinidos
const colorSchemes = {
    'scheme1': {
        background: '#ffffff',
        text: '#333333',
        foreground: '#f0f0f0',
        border: '#e5e5e5'
    },
    'scheme2': {
        background: '#1a1a1a',
        text: '#ffffff',
        foreground: '#333333',
        border: '#444444'
    },
    'scheme3': {
        background: '#f5f5f5',
        text: '#2c3e50',
        foreground: '#e8e8e8',
        border: '#d0d0d0'
    },
    'scheme4': {
        background: '#2c3e50',
        text: '#ecf0f1',
        foreground: '#34495e',
        border: '#34495e'
    },
    'scheme5': {
        background: '#fafafa',
        text: '#1a1a1a',
        foreground: '#f0f0f0',
        border: '#e0e0e0'
    }
};

// Función para obtener los valores de un color scheme
function getColorSchemeValues(schemeName) {
    // Intentar obtener currentGlobalThemeSettings de diferentes fuentes
    const globalSettings = (typeof window !== 'undefined' && window.currentGlobalThemeSettings) 
        ? window.currentGlobalThemeSettings 
        : (typeof currentGlobalThemeSettings !== 'undefined' ? currentGlobalThemeSettings : null);
    
    // First check if we have custom values in currentGlobalThemeSettings
    if (globalSettings && globalSettings.colorSchemes && globalSettings.colorSchemes[schemeName]) {
        return globalSettings.colorSchemes[schemeName];
    }
    
    // Fall back to default color schemes
    return colorSchemes[schemeName] || colorSchemes['scheme1'];
}

// Función para renderizar el header
// Helper function to get cart badge color from cart's color scheme
function getCartBadgeColor() {
    try {
        // Get cart configuration
        let cartConfig = null;
        
        if (typeof window !== 'undefined' && window.currentSectionsConfig && window.currentSectionsConfig.cart) {
            cartConfig = window.currentSectionsConfig.cart;
        } else if (typeof window !== 'undefined' && window.parent && window.parent.currentSectionsConfig && window.parent.currentSectionsConfig.cart) {
            cartConfig = window.parent.currentSectionsConfig.cart;
        }
        
        if (cartConfig && cartConfig.colorScheme) {
            const cartSchemeColors = getColorSchemeValues(cartConfig.colorScheme);
            return cartSchemeColors.foreground || '#f0f0f0';
        }
    } catch (e) {
        console.log('[CART] Error getting cart badge color:', e);
    }
    
    // Default fallback
    return '#f0f0f0';
}

// Helper function to get cart badge text color from cart's color scheme
function getCartBadgeTextColor() {
    try {
        // Get cart configuration
        let cartConfig = null;
        
        if (typeof window !== 'undefined' && window.currentSectionsConfig && window.currentSectionsConfig.cart) {
            cartConfig = window.currentSectionsConfig.cart;
        } else if (typeof window !== 'undefined' && window.parent && window.parent.currentSectionsConfig && window.parent.currentSectionsConfig.cart) {
            cartConfig = window.parent.currentSectionsConfig.cart;
        }
        
        if (cartConfig && cartConfig.colorScheme) {
            const cartSchemeColors = getColorSchemeValues(cartConfig.colorScheme);
            return cartSchemeColors.text || '#333333';
        }
    } catch (e) {
        console.log('[CART] Error getting cart badge text color:', e);
    }
    
    // Default fallback
    return '#333333';
}

function renderHeader(config) {
    if (!config || config.isHidden) return '';

    // Get the selected color scheme
    const selectedScheme = config.colorScheme || 'scheme1';
    const schemeColors = getColorSchemeValues(selectedScheme);
    
    // Get typography settings from multiple sources
    let menuTypography = {};
    
    // Try to get typography from window.currentGlobalThemeSettings first
    if (typeof window !== 'undefined' && window.currentGlobalThemeSettings && window.currentGlobalThemeSettings.typography && window.currentGlobalThemeSettings.typography.menu) {
        menuTypography = window.currentGlobalThemeSettings.typography.menu;
    } 
    // Fallback to currentGlobalThemeSettings if available
    else if (typeof currentGlobalThemeSettings !== 'undefined' && currentGlobalThemeSettings.typography && currentGlobalThemeSettings.typography.menu) {
        menuTypography = currentGlobalThemeSettings.typography.menu;
    }
    
    const menuFontValue = menuTypography.font || 'assistant';
    const menuFontFamily = window.getFontNameFromValueSafe ? window.getFontNameFromValueSafe(menuFontValue) : menuFontValue;
    
    // Ensure the font is loaded in the main document
    if (typeof window !== 'undefined' && window.loadGoogleFont && menuFontFamily && menuFontFamily !== 'assistant') {
        window.loadGoogleFont(menuFontFamily);
    }
    
    // Calculate menu font size from percentage
    const baseFontSize = 15; // Base font size in pixels
    const menuFontPercentage = parseFloat(menuTypography.fontSize) || 100;
    const menuFontSize = `${Math.round(baseFontSize * menuFontPercentage / 100)}px`;
    
    // Get other menu typography settings
    const menuUppercase = menuTypography.uppercase || false;
    const menuLetterSpacing = menuTypography.letterSpacing || 0;
    
    // Logo sizes for desktop and mobile
    const logoSize = config.desktopLogoSize || 190;
    const mobileLogoSize = config.mobileLogoSize || 120;
    
    // Logo HTML optimized for HD quality with Shopify-style responsive images
    const logoHtml = config.desktopLogoUrl 
        ? `<div class="header-logo-wrapper" style="height: ${logoSize}px; display: flex; align-items: center;">
               <img src="${config.desktopLogoUrl}" 
                    srcset="${config.desktopLogoUrl} 1x, ${config.desktopLogoUrl} 2x, ${config.desktopLogoUrl} 3x"
                    sizes="(max-width: 768px) ${mobileLogoSize}px, ${logoSize}px"
                    alt="logo" 
                    loading="eager"
                    decoding="async"
                    style="max-height: 100%; max-width: 100%; width: auto; height: auto; object-fit: contain; display: block; image-rendering: -webkit-optimize-contrast; image-rendering: crisp-edges; -webkit-backface-visibility: hidden; transform: translateZ(0);">
           </div>`
        : `<span style="font-size: 32px; font-weight: 600; letter-spacing: 0.08em; color: ${schemeColors.text};">AURORA</span>`;

    // Determine cart icon based on configuration
    const cartIcon = config.cartType === 'cart' ? 'shopping_cart' : 'shopping_bag';
    
    // Determine icon style (outline vs solid)
    const iconClass = config.iconStyle === 'solid' ? 'material-icons' : 'material-symbols-outlined';
    const iconWeight = config.iconStyle === 'solid' ? '400' : '300';
    
    // Icons for different styles
    const searchIcon = config.iconStyle === 'solid' ? 'search' : 'search';
    const personIcon = config.iconStyle === 'solid' ? 'person' : 'person_outline';
    
    // Menu items - use selected menu if available
    let menuItems = '';
    const selectedMenuId = config.navigationMenuId || config.navigationMenu || 'main-menu';
    
    // Try to get menus data from multiple sources
    let menusData = (typeof window !== 'undefined' && window.currentMenusData) 
        ? window.currentMenusData 
        : (typeof currentMenusData !== 'undefined' ? currentMenusData : []);
    
    // If still no menus, try to get from global theme settings
    if ((!menusData || menusData.length === 0) && typeof window !== 'undefined' && window.currentGlobalThemeSettings && window.currentGlobalThemeSettings.menus) {
        menusData = window.currentGlobalThemeSettings.menus;
    }
    
    const selectedMenu = menusData.find(m => m.id === selectedMenuId);
    
    if (selectedMenu && selectedMenu.items && selectedMenu.items.length > 0) {
        menuItems = renderMenuItemsForHeader(selectedMenu.items, {
            menuFontFamily,
            menuFontSize,
            menuUppercase,
            menuLetterSpacing,
            schemeColors,
            openMenuDropdown: config.openMenuDropdown || 'hover'
        });
    } else {
        // Default menu items if no menu found
        const textTransform = menuUppercase ? 'text-transform: uppercase;' : '';
        menuItems = `
            <a href="#" style="text-decoration: none; color: inherit; font-family: ${menuFontFamily}, -apple-system, BlinkMacSystemFont, 'Segoe UI', Helvetica, Arial, sans-serif; font-size: ${menuFontSize}; font-weight: 400; letter-spacing: ${menuLetterSpacing}px; ${textTransform}">Soluciones</a>
            <a href="#" style="text-decoration: none; color: inherit; font-family: ${menuFontFamily}, -apple-system, BlinkMacSystemFont, 'Segoe UI', Helvetica, Arial, sans-serif; font-size: ${menuFontSize}; font-weight: 400; letter-spacing: ${menuLetterSpacing}px; ${textTransform}">Herramientas</a>
        `;
    }
    
    // Get cart count from localStorage to persist across re-renders
    let cartCount = 0;
    try {
        if (typeof window !== 'undefined') {
            let cartItems = [];
            
            // Try to get from parent window first
            if (window.parent && window.parent !== window && window.parent.localStorage) {
                const savedCart = window.parent.localStorage.getItem('websiteBuilderCart');
                if (savedCart) {
                    cartItems = JSON.parse(savedCart);
                }
            } else {
                // Direct access to localStorage
                const savedCart = localStorage.getItem('websiteBuilderCart');
                if (savedCart) {
                    cartItems = JSON.parse(savedCart);
                }
            }
            
            cartCount = cartItems.reduce((total, item) => total + (item.quantity || 0), 0);
        }
    } catch (e) {
        console.log('[HEADER] Error getting cart count:', e);
    }
    
    // Icons section
    const iconsHtml = `
        <div class="header-icons-right" style="display: flex; gap: 24px; align-items: center;">
            <span class="${iconClass}" style="font-size: 24px; font-weight: ${iconWeight}; cursor: pointer; color: ${schemeColors.text};">${searchIcon}</span>
            <span class="${iconClass}" style="font-size: 24px; font-weight: ${iconWeight}; cursor: pointer; color: ${schemeColors.text};">${personIcon}</span>
            <div class="cart-icon-wrapper" style="position: relative; cursor: pointer;">
                <span class="${iconClass} cart-icon-header" style="font-size: 24px; font-weight: ${iconWeight}; color: ${schemeColors.text};">${cartIcon}</span>
                ${cartCount > 0 ? `
                    <span class="cart-count-badge" style="
                        position: absolute;
                        top: -8px;
                        right: -8px;
                        background-color: ${getCartBadgeColor()};
                        color: ${getCartBadgeTextColor()};
                        font-size: 11px;
                        font-weight: 500;
                        padding: 2px 6px;
                        border-radius: 10px;
                        min-width: 18px;
                        height: 18px;
                        display: flex;
                        align-items: center;
                        justify-content: center;
                        line-height: 1;
                    ">${cartCount}</span>
                ` : ''}
            </div>
        </div>
    `;
    
    // Get configured header height
    const headerHeight = config.headerHeight || 80;
    
    // Add responsive styles to the header
    const responsiveStyles = `
        <style>
            /* Desktop styles (default) */
            .header-container {
                height: ${headerHeight}px;
                display: flex;
                align-items: center;
                justify-content: space-between;
                padding: 0 50px;
                border-bottom: ${config.showDivider ? `1px solid ${schemeColors.border || '#e5e5e5'}` : 'none'};
                background-color: ${schemeColors.background};
                color: ${schemeColors.text};
            }
            
            .header-menu-inline {
                display: flex;
                gap: 32px;
                align-items: center;
            }
            
            .header-menu-drawer-icon {
                display: none;
            }
            
            /* Mobile responsive styles */
            @media (max-width: 768px) {
                .header-container {
                    height: 60px;
                    padding: 0 15px;
                }
                
                /* Hide inline menus on mobile */
                .header-menu-inline {
                    display: none !important;
                }
                
                /* Show drawer icon on mobile for non-drawer layouts */
                .header-menu-drawer-icon {
                    display: flex;
                    align-items: center;
                }
                
                /* Smaller logo on mobile */
                .header-logo img {
                    max-height: ${mobileLogoSize}px !important;
                }
                
                .header-logo span {
                    font-size: ${Math.round(mobileLogoSize * 0.168)}px !important;
                }
                
                /* Smaller icons on mobile */
                .header-icons-right {
                    gap: 16px !important;
                }
                
                .header-icons-right span {
                    font-size: 20px !important;
                }
            }
        </style>
    `;
    
    let headerContent = responsiveStyles;
    const layout = config.layout || 'logo-center-menu-left-inline';
    
    switch(layout) {
        case 'drawer':
            headerContent += `
                <header class="header-container">
                    <div class="header-menu-drawer" style="display: flex; align-items: center;">
                        <span class="${iconClass}" style="font-size: 28px; font-weight: ${iconWeight}; cursor: pointer; color: ${schemeColors.text};">menu</span>
                    </div>
                    <div class="header-logo" style="position: absolute; left: 50%; transform: translateX(-50%);">${logoHtml}</div>
                    ${iconsHtml}
                </header>
            `;
            break;
            
        case 'logo-left-menu-center-inline':
            headerContent += `
                <header class="header-container">
                    <div class="header-menu-drawer-icon">
                        <span class="${iconClass}" style="font-size: 28px; font-weight: ${iconWeight}; cursor: pointer; color: ${schemeColors.text};">menu</span>
                    </div>
                    <div class="header-logo">${logoHtml}</div>
                    <div class="header-menu-center header-menu-inline" style="position: absolute; left: 50%; transform: translateX(-50%);">
                        ${menuItems}
                    </div>
                    ${iconsHtml}
                </header>
            `;
            break;
            
        case 'logo-left-menu-left-inline':
            headerContent += `
                <header class="header-container">
                    <div style="display: flex; align-items: center; gap: 48px;">
                        <div class="header-menu-drawer-icon">
                            <span class="${iconClass}" style="font-size: 28px; font-weight: ${iconWeight}; cursor: pointer; color: ${schemeColors.text};">menu</span>
                        </div>
                        <div class="header-logo">${logoHtml}</div>
                        <div class="header-menu-left header-menu-inline">
                            ${menuItems}
                        </div>
                    </div>
                    ${iconsHtml}
                </header>
            `;
            break;
            
        case 'logo-center-menu-left-inline':
            headerContent += `
                <header class="header-container">
                    <div class="header-menu-drawer-icon">
                        <span class="${iconClass}" style="font-size: 28px; font-weight: ${iconWeight}; cursor: pointer; color: ${schemeColors.text};">menu</span>
                    </div>
                    <div class="header-menu-left header-menu-inline">
                        ${menuItems}
                    </div>
                    <div class="header-logo" style="position: absolute; left: 50%; transform: translateX(-50%);">${logoHtml}</div>
                    ${iconsHtml}
                </header>
            `;
            break;
            
        case 'logo-center-menu-center-below':
            headerContent += `
                <header style="display: flex; flex-direction: column; padding: 20px 50px; border-bottom: ${config.showDivider ? `1px solid ${schemeColors.border || '#e5e5e5'}` : 'none'}; background-color: ${schemeColors.background}; color: ${schemeColors.text};">
                    <div style="display: flex; align-items: center; justify-content: space-between; height: ${headerHeight}px;">
                        <div class="header-menu-drawer-icon">
                            <span class="${iconClass}" style="font-size: 28px; font-weight: ${iconWeight}; cursor: pointer; color: ${schemeColors.text};">menu</span>
                        </div>
                        <div class="header-logo">${logoHtml}</div>
                        ${iconsHtml}
                    </div>
                    <div class="header-menu-center header-menu-inline" style="display: flex; gap: 32px; align-items: center; justify-content: center; margin-top: 20px;">
                        ${menuItems}
                    </div>
                </header>
            `;
            break;
            
        case 'logo-left-menu-left-below':
            headerContent += `
                <header style="display: flex; flex-direction: column; padding: 20px 50px; border-bottom: ${config.showDivider ? `1px solid ${schemeColors.border || '#e5e5e5'}` : 'none'}; background-color: ${schemeColors.background}; color: ${schemeColors.text};">
                    <div style="display: flex; align-items: center; justify-content: space-between; height: ${headerHeight}px;">
                        <div style="display: flex; align-items: center; gap: 20px;">
                            <div class="header-menu-drawer-icon">
                                <span class="${iconClass}" style="font-size: 28px; font-weight: ${iconWeight}; cursor: pointer; color: ${schemeColors.text};">menu</span>
                            </div>
                            <div class="header-logo">${logoHtml}</div>
                        </div>
                        ${iconsHtml}
                    </div>
                    <div class="header-menu-left header-menu-inline" style="display: flex; gap: 32px; align-items: center; margin-top: 20px;">
                        ${menuItems}
                    </div>
                </header>
            `;
            break;
            
        default:
            // Default to logo-center-menu-left-inline
            headerContent += `
                <header class="header-container">
                    <div class="header-menu-drawer-icon">
                        <span class="${iconClass}" style="font-size: 28px; font-weight: ${iconWeight}; cursor: pointer; color: ${schemeColors.text};">menu</span>
                    </div>
                    <div class="header-menu-left header-menu-inline">
                        ${menuItems}
                    </div>
                    <div class="header-logo" style="position: absolute; left: 50%; transform: translateX(-50%);">${logoHtml}</div>
                    ${iconsHtml}
                </header>
            `;
    }
    
    // Get translations for section title
    const headerTitle = (typeof translations !== 'undefined' && translations[currentLanguage]?.['sections.header']) || 
                       (typeof lang !== 'undefined' && lang['sections.header']) || 
                       'Header';
    
    // Check if we're in editor context (iframe with parent that has preview-iframe)
    const isInEditor = (typeof window !== 'undefined' && 
                       window.parent !== window && 
                       window.parent.document && 
                       window.parent.document.getElementById('preview-iframe'));
    
    // Wrap in section-wrapper with header tag (only show tag in editor)
    return `
        <div class="section-wrapper" data-section-id="header">
            ${isInEditor ? `
                <div class="section-header-tag">
                    <span class="material-symbols-outlined" style="font-size: 16px;">web_asset</span>
                    ${headerTitle}
                </div>
            ` : ''}
            ${headerContent}
        </div>
    `;
}

// Función para renderizar la barra de anuncios
function renderAnnouncementBar(config) {
    console.log('[ANNOUNCEMENT-BAR] Rendering with config:', config);
    if (!config || config.isHidden) return '';

    // Obtener anuncios visibles
    const visibleAnnouncements = [];
    
    // Intentar obtener currentSectionsConfig de diferentes fuentes
    let sectionsConfig = null;
    if (typeof window !== 'undefined' && window.currentSectionsConfig) {
        sectionsConfig = window.currentSectionsConfig;
    } else if (typeof currentSectionsConfig !== 'undefined') {
        sectionsConfig = currentSectionsConfig;
    }
    
    console.log('[ANNOUNCEMENT-BAR] sectionsConfig:', sectionsConfig);
    
    if (sectionsConfig && sectionsConfig.announcementOrder && sectionsConfig.announcements) {
        console.log('[ANNOUNCEMENT-BAR] Found announcementOrder:', sectionsConfig.announcementOrder);
        console.log('[ANNOUNCEMENT-BAR] Found announcements:', sectionsConfig.announcements);
        
        sectionsConfig.announcementOrder.forEach(id => {
            const announcement = sectionsConfig.announcements[id];
            if (announcement && !announcement.isHidden) {
                visibleAnnouncements.push({ id, ...announcement });
            }
        });
    }
    
    console.log('[ANNOUNCEMENT-BAR] Visible announcements:', visibleAnnouncements);

    if (visibleAnnouncements.length === 0) {
        visibleAnnouncements.push({ text: 'Welcome to our store!', link: '', icon: 'none' });
    }

    // Get the selected color scheme or default to scheme1
    const selectedScheme = config.colorScheme || 'scheme1';
    const schemeColors = getColorSchemeValues(selectedScheme);
    
    // Check if marquee animation is selected
    const isMarquee = config.animationStyle === 'marquee';
    
    let announcementContent;
    
    if (isMarquee && visibleAnnouncements.length > 0) {
        // Build marquee content with all announcements
        const marqueeItems = [];
        
        // Create two sets of announcements for seamless looping
        for (let i = 0; i < 2; i++) {
            visibleAnnouncements.forEach(announcement => {
                let itemText = announcement.text;
                
                // Handle icon display
                if (announcement.useCustomIcon && announcement.customIconFile) {
                    itemText = `<img src="${announcement.customIconFile}" alt="icon" style="width: 16px; height: 16px; vertical-align: middle;"> ${itemText}`;
                } else if (announcement.icon && announcement.icon !== 'none') {
                    itemText = `<span class="material-icons" style="font-size: 16px; vertical-align: middle; color: inherit;">${announcement.icon}</span> ${itemText}`;
                }
                
                if (announcement.link) {
                    itemText = `<a href="${announcement.link}" style="color: inherit; text-decoration: none;">${itemText}</a>`;
                }
                
                marqueeItems.push(`<span class="marquee-item">${itemText}</span>`);
            });
        }
        
        announcementContent = marqueeItems.join('<span class="marquee-separator">•</span>');
    } else {
        // Normal single announcement display
        // Obtener currentAnnouncementIndex de diferentes fuentes
        let announcementIndex = 0;
        if (typeof window !== 'undefined' && typeof window.currentAnnouncementIndex !== 'undefined') {
            announcementIndex = window.currentAnnouncementIndex;
        } else if (typeof currentAnnouncementIndex !== 'undefined') {
            announcementIndex = currentAnnouncementIndex;
        }
        
        if (announcementIndex >= visibleAnnouncements.length) {
            announcementIndex = 0;
        }
        
        const currentAnnouncement = visibleAnnouncements[announcementIndex];
        let announcementText = currentAnnouncement.text;
        
        // Handle icon display based on icon source
        if (currentAnnouncement.useCustomIcon && currentAnnouncement.customIconFile) {
            announcementText = `<img src="${currentAnnouncement.customIconFile}" alt="icon" style="width: 16px; height: 16px; vertical-align: middle;"> ${announcementText}`;
        } else if (currentAnnouncement.icon && currentAnnouncement.icon !== 'none') {
            announcementText = `<span class="material-icons" style="font-size: 16px; vertical-align: middle; color: inherit;">${currentAnnouncement.icon}</span> ${announcementText}`;
        }

        if (currentAnnouncement.link) {
            announcementText = `<a href="${currentAnnouncement.link}" style="color: inherit; text-decoration: none;">${announcementText}</a>`;
        }
        
        announcementContent = announcementText;
    }

    // Construir iconos sociales si están habilitados
    const socialIconsHtml = config.showSocialMediaIcons ? `
        <div style="position: absolute; left: 50px; top: 50%; transform: translateY(-50%); display: flex; align-items: center; gap: 16px;">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" style="cursor: pointer;">
                <path d="M12 0c-6.627 0-12 5.373-12 12s5.373 12 12 12 12-5.373 12-12-5.373-12-12-12zm3 8h-1.35c-.538 0-.65.221-.65.778v1.222h2l-.209 2h-1.791v7h-3v-7h-2v-2h2v-2.308c0-1.769.931-2.692 3.029-2.692h1.971v3z"/>
            </svg>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" style="cursor: pointer;">
                <path d="M19.615 3.184c-3.604-.246-11.631-.245-15.23 0-3.897.266-4.356 2.62-4.385 8.816.029 6.185.484 8.549 4.385 8.816 3.6.245 11.626.246 15.23 0 3.897-.266 4.356-2.62 4.385-8.816-.029-6.185-.484-8.549-4.385-8.816zm-10.615 12.816v-8l8 3.993-8 4.007z"/>
            </svg>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" style="cursor: pointer;">
                <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/>
            </svg>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" style="cursor: pointer;">
                <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zM5.838 12a6.162 6.162 0 1112.324 0 6.162 6.162 0 01-12.324 0zM12 16a4 4 0 110-8 4 4 0 010 8zm4.965-10.405a1.44 1.44 0 112.881.001 1.44 1.44 0 01-2.881-.001z"/>
            </svg>
        </div>
    ` : '';

    // Construir selectores si están habilitados
    const selectorsHtml = (config.showLanguageSelector || config.showCurrencySelector) ? `
        <div style="position: absolute; right: 50px; top: 50%; transform: translateY(-50%); display: flex; align-items: center; gap: 16px;">
            ${config.showLanguageSelector ? `
                <select style="border: none; background: transparent; font-size: 12px; cursor: pointer; outline: none; color: inherit;">
                    <option>Español</option>
                    <option>English</option>
                </select>
            ` : ''}
            ${config.showCurrencySelector ? `
                <select style="border: none; background: transparent; font-size: 12px; cursor: pointer; outline: none; color: inherit;">
                    <option>USD</option>
                    <option>EUR</option>
                </select>
            ` : ''}
        </div>
    ` : '';

    // Construir flechas de navegación si están habilitadas y hay múltiples anuncios (no mostrar en marquee)
    const navigationArrowsHtml = (config.showNavigationArrows && visibleAnnouncements.length > 1 && !isMarquee) ? `
        <button onclick="window.navigateAnnouncement('prev')" style="position: absolute; left: 20px; top: 50%; transform: translateY(-50%); background: none; border: none; color: inherit; cursor: pointer; padding: 4px;">
            <span class="material-symbols-outlined" style="font-size: 20px;">chevron_left</span>
        </button>
        <button onclick="window.navigateAnnouncement('next')" style="position: absolute; right: 20px; top: 50%; transform: translateY(-50%); background: none; border: none; color: inherit; cursor: pointer; padding: 4px;">
            <span class="material-symbols-outlined" style="font-size: 20px;">chevron_right</span>
        </button>
    ` : '';

    // Determinar el ancho del contenedor
    const containerStyle = config.width === 'container' 
        ? 'max-width: 1200px; margin: 0 auto; position: relative;' 
        : 'position: relative;';

    // Get typography settings for announcements
    const bodyTypography = currentGlobalThemeSettings?.typography?.body || {};
    const fontValue = bodyTypography.font || 'roboto';
    const fontFamily = window.getFontNameFromValueSafe ? window.getFontNameFromValueSafe(fontValue) : fontValue;
    const fontSize = bodyTypography.fontSize || '14px';
    
    const marqueeStyles = isMarquee ? `
        <style>
            @keyframes marquee {
                0% { transform: translateX(0); }
                100% { transform: translateX(-50%); }
            }
            
            .announcement-marquee-content {
                display: flex;
                animation: marquee 30s linear infinite;
                white-space: nowrap;
            }
            
            .marquee-item {
                padding: 0 20px;
            }
            
            .marquee-separator {
                padding: 0 20px;
                opacity: 0.5;
            }
        </style>
    ` : '';
    
    const marqueeClass = isMarquee ? 'announcement-marquee-content' : 'announcement-bar-content';
    
    // Get translations for section title
    const announcementTitle = (typeof translations !== 'undefined' && translations[currentLanguage]?.['sections.announcementBar']) || 
                             (typeof lang !== 'undefined' && lang['sections.announcementBar']) || 
                             'Announcement bar';
    
    // Check if we're in editor context
    const isInEditor = (typeof window !== 'undefined' && 
                       window.parent !== window && 
                       window.parent.document && 
                       window.parent.document.getElementById('preview-iframe'));
    
    const announcementContentHtml = isMarquee ? `
        <div class="announcement-bar-content marquee-mode" style="position: relative; padding: 10px 50px; background-color: ${schemeColors.background}; color: ${schemeColors.text}; font-family: ${fontFamily}, -apple-system, BlinkMacSystemFont, 'Segoe UI', Helvetica, Arial, sans-serif; font-size: ${fontSize}; font-weight: 400; letter-spacing: 0.04em; line-height: 1.5; overflow: hidden;">
            <div style="${containerStyle}">
                ${socialIconsHtml}
                <div class="marquee-container" style="display: flex; align-items: center; overflow: hidden;">
                    <div class="marquee-content" style="display: flex; align-items: center; gap: 30px; animation: scroll-marquee ${(visibleAnnouncements.length * 5)}s linear infinite; white-space: nowrap;">
                        ${announcementContent}
                    </div>
                </div>
                ${selectorsHtml}
            </div>
        </div>
    ` : `
        <div class="announcement-bar-content" style="position: relative; padding: 10px 50px; background-color: ${schemeColors.background}; color: ${schemeColors.text}; font-family: ${fontFamily}, -apple-system, BlinkMacSystemFont, 'Segoe UI', Helvetica, Arial, sans-serif; font-size: ${fontSize}; font-weight: 400; letter-spacing: 0.04em; line-height: 1.5;">
            <div style="${containerStyle}">
                ${socialIconsHtml}
                <div style="text-align: center;">
                    <p style="margin:0; display: inline-flex; align-items: center; justify-content: center; gap: 8px;">
                        ${announcementContent}
                    </p>
                </div>
                ${selectorsHtml}
                ${navigationArrowsHtml}
            </div>
        </div>
    `;

    return `
        <div class="section-wrapper" data-section-id="announcement">
            ${isInEditor ? `
                <div class="section-header-tag">
                    <span class="material-symbols-outlined" style="font-size: 16px;">campaign</span>
                    ${announcementTitle}
                </div>
            ` : ''}
            ${marqueeStyles}
            ${announcementContentHtml}
        </div>
    `;
}

// Función para renderizar items del menú
function renderMenuItemsForHeader(items, options) {
    const { menuFontFamily, menuFontSize, menuUppercase, menuLetterSpacing, schemeColors, openMenuDropdown } = options;
    const textTransform = menuUppercase ? 'text-transform: uppercase;' : '';
    
    // Generate unique class names for this render
    const menuItemClass = `menu-item-${Date.now()}`;
    const submenuItemClass = `submenu-item-${Date.now()}`;
    
    // Add hover styles
    const doc = document;
    let styleElement = doc.getElementById('menu-hover-styles-preview');
    if (!styleElement) {
        styleElement = document.createElement('style');
        styleElement.id = 'menu-hover-styles-preview';
        doc.head.appendChild(styleElement);
    }
    
    styleElement.textContent = `
        .${menuItemClass}:hover {
            color: ${schemeColors.foreground} !important;
            opacity: 0.8;
        }
        .${submenuItemClass}:hover {
            background-color: ${schemeColors.foreground} !important;
        }
        /* Dropdown indicator styles */
        .dropdown-indicator {
            display: inline-flex !important;
            align-items: center;
            justify-content: center;
            color: ${schemeColors.text};
            opacity: 0.7;
            vertical-align: middle;
            margin-left: 4px;
        }
        .menu-item-parent:hover .dropdown-indicator {
            opacity: 1;
        }
    `;
    
    return items.map(item => {
        // Support both 'submenus' and 'children' properties
        const children = item.submenus || item.children || [];
        const hasSubmenus = children.length > 0;
        
        if (hasSubmenus) {
            // Render dropdown menu
            const dropdownId = `dropdown-${item.id}`;
            const submenuItems = children.map(sub => `
                <a href="${sub.url}" 
                   target="${sub.target || '_self'}"
                   class="${submenuItemClass}"
                   style="display: block; padding: 8px 16px; text-decoration: none; color: ${schemeColors.text}; font-family: ${menuFontFamily}, -apple-system, BlinkMacSystemFont, 'Segoe UI', Helvetica, Arial, sans-serif; font-size: 14px; white-space: nowrap; transition: background-color 0.2s ease;">
                    ${sub.label}
                </a>
            `).join('');
            
            return `
                <div class="menu-item-with-dropdown" style="position: relative !important; display: inline-block;">
                    <a href="${item.url}" 
                       class="menu-item-parent ${menuItemClass}"
                       data-dropdown="${dropdownId}"
                       data-hover="${openMenuDropdown === 'hover' ? 'true' : 'false'}"
                       style="text-decoration: none; color: inherit; font-family: ${menuFontFamily}, -apple-system, BlinkMacSystemFont, 'Segoe UI', Helvetica, Arial, sans-serif; font-size: ${menuFontSize}; font-weight: 400; letter-spacing: ${menuLetterSpacing}px; ${textTransform} display: inline-flex; align-items: center; gap: 4px; transition: all 0.2s ease;">
                        ${item.label}
                        <span class="material-symbols-outlined dropdown-indicator" style="font-size: 20px; font-weight: 400; transition: transform 0.2s ease; vertical-align: middle;">expand_more</span>
                    </a>
                    <div id="${dropdownId}" 
                         class="menu-dropdown-content" 
                         style="display: none; position: absolute; top: 100%; left: 0; background: ${schemeColors.background}; border: 1px solid ${schemeColors.border || '#e5e5e5'}; border-radius: 4px; box-shadow: 0 2px 8px rgba(0,0,0,0.1); min-width: 200px; z-index: 10000; margin-top: 8px; padding: 8px 0;">
                        ${submenuItems}
                    </div>
                </div>
            `;
        } else {
            // Regular menu item
            return `
                <a href="${item.url}" 
                   target="${item.target || '_self'}"
                   class="${menuItemClass}"
                   style="text-decoration: none; color: inherit; font-family: ${menuFontFamily}, -apple-system, BlinkMacSystemFont, 'Segoe UI', Helvetica, Arial, sans-serif; font-size: ${menuFontSize}; font-weight: 400; letter-spacing: ${menuLetterSpacing}px; ${textTransform} transition: all 0.2s ease;">
                    ${item.label}
                </a>
            `;
        }
    }).join('');
}

// Función para abrir el menú drawer
function openDrawerMenuModal() {
    console.log('[MENU] Opening drawer menu dropdown');
    
    // Get the selected menu
    const selectedMenuId = currentSectionsConfig.header?.navigationMenuId || currentSectionsConfig.header?.navigationMenu || 'main-menu';
    
    // Try to get menus data from multiple sources
    let menusData = (typeof window !== 'undefined' && window.currentMenusData) 
        ? window.currentMenusData 
        : (typeof currentMenusData !== 'undefined' ? currentMenusData : []);
    
    // If still no menus, try to get from global theme settings
    if ((!menusData || menusData.length === 0) && typeof window !== 'undefined' && window.currentGlobalThemeSettings && window.currentGlobalThemeSettings.menus) {
        menusData = window.currentGlobalThemeSettings.menus;
    }
    
    const selectedMenu = menusData.find(m => m.id === selectedMenuId);
    
    if (!selectedMenu || !selectedMenu.items || selectedMenu.items.length === 0) {
        console.log('[MENU] No menu items to display');
        return;
    }
    
    // Check if dropdown already exists
    let existingDropdown = document.getElementById('drawer-dropdown-menu');
    if (existingDropdown) {
        existingDropdown.remove();
        return;
    }
    
    // Get the hamburger icon position
    const hamburgerIcon = document.querySelector('.header-menu-drawer, .header-menu-drawer-icon');
    if (!hamburgerIcon) return;
    
    const iconRect = hamburgerIcon.getBoundingClientRect();
    const header = hamburgerIcon.closest('header');
    const headerRect = header.getBoundingClientRect();
    
    // Get color scheme
    const colorScheme = currentSectionsConfig.header?.colorScheme || 'scheme1';
    const schemeColors = getColorSchemeValues(colorScheme);
    
    // Create dropdown container
    const dropdown = document.createElement('div');
    dropdown.id = 'drawer-dropdown-menu';
    dropdown.className = 'drawer-dropdown-menu';
    dropdown.style.cssText = `
        position: fixed;
        top: ${headerRect.bottom + 5}px;
        left: ${iconRect.left}px;
        min-width: 250px;
        background: ${schemeColors.background};
        border: 1px solid ${schemeColors.border || '#e5e5e5'};
        border-radius: 8px;
        box-shadow: 0 4px 12px rgba(0,0,0,0.1);
        z-index: 1000;
        padding: 8px 0;
        animation: slideDown 0.2s ease-out;
    `;
    
    // Add styles for animation
    if (!document.getElementById('drawer-dropdown-styles')) {
        const styleElement = document.createElement('style');
        styleElement.id = 'drawer-dropdown-styles';
        styleElement.textContent = `
            @keyframes slideDown {
                from { 
                    opacity: 0;
                    transform: translateY(-10px);
                }
                to { 
                    opacity: 1;
                    transform: translateY(0);
                }
            }
            .drawer-dropdown-menu * {
                box-shadow: none !important;
                text-shadow: none !important;
            }
        `;
        document.head.appendChild(styleElement);
    }
    
    // Render menu items
    dropdown.innerHTML = renderDrawerDropdownItems(selectedMenu.items, schemeColors);
    
    // Add to body
    document.body.appendChild(dropdown);
    
    // Get open mode
    const openMode = currentSectionsConfig.header?.openMenuDropdown || 'hover';
    
    if (openMode === 'hover') {
        // Create an invisible bridge between icon and dropdown for smooth hover
        const bridge = document.createElement('div');
        bridge.style.cssText = `
            position: fixed;
            top: ${headerRect.bottom}px;
            left: ${iconRect.left}px;
            width: ${Math.max(250, iconRect.width)}px;
            height: 10px;
            z-index: 999;
        `;
        document.body.appendChild(bridge);
        
        // Simple hover behavior
        let closeTimeout;
        
        const keepOpen = () => {
            clearTimeout(closeTimeout);
        };
        
        const scheduleClose = () => {
            closeTimeout = setTimeout(() => {
                dropdown.remove();
                bridge.remove();
            }, 300); // More forgiving delay
        };
        
        // Add listeners
        dropdown.addEventListener('mouseenter', keepOpen);
        dropdown.addEventListener('mouseleave', scheduleClose);
        hamburgerIcon.addEventListener('mouseenter', keepOpen);
        hamburgerIcon.addEventListener('mouseleave', scheduleClose);
        bridge.addEventListener('mouseenter', keepOpen);
        bridge.addEventListener('mouseleave', scheduleClose);
    } else {
        // Click mode - close on click outside
        setTimeout(() => {
            document.addEventListener('click', function closeDropdown(e) {
                if (!dropdown.contains(e.target) && !hamburgerIcon.contains(e.target)) {
                    dropdown.remove();
                    document.removeEventListener('click', closeDropdown);
                }
            });
        }, 100);
    }
    
    // Add submenu hover handlers
    attachSubmenuHandlers(dropdown, openMode);
}

// Función para renderizar items del dropdown drawer
function renderDrawerDropdownItems(items, schemeColors) {
    return items.map(item => {
        const hasChildren = item.children && item.children.length > 0;
        
        let itemHtml = `
            <div class="drawer-dropdown-item" style="position: relative;">
                <a href="${item.url || '#'}" 
                   class="menu-item-link"
                   style="display: flex; align-items: center; justify-content: space-between; padding: 8px 20px; text-decoration: none; color: ${schemeColors.text}; font-size: 14px; transition: background-color 0.2s ease;"
                   onmouseover="this.style.backgroundColor='${schemeColors.foreground}'"
                   onmouseout="this.style.backgroundColor='transparent'">
                    <span>${item.label}</span>
                    ${hasChildren ? '<span class="material-icons" style="font-size: 18px;">chevron_right</span>' : ''}
                </a>
            </div>
        `;
        
        if (hasChildren) {
            itemHtml += `
                <div class="drawer-submenu-items" style="display: none; background: ${schemeColors.foreground};">
                    ${item.children.map(child => `
                        <a href="${child.url || '#'}" 
                           class="drawer-dropdown-submenu-item menu-item-link"
                           style="display: block; padding: 8px 20px 8px 40px; text-decoration: none; color: ${schemeColors.text}; font-size: 14px; transition: background-color 0.2s ease;"
                           onmouseover="this.style.backgroundColor='${schemeColors.foreground}'"
                           onmouseout="this.style.backgroundColor='transparent'">
                            ${child.label}
                        </a>
                    `).join('')}
                </div>
            `;
        }
        
        return itemHtml;
    }).join('');
}

// Función para manejar submenús
function attachSubmenuHandlers(dropdown, openMode) {
    const menuItems = dropdown.querySelectorAll('.drawer-dropdown-item');
    
    menuItems.forEach(item => {
        const submenu = item.querySelector('.drawer-submenu-items');
        if (!submenu) return;
        
        const parentLink = item.querySelector('.menu-item-link');
        
        if (openMode === 'hover') {
            let submenuTimeout;
            
            // Show submenu on hover with delay
            item.addEventListener('mouseenter', () => {
                clearTimeout(submenuTimeout);
                submenu.style.display = 'block';
                submenu.style.animation = 'slideIn 0.2s ease-out';
                
                // Rotate arrow
                const arrow = parentLink.querySelector('.material-icons');
                if (arrow) {
                    arrow.style.transform = 'rotate(90deg)';
                    arrow.style.transition = 'transform 0.2s ease';
                }
            });
            
            item.addEventListener('mouseleave', () => {
                submenuTimeout = setTimeout(() => {
                    submenu.style.display = 'none';
                    // Reset arrow
                    const arrow = parentLink.querySelector('.material-icons');
                    if (arrow) {
                        arrow.style.transform = 'rotate(0deg)';
                    }
                }, 100); // Small delay to prevent accidental closing
            });
            
            // Keep submenu open when hovering over it
            submenu.addEventListener('mouseenter', () => {
                clearTimeout(submenuTimeout);
            });
            
            submenu.addEventListener('mouseleave', () => {
                submenuTimeout = setTimeout(() => {
                    submenu.style.display = 'none';
                    const arrow = parentLink.querySelector('.material-icons');
                    if (arrow) {
                        arrow.style.transform = 'rotate(0deg)';
                    }
                }, 100);
            });
        } else {
            // Click to toggle submenu
            parentLink.addEventListener('click', (e) => {
                e.preventDefault();
                const isOpen = submenu.style.display === 'block';
                submenu.style.display = isOpen ? 'none' : 'block';
                
                // Rotate arrow
                const arrow = parentLink.querySelector('.material-icons');
                if (arrow) {
                    arrow.style.transform = isOpen ? 'rotate(0deg)' : 'rotate(90deg)';
                    arrow.style.transition = 'transform 0.2s ease';
                }
            });
        }
    });
}

// Function to open drawer menu modal
function openDrawerMenuModal() {
    console.log('[DRAWER] openDrawerMenuModal called');
    
    // Check if drawer is currently animating
    const existingDrawer = document.getElementById('drawer-menu-modal');
    if (existingDrawer && existingDrawer.dataset.animating === 'true') {
        console.log('[DRAWER] Drawer is currently animating, ignoring call');
        return;
    }
    
    // Get selected menu configuration
    const selectedMenuId = currentSectionsConfig.header?.navigationMenuId || currentSectionsConfig.header?.navigationMenu || 'main-menu';
    const selectedMenu = currentMenusData.find(m => m.id === selectedMenuId);
    
    if (!selectedMenu || !selectedMenu.items) {
        console.error('No menu found for drawer');
        return;
    }
    
    // Check if drawer already exists
    if (existingDrawer) {
        // If drawer exists and we're in click mode, just close it
        if (currentSectionsConfig.header?.openMenuDropdown !== 'hover') {
            console.log('[DRAWER] Closing existing drawer');
            closeDrawerMenu();
        }
        return;
    }
    
    // Get color scheme
    const colorScheme = currentSectionsConfig.header?.colorScheme || 'scheme1';
    const schemeColors = getColorSchemeValues(colorScheme);
    
    // Get header configuration
    const headerConfig = currentSectionsConfig.header || {};
    const logoHtml = headerConfig.desktopLogoUrl 
        ? `<img src="${headerConfig.desktopLogoUrl}" alt="logo" style="max-height: 60px; width: auto;">`
        : `<span style="font-size: 24px; font-weight: 600; color: ${schemeColors.text};">AURORA</span>`;
    
    // Get header height to position drawer below it
    const header = document.querySelector('.header-container');
    const headerHeight = header ? header.offsetHeight : 80;
    
    // Create overlay
    const overlay = document.createElement('div');
    overlay.id = 'drawer-menu-overlay';
    overlay.style.cssText = `
        position: fixed;
        top: ${headerHeight}px;
        left: 0;
        width: 100%;
        height: calc(100vh - ${headerHeight}px);
        background: rgba(0, 0, 0, 0.5);
        z-index: 9998;
        animation: fadeIn 0.3s ease-out;
    `;
    
    // Create drawer container (400px width)
    const drawer = document.createElement('div');
    drawer.id = 'drawer-menu-modal';
    drawer.className = 'drawer-menu-modal';
    drawer.dataset.animating = 'true'; // Mark as animating
    drawer.style.cssText = `
        position: fixed;
        top: ${headerHeight}px;
        left: 0;
        width: 400px;
        max-width: 90vw;
        height: calc(100vh - ${headerHeight}px);
        background: ${schemeColors.background};
        z-index: 9999;
        display: flex;
        flex-direction: column;
        animation: slideInLeft 0.4s cubic-bezier(0.4, 0.0, 0.2, 1);
        box-shadow: 2px 0 10px rgba(0, 0, 0, 0.15);
    `;
    
    // Remove animating flag after animation completes
    setTimeout(() => {
        drawer.dataset.animating = 'false';
    }, 400);
    
    // Create header section - only close button
    const drawerHeader = `
        <div class="drawer-header" style="
            display: flex;
            align-items: center;
            justify-content: flex-start;
            padding: 28px 30px;
            border-bottom: 1px solid ${schemeColors.border || 'rgba(255,255,255,0.1)'};
        ">
            <button class="drawer-close-btn" style="
                background: none;
                border: none;
                font-size: 24px;
                cursor: pointer;
                color: ${schemeColors.text};
                padding: 8px;
                display: flex;
                align-items: center;
                justify-content: center;
            ">
                <span class="material-symbols-outlined">close</span>
            </button>
        </div>
    `;
    
    // Create menu content
    const drawerContent = `
        <div class="drawer-content" style="
            flex: 1;
            overflow-y: auto;
            padding: 0;
        ">
            <div class="drawer-menu-container" id="drawer-menu-main" style="
                display: flex;
                flex-direction: column;
                min-height: 100%;
            ">
                ${renderDrawerMenuItems(selectedMenu.items, schemeColors, 'main')}
            </div>
        </div>
    `;
    
    drawer.innerHTML = drawerHeader + drawerContent;
    
    // Add overlay and drawer to body
    document.body.appendChild(overlay);
    document.body.appendChild(drawer);
    
    // Get open mode configuration
    const openMode = currentSectionsConfig.header?.openMenuDropdown || 'hover';
    
    if (openMode === 'hover') {
        // For hover mode, close drawer when mouse leaves both drawer and hamburger
        let closeTimeout;
        
        const scheduleClose = () => {
            closeTimeout = setTimeout(() => {
                closeDrawerMenu();
            }, 300);
        };
        
        const cancelClose = () => {
            clearTimeout(closeTimeout);
        };
        
        // Keep drawer open when hovering over it
        drawer.addEventListener('mouseenter', cancelClose);
        drawer.addEventListener('mouseleave', scheduleClose);
        
        // Also check hamburger icon
        const hamburgerIcon = document.querySelector('.header-menu-drawer, .header-menu-drawer-icon');
        if (hamburgerIcon) {
            hamburgerIcon.addEventListener('mouseenter', cancelClose);
            hamburgerIcon.addEventListener('mouseleave', scheduleClose);
        }
        
        // Don't close on overlay click in hover mode
        overlay.addEventListener('click', (e) => {
            e.preventDefault();
        });
    } else {
        // Click mode - close on overlay click
        overlay.addEventListener('click', closeDrawerMenu);
    }
    
    // Add or update styles
    let styleElement = document.getElementById('drawer-menu-styles');
    if (!styleElement) {
        styleElement = document.createElement('style');
        styleElement.id = 'drawer-menu-styles';
        document.head.appendChild(styleElement);
    }
    
    styleElement.textContent = `
        @keyframes slideInLeft {
            from { 
                transform: translateX(-100%);
                opacity: 0;
            }
            to { 
                transform: translateX(0);
                opacity: 1;
            }
        }
        
        @keyframes slideOutLeft {
            from { 
                transform: translateX(0);
            }
            to { 
                transform: translateX(-100%);
            }
        }
        
        @keyframes slideInRight {
            from { 
                transform: translateX(100%);
                opacity: 0;
            }
            to { 
                transform: translateX(0);
                opacity: 1;
            }
        }
        
        @keyframes slideOutRight {
            from { 
                transform: translateX(0);
                opacity: 1;
            }
            to { 
                transform: translateX(100%);
                opacity: 0;
            }
        }
        
        @keyframes fadeIn {
            from { 
                opacity: 0;
            }
            to { 
                opacity: 1;
            }
        }
        
        @keyframes fadeOut {
            from { 
                opacity: 1;
            }
            to { 
                opacity: 0;
            }
        }
        
        /* Prevent flicker during animations */
        .drawer-menu-modal {
            will-change: transform;
            backface-visibility: hidden;
            -webkit-backface-visibility: hidden;
            -moz-backface-visibility: hidden;
            transform: translateZ(0);
            -webkit-transform: translateZ(0);
            -moz-transform: translateZ(0);
        }
        
        .drawer-menu-modal * {
            box-sizing: border-box;
        }
        
        .drawer-close-btn {
            transition: opacity 0.2s ease, transform 0.2s ease;
        }
        
        .drawer-close-btn:hover {
            opacity: 0.7;
            transform: scale(1.1);
        }
        
        .drawer-menu-item {
            transition: background-color 0.3s ease, transform 0.2s ease;
        }
        
        .drawer-menu-item:active {
            transform: scale(0.98);
        }
        
        .drawer-submenu-item {
            transition: background-color 0.3s ease, padding-left 0.2s ease;
        }
        
        .drawer-submenu-item:hover {
            padding-left: 40px;
        }
        
        /* Prevent body scroll when drawer is open */
        body.drawer-open {
            overflow: hidden;
        }
    `;
    
    // Prevent body scroll
    document.body.classList.add('drawer-open');
    
    // Attach close button handler
    const closeBtn = drawer.querySelector('.drawer-close-btn');
    if (closeBtn) {
        closeBtn.addEventListener('click', closeDrawerMenu);
    }
    
    // Attach menu item event handlers based on configuration
    const menuItems = drawer.querySelectorAll('.drawer-menu-item');
    const openMenuDropdown = currentSectionsConfig.header?.openMenuDropdown || 'hover';
    
    menuItems.forEach(item => {
        const itemId = item.getAttribute('data-item-id');
        const hasSubmenu = item.classList.contains('has-submenu');
        
        // Add hover effects for background color
        item.addEventListener('mouseenter', function() {
            this.style.backgroundColor = schemeColors.foreground || 'rgba(255,255,255,0.05)';
        });
        
        item.addEventListener('mouseleave', function() {
            this.style.backgroundColor = 'transparent';
        });
        
        // Handle submenu opening based on configuration
        if (hasSubmenu && openMenuDropdown === 'hover') {
            // Hover behavior for submenus
            let hoverTimeout;
            
            item.addEventListener('mouseenter', function() {
                clearTimeout(hoverTimeout);
                console.log('[PREVIEW DRAWER] Menu item hovered:', {
                    itemId: itemId,
                    hasSubmenu: hasSubmenu,
                    itemText: this.textContent.trim()
                });
                
                // Find the menu item data - convert to string for comparison
                const menuData = selectedMenu.items.find(i => String(i.id) === String(itemId));
                console.log('[PREVIEW DRAWER] Menu data found:', menuData);
                
                if (menuData && menuData.submenus) {
                    console.log('[PREVIEW DRAWER] Showing submenu with items:', menuData.submenus);
                    // Delay slightly to avoid accidental hovers
                    hoverTimeout = setTimeout(() => {
                        showDrawerSubmenu(menuData.label, menuData.submenus, schemeColors);
                    }, 200);
                }
            });
            
            item.addEventListener('mouseleave', function() {
                clearTimeout(hoverTimeout);
            });
            
            // Still allow click for navigation if no submenus
            item.addEventListener('click', function() {
                const menuData = selectedMenu.items.find(i => String(i.id) === String(itemId));
                if (menuData && menuData.url && !menuData.submenus) {
                    window.location.href = menuData.url;
                }
            });
        } else {
            // Click behavior (default or when configured)
            item.addEventListener('click', function() {
                console.log('[PREVIEW DRAWER] Menu item clicked:', {
                    itemId: itemId,
                    hasSubmenu: hasSubmenu,
                    itemText: this.textContent.trim()
                });
                
                if (hasSubmenu) {
                    // Find the menu item data - convert to string for comparison
                    const menuData = selectedMenu.items.find(i => String(i.id) === String(itemId));
                    console.log('[PREVIEW DRAWER] Menu data found:', menuData);
                    console.log('[PREVIEW DRAWER] Available items:', selectedMenu.items.map(i => ({id: i.id, label: i.label})));
                    
                    if (menuData && menuData.submenus) {
                        console.log('[PREVIEW DRAWER] Showing submenu with items:', menuData.submenus);
                        // Show submenu
                        showDrawerSubmenu(menuData.label, menuData.submenus, schemeColors);
                    } else {
                        console.warn('[PREVIEW DRAWER] No submenus found for item:', itemId);
                    }
                } else {
                    // Navigate to URL - convert to string for comparison
                    const menuData = selectedMenu.items.find(i => String(i.id) === String(itemId));
                    if (menuData && menuData.url) {
                        window.location.href = menuData.url;
                    }
                }
            });
        }
    });
}

// Function to close drawer menu
function closeDrawerMenu() {
    const drawer = document.getElementById('drawer-menu-modal');
    const overlay = document.getElementById('drawer-menu-overlay');
    
    // Check if already animating
    if (drawer && drawer.dataset.animating === 'true') {
        console.log('[DRAWER] Already animating, ignoring close request');
        return;
    }
    
    if (drawer) {
        // Mark as animating
        drawer.dataset.animating = 'true';
        // Prevent multiple animations
        drawer.style.animation = '';
        // Force reflow
        drawer.offsetHeight;
        // Apply closing animation
        drawer.style.animation = 'slideOutLeft 0.4s cubic-bezier(0.4, 0.0, 0.2, 1) forwards';
    }
    if (overlay) {
        // Prevent multiple animations
        overlay.style.animation = '';
        // Force reflow
        overlay.offsetHeight;
        // Apply closing animation
        overlay.style.animation = 'fadeOut 0.4s cubic-bezier(0.4, 0.0, 0.2, 1) forwards';
    }
    
    // Wait for animation to complete before removing
    setTimeout(() => {
        if (drawer) drawer.remove();
        if (overlay) overlay.remove();
        document.body.classList.remove('drawer-open');
    }, 400);
}

// Function to render drawer menu items with new design
function renderDrawerMenuItems(items, schemeColors, level = 'main') {
    console.log('[PREVIEW DRAWER] renderDrawerMenuItems called:', {
        items: items,
        level: level,
        itemCount: items ? items.length : 0
    });
    
    if (level === 'main') {
        return items.map(item => {
            const hasSubmenus = item.submenus && item.submenus.length > 0;
            console.log('[PREVIEW DRAWER] Rendering item:', {
                id: item.id,
                label: item.label,
                hasSubmenus: hasSubmenus,
                submenuCount: item.submenus ? item.submenus.length : 0
            });
            
            return `
                <div class="drawer-menu-item ${hasSubmenus ? 'has-submenu' : ''}" 
                     data-item-id="${item.id}"
                     style="
                        display: flex;
                        align-items: center;
                        justify-content: space-between;
                        padding: 28px 30px;
                        cursor: pointer;
                        color: ${schemeColors.text};
                        font-size: 18px;
                        font-weight: 500;
                        transition: background 0.2s ease;
                     ">
                    <span>${item.label}</span>
                    ${hasSubmenus ? `<span class="material-symbols-outlined" style="font-size: 24px; margin-right: 8px;">chevron_right</span>` : ''}
                </div>
            `;
        }).join('');
    } else {
        // Render submenu view
        return `
            <div class="drawer-submenu-header" style="
                display: flex;
                align-items: center;
                padding: 20px 30px;
                border-bottom: 1px solid ${schemeColors.border || 'rgba(255,255,255,0.1)'};
            ">
                <button class="drawer-back-btn" onclick="showMainMenu()" style="
                    background: none;
                    border: none;
                    color: ${schemeColors.text};
                    cursor: pointer;
                    display: flex;
                    align-items: center;
                    gap: 10px;
                    font-size: 16px;
                    padding: 0;
                ">
                    <span class="material-symbols-outlined">chevron_left</span>
                </button>
                <h3 style="
                    margin: 0 0 0 20px;
                    font-size: 16px;
                    font-weight: 600;
                    text-transform: uppercase;
                    letter-spacing: 0.08em;
                    color: ${schemeColors.text};
                ">${level}</h3>
            </div>
            ${items.map(item => `
                <div class="drawer-submenu-item" 
                     style="
                        display: block;
                        padding: 16px 30px;
                        color: ${schemeColors.text};
                        font-size: 16px;
                        transition: background 0.2s ease;
                        cursor: pointer;
                        text-decoration: none;
                     "
                     onclick="window.location.href='${item.url}'">
                    ${item.label}
                </div>
            `).join('')}
        `;
    }
}

// Function to show drawer submenu
function showDrawerSubmenu(parentLabel, submenus, schemeColors) {
    console.log('[PREVIEW DRAWER] showDrawerSubmenu called with:', {
        parentLabel: parentLabel,
        submenus: submenus,
        schemeColors: schemeColors
    });
    
    const menuContainer = document.getElementById('drawer-menu-main');
    
    if (!menuContainer) {
        console.error('[PREVIEW DRAWER] Menu container not found');
        return;
    }
    
    // Animate out current content
    menuContainer.style.animation = 'slideOutLeft 0.4s cubic-bezier(0.4, 0.0, 0.2, 1)';
    
    setTimeout(() => {
        // Update content with submenu
        menuContainer.innerHTML = renderDrawerMenuItems(submenus, schemeColors, parentLabel);
        menuContainer.style.animation = 'slideInLeft 0.4s cubic-bezier(0.4, 0.0, 0.2, 1)';
        
        // Attach back button handler
        const backBtn = menuContainer.querySelector('.drawer-back-btn');
        if (backBtn) {
            backBtn.addEventListener('click', function() {
                showMainMenu();
            });
        }
        
        // Attach hover effects to submenu items
        const submenuItems = menuContainer.querySelectorAll('.drawer-submenu-item');
        submenuItems.forEach(item => {
            item.addEventListener('mouseenter', function() {
                this.style.backgroundColor = schemeColors.foreground || 'rgba(255,255,255,0.05)';
            });
            
            item.addEventListener('mouseleave', function() {
                this.style.backgroundColor = 'transparent';
            });
        });
    }, 300);
}

// Function to show main menu (back from submenu)
function showMainMenu() {
    const menuContainer = document.getElementById('drawer-menu-main');
    
    if (!menuContainer) return;
    
    // Get current configuration
    const selectedMenuId = currentSectionsConfig.header?.navigationMenuId || currentSectionsConfig.header?.navigationMenu || 'main-menu';
    const selectedMenu = currentMenusData.find(m => m.id === selectedMenuId);
    const colorScheme = currentSectionsConfig.header?.colorScheme || 'scheme1';
    const schemeColors = getColorSchemeValues(colorScheme);
    
    if (!selectedMenu || !selectedMenu.items) return;
    
    // Animate out current content
    menuContainer.style.animation = 'slideOutRight 0.4s cubic-bezier(0.4, 0.0, 0.2, 1)';
    
    setTimeout(() => {
        // Update content with main menu
        menuContainer.innerHTML = renderDrawerMenuItems(selectedMenu.items, schemeColors, 'main');
        menuContainer.style.animation = 'slideInRight 0.4s cubic-bezier(0.4, 0.0, 0.2, 1)';
        
        // Re-attach menu item event handlers with proper configuration
        const menuItems = menuContainer.querySelectorAll('.drawer-menu-item');
        const openMenuDropdown = currentSectionsConfig.header?.openMenuDropdown || 'hover';
        
        menuItems.forEach(item => {
            const itemId = item.getAttribute('data-item-id');
            const hasSubmenu = item.classList.contains('has-submenu');
            
            // Add hover effects for background color
            item.addEventListener('mouseenter', function() {
                this.style.backgroundColor = schemeColors.foreground || 'rgba(255,255,255,0.05)';
            });
            
            item.addEventListener('mouseleave', function() {
                this.style.backgroundColor = 'transparent';
            });
            
            // Handle submenu opening based on configuration
            if (hasSubmenu && openMenuDropdown === 'hover') {
                // Hover behavior for submenus
                let hoverTimeout;
                
                item.addEventListener('mouseenter', function() {
                    clearTimeout(hoverTimeout);
                    const menuData = selectedMenu.items.find(i => String(i.id) === String(itemId));
                    if (menuData && menuData.submenus) {
                        hoverTimeout = setTimeout(() => {
                            showDrawerSubmenu(menuData.label, menuData.submenus, schemeColors);
                        }, 200);
                    }
                });
                
                item.addEventListener('mouseleave', function() {
                    clearTimeout(hoverTimeout);
                });
                
                // Still allow click for navigation if no submenus
                item.addEventListener('click', function() {
                    const menuData = selectedMenu.items.find(i => String(i.id) === String(itemId));
                    if (menuData && menuData.url && !menuData.submenus) {
                        window.location.href = menuData.url;
                    }
                });
            } else {
                // Click behavior
                item.addEventListener('click', function() {
                    if (hasSubmenu) {
                        const menuData = selectedMenu.items.find(i => String(i.id) === String(itemId));
                        if (menuData && menuData.submenus) {
                            showDrawerSubmenu(menuData.label, menuData.submenus, schemeColors);
                        }
                    } else {
                        const menuData = selectedMenu.items.find(i => String(i.id) === String(itemId));
                        if (menuData && menuData.url) {
                            window.location.href = menuData.url;
                        }
                    }
                });
            }
        });
    }, 300);
}

// Add global functions to window for onclick usage
window.showMainMenu = showMainMenu;
window.showDrawerSubmenu = showDrawerSubmenu;

// Función para adjuntar event listeners de dropdown
function attachDropdownMenuListeners(doc) {
    const openMenuDropdown = currentSectionsConfig.header?.openMenuDropdown || 'hover';
    
    // Handler for hamburger menu
    const menuIcons = doc.querySelectorAll('.header-menu-drawer .material-icons, .header-menu-drawer .material-symbols-outlined, .header-menu-drawer-icon .material-icons, .header-menu-drawer-icon .material-symbols-outlined');
    
    menuIcons.forEach(menuIcon => {
        if (openMenuDropdown === 'hover') {
            // Hover behavior
            menuIcon.addEventListener('mouseenter', function(e) {
                e.preventDefault();
                e.stopPropagation();
                openDrawerMenuModal();
            });
            
            // Keep dropdown open when hovering over it
            menuIcon.addEventListener('mouseleave', function(e) {
                setTimeout(() => {
                    const dropdown = doc.getElementById('drawer-dropdown-menu');
                    if (dropdown && !dropdown.matches(':hover')) {
                        dropdown.remove();
                    }
                }, 100);
            });
        } else {
            // Click behavior
            menuIcon.addEventListener('click', function(e) {
                e.preventDefault();
                e.stopPropagation();
                openDrawerMenuModal();
            });
        }
    });
    
    // Handler for menu items with dropdowns
    const menuItemsWithDropdown = doc.querySelectorAll('.menu-item-with-dropdown');
    
    menuItemsWithDropdown.forEach(item => {
        const parentLink = item.querySelector('.menu-item-parent');
        
        const dropdownId = parentLink.getAttribute('data-dropdown');
        const dropdown = doc.getElementById(dropdownId);
        
        if (!dropdown) {
            console.warn('[PREVIEW DEBUG] Dropdown not found for ID:', dropdownId);
            return;
        }
        
        console.log('[PREVIEW DEBUG] Processing menu item:', {
            label: parentLink.textContent.trim(),
            dropdownId: dropdownId,
            dropdownFound: !!dropdown,
            isHoverEnabled: openMenuDropdown === 'hover'
        });
        
        if (openMenuDropdown === 'hover') {
            let hoverTimeout;
            
            item.addEventListener('mouseenter', function() {
                clearTimeout(hoverTimeout);
                console.log('[PREVIEW DEBUG] Mouse entered menu item, showing dropdown');
                dropdown.style.display = 'block';
                dropdown.style.opacity = '1';
                dropdown.style.visibility = 'visible';
                // Rotate dropdown indicator
                const indicator = parentLink.querySelector('.dropdown-indicator');
                if (indicator) indicator.style.transform = 'rotate(180deg)';
            });
            
            item.addEventListener('mouseleave', function() {
                hoverTimeout = setTimeout(() => {
                    dropdown.style.display = 'none';
                    // Reset dropdown indicator
                    const indicator = parentLink.querySelector('.dropdown-indicator');
                    if (indicator) indicator.style.transform = 'rotate(0deg)';
                }, 200);
            });
            
            dropdown.addEventListener('mouseenter', function() {
                clearTimeout(hoverTimeout);
            });
            
            dropdown.addEventListener('mouseleave', function() {
                dropdown.style.display = 'none';
                // Reset dropdown indicator
                const indicator = parentLink.querySelector('.dropdown-indicator');
                if (indicator) indicator.style.transform = 'rotate(0deg)';
            });
        } else {
            parentLink.addEventListener('click', function(e) {
                e.preventDefault();
                console.log('[PREVIEW DEBUG] Menu item clicked');
                const isOpen = dropdown.style.display === 'block';
                
                // Close all other dropdowns
                doc.querySelectorAll('.menu-dropdown-content').forEach(d => {
                    if (d !== dropdown) {
                        d.style.display = 'none';
                        const parentItem = doc.querySelector(`[data-dropdown="${d.id}"]`);
                        if (parentItem) {
                            const ind = parentItem.querySelector('.dropdown-indicator');
                            if (ind) ind.style.transform = 'rotate(0deg)';
                        }
                    }
                });
                
                // Toggle current dropdown
                dropdown.style.display = isOpen ? 'none' : 'block';
                dropdown.style.opacity = isOpen ? '0' : '1';
                dropdown.style.visibility = isOpen ? 'hidden' : 'visible';
                console.log('[PREVIEW DEBUG] Dropdown toggled:', {isOpen: !isOpen, dropdownId: dropdownId});
                
                // Rotate dropdown indicator
                const indicator = parentLink.querySelector('.dropdown-indicator');
                if (indicator) {
                    indicator.style.transform = isOpen ? 'rotate(0deg)' : 'rotate(180deg)';
                }
            });
        }
    });
}

// Función para generar el contenido de una slide
function generateSlideContent(slide, schemeColors) {
    if (!slide.container) {
        return ''; // No content if container is false
    }
    
    // Get typography settings
    const headingTypography = currentGlobalThemeSettings?.typography?.heading || {};
    const bodyTypography = currentGlobalThemeSettings?.typography?.body || {};
    
    const headingFontValue = headingTypography.font || 'helvetica';
    const headingFontFamily = window.getFontNameFromValueSafe ? window.getFontNameFromValueSafe(headingFontValue) : headingFontValue;
    const headingUppercase = headingTypography.uppercase || false;
    const headingLetterSpacing = headingTypography.letterSpacing || 0;
    
    // Get title size based on slide configuration
    let headingFontSize = '36px'; // Default
    if (slide.titleSize === 'small' || slide.titleSize === 'pequeño') {
        headingFontSize = '24px';
    } else if (slide.titleSize === 'medium' || slide.titleSize === 'mediano') {
        headingFontSize = '36px';
    } else if (slide.titleSize === 'large' || slide.titleSize === 'grande') {
        headingFontSize = '48px';
    } else if (slide.titleSize === 'extraLarge' || slide.titleSize === 'extraGrande') {
        headingFontSize = '64px';
    } else if (slide.titleSize === 'superExtraLarge' || slide.titleSize === 'superExtraGrande') {
        headingFontSize = '80px';
    }
    
    const bodyFontValue = bodyTypography.font || 'roboto';
    const bodyFontFamily = window.getFontNameFromValueSafe ? window.getFontNameFromValueSafe(bodyFontValue) : bodyFontValue;
    const bodyFontSize = bodyTypography.fontSize || '16px';
    
    // Determine content position (grid alignment)
    let gridAlign = 'center'; // Default
    let gridJustify = 'center'; // Default
    
    // Map content position values
    if (slide.contentPosition) {
        const positionMap = {
            'arriba-izquierda': { align: 'start', justify: 'start' },
            'arriba-centro': { align: 'start', justify: 'center' },
            'arriba-derecha': { align: 'start', justify: 'end' },
            'centro-izquierda': { align: 'center', justify: 'start' },
            'centro-centro': { align: 'center', justify: 'center' },
            'centro-derecha': { align: 'center', justify: 'end' },
            'abajo-izquierda': { align: 'end', justify: 'start' },
            'abajo-centro': { align: 'end', justify: 'center' },
            'abajo-derecha': { align: 'end', justify: 'end' }
        };
        
        const position = positionMap[slide.contentPosition];
        if (position) {
            gridAlign = position.align;
            gridJustify = position.justify;
        }
    }
    
    // Determine text alignment
    let textAlign = 'left'; // Default
    if (slide.contentAlignment) {
        const alignmentMap = {
            'izquierda': 'left',
            'centrado': 'center',
            'derecha': 'right'
        };
        textAlign = alignmentMap[slide.contentAlignment] || 'left';
    }
    
    return `
        <div class="slide-content" style="position: absolute; top: 0; left: 0; right: 0; bottom: 0; display: flex; align-items: ${gridAlign}; justify-content: ${gridJustify}; padding: 40px; z-index: 2;">
            <div class="slide-content-inner" style="max-width: 600px; text-align: ${textAlign};" data-mobile-align="${slide.mobileContentAlignment || 'centrado'}">
                ${slide.title ? `<h2 style="margin: 0 0 20px 0; font-family: ${headingFontFamily}, -apple-system, BlinkMacSystemFont, 'Segoe UI', Helvetica, Arial, sans-serif; font-size: ${headingFontSize}; color: ${schemeColors.text}; ${headingUppercase ? 'text-transform: uppercase;' : ''} letter-spacing: ${headingLetterSpacing}px; font-weight: 600;">${slide.title}</h2>` : ''}
                ${slide.subtitle ? `<p style="margin: 0 0 30px 0; font-family: ${bodyFontFamily}, -apple-system, BlinkMacSystemFont, 'Segoe UI', Helvetica, Arial, sans-serif; font-size: ${bodyFontSize}; color: ${schemeColors.text}; opacity: 0.8; line-height: 1.5;">${slide.subtitle}</p>` : ''}
                ${slide.buttonText ? `
                    <a href="${slide.buttonLink || '#'}" class="slide-button" style="display: inline-block; padding: 12px 30px; background: ${schemeColors['solid-button'] || schemeColors.primary || '#121212'}; color: ${schemeColors['solid-button-text'] || '#FFFFFF'}; border: none; border-radius: 4px; font-family: ${bodyFontFamily}, -apple-system, BlinkMacSystemFont, 'Segoe UI', Helvetica, Arial, sans-serif; font-size: 16px; cursor: pointer; font-weight: 500; transition: all 0.3s ease; text-decoration: none;">
                        ${slide.buttonText}
                    </a>
                ` : ''}
            </div>
        </div>
    `;
}

// Función para renderizar el slideshow
function renderSlideshow(config) {
    console.log('[SLIDESHOW] Rendering slideshow with config:', config);
    
    if (!config || config.isHidden) {
        return '';
    }
    
    const slides = config.slides || {};
    const slideOrder = config.slideOrder || [];
    const slideshowConfig = config.config || {};
    
    // Filter visible slides
    const visibleSlides = slideOrder.filter(slideId => 
        slides[slideId] && !slides[slideId].isHidden
    );
    
    if (visibleSlides.length === 0) {
        return '';
    }
    
    // Get current slide (will be managed by JavaScript for autorotate)
    const currentSlideId = visibleSlides[0];
    const currentSlide = slides[currentSlideId];
    
    // Generate unique ID for this slideshow instance
    const slideshowId = 'slideshow-' + Date.now();
    
    // Get color scheme
    const colorScheme = currentSlide.colorScheme || 'scheme1';
    const schemeColors = getColorSchemeValues(colorScheme);
    
    // Get typography settings
    const headingTypography = currentGlobalThemeSettings?.typography?.heading || {};
    const bodyTypography = currentGlobalThemeSettings?.typography?.body || {};
    
    const headingFontValue = headingTypography.font || 'helvetica';
    const headingFontFamily = window.getFontNameFromValueSafe(headingFontValue);
    const headingUppercase = headingTypography.uppercase || false;
    const headingLetterSpacing = headingTypography.letterSpacing || 0;
    
    // Get title size based on slide configuration
    let headingFontSize = '36px'; // Default
    // Handle both Spanish and English values
    if (currentSlide.titleSize === 'small' || currentSlide.titleSize === 'pequeño') {
        headingFontSize = '24px';
    } else if (currentSlide.titleSize === 'medium' || currentSlide.titleSize === 'mediano') {
        headingFontSize = '36px';
    } else if (currentSlide.titleSize === 'large' || currentSlide.titleSize === 'grande') {
        headingFontSize = '48px';
    } else if (currentSlide.titleSize === 'extraLarge' || currentSlide.titleSize === 'extraGrande') {
        headingFontSize = '64px';
    } else if (currentSlide.titleSize === 'superExtraLarge' || currentSlide.titleSize === 'superExtraGrande') {
        headingFontSize = '80px';
    }
    
    const bodyFontValue = bodyTypography.font || 'roboto';
    const bodyFontFamily = window.getFontNameFromValueSafe(bodyFontValue);
    const bodyFontSize = bodyTypography.fontSize || '16px';
    
    // Build slide content
    let slideContentHtml = '';
    if (currentSlide.title || currentSlide.subtitle || currentSlide.buttonText) {
        const contentAlignment = currentSlide.contentPosition === 'left' ? 'flex-start' : 
                               currentSlide.contentPosition === 'right' ? 'flex-end' : 'center';
        const textAlign = currentSlide.contentPosition === 'left' ? 'left' : 
                         currentSlide.contentPosition === 'right' ? 'right' : 'center';
        
        slideContentHtml = `
            <div style="position: absolute; top: 0; left: 0; right: 0; bottom: 0; display: flex; align-items: center; justify-content: ${contentAlignment}; padding: 40px; z-index: 2;">
                <div style="max-width: 600px; text-align: ${textAlign};">
                    ${currentSlide.title ? `<h2 style="margin: 0 0 20px 0; font-family: ${headingFontFamily}, -apple-system, BlinkMacSystemFont, 'Segoe UI', Helvetica, Arial, sans-serif; font-size: ${headingFontSize}; color: ${schemeColors.text}; ${headingUppercase ? 'text-transform: uppercase;' : ''} letter-spacing: ${headingLetterSpacing}px; font-weight: 600;">${currentSlide.title}</h2>` : ''}
                    ${currentSlide.subtitle ? `<p style="margin: 0 0 30px 0; font-family: ${bodyFontFamily}, -apple-system, BlinkMacSystemFont, 'Segoe UI', Helvetica, Arial, sans-serif; font-size: ${bodyFontSize}; color: ${schemeColors.text}; opacity: 0.8; line-height: 1.5;">${currentSlide.subtitle}</p>` : ''}
                    ${currentSlide.buttonText ? `
                        <button style="padding: 12px 30px; background: ${schemeColors['solid-button'] || schemeColors.primary || '#121212'}; color: ${schemeColors['solid-button-text'] || '#FFFFFF'}; border: none; border-radius: 4px; font-family: ${bodyFontFamily}, -apple-system, BlinkMacSystemFont, 'Segoe UI', Helvetica, Arial, sans-serif; font-size: 16px; cursor: pointer; font-weight: 500; transition: all 0.3s ease;">
                            ${currentSlide.buttonText}
                        </button>
                    ` : ''}
                </div>
            </div>
        `;
    }
    
    // Determine height style based on configuration
    let heightStyle = 'height: 400px;'; // Default
    if (slideshowConfig.height === 'adaptToFirstImage') {
        heightStyle = 'min-height: 400px;';
    } else if (slideshowConfig.height === 'small') {
        heightStyle = 'height: 300px;';
    } else if (slideshowConfig.height === 'medium') {
        heightStyle = 'height: 500px;';
    } else if (slideshowConfig.height === 'large') {
        // Check if we're in the preview real (not in editor iframe)
        const isInEditor = (typeof window !== 'undefined' && 
                           window.parent !== window && 
                           window.parent.document && 
                           window.parent.document.getElementById('preview-iframe'));
        
        // Use 900px for preview real, 700px for editor
        heightStyle = isInEditor ? 'height: 700px;' : 'height: 900px;';
    }
    
    // Debug log para verificar la altura en el preview real
    console.log('[SLIDESHOW] Height Debug:', {
        configuredHeight: slideshowConfig.height,
        appliedHeightStyle: heightStyle,
        isInEditor: (typeof window !== 'undefined' && window.parent !== window),
        context: (typeof window !== 'undefined' && window.parent !== window) ? 'Editor' : 'Preview Real'
    });
    
    // Build navigation arrows
    const navigationArrowsHtml = (slideshowConfig.showNavigationArrows && visibleSlides.length > 1) ? `
        <button class="slideshow-nav-prev" style="position: absolute; left: 20px; top: 50%; transform: translateY(-50%); background: rgba(255,255,255,0.8); border: none; width: 40px; height: 40px; border-radius: 50%; cursor: pointer; display: flex; align-items: center; justify-content: center; z-index: 3;">
            <span class="material-symbols-outlined">chevron_left</span>
        </button>
        <button class="slideshow-nav-next" style="position: absolute; right: 20px; top: 50%; transform: translateY(-50%); background: rgba(255,255,255,0.8); border: none; width: 40px; height: 40px; border-radius: 50%; cursor: pointer; display: flex; align-items: center; justify-content: center; z-index: 3;">
            <span class="material-symbols-outlined">chevron_right</span>
        </button>
    ` : '';
    
    // Build pagination
    let paginationHtml = '';
    if (slideshowConfig.showPagination && visibleSlides.length > 1) {
        if (slideshowConfig.paginationType === 'dots') {
            paginationHtml = `
                <div class="slideshow-pagination-container" style="position: absolute; bottom: 0; left: 0; right: 0; background: linear-gradient(to top, rgba(0,0,0,0.5), transparent); padding: 20px 0 15px; z-index: 3;">
                    <div class="slideshow-pagination-dots" style="display: flex; gap: 10px; justify-content: center; align-items: center;">
                        ${visibleSlides.map((slideId, index) => {
                            const slide = slides[slideId];
                            const slideColorScheme = slide.colorScheme || 'scheme1';
                            const slideSchemeColors = getColorSchemeValues(slideColorScheme);
                            
                            return `
                                <button class="pagination-dot" 
                                        data-slide-index="${index}" 
                                        style="width: 10px; height: 10px; border-radius: 50%; border: none; background: ${slideSchemeColors.text}; opacity: ${index === 0 ? '1' : '0.3'}; cursor: pointer; padding: 0; transition: opacity 0.3s ease;">
                                </button>
                            `;
                        }).join('')}
                    </div>
                </div>
            `;
        } else if (slideshowConfig.paginationType === 'counter') {
            paginationHtml = `
                <div class="slideshow-pagination" style="position: absolute; bottom: 20px; left: 50%; transform: translateX(-50%); color: ${schemeColors.text}; font-family: ${bodyFontFamily}; z-index: 3;">
                    1 / ${visibleSlides.length}
                </div>
            `;
        } else if (slideshowConfig.paginationType === 'numbers') {
            paginationHtml = `
                <div class="slideshow-pagination-container" style="position: absolute; bottom: 0; left: 0; right: 0; background: linear-gradient(to top, rgba(0,0,0,0.5), transparent); padding: 20px 0 15px; z-index: 3;">
                    <div class="slideshow-pagination-numbers" style="display: flex; gap: 15px; justify-content: center; align-items: center;">
                        ${visibleSlides.map((slideId, index) => {
                            const slide = slides[slideId];
                            const slideColorScheme = slide.colorScheme || 'scheme1';
                            const slideSchemeColors = getColorSchemeValues(slideColorScheme);
                            
                            return `
                                <button class="pagination-number" 
                                        data-slide-index="${index}" 
                                        style="width: 30px; height: 30px; border-radius: 4px; border: none; background: ${index === 0 ? slideSchemeColors.text : 'transparent'}; color: ${index === 0 ? slideSchemeColors.background : slideSchemeColors.text}; cursor: pointer; padding: 0; font-family: ${bodyFontFamily}; font-size: 14px; font-weight: 500; transition: all 0.3s ease;">
                                    ${index + 1}
                                </button>
                            `;
                        }).join('')}
                    </div>
                </div>
            `;
        }
    }
    
    // Container width based on layout
    const containerClass = slideshowConfig.layout === 'page' ? 'style="max-width: 1200px; margin: 0 auto;"' : '';
    
    // Add top and bottom padding from config
    const topPadding = slideshowConfig.topPadding || 0;
    const bottomPadding = slideshowConfig.bottomPadding || 0;
    const paddingStyle = `padding-top: ${topPadding}px; padding-bottom: ${bottomPadding}px;`;
    
    // Generate unique styles for mobile responsiveness
    const mobileStyles = `
        <style>
            /* Mobile responsiveness for slideshow */
            @media (max-width: 768px) {
                /* Adjust slideshow height on mobile */
                .slideshow-container {
                    height: 350px !important;
                    min-height: 350px !important;
                }
                
                /* Adjust slide content padding */
                .slide-content {
                    padding: 20px !important;
                }
                
                /* Adjust content inner container */
                .slide-content-inner {
                    max-width: 100% !important;
                    padding: 0 10px;
                }
                
                /* Mobile text alignment */
                .slide-content-inner[data-mobile-align="izquierda"] {
                    text-align: left !important;
                }
                .slide-content-inner[data-mobile-align="centrado"] {
                    text-align: center !important;
                }
                .slide-content-inner[data-mobile-align="derecha"] {
                    text-align: right !important;
                }
                
                /* Adjust title sizes for mobile */
                .slide-content-inner h2 {
                    font-size: 24px !important;
                    margin-bottom: 15px !important;
                }
                
                /* Adjust subtitle for mobile */
                .slide-content-inner p {
                    font-size: 14px !important;
                    margin-bottom: 20px !important;
                    line-height: 1.4 !important;
                }
                
                /* Adjust button for mobile */
                .slide-button {
                    padding: 10px 24px !important;
                    font-size: 14px !important;
                }
                
                /* Adjust navigation arrows for mobile */
                .slideshow-nav-prev,
                .slideshow-nav-next {
                    width: 35px !important;
                    height: 35px !important;
                    left: 10px !important;
                    right: 10px !important;
                }
                
                .slideshow-nav-prev {
                    left: 10px !important;
                }
                
                .slideshow-nav-next {
                    right: 10px !important;
                }
                
                /* Adjust pagination for mobile */
                .slideshow-pagination-container {
                    padding: 15px 0 10px !important;
                }
                
                .pagination-dot {
                    width: 8px !important;
                    height: 8px !important;
                }
                
                .slideshow-pagination-dots {
                    gap: 8px !important;
                }
                
                /* Ensure images are responsive */
                .slide-wrapper img {
                    object-position: center !important;
                }
            }
            
            /* Extra small devices */
            @media (max-width: 480px) {
                .slideshow-container {
                    height: 280px !important;
                    min-height: 280px !important;
                }
                
                .slide-content-inner h2 {
                    font-size: 20px !important;
                }
                
                .slide-content-inner p {
                    font-size: 13px !important;
                }
            }
        </style>
    `;
    
    // Get translations for section title
    const slideshowTitle = (typeof translations !== 'undefined' && translations[currentLanguage]?.['sections.slideshow']) || 
                          (typeof lang !== 'undefined' && lang['sections.slideshow']) || 
                          'Slideshow';
    
    // Check if we're in editor context
    const isInEditor = (typeof window !== 'undefined' && 
                       window.parent !== window && 
                       window.parent.document && 
                       window.parent.document.getElementById('preview-iframe'));
    
    return `
        <div class="section-wrapper" data-section-id="slideshow" style="margin-top: ${parseInt(slideshowConfig.topPadding) === 1 ? '-2' : (slideshowConfig.topPadding || 0)}px; margin-bottom: ${slideshowConfig.bottomPadding || 0}px;">
            ${isInEditor ? `
                <div class="section-header-tag">
                    <span class="material-symbols-outlined" style="font-size: 16px;">view_carousel</span>
                    ${slideshowTitle}
                </div>
            ` : ''}
            ${mobileStyles}
            <div class="slideshow-wrapper" style="${paddingStyle}">
                <div class="slideshow-container" 
                 id="${slideshowId}"
                 data-autorotate="${slideshowConfig.autoRotate || false}"
                 data-interval="${slideshowConfig.changeInterval || 5}"
                 data-current-slide="0"
                 data-total-slides="${visibleSlides.length}"
                 data-slide-ids='${JSON.stringify(visibleSlides)}'
                 data-slides='${JSON.stringify(slides)}'
                 ${containerClass} 
                 style="position: relative; ${heightStyle} background: ${schemeColors.background}; overflow: hidden;">
                <!-- All slides -->
                ${visibleSlides.map((slideId, index) => {
                    const slide = slides[slideId];
                    const slideColorScheme = slide.colorScheme || 'scheme1';
                    const slideSchemeColors = getColorSchemeValues(slideColorScheme);
                    const isActive = index === 0;
                    
                    return `
                        <div class="slide-wrapper" data-slide-index="${index}" style="position: absolute; top: 0; left: 0; width: 100%; height: 100%; ${isActive ? '' : 'display: none;'}">
                            ${slide.desktopImage ? `
                                <!-- Desktop image -->
                                <picture>
                                    ${slide.mobileImage ? `<source media="(max-width: 768px)" srcset="${slide.mobileImage}">` : ''}
                                    <img src="${slide.desktopImage}" 
                                         alt="${slide.title || 'Slide image'}"
                                         class="slide-image"
                                         style="width: 100%; height: 100%; object-fit: cover; position: absolute; top: 0; left: 0; 
                                                image-rendering: -webkit-optimize-contrast; 
                                                image-rendering: crisp-edges;
                                                -webkit-backface-visibility: hidden;
                                                transform: translateZ(0);">
                                </picture>
                            ` : `
                                <div style="width: 100%; height: 100%; background: ${slideSchemeColors.foreground || slideSchemeColors.background}; position: absolute; top: 0; left: 0;"></div>
                            `}
                            ${slide.useOverlay && slide.overlayOpacity ? `
                                <div style="position: absolute; top: 0; left: 0; right: 0; bottom: 0; background: rgba(0, 0, 0, ${slide.overlayOpacity}); z-index: 1;"></div>
                            ` : ''}
                            ${generateSlideContent(slide, slideSchemeColors)}
                        </div>
                    `;
                }).join('')}
                ${navigationArrowsHtml}
                ${paginationHtml}
            </div>
        </div>
        </div>
    `;
}

/**
 * Renderiza la sección multicolumn
 */
function renderMulticolumn(config) {
    console.log('[MULTICOLUMN] Rendering multicolumn with config:', config);
    
    if (!config || config.isHidden) {
        console.log('[MULTICOLUMN] Section is hidden or config is null');
        return '';
    }
    
    const schemeColors = getColorSchemeValues(config.config?.colorScheme || 'scheme1');
    const columns = config.columns || {};
    const columnOrder = config.columnOrder || [];
    
    // Filter visible columns
    const visibleColumns = columnOrder.filter(columnId => 
        columns[columnId] && !columns[columnId].isHidden
    );
    
    if (visibleColumns.length === 0) {
        return '';
    }
    
    // Generate columns HTML
    const columnsHtml = visibleColumns.map((columnId, index) => {
        const column = columns[columnId];
        const isEven = index % 2 === 0;
        const imagePosition = config.config?.imagePosition === 'alternating' ? 
            (isEven ? 'left' : 'right') : config.config?.imagePosition || 'left';
        
        return `
            <div class="multicolumn-row" style="display: flex; align-items: center; margin-bottom: 40px; ${imagePosition === 'right' ? 'flex-direction: row-reverse;' : ''}">
                ${config.config?.showImages !== false ? `
                    <div class="multicolumn-image" style="flex: 0 0 50%; ${imagePosition === 'left' ? 'padding-right: 40px;' : 'padding-left: 40px;'}">
                        ${column.imageUrl ? 
                            `<img src="${column.imageUrl}" alt="${column.title || ''}" style="width: 100%; height: auto; display: block;">` :
                            `<div style="background: ${schemeColors.foreground || '#e0e0e0'}; aspect-ratio: 4/3; display: flex; align-items: center; justify-content: center;">
                                <i class="material-icons" style="font-size: 48px; color: ${schemeColors.background};">image</i>
                            </div>`
                        }
                    </div>
                ` : ''}
                <div class="multicolumn-content" style="flex: 1; color: ${schemeColors.text};">
                    ${column.title ? `<h3 style="font-size: 24px; margin: 0 0 16px 0; color: ${schemeColors.text};">${column.title}</h3>` : ''}
                    ${column.content ? `<p style="margin: 0 0 16px 0; line-height: 1.6;">${column.content}</p>` : ''}
                    ${column.buttonText ? `
                        <a href="${column.buttonLink || '#'}" 
                           style="display: inline-block; padding: 12px 24px; background: ${schemeColors.buttonBackground || schemeColors.text}; 
                                  color: ${schemeColors.buttonText || schemeColors.background}; text-decoration: none; 
                                  border-radius: 4px; font-weight: 500;">
                            ${column.buttonText}
                        </a>
                    ` : ''}
                </div>
            </div>
        `;
    }).join('');
    
    // Get translations
    const sectionTitle = (typeof translations !== 'undefined' && translations[currentLanguage]?.['sections.multicolumn']) || 
                        (typeof lang !== 'undefined' && lang['sections.multicolumn']) || 
                        'Multicolumn';
    
    // Check if we're in editor context
    const isInEditor = (typeof window !== 'undefined' && 
                       window.parent !== window && 
                       window.parent.document && 
                       window.parent.document.getElementById('preview-iframe'));
    
    return `
        <div class="section-wrapper" data-section-id="multicolumn" style="padding: 40px 0;">
            ${isInEditor ? `
                <div class="section-header-tag">
                    <span class="material-symbols-outlined" style="font-size: 16px;">view_week</span>
                    ${sectionTitle}
                </div>
            ` : ''}
            <div class="multicolumn-container" style="max-width: 1200px; margin: 0 auto; padding: 0 20px;">
                ${config.config?.title ? `
                    <h2 style="text-align: center; font-size: 32px; margin: 0 0 40px 0; color: ${schemeColors.text};">
                        ${config.config.title}
                    </h2>
                ` : ''}
                ${columnsHtml}
            </div>
        </div>
    `;
}

// Función para inicializar slideshows
function initializeSlideshows() {
    // Inicializar TODOS los slideshows, no solo los que tienen autorotate
    const slideshows = document.querySelectorAll('.slideshow-container');
    
    slideshows.forEach(slideshow => {
        const isAutorotate = slideshow.dataset.autorotate === 'true';
        const interval = parseInt(slideshow.dataset.interval) * 1000; // Convert to milliseconds
        const slideIds = JSON.parse(slideshow.dataset.slideIds || '[]');
        const slidesData = JSON.parse(slideshow.dataset.slides || '{}');
        let currentIndex = 0;
        
        if (slideIds.length <= 1) return; // No need to rotate if only one slide
        
        // Function to update slide
        function updateSlide(index) {
            // Hide all slides with smooth transition
            const allSlides = slideshow.querySelectorAll('.slide-wrapper');
            allSlides.forEach((slide, i) => {
                if (i === index) {
                    slide.style.display = 'block';
                    // Force mobile image update if needed
                    const img = slide.querySelector('img');
                    if (img) {
                        img.style.objectFit = 'cover';
                        img.style.objectPosition = 'center';
                    }
                } else {
                    slide.style.display = 'none';
                }
            });
            
            // Update pagination if exists
            const paginationText = slideshow.querySelector('.slideshow-pagination');
            if (paginationText) {
                paginationText.textContent = `${index + 1} / ${slideIds.length}`;
            }
            
            // Update dots if exist
            const dots = slideshow.querySelectorAll('.pagination-dot');
            dots.forEach((dot, i) => {
                if (i === index) {
                    dot.style.opacity = '1';
                } else {
                    dot.style.opacity = '0.3';
                }
            });
            
            // Update pagination numbers if exist
            const numbers = slideshow.querySelectorAll('.pagination-number');
            numbers.forEach((num, i) => {
                const slideId = slideIds[index]; // Current slide for colors
                const slide = slidesData[slideId];
                const colorScheme = slide?.colorScheme || 'scheme1';
                const schemeColors = getColorSchemeValues(colorScheme);
                
                if (i === index) {
                    num.style.background = schemeColors.text;
                    num.style.color = schemeColors.background;
                } else {
                    num.style.background = 'transparent';
                    num.style.color = schemeColors.text;
                }
            });
            
            // Update data attribute
            slideshow.dataset.currentSlide = index;
        }
        
        // Set up rotation interval ONLY if autorotate is enabled
        let rotationInterval = null;
        if (isAutorotate) {
            rotationInterval = setInterval(() => {
                currentIndex = (currentIndex + 1) % slideIds.length;
                updateSlide(currentIndex);
            }, interval);
            
            // Store interval ID for cleanup
            slideshow.dataset.intervalId = rotationInterval;
        }
        
        // Handle navigation arrows if they exist
        const prevArrow = slideshow.querySelector('.slideshow-nav-prev');
        const nextArrow = slideshow.querySelector('.slideshow-nav-next');
        
        if (prevArrow) {
            prevArrow.addEventListener('click', () => {
                if (rotationInterval) clearInterval(rotationInterval);
                currentIndex = (currentIndex - 1 + slideIds.length) % slideIds.length;
                updateSlide(currentIndex);
            });
        }
        
        if (nextArrow) {
            nextArrow.addEventListener('click', () => {
                if (rotationInterval) clearInterval(rotationInterval);
                currentIndex = (currentIndex + 1) % slideIds.length;
                updateSlide(currentIndex);
            });
        }
        
        // Handle pagination dots clicks
        const paginationDots = slideshow.querySelectorAll('.pagination-dot');
        paginationDots.forEach((dot, i) => {
            dot.addEventListener('click', () => {
                if (rotationInterval) clearInterval(rotationInterval);
                currentIndex = i;
                updateSlide(currentIndex);
            });
        });
        
        // Handle pagination numbers clicks
        const paginationNumbers = slideshow.querySelectorAll('.pagination-number');
        paginationNumbers.forEach((num, i) => {
            num.addEventListener('click', () => {
                if (rotationInterval) clearInterval(rotationInterval);
                currentIndex = i;
                updateSlide(currentIndex);
            });
        })
    });
}

// Auto-initialize when DOM is ready
if (typeof document !== 'undefined') {
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initializeSlideshows);
    } else {
        // DOM is already loaded
        setTimeout(initializeSlideshows, 100);
    }
}

// Function to render footer
function renderFooter(config) {
    if (!config) {
        config = { colorScheme: 'scheme1', isHidden: false };
    }
    
    // Try to use the module first
    if (window.WebsiteBuilderModules && window.WebsiteBuilderModules.Footer && window.WebsiteBuilderModules.Footer.render) {
        return window.WebsiteBuilderModules.Footer.render(config);
    }
    
    // Fallback
    const schemeColors = getColorSchemeValues(config.colorScheme || 'scheme1');
    
    return `
        <div class="section-wrapper footer-section" data-section-id="footer" style="padding: 40px 0; background: ${schemeColors.background};">
            <div class="section-header-tag">
                <span class="material-symbols-outlined" style="font-size: 16px; margin-right: 6px;">foundation</span>
                ${window.translations?.[window.currentLanguage]?.['sections.footer'] || 'Footer'}
            </div>
            <div class="container" style="max-width: 1200px; margin: 0 auto; padding: 0 20px;">
                <div style="text-align: center; color: ${schemeColors.text}; padding: 40px 0;">
                    <i class="material-icons" style="font-size: 48px; opacity: 0.3;">foundation</i>
                    <p style="margin-top: 20px; color: #666;">Footer - Configure from settings</p>
                </div>
            </div>
        </div>
    `;
}

// Función para renderizar el cart drawer
function renderCartDrawer(config) {
    console.log('[CART-DRAWER] Rendering cart drawer with config:', config);
    console.log('[CART-DRAWER] Auto-open:', config.autoOpen);
    
    const schemeColors = getColorSchemeValues(config.colorScheme || 'scheme1');
    const drawerWidth = '480px'; // Ancho aumentado del drawer
    
    // Crear un ID único para este drawer
    const drawerId = 'cart-drawer-' + Date.now();
    
    return `
        <!-- Cart Drawer Overlay -->
        <div id="${drawerId}-overlay" class="cart-drawer-overlay" 
             style="position: fixed; top: 0; left: 0; width: 100%; height: 100%; background-color: rgba(0, 0, 0, 0.5); z-index: 9998; display: none; cursor: pointer;"
             onclick="if(window.parent && window.parent.closeCartDrawer) { window.parent.closeCartDrawer('${drawerId}'); } else { window.closeCartDrawer('${drawerId}'); }"></div>
        
        <!-- Cart Drawer -->
        <div id="${drawerId}" class="cart-drawer" 
             style="position: fixed; top: 0; right: -${drawerWidth}; width: ${drawerWidth}; height: 100%; background-color: ${schemeColors.background}; z-index: 9999; transition: right 0.3s ease-in-out; box-shadow: -2px 0 5px rgba(0, 0, 0, 0.1); overflow-y: auto;">
            
            <!-- Drawer Header -->
            <div class="cart-drawer-header" style="display: flex; align-items: center; justify-content: space-between; padding: 20px; border-bottom: 1px solid ${schemeColors.border || '#e0e0e0'};">
                <h3 style="margin: 0; font-size: 18px; font-weight: 500; color: ${schemeColors.text};">
                    ${window.translations?.[window.currentLanguage]?.['cart.drawer.title'] || 'Cart drawer'}
                </h3>
                <button onclick="if(window.parent && window.parent.closeCartDrawer) { window.parent.closeCartDrawer('${drawerId}'); } else { window.closeCartDrawer('${drawerId}'); }" 
                        style="background: none; border: none; cursor: pointer; padding: 8px; color: ${schemeColors.text}; display: flex; align-items: center; justify-content: center; border-radius: 4px; transition: background-color 0.2s ease;"
                        onmouseover="this.style.backgroundColor='rgba(0,0,0,0.05)'"
                        onmouseout="this.style.backgroundColor='transparent'">
                    <i class="material-icons" style="font-size: 24px;">close</i>
                </button>
            </div>
            
            <!-- Cart Content (dynamically updated) -->
            <div class="cart-drawer-content">
                <!-- Content will be dynamically updated by updateCartDrawerContent -->
            </div>
            
            <!-- Progress Bar (if enabled) -->
            ${config.showProgressBar && config.freeShippingGoal > 0 ? `
                <div class="cart-progress-section" style="padding: 20px; border-top: 1px solid ${schemeColors.border || '#e0e0e0'};">
                    <div class="progress-message" style="text-align: center; margin-bottom: 10px; color: ${schemeColors.text}; font-size: 14px;">
                        ${window.translations?.[window.currentLanguage]?.['cart.shipping.message'] || 'Free shipping on orders over'} $${config.freeShippingGoal}
                    </div>
                    <div class="progress-bar" style="width: 100%; height: 8px; background-color: ${schemeColors.foreground || '#f0f0f0'}; border-radius: 4px; overflow: hidden;">
                        <div class="progress-fill" style="width: 0%; height: 100%; background: ${config.progressBarGradient === 'gradient-linear' ? 'linear-gradient(90deg, #ffba00, #ff6b00)' : '#ffba00'}; transition: width 0.3s ease;"></div>
                    </div>
                </div>
            ` : ''}
        </div>
        
        <script type="text/javascript">
            // Función para abrir el drawer
            window.openCartDrawer = function(drawerId) {
                console.log('[CART-DRAWER] Opening drawer:', drawerId);
                const drawer = document.getElementById(drawerId);
                const overlay = document.getElementById(drawerId + '-overlay');
                if (drawer && overlay) {
                    // Update cart content if parent function exists
                    if (window.parent && window.parent.updateCartDrawerContent) {
                        window.parent.updateCartDrawerContent(drawerId);
                    }
                    
                    overlay.style.display = 'block';
                    setTimeout(() => {
                        drawer.style.right = '0';
                    }, 10);
                } else {
                    console.error('[CART-DRAWER] Drawer or overlay not found:', drawerId);
                }
            }
            
            // Función para cerrar el drawer
            window.closeCartDrawer = function(drawerId) {
                console.log('[CART-DRAWER] Closing drawer:', drawerId);
                const drawer = document.getElementById(drawerId);
                const overlay = document.getElementById(drawerId + '-overlay');
                if (drawer && overlay) {
                    drawer.style.right = '-480px';
                    setTimeout(() => {
                        overlay.style.display = 'none';
                    }, 300);
                }
            }
            
            // Auto-abrir el drawer si estamos en la vista de configuración
            ${config.autoOpen ? `
                console.log('[CART-DRAWER] Auto-open enabled, opening in 500ms');
                setTimeout(() => {
                    window.openCartDrawer('${drawerId}');
                }, 600);
            ` : ''}
        </script>
    `;
}

// Old renderCartPageV2 function has been removed - use renderCartPage instead

// Nueva implementación completamente reconstruida
function renderCartPage(config = {}) {
    console.log('[CART-V2] Nueva implementación - config recibido:', config);
    
    // Configuración simple y directa
    const settings = {
        colorScheme: config.colorScheme || config.config?.colorScheme || 'scheme1',
        cartItems: config.cartItems || [],
        topPadding: config.topPadding || config.config?.topPadding || 96,
        bottomPadding: config.bottomPadding || config.config?.bottomPadding || 96,
        width: config.width || config.config?.width || 'small',
        addSidePaddings: config.addSidePaddings || config.config?.addSidePaddings || false,
        checkoutButtonText: config.checkoutButtonText || config.config?.checkoutButtonText || (currentLanguage === 'es' ? 'Proceder al pago' : 'Proceed to checkout')
    };
    
    console.log('[CART-V2] Items del carrito:', settings.cartItems);
    
    // Obtener colores del esquema
    const colors = getColorSchemeValues(settings.colorScheme);
    console.log('[CART-V2] Color scheme colors:', colors);
    
    // Obtener colores del botón sólido - usar notación de corchetes para propiedades con guiones
    const solidButtonBg = (colors && colors['solid-button']) ? colors['solid-button'] : '#121212';
    const solidButtonText = (colors && colors['solid-button-text']) ? colors['solid-button-text'] : '#FFFFFF';
    console.log('[CART-V2] Solid button colors:', { bg: solidButtonBg, text: solidButtonText });
    
    // Detectar si estamos en el editor
    const isEditor = window.parent !== window;
    
    // Función para formatear moneda
    const formatCurrency = (amount) => {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD',
            minimumFractionDigits: 2
        }).format(amount);
    };
    
    // Decidir qué items mostrar - solo productos reales
    let itemsToShow = settings.cartItems || [];
    console.log('[CART-V2] Mostrando:', itemsToShow.length, 'items reales');
    
    // Generar HTML de los items
    let itemsHtml = '';
    let subtotal = 0;
    
    itemsToShow.forEach((item, index) => {
        const itemTotal = item.price * item.quantity;
        subtotal += itemTotal;
        
        itemsHtml += `
            <tr style="border-bottom: 1px solid ${colors.border || '#e0e0e0'};">
                <td style="padding: 20px 0;">
                    <div style="display: flex; align-items: center; gap: 16px;">
                        <img src="${item.image || 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iODAiIGhlaWdodD0iODAiIGZpbGw9IiNmMGYwZjAiPjxyZWN0IHdpZHRoPSI4MCIgaGVpZ2h0PSI4MCIgZmlsbD0iI2YwZjBmMCIvPjwvc3ZnPg=='}" 
                             alt="${item.name}" 
                             style="width: 80px; height: 80px; object-fit: cover; border-radius: 4px;">
                        <div>
                            <h3 style="margin: 0 0 4px 0; font-size: 16px; font-weight: 400; color: ${colors.text};">${item.name}</h3>
                            <p class="item-price" style="margin: 0; color: ${colors.text}; opacity: 0.7; font-size: 14px;">${formatCurrency(item.price)}</p>
                        </div>
                    </div>
                </td>
                <td style="padding: 20px 0; text-align: center;">
                    <div class="cart-qty-container" style="display: inline-flex; align-items: center; border: 1px solid ${colors.border || '#e0e0e0'}; border-radius: 4px;">
                        <button 
                            class="cart-qty-btn"
                            data-product-id="${item.id || index}"
                            data-action="decrease"
                            onclick="if(window.parent && window.parent.updateCartQty) { window.parent.updateCartQty('${item.id || index}', -1); } else if(window.updateCartQty) { window.updateCartQty('${item.id || index}', -1); }"
                            style="padding: 8px 12px; background: none; border: none; cursor: pointer; font-size: 16px; color: ${colors.text};">−</button>
                        <span class="cart-qty-value" id="cart-qty-${item.id || index}" style="padding: 8px 16px; min-width: 40px; text-align: center;">${item.quantity}</span>
                        <button 
                            class="cart-qty-btn"
                            data-product-id="${item.id || index}"
                            data-action="increase"
                            onclick="if(window.parent && window.parent.updateCartQty) { window.parent.updateCartQty('${item.id || index}', 1); } else if(window.updateCartQty) { window.updateCartQty('${item.id || index}', 1); }"
                            style="padding: 8px 12px; background: none; border: none; cursor: pointer; font-size: 16px; color: ${colors.text};">+</button>
                    </div>
                </td>
                <td style="padding: 20px 0; text-align: right; font-weight: 500; color: ${colors.text};">
                    <span class="item-total">${formatCurrency(itemTotal)}</span>
                </td>
                <td style="padding: 20px 0; text-align: center;">
                    <button 
                        class="cart-remove-btn"
                        data-product-id="${item.id || index}"
                        onclick="if(window.parent && window.parent.removeFromCart) { window.parent.removeFromCart('${item.id || index}'); } else if(window.removeFromCart) { window.removeFromCart('${item.id || index}'); }"
                        style="background: none; border: none; cursor: pointer; padding: 8px; color: ${colors.text}; opacity: 0.6; transition: opacity 0.2s ease;"
                        onmouseover="this.style.opacity='1'"
                        onmouseout="this.style.opacity='0.6'">
                        <span class="material-symbols-outlined" style="font-size: 20px;">delete</span>
                    </button>
                </td>
            </tr>
        `;
    });
    
    // Ancho del contenedor
    const widthStyle = settings.width === 'small' ? 'max-width: 600px;' : 
                      settings.width === 'large' ? 'max-width: 1200px;' : 
                      'width: 100%;';
    
    // HTML final
    return `
        <div class="section-wrapper" data-section-id="cart" style="
            padding-top: ${settings.topPadding}px;
            padding-bottom: ${settings.bottomPadding}px;
            background-color: ${colors.background};
        ">
            ${isEditor ? `
                <div class="section-header-tag">
                    <span class="material-symbols-outlined" style="font-size: 16px;">shopping_cart</span>
                    Cart
                </div>
            ` : ''}
            
            <div style="${widthStyle} margin: 0 auto; padding: 0 ${settings.addSidePaddings ? '20px' : '0'};">
                <h1 style="text-align: center; margin-bottom: 40px; font-size: 36px; font-weight: 400; color: ${colors.text};">
                    Carrito
                </h1>
                
                ${itemsToShow.length > 0 ? `
                    <table style="width: 100%; border-collapse: collapse;">
                        <thead>
                            <tr style="border-bottom: 1px solid ${colors.border || '#e0e0e0'};">
                                <th style="text-align: left; padding: 16px 0; font-weight: 500; color: ${colors.text};">Producto</th>
                                <th style="text-align: center; padding: 16px 0; font-weight: 500; color: ${colors.text};">Cantidad</th>
                                <th style="text-align: right; padding: 16px 0; font-weight: 500; color: ${colors.text};">Total</th>
                                <th style="width: 60px;"></th>
                            </tr>
                        </thead>
                        <tbody>
                            ${itemsHtml}
                        </tbody>
                    </table>
                    
                    <div style="margin-top: 40px; padding-top: 20px; border-top: 1px solid ${colors.border || '#e0e0e0'};">
                        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px;">
                            <span style="font-size: 18px; font-weight: 500; color: ${colors.text};">Total</span>
                            <span id="cart-subtotal" style="font-size: 18px; font-weight: 500; color: ${colors.text};">${formatCurrency(subtotal)}</span>
                        </div>
                        <button onclick="if(window.parent && window.parent.handleCheckoutClick) { window.parent.handleCheckoutClick(); } else { window.location.href='/checkout'; }" style="
                            width: 100%;
                            padding: 16px;
                            background-color: ${solidButtonBg};
                            color: ${solidButtonText};
                            border: none;
                            border-radius: 4px;
                            font-size: 16px;
                            font-weight: 500;
                            cursor: not-allowed;
                            transition: all 0.2s ease;
                        ">
                            ${settings.checkoutButtonText}
                        </button>
                    </div>
                ` : `
                    <div style="text-align: center; padding: 60px 20px;">
                        <div style="margin-bottom: 24px;">
                            <span class="material-symbols-outlined" style="font-size: 72px; color: ${colors.text}; opacity: 0.3;">
                                shopping_cart
                            </span>
                        </div>
                        <h2 style="font-size: 24px; margin-bottom: 16px; color: ${colors.text};">
                            Tu carrito está vacío
                        </h2>
                        <p style="font-size: 16px; color: ${colors.text}; opacity: 0.7; margin-bottom: 32px;">
                            Agrega productos desde la página de inicio
                        </p>
                        <button style="
                            padding: 12px 32px;
                            background-color: ${solidButtonBg};
                            color: ${solidButtonText};
                            border: none;
                            border-radius: 4px;
                            font-size: 16px;
                            font-weight: 500;
                            cursor: pointer;
                            transition: all 0.2s ease;
                        " onclick="window.location.href='/'"
                        onmouseover="this.style.transform='scale(0.98)'"
                        onmouseout="this.style.transform='scale(1)'">
                            Continuar comprando
                        </button>
                    </div>
                `}
            </div>
        </div>
        
    `;
}
