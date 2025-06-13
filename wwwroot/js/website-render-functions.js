// Funciones de renderizado compartidas entre el editor y el preview

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
    // First check if we have custom values in currentGlobalThemeSettings
    if (currentGlobalThemeSettings && currentGlobalThemeSettings.colorSchemes && currentGlobalThemeSettings.colorSchemes[schemeName]) {
        return currentGlobalThemeSettings.colorSchemes[schemeName];
    }
    
    // Fall back to default color schemes
    return colorSchemes[schemeName] || colorSchemes['scheme1'];
}

// Función para renderizar el header
function renderHeader(config) {
    if (!config || config.isHidden) return '';

    // Get the selected color scheme
    const selectedScheme = config.colorScheme || 'primary';
    const schemeColors = getColorSchemeValues(selectedScheme);
    
    // Get typography settings
    const menuTypography = currentGlobalThemeSettings?.typography?.menu || {};
    const menuFontValue = menuTypography.font || 'assistant';
    const menuFontFamily = window.getFontNameFromValueSafe(menuFontValue);
    
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
    const selectedMenuId = config.navigationMenuId || 'main-menu';
    
    const selectedMenu = currentMenusData.find(m => m.id === selectedMenuId);
    
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
    
    // Icons section
    const iconsHtml = `
        <div class="header-icons-right" style="display: flex; gap: 24px; align-items: center;">
            <span class="${iconClass}" style="font-size: 24px; font-weight: ${iconWeight}; cursor: pointer; color: ${schemeColors.text};">${searchIcon}</span>
            <span class="${iconClass}" style="font-size: 24px; font-weight: ${iconWeight}; cursor: pointer; color: ${schemeColors.text};">${personIcon}</span>
            <span class="${iconClass}" style="font-size: 24px; font-weight: ${iconWeight}; cursor: pointer; color: ${schemeColors.text};">${cartIcon}</span>
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
    
    return headerContent;
}

// Función para renderizar la barra de anuncios
function renderAnnouncementBar(config) {
    if (!config || config.isHidden) return '';

    // Obtener anuncios visibles
    const visibleAnnouncements = [];
    if (currentSectionsConfig.announcementOrder && currentSectionsConfig.announcements) {
        currentSectionsConfig.announcementOrder.forEach(id => {
            const announcement = currentSectionsConfig.announcements[id];
            if (announcement && !announcement.isHidden) {
                visibleAnnouncements.push({ id, ...announcement });
            }
        });
    }

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
        if (currentAnnouncementIndex >= visibleAnnouncements.length) {
            currentAnnouncementIndex = 0;
        }
        
        const currentAnnouncement = visibleAnnouncements[currentAnnouncementIndex];
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

    // Get typography settings for announcements
    const bodyTypography = currentGlobalThemeSettings?.typography?.body || {};
    const fontValue = bodyTypography.font || 'roboto';
    const fontFamily = window.getFontNameFromValueSafe(fontValue);
    const fontSize = bodyTypography.fontSize || '14px';
    
    // Base styles for the announcement bar
    const barStyles = `
        position: relative;
        display: flex;
        align-items: center;
        justify-content: center;
        min-height: 44px;
        padding: 12px 20px;
        text-align: center;
        font-size: ${fontSize};
        font-family: ${fontFamily}, -apple-system, BlinkMacSystemFont, 'Segoe UI', Helvetica, Arial, sans-serif;
        background-color: ${schemeColors.background};
        color: ${schemeColors.text};
        overflow: hidden;
    `;
    
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
    
    return `
        ${marqueeStyles}
        <div class="announcement-bar" style="${barStyles}">
            <div class="${marqueeClass}">
                ${announcementContent}
            </div>
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
    const selectedMenuId = currentSectionsConfig.header?.navigationMenuId || 'main-menu';
    const selectedMenu = currentMenusData.find(m => m.id === selectedMenuId);
    
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
    const selectedMenuId = currentSectionsConfig.header?.navigationMenuId || 'main-menu';
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
    const selectedMenuId = currentSectionsConfig.header?.navigationMenuId || 'main-menu';
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