// Módulo Featured Collection para Website Builder
console.log('[FEATURED COLLECTION MODULE] Loading featured collection module...');
window.WebsiteBuilderModules = window.WebsiteBuilderModules || {};
window.WebsiteBuilderModules.FeaturedCollection = {
    // Data properties
    selectedProducts: [],
    selectedCollections: [],
    
    // Renderizar el módulo en el preview
    render: function(config) {
        console.log('[FEATURED COLLECTION] Rendering with config:', config);
        
        if (!config || config.isHidden) return '';
        
        const settings = config.config || {};
        const schemeColors = window.getColorSchemeValues ? window.getColorSchemeValues(settings.colorScheme || 'scheme1') : {
            background: '#ffffff',
            text: '#000000',
            border: '#e0e0e0'
        };
        
        // Determinar si mostrar productos o colecciones
        const hasProducts = settings.products && settings.products.length > 0;
        const hasCollections = settings.collections && settings.collections.length > 0;
        const collectionId = settings.collection; // Para compatibilidad con versiones anteriores
        
        // Si hay productos seleccionados, tienen prioridad
        if (hasProducts) {
            return this.renderProductsView(settings, schemeColors);
        } else if (hasCollections || collectionId) {
            return this.renderCollectionView(settings, schemeColors);
        } else {
            return this.renderEmptyState(settings, schemeColors);
        }
    },
    
    // Renderizar vista de productos específicos
    renderProductsView: function(settings, schemeColors) {
        const uniqueId = 'featured-collection-' + Date.now();
        
        return `
            <div id="${uniqueId}" class="section-wrapper featured-collection-section" data-section-id="featured-collection" style="background-color: ${schemeColors.background}; padding-top: ${settings.topPadding || 96}px; padding-bottom: ${settings.bottomPadding || 48}px;">
                <div class="section-header-tag">
                    <span class="material-symbols-outlined" style="font-size: 16px;">inventory_2</span>
                    ${window.translations && window.translations[window.currentLanguage] ? 
                        (window.translations[window.currentLanguage]['sections.featuredCollection'] || 'Featured collection') : 
                        'Featured collection'}
                </div>
                <div class="container" style="max-width: ${settings.width === 'full' ? '100%' : '1200px'}; margin: 0 auto; padding: 0 ${settings.addSidePaddings ? '20px' : '0'};">
                    ${settings.heading ? `
                        <h2 style="font-size: ${this.getHeadingSize(settings.headingSize)}; text-align: ${settings.headingAlignment || 'left'}; color: ${schemeColors.text}; margin-bottom: 30px;">
                            ${settings.heading}
                        </h2>
                    ` : ''}
                    
                    <div class="${settings.desktopLayout || 'grid'}-layout" style="display: flex; flex-wrap: wrap; gap: ${settings.desktopSpaceBetweenCards || 16}px;">
                        <!-- Productos específicos se renderizarán aquí -->
                        <div style="text-align: center; padding: 40px; width: 100%;">
                            <p style="color: ${schemeColors.text};">Selected products will be displayed here</p>
                            <p style="color: ${schemeColors.text}; font-size: 12px; margin-top: 10px;">Product IDs: ${settings.products.join(', ')}</p>
                        </div>
                    </div>
                </div>
            </div>
        `;
    },
    
    // Renderizar vista de colección
    renderCollectionView: function(settings, schemeColors) {
        const uniqueId = 'featured-collection-' + Date.now();
        
        return `
            <div id="${uniqueId}" class="section-wrapper featured-collection-section" data-section-id="featured-collection" style="background-color: ${schemeColors.background}; padding-top: ${settings.topPadding || 96}px; padding-bottom: ${settings.bottomPadding || 48}px;">
                <div class="section-header-tag">
                    <span class="material-symbols-outlined" style="font-size: 16px;">inventory_2</span>
                    ${window.translations && window.translations[window.currentLanguage] ? 
                        (window.translations[window.currentLanguage]['sections.featuredCollection'] || 'Featured collection') : 
                        'Featured collection'}
                </div>
                <div class="container" style="max-width: ${settings.width === 'full' ? '100%' : '1200px'}; margin: 0 auto; padding: 0 ${settings.addSidePaddings ? '20px' : '0'};">
                    ${settings.heading ? `
                        <h2 style="font-size: ${this.getHeadingSize(settings.headingSize)}; text-align: ${settings.headingAlignment || 'left'}; color: ${schemeColors.text}; margin-bottom: 30px;">
                            ${settings.heading}
                        </h2>
                    ` : ''}
                    
                    <div class="${settings.desktopLayout || 'grid'}-layout" style="display: flex; flex-wrap: wrap; gap: ${settings.desktopSpaceBetweenCards || 16}px;">
                        <!-- Productos de la colección se renderizarán aquí -->
                        <div style="text-align: center; padding: 40px; width: 100%;">
                            <p style="color: ${schemeColors.text};">
                                ${settings.collections && settings.collections.length > 0 
                                    ? `Collections: ${settings.collectionNames ? settings.collectionNames.join(', ') : settings.collections.length + ' selected'}`
                                    : `Collection: ${settings.collectionName || 'Collection'}`}
                            </p>
                            <p style="color: ${schemeColors.text}; font-size: 12px; margin-top: 10px;">
                                ${settings.collections && settings.collections.length > 1 
                                    ? 'Products from these collections will be displayed'
                                    : 'Products from this collection will be displayed'}
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        `;
    },
    
    // Renderizar estado vacío
    renderEmptyState: function(settings, schemeColors) {
        const uniqueId = 'featured-collection-' + Date.now();
        
        return `
            <div id="${uniqueId}" class="section-wrapper featured-collection-section" data-section-id="featured-collection" style="background-color: ${schemeColors.background}; padding-top: ${settings.topPadding || 96}px; padding-bottom: ${settings.bottomPadding || 48}px;">
                <div class="section-header-tag">
                    <span class="material-symbols-outlined" style="font-size: 16px;">inventory_2</span>
                    ${window.translations && window.translations[window.currentLanguage] ? 
                        (window.translations[window.currentLanguage]['sections.featuredCollection'] || 'Featured collection') : 
                        'Featured collection'}
                </div>
                <div class="container" style="max-width: ${settings.width === 'full' ? '100%' : '1200px'}; margin: 0 auto; padding: 0 ${settings.addSidePaddings ? '20px' : '0'};">
                    <div style="text-align: center; padding: 60px 20px; border: 2px dashed ${schemeColors.border}; border-radius: 8px;">
                        <i class="material-icons" style="font-size: 48px; color: #999;">inventory_2</i>
                        <h3 style="color: ${schemeColors.text}; margin: 20px 0 10px;">No collection or products selected</h3>
                        <p style="color: #666;">Select a collection or specific products to display them here</p>
                    </div>
                </div>
            </div>
        `;
    },
    
    // Helper para obtener tamaño de heading
    getHeadingSize: function(size) {
        const sizes = {
            heading1: '48px',
            heading2: '40px',
            heading3: '36px',
            heading4: '32px',
            heading5: '28px',
            heading6: '24px',
            heading7: '20px',
            heading8: '16px'
        };
        return sizes[size] || '28px';
    },
    
    // Renderizar la vista de configuración
    renderSettings: function(config) {
        console.log('[FEATURED COLLECTION] Rendering settings with config:', config);
        
        const currentLanguage = window.currentLanguage || 'es';
        const translations = window.translations || {};
        
        // Valores por defecto
        const defaultConfig = {
            colorScheme: 'scheme1',
            width: 'page',
            desktopLayout: 'grid',
            mobileLayout: 'carousel',
            heading: 'Featured collection',
            headingSize: 'heading5',
            headingAlignment: 'left',
            collection: '',
            collectionName: 'Restaurantes',
            products: [],
            productName: 'Ejecutiva',
            imageRatio: 'default',
            contentAlignment: 'left',
            cardsToShow: 16,
            desktopCardsPerRow: 4,
            desktopSpaceBetweenCards: 16,
            mobileSpaceBetweenCards: 16,
            showArrowsOnHover: true,
            cardPosition: 'afterAllItems',
            contentPosition: 'onImage',
            cardContentAlignment: 'left',
            collectionTitleSize: 'heading6',
            showProductCount: true,
            overlayOpacity: 15,
            autoplayMode: 'none',
            autoplaySpeed: 3,
            addSidePaddings: true,
            topPadding: 96,
            bottomPadding: 48
        };
        
        // Mezclar configuración con valores por defecto
        const settings = { ...defaultConfig, ...(config?.config || {}) };
        
        return `
            <div style="display: flex; flex-direction: column; height: 100%; position: relative; overflow: hidden;">
                <!-- Header con flecha de regreso -->
                <div class="sidebar-view-header" style="position: relative; z-index: 10;">
                    <button class="back-to-sections-btn">
                        <i class="material-icons">arrow_back</i>
                    </button>
                    <h3 data-i18n="featuredCollection.title">Featured collection</h3>
                    <button class="view-menu-btn" style="position: absolute; right: 10px; top: 10px; background: none; border: none; cursor: pointer; padding: 5px;">
                        <i class="material-icons">more_vert</i>
                    </button>
                </div>
                
                <!-- Contenido con scroll -->
                <div style="padding: 20px; overflow-y: auto; overflow-x: hidden; flex: 1; height: calc(100% - 60px); box-sizing: border-box;">
                    
                    <!-- Color scheme -->
                    <div class="form-group">
                        <label style="font-size: 13px; font-weight: 500; margin-bottom: 8px; color: #5c5e60; display: block;" 
                               data-i18n="colorScheme">Color scheme</label>
                        <select class="shopify-select" id="featuredCollectionColorScheme" 
                                style="width: 100%; padding: 8px 12px; border: 1px solid #e0e0e0; border-radius: 4px; background: white;">
                            <option value="default" ${settings.colorScheme === 'default' ? 'selected' : ''} data-i18n="colorScheme.default">Default</option>
                            <option value="scheme1" ${settings.colorScheme === 'scheme1' ? 'selected' : ''} data-i18n="colorScheme.scheme1">Scheme 1</option>
                            <option value="scheme2" ${settings.colorScheme === 'scheme2' ? 'selected' : ''} data-i18n="colorScheme.scheme2">Scheme 2</option>
                            <option value="scheme3" ${settings.colorScheme === 'scheme3' ? 'selected' : ''} data-i18n="colorScheme.scheme3">Scheme 3</option>
                            <option value="scheme4" ${settings.colorScheme === 'scheme4' ? 'selected' : ''} data-i18n="colorScheme.scheme4">Scheme 4</option>
                            <option value="scheme5" ${settings.colorScheme === 'scheme5' ? 'selected' : ''} data-i18n="colorScheme.scheme5">Scheme 5</option>
                        </select>
                        <div style="font-size: 12px; color: #666; margin-top: 5px;">
                            <a href="#" style="color: #2962ff;" onclick="return false;" data-i18n="learnAboutColorSchemes">Learn about color schemes</a>
                        </div>
                    </div>

                    <!-- Width -->
                    <div class="form-group" style="margin-top: 20px;">
                        <label style="font-size: 13px; font-weight: 500; margin-bottom: 8px; color: #5c5e60; display: block;" 
                               data-i18n="width">Width</label>
                        <select class="shopify-select" id="featuredCollectionWidth" 
                                style="width: 100%; padding: 8px 12px; border: 1px solid #e0e0e0; border-radius: 4px; background: white;">
                            <option value="page" ${settings.width === 'page' ? 'selected' : ''} data-i18n="width.page">Page</option>
                            <option value="full" ${settings.width === 'full' ? 'selected' : ''} data-i18n="width.full">Full width</option>
                        </select>
                    </div>

                    <!-- Desktop layout -->
                    <div class="form-group" style="margin-top: 20px;">
                        <label style="font-size: 13px; font-weight: 500; margin-bottom: 8px; color: #5c5e60; display: block;" 
                               data-i18n="desktopLayout">Desktop layout</label>
                        <div style="display: flex; gap: 12px;">
                            <label class="radio-option-card" style="flex: 1; padding: 12px; border: 2px solid ${settings.desktopLayout === 'grid' ? '#2962ff' : '#e0e0e0'}; border-radius: 8px; cursor: pointer; text-align: center;">
                                <input type="radio" name="desktopLayout" value="grid" ${settings.desktopLayout === 'grid' ? 'checked' : ''} style="display: none;">
                                <span data-i18n="layout.grid">Grid</span>
                            </label>
                            <label class="radio-option-card" style="flex: 1; padding: 12px; border: 2px solid ${settings.desktopLayout === 'carousel' ? '#2962ff' : '#e0e0e0'}; border-radius: 8px; cursor: pointer; text-align: center;">
                                <input type="radio" name="desktopLayout" value="carousel" ${settings.desktopLayout === 'carousel' ? 'checked' : ''} style="display: none;">
                                <span data-i18n="layout.carousel">Carousel</span>
                            </label>
                            <label class="radio-option-card" style="flex: 1; padding: 12px; border: 2px solid ${settings.desktopLayout === 'slider' ? '#2962ff' : '#e0e0e0'}; border-radius: 8px; cursor: pointer; text-align: center;">
                                <input type="radio" name="desktopLayout" value="slider" ${settings.desktopLayout === 'slider' ? 'checked' : ''} style="display: none;">
                                <span data-i18n="layout.slider">Slider</span>
                            </label>
                        </div>
                    </div>

                    <!-- Mobile layout -->
                    <div class="form-group" style="margin-top: 20px;">
                        <label style="font-size: 13px; font-weight: 500; margin-bottom: 8px; color: #5c5e60; display: block;" 
                               data-i18n="mobileLayout">Mobile layout</label>
                        <select class="shopify-select" id="featuredCollectionMobileLayout" 
                                style="width: 100%; padding: 8px 12px; border: 1px solid #e0e0e0; border-radius: 4px; background: white;">
                            <option value="carousel" ${settings.mobileLayout === 'carousel' ? 'selected' : ''} data-i18n="layout.carousel">Carousel</option>
                            <option value="grid" ${settings.mobileLayout === 'grid' ? 'selected' : ''} data-i18n="layout.grid">Grid</option>
                        </select>
                    </div>

                    <!-- Collection Section Title -->
                    <div class="form-group" style="margin-top: 30px;">
                        <h4 style="font-size: 16px; font-weight: 600; margin-bottom: 20px; color: #202223;" 
                            data-i18n="collection">Collection</h4>
                    </div>
                    
                    <!-- Heading -->
                    <div class="form-group">
                        <label style="font-size: 13px; font-weight: 500; margin-bottom: 8px; color: #5c5e60; display: block;" 
                               data-i18n="heading">Heading</label>
                        <input type="text" 
                               id="featuredCollectionHeading" 
                               value="${settings.heading || ''}"
                               placeholder="Enter heading"
                               data-i18n-placeholder="heading.placeholder"
                               style="width: 100%; padding: 8px 12px; border: 1px solid #e0e0e0; border-radius: 4px;">
                    </div>

                    <!-- Heading size -->
                    <div class="form-group" style="margin-top: 20px;">
                        <label style="font-size: 13px; font-weight: 500; margin-bottom: 8px; color: #5c5e60; display: block;" 
                               data-i18n="headingSize">Heading size</label>
                        <select class="shopify-select" id="featuredCollectionHeadingSize" 
                                style="width: 100%; padding: 8px 12px; border: 1px solid #e0e0e0; border-radius: 4px; background: white;">
                            <option value="heading1" ${settings.headingSize === 'heading1' ? 'selected' : ''}>Heading 1</option>
                            <option value="heading2" ${settings.headingSize === 'heading2' ? 'selected' : ''}>Heading 2</option>
                            <option value="heading3" ${settings.headingSize === 'heading3' ? 'selected' : ''}>Heading 3</option>
                            <option value="heading4" ${settings.headingSize === 'heading4' ? 'selected' : ''}>Heading 4</option>
                            <option value="heading5" ${settings.headingSize === 'heading5' ? 'selected' : ''}>Heading 5</option>
                            <option value="heading6" ${settings.headingSize === 'heading6' ? 'selected' : ''}>Heading 6</option>
                            <option value="heading7" ${settings.headingSize === 'heading7' ? 'selected' : ''}>Heading 7</option>
                            <option value="heading8" ${settings.headingSize === 'heading8' ? 'selected' : ''}>Heading 8</option>
                        </select>
                    </div>

                    <!-- Heading alignment -->
                    <div class="form-group" style="margin-top: 20px;">
                        <label style="font-size: 13px; font-weight: 500; margin-bottom: 8px; color: #5c5e60; display: block;" 
                               data-i18n="headingAlignment">Heading alignment</label>
                        <div style="display: flex; gap: 8px;">
                            <button class="alignment-btn ${settings.headingAlignment === 'left' ? 'active' : ''}" 
                                    data-value="left" 
                                    style="padding: 8px 16px; border: 1px solid ${settings.headingAlignment === 'left' ? '#2962ff' : '#e0e0e0'}; 
                                           background: ${settings.headingAlignment === 'left' ? '#f0f7ff' : 'white'}; 
                                           border-radius: 4px; cursor: pointer;">
                                <i class="material-icons" style="font-size: 18px;">format_align_left</i>
                            </button>
                            <button class="alignment-btn ${settings.headingAlignment === 'center' ? 'active' : ''}" 
                                    data-value="center" 
                                    style="padding: 8px 16px; border: 1px solid ${settings.headingAlignment === 'center' ? '#2962ff' : '#e0e0e0'}; 
                                           background: ${settings.headingAlignment === 'center' ? '#f0f7ff' : 'white'}; 
                                           border-radius: 4px; cursor: pointer;">
                                <i class="material-icons" style="font-size: 18px;">format_align_center</i>
                            </button>
                        </div>
                    </div>

                    <!-- Collection selector -->
                    <div class="form-group" style="margin-top: 20px;">
                        <label style="font-size: 13px; font-weight: 500; margin-bottom: 8px; color: #5c5e60; display: block;" 
                               data-i18n="collection">Collection</label>
                        <div style="border: 1px solid #e0e0e0; border-radius: 8px; background: white; padding: 16px;">
                            ${settings.collections && settings.collections.length > 0 ? `
                                <div style="display: flex; flex-direction: column; gap: 8px; margin-bottom: 12px; max-height: 200px; overflow-y: auto;">
                                    ${settings.collections.slice(0, 5).map((id, index) => {
                                        const name = settings.collectionNames ? settings.collectionNames[index] : 'Collection';
                                        return `
                                            <div style="display: flex; align-items: center; gap: 12px; padding: 8px 12px; background: #f7f7f7; border-radius: 6px;">
                                                <div style="width: 40px; height: 40px; background: #e0e0e0; border-radius: 4px; display: flex; align-items: center; justify-content: center; flex-shrink: 0;">
                                                    <i class="material-icons" style="font-size: 20px; color: #666;">folder_open</i>
                                                </div>
                                                <span style="font-size: 14px; color: #202223; font-weight: 500;">${name}</span>
                                            </div>
                                        `;
                                    }).join('')}
                                    ${settings.collections.length > 5 ? `
                                        <div style="text-align: center; padding: 8px; color: #666; font-size: 13px; background: #f0f0f0; border-radius: 4px;">
                                            <span>+${settings.collections.length - 5} más colecciones</span>
                                        </div>
                                    ` : ''}
                                </div>
                            ` : (settings.collectionName ? `
                                <div style="display: flex; align-items: center; gap: 8px; margin-bottom: 12px;">
                                    <div style="width: 40px; height: 40px; background: #e0e0e0; border-radius: 4px; display: flex; align-items: center; justify-content: center;">
                                        <i class="material-icons" style="font-size: 20px; color: #666;">folder_open</i>
                                    </div>
                                    <span style="font-size: 14px; color: #202223;">${settings.collectionName}</span>
                                </div>
                            ` : `
                                <div style="text-align: center; padding: 20px; color: #666;">
                                    <i class="material-icons" style="font-size: 48px; color: #e0e0e0; display: block; margin-bottom: 8px;">folder_open</i>
                                    <span style="font-size: 14px;">No collection selected</span>
                                </div>
                            `)}
                            <button style="width: 100%; padding: 8px 16px; background: white; border: 1px solid #e0e0e0; border-radius: 4px; cursor: pointer; color: #202223; font-weight: 500;" 
                                    data-i18n="change">Cambiar</button>
                        </div>
                    </div>
                    
                    <!-- Products selector -->
                    <div class="form-group" style="margin-top: 20px;">
                        <label style="font-size: 13px; font-weight: 500; margin-bottom: 8px; color: #5c5e60; display: block;" 
                               data-i18n="products">Products</label>
                        <div style="border: 1px solid #e0e0e0; border-radius: 8px; background: white; padding: 16px;">
                            ${settings.products && settings.products.length > 0 ? `
                                <div style="display: flex; flex-direction: column; gap: 8px; margin-bottom: 12px; max-height: 200px; overflow-y: auto;">
                                    ${settings.products.slice(0, 5).map((id, index) => {
                                        const name = settings.productNames ? settings.productNames[index] : 'Product';
                                        const imageUrl = settings.productImages ? settings.productImages[index] : null;
                                        return `
                                            <div style="display: flex; align-items: center; gap: 12px; padding: 8px 12px; background: #f7f7f7; border-radius: 6px;">
                                                ${imageUrl ? `
                                                    <img src="${imageUrl}" style="width: 40px; height: 40px; object-fit: cover; border-radius: 4px; flex-shrink: 0;">
                                                ` : `
                                                    <div style="width: 40px; height: 40px; background: #e0e0e0; border-radius: 4px; display: flex; align-items: center; justify-content: center; flex-shrink: 0;">
                                                        <i class="material-icons" style="font-size: 20px; color: #666;">image</i>
                                                    </div>
                                                `}
                                                <span style="font-size: 14px; color: #202223; font-weight: 500;">${name}</span>
                                            </div>
                                        `;
                                    }).join('')}
                                    ${settings.products.length > 5 ? `
                                        <div style="text-align: center; padding: 8px; color: #666; font-size: 13px; background: #f0f0f0; border-radius: 4px;">
                                            <span>+${settings.products.length - 5} más productos</span>
                                        </div>
                                    ` : ''}
                                </div>
                            ` : `
                                <div style="text-align: center; padding: 20px; color: #666;">
                                    <i class="material-icons" style="font-size: 48px; color: #e0e0e0; display: block; margin-bottom: 8px;">inventory_2</i>
                                    <span style="font-size: 14px;">No products selected</span>
                                </div>
                            `}
                            <button style="width: 100%; padding: 8px 16px; background: white; border: 1px solid #e0e0e0; border-radius: 4px; cursor: pointer; color: #202223; font-weight: 500; margin-top: ${settings.products && settings.products.length > 0 ? '12px' : '0'};" 
                                    data-i18n="change">Cambiar</button>
                        </div>
                        <div style="font-size: 12px; color: #666; margin-top: 8px;">
                            <span data-i18n="productsHavePriority">Products have priority over a collection</span>
                        </div>
                    </div>

                    <!-- Cards Section Title -->
                    <div class="form-group" style="margin-top: 30px;">
                        <h4 style="font-size: 16px; font-weight: 600; margin-bottom: 20px; color: #202223;" 
                            data-i18n="cards">Cards</h4>
                    </div>

                    <!-- Image ratio -->
                    <div class="form-group">
                        <label style="font-size: 13px; font-weight: 500; margin-bottom: 8px; color: #5c5e60; display: block;" 
                               data-i18n="imageRatio">Image ratio</label>
                        <select class="shopify-select" id="featuredCollectionImageRatio" 
                                style="width: 100%; padding: 8px 12px; border: 1px solid #e0e0e0; border-radius: 4px; background: white;">
                            <option value="default" ${settings.imageRatio === 'default' ? 'selected' : ''} data-i18n="imageRatio.default">Default</option>
                            <option value="square" ${settings.imageRatio === 'square' ? 'selected' : ''} data-i18n="imageRatio.square">Square</option>
                            <option value="portrait" ${settings.imageRatio === 'portrait' ? 'selected' : ''} data-i18n="imageRatio.portrait">Portrait</option>
                            <option value="landscape" ${settings.imageRatio === 'landscape' ? 'selected' : ''} data-i18n="imageRatio.landscape">Landscape</option>
                        </select>
                    </div>

                    <!-- Content alignment -->
                    <div class="form-group" style="margin-top: 20px;">
                        <label style="font-size: 13px; font-weight: 500; margin-bottom: 8px; color: #5c5e60; display: block;" 
                               data-i18n="contentAlignment">Content alignment</label>
                        <div style="display: flex; gap: 8px;">
                            <button class="alignment-btn ${settings.contentAlignment === 'left' ? 'active' : ''}" 
                                    data-value="left" 
                                    data-field="contentAlignment"
                                    style="padding: 8px 16px; border: 1px solid ${settings.contentAlignment === 'left' ? '#2962ff' : '#e0e0e0'}; 
                                           background: ${settings.contentAlignment === 'left' ? '#f0f7ff' : 'white'}; 
                                           border-radius: 4px; cursor: pointer;">
                                <i class="material-icons" style="font-size: 18px;">format_align_left</i>
                            </button>
                            <button class="alignment-btn ${settings.contentAlignment === 'center' ? 'active' : ''}" 
                                    data-value="center"
                                    data-field="contentAlignment" 
                                    style="padding: 8px 16px; border: 1px solid ${settings.contentAlignment === 'center' ? '#2962ff' : '#e0e0e0'}; 
                                           background: ${settings.contentAlignment === 'center' ? '#f0f7ff' : 'white'}; 
                                           border-radius: 4px; cursor: pointer;">
                                <i class="material-icons" style="font-size: 18px;">format_align_center</i>
                            </button>
                        </div>
                    </div>

                    <!-- Cards to show (slider) -->
                    <div class="form-group" style="margin-top: 20px;">
                        <label style="font-size: 13px; font-weight: 500; margin-bottom: 8px; color: #5c5e60; display: block;" 
                               data-i18n="cardsToShow">Cards to show</label>
                        <div style="display: flex; align-items: center; gap: 12px;">
                            <input type="range" 
                                   min="2" 
                                   max="50" 
                                   value="${settings.cardsToShow}" 
                                   id="featuredCollectionCardsToShow" 
                                   style="flex: 1;">
                            <span style="min-width: 40px; text-align: right; color: #202223;">${settings.cardsToShow}</span>
                        </div>
                    </div>

                    <!-- Desktop cards per row (slider) -->
                    <div class="form-group" style="margin-top: 20px;">
                        <label style="font-size: 13px; font-weight: 500; margin-bottom: 8px; color: #5c5e60; display: block;" 
                               data-i18n="desktopCardsPerRow">Desktop cards per row</label>
                        <div style="display: flex; align-items: center; gap: 12px;">
                            <input type="range" 
                                   min="1" 
                                   max="5" 
                                   value="${settings.desktopCardsPerRow}" 
                                   id="featuredCollectionDesktopCardsPerRow" 
                                   style="flex: 1;">
                            <span style="min-width: 40px; text-align: right; color: #202223;">${settings.desktopCardsPerRow}</span>
                        </div>
                    </div>

                    <!-- Desktop space between cards (slider) -->
                    <div class="form-group" style="margin-top: 20px;">
                        <label style="font-size: 13px; font-weight: 500; margin-bottom: 8px; color: #5c5e60; display: block;" 
                               data-i18n="desktopSpaceBetweenCards">Desktop space between cards</label>
                        <div style="display: flex; align-items: center; gap: 12px;">
                            <input type="range" 
                                   min="0" 
                                   max="32" 
                                   value="${settings.desktopSpaceBetweenCards}" 
                                   id="featuredCollectionDesktopSpaceBetweenCards" 
                                   style="flex: 1;">
                            <span style="min-width: 50px; text-align: right; color: #202223;">${settings.desktopSpaceBetweenCards} px</span>
                        </div>
                    </div>

                    <!-- Mobile space between cards (slider) -->
                    <div class="form-group" style="margin-top: 20px;">
                        <label style="font-size: 13px; font-weight: 500; margin-bottom: 8px; color: #5c5e60; display: block;" 
                               data-i18n="mobileSpaceBetweenCards">Mobile space between cards</label>
                        <div style="display: flex; align-items: center; gap: 12px;">
                            <input type="range" 
                                   min="0" 
                                   max="32" 
                                   value="${settings.mobileSpaceBetweenCards}" 
                                   id="featuredCollectionMobileSpaceBetweenCards" 
                                   style="flex: 1;">
                            <span style="min-width: 50px; text-align: right; color: #202223;">${settings.mobileSpaceBetweenCards} px</span>
                        </div>
                    </div>

                    <!-- Show arrows on hover (toggle) -->
                    <div class="form-group" style="margin-top: 20px;">
                        <label class="toggle-field">
                            <span data-i18n="showArrowsOnHover">Show arrows on hover</span>
                            <input type="checkbox" class="shopify-toggle" id="featuredCollectionShowArrowsOnHover" ${settings.showArrowsOnHover ? 'checked' : ''}>
                            <label for="featuredCollectionShowArrowsOnHover" class="toggle-slider"></label>
                        </label>
                    </div>

                    <!-- Collection card Section Title -->
                    <div class="form-group" style="margin-top: 30px;">
                        <h4 style="font-size: 16px; font-weight: 600; margin-bottom: 20px; color: #202223;" 
                            data-i18n="collectionCard">Collection card</h4>
                    </div>

                    <!-- Card position -->
                    <div class="form-group">
                        <label style="font-size: 13px; font-weight: 500; margin-bottom: 8px; color: #5c5e60; display: block;" 
                               data-i18n="cardPosition">Card position</label>
                        <select class="shopify-select" id="featuredCollectionCardPosition" 
                                style="width: 100%; padding: 8px 12px; border: 1px solid #e0e0e0; border-radius: 4px; background: white;">
                            <option value="afterAllItems" ${settings.cardPosition === 'afterAllItems' ? 'selected' : ''} data-i18n="cardPosition.afterAllItems">After all items</option>
                            <option value="beforeAllItems" ${settings.cardPosition === 'beforeAllItems' ? 'selected' : ''} data-i18n="cardPosition.beforeAllItems">Before all items</option>
                            <option value="noCard" ${settings.cardPosition === 'noCard' ? 'selected' : ''} data-i18n="cardPosition.noCard">No card</option>
                        </select>
                    </div>

                    <!-- Content position -->
                    <div class="form-group" style="margin-top: 20px;">
                        <label style="font-size: 13px; font-weight: 500; margin-bottom: 8px; color: #5c5e60; display: block;" 
                               data-i18n="contentPosition">Content position</label>
                        <select class="shopify-select" id="featuredCollectionContentPosition" 
                                style="width: 100%; padding: 8px 12px; border: 1px solid #e0e0e0; border-radius: 4px; background: white;">
                            <option value="onImage" ${settings.contentPosition === 'onImage' ? 'selected' : ''} data-i18n="contentPosition.onImage">On image - Bottom</option>
                            <option value="onImageTop" ${settings.contentPosition === 'onImageTop' ? 'selected' : ''} data-i18n="contentPosition.onImageTop">On image - Top</option>
                            <option value="onImageCenter" ${settings.contentPosition === 'onImageCenter' ? 'selected' : ''} data-i18n="contentPosition.onImageCenter">On image - Center</option>
                        </select>
                    </div>

                    <!-- Card content alignment -->
                    <div class="form-group" style="margin-top: 20px;">
                        <label style="font-size: 13px; font-weight: 500; margin-bottom: 8px; color: #5c5e60; display: block;" 
                               data-i18n="contentAlignment">Content alignment</label>
                        <div style="display: flex; gap: 8px;">
                            <button class="alignment-btn ${settings.cardContentAlignment === 'left' ? 'active' : ''}" 
                                    data-value="left"
                                    data-field="cardContentAlignment" 
                                    style="padding: 8px 16px; border: 1px solid ${settings.cardContentAlignment === 'left' ? '#2962ff' : '#e0e0e0'}; 
                                           background: ${settings.cardContentAlignment === 'left' ? '#f0f7ff' : 'white'}; 
                                           border-radius: 4px; cursor: pointer;">
                                <i class="material-icons" style="font-size: 18px;">format_align_left</i>
                            </button>
                            <button class="alignment-btn ${settings.cardContentAlignment === 'center' ? 'active' : ''}" 
                                    data-value="center"
                                    data-field="cardContentAlignment" 
                                    style="padding: 8px 16px; border: 1px solid ${settings.cardContentAlignment === 'center' ? '#2962ff' : '#e0e0e0'}; 
                                           background: ${settings.cardContentAlignment === 'center' ? '#f0f7ff' : 'white'}; 
                                           border-radius: 4px; cursor: pointer;">
                                <i class="material-icons" style="font-size: 18px;">format_align_center</i>
                            </button>
                            <button class="alignment-btn ${settings.cardContentAlignment === 'right' ? 'active' : ''}" 
                                    data-value="right"
                                    data-field="cardContentAlignment" 
                                    style="padding: 8px 16px; border: 1px solid ${settings.cardContentAlignment === 'right' ? '#2962ff' : '#e0e0e0'}; 
                                           background: ${settings.cardContentAlignment === 'right' ? '#f0f7ff' : 'white'}; 
                                           border-radius: 4px; cursor: pointer;">
                                <i class="material-icons" style="font-size: 18px;">format_align_right</i>
                            </button>
                        </div>
                    </div>

                    <!-- Collection title size -->
                    <div class="form-group" style="margin-top: 20px;">
                        <label style="font-size: 13px; font-weight: 500; margin-bottom: 8px; color: #5c5e60; display: block;" 
                               data-i18n="collectionTitleSize">Collection title size</label>
                        <select class="shopify-select" id="featuredCollectionTitleSize" 
                                style="width: 100%; padding: 8px 12px; border: 1px solid #e0e0e0; border-radius: 4px; background: white;">
                            <option value="heading1" ${settings.collectionTitleSize === 'heading1' ? 'selected' : ''}>Heading 1</option>
                            <option value="heading2" ${settings.collectionTitleSize === 'heading2' ? 'selected' : ''}>Heading 2</option>
                            <option value="heading3" ${settings.collectionTitleSize === 'heading3' ? 'selected' : ''}>Heading 3</option>
                            <option value="heading4" ${settings.collectionTitleSize === 'heading4' ? 'selected' : ''}>Heading 4</option>
                            <option value="heading5" ${settings.collectionTitleSize === 'heading5' ? 'selected' : ''}>Heading 5</option>
                            <option value="heading6" ${settings.collectionTitleSize === 'heading6' ? 'selected' : ''}>Heading 6</option>
                            <option value="heading7" ${settings.collectionTitleSize === 'heading7' ? 'selected' : ''}>Heading 7</option>
                            <option value="heading8" ${settings.collectionTitleSize === 'heading8' ? 'selected' : ''}>Heading 8</option>
                        </select>
                    </div>

                    <!-- Show product count (toggle) -->
                    <div class="form-group" style="margin-top: 20px;">
                        <label class="toggle-field">
                            <span data-i18n="showProductCount">Show product count</span>
                            <input type="checkbox" class="shopify-toggle" id="featuredCollectionShowProductCount" ${settings.showProductCount ? 'checked' : ''}>
                            <label for="featuredCollectionShowProductCount" class="toggle-slider"></label>
                        </label>
                    </div>

                    <!-- Overlay opacity (slider) -->
                    <div class="form-group" style="margin-top: 20px;">
                        <label style="font-size: 13px; font-weight: 500; margin-bottom: 8px; color: #5c5e60; display: block;" 
                               data-i18n="overlayOpacity">Overlay opacity</label>
                        <div style="display: flex; align-items: center; gap: 12px;">
                            <input type="range" 
                                   min="0" 
                                   max="100" 
                                   value="${settings.overlayOpacity}" 
                                   id="featuredCollectionOverlayOpacity" 
                                   style="flex: 1;">
                            <span style="min-width: 40px; text-align: right; color: #202223;">${settings.overlayOpacity}%</span>
                        </div>
                        <div style="font-size: 12px; color: #666; margin-top: 5px;">
                            <span data-i18n="overlayOpacityHelp">Only for 'on image' positions</span>
                        </div>
                    </div>

                    <!-- Autoplay Section Title -->
                    <div class="form-group" style="margin-top: 30px;">
                        <h4 style="font-size: 16px; font-weight: 600; margin-bottom: 20px; color: #202223;" 
                            data-i18n="autoplay">Autoplay</h4>
                    </div>

                    <!-- Autoplay mode -->
                    <div class="form-group">
                        <label style="font-size: 13px; font-weight: 500; margin-bottom: 8px; color: #5c5e60; display: block;" 
                               data-i18n="autoplayMode">Autoplay mode</label>
                        <select class="shopify-select" id="featuredCollectionAutoplayMode" 
                                style="width: 100%; padding: 8px 12px; border: 1px solid #e0e0e0; border-radius: 4px; background: white;">
                            <option value="none" ${settings.autoplayMode === 'none' ? 'selected' : ''} data-i18n="autoplayMode.none">None</option>
                            <option value="desktop" ${settings.autoplayMode === 'desktop' ? 'selected' : ''} data-i18n="autoplayMode.desktop">Desktop only</option>
                            <option value="mobile" ${settings.autoplayMode === 'mobile' ? 'selected' : ''} data-i18n="autoplayMode.mobile">Mobile only</option>
                            <option value="both" ${settings.autoplayMode === 'both' ? 'selected' : ''} data-i18n="autoplayMode.both">Desktop and mobile</option>
                        </select>
                    </div>

                    <!-- Autoplay speed (slider) -->
                    <div class="form-group" style="margin-top: 20px; ${settings.autoplayMode === 'none' ? 'display:none;' : ''}" id="autoplaySpeedContainer">
                        <label style="font-size: 13px; font-weight: 500; margin-bottom: 8px; color: #5c5e60; display: block;" 
                               data-i18n="autoplaySpeed">Autoplay speed</label>
                        <div style="display: flex; align-items: center; gap: 12px;">
                            <input type="range" 
                                   min="1" 
                                   max="10" 
                                   value="${settings.autoplaySpeed}" 
                                   id="featuredCollectionAutoplaySpeed" 
                                   style="flex: 1;">
                            <span style="min-width: 40px; text-align: right; color: #202223;">${settings.autoplaySpeed} s</span>
                        </div>
                    </div>

                    <!-- Paddings Section Title -->
                    <div class="form-group" style="margin-top: 30px;">
                        <h4 style="font-size: 16px; font-weight: 600; margin-bottom: 20px; color: #202223;" 
                            data-i18n="paddings">Paddings</h4>
                    </div>

                    <!-- Add side paddings (toggle) -->
                    <div class="form-group">
                        <label class="toggle-field">
                            <span data-i18n="addSidePaddings">Add side paddings</span>
                            <input type="checkbox" class="shopify-toggle" id="featuredCollectionAddSidePaddings" ${settings.addSidePaddings ? 'checked' : ''}>
                            <label for="featuredCollectionAddSidePaddings" class="toggle-slider"></label>
                        </label>
                    </div>

                    <!-- Top padding (slider) -->
                    <div class="form-group" style="margin-top: 20px;">
                        <label style="font-size: 13px; font-weight: 500; margin-bottom: 8px; color: #5c5e60; display: block;" 
                               data-i18n="topPadding">Top padding</label>
                        <div style="display: flex; align-items: center; gap: 12px;">
                            <input type="range" 
                                   min="0" 
                                   max="200" 
                                   value="${settings.topPadding}" 
                                   id="featuredCollectionTopPadding" 
                                   style="flex: 1;">
                            <span style="min-width: 50px; text-align: right; color: #202223;">${settings.topPadding} px</span>
                        </div>
                    </div>

                    <!-- Bottom padding (slider) -->
                    <div class="form-group" style="margin-top: 20px;">
                        <label style="font-size: 13px; font-weight: 500; margin-bottom: 8px; color: #5c5e60; display: block;" 
                               data-i18n="bottomPadding">Bottom padding</label>
                        <div style="display: flex; align-items: center; gap: 12px;">
                            <input type="range" 
                                   min="0" 
                                   max="200" 
                                   value="${settings.bottomPadding}" 
                                   id="featuredCollectionBottomPadding" 
                                   style="flex: 1;">
                            <span style="min-width: 50px; text-align: right; color: #202223;">${settings.bottomPadding} px</span>
                        </div>
                    </div>

                </div>
            </div>
        `;
    },
    
    // Adjuntar event listeners
    attachEventListeners: function() {
        console.log('[FEATURED COLLECTION] Attaching event listeners');
        
        // Apply translations PRIMERO
        setTimeout(applyTranslations, 0);
        
        // Back button - SIEMPRE navega a blockList
        $('.back-to-sections-btn').off('click.featuredCollection').on('click.featuredCollection', function() {
            window.switchSidebarView('blockList');
        });
        
        // Get section ID
        const sectionId = window.currentFeaturedCollectionId || 'featured-collection-' + Date.now();
        
        // Helper function para actualizar configuración
        const updateConfig = (key, value) => {
            // Inicializar estructura si no existe
            if (!window.currentSectionsConfig.featuredCollections) {
                window.currentSectionsConfig.featuredCollections = {};
            }
            if (!window.currentSectionsConfig.featuredCollections[sectionId]) {
                window.currentSectionsConfig.featuredCollections[sectionId] = {
                    config: {},
                    isHidden: false
                };
            }
            if (!window.currentSectionsConfig.featuredCollections[sectionId].config) {
                window.currentSectionsConfig.featuredCollections[sectionId].config = {};
            }
            
            // Actualizar valor
            window.currentSectionsConfig.featuredCollections[sectionId].config[key] = value;
            
            console.log(`[FEATURED COLLECTION] Updated ${key} to:`, value);
            
            // CRÍTICO: Usar función setter, NO asignación directa
            if (typeof window.setHasPendingPageStructureChanges === 'function') {
                window.setHasPendingPageStructureChanges(true);
            } else {
                window.hasPendingPageStructureChanges = true;
            }
            
            if (typeof window.updateSaveButtonState === 'function') {
                window.updateSaveButtonState();
            }
            
            if (typeof window.renderPreview === 'function') {
                window.renderPreview();
            }
        };
        
        // Color scheme select
        $('#featuredCollectionColorScheme').off('change.featuredCollection').on('change.featuredCollection', function() {
            updateConfig('colorScheme', $(this).val());
        });
        
        // Width select
        $('#featuredCollectionWidth').off('change.featuredCollection').on('change.featuredCollection', function() {
            updateConfig('width', $(this).val());
        });
        
        // Mobile layout select
        $('#featuredCollectionMobileLayout').off('change.featuredCollection').on('change.featuredCollection', function() {
            updateConfig('mobileLayout', $(this).val());
        });
        
        // Heading input
        $('#featuredCollectionHeading').off('input.featuredCollection').on('input.featuredCollection', function() {
            updateConfig('heading', $(this).val());
        });
        
        // Heading size select
        $('#featuredCollectionHeadingSize').off('change.featuredCollection').on('change.featuredCollection', function() {
            updateConfig('headingSize', $(this).val());
        });
        
        // Image ratio select
        $('#featuredCollectionImageRatio').off('change.featuredCollection').on('change.featuredCollection', function() {
            updateConfig('imageRatio', $(this).val());
        });
        
        // Card position select
        $('#featuredCollectionCardPosition').off('change.featuredCollection').on('change.featuredCollection', function() {
            updateConfig('cardPosition', $(this).val());
        });
        
        // Content position select
        $('#featuredCollectionContentPosition').off('change.featuredCollection').on('change.featuredCollection', function() {
            updateConfig('contentPosition', $(this).val());
        });
        
        // Collection title size select
        $('#featuredCollectionTitleSize').off('change.featuredCollection').on('change.featuredCollection', function() {
            updateConfig('collectionTitleSize', $(this).val());
        });
        
        // Autoplay mode select
        $('#featuredCollectionAutoplayMode').off('change.featuredCollection').on('change.featuredCollection', function() {
            const value = $(this).val();
            updateConfig('autoplayMode', value);
            
            // Show/hide autoplay speed
            if (value === 'none') {
                $('#autoplaySpeedContainer').hide();
            } else {
                $('#autoplaySpeedContainer').show();
            }
        });
        
        // Desktop layout radio buttons con actualización visual
        $('input[name="desktopLayout"]').off('change.featuredCollection').on('change.featuredCollection', function() {
            const selectedValue = $(this).val();
            updateConfig('desktopLayout', selectedValue);
            
            // Actualizar bordes visuales
            $('.radio-option-card').each(function() {
                const $card = $(this);
                const $radio = $card.find('input[type="radio"]');
                if ($radio.attr('name') === 'desktopLayout') {
                    $card.css('border-color', $radio.is(':checked') ? '#2962ff' : '#e0e0e0');
                }
            });
        });
        
        // Alignment buttons para heading
        $('.alignment-btn').off('click.featuredCollection').on('click.featuredCollection', function() {
            const field = $(this).data('field') || 'headingAlignment';
            const value = $(this).data('value');
            
            // Update active state solo para botones del mismo campo
            $(this).siblings('[data-field="' + field + '"]').addBack('[data-field="' + field + '"]').each(function() {
                const isActive = $(this).data('value') === value;
                $(this).css({
                    'border-color': isActive ? '#2962ff' : '#e0e0e0',
                    'background': isActive ? '#f0f7ff' : 'white'
                });
            });
            
            updateConfig(field, value);
        });
        
        // Toggle checkboxes
        $('.shopify-toggle').off('change.featuredCollection').on('change.featuredCollection', function() {
            const field = this.id.replace('featuredCollection', '');
            const fieldName = field.charAt(0).toLowerCase() + field.slice(1);
            updateConfig(fieldName, $(this).is(':checked'));
        });
        
        // Range sliders con actualización de display
        $('input[type="range"]').off('input.featuredCollection').on('input.featuredCollection', function() {
            const value = $(this).val();
            const field = this.id.replace('featuredCollection', '');
            const fieldName = field.charAt(0).toLowerCase() + field.slice(1);
            
            // Update display value
            const suffix = fieldName.includes('padding') || fieldName.includes('space') ? ' px' : 
                          fieldName === 'autoplaySpeed' ? ' s' :
                          fieldName === 'overlayOpacity' ? '%' : '';
            $(this).next('span').text(value + suffix);
            
            updateConfig(fieldName, parseInt(value));
        });
        
        // Collection change button
        $('.form-group button[data-i18n="change"]').eq(0).off('click.featuredCollection').on('click.featuredCollection', function() {
            console.log('[FEATURED COLLECTION] Collection change button clicked');
            window.WebsiteBuilderModules.FeaturedCollection.openCollectionSelector();
        });
        
        // Products change button
        $('.form-group button[data-i18n="change"]').eq(1).off('click.featuredCollection').on('click.featuredCollection', function() {
            console.log('[FEATURED COLLECTION] Products change button clicked');
            window.WebsiteBuilderModules.FeaturedCollection.openProductsSelector();
        });
    },
    
    // Abrir selector de colección
    openCollectionSelector: function() {
        console.log('[FEATURED COLLECTION] Opening collection selector');
        
        // Cargar colecciones seleccionadas actualmente
        const sectionId = window.currentFeaturedCollectionId || 'featured-collection-' + Date.now();
        const currentConfig = window.currentSectionsConfig.featuredCollections?.[sectionId]?.config;
        
        // Inicializar colecciones seleccionadas
        window.WebsiteBuilderModules.FeaturedCollection.selectedCollections = [];
        
        // Si hay colecciones guardadas, cargarlas
        if (currentConfig) {
            if (currentConfig.collections && currentConfig.collectionNames) {
                // Formato nuevo con múltiples colecciones
                currentConfig.collections.forEach((id, index) => {
                    window.WebsiteBuilderModules.FeaturedCollection.selectedCollections.push({
                        id: id,
                        title: currentConfig.collectionNames[index] || 'Collection'
                    });
                });
            } else if (currentConfig.collection && currentConfig.collectionName) {
                // Formato antiguo con una sola colección
                window.WebsiteBuilderModules.FeaturedCollection.selectedCollections.push({
                    id: currentConfig.collection,
                    title: currentConfig.collectionName
                });
            }
        }
        
        // Renderizar la vista de selección en el mismo panel
        this.renderCollectionSelectorView();
    },
    
    // Renderizar vista de selección de colecciones
    renderCollectionSelectorView: function() {
        const selectedCount = this.selectedCollections.length;
        
        const html = `
            <div style="display: flex; flex-direction: column; height: 100%; position: relative; overflow: hidden;">
                <!-- Header estándar -->
                <div class="sidebar-view-header" style="position: relative; z-index: 10;">
                    <button class="back-to-featured-collection-config">
                        <i class="material-icons">arrow_back</i>
                    </button>
                    <h3 data-i18n="featuredCollection.selectCollections">Seleccionar colecciones</h3>
                </div>
                
                <!-- Contenido con scroll -->
                <div style="padding: 20px; overflow-y: auto; overflow-x: hidden; flex: 1; height: calc(100% - 60px); box-sizing: border-box;">
                    <!-- Search -->
                    <div class="form-group">
                        <div style="position: relative;">
                            <i class="material-icons" style="position: absolute; left: 12px; top: 50%; transform: translateY(-50%); color: #6d7175; font-size: 20px;">search</i>
                            <input type="text" id="collection-search-inline" 
                                   placeholder="Buscar colecciones" 
                                   data-i18n-placeholder="featuredCollection.searchCollections"
                                   style="width: 100%; padding: 8px 12px 8px 40px; border: 1px solid #e0e0e0; border-radius: 4px; font-size: 14px;">
                        </div>
                        <div style="margin-top: 8px; font-size: 13px; color: #6d7175;">
                            <span data-i18n="featuredCollection.selectUpTo50">Seleccionar hasta 50 colecciones</span>
                        </div>
                    </div>
                    
                    <!-- Results -->
                    <div class="form-group" style="margin-top: 20px;">
                        <div id="collection-results-inline" style="background: #f7f7f7; border-radius: 4px; padding: 8px;">
                            <!-- Los resultados se cargarán aquí -->
                        </div>
                    </div>
                    
                    <!-- Selected section -->
                    <div class="form-group" style="margin-top: 20px; background: #f7f7f7; border-radius: 4px; padding: 16px;">
                        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 12px;">
                            <span style="font-size: 14px; color: #202223; font-weight: 500;" data-i18n="featuredCollection.selected">Seleccionado</span>
                            <span id="collection-counter-inline" style="font-size: 14px; color: #6d7175;">${selectedCount}/50</span>
                        </div>
                        <div id="selected-collections-inline" style="max-height: 200px; overflow-y: auto;">
                            ${this.renderSelectedCollectionsInline()}
                        </div>
                    </div>
                    
                    <!-- Footer buttons -->
                    <div class="form-group" style="margin-top: 20px; display: flex; gap: 12px; justify-content: flex-end;">
                        <button class="cancel-collection-selection" style="padding: 8px 16px; background: white; border: 1px solid #c9cccf; border-radius: 4px; cursor: pointer; color: #202223; font-weight: 500; font-size: 14px;" data-i18n="common.cancel">Cancelar</button>
                        <button class="save-collection-selection" style="padding: 8px 16px; background-color: var(--primary); color: white; border: none; border-radius: 4px; cursor: pointer; font-weight: 500; font-size: 14px;" data-i18n="common.select">Seleccionar</button>
                    </div>
                </div>
            </div>
        `;
        
        $('#sidebar-dynamic-content').html(html);
        
        // Aplicar traducciones
        setTimeout(applyTranslations, 0);
        
        // Event listeners
        $('.back-to-featured-collection-config').off('click.collectionSelector').on('click.collectionSelector', () => {
            const sectionId = window.currentFeaturedCollectionId || 'featured-collection-' + Date.now();
            const sectionData = window.currentSectionsConfig.featuredCollections?.[sectionId] || { config: {} };
            this.renderConfigView(sectionData);
        });
        
        $('.cancel-collection-selection').off('click.collectionSelector').on('click.collectionSelector', () => {
            const sectionId = window.currentFeaturedCollectionId || 'featured-collection-' + Date.now();
            const sectionData = window.currentSectionsConfig.featuredCollections?.[sectionId] || { config: {} };
            this.renderConfigView(sectionData);
        });
        
        $('.save-collection-selection').off('click.collectionSelector').on('click.collectionSelector', () => {
            this.saveSelectedCollection();
        });
        
        // Search con debounce
        let searchTimeout;
        $('#collection-search-inline').off('input.collectionSelector').on('input.collectionSelector', function() {
            clearTimeout(searchTimeout);
            const query = $(this).val();
            
            searchTimeout = setTimeout(() => {
                window.WebsiteBuilderModules.FeaturedCollection.searchCollectionsInline(query);
            }, 300);
        }).focus();
        
        // Cargar colecciones iniciales
        this.searchCollectionsInline('');
    },
    
    // Renderizar colecciones seleccionadas inline
    renderSelectedCollectionsInline: function() {
        if (this.selectedCollections.length === 0) {
            return '<div style="text-align: center; padding: 20px; color: #6d7175; font-size: 13px;">No hay colecciones seleccionadas</div>';
        }
        
        return this.selectedCollections.map(collection => `
            <div class="selected-collection-item" data-collection-id="${collection.id}" 
                 style="display: flex; align-items: center; padding: 8px 12px; background: white; border: 1px solid #e0e0e0; border-radius: 4px; margin-bottom: 8px;">
                ${collection.imageUrl ? `
                    <img src="${collection.imageUrl}" style="width: 32px; height: 32px; object-fit: cover; border-radius: 4px; margin-right: 12px;">
                ` : `
                    <div style="width: 32px; height: 32px; background: #f0f0f0; border-radius: 4px; margin-right: 12px; display: flex; align-items: center; justify-content: center;">
                        <i class="material-icons" style="font-size: 18px; color: #999;">image</i>
                    </div>
                `}
                <span style="flex: 1; font-size: 14px; color: #202223;">${collection.title}</span>
                <button class="remove-selected-collection" data-collection-id="${collection.id}" 
                        style="background: none; border: none; padding: 4px; cursor: pointer; color: #6d7175;">
                    <i class="material-icons" style="font-size: 20px;">close</i>
                </button>
            </div>
        `).join('');
    },
    
    // Cancelar selección de colecciones
    cancelCollectionSelection: function() {
        // Volver a la vista de configuración
        const sectionId = window.currentFeaturedCollectionId || 'featured-collection-' + Date.now();
        const sectionData = window.currentSectionsConfig.featuredCollections?.[sectionId] || { config: {} };
        this.renderConfigView(sectionData);
    },
    
    // Buscar colecciones inline
    searchCollectionsInline: function(query) {
        console.log('[FEATURED COLLECTION] Searching collections inline:', query);
        
        $('#collection-results-inline').html(`
            <div style="text-align: center; padding: 40px;">
                <div class="spinner-border" role="status">
                    <span class="sr-only">Loading...</span>
                </div>
            </div>
        `);
        
        $.ajax({
            url: '/api/builder/collections/search',
            type: 'GET',
            data: { query: query },
            success: function(response) {
                if (response.success && response.collections) {
                    let html = '';
                    
                    if (response.collections.length === 0) {
                        html = `
                            <div style="text-align: center; padding: 40px; color: #6d7175; font-size: 14px;">
                                <i class="material-icons" style="font-size: 48px; color: #ddd; display: block; margin-bottom: 12px;">folder_open</i>
                                No se encontraron colecciones
                            </div>
                        `;
                    } else {
                        response.collections.forEach(collection => {
                            const isSelected = window.WebsiteBuilderModules.FeaturedCollection.selectedCollections.some(c => c.id === collection.id);
                            html += `
                                <div class="collection-item-inline" data-collection-id="${collection.id}" data-collection='${JSON.stringify(collection)}'
                                     style="padding: 12px 20px; display: flex; align-items: center; cursor: pointer; transition: background 0.1s; ${isSelected ? 'background: #f0f0f0;' : ''}">
                                    <input type="checkbox" ${isSelected ? 'checked' : ''} style="margin-right: 12px; cursor: pointer;">
                                    ${collection.imageUrl ? `
                                        <img src="${collection.imageUrl}" alt="${collection.title}" 
                                             style="width: 40px; height: 40px; object-fit: cover; border-radius: 4px; margin-right: 12px;">
                                    ` : `
                                        <div style="width: 40px; height: 40px; background: #f0f0f0; border-radius: 4px; margin-right: 12px; display: flex; align-items: center; justify-content: center;">
                                            <i class="material-icons" style="font-size: 20px; color: #999;">image</i>
                                        </div>
                                    `}
                                    <div style="flex: 1;">
                                        <div style="font-size: 14px; color: #202223;">${collection.title}</div>
                                        <div style="font-size: 12px; color: #6d7175;">${collection.productCount} productos</div>
                                    </div>
                                </div>
                            `;
                        });
                    }
                    
                    $('#collection-results-inline').html(html);
                    
                    // Click handler para seleccionar colección
                    $('.collection-item-inline').on('click', function(e) {
                        const $checkbox = $(this).find('input[type="checkbox"]');
                        const collection = JSON.parse($(this).attr('data-collection'));
                        
                        // Si clickearon el checkbox directamente, no hacer nada aquí
                        if (e.target.type === 'checkbox') {
                            window.WebsiteBuilderModules.FeaturedCollection.toggleCollectionSelectionInline(collection, $checkbox.is(':checked'));
                            return;
                        }
                        
                        // Toggle checkbox
                        $checkbox.prop('checked', !$checkbox.prop('checked'));
                        window.WebsiteBuilderModules.FeaturedCollection.toggleCollectionSelectionInline(collection, $checkbox.prop('checked'));
                    });
                    
                    // Hover effect
                    $('.collection-item-inline').hover(
                        function() { 
                            if (!$(this).find('input[type="checkbox"]').is(':checked')) {
                                $(this).css('background-color', '#f7f7f7'); 
                            }
                        },
                        function() { 
                            if (!$(this).find('input[type="checkbox"]').is(':checked')) {
                                $(this).css('background-color', 'transparent'); 
                            }
                        }
                    );
                }
            },
            error: function() {
                $('#collection-results-inline').html(`
                    <div style="text-align: center; padding: 40px; color: #dc3545;">
                        <i class="material-icons" style="font-size: 48px;">error</i>
                        <p>Error al cargar colecciones</p>
                    </div>
                `);
            }
        });
    },
    
    // Toggle collection selection inline
    toggleCollectionSelectionInline: function(collection, isSelected) {
        console.log('[FEATURED COLLECTION] Toggling collection inline:', collection, isSelected);
        
        if (isSelected) {
            // Agregar si no está
            if (!this.selectedCollections.some(c => c.id === collection.id)) {
                // Límite de 50 colecciones
                if (this.selectedCollections.length >= 50) {
                    alert('Puedes seleccionar hasta 50 colecciones');
                    $(`.collection-item-inline[data-collection-id="${collection.id}"] input[type="checkbox"]`).prop('checked', false);
                    return;
                }
                this.selectedCollections.push(collection);
            }
        } else {
            // Remover
            this.selectedCollections = this.selectedCollections.filter(c => c.id !== collection.id);
        }
        
        // Actualizar UI
        this.updateSelectedCollectionsInline();
        
        // Actualizar background del item
        $(`.collection-item-inline[data-collection-id="${collection.id}"]`).css(
            'background-color', isSelected ? '#f0f0f0' : 'transparent'
        );
    },
    
    // Actualizar display de colecciones seleccionadas inline
    updateSelectedCollectionsInline: function() {
        const $container = $('#selected-collections-inline');
        const selectedCount = this.selectedCollections.length;
        
        // Actualizar contador
        $('#collection-counter-inline').text(`${selectedCount}/50`);
        
        // Actualizar lista
        $container.html(this.renderSelectedCollectionsInline());
        
        // Re-attach event handlers para remove
        $('.remove-selected-collection').on('click', function(e) {
            e.stopPropagation();
            const collectionId = $(this).data('collection-id');
            
            // Remover de la lista
            window.WebsiteBuilderModules.FeaturedCollection.selectedCollections = 
                window.WebsiteBuilderModules.FeaturedCollection.selectedCollections.filter(c => c.id !== collectionId);
            
            // Desmarcar checkbox
            $(`.collection-item-inline[data-collection-id="${collectionId}"] input[type="checkbox"]`).prop('checked', false);
            $(`.collection-item-inline[data-collection-id="${collectionId}"]`).css('background-color', 'transparent');
            
            // Actualizar UI
            window.WebsiteBuilderModules.FeaturedCollection.updateSelectedCollectionsInline();
        });
    },
    
    // Guardar colecciones seleccionadas
    saveSelectedCollection: function() {
        console.log('[FEATURED COLLECTION] Saving selected collections:', this.selectedCollections);
        
        const sectionId = window.currentFeaturedCollectionId || 'featured-collection-' + Date.now();
        
        // Actualizar configuración
        if (!window.currentSectionsConfig.featuredCollections) {
            window.currentSectionsConfig.featuredCollections = {};
        }
        if (!window.currentSectionsConfig.featuredCollections[sectionId]) {
            window.currentSectionsConfig.featuredCollections[sectionId] = { config: {} };
        }
        
        if (this.selectedCollections.length > 0) {
            // Guardar IDs y nombres de colecciones
            window.currentSectionsConfig.featuredCollections[sectionId].config.collections = 
                this.selectedCollections.map(c => c.id);
            window.currentSectionsConfig.featuredCollections[sectionId].config.collectionNames = 
                this.selectedCollections.map(c => c.title);
            
            // Por compatibilidad, mantener el primer elemento como collection singular
            window.currentSectionsConfig.featuredCollections[sectionId].config.collection = this.selectedCollections[0].id;
            window.currentSectionsConfig.featuredCollections[sectionId].config.collectionName = this.selectedCollections[0].title;
        } else {
            // Limpiar selección
            delete window.currentSectionsConfig.featuredCollections[sectionId].config.collections;
            delete window.currentSectionsConfig.featuredCollections[sectionId].config.collectionNames;
            delete window.currentSectionsConfig.featuredCollections[sectionId].config.collection;
            delete window.currentSectionsConfig.featuredCollections[sectionId].config.collectionName;
        }
        
        // Marcar como cambios pendientes
        if (typeof window.setHasPendingPageStructureChanges === 'function') {
            window.setHasPendingPageStructureChanges(true);
        }
        if (typeof window.updateSaveButtonState === 'function') {
            window.updateSaveButtonState();
        }
        if (typeof window.renderPreview === 'function') {
            window.renderPreview();
        }
        
        // Volver a la vista de configuración
        const sectionData = window.currentSectionsConfig.featuredCollections[sectionId] || { config: {} };
        this.renderConfigView(sectionData);
    },
    
    // Abrir selector de productos
    openProductsSelector: function() {
        console.log('[FEATURED COLLECTION] Opening products selector');
        
        // Cargar productos seleccionados actualmente
        const sectionId = window.currentFeaturedCollectionId || 'featured-collection-' + Date.now();
        const currentConfig = window.currentSectionsConfig.featuredCollections?.[sectionId]?.config;
        
        // Inicializar productos seleccionados
        window.WebsiteBuilderModules.FeaturedCollection.selectedProducts = [];
        
        // Si hay productos guardados, cargarlos
        if (currentConfig && currentConfig.products) {
            // Por ahora solo guardamos los IDs con nombres placeholder
            currentConfig.products.forEach((id, index) => {
                window.WebsiteBuilderModules.FeaturedCollection.selectedProducts.push({
                    id: id,
                    title: currentConfig.productNames ? currentConfig.productNames[index] : `Product ${id}`,
                    imageUrl: currentConfig.productImages ? currentConfig.productImages[index] : null
                });
            });
        }
        
        // Renderizar la vista de selección en el mismo panel
        this.renderProductSelectorView();
    },
    
    // Renderizar vista de selección de productos
    renderProductSelectorView: function() {
        const selectedCount = this.selectedProducts.length;
        
        const html = `
            <div style="display: flex; flex-direction: column; height: 100%; position: relative; overflow: hidden;">
                <!-- Header estándar -->
                <div class="sidebar-view-header" style="position: relative; z-index: 10;">
                    <button class="back-to-featured-collection-config">
                        <i class="material-icons">arrow_back</i>
                    </button>
                    <h3 data-i18n="featuredCollection.selectProducts">Seleccionar productos</h3>
                </div>
                
                <!-- Contenido con scroll -->
                <div style="padding: 20px; overflow-y: auto; overflow-x: hidden; flex: 1; height: calc(100% - 60px); box-sizing: border-box;">
                    <!-- Search -->
                    <div class="form-group">
                        <div style="position: relative;">
                            <i class="material-icons" style="position: absolute; left: 12px; top: 50%; transform: translateY(-50%); color: #6d7175; font-size: 20px;">search</i>
                            <input type="text" id="product-search-inline" 
                                   placeholder="Buscar productos" 
                                   data-i18n-placeholder="featuredCollection.searchProducts"
                                   style="width: 100%; padding: 8px 12px 8px 40px; border: 1px solid #e0e0e0; border-radius: 4px; font-size: 14px;">
                        </div>
                        <div style="margin-top: 8px; font-size: 13px; color: #6d7175;">
                            <span data-i18n="featuredCollection.selectUpTo50Products">Seleccionar hasta 50 productos</span>
                        </div>
                    </div>
                    
                    <!-- Results -->
                    <div class="form-group" style="margin-top: 20px;">
                        <div id="product-results-inline" style="background: #f7f7f7; border-radius: 4px; padding: 8px;">
                            <!-- Los resultados se cargarán aquí -->
                        </div>
                    </div>
                    
                    <!-- Selected section -->
                    <div class="form-group" style="margin-top: 20px; background: #f7f7f7; border-radius: 4px; padding: 16px;">
                        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 12px;">
                            <span style="font-size: 14px; color: #202223; font-weight: 500;" data-i18n="featuredCollection.selected">Seleccionado</span>
                            <span id="product-counter-inline" style="font-size: 14px; color: #6d7175;">${selectedCount}/50</span>
                        </div>
                        <div id="selected-products-inline" style="max-height: 200px; overflow-y: auto;">
                            ${this.renderSelectedProductsInline()}
                        </div>
                    </div>
                    
                    <!-- Footer buttons -->
                    <div class="form-group" style="margin-top: 20px; display: flex; gap: 12px; justify-content: flex-end;">
                        <button class="cancel-product-selection" style="padding: 8px 16px; background: white; border: 1px solid #c9cccf; border-radius: 4px; cursor: pointer; color: #202223; font-weight: 500; font-size: 14px;" data-i18n="common.cancel">Cancelar</button>
                        <button class="save-product-selection" style="padding: 8px 16px; background-color: var(--primary); color: white; border: none; border-radius: 4px; cursor: pointer; font-weight: 500; font-size: 14px;" data-i18n="common.select">Seleccionar</button>
                    </div>
                </div>
            </div>
        `;
        
        $('#sidebar-dynamic-content').html(html);
        
        // Aplicar traducciones y adjuntar event listeners
        setTimeout(applyTranslations, 0);
        this.attachProductSelectorEventListeners();
        
        // Cargar productos iniciales
        this.searchProductsInline('');
    },
    
    // Renderizar productos seleccionados inline
    renderSelectedProductsInline: function() {
        if (this.selectedProducts.length === 0) {
            return '<div style="text-align: center; padding: 20px; color: #6d7175; font-size: 13px;">No hay productos seleccionados</div>';
        }
        
        return this.selectedProducts.map(product => `
            <div class="selected-product-item" data-product-id="${product.id}" 
                 style="display: flex; align-items: center; padding: 8px 12px; background: white; border: 1px solid #e0e0e0; border-radius: 4px; margin-bottom: 8px;">
                ${product.imageUrl ? `
                    <img src="${product.imageUrl}" style="width: 32px; height: 32px; object-fit: cover; border-radius: 4px; margin-right: 12px;">
                ` : `
                    <div style="width: 32px; height: 32px; background: #f0f0f0; border-radius: 4px; margin-right: 12px; display: flex; align-items: center; justify-content: center;">
                        <i class="material-icons" style="font-size: 18px; color: #999;">image</i>
                    </div>
                `}
                <span style="flex: 1; font-size: 14px; color: #202223;">${product.title}</span>
                <button class="remove-selected-product" data-product-id="${product.id}" 
                        style="background: none; border: none; padding: 4px; cursor: pointer; color: #6d7175;">
                    <i class="material-icons" style="font-size: 20px;">close</i>
                </button>
            </div>
        `).join('');
    },
    
    // Adjuntar event listeners para el selector de productos
    attachProductSelectorEventListeners: function() {
        console.log('[FEATURED COLLECTION] Attaching product selector event listeners');
        
        // Back button - volver a la vista de configuración
        $('.back-to-featured-collection-config').off('click.productSelector').on('click.productSelector', () => {
            const sectionId = window.currentFeaturedCollectionId || 'featured-collection-' + Date.now();
            const sectionData = window.currentSectionsConfig.featuredCollections?.[sectionId] || { config: {} };
            this.renderConfigView(sectionData);
        });
        
        // Botón cancelar
        $('.cancel-product-selection').off('click.productSelector').on('click.productSelector', () => {
            const sectionId = window.currentFeaturedCollectionId || 'featured-collection-' + Date.now();
            const sectionData = window.currentSectionsConfig.featuredCollections?.[sectionId] || { config: {} };
            this.renderConfigView(sectionData);
        });
        
        // Botón guardar
        $('.save-product-selection').off('click.productSelector').on('click.productSelector', () => {
            this.saveSelectedProducts();
        });
        
        // Search con debounce
        let searchTimeout;
        $('#product-search-inline').off('input.productSelector').on('input.productSelector', function() {
            clearTimeout(searchTimeout);
            const query = $(this).val();
            
            searchTimeout = setTimeout(() => {
                window.WebsiteBuilderModules.FeaturedCollection.searchProductsInline(query);
            }, 300);
        }).focus();
    },
    
    selectedProducts: [],
    selectedCollections: [],
    
    // Buscar productos
    searchProducts: function(query) {
        console.log('[FEATURED COLLECTION] Searching products:', query);
        
        $('#products-results').html(`
            <div style="text-align: center; padding: 40px;">
                <div class="spinner-border" role="status">
                    <span class="sr-only">Loading...</span>
                </div>
            </div>
        `);
        
        $.ajax({
            url: '/api/builder/products/search',
            type: 'GET',
            data: { query: query },
            success: function(response) {
                if (response.success && response.products) {
                    let html = '';
                    
                    if (response.products.length === 0) {
                        html = `
                            <div style="text-align: center; padding: 40px; color: #666;">
                                <i class="material-icons" style="font-size: 48px; color: #ddd;">inventory_2</i>
                                <p>No products found</p>
                            </div>
                        `;
                    } else {
                        response.products.forEach(product => {
                            const isSelected = window.WebsiteBuilderModules.FeaturedCollection.selectedProducts.some(p => p.id === product.id);
                            
                            html += `
                                <div class="product-item ${isSelected ? 'selected' : ''}" data-product-id="${product.id}" 
                                     style="padding: 15px; border: 1px solid ${isSelected ? '#2962ff' : '#e0e0e0'}; margin-bottom: 10px; border-radius: 4px; cursor: pointer; transition: all 0.2s; background: ${isSelected ? '#f0f7ff' : 'white'};">
                                    <div style="display: flex; align-items: center; gap: 15px;">
                                        ${product.imageUrl ? `
                                            <img src="${product.imageUrl}" alt="${product.title}" 
                                                 style="width: 50px; height: 50px; object-fit: cover; border-radius: 4px;">
                                        ` : `
                                            <div style="width: 50px; height: 50px; background: #f0f0f0; border-radius: 4px; display: flex; align-items: center; justify-content: center;">
                                                <i class="material-icons" style="color: #999;">image</i>
                                            </div>
                                        `}
                                        <div style="flex: 1;">
                                            <div style="font-weight: 500; color: #202223;">${product.title}</div>
                                            <div style="font-size: 12px; color: #666;">
                                                ${product.productType || 'No type'} • ${product.vendor || 'No vendor'}
                                            </div>
                                            <div style="font-size: 14px; color: #202223; margin-top: 4px;">$${product.price.toFixed(2)}</div>
                                        </div>
                                        <i class="material-icons" style="color: ${isSelected ? '#2962ff' : '#999'};">
                                            ${isSelected ? 'check_circle' : 'add_circle_outline'}
                                        </i>
                                    </div>
                                </div>
                            `;
                        });
                    }
                    
                    $('#products-results').html(html);
                    
                    // Click handler para seleccionar/deseleccionar productos
                    $('.product-item').on('click', function() {
                        const productId = $(this).data('product-id');
                        const product = response.products.find(p => p.id === productId);
                        
                        if (product) {
                            window.WebsiteBuilderModules.FeaturedCollection.toggleProductSelection(product, $(this));
                        }
                    });
                    
                    // Hover effect
                    $('.product-item:not(.selected)').hover(
                        function() { $(this).css('background-color', '#f7f7f7'); },
                        function() { $(this).css('background-color', 'white'); }
                    );
                }
            },
            error: function() {
                $('#products-results').html(`
                    <div style="text-align: center; padding: 40px; color: #dc3545;">
                        <i class="material-icons" style="font-size: 48px;">error</i>
                        <p>Error loading products</p>
                    </div>
                `);
            }
        });
    },
    
    // Toggle selección de producto
    toggleProductSelection: function(product, $element) {
        const index = this.selectedProducts.findIndex(p => p.id === product.id);
        
        if (index > -1) {
            // Deseleccionar
            this.selectedProducts.splice(index, 1);
            $element.removeClass('selected')
                    .css({
                        'border-color': '#e0e0e0',
                        'background-color': 'white'
                    })
                    .find('.material-icons').last()
                    .text('add_circle_outline')
                    .css('color', '#999');
        } else {
            // Seleccionar
            this.selectedProducts.push(product);
            $element.addClass('selected')
                    .css({
                        'border-color': '#2962ff',
                        'background-color': '#f0f7ff'
                    })
                    .find('.material-icons').last()
                    .text('check_circle')
                    .css('color', '#2962ff');
        }
        
        // Actualizar lista de seleccionados
        this.updateSelectedProductsList();
    },
    
    // Actualizar lista de productos seleccionados
    updateSelectedProductsList: function() {
        if (this.selectedProducts.length > 0) {
            $('#selected-products').show();
            
            let html = '';
            this.selectedProducts.forEach(product => {
                html += `
                    <div class="selected-product-chip" data-product-id="${product.id}" 
                         style="display: inline-flex; align-items: center; gap: 5px; padding: 5px 10px; background: #e0e0e0; border-radius: 20px;">
                        <span style="font-size: 12px;">${product.title}</span>
                        <i class="material-icons" style="font-size: 16px; cursor: pointer;">close</i>
                    </div>
                `;
            });
            
            $('#selected-products-list').html(html);
            
            // Click handler para remover
            $('.selected-product-chip .material-icons').on('click', function(e) {
                e.stopPropagation();
                const productId = $(this).parent().data('product-id');
                const product = window.WebsiteBuilderModules.FeaturedCollection.selectedProducts.find(p => p.id === productId);
                
                if (product) {
                    // Encontrar el elemento en la lista y hacer click
                    $(`.product-item[data-product-id="${productId}"]`).click();
                }
            });
        } else {
            $('#selected-products').hide();
        }
    },
    
    // Guardar productos seleccionados
    saveSelectedProducts: function() {
        console.log('[FEATURED COLLECTION] Saving selected products:', this.selectedProducts);
        
        const sectionId = window.currentFeaturedCollectionId || 'featured-collection-' + Date.now();
        
        // Actualizar configuración
        if (!window.currentSectionsConfig.featuredCollections) {
            window.currentSectionsConfig.featuredCollections = {};
        }
        if (!window.currentSectionsConfig.featuredCollections[sectionId]) {
            window.currentSectionsConfig.featuredCollections[sectionId] = { config: {} };
        }
        
        window.currentSectionsConfig.featuredCollections[sectionId].config.products = this.selectedProducts.map(p => p.id);
        
        // Actualizar UI
        if (this.selectedProducts.length > 0) {
            const productNames = this.selectedProducts.map(p => p.title).join(', ');
            $('.form-group').eq(9).find('span').eq(1).text(productNames.length > 50 ? productNames.substring(0, 50) + '...' : productNames);
        } else {
            $('.form-group').eq(9).find('span').eq(1).text('No products selected');
        }
        
        // Cerrar modal
        $('#products-selector-modal').fadeOut();
        
        // Marcar como cambios pendientes
        if (typeof window.setHasPendingPageStructureChanges === 'function') {
            window.setHasPendingPageStructureChanges(true);
        }
        if (typeof window.updateSaveButtonState === 'function') {
            window.updateSaveButtonState();
        }
        if (typeof window.renderPreview === 'function') {
            window.renderPreview();
        }
    },
    
    // Buscar productos inline
    searchProductsInline: function(query) {
        console.log('[FEATURED COLLECTION] Searching products inline:', query);
        
        $('#product-results-inline').html(`
            <div style="text-align: center; padding: 40px;">
                <div class="spinner-border" role="status">
                    <span class="sr-only">Loading...</span>
                </div>
            </div>
        `);
        
        $.ajax({
            url: '/api/builder/products/search',
            type: 'GET',
            data: { query: query },
            success: function(response) {
                if (response.success && response.products) {
                    let html = '';
                    
                    if (response.products.length === 0) {
                        html = `
                            <div style="text-align: center; padding: 40px; color: #6d7175; font-size: 14px;">
                                <i class="material-icons" style="font-size: 48px; color: #ddd; display: block; margin-bottom: 12px;">inventory_2</i>
                                No se encontraron productos
                            </div>
                        `;
                    } else {
                        response.products.forEach(product => {
                            const isSelected = window.WebsiteBuilderModules.FeaturedCollection.selectedProducts.some(p => p.id === product.id);
                            html += `
                                <div class="product-item-inline" data-product-id="${product.id}" data-product='${JSON.stringify(product)}'
                                     style="padding: 12px 20px; display: flex; align-items: center; cursor: pointer; transition: background 0.1s; ${isSelected ? 'background: #f0f0f0;' : ''}">
                                    <input type="checkbox" ${isSelected ? 'checked' : ''} style="margin-right: 12px; cursor: pointer;">
                                    ${product.imageUrl ? `
                                        <img src="${product.imageUrl}" alt="${product.title}" 
                                             style="width: 40px; height: 40px; object-fit: cover; border-radius: 4px; margin-right: 12px;">
                                    ` : `
                                        <div style="width: 40px; height: 40px; background: #f0f0f0; border-radius: 4px; margin-right: 12px; display: flex; align-items: center; justify-content: center;">
                                            <i class="material-icons" style="font-size: 20px; color: #999;">image</i>
                                        </div>
                                    `}
                                    <div style="flex: 1;">
                                        <div style="font-size: 14px; color: #202223;">${product.title}</div>
                                        <div style="font-size: 12px; color: #6d7175;">
                                            ${product.vendor ? product.vendor + ' • ' : ''}
                                            $${product.price ? product.price.toFixed(2) : '0.00'}
                                        </div>
                                    </div>
                                </div>
                            `;
                        });
                    }
                    
                    $('#product-results-inline').html(html);
                    
                    // Click handler para seleccionar producto
                    $('.product-item-inline').on('click', function(e) {
                        const $checkbox = $(this).find('input[type="checkbox"]');
                        const product = JSON.parse($(this).attr('data-product'));
                        
                        // Si clickearon el checkbox directamente, no hacer nada aquí
                        if (e.target.type === 'checkbox') {
                            window.WebsiteBuilderModules.FeaturedCollection.toggleProductSelectionInline(product, $checkbox.is(':checked'));
                            return;
                        }
                        
                        // Toggle checkbox
                        $checkbox.prop('checked', !$checkbox.prop('checked'));
                        window.WebsiteBuilderModules.FeaturedCollection.toggleProductSelectionInline(product, $checkbox.prop('checked'));
                    });
                    
                    // Hover effect
                    $('.product-item-inline').hover(
                        function() { 
                            if (!$(this).find('input[type="checkbox"]').is(':checked')) {
                                $(this).css('background-color', '#f7f7f7'); 
                            }
                        },
                        function() { 
                            if (!$(this).find('input[type="checkbox"]').is(':checked')) {
                                $(this).css('background-color', 'transparent'); 
                            }
                        }
                    );
                }
            },
            error: function() {
                $('#product-results-inline').html(`
                    <div style="text-align: center; padding: 40px; color: #dc3545;">
                        <i class="material-icons" style="font-size: 48px;">error</i>
                        <p>Error al cargar productos</p>
                    </div>
                `);
            }
        });
    },
    
    // Toggle product selection inline
    toggleProductSelectionInline: function(product, isSelected) {
        console.log('[FEATURED COLLECTION] Toggling product inline:', product, isSelected);
        
        if (isSelected) {
            // Agregar si no está
            if (!this.selectedProducts.some(p => p.id === product.id)) {
                // Límite de 50 productos
                if (this.selectedProducts.length >= 50) {
                    alert('Puedes seleccionar hasta 50 productos');
                    $(`.product-item-inline[data-product-id="${product.id}"] input[type="checkbox"]`).prop('checked', false);
                    return;
                }
                this.selectedProducts.push(product);
            }
        } else {
            // Remover
            this.selectedProducts = this.selectedProducts.filter(p => p.id !== product.id);
        }
        
        // Actualizar UI
        this.updateSelectedProductsInline();
        
        // Actualizar background del item
        $(`.product-item-inline[data-product-id="${product.id}"]`).css(
            'background-color', isSelected ? '#f0f0f0' : 'transparent'
        );
    },
    
    // Actualizar display de productos seleccionados inline
    updateSelectedProductsInline: function() {
        const $container = $('#selected-products-inline');
        const selectedCount = this.selectedProducts.length;
        
        // Actualizar contador
        $('#product-counter-inline').text(`${selectedCount}/50`);
        
        // Actualizar lista
        $container.html(this.renderSelectedProductsInline());
        
        // Re-attach event handlers para remove
        $('.remove-selected-product').on('click', function(e) {
            e.stopPropagation();
            const productId = $(this).data('product-id');
            
            // Remover de la lista
            window.WebsiteBuilderModules.FeaturedCollection.selectedProducts = 
                window.WebsiteBuilderModules.FeaturedCollection.selectedProducts.filter(p => p.id !== productId);
            
            // Desmarcar checkbox
            $(`.product-item-inline[data-product-id="${productId}"] input[type="checkbox"]`).prop('checked', false);
            $(`.product-item-inline[data-product-id="${productId}"]`).css('background-color', 'transparent');
            
            // Actualizar UI
            window.WebsiteBuilderModules.FeaturedCollection.updateSelectedProductsInline();
        });
    },
    
    // Guardar productos seleccionados
    saveSelectedProducts: function() {
        console.log('[FEATURED COLLECTION] Saving selected products:', this.selectedProducts);
        
        const sectionId = window.currentFeaturedCollectionId || 'featured-collection-' + Date.now();
        
        // Actualizar configuración
        if (!window.currentSectionsConfig.featuredCollections) {
            window.currentSectionsConfig.featuredCollections = {};
        }
        if (!window.currentSectionsConfig.featuredCollections[sectionId]) {
            window.currentSectionsConfig.featuredCollections[sectionId] = { config: {} };
        }
        
        if (this.selectedProducts.length > 0) {
            // Guardar IDs, nombres e imágenes de productos
            window.currentSectionsConfig.featuredCollections[sectionId].config.products = 
                this.selectedProducts.map(p => p.id);
            window.currentSectionsConfig.featuredCollections[sectionId].config.productNames = 
                this.selectedProducts.map(p => p.title);
            window.currentSectionsConfig.featuredCollections[sectionId].config.productImages = 
                this.selectedProducts.map(p => p.imageUrl || null);
        } else {
            // Limpiar selección
            delete window.currentSectionsConfig.featuredCollections[sectionId].config.products;
            delete window.currentSectionsConfig.featuredCollections[sectionId].config.productNames;
            delete window.currentSectionsConfig.featuredCollections[sectionId].config.productImages;
        }
        
        // Marcar como cambios pendientes
        if (typeof window.setHasPendingPageStructureChanges === 'function') {
            window.setHasPendingPageStructureChanges(true);
        }
        if (typeof window.updateSaveButtonState === 'function') {
            window.updateSaveButtonState();
        }
        if (typeof window.renderPreview === 'function') {
            window.renderPreview();
        }
        
        // Volver a la vista de configuración
        const sectionData = window.currentSectionsConfig.featuredCollections[sectionId] || { config: {} };
        this.renderConfigView(sectionData);
    }
};

// Make module globally accessible
console.log('[FEATURED COLLECTION MODULE] Module loaded successfully');