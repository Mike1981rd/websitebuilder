// Website Builder JavaScript

// Global state variables - must be accessible from all functions
let hasPendingGlobalSettingsChanges = false;
let hasPendingPageStructureChanges = false;
let currentWebsiteId = null;
let currentPageId = 1; // Default to home page
let currentPageBlocks = [];
let currentSelectedColorScheme = 'scheme1'; // Track which color scheme is being edited
let currentSidebarView = 'blockList'; // Track the current sidebar view
let currentAnnouncementIndex = 0; // Track current announcement being displayed
let announcementAutoplayTimer = null; // Timer for autoplay functionality

// Global font map for converting font values to display names
window.globalFontMap = {
    'abel': 'Abel',
    'archivo': 'Archivo',
    'archivo-narrow': 'Archivo Narrow',
    'arimo': 'Arimo',
    'assistant': 'Assistant',
    'bebas-neue': 'Bebas Neue',
    'cabin': 'Cabin',
    'chivo': 'Chivo',
    'dosis': 'Dosis',
    'fjalla-one': 'Fjalla One',
    'josefin-sans': 'Josefin Sans',
    'karla': 'Karla',
    'libre-franklin': 'Libre Franklin',
    'noto-sans': 'Noto Sans',
    'nunito-sans': 'Nunito Sans',
    'oswald': 'Oswald',
    'oxygen': 'Oxygen',
    'pt-sans': 'PT Sans',
    'raleway': 'Raleway',
    'roboto': 'Roboto',
    'rubik': 'Rubik',
    'source-sans-pro': 'Source Sans Pro',
    'titillium-web': 'Titillium Web',
    'ubuntu': 'Ubuntu',
    'work-sans': 'Work Sans',
    'arvo': 'Arvo',
    'bitter': 'Bitter',
    'cardo': 'Cardo',
    'cormorant': 'Cormorant',
    'crimson-text': 'Crimson Text',
    'david-libre': 'David Libre',
    'eb-garamond': 'EB Garamond',
    'eczar': 'Eczar',
    'inter': 'Inter',
    'lato': 'Lato',
    'libre-baskerville': 'Libre Baskerville',
    'lora': 'Lora',
    'merriweather': 'Merriweather',
    'montserrat': 'Montserrat',
    'noticia-text': 'Noticia Text',
    'noto-serif': 'Noto Serif',
    'open-sans': 'Open Sans',
    'playfair-display': 'Playfair Display',
    'poppins': 'Poppins',
    'pt-serif': 'PT Serif',
    'roboto-slab': 'Roboto Slab',
    'source-serif-pro': 'Source Serif Pro',
    'vollkorn': 'Vollkorn',
    'anonymous-pro': 'Anonymous Pro',
    'fira-mono': 'Fira Mono',
    'ibm-plex-mono': 'IBM Plex Mono',
    'inconsolata': 'Inconsolata',
    'jetbrains-mono': 'JetBrains Mono',
    'noto-sans-mono': 'Noto Sans Mono',
    'roboto-mono': 'Roboto Mono',
    'source-code-pro': 'Source Code Pro',
    'space-mono': 'Space Mono',
    'ubuntu-mono': 'Ubuntu Mono'
};

// Helper function to get font name from value
window.getFontNameFromValueSafe = function(fontValue) {
    if (!fontValue) return 'Roboto';
    return window.globalFontMap[fontValue] || fontValue.split('-').map(word => 
        word.charAt(0).toUpperCase() + word.slice(1)
    ).join(' ');
};
// Estructura para almacenar configuración de secciones
let currentSectionsConfig = {
    announcementBar: {
        showOnlyHomePage: false,
        colorScheme: 'scheme1',
        width: 'screen',
        showNavigationArrows: true,
        autoplayMode: 'none',
        autoplaySpeed: 6,
        animationStyle: 'none',
        showLanguageSelector: false,
        showCurrencySelector: false,
        showSocialMediaIcons: false,
        isHidden: false
    },
    header: {
        colorScheme: 'primary',
        width: 'large',
        layout: 'logo-center-menu-left-inline',
        showDivider: true,
        enableStickyHeader: false,
        openMenuDropdown: 'hover',
        navigationMenu: 'main-menu',
        logoAlignment: 'center',
        menu: '',
        desktopLogoSize: 190,
        mobileLogoSize: 120,
        iconStyle: 'outline',
        cartType: 'bag',
        isHidden: false,
        desktopLogoUrl: '',
        mobileLogoUrl: '',
        sectionVisibility: {
            menu: true,
            logo: true,
            icons: true
        }
    },
    announcements: {}, // Almacenar configuración individual de cada anuncio
    announcementOrder: [], // Orden de los anuncios
    sectionOrder: ['announcement', 'header'] // Orden de las secciones principales
};
let currentGlobalThemeSettings = {
    primaryColor: "#1976d2",
    secondaryColor: "#424242",
    fontFamily: "Roboto",
    headerHeight: "60px",
    colorSchemes: {}
};

// Estructura de datos para los esquemas de color - estructura plana para los campos de configuración
const colorSchemes = {
    'scheme1': { // Default/Classic scheme
        text: '#121212',
        background: '#FFFFFF', 
        foreground: '#F0F0F0',
        border: '#DDDDDD',
        'solid-button': '#121212',
        'solid-button-text': '#FFFFFF',
        'outline-button': '#DDDDDD',
        'outline-button-text': '#121212',
        'image-overlay': 'rgba(0, 0, 0, 0.1)'
    },
    'scheme2': { // Light Gray scheme
        text: '#333333',
        background: '#F3F3F3',
        foreground: '#E8E8E8',
        border: '#CCCCCC',
        'solid-button': '#666666',
        'solid-button-text': '#FFFFFF',
        'outline-button': '#999999',
        'outline-button-text': '#333333',
        'image-overlay': 'rgba(0, 0, 0, 0.05)'
    },
    'scheme3': { // Dark scheme
        text: '#FFFFFF',
        background: '#121212',
        foreground: '#1E1E1E',
        border: '#333333',
        'solid-button': '#FFFFFF',
        'solid-button-text': '#121212',
        'outline-button': '#666666',
        'outline-button-text': '#FFFFFF',
        'image-overlay': 'rgba(255, 255, 255, 0.1)'
    },
    'scheme4': { // Blue-Gray scheme
        text: '#EAEAEA',
        background: '#36454F',
        foreground: '#2C3A44',
        border: '#5A6B75',
        'solid-button': '#AEC6CF',
        'solid-button-text': '#121212',
        'outline-button': '#8FA9B5',
        'outline-button-text': '#EAEAEA',
        'image-overlay': 'rgba(0, 0, 0, 0.3)'
    },
    'scheme5': { // Beige/Brown scheme
        text: '#4B3F35',
        background: '#EADDCA',
        foreground: '#E5D4BD',
        border: '#D4B896',
        'solid-button': '#8B4513',
        'solid-button-text': '#FFFFFF',
        'outline-button': '#A0826D',
        'outline-button-text': '#4B3F35',
        'image-overlay': 'rgba(75, 63, 53, 0.1)'
    }
};

// Helper function to get color scheme values
function getColorSchemeValues(schemeName) {
    // First check if we have custom values in currentGlobalThemeSettings
    if (currentGlobalThemeSettings && currentGlobalThemeSettings.colorSchemes && currentGlobalThemeSettings.colorSchemes[schemeName]) {
        return currentGlobalThemeSettings.colorSchemes[schemeName];
    }
    
    // Fall back to default color schemes
    return colorSchemes[schemeName] || colorSchemes['scheme1'];
}

// Function to load current website data from the backend - moved outside document.ready
async function loadCurrentWebsite() {
    try {
        const response = await fetch('/api/builder/websites/current', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            }
        });
        
        if (!response.ok) {
            throw new Error('Failed to load website data');
        }
        
        const website = await response.json();
        console.log('[DEBUG] Loaded website data:', website);
        // C# serializes properties with capital first letter by default
        currentWebsiteId = website.id || website.Id;
        console.log('[DEBUG] Set currentWebsiteId to:', currentWebsiteId);
        
        // Parse and load global theme settings
        if (website.globalThemeSettingsJson) {
            try {
                currentGlobalThemeSettings = JSON.parse(website.globalThemeSettingsJson);
                console.log('[DEBUG] Loaded theme settings from DB:', currentGlobalThemeSettings);
                
                // Ensure colorSchemes property exists
                if (!currentGlobalThemeSettings.colorSchemes) {
                    console.log('[DEBUG] colorSchemes not found in DB, initializing empty object');
                    currentGlobalThemeSettings.colorSchemes = {};
                }
            } catch (e) {
                console.error('Error parsing global theme settings:', e);
                currentGlobalThemeSettings = {
                    colorSchemes: {}
                };
            }
        } else {
            // Initialize with empty object if no settings in DB
            currentGlobalThemeSettings = {
                colorSchemes: {}
            };
        }
        
        // Parse and load page structure
        if (website.pagesJson) {
            try {
                const pageData = JSON.parse(website.pagesJson);
                if (pageData && typeof pageData === 'object') {
                    currentPageBlocks = pageData.blocks || [];
                    if (pageData.sectionsConfig) {
                        // Merge with defaults instead of replacing completely
                        const defaultConfig = {
                            announcementBar: {
                                showOnlyHomePage: false,
                                colorScheme: 'scheme1',
                                width: 'screen',
                                showNavigationArrows: true,
                                autoplayMode: 'none',
                                autoplaySpeed: 6,
                                animationStyle: 'none',
                                showLanguageSelector: false,
                                showCurrencySelector: false,
                                showSocialMediaIcons: false,
                                isHidden: false
                            },
                            header: {
                                colorScheme: 'primary',
                                width: 'large',
                                layout: 'logo-center-menu-left-inline',
                                showDivider: true,
                                stickyHeader: 'on-scroll-up',
                                isHidden: false
                            },
                            announcements: {},
                            announcementOrder: [],
                            sectionOrder: ['announcement', 'header']
                        };
                        
                        // Deep merge saved config with defaults
                        currentSectionsConfig = $.extend(true, {}, defaultConfig, pageData.sectionsConfig);
                        
                        console.log('[DEBUG] Merged sections config:', currentSectionsConfig);
                        // Ensure header has logo URL properties and section visibility
                        if (currentSectionsConfig.header) {
                            if (!currentSectionsConfig.header.hasOwnProperty('desktopLogoUrl')) {
                                currentSectionsConfig.header.desktopLogoUrl = '';
                            }
                            if (!currentSectionsConfig.header.hasOwnProperty('mobileLogoUrl')) {
                                currentSectionsConfig.header.mobileLogoUrl = '';
                            }
                            if (!currentSectionsConfig.header.hasOwnProperty('sectionVisibility')) {
                                currentSectionsConfig.header.sectionVisibility = {
                                    menu: true,
                                    logo: true,
                                    icons: true
                                };
                            }
                        }
                    }
                    console.log('[DEBUG] Loaded page structure from DB:', currentSectionsConfig);
                }
            } catch (e) {
                console.error('Error parsing pages data:', e);
            }
        }
        
        // Clean up any old colors structure
        if (currentGlobalThemeSettings.colors) {
            // Remove old nested structure if it exists
            delete currentGlobalThemeSettings.colors.primary;
            delete currentGlobalThemeSettings.colors.secondary;
            delete currentGlobalThemeSettings.colors.contrasting;
            delete currentGlobalThemeSettings.colors.scheme;
            
            // Remove empty scheme objects
            for (let i = 1; i <= 5; i++) {
                delete currentGlobalThemeSettings.colors[`scheme${i}`];
            }
            
            // If colors object is now empty, remove it entirely
            if (Object.keys(currentGlobalThemeSettings.colors).length === 0) {
                delete currentGlobalThemeSettings.colors;
            }
        }
        
        // Apply global styles to preview
        applyGlobalStylesToPreview(currentGlobalThemeSettings);
        renderPreview(); // <-- AÑADE ESTA LÍNEA
        
        return website;
    } catch (error) {
        console.error('Error loading website:', error);
        return null;
    }
}

// Function to apply global styles to preview - moved outside document.ready
function applyGlobalStylesToPreview(settings) {
    console.log('[DEBUG] Attempting to apply global styles to preview...');
    
    const previewFrame = document.getElementById('preview-iframe');
    
    if (!previewFrame) {
        console.log('[DEBUG] Preview iframe not found. Skipping style application.');
        return; // Detiene la ejecución de la función si no hay iframe
    }
    
    // Check if iframe content is accessible and ready
    try {
        if (!previewFrame.contentWindow || !previewFrame.contentWindow.document) {
            console.warn('[DEBUG] Preview iframe contentWindow not accessible');
            return;
        }
        
        const previewDoc = previewFrame.contentWindow.document;
        
        // Check if document is ready
        if (previewDoc.readyState !== 'complete') {
            console.warn('[DEBUG] Preview iframe document not ready. State:', previewDoc.readyState);
            // Retry after a short delay
            setTimeout(() => applyGlobalStylesToPreview(settings), 100);
            return;
        }
        
        const previewRoot = previewDoc.documentElement;
        const previewBody = previewDoc.body;
        
        if (!previewRoot || !previewBody) {
            console.warn('[DEBUG] Preview iframe documentElement or body not found');
            return;
        }
        
        console.log('[DEBUG] Preview iframe is ready. Applying styles.');
        
        // Load Google Fonts in iframe if needed
        if (settings.typography) {
            const fontsToLoad = new Set();
            
            // Collect all fonts that need to be loaded
            if (settings.typography.heading?.font) {
                const fontName = window.getFontNameFromValueSafe(settings.typography.heading.font);
                if (fontName) fontsToLoad.add(fontName);
            }
            if (settings.typography.body?.font) {
                const fontName = window.getFontNameFromValueSafe(settings.typography.body.font);
                if (fontName) fontsToLoad.add(fontName);
            }
            if (settings.typography.menu?.font) {
                const fontName = window.getFontNameFromValueSafe(settings.typography.menu.font);
                if (fontName) fontsToLoad.add(fontName);
            }
            if (settings.typography.product?.font) {
                const fontName = window.getFontNameFromValueSafe(settings.typography.product.font);
                if (fontName) fontsToLoad.add(fontName);
            }
            if (settings.typography.buttons?.font) {
                const fontName = window.getFontNameFromValueSafe(settings.typography.buttons.font);
                if (fontName) fontsToLoad.add(fontName);
            }
            
            // Load each font in the iframe
            const iframeHead = previewDoc.head;
            fontsToLoad.forEach(fontName => {
                // Check if font is already loaded
                const existingLink = iframeHead.querySelector(`link[href*="${fontName.replace(/\s+/g, '+')}"]`);
                if (!existingLink) {
                    const link = document.createElement('link');
                    link.href = `https://fonts.googleapis.com/css2?family=${fontName.replace(/\s+/g, '+')}:wght@400;500;600;700&display=swap`;
                    link.rel = 'stylesheet';
                    iframeHead.appendChild(link);
                    console.log('[DEBUG] Loaded font in iframe:', fontName);
                }
            });
        }
        
        // Apply appearance settings
        if (settings.appearance) {
            if (settings.appearance.pageWidth) {
                previewRoot.style.setProperty('--page-width', settings.appearance.pageWidth);
            }
            if (settings.appearance.sidePadding) {
                previewRoot.style.setProperty('--side-padding', settings.appearance.sidePadding);
            }
            if (settings.appearance.edgeRounding) {
                const roundingMap = {
                    'size0': '0px',
                    'size1': '4px',
                    'size2': '8px',
                    'size3': '12px',
                    'size4': '16px'
                };
                previewRoot.style.setProperty('--edge-rounding', roundingMap[settings.appearance.edgeRounding] || '0px');
            }
        }
        
        // Apply typography settings
        if (settings.typography) {
            if (settings.typography.heading) {
                if (settings.typography.heading.font) {
                    previewRoot.style.setProperty('--heading-font', settings.typography.heading.font);
                }
                if (settings.typography.heading.uppercase) {
                    previewRoot.style.setProperty('--heading-text-transform', 'uppercase');
                } else {
                    previewRoot.style.setProperty('--heading-text-transform', 'none');
                }
                if (settings.typography.heading.letterSpacing !== undefined) {
                    previewRoot.style.setProperty('--heading-letter-spacing', settings.typography.heading.letterSpacing + 'px');
                }
            }
            
            if (settings.typography.body) {
                if (settings.typography.body.font) {
                    previewRoot.style.setProperty('--body-font', settings.typography.body.font);
                }
                if (settings.typography.body.fontSize) {
                    previewRoot.style.setProperty('--body-font-size', settings.typography.body.fontSize);
                }
            }
        }
        
        // Apply color scheme settings
        if (settings.colorSchemes && settings.colorSchemes.default) {
            const scheme = settings.colorSchemes.default;
            if (scheme.background) previewRoot.style.setProperty('--color-background', scheme.background);
            if (scheme.text) previewRoot.style.setProperty('--color-text', scheme.text);
            if (scheme.primary) previewRoot.style.setProperty('--color-primary', scheme.primary);
            if (scheme.secondary) previewRoot.style.setProperty('--color-secondary', scheme.secondary);
        }
        
        // Apply primary, secondary, and contrasting color settings
        if (settings.colors) {
            console.log('[DEBUG] Applying colors:', settings.colors);
            // Apply Primary colors
            if (settings.colors.primary) {
                const primary = settings.colors.primary;
                if (primary.text) previewRoot.style.setProperty('--color-primary-text', primary.text);
                if (primary.background) previewRoot.style.setProperty('--color-primary-background', primary.background);
                if (primary.foreground) previewRoot.style.setProperty('--color-primary-foreground', primary.foreground);
                if (primary.border) previewRoot.style.setProperty('--color-primary-border', primary.border);
                if (primary['solid-button']) previewRoot.style.setProperty('--color-primary-solid-button', primary['solid-button']);
                if (primary['solid-button-text']) previewRoot.style.setProperty('--color-primary-solid-button-text', primary['solid-button-text']);
                if (primary['outline-button']) previewRoot.style.setProperty('--color-primary-outline-button', primary['outline-button']);
                if (primary['outline-button-text']) previewRoot.style.setProperty('--color-primary-outline-button-text', primary['outline-button-text']);
                if (primary['image-overlay']) previewRoot.style.setProperty('--color-primary-image-overlay', primary['image-overlay']);
            }
            
            // Apply Secondary colors
            if (settings.colors.secondary) {
                const secondary = settings.colors.secondary;
                if (secondary.text) previewRoot.style.setProperty('--color-secondary-text', secondary.text);
                if (secondary.background) previewRoot.style.setProperty('--color-secondary-background', secondary.background);
                if (secondary.foreground) previewRoot.style.setProperty('--color-secondary-foreground', secondary.foreground);
                if (secondary.border) previewRoot.style.setProperty('--color-secondary-border', secondary.border);
                if (secondary['solid-button']) previewRoot.style.setProperty('--color-secondary-solid-button', secondary['solid-button']);
                if (secondary['solid-button-text']) previewRoot.style.setProperty('--color-secondary-solid-button-text', secondary['solid-button-text']);
                if (secondary['outline-button']) previewRoot.style.setProperty('--color-secondary-outline-button', secondary['outline-button']);
                if (secondary['outline-button-text']) previewRoot.style.setProperty('--color-secondary-outline-button-text', secondary['outline-button-text']);
                if (secondary['image-overlay']) previewRoot.style.setProperty('--color-secondary-image-overlay', secondary['image-overlay']);
            }
            
            // Apply Contrasting colors
            if (settings.colors.contrasting) {
                const contrasting = settings.colors.contrasting;
                if (contrasting.text) previewRoot.style.setProperty('--color-contrasting-text', contrasting.text);
                if (contrasting.background) previewRoot.style.setProperty('--color-contrasting-background', contrasting.background);
                if (contrasting.foreground) previewRoot.style.setProperty('--color-contrasting-foreground', contrasting.foreground);
                if (contrasting.border) previewRoot.style.setProperty('--color-contrasting-border', contrasting.border);
                if (contrasting['solid-button']) previewRoot.style.setProperty('--color-contrasting-solid-button', contrasting['solid-button']);
                if (contrasting['solid-button-text']) previewRoot.style.setProperty('--color-contrasting-solid-button-text', contrasting['solid-button-text']);
                if (contrasting['outline-button']) previewRoot.style.setProperty('--color-contrasting-outline-button', contrasting['outline-button']);
                if (contrasting['outline-button-text']) previewRoot.style.setProperty('--color-contrasting-outline-button-text', contrasting['outline-button-text']);
                if (contrasting['image-overlay']) previewRoot.style.setProperty('--color-contrasting-image-overlay', contrasting['image-overlay']);
            }
        }
        
    } catch (error) {
        console.error('[DEBUG] Error accessing iframe content:', error);
        // This might happen due to cross-origin restrictions or timing issues
    }
}

/**
 * Renderiza el HTML para la sección del Header de forma más realista.
 * @param {object} config - La configuración de la sección del header.
 * @returns {string} El string HTML para el header.
 */
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
    
    // Determine logo size based on viewport (we'll use desktop size for now, mobile will be handled via CSS)
    const logoSize = config.desktopLogoSize || 190;
    
    // Logo HTML with proper sizing
    const logoHtml = config.desktopLogoUrl 
        ? `<img src="${config.desktopLogoUrl}" alt="logo" style="max-height: ${logoSize}px; width: auto; object-fit: contain;">`
        : `<span style="font-size: 32px; font-weight: 600; letter-spacing: 0.08em; color: ${schemeColors.text};">AURORA</span>`;

    // Determine cart icon based on configuration
    const cartIcon = config.cartType === 'cart' ? 'shopping_cart' : 'shopping_bag';
    
    // Determine icon style (outline vs solid)
    const iconClass = config.iconStyle === 'solid' ? 'material-icons' : 'material-symbols-outlined';
    const iconWeight = config.iconStyle === 'solid' ? '400' : '300';
    
    // Icons for different styles
    const searchIcon = config.iconStyle === 'solid' ? 'search' : 'search';
    const personIcon = config.iconStyle === 'solid' ? 'person' : 'person_outline';
    
    // Menu items
    const menuItems = `
        <a href="#" style="text-decoration: none; color: inherit; font-family: ${menuFontFamily}, -apple-system, BlinkMacSystemFont, 'Segoe UI', Helvetica, Arial, sans-serif; font-size: ${menuFontSize}; font-weight: 400; letter-spacing: 0.06em;">Soluciones</a>
        <a href="#" style="text-decoration: none; color: inherit; font-family: ${menuFontFamily}, -apple-system, BlinkMacSystemFont, 'Segoe UI', Helvetica, Arial, sans-serif; font-size: ${menuFontSize}; font-weight: 400; letter-spacing: 0.06em;">Herramientas</a>
    `;
    
    // Icons section
    const iconsHtml = `
        <div class="header-icons-right" style="display: flex; gap: 24px; align-items: center;">
            <span class="${iconClass}" style="font-size: 24px; font-weight: ${iconWeight}; cursor: pointer; color: ${schemeColors.text};">${searchIcon}</span>
            <span class="${iconClass}" style="font-size: 24px; font-weight: ${iconWeight}; cursor: pointer; color: ${schemeColors.text};">${personIcon}</span>
            <span class="${iconClass}" style="font-size: 24px; font-weight: ${iconWeight}; cursor: pointer; color: ${schemeColors.text};">${cartIcon}</span>
        </div>
    `;
    
    let headerContent = '';
    const layout = config.layout || 'logo-center-menu-left-inline';
    
    switch(layout) {
        case 'drawer':
            headerContent = `
                <header style="height: 120px; display: flex; align-items: center; justify-content: space-between; padding: 0 50px; border-bottom: ${config.showDivider ? `1px solid ${schemeColors.border || '#e5e5e5'}` : 'none'}; background-color: ${schemeColors.background}; color: ${schemeColors.text};">
                    <div class="header-menu-drawer" style="display: flex; align-items: center;">
                        <span class="${iconClass}" style="font-size: 28px; font-weight: ${iconWeight}; cursor: pointer; color: ${schemeColors.text};">menu</span>
                    </div>
                    <div class="header-logo" style="position: absolute; left: 50%; transform: translateX(-50%);">${logoHtml}</div>
                    ${iconsHtml}
                </header>
            `;
            break;
            
        case 'logo-left-menu-center-inline':
            headerContent = `
                <header style="height: 120px; display: flex; align-items: center; justify-content: space-between; padding: 0 50px; border-bottom: ${config.showDivider ? `1px solid ${schemeColors.border || '#e5e5e5'}` : 'none'}; background-color: ${schemeColors.background}; color: ${schemeColors.text};">
                    <div class="header-logo">${logoHtml}</div>
                    <div class="header-menu-center" style="position: absolute; left: 50%; transform: translateX(-50%); display: flex; gap: 32px; align-items: center;">
                        ${menuItems}
                    </div>
                    ${iconsHtml}
                </header>
            `;
            break;
            
        case 'logo-left-menu-left-inline':
            headerContent = `
                <header style="height: 120px; display: flex; align-items: center; justify-content: space-between; padding: 0 50px; border-bottom: ${config.showDivider ? `1px solid ${schemeColors.border || '#e5e5e5'}` : 'none'}; background-color: ${schemeColors.background}; color: ${schemeColors.text};">
                    <div style="display: flex; align-items: center; gap: 48px;">
                        <div class="header-logo">${logoHtml}</div>
                        <div class="header-menu-left" style="display: flex; gap: 32px; align-items: center;">
                            ${menuItems}
                        </div>
                    </div>
                    ${iconsHtml}
                </header>
            `;
            break;
            
        case 'logo-center-menu-left-inline':
            headerContent = `
                <header style="height: 120px; display: flex; align-items: center; justify-content: space-between; padding: 0 50px; border-bottom: ${config.showDivider ? `1px solid ${schemeColors.border || '#e5e5e5'}` : 'none'}; background-color: ${schemeColors.background}; color: ${schemeColors.text};">
                    <div class="header-menu-left" style="display: flex; gap: 32px; align-items: center;">
                        ${menuItems}
                    </div>
                    <div class="header-logo" style="position: absolute; left: 50%; transform: translateX(-50%);">${logoHtml}</div>
                    ${iconsHtml}
                </header>
            `;
            break;
            
        case 'logo-center-menu-center-below':
            headerContent = `
                <header style="display: flex; flex-direction: column; padding: 20px 50px; border-bottom: ${config.showDivider ? `1px solid ${schemeColors.border || '#e5e5e5'}` : 'none'}; background-color: ${schemeColors.background}; color: ${schemeColors.text};">
                    <div style="display: flex; align-items: center; justify-content: space-between; height: 80px;">
                        <div style="width: 120px;"></div>
                        <div class="header-logo">${logoHtml}</div>
                        ${iconsHtml}
                    </div>
                    <div class="header-menu-center" style="display: flex; gap: 32px; align-items: center; justify-content: center; margin-top: 20px;">
                        ${menuItems}
                    </div>
                </header>
            `;
            break;
            
        case 'logo-left-menu-left-below':
            headerContent = `
                <header style="display: flex; flex-direction: column; padding: 20px 50px; border-bottom: ${config.showDivider ? `1px solid ${schemeColors.border || '#e5e5e5'}` : 'none'}; background-color: ${schemeColors.background}; color: ${schemeColors.text};">
                    <div style="display: flex; align-items: center; justify-content: space-between; height: 80px;">
                        <div class="header-logo">${logoHtml}</div>
                        ${iconsHtml}
                    </div>
                    <div class="header-menu-left" style="display: flex; gap: 32px; align-items: center; margin-top: 20px;">
                        ${menuItems}
                    </div>
                </header>
            `;
            break;
            
        default:
            // Default to logo-center-menu-left-inline
            headerContent = `
                <header style="height: 120px; display: flex; align-items: center; justify-content: space-between; padding: 0 50px; border-bottom: ${config.showDivider ? `1px solid ${schemeColors.border || '#e5e5e5'}` : 'none'}; background-color: ${schemeColors.background}; color: ${schemeColors.text};">
                    <div class="header-menu-left" style="display: flex; gap: 32px; align-items: center;">
                        ${menuItems}
                    </div>
                    <div class="header-logo" style="position: absolute; left: 50%; transform: translateX(-50%);">${logoHtml}</div>
                    ${iconsHtml}
                </header>
            `;
    }

    return `<div class="section-wrapper" data-section-id="header">
                <div class="section-header-tag">
                    <span class="material-symbols-outlined" style="font-size: 16px;">view_quilt</span>Header
                </div>
                ${headerContent}
            </div>`;
}

/**
 * Renderiza el HTML para la Barra de Anuncios, incluyendo el wrapper y el contenido real.
 * @param {object} config - La configuración de la barra de anuncios.
 * @returns {string} El string HTML para la barra de anuncios.
 */
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

    // Get typography settings
    const bodyTypography = currentGlobalThemeSettings?.typography?.body || {};
    const bodyFontValue = bodyTypography.font || 'roboto';
    const bodyFontFamily = window.getFontNameFromValueSafe(bodyFontValue);
    const bodyFontSize = bodyTypography.fontSize || '16px';
    
    console.log('[DEBUG] Announcement bar typography:', {
        fontValue: bodyFontValue,
        fontFamily: bodyFontFamily,
        fontSize: bodyFontSize
    });
    
    const announcementContentHtml = isMarquee ? `
        <div class="announcement-bar-content marquee-mode" style="position: relative; padding: 10px 50px; background-color: ${schemeColors.background}; color: ${schemeColors.text}; font-family: ${bodyFontFamily}, -apple-system, BlinkMacSystemFont, 'Segoe UI', Helvetica, Arial, sans-serif; font-size: ${bodyFontSize}; font-weight: 400; letter-spacing: 0.04em; line-height: 1.5; overflow: hidden;">
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
        <div class="announcement-bar-content" style="position: relative; padding: 10px 50px; background-color: ${schemeColors.background}; color: ${schemeColors.text}; font-family: ${bodyFontFamily}, -apple-system, BlinkMacSystemFont, 'Segoe UI', Helvetica, Arial, sans-serif; font-size: ${bodyFontSize}; font-weight: 400; letter-spacing: 0.04em; line-height: 1.5;">
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

    return `<div class="section-wrapper" data-section-id="announcement">
                <div class="section-header-tag">
                    <span class="material-symbols-outlined" style="font-size: 16px;">campaign</span>Announcement Bar
                </div>
                ${announcementContentHtml}
            </div>`;
}

/**
 * Navega entre anuncios en el announcement bar
 * @param {string} direction - 'prev' o 'next'
 */
window.navigateAnnouncement = function(direction) {
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

    if (visibleAnnouncements.length <= 1) return;

    // Get animation style
    const animationStyle = currentSectionsConfig.announcementBar.animationStyle || 'none';
    
    // Skip navigation for marquee mode
    if (animationStyle === 'marquee') return;
    const previewIframe = document.getElementById('preview-iframe');
    const announcementElement = previewIframe?.contentDocument?.querySelector('.announcement-bar-content');

    // Apply animation if element exists and animation is not 'none'
    if (announcementElement && animationStyle !== 'none') {
        // Add exit animation class
        if (animationStyle === 'fade') {
            announcementElement.classList.add('fade-out');
        } else if (animationStyle === 'slide-horizontal') {
            announcementElement.classList.add('slide-horizontal-out');
        } else if (animationStyle === 'slide-vertical') {
            announcementElement.classList.add('slide-vertical-out');
        }

        // Wait for animation to complete before updating content
        setTimeout(() => {
            // Update index
            if (direction === 'next') {
                currentAnnouncementIndex = (currentAnnouncementIndex + 1) % visibleAnnouncements.length;
            } else {
                currentAnnouncementIndex = (currentAnnouncementIndex - 1 + visibleAnnouncements.length) % visibleAnnouncements.length;
            }

            // Re-render the preview
            renderPreview();

            // Apply entry animation after a brief delay
            setTimeout(() => {
                const newAnnouncementElement = previewIframe?.contentDocument?.querySelector('.announcement-bar-content');
                if (newAnnouncementElement) {
                    if (animationStyle === 'fade') {
                        newAnnouncementElement.classList.add('fade-in');
                    } else if (animationStyle === 'slide-horizontal') {
                        newAnnouncementElement.classList.add('slide-horizontal-in');
                    } else if (animationStyle === 'slide-vertical') {
                        newAnnouncementElement.classList.add('slide-vertical-in');
                    } else if (animationStyle === 'typewriter') {
                        const textElement = newAnnouncementElement.querySelector('p');
                        if (textElement) {
                            textElement.classList.add('announcement-text-typewriter');
                        }
                    }
                }
            }, 50);
        }, animationStyle === 'fade' ? 300 : 400);
    } else {
        // No animation, update immediately
        if (direction === 'next') {
            currentAnnouncementIndex = (currentAnnouncementIndex + 1) % visibleAnnouncements.length;
        } else {
            currentAnnouncementIndex = (currentAnnouncementIndex - 1 + visibleAnnouncements.length) % visibleAnnouncements.length;
        }

        // Re-render the preview
        renderPreview();
    }
    
    // Reiniciar autoplay si está activo
    if (currentSectionsConfig.announcementBar.autoplayMode !== 'none') {
        startAnnouncementAutoplay();
    }
};

/**
 * Inicia el autoplay de anuncios
 */
function startAnnouncementAutoplay() {
    // Detener cualquier autoplay existente
    stopAnnouncementAutoplay();
    
    const config = currentSectionsConfig.announcementBar;
    if (!config || config.autoplayMode === 'none') return;
    
    // Skip autoplay for marquee mode
    if (config.animationStyle === 'marquee') return;
    
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
    
    // Solo activar autoplay si hay múltiples anuncios
    if (visibleAnnouncements.length > 1) {
        const intervalMs = (config.autoplaySpeed || 6) * 1000;
        announcementAutoplayTimer = setInterval(() => {
            window.navigateAnnouncement('next');
        }, intervalMs);
    }
}

/**
 * Detiene el autoplay de anuncios
 */
function stopAnnouncementAutoplay() {
    if (announcementAutoplayTimer) {
        clearInterval(announcementAutoplayTimer);
        announcementAutoplayTimer = null;
    }
}

/**
 * Renderiza todas las secciones de la página en el iframe de previsualización.
 */
function renderPreview() {
    console.log('[PREVIEW] Rendering preview...');
    const previewIframe = document.getElementById('preview-iframe');
    if (!previewIframe || !previewIframe.contentWindow) {
        console.warn('[PREVIEW] Iframe no encontrado o no listo. Se reintentará.');
        setTimeout(renderPreview, 200); // Reintentar si el iframe aún no está listo
        return;
    }

    const previewDoc = previewIframe.contentWindow.document;
    const previewBody = previewDoc.body;
    if (!previewBody) {
        console.warn('[PREVIEW] El body del Iframe no está listo. Se reintentará.');
        setTimeout(renderPreview, 200);
        return;
    }

    // Limpiar el contenido anterior
    previewBody.innerHTML = '';

    let finalHtml = '';
    const renderers = {
        'announcement': renderAnnouncementBar,
        'header': renderHeader
        // Aquí añadiremos más renderers en el futuro (slideshow, footer, etc.)
    };

    // Renderizar secciones según el orden definido
    if (currentSectionsConfig && currentSectionsConfig.sectionOrder) {
        currentSectionsConfig.sectionOrder.forEach(sectionId => {
            const renderer = renderers[sectionId];
            const config = currentSectionsConfig[sectionId === 'announcement' ? 'announcementBar' : sectionId];
            if (renderer && config) {
                finalHtml += renderer(config);
            }
        });
    }
    
    previewBody.innerHTML = finalHtml;
    console.log('[PREVIEW] Renderizado completado.');
    
    // Attach click listeners to the newly rendered section wrappers
    const sectionWrappers = previewDoc.querySelectorAll('.section-wrapper');
    sectionWrappers.forEach(wrapper => {
        wrapper.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();

            const sectionId = this.dataset.sectionId;
            console.log(`[PREVIEW CLICK] Section clicked: ${sectionId}`);

            // Cambia la vista del panel lateral según la sección clickeada.
            if (sectionId === 'header') {
                // Asegurarse de que el botón de 'settings' no esté activo
                $('.topbar-nav-icon').removeClass('active');
                // Activar el botón de secciones
                $('.topbar-nav-icon[data-view="sections"]').addClass('active');

                // Cambiar a la vista de configuración del header
                window.switchSidebarView('headerSettings');
            } else if (sectionId === 'announcement') {
                // Lógica similar para la barra de anuncios
                $('.topbar-nav-icon').removeClass('active');
                $('.topbar-nav-icon[data-view="sections"]').addClass('active');
                window.switchSidebarView('announcementBar');
            }
            // Aquí añadiremos más 'else if' para otras secciones en el futuro.
        });
    });
    
    // Iniciar autoplay si está configurado
    startAnnouncementAutoplay();
    
    // Load Google Fonts in preview iframe
    loadFontsInPreview();
}

// Function to load Google Fonts in the preview iframe
function loadFontsInPreview() {
    const previewFrame = document.getElementById('preview-iframe');
    if (!previewFrame || !previewFrame.contentDocument) return;
    
    const iframeHead = previewFrame.contentDocument.head;
    
    // Get all fonts from typography settings
    if (currentGlobalThemeSettings && currentGlobalThemeSettings.typography) {
        const typography = currentGlobalThemeSettings.typography;
        const fontsToLoad = new Set();
        
        // Collect all unique fonts
        if (typography.heading?.font) fontsToLoad.add(typography.heading.font);
        if (typography.body?.font) fontsToLoad.add(typography.body.font);
        if (typography.menu?.font) fontsToLoad.add(typography.menu.font);
        if (typography.product?.font) fontsToLoad.add(typography.product.font);
        if (typography.buttons?.font) fontsToLoad.add(typography.buttons.font);
        
        // Load each font
        fontsToLoad.forEach(fontValue => {
            const fontName = window.getFontNameFromValue ? window.getFontNameFromValue(fontValue) : null;
            if (fontName) {
                const linkId = `google-font-${fontValue}`;
                const existingLink = iframeHead.querySelector(`#${linkId}`);
                
                if (!existingLink) {
                    const link = document.createElement('link');
                    link.id = linkId;
                    link.href = `https://fonts.googleapis.com/css2?family=${fontName.replace(/\s+/g, '+')}:wght@400;500;600;700&display=swap`;
                    link.rel = 'stylesheet';
                    iframeHead.appendChild(link);
                }
            }
        });
    }
}

$(document).ready(async function() {
    // Load current website data first
    await loadCurrentWebsite();
    
    // Wait for preview iframe to be ready before applying styles
    const previewFrame = document.getElementById('preview-iframe');
    if (previewFrame) {
        previewFrame.addEventListener('load', () => {
            console.log('[DEBUG] Preview iframe loaded, applying initial styles');
            applyGlobalStylesToPreview(currentGlobalThemeSettings);
            renderPreview(); // <-- AÑADIR ESTA LÍNEA
        });
    }
    
    // Get current language from localStorage or default to Spanish
    let currentLanguage = localStorage.getItem('preferredLanguage') || 'es';
    
    // Translation objects
    const translations = window.translations = {
        es: {
            exitEditorButtonText: "Salir",
            themeLabel: "Plantilla",
            homePageLabel: "Página de inicio",
            createNewPageButtonText: "Nueva Página",
            deletePageButtonText: "Eliminar",
            saveButtonText: "Guardar",
            // New translations for sidebar
            sidebarLoadingText: "Cargando contenido del panel...",
            previewAreaPlaceholderText: "El área de previsualización de su sitio aparecerá aquí.",
            pageHierarchyViewTitle: "Página: ",
            addSectionButtonText: "+ Agregar Sección",
            resetPageButtonText: "Resetear Página a Defaults",
            themeSettingsButtonText: "Configuración del Tema",
            editingBlockTitle: "Editando Bloque",
            addSectionViewTitle: "Añadir Sección",
            themeSettingsViewTitle: "Configuración del Tema",
            backButtonText: "Atrás",
            availableBlockTypesTitle: "Tipos de bloques disponibles:",
            blockTypeHeader: "Encabezado",
            blockTypeImage: "Imagen",
            blockTypeGallery: "Galería",
            blockTypeText: "Texto",
            blockTypeButtons: "Botones",
            blockTypeSlideshow: "Presentación",
            // Sections panel translations
            'sections.header': 'Encabezado',
            'sections.announcementBar': 'Barra de anuncios',
            'sections.headerSection': 'Encabezado',
            'sections.template': 'Plantilla',
            'sections.slideshow': 'Presentación de diapositivas',
            'sections.multirow': 'Varias filas',
            'sections.multicolumn': 'Multicolumna',
            'sections.imageWithText': 'Imagen con texto',
            'sections.customLiquid': 'Líquido personalizado',
            'sections.collapsibleContent': 'Contenido desplegable',
            'sections.contactForm': 'Formulario de contacto',
            'sections.addSection': 'Agregar sección',
            'sections.footer': 'Pie de página',
            'sections.footerSection': 'Pie de página',
            'sections.viewPage': 'Ver página',
            'sections.addAnnouncement': 'Agregar anuncio',
            'sections.addBlock': 'Agregar bloque',
            // Announcement Bar translations
            'announcementBar.showOnlyHomePage': 'Mostrar solo en página de inicio',
            'announcementBar.colorScheme': 'Esquema de color',
            'announcementBar.learnAboutColorSchemes': 'Aprende sobre esquemas de color',
            'announcementBar.width': 'Ancho',
            'announcementBar.showNavigationArrows': 'Mostrar flechas de navegación',
            'announcementBar.autoplay': 'Reproducción automática',
            'announcementBar.autoplayMode': 'Modo de reproducción automática',
            'announcementBar.none': 'Ninguno',
            'announcementBar.oneAtATime': 'Uno a la vez',
            'announcementBar.autoplaySpeed': 'Velocidad de reproducción automática',
            'announcementBar.animationStyle': 'Estilo de animación',
            'announcementBar.animationNone': 'Sin animación',
            'announcementBar.animationFade': 'Desvanecimiento',
            'announcementBar.animationSlideHorizontal': 'Deslizar horizontal',
            'announcementBar.animationSlideVertical': 'Deslizar vertical',
            'announcementBar.animationTypewriter': 'Máquina de escribir',
            'announcementBar.animationMarquee': 'Marquesina infinita',
            'announcementBar.languageSelector': 'Selector de idioma',
            'announcementBar.languageSelectorDesc': 'Muestra selector en escritorio. Para agregar un idioma, ve a tu configuración de idioma',
            'announcementBar.showLanguageSelector': 'Mostrar selector de idioma',
            'announcementBar.currencySelector': 'Selector de moneda',
            'announcementBar.currencySelectorDesc': 'Muestra selector en escritorio. Para agregar una moneda, ve a tu configuración de pagos',
            'announcementBar.showCurrencySelector': 'Mostrar selector de moneda',
            'announcementBar.socialMediaIcons': 'Iconos de redes sociales',
            'announcementBar.socialMediaDesc': 'Muestra iconos en escritorio. Agrega enlaces a tus cuentas de redes sociales en Configuración del tema>Redes sociales',
            'announcementBar.showSocialMediaIcons': 'Mostrar iconos de redes sociales',
            'announcementBar.rename': 'Renombrar',
            'announcementBar.show': 'Mostrar',
            'announcementBar.locate': 'Localizar',
            'announcementBar.announcements': 'Anuncios',
            'announcementBar.makeAnnouncement': 'Hacer un anuncio',
            'announcementBar.addAnnouncement': 'Agregar anuncio',
            // Theme Settings translations
            'themeSettings.title': 'Configuración del tema',
            'themeSettings.appearance': 'Apariencia',
            'themeSettings.typography': 'Tipografía',
            'themeSettings.colorSchemes': 'Esquemas de color',
            'themeSettings.productCards': 'Tarjetas de producto',
            'themeSettings.productBadges': 'Insignias de producto',
            'themeSettings.cart': 'Carrito',
            'themeSettings.favicon': 'Favicon',
            'themeSettings.navigation': 'Navegación',
            'themeSettings.socialMedia': 'Redes sociales',
            'themeSettings.swatches': 'Muestras',
            'themeSettings.advanced': 'Avanzado',
            // Appearance translations
            'appearance.title': 'Apariencia',
            'appearance.pageWidth': 'Ancho de página',
            'appearance.sidePaddingSize': 'Tamaño del relleno lateral',
            'appearance.edgeRounding': 'Redondeo de bordes',
            'appearance.edgeRoundingNone': 'Tamaño 0 - Ninguno',
            'appearance.edgeRoundingXSmall': 'Tamaño 1 - Extra pequeño',
            'appearance.edgeRoundingSmall': 'Tamaño 2 - Pequeño',
            'appearance.edgeRoundingMedium': 'Tamaño 3 - Mediano',
            'appearance.edgeRoundingLarge': 'Tamaño 4 - Grande',
            'appearance.edgeRoundingDescription': 'Se aplica a tarjetas, botones, esquinas de sección y otros elementos',
            // Header Settings translations
            'headerSettings.title': 'Encabezado',
            'headerSettings.colorScheme': 'Esquema de color',
            'headerSettings.learnAboutColorSchemes': 'Aprende sobre esquemas de color',
            'headerSettings.width': 'Ancho',
            'headerSettings.widthScreen': 'Pantalla',
            'headerSettings.widthPage': 'Página',
            'headerSettings.widthLarge': 'Grande',
            'headerSettings.widthMedium': 'Mediano',
            'headerSettings.layout': 'Diseño',
            'headerSettings.layoutDrawer': 'Cajón',
            'headerSettings.layoutLogoLeftMenuCenter': 'Logo izquierda, menú centro en línea',
            'headerSettings.layoutLogoLeftMenuLeft': 'Logo izquierda, menú izquierda en línea',
            'headerSettings.layoutLogoCenterMenuLeft': 'Logo centro, menú izquierda en línea',
            'headerSettings.layoutLogoCenterMenuCenterBelow': 'Logo centro, menú centro debajo',
            'headerSettings.layoutLogoLeftMenuLeftBelow': 'Logo izquierda, menú izquierda debajo',
            'headerSettings.layoutDescription': 'El diseño se optimiza automáticamente para móvil',
            'headerSettings.mobileLayout': 'Diseño móvil',
            'headerSettings.enableStickyHeader': 'Habilitar encabezado fijo',
            'headerSettings.showDivider': 'Mostrar divisor',
            'headerSettings.default': 'Por defecto',
            'headerSettings.primary': 'Primario',
            'headerSettings.secondary': 'Secundario',
            'headerSettings.contrasting': 'Contrastante',
            'headerSettings.scheme': 'Esquema',
            'headerSettings.menu': 'Menú',
            'headerSettings.openMenuDropdown': 'Abrir menú desplegable',
            'headerSettings.onHover': 'Al pasar el cursor',
            'headerSettings.onClick': 'Al hacer clic',
            'headerSettings.chooseNavigationMenu': 'Elegir menú de navegación',
            'headerSettings.mainMenu': 'Menú principal',
            'headerSettings.footerMenu': 'Menú de pie de página',
            'headerSettings.logo': 'Logo',
            'headerSettings.desktopLogo': 'Logo de escritorio',
            'headerSettings.desktopLogoSize': 'Tamaño del logo de escritorio',
            'headerSettings.mobileLogo': 'Logo móvil',
            'headerSettings.mobileLogoSize': 'Tamaño del logo móvil',
            'headerSettings.selectImage': 'Seleccionar',
            'headerSettings.browseFreeImages': 'Explorar imágenes gratuitas',
            'headerSettings.icons': 'Iconos',
            'headerSettings.iconStyle': 'Estilo de icono',
            'headerSettings.iconStyleSolid': 'Sólido',
            'headerSettings.iconStyleOutline': 'Contorno',
            'headerSettings.cartType': 'Tipo de carrito',
            'headerSettings.cartTypeBag': 'Bolsa',
            'headerSettings.cartTypeCart': 'Carrito',
            'headerSettings.uploadingImage': 'Subiendo imagen...',
            'headerSettings.uploadFailed': 'Error al subir',
            'headerSettings.changeImage': 'Cambiar imagen',
            'headerSettings.removeImage': 'Eliminar imagen',
            // Announcement Item Settings translations
            'announcementItem.title': 'Anuncio',
            'announcementItem.announcement': 'Anuncio',
            'announcementItem.link': 'Enlace',
            'announcementItem.linkPlaceholder': 'Pega un enlace o busca',
            'announcementItem.icon': 'Icono',
            'announcementItem.select': 'Seleccionar',
            'announcementItem.selectPlaceholder': 'Seleccionar',
            'announcementItem.browseFreeImages': 'Explorar imágenes gratuitas',
            'announcementItem.deleteBlock': 'Eliminar bloque',
            'announcementItem.makeAnnouncement': 'Hacer un anuncio',
            'announcementItem.fontTitle': 'Fuente',
            'announcementItem.boldTitle': 'Negrita',
            'announcementItem.italicTitle': 'Cursiva',
            'announcementItem.linkTitle': 'Enlace',
            'announcementItem.bulletListTitle': 'Lista con viñetas',
            'announcementItem.numberedListTitle': 'Lista numerada',
            // Typography translations
            'typography.title': 'Tipografía',
            'typography.description': 'Te recomendamos que no uses más de dos familias de fuentes para tu tienda.',
            'typography.learnMore': 'Aprende cómo las fuentes afectan la velocidad de la tienda',
            'typography.heading': 'Encabezados',
            'typography.body': 'Cuerpo',
            'typography.menu': 'Menú',
            'typography.productCardName': 'Nombre de tarjeta de producto',
            'typography.buttons': 'Botones',
            'typography.font': 'Fuente',
            'typography.fontSize': 'Tamaño de fuente',
            'typography.useUppercase': 'Usar mayúsculas',
            'typography.letterSpacing': 'Espaciado entre letras',
            // Color Schemes translations  
            'colorSchemes.title': 'Esquemas de color',
            'colorSchemes.defaultColorScheme': 'Esquema de color predeterminado',
            'colorSchemes.learnAbout': 'Aprende sobre esquemas de color',
            'colorSchemes.primary': 'Primario',
            'colorSchemes.secondary': 'Secundario',
            'colorSchemes.contrasting': 'Contrastante',
            'colorSchemes.text': 'Texto',
            'colorSchemes.background': 'Fondo',
            'colorSchemes.foreground': 'Primer plano',
            'colorSchemes.border': 'Borde',
            'colorSchemes.solidButton': 'Botón sólido',
            'colorSchemes.solidButtonText': 'Texto de botón sólido',
            'colorSchemes.outlineButton': 'Botón de contorno',
            'colorSchemes.outlineButtonText': 'Texto de botón de contorno',
            'colorSchemes.imageOverlay': 'Superposición de imagen',
            'colorSchemes.configuration': 'Configuración del esquema de color',
            // Product Cards translations
            'productCards.title': 'Tarjetas de producto',
            'productCards.defaultImageRatio': 'Relación de imagen predeterminada',
            'productCards.portraitLarge23': 'Retrato grande (2:3) - Llenar',
            'productCards.square11': 'Cuadrado (1:1) - Llenar',
            'productCards.portrait34': 'Retrato (3:4) - Llenar',
            'productCards.portraitLarge23Fit': 'Retrato grande (2:3) - Ajustar',
            'productCards.landscape43': 'Horizontal (4:3) - Llenar',
            'productCards.square11Fit': 'Cuadrado (1:1) - Ajustar',
            'productCards.portrait34Fit': 'Retrato (3:4) - Ajustar',
            'productCards.portraitLarge23Fit2': 'Retrato grande (2:3) - Ajustar',
            'productCards.landscape43Fit': 'Horizontal (4:3) - Ajustar',
            'productCards.showVendor': 'Mostrar proveedor',
            'productCards.showCurrencyCode': 'Mostrar código de moneda',
            'productCards.showColorCount': 'Mostrar cantidad de colores',
            'productCards.colorCardBackground': 'Colorear fondo de tarjeta',
            'productCards.darkenImageBackground': 'Oscurecer fondo de imagen',
            'productCards.transparentBackgroundInfo': 'Para imágenes de productos con fondo inicialmente blanco o transparente',
            'productCards.productRating': 'Calificación del producto',
            'productCards.none': 'Ninguno',
            'productCards.starsOnly': 'Solo estrellas',
            'productCards.reviewCountOnly': 'Solo conteo de reseñas',
            'productCards.averageRatingOnly': 'Solo calificación promedio',
            'productCards.reviewCountAndStars': 'Conteo de reseñas y estrellas',
            'productCards.averageRatingAndStars': 'Calificación promedio y estrellas',
            'productCards.reviewAppInfo': 'Para mostrar calificación dinámica del producto, agrega una aplicación de reseñas',
            'productCards.priceLabelSize': 'Tamaño de etiqueta de precio',
            'productCards.extraSmall': 'Extra pequeño',
            'productCards.small': 'Pequeño',
            'productCards.medium': 'Mediano',
            'productCards.large': 'Grande',
            'productCards.imageHoverEffect': 'Efecto de imagen al pasar el cursor',
            'productCards.zoom': 'Zoom',
            'productCards.showAllMedia': 'Mostrar todos los medios',
            'productCards.showSecondMedia': 'Mostrar segundo medio',
            'productCards.swatches': 'Muestras',
            'productCards.swatchesInfo': 'Ajusta la vista de muestras en Configuración del tema>Muestras',
            'productCards.whatToShow': 'Qué mostrar',
            'productCards.variantImages': 'Imágenes de variantes',
            'productCards.colorSwatches': 'Muestras de color',
            'productCards.both': 'Ambos',
            'productCards.showOnDesktop': 'Mostrar en escritorio',
            'productCards.onHover': 'Al pasar el cursor',
            'productCards.always': 'Siempre',
            'productCards.never': 'Nunca',
            'productCards.showOnMobile': 'Mostrar en móvil',
            'productCards.hideForSingleValue': 'Ocultar para productos de un solo valor',
            'productCards.quickBuyButtons': 'Botones de compra rápida',
            'productCards.showQuickView': 'Mostrar "Vista rápida"',
            'productCards.showAddToCart': 'Mostrar "Agregar al carrito"',
            'productCards.singleVariantInfo': 'Solo para productos de una sola variante',
            'productCards.desktopButtonStyle': 'Estilo de botón en escritorio',
            'productCards.labels': 'Etiquetas',
            'productCards.icons': 'Iconos',
            'productCards.showButtonsOnHover': 'Mostrar botones al pasar el cursor',
            'productCards.productBadges': 'Insignias de producto',
            'productCards.badgesInfo': 'Ajusta la vista y los colores de las insignias en Configuración del tema>Insignias de producto',
            'productCards.badgesDesktopPosition': 'Posición en escritorio',
            'productCards.badgesOnImage': 'En la imagen',
            'productCards.badgesBelowImage': 'Debajo de la imagen',
            'productCards.badgesAboveTitle': 'Encima del título',
            'productCards.showSoldOutBadge': 'Mostrar insignia "Agotado"',
            'productCards.showSaleBadge': 'Mostrar insignia "Oferta"',
            'productCards.showSaleBadgeNextToPrice': 'Mostrar insignia "Oferta" junto al precio',
            'productCards.highlightSalePrice': 'Resaltar precio de oferta',
            'productCards.showCustom1Badge': 'Mostrar insignia "Personalizada 1"',
            'productCards.showCustom2Badge': 'Mostrar insignia "Personalizada 2"',
            'productCards.showCustom3Badge': 'Mostrar insignia "Personalizada 3"',
            // Product Badges translations
            'productBadges.title': 'Insignias de producto',
            'productBadges.adjustInfo': 'Ajusta la vista y los colores de las insignias. Puedes activarlas en el bloque "blocks" en la página del producto o en Configuración del tema>Tarjetas de producto',
            'productBadges.soldOutBadge': 'Insignia "Agotado"',
            'productBadges.saleBadge': 'Insignia "Oferta"',
            'productBadges.saleBadgeNextToPrice': 'Insignia "Oferta" junto al precio',
            'productBadges.salePriceHighlight': 'Resaltado de precio de oferta',
            'productBadges.custom1Badge': 'Insignia "Personalizada 1"',
            'productBadges.customBadgeInfo': 'Crea tus propias insignias vinculándolas a etiquetas de productos',
            'productBadges.background': 'Fondo',
            'productBadges.text': 'Texto',
            'productBadges.showAs': 'Mostrar como',
            'productBadges.sale': 'Oferta',
            'productBadges.percentageOff': '-10%',
            'productBadges.valueOff': '-$10',
            'productBadges.tag': 'Etiqueta',
            'productBadges.textPlaceholder': 'Más vendido',
            'productBadges.tagPlaceholder': 'Más vendidos',
            // Cart translations
            'cart.title': 'Carrito',
            'cart.showAs': 'Mostrar como',
            'cart.drawerAndPage': 'Cajón y página',
            'cart.drawerOnly': 'Solo cajón',
            'cart.pageOnly': 'Solo página',
            'cart.showStickyCart': 'Mostrar carrito fijo',
            'cart.cartStatusColors': 'Colores de estado del carrito',
            'cart.background': 'Fondo',
            'cart.text': 'Texto',
            'cart.freeShippingBar': 'Barra de envío gratis',
            'cart.showProgressBar': 'Mostrar barra de progreso',
            'cart.freeShippingThreshold': 'Umbral de envío gratis',
            'cart.thresholdDescription': 'Ingresa el valor en la moneda principal de tu tienda. Configura tu tarifa de envío o descuento automático de envío gratis para que coincida con el objetivo.',
            'cart.shippingRate': 'tarifa de envío',
            'cart.automaticFreeShipping': 'descuento automático de envío gratis',
            'cart.progressBar': 'Barra de progreso',
            'cart.progressBarTrack': 'Pista de barra de progreso',
            'cart.degradadoIn': 'Degradado In...',
            'cart.solid': 'Sólido',
            'cart.gradient': 'Degradado',
            'cart.message': 'Mensaje',
            // Favicon translations
            'favicon.title': 'Favicon',
            'favicon.description': 'Los favicons son iconos pequeños que aparecen en las pestañas del navegador.',
            'favicon.selectImage': 'Seleccionar imagen',
            'favicon.noImageSelected': 'No se ha seleccionado ninguna imagen',
            // Navigation translations
            'navigation.title': 'Navegación',
            'navigation.search': 'Búsqueda',
            'navigation.showAs': 'Mostrar como',
            'navigation.drawerAndPage': 'Cajón y página',
            'navigation.drawerOnly': 'Solo cajón',
            'navigation.pageOnly': 'Solo página',
            'navigation.none': 'Ninguno',
            'navigation.backToTop': 'Volver arriba',
            'navigation.showBackToTopButton': 'Mostrar botón de volver arriba',
            'navigation.buttonPosition': 'Posición del botón',
            'navigation.bottomLeft': 'Inferior izquierda',
            'navigation.bottomCenter': 'Inferior centro',
            'navigation.bottomRight': 'Inferior derecha',
            'navigation.alwaysBottomLeftOnMobile': 'Siempre "Inferior izquierda" en móvil',
            'navigation.socialMedia': 'Redes sociales',
            'navigation.socialAccounts': 'Cuentas sociales',
            'navigation.socialAccountsInfo': 'Para mostrar tus cuentas de redes sociales, vincúlalas en la configuración de tu tema.',
            'navigation.enableStickyHeader': 'Habilitar encabezado pegajoso en escritorio',
            'navigation.showSeparatorLine': 'Mostrar línea separadora',
            'navigation.reduceLogoSize': 'Reducir tamaño del logo al desplazarse',
            'navigation.announcementBar': 'Barra de anuncios',
            // Social Media translations
            'socialMedia.title': 'Redes sociales',
            'socialMedia.iconStyle': 'Estilo de ícono',
            'socialMedia.solid': 'Sólido',
            'socialMedia.outline': 'Contorno',
            'socialMedia.instagram': 'Instagram',
            'socialMedia.instagramPlaceholder': 'http://instagram.com',
            'socialMedia.instagramHelp': 'http://instagram.com/tutienda',
            'socialMedia.facebook': 'Facebook',
            'socialMedia.facebookPlaceholder': 'https://facebook.com',
            'socialMedia.facebookHelp': 'https://facebook.com/tutienda',
            'socialMedia.twitter': 'Twitter',
            'socialMedia.twitterPlaceholder': 'https://twitter.com/',
            'socialMedia.twitterHelp': 'https://twitter.com/tutienda',
            'socialMedia.youtube': 'YouTube',
            'socialMedia.youtubePlaceholder': '',
            'socialMedia.youtubeHelp': 'https://www.youtube.com/tutienda',
            'socialMedia.pinterest': 'Pinterest',
            'socialMedia.pinterestPlaceholder': 'https://pinterest.com',
            'socialMedia.pinterestHelp': 'https://pinterest.com/tutienda',
            'socialMedia.tiktok': 'TikTok',
            'socialMedia.tiktokPlaceholder': '',
            'socialMedia.tiktokHelp': 'https://tiktok.com/@tutienda',
            'socialMedia.tumblr': 'Tumblr',
            'socialMedia.tumblrPlaceholder': '',
            'socialMedia.tumblrHelp': 'https://tutienda.tumblr.com',
            'socialMedia.snapchat': 'Snapchat',
            'socialMedia.snapchatPlaceholder': '',
            'socialMedia.snapchatHelp': 'https://www.snapchat.com/add/tutienda',
            'socialMedia.linkedin': 'LinkedIn',
            'socialMedia.linkedinPlaceholder': '',
            'socialMedia.linkedinHelp': 'https://www.linkedin.com/company/tutienda',
            'socialMedia.vimeo': 'Vimeo',
            'socialMedia.vimeoPlaceholder': '',
            'socialMedia.vimeoHelp': 'https://vimeo.com/tutienda',
            'socialMedia.flickr': 'Flickr',
            'socialMedia.flickrPlaceholder': '',
            'socialMedia.flickrHelp': 'https://www.flickr.com/photos/tutienda',
            'socialMedia.reddit': 'Reddit',
            'socialMedia.redditPlaceholder': '',
            'socialMedia.redditHelp': 'https://www.reddit.com/user/tutienda',
            'socialMedia.email': 'Correo electrónico',
            'socialMedia.emailPlaceholder': '',
            'socialMedia.emailHelp': 'mailto:contacto@tutienda.com',
            'socialMedia.behance': 'Behance',
            'socialMedia.behancePlaceholder': '',
            'socialMedia.behanceHelp': 'https://www.behance.net/tutienda',
            'socialMedia.discord': 'Discord',
            'socialMedia.discordPlaceholder': '',
            'socialMedia.discordHelp': 'https://discordapp.com/users/tutienda',
            'socialMedia.dribbble': 'Dribbble',
            'socialMedia.dribbblePlaceholder': '',
            'socialMedia.dribbbleHelp': 'https://dribbble.com',
            'socialMedia.medium': 'Medium',
            'socialMedia.mediumPlaceholder': '',
            'socialMedia.mediumHelp': 'https://medium.com/@tutienda',
            'socialMedia.twitch': 'Twitch',
            'socialMedia.twitchPlaceholder': '',
            'socialMedia.twitchHelp': 'https://twitch.tv/tutienda',
            'socialMedia.whatsapp': 'WhatsApp',
            'socialMedia.whatsappPlaceholder': '',
            'socialMedia.whatsappHelp': 'https://wa.me/numero_telefono',
            'socialMedia.viber': 'Viber',
            'socialMedia.viberPlaceholder': '',
            'socialMedia.viberHelp': 'viber://add?number=XXXXXXXXX',
            'socialMedia.telegram': 'Telegram',
            'socialMedia.telegramPlaceholder': '',
            'socialMedia.telegramHelp': 'https://t.me/usuario',
            'navigation.showAnnouncementBar': 'Mostrar barra de anuncios',
            'navigation.homePageOnly': 'Solo en página de inicio',
            'navigation.announcementText': 'Texto',
            'navigation.link': 'Enlace',
            // Social Media translations
            'socialMedia.title': 'Redes sociales',
            'socialMedia.accounts': 'Cuentas de redes sociales',
            'socialMedia.description': 'Para mostrar tus cuentas de redes sociales, enlázalas a tu tienda en línea.',
            'socialMedia.twitter': 'Twitter',
            'socialMedia.facebook': 'Facebook',
            'socialMedia.pinterest': 'Pinterest',
            'socialMedia.instagram': 'Instagram',
            'socialMedia.tiktok': 'TikTok',
            'socialMedia.tumblr': 'Tumblr',
            'socialMedia.snapchat': 'Snapchat',
            'socialMedia.youtube': 'YouTube',
            'socialMedia.vimeo': 'Vimeo',
            // Swatches translations
            'swatches.title': 'Muestras',
            'swatches.colors': 'Colores',
            'swatches.learnAbout': 'Aprende sobre',
            'swatches.primarySwatchOption': 'Opción de muestra principal',
            'swatches.showSwatchesInfo': 'Mostrar muestras en tarjetas de producto, páginas de producto y filtros',
            'swatches.optionName': 'Nombre de opción',
            'swatches.optionNamePlaceholder': 'Color',
            'swatches.optionNameHelp': 'Completa los nombres de opciones relevantes desde tu administrador para activar las muestras',
            'swatches.shapeForProductCards': 'Forma para tarjetas de producto',
            'swatches.portrait': 'Retrato',
            'swatches.landscape': 'Horizontal',
            'swatches.sizeForProductCards': 'Tamaño para tarjetas de producto',
            'swatches.shapeForProductPages': 'Forma para páginas de producto',
            'swatches.sizeForProductPages': 'Tamaño para páginas de producto',
            'swatches.shapeForFilters': 'Forma para filtros',
            'swatches.square': 'Cuadrado',
            'swatches.round': 'Redondo',
            'swatches.sizeForFilters': 'Tamaño para filtros',
            'swatches.customColorsAndPatterns': 'Colores y patrones personalizados',
            'swatches.customColorsPlaceholder': 'Ultramarino::#0043F2\nCerezo en flor::#FFB7C5\nDía soleado::amarillo/verde/azul/\nVerano::#F9AFB1/#0F9D5B/#4285F4',
            'swatches.customColorsHelp': 'Coloca cada regla en una línea separada.',
            'swatches.learnHowToAdd': 'Aprende cómo agregar muestras de color',
            'swatches.secondarySwatchOptions': 'Opciones de muestra secundarias',
            'swatches.showSwatchesForMore': 'Mostrar muestras para más de una opción en páginas de producto y filtros',
            'swatches.optionNames': 'Nombres de opciones',
            'swatches.optionNamesPlaceholder': 'Material\nMarco',
            'swatches.optionNamesHelp': 'Completa los nombres de opciones relevantes desde tu administrador, coloca cada uno en una línea separada',
            'swatches.learnAbout': 'Aprende sobre',
            'swatches.primarySwatchOption': 'Opción de muestra principal',
            'swatches.showSwatchesInfo': 'Mostrar muestras en tarjetas de productos, páginas de productos y filtros',
            'swatches.optionName': 'Nombre de opción',
            // Add section modal translations
            'sections.searchSections': 'Buscar secciones',
            'sections.sectionsTab': 'Secciones',
            'sections.applicationsTab': 'Aplicaciones',
            'sections.selectToPreview': 'Selecciona una sección para ver vista previa',
            'sections.noApplications': 'No hay aplicaciones disponibles',
            'sections.noPreview': 'Vista previa no disponible',
            // Section names
            'sections.featuredCollection': 'Colección destacada',
            'sections.featuredProduct': 'Producto destacado',
            'sections.collectionList': 'Lista de colecciones',
            'sections.richText': 'Texto enriquecido',
            'sections.imageBanner': 'Banner de imagen',
            'sections.slideshow': 'Presentación de diapositivas',
            'sections.collage': 'Collage',
            'sections.multicolumn': 'Multicolumna',
            'sections.newsletter': 'Boletín',
            'sections.contactForm': 'Formulario de contacto',
            'sections.customLiquid': 'Líquido personalizado',
            'sections.accordion': 'Acordeón',
            'sections.beforeAfterImages': 'Imágenes antes/después',
            'sections.blogPosts': 'Publicaciones del blog',
            'sections.collectionWithText': 'Colección con texto',
            'sections.countdownBanner': 'Banner de cuenta regresiva',
            'sections.featuredNavigation': 'Navegación destacada',
            'sections.gallery': 'Galería',
            'sections.hotspots': 'Puntos de acceso',
            'sections.imageSlider': 'Deslizador de imágenes',
            'sections.imagesWithText': 'Imágenes con texto',
            'sections.logoList': 'Lista de logos',
            'sections.lookbook': 'Libro de estilo',
            'sections.map': 'Mapa',
            'sections.multipleCollections': 'Múltiples colecciones',
            'sections.page': 'Página',
            'sections.recentlyViewed': 'Vistos recientemente',
            'sections.scrollingText': 'Texto deslizante',
            'sections.spacer': 'Espaciador',
            'sections.splitImageBanner': 'Banner de imagen dividida',
            'sections.testimonials': 'Testimonios',
            'sections.video': 'Video',
            // Common translations
            'common.cancel': 'Cancelar',
            'swatches.optionNamePlaceholder': 'Color',
            'swatches.optionNameHelp': 'Completa los nombres de opciones relevantes de tu administrador para activar las muestras',
            'swatches.shapeForProductCards': 'Forma para tarjetas de productos',
            'swatches.portrait': 'Retrato',
            'swatches.landscape': 'Paisaje',
            'swatches.sizeForProductCards': 'Tamaño para tarjetas de productos',
            'swatches.shapeForProductPages': 'Forma para páginas de productos',
            'swatches.sizeForProductPages': 'Tamaño para páginas de productos',
            'swatches.shapeForFilters': 'Forma para filtros',
            'swatches.square': 'Cuadrado',
            'swatches.round': 'Redondo',
            'swatches.sizeForFilters': 'Tamaño para filtros',
            'swatches.customColorsAndPatterns': 'Colores y patrones personalizados',
            'swatches.customColorsHelp': 'Coloca cada regla en una línea separada.',
            'swatches.learnHowToAdd': 'Aprende cómo agregar muestras de colores',
            'swatches.secondarySwatchOptions': 'Opciones de muestra secundarias',
            'swatches.showSwatchesForMore': 'Mostrar muestras para más de una opción en páginas de productos y filtros',
            'swatches.optionNames': 'Nombres de opciones',
            'swatches.optionNamesPlaceholder': 'Material\nMarco',
            'swatches.optionNamesHelp': 'Completa los nombres de opciones relevantes de tu administrador, coloca cada uno en una línea separada'
        },
        en: {
            exitEditorButtonText: "Exit",
            themeLabel: "Template",
            homePageLabel: "Home page",
            createNewPageButtonText: "New Page",
            deletePageButtonText: "Delete",
            saveButtonText: "Save",
            // New translations for sidebar
            sidebarLoadingText: "Loading panel content...",
            previewAreaPlaceholderText: "Your site preview area will appear here.",
            pageHierarchyViewTitle: "Page: ",
            addSectionButtonText: "+ Add Section",
            resetPageButtonText: "Reset Page to Defaults",
            themeSettingsButtonText: "Theme Settings",
            editingBlockTitle: "Editing Block",
            addSectionViewTitle: "Add Section",
            themeSettingsViewTitle: "Theme Settings",
            backButtonText: "Back",
            availableBlockTypesTitle: "Available block types:",
            blockTypeHeader: "Header",
            blockTypeImage: "Image",
            blockTypeGallery: "Gallery",
            blockTypeText: "Text",
            blockTypeButtons: "Buttons",
            blockTypeSlideshow: "Slideshow",
            // Sections panel translations
            'sections.header': 'Header',
            'sections.announcementBar': 'Announcement bar',
            'sections.headerSection': 'Header',
            'sections.template': 'Template',
            'sections.slideshow': 'Slideshow',
            'sections.multirow': 'Multirow',
            'sections.multicolumn': 'Multicolumn',
            'sections.imageWithText': 'Image with text',
            'sections.customLiquid': 'Custom liquid',
            'sections.collapsibleContent': 'Collapsible content',
            'sections.contactForm': 'Contact form',
            'sections.addSection': 'Add section',
            'sections.footer': 'Footer',
            'sections.footerSection': 'Footer',
            'sections.viewPage': 'View page',
            // Announcement Bar translations
            'announcementBar.showOnlyHomePage': 'Show only on home page',
            'announcementBar.colorScheme': 'Color scheme',
            'announcementBar.learnAboutColorSchemes': 'Learn about color schemes',
            'announcementBar.width': 'Width',
            'announcementBar.showNavigationArrows': 'Show navigation arrows',
            'announcementBar.autoplay': 'Autoplay',
            'announcementBar.autoplayMode': 'Autoplay mode',
            'announcementBar.none': 'None',
            'announcementBar.oneAtATime': 'One-at-a-time',
            'announcementBar.autoplaySpeed': 'Autoplay speed',
            'announcementBar.animationStyle': 'Animation style',
            'announcementBar.animationNone': 'No animation',
            'announcementBar.animationFade': 'Fade',
            'announcementBar.animationSlideHorizontal': 'Slide horizontal',
            'announcementBar.animationSlideVertical': 'Slide vertical',
            'announcementBar.animationTypewriter': 'Typewriter',
            'announcementBar.animationMarquee': 'Infinite marquee',
            'announcementBar.languageSelector': 'Language selector',
            'announcementBar.languageSelectorDesc': 'Shows selector on desktop. To add a language, go to your language settings',
            'announcementBar.showLanguageSelector': 'Show language selector',
            'announcementBar.currencySelector': 'Currency selector',
            'announcementBar.currencySelectorDesc': 'Shows selector on desktop. To add a currency, go to your payment settings',
            'announcementBar.showCurrencySelector': 'Show currency selector',
            'announcementBar.socialMediaIcons': 'Social media icons',
            'announcementBar.socialMediaDesc': 'Shows icons on desktop. Add links to your social media accounts in Theme settings>Social media',
            'announcementBar.showSocialMediaIcons': 'Show social media icons',
            'announcementBar.rename': 'Rename',
            'announcementBar.show': 'Show',
            'announcementBar.locate': 'Locate',
            'announcementBar.announcements': 'Announcements',
            'announcementBar.makeAnnouncement': 'Make an announcement',
            'announcementBar.addAnnouncement': 'Add announcement',
            // Theme Settings translations
            'themeSettings.title': 'Theme Settings',
            'themeSettings.appearance': 'Appearance',
            'themeSettings.typography': 'Typography',
            'themeSettings.colorSchemes': 'Color schemes',
            'themeSettings.productCards': 'Product cards',
            'themeSettings.productBadges': 'Product badges',
            'themeSettings.cart': 'Cart',
            'themeSettings.favicon': 'Favicon',
            'themeSettings.navigation': 'Navigation',
            'themeSettings.socialMedia': 'Social media',
            'themeSettings.swatches': 'Swatches',
            'themeSettings.advanced': 'Advanced',
            // Appearance translations
            'appearance.title': 'Appearance',
            'appearance.pageWidth': 'Page width',
            'appearance.sidePaddingSize': 'Side padding size',
            'appearance.edgeRounding': 'Edge rounding',
            'appearance.edgeRoundingNone': 'Size 0 - None',
            'appearance.edgeRoundingXSmall': 'Size 1 - Extra small',
            'appearance.edgeRoundingSmall': 'Size 2 - Small',
            'appearance.edgeRoundingMedium': 'Size 3 - Medium',
            'appearance.edgeRoundingLarge': 'Size 4 - Large',
            'appearance.edgeRoundingDescription': 'Applies to cards, buttons, section corners, and other elements',
            // Header Settings translations
            'headerSettings.title': 'Header',
            'headerSettings.colorScheme': 'Color scheme',
            'headerSettings.learnAboutColorSchemes': 'Learn about color schemes',
            'headerSettings.width': 'Width',
            'headerSettings.widthScreen': 'Screen',
            'headerSettings.widthPage': 'Page',
            'headerSettings.widthLarge': 'Large',
            'headerSettings.widthMedium': 'Medium',
            'headerSettings.layout': 'Layout',
            'headerSettings.layoutDrawer': 'Drawer',
            'headerSettings.layoutLogoLeftMenuCenter': 'Logo left, menu center inline',
            'headerSettings.layoutLogoLeftMenuLeft': 'Logo left, menu left inline',
            'headerSettings.layoutLogoCenterMenuLeft': 'Logo center, menu left inline',
            'headerSettings.layoutLogoCenterMenuCenterBelow': 'Logo center, menu center below',
            'headerSettings.layoutLogoLeftMenuLeftBelow': 'Logo left, menu left below',
            'headerSettings.layoutDescription': 'Layout is auto-optimized for mobile',
            'headerSettings.enableStickyHeader': 'Enable sticky header',
            'headerSettings.showDivider': 'Show divider',
            'headerSettings.default': 'Default',
            'headerSettings.primary': 'Primary',
            'headerSettings.secondary': 'Secondary',
            'headerSettings.contrasting': 'Contrasting',
            'headerSettings.scheme': 'Scheme',
            'headerSettings.menu': 'Menu',
            'headerSettings.openMenuDropdown': 'Open menu dropdown',
            'headerSettings.onHover': 'On hover',
            'headerSettings.onClick': 'On click',
            'headerSettings.chooseNavigationMenu': 'Choose navigation menu',
            'headerSettings.mainMenu': 'Main menu',
            'headerSettings.footerMenu': 'Footer menu',
            'headerSettings.logo': 'Logo',
            'headerSettings.desktopLogo': 'Desktop logo',
            'headerSettings.desktopLogoSize': 'Desktop logo size',
            'headerSettings.mobileLogo': 'Mobile logo',
            'headerSettings.mobileLogoSize': 'Mobile logo size',
            'headerSettings.selectImage': 'Select',
            'headerSettings.browseFreeImages': 'Browse free images',
            'headerSettings.icons': 'Icons',
            'headerSettings.iconStyle': 'Icon style',
            'headerSettings.iconStyleSolid': 'Solid',
            'headerSettings.iconStyleOutline': 'Outline',
            'headerSettings.cartType': 'Cart type',
            'headerSettings.cartTypeBag': 'Bag',
            'headerSettings.cartTypeCart': 'Cart',
            'headerSettings.uploadingImage': 'Uploading image...',
            'headerSettings.uploadFailed': 'Upload failed',
            'headerSettings.changeImage': 'Change image',
            'headerSettings.removeImage': 'Remove image',
            // Announcement Item Settings translations
            'announcementItem.title': 'Announcement',
            'announcementItem.announcement': 'Announcement',
            'announcementItem.link': 'Link',
            'announcementItem.linkPlaceholder': 'Paste a link or search',
            'announcementItem.icon': 'Icon',
            'announcementItem.select': 'Select',
            'announcementItem.selectPlaceholder': 'Select',
            'announcementItem.browseFreeImages': 'Browse free images',
            'announcementItem.deleteBlock': 'Delete block',
            'announcementItem.makeAnnouncement': 'Make an announcement',
            'announcementItem.fontTitle': 'Font',
            'announcementItem.boldTitle': 'Bold',
            'announcementItem.italicTitle': 'Italic',
            'announcementItem.linkTitle': 'Link',
            'announcementItem.bulletListTitle': 'Bulleted list',
            'announcementItem.numberedListTitle': 'Numbered list',
            // Typography translations
            'typography.title': 'Typography',
            'typography.description': 'We recommend that you use no more than two font families for your store.',
            'typography.learnMore': 'Learn how fonts affect store speed',
            'typography.heading': 'Heading',
            'typography.body': 'Body',
            'typography.menu': 'Menu',
            'typography.productCardName': 'Product card name',
            'typography.buttons': 'Buttons',
            'typography.font': 'Font',
            'typography.fontSize': 'Font size',
            'typography.useUppercase': 'Use uppercase',
            'typography.letterSpacing': 'Letter spacing',
            // Color Schemes translations  
            'colorSchemes.title': 'Color schemes',
            'colorSchemes.defaultColorScheme': 'Default color scheme',
            'colorSchemes.learnAbout': 'Learn about color schemes',
            'colorSchemes.primary': 'Primary',
            'colorSchemes.secondary': 'Secondary',
            'colorSchemes.contrasting': 'Contrasting',
            'colorSchemes.text': 'Text',
            'colorSchemes.background': 'Background',
            'colorSchemes.foreground': 'Foreground',
            'colorSchemes.border': 'Border',
            'colorSchemes.solidButton': 'Solid button',
            'colorSchemes.solidButtonText': 'Solid button text',
            'colorSchemes.outlineButton': 'Outline button',
            'colorSchemes.outlineButtonText': 'Outline button text',
            'colorSchemes.imageOverlay': 'Image overlay',
            'colorSchemes.configuration': 'Color Scheme Configuration',
            // Product Cards translations
            'productCards.title': 'Product cards',
            'productCards.style': 'Style',
            'productCards.standard': 'Standard',
            'productCards.card': 'Card',
            'productCards.imageRatio': 'Image ratio',
            'productCards.adapt': 'Adapt to image',
            'productCards.portrait': 'Portrait',
            'productCards.square': 'Square',
            'productCards.showSecondImage': 'Show second image on hover',
            'productCards.showVendor': 'Show vendor',
            'productCards.showRating': 'Show product rating',
            'productCards.enableQuickAdd': 'Enable quick add button',
            // Product Badges translations
            'productBadges.title': 'Product badges',
            'productBadges.onSale': 'On sale',
            'productBadges.soldOut': 'Sold out',
            'productBadges.position': 'Position',
            'productBadges.topLeft': 'Top left',
            'productBadges.topRight': 'Top right',
            'productBadges.bottomLeft': 'Bottom left',
            'productBadges.bottomRight': 'Bottom right',
            // Cart translations
            'cart.title': 'Cart',
            'cart.type': 'Cart type',
            'cart.drawer': 'Drawer',
            'cart.page': 'Page',
            'cart.popup': 'Popup notification',
            'cart.showVendor': 'Show vendor',
            'cart.enableNote': 'Enable cart note',
            // Favicon translations
            'favicon.title': 'Favicon',
            'favicon.description': 'Favicons are small icons that appear in browser tabs.',
            'favicon.selectImage': 'Select image',
            'favicon.noImageSelected': 'No image selected',
            // Navigation translations
            'navigation.title': 'Navigation',
            'navigation.colorScheme': 'Color scheme',
            'navigation.menu': 'Menu',
            'navigation.logoPosition': 'Logo position on desktop',
            'navigation.middleLeft': 'Middle left',
            'navigation.topLeft': 'Top left',
            'navigation.topCenter': 'Top center',
            'navigation.middleCenter': 'Middle center',
            'navigation.mobileLogoPosition': 'Logo position on mobile',
            'navigation.center': 'Center',
            'navigation.left': 'Left',
            'navigation.enableStickyHeader': 'Enable sticky header on desktop',
            'navigation.showSeparatorLine': 'Show separator line',
            'navigation.reduceLogoSize': 'Reduce logo size on scroll',
            'navigation.announcementBar': 'Announcement bar',
            'navigation.showAnnouncementBar': 'Show announcement bar',
            'navigation.homePageOnly': 'Home page only',
            'navigation.announcementText': 'Text',
            'navigation.link': 'Link',
            // Social Media translations
            'socialMedia.title': 'Social media',
            'socialMedia.accounts': 'Social media accounts',
            'socialMedia.description': 'To display your social media accounts, link them to your online store.',
            'socialMedia.twitter': 'Twitter',
            'socialMedia.facebook': 'Facebook',
            'socialMedia.pinterest': 'Pinterest',
            'socialMedia.instagram': 'Instagram',
            'socialMedia.tiktok': 'TikTok',
            'socialMedia.tumblr': 'Tumblr',
            'socialMedia.snapchat': 'Snapchat',
            'socialMedia.youtube': 'YouTube',
            'socialMedia.vimeo': 'Vimeo',
            // Swatches translations
            'swatches.title': 'Swatches',
            'swatches.colors': 'Colors',
            'swatches.learnAbout': 'Learn about',
            'swatches.primarySwatchOption': 'Primary swatch option',
            'swatches.showSwatchesInfo': 'Show swatches in product cards, product pages, and filters',
            'swatches.optionName': 'Option name',
            'swatches.optionNamePlaceholder': 'Color',
            'swatches.optionNameHelp': 'Fill in the relevant option names from your admin to turn on swatches',
            'swatches.shapeForProductCards': 'Shape for product cards',
            'swatches.portrait': 'Portrait',
            'swatches.landscape': 'Landscape',
            'swatches.sizeForProductCards': 'Size for product cards',
            'swatches.shapeForProductPages': 'Shape for product pages',
            'swatches.sizeForProductPages': 'Size for product pages',
            'swatches.shapeForFilters': 'Shape for filters',
            'swatches.square': 'Square',
            'swatches.round': 'Round',
            'swatches.sizeForFilters': 'Size for filters',
            'swatches.customColorsAndPatterns': 'Custom colors and patterns',
            'swatches.customColorsPlaceholder': 'Ultramarine::#0043F2\nCherry blossom::#FFB7C5\nSunny day::yellow/green/blue/\nSummertime::#F9AFB1/#0F9D5B/#4285F4',
            'swatches.customColorsHelp': 'Place each rule in a separate line.',
            'swatches.learnHowToAdd': 'Learn how to add color swatches',
            'swatches.secondarySwatchOptions': 'Secondary swatch options',
            'swatches.showSwatchesForMore': 'Show swatches for more than one option in product pages and filters',
            'swatches.optionNames': 'Option names',
            'swatches.optionNamesPlaceholder': 'Material\nFrame',
            'swatches.optionNamesHelp': 'Fill in relevant option names from your admin, place each in a separate line',
            'swatches.learnAbout': 'Learn about',
            'swatches.primarySwatchOption': 'Primary swatch option',
            'swatches.showSwatchesInfo': 'Show swatches in product cards, product pages, and filters',
            'swatches.optionName': 'Option name',
            // Add section modal translations
            'sections.searchSections': 'Search sections',
            'sections.sectionsTab': 'Sections',
            'sections.applicationsTab': 'Applications',
            'sections.selectToPreview': 'Select a section to preview',
            'sections.noApplications': 'No applications available',
            'sections.noPreview': 'Preview not available',
            // Section names
            'sections.featuredCollection': 'Featured collection',
            'sections.featuredProduct': 'Featured product',
            'sections.collectionList': 'Collection list',
            'sections.richText': 'Rich text',
            'sections.imageBanner': 'Image banner',
            'sections.slideshow': 'Slideshow',
            'sections.collage': 'Collage',
            'sections.multicolumn': 'Multicolumn',
            'sections.newsletter': 'Newsletter',
            'sections.contactForm': 'Contact form',
            'sections.customLiquid': 'Custom liquid',
            'sections.accordion': 'Accordion',
            'sections.beforeAfterImages': 'Before/after images',
            'sections.blogPosts': 'Blog posts',
            'sections.collectionWithText': 'Collection with text',
            'sections.countdownBanner': 'Countdown banner',
            'sections.featuredNavigation': 'Featured navigation',
            'sections.gallery': 'Gallery',
            'sections.hotspots': 'Hotspots',
            'sections.imageSlider': 'Image slider',
            'sections.imagesWithText': 'Images with text',
            'sections.logoList': 'Logo list',
            'sections.lookbook': 'Lookbook',
            'sections.map': 'Map',
            'sections.multipleCollections': 'Multiple collections',
            'sections.page': 'Page',
            'sections.recentlyViewed': 'Recently viewed',
            'sections.scrollingText': 'Scrolling text',
            'sections.spacer': 'Spacer',
            'sections.splitImageBanner': 'Split image banner',
            'sections.testimonials': 'Testimonials',
            'sections.video': 'Video',
            // Common translations
            'common.cancel': 'Cancel',
            'swatches.optionNamePlaceholder': 'Color',
            'swatches.optionNameHelp': 'Fill in the relevant option names from your admin to turn on swatches',
            'swatches.shapeForProductCards': 'Shape for product cards',
            'swatches.portrait': 'Portrait',
            'swatches.landscape': 'Landscape',
            'swatches.sizeForProductCards': 'Size for product cards',
            'swatches.shapeForProductPages': 'Shape for product pages',
            'swatches.sizeForProductPages': 'Size for product pages',
            'swatches.shapeForFilters': 'Shape for filters',
            'swatches.square': 'Square',
            'swatches.round': 'Round',
            'swatches.sizeForFilters': 'Size for filters',
            'swatches.customColorsAndPatterns': 'Custom colors and patterns',
            'swatches.customColorsHelp': 'Place each rule in a separate line.',
            'swatches.learnHowToAdd': 'Learn how to add color swatches',
            'swatches.secondarySwatchOptions': 'Secondary swatch options',
            'swatches.showSwatchesForMore': 'Show swatches for more than one option in product pages and filters',
            'swatches.optionNames': 'Option names',
            'swatches.optionNamesPlaceholder': 'Material\nFrame',
            'swatches.optionNamesHelp': 'Fill in relevant option names from your admin, place each in a separate line'
        }
    };
    
    // Set current language translations
    const lang = translations[currentLanguage];
    
    // Sidebar view state - REMOVED duplicate declaration (using global instead)
    // currentSidebarView is already declared globally at line 10
    let currentPageData = { name: lang.homePageLabel || "Página de inicio", blocks: [] };
    
    // Initialize translations in UI
    $('#exit-builder-btn .btn-text').text(lang.exitEditorButtonText);
    $('#active-theme-name-display .theme-label').text(lang.themeLabel);
    $('#page-selector-trigger .page-name').text(lang.homePageLabel);
    $('#create-new-page-btn-topbar').attr('title', lang.createNewPageButtonText);
    $('#delete-page-btn-topbar .btn-text').text(lang.deletePageButtonText);
    $('#save-builder-btn-topbar .btn-text').text(lang.saveButtonText);
    $('.sidebar-loading-text').text(lang.sidebarLoadingText);
    $('.preview-placeholder-text').text(lang.previewAreaPlaceholderText);
    
    // Exit button handler - Navigate to dashboard
    $('#exit-builder-btn').on('click', function() {
        window.location.href = '/Admin/ExactIndex';
    });
    
    // Global announcement counter to maintain unique IDs
    let globalAnnouncementCounter = 1;
    
    // Function to apply translations to dynamic content
    window.applyTranslations = function() {
        document.querySelectorAll('[data-i18n]').forEach(element => {
            const key = element.getAttribute('data-i18n');
            if (lang[key]) {
                element.textContent = lang[key];
            }
        });
        
        // Update option elements with translations
        document.querySelectorAll('option[data-i18n]').forEach(option => {
            const key = option.getAttribute('data-i18n');
            if (lang[key]) {
                option.textContent = lang[key];
            }
        });
        
        // Update placeholders
        document.querySelectorAll('[data-i18n-placeholder]').forEach(element => {
            const key = element.getAttribute('data-i18n-placeholder');
            if (lang[key]) {
                element.setAttribute('placeholder', lang[key]);
            }
        });
        
        // Update titles
        document.querySelectorAll('[data-i18n-title]').forEach(element => {
            const key = element.getAttribute('data-i18n-title');
            if (lang[key]) {
                element.setAttribute('title', lang[key]);
            }
        });
    };
    
    // Mock data for demonstration
    const blockSettingsSchemas = {
        header: { title: "Configuración del Encabezado", fields: ["logo", "menuStyle", "backgroundColor"] },
        image: { title: "Configuración de Imagen", fields: ["imageUrl", "altText", "alignment"] },
        gallery: { title: "Configuración de Galería", fields: ["images", "columns", "spacing"] },
        text: { title: "Configuración de Texto", fields: ["content", "fontSize", "textAlign"] },
        buttons: { title: "Configuración de Botones", fields: ["buttonText", "buttonUrl", "buttonStyle"] },
        slideshow: { title: "Configuración de Presentación", fields: ["slides", "autoplay", "duration"] }
    };
    
    const globalThemeSettingsSchema = {
        title: "Configuración Global del Tema",
        fields: ["primaryColor", "secondaryColor", "fontFamily", "headerHeight"]
    };
    
    
    // Make currentPageData globally accessible
    window.currentPageData = currentPageData;
    
    // Helper function to get updated page data
    window.getUpdatedPageData = function() {
        return {
            name: window.currentPageData?.name || lang.homePageLabel || "Página de inicio",
            blocks: currentPageBlocks,
            sectionsConfig: currentSectionsConfig
        };
    }
    
    // Function to switch sidebar view - Make it global for delegated events
    window.switchSidebarView = function(viewName, data = null) {
        console.log('[DEBUG] Switching sidebar view from', currentSidebarView, 'to', viewName);
        currentSidebarView = viewName;
        const dynamicContentArea = document.getElementById('sidebar-dynamic-content');
        if (!dynamicContentArea) return;
        
        // Limpiar completamente el contenido anterior
        dynamicContentArea.innerHTML = '';
        
        console.log(`[SIDEBAR] Cambiando a vista: ${viewName}`, data);
        
        if (viewName === 'blockList') {
            dynamicContentArea.innerHTML = renderBlockListView(data || currentPageData);
            attachBlockListEventListeners();
            // Apply translations after rendering
            setTimeout(applyTranslations, 0);
        } else if (viewName === 'blockSettings') {
            dynamicContentArea.innerHTML = renderBlockSettingsView(data);
        } else if (viewName === 'addSectionView') {
            dynamicContentArea.innerHTML = renderAddSectionView();
        } else if (viewName === 'themeSettingsView') {
            dynamicContentArea.innerHTML = renderThemeSettingsView();
            // Apply translations after rendering
            setTimeout(applyTranslations, 0);
            // Reload current website data to get fresh settings from DB
            loadCurrentWebsite().then(() => {
                // Populate theme settings fields with fresh data and attach event listeners
                setTimeout(() => {
                    console.log('[DEBUG] About to populate fields. Checking if color inputs exist...');
                    console.log('[DEBUG] Primary text input exists?', $('[data-field="primary-text"]').length > 0);
                    console.log('[DEBUG] Color inputs found:', $('[data-field*="-"]').length);
                    
                    populateThemeSettingsFields();
                    attachThemeSettingsEventListeners();
                    
                    // Initialize the color scheme fields
                    const $schemeSelect = $('#schemeConfigSelect');
                    console.log(`[DEBUG] Scheme selector found:`, $schemeSelect.length > 0);
                    
                    if ($schemeSelect.length > 0) {
                        // Get the currently selected scheme from settings, default to scheme1 if not set
                        const selectedScheme = currentGlobalThemeSettings.selectedColorScheme || 'scheme1';
                        console.log(`[DEBUG] Loading previously selected scheme: ${selectedScheme}`);
                        
                        // Set the dropdown to show the selected scheme
                        $schemeSelect.val(selectedScheme);
                        
                        // Load the configuration for the selected scheme
                        loadSchemeConfiguration(selectedScheme);
                        
                        // Attach the scheme selector change handler here where we know the DOM is ready
                        $schemeSelect.off('change.schemeConfig').on('change.schemeConfig', function() {
                            const newSelectedScheme = $(this).val();
                            console.log(`[DEBUG] Scheme selector changed to: ${newSelectedScheme}`);
                            
                            // Save the selected scheme in global settings
                            currentGlobalThemeSettings.selectedColorScheme = newSelectedScheme;
                            hasPendingGlobalSettingsChanges = true;
                            updateSaveButtonState();
                            
                            loadSchemeConfiguration(newSelectedScheme);
                        });
                    } else {
                        console.error('[ERROR] schemeConfigSelect not found in DOM!');
                    }
                    
                    // Try populating again after a longer delay in case DOM isn't ready
                    setTimeout(() => {
                        console.log('[DEBUG] Second attempt to populate color fields...');
                        if (currentGlobalThemeSettings.colors) {
                            const colors = currentGlobalThemeSettings.colors;
                            for (const group in colors) {
                                if (typeof colors[group] === 'object' && colors[group] !== null) {
                                    for (const property in colors[group]) {
                                        const value = colors[group][property];
                                        const dataField = `${group}-${property}`;
                                        $(`[data-field="${dataField}"]`).val(value);
                                    }
                                }
                            }
                        }
                    }, 500);
                }, 50);
            });
        } else if (viewName === 'announcementBar') {
            const announcementHTML = renderAnnouncementBarView();
            console.log('[DEBUG] Announcement Bar HTML length:', announcementHTML.length);
            dynamicContentArea.innerHTML = announcementHTML;
            
            // Verificar que el header existe
            setTimeout(() => {
                const header = dynamicContentArea.querySelector('.sidebar-view-header');
                if (header) {
                    console.log('[DEBUG] Header encontrado y visible');
                } else {
                    console.error('[DEBUG] Header NO encontrado!');
                }
            }, 100);
            
            // Apply translations after rendering
            setTimeout(applyTranslations, 0);
            // Delay to ensure DOM is ready
            setTimeout(() => {
                console.log('[DEBUG] About to attach announcement bar event listeners');
                attachAnnouncementBarEventListeners();
                // Populate with current values
                console.log('[DEBUG] About to populate announcement bar fields');
                populateAnnouncementBarFields();
                console.log('[DEBUG] Announcement bar setup complete');
            }, 100);
        } else if (viewName === 'headerSettings') {
            dynamicContentArea.innerHTML = renderHeaderSettingsView();
            attachHeaderSettingsEventListeners();
            // Apply translations after rendering
            setTimeout(applyTranslations, 0);
            // Populate with current values
            populateHeaderSettingsFields();
        } else if (viewName === 'announcementItemSettings') {
            dynamicContentArea.innerHTML = renderAnnouncementItemSettingsView(data);
            attachAnnouncementItemEventListeners();
            // Apply translations after rendering
            setTimeout(applyTranslations, 0);
            // Populate with current values
            if (data && data.id) {
                populateAnnouncementItemFields(data.id);
            }
        } else {
            dynamicContentArea.innerHTML = `<p class="sidebar-loading-text">${lang.sidebarLoadingText}</p>`;
        }
    }
    
    // Function to render header sections based on saved order
    function renderHeaderSections() {
        let html = '';
        const sections = {
            'announcement': {
                html: `
                    <div class="sidebar-subsection collapsible-parent" data-block-type="announcement" data-element-id="barra-anuncios">
                        <span class="subsection-text" data-i18n="sections.announcementBar">Barra de anuncios</span>
                        <div class="subsection-actions">
                            <button class="action-icon visibility-toggle ${currentSectionsConfig.announcementBar.isHidden ? 'is-hidden' : ''}" data-section="announcement" title="Toggle visibility">
                                <i class="material-icons icon-visible">visibility</i>
                                <i class="material-icons icon-hidden">visibility_off</i>
                            </button>
                            <button class="action-icon add-icon" data-section="announcement" title="Add">
                                <i class="material-icons">add</i>
                            </button>
                            <button class="action-icon collapse-toggle" title="Collapse/Expand">
                                <i class="material-icons collapse-indicator">expand_more</i>
                            </button>
                        </div>
                    </div>
                `,
                includeAnnouncements: true
            },
            'header': {
                html: `
                    <div class="sidebar-subsection" data-block-type="header">
                        <span class="subsection-text" data-i18n="sections.headerSection">Encabezado</span>
                        <div class="subsection-actions">
                            <button class="action-icon visibility-toggle ${currentSectionsConfig.header.isHidden ? 'is-hidden' : ''}" data-section="header" title="Toggle visibility">
                                <i class="material-icons icon-visible">visibility</i>
                                <i class="material-icons icon-hidden">visibility_off</i>
                            </button>
                            <button class="action-icon add-icon" data-section="header" title="Add">
                                <i class="material-icons">add</i>
                            </button>
                        </div>
                    </div>
                `,
                includeAnnouncements: false
            }
        };
        
        // Use saved order or default
        const order = currentSectionsConfig.sectionOrder || ['announcement', 'header'];
        
        for (const sectionType of order) {
            if (sections[sectionType]) {
                html += sections[sectionType].html;
                if (sections[sectionType].includeAnnouncements) {
                    html += renderAnnouncementItems();
                }
            }
        }
        
        return html;
    }
    
    // Function to render announcement items
    function renderAnnouncementItems() {
        console.log('[DEBUG] Rendering announcement items:', currentSectionsConfig.announcements);
        let itemsHtml = '';
        // Si hay un orden definido, usarlo
        if (currentSectionsConfig.announcementOrder && currentSectionsConfig.announcementOrder.length > 0) {
            for (const announcementId of currentSectionsConfig.announcementOrder) {
                if (currentSectionsConfig.announcements[announcementId]) {
                    const config = currentSectionsConfig.announcements[announcementId];
                    const text = config.text || lang['announcementItem.makeAnnouncement'] || 'Make an announcement';
                    console.log('[DEBUG] Rendering announcement:', announcementId, 'with text:', text);
                    itemsHtml += `
                        <div class="sidebar-subsection" data-block-type="announcement-item" data-element-id="${announcementId}" style="padding-left: 30px;">
                            <span class="subsection-text">${text}</span>
                            <div class="subsection-actions">
                                <button class="action-icon visibility-toggle ${config.isHidden ? 'is-hidden' : ''}" title="Toggle visibility">
                                    <i class="material-icons icon-visible">visibility</i>
                                    <i class="material-icons icon-hidden">visibility_off</i>
                                </button>
                                <button class="action-icon delete-announcement" data-element-id="${announcementId}" title="Delete">
                                    <i class="material-icons">delete</i>
                                </button>
                            </div>
                        </div>
                    `;
                }
            }
        } else {
            // Si no hay orden, renderizar todos los anuncios
            for (const [announcementId, config] of Object.entries(currentSectionsConfig.announcements)) {
                const text = config.text || lang['announcementItem.makeAnnouncement'] || 'Make an announcement';
                itemsHtml += `
                    <div class="sidebar-subsection" data-block-type="announcement-item" data-element-id="${announcementId}" style="padding-left: 30px;">
                        <span class="subsection-text">${text}</span>
                        <div class="subsection-actions">
                            <button class="action-icon visibility-toggle ${config.isHidden ? 'is-hidden' : ''}" title="Toggle visibility">
                                <i class="material-icons icon-visible">visibility</i>
                                <i class="material-icons icon-hidden">visibility_off</i>
                            </button>
                            <button class="action-icon delete-announcement" data-element-id="${announcementId}" title="Delete">
                                <i class="material-icons">delete</i>
                            </button>
                        </div>
                    </div>
                `;
            }
        }
        
        // Wrap items in the announcement wrapper
        if (itemsHtml) {
            return `<div id="announcement-items-wrapper" style="position: relative;">${itemsHtml}</div>`;
        }
        return '';
    }
    
    // Function to render block list view - Shopify style
    function renderBlockListView(pageData) {
        const pageName = pageData.name || '';
        
        return `
            <!-- Page Title -->
            <div style="padding: 16px 16px 20px; font-size: 16px; font-weight: 600; color: #202223; line-height: 1.3;">
                ${pageName}
            </div>
            
            <!-- Header Section -->
            <div class="sidebar-section expanded">
                <div class="sidebar-section-header">
                    <div class="section-title-wrapper">
                        <span class="section-title" data-i18n="sections.header">Encabezado</span>
                    </div>
                    <i class="material-icons section-expand-icon">chevron_right</i>
                </div>
                <div class="sidebar-section-content">
                    ${renderHeaderSections()}
                    <div class="add-section-button add-header-section" data-group="header">
                        <i class="material-icons">add_circle</i>
                        <span data-i18n="sections.addSection">Agregar sección</span>
                    </div>
                </div>
            </div>
            
            <!-- Template Section -->
            <div class="sidebar-section expanded">
                <div class="sidebar-section-header">
                    <div class="section-title-wrapper">
                        <div class="section-icon">
                            <i class="material-icons">dashboard</i>
                        </div>
                        <span class="section-title" data-i18n="sections.template">Plantilla</span>
                    </div>
                    <i class="material-icons section-expand-icon">chevron_right</i>
                </div>
                <div class="sidebar-section-content">
                    <div class="sidebar-subsection" data-block-type="slideshow">
                        <i class="material-icons" style="font-size: 16px;">view_carousel</i>
                        <span data-i18n="sections.slideshow">Presentación de diapositivas</span>
                    </div>
                    <div class="sidebar-subsection" data-block-type="multicolumn">
                        <i class="material-icons" style="font-size: 16px;">view_week</i>
                        <span data-i18n="sections.multirow">Varias filas</span>
                    </div>
                    <div class="sidebar-subsection" data-block-type="multicolumn">
                        <i class="material-icons" style="font-size: 16px;">view_module</i>
                        <span data-i18n="sections.multicolumn">Multicolumna</span>
                    </div>
                    <div class="sidebar-subsection" data-block-type="image-text">
                        <i class="material-icons" style="font-size: 16px;">image</i>
                        <span data-i18n="sections.imageWithText">Imagen con texto</span>
                    </div>
                    <div class="sidebar-subsection" data-block-type="liquid">
                        <i class="material-icons" style="font-size: 16px;">code</i>
                        <span data-i18n="sections.customLiquid">Líquido personalizado</span>
                    </div>
                    <div class="sidebar-subsection" data-block-type="image-text-2">
                        <i class="material-icons" style="font-size: 16px;">image</i>
                        <span data-i18n="sections.imageWithText">Imagen con texto</span>
                    </div>
                    <div class="sidebar-subsection" data-block-type="collapsible">
                        <i class="material-icons" style="font-size: 16px;">expand_more</i>
                        <span data-i18n="sections.collapsibleContent">Contenido desplegable</span>
                    </div>
                    <div class="sidebar-subsection" data-block-type="contact">
                        <i class="material-icons" style="font-size: 16px;">mail</i>
                        <span data-i18n="sections.contactForm">Formulario de contacto</span>
                    </div>
                    <div class="add-section-button" id="add-section-btn">
                        <i class="material-icons" style="font-size: 18px;">add</i>
                        <span data-i18n="sections.addSection">Agregar sección</span>
                    </div>
                </div>
            </div>
            
            <!-- Footer Section -->
            <div class="sidebar-section">
                <div class="sidebar-section-header">
                    <div class="section-title-wrapper">
                        <span class="section-title" data-i18n="sections.footer">Pie de página</span>
                    </div>
                    <i class="material-icons section-expand-icon">chevron_right</i>
                </div>
                <div class="sidebar-section-content">
                    <div class="sidebar-subsection" data-block-type="footer">
                        <i class="material-icons" style="font-size: 16px;">view_day</i>
                        <span data-i18n="sections.footerSection">Pie de página</span>
                    </div>
                </div>
            </div>
            
            <!-- Footer Links -->
            <div class="sidebar-footer">
                <div class="sidebar-footer-link" id="view-page-link">
                    <i class="material-icons" style="font-size: 18px;">launch</i>
                    <span style="font-size: 13px;" data-i18n="sections.viewPage">Ver página</span>
                </div>
            </div>
        `;
    }
    
    // Function to render announcement bar settings view
    function renderAnnouncementBarView() {
        // Get the current translation for the announcement text
        const makeAnnouncementText = translations[currentLanguage]['announcementBar.makeAnnouncement'] || 'Make an announcement';
        const addAnnouncementText = translations[currentLanguage]['announcementBar.addAnnouncement'] || 'Add announcement';
        
        return `
            <div style="display: flex; flex-direction: column; height: 100%; position: relative;">
                <div class="sidebar-view-header" style="position: relative; z-index: 10;">
                    <button class="back-to-sections-btn">
                        <i class="material-icons">arrow_back</i>
                    </button>
                    <h3 data-i18n="sections.announcementBar">Barra de anuncios</h3>
                    <div class="section-menu-wrapper" style="position: relative;">
                        <button class="btn-icon section-menu">
                            <i class="material-icons">more_vert</i>
                        </button>
                        <div class="section-menu-dropdown">
                            <a href="#" class="menu-item" data-action="rename">
                                <i class="material-icons">edit</i>
                                <span data-i18n="announcementBar.rename">Renombrar</span>
                            </a>
                            <a href="#" class="menu-item" data-action="show">
                                <i class="material-icons">visibility</i>
                                <span data-i18n="announcementBar.show">Mostrar</span>
                            </a>
                            <a href="#" class="menu-item" data-action="locate">
                                <i class="material-icons">my_location</i>
                                <span data-i18n="announcementBar.locate">Localizar</span>
                            </a>
                        </div>
                    </div>
                </div>
                
                <!-- Settings Content -->
                <div style="padding: 20px; overflow-y: auto; flex: 1;">
                    <!-- Show only on home page -->
                    <div class="settings-field">
                        <label class="toggle-field">
                            <span data-i18n="announcementBar.showOnlyHomePage">Mostrar solo en página de inicio</span>
                            <input type="checkbox" class="shopify-toggle" id="show-only-home">
                            <label for="show-only-home" class="toggle-slider"></label>
                        </label>
                    </div>
                    
                    <!-- Color scheme -->
                    <div class="settings-field">
                        <label data-i18n="announcementBar.colorScheme">Esquema de color</label>
                        <select class="shopify-select" id="color-scheme-select">
                            <option value="scheme1">Scheme 1</option>
                            <option value="scheme2">Scheme 2</option>
                            <option value="scheme3">Scheme 3</option>
                            <option value="scheme4">Scheme 4</option>
                            <option value="scheme5">Scheme 5</option>
                        </select>
                        <a href="#" class="settings-link" data-i18n="announcementBar.learnAboutColorSchemes">Aprende sobre esquemas de color</a>
                    </div>
                    
                    <!-- Width -->
                    <div class="settings-field">
                        <label data-i18n="announcementBar.width">Ancho</label>
                        <select class="shopify-select" id="width-select">
                            <option value="screen" selected>Screen</option>
                            <option value="page">Page</option>
                            <option value="large">Large</option>
                            <option value="medium">Medium</option>
                        </select>
                    </div>
                    
                    <!-- Show navigation arrows -->
                    <div class="settings-field">
                        <label class="toggle-field">
                            <span data-i18n="announcementBar.showNavigationArrows">Mostrar flechas de navegación</span>
                            <input type="checkbox" class="shopify-toggle" id="show-nav-arrows" checked>
                            <label for="show-nav-arrows" class="toggle-slider"></label>
                        </label>
                    </div>
                    
                    <!-- Autoplay Section -->
                    <div class="settings-section">
                        <h4 data-i18n="announcementBar.autoplay">Reproducción automática</h4>
                        
                        <!-- Autoplay mode -->
                        <div class="settings-field">
                            <label data-i18n="announcementBar.autoplayMode">Modo de reproducción automática</label>
                            <div class="radio-group">
                                <label class="radio-label">
                                    <input type="radio" name="autoplay-mode" value="none" checked>
                                    <span data-i18n="announcementBar.none">Ninguno</span>
                                </label>
                                <label class="radio-label">
                                    <input type="radio" name="autoplay-mode" value="one-at-a-time">
                                    <span data-i18n="announcementBar.oneAtATime">Uno a la vez</span>
                                </label>
                            </div>
                        </div>
                        
                        <!-- Autoplay speed -->
                        <div class="settings-field">
                            <label data-i18n="announcementBar.autoplaySpeed">Velocidad de reproducción automática</label>
                            <div class="range-with-inputs">
                                <input type="range" class="shopify-range" min="3" max="10" value="6" id="autoplay-speed">
                                <div class="range-inputs">
                                    <input type="number" class="shopify-number-input" value="6" min="3" max="10">
                                    <span class="unit">s</span>
                                </div>
                            </div>
                        </div>
                        
                        <!-- Animation style -->
                        <div class="settings-field">
                            <label data-i18n="announcementBar.animationStyle">Estilo de animación</label>
                            <select class="shopify-select" id="animation-style">
                                <option value="none" data-i18n="announcementBar.animationNone">Sin animación</option>
                                <option value="fade" data-i18n="announcementBar.animationFade">Desvanecimiento</option>
                                <option value="slide-horizontal" data-i18n="announcementBar.animationSlideHorizontal">Deslizar horizontal</option>
                                <option value="slide-vertical" data-i18n="announcementBar.animationSlideVertical">Deslizar vertical</option>
                                <option value="typewriter" data-i18n="announcementBar.animationTypewriter">Máquina de escribir</option>
                                <option value="marquee" data-i18n="announcementBar.animationMarquee">Marquesina infinita</option>
                            </select>
                        </div>
                    </div>
                    
                    <!-- Language selector -->
                    <div class="settings-section">
                        <h4 data-i18n="announcementBar.languageSelector">Selector de idioma</h4>
                        <p class="section-description" data-i18n="announcementBar.languageSelectorDesc">
                            Muestra selector en escritorio. Para agregar un idioma, ve a tu <a href="#" class="settings-link">configuración de idioma</a>
                        </p>
                        
                        <div class="settings-field">
                            <label class="toggle-field">
                                <span data-i18n="announcementBar.showLanguageSelector">Mostrar selector de idioma</span>
                                <input type="checkbox" class="shopify-toggle" id="show-language-selector">
                                <label for="show-language-selector" class="toggle-slider"></label>
                            </label>
                        </div>
                    </div>
                    
                    <!-- Currency selector -->
                    <div class="settings-section">
                        <h4 data-i18n="announcementBar.currencySelector">Selector de moneda</h4>
                        <p class="section-description" data-i18n="announcementBar.currencySelectorDesc">
                            Muestra selector en escritorio. Para agregar una moneda, ve a tu <a href="#" class="settings-link">configuración de pagos</a>
                        </p>
                        
                        <div class="settings-field">
                            <label class="toggle-field">
                                <span data-i18n="announcementBar.showCurrencySelector">Mostrar selector de moneda</span>
                                <input type="checkbox" class="shopify-toggle" id="show-currency-selector">
                                <label for="show-currency-selector" class="toggle-slider"></label>
                            </label>
                        </div>
                    </div>
                    
                    <!-- Social media icons -->
                    <div class="settings-section">
                        <h4 data-i18n="announcementBar.socialMediaIcons">Iconos de redes sociales</h4>
                        <p class="section-description" data-i18n="announcementBar.socialMediaDesc">
                            Muestra iconos en escritorio. Agrega enlaces a tus cuentas de redes sociales en Configuración del tema > Redes sociales
                        </p>
                        
                        <div class="settings-field">
                            <label class="toggle-field">
                                <span data-i18n="announcementBar.showSocialMediaIcons">Mostrar iconos de redes sociales</span>
                                <input type="checkbox" class="shopify-toggle" id="show-social-icons">
                                <label for="show-social-icons" class="toggle-slider"></label>
                            </label>
                        </div>
                    </div>
                </div>
            </div>
        `;
    }
    
    // Function to render header settings view
    function renderHeaderSettingsView() {
        return `
            <div style="display: flex; flex-direction: column; height: 100%; position: relative;">
                <div class="sidebar-view-header" style="position: relative; z-index: 10;">
                    <button class="back-to-sections-btn">
                        <i class="material-icons">arrow_back</i>
                    </button>
                    <h3 data-i18n="headerSettings.title">Encabezado</h3>
                    <button class="btn-icon section-menu">
                        <i class="material-icons">more_vert</i>
                    </button>
                </div>
                
                <!-- Settings Content -->
                <div class="header-settings-content" style="padding: 20px; overflow-y: auto; flex: 1; height: calc(100% - 60px);">
                    <!-- Color scheme -->
                    <div class="settings-field">
                        <label data-i18n="headerSettings.colorScheme">Esquema de color</label>
                        <select class="shopify-select" id="header-color-scheme">
                            <option value="scheme1">Scheme 1</option>
                            <option value="scheme2">Scheme 2</option>
                            <option value="scheme3">Scheme 3</option>
                            <option value="scheme4">Scheme 4</option>
                            <option value="scheme5">Scheme 5</option>
                        </select>
                        <a href="#" class="settings-link" data-i18n="headerSettings.learnAboutColorSchemes">Aprende sobre esquemas de color</a>
                    </div>
                    
                    <!-- Width -->
                    <div class="settings-field">
                        <label data-i18n="headerSettings.width">Ancho</label>
                        <select class="shopify-select" id="header-width">
                            <option value="screen" data-i18n="headerSettings.widthScreen">Pantalla</option>
                            <option value="page" data-i18n="headerSettings.widthPage">Página</option>
                            <option value="large" selected data-i18n="headerSettings.widthLarge">Grande</option>
                            <option value="medium" data-i18n="headerSettings.widthMedium">Mediano</option>
                        </select>
                    </div>
                    
                    <!-- Layout -->
                    <div class="settings-field">
                        <label data-i18n="headerSettings.layout">Diseño</label>
                        <select class="shopify-select" id="header-layout">
                            <option value="drawer" data-i18n="headerSettings.layoutDrawer">Cajón</option>
                            <option value="logo-left-menu-center-inline" data-i18n="headerSettings.layoutLogoLeftMenuCenter">Logo izquierda, menú centro en línea</option>
                            <option value="logo-left-menu-left-inline" data-i18n="headerSettings.layoutLogoLeftMenuLeft">Logo izquierda, menú izquierda en línea</option>
                            <option value="logo-center-menu-left-inline" selected data-i18n="headerSettings.layoutLogoCenterMenuLeft">Logo centro, menú izquierda en línea</option>
                            <option value="logo-center-menu-center-below" data-i18n="headerSettings.layoutLogoCenterMenuCenterBelow">Logo center, menu center below</option>
                            <option value="logo-left-menu-left-below" data-i18n="headerSettings.layoutLogoLeftMenuLeftBelow">Logo left, menu left below</option>
                        </select>
                        <p class="field-description" style="font-size: 12px; color: #6d7175; margin-top: 4px;" data-i18n="headerSettings.layoutDescription">
                            Layout is auto-optimized for mobile
                        </p>
                    </div>
                    
                    <!-- Show separator -->
                    <div class="settings-field">
                        <label class="toggle-field">
                            <span data-i18n="headerSettings.showDivider">Mostrar divisor</span>
                            <input type="checkbox" class="shopify-toggle" id="show-separator" checked>
                            <label for="show-separator" class="toggle-slider"></label>
                        </label>
                    </div>
                    
                    <!-- Enable sticky header -->
                    <div class="settings-field">
                        <label class="toggle-field">
                            <span data-i18n="headerSettings.enableStickyHeader">Habilitar encabezado fijo</span>
                            <input type="checkbox" class="shopify-toggle" id="enable-sticky">
                            <label for="enable-sticky" class="toggle-slider"></label>
                        </label>
                    </div>
                    
                    <!-- Menu Section -->
                    <div class="settings-section">
                        <div class="section-header-with-toggle">
                            <h4 data-i18n="headerSettings.menu">Menu</h4>
                            <button class="simple-visibility-btn" onclick="window.toggleHeaderSectionVisibility('menu', this)" data-section="menu" style="width: 32px; height: 32px; display: inline-flex; align-items: center; justify-content: center; background: transparent; border: 1px solid #e0e0e0; border-radius: 4px; cursor: pointer;">
                                ${currentSectionsConfig.header.sectionVisibility?.menu !== false ? 
                                    `<span style="font-size: 18px;">👁️</span>` : 
                                    `<span style="font-size: 18px; text-decoration: line-through;">👁️</span>`
                                }
                            </button>
                        </div>
                        
                        <!-- Open menu dropdown -->
                        <div class="settings-field">
                            <label data-i18n="headerSettings.openMenuDropdown">Open menu dropdown</label>
                            <select class="shopify-select" id="open-menu-dropdown">
                                <option value="hover" data-i18n="headerSettings.onHover">On hover</option>
                                <option value="click" data-i18n="headerSettings.onClick">On click</option>
                            </select>
                        </div>
                        
                        <!-- Choose navigation menu -->
                        <div class="settings-field">
                            <label data-i18n="headerSettings.chooseNavigationMenu">Choose navigation menu</label>
                            <select class="shopify-select" id="navigation-menu">
                                <option value="main-menu" selected data-i18n="headerSettings.mainMenu">Main menu</option>
                                <option value="footer-menu" data-i18n="headerSettings.footerMenu">Footer menu</option>
                            </select>
                        </div>
                    </div>
                    
                    <!-- Logo Section -->
                    <div class="settings-section">
                        <div class="section-header-with-toggle">
                            <h4 data-i18n="headerSettings.logo">Logo</h4>
                            <button class="simple-visibility-btn" onclick="window.toggleHeaderSectionVisibility('logo', this)" data-section="logo" style="width: 32px; height: 32px; display: inline-flex; align-items: center; justify-content: center; background: transparent; border: 1px solid #e0e0e0; border-radius: 4px; cursor: pointer;">
                                ${currentSectionsConfig.header.sectionVisibility?.logo !== false ? 
                                    `<span style="font-size: 18px;">👁️</span>` : 
                                    `<span style="font-size: 18px; text-decoration: line-through;">👁️</span>`
                                }
                            </button>
                        </div>
                        
                        <!-- Desktop logo -->
                        <div class="settings-field">
                            <label data-i18n="headerSettings.desktopLogo">Desktop logo</label>
                            <div class="image-upload-field desktop-logo-upload">
                                <input type="file" id="desktop-logo-input" accept="image/*" style="display: none;">
                                <div class="logo-preview">
                                    <div class="logo-placeholder">
                                        <span style="color: #020711; font-size: 48px; font-weight: bold;">A</span>
                                    </div>
                                    <img class="logo-image" src="" alt="Desktop logo">
                                </div>
                                <div class="logo-actions">
                                    <button class="btn-secondary select-logo-btn" data-logo-type="desktop">
                                        <span data-i18n="headerSettings.selectImage">Select</span>
                                    </button>
                                    <button class="btn-secondary remove-logo-btn" data-logo-type="desktop" style="display: none;">
                                        <span data-i18n="headerSettings.removeImage">Remove</span>
                                    </button>
                                </div>
                                <p style="font-size: 11px; color: #6d7175; margin: 8px 0 0 0;">
                                    <span data-i18n="headerSettings.browseFreeImages">Browse free images</span>
                                </p>
                            </div>
                        </div>
                        
                        <!-- Desktop logo size -->
                        <div class="settings-field">
                            <label data-i18n="headerSettings.desktopLogoSize">Desktop logo size</label>
                            <div class="range-with-inputs">
                                <input type="range" class="shopify-range" min="50" max="300" value="190" id="desktop-logo-size">
                                <div class="range-inputs">
                                    <input type="number" class="shopify-number-input" value="190" min="50" max="300">
                                    <span class="unit">px</span>
                                </div>
                            </div>
                        </div>
                        
                        <!-- Mobile logo -->
                        <div class="settings-field">
                            <label data-i18n="headerSettings.mobileLogo">Mobile logo</label>
                            <div class="image-upload-field mobile-logo-upload">
                                <input type="file" id="mobile-logo-input" accept="image/*" style="display: none;">
                                <div class="logo-preview">
                                    <div style="background: #020711; border-radius: 4px; padding: 15px; text-align: center;">
                                        <div class="logo-placeholder">
                                            <span style="color: #020711; font-size: 32px; font-weight: bold;">A</span>
                                        </div>
                                        <img class="logo-image" src="" alt="Mobile logo">
                                    </div>
                                </div>
                                <div class="logo-actions">
                                    <button class="btn-secondary select-logo-btn" data-logo-type="mobile" style="width: 100%;">
                                        <span data-i18n="headerSettings.selectImage">Select</span>
                                    </button>
                                    <button class="btn-secondary remove-logo-btn" data-logo-type="mobile" style="display: none; width: 100%;">
                                        <span data-i18n="headerSettings.removeImage">Remove</span>
                                    </button>
                                </div>
                                <p style="font-size: 11px; color: #6d7175; margin: 8px 0 0 0; text-align: center;">
                                    <span data-i18n="headerSettings.browseFreeImages">Browse free images</span>
                                </p>
                            </div>
                        </div>
                        
                        <!-- Mobile logo size -->
                        <div class="settings-field">
                            <label data-i18n="headerSettings.mobileLogoSize">Mobile logo size</label>
                            <div class="range-with-inputs">
                                <input type="range" class="shopify-range" min="50" max="250" value="120" id="mobile-logo-size">
                                <div class="range-inputs">
                                    <input type="number" class="shopify-number-input" value="120" min="50" max="250">
                                    <span class="unit">px</span>
                                </div>
                            </div>
                        </div>
                    </div>
                    
                    <!-- Icons Section -->
                    <div class="settings-section">
                        <div class="section-header-with-toggle">
                            <h4 data-i18n="headerSettings.icons">Icons</h4>
                            <button class="simple-visibility-btn" onclick="window.toggleHeaderSectionVisibility('icons', this)" data-section="icons" style="width: 32px; height: 32px; display: inline-flex; align-items: center; justify-content: center; background: transparent; border: 1px solid #e0e0e0; border-radius: 4px; cursor: pointer;">
                                ${currentSectionsConfig.header.sectionVisibility?.icons !== false ? 
                                    `<span style="font-size: 18px;">👁️</span>` : 
                                    `<span style="font-size: 18px; text-decoration: line-through;">👁️</span>`
                                }
                            </button>
                        </div>
                        
                        <!-- Icon style -->
                        <div class="settings-field">
                            <label data-i18n="headerSettings.iconStyle">Icon style</label>
                            <select class="shopify-select" id="icon-style">
                                <option value="outline" selected data-i18n="headerSettings.iconStyleOutline">Outline</option>
                                <option value="solid" data-i18n="headerSettings.iconStyleSolid">Solid</option>
                            </select>
                        </div>
                        
                        <!-- Cart type -->
                        <div class="settings-field">
                            <label data-i18n="headerSettings.cartType">Cart type</label>
                            <select class="shopify-select" id="cart-type-select">
                                <option value="bag" data-i18n="headerSettings.cartTypeBag">Bag</option>
                                <option value="cart" data-i18n="headerSettings.cartTypeCart">Cart</option>
                            </select>
                        </div>
                    </div>
                </div>
            </div>
        `;
    }
    
    // Function to render announcement item settings view
    function renderAnnouncementItemSettingsView(data) {
        const announcementId = data?.id || 1;
        const announcementText = lang && lang['announcementItem.makeAnnouncement'] || 'Make an announcement';
        
        return `
            <div style="display: flex; flex-direction: column; height: 100%; position: relative;">
                <div class="sidebar-view-header" data-announcement-id="${announcementId}" style="position: relative; z-index: 10;">
                    <button class="back-to-sections-btn">
                        <i class="material-icons">arrow_back</i>
                    </button>
                    <h3 data-i18n="announcementItem.title">Anuncio</h3>
                    <button class="btn-icon section-menu">
                        <i class="material-icons">more_vert</i>
                    </button>
                </div>
                
                <!-- Settings Content -->
                <div style="padding: 20px; overflow-y: auto; flex: 1;">
                    <!-- Announcement text -->
                    <div class="settings-field">
                        <label data-i18n="announcementItem.announcement">Anuncio</label>
                        <div class="rich-text-toolbar" style="border: 1px solid #c9cccf; border-radius: 4px 4px 0 0; padding: 8px; background: #f7f7f7; display: flex; gap: 4px;">
                            <button class="toolbar-btn" data-i18n-title="announcementItem.fontTitle" title="Fuente">
                                <span style="font-size: 14px;">Aa</span>
                                <i class="material-icons" style="font-size: 16px;">arrow_drop_down</i>
                            </button>
                            <div style="width: 1px; background: #c9cccf; margin: 0 4px;"></div>
                            <button class="toolbar-btn" data-i18n-title="announcementItem.boldTitle" title="Negrita"><strong>B</strong></button>
                            <button class="toolbar-btn" data-i18n-title="announcementItem.italicTitle" title="Cursiva"><em>I</em></button>
                            <div style="width: 1px; background: #c9cccf; margin: 0 4px;"></div>
                            <button class="toolbar-btn" data-i18n-title="announcementItem.linkTitle" title="Enlace">
                                <i class="material-icons" style="font-size: 18px;">link</i>
                            </button>
                            <div style="width: 1px; background: #c9cccf; margin: 0 4px;"></div>
                            <button class="toolbar-btn" data-i18n-title="announcementItem.bulletListTitle" title="Lista con viñetas">
                                <i class="material-icons" style="font-size: 18px;">format_list_bulleted</i>
                            </button>
                            <button class="toolbar-btn" data-i18n-title="announcementItem.numberedListTitle" title="Lista numerada">
                                <i class="material-icons" style="font-size: 18px;">format_list_numbered</i>
                            </button>
                        </div>
                        <textarea class="rich-text-input" style="width: 100%; min-height: 80px; border: 1px solid #c9cccf; border-top: none; border-radius: 0 0 4px 4px; padding: 12px; font-size: 14px; resize: vertical;">${announcementText}</textarea>
                    </div>
                    
                    <!-- Link -->
                    <!-- Visibility Toggle -->
                    <div class="settings-field">
                        <label style="display: flex; justify-content: space-between; align-items: center;">
                            <span data-i18n="announcementItem.visibility">Visibilidad</span>
                            <label class="switch">
                                <input type="checkbox" id="announcement-item-visibility" checked>
                                <span class="slider"></span>
                            </label>
                        </label>
                    </div>
                    
                    <div class="settings-field">
                        <label data-i18n="announcementItem.link">Enlace</label>
                        <input type="text" class="shopify-input" data-i18n-placeholder="announcementItem.linkPlaceholder" placeholder="Pega un enlace o busca" style="width: 100%; padding: 8px 12px; border: 1px solid #c9cccf; border-radius: 4px;">
                    </div>
                    
                    <!-- Icon Section -->
                    <div class="settings-field">
                        <label style="display: flex; justify-content: space-between; align-items: center;">
                            <span data-i18n="announcementItem.useIconLibrary">Usar icono de la librería</span>
                            <label class="switch">
                                <input type="checkbox" id="use-icon-library" checked>
                                <span class="slider"></span>
                            </label>
                        </label>
                    </div>
                    
                    <!-- Icon Library Section -->
                    <div id="icon-library-section" class="settings-field">
                        <label data-i18n="announcementItem.icon">Icono</label>
                        <div class="icon-library-wrapper">
                            <button class="icon-library-trigger" id="icon-library-trigger" style="width: 100%; padding: 12px; border: 1px solid #c9cccf; border-radius: 4px; background: white; display: flex; align-items: center; gap: 8px; cursor: pointer;">
                                <i class="material-icons" id="selected-icon-preview" style="font-size: 20px;">star</i>
                                <span id="selected-icon-name">Star</span>
                                <i class="material-icons" style="margin-left: auto;">arrow_drop_down</i>
                            </button>
                            <div class="icon-library-dropdown" id="icon-library-dropdown" style="display: none; position: absolute; width: 100%; max-height: 400px; overflow-y: auto; background: white; border: 1px solid #c9cccf; border-radius: 4px; margin-top: 4px; z-index: 1000; box-shadow: 0 2px 8px rgba(0,0,0,0.1);">
                                <!-- General Icons -->
                                <div class="icon-category" style="padding: 8px 12px; background: #f4f4f4; font-weight: 500; font-size: 12px;">General</div>
                                <div class="icon-grid" style="display: grid; grid-template-columns: repeat(4, 1fr); gap: 4px; padding: 8px;">
                                    <div class="icon-item" data-icon="none" data-name="None"><i class="material-icons" style="visibility: hidden;">block</i><span>None</span></div>
                                    <div class="icon-item" data-icon="settings" data-name="Settings"><i class="material-icons">settings</i><span>Settings</span></div>
                                    <div class="icon-item" data-icon="search" data-name="Search"><i class="material-icons">search</i><span>Search</span></div>
                                    <div class="icon-item" data-icon="visibility" data-name="Eye"><i class="material-icons">visibility</i><span>Eye</span></div>
                                    <div class="icon-item" data-icon="visibility_off" data-name="Eye slash"><i class="material-icons">visibility_off</i><span>Eye slash</span></div>
                                    <div class="icon-item" data-icon="person" data-name="User"><i class="material-icons">person</i><span>User</span></div>
                                    <div class="icon-item" data-icon="favorite_border" data-name="Love outline"><i class="material-icons">favorite_border</i><span>Love outline</span></div>
                                    <div class="icon-item" data-icon="favorite" data-name="Love solid"><i class="material-icons">favorite</i><span>Love solid</span></div>
                                    <div class="icon-item" data-icon="thumb_up" data-name="Like"><i class="material-icons">thumb_up</i><span>Like</span></div>
                                    <div class="icon-item" data-icon="thumb_down" data-name="Dislike"><i class="material-icons">thumb_down</i><span>Dislike</span></div>
                                    <div class="icon-item" data-icon="lightbulb" data-name="Lamp"><i class="material-icons">lightbulb</i><span>Lamp</span></div>
                                    <div class="icon-item" data-icon="star_border" data-name="Star outline"><i class="material-icons">star_border</i><span>Star outline</span></div>
                                    <div class="icon-item" data-icon="star" data-name="Star solid"><i class="material-icons">star</i><span>Star solid</span></div>
                                    <div class="icon-item" data-icon="delete" data-name="Trash"><i class="material-icons">delete</i><span>Trash</span></div>
                                    <div class="icon-item" data-icon="description" data-name="Document"><i class="material-icons">description</i><span>Document</span></div>
                                    <div class="icon-item" data-icon="content_copy" data-name="Copy"><i class="material-icons">content_copy</i><span>Copy</span></div>
                                </div>
                                
                                <!-- Shop Icons -->
                                <div class="icon-category" style="padding: 8px 12px; background: #f4f4f4; font-weight: 500; font-size: 12px;">Shop</div>
                                <div class="icon-grid" style="display: grid; grid-template-columns: repeat(4, 1fr); gap: 4px; padding: 8px;">
                                    <div class="icon-item" data-icon="shopping_bag" data-name="Bag"><i class="material-icons">shopping_bag</i><span>Bag</span></div>
                                    <div class="icon-item" data-icon="shopping_cart" data-name="Cart"><i class="material-icons">shopping_cart</i><span>Cart</span></div>
                                    <div class="icon-item" data-icon="qr_code_scanner" data-name="Barcode"><i class="material-icons">qr_code_scanner</i><span>Barcode</span></div>
                                    <div class="icon-item" data-icon="confirmation_number" data-name="Coupon"><i class="material-icons">confirmation_number</i><span>Coupon</span></div>
                                    <div class="icon-item" data-icon="card_giftcard" data-name="Gift"><i class="material-icons">card_giftcard</i><span>Gift</span></div>
                                    <div class="icon-item" data-icon="sell" data-name="Discount outline"><i class="material-icons">sell</i><span>Discount</span></div>
                                    <div class="icon-item" data-icon="workspace_premium" data-name="Medal"><i class="material-icons">workspace_premium</i><span>Medal</span></div>
                                    <div class="icon-item" data-icon="straighten" data-name="Pen and ruler"><i class="material-icons">straighten</i><span>Ruler</span></div>
                                    <div class="icon-item" data-icon="palette" data-name="Color swatch"><i class="material-icons">palette</i><span>Colors</span></div>
                                    <div class="icon-item" data-icon="directions_car" data-name="Car"><i class="material-icons">directions_car</i><span>Car</span></div>
                                    <div class="icon-item" data-icon="local_cafe" data-name="Cup"><i class="material-icons">local_cafe</i><span>Cup</span></div>
                                    <div class="icon-item" data-icon="cake" data-name="Cake"><i class="material-icons">cake</i><span>Cake</span></div>
                                    <div class="icon-item" data-icon="checkroom" data-name="Hanger"><i class="material-icons">checkroom</i><span>Hanger</span></div>
                                    <div class="icon-item" data-icon="store" data-name="Store"><i class="material-icons">store</i><span>Store</span></div>
                                    <div class="icon-item" data-icon="label" data-name="Tag"><i class="material-icons">label</i><span>Tag</span></div>
                                </div>
                                
                                <!-- Shipping Icons -->
                                <div class="icon-category" style="padding: 8px 12px; background: #f4f4f4; font-weight: 500; font-size: 12px;">Shipping</div>
                                <div class="icon-grid" style="display: grid; grid-template-columns: repeat(4, 1fr); gap: 4px; padding: 8px;">
                                    <div class="icon-item" data-icon="inventory_2" data-name="Shipping box"><i class="material-icons">inventory_2</i><span>Box</span></div>
                                    <div class="icon-item" data-icon="place" data-name="Address pin"><i class="material-icons">place</i><span>Pin</span></div>
                                    <div class="icon-item" data-icon="local_shipping" data-name="Fast delivery"><i class="material-icons">local_shipping</i><span>Delivery</span></div>
                                    <div class="icon-item" data-icon="local_shipping" data-name="Delivery truck"><i class="material-icons">local_shipping</i><span>Truck</span></div>
                                    <div class="icon-item" data-icon="replay" data-name="Easy returns"><i class="material-icons">replay</i><span>Returns</span></div>
                                    <div class="icon-item" data-icon="public" data-name="World"><i class="material-icons">public</i><span>World</span></div>
                                    <div class="icon-item" data-icon="flight" data-name="Plane"><i class="material-icons">flight</i><span>Plane</span></div>
                                    <div class="icon-item" data-icon="manage_search" data-name="Search order"><i class="material-icons">manage_search</i><span>Track</span></div>
                                    <div class="icon-item" data-icon="business_center" data-name="Briefcase"><i class="material-icons">business_center</i><span>Business</span></div>
                                    <div class="icon-item" data-icon="route" data-name="Routing"><i class="material-icons">route</i><span>Route</span></div>
                                </div>
                                
                                <!-- Payment & Security Icons -->
                                <div class="icon-category" style="padding: 8px 12px; background: #f4f4f4; font-weight: 500; font-size: 12px;">Payment Security</div>
                                <div class="icon-grid" style="display: grid; grid-template-columns: repeat(4, 1fr); gap: 4px; padding: 8px;">
                                    <div class="icon-item" data-icon="credit_card" data-name="Credit card"><i class="material-icons">credit_card</i><span>Card</span></div>
                                    <div class="icon-item" data-icon="lock" data-name="Lock"><i class="material-icons">lock</i><span>Lock</span></div>
                                    <div class="icon-item" data-icon="shield" data-name="Shield"><i class="material-icons">shield</i><span>Shield</span></div>
                                    <div class="icon-item" data-icon="verified_user" data-name="Secure payment"><i class="material-icons">verified_user</i><span>Secure</span></div>
                                    <div class="icon-item" data-icon="account_balance_wallet" data-name="Wallet"><i class="material-icons">account_balance_wallet</i><span>Wallet</span></div>
                                    <div class="icon-item" data-icon="attach_money" data-name="Cash"><i class="material-icons">attach_money</i><span>Cash</span></div>
                                    <div class="icon-item" data-icon="receipt" data-name="Receipt"><i class="material-icons">receipt</i><span>Receipt</span></div>
                                </div>
                                
                                <!-- Communication Icons -->
                                <div class="icon-category" style="padding: 8px 12px; background: #f4f4f4; font-weight: 500; font-size: 12px;">Communication</div>
                                <div class="icon-grid" style="display: grid; grid-template-columns: repeat(4, 1fr); gap: 4px; padding: 8px;">
                                    <div class="icon-item" data-icon="phone" data-name="Phone"><i class="material-icons">phone</i><span>Phone</span></div>
                                    <div class="icon-item" data-icon="chat" data-name="Chat"><i class="material-icons">chat</i><span>Chat</span></div>
                                    <div class="icon-item" data-icon="message" data-name="Message"><i class="material-icons">message</i><span>Message</span></div>
                                    <div class="icon-item" data-icon="email" data-name="Email"><i class="material-icons">email</i><span>Email</span></div>
                                    <div class="icon-item" data-icon="support_agent" data-name="Customer support"><i class="material-icons">support_agent</i><span>Support</span></div>
                                    <div class="icon-item" data-icon="print" data-name="Printer"><i class="material-icons">print</i><span>Print</span></div>
                                    <div class="icon-item" data-icon="smartphone" data-name="Mobile"><i class="material-icons">smartphone</i><span>Mobile</span></div>
                                </div>
                                
                                <!-- Other Icons -->
                                <div class="icon-category" style="padding: 8px 12px; background: #f4f4f4; font-weight: 500; font-size: 12px;">Other</div>  
                                <div class="icon-grid" style="display: grid; grid-template-columns: repeat(4, 1fr); gap: 4px; padding: 8px;">
                                    <div class="icon-item" data-icon="add" data-name="Plus"><i class="material-icons">add</i><span>Plus</span></div>
                                    <div class="icon-item" data-icon="remove" data-name="Minus"><i class="material-icons">remove</i><span>Minus</span></div>
                                    <div class="icon-item" data-icon="check" data-name="Checkmark"><i class="material-icons">check</i><span>Check</span></div>
                                    <div class="icon-item" data-icon="arrow_forward" data-name="Arrow right"><i class="material-icons">arrow_forward</i><span>Right</span></div>
                                    <div class="icon-item" data-icon="arrow_back" data-name="Arrow left"><i class="material-icons">arrow_back</i><span>Left</span></div>
                                    <div class="icon-item" data-icon="undo" data-name="Undo"><i class="material-icons">undo</i><span>Undo</span></div>
                                    <div class="icon-item" data-icon="redo" data-name="Redo"><i class="material-icons">redo</i><span>Redo</span></div>
                                    <div class="icon-item" data-icon="refresh" data-name="Refresh"><i class="material-icons">refresh</i><span>Refresh</span></div>
                                    <div class="icon-item" data-icon="notifications" data-name="Notification"><i class="material-icons">notifications</i><span>Alert</span></div>
                                    <div class="icon-item" data-icon="schedule" data-name="Clock"><i class="material-icons">schedule</i><span>Clock</span></div>
                                    <div class="icon-item" data-icon="calendar_today" data-name="Calendar"><i class="material-icons">calendar_today</i><span>Calendar</span></div>
                                    <div class="icon-item" data-icon="info" data-name="Information"><i class="material-icons">info</i><span>Info</span></div>
                                    <div class="icon-item" data-icon="campaign" data-name="Announcement"><i class="material-icons">campaign</i><span>Announce</span></div>
                                    <div class="icon-item" data-icon="share" data-name="Share"><i class="material-icons">share</i><span>Share</span></div>
                                    <div class="icon-item" data-icon="format_list_bulleted" data-name="List"><i class="material-icons">format_list_bulleted</i><span>List</span></div>
                                </div>
                            </div>
                        </div>
                        
                        <!-- Icon Color (Hidden - Icons will use text color from scheme) -->
                        <div class="settings-field" style="margin-top: 16px; display: none;">
                            <label data-i18n="announcementItem.iconColor">Color del icono</label>
                            <div class="shopify-color-input-wrapper">
                                <input type="color" value="#000000" class="shopify-color-picker" id="icon-color-picker">
                                <input type="text" value="#000000" class="shopify-color-text" id="icon-color-text">
                                <button class="shopify-color-copy">
                                    <i class="material-icons">content_copy</i>
                                </button>
                            </div>
                        </div>
                    </div>
                    
                    <!-- Custom icon upload section -->
                    <div id="custom-icon-section" class="settings-field" style="display: none;">
                        <label data-i18n="announcementItem.customIcon">Icono personalizado</label>
                        <div style="border: 1px dashed #c9cccf; border-radius: 4px; padding: 16px; background: #f9f9f9;">
                            <button class="btn-secondary" id="custom-icon-upload-btn" style="width: 100%; padding: 8px 16px; background: white; border: 1px solid #c9cccf; border-radius: 4px; cursor: pointer;" data-i18n="announcementItem.select">
                                Seleccionar
                            </button>
                            <input type="file" id="custom-icon-file" accept="image/*" style="display: none;">
                            <div id="custom-icon-preview" style="margin-top: 12px; text-align: center; display: none;">
                                <img src="" alt="Custom icon" style="max-width: 32px; max-height: 32px;">
                                <button class="btn-link" id="remove-custom-icon" style="display: block; margin: 8px auto 0; color: #d72c0d;">Remove</button>
                            </div>
                            <p style="font-size: 11px; color: #6d7175; margin: 8px 0 0 0; text-align: center;" data-i18n="announcementItem.browseFreeImages">
                                Explorar imágenes gratuitas
                            </p>
                        </div>
                    </div>
                    
                    <!-- Eliminar bloque button -->
                    <div style="margin-top: 40px; padding-top: 20px; border-top: 1px solid #e3e3e3;">
                        <button class="delete-block-btn" style="display: flex; align-items: center; gap: 8px; color: #d72c0d; background: none; border: none; padding: 8px 12px; cursor: pointer; font-size: 14px; width: 100%; justify-content: center; border-radius: 4px; transition: background 0.1s;">
                            <i class="material-icons" style="font-size: 20px;">delete</i>
                            <span data-i18n="announcementItem.deleteBlock">Eliminar bloque</span>
                        </button>
                    </div>
                </div>
            </div>
        `;
    }
    
    // Function to render block settings view  
    function renderBlockSettingsView(blockData) {
        if (!blockData) return '';
        
        const schema = blockSettingsSchemas[blockData.type] || {};
        const fieldsHtml = (schema.fields || []).map(field => `
            <div class="settings-field">
                <label>${field}:</label>
                <input type="text" class="settings-input" data-field="${field}" value="${blockData.settings?.[field] || ''}" />
            </div>
        `).join('');
        
        return `
            <div class="sidebar-view-header">
                <button class="back-to-block-list-btn">
                    <i class="material-icons">arrow_back</i>
                </button>
                <h3>${lang.editingBlockTitle || "Editando Bloque"}: ${blockData.type}</h3>
            </div>
            <div class="settings-container">
                ${fieldsHtml}
            </div>
        `;
    }
    
    // Function to render add section view
    function renderAddSectionView(group = 'template') {
        // Show all sections regardless of group (like Shopify does)
        const sections = [
            { id: 'featured-collection', icon: 'view_module', name: 'featuredCollection' },
            { id: 'featured-product', icon: 'shopping_bag', name: 'featuredProduct' },
            { id: 'collection-list', icon: 'list', name: 'collectionList' },
            { id: 'rich-text', icon: 'text_fields', name: 'richText' },
            { id: 'image-banner', icon: 'image', name: 'imageBanner' },
            { id: 'slideshow', icon: 'view_carousel', name: 'slideshow' },
            { id: 'collage', icon: 'dashboard', name: 'collage' },
            { id: 'multicolumn', icon: 'view_week', name: 'multicolumn' },
            { id: 'newsletter', icon: 'email', name: 'newsletter' },
            { id: 'contact-form', icon: 'mail_outline', name: 'contactForm' },
            { id: 'custom-liquid', icon: 'code', name: 'customLiquid' },
            { id: 'accordion', icon: 'expand_more', name: 'accordion' },
            { id: 'before-after-images', icon: 'compare', name: 'beforeAfterImages' },
            { id: 'blog-posts', icon: 'article', name: 'blogPosts' },
            { id: 'collection-with-text', icon: 'text_snippet', name: 'collectionWithText' },
            { id: 'countdown-banner', icon: 'timer', name: 'countdownBanner' },
            { id: 'featured-navigation', icon: 'menu', name: 'featuredNavigation' },
            { id: 'gallery', icon: 'photo_library', name: 'gallery' },
            { id: 'hotspots', icon: 'place', name: 'hotspots' },
            { id: 'image-slider', icon: 'view_carousel', name: 'imageSlider' },
            { id: 'images-with-text', icon: 'image', name: 'imagesWithText' },
            { id: 'logo-list', icon: 'business', name: 'logoList' },
            { id: 'lookbook', icon: 'book', name: 'lookbook' },
            { id: 'map', icon: 'map', name: 'map' },
            { id: 'multiple-collections', icon: 'view_module', name: 'multipleCollections' },
            { id: 'page', icon: 'description', name: 'page' },
            { id: 'recently-viewed', icon: 'history', name: 'recentlyViewed' },
            { id: 'scrolling-text', icon: 'text_rotation_none', name: 'scrollingText' },
            { id: 'spacer', icon: 'space_bar', name: 'spacer' },
            { id: 'split-image-banner', icon: 'view_column', name: 'splitImageBanner' },
            { id: 'testimonials', icon: 'rate_review', name: 'testimonials' },
            { id: 'video', icon: 'videocam', name: 'video' }
        ];
        
        return `
            <div class="add-section-modal">
                <div class="add-section-header">
                    <h3 class="modal-title" data-i18n="sections.addSection">Agregar sección</h3>
                    <button class="cancel-button" data-i18n="common.cancel">Cancelar</button>
                </div>
                <div class="add-section-content">
                    <div class="add-section-left">
                        <div class="search-sections-wrapper">
                            <div class="search-input-container">
                                <i class="material-icons search-icon">search</i>
                                <input type="text" class="search-sections-input" placeholder="" data-i18n-placeholder="sections.searchSections">
                            </div>
                        </div>
                        <div class="sections-list">
                            ${sections.map(section => {
                                const translationKey = `sections.${section.name}`;
                                const displayName = (translations[currentLanguage] && translations[currentLanguage][translationKey]) || section.name;
                                return `
                                    <div class="section-item" data-section-id="${section.id}">
                                        <i class="material-icons">${section.icon}</i>
                                        <span data-i18n="${translationKey}">${displayName}</span>
                                        ${section.id === 'featured-product' ? '<i class="material-icons info-icon">info_outline</i>' : ''}
                                    </div>
                                `;
                            }).join('')}
                        </div>
                    </div>
                    <div class="section-preview">
                        <div class="preview-placeholder">
                            <p data-i18n="sections.selectToPreview">Selecciona una sección para ver vista previa</p>
                        </div>
                    </div>
                </div>
            </div>
        `;
    }
    
    // Function to render theme settings view
    function renderThemeSettingsView() {
        console.log('Rendering theme settings view with new Shopify styles...');
        return `
            <div class="theme-settings-header-shopify">
                <h3 data-i18n="themeSettings.title">Configuración del tema</h3>
            </div>
            
            <div class="theme-settings-sections">
                <!-- Appearance -->
                <div class="theme-setting-section">
                    <button class="theme-section-header" data-section="appearance">
                        <span data-i18n="themeSettings.appearance">Appearance</span>
                        <i class="material-icons section-chevron">keyboard_arrow_down</i>
                    </button>
                    <div class="theme-section-content shopify-appearance-content" style="display: none;">
                        <div class="appearance-controls">
                            <!-- Page Width -->
                            <div class="appearance-field">
                                <label data-i18n="appearance.pageWidth">Page width</label>
                                <div class="shopify-slider-container">
                                    <input type="range" id="pageWidth" min="1000" max="5000" value="3000" step="100" class="shopify-slider">
                                    <div class="shopify-value-box">
                                        <input type="number" id="pageWidthValue" min="1000" max="5000" value="3000" class="shopify-value-input">
                                        <span class="shopify-unit">px</span>
                                    </div>
                                </div>
                            </div>

                            <!-- Side Padding Size -->
                            <div class="appearance-field">
                                <label data-i18n="appearance.sidePaddingSize">Side padding size</label>
                                <div class="shopify-slider-container">
                                    <input type="range" id="sidePaddingSize" min="10" max="100" value="34" step="1" class="shopify-slider">
                                    <div class="shopify-value-box">
                                        <input type="number" id="sidePaddingSizeValue" min="10" max="100" value="34" class="shopify-value-input">
                                        <span class="shopify-unit">px</span>
                                    </div>
                                </div>
                            </div>

                            <!-- Edge Rounding -->
                            <div class="appearance-field">
                                <label data-i18n="appearance.edgeRounding">Edge rounding</label>
                                <select id="edgeRounding" class="shopify-select">
                                    <option value="size0" data-i18n="appearance.edgeRoundingNone">Size 0 - None</option>
                                    <option value="size1" data-i18n="appearance.edgeRoundingXSmall">Size 1 - Extra small</option>
                                    <option value="size2" data-i18n="appearance.edgeRoundingSmall">Size 2 - Small</option>
                                    <option value="size3" data-i18n="appearance.edgeRoundingMedium">Size 3 - Medium</option>
                                    <option value="size4" data-i18n="appearance.edgeRoundingLarge">Size 4 - Large</option>
                                </select>
                                <small class="shopify-description" data-i18n="appearance.edgeRoundingDescription">
                                    Applies to cards, buttons, section corners, and other elements
                                </small>
                            </div>
                        </div>
                    </div>
                </div>
                
                <!-- Typography -->
                <div class="theme-setting-section">
                    <button class="theme-section-header" data-section="typography">
                        <span data-i18n="themeSettings.typography">Typography</span>
                        <i class="material-icons section-chevron">keyboard_arrow_down</i>
                    </button>
                    <div class="theme-section-content shopify-section-content" style="display: none;">
                        <div class="typography-controls">
                            <p class="section-info" data-i18n="typography.description">We recommend that you use no more than two font families for your store.</p>
                            <a href="#" class="learn-more-link" data-i18n="typography.learnMore">Learn how fonts affect store speed</a>
                            
                            <!-- Heading Section -->
                            <div class="subsection-title" data-i18n="typography.heading">Heading</div>
                            <div class="typography-subsection">
                                <div class="settings-field">
                                    <label data-i18n="typography.font">Font</label>
                                    <div class="font-select-wrapper">
                                        <input type="text" class="font-search-input" placeholder="Search fonts..." data-font-type="heading" data-font-value="">
                                        <div class="font-preview-text">Aa</div>
                                    </div>
                                </div>
                                
                                <div class="settings-field">
                                    <label class="checkbox-label">
                                        <span data-i18n="typography.useUppercase">Use uppercase</span>
                                        <input type="checkbox" class="shopify-toggle" id="headingUppercase">
                                        <label for="headingUppercase" class="toggle-slider"></label>
                                    </label>
                                </div>
                                
                                <div class="settings-field">
                                    <label data-i18n="typography.letterSpacing">Letter spacing</label>
                                    <div class="shopify-slider-container">
                                        <input type="range" id="headingLetterSpacing" min="-2" max="5" value="0" step="0.1" class="shopify-slider">
                                        <div class="shopify-value-box">
                                            <input type="number" id="headingLetterSpacingValue" min="-2" max="5" value="0" step="0.1" class="shopify-value-input">
                                            <span class="shopify-unit">px</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            
                            <!-- Body Section -->
                            <div class="subsection-title" data-i18n="typography.body" style="margin-top: 24px;">Body</div>
                            <div class="typography-subsection">
                                <div class="settings-field">
                                    <label data-i18n="typography.font">Font</label>
                                    <div class="font-select-wrapper">
                                        <input type="text" class="font-search-input" placeholder="Search fonts..." data-font-type="body" data-font-value="">
                                        <div class="font-preview-text">Aa</div>
                                    </div>
                                </div>
                                
                                <div class="settings-field">
                                    <label data-i18n="typography.fontSize">Font size</label>
                                    <div class="shopify-slider-container">
                                        <input type="range" id="bodyFontSize" min="12" max="24" value="16" step="1" class="shopify-slider">
                                        <div class="shopify-value-box">
                                            <input type="number" id="bodyFontSizeValue" min="12" max="24" value="16" class="shopify-value-input">
                                            <span class="shopify-unit">px</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            
                            <!-- Menu Section -->
                            <div class="subsection-title" data-i18n="typography.menu" style="margin-top: 24px;">Menu</div>
                            <div class="typography-subsection">
                                <div class="settings-field">
                                    <label data-i18n="typography.font">Font</label>
                                    <div class="font-select-wrapper">
                                        <input type="text" class="font-search-input" placeholder="Search fonts..." data-font-type="menu" data-font-value="">
                                        <div class="font-preview-text">Aa</div>
                                    </div>
                                </div>
                                
                                <div class="settings-field">
                                    <label class="checkbox-label">
                                        <span data-i18n="typography.useUppercase">Use uppercase</span>
                                        <input type="checkbox" class="shopify-toggle" id="menuUppercase">
                                        <label for="menuUppercase" class="toggle-slider"></label>
                                    </label>
                                </div>
                                
                                <div class="settings-field">
                                    <label data-i18n="typography.fontSize">Font size</label>
                                    <div class="shopify-slider-container">
                                        <input type="range" id="menuFontSize" min="50" max="200" value="100" step="1" class="shopify-slider">
                                        <div class="shopify-value-box">
                                            <input type="number" id="menuFontSizeValue" min="50" max="200" value="100" class="shopify-value-input">
                                            <span class="shopify-unit">%</span>
                                        </div>
                                    </div>
                                </div>
                                
                                <div class="settings-field">
                                    <label data-i18n="typography.letterSpacing">Letter spacing</label>
                                    <div class="shopify-slider-container">
                                        <input type="range" id="menuLetterSpacing" min="-2" max="5" value="0" step="0.1" class="shopify-slider">
                                        <div class="shopify-value-box">
                                            <input type="number" id="menuLetterSpacingValue" min="-2" max="5" value="0" step="0.1" class="shopify-value-input">
                                            <span class="shopify-unit">px</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            
                            <!-- Product Card Name Section -->
                            <div class="subsection-title" data-i18n="typography.productCardName" style="margin-top: 24px;">Product card name</div>
                            <div class="typography-subsection">
                                <div class="settings-field">
                                    <label data-i18n="typography.font">Font</label>
                                    <div class="font-select-wrapper">
                                        <input type="text" class="font-search-input" placeholder="Search fonts..." data-font-type="product" data-font-value="">
                                        <div class="font-preview-text">Aa</div>
                                    </div>
                                </div>
                                
                                <div class="settings-field">
                                    <label class="checkbox-label">
                                        <span data-i18n="typography.useUppercase">Use uppercase</span>
                                        <input type="checkbox" class="shopify-toggle" id="productUppercase">
                                        <label for="productUppercase" class="toggle-slider"></label>
                                    </label>
                                </div>
                                
                                <div class="settings-field">
                                    <label data-i18n="typography.fontSize">Font size</label>
                                    <div class="shopify-slider-container">
                                        <input type="range" id="productFontSize" min="50" max="200" value="100" step="1" class="shopify-slider">
                                        <div class="shopify-value-box">
                                            <input type="number" id="productFontSizeValue" min="50" max="200" value="100" class="shopify-value-input">
                                            <span class="shopify-unit">%</span>
                                        </div>
                                    </div>
                                </div>
                                
                                <div class="settings-field">
                                    <label data-i18n="typography.letterSpacing">Letter spacing</label>
                                    <div class="shopify-slider-container">
                                        <input type="range" id="productLetterSpacing" min="-2" max="5" value="0" step="0.1" class="shopify-slider">
                                        <div class="shopify-value-box">
                                            <input type="number" id="productLetterSpacingValue" min="-2" max="5" value="0" step="0.1" class="shopify-value-input">
                                            <span class="shopify-unit">px</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            
                            <!-- Buttons Section -->
                            <div class="subsection-title" data-i18n="typography.buttons" style="margin-top: 24px;">Buttons</div>
                            <div class="typography-subsection">
                                <div class="settings-field">
                                    <label data-i18n="typography.font">Font</label>
                                    <div class="font-select-wrapper">
                                        <input type="text" class="font-search-input" placeholder="Search fonts..." data-font-type="buttons" data-font-value="">
                                        <div class="font-preview-text">Aa</div>
                                    </div>
                                </div>
                                
                                <div class="settings-field">
                                    <label class="checkbox-label">
                                        <span data-i18n="typography.useUppercase">Use uppercase</span>
                                        <input type="checkbox" class="shopify-toggle" id="buttonsUppercase">
                                        <label for="buttonsUppercase" class="toggle-slider"></label>
                                    </label>
                                </div>
                                
                                <div class="settings-field">
                                    <label data-i18n="typography.fontSize">Font size</label>
                                    <div class="shopify-slider-container">
                                        <input type="range" id="buttonsFontSize" min="50" max="200" value="100" step="1" class="shopify-slider">
                                        <div class="shopify-value-box">
                                            <input type="number" id="buttonsFontSizeValue" min="50" max="200" value="100" class="shopify-value-input">
                                            <span class="shopify-unit">%</span>
                                        </div>
                                    </div>
                                </div>
                                
                                <div class="settings-field">
                                    <label data-i18n="typography.letterSpacing">Letter spacing</label>
                                    <div class="shopify-slider-container">
                                        <input type="range" id="buttonsLetterSpacing" min="-2" max="5" value="0" step="0.1" class="shopify-slider">
                                        <div class="shopify-value-box">
                                            <input type="number" id="buttonsLetterSpacingValue" min="-2" max="5" value="0" step="0.1" class="shopify-value-input">
                                            <span class="shopify-unit">px</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                
                <!-- Color schemes -->
                <div class="theme-setting-section">
                    <button class="theme-section-header" data-section="color-schemes">
                        <span data-i18n="themeSettings.colorSchemes">Color schemes</span>
                        <i class="material-icons section-chevron">keyboard_arrow_down</i>
                    </button>
                    <div class="theme-section-content shopify-section-content" style="display: none;">
                        <div class="color-schemes-controls">
                            <!-- Color Scheme Selector -->
                            <div class="color-scheme-selector">
                                <label data-i18n="colorSchemes.defaultColorScheme">Default color scheme</label>
                                <select class="shopify-select color-scheme-dropdown" id="colorSchemeSelect">
                                    <option value="scheme1">Scheme 1</option>
                                    <option value="scheme2">Scheme 2</option>
                                    <option value="scheme3">Scheme 3</option>
                                    <option value="scheme4">Scheme 4</option>
                                    <option value="scheme5">Scheme 5</option>
                                </select>
                                <a href="#" class="learn-more-link color-scheme-learn" data-i18n="colorSchemes.learnAbout">Learn about color schemes</a>
                            </div>
                            
                            <!-- Color Scheme Settings -->
                            <div class="color-scheme-settings" data-scheme="scheme1">
                                <!-- Primary Section - HIDDEN -->
                                <!-- <div class="color-section">
                                    <h4 class="color-section-title" data-i18n="colorSchemes.primary">Primary</h4>
                                    
                                    <div class="color-field">
                                        <label data-i18n="colorSchemes.text">Text</label>
                                        <div class="shopify-color-input-wrapper">
                                            <input type="color" value="#FFFFFF" class="shopify-color-picker" data-field="primary-text">
                                            <input type="text" value="#FFFFFF" class="shopify-color-text" data-field="primary-text">
                                            <button class="shopify-color-copy" data-field="primary-text">
                                                <i class="material-icons">content_copy</i>
                                            </button>
                                        </div>
                                    </div>
                                    
                                    <div class="color-field">
                                        <label data-i18n="colorSchemes.background">Background</label>
                                        <div class="shopify-color-input-wrapper">
                                            <input type="color" value="#020711" class="shopify-color-picker" data-field="primary-background">
                                            <input type="text" value="#020711" class="shopify-color-text" data-field="primary-background">
                                            <button class="shopify-color-copy" data-field="primary-background">
                                                <i class="material-icons">content_copy</i>
                                            </button>
                                        </div>
                                    </div>
                                    
                                    <div class="color-field">
                                        <label data-i18n="colorSchemes.foreground">Foreground</label>
                                        <div class="shopify-color-input-wrapper">
                                            <input type="color" value="#020711" class="shopify-color-picker" data-field="primary-foreground">
                                            <input type="text" value="#020711" class="shopify-color-text" data-field="primary-foreground">
                                            <button class="shopify-color-copy" data-field="primary-foreground">
                                                <i class="material-icons">content_copy</i>
                                            </button>
                                        </div>
                                    </div>
                                    
                                    <div class="color-field">
                                        <label data-i18n="colorSchemes.border">Border</label>
                                        <div class="shopify-color-input-wrapper">
                                            <input type="color" value="#000000" class="shopify-color-picker" data-field="primary-border">
                                            <input type="text" value="#000000" class="shopify-color-text" data-field="primary-border">
                                            <button class="shopify-color-copy" data-field="primary-border">
                                                <i class="material-icons">content_copy</i>
                                            </button>
                                        </div>
                                    </div>
                                    
                                    <div class="color-field">
                                        <label data-i18n="colorSchemes.solidButton">Solid button</label>
                                        <div class="shopify-color-input-wrapper">
                                            <input type="color" value="#2F3349" class="shopify-color-picker" data-field="primary-solid-button">
                                            <input type="text" value="#2F3349" class="shopify-color-text" data-field="primary-solid-button">
                                            <button class="shopify-color-copy" data-field="primary-solid-button">
                                                <i class="material-icons">content_copy</i>
                                            </button>
                                        </div>
                                    </div>
                                    
                                    <div class="color-field">
                                        <label data-i18n="colorSchemes.solidButtonText">Solid button text</label>
                                        <div class="shopify-color-input-wrapper">
                                            <input type="color" value="#FFFFFF" class="shopify-color-picker" data-field="primary-solid-button-text">
                                            <input type="text" value="#FFFFFF" class="shopify-color-text" data-field="primary-solid-button-text">
                                            <button class="shopify-color-copy" data-field="primary-solid-button-text">
                                                <i class="material-icons">content_copy</i>
                                            </button>
                                        </div>
                                    </div>
                                    
                                    <div class="color-field">
                                        <label data-i18n="colorSchemes.outlineButton">Outline button</label>
                                        <div class="shopify-color-input-wrapper">
                                            <input type="color" value="#473C63" class="shopify-color-picker" data-field="primary-outline-button">
                                            <input type="text" value="#473C63" class="shopify-color-text" data-field="primary-outline-button">
                                            <button class="shopify-color-copy" data-field="primary-outline-button">
                                                <i class="material-icons">content_copy</i>
                                            </button>
                                        </div>
                                    </div>
                                    
                                    <div class="color-field">
                                        <label data-i18n="colorSchemes.outlineButtonText">Outline button text</label>
                                        <div class="shopify-color-input-wrapper">
                                            <input type="color" value="#FFFFFF" class="shopify-color-picker" data-field="primary-outline-button-text">
                                            <input type="text" value="#FFFFFF" class="shopify-color-text" data-field="primary-outline-button-text">
                                            <button class="shopify-color-copy" data-field="primary-outline-button-text">
                                                <i class="material-icons">content_copy</i>
                                            </button>
                                        </div>
                                    </div>
                                    
                                    <div class="color-field">
                                        <label data-i18n="colorSchemes.imageOverlay">Image overlay</label>
                                        <div class="shopify-color-input-wrapper">
                                            <input type="text" value="rgba(0, 0, 0, 0.1)" class="shopify-color-text" data-field="primary-image-overlay">
                                            <button class="shopify-color-copy" data-field="primary-image-overlay">
                                                <i class="material-icons">content_copy</i>
                                            </button>
                                        </div>
                                    </div>
                                </div> -->
                                
                                <!-- Secondary Section - HIDDEN
                                <div class="color-section">
                                    <h4 class="color-section-title" data-i18n="colorSchemes.secondary">Secondary</h4>
                                    
                                    <div class="color-field">
                                        <label data-i18n="colorSchemes.text">Text</label>
                                        <div class="shopify-color-input-wrapper">
                                            <input type="color" value="#000000" class="shopify-color-picker" data-field="secondary-text">
                                            <input type="text" value="#000000" class="shopify-color-text" data-field="secondary-text">
                                            <button class="shopify-color-copy" data-field="secondary-text">
                                                <i class="material-icons">content_copy</i>
                                            </button>
                                        </div>
                                    </div>
                                    
                                    <div class="color-field">
                                        <label data-i18n="colorSchemes.background">Background</label>
                                        <div class="shopify-color-input-wrapper">
                                            <input type="color" value="#FFFFFF" class="shopify-color-picker" data-field="secondary-background">
                                            <input type="text" value="#FFFFFF" class="shopify-color-text" data-field="secondary-background">
                                            <button class="shopify-color-copy" data-field="secondary-background">
                                                <i class="material-icons">content_copy</i>
                                            </button>
                                        </div>
                                    </div>
                                    
                                    <div class="color-field">
                                        <label data-i18n="colorSchemes.foreground">Foreground</label>
                                        <div class="shopify-color-input-wrapper">
                                            <input type="color" value="#FDF48B" class="shopify-color-picker" data-field="secondary-foreground">
                                            <input type="text" value="#FDF48B" class="shopify-color-text" data-field="secondary-foreground">
                                            <button class="shopify-color-copy" data-field="secondary-foreground">
                                                <i class="material-icons">content_copy</i>
                                            </button>
                                        </div>
                                    </div>
                                    
                                    <div class="color-field">
                                        <label data-i18n="colorSchemes.border">Border</label>
                                        <div class="shopify-color-input-wrapper">
                                            <input type="color" value="#FFFFFF" class="shopify-color-picker" data-field="secondary-border">
                                            <input type="text" value="#FFFFFF" class="shopify-color-text" data-field="secondary-border">
                                            <button class="shopify-color-copy" data-field="secondary-border">
                                                <i class="material-icons">content_copy</i>
                                            </button>
                                        </div>
                                    </div>
                                    
                                    <div class="color-field">
                                        <label data-i18n="colorSchemes.solidButton">Solid button</label>
                                        <div class="shopify-color-input-wrapper">
                                            <input type="color" value="#2F3349" class="shopify-color-picker" data-field="secondary-solid-button">
                                            <input type="text" value="#2F3349" class="shopify-color-text" data-field="secondary-solid-button">
                                            <button class="shopify-color-copy" data-field="secondary-solid-button">
                                                <i class="material-icons">content_copy</i>
                                            </button>
                                        </div>
                                    </div>
                                    
                                    <div class="color-field">
                                        <label data-i18n="colorSchemes.solidButtonText">Solid button text</label>
                                        <div class="shopify-color-input-wrapper">
                                            <input type="color" value="#FFFFFF" class="shopify-color-picker" data-field="secondary-solid-button-text">
                                            <input type="text" value="#FFFFFF" class="shopify-color-text" data-field="secondary-solid-button-text">
                                            <button class="shopify-color-copy" data-field="secondary-solid-button-text">
                                                <i class="material-icons">content_copy</i>
                                            </button>
                                        </div>
                                    </div>
                                    
                                    <div class="color-field">
                                        <label data-i18n="colorSchemes.outlineButton">Outline button</label>
                                        <div class="shopify-color-input-wrapper">
                                            <input type="color" value="#000000" class="shopify-color-picker" data-field="secondary-outline-button">
                                            <input type="text" value="#000000" class="shopify-color-text" data-field="secondary-outline-button">
                                            <button class="shopify-color-copy" data-field="secondary-outline-button">
                                                <i class="material-icons">content_copy</i>
                                            </button>
                                        </div>
                                    </div>
                                    
                                    <div class="color-field">
                                        <label data-i18n="colorSchemes.outlineButtonText">Outline button text</label>
                                        <div class="shopify-color-input-wrapper">
                                            <input type="color" value="#000000" class="shopify-color-picker" data-field="secondary-outline-button-text">
                                            <input type="text" value="#000000" class="shopify-color-text" data-field="secondary-outline-button-text">
                                            <button class="shopify-color-copy" data-field="secondary-outline-button-text">
                                                <i class="material-icons">content_copy</i>
                                            </button>
                                        </div>
                                    </div>
                                    
                                    <div class="color-field">
                                        <label data-i18n="colorSchemes.imageOverlay">Image overlay</label>
                                        <div class="shopify-color-input-wrapper">
                                            <input type="text" value="rgba(255, 255, 255, 0.1)" class="shopify-color-text" data-field="secondary-image-overlay">
                                            <button class="shopify-color-copy" data-field="secondary-image-overlay">
                                                <i class="material-icons">content_copy</i>
                                            </button>
                                        </div>
                                    </div>
                                </div>
                                -->
                                
                                <!-- Contrasting Section - HIDDEN
                                <div class="color-section">
                                    <h4 class="color-section-title" data-i18n="colorSchemes.contrasting">Contrasting</h4>
                                    
                                    <div class="color-field">
                                        <label data-i18n="colorSchemes.text">Text</label>
                                        <div class="shopify-color-input-wrapper">
                                            <input type="color" value="#FFFFFF" class="shopify-color-picker" data-field="contrasting-text">
                                            <input type="text" value="#FFFFFF" class="shopify-color-text" data-field="contrasting-text">
                                            <button class="shopify-color-copy" data-field="contrasting-text">
                                                <i class="material-icons">content_copy</i>
                                            </button>
                                        </div>
                                    </div>
                                    
                                    <div class="color-field">
                                        <label data-i18n="colorSchemes.background">Background</label>
                                        <div class="shopify-color-input-wrapper">
                                            <input type="color" value="#000000" class="shopify-color-picker" data-field="contrasting-background">
                                            <input type="text" value="#000000" class="shopify-color-text" data-field="contrasting-background">
                                            <button class="shopify-color-copy" data-field="contrasting-background">
                                                <i class="material-icons">content_copy</i>
                                            </button>
                                        </div>
                                    </div>
                                    
                                    <div class="color-field">
                                        <label data-i18n="colorSchemes.foreground">Foreground</label>
                                        <div class="shopify-color-input-wrapper">
                                            <input type="color" value="#000000" class="shopify-color-picker" data-field="contrasting-foreground">
                                            <input type="text" value="#000000" class="shopify-color-text" data-field="contrasting-foreground">
                                            <button class="shopify-color-copy" data-field="contrasting-foreground">
                                                <i class="material-icons">content_copy</i>
                                            </button>
                                        </div>
                                    </div>
                                    
                                    <div class="color-field">
                                        <label data-i18n="colorSchemes.border">Border</label>
                                        <div class="shopify-color-input-wrapper">
                                            <input type="color" value="#FFFFFF" class="shopify-color-picker" data-field="contrasting-border">
                                            <input type="text" value="#FFFFFF" class="shopify-color-text" data-field="contrasting-border">
                                            <button class="shopify-color-copy" data-field="contrasting-border">
                                                <i class="material-icons">content_copy</i>
                                            </button>
                                        </div>
                                    </div>
                                    
                                    <div class="color-field">
                                        <label data-i18n="colorSchemes.solidButton">Solid button</label>
                                        <div class="shopify-color-input-wrapper">
                                            <input type="color" value="#F0FF2E" class="shopify-color-picker" data-field="contrasting-solid-button">
                                            <input type="text" value="#F0FF2E" class="shopify-color-text" data-field="contrasting-solid-button">
                                            <button class="shopify-color-copy" data-field="contrasting-solid-button">
                                                <i class="material-icons">content_copy</i>
                                            </button>
                                        </div>
                                    </div>
                                    
                                    <div class="color-field">
                                        <label data-i18n="colorSchemes.solidButtonText">Solid button text</label>
                                        <div class="shopify-color-input-wrapper">
                                            <input type="color" value="#FFFFFF" class="shopify-color-picker" data-field="contrasting-solid-button-text">
                                            <input type="text" value="#FFFFFF" class="shopify-color-text" data-field="contrasting-solid-button-text">
                                            <button class="shopify-color-copy" data-field="contrasting-solid-button-text">
                                                <i class="material-icons">content_copy</i>
                                            </button>
                                        </div>
                                    </div>
                                    
                                    <div class="color-field">
                                        <label data-i18n="colorSchemes.outlineButton">Outline button</label>
                                        <div class="shopify-color-input-wrapper">
                                            <input type="color" value="#F0FF2E" class="shopify-color-picker" data-field="contrasting-outline-button">
                                            <input type="text" value="#F0FF2E" class="shopify-color-text" data-field="contrasting-outline-button">
                                            <button class="shopify-color-copy" data-field="contrasting-outline-button">
                                                <i class="material-icons">content_copy</i>
                                            </button>
                                        </div>
                                    </div>
                                    
                                    <div class="color-field">
                                        <label data-i18n="colorSchemes.outlineButtonText">Outline button text</label>
                                        <div class="shopify-color-input-wrapper">
                                            <input type="color" value="#F0FF2E" class="shopify-color-picker" data-field="contrasting-outline-button-text">
                                            <input type="text" value="#F0FF2E" class="shopify-color-text" data-field="contrasting-outline-button-text">
                                            <button class="shopify-color-copy" data-field="contrasting-outline-button-text">
                                                <i class="material-icons">content_copy</i>
                                            </button>
                                        </div>
                                    </div>
                                    
                                    <div class="color-field">
                                        <label data-i18n="colorSchemes.imageOverlay">Image overlay</label>
                                        <div class="shopify-color-input-wrapper">
                                            <input type="text" value="rgba(0, 0, 0, 0.3)" class="shopify-color-text" data-field="contrasting-image-overlay">
                                            <button class="shopify-color-copy" data-field="contrasting-image-overlay">
                                                <i class="material-icons">content_copy</i>
                                            </button>
                                        </div>
                                    </div>
                                </div>
                                -->
                                
                                <!-- Additional Color Scheme Configuration -->
                                <div class="color-section" style="margin-top: 40px;">
                                    <h4 class="color-section-title" data-i18n="colorSchemes.configuration">Color Scheme Configuration</h4>
                                    
                                    <!-- Scheme Selector -->
                                    <div class="color-field">
                                        <label data-i18n="colorSchemes.selectScheme">Select Scheme to Configure</label>
                                        <select class="shopify-select" id="schemeConfigSelect" style="width: 100%; margin-bottom: 20px;">
                                            <option value="scheme1">Scheme 1</option>
                                            <option value="scheme2">Scheme 2</option>
                                            <option value="scheme3">Scheme 3</option>
                                            <option value="scheme4">Scheme 4</option>
                                            <option value="scheme5">Scheme 5</option>
                                        </select>
                                    </div>
                                    
                                    <!-- Dynamic scheme fields container -->
                                    <div id="scheme-fields-container"></div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                
                <!-- Product cards -->
                <div class="theme-setting-section">
                    <button class="theme-section-header" data-section="product-cards">
                        <span data-i18n="themeSettings.productCards">Product cards</span>
                        <i class="material-icons section-chevron">keyboard_arrow_down</i>
                    </button>
                    <div class="theme-section-content shopify-section-content" style="display: none;">
                        <div class="product-cards-controls">
                            <!-- Main Product Cards Settings -->
                            <div class="settings-field">
                                <label data-i18n="productCards.defaultImageRatio">Default image ratio</label>
                                <select class="shopify-select" id="productCardsImageRatio">
                                    <option value="portrait-large-2-3" data-i18n="productCards.portraitLarge23">Portrait large (2:3) - Fill</option>
                                    <option value="square-1-1" data-i18n="productCards.square11">Square (1:1) - Fill</option>
                                    <option value="portrait-3-4" data-i18n="productCards.portrait34">Portrait (3:4) - Fill</option>
                                    <option value="portrait-large-2-3-fit" data-i18n="productCards.portraitLarge23Fit">Portrait large (2:3) - Fit</option>
                                    <option value="landscape-4-3" data-i18n="productCards.landscape43">Landscape (4:3) - Fill</option>
                                    <option value="square-1-1-fit" data-i18n="productCards.square11Fit">Square (1:1) - Fit</option>
                                    <option value="portrait-3-4-fit" data-i18n="productCards.portrait34Fit">Portrait (3:4) - Fit</option>
                                    <option value="portrait-large-2-3-fit2" data-i18n="productCards.portraitLarge23Fit2">Portrait large (2:3) - Fit</option>
                                    <option value="landscape-4-3-fit" data-i18n="productCards.landscape43Fit">Landscape (4:3) - Fit</option>
                                </select>
                            </div>
                            
                            <div class="settings-field">
                                <label class="checkbox-label">
                                    <span data-i18n="productCards.showVendor">Show vendor</span>
                                    <input type="checkbox" class="shopify-toggle" id="show-vendor-toggle">
                                    <label for="show-vendor-toggle" class="toggle-slider"></label>
                                </label>
                            </div>
                            
                            <div class="settings-field">
                                <label class="checkbox-label">
                                    <span data-i18n="productCards.showCurrencyCode">Show currency code</span>
                                    <input type="checkbox" class="shopify-toggle" id="show-currency-code-toggle">
                                    <label for="show-currency-code-toggle" class="toggle-slider"></label>
                                </label>
                            </div>
                            
                            <div class="settings-field">
                                <label class="checkbox-label">
                                    <span data-i18n="productCards.showColorCount">Show color count</span>
                                    <input type="checkbox" class="shopify-toggle" id="show-color-count-toggle">
                                    <label for="show-color-count-toggle" class="toggle-slider"></label>
                                </label>
                            </div>
                            
                            <div class="settings-field">
                                <label class="checkbox-label">
                                    <span data-i18n="productCards.colorCardBackground">Color card background</span>
                                    <input type="checkbox" class="shopify-toggle" id="color-card-background-toggle">
                                    <label for="color-card-background-toggle" class="toggle-slider"></label>
                                </label>
                            </div>
                            
                            <div class="settings-field">
                                <label class="checkbox-label">
                                    <span data-i18n="productCards.darkenImageBackground">Darken image background</span>
                                    <input type="checkbox" class="shopify-toggle" id="darken-image-background-toggle">
                                    <label for="darken-image-background-toggle" class="toggle-slider"></label>
                                </label>
                            </div>
                            
                            <p class="section-info" style="margin-top: -8px;" data-i18n="productCards.transparentBackgroundInfo">For product images with initially white or transparent background</p>
                            
                            <div class="settings-field">
                                <label data-i18n="productCards.productRating">Product rating</label>
                                <select class="shopify-select" id="productCardsRating">
                                    <option value="none" data-i18n="productCards.none">None</option>
                                    <option value="stars-only" data-i18n="productCards.starsOnly">Stars only</option>
                                    <option value="review-count-only" data-i18n="productCards.reviewCountOnly">Review count only</option>
                                    <option value="average-rating-only" data-i18n="productCards.averageRatingOnly">Average rating only</option>
                                    <option value="review-count-and-stars" data-i18n="productCards.reviewCountAndStars">Review count and stars</option>
                                    <option value="average-rating-and-stars" data-i18n="productCards.averageRatingAndStars">Average rating and stars</option>
                                </select>
                            </div>
                            
                            <p class="section-info" style="margin-top: -8px;" data-i18n="productCards.reviewAppInfo">To show dynamic product rating, add a product review app</p>
                            
                            <div class="settings-field">
                                <label data-i18n="productCards.priceLabelSize">Price label size</label>
                                <select class="shopify-select" id="productCardsPriceSize">
                                    <option value="extra-small" data-i18n="productCards.extraSmall">Extra small</option>
                                    <option value="small" data-i18n="productCards.small">Small</option>
                                    <option value="medium" data-i18n="productCards.medium">Medium</option>
                                    <option value="large" data-i18n="productCards.large">Large</option>
                                </select>
                            </div>
                            
                            <div class="settings-field">
                                <label data-i18n="productCards.imageHoverEffect">Image hover effect</label>
                                <select class="shopify-select" id="productCardsHoverEffect">
                                    <option value="zoom" data-i18n="productCards.zoom">Zoom</option>
                                    <option value="none" data-i18n="productCards.none">None</option>
                                    <option value="show-all-media" data-i18n="productCards.showAllMedia">Show all media</option>
                                    <option value="show-second-media" data-i18n="productCards.showSecondMedia">Show second media</option>
                                </select>
                            </div>
                            
                            <!-- Swatches Section -->
                            <div class="subsection-divider" style="margin: 32px 0;">
                                <h4 class="subsection-title" data-i18n="productCards.swatches">Swatches</h4>
                            </div>
                            
                            <p class="section-info" data-i18n="productCards.swatchesInfo">Adjust the view of swatches in Theme settings>Swatches</p>
                            
                            <div class="settings-field">
                                <label data-i18n="productCards.whatToShow">What to show</label>
                                <select class="shopify-select" id="productCardsSwatchesShow">
                                    <option value="variant-images" data-i18n="productCards.variantImages">Variant images</option>
                                    <option value="color-swatches" data-i18n="productCards.colorSwatches">Color swatches</option>
                                    <option value="both" data-i18n="productCards.both">Both</option>
                                </select>
                            </div>
                            
                            <div class="settings-field">
                                <label data-i18n="productCards.showOnDesktop">Show on desktop</label>
                                <select class="shopify-select" id="productCardsSwatchesDesktop">
                                    <option value="on-hover" data-i18n="productCards.onHover">On hover</option>
                                    <option value="always" data-i18n="productCards.always">Always</option>
                                    <option value="never" data-i18n="productCards.never">Never</option>
                                </select>
                            </div>
                            
                            <div class="settings-field">
                                <label data-i18n="productCards.showOnMobile">Show on mobile</label>
                                <div class="radio-button-group">
                                    <label class="radio-label">
                                        <input type="radio" name="show-on-mobile" value="never" checked>
                                        <span data-i18n="productCards.never">Never</span>
                                    </label>
                                    <label class="radio-label">
                                        <input type="radio" name="show-on-mobile" value="always">
                                        <span data-i18n="productCards.always">Always</span>
                                    </label>
                                </div>
                            </div>
                            
                            <div class="settings-field">
                                <label class="checkbox-label">
                                    <span data-i18n="productCards.hideForSingleValue">Hide for single-value products</span>
                                    <input type="checkbox" class="shopify-toggle" id="hide-single-value-toggle">
                                    <label for="hide-single-value-toggle" class="toggle-slider"></label>
                                </label>
                            </div>
                            
                            <!-- Quick buy buttons -->
                            <div class="subsection-title" style="margin-top: 24px; margin-bottom: 16px;" data-i18n="productCards.quickBuyButtons">Quick buy buttons</div>
                            
                            <div class="settings-field">
                                <label class="checkbox-label">
                                    <span data-i18n="productCards.showQuickView">Show 'Quick view'</span>
                                    <input type="checkbox" class="shopify-toggle" id="show-quick-view-toggle">
                                    <label for="show-quick-view-toggle" class="toggle-slider"></label>
                                </label>
                            </div>
                            
                            <div class="settings-field">
                                <label class="checkbox-label">
                                    <span data-i18n="productCards.showAddToCart">Show 'Add to cart'</span>
                                    <input type="checkbox" class="shopify-toggle" id="show-add-to-cart-toggle">
                                    <label for="show-add-to-cart-toggle" class="toggle-slider"></label>
                                </label>
                            </div>
                            
                            <p class="section-info" style="margin-top: -8px;" data-i18n="productCards.singleVariantInfo">Only for single-variant products</p>
                            
                            <div class="settings-field">
                                <label data-i18n="productCards.desktopButtonStyle">Desktop button style</label>
                                <div class="radio-button-group">
                                    <label class="radio-label">
                                        <input type="radio" name="desktop-button-style" value="labels" checked>
                                        <span data-i18n="productCards.labels">Labels</span>
                                    </label>
                                    <label class="radio-label">
                                        <input type="radio" name="desktop-button-style" value="icons">
                                        <span data-i18n="productCards.icons">Icons</span>
                                    </label>
                                </div>
                            </div>
                            
                            <div class="settings-field">
                                <label class="checkbox-label">
                                    <span data-i18n="productCards.showButtonsOnHover">Show buttons on hover</span>
                                    <input type="checkbox" class="shopify-toggle" id="show-buttons-on-hover-toggle">
                                    <label for="show-buttons-on-hover-toggle" class="toggle-slider"></label>
                                </label>
                            </div>
                            
                            <!-- Product badges Section -->
                            <div class="subsection-divider" style="margin: 32px 0;">
                                <h4 class="subsection-title" data-i18n="productCards.productBadges">Product badges</h4>
                            </div>
                            
                            <p class="section-info" data-i18n="productCards.badgesInfo">Adjust the view and colors for badges in Theme settings>Product badges</p>
                            
                            <div class="settings-field">
                                <label data-i18n="productCards.badgesDesktopPosition">Desktop position</label>
                                <select class="shopify-select" id="productCardsBadgesDesktop">
                                    <option value="on-image" data-i18n="productCards.badgesOnImage">On image</option>
                                    <option value="below-image" data-i18n="productCards.badgesBelowImage">Below image</option>
                                    <option value="above-title" data-i18n="productCards.badgesAboveTitle">Above title</option>
                                </select>
                            </div>
                            
                            <div class="settings-field">
                                <label class="checkbox-label">
                                    <span data-i18n="productCards.showSoldOutBadge">Show 'Sold out' badge</span>
                                    <input type="checkbox" class="shopify-toggle" id="pc-show-sold-out-badge-toggle">
                                    <label for="pc-show-sold-out-badge-toggle" class="toggle-slider"></label>
                                </label>
                            </div>
                            
                            <div class="settings-field">
                                <label class="checkbox-label">
                                    <span data-i18n="productCards.showSaleBadge">Show 'Sale' badge</span>
                                    <input type="checkbox" class="shopify-toggle" id="pc-show-sale-badge-toggle">
                                    <label for="pc-show-sale-badge-toggle" class="toggle-slider"></label>
                                </label>
                            </div>
                            
                            <div class="settings-field">
                                <label class="checkbox-label">
                                    <span data-i18n="productCards.showSaleBadgeNextToPrice">Show 'Sale' badge next to price</span>
                                    <input type="checkbox" class="shopify-toggle" id="pc-show-sale-badge-next-to-price-toggle">
                                    <label for="pc-show-sale-badge-next-to-price-toggle" class="toggle-slider"></label>
                                </label>
                            </div>
                            
                            <div class="settings-field">
                                <label class="checkbox-label">
                                    <span data-i18n="productCards.highlightSalePrice">Highlight sale price</span>
                                    <input type="checkbox" class="shopify-toggle" id="pc-highlight-sale-price-toggle">
                                    <label for="pc-highlight-sale-price-toggle" class="toggle-slider"></label>
                                </label>
                            </div>
                            
                            <div class="settings-field">
                                <label class="checkbox-label">
                                    <span data-i18n="productCards.showCustom1Badge">Show 'Custom 1' badge</span>
                                    <input type="checkbox" class="shopify-toggle" id="pc-show-custom-1-badge-toggle">
                                    <label for="pc-show-custom-1-badge-toggle" class="toggle-slider"></label>
                                </label>
                            </div>
                            
                            <div class="settings-field">
                                <label class="checkbox-label">
                                    <span data-i18n="productCards.showCustom2Badge">Show 'Custom 2' badge</span>
                                    <input type="checkbox" class="shopify-toggle" id="pc-show-custom-2-badge-toggle">
                                    <label for="pc-show-custom-2-badge-toggle" class="toggle-slider"></label>
                                </label>
                            </div>
                            
                            <div class="settings-field">
                                <label class="checkbox-label">
                                    <span data-i18n="productCards.showCustom3Badge">Show 'Custom 3' badge</span>
                                    <input type="checkbox" class="shopify-toggle" id="pc-show-custom-3-badge-toggle">
                                    <label for="pc-show-custom-3-badge-toggle" class="toggle-slider"></label>
                                </label>
                            </div>
                        </div>
                    </div>
                </div>
                
                <!-- Product badges -->
                <div class="theme-setting-section">
                    <button class="theme-section-header" data-section="product-badges">
                        <span data-i18n="themeSettings.productBadges">Product badges</span>
                        <i class="material-icons section-chevron">keyboard_arrow_down</i>
                    </button>
                    <div class="theme-section-content shopify-section-content" style="display: none;">
                        <div class="product-badges-controls">
                            <p class="section-info" data-i18n="productBadges.adjustInfo">Adjust the view and colors for badges. You can turn them on in the 'blocks' block on the product page or in Theme settings>Product cards</p>
                            
                            <!-- Sold out badge -->
                            <div class="badge-section">
                                <h4 class="badge-section-title" data-i18n="productBadges.soldOutBadge">'Sold out' badge</h4>
                                
                                <div class="settings-field">
                                    <label data-i18n="productBadges.background">Background</label>
                                    <div class="shopify-color-input-wrapper">
                                        <input type="color" value="#FFEDF5" class="shopify-color-picker" id="sold-out-bg-color">
                                        <input type="text" value="#FFEDF5" class="shopify-color-text" data-color-for="sold-out-bg-color">
                                        <button class="shopify-color-copy">
                                            <i class="material-icons">content_copy</i>
                                        </button>
                                    </div>
                                </div>
                                
                                <div class="settings-field">
                                    <label data-i18n="productBadges.text">Text</label>
                                    <div class="shopify-color-input-wrapper">
                                        <input type="color" value="#000000" class="shopify-color-picker" id="sold-out-text-color">
                                        <input type="text" value="#000000" class="shopify-color-text" data-color-for="sold-out-text-color">
                                        <button class="shopify-color-copy">
                                            <i class="material-icons">content_copy</i>
                                        </button>
                                    </div>
                                </div>
                            </div>
                            
                            <!-- Sale badge -->
                            <div class="badge-section">
                                <h4 class="badge-section-title" data-i18n="productBadges.saleBadge">'Sale' badge</h4>
                                
                                <div class="settings-field">
                                    <label data-i18n="productBadges.showAs">Show as</label>
                                    <select class="shopify-select" id="sale-badge-show-as">
                                        <option value="sale" data-i18n="productBadges.sale">Sale</option>
                                        <option value="percentage" data-i18n="productBadges.percentageOff">-10%</option>
                                        <option value="value" data-i18n="productBadges.valueOff">-$10</option>
                                    </select>
                                </div>
                                
                                <div class="settings-field">
                                    <label data-i18n="productBadges.background">Background</label>
                                    <div class="shopify-color-input-wrapper">
                                        <input type="color" value="#473C63" class="shopify-color-picker" id="sale-bg-color">
                                        <input type="text" value="#473C63" class="shopify-color-text" data-color-for="sale-bg-color">
                                        <button class="shopify-color-copy">
                                            <i class="material-icons">content_copy</i>
                                        </button>
                                    </div>
                                </div>
                                
                                <div class="settings-field">
                                    <label data-i18n="productBadges.text">Text</label>
                                    <div class="shopify-color-input-wrapper">
                                        <input type="color" value="#FFFFFF" class="shopify-color-picker" id="sale-text-color">
                                        <input type="text" value="#FFFFFF" class="shopify-color-text" data-color-for="sale-text-color">
                                        <button class="shopify-color-copy">
                                            <i class="material-icons">content_copy</i>
                                        </button>
                                    </div>
                                </div>
                            </div>
                            
                            <!-- Sale badge next to price -->
                            <div class="badge-section">
                                <h4 class="badge-section-title" data-i18n="productBadges.saleBadgeNextToPrice">'Sale' badge next to price</h4>
                                
                                <div class="settings-field">
                                    <label data-i18n="productBadges.showAs">Show as</label>
                                    <select class="shopify-select" id="sale-price-badge-show-as">
                                        <option value="-10%" data-i18n="productBadges.percentageOff">-10%</option>
                                        <option value="sale" data-i18n="productBadges.sale">Sale</option>
                                        <option value="-$10" data-i18n="productBadges.valueOff">-$10</option>
                                    </select>
                                </div>
                                
                                <div class="settings-field">
                                    <label data-i18n="productBadges.background">Background</label>
                                    <div class="shopify-color-input-wrapper">
                                        <input type="color" value="#DB0007" class="shopify-color-picker" id="sale-price-bg-color">
                                        <input type="text" value="#DB0007" class="shopify-color-text" data-color-for="sale-price-bg-color">
                                        <button class="shopify-color-copy">
                                            <i class="material-icons">content_copy</i>
                                        </button>
                                    </div>
                                </div>
                                
                                <div class="settings-field">
                                    <label data-i18n="productBadges.text">Text</label>
                                    <div class="shopify-color-input-wrapper">
                                        <input type="color" value="#FFFFFF" class="shopify-color-picker" id="sale-price-text-color">
                                        <input type="text" value="#FFFFFF" class="shopify-color-text" data-color-for="sale-price-text-color">
                                        <button class="shopify-color-copy">
                                            <i class="material-icons">content_copy</i>
                                        </button>
                                    </div>
                                </div>
                            </div>
                            
                            <!-- Sale price highlight -->
                            <div class="badge-section">
                                <h4 class="badge-section-title" data-i18n="productBadges.salePriceHighlight">Sale price highlight</h4>
                                
                                <div class="settings-field">
                                    <label data-i18n="productBadges.text">Text</label>
                                    <div class="shopify-color-input-wrapper">
                                        <input type="color" value="#000000" class="shopify-color-picker" id="sale-highlight-text-color">
                                        <input type="text" value="#000000" class="shopify-color-text" data-color-for="sale-highlight-text-color">
                                        <button class="shopify-color-copy">
                                            <i class="material-icons">content_copy</i>
                                        </button>
                                    </div>
                                </div>
                            </div>
                            
                            <!-- Custom 1 badge -->
                            <div class="badge-section">
                                <h4 class="badge-section-title" data-i18n="productBadges.custom1Badge">'Custom 1' badge</h4>
                                
                                <p class="section-info" style="margin-bottom: 16px;" data-i18n="productBadges.customBadgeInfo">Create your own badges by linking them to product tags</p>
                                
                                <div class="settings-field">
                                    <label data-i18n="productBadges.text">Text</label>
                                    <input type="text" class="shopify-input" id="custom1-badge-text" placeholder="Best seller" data-i18n-placeholder="productBadges.textPlaceholder" value="Best seller">
                                </div>
                                
                                <div class="settings-field">
                                    <label data-i18n="productBadges.tag">Tag</label>
                                    <input type="text" class="shopify-input" id="custom1-badge-tag" placeholder="Best Sellers" data-i18n-placeholder="productBadges.tagPlaceholder" value="Best Sellers">
                                </div>
                                
                                <div class="settings-field">
                                    <label data-i18n="productBadges.background">Background</label>
                                    <div class="shopify-color-input-wrapper">
                                        <input type="color" value="#FFEDF5" class="shopify-color-picker" id="custom1-bg-color">
                                        <input type="text" value="#FFEDF5" class="shopify-color-text" data-color-for="custom1-bg-color">
                                        <button class="shopify-color-copy">
                                            <i class="material-icons">content_copy</i>
                                        </button>
                                    </div>
                                </div>
                                
                                <div class="settings-field">
                                    <label data-i18n="productBadges.text">Text</label>
                                    <div class="shopify-color-input-wrapper">
                                        <input type="color" value="#000000" class="shopify-color-picker" id="custom1-text-color">
                                        <input type="text" value="#000000" class="shopify-color-text" data-color-for="custom1-text-color">
                                        <button class="shopify-color-copy">
                                            <i class="material-icons">content_copy</i>
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                
                <!-- Cart -->
                <div class="theme-setting-section">
                    <button class="theme-section-header" data-section="cart">
                        <span data-i18n="themeSettings.cart">Cart</span>
                        <i class="material-icons section-chevron">keyboard_arrow_down</i>
                    </button>
                    <div class="theme-section-content shopify-section-content" style="display: none;">
                        <div class="cart-controls">
                            <div class="settings-field">
                                <label data-i18n="cart.showAs">Show as</label>
                                <select class="shopify-select" id="cart-show-as">
                                    <option value="drawer-and-page" data-i18n="cart.drawerAndPage">Drawer and page</option>
                                    <option value="drawer-only" data-i18n="cart.drawerOnly">Drawer only</option>
                                    <option value="page-only" data-i18n="cart.pageOnly">Page only</option>
                                </select>
                            </div>
                            
                            <div class="settings-field">
                                <label class="checkbox-label">
                                    <span data-i18n="cart.showStickyCart">Show sticky cart</span>
                                    <input type="checkbox" class="shopify-toggle" id="show-sticky-cart-toggle">
                                    <label for="show-sticky-cart-toggle" class="toggle-slider"></label>
                                </label>
                            </div>
                            
                            <!-- Cart status colors -->
                            <div class="cart-section">
                                <h4 class="cart-section-title" data-i18n="cart.cartStatusColors">Cart status colors</h4>
                                
                                <div class="settings-field">
                                    <label data-i18n="cart.background">Background</label>
                                    <div class="shopify-color-input-wrapper">
                                        <input type="color" value="#F0FF2E" class="shopify-color-picker" id="cart-status-bg-color">
                                        <input type="text" value="#F0FF2E" class="shopify-color-text" data-color-for="cart-status-bg-color">
                                        <button class="shopify-color-copy">
                                            <i class="material-icons">content_copy</i>
                                        </button>
                                    </div>
                                </div>
                                
                                <div class="settings-field">
                                    <label data-i18n="cart.text">Text</label>
                                    <div class="shopify-color-input-wrapper">
                                        <input type="color" value="#3B3933" class="shopify-color-picker" id="cart-status-text-color">
                                        <input type="text" value="#3B3933" class="shopify-color-text" data-color-for="cart-status-text-color">
                                        <button class="shopify-color-copy">
                                            <i class="material-icons">content_copy</i>
                                        </button>
                                    </div>
                                </div>
                            </div>
                            
                            <!-- Free shipping bar -->
                            <div class="cart-section">
                                <h4 class="cart-section-title" data-i18n="cart.freeShippingBar">Free shipping bar</h4>
                                
                                <div class="settings-field">
                                    <label class="checkbox-label">
                                        <span data-i18n="cart.showProgressBar">Show progress bar</span>
                                        <input type="checkbox" class="shopify-toggle" id="show-progress-bar-toggle">
                                        <label for="show-progress-bar-toggle" class="toggle-slider"></label>
                                    </label>
                                </div>
                                
                                <div class="settings-field">
                                    <label data-i18n="cart.freeShippingThreshold">Free shipping threshold</label>
                                    <input type="number" class="shopify-input" id="free-shipping-threshold" placeholder="0" value="0" min="0">
                                    <p class="shopify-description" data-i18n="cart.thresholdDescription">
                                        Fill in the value in your store's main currency. Set up your 
                                        <a href="#" data-i18n="cart.shippingRate">shipping rate</a> or 
                                        <a href="#" data-i18n="cart.automaticFreeShipping">automatic free shipping discount</a> 
                                        to match the goal.
                                    </p>
                                </div>
                                
                                <div class="settings-field">
                                    <label data-i18n="cart.progressBar">Progress bar</label>
                                    <div class="shopify-color-input-wrapper">
                                        <input type="color" value="#3B3933" class="shopify-color-picker" id="progress-bar-color">
                                        <input type="text" value="#3B3933" class="shopify-color-text" data-color-for="progress-bar-color">
                                        <button class="shopify-color-copy">
                                            <i class="material-icons">content_copy</i>
                                        </button>
                                    </div>
                                </div>
                                
                                <div class="settings-field">
                                    <label data-i18n="cart.progressBarTrack">Progress bar track</label>
                                    <select class="shopify-select" id="progress-bar-track">
                                        <option value="degradado-in" data-i18n="cart.degradadoIn">Degradado In...</option>
                                        <option value="solid" data-i18n="cart.solid">Solid</option>
                                        <option value="gradient" data-i18n="cart.gradient">Gradient</option>
                                    </select>
                                </div>
                                
                                <div class="settings-field">
                                    <label data-i18n="cart.message">Message</label>
                                    <div class="shopify-color-input-wrapper">
                                        <input type="color" value="#3B3933" class="shopify-color-picker" id="message-color">
                                        <input type="text" value="#3B3933" class="shopify-color-text" data-color-for="message-color">
                                        <button class="shopify-color-copy">
                                            <i class="material-icons">content_copy</i>
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                
                <!-- Favicon -->
                <div class="theme-setting-section">
                    <button class="theme-section-header" data-section="favicon">
                        <span data-i18n="themeSettings.favicon">Favicon</span>
                        <i class="material-icons section-chevron">keyboard_arrow_down</i>
                    </button>
                    <div class="theme-section-content shopify-section-content" style="display: none;">
                        <div class="favicon-controls">
                            <p class="section-info" data-i18n="favicon.description">Favicons are small icons that appear in browser tabs.</p>
                            
                            <div class="image-upload-container">
                                <div class="image-preview" id="favicon-preview">
                                    <span class="no-image-text" data-i18n="favicon.noImageSelected">No image selected</span>
                                </div>
                                <input type="file" id="favicon-upload" accept="image/*" style="display: none;">
                                <button class="shopify-button" id="favicon-select-btn" data-i18n="favicon.selectImage">Select image</button>
                                <button class="shopify-button" id="favicon-remove-btn" style="display: none;" data-i18n="favicon.removeImage">Remove image</button>
                            </div>
                        </div>
                    </div>
                </div>
                
                <!-- Navigation -->
                <div class="theme-setting-section">
                    <button class="theme-section-header" data-section="navigation">
                        <span data-i18n="themeSettings.navigation">Navigation</span>
                        <i class="material-icons section-chevron">keyboard_arrow_down</i>
                    </button>
                    <div class="theme-section-content shopify-section-content" style="display: none;">
                        <div class="navigation-controls">
                            <!-- Search Section -->
                            <div class="navigation-section">
                                <h4 class="navigation-section-title" data-i18n="navigation.search">Search</h4>
                                
                                <div class="settings-field">
                                    <label data-i18n="navigation.showAs">Show as</label>
                                    <select class="shopify-select" id="search-show-as">
                                        <option value="drawer-and-page" data-i18n="navigation.drawerAndPage">Drawer and page</option>
                                        <option value="drawer-only" data-i18n="navigation.drawerOnly">Drawer only</option>
                                        <option value="page-only" data-i18n="navigation.pageOnly">Page only</option>
                                        <option value="none" data-i18n="navigation.none">None</option>
                                    </select>
                                </div>
                            </div>
                            
                            <!-- Back-to-top Section -->
                            <div class="navigation-section">
                                <h4 class="navigation-section-title" data-i18n="navigation.backToTop">Back-to-top</h4>
                                
                                <div class="settings-field">
                                    <label class="checkbox-label">
                                        <span data-i18n="navigation.showBackToTopButton">Show back-to-top button</span>
                                        <input type="checkbox" class="shopify-toggle" id="show-back-to-top-toggle">
                                        <label for="show-back-to-top-toggle" class="toggle-slider"></label>
                                    </label>
                                </div>
                                
                                <div class="settings-field">
                                    <label data-i18n="navigation.buttonPosition">Button position</label>
                                    <select class="shopify-select" id="back-to-top-position">
                                        <option value="bottom-left" data-i18n="navigation.bottomLeft">Bottom left</option>
                                        <option value="bottom-center" data-i18n="navigation.bottomCenter">Bottom center</option>
                                        <option value="bottom-right" data-i18n="navigation.bottomRight">Bottom right</option>
                                    </select>
                                    <p class="section-info" style="margin-top: 8px;" data-i18n="navigation.alwaysBottomLeftOnMobile">Always 'Bottom left' on mobile</p>
                                </div>
                            </div>
                            
                            <!-- Social media Section -->
                            <div class="navigation-section">
                                <h4 class="navigation-section-title" data-i18n="navigation.socialMedia">Social media</h4>
                                
                                <div class="settings-field">
                                    <label data-i18n="navigation.socialAccounts">Social accounts</label>
                                    <p class="section-info" data-i18n="navigation.socialAccountsInfo">To display your social media accounts, link them in your theme settings.</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                
                <!-- Social media -->
                <div class="theme-setting-section">
                    <button class="theme-section-header" data-section="social-media">
                        <span data-i18n="themeSettings.socialMedia">Social media</span>
                        <i class="material-icons section-chevron">keyboard_arrow_down</i>
                    </button>
                    <div class="theme-section-content shopify-section-content" style="display: none;">
                        <div class="social-media-controls">
                            <div class="settings-field">
                                <label data-i18n="socialMedia.iconStyle">Icon style</label>
                                <div class="radio-button-group">
                                    <label class="radio-label">
                                        <input type="radio" name="icon-style" value="solid" checked>
                                        <span data-i18n="socialMedia.solid">Solid</span>
                                    </label>
                                    <label class="radio-label">
                                        <input type="radio" name="icon-style" value="outline">
                                        <span data-i18n="socialMedia.outline">Outline</span>
                                    </label>
                                </div>
                            </div>
                            
                            <!-- Instagram -->
                            <div class="social-platform-section">
                                <label data-i18n="socialMedia.instagram">Instagram</label>
                                <input type="text" class="shopify-input" id="social-instagram" placeholder="http://instagram.com" data-i18n-placeholder="socialMedia.instagramPlaceholder">
                                <p class="social-help-text" data-i18n="socialMedia.instagramHelp">http://instagram.com/shopify</p>
                            </div>
                            
                            <!-- Facebook -->
                            <div class="social-platform-section">
                                <label data-i18n="socialMedia.facebook">Facebook</label>
                                <input type="text" class="shopify-input" id="social-facebook" placeholder="https://facebook.com" data-i18n-placeholder="socialMedia.facebookPlaceholder">
                                <p class="social-help-text" data-i18n="socialMedia.facebookHelp">https://facebook.com/shopify</p>
                            </div>
                            
                            <!-- Twitter -->
                            <div class="social-platform-section">
                                <label data-i18n="socialMedia.twitter">Twitter</label>
                                <input type="text" class="shopify-input" id="social-twitter" placeholder="https://twitter.com/" data-i18n-placeholder="socialMedia.twitterPlaceholder">
                                <p class="social-help-text" data-i18n="socialMedia.twitterHelp">https://twitter.com/shopify</p>
                            </div>
                            
                            <!-- YouTube -->
                            <div class="social-platform-section">
                                <label data-i18n="socialMedia.youtube">YouTube</label>
                                <input type="text" class="shopify-input" id="social-youtube" placeholder="" data-i18n-placeholder="socialMedia.youtubePlaceholder">
                                <p class="social-help-text" data-i18n="socialMedia.youtubeHelp">https://www.youtube.com/shopify</p>
                            </div>
                            
                            <!-- Pinterest -->
                            <div class="social-platform-section">
                                <label data-i18n="socialMedia.pinterest">Pinterest</label>
                                <input type="text" class="shopify-input" id="social-pinterest" placeholder="https://pinterest.com" data-i18n-placeholder="socialMedia.pinterestPlaceholder">
                                <p class="social-help-text" data-i18n="socialMedia.pinterestHelp">https://pinterest.com/shopify</p>
                            </div>
                            
                            <!-- TikTok -->
                            <div class="social-platform-section">
                                <label data-i18n="socialMedia.tiktok">TikTok</label>
                                <input type="text" class="shopify-input" id="social-tiktok" placeholder="" data-i18n-placeholder="socialMedia.tiktokPlaceholder">
                                <p class="social-help-text" data-i18n="socialMedia.tiktokHelp">https://tiktok.com/@shopify</p>
                            </div>
                            
                            <!-- Tumblr -->
                            <div class="social-platform-section">
                                <label data-i18n="socialMedia.tumblr">Tumblr</label>
                                <input type="text" class="shopify-input" id="social-tumblr" placeholder="" data-i18n-placeholder="socialMedia.tumblrPlaceholder">
                                <p class="social-help-text" data-i18n="socialMedia.tumblrHelp">https://shopify.tumblr.com</p>
                            </div>
                            
                            <!-- Snapchat -->
                            <div class="social-platform-section">
                                <label data-i18n="socialMedia.snapchat">Snapchat</label>
                                <input type="text" class="shopify-input" id="social-snapchat" placeholder="" data-i18n-placeholder="socialMedia.snapchatPlaceholder">
                                <p class="social-help-text" data-i18n="socialMedia.snapchatHelp">https://www.snapchat.com/add/shopify</p>
                            </div>
                            
                            <!-- LinkedIn -->
                            <div class="social-platform-section">
                                <label data-i18n="socialMedia.linkedin">LinkedIn</label>
                                <input type="text" class="shopify-input" id="social-linkedin" placeholder="" data-i18n-placeholder="socialMedia.linkedinPlaceholder">
                                <p class="social-help-text" data-i18n="socialMedia.linkedinHelp">https://www.linkedin.com/company/shopify</p>
                            </div>
                            
                            <!-- Vimeo -->
                            <div class="social-platform-section">
                                <label data-i18n="socialMedia.vimeo">Vimeo</label>
                                <input type="text" class="shopify-input" id="social-vimeo" placeholder="" data-i18n-placeholder="socialMedia.vimeoPlaceholder">
                                <p class="social-help-text" data-i18n="socialMedia.vimeoHelp">https://vimeo.com/shopify</p>
                            </div>
                            
                            <!-- Flickr -->
                            <div class="social-platform-section">
                                <label data-i18n="socialMedia.flickr">Flickr</label>
                                <input type="text" class="shopify-input" placeholder="" data-i18n-placeholder="socialMedia.flickrPlaceholder">
                                <p class="social-help-text" data-i18n="socialMedia.flickrHelp">https://www.flickr.com/photos/shopify</p>
                            </div>
                            
                            <!-- Reddit -->
                            <div class="social-platform-section">
                                <label data-i18n="socialMedia.reddit">Reddit</label>
                                <input type="text" class="shopify-input" placeholder="" data-i18n-placeholder="socialMedia.redditPlaceholder">
                                <p class="social-help-text" data-i18n="socialMedia.redditHelp">https://www.reddit.com/user/shopify</p>
                            </div>
                            
                            <!-- Email -->
                            <div class="social-platform-section">
                                <label data-i18n="socialMedia.email">Email</label>
                                <input type="text" class="shopify-input" placeholder="" data-i18n-placeholder="socialMedia.emailPlaceholder">
                                <p class="social-help-text" data-i18n="socialMedia.emailHelp">mailto:contact@shopify.com</p>
                            </div>
                            
                            <!-- Behance -->
                            <div class="social-platform-section">
                                <label data-i18n="socialMedia.behance">Behance</label>
                                <input type="text" class="shopify-input" placeholder="" data-i18n-placeholder="socialMedia.behancePlaceholder">
                                <p class="social-help-text" data-i18n="socialMedia.behanceHelp">https://www.behance.net/shopify</p>
                            </div>
                            
                            <!-- Discord -->
                            <div class="social-platform-section">
                                <label data-i18n="socialMedia.discord">Discord</label>
                                <input type="text" class="shopify-input" placeholder="" data-i18n-placeholder="socialMedia.discordPlaceholder">
                                <p class="social-help-text" data-i18n="socialMedia.discordHelp">https://discordapp.com/users/shopify</p>
                            </div>
                            
                            <!-- Dribbble -->
                            <div class="social-platform-section">
                                <label data-i18n="socialMedia.dribbble">Dribbble</label>
                                <input type="text" class="shopify-input" placeholder="" data-i18n-placeholder="socialMedia.dribbblePlaceholder">
                                <p class="social-help-text" data-i18n="socialMedia.dribbbleHelp">https://dribbble.com</p>
                            </div>
                            
                            <!-- Medium -->
                            <div class="social-platform-section">
                                <label data-i18n="socialMedia.medium">Medium</label>
                                <input type="text" class="shopify-input" placeholder="" data-i18n-placeholder="socialMedia.mediumPlaceholder">
                                <p class="social-help-text" data-i18n="socialMedia.mediumHelp">https://medium.com/@shopify</p>
                            </div>
                            
                            <!-- Twitch -->
                            <div class="social-platform-section">
                                <label data-i18n="socialMedia.twitch">Twitch</label>
                                <input type="text" class="shopify-input" placeholder="" data-i18n-placeholder="socialMedia.twitchPlaceholder">
                                <p class="social-help-text" data-i18n="socialMedia.twitchHelp">https://twitch.tv/shopify</p>
                            </div>
                            
                            <!-- WhatsApp -->
                            <div class="social-platform-section">
                                <label data-i18n="socialMedia.whatsapp">WhatsApp</label>
                                <input type="text" class="shopify-input" placeholder="" data-i18n-placeholder="socialMedia.whatsappPlaceholder">
                                <p class="social-help-text" data-i18n="socialMedia.whatsappHelp">https://wa.me/phone_number</p>
                            </div>
                            
                            <!-- Viber -->
                            <div class="social-platform-section">
                                <label data-i18n="socialMedia.viber">Viber</label>
                                <input type="text" class="shopify-input" placeholder="" data-i18n-placeholder="socialMedia.viberPlaceholder">
                                <p class="social-help-text" data-i18n="socialMedia.viberHelp">viber://add?number=XXXXXXXXX</p>
                            </div>
                            
                            <!-- Telegram -->
                            <div class="social-platform-section">
                                <label data-i18n="socialMedia.telegram">Telegram</label>
                                <input type="text" class="shopify-input" placeholder="" data-i18n-placeholder="socialMedia.telegramPlaceholder">
                                <p class="social-help-text" data-i18n="socialMedia.telegramHelp">https://t.me/username</p>
                            </div>
                        </div>
                    </div>
                </div>
                
                <!-- Swatches -->
                <div class="theme-setting-section">
                    <button class="theme-section-header" data-section="swatches">
                        <span data-i18n="themeSettings.swatches">Swatches</span>
                        <i class="material-icons section-chevron">keyboard_arrow_down</i>
                    </button>
                    <div class="theme-section-content" style="display: none;">
                        <div class="theme-section-body" style="padding: 16px;">
                            <!-- Learn about swatches link -->
                            <p style="font-size: 13px; color: #333; margin-bottom: 16px;">
                                <span data-i18n="swatches.learnAbout">Learn about</span> 
                                <a href="#" style="color: #0066cc; text-decoration: underline;" data-i18n="swatches.title">swatches</a>
                            </p>
                            
                            <!-- Primary swatch option section -->
                            <div class="primary-swatch-section" style="background: #f4f4f4; padding: 16px; border-radius: 8px; margin-bottom: 20px;">
                                <h4 style="font-size: 14px; font-weight: 600; margin-bottom: 8px;" data-i18n="swatches.primarySwatchOption">Primary swatch option</h4>
                                <p style="font-size: 13px; color: #6d7175; margin-bottom: 16px;" data-i18n="swatches.showSwatchesInfo">Show swatches in product cards, product pages, and filters</p>
                                
                                <!-- Option name input -->
                                <div style="margin-bottom: 16px;">
                                    <label style="display: block; font-size: 13px; font-weight: 500; margin-bottom: 4px;" data-i18n="swatches.optionName">Option name</label>
                                    <input type="text" class="shopify-input" value="Color" placeholder="Color" data-i18n-placeholder="swatches.optionNamePlaceholder" id="swatchesPrimaryOptionName">
                                    <p style="font-size: 12px; color: #6d7175; margin-top: 4px;" data-i18n="swatches.optionNameHelp">Fill in the relevant option names from your admin to turn on swatches</p>
                                </div>
                                
                                <!-- Shape for product cards -->
                                <div style="margin-bottom: 12px;">
                                    <label style="display: block; font-size: 13px; font-weight: 500; margin-bottom: 8px;" data-i18n="swatches.shapeForProductCards">Shape for product cards</label>
                                    <select class="shopify-select" id="swatchesPrimaryProductCardsShape" style="width: 100%;">
                                        <option value="portrait" data-i18n="swatches.portrait">Portrait</option>
                                        <option value="landscape" data-i18n="swatches.landscape">Landscape</option>
                                    </select>
                                </div>
                                
                                <!-- Size for product cards -->
                                <div style="margin-bottom: 16px;">
                                    <label style="display: flex; justify-content: space-between; align-items: center; font-size: 13px; font-weight: 500; margin-bottom: 8px;">
                                        <span data-i18n="swatches.sizeForProductCards">Size for product cards</span>
                                        <span class="range-value" style="font-weight: normal;">5</span>
                                    </label>
                                    <input type="range" min="3" max="7" value="5" class="shopify-range" data-value-display="product-cards-size" id="swatchesPrimaryProductCardsSize" style="width: 100%;">
                                </div>
                                
                                <!-- Shape for product pages -->
                                <div style="margin-bottom: 12px;">
                                    <label style="display: block; font-size: 13px; font-weight: 500; margin-bottom: 8px;" data-i18n="swatches.shapeForProductPages">Shape for product pages</label>
                                    <select class="shopify-select" id="swatchesPrimaryProductPagesShape" style="width: 100%;">
                                        <option value="landscape" data-i18n="swatches.landscape">Landscape</option>
                                        <option value="portrait" data-i18n="swatches.portrait">Portrait</option>
                                    </select>
                                </div>
                                
                                <!-- Size for product pages -->
                                <div style="margin-bottom: 16px;">
                                    <label style="display: flex; justify-content: space-between; align-items: center; font-size: 13px; font-weight: 500; margin-bottom: 8px;">
                                        <span data-i18n="swatches.sizeForProductPages">Size for product pages</span>
                                        <span class="range-value" style="font-weight: normal;">4</span>
                                    </label>
                                    <input type="range" min="3" max="7" value="4" class="shopify-range range-input" id="swatchesPrimaryProductPagesSize" style="width: 100%;">
                                </div>
                                
                                <!-- Shape for filters -->
                                <div style="margin-bottom: 12px;">
                                    <label style="display: block; font-size: 13px; font-weight: 500; margin-bottom: 8px;" data-i18n="swatches.shapeForFilters">Shape for filters</label>
                                    <select class="shopify-select" id="swatchesPrimaryFiltersShape" style="width: 100%;">
                                        <option value="square" data-i18n="swatches.square" selected>Square</option>
                                        <option value="round" data-i18n="swatches.round">Round</option>
                                        <option value="portrait" data-i18n="swatches.portrait">Portrait</option>
                                        <option value="landscape" data-i18n="swatches.landscape">Landscape</option>
                                    </select>
                                </div>
                                
                                <!-- Size for filters -->
                                <div style="margin-bottom: 16px;">
                                    <label style="display: flex; justify-content: space-between; align-items: center; font-size: 13px; font-weight: 500; margin-bottom: 8px;">
                                        <span data-i18n="swatches.sizeForFilters">Size for filters</span>
                                        <span class="range-value" style="font-weight: normal;">1</span>
                                    </label>
                                    <input type="range" min="1" max="5" value="1" class="shopify-range range-input" id="swatchesPrimaryFiltersSize" style="width: 100%;">
                                </div>
                                
                                <!-- Custom colors and patterns -->
                                <div style="margin-bottom: 16px;">
                                    <label style="display: block; font-size: 13px; font-weight: 500; margin-bottom: 4px;" data-i18n="swatches.customColorsAndPatterns">Custom colors and patterns</label>
                                    <textarea class="shopify-textarea" rows="4" placeholder="Ultramarine::#0043F2&#10;Cherry blossom::#FFB7C5&#10;Sunny day::yellow/green/blue/&#10;Summertime::#F9AFB1/#0F9D5B/#4285F4" id="swatchesPrimaryCustomColors" style="width: 100%; font-family: monospace; font-size: 13px;">Ultramarine::#0043F2
Cherry blossom::#FFB7C5
Sunny day::yellow/green/blue/
Summertime::#F9AFB1/#0F9D5B/#4285F4</textarea>
                                    <p style="font-size: 12px; color: #6d7175; margin-top: 4px;">
                                        <span data-i18n="swatches.customColorsHelp">Place each rule in a separate line.</span>
                                        <a href="#" style="color: #0066cc; text-decoration: underline;" data-i18n="swatches.learnHowToAdd">Learn how to add color swatches</a>
                                    </p>
                                </div>
                            </div>
                            
                            <!-- Secondary swatch options -->
                            <div class="secondary-swatch-section">
                                <h4 style="font-size: 14px; font-weight: 600; margin-bottom: 8px;" data-i18n="swatches.secondarySwatchOptions">Secondary swatch options</h4>
                                <p style="font-size: 13px; color: #6d7175; margin-bottom: 16px;" data-i18n="swatches.showSwatchesForMore">Show swatches for more than one option in product pages and filters</p>
                                
                                <!-- Option names textarea -->
                                <div style="margin-bottom: 16px;">
                                    <label style="display: block; font-size: 13px; font-weight: 500; margin-bottom: 4px;" data-i18n="swatches.optionNames">Option names</label>
                                    <textarea class="shopify-textarea" rows="3" placeholder="Material&#10;Frame" data-i18n-placeholder="swatches.optionNamesPlaceholder" id="swatchesSecondaryOptionNames" style="width: 100%;">Material
Frame</textarea>
                                    <p style="font-size: 12px; color: #6d7175; margin-top: 4px;" data-i18n="swatches.optionNamesHelp">Fill in relevant option names from your admin, place each in a separate line</p>
                                </div>
                                
                                <!-- Shape for product pages -->
                                <div style="margin-bottom: 12px;">
                                    <label style="display: block; font-size: 13px; font-weight: 500; margin-bottom: 8px;" data-i18n="swatches.shapeForProductPages">Shape for product pages</label>
                                    <select class="shopify-select" id="swatchesSecondaryProductPagesShape" style="width: 100%;">
                                        <option value="square" data-i18n="swatches.square" selected>Square</option>
                                        <option value="round" data-i18n="swatches.round">Round</option>
                                    </select>
                                </div>
                                
                                <!-- Size for product pages -->
                                <div style="margin-bottom: 16px;">
                                    <label style="display: flex; justify-content: space-between; align-items: center; font-size: 13px; font-weight: 500; margin-bottom: 8px;">
                                        <span data-i18n="swatches.sizeForProductPages">Size for product pages</span>
                                        <span class="range-value" style="font-weight: normal;">4</span>
                                    </label>
                                    <input type="range" min="3" max="7" value="4" class="shopify-range range-input" id="swatchesSecondaryProductPagesSize" style="width: 100%;">
                                </div>
                                
                                <!-- Shape for filters -->
                                <div style="margin-bottom: 12px;">
                                    <label style="display: block; font-size: 13px; font-weight: 500; margin-bottom: 8px;" data-i18n="swatches.shapeForFilters">Shape for filters</label>
                                    <select class="shopify-select" id="swatchesSecondaryFiltersShape" style="width: 100%;">
                                        <option value="square" data-i18n="swatches.square" selected>Square</option>
                                        <option value="round" data-i18n="swatches.round">Round</option>
                                        <option value="portrait" data-i18n="swatches.portrait">Portrait</option>
                                        <option value="landscape" data-i18n="swatches.landscape">Landscape</option>
                                    </select>
                                </div>
                                
                                <!-- Size for filters -->
                                <div style="margin-bottom: 16px;">
                                    <label style="display: flex; justify-content: space-between; align-items: center; font-size: 13px; font-weight: 500; margin-bottom: 8px;">
                                        <span data-i18n="swatches.sizeForFilters">Size for filters</span>
                                        <span class="range-value" style="font-weight: normal;">1</span>
                                    </label>
                                    <input type="range" min="1" max="5" value="1" class="shopify-range range-input" id="swatchesSecondaryFiltersSize" style="width: 100%;">
                                </div>
                                
                                <!-- Custom colors and patterns -->
                                <div>
                                    <label style="display: block; font-size: 13px; font-weight: 500; margin-bottom: 4px;" data-i18n="swatches.customColorsAndPatterns">Custom colors and patterns</label>
                                    <textarea class="shopify-textarea" rows="4" placeholder="Ultramarine::#0043F2&#10;Cherry blossom::#FFB7C5&#10;Sunny day::yellow/green/blue/&#10;Summertime::#F9AFB1/#0F9D5B/#4285F4" id="swatchesSecondaryCustomColors" style="width: 100%; font-family: monospace; font-size: 13px;">Ultramarine::#0043F2
Cherry blossom::#FFB7C5
Sunny day::yellow/green/blue/
Summertime::#F9AFB1/#0F9D5B/#4285F4</textarea>
                                    <p style="font-size: 12px; color: #6d7175; margin-top: 4px;">
                                        <span data-i18n="swatches.customColorsHelp">Place each rule in a separate line.</span>
                                        <a href="#" style="color: #0066cc; text-decoration: underline;" data-i18n="swatches.learnHowToAdd">Learn how to add color swatches</a>
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                
            </div>
        `;
    }
    
    // Attach event listeners for announcement bar view
    function attachAnnouncementBarEventListenersGeneric() {
        // Back button
        $('.back-to-sections-btn').on('click', function() {
            window.switchSidebarView('blockList', window.getUpdatedPageData());
        });
        
        // Menu dropdown toggle
        $('.section-menu').on('click', function(e) {
            e.stopPropagation();
            const $dropdown = $(this).siblings('.section-menu-dropdown');
            $dropdown.toggleClass('show');
        });
        
        // Close dropdown when clicking outside
        $(document).on('click', function() {
            $('.section-menu-dropdown').removeClass('show');
        });
        
        // Menu item actions
        $('.section-menu-dropdown .menu-item').on('click', function(e) {
            e.preventDefault();
            const action = $(this).data('action');
            console.log('Menu action:', action);
            $('.section-menu-dropdown').removeClass('show');
            
            switch(action) {
                case 'rename':
                    // TODO: Implement rename functionality
                    console.log('Rename announcement bar');
                    break;
                case 'show':
                    // TODO: Navigate to preview
                    console.log('Show announcement bar');
                    break;
                case 'locate':
                    // TODO: Highlight in preview
                    console.log('Locate announcement bar');
                    break;
            }
        });
        
        // Sync range slider with number input
        $('#autoplay-speed').on('input', function() {
            const value = $(this).val();
            $(this).closest('.range-with-inputs').find('.shopify-number-input').val(value);
        });
        
        $('.shopify-number-input').on('input', function() {
            const value = $(this).val();
            $(this).closest('.range-with-inputs').find('#autoplay-speed').val(value);
        });
        
        // Toggle handlers
        $('.shopify-toggle').on('change', function() {
            console.log('Toggle changed:', $(this).attr('id'), $(this).prop('checked'));
        });
        
        // Radio button handlers
        $('input[name="autoplay-mode"]').on('change', function() {
            const isAutoplay = $(this).val() !== 'none';
            $('#autoplay-speed').closest('.settings-field').toggle(isAutoplay);
        });
        
        // Links handlers
        $('.settings-link').on('click', function(e) {
            e.preventDefault();
            console.log('Settings link clicked');
        });
        
    }
    
    // Function to attach event listeners for block list view
    function attachBlockListEventListeners() {
        // Section expand/collapse
        $('.sidebar-section-header').on('click', function() {
            $(this).parent('.sidebar-section').toggleClass('expanded');
        });
        
        // Add section button - both in template and other groups
        $('#add-section-btn, .add-section-button').on('click', function(e) {
            e.stopPropagation();
            const group = $(this).data('group') || 'template';
            openAddSectionModal(group);
        });
        
        // Subsection clicks
        $('.sidebar-subsection').on('click', function(e) {
            // Don't trigger if clicking on action buttons
            if ($(e.target).closest('.subsection-actions').length) {
                return;
            }
            
            // Don't trigger if clicking on collapse indicator
            if ($(e.target).hasClass('collapse-indicator') || $(e.target).closest('.collapse-indicator').length) {
                return;
            }
            
            // Don't trigger if clicking on drag handle
            if ($(e.target).hasClass('drag-handle') || $(e.target).closest('.drag-handle').length) {
                return;
            }
            
            const blockType = $(this).data('block-type');
            console.log('Subsección clickeada:', blockType);
            
            // Handle announcement bar click
            if (blockType === 'announcement') {
                switchSidebarView('announcementBar');
            }
            // Handle header click
            else if (blockType === 'header') {
                switchSidebarView('headerSettings');
            }
            // Handle announcement item click
            else if (blockType === 'announcement-item') {
                const announcementId = $(this).data('announcement-id');
                switchSidebarView('announcementItemSettings', { id: announcementId });
            }
            // TODO: Handle other block types
        });
        
        // Visibility toggle button - COMMENTED OUT TO AVOID DUPLICATE HANDLER
        // This handler is replaced by the unified one below
        
        // Delete button for announcement
        $(document).on('click', '.delete-icon', function(e) {
            e.stopPropagation();
            const section = $(this).data('section');
            if (confirm(`¿Estás seguro de que quieres eliminar la ${section === 'announcement' ? 'barra de anuncios' : 'sección'}?`)) {
                console.log(`Deleting ${section}`);
                // TODO: Actually delete the section
                $(this).closest('.sidebar-subsection').fadeOut(300, function() {
                    $(this).remove();
                    // Activar bandera de cambios pendientes
                    hasPendingPageStructureChanges = true;
                    updateSaveButtonState();
                    console.log('[DEBUG] Page structure changed - element deleted');
                });
            }
        });
        
        // More options button
        $(document).on('click', '.more-options', function(e) {
            e.stopPropagation();
            const section = $(this).data('section');
            console.log(`More options clicked for ${section}`);
            // TODO: Show more options menu
        });
        
        // Footer link
        $('#view-page-link').on('click', function() {
            console.log('Ver página clickeado');
            // TODO: Implement view page
        });
        
        
        // Add block button - for announcement bar from main view
        $('.add-icon[data-section="announcement"]').off('click').on('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            
            console.log('Add announcement clicked');
            
            const $announcementBar = $('.sidebar-subsection[data-element-id="barra-anuncios"]');
            const $headerContent = $('.sidebar-section-content').first();
            
            // Count existing announcements
            const existingAnnouncements = $headerContent.find('.sidebar-subsection[data-block-type="announcement-item"]').length;
            const announcementNumber = existingAnnouncements + 1;
            
            // Create unique ID
            const announcementId = 'anuncio-' + Date.now();
            const announcementText = lang && lang['announcementBar.makeAnnouncement'] || 'Make an announcement';
            const announcementName = `${announcementText} ${announcementNumber}`;
            
            // Create new announcement (same level as announcement bar but indented)
            const newAnnouncement = $(`
                <div class="sidebar-subsection" data-block-type="announcement-item" data-element-id="${announcementId}" style="padding-left: 30px;">
                    <span class="subsection-text">${announcementName}</span>
                    <div class="subsection-actions">
                        <button class="action-icon visibility-toggle" title="Toggle visibility">
                            <i class="material-icons icon-visible">visibility</i>
                            <i class="material-icons icon-hidden">visibility_off</i>
                        </button>
                        <button class="action-icon delete-announcement" data-element-id="${announcementId}" title="Delete">
                            <i class="material-icons">delete</i>
                        </button>
                    </div>
                </div>
            `);
            
            // Find or create the announcement wrapper
            let $announcementWrapper = $('#announcement-items-wrapper');
            if ($announcementWrapper.length === 0) {
                // Create wrapper if it doesn't exist
                $announcementWrapper = $('<div id="announcement-items-wrapper" style="position: relative;"></div>');
                $announcementBar.after($announcementWrapper);
            }
            
            // Insert new announcement at the end of the wrapper
            $announcementWrapper.append(newAnnouncement);
            
            // Add to configuration
            currentSectionsConfig.announcements[announcementId] = {
                text: announcementName,
                link: '',
                icon: 'none',
                customIcon: '',
                isHidden: false  // Default to visible
            };
            
            // Add to order array (ensure it exists first)
            if (!currentSectionsConfig.announcementOrder) {
                currentSectionsConfig.announcementOrder = [];
            }
            currentSectionsConfig.announcementOrder.push(announcementId);
            
            // Activar bandera de cambios pendientes
            hasPendingPageStructureChanges = true;
            updateSaveButtonState();
            console.log('[DEBUG] Page structure changed - new announcement added:', announcementId);
            
            // Reinitialize drag and drop to include new element
            setTimeout(() => {
                initializeDragAndDropSimple();
            }, 100);
        });
        
        
        // Click on announcement bar to configure
        $(document).on('click', '.sidebar-subsection[data-element-id="barra-anuncios"]', function(e) {
            try {
                const $target = $(e.target);
                const isActionButton = $target.closest('.subsection-actions').length > 0;
                const isCollapseIndicator = $target.closest('.collapse-indicator').length > 0;
                
                if (!isActionButton && !isCollapseIndicator) {
                    e.preventDefault();
                    e.stopPropagation();
                    console.log('Navigate to announcement bar config');
                    window.switchSidebarView('announcementBar');
                }
            } catch (error) {
                console.error('[ERROR] Problem with announcement bar click:', error);
            }
        });
        
        // Click on announcement item to edit
        $(document).on('click', '.sidebar-subsection[data-block-type="announcement-item"]', function(e) {
            try {
                const $target = $(e.target);
                const isActionButton = $target.closest('.subsection-actions').length > 0;
                
                if (!isActionButton) {
                    e.preventDefault();
                    e.stopPropagation();
                    const elementId = $(this).data('element-id');
                    console.log('Navigate to announcement config:', elementId);
                    // Navigate to the specific announcement item settings
                    window.switchSidebarView('announcementItemSettings', { id: elementId });
                }
            } catch (error) {
                console.error('[ERROR] Problem with announcement item click:', error);
            }
        });
        
        // Delete announcement item
        $(document).on('click', '.delete-announcement', function(e) {
            e.preventDefault();
            e.stopPropagation();
            e.stopImmediatePropagation(); // Prevenir múltiples disparos del evento
            
            const elementId = $(this).data('element-id');
            const $announcement = $(`.sidebar-subsection[data-element-id="${elementId}"]`);
            
            console.log('[DEBUG] Delete announcement clicked for:', elementId);
            
            if (confirm('¿Estás seguro de que quieres eliminar este anuncio?')) {
                $announcement.remove();
                // Eliminar del objeto de configuración
                delete currentSectionsConfig.announcements[elementId];
                // Eliminar del array de orden si existe
                if (currentSectionsConfig.announcementOrder && Array.isArray(currentSectionsConfig.announcementOrder)) {
                    const orderIndex = currentSectionsConfig.announcementOrder.indexOf(elementId);
                    if (orderIndex > -1) {
                        currentSectionsConfig.announcementOrder.splice(orderIndex, 1);
                    }
                }
                // Activar bandera de cambios pendientes
                hasPendingPageStructureChanges = true;
                updateSaveButtonState();
                console.log('[DEBUG] Page structure changed - announcement item deleted:', elementId);
            }
            
            return false; // Prevenir cualquier otro manejo del evento
        });
        
        // Visibility toggle for all elements (except header toggles)
        $(document).on('click', '.visibility-toggle:not(.header-visibility-toggle)', function(e) {
            e.preventDefault();
            e.stopPropagation();
            
            console.log('[DEBUG] ========== VISIBILITY TOGGLE CLICKED ==========');
            
            const $button = $(this);
            
            // Check if button is disabled or in transition
            if ($button.data('transitioning')) {
                console.log('[DEBUG] Toggle ignored - button in transition');
                return;
            }
            
            // Mark as transitioning
            $button.data('transitioning', true);
            setTimeout(() => {
                $button.data('transitioning', false);
            }, 300);
            const $visibleIcon = $button.find('.icon-visible');
            const $hiddenIcon = $button.find('.icon-hidden');
            const section = $button.data('section');
            const $subsection = $button.closest('.sidebar-subsection');
            const elementId = $subsection.data('element-id');
            const blockType = $subsection.data('block-type');
            
            // Log current state before any changes
            console.log('[DEBUG] BEFORE toggle - Button state:', {
                hasIsHiddenClass: $button.hasClass('is-hidden'),
                visibleIconComputed: window.getComputedStyle($visibleIcon[0]).display,
                hiddenIconComputed: window.getComputedStyle($hiddenIcon[0]).display,
                buttonElement: $button[0],
                section: section,
                savedStateInConfig: section === 'header' ? currentSectionsConfig.header?.isHidden : 
                                   section === 'announcement' ? currentSectionsConfig.announcementBar?.isHidden : 
                                   'unknown'
            });
            
            console.log('[DEBUG] Toggle elements:', {
                button: $button.length,
                visibleIcon: $visibleIcon.length,
                hiddenIcon: $hiddenIcon.length,
                section,
                elementId,
                blockType
            });
            
            // Toggle visibility state
            const isCurrentlyHidden = $button.hasClass('is-hidden');
            const newHiddenState = !isCurrentlyHidden;
            
            console.log('[DEBUG] Toggle state change:', {
                wasHidden: isCurrentlyHidden,
                willBeHidden: newHiddenState
            });
            
            // Remove all classes first to ensure clean state
            $button.removeClass('is-hidden');
            
            // Then apply the new state
            if (newHiddenState) {
                // Hide element - show visibility_off icon
                $button.addClass('is-hidden');
            }
            
            // Force remove all inline styles
            $visibleIcon.removeAttr('style');
            $hiddenIcon.removeAttr('style');
            
            // Log state after toggle
            console.log('[DEBUG] AFTER toggle - Button state:', {
                hasIsHiddenClass: $button.hasClass('is-hidden'),
                newHiddenState: newHiddenState,
                visibleIconComputed: window.getComputedStyle($visibleIcon[0]).display,
                hiddenIconComputed: window.getComputedStyle($hiddenIcon[0]).display
            });
            
            // Save visibility state based on element type
            if (blockType === 'announcement-item' && elementId) {
                if (!currentSectionsConfig.announcements[elementId]) {
                    currentSectionsConfig.announcements[elementId] = {};
                }
                currentSectionsConfig.announcements[elementId].isHidden = newHiddenState;
                console.log(`[DEBUG] Announcement ${elementId} saved as: ${newHiddenState ? 'hidden' : 'visible'}`);
            } else if (section === 'announcement') {
                currentSectionsConfig.announcementBar.isHidden = newHiddenState;
                console.log(`[DEBUG] Announcement bar saved as: ${newHiddenState ? 'hidden' : 'visible'}`);
            } else if (section === 'header' || blockType === 'header') {
                currentSectionsConfig.header.isHidden = newHiddenState;
                console.log(`[DEBUG] Header saved as: ${newHiddenState ? 'hidden' : 'visible'}`);
            }
            
            // Activar bandera de cambios pendientes
            hasPendingPageStructureChanges = true;
            updateSaveButtonState();
            console.log('[DEBUG] Page structure changed - element visibility toggled');
        });
        
        // Initialize collapsible subsections
        // makeSubsectionsCollapsible(); // Not needed, collapsing is handled by specific click handlers
        
        // Initialize drag and drop directly
        initializeDragAndDropSimple();
        
        // Initialize visibility toggle states
        setTimeout(() => {
            console.log('[DEBUG] Initializing visibility toggle states');
            console.log('[DEBUG] Current sectionsConfig at init:', JSON.stringify(currentSectionsConfig, null, 2));
            
            $('.visibility-toggle').each(function() {
                const $button = $(this);
                const $visibleIcon = $button.find('.icon-visible');
                const $hiddenIcon = $button.find('.icon-hidden');
                const $subsection = $button.closest('.sidebar-subsection');
                const elementId = $subsection.data('element-id');
                const blockType = $subsection.data('block-type');
                const section = $button.data('section');
                
                // Ensure CSS classes control the display, not inline styles
                $visibleIcon.css('display', '');
                $hiddenIcon.css('display', '');
                
                // Get the actual saved state
                let savedIsHidden = false;
                if (blockType === 'announcement-item' && elementId && currentSectionsConfig.announcements[elementId]) {
                    savedIsHidden = currentSectionsConfig.announcements[elementId].isHidden || false;
                } else if (section === 'announcement') {
                    savedIsHidden = currentSectionsConfig.announcementBar.isHidden || false;
                } else if (section === 'header' || blockType === 'header') {
                    savedIsHidden = currentSectionsConfig.header.isHidden || false;
                }
                
                console.log('[DEBUG] Toggle initialized:', {
                    element: elementId || section || blockType,
                    hasIsHiddenClass: $button.hasClass('is-hidden'),
                    savedIsHidden: savedIsHidden,
                    visibleIconDisplay: $visibleIcon.css('display'),
                    hiddenIconDisplay: $hiddenIcon.css('display')
                });
                
                // Verify CSS is working
                if ($button.hasClass('is-hidden')) {
                    console.log('[DEBUG] Button has is-hidden class, checking icon visibility');
                    console.log('  - Visible icon should be hidden:', window.getComputedStyle($visibleIcon[0]).display);
                    console.log('  - Hidden icon should be visible:', window.getComputedStyle($hiddenIcon[0]).display);
                }
                
                // Force sync the visual state with the saved state
                if (savedIsHidden && !$button.hasClass('is-hidden')) {
                    console.log('[DEBUG] Syncing: Adding is-hidden class');
                    $button.addClass('is-hidden');
                } else if (!savedIsHidden && $button.hasClass('is-hidden')) {
                    console.log('[DEBUG] Syncing: Removing is-hidden class');
                    $button.removeClass('is-hidden');
                }
                
                // Double check the computed styles are correct
                setTimeout(() => {
                    const finalVisibleDisplay = window.getComputedStyle($visibleIcon[0]).display;
                    const finalHiddenDisplay = window.getComputedStyle($hiddenIcon[0]).display;
                    const shouldShowHidden = $button.hasClass('is-hidden');
                    
                    console.log('[DEBUG] Final state check:', {
                        element: elementId || section || blockType,
                        hasIsHiddenClass: shouldShowHidden,
                        visibleIconDisplay: finalVisibleDisplay,
                        hiddenIconDisplay: finalHiddenDisplay,
                        isCorrect: shouldShowHidden ? 
                            (finalVisibleDisplay === 'none' && finalHiddenDisplay !== 'none') :
                            (finalVisibleDisplay !== 'none' && finalHiddenDisplay === 'none')
                    });
                }, 200);
            });
        }, 100);
        
        // Diagnóstico y limpieza final
        setTimeout(() => {
            console.log('[DIAGNÓSTICO] Buscando y eliminando iconos problemáticos...');
            
            // Buscar TODOS los iconos Material Icons en la sección
            $('.sidebar-section-content').first().find('i.material-icons').each(function() {
                const $icon = $(this);
                const iconText = $icon.text().trim();
                const parent = $icon.parent();
                
                // Lista de iconos problemáticos conocidos
                const problemIcons = ['drag_indicator', 'more_horiz', 'more_vert', 'menu', 'dehaze', 'reorder'];
                
                // Si es un icono problemático, eliminarlo
                if (problemIcons.includes(iconText)) {
                    console.log(`[CLEANUP FINAL] Eliminando icono problemático: "${iconText}"`);
                    $icon.remove();
                }
                
                // Log para diagnóstico
                if ($icon.parent('.sidebar-subsection').length && 
                    !$icon.hasClass('drag-handle') && 
                    !$icon.hasClass('collapse-indicator') &&
                    !$icon.closest('.subsection-actions').length) {
                    console.log(`[DIAGNÓSTICO] Icono sospechoso encontrado: "${iconText}" (parent: ${parent.attr('class')})`);
                }
            });
            
            // Verificar estructura final
            $('.sidebar-subsection[data-block-type="announcement"], .sidebar-subsection[data-block-type="header"]').each(function() {
                const $this = $(this);
                console.log(`\n[${$this.data('block-type')}] Estructura final:`);
                $this.children().each(function(index) {
                    const $child = $(this);
                    if ($child.is('i.material-icons')) {
                        console.log(`  - Icon ${index}: "${$child.text()}" (class: ${$child.attr('class')})`);
                    }
                });
            });
        }, 600);
        
        // Ensure collapse functionality is properly initialized
        setTimeout(() => {
            const $announcementBar = $('.sidebar-subsection[data-element-id="barra-anuncios"]');
            if ($announcementBar.length) {
                // Check if the element is already collapsed and has children
                const hasAnnouncements = $('.sidebar-subsection[data-block-type="announcement-item"]').length > 0;
                
                if (hasAnnouncements && $announcementBar.hasClass('collapsed')) {
                    // Keep items hidden if parent was collapsed
                    $('.sidebar-subsection[data-block-type="announcement-item"]').hide();
                    const $collapseIcon = $announcementBar.find('.collapse-indicator');
                    if ($collapseIcon.length) {
                        $collapseIcon.text('chevron_right');
                    }
                }
            }
        }, 100);
    }
    
    // Simple drag and drop initialization that works immediately
    function initializeDragAndDropSimple() {
        console.log('[DRAG&DROP] Inicialización simple y directa');
        
        // Wait a bit for the DOM to settle
        setTimeout(() => {
            const $container = $('.sidebar-section-content').first();
            
            if (!$container.length) {
                console.error('[DRAG&DROP] No se encontró el contenedor');
                return;
            }
            
            // Add drag handles to ALL subsections
            const $subsections = $container.find('.sidebar-subsection');
            $subsections.each(function() {
                const $this = $(this);
                if (!$this.find('.drag-handle').length) {
                    $this.prepend('<i class="material-icons drag-handle">drag_handle</i>');
                }
            });
            
            // Ensure announcement bar has proper collapse functionality after drag init
            const $announcementBar = $('.sidebar-subsection[data-element-id="barra-anuncios"]');
            if ($announcementBar.length) {
                $announcementBar.addClass('collapsible-parent');
            }
            
            // Apply sortable with parent-child logic
            if (typeof $.fn.sortable === 'function') {
                // First, destroy any existing sortable instances to prevent conflicts
                if ($container.hasClass('ui-sortable')) {
                    $container.sortable('destroy');
                }
                
                // Main sortable for announcement bar and header only
                $container.sortable({
                    items: '.sidebar-subsection[data-block-type="announcement"], .sidebar-subsection[data-block-type="header"]',
                    handle: '.drag-handle',
                    axis: 'y',
                    tolerance: 'pointer',
                    placeholder: 'sortable-placeholder',
                    helper: function(e, item) {
                        // Create a helper that includes visual feedback
                        const helper = item.clone();
                        helper.css({
                            'opacity': '0.8',
                            'background': '#f0f0f0'
                        });
                        return helper;
                    },
                    start: function(e, ui) {
                        // Add placeholder styling
                        ui.placeholder.css({
                            'height': ui.item.outerHeight(),
                            'visibility': 'visible',
                            'background': '#e0e0e0',
                            'border': '2px dashed #999'
                        });
                        
                        // If dragging announcement bar, handle its children and wrapper
                        if (ui.item.attr('data-element-id') === 'barra-anuncios') {
                            const $wrapper = $('#announcement-items-wrapper');
                            if ($wrapper.length > 0) {
                                // Store wrapper reference
                                ui.item.data('announcement-wrapper', $wrapper);
                                // Hide and detach the entire wrapper to prevent interference
                                $wrapper.hide();
                                ui.item.data('detached-wrapper', $wrapper.detach());
                            }
                        }
                    },
                    stop: function(e, ui) {
                        // If we moved announcement bar, reattach its wrapper after it
                        if (ui.item.attr('data-element-id') === 'barra-anuncios') {
                            const $detachedWrapper = ui.item.data('detached-wrapper');
                            if ($detachedWrapper && $detachedWrapper.length > 0) {
                                // Insert wrapper after the announcement bar
                                $detachedWrapper.insertAfter(ui.item).show();
                            }
                            // Clean up data
                            ui.item.removeData('announcement-wrapper');
                            ui.item.removeData('detached-wrapper');
                        }
                        
                        // Update section order based on DOM
                        const newOrder = [];
                        $('.sidebar-section-content').first().find('> .sidebar-subsection').each(function() {
                            const $this = $(this);
                            const blockType = $this.data('block-type');
                            
                            // Solo agregar announcement y header al orden principal
                            if ((blockType === 'announcement' || blockType === 'header') && !newOrder.includes(blockType)) {
                                newOrder.push(blockType);
                            }
                        });
                        currentSectionsConfig.sectionOrder = newOrder;
                        
                        // Activar bandera de cambios pendientes
                        hasPendingPageStructureChanges = true;
                        updateSaveButtonState();
                        console.log('[DEBUG] Page structure changed - drag & drop reorder. New order:', newOrder);
                        
                        // Re-ensure the collapse button is present and reinitialize announcement sortable
                        setTimeout(() => {
                            const $announcementBar = $('.sidebar-subsection[data-element-id="barra-anuncios"]');
                            if ($announcementBar.length) {
                                // Ensure it's still marked as collapsible parent
                                $announcementBar.addClass('collapsible-parent');
                                
                                // Make sure collapse button exists
                                if (!$announcementBar.find('.collapse-toggle').length) {
                                    $announcementBar.find('.subsection-actions').append(`
                                        <button class="action-icon collapse-toggle" title="Collapse/Expand">
                                            <i class="material-icons collapse-indicator">expand_more</i>
                                        </button>
                                    `);
                                }
                            }
                            
                            // Reinitialize announcement items sortable
                            createAnnouncementSortable();
                        }, 100);
                    }
                });
                
                // Create a separate sortable for announcement items only
                // They can only sort within their own group
                const createAnnouncementSortable = () => {
                    const $announcementBar = $('.sidebar-subsection[data-element-id="barra-anuncios"]');
                    const $announcements = $('.sidebar-subsection[data-block-type="announcement-item"]');
                    
                    if ($announcements.length > 0) {
                        // Find existing wrapper
                        let $announcementWrapper = $('#announcement-items-wrapper');
                        
                        // If wrapper doesn't exist, announcements might be loose - create wrapper
                        if ($announcementWrapper.length === 0) {
                            // Check if announcements are not already in a wrapper
                            const $firstAnnouncement = $announcements.first();
                            if (!$firstAnnouncement.parent().is('#announcement-items-wrapper')) {
                                // Create wrapper and move all announcement items into it
                                $announcementWrapper = $('<div id="announcement-items-wrapper" style="position: relative;"></div>');
                                
                                // Insert wrapper after announcement bar
                                $announcementBar.after($announcementWrapper);
                                
                                // Move all announcement items into the wrapper
                                $announcements.detach().appendTo($announcementWrapper);
                            }
                        }
                        
                        // Only initialize sortable if there are multiple items
                        if ($announcements.length > 1) {
                            // Destroy existing sortable if exists
                            if ($announcementWrapper.hasClass('ui-sortable')) {
                                $announcementWrapper.sortable('destroy');
                            }
                            
                            // Initialize sortable on the wrapper
                            $announcementWrapper.sortable({
                                items: '.sidebar-subsection[data-block-type="announcement-item"]',
                                handle: '.drag-handle',
                                axis: 'y',
                                tolerance: 'pointer',
                                placeholder: 'sortable-placeholder',
                                helper: 'clone',
                                start: function(e, ui) {
                                    ui.placeholder.css({
                                        'height': ui.item.outerHeight(),
                                        'visibility': 'visible',
                                        'background': '#e0e0e0',
                                        'border': '2px dashed #999'
                                    });
                                },
                                stop: function(e, ui) {
                                    // Update announcement order based on DOM
                                    const newAnnouncementOrder = [];
                                    $announcementWrapper.find('.sidebar-subsection[data-block-type="announcement-item"]').each(function() {
                                        const elementId = $(this).data('element-id');
                                        if (elementId) {
                                            newAnnouncementOrder.push(elementId);
                                        }
                                    });
                                    
                                    // Ensure the announcements property exists
                                    if (!currentSectionsConfig.announcementOrder) {
                                        currentSectionsConfig.announcementOrder = [];
                                    }
                                    currentSectionsConfig.announcementOrder = newAnnouncementOrder;
                                    
                                    // Activar bandera de cambios pendientes
                                    hasPendingPageStructureChanges = true;
                                    updateSaveButtonState();
                                    console.log('[DEBUG] Page structure changed - announcement items reorder. New order:', newAnnouncementOrder);
                                }
                            });
                        }
                    }
                };
                
                // Initialize announcement sortable
                createAnnouncementSortable();
                
                console.log('[DRAG&DROP] ✓ Sortable aplicado con restricciones');
            } else {
                console.error('[DRAG&DROP] jQuery UI sortable no está disponible');
            }
        }, 300);
    }
    
    // Function to make subsections collapsible without changing the design
    function makeSubsectionsCollapsible() {
        console.log('[COLLAPSIBLE] Iniciando función makeSubsectionsCollapsible');
        
        // Verificar que los elementos existen
        const announcementSection = $('.sidebar-subsection[data-block-type="announcement"]');
        const headerSection = $('.sidebar-subsection[data-block-type="header"]');
        
        console.log('[COLLAPSIBLE] Elementos encontrados:', {
            announcement: announcementSection.length,
            header: headerSection.length
        });
        
        // Para visualizar que es colapsable, agregar un pequeño icono chevron
        [announcementSection, headerSection].forEach($section => {
            if ($section.length > 0) {
                // Agregar icono de chevron después del drag handle si no existe
                const dragHandle = $section.find('.drag-handle');
                if (dragHandle.length && !$section.find('.collapse-indicator').length) {
                    dragHandle.after('<i class="material-icons collapse-indicator">keyboard_arrow_down</i>');
                }
                
                // Hacer clickeable
                $section.css('cursor', 'pointer');
                
                // Click handler
                $section.off('click.collapse').on('click.collapse', function(e) {
                    // No colapsar si se hace clic en los botones de acción
                    if ($(e.target).closest('.subsection-actions').length) {
                        return;
                    }
                    
                    // IMPORTANTE: Solo colapsar si se hace clic en el indicador de colapso
                    if (!$(e.target).hasClass('collapse-indicator') && !$(e.target).closest('.collapse-indicator').length) {
                        return;
                    }
                    
                    e.stopPropagation(); // Prevenir que se dispare el otro click handler
                    
                    const $this = $(this);
                    const $indicator = $this.find('.collapse-indicator');
                    
                    // Verificar el estado actual basado en una clase o data attribute
                    const isCurrentlyCollapsed = $this.hasClass('collapsed');
                    
                    if (!isCurrentlyCollapsed) {
                        // Colapsar con animación suave
                        $this.addClass('collapsed');
                        
                    } else {
                        // Expandir con animación suave
                        $this.removeClass('collapsed');
                        
                    }
                    
                    console.log('[COLLAPSIBLE] Click en:', $this.data('block-type'), 'Ahora está colapsado:', !isCurrentlyCollapsed);
                });
            }
        });
    }
    
    // Function to open add section modal
    function openAddSectionModal(group = 'template') {
        // Create modal overlay
        const modalOverlay = $('<div class="add-section-overlay"></div>');
        const modalContent = renderAddSectionView(group);
        
        modalOverlay.html(modalContent);
        $('body').append(modalOverlay);
        
        // Show modal with fade in
        modalOverlay.css('display', 'block').hide().fadeIn(200);
        
        // Apply translations after a brief delay to ensure DOM is ready
        setTimeout(() => {
            applyTranslations();
            
            // Focus on search input
            $('.search-sections-input').focus();
            
            // Force sections list to be scrollable
            $('.sections-list').css({
                'overflow-y': 'auto',
                'max-height': 'calc(100% - 73px)'
            });
            
            // Attach modal event handlers after translations are applied
            attachAddSectionModalHandlers();
        }, 50);
    }
    
    // Function to attach event handlers for add section modal
    function attachAddSectionModalHandlers() {
        // Close modal with cancel button or overlay click
        $('.cancel-button, .add-section-overlay').on('click', function(e) {
            if (e.target === this || $(e.target).hasClass('cancel-button')) {
                $('.add-section-overlay').fadeOut(200, function() {
                    $(this).remove();
                });
            }
        });
        
        // Prevent modal close when clicking inside
        $('.add-section-modal').on('click', function(e) {
            e.stopPropagation();
        });
        
        // Search functionality
        $('.search-sections-input').on('input', function() {
            const searchTerm = $(this).val().toLowerCase();
            $('.section-item').each(function() {
                const text = $(this).text().toLowerCase();
                $(this).toggle(text.includes(searchTerm));
            });
        });
        
        // Event handlers are now attached globally in the main initialization
        // This prevents duplicate handlers and ensures they work properly
        
        // Add section on click
        $('body').on('click', '.add-section-modal .section-item', function() {
            const sectionId = $(this).data('section-id');
            const sectionName = $(this).find('span').text();
            
            // Add section to page
            console.log('Adding section:', sectionId, sectionName);
            
            // Close modal
            $('.add-section-overlay').fadeOut(200, function() {
                $(this).remove();
            });
            
            // TODO: Actually add the section to the page
        });
    }
    
    // Function to update section preview
    function updateSectionPreview(sectionId) {
        const previews = {
            'featured-collection': `
                <div class="featured-collection-preview-new">
                    <div class="preview-container">
                        <div class="preview-title-bar">
                            <span class="preview-title-text">Featured collection</span>
                        </div>
                        <div class="preview-products-row">
                            ${Array(10).fill().map((_, i) => `
                                <div class="preview-product-item">
                                    <div class="preview-product-image-box">
                                        <div class="preview-image-icon">
                                            <i class="material-icons">image</i>
                                        </div>
                                    </div>
                                    <div class="preview-product-info">
                                        <div class="preview-line vendor-line"></div>
                                        <div class="preview-line title-line"></div>
                                        <div class="preview-price-row">
                                            <div class="preview-line price-line"></div>
                                            <div class="preview-line price-line short"></div>
                                        </div>
                                    </div>
                                </div>
                            `).join('')}
                        </div>
                    </div>
                </div>
            `,
            'featured-product': `
                <div class="featured-product-preview">
                    <div class="preview-container">
                        <div class="featured-product-layout">
                            <div class="product-images-section">
                                <div class="main-product-image">
                                    <i class="material-icons">image</i>
                                </div>
                                <div class="product-thumbnails">
                                    <div class="thumbnail-item">
                                        <i class="material-icons">image</i>
                                    </div>
                                </div>
                            </div>
                            <div class="product-info-section">
                                <h2 class="product-title">Nombre del producto</h2>
                                <div class="product-price">$0.00</div>
                                <div class="product-description">
                                    <div class="description-line"></div>
                                    <div class="description-line"></div>
                                    <div class="description-line short"></div>
                                </div>
                                <div class="product-actions">
                                    <button class="btn-add-to-cart">Agregar</button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            `,
            'collection-list': `
                <div class="collection-list-preview">
                    <div class="preview-container">
                        <div class="preview-title-bar">
                            <span class="preview-title-text">Collection list</span>
                        </div>
                        <div class="collections-grid">
                            ${Array(3).fill().map(() => `
                                <div class="collection-item">
                                    <div class="collection-image">
                                        <div class="collection-icon">
                                            <i class="material-icons">shopping_bag</i>
                                            <i class="material-icons">local_florist</i>
                                        </div>
                                    </div>
                                    <div class="collection-name">
                                        <div class="name-line"></div>
                                    </div>
                                </div>
                            `).join('')}
                        </div>
                    </div>
                </div>
            `,
            'image-banner': `
                <div class="image-banner-preview">
                    <div class="preview-container">
                        <div class="banner-content">
                            <div class="banner-icons">
                                <i class="material-icons">photo_camera</i>
                                <i class="material-icons">videocam</i>
                                <i class="material-icons">music_note</i>
                                <i class="material-icons">palette</i>
                            </div>
                            <h2 class="banner-title">Image with text</h2>
                            <p class="banner-description">Fill in the text to tell customers by what your products are inspired.</p>
                            <div class="banner-buttons">
                                <button class="banner-btn">Button label</button>
                                <button class="banner-btn">Button label</button>
                            </div>
                        </div>
                    </div>
                </div>
            `,
            'multicolumn': `
                <div class="multicolumn-preview">
                    <div class="preview-container">
                        <div class="preview-title-bar">
                            <span class="preview-title-text">Multicolumn</span>
                        </div>
                        <div class="multicolumn-description">
                            Share multiple columns of text paired with images or icons to share useful information about your store: shipping and return conditions, special offers and upcoming sales.
                        </div>
                        <div class="columns-grid">
                            ${Array(3).fill().map(() => `
                                <div class="column-item">
                                    <div class="column-icon">
                                        <i class="material-icons">stars</i>
                                    </div>
                                    <h3 class="column-title">Icon column</h3>
                                    <p class="column-text">Pair text with an icon to draw attention to your chosen product, collection or store of news. Add details on shipping or return conditions, product availability, care instructions, charting specs and standards.</p>
                                    <a href="#" class="column-link">Learn more</a>
                                </div>
                            `).join('')}
                        </div>
                    </div>
                </div>
            `,
            'accordion': `
                <div class="accordion-preview">
                    <div class="preview-container">
                        <div class="preview-title-bar">
                            <span class="preview-title-text">FAQ</span>
                        </div>
                        <div class="accordion-content">
                            <p class="accordion-description">Answers to most common questions about products, orders, shipments, and payments.</p>
                            <div class="accordion-section">
                                <h4 class="accordion-category">Category</h4>
                                <div class="accordion-item">
                                    <span>Frequently asked question</span>
                                    <i class="material-icons">add</i>
                                </div>
                                <div class="accordion-item">
                                    <span>Frequently asked question</span>
                                    <i class="material-icons">add</i>
                                </div>
                            </div>
                            <div class="accordion-section">
                                <h4 class="accordion-category">Category</h4>
                                <div class="accordion-item">
                                    <span>Frequently asked question</span>
                                    <i class="material-icons">add</i>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            `,
            'contact-form': `
                <div class="contact-form-preview">
                    <div class="preview-container">
                        <div class="preview-title-bar">
                            <span class="preview-title-text">Contact us</span>
                        </div>
                        <div class="contact-form-content">
                            <p class="form-description">Fill in the text to remind customers to fill in the form correctly so that your support team could contact them to help with the issues and answer all the questions.</p>
                            <div class="form-fields">
                                <div class="form-row">
                                    <div class="form-field">Name</div>
                                    <div class="form-field">Email Address</div>
                                </div>
                                <div class="form-field large">Message</div>
                                <button class="form-submit">Send</button>
                            </div>
                            <p class="form-disclaimer">This contact form is for demo purposes only and will not send or save any data. To use a contact form feature, you will need to integrate with a third-party service.</p>
                        </div>
                    </div>
                </div>
            `,
            'countdown-banner': `
                <div class="countdown-banner-preview">
                    <div class="preview-container">
                        <div class="countdown-content">
                            <h4 class="countdown-label">COUNTDOWN BANNER</h4>
                            <h2 class="countdown-title">Limited time promotion</h2>
                            <p class="countdown-description">Create urgency around sales and special offers</p>
                            <div class="countdown-timer">
                                <div class="timer-block">
                                    <span class="timer-value">0</span>
                                    <span class="timer-label">DAYS</span>
                                </div>
                                <span class="timer-separator">:</span>
                                <div class="timer-block">
                                    <span class="timer-value">0</span>
                                    <span class="timer-label">HOURS</span>
                                </div>
                                <span class="timer-separator">:</span>
                                <div class="timer-block">
                                    <span class="timer-value">0</span>
                                    <span class="timer-label">MINS</span>
                                </div>
                                <span class="timer-separator">:</span>
                                <div class="timer-block">
                                    <span class="timer-value">0</span>
                                    <span class="timer-label">SECS</span>
                                </div>
                            </div>
                            <button class="countdown-button">Button label</button>
                        </div>
                    </div>
                </div>
            `,
            'gallery': `
                <div class="gallery-preview">
                    <div class="preview-container">
                        <div class="preview-title-bar">
                            <span class="preview-title-text">Gallery</span>
                        </div>
                        <div class="gallery-content">
                            <p class="gallery-description">Show your products, collections, and social media posts in tall about recent events.</p>
                            <div class="gallery-grid">
                                ${Array(5).fill().map(() => `
                                    <div class="gallery-item">
                                        <i class="material-icons">photo_camera</i>
                                    </div>
                                `).join('')}
                            </div>
                        </div>
                    </div>
                </div>
            `,
            'newsletter': `
                <div class="newsletter-preview">
                    <div class="preview-container">
                        <div class="newsletter-content">
                            <h3 class="newsletter-label">NEWSLETTER</h3>
                            <h2 class="newsletter-title">Subscribe</h2>
                            <p class="newsletter-description">Invite customers to subscribe for timely sale access, new in, promotions, and more.</p>
                            <div class="newsletter-form">
                                <input type="email" class="newsletter-input" placeholder="Email Address">
                                <button class="newsletter-button">Subscribe</button>
                            </div>
                        </div>
                    </div>
                </div>
            `,
            'slideshow': '<div class="section-preview-image"><img src="/images/slideshow-preview.png" alt="Slideshow"></div>',
            // Add more previews as needed
        };
        
        const previewContent = previews[sectionId] || `<div class="preview-placeholder"><p data-i18n="sections.noPreview">Vista previa no disponible</p></div>`;
        $('.section-preview').html(previewContent);
        applyTranslations();
    }
    
    // Event delegation for dynamic sidebar content
    document.getElementById('editor-sidebar-panel').addEventListener('click', function(event) {
        // Handle back button clicks
        if (event.target.closest('.back-to-block-list-btn')) {
            switchSidebarView('blockList', currentPageData);
        }
        
        // Handle block list item clicks
        const blockListItem = event.target.closest('.block-list-item');
        if (blockListItem && currentSidebarView === 'blockList') {
            const blockId = blockListItem.dataset.blockId;
            // Mock block data for demonstration
            const selectedBlock = {
                id: blockId,
                type: blockListItem.querySelector('.block-type').textContent.toLowerCase(),
                settings: {}
            };
            switchSidebarView('blockSettings', selectedBlock);
        }
        
        // Handle block type selection in add section view
        const blockTypeItem = event.target.closest('.block-type-item');
        if (blockTypeItem && currentSidebarView === 'addSectionView') {
            const blockType = blockTypeItem.dataset.blockType;
            console.log('Añadir tipo de bloque:', blockType);
            // TODO: Add block to page and return to block list
            // For now, just return to block list
            const newBlock = {
                id: Date.now().toString(),
                type: blockType,
                settings: {}
            };
            currentPageData.blocks.push(newBlock);
            switchSidebarView('blockList', currentPageData);
        }
    });
    
    // Initialize the sidebar with last view or default
    const lastView = sessionStorage.getItem('websiteBuilderLastView');
    if (lastView === 'themeSettingsView') {
        // Restore theme settings view
        $('.topbar-nav-icon').removeClass('active');
        $('.topbar-nav-icon[data-view="settings"]').addClass('active');
        switchSidebarView('themeSettingsView');
        // Clear the saved state
        sessionStorage.removeItem('websiteBuilderLastView');
    } else {
        // Default view
        switchSidebarView('blockList', currentPageData);
    }
    
    // Apply translations on initial load
    setTimeout(applyTranslations, 100);
    
    // Ensure drag and drop is initialized after everything is ready
    setTimeout(() => {
        console.log('[INIT] Verificación final de drag and drop...');
        const $container = $('.sidebar-section-content').first();
        if ($container.length && !$container.hasClass('ui-sortable')) {
            console.log('[INIT] Drag and drop no se inicializó, aplicando ahora...');
            initializeDragAndDrop();
        } else if ($container.hasClass('ui-sortable')) {
            console.log('[INIT] ✓ Drag and drop ya está inicializado');
        }
    }, 5000);
    
    // Set up global event handlers for add section modal (outside of modal creation)
    // This ensures they work even for dynamically created content
    $(document).on('mouseenter', '.add-section-modal .section-item', function() {
        const sectionId = $(this).data('section-id');
        console.log('Hovering over section:', sectionId);
        updateSectionPreview(sectionId);
    });
    
    $(document).on('mouseleave', '.add-section-modal .sections-list', function(e) {
        if (!$(e.relatedTarget).closest('.section-item').length) {
            $('.section-preview').html(`
                <div class="preview-placeholder">
                    <p data-i18n="sections.selectToPreview">${translations[currentLanguage]['sections.selectToPreview'] || 'Select a section to preview'}</p>
                </div>
            `);
        }
    });
    
    
    // Listen for language changes from the main layout
    document.addEventListener('languageChanged', function(e) {
        const newLang = e.detail.language;
        // Update the current language
        currentLanguage = newLang;
        // Update the lang object with new translations
        Object.assign(lang, translations[newLang]);
        
        // Apply translations to all views
        applyTranslations();
        
        // Re-apply translations to currently visible view
        if (currentSidebarView === 'themeSettingsView') {
            // Re-render theme settings to apply translations
            const dynamicContentArea = document.getElementById('sidebar-dynamic-content');
            if (dynamicContentArea) {
                dynamicContentArea.innerHTML = renderThemeSettingsView();
                setTimeout(applyTranslations, 0);
            }
        }
        
        // Update static UI elements
        $('#exit-builder-btn .btn-text').text(lang.exitEditorButtonText);
        $('#active-theme-name-display .theme-label').text(lang.themeLabel);
        $('#page-selector-trigger .page-name').text(lang.homePageLabel);
        $('#create-new-page-btn-topbar').attr('title', lang.createNewPageButtonText);
        $('#delete-page-btn-topbar .btn-text').text(lang.deletePageButtonText);
        $('#save-builder-btn-topbar .btn-text').text(lang.saveButtonText);
        $('.sidebar-loading-text').text(lang.sidebarLoadingText);
        $('.preview-placeholder-text').text(lang.previewAreaPlaceholderText);
    });
    
    // Topbar navigation icon clicks
    $('.topbar-nav-icon').on('click', function() {
        $('.topbar-nav-icon').removeClass('active');
        $(this).addClass('active');
        
        const view = $(this).data('view');
        if (view === 'sections') {
            switchSidebarView('blockList', currentPageData);
        } else if (view === 'settings') {
            switchSidebarView('themeSettingsView');
        }
    });
    
    // Theme settings section expand/collapse
    $(document).on('click', '.theme-section-header', function() {
        const section = $(this).parent('.theme-setting-section');
        const content = section.find('.theme-section-content');
        const chevron = $(this).find('.section-chevron');
        
        if (section.hasClass('expanded')) {
            section.removeClass('expanded');
            content.slideUp(200);
        } else {
            section.addClass('expanded');
            content.slideDown(200);
            
            // Initialize sliders when Appearance section is opened
            if ($(this).data('section') === 'appearance') {
                initializeAppearanceSliders();
            }
            
            // Initialize font selectors when Typography section is opened
            if ($(this).data('section') === 'typography') {
                setTimeout(initializeFontSelectors, 100);
            }
            
            // Initialize color schemes when Color schemes section is opened
            if ($(this).data('section') === 'color-schemes') {
                // COMENTADO: Esta función estaba sobrescribiendo los valores cargados de la BD
                // setTimeout(initializeColorSchemes, 100);
                console.log('[DEBUG] Color schemes section opened - NOT calling initializeColorSchemes to preserve DB values');
            }
            
            // Initialize swatches range inputs when Swatches section is opened
            if ($(this).data('section') === 'swatches') {
                setTimeout(initializeSwatchesRangeInputs, 100);
            }
            
            // Apply translations to the expanded content
            setTimeout(applyTranslations, 50);
        }
    });
    
    // Function to initialize appearance sliders
    function initializeAppearanceSliders() {
        console.log('Initializing appearance sliders...');
        // Page Width Slider
        const pageWidthSlider = document.getElementById('pageWidth');
        const pageWidthValue = document.getElementById('pageWidthValue');
        
        if (pageWidthSlider && pageWidthValue) {
            // Sync slider with input
            pageWidthSlider.addEventListener('input', function() {
                pageWidthValue.value = this.value;
            });
            
            pageWidthValue.addEventListener('input', function() {
                pageWidthSlider.value = this.value;
            });
        }
        
        // Side Padding Slider
        const sidePaddingSlider = document.getElementById('sidePaddingSize');
        const sidePaddingValue = document.getElementById('sidePaddingSizeValue');
        
        if (sidePaddingSlider && sidePaddingValue) {
            // Sync slider with input
            sidePaddingSlider.addEventListener('input', function() {
                sidePaddingValue.value = this.value;
            });
            
            sidePaddingValue.addEventListener('input', function() {
                sidePaddingSlider.value = this.value;
            });
        }
        
        // Load saved settings
        const savedSettings = localStorage.getItem('appearanceSettings');
        if (savedSettings) {
            const settings = JSON.parse(savedSettings);
            if (pageWidthSlider) pageWidthSlider.value = settings.pageWidth || 3000;
            if (pageWidthValue) pageWidthValue.value = settings.pageWidth || 3000;
            if (sidePaddingSlider) sidePaddingSlider.value = settings.sidePaddingSize || 34;
            if (sidePaddingValue) sidePaddingValue.value = settings.sidePaddingSize || 34;
            if (document.getElementById('edgeRounding')) {
                document.getElementById('edgeRounding').value = settings.edgeRounding || 'size0';
            }
        }
    }
    
    // Save appearance settings
    $(document).on('change', '#pageWidth, #sidePaddingSize, #edgeRounding', function() {
        const settings = {
            pageWidth: $('#pageWidthValue').val(),
            sidePaddingSize: $('#sidePaddingSizeValue').val(),
            edgeRounding: $('#edgeRounding').val()
        };
        localStorage.setItem('appearanceSettings', JSON.stringify(settings));
    });
    
    // Function to initialize typography sliders
    function initializeTypographySliders() {
        console.log('Initializing typography sliders...');
        // Initialize all typography sliders
        const sliderPairs = [
            { slider: 'headingLetterSpacing', value: 'headingLetterSpacingValue' },
            { slider: 'menuFontSize', value: 'menuFontSizeValue' },
            { slider: 'menuLetterSpacing', value: 'menuLetterSpacingValue' },
            { slider: 'productFontSize', value: 'productFontSizeValue' },
            { slider: 'productLetterSpacing', value: 'productLetterSpacingValue' },
            { slider: 'buttonsFontSize', value: 'buttonsFontSizeValue' },
            { slider: 'buttonsLetterSpacing', value: 'buttonsLetterSpacingValue' }
        ];
        
        sliderPairs.forEach(pair => {
            const slider = document.getElementById(pair.slider);
            const valueInput = document.getElementById(pair.value);
            
            if (slider && valueInput) {
                // Sync slider with input
                slider.addEventListener('input', function() {
                    valueInput.value = this.value;
                });
                
                valueInput.addEventListener('input', function() {
                    slider.value = this.value;
                });
            }
        });
        
        // Initialize font selectors with search after a small delay to ensure DOM is ready
        setTimeout(() => {
            initializeFontSelectors();
        }, 100);
    }
    
    // Extended font list
    window.allFonts = {
        'Sans serif': [
            'Abel', 'Aclonica', 'Actor', 'Advent Pro', 'Aguafina Script', 'Akronim', 'Alata', 'Alatsi', 'Albert Sans',
            'Alegreya Sans', 'Aleo', 'Alkalami', 'Allan', 'Allison', 'Allura', 'Almarai', 'Almendra', 'Alumni Sans',
            'Amaranth', 'Amatic SC', 'Amiko', 'Amiri', 'Andika', 'Angkor', 'Annie Use Your Telescope', 'Anonymous Pro',
            'Antic', 'Anton', 'Antonio', 'Anybody', 'Arapey', 'Arbutus', 'Architects Daughter', 'Archivo',
            'Archivo Black', 'Archivo Narrow', 'Are You Serious', 'Aref Ruqaa', 'Arima', 'Arimo', 'Arizonia',
            'Armata', 'Arsenal', 'Artifika', 'Arvo', 'Arya', 'Asap', 'Asap Condensed', 'Asar', 'Asset', 'Assistant',
            'Astloch', 'Asul', 'Athiti', 'Atkinson Hyperlegible', 'Atma', 'Atomic Age', 'Aubrey', 'Audiowide',
            'Autour One', 'Average', 'Average Sans', 'Averia Gruesa Libre', 'Averia Libre', 'Averia Sans Libre',
            'Averia Serif Libre', 'Azeret Mono', 'B612', 'B612 Mono', 'Babylonica', 'Bad Script', 'Bahiana',
            'Bahianita', 'Bai Jamjuree', 'Bakbak One', 'Ballet', 'Baloo 2', 'Baloo Bhai 2', 'Baloo Bhaijaan 2',
            'Baloo Bhaina 2', 'Baloo Chettan 2', 'Baloo Da 2', 'Baloo Paaji 2', 'Baloo Tamma 2', 'Baloo Tammudu 2',
            'Baloo Thambi 2', 'Balsamiq Sans', 'Balthazar', 'Bangers', 'Barlow', 'Barlow Condensed', 'Barlow Semi Condensed',
            'Barriecito', 'Barrio', 'Basic', 'Basque', 'Battambang', 'Baumans', 'Bayon', 'Be Vietnam Pro',
            'Bebas Neue', 'Belgrano', 'Bellefair', 'Belleza', 'Bellota', 'Bellota Text', 'BenchNine', 'Benne',
            'Bentham', 'Berkshire Swash', 'Besley', 'Beth Ellen', 'Bevan', 'BhuTuka Expanded One', 'Big Shoulders Display',
            'Big Shoulders Inline Display', 'Big Shoulders Inline Text', 'Big Shoulders Stencil Display',
            'Big Shoulders Stencil Text', 'Big Shoulders Text', 'Bigelow Rules', 'Bigshot One', 'Bilbo', 'Bilbo Swash Caps',
            'BioRhyme', 'BioRhyme Expanded', 'Birthstone', 'Birthstone Bounce', 'Biryani', 'Bitter', 'Black And White Picture',
            'Black Han Sans', 'Black Ops One', 'Blaka', 'Blaka Hollow', 'Blaka Ink', 'Blinker', 'Bodoni Moda',
            'Bokor', 'Bona Nova', 'Bonbon', 'Bonheur Royale', 'Boogaloo', 'Bowlby One', 'Bowlby One SC',
            'Brawler', 'Bree Serif', 'Brygada 1918', 'Bubblegum Sans', 'Bubbler One', 'Buda', 'Buenard',
            'Bungee', 'Bungee Hairline', 'Bungee Inline', 'Bungee Outline', 'Bungee Shade', 'Bungee Spice',
            'Butcherman', 'Butterfly Kids', 'Cabin', 'Cabin Condensed', 'Cabin Sketch', 'Caesar Dressing',
            'Cagliostro', 'Cairo', 'Cairo Play', 'Caladea', 'Calistoga', 'Calligraffitti', 'Cambay', 'Cambo',
            'Candal', 'Cantarell', 'Cantata One', 'Cantora One', 'Capriola', 'Caramel', 'Carattere', 'Cardo',
            'Carme', 'Carrois Gothic', 'Carrois Gothic SC', 'Carter One', 'Castoro', 'Castoro Titling', 'Catamaran',
            'Caudex', 'Caveat', 'Caveat Brush', 'Cedarville Cursive', 'Ceviche One', 'Chakra Petch', 'Changa',
            'Changa One', 'Chango', 'Charis SIL', 'Charm', 'Charmonman', 'Chase Print', 'Chathura', 'Chau Philomene One',
            'Chela One', 'Chelsea Market', 'Chenla', 'Cherish', 'Cherry Cream Soda', 'Cherry Swash', 'Chewy',
            'Chicle', 'Chilanka', 'Chivo', 'Chivo Mono', 'Chocolate Classical Sans', 'Chokokutai', 'Chonburi',
            'Cinzel', 'Cinzel Decorative', 'Clicker Script', 'Climate Crisis', 'Coda', 'Coda Caption', 'Codystar',
            'Coiny', 'Combo', 'Comfortaa', 'Comforter', 'Comforter Brush', 'Comic Neue', 'Coming Soon',
            'Commissioner', 'Concert One', 'Condiment', 'Content', 'Contrail One', 'Convergence', 'Cookie',
            'Copse', 'Corben', 'Corinthia', 'Cormorant', 'Cormorant Garamond', 'Cormorant Infant', 'Cormorant SC',
            'Cormorant Unicase', 'Cormorant Upright', 'Courgette', 'Courier Prime', 'Cousine', 'Coustard',
            'Covered By Your Grace', 'Crafty Girls', 'Creepster', 'Crete Round', 'Crimson Pro', 'Crimson Text',
            'Croissant One', 'Crushed', 'Cuprum', 'Cute Font', 'Cutive', 'Cutive Mono', 'DM Mono', 'DM Sans',
            'DM Serif Display', 'DM Serif Text', 'Damion', 'Dancing Script', 'Dangrek', 'Darker Grotesque',
            'Darumadrop One', 'David Libre', 'Dawning of a New Day', 'Days One', 'Dekko', 'Dela Gothic One',
            'Delicious Handrawn', 'Delius', 'Delius Swash Caps', 'Delius Unicase', 'Della Respira', 'Denk One',
            'Devonshire', 'Dhurjati', 'Didact Gothic', 'Diphylleia', 'Diplomata', 'Diplomata SC', 'Do Hyeon',
            'Dokdo', 'Domine', 'Donegal One', 'Dongle', 'Doppio One', 'Dorsa', 'Dosis', 'DotGothic16',
            'Dr Sugiyama', 'Duru Sans', 'DynaPuff', 'Dynalight', 'EB Garamond', 'Eagle Lake', 'East Sea Dokdo',
            'Eater', 'Economica', 'Eczar', 'Edu NSW ACT Foundation', 'Edu QLD Beginner', 'Edu SA Beginner',
            'Edu TAS Beginner', 'Edu VIC WA NT Beginner', 'El Messiri', 'Electrolize', 'Elsie', 'Elsie Swash Caps',
            'Emblema One', 'Emilys Candy', 'Encode Sans', 'Encode Sans Condensed', 'Encode Sans Expanded',
            'Encode Sans SC', 'Encode Sans Semi Condensed', 'Encode Sans Semi Expanded', 'Engagement', 'Englebert',
            'Enriqueta', 'Ephesis', 'Epilogue', 'Erica One', 'Esteban', 'Estonia', 'Euphoria Script', 'Ewert',
            'Exo', 'Exo 2', 'Expletus Sans', 'Explora', 'Fahkwang', 'Familjen Grotesk', 'Fanwood Text',
            'Farro', 'Farsan', 'Fascinate', 'Fascinate Inline', 'Faster One', 'Fasthand', 'Fauna One',
            'Faustina', 'Federant', 'Federo', 'Felipa', 'Fenix', 'Festive', 'Figtree', 'Finger Paint',
            'Finlandica', 'Fira Code', 'Fira Mono', 'Fira Sans', 'Fira Sans Condensed', 'Fira Sans Extra Condensed',
            'Fjalla One', 'Fjord One', 'Flamenco', 'Flavors', 'Fleur De Leah', 'Flow Block', 'Flow Circular',
            'Flow Rounded', 'Foldit', 'Fondamento', 'Fontdiner Swanky', 'Forum', 'Fragment Mono', 'Francois One',
            'Frank Ruhl Libre', 'Fraunces', 'Freckle Face', 'Fredericka the Great', 'Fredoka', 'Freehand',
            'Freeman', 'Fresca', 'Frijole', 'Fruktur', 'Fugaz One', 'Fuggles', 'Fuzzy Bubbles', 'GFS Didot',
            'GFS Neohellenic', 'Gabarito', 'Gabriela', 'Gaegu', 'Gafata', 'Gajraj One', 'Galada', 'Galdeano',
            'Galindo', 'Gamja Flower', 'Gantari', 'Gasoek One', 'Gayathri', 'Gelasio', 'Gemunu Libre',
            'Genos', 'Gentium Book Plus', 'Gentium Plus', 'Geo', 'Geologica', 'Georama', 'Georgia', 'Geostar',
            'Geostar Fill', 'Germania One', 'Gideon Roman', 'Gidugu', 'Gilda Display', 'Girassol', 'Give You Glory',
            'Glass Antiqua', 'Glegoo', 'Gloria Hallelujah', 'Glory', 'Gluten', 'Goblin One', 'Gochi Hand',
            'Goldman', 'Golos Text', 'Gorditas', 'Gothic A1', 'Gotu', 'Goudy Bookletter 1911', 'Gowun Batang',
            'Gowun Dodum', 'Graduate', 'Grand Hotel', 'Grandiflora One', 'Grandstander', 'Grape Nuts',
            'Gravitas One', 'Great Vibes', 'Grechen Fuemen', 'Grenze', 'Grenze Gotisch', 'Grey Qo', 'Griffy',
            'Gruppo', 'Gudea', 'Gugi', 'Gulzar', 'Gupter', 'Gurajada', 'Gwendolyn', 'Habibi', 'Hachi Maru Pop',
            'Hahmlet', 'Halant', 'Hammersmith One', 'Hanalei', 'Hanalei Fill', 'Handjet', 'Handlee', 'Hanken Grotesk',
            'Hanuman', 'Happy Monkey', 'Harmattan', 'Headland One', 'Heebo', 'Henny Penny', 'Hepta Slab',
            'Herr Von Muellerhoff', 'Hi Melody', 'Hina Mincho', 'Hind', 'Hind Guntur', 'Hind Madurai',
            'Hind Siliguri', 'Hind Vadodara', 'Holtwood One SC', 'Homemade Apple', 'Homenaje', 'Hubballi',
            'Hurricane', 'IBM Plex Mono', 'IBM Plex Sans', 'IBM Plex Sans Arabic', 'IBM Plex Sans Condensed',
            'IBM Plex Sans Devanagari', 'IBM Plex Sans Hebrew', 'IBM Plex Sans JP', 'IBM Plex Sans KR',
            'IBM Plex Sans Thai', 'IBM Plex Sans Thai Looped', 'IBM Plex Serif', 'IM Fell DW Pica',
            'IM Fell DW Pica SC', 'IM Fell Double Pica', 'IM Fell Double Pica SC', 'IM Fell English',
            'IM Fell English SC', 'IM Fell French Canon', 'IM Fell French Canon SC', 'IM Fell Great Primer',
            'IM Fell Great Primer SC', 'Ibarra Real Nova', 'Iceland', 'Imbue', 'Imperial Script', 'Imprima',
            'Inclusive Sans', 'Inconsolata', 'Inder', 'Indie Flower', 'Ingrid Darling', 'Inika', 'Inknut Antiqua',
            'Inria Sans', 'Inria Serif', 'Inspiration', 'Instrument Sans', 'Instrument Serif', 'Inter',
            'Inter Tight', 'Irish Grover', 'Island Moments', 'Istok Web', 'Italiana', 'Italianno', 'Itim',
            'Jacques Francois', 'Jacques Francois Shadow', 'Jaldi', 'JetBrains Mono', 'Jim Nightshade',
            'Joan', 'Jockey One', 'Jolly Lodger', 'Jomhuria', 'Jomolhari', 'Josefin Sans', 'Josefin Slab',
            'Jost', 'Joti One', 'Jua', 'Judson', 'Julee', 'Julius Sans One', 'Junge', 'Jura', 'Just Another Hand',
            'Just Me Again Down Here', 'K2D', 'Kablammo', 'Kadwa', 'Kaisei Decol', 'Kaisei HarunoUmi',
            'Kaisei Opti', 'Kaisei Tokumin', 'Kalam', 'Kalnia', 'Kameron', 'Kanit', 'Kantumruy', 'Kantumruy Pro',
            'Karantina', 'Karla', 'Karma', 'Katibeh', 'Kaushan Script', 'Kavivanar', 'Kavoon', 'Kay Pho Du',
            'Kdam Thmor Pro', 'Keania One', 'Kelly Slab', 'Kenia', 'Khand', 'Khmer', 'Khula', 'Kings',
            'Kirang Haerang', 'Kite One', 'Kiwi Maru', 'Klee One', 'Knewave', 'KoHo', 'Kodchasan', 'Kode Mono',
            'Koh Santepheap', 'Kolker Brush', 'Konkhmer Sleokchher', 'Kosugi', 'Kosugi Maru', 'Kotta One',
            'Koulen', 'Kranky', 'Kreon', 'Kristi', 'Krona One', 'Krub', 'Kufam', 'Kulim Park', 'Kumar One',
            'Kumar One Outline', 'Kumbh Sans', 'Kurale', 'LXGW WenKai Mono TC', 'LXGW WenKai TC', 'La Belle Aurore',
            'Labrada', 'Lacquer', 'Laila', 'Lakki Reddy', 'Lalezar', 'Lancelot', 'Langar', 'Lateef',
            'Lato', 'Lavishly Yours', 'League Gothic', 'League Script', 'League Spartan', 'Leckerli One',
            'Ledger', 'Lekton', 'Lemon', 'Lemonada', 'Lexend', 'Lexend Deca', 'Lexend Exa', 'Lexend Giga',
            'Lexend Mega', 'Lexend Peta', 'Lexend Tera', 'Lexend Zetta', 'Libre Barcode 128', 'Libre Barcode 128 Text',
            'Libre Barcode 39', 'Libre Barcode 39 Extended', 'Libre Barcode 39 Extended Text', 'Libre Barcode 39 Text',
            'Libre Barcode EAN13 Text', 'Libre Baskerville', 'Libre Bodoni', 'Libre Caslon Display',
            'Libre Caslon Text', 'Libre Franklin', 'Life Savers', 'Lilex', 'Lilita One', 'Lily Script One',
            'Limelight', 'Linden Hill', 'Lingo', 'Linefont', 'Lisu Bosa', 'Literata', 'Liu Jian Mao Cao',
            'Livvic', 'Lobster', 'Lobster Two', 'Londrina Outline', 'Londrina Shadow', 'Londrina Sketch',
            'Londrina Solid', 'Long Cang', 'Lora', 'Love Light', 'Love Ya Like A Sister', 'Loved by the King',
            'Lovers Quarrel', 'Luckiest Guy', 'Lugrasimo', 'Lumanosimo', 'Lunasima', 'Lusitana', 'Lustria',
            'Luxurious Roman', 'Luxurious Script', 'M PLUS 1', 'M PLUS 1 Code', 'M PLUS 1p', 'M PLUS 2',
            'M PLUS Code Latin', 'M PLUS Rounded 1c', 'Ma Shan Zheng', 'Macondo', 'Macondo Swash Caps',
            'Madimi One', 'Madura', 'Magra', 'Maiden Orange', 'Maitree', 'Major Mono Display', 'Mako',
            'Mali', 'Mallanna', 'Mandali', 'Manjari', 'Manrope', 'Mansalva', 'Manuale', 'Marcellus',
            'Marcellus SC', 'Marck Script', 'Margarine', 'Marhey', 'Markazi Text', 'Marko One', 'Marmelad',
            'Martel', 'Martel Sans', 'Martian Mono', 'Marvel', 'Mate', 'Mate SC', 'Material Icons',
            'Material Icons Outlined', 'Material Icons Round', 'Material Icons Sharp', 'Material Icons Two Tone',
            'Material Symbols Outlined', 'Material Symbols Rounded', 'Material Symbols Sharp', 'Math', 'Maven Pro',
            'McLaren', 'Mea Culpa', 'Meddon', 'MedievalSharp', 'Medula One', 'Meera Inimai', 'Megrim',
            'Meie Script', 'Meow Script', 'Merienda', 'Merriweather', 'Merriweather Sans', 'Metal', 'Metal Mania',
            'Metamorphous', 'Metrophobic', 'Michroma', 'Micro 5', 'Micro 5 Charted', 'Milonga', 'Miltonian',
            'Miltonian Tattoo', 'Mina', 'Mingzat', 'Miniver', 'Miriam Libre', 'Mirza', 'Miss Fajardose',
            'Mitr', 'Mochiy Pop One', 'Mochiy Pop P One', 'Modak', 'Modern Antiqua', 'Mogra', 'Mohave',
            'Moirai One', 'Molengo', 'Molle', 'Monda', 'Monofett', 'Monomaniac One', 'Monoton', 'Monsieur La Doulaise',
            'Montaga', 'Montagu Slab', 'MonteCarlo', 'Montez', 'Montserrat', 'Montserrat Alternates',
            'Montserrat Subrayada', 'Moo Lah Lah', 'Mooli', 'Moon Dance', 'Moul', 'Moulpali', 'Mountains of Christmas',
            'Mouse Memoirs', 'Mr Bedfort', 'Mr Dafoe', 'Mr De Haviland', 'Mrs Saint Delafield', 'Mrs Sheppards',
            'Ms Madi', 'Mukta', 'Mukta Mahee', 'Mukta Malar', 'Mukta Vaani', 'Mulish', 'Murecho', 'MuseoModerno',
            'My Soul', 'Mynerve', 'Mystery Quest', 'NTR', 'Nabla', 'Namdhinggo', 'Nanum Brush Script',
            'Nanum Gothic', 'Nanum Gothic Coding', 'Nanum Myeongjo', 'Nanum Pen Script', 'Narnoor', 'Neonderthaw',
            'Nerko One', 'Neucha', 'Neuton', 'New Amsterdam', 'New Rocker', 'New Tegomin', 'News Cycle',
            'Newsreader', 'Niconne', 'Nimbus Mono PS', 'Nimbus Roman', 'Nimbus Sans', 'Niramit', 'Nixie One',
            'Nobile', 'Nokora', 'Norican', 'Nosifer', 'Notable', 'Nothing You Could Do', 'Noticia Text',
            'Noto Color Emoji', 'Noto Emoji', 'Noto Kufi Arabic', 'Noto Music', 'Noto Naskh Arabic',
            'Noto Nastaliq Urdu', 'Noto Rashi Hebrew', 'Noto Sans', 'Noto Sans Adlam', 'Noto Sans Adlam Unjoined',
            'Noto Sans Anatolian Hieroglyphs', 'Noto Sans Arabic', 'Noto Sans Armenian', 'Noto Sans Avestan',
            'Noto Sans Balinese', 'Noto Sans Bamum', 'Noto Sans Bassa Vah', 'Noto Sans Batak', 'Noto Sans Bengali',
            'Noto Sans Bhaiksuki', 'Noto Sans Brahmi', 'Noto Sans Buginese', 'Noto Sans Buhid', 'Noto Sans Canadian Aboriginal',
            'Noto Sans Carian', 'Noto Sans Caucasian Albanian', 'Noto Sans Chakma', 'Noto Sans Cham',
            'Noto Sans Cherokee', 'Noto Sans Chorasmian', 'Noto Sans Coptic', 'Noto Sans Cuneiform',
            'Noto Sans Cypriot', 'Noto Sans Cypro Minoan', 'Noto Sans Deseret', 'Noto Sans Devanagari',
            'Noto Sans Display', 'Noto Sans Duployan', 'Noto Sans Egyptian Hieroglyphs', 'Noto Sans Elbasan',
            'Noto Sans Elymaic', 'Noto Sans Ethiopic', 'Noto Sans Fangsong', 'Noto Sans Georgian',
            'Noto Sans Glagolitic', 'Noto Sans Gothic', 'Noto Sans Grantha', 'Noto Sans Gujarati',
            'Noto Sans Gunjala Gondi', 'Noto Sans Gurmukhi', 'Noto Sans HK', 'Noto Sans Hanifi Rohingya',
            'Noto Sans Hanunoo', 'Noto Sans Hatran', 'Noto Sans Hebrew', 'Noto Sans Imperial Aramaic',
            'Noto Sans Indic Siyaq Numbers', 'Noto Sans Inscriptional Pahlavi', 'Noto Sans Inscriptional Parthian',
            'Noto Sans JP', 'Noto Sans Javanese', 'Noto Sans KR', 'Noto Sans Kaithi', 'Noto Sans Kannada',
            'Noto Sans Kawi', 'Noto Sans Kayah Li', 'Noto Sans Kharoshthi', 'Noto Sans Khmer', 'Noto Sans Khojki',
            'Noto Sans Khudawadi', 'Noto Sans Lao', 'Noto Sans Lao Looped', 'Noto Sans Lepcha', 'Noto Sans Limbu',
            'Noto Sans Linear A', 'Noto Sans Linear B', 'Noto Sans Lisu', 'Noto Sans Lycian', 'Noto Sans Lydian',
            'Noto Sans Mahajani', 'Noto Sans Malayalam', 'Noto Sans Mandaic', 'Noto Sans Manichaean',
            'Noto Sans Marchen', 'Noto Sans Masaram Gondi', 'Noto Sans Math', 'Noto Sans Mayan Numerals',
            'Noto Sans Medefaidrin', 'Noto Sans Meetei Mayek', 'Noto Sans Mende Kikakui', 'Noto Sans Meroitic',
            'Noto Sans Miao', 'Noto Sans Modi', 'Noto Sans Mongolian', 'Noto Sans Mono', 'Noto Sans Mro',
            'Noto Sans Multani', 'Noto Sans Myanmar', 'Noto Sans NKo', 'Noto Sans NKo Unjoined', 'Noto Sans Nabataean',
            'Noto Sans Nag Mundari', 'Noto Sans Nandinagari', 'Noto Sans New Tai Lue', 'Noto Sans Newa',
            'Noto Sans Nushu', 'Noto Sans Ogham', 'Noto Sans Ol Chiki', 'Noto Sans Old Hungarian',
            'Noto Sans Old Italic', 'Noto Sans Old North Arabian', 'Noto Sans Old Permic', 'Noto Sans Old Persian',
            'Noto Sans Old Sogdian', 'Noto Sans Old South Arabian', 'Noto Sans Old Turkic', 'Noto Sans Oriya',
            'Noto Sans Osage', 'Noto Sans Osmanya', 'Noto Sans Pahawh Hmong', 'Noto Sans Palmyrene',
            'Noto Sans Pau Cin Hau', 'Noto Sans Phags Pa', 'Noto Sans Phoenician', 'Noto Sans Psalter Pahlavi',
            'Noto Sans Rejang', 'Noto Sans Runic', 'Noto Sans SC', 'Noto Sans Samaritan', 'Noto Sans Saurashtra',
            'Noto Sans Sharada', 'Noto Sans Shavian', 'Noto Sans Siddham', 'Noto Sans SignWriting',
            'Noto Sans Sinhala', 'Noto Sans Sogdian', 'Noto Sans Sora Sompeng', 'Noto Sans Soyombo',
            'Noto Sans Sundanese', 'Noto Sans Syloti Nagri', 'Noto Sans Symbols', 'Noto Sans Symbols 2',
            'Noto Sans Syriac', 'Noto Sans Syriac Eastern', 'Noto Sans TC', 'Noto Sans Tagalog', 'Noto Sans Tagbanwa',
            'Noto Sans Tai Le', 'Noto Sans Tai Tham', 'Noto Sans Tai Viet', 'Noto Sans Takri', 'Noto Sans Tamil',
            'Noto Sans Tamil Supplement', 'Noto Sans Tangsa', 'Noto Sans Telugu', 'Noto Sans Thaana',
            'Noto Sans Thai', 'Noto Sans Thai Looped', 'Noto Sans Tifinagh', 'Noto Sans Tirhuta', 'Noto Sans Ugaritic',
            'Noto Sans Vai', 'Noto Sans Vithkuqi', 'Noto Sans Wancho', 'Noto Sans Warang Citi', 'Noto Sans Yi',
            'Noto Sans Zanabazar Square', 'Noto Serif', 'Noto Serif Ahom', 'Noto Serif Armenian', 'Noto Serif Balinese',
            'Noto Serif Bengali', 'Noto Serif Devanagari', 'Noto Serif Display', 'Noto Serif Dogra',
            'Noto Serif Ethiopic', 'Noto Serif Georgian', 'Noto Serif Grantha', 'Noto Serif Gujarati',
            'Noto Serif Gurmukhi', 'Noto Serif HK', 'Noto Serif Hebrew', 'Noto Serif JP', 'Noto Serif KR',
            'Noto Serif Kannada', 'Noto Serif Khitan Small Script', 'Noto Serif Khmer', 'Noto Serif Khojki',
            'Noto Serif Lao', 'Noto Serif Makasar', 'Noto Serif Malayalam', 'Noto Serif Myanmar', 'Noto Serif NP Hmong',
            'Noto Serif Old Uyghur', 'Noto Serif Oriya', 'Noto Serif Ottoman Siyaq', 'Noto Serif SC',
            'Noto Serif Sinhala', 'Noto Serif TC', 'Noto Serif Tamil', 'Noto Serif Tangut', 'Noto Serif Telugu',
            'Noto Serif Thai', 'Noto Serif Tibetan', 'Noto Serif Toto', 'Noto Serif Vithkuqi', 'Noto Serif Yezidi',
            'Noto Traditional Nushu', 'Nova Cut', 'Nova Flat', 'Nova Mono', 'Nova Oval', 'Nova Round',
            'Nova Script', 'Nova Slim', 'Nova Square', 'Numans', 'Nunito', 'Nunito Sans', 'Nuosu SIL',
            'Odibee Sans', 'Odor Mean Chey', 'Offside', 'Oi', 'Old Standard TT', 'Oldenburg', 'Ole',
            'Onest', 'Oleo Script', 'Oleo Script Swash Caps', 'Oooh Baby', 'Open Sans', 'Oranienbaum',
            'Orbit', 'Orbitron', 'Oregano', 'Orelega One', 'Orienta', 'Original Surfer', 'Oswald', 'Outfit',
            'Over the Rainbow', 'Overlock', 'Overlock SC', 'Overpass', 'Overpass Mono', 'Ovo', 'Oxanium',
            'Oxygen', 'Oxygen Mono', 'PT Mono', 'PT Sans', 'PT Sans Caption', 'PT Sans Narrow', 'PT Serif',
            'PT Serif Caption', 'Pacifico', 'Padauk', 'Padyakke Expanded One', 'Palanquin', 'Palanquin Dark',
            'Palette Mosaic', 'Pangolin', 'Paprika', 'Parisienne', 'Passero One', 'Passion One', 'Passions Conflict',
            'Pathway Extreme', 'Pathway Gothic One', 'Patrick Hand', 'Patrick Hand SC', 'Pattaya', 'Patua One',
            'Pavanam', 'Paytone One', 'Peddana', 'Peralta', 'Permanent Marker', 'Petemoss', 'Petit Formal Script',
            'Petrona', 'Philosopher', 'Phudu', 'Piazzolla', 'Piedra', 'Pinyon Script', 'Pirata One',
            'Pixelify Sans', 'Plaster', 'Play', 'Playball', 'Playfair', 'Playfair Display', 'Playfair Display SC',
            'Playpen Sans', 'Playwrite AR', 'Playwrite AT', 'Playwrite AU NSW', 'Playwrite AU QLD',
            'Playwrite AU SA', 'Playwrite AU TAS', 'Playwrite AU VIC', 'Playwrite BE VLG', 'Playwrite BE WAL',
            'Playwrite BR', 'Playwrite CA', 'Playwrite CL', 'Playwrite CO', 'Playwrite CU', 'Playwrite CZ',
            'Playwrite DE Grund', 'Playwrite DE LA', 'Playwrite DE SAS', 'Playwrite DE VA', 'Playwrite DK Loopet',
            'Playwrite DK Uloopet', 'Playwrite ES', 'Playwrite ES Deco', 'Playwrite FR Moderne', 'Playwrite FR Trad',
            'Playwrite GB J', 'Playwrite GB S', 'Playwrite HR', 'Playwrite HR Lijeva', 'Playwrite HU',
            'Playwrite ID', 'Playwrite IE', 'Playwrite IN', 'Playwrite IS', 'Playwrite IT Moderna',
            'Playwrite IT Trad', 'Playwrite MX', 'Playwrite NG Modern', 'Playwrite NL', 'Playwrite NO',
            'Playwrite NZ', 'Playwrite PE', 'Playwrite PL', 'Playwrite PT', 'Playwrite RO', 'Playwrite RU',
            'Playwrite SK', 'Playwrite TZ', 'Playwrite UA', 'Playwrite US Modern', 'Playwrite US Trad',
            'Playwrite VN', 'Playwrite ZA', 'Plus Jakarta Sans', 'Podkova', 'Poetsen One', 'Poiret One',
            'Poller One', 'Poltawski Nowy', 'Poly', 'Pompiere', 'Pontano Sans', 'Poor Story', 'Poppins',
            'Port Lligat Sans', 'Port Lligat Slab', 'Potta One', 'Pragati Narrow', 'Praise', 'Prata',
            'Preahvihear', 'Press Start 2P', 'Pridi', 'Princess Sofia', 'Prociono', 'Prompt', 'Prosto One',
            'Protest Guerrilla', 'Protest Revolution', 'Protest Riot', 'Protest Strike', 'Proza Libre',
            'Public Sans', 'Puppies Play', 'Puritan', 'Purple Purse', 'Qahiri', 'Quando', 'Quantico',
            'Quattrocento', 'Quattrocento Sans', 'Questrial', 'Quicksand', 'Quintessential', 'Qwigley',
            'Qwitcher Grypen', 'REM', 'Racing Sans One', 'Radio Canada', 'Radio Canada Big', 'Radley',
            'Rajdhani', 'Rakkas', 'Raleway', 'Raleway Dots', 'Ramabhadra', 'Ramaraja', 'Rambla', 'Rammetto One',
            'Rampart One', 'Ranchers', 'Rancho', 'Ranga', 'Rasa', 'Rationale', 'Ravi Prakash', 'Readex Pro',
            'Recursive', 'Red Hat Display', 'Red Hat Mono', 'Red Hat Text', 'Red Rose', 'Redacted',
            'Redacted Script', 'Reddit Mono', 'Reddit Sans', 'Reddit Sans Condensed', 'Redressed', 'Reem Kufi',
            'Reem Kufi Fun', 'Reem Kufi Ink', 'Reenie Beanie', 'Reggae One', 'Rethink Sans', 'Revalia',
            'Rhodium Libre', 'Ribeye', 'Ribeye Marrow', 'Righteous', 'Risque', 'Road Rage', 'Roboto',
            'Roboto Condensed', 'Roboto Flex', 'Roboto Mono', 'Roboto Serif', 'Roboto Slab', 'Rochester',
            'Rock 3D', 'Rock Salt', 'RocknRoll One', 'Rokkitt', 'Romanesco', 'Ropa Sans', 'Rosario',
            'Rosarivo', 'Rouge Script', 'Rowdies', 'Rozha One', 'Rubik', 'Rubik 80s Fade', 'Rubik Beastly',
            'Rubik Broken Fax', 'Rubik Bubbles', 'Rubik Burned', 'Rubik Dirt', 'Rubik Distressed',
            'Rubik Doodle Shadow', 'Rubik Doodle Triangles', 'Rubik Gemstones', 'Rubik Glitch', 'Rubik Glitch Pop',
            'Rubik Iso', 'Rubik Lines', 'Rubik Maps', 'Rubik Marker Hatch', 'Rubik Maze', 'Rubik Microbe',
            'Rubik Mono One', 'Rubik Moonrocks', 'Rubik One', 'Rubik Pixels', 'Rubik Puddles', 'Rubik Scribble',
            'Rubik Spray Paint', 'Rubik Storm', 'Rubik Vinyl', 'Rubik Wet Paint', 'Ruda', 'Rufina', 'Ruge Boogie',
            'Ruluko', 'Rum Raisin', 'Ruslan Display', 'Russo One', 'Ruthie', 'Ruwudu', 'Rye', 'STIX Two Text',
            'Sacramento', 'Sahitya', 'Sail', 'Saira', 'Saira Condensed', 'Saira Extra Condensed',
            'Saira Semi Condensed', 'Saira Stencil One', 'Salsa', 'Sanchez', 'Sancreek', 'Sansita',
            'Sansita Swashed', 'Sarabun', 'Sarala', 'Sarina', 'Sarpanch', 'Sassy Frass', 'Satisfy',
            'Satoshi', 'Sawarabi Gothic', 'Sawarabi Mincho', 'Scada', 'Scheherazade New', 'Schibsted Grotesk',
            'Schoolbell', 'Scope One', 'Seaweed Script', 'Secular One', 'Sedan', 'Sedan SC', 'Sedgwick Ave',
            'Sedgwick Ave Display', 'Sen', 'Send Flowers', 'Sevillana', 'Seymour One', 'Shadows Into Light',
            'Shadows Into Light Two', 'Shalimar', 'Shantell Sans', 'Shanti', 'Share', 'Share Tech',
            'Share Tech Mono', 'Shippori Antique', 'Shippori Antique B1', 'Shippori Mincho', 'Shippori Mincho B1',
            'Shizuru', 'Shojumaru', 'Short Stack', 'Shrikhand', 'Siemreap', 'Sigmar', 'Sigmar One',
            'Signika', 'Signika Negative', 'Silkscreen', 'Simonetta', 'Single Day', 'Sintony', 'Sirin Stencil',
            'Six Caps', 'Sixtyfour', 'Sixtyfour Convergence', 'Skranji', 'Slabo 13px', 'Slabo 27px',
            'Slackey', 'Slackside One', 'Smokum', 'Smooch', 'Smooch Sans', 'Smythe', 'Sniglet', 'Snippet',
            'Snowburst One', 'Sofadi One', 'Sofia', 'Sofia Sans', 'Sofia Sans Condensed', 'Sofia Sans Extra Condensed',
            'Sofia Sans Semi Condensed', 'Solitreo', 'Solway', 'Sometype Mono', 'Song Myung', 'Sono',
            'Sonsie One', 'Sora', 'Sorts Mill Goudy', 'Source Code Pro', 'Source Sans 3', 'Source Sans Pro',
            'Source Serif 4', 'Source Serif Pro', 'Space Grotesk', 'Space Mono', 'Special Elite', 'Spectral',
            'Spectral SC', 'Spicy Rice', 'Spinnaker', 'Spirax', 'Splash', 'Spline Sans', 'Spline Sans Mono',
            'Squada One', 'Square Peg', 'Sree Krushnadevaraya', 'Sriracha', 'Srisakdi', 'Staatliches',
            'Stalemate', 'Stalinist One', 'Stardos Stencil', 'Stick', 'Stick No Bills', 'Stint Ultra Condensed',
            'Stint Ultra Expanded', 'Stoke', 'Strait', 'Style Script', 'Stylish', 'Sue Ellen Francisco',
            'Suez One', 'Sulphur Point', 'Sumana', 'Sunflower', 'Sunshiney', 'Supermercado One', 'Sura',
            'Suranna', 'Suravaram', 'Suwannaphum', 'Swanky and Moo Moo', 'Syncopate', 'Syne', 'Syne Mono',
            'Syne Tactile', 'Tac One', 'Tajawal', 'Tangerine', 'Tapestry', 'Taprom', 'Tauri', 'Taviraj',
            'Teachers', 'Teko', 'Tektur', 'Telex', 'Tenali Ramakrishna', 'Tenor Sans', 'Text Me One',
            'Texturina', 'Thasadith', 'The Girl Next Door', 'The Nautigal', 'Tienne', 'Tillana', 'Tilt Neon',
            'Tilt Prism', 'Tilt Warp', 'Timmana', 'Tinos', 'Tiny5', 'Tiro Bangla', 'Tiro Devanagari Hindi',
            'Tiro Devanagari Marathi', 'Tiro Devanagari Sanskrit', 'Tiro Gurmukhi', 'Tiro Kannada',
            'Tiro Tamil', 'Tiro Telugu', 'Titan One', 'Titillium Web', 'Tomorrow', 'Tourney', 'Trade Winds',
            'Train One', 'Trirong', 'Trispace', 'Trocchi', 'Trochut', 'Truculenta', 'Trykker', 'Tsukimi Rounded',
            'Tulpen One', 'Turret Road', 'Twinkle Star', 'Ubuntu', 'Ubuntu Condensed', 'Ubuntu Mono',
            'Ubuntu Sans', 'Ubuntu Sans Mono', 'Uchen', 'Ultra', 'Unbounded', 'Uncial Antiqua', 'Underdog',
            'Unica One', 'UnifrakturCook', 'UnifrakturMaguntia', 'Unkempt', 'Unlock', 'Unna', 'Updock',
            'Urbanist', 'VT323', 'Vampiro One', 'Varela', 'Varela Round', 'Varta', 'Vast Shadow',
            'Vazirmatn', 'Vesper Libre', 'Viaoda Libre', 'Vibes', 'Vibur', 'Victor Mono', 'Vidaloka',
            'Viga', 'Vina Sans', 'Vinila', 'Voces', 'Volkhov', 'Vollkorn', 'Vollkorn SC', 'Voltaire',
            'Vujahday Script', 'Waiting for the Sunrise', 'Wallpoet', 'Walter Turncoat', 'Warnes',
            'Water Brush', 'Waterfall', 'Wavefont', 'Wellfleet', 'Wendy One', 'Whisper', 'WindSong',
            'Wire One', 'Wittgenstein', 'Wix Madefor Display', 'Wix Madefor Text', 'Work Sans', 'Workbench',
            'Xanh Mono', 'Yaldevi', 'Yanone Kaffeesatz', 'Yantramanav', 'Yarndings 12', 'Yarndings 12 Charted',
            'Yarndings 20', 'Yarndings 20 Charted', 'Yatra One', 'Yellowtail', 'Yeon Sung', 'Yeseva One',
            'Yesteryear', 'Yomogi', 'Young Serif', 'Yrsa', 'Ysabeau', 'Ysabeau Infant', 'Ysabeau Office',
            'Ysabeau SC', 'Yuji Boku', 'Yuji Hentaigana Akari', 'Yuji Hentaigana Akebono', 'Yuji Mai',
            'Yuji Syuku', 'Yusei Magic', 'ZCOOL KuaiLe', 'ZCOOL QingKe HuangYou', 'ZCOOL XiaoWei',
            'Zen Antique', 'Zen Antique Soft', 'Zen Dots', 'Zen Kaku Gothic Antique', 'Zen Kaku Gothic New',
            'Zen Kurenaido', 'Zen Loop', 'Zen Maru Gothic', 'Zen Old Mincho', 'Zen Tokyo Zoo', 'Zeyada',
            'Zhi Mang Xing', 'Zilla Slab', 'Zilla Slab Highlight'
        ],
        'Serif': [
            'Abril Fatface', 'Adamina', 'Alegreya', 'Alegreya SC', 'Alice', 'Alike', 'Alike Angular',
            'Amethysta', 'Amiri', 'Amiri Quran', 'Andada Pro', 'Andika', 'Anek Bangla', 'Anek Devanagari',
            'Anek Gujarati', 'Anek Gurmukhi', 'Anek Kannada', 'Anek Latin', 'Anek Malayalam', 'Anek Odia',
            'Anek Tamil', 'Anek Telugu', 'Angkor', 'Antic Didone', 'Antic Slab', 'Arapey', 'Arbutus Slab',
            'Archivo Black', 'Aref Ruqaa', 'Aref Ruqaa Ink', 'Arima', 'Arizonia', 'Arvo', 'Eczar',
            'Bitter', 'Bodoni Moda', 'BioRhyme', 'BioRhyme Expanded', 'Brawler', 'Bree Serif', 'Brygada 1918',
            'Buenard', 'Caladea', 'Cantata One', 'Cardo', 'Castoro', 'Caudex', 'Charis SIL', 'Cinzel',
            'Cinzel Decorative', 'Cormorant', 'Cormorant Garamond', 'Cormorant Infant', 'Cormorant SC',
            'Cormorant Unicase', 'Cormorant Upright', 'Coustard', 'Crete Round', 'Crimson Pro',
            'Crimson Text', 'Cutive', 'DM Serif Display', 'DM Serif Text', 'David Libre', 'Della Respira',
            'Domine', 'Donegal One', 'Eater', 'EB Garamond', 'Eczar', 'Elsie', 'Elsie Swash Caps',
            'Enriqueta', 'Esteban', 'Faustina', 'Fenix', 'Fjord One', 'Forum', 'Frank Ruhl Libre',
            'Fraunces', 'GFS Didot', 'GFS Neohellenic', 'Gabriela', 'Gelasio', 'Gentium Book Basic',
            'Gentium Book Plus', 'Gentium Plus', 'Gideon Roman', 'Gilda Display', 'Glegoo', 'Gloock',
            'Goudy Bookletter 1911', 'Gowun Batang', 'Grandstander', 'Gravitas One', 'Grenze', 'Grenze Gotisch',
            'Gupter', 'Gurajada', 'Habibi', 'Halant', 'Haviland', 'Holtwood One SC', 'Homenaje', 'IBM Plex Serif',
            'IM Fell DW Pica', 'IM Fell DW Pica SC', 'IM Fell Double Pica', 'IM Fell Double Pica SC',
            'IM Fell English', 'IM Fell English SC', 'IM Fell French Canon', 'IM Fell French Canon SC',
            'IM Fell Great Primer', 'IM Fell Great Primer SC', 'Ibarra Real Nova', 'Inika', 'Inknut Antiqua',
            'Iowan Old Style', 'Italiana', 'Jacques Francois', 'Jacques Francois Shadow', 'Jomhuria',
            'Josefin Slab', 'Joti One', 'Judson', 'Junge', 'Jura', 'Kadwa', 'Kaisei Decol', 'Kaisei HarunoUmi',
            'Kaisei Opti', 'Kaisei Tokumin', 'Kameron', 'Karantina', 'Karma', 'Katibeh', 'Kavivanar',
            'Kavoon', 'Kelly Slab', 'Khand', 'Koh Santepheap', 'Kotta One', 'Kreon', 'Kufam', 'Kurale',
            'Laila', 'Ledger', 'Lekton', 'Libre Baskerville', 'Libre Bodoni', 'Libre Caslon Display',
            'Libre Caslon Text', 'Linden Hill', 'Literata', 'Lora', 'Lusitana', 'Lustria', 'Macondo',
            'Macondo Swash Caps', 'Maitree', 'Manuale', 'Marcellus', 'Marcellus SC', 'Markazi Text',
            'Martel', 'Mate', 'Mate SC', 'Merriweather', 'Metal', 'Metal Mania', 'Milonga', 'Miniver',
            'Mirza', 'Modern Antiqua', 'Molengo', 'Montaga', 'Montagu Slab', 'Morgen', 'Mukta Mahee',
            'Mukta Malar', 'Mukta Vaani', 'Nanum Myeongjo', 'Neuton', 'Newsreader', 'Nixie One', 'Nokora',
            'Noticia Text', 'Noto Serif', 'Noto Serif Ahom', 'Noto Serif Armenian', 'Noto Serif Balinese',
            'Noto Serif Bengali', 'Noto Serif Devanagari', 'Noto Serif Display', 'Noto Serif Dogra',
            'Noto Serif Ethiopic', 'Noto Serif Georgian', 'Noto Serif Grantha', 'Noto Serif Gujarati',
            'Noto Serif Gurmukhi', 'Noto Serif HK', 'Noto Serif Hebrew', 'Noto Serif JP', 'Noto Serif KR',
            'Noto Serif Kannada', 'Noto Serif Khitan Small Script', 'Noto Serif Khmer', 'Noto Serif Khojki',
            'Noto Serif Lao', 'Noto Serif Makasar', 'Noto Serif Malayalam', 'Noto Serif Myanmar',
            'Noto Serif NP Hmong', 'Noto Serif Old Uyghur', 'Noto Serif Oriya', 'Noto Serif Ottoman Siyaq',
            'Noto Serif SC', 'Noto Serif Sinhala', 'Noto Serif TC', 'Noto Serif Tamil', 'Noto Serif Tangut',
            'Noto Serif Telugu', 'Noto Serif Thai', 'Noto Serif Tibetan', 'Noto Serif Toto', 'Noto Serif Vithkuqi',
            'Noto Serif Yezidi', 'Numans', 'Nunito', 'Odibee Sans', 'Odor Mean Chey', 'Offside', 'Old Standard TT',
            'Oleo Script', 'Oleo Script Swash Caps', 'Oranienbaum', 'Ovo', 'PT Serif', 'PT Serif Caption',
            'Passion One', 'Pathway Gothic One', 'Patua One', 'Peddana', 'Peralta', 'Petrona', 'Philosopher',
            'Piedra', 'Pirata One', 'Plaster', 'Playfair', 'Playfair Display', 'Playfair Display SC',
            'Podkova', 'Poiret One', 'Poly', 'Pontano Sans', 'Port Lligat Slab', 'Prata', 'Prociono',
            'Quando', 'Quattrocento', 'Radley', 'Ramaraja', 'Rasa', 'Rhodium Libre', 'Roboto Serif',
            'Roboto Slab', 'Rokkitt', 'Rosarivo', 'Rozha One', 'Rufina', 'Sahitya', 'Sansita', 'Sansita Swashed',
            'Sarabun', 'Sarala', 'Sarpanch', 'Scada', 'Scheherazade New', 'Scope One', 'Secular One',
            'Sedan', 'Sedan SC', 'Shippori Mincho', 'Shippori Mincho B1', 'Simonetta', 'Sintony', 'Skranji',
            'Slabo 13px', 'Slabo 27px', 'Smokum', 'Solway', 'Song Myung', 'Sorts Mill Goudy', 'Source Serif 4',
            'Source Serif Pro', 'Spectral', 'Spectral SC', 'Spline Sans', 'Squada One', 'Sree Krushnadevaraya',
            'Staatliches', 'Stalemate', 'Stardos Stencil', 'Stoke', 'Suez One', 'Sumana', 'Sura', 'Suranna',
            'Suravaram', 'Suwannaphum', 'Tajawal', 'Taprom', 'Tauri', 'Taviraj', 'Teko', 'Tenali Ramakrishna',
            'Tenor Sans', 'Texturina', 'Thasadith', 'Tienne', 'Tillana', 'Timmana', 'Tinos', 'Tiro Bangla',
            'Tiro Devanagari Hindi', 'Tiro Devanagari Marathi', 'Tiro Devanagari Sanskrit', 'Tiro Gurmukhi',
            'Tiro Kannada', 'Tiro Tamil', 'Tiro Telugu', 'Titan One', 'Trade Winds', 'Trirong', 'Trocchi',
            'Trykker', 'Tulpen One', 'Ultra', 'Uncial Antiqua', 'Unica One', 'UnifrakturCook', 'UnifrakturMaguntia',
            'Unkempt', 'Unlock', 'Unna', 'Varela', 'Varela Round', 'Varta', 'Vast Shadow', 'Vesper Libre',
            'Viaoda Libre', 'Vidaloka', 'Viga', 'Voces', 'Volkhov', 'Vollkorn', 'Vollkorn SC', 'Voltaire',
            'Wallpoet', 'Wellfleet', 'Wendy One', 'Wire One', 'Yanone Kaffeesatz', 'Yantramanav', 'Yatra One',
            'Yellowtail', 'Yeseva One', 'Yesteryear', 'Young Serif', 'Yrsa', 'Ysabeau', 'Ysabeau Infant',
            'Ysabeau Office', 'Ysabeau SC', 'Yusei Magic', 'Zilla Slab', 'Zilla Slab Highlight'
        ],
        'Mono': [
            'Anonymous Pro', 'Azeret Mono', 'B612 Mono', 'Chivo Mono', 'Courier Prime', 'Cousine',
            'Cutive Mono', 'DM Mono', 'Fira Code', 'Fira Mono', 'Fragment Mono', 'IBM Plex Mono',
            'Inconsolata', 'JetBrains Mono', 'Kode Mono', 'Lekton', 'Lilex', 'M PLUS 1 Code',
            'M PLUS Code Latin', 'Major Mono Display', 'Martian Mono', 'Monofett', 'Nanum Gothic Coding',
            'Nimbus Mono PS', 'Noto Sans Mono', 'Nova Mono', 'Overpass Mono', 'Oxygen Mono', 'PT Mono',
            'Recursive', 'Red Hat Mono', 'Roboto Mono', 'Share Tech Mono', 'Sometype Mono', 'Source Code Pro',
            'Space Mono', 'Spline Sans Mono', 'Syne Mono', 'Ubuntu Mono', 'Ubuntu Sans Mono', 'VT323',
            'Victor Mono', 'Xanh Mono'
        ]
    };
    
    // Store selected fonts globally - will be updated when settings are loaded
    let selectedFonts = {
        heading: 'assistant',
        body: 'roboto',
        menu: 'assistant',
        product: 'assistant',
        buttons: 'assistant'
    };
    
    // Function to initialize font selectors with search
    window.initializeFontSelectors = function() {
        console.log('Initializing font selectors...');
        console.log('Found font search inputs:', $('.font-search-input').length);
        
        // Remove any existing dropdowns first
        $('.font-dropdown').remove();
        
        // Create font dropdown functionality for each font selector
        $('.font-search-input').each(function() {
            const searchInput = $(this);
            const fontType = searchInput.data('font-type');
            const previewText = searchInput.siblings('.font-preview-text');
            
            console.log('Setting up font selector for:', fontType);
            
            // Set current font value from currentGlobalThemeSettings or selectedFonts
            let currentFont = selectedFonts[fontType];
            
            // Check if we have a saved value in currentGlobalThemeSettings
            if (currentGlobalThemeSettings?.typography?.[fontType]?.font) {
                currentFont = currentGlobalThemeSettings.typography[fontType].font;
                selectedFonts[fontType] = currentFont; // Update selectedFonts
            }
            
            // Use default values if no font is set
            if (!currentFont) {
                currentFont = fontType === 'body' ? 'roboto' : 'assistant';
            }
            
            searchInput.val(getFontDisplayName(currentFont));
            searchInput.attr('data-font-value', currentFont);
            updateFontPreview(previewText, currentFont);
            
            // Create dropdown container
            const dropdown = $('<div class="font-dropdown" style="display:none;"></div>');
            searchInput.parent().append(dropdown);
            
            // Remove existing event handlers before binding new ones
            searchInput.off('focus input');
            
            // Search input events
            searchInput.on('focus', function() {
                console.log('Font search focused:', fontType);
                showFontDropdown(dropdown, searchInput.val(), fontType, searchInput, previewText);
            });
            
            searchInput.on('input', function() {
                console.log('Font search input:', searchInput.val());
                showFontDropdown(dropdown, searchInput.val(), fontType, searchInput, previewText);
            });
        });
        
        // Hide dropdown on click outside - remove existing handler first
        $(document).off('click.fontDropdown').on('click.fontDropdown', function(e) {
            $('.font-dropdown').each(function() {
                const dropdown = $(this);
                const wrapper = dropdown.parent();
                if (!wrapper.is(e.target) && wrapper.has(e.target).length === 0) {
                    dropdown.hide();
                }
            });
        });
    }
    
    // Function to get font display name
    window.getFontDisplayName = function(fontValue) {
        // If no value, return empty string
        if (!fontValue) return '';
        
        // Convert font value to display name - comprehensive mapping
        const fontMap = {
            'assistant': 'Assistant',
            'roboto': 'Roboto',
            'open-sans': 'Open Sans',
            'lato': 'Lato',
            'montserrat': 'Montserrat',
            'poppins': 'Poppins',
            'inter': 'Inter',
            'raleway': 'Raleway',
            'playfair-display': 'Playfair Display',
            'oswald': 'Oswald',
            'helvetica': 'Helvetica',
            'georgia': 'Georgia',
            'arial': 'Arial',
            'times-new-roman': 'Times New Roman',
            'courier-new': 'Courier New',
            'tisa-sans': 'FF Tisa Sans'
        };
        
        // Return mapped value or convert kebab-case to Title Case
        return fontMap[fontValue.toLowerCase()] || fontValue.split('-').map(word => 
            word.charAt(0).toUpperCase() + word.slice(1)
        ).join(' ');
    }
    
    // Function to show font dropdown
    window.showFontDropdown = function(dropdown, searchTerm, fontType, searchInput, previewText) {
        console.log('showFontDropdown called with term:', searchTerm, 'for type:', fontType);
        dropdown.empty();
        const term = searchTerm.toLowerCase();
        let hasResults = false;
        
        // Add a header to the dropdown
        dropdown.append(`<div class="font-dropdown-header">Select a font</div>`);
        
        // Search through all fonts
        Object.entries(allFonts).forEach(([category, fonts]) => {
            const matchingFonts = fonts.filter(font => 
                font.toLowerCase().includes(term)
            );
            
            if (matchingFonts.length > 0) {
                hasResults = true;
                
                // Add category header
                const categoryDiv = $(`<div class="font-category">${category}</div>`);
                dropdown.append(categoryDiv);
                
                // Show max 15 fonts per category for better UX
                matchingFonts.slice(0, 15).forEach(font => {
                    const fontValue = font.toLowerCase().replace(/\s+/g, '-');
                    const isSelected = selectedFonts[fontType] === fontValue;
                    const fontItem = $(`<div class="font-item ${isSelected ? 'selected' : ''}" data-value="${fontValue}">
                        <span class="font-name">${font}</span>
                        ${isSelected ? '<i class="material-icons font-check">check</i>' : ''}
                    </div>`);
                    
                    // Update font preview on hover
                    fontItem.on('mouseenter', function() {
                        updateFontPreview(previewText, fontValue);
                    });
                    
                    // Restore original font on mouse leave if not clicked
                    fontItem.on('mouseleave', function() {
                        updateFontPreview(previewText, selectedFonts[fontType]);
                    });
                    
                    // Select font on click
                    fontItem.on('click', function() {
                        selectedFonts[fontType] = fontValue;
                        searchInput.val(font);
                        searchInput.attr('data-font-value', fontValue);
                        searchInput.data('font-value', fontValue); // Also update data property
                        updateFontPreview(previewText, fontValue);
                        dropdown.hide();
                        
                        // Trigger change event for any listeners
                        searchInput.trigger('change'); // Trigger standard change event
                        searchInput.trigger('fontChanged', [fontType, fontValue]);
                        
                        console.log(`Font selected for ${fontType}:`, font, '(', fontValue, ')');
                    });
                    
                    dropdown.append(fontItem);
                });
            }
        });
        
        if (hasResults) {
            dropdown.show();
        } else {
            // Show no results message
            dropdown.html('<div class="font-no-results">No fonts found matching your search</div>');
            dropdown.show();
        }
    }
    
    // Function to update font preview
    window.updateFontPreview = function(previewElement, fontValue) {
        if (!fontValue) return;
        
        // Map font value to actual font family
        const fontFamilies = {
            // Sans Serif
            'abel': "'Abel', sans-serif",
            'archivo': "'Archivo', sans-serif",
            'archivo-narrow': "'Archivo Narrow', sans-serif",
            'arimo': "'Arimo', sans-serif",
            'assistant': "'Assistant', sans-serif",
            'avenir-next': "'Avenir Next', sans-serif",
            'bebas-neue': "'Bebas Neue', cursive",
            'cabin': "'Cabin', sans-serif",
            'chivo': "'Chivo', sans-serif",
            'din-next': "'DIN Next', sans-serif",
            'din-1451': "'DIN 1451', sans-serif",
            'dosis': "'Dosis', sans-serif",
            'electra': "'Electra', sans-serif",
            'fjalla-one': "'Fjalla One', sans-serif",
            'futura': "'Futura', sans-serif",
            'harmonia-sans': "'Harmonia Sans', sans-serif",
            'helvetica': "Helvetica, Arial, sans-serif",
            'josefin-sans': "'Josefin Sans', sans-serif",
            'karla': "'Karla', sans-serif",
            'lato': "'Lato', sans-serif",
            'libre-franklin': "'Libre Franklin', sans-serif",
            'montserrat': "'Montserrat', sans-serif",
            'noto-sans': "'Noto Sans', sans-serif",
            'nunito-sans': "'Nunito Sans', sans-serif",
            'open-sans': "'Open Sans', sans-serif",
            'oswald': "'Oswald', sans-serif",
            'oxygen': "'Oxygen', sans-serif",
            'poppins': "'Poppins', sans-serif",
            'pt-sans': "'PT Sans', sans-serif",
            'questrial': "'Questrial', sans-serif",
            'raleway': "'Raleway', sans-serif",
            'roboto': "'Roboto', sans-serif",
            'rubik': "'Rubik', sans-serif",
            'source-sans-pro': "'Source Sans Pro', sans-serif",
            'titillium-web': "'Titillium Web', sans-serif",
            'tisa-sans': "'FF Tisa Sans', sans-serif",
            'ubuntu': "'Ubuntu', sans-serif",
            'univers-next': "'Univers Next', sans-serif",
            'work-sans': "'Work Sans', sans-serif",
            'zurich': "'Zurich', sans-serif",
            // Serif
            'arvo': "'Arvo', serif",
            'bitter': "'Bitter', serif",
            'bodoni': "'Bodoni', serif",
            'baskerville': "'Baskerville', serif",
            'caslon': "'Caslon', serif",
            'centaur': "'Centaur', serif",
            'century-schoolbook': "'Century Schoolbook', serif",
            'cardo': "'Cardo', serif",
            'cormorant': "'Cormorant', serif",
            'crimson-text': "'Crimson Text', serif",
            'david-libre': "'David Libre', serif",
            'eb-garamond': "'EB Garamond', serif",
            'eczar': "'Eczar', serif",
            'garamond': "'Garamond', serif",
            'georgia': "Georgia, serif",
            'iowan-old-style': "'Iowan Old Style', serif",
            'libre-baskerville': "'Libre Baskerville', serif",
            'lora': "'Lora', serif",
            'merriweather': "'Merriweather', serif",
            'noticia-text': "'Noticia Text', serif",
            'noto-serif': "'Noto Serif', serif",
            'playfair': "'Playfair Display', serif",
            'playfair-display': "'Playfair Display', serif",
            'pt-serif': "'PT Serif', serif",
            'roboto-slab': "'Roboto Slab', serif",
            'source-serif-pro': "'Source Serif Pro', serif",
            'times': "'Times New Roman', Times, serif",
            'times-new-roman': "'Times New Roman', Times, serif",
            'vollkorn': "'Vollkorn', serif",
            // Mono
            'anonymous-pro': "'Anonymous Pro', monospace",
            'consolas': "'Consolas', monospace",
            'courier': "'Courier New', Courier, monospace",
            'courier-new': "'Courier New', Courier, monospace",
            'fira-mono': "'Fira Mono', monospace",
            'ibm-plex-mono': "'IBM Plex Mono', monospace",
            'inconsolata': "'Inconsolata', monospace",
            'menlo': "'Menlo', monospace",
            'monaco': "'Monaco', monospace",
            'noto-sans-mono': "'Noto Sans Mono', monospace",
            'roboto-mono': "'Roboto Mono', monospace",
            'source-code-pro': "'Source Code Pro', monospace",
            'lucida-console': "'Lucida Console', monospace",
            'arial': "Arial, sans-serif",
            'verdana': "Verdana, sans-serif",
            'tahoma': "Tahoma, sans-serif",
            'trebuchet': "'Trebuchet MS', sans-serif",
            'lucida': "'Lucida Grande', sans-serif",
            'palatino': "'Palatino', serif"
        };
        
        const fontFamily = fontFamilies[fontValue] || "'" + getFontDisplayName(fontValue) + "', sans-serif";
        previewElement.css('font-family', fontFamily);
    }
    
    let selectedElement = null;
    
    // Initialize drag and drop
    initializeDragAndDrop();
    
    // Initialize element selection
    initializeElementSelection();
    
    function initializeDragAndDrop() {
        // Make component items draggable
        $('.component-item').on('dragstart', function(e) {
            e.originalEvent.dataTransfer.effectAllowed = 'copy';
            e.originalEvent.dataTransfer.setData('componentType', $(this).find('span').text());
            $(this).addClass('dragging');
        });
        
        $('.component-item').on('dragend', function(e) {
            $(this).removeClass('dragging');
        });
        
        // Make canvas accept drops
        const canvas = $('#builderCanvas');
        
        canvas.on('dragover', function(e) {
            e.preventDefault();
            e.originalEvent.dataTransfer.dropEffect = 'copy';
            $(this).addClass('drag-over');
        });
        
        canvas.on('dragleave', function(e) {
            if (e.target === this) {
                $(this).removeClass('drag-over');
            }
        });
        
        canvas.on('drop', function(e) {
            e.preventDefault();
            $(this).removeClass('drag-over');
            
            const componentType = e.originalEvent.dataTransfer.getData('componentType');
            const dropPosition = {
                x: e.originalEvent.offsetX,
                y: e.originalEvent.offsetY
            };
            
            // Remove empty state if it exists
            $('.empty-state').remove();
            
            // Add component to canvas
            addComponentToCanvas(componentType, dropPosition);
        });
    }
    
    function addComponentToCanvas(type, position) {
        let element;
        
        switch(type) {
            case 'Text Block':
                element = $('<div class="builder-element text-element" contenteditable="true">Click to edit this text</div>');
                break;
            case 'Image':
                element = $('<div class="builder-element image-element"><img src="https://via.placeholder.com/300x200" alt="Placeholder"/></div>');
                break;
            case 'Columns':
                element = $('<div class="builder-element columns-element row"><div class="col s6"><p>Column 1</p></div><div class="col s6"><p>Column 2</p></div></div>');
                break;
            case 'Button':
                element = $('<div class="builder-element button-element"><a class="btn waves-effect waves-light">Button</a></div>');
                break;
        }
        
        if (element) {
            element.css({
                'margin-bottom': '1rem'
            });
            
            $('#builderCanvas').append(element);
            
            // Select the newly added element
            selectElement(element);
        }
    }
    
    function initializeElementSelection() {
        // Click handler for selecting elements
        $(document).on('click', '.builder-element', function(e) {
            e.stopPropagation();
            selectElement($(this));
        });
        
        // Click on canvas to deselect
        $('#builderCanvas').on('click', function(e) {
            if (e.target === this) {
                deselectElement();
            }
        });
        
        // Delete key handler
        $(document).on('keydown', function(e) {
            if (e.key === 'Delete' && selectedElement && !$(e.target).is('[contenteditable]')) {
                selectedElement.remove();
                deselectElement();
                
                // Show empty state if no elements left
                if ($('#builderCanvas .builder-element').length === 0) {
                    $('#builderCanvas').html('<div class="empty-state"><i class="material-icons">web</i><p>Drag components here to start building your website</p></div>');
                }
            }
        });
    }
    
    function selectElement(element) {
        // Remove previous selection
        $('.builder-element').removeClass('selected');
        
        // Select new element
        element.addClass('selected');
        selectedElement = element;
        
        // Update properties panel
        updatePropertiesPanel(element);
    }
    
    function deselectElement() {
        $('.builder-element').removeClass('selected');
        selectedElement = null;
        
        // Reset properties panel
        $('.properties-content').html('<p class="empty-properties">Select an element to edit its properties</p>');
    }
    
    function updatePropertiesPanel(element) {
        let propertiesHtml = '';
        
        if (element.hasClass('text-element')) {
            propertiesHtml = `
                <div class="property-group">
                    <label>Text Alignment</label>
                    <select class="browser-default" id="textAlign">
                        <option value="left">Left</option>
                        <option value="center">Center</option>
                        <option value="right">Right</option>
                    </select>
                </div>
                <div class="property-group">
                    <label>Font Size</label>
                    <input type="range" min="12" max="48" value="16" id="fontSize">
                </div>
            `;
        } else if (element.hasClass('image-element')) {
            propertiesHtml = `
                <div class="property-group">
                    <label>Image URL</label>
                    <input type="text" placeholder="Enter image URL" id="imageUrl">
                </div>
                <div class="property-group">
                    <label>Alt Text</label>
                    <input type="text" placeholder="Alt text" id="altText">
                </div>
            `;
        } else if (element.hasClass('button-element')) {
            propertiesHtml = `
                <div class="property-group">
                    <label>Button Text</label>
                    <input type="text" value="Button" id="buttonText">
                </div>
                <div class="property-group">
                    <label>Button Color</label>
                    <select class="browser-default" id="buttonColor">
                        <option value="">Default</option>
                        <option value="red">Red</option>
                        <option value="green">Green</option>
                        <option value="blue">Blue</option>
                    </select>
                </div>
            `;
        }
        
        $('.properties-content').html(propertiesHtml);
        
        // Bind property change handlers
        bindPropertyHandlers(element);
    }
    
    function bindPropertyHandlers(element) {
        // Text alignment
        $('#textAlign').on('change', function() {
            element.css('text-align', $(this).val());
        });
        
        // Font size
        $('#fontSize').on('input', function() {
            element.css('font-size', $(this).val() + 'px');
        });
        
        // Image URL
        $('#imageUrl').on('change', function() {
            element.find('img').attr('src', $(this).val());
        });
        
        // Alt text
        $('#altText').on('change', function() {
            element.find('img').attr('alt', $(this).val());
        });
        
        // Button text
        $('#buttonText').on('input', function() {
            element.find('.btn').text($(this).val());
        });
        
        // Button color
        $('#buttonColor').on('change', function() {
            const btn = element.find('.btn');
            btn.removeClass('red green blue');
            if ($(this).val()) {
                btn.addClass($(this).val());
            }
        });
    }
    
    // Function to initialize swatches range inputs
    function initializeSwatchesRangeInputs() {
        console.log('Initializing swatches range inputs...');
        
        // Initialize all range inputs in the swatches section
        $('.shopify-range').each(function() {
            const rangeInput = $(this);
            const valueDisplay = rangeInput.closest('div').find('.range-value');
            
            // Update display value when range changes
            rangeInput.on('input', function() {
                valueDisplay.text($(this).val());
            });
            
            // Set initial value
            valueDisplay.text(rangeInput.val());
        });
    }
    
    // Expose functions globally for debugging
    window.initializeDragAndDrop = initializeDragAndDrop;
    window.makeSubsectionsCollapsible = makeSubsectionsCollapsible;
    
    // Manual drag and drop initialization
    window.manualDragDrop = function() {
        console.log('=== MANUAL DRAG AND DROP ===');
        
        const $container = $('.sidebar-section-content').first();
        console.log('Container:', $container.length, $container.is(':visible'));
        
        // Make sure drag handles exist
        const $subsections = $container.find('.sidebar-subsection[data-block-type="announcement"], .sidebar-subsection[data-block-type="header"]');
        console.log('Subsections to make draggable:', $subsections.length);
        
        $subsections.each(function() {
            const $this = $(this);
            if (!$this.find('.drag-handle').length) {
                $this.prepend('<i class="material-icons drag-handle" style="position: absolute; left: 8px; top: 50%; transform: translateY(-50%); cursor: grab; font-size: 20px; color: #8c9196;">drag_handle</i>');
            }
        });
        
        // Apply sortable
        $container.sortable({
            items: '.sidebar-subsection[data-block-type="announcement"], .sidebar-subsection[data-block-type="header"]',
            handle: '.drag-handle',
            axis: 'y',
            start: function(e, ui) {
                console.log('DRAGGING!');
            },
            stop: function(e, ui) {
                console.log('DROPPED!');
            }
        });
        
        console.log('Sortable applied. Try dragging now.');
    };
    
    // Simple drag and drop test
    window.testDragDrop = function() {
        console.log('=== DIAGNÓSTICO COMPLETO DE DRAG AND DROP ===');
        
        // 1. Verificar estructura
        const $firstSection = $('.sidebar-section').first();
        const $sectionContent = $firstSection.find('.sidebar-section-content');
        const $subsections = $sectionContent.find('.sidebar-subsection');
        const $dragHandles = $sectionContent.find('.drag-handle');
        
        console.log('1. ESTRUCTURA:');
        console.log('  - Primera sección:', $firstSection.length);
        console.log('  - Contenido de sección:', $sectionContent.length);
        console.log('  - Subsecciones:', $subsections.length);
        console.log('  - Drag handles:', $dragHandles.length);
        
        // 2. Verificar jQuery UI
        console.log('\n2. JQUERY UI:');
        console.log('  - jQuery version:', $.fn.jquery);
        console.log('  - jQuery UI loaded:', typeof $.ui !== 'undefined');
        console.log('  - Sortable disponible:', typeof $.fn.sortable !== 'undefined');
        
        // 3. Verificar CSS y posicionamiento
        console.log('\n3. CSS Y POSICIONAMIENTO:');
        $dragHandles.each(function(i) {
            const $handle = $(this);
            const position = $handle.position();
            const css = {
                position: $handle.css('position'),
                opacity: $handle.css('opacity'),
                cursor: $handle.css('cursor'),
                display: $handle.css('display'),
                visibility: $handle.css('visibility'),
                pointerEvents: $handle.css('pointer-events')
            };
            console.log(`  Drag handle ${i}:`, css, 'Position:', position);
        });
        
        // 4. Probar sortable
        console.log('\n4. PRUEBA DE SORTABLE:');
        if ($sectionContent.length > 0) {
            // Destruir sortable existente
            if ($sectionContent.hasClass('ui-sortable')) {
                console.log('  - Destruyendo sortable existente...');
                $sectionContent.sortable('destroy');
            }
            
            // Aplicar sortable nuevo
            try {
                $sectionContent.sortable({
                    items: '.sidebar-subsection',
                    handle: '.drag-handle',
                    axis: 'y',
                    tolerance: 'pointer',
                    start: function(e, ui) {
                        console.log('  ✓ EVENTO START DISPARADO');
                        console.log('    - Elemento:', ui.item.data('block-type'));
                        console.log('    - Handle usado:', ui.helper.find('.drag-handle').length);
                    },
                    sort: function(e, ui) {
                        console.log('  ✓ SORTING...');
                    },
                    stop: function(e, ui) {
                        console.log('  ✓ EVENTO STOP DISPARADO');
                    }
                });
                
                console.log('  - Sortable aplicado');
                console.log('  - Es sortable:', $sectionContent.hasClass('ui-sortable'));
                
                // Verificar opciones
                const options = $sectionContent.sortable('option');
                console.log('  - Opciones del sortable:', {
                    handle: options.handle,
                    items: options.items,
                    axis: options.axis
                });
                
            } catch (e) {
                console.error('  Error:', e);
            }
        }
        
        // 5. Test de eventos
        console.log('\n5. TEST DE EVENTOS:');
        console.log('  - Prueba hacer clic y arrastrar un drag handle');
        console.log('  - Los eventos deberían aparecer arriba');
        
        console.log('\n=== FIN DEL DIAGNÓSTICO ===');
    };
    
    // Test function to verify everything is working
    window.testWebsiteBuilder = function() {
        console.log('=== TESTING WEBSITE BUILDER ===');
        
        // Test 1: Check if subsections exist
        const $announcement = $('.sidebar-subsection[data-block-type="announcement"]');
        const $header = $('.sidebar-subsection[data-block-type="header"]');
        console.log('Announcement section exists:', $announcement.length > 0);
        console.log('Header section exists:', $header.length > 0);
        
        // Test 2: Check collapse indicators
        const $collapseIndicators = $('.collapse-indicator');
        console.log('Collapse indicators found:', $collapseIndicators.length);
        $collapseIndicators.each(function(i) {
            console.log(`  Indicator ${i}:`, $(this).parent().data('block-type'));
        });
        
        // Test 3: Check drag handles
        const $dragHandles = $('.drag-handle');
        console.log('Drag handles found:', $dragHandles.length);
        $dragHandles.each(function(i) {
            console.log(`  Drag handle ${i}:`, $(this).parent().data('block-type'));
        });
        
        // Test 4: Check if sortable is applied
        const $container = $announcement.parent();
        console.log('Container is sortable:', $container.hasClass('ui-sortable'));
        
        // Test 5: Check add announcement button
        const $addButton = $('.add-announcement-button');
        console.log('Add announcement button exists:', $addButton.length > 0);
        console.log('Add announcement button visible:', $addButton.is(':visible'));
        
        console.log('=== END OF TEST ===');
    };
    
    // Diagnose icons issue
    window.diagnoseIcons = function() {
        console.log('=== DIAGNÓSTICO DE ICONOS ===');
        
        // Buscar todos los iconos en las subsecciones
        $('.sidebar-subsection').each(function(index) {
            const $sub = $(this);
            const type = $sub.data('block-type');
            console.log(`\nSubsección ${index} (${type}):`);
            
            // Listar todos los iconos
            $sub.find('i.material-icons').each(function(i) {
                const $icon = $(this);
                console.log(`  Icon ${i}:`, {
                    text: $icon.text(),
                    classes: $icon.attr('class'),
                    display: $icon.css('display'),
                    visibility: $icon.css('visibility'),
                    opacity: $icon.css('opacity'),
                    position: $icon.css('position'),
                    parent: $icon.parent().prop('tagName')
                });
            });
            
            // Ver el HTML completo
            console.log('  HTML:', $sub.html().substring(0, 200) + '...');
        });
        
        // Buscar iconos view_agenda específicamente
        const $viewAgenda = $('i.material-icons:contains("view_agenda")');
        console.log('\nIconos view_agenda encontrados:', $viewAgenda.length);
        
        // Buscar sección de header completa
        const $headerSection = $('.sidebar-section').first();
        console.log('\nPrimera sección HTML:', $headerSection.html().substring(0, 300) + '...');
    };
});

// Additional styles for the builder
const style = document.createElement('style');
style.textContent = `
    .builder-element {
        position: relative;
        padding: 0.5rem;
        border: 2px solid transparent;
        transition: border-color 0.2s;
        cursor: pointer;
    }
    
    .builder-element:hover {
        border-color: #e0e0e0;
    }
    
    .builder-element.selected {
        border-color: #2196F3;
    }
    
    .dragging {
        opacity: 0.5;
    }
    
    .drag-over {
        background-color: #f0f0f0 !important;
    }
    
    .dark-mode .drag-over {
        background-color: #333 !important;
    }
    
    .property-group {
        margin-bottom: 1rem;
    }
    
    .property-group label {
        display: block;
        font-size: 0.9rem;
        margin-bottom: 0.5rem;
        color: #666;
    }
    
    .dark-mode .property-group label {
        color: #ccc;
    }
    
    .property-group input[type="text"],
    .property-group select {
        width: 100%;
        padding: 0.5rem;
        border: 1px solid #ddd;
        border-radius: 4px;
    }
    
    .dark-mode .property-group input[type="text"],
    .dark-mode .property-group select {
        background-color: #1a1a1a;
        border-color: #444;
        color: #fff;
    }
    
    /* Appearance Settings Styles */
    .slider-container {
        display: flex;
        align-items: center;
        gap: 16px;
    }

    .settings-slider {
        flex: 1;
        height: 6px;
        -webkit-appearance: none;
        appearance: none;
        background: #dfe0e1;
        outline: none;
        border-radius: 3px;
        transition: background 0.1s ease;
    }

    .dark-mode .settings-slider {
        background: #404040;
    }

    .settings-slider:hover {
        background: #c9cccf;
    }

    .dark-mode .settings-slider:hover {
        background: #616161;
    }

    .settings-slider::-webkit-slider-thumb {
        -webkit-appearance: none;
        appearance: none;
        width: 20px;
        height: 20px;
        background: #202223;
        cursor: pointer;
        border-radius: 50%;
        transition: all 0.1s ease;
    }

    .dark-mode .settings-slider::-webkit-slider-thumb {
        background: #e3e3e3;
    }

    .settings-slider::-webkit-slider-thumb:hover {
        transform: scale(1.1);
        box-shadow: 0 2px 8px rgba(0,0,0,0.15);
    }

    .settings-slider::-moz-range-thumb {
        width: 20px;
        height: 20px;
        background: #202223;
        cursor: pointer;
        border-radius: 50%;
        border: none;
        transition: all 0.1s ease;
    }

    .dark-mode .settings-slider::-moz-range-thumb {
        background: #e3e3e3;
    }

    .settings-slider::-moz-range-thumb:hover {
        transform: scale(1.1);
        box-shadow: 0 2px 8px rgba(0,0,0,0.15);
    }

    .slider-value-container {
        display: flex;
        align-items: center;
        gap: 4px;
        background: #ffffff;
        border: 1px solid #c9cccf;
        border-radius: 6px;
        padding: 4px 8px;
    }

    .dark-mode .slider-value-container {
        background: #303030;
        border-color: #404040;
    }

    .slider-value-input {
        width: 60px;
        border: none;
        background: none;
        font-size: 14px;
        text-align: right;
        color: #202223;
    }

    .dark-mode .slider-value-input {
        color: #e3e3e3;
    }

    .slider-value-input:focus {
        outline: none;
    }

    .slider-unit {
        font-size: 14px;
        color: #6d7175;
    }

    .dark-mode .slider-unit {
        color: #8c9196;
    }

    .settings-select {
        width: 100%;
        padding: 8px 12px;
        padding-right: 36px;
        font-size: 14px;
        border: 1px solid #c9cccf;
        border-radius: 6px;
        background-color: #ffffff;
        background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='16' height='16' viewBox='0 0 16 16'%3E%3Cpath fill='%236d7175' d='M8 10.5L4 6.5h8L8 10.5z'/%3E%3C/svg%3E");
        background-repeat: no-repeat;
        background-position: right 12px center;
        background-size: 16px;
        appearance: none;
        cursor: pointer;
        transition: border-color 0.1s ease;
        color: #202223;
    }

    .dark-mode .settings-select {
        background-color: #303030;
        border-color: #404040;
        color: #e3e3e3;
        background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='16' height='16' viewBox='0 0 16 16'%3E%3Cpath fill='%238c9196' d='M8 10.5L4 6.5h8L8 10.5z'/%3E%3C/svg%3E");
    }

    .settings-select:focus {
        outline: none;
        border-color: #2c6ecb;
        box-shadow: 0 0 0 1px #2c6ecb;
    }

    .dark-mode .settings-select:focus {
        border-color: #4d9ef6;
        box-shadow: 0 0 0 1px #4d9ef6;
    }

    .settings-description {
        display: block;
        margin-top: 8px;
        font-size: 12px;
        color: #6d7175;
    }

    .dark-mode .settings-description {
        color: #8c9196;
    }
`;
document.head.appendChild(style);

    

    // Initialize Color Schemes
    window.initializeColorSchemes = function() {
        console.log('Initializing color schemes...');
        
        // Color picker and text input sync
        $('.shopify-color-picker').on('input', function() {
            const value = $(this).val();
            const colorFor = $(this).attr('id');
            
            // Update the corresponding text input
            if (colorFor) {
                $(`input[data-color-for="${colorFor}"]`).val(value.toUpperCase());
            } else {
                $(this).siblings('.shopify-color-text').val(value.toUpperCase());
            }
            
            // Save changes to the appropriate data structure
            const field = $(this).data('field');
            if (field && field.startsWith('scheme-')) {
                saveSchemeConfigurationChange(field, value);
            }
        });
        
        $('.shopify-color-text').on('input', function() {
            let value = $(this).val();
            const colorFor = $(this).data('color-for');
            
            // Ensure it's a valid hex color
            if (!value.startsWith('#')) {
                value = '#' + value;
            }
            // Remove non-hex characters
            value = value.replace(/[^#0-9A-Fa-f]/g, '');
            // Limit to 7 characters
            if (value.length > 7) {
                value = value.slice(0, 7);
            }
            $(this).val(value.toUpperCase());
            
            // Update color picker if valid
            if (/^#[0-9A-F]{6}$/i.test(value)) {
                if (colorFor) {
                    $(`#${colorFor}`).val(value);
                } else {
                    $(this).siblings('.shopify-color-picker').val(value);
                }
                
                // Save changes to the appropriate data structure
                const field = $(this).data('field');
                if (field && field.startsWith('scheme-')) {
                    saveSchemeConfigurationChange(field, value);
                }
            }
        });
        
        // Copy button functionality
        $('.shopify-color-copy').on('click', function(e) {
            e.preventDefault();
            const colorValue = $(this).siblings('.shopify-color-text').val();
            navigator.clipboard.writeText(colorValue).then(() => {
                // Show feedback
                const originalIcon = $(this).find('i').text();
                $(this).find('i').text('check');
                setTimeout(() => {
                    $(this).find('i').text(originalIcon);
                }, 1000);
            });
        });
        
        // Color scheme dropdown change
        $('#colorSchemeSelect').on('change', function() {
            const selectedScheme = $(this).val();
            loadColorScheme(selectedScheme);
        });
        
        // Scheme configuration dropdown change
        $('#schemeConfigSelect').on('change', function() {
            const selectedScheme = $(this).val();
            console.log(`[DEBUG] Scheme selector changed to: ${selectedScheme}`);
            loadSchemeConfiguration(selectedScheme);
        });
        
        // Load initial color scheme
        loadColorScheme('scheme1');
        // Load initial scheme configuration
        loadSchemeConfiguration('scheme1');
    };
    
    // Initialize Swatches Range Inputs
    window.initializeSwatchesRangeInputs = function() {
        console.log('Initializing swatches range inputs...');
        
        // Handle range input changes
        $('.shopify-range.range-input').on('input', function() {
            const value = $(this).val();
            // Find the closest parent div and then the range-value span
            $(this).closest('div').find('.range-value').text(value);
        });
        
        // Initialize all range values on load
        $('.shopify-range.range-input').each(function() {
            const value = $(this).val();
            $(this).closest('div').find('.range-value').text(value);
        });
    };
    
    // Load color scheme data
    function loadColorScheme(schemeName) {
        const scheme = colorSchemes[schemeName];
        
        if (!scheme) return;
        
        // Update all color inputs for Primary, Secondary, Contrasting
        Object.keys(scheme).forEach(section => {
            Object.keys(scheme[section]).forEach(field => {
                const value = scheme[section][field];
                const fieldName = `${section}-${field.replace(/([A-Z])/g, '-$1').toLowerCase()}`;
                
                // Update both picker and text input
                $(`.shopify-color-picker[data-field="${fieldName}"]`).val(value);
                $(`.shopify-color-text[data-field="${fieldName}"]`).val(value.toUpperCase());
            });
        });
    }
    
    // Generate HTML for scheme fields with unique names
    function generateSchemeFieldsHTML(schemeName) {
        console.log(`[DEBUG] Generating fields for ${schemeName}`);
        const fields = [
            { name: 'text', label: 'Text', type: 'color' },
            { name: 'background', label: 'Background', type: 'color' },
            { name: 'foreground', label: 'Foreground', type: 'color' },
            { name: 'border', label: 'Border', type: 'color' },
            { name: 'solid-button', label: 'Solid button', type: 'color' },
            { name: 'solid-button-text', label: 'Solid button text', type: 'color' },
            { name: 'outline-button', label: 'Outline button', type: 'color' },
            { name: 'outline-button-text', label: 'Outline button text', type: 'color' },
            { name: 'image-overlay', label: 'Image overlay', type: 'text' }
        ];
        
        let html = `<div class="scheme-fields-section" data-scheme="${schemeName}">`;
        fields.forEach(field => {
            const fieldId = `${schemeName}-${field.name}`;
            html += `
                <div class="color-field">
                    <label>${field.label}</label>
                    <div class="shopify-color-input-wrapper">`;
            
            if (field.type === 'color') {
                html += `
                        <input type="color" value="#000000" class="shopify-color-picker" data-field="${fieldId}" data-scheme="${schemeName}">
                        <input type="text" value="#000000" class="shopify-color-text" data-field="${fieldId}" data-scheme="${schemeName}">`;
            } else {
                html += `
                        <input type="text" value="rgba(0, 0, 0, 0.1)" class="shopify-color-text" data-field="${fieldId}" data-scheme="${schemeName}">`;
            }
            
            html += `
                        <button class="shopify-color-copy" data-field="${fieldId}">
                            <i class="material-icons">content_copy</i>
                        </button>
                    </div>
                </div>`;
        });
        html += '</div>';
        
        console.log(`[DEBUG] Generated HTML for ${schemeName} with fields like ${schemeName}-text, ${schemeName}-background, etc.`);
        return html;
    }
    
    // Load scheme configuration data
    function loadSchemeConfiguration(schemeName) {
        console.log(`[DEBUG] Loading configuration for ${schemeName}`);
        currentSelectedColorScheme = schemeName;
        
        // Generate and display fields for this scheme
        const container = document.getElementById('scheme-fields-container');
        console.log(`[DEBUG] Container found:`, container);
        if (container) {
            // Clear previous content
            container.innerHTML = '';
            // Generate new fields
            container.innerHTML = generateSchemeFieldsHTML(schemeName);
            console.log(`[DEBUG] Fields generated for ${schemeName}`);
            
            // Verify the fields were created correctly
            const newFields = container.querySelectorAll('[data-field]');
            console.log(`[DEBUG] Created ${newFields.length} input fields for ${schemeName}`);
        } else {
            console.error(`[ERROR] scheme-fields-container not found!`);
        }
        
        // Ensure colorSchemes exists in currentGlobalThemeSettings
        if (!currentGlobalThemeSettings.colorSchemes) {
            currentGlobalThemeSettings.colorSchemes = {};
        }
        
        let schemeData;
        
        // Check if scheme exists and handle both old (nested) and new (flat) structures
        if (currentGlobalThemeSettings.colorSchemes[schemeName]) {
            const existingScheme = currentGlobalThemeSettings.colorSchemes[schemeName];
            
            // Check if it's the old structure (has primary/secondary/contrasting)
            if (existingScheme.primary || existingScheme.secondary || existingScheme.contrasting) {
                console.log(`[DEBUG] Found old nested structure for ${schemeName}, converting to flat structure`);
                
                // Convert old structure to new flat structure - taking primary values as default
                schemeData = {
                    text: existingScheme.primary?.text || existingScheme.text || '#000000',
                    background: existingScheme.primary?.background || existingScheme.background || '#FFFFFF',
                    foreground: existingScheme.primary?.foreground || existingScheme.foreground || '#F0F0F0',
                    border: existingScheme.primary?.border || existingScheme.border || '#DDDDDD',
                    'solid-button': existingScheme.primary?.['solid-button'] || existingScheme['solid-button'] || '#000000',
                    'solid-button-text': existingScheme.primary?.['solid-button-text'] || existingScheme['solid-button-text'] || '#FFFFFF',
                    'outline-button': existingScheme.primary?.['outline-button'] || existingScheme['outline-button'] || '#DDDDDD',
                    'outline-button-text': existingScheme.primary?.['outline-button-text'] || existingScheme['outline-button-text'] || '#000000',
                    'image-overlay': existingScheme.primary?.['image-overlay'] || existingScheme['image-overlay'] || 'rgba(0, 0, 0, 0.1)'
                };
                
                // Update the structure to be flat - completely replace the old structure
                currentGlobalThemeSettings.colorSchemes[schemeName] = schemeData;
                
                // IMPORTANT: Force clean structure by removing old nested objects
                delete currentGlobalThemeSettings.colorSchemes[schemeName].primary;
                delete currentGlobalThemeSettings.colorSchemes[schemeName].secondary;
                delete currentGlobalThemeSettings.colorSchemes[schemeName].contrasting;
                
                hasPendingGlobalSettingsChanges = true; // Mark as changed to save the new structure
            } else {
                // It's already flat structure
                schemeData = existingScheme;
            }
        } else {
            // Initialize with default values
            if (colorSchemes[schemeName]) {
                schemeData = JSON.parse(JSON.stringify(colorSchemes[schemeName]));
            } else {
                schemeData = {
                    text: '#000000',
                    background: '#FFFFFF',
                    foreground: '#F0F0F0',
                    border: '#DDDDDD',
                    'solid-button': '#000000',
                    'solid-button-text': '#FFFFFF',
                    'outline-button': '#DDDDDD',
                    'outline-button-text': '#000000',
                    'image-overlay': 'rgba(0, 0, 0, 0.1)'
                };
            }
            currentGlobalThemeSettings.colorSchemes[schemeName] = schemeData;
        }
        
        console.log(`[DEBUG] Loading scheme data:`, schemeData);
        
        // Update each field with the scheme's values using the new naming convention
        Object.keys(schemeData).forEach(property => {
            // Skip nested objects (primary/secondary/contrasting) if they still exist
            if (typeof schemeData[property] === 'object' && property !== 'image-overlay') {
                return;
            }
            
            const value = schemeData[property];
            // Use the new field naming: scheme1-text, scheme2-background, etc.
            const $inputs = $(`[data-field="${schemeName}-${property}"]`);
            
            if ($inputs.length > 0) {
                $inputs.val(value);
                console.log(`[DEBUG] Set ${schemeName}-${property} to ${value}`);
            }
        });
        
        // Apply translations to the newly generated fields and re-attach event listeners
        setTimeout(() => {
            if (typeof applyTranslations === 'function') {
                applyTranslations();
            }
            
            // Re-attach event listeners to the new fields
            console.log(`[DEBUG] Re-attaching event listeners for scheme fields`);
            // The event handler is already attached with delegation, so it should work automatically
            
            // Log the current fields to verify
            const schemeFields = $(`[data-field^="${schemeName}-"]`);
            console.log(`[DEBUG] Found ${schemeFields.length} fields for ${schemeName}`);
            schemeFields.each(function() {
                console.log(`[DEBUG] Field: ${$(this).data('field')}`);
            });
        }, 50);
        
        updateSaveButtonState();
    }
    
    // Save changes to scheme configuration
    // [REMOVED - This function referenced the removed colorSchemeSettings]
    function saveSchemeConfigurationChange(fieldName, value) {
        console.log(`saveSchemeConfigurationChange called for ${fieldName} - function disabled after removing duplicate colorSchemes`);
        // This function previously saved to colorSchemeSettings which has been removed
    }
    
    // Initialize drag and drop functionality without changing design
    function initializeDragAndDrop() {
        console.log('[DRAG&DROP] === INICIANDO DRAG AND DROP ===');
        console.log('[DRAG&DROP] jQuery loaded:', typeof $ !== 'undefined');
        console.log('[DRAG&DROP] jQuery UI loaded:', typeof $.ui !== 'undefined');
        console.log('[DRAG&DROP] Sortable available:', typeof $.fn.sortable);
        
        // Verificar jQuery UI
        if (typeof $.fn.sortable === 'undefined') {
            console.error('[DRAG&DROP] ERROR: jQuery UI sortable NO está disponible');
            console.log('[DRAG&DROP] Reintentando en 1 segundo...');
            setTimeout(initializeDragAndDrop, 1000);
            return;
        }
        
        // Encontrar el contenedor correcto
        const $container = $('.sidebar-section').first().find('.sidebar-section-content');
        console.log('[DRAG&DROP] Buscando contenedor...');
        console.log('[DRAG&DROP] Sidebar sections encontradas:', $('.sidebar-section').length);
        console.log('[DRAG&DROP] Contenedor encontrado:', $container.length);
        
        if ($container.length === 0) {
            console.error('[DRAG&DROP] ERROR: No se encontró el contenedor .sidebar-section-content');
            console.log('[DRAG&DROP] Reintentando en 1 segundo...');
            setTimeout(initializeDragAndDrop, 1000);
            return;
        }
        
        console.log('[DRAG&DROP] Contenedor clases:', $container.attr('class'));
        console.log('[DRAG&DROP] Contenedor visible:', $container.is(':visible'));
        
        // Buscar las subsecciones
        const $announcementSection = $container.find('.sidebar-subsection[data-block-type="announcement"]');
        const $headerSection = $container.find('.sidebar-subsection[data-block-type="header"]');
        
        console.log('[DRAG&DROP] Subsecciones encontradas:', {
            announcement: $announcementSection.length,
            header: $headerSection.length
        });
        
        if ($announcementSection.length === 0 || $headerSection.length === 0) {
            console.error('[DRAG&DROP] ERROR: No se encontraron las subsecciones necesarias');
            console.log('[DRAG&DROP] HTML del contenedor:', $container.html().substring(0, 200) + '...');
            return;
        }
        
        // Agregar drag handles a ambas subsecciones
        [$announcementSection, $headerSection].forEach($section => {
            if (!$section.find('.drag-handle').length) {
                // Agregar el icono de drag al principio con estilo moderno
                const dragIcon = $('<i class="material-icons drag-handle" title="Arrastra para reordenar">drag_handle</i>');
                dragIcon.css({
                    'font-size': '20px',
                    'cursor': 'grab',
                    'color': '#8c9196',
                    'position': 'absolute',
                    'left': '8px',
                    'top': '50%',
                    'transform': 'translateY(-50%)',
                    'opacity': '0',
                    'transition': 'opacity 0.2s ease',
                    'user-select': 'none',
                    '-webkit-user-select': 'none',
                    '-moz-user-select': 'none'
                });
                $section.prepend(dragIcon);
                console.log('[DRAG&DROP] Drag handle agregado a:', $section.data('block-type'));
            }
        });
        
        // Hacer el contenedor sortable
        try {
            console.log('[DRAG&DROP] Intentando aplicar sortable...');
            console.log('[DRAG&DROP] Contenedor es jQuery object:', $container instanceof jQuery);
            console.log('[DRAG&DROP] Sortable method exists:', typeof $container.sortable === 'function');
            
            // Destruir sortable existente si existe
            if ($container.data('ui-sortable')) {
                console.log('[DRAG&DROP] Destruyendo sortable existente...');
                $container.sortable('destroy');
            }
            
            // Aplicar sortable de forma simple
            console.log('[DRAG&DROP] Aplicando sortable con opciones...');
            $container.sortable({
                items: '.sidebar-subsection[data-block-type="announcement"], .sidebar-subsection[data-block-type="header"]',
                handle: '.drag-handle',
                axis: 'y',
                containment: 'parent',
                tolerance: 'pointer',
                placeholder: 'sortable-placeholder',
                forcePlaceholderSize: true,
                revert: 200,
                start: function(event, ui) {
                    console.log('[DRAG&DROP] ¡ARRASTRANDO!');
                    ui.placeholder.height(ui.item.height());
                },
                stop: function(event, ui) {
                    console.log('[DRAG&DROP] Arrastre terminado');
                    
                    // Reposicionar el botón de agregar anuncio
                    const $addBtn = $('.add-announcement-button');
                    const $announcement = $('.sidebar-subsection[data-block-type="announcement"]');
                    if ($addBtn.length && $announcement.length) {
                        $addBtn.insertAfter($announcement);
                    }
                }
            });
            
            console.log('[DRAG&DROP] ✓ Sortable aplicado exitosamente');
            console.log('[DRAG&DROP] Clases del contenedor después:', $container.attr('class'));
            console.log('[DRAG&DROP] Es sortable:', $container.hasClass('ui-sortable'));
            
            // Verificar
            const sortableInstance = $container.data('ui-sortable');
            console.log('[DRAG&DROP] Instancia sortable existe:', sortableInstance !== undefined);
            if (sortableInstance) {
                console.log('[DRAG&DROP] Items configurados:', sortableInstance.options.items);
                console.log('[DRAG&DROP] Handle configurado:', sortableInstance.options.handle);
                console.log('[DRAG&DROP] Sortable habilitado:', !sortableInstance.options.disabled);
            } else {
                console.error('[DRAG&DROP] ERROR: No se creó la instancia de sortable');
            }
            
            console.log('[DRAG&DROP] === FIN DE INICIALIZACIÓN ===');
            
        } catch (error) {
            console.error('[DRAG&DROP] ERROR CRÍTICO:', error);
            console.error('[DRAG&DROP] Stack:', error.stack);
        }
    }
    
    // Function to populate theme settings fields with current values
    function populateThemeSettingsFields() {
        console.log('Populating theme settings fields with:', currentGlobalThemeSettings);
        
        // NUEVO: Populate color scheme fields
        if (currentGlobalThemeSettings.colors) {
            console.log('[DEBUG] Populating color fields...');
            const colors = currentGlobalThemeSettings.colors;
            
            // Iterate through color groups (primary, secondary, contrasting)
            for (const group in colors) {
                if (typeof colors[group] === 'object' && colors[group] !== null) {
                    // Iterate through properties (text, background, etc.)
                    for (const property in colors[group]) {
                        const value = colors[group][property];
                        const dataField = `${group}-${property}`;
                        
                        // Find and update all inputs with this data-field
                        const inputs = $(`[data-field="${dataField}"]`);
                        if (inputs.length > 0) {
                            inputs.val(value);
                            console.log(`[DEBUG] Set ${dataField} to ${value}`);
                        }
                    }
                }
            }
        }
        
        // Appearance settings
        if (currentGlobalThemeSettings.appearance) {
            const appearance = currentGlobalThemeSettings.appearance;
            
            // Page Width
            if (appearance.pageWidth) {
                const pageWidth = parseInt(appearance.pageWidth);
                $('#pageWidth').val(pageWidth);
                $('#pageWidthValue').val(pageWidth);
            }
            
            // Side Padding
            if (appearance.sidePadding) {
                const sidePadding = parseInt(appearance.sidePadding);
                $('#sidePaddingSize').val(sidePadding);
                $('#sidePaddingSizeValue').val(sidePadding);
            }
            
            // Edge Rounding
            if (appearance.edgeRounding) {
                $('#edgeRounding').val(appearance.edgeRounding);
            }
        }
        
        // Typography settings
        if (currentGlobalThemeSettings.typography) {
            const typography = currentGlobalThemeSettings.typography;
            
            // Heading settings
            if (typography.heading) {
                if (typography.heading.font) {
                    const fontDisplayName = getFontDisplayName(typography.heading.font);
                    $('.font-search-input[data-font-type="heading"]').val(fontDisplayName);
                    $('.font-search-input[data-font-type="heading"]').data('font-value', typography.heading.font);
                    // Update the selectedFonts object
                    if (typeof selectedFonts !== 'undefined') {
                        selectedFonts.heading = typography.heading.font;
                    }
                }
                $('#headingUppercase').prop('checked', typography.heading.uppercase || false);
                if (typography.heading.letterSpacing !== undefined) {
                    $('#headingLetterSpacing').val(typography.heading.letterSpacing);
                    $('#headingLetterSpacingValue').val(typography.heading.letterSpacing);
                }
            }
            
            // Body settings
            if (typography.body) {
                if (typography.body.font) {
                    const fontDisplayName = getFontDisplayName(typography.body.font);
                    $('.font-search-input[data-font-type="body"]').val(fontDisplayName);
                    $('.font-search-input[data-font-type="body"]').data('font-value', typography.body.font);
                    // Update the selectedFonts object
                    if (typeof selectedFonts !== 'undefined') {
                        selectedFonts.body = typography.body.font;
                    }
                }
                if (typography.body.fontSize) {
                    $('#bodyFontSize').val(parseInt(typography.body.fontSize));
                    $('#bodyFontSizeValue').val(parseInt(typography.body.fontSize));
                }
            }
            
            // Menu settings
            if (typography.menu) {
                if (typography.menu.font) {
                    const fontDisplayName = getFontDisplayName(typography.menu.font);
                    $('.font-search-input[data-font-type="menu"]').val(fontDisplayName);
                    $('.font-search-input[data-font-type="menu"]').data('font-value', typography.menu.font);
                    // Update the selectedFonts object
                    if (typeof selectedFonts !== 'undefined') {
                        selectedFonts.menu = typography.menu.font;
                    }
                }
                $('#menuUppercase').prop('checked', typography.menu.uppercase || false);
                if (typography.menu.fontSize !== undefined) {
                    $('#menuFontSize').val(typography.menu.fontSize);
                    $('#menuFontSizeValue').val(typography.menu.fontSize);
                }
                if (typography.menu.letterSpacing !== undefined) {
                    $('#menuLetterSpacing').val(typography.menu.letterSpacing);
                    $('#menuLetterSpacingValue').val(typography.menu.letterSpacing);
                }
            }
            
            // Product settings
            if (typography.product) {
                if (typography.product.font) {
                    const fontDisplayName = getFontDisplayName(typography.product.font);
                    $('.font-search-input[data-font-type="product"]').val(fontDisplayName);
                    $('.font-search-input[data-font-type="product"]').data('font-value', typography.product.font);
                    // Update the selectedFonts object
                    if (typeof selectedFonts !== 'undefined') {
                        selectedFonts.product = typography.product.font;
                    }
                }
                $('#productUppercase').prop('checked', typography.product.uppercase || false);
                if (typography.product.fontSize !== undefined) {
                    $('#productFontSize').val(typography.product.fontSize);
                    $('#productFontSizeValue').val(typography.product.fontSize);
                }
                if (typography.product.letterSpacing !== undefined) {
                    $('#productLetterSpacing').val(typography.product.letterSpacing);
                    $('#productLetterSpacingValue').val(typography.product.letterSpacing);
                }
            }
            
            // Buttons settings
            if (typography.buttons) {
                if (typography.buttons.font) {
                    const fontDisplayName = getFontDisplayName(typography.buttons.font);
                    $('.font-search-input[data-font-type="buttons"]').val(fontDisplayName);
                    $('.font-search-input[data-font-type="buttons"]').data('font-value', typography.buttons.font);
                    // Update the selectedFonts object
                    if (typeof selectedFonts !== 'undefined') {
                        selectedFonts.buttons = typography.buttons.font;
                    }
                }
                $('#buttonsUppercase').prop('checked', typography.buttons.uppercase || false);
                if (typography.buttons.fontSize !== undefined) {
                    $('#buttonsFontSize').val(typography.buttons.fontSize);
                    $('#buttonsFontSizeValue').val(typography.buttons.fontSize);
                }
                if (typography.buttons.letterSpacing !== undefined) {
                    $('#buttonsLetterSpacing').val(typography.buttons.letterSpacing);
                    $('#buttonsLetterSpacingValue').val(typography.buttons.letterSpacing);
                }
            }
        }
        
        // Color schemes
        if (currentGlobalThemeSettings.colorSchemes) {
            // This would populate color scheme fields
            // Implementation depends on the specific UI structure
        }
        
        // Product cards
        if (currentGlobalThemeSettings.productCards) {
            const productCards = currentGlobalThemeSettings.productCards;
            
            if (productCards.imageRatio) {
                $('#productCardsImageRatio').val(productCards.imageRatio);
            }
            if (productCards.showVendor !== undefined) {
                $('#show-vendor-toggle').prop('checked', productCards.showVendor);
            }
            if (productCards.showCurrencyCode !== undefined) {
                $('#show-currency-code-toggle').prop('checked', productCards.showCurrencyCode);
            }
            if (productCards.showColorCount !== undefined) {
                $('#show-color-count-toggle').prop('checked', productCards.showColorCount);
            }
            if (productCards.colorCardBackground !== undefined) {
                $('#color-card-background-toggle').prop('checked', productCards.colorCardBackground);
            }
            if (productCards.darkenImageBackground !== undefined) {
                $('#darken-image-background-toggle').prop('checked', productCards.darkenImageBackground);
            }
            if (productCards.productRating) {
                $('#productCardsRating').val(productCards.productRating);
            }
            if (productCards.priceLabelSize) {
                $('#productCardsPriceSize').val(productCards.priceLabelSize);
            }
            if (productCards.imageHoverEffect) {
                $('#productCardsHoverEffect').val(productCards.imageHoverEffect);
            }
            
            // Swatches settings
            if (productCards.swatchesShow) {
                $('#productCardsSwatchesShow').val(productCards.swatchesShow);
            }
            if (productCards.swatchesDesktop) {
                $('#productCardsSwatchesDesktop').val(productCards.swatchesDesktop);
            }
            if (productCards.swatchesMobile) {
                $(`input[name="show-on-mobile"][value="${productCards.swatchesMobile}"]`).prop('checked', true);
            }
            if (productCards.hideSingleValueSwatches !== undefined) {
                $('#hide-single-value-toggle').prop('checked', productCards.hideSingleValueSwatches);
            }
            
            // Quick buy buttons
            if (productCards.showQuickView !== undefined) {
                $('#show-quick-view-toggle').prop('checked', productCards.showQuickView);
            }
            if (productCards.showAddToCart !== undefined) {
                $('#show-add-to-cart-toggle').prop('checked', productCards.showAddToCart);
            }
            if (productCards.desktopButtonStyle) {
                $(`input[name="desktop-button-style"][value="${productCards.desktopButtonStyle}"]`).prop('checked', true);
            }
            if (productCards.showButtonsOnHover !== undefined) {
                $('#show-buttons-on-hover-toggle').prop('checked', productCards.showButtonsOnHover);
            }
            
            // Product badges
            if (productCards.badgesDesktopPosition) {
                $('#productCardsBadgesDesktop').val(productCards.badgesDesktopPosition);
            }
            if (productCards.showSoldOutBadge !== undefined) {
                $('#pc-show-sold-out-badge-toggle').prop('checked', productCards.showSoldOutBadge);
            }
            if (productCards.showSaleBadge !== undefined) {
                $('#pc-show-sale-badge-toggle').prop('checked', productCards.showSaleBadge);
            }
            if (productCards.showSaleBadgeNextToPrice !== undefined) {
                $('#pc-show-sale-badge-next-to-price-toggle').prop('checked', productCards.showSaleBadgeNextToPrice);
            }
            if (productCards.highlightSalePrice !== undefined) {
                $('#pc-highlight-sale-price-toggle').prop('checked', productCards.highlightSalePrice);
            }
            if (productCards.showCustom1Badge !== undefined) {
                $('#pc-show-custom-1-badge-toggle').prop('checked', productCards.showCustom1Badge);
            }
            if (productCards.showCustom2Badge !== undefined) {
                $('#pc-show-custom-2-badge-toggle').prop('checked', productCards.showCustom2Badge);
            }
            if (productCards.showCustom3Badge !== undefined) {
                $('#pc-show-custom-3-badge-toggle').prop('checked', productCards.showCustom3Badge);
            }
            if (productCards.showSecondImage !== undefined) {
                $('#showSecondImage').prop('checked', productCards.showSecondImage);
            }
        }
        
        // Product badges (independent section)
        if (currentGlobalThemeSettings.productBadges) {
            const productBadges = currentGlobalThemeSettings.productBadges;
            
            // Sold out badge
            if (productBadges.soldOut) {
                if (productBadges.soldOut.background) {
                    $('#sold-out-bg-color').val(productBadges.soldOut.background);
                    $('input[data-color-for="sold-out-bg-color"]').val(productBadges.soldOut.background);
                }
                if (productBadges.soldOut.text) {
                    $('#sold-out-text-color').val(productBadges.soldOut.text);
                    $('input[data-color-for="sold-out-text-color"]').val(productBadges.soldOut.text);
                }
            }
            
            // Sale badge
            if (productBadges.sale) {
                if (productBadges.sale.showAs) {
                    $('#sale-badge-show-as').val(productBadges.sale.showAs);
                }
                if (productBadges.sale.background) {
                    $('#sale-bg-color').val(productBadges.sale.background);
                    $('input[data-color-for="sale-bg-color"]').val(productBadges.sale.background);
                }
                if (productBadges.sale.text) {
                    $('#sale-text-color').val(productBadges.sale.text);
                    $('input[data-color-for="sale-text-color"]').val(productBadges.sale.text);
                }
            }
            
            // Sale price badge
            if (productBadges.salePriceNext) {
                if (productBadges.salePriceNext.showAs) {
                    $('#sale-price-badge-show-as').val(productBadges.salePriceNext.showAs);
                }
                if (productBadges.salePriceNext.background) {
                    $('#sale-price-bg-color').val(productBadges.salePriceNext.background);
                    $('input[data-color-for="sale-price-bg-color"]').val(productBadges.salePriceNext.background);
                }
                if (productBadges.salePriceNext.text) {
                    $('#sale-price-text-color').val(productBadges.salePriceNext.text);
                    $('input[data-color-for="sale-price-text-color"]').val(productBadges.salePriceNext.text);
                }
            }
            
            // Sale highlight
            if (productBadges.saleHighlight) {
                if (productBadges.saleHighlight.text) {
                    $('#sale-highlight-text-color').val(productBadges.saleHighlight.text);
                    $('input[data-color-for="sale-highlight-text-color"]').val(productBadges.saleHighlight.text);
                }
            }
            
            // Custom 1 badge
            if (productBadges.custom1) {
                if (productBadges.custom1.text) {
                    $('#custom1-badge-text').val(productBadges.custom1.text);
                }
                if (productBadges.custom1.tag) {
                    $('#custom1-badge-tag').val(productBadges.custom1.tag);
                }
                if (productBadges.custom1.background) {
                    $('#custom1-bg-color').val(productBadges.custom1.background);
                    $('input[data-color-for="custom1-bg-color"]').val(productBadges.custom1.background);
                }
                if (productBadges.custom1.textColor) {
                    $('#custom1-text-color').val(productBadges.custom1.textColor);
                    $('input[data-color-for="custom1-text-color"]').val(productBadges.custom1.textColor);
                }
            }
        }
        
        // Cart settings
        if (currentGlobalThemeSettings.cart) {
            const cart = currentGlobalThemeSettings.cart;
            
            if (cart.showAs) {
                $('#cart-show-as').val(cart.showAs);
            }
            if (cart.showStickyCart !== undefined) {
                $('#show-sticky-cart-toggle').prop('checked', cart.showStickyCart);
            }
            
            // Cart status colors
            if (cart.cartStatus) {
                if (cart.cartStatus.background) {
                    $('#cart-status-bg-color').val(cart.cartStatus.background);
                    $('input[data-color-for="cart-status-bg-color"]').val(cart.cartStatus.background);
                }
                if (cart.cartStatus.text) {
                    $('#cart-status-text-color').val(cart.cartStatus.text);
                    $('input[data-color-for="cart-status-text-color"]').val(cart.cartStatus.text);
                }
            }
            
            // Free shipping bar
            if (cart.freeShipping) {
                if (cart.freeShipping.showProgressBar !== undefined) {
                    $('#show-progress-bar-toggle').prop('checked', cart.freeShipping.showProgressBar);
                }
                if (cart.freeShipping.threshold !== undefined) {
                    $('#free-shipping-threshold').val(cart.freeShipping.threshold);
                }
                if (cart.freeShipping.progressBarColor) {
                    $('#progress-bar-color').val(cart.freeShipping.progressBarColor);
                    $('input[data-color-for="progress-bar-color"]').val(cart.freeShipping.progressBarColor);
                }
                if (cart.freeShipping.progressBarTrack) {
                    $('#progress-bar-track').val(cart.freeShipping.progressBarTrack);
                }
                if (cart.freeShipping.messageColor) {
                    $('#message-color').val(cart.freeShipping.messageColor);
                    $('input[data-color-for="message-color"]').val(cart.freeShipping.messageColor);
                }
            }
        }
        
        // Favicon settings
        if (currentGlobalThemeSettings.favicon) {
            if (currentGlobalThemeSettings.favicon.url) {
                const preview = $('#favicon-preview');
                preview.html(`<img src="${currentGlobalThemeSettings.favicon.url}" alt="Favicon preview" style="max-width: 100%; height: auto;">`);
                $('#favicon-select-btn').hide();
                $('#favicon-remove-btn').show();
            }
        }
        
        // Navigation settings
        if (currentGlobalThemeSettings.navigation) {
            // Search settings
            if (currentGlobalThemeSettings.navigation.search) {
                if (currentGlobalThemeSettings.navigation.search.showAs) {
                    $('#search-show-as').val(currentGlobalThemeSettings.navigation.search.showAs);
                }
            }
            
            // Back to top settings
            if (currentGlobalThemeSettings.navigation.backToTop) {
                if (currentGlobalThemeSettings.navigation.backToTop.showButton !== undefined) {
                    $('#show-back-to-top-toggle').prop('checked', currentGlobalThemeSettings.navigation.backToTop.showButton);
                }
                if (currentGlobalThemeSettings.navigation.backToTop.position) {
                    $('#back-to-top-position').val(currentGlobalThemeSettings.navigation.backToTop.position);
                }
            }
        }
        
        // Social Media settings
        if (currentGlobalThemeSettings.socialMedia) {
            // Icon style
            if (currentGlobalThemeSettings.socialMedia.iconStyle) {
                $(`input[name="icon-style"][value="${currentGlobalThemeSettings.socialMedia.iconStyle}"]`).prop('checked', true);
            }
            
            // Social platform URLs
            const socialPlatforms = ['instagram', 'facebook', 'twitter', 'youtube', 'pinterest', 'tiktok', 'tumblr', 'snapchat', 'linkedin', 'vimeo'];
            
            socialPlatforms.forEach(platform => {
                if (currentGlobalThemeSettings.socialMedia[platform]) {
                    $(`#social-${platform}`).val(currentGlobalThemeSettings.socialMedia[platform]);
                }
            });
        }
        
        // Swatches settings
        if (currentGlobalThemeSettings.swatches) {
            // Primary swatch settings
            if (currentGlobalThemeSettings.swatches.primary) {
                if (currentGlobalThemeSettings.swatches.primary.optionName) {
                    $('#swatchesPrimaryOptionName').val(currentGlobalThemeSettings.swatches.primary.optionName);
                }
                if (currentGlobalThemeSettings.swatches.primary.productCardsShape) {
                    $('#swatchesPrimaryProductCardsShape').val(currentGlobalThemeSettings.swatches.primary.productCardsShape);
                }
                if (currentGlobalThemeSettings.swatches.primary.productCardsSize) {
                    $('#swatchesPrimaryProductCardsSize').val(currentGlobalThemeSettings.swatches.primary.productCardsSize);
                    $('#swatchesPrimaryProductCardsSize').closest('div').find('.range-value').text(currentGlobalThemeSettings.swatches.primary.productCardsSize);
                }
                if (currentGlobalThemeSettings.swatches.primary.productPagesShape) {
                    $('#swatchesPrimaryProductPagesShape').val(currentGlobalThemeSettings.swatches.primary.productPagesShape);
                }
                if (currentGlobalThemeSettings.swatches.primary.productPagesSize) {
                    $('#swatchesPrimaryProductPagesSize').val(currentGlobalThemeSettings.swatches.primary.productPagesSize);
                    $('#swatchesPrimaryProductPagesSize').closest('div').find('.range-value').text(currentGlobalThemeSettings.swatches.primary.productPagesSize);
                }
                if (currentGlobalThemeSettings.swatches.primary.filtersShape) {
                    $('#swatchesPrimaryFiltersShape').val(currentGlobalThemeSettings.swatches.primary.filtersShape);
                }
                if (currentGlobalThemeSettings.swatches.primary.filtersSize) {
                    $('#swatchesPrimaryFiltersSize').val(currentGlobalThemeSettings.swatches.primary.filtersSize);
                    $('#swatchesPrimaryFiltersSize').closest('div').find('.range-value').text(currentGlobalThemeSettings.swatches.primary.filtersSize);
                }
                if (currentGlobalThemeSettings.swatches.primary.customColors) {
                    $('#swatchesPrimaryCustomColors').val(currentGlobalThemeSettings.swatches.primary.customColors);
                }
            }
            
            // Secondary swatch settings
            if (currentGlobalThemeSettings.swatches.secondary) {
                if (currentGlobalThemeSettings.swatches.secondary.optionNames) {
                    $('#swatchesSecondaryOptionNames').val(currentGlobalThemeSettings.swatches.secondary.optionNames);
                }
                if (currentGlobalThemeSettings.swatches.secondary.productPagesShape) {
                    $('#swatchesSecondaryProductPagesShape').val(currentGlobalThemeSettings.swatches.secondary.productPagesShape);
                }
                if (currentGlobalThemeSettings.swatches.secondary.productPagesSize) {
                    $('#swatchesSecondaryProductPagesSize').val(currentGlobalThemeSettings.swatches.secondary.productPagesSize);
                    $('#swatchesSecondaryProductPagesSize').closest('div').find('.range-value').text(currentGlobalThemeSettings.swatches.secondary.productPagesSize);
                }
                if (currentGlobalThemeSettings.swatches.secondary.filtersShape) {
                    $('#swatchesSecondaryFiltersShape').val(currentGlobalThemeSettings.swatches.secondary.filtersShape);
                }
                if (currentGlobalThemeSettings.swatches.secondary.filtersSize) {
                    $('#swatchesSecondaryFiltersSize').val(currentGlobalThemeSettings.swatches.secondary.filtersSize);
                    $('#swatchesSecondaryFiltersSize').closest('div').find('.range-value').text(currentGlobalThemeSettings.swatches.secondary.filtersSize);
                }
                if (currentGlobalThemeSettings.swatches.secondary.customColors) {
                    $('#swatchesSecondaryCustomColors').val(currentGlobalThemeSettings.swatches.secondary.customColors);
                }
            }
        }
    }
    
    // Helper function to handle global theme settings changes
    function handleGlobalSettingChange(settingName, value) {
        hasPendingGlobalSettingsChanges = true;
        console.log(`[DEBUG] Global setting '${settingName}' changed. Pending save: ${hasPendingGlobalSettingsChanges}`);
        applyGlobalStylesToPreview(currentGlobalThemeSettings);
        updateSaveButtonState();
    }
    
    // Function to attach event listeners to theme settings fields
    function attachThemeSettingsEventListeners() {
        console.log('Attaching theme settings event listeners');
        
        // Ensure currentGlobalThemeSettings has proper structure
        if (!currentGlobalThemeSettings.appearance) currentGlobalThemeSettings.appearance = {};
        if (!currentGlobalThemeSettings.typography) currentGlobalThemeSettings.typography = {};
        if (!currentGlobalThemeSettings.typography.heading) currentGlobalThemeSettings.typography.heading = {};
        if (!currentGlobalThemeSettings.typography.body) currentGlobalThemeSettings.typography.body = {};
        if (!currentGlobalThemeSettings.typography.menu) currentGlobalThemeSettings.typography.menu = {};
        if (!currentGlobalThemeSettings.typography.product) currentGlobalThemeSettings.typography.product = {};
        if (!currentGlobalThemeSettings.typography.buttons) currentGlobalThemeSettings.typography.buttons = {};
        if (!currentGlobalThemeSettings.colorSchemes) currentGlobalThemeSettings.colorSchemes = {};
        if (!currentGlobalThemeSettings.productCards) currentGlobalThemeSettings.productCards = {};
        if (!currentGlobalThemeSettings.productBadges) currentGlobalThemeSettings.productBadges = {};
        if (!currentGlobalThemeSettings.cart) currentGlobalThemeSettings.cart = {};
        if (!currentGlobalThemeSettings.favicon) currentGlobalThemeSettings.favicon = {};
        if (!currentGlobalThemeSettings.navigation) currentGlobalThemeSettings.navigation = {};
        if (!currentGlobalThemeSettings.socialMedia) currentGlobalThemeSettings.socialMedia = {};
        if (!currentGlobalThemeSettings.swatches) currentGlobalThemeSettings.swatches = {};
        if (!currentGlobalThemeSettings.swatches.primary) currentGlobalThemeSettings.swatches.primary = {};
        if (!currentGlobalThemeSettings.swatches.secondary) currentGlobalThemeSettings.swatches.secondary = {};
        
        // Set default values for typography if not present
        const typographyDefaults = {
            heading: {
                font: 'assistant',
                uppercase: false,
                letterSpacing: 0
            },
            body: {
                font: 'roboto',
                fontSize: '16px'
            },
            menu: {
                font: 'assistant',
                uppercase: false,
                fontSize: '100',
                letterSpacing: 0
            },
            product: {
                font: 'assistant',
                uppercase: false,
                fontSize: '100',
                letterSpacing: 0
            },
            buttons: {
                font: 'assistant',
                uppercase: false,
                fontSize: '100',
                letterSpacing: 0
            }
        };
        
        // Apply typography defaults
        if (!currentGlobalThemeSettings.typography.heading.font) {
            currentGlobalThemeSettings.typography.heading.font = typographyDefaults.heading.font;
        }
        if (currentGlobalThemeSettings.typography.heading.uppercase === undefined) {
            currentGlobalThemeSettings.typography.heading.uppercase = typographyDefaults.heading.uppercase;
        }
        if (currentGlobalThemeSettings.typography.heading.letterSpacing === undefined) {
            currentGlobalThemeSettings.typography.heading.letterSpacing = typographyDefaults.heading.letterSpacing;
        }
        if (!currentGlobalThemeSettings.typography.body.font) {
            currentGlobalThemeSettings.typography.body.font = typographyDefaults.body.font;
        }
        if (!currentGlobalThemeSettings.typography.body.fontSize) {
            currentGlobalThemeSettings.typography.body.fontSize = typographyDefaults.body.fontSize;
        }
        
        // Menu defaults
        if (!currentGlobalThemeSettings.typography.menu.font) {
            currentGlobalThemeSettings.typography.menu.font = typographyDefaults.menu.font;
        }
        if (currentGlobalThemeSettings.typography.menu.uppercase === undefined) {
            currentGlobalThemeSettings.typography.menu.uppercase = typographyDefaults.menu.uppercase;
        }
        if (!currentGlobalThemeSettings.typography.menu.fontSize) {
            currentGlobalThemeSettings.typography.menu.fontSize = typographyDefaults.menu.fontSize;
        }
        if (currentGlobalThemeSettings.typography.menu.letterSpacing === undefined) {
            currentGlobalThemeSettings.typography.menu.letterSpacing = typographyDefaults.menu.letterSpacing;
        }
        
        // Product defaults
        if (!currentGlobalThemeSettings.typography.product.font) {
            currentGlobalThemeSettings.typography.product.font = typographyDefaults.product.font;
        }
        if (currentGlobalThemeSettings.typography.product.uppercase === undefined) {
            currentGlobalThemeSettings.typography.product.uppercase = typographyDefaults.product.uppercase;
        }
        if (!currentGlobalThemeSettings.typography.product.fontSize) {
            currentGlobalThemeSettings.typography.product.fontSize = typographyDefaults.product.fontSize;
        }
        if (currentGlobalThemeSettings.typography.product.letterSpacing === undefined) {
            currentGlobalThemeSettings.typography.product.letterSpacing = typographyDefaults.product.letterSpacing;
        }
        
        // Buttons defaults
        if (!currentGlobalThemeSettings.typography.buttons.font) {
            currentGlobalThemeSettings.typography.buttons.font = typographyDefaults.buttons.font;
        }
        if (currentGlobalThemeSettings.typography.buttons.uppercase === undefined) {
            currentGlobalThemeSettings.typography.buttons.uppercase = typographyDefaults.buttons.uppercase;
        }
        if (!currentGlobalThemeSettings.typography.buttons.fontSize) {
            currentGlobalThemeSettings.typography.buttons.fontSize = typographyDefaults.buttons.fontSize;
        }
        if (currentGlobalThemeSettings.typography.buttons.letterSpacing === undefined) {
            currentGlobalThemeSettings.typography.buttons.letterSpacing = typographyDefaults.buttons.letterSpacing;
        }
        
        // Set default values for swatches if not present
        const swatchesPrimaryDefaults = {
            optionName: 'Color',
            productCardsShape: 'portrait',
            productCardsSize: '5',
            productPagesShape: 'landscape',
            productPagesSize: '4',
            filtersShape: 'square',
            filtersSize: '1',
            customColors: 'Ultramarine::#0043F2\nCherry blossom::#FFB7C5\nSunny day::yellow/green/blue/\nSummertime::#F9AFB1/#0F9D5B/#4285F4'
        };
        
        const swatchesSecondaryDefaults = {
            optionNames: 'Material\nFrame',
            productPagesShape: 'square',
            productPagesSize: '4',
            filtersShape: 'square',
            filtersSize: '1',
            customColors: 'Ultramarine::#0043F2\nCherry blossom::#FFB7C5\nSunny day::yellow/green/blue/\nSummertime::#F9AFB1/#0F9D5B/#4285F4'
        };
        
        // Apply defaults for swatches
        Object.keys(swatchesPrimaryDefaults).forEach(key => {
            if (currentGlobalThemeSettings.swatches.primary[key] === undefined) {
                currentGlobalThemeSettings.swatches.primary[key] = swatchesPrimaryDefaults[key];
            }
        });
        
        Object.keys(swatchesSecondaryDefaults).forEach(key => {
            if (currentGlobalThemeSettings.swatches.secondary[key] === undefined) {
                currentGlobalThemeSettings.swatches.secondary[key] = swatchesSecondaryDefaults[key];
            }
        });
        
        // Set default values for productCards if not present
        const productCardsDefaults = {
            imageRatio: 'square-1-1',
            showVendor: false,
            showCurrencyCode: false,
            showColorCount: false,
            colorCardBackground: false,
            darkenImageBackground: false,
            productRating: 'none',
            priceLabelSize: 'medium',
            imageHoverEffect: 'zoom',
            swatchesShow: 'variant-images',
            swatchesDesktop: 'on-hover',
            swatchesMobile: 'never',
            hideSingleValueSwatches: false,
            showQuickView: false,
            showAddToCart: false,
            desktopButtonStyle: 'labels',
            showButtonsOnHover: true,
            badgesDesktopPosition: 'on-image',
            showSoldOutBadge: true,
            showSaleBadge: true,
            showSaleBadgeNextToPrice: false,
            highlightSalePrice: false,
            showCustom1Badge: false,
            showCustom2Badge: false,
            showCustom3Badge: false
        };
        
        // Apply defaults only if values don't exist
        for (const [key, defaultValue] of Object.entries(productCardsDefaults)) {
            if (currentGlobalThemeSettings.productCards[key] === undefined) {
                currentGlobalThemeSettings.productCards[key] = defaultValue;
            }
        }
        
        // Set default values for productBadges if not present
        const productBadgesDefaults = {
            soldOut: {
                background: '#FFEDF5',
                text: '#000000'
            },
            sale: {
                showAs: 'sale',
                background: '#473C63',
                text: '#FFFFFF'
            },
            salePriceNext: {
                showAs: '-10%',
                background: '#DB0007',
                text: '#FFFFFF'
            },
            saleHighlight: {
                text: '#000000'
            },
            custom1: {
                text: 'Best seller',
                tag: 'Best Sellers',
                background: '#FFEDF5',
                textColor: '#000000'
            }
        };
        
        // Apply defaults for productBadges
        for (const [badgeType, badgeDefaults] of Object.entries(productBadgesDefaults)) {
            if (!currentGlobalThemeSettings.productBadges[badgeType]) {
                currentGlobalThemeSettings.productBadges[badgeType] = {};
            }
            for (const [key, defaultValue] of Object.entries(badgeDefaults)) {
                if (currentGlobalThemeSettings.productBadges[badgeType][key] === undefined) {
                    currentGlobalThemeSettings.productBadges[badgeType][key] = defaultValue;
                }
            }
        }
        
        // Set default values for cart if not present
        const cartDefaults = {
            showAs: 'drawer-and-page',
            showStickyCart: false,
            cartStatus: {
                background: '#F0FF2E',
                text: '#3B3933'
            },
            freeShipping: {
                showProgressBar: false,
                threshold: 0,
                progressBarColor: '#3B3933',
                progressBarTrack: 'degradado-in',
                messageColor: '#3B3933'
            }
        };
        
        // Apply defaults for cart
        if (!currentGlobalThemeSettings.cart.showAs) {
            currentGlobalThemeSettings.cart.showAs = cartDefaults.showAs;
        }
        if (currentGlobalThemeSettings.cart.showStickyCart === undefined) {
            currentGlobalThemeSettings.cart.showStickyCart = cartDefaults.showStickyCart;
        }
        if (!currentGlobalThemeSettings.cart.cartStatus) {
            currentGlobalThemeSettings.cart.cartStatus = {};
        }
        if (!currentGlobalThemeSettings.cart.freeShipping) {
            currentGlobalThemeSettings.cart.freeShipping = {};
        }
        
        // Apply nested defaults
        for (const [key, value] of Object.entries(cartDefaults.cartStatus)) {
            if (currentGlobalThemeSettings.cart.cartStatus[key] === undefined) {
                currentGlobalThemeSettings.cart.cartStatus[key] = value;
            }
        }
        for (const [key, value] of Object.entries(cartDefaults.freeShipping)) {
            if (currentGlobalThemeSettings.cart.freeShipping[key] === undefined) {
                currentGlobalThemeSettings.cart.freeShipping[key] = value;
            }
        }
        
        // Set default values for favicon if not present
        if (!currentGlobalThemeSettings.favicon.url) {
            currentGlobalThemeSettings.favicon.url = '';
        }
        
        // Set default values for navigation if not present
        const navigationDefaults = {
            search: {
                showAs: 'drawer-and-page'
            },
            backToTop: {
                showButton: false,
                position: 'bottom-right'
            }
        };
        
        // Apply defaults for navigation
        if (!currentGlobalThemeSettings.navigation.search) {
            currentGlobalThemeSettings.navigation.search = {};
        }
        if (!currentGlobalThemeSettings.navigation.backToTop) {
            currentGlobalThemeSettings.navigation.backToTop = {};
        }
        
        for (const [key, value] of Object.entries(navigationDefaults.search)) {
            if (currentGlobalThemeSettings.navigation.search[key] === undefined) {
                currentGlobalThemeSettings.navigation.search[key] = value;
            }
        }
        for (const [key, value] of Object.entries(navigationDefaults.backToTop)) {
            if (currentGlobalThemeSettings.navigation.backToTop[key] === undefined) {
                currentGlobalThemeSettings.navigation.backToTop[key] = value;
            }
        }
        
        // Set default values for socialMedia if not present
        const socialMediaDefaults = {
            iconStyle: 'solid',
            instagram: '',
            facebook: '',
            twitter: '',
            youtube: '',
            pinterest: '',
            tiktok: '',
            tumblr: '',
            snapchat: '',
            linkedin: '',
            vimeo: ''
        };
        
        // Apply defaults for socialMedia
        for (const [key, value] of Object.entries(socialMediaDefaults)) {
            if (currentGlobalThemeSettings.socialMedia[key] === undefined) {
                currentGlobalThemeSettings.socialMedia[key] = value;
            }
        }
        
        // Clean up any old colors structure
        if (currentGlobalThemeSettings.colors) {
            delete currentGlobalThemeSettings.colors;
        }
        
        // Listener genérico para la mayoría de campos del formulario de configuración del tema.
        $(document).on('input change', '#theme-settings-form-content [name]', function() {
            const input = $(this);
            const key = input.attr('name');
            const value = input.val();

            // La lógica del selector de esquemas es especial y se manejará por separado.
            // Lo ignoramos aquí para evitar conflictos.
            if (key === 'color_scheme_selector') {
                return;
            }

            console.log(`[DEBUG] Change detected on field: ${key}, New value: ${value}`);

            // Asumimos que los 'name' de los inputs siguen el formato 'categoria.propiedad'
            // Ejemplo: 'colors.background' o 'typography.font_body'
            const keys = key.split('.');
            if (keys.length === 2) {
                if (!currentGlobalThemeSettings[keys[0]]) {
                    currentGlobalThemeSettings[keys[0]] = {};
                }
                currentGlobalThemeSettings[keys[0]][keys[1]] = value;
                
                // Activamos la bandera para indicar que hay cambios sin guardar.
                hasPendingGlobalSettingsChanges = true;
                console.log('[DEBUG] Global theme settings updated in memory.', currentGlobalThemeSettings);
            }
        });
        
        // Appearance event listeners
        $('#pageWidth, #pageWidthValue').on('input change', function() {
            const value = $(this).val();
            $('#pageWidth').val(value);
            $('#pageWidthValue').val(value);
            currentGlobalThemeSettings.appearance.pageWidth = value + 'px';
            handleGlobalSettingChange('pageWidth', value + 'px');
        });
        
        $('#sidePaddingSize, #sidePaddingSizeValue').on('input change', function() {
            const value = $(this).val();
            $('#sidePaddingSize').val(value);
            $('#sidePaddingSizeValue').val(value);
            currentGlobalThemeSettings.appearance.sidePadding = value + 'px';
            handleGlobalSettingChange('sidePadding', value + 'px');
        });
        
        $('#edgeRounding').on('change', function() {
            currentGlobalThemeSettings.appearance.edgeRounding = $(this).val();
            handleGlobalSettingChange('edgeRounding', $(this).val());
        });
        
        // Typography event listeners
        $('.font-search-input[data-font-type="heading"]').on('change', function() {
            currentGlobalThemeSettings.typography.heading.font = $(this).data('font-value') || $(this).val();
            handleGlobalSettingChange('typography.heading.font', currentGlobalThemeSettings.typography.heading.font);
        });
        
        $('#headingUppercase').on('change', function() {
            currentGlobalThemeSettings.typography.heading.uppercase = $(this).is(':checked');
            handleGlobalSettingChange('typography.heading.uppercase', currentGlobalThemeSettings.typography.heading.uppercase);
        });
        
        $('#headingLetterSpacing, #headingLetterSpacingValue').on('input change', function() {
            const value = $(this).val();
            $('#headingLetterSpacing').val(value);
            $('#headingLetterSpacingValue').val(value);
            currentGlobalThemeSettings.typography.heading.letterSpacing = parseFloat(value);
            handleGlobalSettingChange('typography.heading.letterSpacing', value);
        });
        
        $('.font-search-input[data-font-type="body"]').on('change', function() {
            currentGlobalThemeSettings.typography.body.font = $(this).data('font-value') || $(this).val();
            handleGlobalSettingChange('typography.body.font', currentGlobalThemeSettings.typography.body.font);
        });
        
        // Handle custom font picker event for body typography
        $(document).on('fontChanged', '.font-search-input[data-font-type="body"]', function(e, fontType, fontValue) {
            console.log('[DEBUG] Body font changed:', fontValue);
            currentGlobalThemeSettings.typography.body.font = fontValue;
            handleGlobalSettingChange('typography.body.font', fontValue);
            
            // Trigger preview update
            renderPreview();
        });
        
        $('#bodyFontSize, #bodyFontSizeValue').on('input change', function() {
            const value = $(this).val();
            $('#bodyFontSize').val(value);
            $('#bodyFontSizeValue').val(value);
            currentGlobalThemeSettings.typography.body.fontSize = value + 'px';
            handleGlobalSettingChange('typography.body.fontSize', value + 'px');
        });
        
        // Menu typography
        $('.font-search-input[data-font-type="menu"]').on('change', function() {
            currentGlobalThemeSettings.typography.menu.font = $(this).data('font-value') || $(this).val();
            handleGlobalSettingChange('typography.menu.font', currentGlobalThemeSettings.typography.menu.font);
        });
        
        $('#menuUppercase').on('change', function() {
            currentGlobalThemeSettings.typography.menu.uppercase = $(this).is(':checked');
            handleGlobalSettingChange('typography.menu.uppercase', currentGlobalThemeSettings.typography.menu.uppercase);
        });
        
        $('#menuFontSize, #menuFontSizeValue').on('input change', function() {
            const value = $(this).val();
            $('#menuFontSize').val(value);
            $('#menuFontSizeValue').val(value);
            currentGlobalThemeSettings.typography.menu.fontSize = value;
            handleGlobalSettingChange('typography.menu.fontSize', value);
        });
        
        $('#menuLetterSpacing, #menuLetterSpacingValue').on('input change', function() {
            const value = $(this).val();
            $('#menuLetterSpacing').val(value);
            $('#menuLetterSpacingValue').val(value);
            currentGlobalThemeSettings.typography.menu.letterSpacing = parseFloat(value);
            handleGlobalSettingChange('typography.menu.letterSpacing', value);
        });
        
        // Product typography
        $('.font-search-input[data-font-type="product"]').on('change', function() {
            currentGlobalThemeSettings.typography.product.font = $(this).data('font-value') || $(this).val();
            handleGlobalSettingChange('typography.product.font', currentGlobalThemeSettings.typography.product.font);
        });
        
        $('#productUppercase').on('change', function() {
            currentGlobalThemeSettings.typography.product.uppercase = $(this).is(':checked');
            handleGlobalSettingChange('typography.product.uppercase', currentGlobalThemeSettings.typography.product.uppercase);
        });
        
        $('#productFontSize, #productFontSizeValue').on('input change', function() {
            const value = $(this).val();
            $('#productFontSize').val(value);
            $('#productFontSizeValue').val(value);
            currentGlobalThemeSettings.typography.product.fontSize = value;
            handleGlobalSettingChange('typography.product.fontSize', value);
        });
        
        $('#productLetterSpacing, #productLetterSpacingValue').on('input change', function() {
            const value = $(this).val();
            $('#productLetterSpacing').val(value);
            $('#productLetterSpacingValue').val(value);
            currentGlobalThemeSettings.typography.product.letterSpacing = parseFloat(value);
            handleGlobalSettingChange('typography.product.letterSpacing', value);
        });
        
        // Buttons typography
        $('.font-search-input[data-font-type="buttons"]').on('change', function() {
            currentGlobalThemeSettings.typography.buttons.font = $(this).data('font-value') || $(this).val();
            handleGlobalSettingChange('typography.buttons.font', currentGlobalThemeSettings.typography.buttons.font);
        });
        
        $('#buttonsUppercase').on('change', function() {
            currentGlobalThemeSettings.typography.buttons.uppercase = $(this).is(':checked');
            handleGlobalSettingChange('typography.buttons.uppercase', currentGlobalThemeSettings.typography.buttons.uppercase);
        });
        
        $('#buttonsFontSize, #buttonsFontSizeValue').on('input change', function() {
            const value = $(this).val();
            $('#buttonsFontSize').val(value);
            $('#buttonsFontSizeValue').val(value);
            currentGlobalThemeSettings.typography.buttons.fontSize = value;
            handleGlobalSettingChange('typography.buttons.fontSize', value);
        });
        
        $('#buttonsLetterSpacing, #buttonsLetterSpacingValue').on('input change', function() {
            const value = $(this).val();
            $('#buttonsLetterSpacing').val(value);
            $('#buttonsLetterSpacingValue').val(value);
            currentGlobalThemeSettings.typography.buttons.letterSpacing = parseFloat(value);
            handleGlobalSettingChange('typography.buttons.letterSpacing', value);
        });
        
        // Product cards event listeners
        $('#productCardsImageRatio').on('change', function() {
            currentGlobalThemeSettings.productCards.imageRatio = $(this).val();
            handleGlobalSettingChange('productCards.imageRatio', $(this).val());
        });
        
        $('#show-vendor-toggle').on('change', function() {
            currentGlobalThemeSettings.productCards.showVendor = $(this).is(':checked');
            handleGlobalSettingChange('productCards.showVendor', $(this).is(':checked'));
        });
        
        $('#show-currency-code-toggle').on('change', function() {
            currentGlobalThemeSettings.productCards.showCurrencyCode = $(this).is(':checked');
            handleGlobalSettingChange('productCards.showCurrencyCode', $(this).is(':checked'));
        });
        
        $('#show-color-count-toggle').on('change', function() {
            currentGlobalThemeSettings.productCards.showColorCount = $(this).is(':checked');
            handleGlobalSettingChange('productCards.showColorCount', $(this).is(':checked'));
        });
        
        $('#color-card-background-toggle').on('change', function() {
            currentGlobalThemeSettings.productCards.colorCardBackground = $(this).is(':checked');
            handleGlobalSettingChange('productCards.colorCardBackground', $(this).is(':checked'));
        });
        
        $('#darken-image-background-toggle').on('change', function() {
            currentGlobalThemeSettings.productCards.darkenImageBackground = $(this).is(':checked');
            handleGlobalSettingChange('productCards.darkenImageBackground', $(this).is(':checked'));
        });
        
        $('#productCardsRating').on('change', function() {
            currentGlobalThemeSettings.productCards.productRating = $(this).val();
            handleGlobalSettingChange('productCards.productRating', $(this).val());
        });
        
        $('#productCardsPriceSize').on('change', function() {
            currentGlobalThemeSettings.productCards.priceLabelSize = $(this).val();
            handleGlobalSettingChange('productCards.priceLabelSize', $(this).val());
        });
        
        $('#productCardsHoverEffect').on('change', function() {
            currentGlobalThemeSettings.productCards.imageHoverEffect = $(this).val();
            handleGlobalSettingChange('productCards.imageHoverEffect', $(this).val());
        });
        
        // Swatches settings
        $('#productCardsSwatchesShow').on('change', function() {
            currentGlobalThemeSettings.productCards.swatchesShow = $(this).val();
            handleGlobalSettingChange('productCards.swatchesShow', $(this).val());
        });
        
        $('#productCardsSwatchesDesktop').on('change', function() {
            currentGlobalThemeSettings.productCards.swatchesDesktop = $(this).val();
            handleGlobalSettingChange('productCards.swatchesDesktop', $(this).val());
        });
        
        $('input[name="show-on-mobile"]').on('change', function() {
            currentGlobalThemeSettings.productCards.swatchesMobile = $(this).val();
            handleGlobalSettingChange('productCards.swatchesMobile', $(this).val());
        });
        
        $('#hide-single-value-toggle').on('change', function() {
            currentGlobalThemeSettings.productCards.hideSingleValueSwatches = $(this).is(':checked');
            handleGlobalSettingChange('productCards.hideSingleValueSwatches', $(this).is(':checked'));
        });
        
        // Quick buy buttons
        $('#show-quick-view-toggle').on('change', function() {
            currentGlobalThemeSettings.productCards.showQuickView = $(this).is(':checked');
            handleGlobalSettingChange('productCards.showQuickView', $(this).is(':checked'));
        });
        
        $('#show-add-to-cart-toggle').on('change', function() {
            currentGlobalThemeSettings.productCards.showAddToCart = $(this).is(':checked');
            handleGlobalSettingChange('productCards.showAddToCart', $(this).is(':checked'));
        });
        
        $('input[name="desktop-button-style"]').on('change', function() {
            currentGlobalThemeSettings.productCards.desktopButtonStyle = $(this).val();
            handleGlobalSettingChange('productCards.desktopButtonStyle', $(this).val());
        });
        
        $('#show-buttons-on-hover-toggle').on('change', function() {
            currentGlobalThemeSettings.productCards.showButtonsOnHover = $(this).is(':checked');
            handleGlobalSettingChange('productCards.showButtonsOnHover', $(this).is(':checked'));
        });
        
        // Product badges settings
        $('#productCardsBadgesDesktop').on('change', function() {
            currentGlobalThemeSettings.productCards.badgesDesktopPosition = $(this).val();
            handleGlobalSettingChange('productCards.badgesDesktopPosition', $(this).val());
        });
        
        $('#pc-show-sold-out-badge-toggle').on('change', function() {
            currentGlobalThemeSettings.productCards.showSoldOutBadge = $(this).is(':checked');
            handleGlobalSettingChange('productCards.showSoldOutBadge', $(this).is(':checked'));
        });
        
        $('#pc-show-sale-badge-toggle').on('change', function() {
            currentGlobalThemeSettings.productCards.showSaleBadge = $(this).is(':checked');
            handleGlobalSettingChange('productCards.showSaleBadge', $(this).is(':checked'));
        });
        
        $('#pc-show-sale-badge-next-to-price-toggle').on('change', function() {
            currentGlobalThemeSettings.productCards.showSaleBadgeNextToPrice = $(this).is(':checked');
            handleGlobalSettingChange('productCards.showSaleBadgeNextToPrice', $(this).is(':checked'));
        });
        
        $('#pc-highlight-sale-price-toggle').on('change', function() {
            currentGlobalThemeSettings.productCards.highlightSalePrice = $(this).is(':checked');
            handleGlobalSettingChange('productCards.highlightSalePrice', $(this).is(':checked'));
        });
        
        $('#pc-show-custom-1-badge-toggle').on('change', function() {
            currentGlobalThemeSettings.productCards.showCustom1Badge = $(this).is(':checked');
            handleGlobalSettingChange('productCards.showCustom1Badge', $(this).is(':checked'));
        });
        
        $('#pc-show-custom-2-badge-toggle').on('change', function() {
            currentGlobalThemeSettings.productCards.showCustom2Badge = $(this).is(':checked');
            handleGlobalSettingChange('productCards.showCustom2Badge', $(this).is(':checked'));
        });
        
        $('#pc-show-custom-3-badge-toggle').on('change', function() {
            currentGlobalThemeSettings.productCards.showCustom3Badge = $(this).is(':checked');
            handleGlobalSettingChange('productCards.showCustom3Badge', $(this).is(':checked'));
        });
        
        // Product Badges (independent section) event listeners
        // Sold out badge
        $('#sold-out-bg-color, input[data-color-for="sold-out-bg-color"]').on('input change', function() {
            const value = $(this).val();
            $('#sold-out-bg-color').val(value);
            $('input[data-color-for="sold-out-bg-color"]').val(value);
            currentGlobalThemeSettings.productBadges.soldOut.background = value;
            handleGlobalSettingChange('productBadges.soldOut.background', value);
        });
        
        $('#sold-out-text-color, input[data-color-for="sold-out-text-color"]').on('input change', function() {
            const value = $(this).val();
            $('#sold-out-text-color').val(value);
            $('input[data-color-for="sold-out-text-color"]').val(value);
            currentGlobalThemeSettings.productBadges.soldOut.text = value;
            handleGlobalSettingChange('productBadges.soldOut.text', value);
        });
        
        // Sale badge
        $('#sale-badge-show-as').on('change', function() {
            currentGlobalThemeSettings.productBadges.sale.showAs = $(this).val();
            handleGlobalSettingChange('productBadges.sale.showAs', $(this).val());
        });
        
        $('#sale-bg-color, input[data-color-for="sale-bg-color"]').on('input change', function() {
            const value = $(this).val();
            $('#sale-bg-color').val(value);
            $('input[data-color-for="sale-bg-color"]').val(value);
            currentGlobalThemeSettings.productBadges.sale.background = value;
            handleGlobalSettingChange('productBadges.sale.background', value);
        });
        
        $('#sale-text-color, input[data-color-for="sale-text-color"]').on('input change', function() {
            const value = $(this).val();
            $('#sale-text-color').val(value);
            $('input[data-color-for="sale-text-color"]').val(value);
            currentGlobalThemeSettings.productBadges.sale.text = value;
            handleGlobalSettingChange('productBadges.sale.text', value);
        });
        
        // Sale price badge
        $('#sale-price-badge-show-as').on('change', function() {
            currentGlobalThemeSettings.productBadges.salePriceNext.showAs = $(this).val();
            handleGlobalSettingChange('productBadges.salePriceNext.showAs', $(this).val());
        });
        
        $('#sale-price-bg-color, input[data-color-for="sale-price-bg-color"]').on('input change', function() {
            const value = $(this).val();
            $('#sale-price-bg-color').val(value);
            $('input[data-color-for="sale-price-bg-color"]').val(value);
            currentGlobalThemeSettings.productBadges.salePriceNext.background = value;
            handleGlobalSettingChange('productBadges.salePriceNext.background', value);
        });
        
        $('#sale-price-text-color, input[data-color-for="sale-price-text-color"]').on('input change', function() {
            const value = $(this).val();
            $('#sale-price-text-color').val(value);
            $('input[data-color-for="sale-price-text-color"]').val(value);
            currentGlobalThemeSettings.productBadges.salePriceNext.text = value;
            handleGlobalSettingChange('productBadges.salePriceNext.text', value);
        });
        
        // Sale highlight
        $('#sale-highlight-text-color, input[data-color-for="sale-highlight-text-color"]').on('input change', function() {
            const value = $(this).val();
            $('#sale-highlight-text-color').val(value);
            $('input[data-color-for="sale-highlight-text-color"]').val(value);
            currentGlobalThemeSettings.productBadges.saleHighlight.text = value;
            handleGlobalSettingChange('productBadges.saleHighlight.text', value);
        });
        
        // Custom 1 badge
        $('#custom1-badge-text').on('input change', function() {
            currentGlobalThemeSettings.productBadges.custom1.text = $(this).val();
            handleGlobalSettingChange('productBadges.custom1.text', $(this).val());
        });
        
        $('#custom1-badge-tag').on('input change', function() {
            currentGlobalThemeSettings.productBadges.custom1.tag = $(this).val();
            handleGlobalSettingChange('productBadges.custom1.tag', $(this).val());
        });
        
        $('#custom1-bg-color, input[data-color-for="custom1-bg-color"]').on('input change', function() {
            const value = $(this).val();
            $('#custom1-bg-color').val(value);
            $('input[data-color-for="custom1-bg-color"]').val(value);
            currentGlobalThemeSettings.productBadges.custom1.background = value;
            handleGlobalSettingChange('productBadges.custom1.background', value);
        });
        
        $('#custom1-text-color, input[data-color-for="custom1-text-color"]').on('input change', function() {
            const value = $(this).val();
            $('#custom1-text-color').val(value);
            $('input[data-color-for="custom1-text-color"]').val(value);
            currentGlobalThemeSettings.productBadges.custom1.textColor = value;
            handleGlobalSettingChange('productBadges.custom1.textColor', value);
        });
        
        // Cart event listeners
        $('#cart-show-as').on('change', function() {
            currentGlobalThemeSettings.cart.showAs = $(this).val();
            handleGlobalSettingChange('cart.showAs', $(this).val());
        });
        
        $('#show-sticky-cart-toggle').on('change', function() {
            currentGlobalThemeSettings.cart.showStickyCart = $(this).is(':checked');
            handleGlobalSettingChange('cart.showStickyCart', $(this).is(':checked'));
        });
        
        // Cart status colors
        $('#cart-status-bg-color, input[data-color-for="cart-status-bg-color"]').on('input change', function() {
            const value = $(this).val();
            $('#cart-status-bg-color').val(value);
            $('input[data-color-for="cart-status-bg-color"]').val(value);
            currentGlobalThemeSettings.cart.cartStatus.background = value;
            handleGlobalSettingChange('cart.cartStatus.background', value);
        });
        
        $('#cart-status-text-color, input[data-color-for="cart-status-text-color"]').on('input change', function() {
            const value = $(this).val();
            $('#cart-status-text-color').val(value);
            $('input[data-color-for="cart-status-text-color"]').val(value);
            currentGlobalThemeSettings.cart.cartStatus.text = value;
            handleGlobalSettingChange('cart.cartStatus.text', value);
        });
        
        // Free shipping bar
        $('#show-progress-bar-toggle').on('change', function() {
            currentGlobalThemeSettings.cart.freeShipping.showProgressBar = $(this).is(':checked');
            handleGlobalSettingChange('cart.freeShipping.showProgressBar', $(this).is(':checked'));
        });
        
        $('#free-shipping-threshold').on('input change', function() {
            currentGlobalThemeSettings.cart.freeShipping.threshold = parseFloat($(this).val()) || 0;
            handleGlobalSettingChange('cart.freeShipping.threshold', currentGlobalThemeSettings.cart.freeShipping.threshold);
        });
        
        $('#progress-bar-color, input[data-color-for="progress-bar-color"]').on('input change', function() {
            const value = $(this).val();
            $('#progress-bar-color').val(value);
            $('input[data-color-for="progress-bar-color"]').val(value);
            currentGlobalThemeSettings.cart.freeShipping.progressBarColor = value;
            handleGlobalSettingChange('cart.freeShipping.progressBarColor', value);
        });
        
        $('#progress-bar-track').on('change', function() {
            currentGlobalThemeSettings.cart.freeShipping.progressBarTrack = $(this).val();
            handleGlobalSettingChange('cart.freeShipping.progressBarTrack', $(this).val());
        });
        
        $('#message-color, input[data-color-for="message-color"]').on('input change', function() {
            const value = $(this).val();
            $('#message-color').val(value);
            $('input[data-color-for="message-color"]').val(value);
            currentGlobalThemeSettings.cart.freeShipping.messageColor = value;
            handleGlobalSettingChange('cart.freeShipping.messageColor', value);
        });
        
        // Favicon event listeners
        $('#favicon-select-btn').on('click', function() {
            $('#favicon-upload').click();
        });
        
        $('#favicon-upload').on('change', async function() {
            const file = this.files[0];
            if (file) {
                // Validate file type
                if (!file.type.startsWith('image/')) {
                    alert('Please select an image file');
                    return;
                }
                
                // Create form data for upload
                const formData = new FormData();
                formData.append('favicon', file);
                
                try {
                    // For now, we'll create a local preview
                    const reader = new FileReader();
                    reader.onload = function(e) {
                        const preview = $('#favicon-preview');
                        preview.html(`<img src="${e.target.result}" alt="Favicon preview" style="max-width: 100%; height: auto;">`);
                        $('#favicon-select-btn').hide();
                        $('#favicon-remove-btn').show();
                        
                        // Store the data URL temporarily
                        currentGlobalThemeSettings.favicon.url = e.target.result;
                        currentGlobalThemeSettings.favicon.fileName = file.name;
                        handleGlobalSettingChange('favicon.url', e.target.result);
                    };
                    reader.readAsDataURL(file);
                    
                    // TODO: In production, upload to server and get URL
                    // const response = await fetch('/api/builder/upload/favicon', {
                    //     method: 'POST',
                    //     body: formData
                    // });
                    // const { url } = await response.json();
                    // currentGlobalThemeSettings.favicon.url = url;
                    
                } catch (error) {
                    console.error('Error uploading favicon:', error);
                    alert('Error uploading favicon. Please try again.');
                }
            }
        });
        
        $('#favicon-remove-btn').on('click', function() {
            $('#favicon-preview').html('<span class="no-image-text" data-i18n="favicon.noImageSelected">No image selected</span>');
            $('#favicon-upload').val('');
            $('#favicon-select-btn').show();
            $('#favicon-remove-btn').hide();
            
            currentGlobalThemeSettings.favicon.url = '';
            currentGlobalThemeSettings.favicon.fileName = '';
            handleGlobalSettingChange('favicon.url', '');
            
            // Apply translations to the new text
            setTimeout(applyTranslations, 0);
        });
        
        // Navigation event listeners
        $('#search-show-as').on('change', function() {
            currentGlobalThemeSettings.navigation.search.showAs = $(this).val();
            handleGlobalSettingChange('navigation.search.showAs', $(this).val());
        });
        
        $('#show-back-to-top-toggle').on('change', function() {
            currentGlobalThemeSettings.navigation.backToTop.showButton = $(this).is(':checked');
            handleGlobalSettingChange('navigation.backToTop.showButton', $(this).is(':checked'));
        });
        
        $('#back-to-top-position').on('change', function() {
            currentGlobalThemeSettings.navigation.backToTop.position = $(this).val();
            handleGlobalSettingChange('navigation.backToTop.position', $(this).val());
        });
        
        // Social Media event listeners
        $('input[name="icon-style"]').on('change', function() {
            currentGlobalThemeSettings.socialMedia.iconStyle = $(this).val();
            handleGlobalSettingChange('socialMedia.iconStyle', $(this).val());
        });
        
        // Social platform inputs
        const socialPlatforms = ['instagram', 'facebook', 'twitter', 'youtube', 'pinterest', 'tiktok', 'tumblr', 'snapchat', 'linkedin', 'vimeo'];
        
        socialPlatforms.forEach(platform => {
            $(`#social-${platform}`).on('input change', function() {
                currentGlobalThemeSettings.socialMedia[platform] = $(this).val();
                handleGlobalSettingChange(`socialMedia.${platform}`, $(this).val());
            });
        });
        
        // Swatches event listeners
        // Primary swatch settings
        $('#swatchesPrimaryOptionName').on('input change', function() {
            currentGlobalThemeSettings.swatches.primary.optionName = $(this).val();
            handleGlobalSettingChange('swatches.primary.optionName', $(this).val());
        });
        
        $('#swatchesPrimaryProductCardsShape').on('change', function() {
            currentGlobalThemeSettings.swatches.primary.productCardsShape = $(this).val();
            handleGlobalSettingChange('swatches.primary.productCardsShape', $(this).val());
        });
        
        $('#swatchesPrimaryProductCardsSize').on('input', function() {
            currentGlobalThemeSettings.swatches.primary.productCardsSize = $(this).val();
            handleGlobalSettingChange('swatches.primary.productCardsSize', $(this).val());
            $(this).closest('div').find('.range-value').text($(this).val());
        });
        
        $('#swatchesPrimaryProductPagesShape').on('change', function() {
            currentGlobalThemeSettings.swatches.primary.productPagesShape = $(this).val();
            handleGlobalSettingChange('swatches.primary.productPagesShape', $(this).val());
        });
        
        $('#swatchesPrimaryProductPagesSize').on('input', function() {
            currentGlobalThemeSettings.swatches.primary.productPagesSize = $(this).val();
            handleGlobalSettingChange('swatches.primary.productPagesSize', $(this).val());
            $(this).closest('div').find('.range-value').text($(this).val());
        });
        
        $('#swatchesPrimaryFiltersShape').on('change', function() {
            currentGlobalThemeSettings.swatches.primary.filtersShape = $(this).val();
            handleGlobalSettingChange('swatches.primary.filtersShape', $(this).val());
        });
        
        $('#swatchesPrimaryFiltersSize').on('input', function() {
            currentGlobalThemeSettings.swatches.primary.filtersSize = $(this).val();
            handleGlobalSettingChange('swatches.primary.filtersSize', $(this).val());
            $(this).closest('div').find('.range-value').text($(this).val());
        });
        
        $('#swatchesPrimaryCustomColors').on('input change', function() {
            currentGlobalThemeSettings.swatches.primary.customColors = $(this).val();
            handleGlobalSettingChange('swatches.primary.customColors', $(this).val());
        });
        
        // Secondary swatch settings
        $('#swatchesSecondaryOptionNames').on('input change', function() {
            currentGlobalThemeSettings.swatches.secondary.optionNames = $(this).val();
            handleGlobalSettingChange('swatches.secondary.optionNames', $(this).val());
        });
        
        $('#swatchesSecondaryProductPagesShape').on('change', function() {
            currentGlobalThemeSettings.swatches.secondary.productPagesShape = $(this).val();
            handleGlobalSettingChange('swatches.secondary.productPagesShape', $(this).val());
        });
        
        $('#swatchesSecondaryProductPagesSize').on('input', function() {
            currentGlobalThemeSettings.swatches.secondary.productPagesSize = $(this).val();
            handleGlobalSettingChange('swatches.secondary.productPagesSize', $(this).val());
            $(this).closest('div').find('.range-value').text($(this).val());
        });
        
        $('#swatchesSecondaryFiltersShape').on('change', function() {
            currentGlobalThemeSettings.swatches.secondary.filtersShape = $(this).val();
            handleGlobalSettingChange('swatches.secondary.filtersShape', $(this).val());
        });
        
        $('#swatchesSecondaryFiltersSize').on('input', function() {
            currentGlobalThemeSettings.swatches.secondary.filtersSize = $(this).val();
            handleGlobalSettingChange('swatches.secondary.filtersSize', $(this).val());
            $(this).closest('div').find('.range-value').text($(this).val());
        });
        
        $('#swatchesSecondaryCustomColors').on('input change', function() {
            currentGlobalThemeSettings.swatches.secondary.customColors = $(this).val();
            handleGlobalSettingChange('swatches.secondary.customColors', $(this).val());
        });
        
        // Listener para el selector de esquemas de color (ID: #colorSchemeSelect) - VERSIÓN ACTUALIZADA
        $(document).on('change', '#colorSchemeSelect', function() {
            const selectedSchemeId = $(this).val();
            
            // Load the selected scheme configuration
            loadSchemeConfiguration(selectedSchemeId);
        });

        // Listener para cambios manuales en CUALQUIER campo de color de la sección - VERSIÓN ACTUALIZADA
        $(document).on('input change', '.color-scheme-settings [data-field]', function() {
            const input = $(this);
            const dataField = input.data('field');
            const value = input.val();
            
            console.log(`[DEBUG] Color input changed: ${dataField} = ${value}`);

            // Si el campo NO es 'image-overlay', sincroniza el input gemelo.
            if (!dataField.endsWith('-image-overlay')) {
                if (input.is('input[type="text"]')) {
                    // Si el usuario está escribiendo en el campo de texto...
                    // Solo actualizamos el círculo de color si el formato es un hex completo.
                    const hexColorRegex = /^#[0-9a-fA-F]{6}$/;
                    if (hexColorRegex.test(value)) {
                        // El valor es válido, actualiza el input de color.
                        $(`input[type="color"][data-field="${dataField}"]`).val(value);
                    }
                } else if (input.is('input[type="color"]')) {
                    // Si el usuario usó el selector de color, actualizamos el campo de texto.
                    $(`input[type="text"][data-field="${dataField}"]`).val(value);
                }
            }

            // Actualiza los datos en memoria
            const parts = dataField.split('-');
            const group = parts[0];
            const property = parts.slice(1).join('-');
            
            // Check if this is a color scheme field (starts with "scheme1-", "scheme2-", etc.)
            if (group.startsWith('scheme')) {
                // Extract the scheme name (scheme1, scheme2, etc.) and property
                const schemeName = group; // e.g., "scheme1"
                console.log(`[DEBUG] Field: ${dataField}, Scheme: ${schemeName}, Property: ${property}, Value: ${value}`);
                console.log(`[DEBUG] Current selected scheme: ${currentSelectedColorScheme}`);
                console.log(`[DEBUG] Updating colorSchemes.${schemeName}.${property} = ${value}`);
                
                if (!currentGlobalThemeSettings.colorSchemes) currentGlobalThemeSettings.colorSchemes = {};
                if (!currentGlobalThemeSettings.colorSchemes[schemeName]) {
                    currentGlobalThemeSettings.colorSchemes[schemeName] = {};
                }
                currentGlobalThemeSettings.colorSchemes[schemeName][property] = value;
                
                // Clean up any wrong structures
                if (currentGlobalThemeSettings.colors && currentGlobalThemeSettings.colors.scheme) {
                    delete currentGlobalThemeSettings.colors.scheme;
                }
                // Remove empty scheme objects from colors
                for (let i = 1; i <= 5; i++) {
                    if (currentGlobalThemeSettings.colors && currentGlobalThemeSettings.colors[`scheme${i}`]) {
                        delete currentGlobalThemeSettings.colors[`scheme${i}`];
                    }
                }
                
                // IMPORTANT: Also remove any nested primary/secondary/contrasting from the current scheme
                if (currentGlobalThemeSettings.colorSchemes[schemeName].primary) {
                    delete currentGlobalThemeSettings.colorSchemes[schemeName].primary;
                }
                if (currentGlobalThemeSettings.colorSchemes[schemeName].secondary) {
                    delete currentGlobalThemeSettings.colorSchemes[schemeName].secondary;
                }
                if (currentGlobalThemeSettings.colorSchemes[schemeName].contrasting) {
                    delete currentGlobalThemeSettings.colorSchemes[schemeName].contrasting;
                }
            } else if (group === 'primary' || group === 'secondary' || group === 'contrasting') {
                // This is for primary/secondary/contrasting colors
                console.log(`[DEBUG] Updating colors.${group}.${property} = ${value}`);
                
                if (!currentGlobalThemeSettings.colors) currentGlobalThemeSettings.colors = {};
                if (!currentGlobalThemeSettings.colors[group]) currentGlobalThemeSettings.colors[group] = {};
                currentGlobalThemeSettings.colors[group][property] = value;
            }

            console.log(`[DEBUG] hasPendingGlobalSettingsChanges set to true`);
            hasPendingGlobalSettingsChanges = true;
            updateSaveButtonState();
            
            // Apply styles to preview immediately
            applyGlobalStylesToPreview(currentGlobalThemeSettings);
        });
        
        // Update save button state
        updateSaveButtonState();
    }
    
    // Function to populate announcement bar fields with current values
    function populateAnnouncementBarFields() {
        const config = currentSectionsConfig.announcementBar;
        $('#show-only-home').prop('checked', config.showOnlyHomePage);
        $('#color-scheme-select').val(config.colorScheme);
        $('#width-select').val(config.width);
        $('#show-nav-arrows').prop('checked', config.showNavigationArrows);
        $(`input[name="autoplay-mode"][value="${config.autoplayMode}"]`).prop('checked', true);
        $('#autoplay-speed').val(config.autoplaySpeed);
        $('.shopify-number-input').val(config.autoplaySpeed);
        $('#animation-style').val(config.animationStyle || 'none');
        $('#show-language-selector').prop('checked', config.showLanguageSelector);
        $('#show-currency-selector').prop('checked', config.showCurrencySelector);
        $('#show-social-icons').prop('checked', config.showSocialMediaIcons);
    }
    
    // Function to attach event listeners for announcement bar settings
    function attachAnnouncementBarEventListeners() {
        // Back button
        $('.back-to-sections-btn').on('click', function() {
            window.switchSidebarView('blockList', window.getUpdatedPageData());
        });
        
        // Toggle fields
        $('#show-only-home').on('change', function() {
            currentSectionsConfig.announcementBar.showOnlyHomePage = $(this).is(':checked');
            hasPendingPageStructureChanges = true;
            updateSaveButtonState();
            console.log('[DEBUG] Announcement bar config changed - showOnlyHomePage');
        });
        
        $('#color-scheme-select').on('change', function() {
            currentSectionsConfig.announcementBar.colorScheme = $(this).val();
            hasPendingPageStructureChanges = true;
            updateSaveButtonState();
            console.log('[DEBUG] Announcement bar config changed - colorScheme');
            
            // Re-render the preview to show the new color scheme
            renderPreview();
        });
        
        $('#width-select').on('change', function() {
            currentSectionsConfig.announcementBar.width = $(this).val();
            hasPendingPageStructureChanges = true;
            updateSaveButtonState();
            console.log('[DEBUG] Announcement bar config changed - width');
        });
        
        $('#show-nav-arrows').on('change', function() {
            currentSectionsConfig.announcementBar.showNavigationArrows = $(this).is(':checked');
            hasPendingPageStructureChanges = true;
            updateSaveButtonState();
            console.log('[DEBUG] Announcement bar config changed - showNavigationArrows');
        });
        
        $('input[name="autoplay-mode"]').on('change', function() {
            currentSectionsConfig.announcementBar.autoplayMode = $(this).val();
            hasPendingPageStructureChanges = true;
            updateSaveButtonState();
            console.log('[DEBUG] Announcement bar config changed - autoplayMode');
        });
        
        $('#autoplay-speed').on('input', function() {
            const value = $(this).val();
            currentSectionsConfig.announcementBar.autoplaySpeed = parseInt(value);
            $(this).closest('.range-with-inputs').find('.shopify-number-input').val(value);
            hasPendingPageStructureChanges = true;
            updateSaveButtonState();
        });
        
        $('.shopify-number-input').on('input', function() {
            const value = $(this).val();
            currentSectionsConfig.announcementBar.autoplaySpeed = parseInt(value);
            $(this).closest('.range-with-inputs').find('#autoplay-speed').val(value);
            hasPendingPageStructureChanges = true;
            updateSaveButtonState();
        });
        
        $('#animation-style').on('change', function() {
            currentSectionsConfig.announcementBar.animationStyle = $(this).val();
            hasPendingPageStructureChanges = true;
            updateSaveButtonState();
            console.log('[DEBUG] Announcement bar config changed - animationStyle');
            
            // Re-render to apply animation
            renderPreview();
        });
        
        $('#show-language-selector').on('change', function() {
            currentSectionsConfig.announcementBar.showLanguageSelector = $(this).is(':checked');
            hasPendingPageStructureChanges = true;
            updateSaveButtonState();
            console.log('[DEBUG] Announcement bar config changed - showLanguageSelector');
        });
        
        $('#show-currency-selector').on('change', function() {
            currentSectionsConfig.announcementBar.showCurrencySelector = $(this).is(':checked');
            hasPendingPageStructureChanges = true;
            updateSaveButtonState();
            console.log('[DEBUG] Announcement bar config changed - showCurrencySelector');
        });
        
        $('#show-social-icons').on('change', function() {
            currentSectionsConfig.announcementBar.showSocialMediaIcons = $(this).is(':checked');
            hasPendingPageStructureChanges = true;
            updateSaveButtonState();
            console.log('[DEBUG] Announcement bar config changed - showSocialMediaIcons');
        });
    }
    
    // Function to populate announcement item fields with current values
    function populateAnnouncementItemFields(announcementId) {
        const config = currentSectionsConfig.announcements[announcementId];
        if (!config) {
            // Initialize with default values if not exists
            currentSectionsConfig.announcements[announcementId] = {
                text: lang && lang['announcementItem.makeAnnouncement'] || 'Make an announcement',
                link: '',
                icon: 'none',
                customIcon: '',
                isHidden: false  // Default to visible
            };
            return;
        }
        
        $('.rich-text-input').val(config.text || '');
        $('.shopify-input[type="text"]').val(config.link || '');
        $('#announcement-icon').val(config.icon || 'none');
        // Set visibility checkbox state - default to visible (checked) if not specified
        $('#announcement-item-visibility').prop('checked', !config.isHidden);
    }
    
    // Function to update existing attachAnnouncementItemEventListeners
    function attachAnnouncementItemEventListeners() {
        const announcementId = $('.sidebar-view-header').data('announcement-id') || 
                              window.location.hash.split('/').pop() || 
                              'temp-' + Date.now();
        
        // Back button
        $('.back-to-sections-btn').on('click', function() {
            window.switchSidebarView('blockList', window.getUpdatedPageData());
        });
        
        // Text input
        $('.rich-text-input').on('input change', function() {
            if (!currentSectionsConfig.announcements[announcementId]) {
                currentSectionsConfig.announcements[announcementId] = {};
            }
            const newText = $(this).val();
            currentSectionsConfig.announcements[announcementId].text = newText;
            hasPendingPageStructureChanges = true;
            updateSaveButtonState();
            console.log('[DEBUG] Announcement item text changed:', {
                announcementId: announcementId,
                newText: newText,
                currentConfig: currentSectionsConfig.announcements[announcementId]
            });
        });
        
        // Link input
        $('.shopify-input[type="text"]').on('input change', function() {
            if (!currentSectionsConfig.announcements[announcementId]) {
                currentSectionsConfig.announcements[announcementId] = {};
            }
            currentSectionsConfig.announcements[announcementId].link = $(this).val();
            hasPendingPageStructureChanges = true;
            updateSaveButtonState();
            console.log('[DEBUG] Announcement item link changed');
        });
        
        // Use icon library checkbox
        $('#use-icon-library').on('change', function() {
            const useLibrary = $(this).is(':checked');
            if (useLibrary) {
                $('#icon-library-section').show();
                $('#custom-icon-section').hide();
            } else {
                $('#icon-library-section').hide();
                $('#custom-icon-section').show();
            }
            if (!currentSectionsConfig.announcements[announcementId]) {
                currentSectionsConfig.announcements[announcementId] = {};
            }
            currentSectionsConfig.announcements[announcementId].useIconLibrary = useLibrary;
            hasPendingPageStructureChanges = true;
            updateSaveButtonState();
        });
        
        // Icon library trigger
        $('#icon-library-trigger').on('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            $('#icon-library-dropdown').toggle();
        });
        
        // Icon selection from library
        $(document).on('click', '.icon-item', function() {
            const icon = $(this).data('icon');
            const name = $(this).data('name');
            
            // Update preview
            if (icon === 'none') {
                $('#selected-icon-preview').css('visibility', 'hidden');
                $('#selected-icon-name').text('None');
            } else {
                $('#selected-icon-preview').css('visibility', 'visible').text(icon);
                $('#selected-icon-name').text(name);
            }
            
            // Mark as selected
            $('.icon-item').removeClass('selected');
            $(this).addClass('selected');
            
            // Close dropdown
            $('#icon-library-dropdown').hide();
            
            // Save to config
            if (!currentSectionsConfig.announcements[announcementId]) {
                currentSectionsConfig.announcements[announcementId] = {};
            }
            currentSectionsConfig.announcements[announcementId].icon = icon;
            currentSectionsConfig.announcements[announcementId].iconName = name;
            hasPendingPageStructureChanges = true;
            updateSaveButtonState();
            console.log('[DEBUG] Announcement item icon changed:', icon, name);
        });
        
        // Icon color picker
        $('#icon-color-picker').on('change', function() {
            const color = $(this).val();
            $('#icon-color-text').val(color);
            if (!currentSectionsConfig.announcements[announcementId]) {
                currentSectionsConfig.announcements[announcementId] = {};
            }
            currentSectionsConfig.announcements[announcementId].iconColor = color;
            hasPendingPageStructureChanges = true;
            updateSaveButtonState();
        });
        
        $('#icon-color-text').on('input', function() {
            const color = $(this).val();
            if (/^#[0-9A-F]{6}$/i.test(color)) {
                $('#icon-color-picker').val(color);
                if (!currentSectionsConfig.announcements[announcementId]) {
                    currentSectionsConfig.announcements[announcementId] = {};
                }
                currentSectionsConfig.announcements[announcementId].iconColor = color;
                hasPendingPageStructureChanges = true;
                updateSaveButtonState();
            }
        });
        
        // Color copy button
        $('.shopify-color-copy').on('click', function(e) {
            e.preventDefault();
            const colorText = $(this).siblings('.shopify-color-text').val();
            navigator.clipboard.writeText(colorText).then(() => {
                const originalIcon = $(this).find('i').text();
                $(this).find('i').text('check');
                setTimeout(() => {
                    $(this).find('i').text(originalIcon);
                }, 2000);
            });
        });
        
        // Custom icon upload button
        $('#custom-icon-upload-btn').on('click', function(e) {
            e.preventDefault();
            $('#custom-icon-file').click();
        });
        
        // Custom icon file change
        $('#custom-icon-file').on('change', function(e) {
            const file = e.target.files[0];
            if (file) {
                const reader = new FileReader();
                reader.onload = function(e) {
                    $('#custom-icon-preview img').attr('src', e.target.result);
                    $('#custom-icon-preview').show();
                    
                    if (!currentSectionsConfig.announcements[announcementId]) {
                        currentSectionsConfig.announcements[announcementId] = {};
                    }
                    currentSectionsConfig.announcements[announcementId].customIcon = e.target.result;
                    currentSectionsConfig.announcements[announcementId].useIconLibrary = false;
                    hasPendingPageStructureChanges = true;
                    updateSaveButtonState();
                };
                reader.readAsDataURL(file);
            }
        });
        
        // Remove custom icon
        $('#remove-custom-icon').on('click', function(e) {
            e.preventDefault();
            $('#custom-icon-preview').hide();
            $('#custom-icon-file').val('');
            if (currentSectionsConfig.announcements[announcementId]) {
                delete currentSectionsConfig.announcements[announcementId].customIcon;
                hasPendingPageStructureChanges = true;
                updateSaveButtonState();
            }
        });
        
        // Close dropdown when clicking outside
        $(document).on('click', function(e) {
            if (!$(e.target).closest('.icon-library-wrapper').length) {
                $('#icon-library-dropdown').hide();
            }
        });
        
        // Visibility toggle
        $('#announcement-item-visibility').on('change', function() {
            if (!currentSectionsConfig.announcements[announcementId]) {
                currentSectionsConfig.announcements[announcementId] = {};
            }
            const isVisible = $(this).is(':checked');
            currentSectionsConfig.announcements[announcementId].isHidden = !isVisible;
            hasPendingPageStructureChanges = true;
            updateSaveButtonState();
            console.log('[DEBUG] Announcement item visibility changed:', {
                announcementId: announcementId,
                isVisible: isVisible,
                isHidden: !isVisible
            });
        });
        
        // Delete block button
        $('.delete-block-btn').on('click', function() {
            if (confirm('¿Estás seguro de que quieres eliminar este bloque?')) {
                // Remove from config
                delete currentSectionsConfig.announcements[announcementId];
                hasPendingPageStructureChanges = true;
                updateSaveButtonState();
                // Go back to block list
                switchSidebarView('blockList', currentPageData);
            }
        });
        
        // Toolbar buttons
        $('.toolbar-btn').on('click', function(e) {
            e.preventDefault();
            // TODO: Implement rich text formatting
        });
    }
    
    // Function to populate header settings fields with current values
    function populateHeaderSettingsFields() {
        const config = currentSectionsConfig.header;
        $('#header-color-scheme').val(config.colorScheme);
        $('#header-width').val(config.width);
        $('#header-layout').val(config.layout);
        $('#show-separator').prop('checked', config.showDivider);
        $('#logo-alignment').val(config.logoAlignment);
        $('#menu-select').val(config.menu);
        $('#desktop-logo-size').val(config.desktopLogoSize);
        $('#mobile-logo-size').val(config.mobileLogoSize);
        // Update number inputs
        $('#desktop-logo-size').closest('.range-with-inputs').find('.shopify-number-input').val(config.desktopLogoSize);
        $('#mobile-logo-size').closest('.range-with-inputs').find('.shopify-number-input').val(config.mobileLogoSize);
        $('#icon-style').val(config.iconStyle);
        $('#cart-type-select').val(config.cartType);
        $('#enable-sticky').prop('checked', config.enableStickyHeader);
        $('#open-menu-dropdown').val(config.openMenuDropdown);
        $('#navigation-menu').val(config.navigationMenu);
        
        // Load logos if they exist
        if (config.desktopLogoUrl) {
            const $desktopUpload = $('.desktop-logo-upload');
            $desktopUpload.find('.logo-placeholder').hide();
            $desktopUpload.find('.logo-image').attr('src', config.desktopLogoUrl).show();
            $desktopUpload.find('.select-logo-btn').html('<span data-i18n="headerSettings.changeImage">Change image</span>');
        }
        
        if (config.mobileLogoUrl) {
            const $mobileUpload = $('.mobile-logo-upload');
            $mobileUpload.find('.logo-placeholder').hide();
            $mobileUpload.find('.logo-image').attr('src', config.mobileLogoUrl).show();
            $mobileUpload.find('.select-logo-btn').html('<span data-i18n="headerSettings.changeImage">Change image</span>');
        }
        
        // Load section visibility states
        if (config.sectionVisibility) {
            Object.keys(config.sectionVisibility).forEach(section => {
                const $toggle = $(`.header-visibility-toggle[data-section="${section}"]`);
                const isVisible = config.sectionVisibility[section];
                
                // Replace the entire button content
                const iconHtml = isVisible ? 
                    '<i class="fas fa-eye"></i>' : 
                    '<i class="fas fa-eye-slash"></i>';
                
                $toggle.html(iconHtml);
                $toggle.attr('data-visible', isVisible);
            });
        }
    }
    
    // Function to attach event listeners for header settings
    function attachHeaderSettingsEventListeners() {
        // Back button
        $('.back-to-sections-btn').on('click', function() {
            window.switchSidebarView('blockList', window.getUpdatedPageData());
        });
        
        // Color scheme
        $('#header-color-scheme').on('change', function() {
            currentSectionsConfig.header.colorScheme = $(this).val();
            hasPendingPageStructureChanges = true;
            updateSaveButtonState();
            console.log('[DEBUG] Header config changed - colorScheme');
            // Re-render to apply color scheme changes
            renderPreview();
        });
        
        // Width
        $('#header-width').on('change', function() {
            currentSectionsConfig.header.width = $(this).val();
            hasPendingPageStructureChanges = true;
            updateSaveButtonState();
            console.log('[DEBUG] Header config changed - width');
        });
        
        // Layout
        $('#header-layout').on('change', function() {
            currentSectionsConfig.header.layout = $(this).val();
            hasPendingPageStructureChanges = true;
            updateSaveButtonState();
            console.log('[DEBUG] Header config changed - layout');
            // Re-render to apply layout changes
            renderPreview();
        });
        
        // Show divider
        $('#show-separator').on('change', function() {
            currentSectionsConfig.header.showDivider = $(this).is(':checked');
            hasPendingPageStructureChanges = true;
            updateSaveButtonState();
            console.log('[DEBUG] Header config changed - showDivider');
        });
        
        // Logo alignment
        $('#logo-alignment').on('change', function() {
            currentSectionsConfig.header.logoAlignment = $(this).val();
            hasPendingPageStructureChanges = true;
            updateSaveButtonState();
            console.log('[DEBUG] Header config changed - logoAlignment');
        });
        
        // Menu
        $('#menu-select').on('change', function() {
            currentSectionsConfig.header.menu = $(this).val();
            hasPendingPageStructureChanges = true;
            updateSaveButtonState();
            console.log('[DEBUG] Header config changed - menu');
        });
        
        // Desktop logo size
        $('#desktop-logo-size').on('input', function() {
            const value = $(this).val();
            currentSectionsConfig.header.desktopLogoSize = parseInt(value);
            $(this).closest('.range-with-inputs').find('.shopify-number-input').val(value);
            hasPendingPageStructureChanges = true;
            updateSaveButtonState();
        });
        
        // Mobile logo size
        $('#mobile-logo-size').on('input', function() {
            const value = $(this).val();
            currentSectionsConfig.header.mobileLogoSize = parseInt(value);
            $(this).closest('.range-with-inputs').find('.shopify-number-input').val(value);
            hasPendingPageStructureChanges = true;
            updateSaveButtonState();
        });
        
        // Number inputs sync
        $('.shopify-number-input').on('input', function() {
            const value = $(this).val();
            const $rangeInput = $(this).closest('.range-with-inputs').find('.shopify-range');
            $rangeInput.val(value);
            
            if ($rangeInput.attr('id') === 'desktop-logo-size') {
                currentSectionsConfig.header.desktopLogoSize = parseInt(value);
            } else if ($rangeInput.attr('id') === 'mobile-logo-size') {
                currentSectionsConfig.header.mobileLogoSize = parseInt(value);
            }
            
            hasPendingPageStructureChanges = true;
            updateSaveButtonState();
        });
        
        // Icon style
        $('#icon-style').on('change', function() {
            currentSectionsConfig.header.iconStyle = $(this).val();
            hasPendingPageStructureChanges = true;
            updateSaveButtonState();
            console.log('[DEBUG] Header config changed - iconStyle');
            // Re-render to apply icon style changes
            renderPreview();
        });
        
        // Cart type
        $('#cart-type-select').on('change', function() {
            currentSectionsConfig.header.cartType = $(this).val();
            hasPendingPageStructureChanges = true;
            updateSaveButtonState();
            console.log('[DEBUG] Header config changed - cartType:', $(this).val());
            // Re-render to apply changes
            renderPreview();
        });
        
        // Desktop logo size
        $('#desktop-logo-size').on('input', function() {
            const value = $(this).val();
            currentSectionsConfig.header.desktopLogoSize = parseInt(value);
            $(this).closest('.range-with-inputs').find('.shopify-number-input').val(value);
            hasPendingPageStructureChanges = true;
            updateSaveButtonState();
            console.log('[DEBUG] Header config changed - desktopLogoSize:', value);
            // Re-render to apply changes
            renderPreview();
        });
        
        // Desktop logo size number input
        $('#desktop-logo-size').closest('.range-with-inputs').find('.shopify-number-input').on('input', function() {
            const value = $(this).val();
            currentSectionsConfig.header.desktopLogoSize = parseInt(value);
            $('#desktop-logo-size').val(value);
            hasPendingPageStructureChanges = true;
            updateSaveButtonState();
            console.log('[DEBUG] Header config changed - desktopLogoSize:', value);
            // Re-render to apply changes
            renderPreview();
        });
        
        // Mobile logo size
        $('#mobile-logo-size').on('input', function() {
            const value = $(this).val();
            currentSectionsConfig.header.mobileLogoSize = parseInt(value);
            $(this).closest('.range-with-inputs').find('.shopify-number-input').val(value);
            hasPendingPageStructureChanges = true;
            updateSaveButtonState();
            console.log('[DEBUG] Header config changed - mobileLogoSize:', value);
            // Re-render to apply changes
            renderPreview();
        });
        
        // Mobile logo size number input
        $('#mobile-logo-size').closest('.range-with-inputs').find('.shopify-number-input').on('input', function() {
            const value = $(this).val();
            currentSectionsConfig.header.mobileLogoSize = parseInt(value);
            $('#mobile-logo-size').val(value);
            hasPendingPageStructureChanges = true;
            updateSaveButtonState();
            console.log('[DEBUG] Header config changed - mobileLogoSize:', value);
            // Re-render to apply changes
            renderPreview();
        });
        
        // Enable sticky header
        $('#enable-sticky').on('change', function() {
            currentSectionsConfig.header.enableStickyHeader = $(this).is(':checked');
            hasPendingPageStructureChanges = true;
            updateSaveButtonState();
            console.log('[DEBUG] Header config changed - enableStickyHeader');
        });
        
        // Open menu dropdown
        $('#open-menu-dropdown').on('change', function() {
            currentSectionsConfig.header.openMenuDropdown = $(this).val();
            hasPendingPageStructureChanges = true;
            updateSaveButtonState();
            console.log('[DEBUG] Header config changed - openMenuDropdown:', $(this).val());
        });
        
        // Navigation menu
        $('#navigation-menu').on('change', function() {
            currentSectionsConfig.header.navigationMenu = $(this).val();
            hasPendingPageStructureChanges = true;
            updateSaveButtonState();
            console.log('[DEBUG] Header config changed - navigationMenu');
        });
        
        // Logo upload buttons
        $('.select-logo-btn').on('click', function(e) {
            e.preventDefault();
            const logoType = $(this).data('logo-type');
            const fileInput = logoType === 'desktop' ? $('#desktop-logo-input') : $('#mobile-logo-input');
            fileInput.click();
        });
        
        // Desktop logo file input
        $('#desktop-logo-input').on('change', async function(e) {
            const file = e.target.files[0];
            if (file) {
                try {
                    // Create FormData for upload
                    const formData = new FormData();
                    formData.append('logoFile', file);
                    formData.append('logoType', 'desktop');
                    
                    // Show loading state
                    const $upload = $('.desktop-logo-upload');
                    $upload.find('.select-logo-btn').html('<span data-i18n="headerSettings.uploadingImage">Uploading image...</span>').prop('disabled', true);
                    
                    // Upload to server
                    const response = await fetch('/api/builder/websites/current/upload-logo', {
                        method: 'POST',
                        body: formData,
                        headers: {
                            'RequestVerificationToken': $('[name="__RequestVerificationToken"]').val() || ''
                        }
                    });
                    
                    if (response.ok) {
                        const result = await response.json();
                        currentSectionsConfig.header.desktopLogoUrl = result.logoUrl;
                        
                        // Update preview
                        $upload.find('.logo-placeholder').hide();
                        $upload.find('.logo-image').attr('src', result.logoUrl).show();
                        $upload.find('.select-logo-btn').html('<span data-i18n="headerSettings.changeImage">Change image</span>').prop('disabled', false);
                        
                        hasPendingPageStructureChanges = true;
                        updateSaveButtonState();
                        console.log('[DEBUG] Desktop logo uploaded:', result.logoUrl);
                        // Re-render to show new logo
                        renderPreview();
                    } else {
                        let errorMessage = 'Upload failed';
                        try {
                            const error = await response.json();
                            errorMessage = error.message || errorMessage;
                        } catch (e) {
                            // If response is not JSON, use status text
                            errorMessage = response.statusText || errorMessage;
                        }
                        const uploadFailedText = (window.translations && window.translations[currentLanguage] && window.translations[currentLanguage]['headerSettings.uploadFailed']) || 'Upload failed';
                        alert(uploadFailedText + ': ' + errorMessage);
                        $upload.find('.select-logo-btn').html('<span data-i18n="headerSettings.selectImage">Select</span>').prop('disabled', false);
                    }
                } catch (error) {
                    console.error('Error uploading desktop logo:', error);
                    const uploadFailedText = (window.translations && window.translations[currentLanguage] && window.translations[currentLanguage]['headerSettings.uploadFailed']) || 'Upload failed';
                    alert(uploadFailedText);
                    $('.desktop-logo-upload').find('.select-logo-btn').html('<span data-i18n="headerSettings.selectImage">Select</span>').prop('disabled', false);
                }
            }
        });
        
        // Mobile logo file input
        $('#mobile-logo-input').on('change', async function(e) {
            const file = e.target.files[0];
            if (file) {
                try {
                    // Create FormData for upload
                    const formData = new FormData();
                    formData.append('logoFile', file);
                    formData.append('logoType', 'mobile');
                    
                    // Show loading state
                    const $upload = $('.mobile-logo-upload');
                    $upload.find('.select-logo-btn').html('<span data-i18n="headerSettings.uploadingImage">Uploading image...</span>').prop('disabled', true);
                    
                    // Upload to server
                    const response = await fetch('/api/builder/websites/current/upload-logo', {
                        method: 'POST',
                        body: formData,
                        headers: {
                            'RequestVerificationToken': $('[name="__RequestVerificationToken"]').val() || ''
                        }
                    });
                    
                    if (response.ok) {
                        const result = await response.json();
                        currentSectionsConfig.header.mobileLogoUrl = result.logoUrl;
                        
                        // Update preview
                        $upload.find('.logo-placeholder').hide();
                        $upload.find('.logo-image').attr('src', result.logoUrl).show();
                        $upload.find('.select-logo-btn').html('<span data-i18n="headerSettings.changeImage">Change image</span>').prop('disabled', false);
                        
                        hasPendingPageStructureChanges = true;
                        updateSaveButtonState();
                        console.log('[DEBUG] Mobile logo uploaded:', result.logoUrl);
                        // Re-render to show new logo
                        renderPreview();
                    } else {
                        let errorMessage = 'Upload failed';
                        try {
                            const error = await response.json();
                            errorMessage = error.message || errorMessage;
                        } catch (e) {
                            // If response is not JSON, use status text
                            errorMessage = response.statusText || errorMessage;
                        }
                        const uploadFailedText = (window.translations && window.translations[currentLanguage] && window.translations[currentLanguage]['headerSettings.uploadFailed']) || 'Upload failed';
                        alert(uploadFailedText + ': ' + errorMessage);
                        $upload.find('.select-logo-btn').html('<span data-i18n="headerSettings.selectImage">Select</span>').prop('disabled', false);
                    }
                } catch (error) {
                    console.error('Error uploading mobile logo:', error);
                    const uploadFailedText = (window.translations && window.translations[currentLanguage] && window.translations[currentLanguage]['headerSettings.uploadFailed']) || 'Upload failed';
                    alert(uploadFailedText);
                    $('.mobile-logo-upload').find('.select-logo-btn').html('<span data-i18n="headerSettings.selectImage">Select</span>').prop('disabled', false);
                }
            }
        });
    }
    
    // Simple global function for header section visibility toggle
    window.toggleHeaderSectionVisibility = function(section, button) {
        console.log('[SIMPLE-TOGGLE] Called for section:', section);
        
        // Initialize sectionVisibility if it doesn't exist
        if (!currentSectionsConfig.header.sectionVisibility) {
            currentSectionsConfig.header.sectionVisibility = {
                menu: true,
                logo: true,
                icons: true
            };
        }
        
        // Toggle visibility
        currentSectionsConfig.header.sectionVisibility[section] = !currentSectionsConfig.header.sectionVisibility[section];
        const isVisible = currentSectionsConfig.header.sectionVisibility[section];
        
        console.log('[SIMPLE-TOGGLE] New visibility state:', isVisible);
        
        // Update button content with simple emoji
        if (isVisible) {
            button.innerHTML = '<span style="font-size: 18px;">👁️</span>';
        } else {
            button.innerHTML = '<span style="font-size: 18px; text-decoration: line-through;">👁️</span>';
        }
        
        // Mark as having changes
        hasPendingPageStructureChanges = true;
        updateSaveButtonState();
    };
    
    // Function to update save button state
    function updateSaveButtonState() {
        const hasChanges = hasPendingGlobalSettingsChanges || hasPendingPageStructureChanges;
        const $saveButton = $('#save-builder-btn-topbar');
        
        console.log('[DEBUG] updateSaveButtonState called:', {
            hasPendingGlobalSettingsChanges,
            hasPendingPageStructureChanges,
            hasChanges,
            buttonExists: $saveButton.length > 0
        });
        
        if (hasChanges) {
            $saveButton.removeClass('disabled').prop('disabled', false);
            $saveButton.find('.btn-text').text('Guardar cambios');
        } else {
            $saveButton.addClass('disabled').prop('disabled', true);
            $saveButton.find('.btn-text').text('Guardado');
        }
    }
    
    // Modify the save button click handler
    $('#save-builder-btn-topbar').on('click', async function() {
        console.log('[DEBUG] Save button clicked.');
        console.log(`[DEBUG] Checking for pending changes... Global: ${hasPendingGlobalSettingsChanges}, Page: ${hasPendingPageStructureChanges}`);
        
        const $button = $(this);
        if ($button.hasClass('disabled')) return;
        
        if (!hasPendingGlobalSettingsChanges && !hasPendingPageStructureChanges) {
            console.log('[INFO] No pending changes to save.');
            // Aquí se podría mostrar una notificación al usuario tipo "Nada que guardar"
            return;
        }
        
        $button.addClass('loading').prop('disabled', true);
        $button.find('.btn-text').text('Guardando...');
        
        let savePromises = [];
        
        // Save page structure changes if any
        if (hasPendingPageStructureChanges) {
            console.log('[INFO] Saving page structure...');
            
            // Validate currentWebsiteId
            if (!currentWebsiteId) {
                console.error('[ERROR] Cannot save: currentWebsiteId is null or undefined');
                alert('Error: No se ha cargado correctamente el ID del sitio web. Por favor, recarga la página.');
                $button.removeClass('loading').prop('disabled', false);
                $button.find('.btn-text').text('Error');
                return;
            }
            
            // Combine page blocks and sections configuration
            const pageData = {
                blocks: currentPageBlocks,
                sectionsConfig: currentSectionsConfig
            };
            const pagePayload = {
                pageStructureJson: JSON.stringify(pageData)
            };
            savePromises.push(
                fetch(`/api/builder/websites/${currentWebsiteId}/pages/${currentPageId}`, {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(pagePayload)
                })
                .then(response => {
                    if (!response.ok) {
                        throw new Error(`HTTP error! status: ${response.status}`);
                    }
                    return response;
                })
                .catch(error => {
                    console.error('[ERROR] Failed to save page structure:', error);
                    throw error;
                })
            );
        }
        
        // Save global settings changes if any
        console.log('[DEBUG] hasPendingGlobalSettingsChanges:', hasPendingGlobalSettingsChanges);
        console.log('[DEBUG] hasPendingPageStructureChanges:', hasPendingPageStructureChanges);
        if (hasPendingGlobalSettingsChanges) {
            console.log('[INFO] Saving global settings...');
            console.log('[DEBUG] currentGlobalThemeSettings:', JSON.stringify(currentGlobalThemeSettings, null, 2));
            const globalPayload = {
                globalSettings: currentGlobalThemeSettings
            };
            console.log('[DEBUG] globalPayload to send:', JSON.stringify(globalPayload, null, 2));
            savePromises.push(
                fetch('/api/builder/websites/current/global-settings', {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(globalPayload)
                })
                .then(response => {
                    console.log('[DEBUG] Global settings response status:', response.status);
                    if (!response.ok && response.status !== 204) {
                        throw new Error(`HTTP error! status: ${response.status}`);
                    }
                    return response;
                })
                .catch(error => {
                    console.error('[ERROR] Failed to save global settings:', error);
                    throw error;
                })
            );
        }
        
        if (savePromises.length > 0) {
            try {
                console.log(`[DEBUG] Attempting to save ${savePromises.length} items...`);
                const responses = await Promise.all(savePromises);
                
                console.log('[DEBUG] All promises resolved. Checking responses...');
                console.log('[DEBUG] Responses:', responses);
                
                // Check if all responses are ok
                const allOk = responses.every(response => response && response.ok);
                
                if (allOk) {
                    console.log('[SUCCESS] All changes saved successfully!');
                    hasPendingPageStructureChanges = false;
                    hasPendingGlobalSettingsChanges = false;
                    
                    $button.find('.btn-text').text('Guardado');
                    $button.removeClass('loading');
                    // Aquí podrías mostrar una notificación de éxito al usuario
                    
                    // Renderizar preview después de guardar
                    renderPreview(); // <-- AÑADIR ESTA LÍNEA
                    
                    // Recargar la vista actual para mostrar los cambios guardados
                    console.log('[DEBUG] Current sidebar view after save:', currentSidebarView);
                    if (currentSidebarView === 'blockList') {
                        // Esperar un poco antes de recargar para asegurar que todo se haya guardado
                        setTimeout(() => {
                            console.log('[DEBUG] Reloading data from server after save...');
                            loadCurrentWebsite().then(() => {
                                console.log('[DEBUG] Data reloaded, refreshing blockList view');
                                console.log('[DEBUG] Current sections config after reload:', JSON.stringify(currentSectionsConfig, null, 2));
                                window.switchSidebarView('blockList', window.getUpdatedPageData());
                            });
                        }, 500);
                    } else if (currentSidebarView === 'headerSettings') {
                        // Recargar la vista de header settings
                        console.log('[DEBUG] Reloading header settings view after save');
                        window.switchSidebarView('headerSettings');
                    } else if (currentSidebarView === 'announcementBar') {
                        // Recargar la vista de announcement bar
                        console.log('[DEBUG] Reloading announcement bar view after save');
                        window.switchSidebarView('announcementBar');
                    } else if (currentSidebarView === 'announcementItemSettings') {
                        // No recargar la vista de edición de anuncio individual
                        console.log('[DEBUG] Staying in announcement item settings view after save');
                    } else if (currentSidebarView === 'themeSettingsView') {
                        // Permanecer en la vista de configuración después de guardar
                        console.log('[DEBUG] Staying in theme settings view after save');
                        // Guardar el estado actual antes de recargar
                        sessionStorage.setItem('websiteBuilderLastView', 'themeSettingsView');
                    }
                    
                    setTimeout(() => {
                        updateSaveButtonState();
                    }, 2000);
                } else {
                    console.error('[ERROR] One or more save operations failed.', responses);
                    throw new Error('Some saves failed');
                }
            } catch (error) {
                console.error('[ERROR] A critical error occurred during save:', error);
                $button.find('.btn-text').text('Error al guardar');
                $button.removeClass('loading');
                // Aquí podrías mostrar una notificación de error al usuario
                
                setTimeout(() => {
                    updateSaveButtonState();
                }, 2000);
            } finally {
                // Ensure loading state is removed and button is re-enabled
                console.log('[DEBUG] Save operation finished (success or error)');
                $button.removeClass('loading');
                // Re-enable button if there are still pending changes
                const stillHasChanges = hasPendingGlobalSettingsChanges || hasPendingPageStructureChanges;
                if (stillHasChanges) {
                    $button.prop('disabled', false);
                }
            }
        } else {
            console.log('[DEBUG] No changes to save');
            $button.removeClass('loading');
            updateSaveButtonState();
        }
    });
    
    
    // Global event handler for collapse/expand - MUST be at document level
    $(document).off('click.collapseToggle').on('click.collapseToggle', '.collapse-toggle', function(e) {
        e.preventDefault();
        e.stopPropagation();
        
        console.log('[COLLAPSE] Click detected on collapse toggle');
        
        const $button = $(this);
        const $icon = $button.find('.collapse-indicator');
        const $parent = $button.closest('.collapsible-parent');
        const elementId = $parent.data('element-id');
        
        if ($parent.hasClass('collapsed')) {
            // Expand - show all announcement items
            console.log('[COLLAPSE] Expanding announcements');
            $parent.removeClass('collapsed');
            $icon.text('expand_more');
            const $items = $('.sidebar-subsection[data-block-type="announcement-item"]');
            console.log('[COLLAPSE] Found items to expand:', $items.length);
            
            // Smooth animation with stagger
            $items.stop(true, false).each(function(index) {
                $(this).delay(index * 40).fadeIn(200).slideDown(200);
            });
        } else {
            // Collapse - hide all announcement items
            console.log('[COLLAPSE] Collapsing announcements');
            $parent.addClass('collapsed');
            $icon.text('chevron_right');
            const $items = $('.sidebar-subsection[data-block-type="announcement-item"]');
            console.log('[COLLAPSE] Found items to collapse:', $items.length);
            
            // Smooth animation in reverse order
            $($items.get().reverse()).stop(true, false).each(function(index) {
                $(this).delay(index * 40).slideUp(200).fadeOut(200);
            });
        }
    });