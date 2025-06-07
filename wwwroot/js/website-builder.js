// Website Builder JavaScript
$(document).ready(function() {
    // Translation object (Spanish by default)
    const lang = {
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
        blockTypeSlideshow: "Presentación"
        // Add more translations here. For English, we would create a lang_en object.
    };
    
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
        } else if (viewName === 'blockSettings') {
            dynamicContentArea.innerHTML = renderBlockSettingsView(data);
        } else if (viewName === 'addSectionView') {
            dynamicContentArea.innerHTML = renderAddSectionView();
        } else if (viewName === 'themeSettingsView') {
            dynamicContentArea.innerHTML = renderThemeSettingsView();
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
                        <span class="section-title">Encabezado</span>
                    </div>
                    <i class="material-icons section-expand-icon">chevron_right</i>
                </div>
                <div class="sidebar-section-content">
                    <div class="sidebar-subsection" data-block-type="announcement">
                        <i class="material-icons" style="font-size: 16px;">campaign</i>
                        <span>Barra de anuncios</span>
                    </div>
                    <div class="sidebar-subsection" data-block-type="header">
                        <i class="material-icons" style="font-size: 16px;">view_day</i>
                        <span>Encabezado</span>
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
                        <span class="section-title">Plantilla</span>
                    </div>
                    <i class="material-icons section-expand-icon">chevron_right</i>
                </div>
                <div class="sidebar-section-content">
                    <div class="sidebar-subsection" data-block-type="slideshow">
                        <i class="material-icons" style="font-size: 16px;">view_carousel</i>
                        <span>Presentación de diapositivas</span>
                    </div>
                    <div class="sidebar-subsection" data-block-type="multicolumn">
                        <i class="material-icons" style="font-size: 16px;">view_week</i>
                        <span>Varias filas</span>
                    </div>
                    <div class="sidebar-subsection" data-block-type="multicolumn">
                        <i class="material-icons" style="font-size: 16px;">view_module</i>
                        <span>Multicolumna</span>
                    </div>
                    <div class="sidebar-subsection" data-block-type="image-text">
                        <i class="material-icons" style="font-size: 16px;">image</i>
                        <span>Imagen con texto</span>
                    </div>
                    <div class="sidebar-subsection" data-block-type="liquid">
                        <i class="material-icons" style="font-size: 16px;">code</i>
                        <span>Líquido personalizado</span>
                    </div>
                    <div class="sidebar-subsection" data-block-type="image-text-2">
                        <i class="material-icons" style="font-size: 16px;">image</i>
                        <span>Imagen con texto</span>
                    </div>
                    <div class="sidebar-subsection" data-block-type="collapsible">
                        <i class="material-icons" style="font-size: 16px;">expand_more</i>
                        <span>Contenido desplegable</span>
                    </div>
                    <div class="sidebar-subsection" data-block-type="contact">
                        <i class="material-icons" style="font-size: 16px;">mail</i>
                        <span>Formulario de contacto</span>
                    </div>
                    <div class="add-section-button" id="add-section-btn">
                        <i class="material-icons" style="font-size: 18px;">add</i>
                        <span>Agregar sección</span>
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
                        <span class="section-title">Pie de página</span>
                    </div>
                    <i class="material-icons section-expand-icon">chevron_right</i>
                </div>
                <div class="sidebar-section-content">
                    <div class="sidebar-subsection" data-block-type="footer">
                        <i class="material-icons" style="font-size: 16px;">view_day</i>
                        <span>Pie de página</span>
                    </div>
                </div>
            </div>
            
            <!-- Footer Links -->
            <div class="sidebar-footer">
                <div class="sidebar-footer-link" id="view-page-link">
                    <i class="material-icons" style="font-size: 18px;">launch</i>
                    <span style="font-size: 13px;">Ver página</span>
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
        const fieldsHtml = (globalThemeSettingsSchema.fields || []).map(field => `
            <div class="settings-field">
                <label>${field}:</label>
                <input type="text" class="settings-input" data-field="${field}" value="${currentGlobalThemeSettings[field] || ''}" />
            </div>
        `).join('');
        
        return `
            <div class="sidebar-view-header">
                <button class="back-to-block-list-btn">
                    <i class="material-icons">arrow_back</i>
                </button>
                <h3>${lang.themeSettingsViewTitle || "Configuración del Tema"}</h3>
            </div>
            <div class="settings-container">
                ${fieldsHtml}
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
`;
document.head.appendChild(style);