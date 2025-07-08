// Módulo Featured Collection para Website Builder
console.log('[FEATURED COLLECTION MODULE] Loading featured collection module...');
window.WebsiteBuilderModules = window.WebsiteBuilderModules || {};
window.WebsiteBuilderModules.FeaturedCollection = {
    
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
                        <div style="display: flex; align-items: center; padding: 12px; border: 1px solid #e0e0e0; border-radius: 4px; background: #f7f7f7;">
                            <i class="material-icons" style="margin-right: 8px; color: #666;">inventory_2</i>
                            <span style="flex: 1; color: #202223;">${settings.collectionName || 'Restaurantes'}</span>
                            <button style="padding: 6px 12px; background: white; border: 1px solid #e0e0e0; border-radius: 4px; cursor: pointer; color: #202223;" 
                                    data-i18n="change">Cambiar</button>
                        </div>
                    </div>
                    
                    <!-- Products selector -->
                    <div class="form-group" style="margin-top: 20px;">
                        <label style="font-size: 13px; font-weight: 500; margin-bottom: 8px; color: #5c5e60; display: block;" 
                               data-i18n="products">Products</label>
                        <div style="display: flex; align-items: center; padding: 12px; border: 1px solid #e0e0e0; border-radius: 4px; background: #f7f7f7;">
                            <i class="material-icons" style="margin-right: 8px; color: #666;">inventory_2</i>
                            <span style="flex: 1; color: #202223;">${settings.productName || 'Ejecutiva'}</span>
                            <button style="padding: 6px 12px; background: white; border: 1px solid #e0e0e0; border-radius: 4px; cursor: pointer; color: #202223;" 
                                    data-i18n="change">Cambiar</button>
                        </div>
                        <div style="font-size: 12px; color: #666; margin-top: 5px;">
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
        $('.form-group button[data-i18n="change"]').off('click.featuredCollection').on('click.featuredCollection', function() {
            console.log('[FEATURED COLLECTION] Collection change button clicked');
            // TODO: Implement collection selector modal
        });
    }
};

// Make module globally accessible
console.log('[FEATURED COLLECTION MODULE] Module loaded successfully');