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
    const menuFontValue = menuTypography.font || 'roboto';
    const menuFontFamily = window.getFontNameFromValueSafe(menuFontValue);
    const menuFontSize = menuTypography.fontSize || '15px';
    
    // Logo sizes for desktop and mobile
    const logoSize = config.desktopLogoSize || 190;
    const mobileLogoSize = config.mobileLogoSize || 120;
    
    // Logo HTML optimized for HD quality
    const logoHtml = config.desktopLogoUrl 
        ? `<div class="header-logo-wrapper" style="height: ${logoSize}px; display: flex; align-items: center;">
               <img src="${config.desktopLogoUrl}" 
                    alt="logo" 
                    style="max-height: 100%; max-width: 100%; width: auto; height: auto; object-fit: contain; display: block;">
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
            schemeColors,
            openMenuDropdown: config.openMenuDropdown || 'hover'
        });
    } else {
        // Default menu items if no menu found
        menuItems = `
            <a href="#" style="text-decoration: none; color: inherit; font-family: ${menuFontFamily}, -apple-system, BlinkMacSystemFont, 'Segoe UI', Helvetica, Arial, sans-serif; font-size: ${menuFontSize}; font-weight: 400; letter-spacing: 0.06em;">Soluciones</a>
            <a href="#" style="text-decoration: none; color: inherit; font-family: ${menuFontFamily}, -apple-system, BlinkMacSystemFont, 'Segoe UI', Helvetica, Arial, sans-serif; font-size: ${menuFontSize}; font-weight: 400; letter-spacing: 0.06em;">Herramientas</a>
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
    
    // Add responsive styles to the header
    const responsiveStyles = `
        <style>
            /* Desktop styles (default) */
            .header-container {
                height: 120px;
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
                    <div style="display: flex; align-items: center; justify-content: space-between; height: 80px;">
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
                    <div style="display: flex; align-items: center; justify-content: space-between; height: 80px;">
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
    const { menuFontFamily, menuFontSize, schemeColors, openMenuDropdown } = options;
    
    return items.map(item => {
        const hasChildren = item.children && item.children.length > 0;
        
        if (hasChildren) {
            return `
                <div class="menu-item-with-dropdown" style="position: relative;">
                    <a href="${item.url || '#'}" 
                       class="menu-item-parent"
                       style="text-decoration: none; color: inherit; font-family: ${menuFontFamily}, -apple-system, BlinkMacSystemFont, 'Segoe UI', Helvetica, Arial, sans-serif; font-size: ${menuFontSize}; font-weight: 400; letter-spacing: 0.06em; display: flex; align-items: center; gap: 4px;">
                        ${item.label}
                        <span class="material-icons" style="font-size: 18px;">expand_more</span>
                    </a>
                </div>
            `;
        } else {
            return `
                <a href="${item.url || '#'}" 
                   style="text-decoration: none; color: inherit; font-family: ${menuFontFamily}, -apple-system, BlinkMacSystemFont, 'Segoe UI', Helvetica, Arial, sans-serif; font-size: ${menuFontSize}; font-weight: 400; letter-spacing: 0.06em;">
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
                   style="display: flex; align-items: center; justify-content: space-between; padding: 8px 20px; text-decoration: none; color: ${schemeColors.text}; font-size: 14px; transition: background-color 0.2s ease; box-shadow: none !important;"
                   onmouseover="this.style.backgroundColor='${schemeColors.foreground}'; this.style.boxShadow='none !important'"
                   onmouseout="this.style.backgroundColor='transparent'; this.style.boxShadow='none !important'">
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
                           style="display: block; padding: 8px 20px 8px 40px; text-decoration: none; color: ${schemeColors.text}; font-size: 14px; transition: background-color 0.2s ease; box-shadow: none !important;"
                           onmouseover="this.style.backgroundColor='rgba(0,0,0,0.05)'; this.style.boxShadow='none !important'"
                           onmouseout="this.style.backgroundColor='transparent'; this.style.boxShadow='none !important'">
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
        
        if (openMenuDropdown === 'hover') {
            item.addEventListener('mouseenter', function() {
                // Show dropdown on hover
                const dropdown = item.querySelector('.menu-dropdown');
                if (dropdown) {
                    dropdown.style.display = 'block';
                }
            });
            
            item.addEventListener('mouseleave', function() {
                // Hide dropdown when not hovering
                const dropdown = item.querySelector('.menu-dropdown');
                if (dropdown) {
                    dropdown.style.display = 'none';
                }
            });
        } else {
            parentLink.addEventListener('click', function(e) {
                e.preventDefault();
                const dropdown = item.querySelector('.menu-dropdown');
                if (dropdown) {
                    dropdown.style.display = dropdown.style.display === 'block' ? 'none' : 'block';
                }
            });
        }
    });
}