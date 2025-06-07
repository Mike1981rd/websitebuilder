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
            'appearance.edgeRoundingDescription': 'Se aplica a tarjetas, botones, esquinas de sección y otros elementos',
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
            'productCards.style': 'Estilo',
            'productCards.standard': 'Estándar',
            'productCards.card': 'Tarjeta',
            'productCards.imageRatio': 'Relación de imagen',
            'productCards.adapt': 'Adaptar a imagen',
            'productCards.portrait': 'Retrato',
            'productCards.square': 'Cuadrado',
            'productCards.showSecondImage': 'Mostrar segunda imagen al pasar el cursor',
            'productCards.showVendor': 'Mostrar proveedor',
            'productCards.showRating': 'Mostrar calificación del producto',
            'productCards.enableQuickAdd': 'Habilitar botón de agregar rápido',
            // Product Badges translations
            'productBadges.title': 'Insignias de producto',
            'productBadges.onSale': 'En oferta',
            'productBadges.soldOut': 'Agotado',
            'productBadges.position': 'Posición',
            'productBadges.topLeft': 'Superior izquierda',
            'productBadges.topRight': 'Superior derecha',
            'productBadges.bottomLeft': 'Inferior izquierda',
            'productBadges.bottomRight': 'Inferior derecha',
            // Cart translations
            'cart.title': 'Carrito',
            'cart.type': 'Tipo de carrito',
            'cart.drawer': 'Cajón',
            'cart.page': 'Página',
            'cart.popup': 'Notificación emergente',
            'cart.showVendor': 'Mostrar proveedor',
            'cart.enableNote': 'Habilitar nota del carrito',
            // Favicon translations
            'favicon.title': 'Favicon',
            'favicon.description': 'Los favicons son iconos pequeños que aparecen en las pestañas del navegador.',
            'favicon.selectImage': 'Seleccionar imagen',
            'favicon.noImageSelected': 'No se ha seleccionado ninguna imagen',
            // Navigation translations
            'navigation.title': 'Navegación',
            'navigation.colorScheme': 'Esquema de color',
            'navigation.menu': 'Menú',
            'navigation.logoPosition': 'Posición del logo en escritorio',
            'navigation.middleLeft': 'Centro izquierda',
            'navigation.topLeft': 'Superior izquierda',
            'navigation.topCenter': 'Superior centro',
            'navigation.middleCenter': 'Centro centro',
            'navigation.mobileLogoPosition': 'Posición del logo en móvil',
            'navigation.center': 'Centro',
            'navigation.left': 'Izquierda',
            'navigation.enableStickyHeader': 'Habilitar encabezado pegajoso en escritorio',
            'navigation.showSeparatorLine': 'Mostrar línea separadora',
            'navigation.reduceLogoSize': 'Reducir tamaño del logo al desplazarse',
            'navigation.announcementBar': 'Barra de anuncios',
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
            'swatches.colors': 'Colores'
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
            'appearance.edgeRoundingDescription': 'Applies to cards, buttons, section corners, and other elements',
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
            'swatches.colors': 'Colors'
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
                                            <input type="color" value="#000000" class="shopify-color-picker" data-field="primary-image-overlay">
                                            <input type="text" value="#000000" class="shopify-color-text" data-field="primary-image-overlay">
                                            <button class="shopify-color-copy" data-field="primary-image-overlay">
                                                <i class="material-icons">content_copy</i>
                                            </button>
                                        </div>
                                    </div>
                                </div>
                                
                                <!-- Secondary Section -->
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
                                            <input type="color" value="#3B3933" class="shopify-color-picker" data-field="secondary-image-overlay">
                                            <input type="text" value="#3B3933" class="shopify-color-text" data-field="secondary-image-overlay">
                                            <button class="shopify-color-copy" data-field="secondary-image-overlay">
                                                <i class="material-icons">content_copy</i>
                                            </button>
                                        </div>
                                    </div>
                                </div>
                                
                                <!-- Contrasting Section -->
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
                                            <input type="color" value="#222222" class="shopify-color-picker" data-field="contrasting-image-overlay">
                                            <input type="text" value="#222222" class="shopify-color-text" data-field="contrasting-image-overlay">
                                            <button class="shopify-color-copy" data-field="contrasting-image-overlay">
                                                <i class="material-icons">content_copy</i>
                                            </button>
                                        </div>
                                    </div>
                                </div>
                                
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
                                    
                                    <div class="color-field">
                                        <label data-i18n="colorSchemes.text">Text</label>
                                        <div class="shopify-color-input-wrapper">
                                            <input type="color" value="#FFFFFF" class="shopify-color-picker" data-field="scheme-text">
                                            <input type="text" value="#FFFFFF" class="shopify-color-text" data-field="scheme-text">
                                            <button class="shopify-color-copy" data-field="scheme-text">
                                                <i class="material-icons">content_copy</i>
                                            </button>
                                        </div>
                                    </div>
                                    
                                    <div class="color-field">
                                        <label data-i18n="colorSchemes.background">Background</label>
                                        <div class="shopify-color-input-wrapper">
                                            <input type="color" value="#473C63" class="shopify-color-picker" data-field="scheme-background">
                                            <input type="text" value="#473C63" class="shopify-color-text" data-field="scheme-background">
                                            <button class="shopify-color-copy" data-field="scheme-background">
                                                <i class="material-icons">content_copy</i>
                                            </button>
                                        </div>
                                    </div>
                                    
                                    <div class="color-field">
                                        <label data-i18n="colorSchemes.foreground">Foreground</label>
                                        <div class="shopify-color-input-wrapper">
                                            <input type="color" value="#FFFFFF" class="shopify-color-picker" data-field="scheme-foreground">
                                            <input type="text" value="#FFFFFF" class="shopify-color-text" data-field="scheme-foreground">
                                            <button class="shopify-color-copy" data-field="scheme-foreground">
                                                <i class="material-icons">content_copy</i>
                                            </button>
                                        </div>
                                    </div>
                                    
                                    <div class="color-field">
                                        <label data-i18n="colorSchemes.border">Border</label>
                                        <div class="shopify-color-input-wrapper">
                                            <input type="color" value="#FFFFFF" class="shopify-color-picker" data-field="scheme-border">
                                            <input type="text" value="#FFFFFF" class="shopify-color-text" data-field="scheme-border">
                                            <button class="shopify-color-copy" data-field="scheme-border">
                                                <i class="material-icons">content_copy</i>
                                            </button>
                                        </div>
                                    </div>
                                    
                                    <div class="color-field">
                                        <label data-i18n="colorSchemes.solidButton">Solid button</label>
                                        <div class="shopify-color-input-wrapper">
                                            <input type="color" value="#EA7A84" class="shopify-color-picker" data-field="scheme-solid-button">
                                            <input type="text" value="#EA7A84" class="shopify-color-text" data-field="scheme-solid-button">
                                            <button class="shopify-color-copy" data-field="scheme-solid-button">
                                                <i class="material-icons">content_copy</i>
                                            </button>
                                        </div>
                                    </div>
                                    
                                    <div class="color-field">
                                        <label data-i18n="colorSchemes.solidButtonText">Solid button text</label>
                                        <div class="shopify-color-input-wrapper">
                                            <input type="color" value="#FFFFFF" class="shopify-color-picker" data-field="scheme-solid-button-text">
                                            <input type="text" value="#FFFFFF" class="shopify-color-text" data-field="scheme-solid-button-text">
                                            <button class="shopify-color-copy" data-field="scheme-solid-button-text">
                                                <i class="material-icons">content_copy</i>
                                            </button>
                                        </div>
                                    </div>
                                    
                                    <div class="color-field">
                                        <label data-i18n="colorSchemes.outlineButton">Outline button</label>
                                        <div class="shopify-color-input-wrapper">
                                            <input type="color" value="#473C63" class="shopify-color-picker" data-field="scheme-outline-button">
                                            <input type="text" value="#473C63" class="shopify-color-text" data-field="scheme-outline-button">
                                            <button class="shopify-color-copy" data-field="scheme-outline-button">
                                                <i class="material-icons">content_copy</i>
                                            </button>
                                        </div>
                                    </div>
                                    
                                    <div class="color-field">
                                        <label data-i18n="colorSchemes.outlineButtonText">Outline button text</label>
                                        <div class="shopify-color-input-wrapper">
                                            <input type="color" value="#FFFFFF" class="shopify-color-picker" data-field="scheme-outline-button-text">
                                            <input type="text" value="#FFFFFF" class="shopify-color-text" data-field="scheme-outline-button-text">
                                            <button class="shopify-color-copy" data-field="scheme-outline-button-text">
                                                <i class="material-icons">content_copy</i>
                                            </button>
                                        </div>
                                    </div>
                                    
                                    <div class="color-field">
                                        <label data-i18n="colorSchemes.imageOverlay">Image overlay</label>
                                        <div class="shopify-color-input-wrapper">
                                            <input type="color" value="#FFFFFF" class="shopify-color-picker" data-field="scheme-image-overlay">
                                            <input type="text" value="#FFFFFF" class="shopify-color-text" data-field="scheme-image-overlay">
                                            <button class="shopify-color-copy" data-field="scheme-image-overlay">
                                                <i class="material-icons">content_copy</i>
                                            </button>
                                        </div>
                                    </div>
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
                            <div class="settings-field">
                                <label data-i18n="productCards.style">Style</label>
                                <select class="shopify-select">
                                    <option value="standard" data-i18n="productCards.standard">Standard</option>
                                    <option value="card" data-i18n="productCards.card">Card</option>
                                </select>
                            </div>
                            
                            <div class="settings-field">
                                <label data-i18n="productCards.imageRatio">Image ratio</label>
                                <select class="shopify-select">
                                    <option value="adapt" data-i18n="productCards.adapt">Adapt to image</option>
                                    <option value="portrait" data-i18n="productCards.portrait">Portrait</option>
                                    <option value="square" data-i18n="productCards.square">Square</option>
                                </select>
                            </div>
                            
                            <div class="settings-field">
                                <label class="checkbox-label">
                                    <input type="checkbox" class="shopify-checkbox" checked>
                                    <span data-i18n="productCards.showSecondImage">Show second image on hover</span>
                                </label>
                            </div>
                            
                            <div class="settings-field">
                                <label class="checkbox-label">
                                    <input type="checkbox" class="shopify-checkbox">
                                    <span data-i18n="productCards.showVendor">Show vendor</span>
                                </label>
                            </div>
                            
                            <div class="settings-field">
                                <label class="checkbox-label">
                                    <input type="checkbox" class="shopify-checkbox">
                                    <span data-i18n="productCards.showRating">Show product rating</span>
                                </label>
                            </div>
                            
                            <div class="settings-field">
                                <label class="checkbox-label">
                                    <input type="checkbox" class="shopify-checkbox" checked>
                                    <span data-i18n="productCards.enableQuickAdd">Enable quick add button</span>
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
                            <div class="subsection-title" data-i18n="productBadges.onSale">On sale</div>
                            
                            <div class="settings-field">
                                <label data-i18n="productBadges.position">Position</label>
                                <select class="shopify-select">
                                    <option value="top-left" data-i18n="productBadges.topLeft">Top left</option>
                                    <option value="top-right" data-i18n="productBadges.topRight">Top right</option>
                                    <option value="bottom-left" data-i18n="productBadges.bottomLeft">Bottom left</option>
                                    <option value="bottom-right" data-i18n="productBadges.bottomRight">Bottom right</option>
                                </select>
                            </div>
                            
                            <div class="subsection-title" data-i18n="productBadges.soldOut" style="margin-top: 24px;">Sold out</div>
                            
                            <div class="settings-field">
                                <label data-i18n="productBadges.position">Position</label>
                                <select class="shopify-select">
                                    <option value="top-left" data-i18n="productBadges.topLeft">Top left</option>
                                    <option value="top-right" data-i18n="productBadges.topRight">Top right</option>
                                    <option value="bottom-left" data-i18n="productBadges.bottomLeft">Bottom left</option>
                                    <option value="bottom-right" data-i18n="productBadges.bottomRight">Bottom right</option>
                                </select>
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
                                <label data-i18n="cart.type">Cart type</label>
                                <select class="shopify-select">
                                    <option value="drawer" data-i18n="cart.drawer">Drawer</option>
                                    <option value="page" data-i18n="cart.page">Page</option>
                                    <option value="popup" data-i18n="cart.popup">Popup notification</option>
                                </select>
                            </div>
                            
                            <div class="settings-field">
                                <label class="checkbox-label">
                                    <input type="checkbox" class="shopify-checkbox">
                                    <span data-i18n="cart.showVendor">Show vendor</span>
                                </label>
                            </div>
                            
                            <div class="settings-field">
                                <label class="checkbox-label">
                                    <input type="checkbox" class="shopify-checkbox">
                                    <span data-i18n="cart.enableNote">Enable cart note</span>
                                </label>
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
                                <div class="image-preview">
                                    <span class="no-image-text" data-i18n="favicon.noImageSelected">No image selected</span>
                                </div>
                                <button class="shopify-button" data-i18n="favicon.selectImage">Select image</button>
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
            
            // Initialize font selectors when Typography section is opened
            if ($(this).data('section') === 'typography') {
                setTimeout(initializeFontSelectors, 100);
            }
            
            // Initialize color schemes when Color schemes section is opened
            if ($(this).data('section') === 'color-schemes') {
                setTimeout(initializeColorSchemes, 100);
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
    
    // Store selected fonts globally
    const selectedFonts = {
        heading: 'assistant',
        body: 'assistant',
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
            
            // Set current font value
            const currentFont = selectedFonts[fontType] || 'assistant';
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
        // Convert font value to display name
        const fontMap = {
            'tisa-sans': 'FF Tisa Sans',
            'playfair': 'Playfair Display',
            'roboto': 'Roboto',
            'helvetica': 'Helvetica',
            'georgia': 'Georgia',
            'arial': 'Arial',
            'times': 'Times New Roman',
            'courier': 'Courier New'
        };
        
        return fontMap[fontValue] || fontValue.split('-').map(word => 
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
                        updateFontPreview(previewText, fontValue);
                        dropdown.hide();
                        
                        // Trigger change event for any listeners
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

    // Color Schemes Data
    const colorSchemes = {
        scheme1: {
            primary: {
                text: '#FFFFFF',
                background: '#020711',
                foreground: '#020711',
                border: '#000000',
                solidButton: '#2F3349',
                solidButtonText: '#FFFFFF',
                outlineButton: '#473C63',
                outlineButtonText: '#FFFFFF',
                imageOverlay: '#000000'
            },
            secondary: {
                text: '#000000',
                background: '#FFFFFF',
                foreground: '#FDF48B',
                border: '#FFFFFF',
                solidButton: '#2F3349',
                solidButtonText: '#FFFFFF',
                outlineButton: '#000000',
                outlineButtonText: '#000000',
                imageOverlay: '#3B3933'
            },
            contrasting: {
                text: '#FFFFFF',
                background: '#000000',
                foreground: '#000000',
                border: '#FFFFFF',
                solidButton: '#F0FF2E',
                solidButtonText: '#FFFFFF',
                outlineButton: '#F0FF2E',
                outlineButtonText: '#F0FF2E',
                imageOverlay: '#222222'
            }
        },
        scheme2: {
            primary: {
                text: '#FFFFFF',
                background: '#1A1A1A',
                foreground: '#000000',
                border: '#333333',
                solidButton: '#FFFFFF',
                solidButtonText: '#1A1A1A',
                outlineButton: '#FFFFFF',
                outlineButtonText: '#FFFFFF',
                imageOverlay: '#1A1A1A'
            },
            secondary: {
                text: '#1A1A1A',
                background: '#FFFFFF',
                foreground: '#F6F6F6',
                border: '#E1E1E1',
                solidButton: '#1A1A1A',
                solidButtonText: '#FFFFFF',
                outlineButton: '#1A1A1A',
                outlineButtonText: '#1A1A1A',
                imageOverlay: '#1A1A1A'
            },
            contrasting: {
                text: '#FFFFFF',
                background: '#FF6B6B',
                foreground: '#FF5252',
                border: '#FFFFFF',
                solidButton: '#FFFFFF',
                solidButtonText: '#FF6B6B',
                outlineButton: '#FFFFFF',
                outlineButtonText: '#FFFFFF',
                imageOverlay: '#FF6B6B'
            }
        },
        scheme3: {
            primary: {
                text: '#FFFFFF',
                background: '#2A475E',
                foreground: '#1A3A52',
                border: '#122E42',
                solidButton: '#FFB800',
                solidButtonText: '#2A475E',
                outlineButton: '#FFB800',
                outlineButtonText: '#FFB800',
                imageOverlay: '#2A475E'
            },
            secondary: {
                text: '#2A475E',
                background: '#FFFFFF',
                foreground: '#F3F5F7',
                border: '#CCCCCC',
                solidButton: '#2A475E',
                solidButtonText: '#FFFFFF',
                outlineButton: '#2A475E',
                outlineButtonText: '#2A475E',
                imageOverlay: '#2A475E'
            },
            contrasting: {
                text: '#2A475E',
                background: '#FFB800',
                foreground: '#FFC933',
                border: '#2A475E',
                solidButton: '#2A475E',
                solidButtonText: '#FFFFFF',
                outlineButton: '#2A475E',
                outlineButtonText: '#2A475E',
                imageOverlay: '#2A475E'
            }
        },
        scheme4: {
            primary: {
                text: '#FFFFFF',
                background: '#004145',
                foreground: '#003135',
                border: '#00262A',
                solidButton: '#52DCE6',
                solidButtonText: '#004145',
                outlineButton: '#52DCE6',
                outlineButtonText: '#52DCE6',
                imageOverlay: '#004145'
            },
            secondary: {
                text: '#004145',
                background: '#FFFFFF',
                foreground: '#F0FEFF',
                border: '#B3E5E8',
                solidButton: '#004145',
                solidButtonText: '#FFFFFF',
                outlineButton: '#004145',
                outlineButtonText: '#004145',
                imageOverlay: '#004145'
            },
            contrasting: {
                text: '#FFFFFF',
                background: '#FF7F50',
                foreground: '#FF6347',
                border: '#FFFFFF',
                solidButton: '#FFFFFF',
                solidButtonText: '#FF7F50',
                outlineButton: '#FFFFFF',
                outlineButtonText: '#FFFFFF',
                imageOverlay: '#FF7F50'
            }
        },
        scheme5: {
            primary: {
                text: '#FFFFFF',
                background: '#6B5B95',
                foreground: '#5A4A7F',
                border: '#493969',
                solidButton: '#FF6F61',
                solidButtonText: '#FFFFFF',
                outlineButton: '#FF6F61',
                outlineButtonText: '#FF6F61',
                imageOverlay: '#6B5B95'
            },
            secondary: {
                text: '#6B5B95',
                background: '#FFFFFF',
                foreground: '#F5F3F9',
                border: '#D8D0E8',
                solidButton: '#6B5B95',
                solidButtonText: '#FFFFFF',
                outlineButton: '#6B5B95',
                outlineButtonText: '#6B5B95',
                imageOverlay: '#6B5B95'
            },
            contrasting: {
                text: '#FFFFFF',
                background: '#88D8B0',
                foreground: '#6FC99B',
                border: '#FFFFFF',
                solidButton: '#6B5B95',
                solidButtonText: '#FFFFFF',
                outlineButton: '#6B5B95',
                outlineButtonText: '#6B5B95',
                imageOverlay: '#88D8B0'
            }
        }
    };
    
    // Color Scheme Settings Configuration (Additional settings for each scheme)
    const colorSchemeSettings = {
        scheme1: {
            text: '#FFFFFF',
            background: '#473C63',
            foreground: '#FFFFFF',
            border: '#FFFFFF',
            solidButton: '#EA7A84',
            solidButtonText: '#FFFFFF',
            outlineButton: '#473C63',
            outlineButtonText: '#FFFFFF',
            imageOverlay: '#FFFFFF'
        },
        scheme2: {
            text: '#121212',
            background: '#FFFFFF',
            foreground: '#F6F6F7',
            border: '#E1E3E5',
            solidButton: '#121212',
            solidButtonText: '#FFFFFF',
            outlineButton: '#121212',
            outlineButtonText: '#121212',
            imageOverlay: '#121212'
        },
        scheme3: {
            text: '#FFFFFF',
            background: '#2A475E',
            foreground: '#1A3A52',
            border: '#122E42',
            solidButton: '#FFB800',
            solidButtonText: '#2A475E',
            outlineButton: '#FFB800',
            outlineButtonText: '#FFB800',
            imageOverlay: '#2A475E'
        },
        scheme4: {
            text: '#FFFFFF',
            background: '#000000',
            foreground: '#242424',
            border: '#FFFFFF',
            solidButton: '#FFFFFF',
            solidButtonText: '#000000',
            outlineButton: '#FFFFFF',
            outlineButtonText: '#FFFFFF',
            imageOverlay: '#000000'
        },
        scheme5: {
            text: '#FFFFFF',
            background: '#9B5925',
            foreground: '#7C4420',
            border: '#5D2E18',
            solidButton: '#FFFFFF',
            solidButtonText: '#9B5925',
            outlineButton: '#FFFFFF',
            outlineButtonText: '#FFFFFF',
            imageOverlay: '#9B5925'
        }
    };

    // Initialize Color Schemes
    window.initializeColorSchemes = function() {
        console.log('Initializing color schemes...');
        
        // Color picker and text input sync
        $('.shopify-color-picker').on('input', function() {
            const value = $(this).val();
            $(this).siblings('.shopify-color-text').val(value.toUpperCase());
            
            // Save changes to the appropriate data structure
            const field = $(this).data('field');
            if (field && field.startsWith('scheme-')) {
                saveSchemeConfigurationChange(field, value);
            }
        });
        
        $('.shopify-color-text').on('input', function() {
            let value = $(this).val();
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
                $(this).siblings('.shopify-color-picker').val(value);
                
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
            loadSchemeConfiguration(selectedScheme);
        });
        
        // Load initial color scheme
        loadColorScheme('scheme1');
        // Load initial scheme configuration
        loadSchemeConfiguration('scheme1');
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
    
    // Load scheme configuration data
    function loadSchemeConfiguration(schemeName) {
        const schemeSettings = colorSchemeSettings[schemeName];
        
        if (!schemeSettings) return;
        
        // Update additional color scheme configuration
        Object.keys(schemeSettings).forEach(field => {
            const value = schemeSettings[field];
            const fieldName = `scheme-${field.replace(/([A-Z])/g, '-$1').toLowerCase()}`;
            
            // Update both picker and text input
            $(`.shopify-color-picker[data-field="${fieldName}"]`).val(value);
            $(`.shopify-color-text[data-field="${fieldName}"]`).val(value.toUpperCase());
        });
        
        console.log(`Loaded configuration for ${schemeName}:`, schemeSettings);
    }
    
    // Save changes to scheme configuration
    function saveSchemeConfigurationChange(fieldName, value) {
        const currentScheme = $('#schemeConfigSelect').val();
        
        // Extract the field name (e.g., "scheme-text" -> "text")
        const field = fieldName.replace('scheme-', '').replace(/-([a-z])/g, (match, letter) => letter.toUpperCase());
        
        if (colorSchemeSettings[currentScheme]) {
            colorSchemeSettings[currentScheme][field] = value.toUpperCase();
            console.log(`Updated ${currentScheme}.${field} to ${value}`);
        }
    }