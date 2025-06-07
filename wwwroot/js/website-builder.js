// Website Builder JavaScript
$(document).ready(function() {
    // Get current language from localStorage or default to Spanish
    let currentLanguage = localStorage.getItem('preferredLanguage') || 'es';
    
    // Translation objects
    const translations = {
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
            'appearance.edgeRoundingDescription': 'Se aplica a tarjetas, botones, esquinas de sección y otros elementos'
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
            'appearance.edgeRoundingDescription': 'Applies to cards, buttons, section corners, and other elements'
        }
    };
    
    // Set current language translations
    const lang = translations[currentLanguage];
    
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
    
    // Sidebar view state
    let currentSidebarView = 'blockList';
    let currentPageData = { name: lang.homePageLabel || "Página de inicio", blocks: [] };
    
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
    
    let currentGlobalThemeSettings = {
        primaryColor: "#1976d2",
        secondaryColor: "#424242",
        fontFamily: "Roboto",
        headerHeight: "60px"
    };
    
    // Function to switch sidebar view
    function switchSidebarView(viewName, data = null) {
        currentSidebarView = viewName;
        const dynamicContentArea = document.getElementById('sidebar-dynamic-content');
        if (!dynamicContentArea) return;
        
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
        } else {
            dynamicContentArea.innerHTML = `<p class="sidebar-loading-text">${lang.sidebarLoadingText}</p>`;
        }
    }
    
    // Function to render block list view - Shopify style
    function renderBlockListView(pageData) {
        const pageName = pageData.name || '';
        
        return `
            <!-- Page Title -->
            <div style="padding: 12px 16px 16px; font-size: 16px; font-weight: 600; color: #202223;">
                ${pageName}
            </div>
            
            <!-- Header Section -->
            <div class="sidebar-section expanded">
                <div class="sidebar-section-header">
                    <div class="section-title-wrapper">
                        <div class="section-icon">
                            <i class="material-icons">view_agenda</i>
                        </div>
                        <span class="section-title" data-i18n="sections.header">Encabezado</span>
                    </div>
                    <i class="material-icons section-expand-icon">chevron_right</i>
                </div>
                <div class="sidebar-section-content">
                    <div class="sidebar-subsection" data-block-type="announcement">
                        <i class="material-icons" style="font-size: 16px;">campaign</i>
                        <span data-i18n="sections.announcementBar">Barra de anuncios</span>
                    </div>
                    <div class="sidebar-subsection" data-block-type="header">
                        <i class="material-icons" style="font-size: 16px;">view_day</i>
                        <span data-i18n="sections.headerSection">Encabezado</span>
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
                        <div class="section-icon">
                            <i class="material-icons">view_agenda</i>
                        </div>
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
    function renderAddSectionView() {
        const blockTypesHtml = Object.keys(blockSettingsSchemas).map(type => `
            <div class="block-type-item" data-block-type="${type}">
                <i class="material-icons">add_circle_outline</i>
                <span>${lang[`blockType${type.charAt(0).toUpperCase() + type.slice(1)}`] || type}</span>
            </div>
        `).join('');
        
        return `
            <div class="sidebar-view-header">
                <button class="back-to-block-list-btn">
                    <i class="material-icons">arrow_back</i>
                </button>
                <h3>${lang.addSectionViewTitle || "Añadir Sección"}</h3>
            </div>
            <div class="block-types-container">
                <p class="section-description">${lang.availableBlockTypesTitle || "Tipos de bloques disponibles:"}</p>
                ${blockTypesHtml}
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
                    <div class="theme-section-content" style="display: none;">
                        <p style="padding: 12px 16px; color: #6d7175; font-size: 13px;">Configuraciones de tipografía</p>
                    </div>
                </div>
                
                <!-- Color schemes -->
                <div class="theme-setting-section">
                    <button class="theme-section-header" data-section="color-schemes">
                        <span data-i18n="themeSettings.colorSchemes">Color schemes</span>
                        <i class="material-icons section-chevron">keyboard_arrow_down</i>
                    </button>
                    <div class="theme-section-content" style="display: none;">
                        <p style="padding: 12px 16px; color: #6d7175; font-size: 13px;">Esquemas de color</p>
                    </div>
                </div>
                
                <!-- Product cards -->
                <div class="theme-setting-section">
                    <button class="theme-section-header" data-section="product-cards">
                        <span data-i18n="themeSettings.productCards">Product cards</span>
                        <i class="material-icons section-chevron">keyboard_arrow_down</i>
                    </button>
                    <div class="theme-section-content" style="display: none;">
                        <p style="padding: 12px 16px; color: #6d7175; font-size: 13px;">Configuración de tarjetas de producto</p>
                    </div>
                </div>
                
                <!-- Product badges -->
                <div class="theme-setting-section">
                    <button class="theme-section-header" data-section="product-badges">
                        <span data-i18n="themeSettings.productBadges">Product badges</span>
                        <i class="material-icons section-chevron">keyboard_arrow_down</i>
                    </button>
                    <div class="theme-section-content" style="display: none;">
                        <p style="padding: 12px 16px; color: #6d7175; font-size: 13px;">Insignias de producto</p>
                    </div>
                </div>
                
                <!-- Cart -->
                <div class="theme-setting-section">
                    <button class="theme-section-header" data-section="cart">
                        <span data-i18n="themeSettings.cart">Cart</span>
                        <i class="material-icons section-chevron">keyboard_arrow_down</i>
                    </button>
                    <div class="theme-section-content" style="display: none;">
                        <p style="padding: 12px 16px; color: #6d7175; font-size: 13px;">Configuración del carrito</p>
                    </div>
                </div>
                
                <!-- Favicon -->
                <div class="theme-setting-section">
                    <button class="theme-section-header" data-section="favicon">
                        <span data-i18n="themeSettings.favicon">Favicon</span>
                        <i class="material-icons section-chevron">keyboard_arrow_down</i>
                    </button>
                    <div class="theme-section-content" style="display: none;">
                        <p style="padding: 12px 16px; color: #6d7175; font-size: 13px;">Configuración del favicon</p>
                    </div>
                </div>
                
                <!-- Navigation -->
                <div class="theme-setting-section">
                    <button class="theme-section-header" data-section="navigation">
                        <span data-i18n="themeSettings.navigation">Navigation</span>
                        <i class="material-icons section-chevron">keyboard_arrow_down</i>
                    </button>
                    <div class="theme-section-content" style="display: none;">
                        <p style="padding: 12px 16px; color: #6d7175; font-size: 13px;">Configuración de navegación</p>
                    </div>
                </div>
                
                <!-- Social media -->
                <div class="theme-setting-section">
                    <button class="theme-section-header" data-section="social-media">
                        <span data-i18n="themeSettings.socialMedia">Social media</span>
                        <i class="material-icons section-chevron">keyboard_arrow_down</i>
                    </button>
                    <div class="theme-section-content" style="display: none;">
                        <p style="padding: 12px 16px; color: #6d7175; font-size: 13px;">Redes sociales</p>
                    </div>
                </div>
                
                <!-- Swatches -->
                <div class="theme-setting-section">
                    <button class="theme-section-header" data-section="swatches">
                        <span data-i18n="themeSettings.swatches">Swatches</span>
                        <i class="material-icons section-chevron">keyboard_arrow_down</i>
                    </button>
                    <div class="theme-section-content" style="display: none;">
                        <p style="padding: 12px 16px; color: #6d7175; font-size: 13px;">Muestras de color</p>
                    </div>
                </div>
                
                <!-- Advanced -->
                <div class="theme-setting-section">
                    <button class="theme-section-header" data-section="advanced">
                        <span data-i18n="themeSettings.advanced">Advanced</span>
                        <i class="material-icons section-chevron">keyboard_arrow_down</i>
                    </button>
                    <div class="theme-section-content" style="display: none;">
                        <p style="padding: 12px 16px; color: #6d7175; font-size: 13px;">Configuración avanzada</p>
                    </div>
                </div>
            </div>
        `;
    }
    
    // Function to attach event listeners for block list view
    function attachBlockListEventListeners() {
        // Section expand/collapse
        $('.sidebar-section-header').on('click', function() {
            $(this).parent('.sidebar-section').toggleClass('expanded');
        });
        
        // Add section button
        $('#add-section-btn').on('click', function() {
            switchSidebarView('addSectionView');
        });
        
        // Subsection clicks
        $('.sidebar-subsection').on('click', function() {
            const blockType = $(this).data('block-type');
            console.log('Subsección clickeada:', blockType);
            // TODO: Handle subsection clicks
        });
        
        // Footer link
        $('#view-page-link').on('click', function() {
            console.log('Ver página clickeado');
            // TODO: Implement view page
        });
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
    
    // Initialize the sidebar with default view
    switchSidebarView('blockList', currentPageData);
    
    // Apply translations on initial load
    setTimeout(applyTranslations, 100);
    
    // Function to apply translations to dynamic content
    function applyTranslations() {
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
    }
    
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