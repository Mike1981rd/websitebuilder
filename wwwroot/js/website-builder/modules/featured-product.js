window.WebsiteBuilderModules = window.WebsiteBuilderModules || {};
window.WebsiteBuilderModules.FeaturedProduct = {
    // Helper function to get translated text
    getTranslation: function(key, defaultText) {
        if (window.translations && window.translations[window.currentLanguage]) {
            return window.translations[window.currentLanguage][key] || defaultText;
        }
        return defaultText;
    },
    render: function(config) {
        if (!config || config.isHidden) return '';
        
        const uniqueId = 'featured-product-' + Date.now();
        const schemeColors = getColorSchemeValues(config.colorScheme || 'scheme1');
        
        // Get typography settings
        const headingTypography = currentGlobalThemeSettings?.typography?.heading || {};
        const bodyTypography = currentGlobalThemeSettings?.typography?.body || {};
        
        const headingFont = window.getFontNameFromValueSafe ? 
            window.getFontNameFromValueSafe(headingTypography.font || 'helvetica') : 
            'Helvetica';
        
        const bodyFont = window.getFontNameFromValueSafe ? 
            window.getFontNameFromValueSafe(bodyTypography.font || 'roboto') : 
            'Roboto';
        
        return `
            <style>
                #${uniqueId} {
                    background-color: ${schemeColors.background};
                    color: ${schemeColors.text};
                    padding: 40px 0;
                }
                
                #${uniqueId} .container {
                    padding: 0 20px !important;
                    box-sizing: border-box;
                }
                
                #${uniqueId} .product-container {
                    width: 100%;
                    box-sizing: border-box;
                }
                
                #${uniqueId} .product-images {
                    box-sizing: border-box;
                    display: flex;
                    align-items: flex-start;
                }
                
                #${uniqueId} .product-main-image {
                    flex: 1;
                    min-width: 0;
                }
                
                #${uniqueId} .product-title {
                    font-family: ${headingFont};
                    font-size: 28px;
                    font-weight: ${headingTypography.fontWeight || '600'};
                    color: ${schemeColors.text};
                    margin-bottom: 10px;
                }
                
                #${uniqueId} .product-price {
                    font-family: ${bodyFont};
                    font-size: 24px;
                    color: ${schemeColors.text};
                    margin-bottom: 20px;
                }
                
                #${uniqueId} .product-info {
                    font-family: ${bodyFont};
                    font-size: ${bodyTypography.fontSize || '16px'};
                    color: ${schemeColors.text};
                }
                
                @media (max-width: 768px) {
                    #${uniqueId} {
                        padding: 30px 0 !important;
                    }
                    
                    #${uniqueId} .product-container {
                        flex-direction: column !important;
                    }
                    
                    #${uniqueId} .product-images {
                        flex: 1 1 100% !important;
                        max-width: 100% !important;
                        margin-bottom: 30px;
                    }
                    
                    #${uniqueId} .product-info-section {
                        flex: 1 1 100% !important;
                        max-width: 100% !important;
                    }
                }
            </style>
            
            <div id="${uniqueId}" class="section-wrapper featured-product-section" data-section-id="featured-product" data-block-type="featured-product">
                <div class="section-header-tag">
                    <span class="material-symbols-outlined" style="font-size: 16px;">shopping_bag</span>
                    ${window.translations && window.translations[window.currentLanguage] ? 
                        (window.translations[window.currentLanguage]['sections.featuredProduct'] || 'Featured Product') : 
                        'Featured Product'}
                </div>
                <div class="container" style="${config.width === 'page' ? 'max-width: 100%' : config.width === 'large' ? 'max-width: 1200px' : config.width === 'medium' ? 'max-width: 900px' : 'max-width: 600px'}; margin: 0 auto;">
                    <div class="product-container" style="display: flex; gap: 40px; align-items: flex-start;">
                        <!-- Product Images Section -->
                        <div class="product-images" style="flex: 0 0 40%; max-width: 40%;">
                            ${window.WebsiteBuilderModules.FeaturedProduct.renderProductImages(config)}
                        </div>
                        
                        <!-- Product Info Section -->
                        <div class="product-info-section" style="flex: 0 0 60%; max-width: 60%;">
                            ${window.WebsiteBuilderModules.FeaturedProduct.renderProductInfo(config, schemeColors)}
                        </div>
                    </div>
                </div>
            </div>
        `;
    },
    
    renderProductImages: function(config) {
        const product = config.selectedProduct;
        const desktopLayout = config.desktopLayout || 'thumbnails-left';
        const thumbnailSize = config.desktopThumbnailSize || 88;
        const spaceBetween = config.desktopSpaceBetween || 20;
        
        console.log('[FeaturedProduct] Rendering images for product:', product);
        console.log('[FeaturedProduct] Product images:', product?.images);
        
        // Default images if no product selected
        if (!product || !product.images || product.images.length === 0) {
            return this.renderDefaultImages(desktopLayout, thumbnailSize, spaceBetween);
        }
        
        // Layout styles based on desktop layout setting
        let containerStyle = '';
        let thumbnailsStyle = '';
        let mainImageStyle = '';
        
        switch(desktopLayout) {
            case 'thumbnails-left':
                containerStyle = `display: flex; gap: ${spaceBetween}px;`;
                thumbnailsStyle = `display: flex; flex-direction: column; gap: ${spaceBetween}px;`;
                mainImageStyle = 'flex: 1;';
                break;
            case 'thumbnails-right':
                containerStyle = `display: flex; flex-direction: row-reverse; gap: ${spaceBetween}px;`;
                thumbnailsStyle = `display: flex; flex-direction: column; gap: ${spaceBetween}px;`;
                mainImageStyle = 'flex: 1;';
                break;
            case 'thumbnails-bottom':
                containerStyle = `display: flex; flex-direction: column-reverse; gap: ${spaceBetween}px;`;
                // Check if we're in editor preview (iframe) or real preview
                const isEditorPreview = typeof window !== 'undefined' && window.parent !== window;
                const paddingLeft = isEditorPreview ? 'padding-left: 50%;' : '';
                thumbnailsStyle = `display: flex; gap: ${spaceBetween}px; justify-content: center; ${paddingLeft}`;
                mainImageStyle = '';
                break;
            default:
                // Stack layouts
                return this.renderStackedImages(product.images, desktopLayout, config.imageRatio);
        }
        
        // Images are already sorted by Position from the API, so [0] is the first image
        const mainImage = product.images[0];
        console.log('[FeaturedProduct] Main image selected:', mainImage);
        console.log('[FeaturedProduct] Image positions:', product.images.map(img => ({ url: img.url, position: img.position })));
        
        // For thumbnails-bottom layout, add navigation arrows if needed
        const needsArrows = desktopLayout === 'thumbnails-bottom' && product.images.length > 4;
        const uniqueId = 'featured-product-' + Date.now();
        
        return `
            <div style="${containerStyle}">
                <!-- Thumbnails -->
                ${product.images.length > 1 ? `
                    ${desktopLayout === 'thumbnails-bottom' ? `
                        <div class="product-thumbnails" style="${thumbnailsStyle}">
                            ${product.images.map((img, index) => `
                                <div class="product-thumbnail ${index === 0 ? 'active' : ''}" data-image-index="${index}" style="width: ${thumbnailSize}px; height: ${thumbnailSize}px; min-width: ${thumbnailSize}px; flex-shrink: 0; border-radius: 8px; overflow: hidden; cursor: pointer; box-shadow: 0 2px 4px rgba(0,0,0,0.1); ${index === 0 ? 'border: 2px solid var(--primary);' : 'border: 2px solid transparent;'} transition: border-color 0.2s;">
                                    <img src="${img.url}" alt="${img.altText || product.name}" style="width: 100%; height: 100%; object-fit: cover;">
                                </div>
                            `).join('')}
                        </div>
                    ` : `
                        <div class="product-thumbnails" style="${thumbnailsStyle}">
                            ${product.images.map((img, index) => `
                                <div class="product-thumbnail ${index === 0 ? 'active' : ''}" data-image-index="${index}" style="width: ${thumbnailSize}px; height: ${thumbnailSize}px; flex-shrink: 0; border-radius: 8px; overflow: hidden; cursor: pointer; box-shadow: 0 2px 4px rgba(0,0,0,0.1); ${index === 0 ? 'border: 2px solid var(--primary);' : 'border: 2px solid transparent;'} transition: border-color 0.2s;">
                                    <img src="${img.url}" alt="${img.altText || product.name}" style="width: 100%; height: 100%; object-fit: cover;">
                                </div>
                            `).join('')}
                        </div>
                    `}
                ` : ''}
                
                <!-- Main Image -->
                <div class="product-main-image" style="${mainImageStyle}">
                    <div style="border-radius: 8px; overflow: hidden; ${this.getImageRatioStyle(config.imageRatio)}">
                        <img class="main-product-image" data-product-images='${JSON.stringify(product.images)}' src="${mainImage.url}" alt="${mainImage.altText || product.name}" style="width: 100%; height: 100%; ${this.getImageFitStyle(config.imageRatio)}">
                    </div>
                </div>
            </div>
        `;
    },
    
    renderDefaultImages: function(layout, thumbnailSize, spaceBetween) {
        // Default placeholder when no product selected
        let containerStyle = '';
        let thumbnailsStyle = '';
        
        switch(layout) {
            case 'thumbnails-left':
                containerStyle = `display: flex; gap: ${spaceBetween}px;`;
                thumbnailsStyle = `display: flex; flex-direction: column; gap: ${spaceBetween}px;`;
                break;
            case 'thumbnails-right':
                containerStyle = `display: flex; flex-direction: row-reverse; gap: ${spaceBetween}px;`;
                thumbnailsStyle = `display: flex; flex-direction: column; gap: ${spaceBetween}px;`;
                break;
            case 'thumbnails-bottom':
                containerStyle = `display: flex; flex-direction: column-reverse; gap: ${spaceBetween}px;`;
                thumbnailsStyle = `display: flex; gap: ${spaceBetween}px; justify-content: center;`;
                break;
        }
        
        return `
            <div style="${containerStyle}">
                <div class="product-thumbnails" style="${thumbnailsStyle}">
                    ${[1, 2, 3, 4].map(() => `
                        <div style="width: ${thumbnailSize}px; height: ${thumbnailSize}px; background: #d4a574; border-radius: 8px; display: flex; align-items: center; justify-content: center;">
                            <i class="material-icons" style="font-size: 24px; color: #fff;">image</i>
                        </div>
                    `).join('')}
                </div>
                <div class="product-main-image" style="flex: 1; background: #d4a574; border-radius: 8px; aspect-ratio: 1; display: flex; align-items: center; justify-content: center;">
                    <i class="material-icons" style="font-size: 64px; color: #fff;">image</i>
                </div>
            </div>
        `;
    },
    
    renderStackedImages: function(images, layout, imageRatio) {
        // For stack layouts (1 column, 2 column, etc.)
        // TODO: Implement stacked layouts
        return this.renderDefaultImages('thumbnails-left', 88, 20);
    },
    
    getImageRatioStyle: function(ratio) {
        switch(ratio) {
            case 'square-1-1-fill':
            case 'square-1-1-fit':
                return 'aspect-ratio: 1/1;';
            case 'portrait-3-4-fill':
            case 'portrait-3-4-fit':
                return 'aspect-ratio: 3/4;';
            case 'portrait-large-2-3-fill':
            case 'portrait-large-2-3-fit':
                return 'aspect-ratio: 2/3;';
            case 'landscape-4-3-fill':
            case 'landscape-4-3-fit':
                return 'aspect-ratio: 4/3;';
            default:
                return '';
        }
    },
    
    getImageFitStyle: function(ratio) {
        if (ratio && ratio.includes('-fit')) {
            return 'object-fit: contain;';
        }
        return 'object-fit: cover;';
    },
    
    renderProductInfo: function(config, schemeColors) {
        const product = config.selectedProduct;
        
        console.log('[FEATURED PRODUCT INFO] Config:', config);
        console.log('[FEATURED PRODUCT INFO] Selected product:', product);
        
        if (!config.blocks || !config.blockOrder) {
            console.log('[FEATURED PRODUCT INFO] No blocks or blockOrder');
            return '';
        }
        
        console.log('[FEATURED PRODUCT INFO] Block order:', config.blockOrder);
        console.log('[FEATURED PRODUCT INFO] Blocks:', config.blocks);
        
        let html = '';
        
        // Render blocks in order
        config.blockOrder.forEach(blockId => {
            const block = config.blocks[blockId];
            console.log('[FEATURED PRODUCT INFO] Processing block:', blockId, block);
            if (!block || block.isHidden) {
                console.log('[FEATURED PRODUCT INFO] Block hidden or not found:', blockId);
                return;
            }
            
            switch(block.type) {
                case 'vendor':
                    html += `<div class="product-vendor" style="font-size: 14px; color: ${schemeColors.text}; opacity: 0.7; margin-bottom: 5px;">${product?.vendor || 'Proveedor'}</div>`;
                    break;
                    
                case 'title':
                    html += `<h1 class="product-title">${product?.name || 'Nombre del producto'}</h1>`;
                    break;
                    
                case 'price':
                    const price = product?.price || 0;
                    const comparePrice = product?.compareAtPrice;
                    html += `
                        <div style="margin-bottom: 20px;">
                            ${comparePrice && comparePrice > price ? `
                                <span style="text-decoration: line-through; color: ${schemeColors.text}; opacity: 0.6; margin-right: 10px;">$${comparePrice.toFixed(2)}</span>
                            ` : ''}
                            <span class="product-price">$${price.toFixed(2)}</span>
                        </div>
                        <div style="font-size: 14px; color: ${schemeColors.text}; opacity: 0.7; margin-bottom: 20px;">
                            Los impuestos y gastos de envío se calculan en la pantalla de pago
                        </div>
                    `;
                    break;
                    
                case 'sku':
                    const sku = product?.variants?.[0]?.sku || '21623612';
                    html += `<div style="margin-bottom: 15px; font-size: 14px;">SKU: ${sku}</div>`;
                    break;
                    
                case 'variant-picker':
                    if (product?.variants && product.variants.length > 0) {
                        // Group variants by options
                        const options = this.groupVariantOptions(product.variants);
                        
                        Object.keys(options).forEach(optionName => {
                            if (options[optionName].length > 0) {
                                html += `
                                    <div style="margin-bottom: 20px;">
                                        <label style="display: block; margin-bottom: 8px; font-weight: 500;">${optionName}</label>
                                        <select style="width: 100%; padding: 10px; border: 1px solid ${schemeColors.border}; border-radius: 4px; background: white;">
                                            ${options[optionName].map(value => `<option>${value}</option>`).join('')}
                                        </select>
                                    </div>
                                `;
                            }
                        });
                    } else {
                        html += `
                            <div style="margin-bottom: 20px;">
                                <label style="display: block; margin-bottom: 8px; font-weight: 500;">Size</label>
                                <select style="width: 100%; padding: 10px; border: 1px solid ${schemeColors.border}; border-radius: 4px; background: white;">
                                    <option>Small</option>
                                    <option>Medium</option>
                                    <option>Large</option>
                                </select>
                            </div>
                        `;
                    }
                    break;
                    
                case 'inventory-status':
                    html += `
                        <div style="margin-bottom: 20px; padding: 10px; background: #f0f0f0; border-radius: 4px; display: inline-flex; align-items: center; gap: 8px;">
                            <span style="width: 8px; height: 8px; background: #dc3545; border-radius: 50%;"></span>
                            <span>Agotado</span>
                        </div>
                    `;
                    break;
                    
                case 'quantity-selector':
                    html += `
                        <div style="margin-bottom: 20px;">
                            <label style="display: block; margin-bottom: 8px; font-weight: 500;">Quantity</label>
                            <div style="display: flex; align-items: center; gap: 10px;">
                                <button style="width: 40px; height: 40px; border: 1px solid ${schemeColors.border}; background: white; cursor: pointer;">-</button>
                                <input type="number" value="1" min="1" style="width: 60px; text-align: center; border: 1px solid ${schemeColors.border}; padding: 8px;">
                                <button style="width: 40px; height: 40px; border: 1px solid ${schemeColors.border}; background: white; cursor: pointer;">+</button>
                            </div>
                        </div>
                    `;
                    break;
                    
                case 'buy-buttons':
                    html += `
                        <div style="margin-bottom: 20px;">
                            <button style="width: 100%; padding: 15px; background: var(--primary); color: white; border: none; border-radius: 4px; font-size: 16px; font-weight: 500; cursor: pointer; margin-bottom: 10px;">
                                Add to cart
                            </button>
                            <button style="width: 100%; padding: 15px; background: #333; color: white; border: none; border-radius: 4px; font-size: 16px; font-weight: 500; cursor: pointer;">
                                Buy it now
                            </button>
                        </div>
                    `;
                    break;
                    
                case 'description':
                    // Debug: Let's see what we have
                    console.log('[DEBUG] Description block - product object:', product);
                    
                    // Get description from product, check multiple possible fields
                    let description = '';
                    if (product) {
                        // Check both lowercase and uppercase as the API returns 'Description' with capital D
                        description = product.Description || product.description || product.content || product.body || '';
                        console.log('[DEBUG] Found description:', description);
                        console.log('[DEBUG] Product keys:', Object.keys(product));
                    } else {
                        console.log('[DEBUG] No product object found!');
                    }
                    
                    // If still no description, use default
                    if (!description || description.trim() === '') {
                        console.log('[DEBUG] Using default description');
                        description = 'Product description goes here. This is where you can add detailed information about your product.';
                    }
                    
                    const descConfig = block;
                    const descType = descConfig.type || 'static';
                    const descHeading = descConfig.heading || 'Description';
                    
                    
                    // Check if we're in the editor iframe
                    const isEditorContext = typeof window !== 'undefined' && window.parent !== window && window.parent.switchSidebarView;
                    
                    // Generate unique ID for this description block
                    const descId = 'desc-' + Date.now() + '-' + Math.random().toString(36).substr(2, 9);
                    
                    if (descType === 'static') {
                        // Static type - just show the content
                        html += `
                            <div style="margin-top: 30px; padding-top: 30px; border-top: 1px solid ${schemeColors.border}; position: relative;">
                                ${isEditorContext ? `
                                    <button onclick="window.parent.switchSidebarView('descriptionSettings', window.parent.currentSectionsConfig?.featuredProduct?.blocks?.description)" 
                                            style="position: absolute; right: 0; top: 30px; background: #2962ff; color: white; border: none; padding: 5px 10px; border-radius: 4px; cursor: pointer; font-size: 12px;">
                                        Configure
                                    </button>
                                ` : ''}
                                <h3 style="margin-bottom: 15px; font-size: 18px; font-weight: 500;">${descHeading}</h3>
                                <p style="line-height: 1.6; color: ${schemeColors.text};">${description}</p>
                            </div>
                        `;
                    } else {
                        // Tab types (expanded or collapsed)
                        const isExpanded = descType === 'expanded-tab';
                        const iconName = descConfig.icon && descConfig.icon !== 'none' ? descConfig.icon : null;
                        const customIcon = descConfig.customIcon;
                        
                        html += `
                            <div style="margin-top: 30px; padding-top: 30px; border-top: 1px solid ${schemeColors.border}; position: relative;">
                                ${isEditorContext ? `
                                    <button onclick="window.parent.switchSidebarView('descriptionSettings', window.parent.currentSectionsConfig?.featuredProduct?.blocks?.description)" 
                                            style="position: absolute; right: 0; top: 30px; background: #2962ff; color: white; border: none; padding: 5px 10px; border-radius: 4px; cursor: pointer; font-size: 12px; z-index: 10;">
                                        Configure
                                    </button>
                                ` : ''}
                                <div class="description-tab" id="${descId}-tab" style="cursor: pointer; display: flex; align-items: center; justify-content: space-between; padding: 15px 0; border-bottom: 1px solid ${schemeColors.border};" 
                                     data-expanded="${isExpanded ? 'true' : 'false'}">
                                    <div style="display: flex; align-items: center; gap: 10px;">
                                        ${iconName ? `<i class="material-icons" style="font-size: 20px; color: ${schemeColors.text};">${iconName}</i>` : ''}
                                        ${customIcon ? `<img src="${customIcon}" alt="${descHeading}" style="width: 20px; height: 20px; object-fit: contain;">` : ''}
                                        <h3 style="margin: 0; font-size: 18px; font-weight: 500; color: ${schemeColors.text};">${descHeading}</h3>
                                    </div>
                                    <i class="material-icons expand-icon" id="${descId}-icon" style="font-size: 24px; color: ${schemeColors.text}; transition: transform 0.3s ease;">${isExpanded ? 'expand_less' : 'expand_more'}</i>
                                </div>
                                <div class="description-content" id="${descId}-content" style="display: ${isExpanded ? 'block' : 'none'}; padding: 20px 0; transition: all 0.3s ease;">
                                    <p style="line-height: 1.6; color: ${schemeColors.text};">${description}</p>
                                </div>
                            </div>
                        `;
                    }
                    break;
                    
                case 'share':
                    html += `
                        <div style="margin-top: 20px;">
                            <span style="font-weight: 500; margin-right: 10px;">Share:</span>
                            <a href="#" style="color: ${schemeColors.link}; margin-right: 10px;">Facebook</a>
                            <a href="#" style="color: ${schemeColors.link}; margin-right: 10px;">Twitter</a>
                            <a href="#" style="color: ${schemeColors.link};">Pinterest</a>
                        </div>
                    `;
                    break;
            }
        });
        
        return html;
    },
    
    renderSettings: function(config) {
        const configData = config || {};
        
        // Default values
        const defaults = {
            colorScheme: 'scheme1',
            width: 'large',
            selectedProductId: null,
            selectedProduct: null,
            desktopLayout: 'thumbnails-left',
            desktopSpaceBetween: 12,
            desktopThumbnailSize: 72,
            mobileLayout: 'thumbnails-right',
            imageRatio: 'portrait-3-4-fill',
            showOnlySelectedVariant: false,
            enableImageZoom: true,
            enableVideoLooping: false,
            enableVideoAutoplay: false,
            scaleVideo: true,
            addSidePaddings: false,
            topPadding: 48,
            bottomPadding: 96
        };
        
        // Merge with defaults
        Object.keys(defaults).forEach(key => {
            if (configData[key] === undefined) {
                configData[key] = defaults[key];
            }
        });
        
        return `
            <div style="display: flex; flex-direction: column; height: 100%; position: relative; overflow: hidden;">
                <div class="sidebar-view-header" style="position: relative; z-index: 10;">
                    <button class="back-to-sections-btn">
                        <i class="material-icons">arrow_back</i>
                    </button>
                    <h3 data-i18n="featuredProduct.settings.title">Featured product</h3>
                </div>
                
                <div style="padding: 20px; overflow-y: auto; overflow-x: hidden; flex: 1; height: calc(100% - 60px); box-sizing: border-box;">
                    <!-- Color scheme -->
                    <div class="form-group">
                        <label for="featuredProduct-colorScheme" data-i18n="featuredProduct.colorScheme">Color scheme</label>
                        <select id="featuredProduct-colorScheme" class="browser-default">
                            <option value="default" ${configData.colorScheme === 'default' ? 'selected' : ''} data-i18n="featuredProduct.options.default">${this.getTranslation('featuredProduct.options.default', 'Default')}</option>
                            <option value="scheme1" ${configData.colorScheme === 'scheme1' ? 'selected' : ''} data-i18n="featuredProduct.options.scheme1">${this.getTranslation('featuredProduct.options.scheme1', 'Scheme 1')}</option>
                            <option value="scheme2" ${configData.colorScheme === 'scheme2' ? 'selected' : ''} data-i18n="featuredProduct.options.scheme2">${this.getTranslation('featuredProduct.options.scheme2', 'Scheme 2')}</option>
                            <option value="scheme3" ${configData.colorScheme === 'scheme3' ? 'selected' : ''} data-i18n="featuredProduct.options.scheme3">${this.getTranslation('featuredProduct.options.scheme3', 'Scheme 3')}</option>
                            <option value="scheme4" ${configData.colorScheme === 'scheme4' ? 'selected' : ''} data-i18n="featuredProduct.options.scheme4">${this.getTranslation('featuredProduct.options.scheme4', 'Scheme 4')}</option>
                            <option value="scheme5" ${configData.colorScheme === 'scheme5' ? 'selected' : ''} data-i18n="featuredProduct.options.scheme5">${this.getTranslation('featuredProduct.options.scheme5', 'Scheme 5')}</option>
                        </select>
                        <small style="display: block; margin-top: 5px;">
                            <a href="#" id="featuredProduct-learnColorSchemes" style="color: var(--primary);" data-i18n="common.learnAboutColorSchemes">Learn about color schemes</a>
                        </small>
                    </div>
                    
                    <!-- Width -->
                    <div class="form-group">
                        <label for="featuredProduct-width" data-i18n="featuredProduct.width">Width</label>
                        <select id="featuredProduct-width" class="browser-default">
                            <option value="page" ${configData.width === 'page' ? 'selected' : ''} data-i18n="featuredProduct.options.page">${this.getTranslation('featuredProduct.options.page', 'Page')}</option>
                            <option value="large" ${configData.width === 'large' ? 'selected' : ''} data-i18n="featuredProduct.options.large">${this.getTranslation('featuredProduct.options.large', 'Large')}</option>
                            <option value="medium" ${configData.width === 'medium' ? 'selected' : ''} data-i18n="featuredProduct.options.medium">${this.getTranslation('featuredProduct.options.medium', 'Medium')}</option>
                            <option value="small" ${configData.width === 'small' ? 'selected' : ''} data-i18n="featuredProduct.options.small">${this.getTranslation('featuredProduct.options.small', 'Small')}</option>
                        </select>
                    </div>
                    
                    <!-- Product Section -->
                    <div class="settings-group">
                        <h4 style="font-size: 13px; font-weight: 500; margin-bottom: 12px; color: #5c5e60;" data-i18n="featuredProduct.product.title">Product</h4>
                        
                        <div class="form-group">
                            <label data-i18n="featuredProduct.product.label">Product</label>
                            <button id="featuredProduct-selectProduct" class="browser-default" style="width: 100%; padding: 10px; text-align: left; display: flex; justify-content: space-between; align-items: center;">
                                <span>${configData.selectedProduct ? configData.selectedProduct.name : 'Seleccionar'}</span>
                                <i class="material-icons">edit</i>
                            </button>
                        </div>
                    </div>
                    
                    <!-- Media Section -->
                    <div class="settings-group">
                        <h4 style="font-size: 13px; font-weight: 500; margin-bottom: 12px; color: #5c5e60;" data-i18n="featuredProduct.media.title">Media</h4>
                        <small style="display: block; margin-bottom: 15px;">
                            <a href="#" id="featuredProduct-learnMediaTypes" style="color: var(--primary);" data-i18n="featuredProduct.media.learnAbout">Learn about media types</a>
                        </small>
                        
                        <!-- Desktop layout -->
                        <div class="form-group">
                            <label for="featuredProduct-desktopLayout" data-i18n="featuredProduct.media.desktopLayout">Desktop layout</label>
                            <select id="featuredProduct-desktopLayout" class="browser-default">
                                <option value="thumbnails-left" ${configData.desktopLayout === 'thumbnails-left' ? 'selected' : ''} data-i18n="featuredProduct.options.thumbnailsLeft">${this.getTranslation('featuredProduct.options.thumbnailsLeft', 'Thumbnails left')}</option>
                                <option value="thumbnails-right" ${configData.desktopLayout === 'thumbnails-right' ? 'selected' : ''}>Thumbnails right</option>
                                <option value="thumbnails-bottom" ${configData.desktopLayout === 'thumbnails-bottom' ? 'selected' : ''} data-i18n="featuredProduct.options.thumbnailsBottom">${this.getTranslation('featuredProduct.options.thumbnailsBottom', 'Thumbnails bottom')}</option>
                            </select>
                        </div>
                        
                        <!-- Desktop space between media -->
                        <div class="form-group">
                            <label for="featuredProduct-desktopSpace" data-i18n="featuredProduct.media.desktopSpace">Desktop space between media</label>
                            <div style="display: flex; align-items: center; gap: 10px;">
                                <input type="range" id="featuredProduct-desktopSpace" min="0" max="100" value="${configData.desktopSpaceBetween}" style="flex: 1;">
                                <input type="number" id="featuredProduct-desktopSpaceValue" min="0" max="100" value="${configData.desktopSpaceBetween}" style="width: 60px; text-align: center;">
                                <span>px</span>
                            </div>
                        </div>
                        
                        <!-- Desktop thumbnail size -->
                        <div class="form-group">
                            <label for="featuredProduct-thumbnailSize" data-i18n="featuredProduct.media.thumbnailSize">Desktop thumbnail size</label>
                            <div style="display: flex; align-items: center; gap: 10px;">
                                <input type="range" id="featuredProduct-thumbnailSize" min="50" max="150" value="${configData.desktopThumbnailSize}" style="flex: 1;">
                                <input type="number" id="featuredProduct-thumbnailSizeValue" min="50" max="150" value="${configData.desktopThumbnailSize}" style="width: 60px; text-align: center;">
                                <span>px</span>
                            </div>
                        </div>
                        
                        <!-- Mobile layout -->
                        <div class="form-group">
                            <label for="featuredProduct-mobileLayout" data-i18n="featuredProduct.media.mobileLayout">Mobile layout</label>
                            <select id="featuredProduct-mobileLayout" class="browser-default">
                                <option value="thumbnails-left" ${configData.mobileLayout === 'thumbnails-left' ? 'selected' : ''} data-i18n="featuredProduct.options.thumbnailsLeft">${this.getTranslation('featuredProduct.options.thumbnailsLeft', 'Thumbnails left')}</option>
                                <option value="thumbnails-right" ${configData.mobileLayout === 'thumbnails-right' ? 'selected' : ''}>Thumbnails right</option>
                                <option value="thumbnails-bottom" ${configData.mobileLayout === 'thumbnails-bottom' ? 'selected' : ''} data-i18n="featuredProduct.options.thumbnailsBottom">${this.getTranslation('featuredProduct.options.thumbnailsBottom', 'Thumbnails bottom')}</option>
                                <option value="1-column-stack" ${configData.mobileLayout === '1-column-stack' ? 'selected' : ''}>1 column stack</option>
                                <option value="2-column-stack" ${configData.mobileLayout === '2-column-stack' ? 'selected' : ''}>2 column stack</option>
                                <option value="1-2-1-column-stack" ${configData.mobileLayout === '1-2-1-column-stack' ? 'selected' : ''}>1-2-1 column stack</option>
                                <option value="1-2-2-column-stack" ${configData.mobileLayout === '1-2-2-column-stack' ? 'selected' : ''}>1-2-2 column stack</option>
                                <option value="2-1-2-column-stack" ${configData.mobileLayout === '2-1-2-column-stack' ? 'selected' : ''}>2-1-2 column stack</option>
                            </select>
                        </div>
                        
                        <!-- Image ratio -->
                        <div class="form-group">
                            <label for="featuredProduct-imageRatio" data-i18n="featuredProduct.media.imageRatio">Image ratio</label>
                            <select id="featuredProduct-imageRatio" class="browser-default">
                                <option value="default" ${configData.imageRatio === 'default' ? 'selected' : ''} data-i18n="featuredProduct.options.adapt">${this.getTranslation('featuredProduct.options.adapt', 'Adapt to image')}</option>
                                <option value="square-1-1-fill" ${configData.imageRatio === 'square-1-1-fill' ? 'selected' : ''} data-i18n="featuredProduct.options.square">${this.getTranslation('featuredProduct.options.square', 'Square')} (1:1) - Fill</option>
                                <option value="portrait-3-4-fill" ${configData.imageRatio === 'portrait-3-4-fill' ? 'selected' : ''} data-i18n="featuredProduct.options.portrait">${this.getTranslation('featuredProduct.options.portrait', 'Portrait')} (3:4) - Fill</option>
                                <option value="portrait-large-2-3-fill" ${configData.imageRatio === 'portrait-large-2-3-fill' ? 'selected' : ''} data-i18n="featuredProduct.options.portrait">${this.getTranslation('featuredProduct.options.portrait', 'Portrait')} large (2:3) - Fill</option>
                                <option value="landscape-4-3-fill" ${configData.imageRatio === 'landscape-4-3-fill' ? 'selected' : ''}>Landscape (4:3) - Fill</option>
                                <option value="square-1-1-fit" ${configData.imageRatio === 'square-1-1-fit' ? 'selected' : ''} data-i18n="featuredProduct.options.square">${this.getTranslation('featuredProduct.options.square', 'Square')} (1:1) - Fit</option>
                                <option value="portrait-3-4-fit" ${configData.imageRatio === 'portrait-3-4-fit' ? 'selected' : ''} data-i18n="featuredProduct.options.portrait">${this.getTranslation('featuredProduct.options.portrait', 'Portrait')} (3:4) - Fit</option>
                                <option value="portrait-large-2-3-fit" ${configData.imageRatio === 'portrait-large-2-3-fit' ? 'selected' : ''} data-i18n="featuredProduct.options.portrait">${this.getTranslation('featuredProduct.options.portrait', 'Portrait')} large (2:3) - Fit</option>
                                <option value="landscape-4-3-fit" ${configData.imageRatio === 'landscape-4-3-fit' ? 'selected' : ''}>Landscape (4:3) - Fit</option>
                            </select>
                        </div>
                        
                        <!-- Toggle switches -->
                        <div class="form-group">
                            <label class="toggle-field">
                                <span data-i18n="featuredProduct.media.showOnlySelectedVariant">Show only selected variant's media</span>
                                <input type="checkbox" class="shopify-toggle" id="featuredProduct-showOnlySelectedVariant" ${configData.showOnlySelectedVariant ? 'checked' : ''}>
                                <label for="featuredProduct-showOnlySelectedVariant" class="toggle-slider"></label>
                            </label>
                        </div>
                        
                        <small style="display: block; margin-bottom: 15px; color: #666;" data-i18n="featuredProduct.media.filterNote">
                            Set the option to filter product media by in Theme settings > Advanced
                        </small>
                        
                        <div class="form-group">
                            <label class="toggle-field">
                                <span data-i18n="featuredProduct.media.enableImageZoom">Enable image zoom</span>
                                <input type="checkbox" class="shopify-toggle" id="featuredProduct-enableImageZoom" ${configData.enableImageZoom ? 'checked' : ''}>
                                <label for="featuredProduct-enableImageZoom" class="toggle-slider"></label>
                            </label>
                        </div>
                        
                        <div class="form-group">
                            <label class="toggle-field">
                                <span data-i18n="featuredProduct.media.enableVideoLooping">Enable video looping</span>
                                <input type="checkbox" class="shopify-toggle" id="featuredProduct-enableVideoLooping" ${configData.enableVideoLooping ? 'checked' : ''}>
                                <label for="featuredProduct-enableVideoLooping" class="toggle-slider"></label>
                            </label>
                        </div>
                        
                        <div class="form-group">
                            <label class="toggle-field">
                                <span data-i18n="featuredProduct.media.enableVideoAutoplay">Enable video autoplay</span>
                                <input type="checkbox" class="shopify-toggle" id="featuredProduct-enableVideoAutoplay" ${configData.enableVideoAutoplay ? 'checked' : ''}>
                                <label for="featuredProduct-enableVideoAutoplay" class="toggle-slider"></label>
                            </label>
                        </div>
                        
                        <div class="form-group">
                            <label class="toggle-field">
                                <span data-i18n="featuredProduct.media.scaleVideo">Scale video</span>
                                <input type="checkbox" class="shopify-toggle" id="featuredProduct-scaleVideo" ${configData.scaleVideo ? 'checked' : ''}>
                                <label for="featuredProduct-scaleVideo" class="toggle-slider"></label>
                            </label>
                        </div>
                    </div>
                    
                    <!-- Paddings Section -->
                    <div class="settings-group">
                        <h4 style="font-size: 13px; font-weight: 500; margin-bottom: 12px; color: #5c5e60;" data-i18n="featuredProduct.paddings.title">Paddings</h4>
                        
                        <div class="form-group">
                            <label class="toggle-field">
                                <span data-i18n="featuredProduct.paddings.addSidePaddings">Add side paddings</span>
                                <input type="checkbox" class="shopify-toggle" id="featuredProduct-addSidePaddings" ${configData.addSidePaddings ? 'checked' : ''}>
                                <label for="featuredProduct-addSidePaddings" class="toggle-slider"></label>
                            </label>
                        </div>
                        
                        <!-- Top padding -->
                        <div class="form-group">
                            <label for="featuredProduct-topPadding" data-i18n="featuredProduct.paddings.topPadding">Top padding</label>
                            <div style="display: flex; align-items: center; gap: 10px;">
                                <input type="range" id="featuredProduct-topPadding" min="0" max="200" value="${configData.topPadding}" style="flex: 1;">
                                <input type="number" id="featuredProduct-topPaddingValue" min="0" max="200" value="${configData.topPadding}" style="width: 60px; text-align: center;">
                                <span>px</span>
                            </div>
                        </div>
                        
                        <!-- Bottom padding -->
                        <div class="form-group">
                            <label for="featuredProduct-bottomPadding" data-i18n="featuredProduct.paddings.bottomPadding">Bottom padding</label>
                            <div style="display: flex; align-items: center; gap: 10px;">
                                <input type="range" id="featuredProduct-bottomPadding" min="0" max="200" value="${configData.bottomPadding}" style="flex: 1;">
                                <input type="number" id="featuredProduct-bottomPaddingValue" min="0" max="200" value="${configData.bottomPadding}" style="width: 60px; text-align: center;">
                                <span>px</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            
            <!-- Product Selection Modal -->
            <div id="featuredProduct-productModal" class="modal" style="display: none; position: fixed; top: 0; left: 0; width: 100%; height: 100%; background-color: rgba(0,0,0,0.5); z-index: 9999;">
                <div class="modal-content" style="position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%); background: white; max-width: 600px; width: 90%; max-height: 80vh; overflow: hidden; display: flex; flex-direction: column; border-radius: 8px; box-shadow: 0 4px 20px rgba(0,0,0,0.15);">
                    <div class="modal-header" style="display: flex; justify-content: space-between; align-items: center; padding: 20px; border-bottom: 1px solid #e0e0e0;">
                        <h4 style="margin: 0; font-size: 16px; font-weight: 500;" data-i18n="featuredProduct.productModal.title">Seleccionar producto</h4>
                        <button class="modal-close" style="background: none; border: none; cursor: pointer; font-size: 24px; color: #666;">
                            <i class="material-icons">close</i>
                        </button>
                    </div>
                    <div class="modal-body" style="padding: 20px; overflow-y: auto; flex: 1;">
                        <div class="form-group">
                            <input type="text" id="featuredProduct-searchProducts" placeholder="Buscar" style="width: 100%; padding: 10px; border: 1px solid #e0e0e0; border-radius: 4px;">
                        </div>
                        <div id="featuredProduct-productList" style="margin-top: 20px;">
                            <!-- Products will be loaded here -->
                        </div>
                    </div>
                </div>
            </div>
        `;
    },
    
    attachEventListeners: function() {
        console.log('[FeaturedProduct] Attaching event listeners');
        
        // Apply translations
        setTimeout(applyTranslations, 0);
        
        // Back button
        $('.back-to-sections-btn').off('click.featuredProduct').on('click.featuredProduct', function() {
            window.switchSidebarView('blockList');
        });
        
        // Color scheme
        $('#featuredProduct-colorScheme').off('change.featuredProduct').on('change.featuredProduct', function() {
            const value = $(this).val();
            if (!currentSectionsConfig.featuredProduct) {
                currentSectionsConfig.featuredProduct = {};
            }
            currentSectionsConfig.featuredProduct.colorScheme = value;
            hasPendingPageStructureChanges = true;
            updateSaveButtonState();
            renderPreview();
        });
        
        // Width
        $('#featuredProduct-width').off('change.featuredProduct').on('change.featuredProduct', function() {
            const value = $(this).val();
            currentSectionsConfig.featuredProduct.width = value;
            hasPendingPageStructureChanges = true;
            updateSaveButtonState();
            renderPreview();
        });
        
        // Product selection button
        const $selectButton = $('#featuredProduct-selectProduct');
        console.log('[FeaturedProduct] Select product button found:', $selectButton.length);
        
        $selectButton.off('click.featuredProduct').on('click.featuredProduct', function(e) {
            e.preventDefault();
            e.stopPropagation();
            console.log('[FeaturedProduct] Select product button clicked');
            window.WebsiteBuilderModules.FeaturedProduct.openProductModal();
        });
        
        // Desktop layout
        $('#featuredProduct-desktopLayout').off('change.featuredProduct').on('change.featuredProduct', function() {
            const value = $(this).val();
            currentSectionsConfig.featuredProduct.desktopLayout = value;
            hasPendingPageStructureChanges = true;
            updateSaveButtonState();
            renderPreview();
        });
        
        // Desktop space between media - sync slider and input
        $('#featuredProduct-desktopSpace').off('input.featuredProduct').on('input.featuredProduct', function() {
            const value = $(this).val();
            $('#featuredProduct-desktopSpaceValue').val(value);
            currentSectionsConfig.featuredProduct.desktopSpaceBetween = parseInt(value);
            hasPendingPageStructureChanges = true;
            updateSaveButtonState();
        });
        
        $('#featuredProduct-desktopSpaceValue').off('input.featuredProduct').on('input.featuredProduct', function() {
            const value = $(this).val();
            $('#featuredProduct-desktopSpace').val(value);
            currentSectionsConfig.featuredProduct.desktopSpaceBetween = parseInt(value);
            hasPendingPageStructureChanges = true;
            updateSaveButtonState();
        });
        
        $('#featuredProduct-desktopSpace, #featuredProduct-desktopSpaceValue').off('change.featuredProduct').on('change.featuredProduct', function() {
            renderPreview();
        });
        
        // Desktop thumbnail size - sync slider and input
        $('#featuredProduct-thumbnailSize').off('input.featuredProduct').on('input.featuredProduct', function() {
            const value = $(this).val();
            $('#featuredProduct-thumbnailSizeValue').val(value);
            currentSectionsConfig.featuredProduct.desktopThumbnailSize = parseInt(value);
            hasPendingPageStructureChanges = true;
            updateSaveButtonState();
        });
        
        $('#featuredProduct-thumbnailSizeValue').off('input.featuredProduct').on('input.featuredProduct', function() {
            const value = $(this).val();
            $('#featuredProduct-thumbnailSize').val(value);
            currentSectionsConfig.featuredProduct.desktopThumbnailSize = parseInt(value);
            hasPendingPageStructureChanges = true;
            updateSaveButtonState();
        });
        
        $('#featuredProduct-thumbnailSize, #featuredProduct-thumbnailSizeValue').off('change.featuredProduct').on('change.featuredProduct', function() {
            renderPreview();
        });
        
        // Mobile layout
        $('#featuredProduct-mobileLayout').off('change.featuredProduct').on('change.featuredProduct', function() {
            const value = $(this).val();
            currentSectionsConfig.featuredProduct.mobileLayout = value;
            hasPendingPageStructureChanges = true;
            updateSaveButtonState();
            renderPreview();
        });
        
        // Image ratio
        $('#featuredProduct-imageRatio').off('change.featuredProduct').on('change.featuredProduct', function() {
            const value = $(this).val();
            currentSectionsConfig.featuredProduct.imageRatio = value;
            hasPendingPageStructureChanges = true;
            updateSaveButtonState();
            renderPreview();
        });
        
        // Toggle switches
        $('#featuredProduct-showOnlySelectedVariant').off('change.featuredProduct').on('change.featuredProduct', function() {
            const isChecked = $(this).is(':checked');
            currentSectionsConfig.featuredProduct.showOnlySelectedVariant = isChecked;
            hasPendingPageStructureChanges = true;
            updateSaveButtonState();
            renderPreview();
        });
        
        $('#featuredProduct-enableImageZoom').off('change.featuredProduct').on('change.featuredProduct', function() {
            const isChecked = $(this).is(':checked');
            currentSectionsConfig.featuredProduct.enableImageZoom = isChecked;
            hasPendingPageStructureChanges = true;
            updateSaveButtonState();
            renderPreview();
        });
        
        $('#featuredProduct-enableVideoLooping').off('change.featuredProduct').on('change.featuredProduct', function() {
            const isChecked = $(this).is(':checked');
            currentSectionsConfig.featuredProduct.enableVideoLooping = isChecked;
            hasPendingPageStructureChanges = true;
            updateSaveButtonState();
            renderPreview();
        });
        
        $('#featuredProduct-enableVideoAutoplay').off('change.featuredProduct').on('change.featuredProduct', function() {
            const isChecked = $(this).is(':checked');
            currentSectionsConfig.featuredProduct.enableVideoAutoplay = isChecked;
            hasPendingPageStructureChanges = true;
            updateSaveButtonState();
            renderPreview();
        });
        
        $('#featuredProduct-scaleVideo').off('change.featuredProduct').on('change.featuredProduct', function() {
            const isChecked = $(this).is(':checked');
            currentSectionsConfig.featuredProduct.scaleVideo = isChecked;
            hasPendingPageStructureChanges = true;
            updateSaveButtonState();
            renderPreview();
        });
        
        // Add side paddings
        $('#featuredProduct-addSidePaddings').off('change.featuredProduct').on('change.featuredProduct', function() {
            const isChecked = $(this).is(':checked');
            currentSectionsConfig.featuredProduct.addSidePaddings = isChecked;
            hasPendingPageStructureChanges = true;
            updateSaveButtonState();
            renderPreview();
        });
        
        // Top padding - sync slider and input
        $('#featuredProduct-topPadding').off('input.featuredProduct').on('input.featuredProduct', function() {
            const value = $(this).val();
            $('#featuredProduct-topPaddingValue').val(value);
            currentSectionsConfig.featuredProduct.topPadding = parseInt(value);
            hasPendingPageStructureChanges = true;
            updateSaveButtonState();
        });
        
        $('#featuredProduct-topPaddingValue').off('input.featuredProduct').on('input.featuredProduct', function() {
            const value = $(this).val();
            $('#featuredProduct-topPadding').val(value);
            currentSectionsConfig.featuredProduct.topPadding = parseInt(value);
            hasPendingPageStructureChanges = true;
            updateSaveButtonState();
        });
        
        $('#featuredProduct-topPadding, #featuredProduct-topPaddingValue').off('change.featuredProduct').on('change.featuredProduct', function() {
            renderPreview();
        });
        
        // Bottom padding - sync slider and input
        $('#featuredProduct-bottomPadding').off('input.featuredProduct').on('input.featuredProduct', function() {
            const value = $(this).val();
            $('#featuredProduct-bottomPaddingValue').val(value);
            currentSectionsConfig.featuredProduct.bottomPadding = parseInt(value);
            hasPendingPageStructureChanges = true;
            updateSaveButtonState();
        });
        
        $('#featuredProduct-bottomPaddingValue').off('input.featuredProduct').on('input.featuredProduct', function() {
            const value = $(this).val();
            $('#featuredProduct-bottomPadding').val(value);
            currentSectionsConfig.featuredProduct.bottomPadding = parseInt(value);
            hasPendingPageStructureChanges = true;
            updateSaveButtonState();
        });
        
        $('#featuredProduct-bottomPadding, #featuredProduct-bottomPaddingValue').off('change.featuredProduct').on('change.featuredProduct', function() {
            renderPreview();
        });
        
        // Modal close button
        $('.modal-close').off('click.featuredProduct').on('click.featuredProduct', function() {
            $('#featuredProduct-productModal').fadeOut();
        });
        
        // Product search
        $('#featuredProduct-searchProducts').off('input.featuredProduct').on('input.featuredProduct', function() {
            const searchTerm = $(this).val().toLowerCase();
            window.WebsiteBuilderModules.FeaturedProduct.filterProducts(searchTerm);
        });
        
        // Initialize color scheme links
        $('#featuredProduct-learnColorSchemes').off('click.featuredProduct').on('click.featuredProduct', function(e) {
            e.preventDefault();
            // TODO: Show color schemes help
        });
        
        $('#featuredProduct-learnMediaTypes').off('click.featuredProduct').on('click.featuredProduct', function(e) {
            e.preventDefault();
            // TODO: Show media types help
        });
    },
    
    initialize: function() {},
    
    openProductModal: function() {
        console.log('[FeaturedProduct] Opening product modal');
        const $modal = $('#featuredProduct-productModal');
        console.log('[FeaturedProduct] Modal found:', $modal.length);
        
        // Show modal
        $modal.fadeIn(300, function() {
            console.log('[FeaturedProduct] Modal fadeIn complete, display:', $modal.css('display'));
        });
        
        // Attach modal close handlers
        $modal.find('.modal-close').off('click.modal').on('click.modal', () => {
            $modal.fadeOut();
        });
        
        // Close on background click
        $modal.off('click.modalBg').on('click.modalBg', function(e) {
            if (e.target === this) {
                $modal.fadeOut();
            }
        });
        
        // Search functionality
        $('#featuredProduct-searchProducts').off('input.search').on('input.search', function() {
            const searchTerm = $(this).val().toLowerCase();
            window.WebsiteBuilderModules.FeaturedProduct.filterProducts(searchTerm);
        });
        
        // Load products
        this.loadProducts();
    },
    
    loadProducts: function() {
        const $productList = $('#featuredProduct-productList');
        $productList.html('<div style="text-align: center;"><i class="material-icons" style="font-size: 48px; color: #ccc;">refresh</i><p>Cargando productos...</p></div>');
        
        // Call API to get products
        $.ajax({
            url: '/api/builder/products',
            method: 'GET',
            success: (products) => {
                this.renderProductList(products);
            },
            error: (xhr, status, error) => {
                console.error('Error loading products:', error);
                $productList.html('<div style="text-align: center; color: #dc3545;"><i class="material-icons" style="font-size: 48px;">error</i><p>Error al cargar productos</p></div>');
            }
        });
    },
    
    renderProductList: function(products) {
        const $productList = $('#featuredProduct-productList');
        
        if (!products || products.length === 0) {
            $productList.html('<div style="text-align: center; color: #666;"><i class="material-icons" style="font-size: 48px;">inventory_2</i><p>No hay productos disponibles</p></div>');
            return;
        }
        
        let html = '';
        const selectedProductId = currentSectionsConfig.featuredProduct?.selectedProduct?.id;
        
        products.forEach(product => {
            const imageUrl = product.images && product.images.length > 0 ? product.images[0].url : '';
            const isSelected = selectedProductId === product.id;
            
            html += `
                <div class="product-item" data-product-id="${product.id}" style="display: flex; align-items: center; padding: 12px; border: 1px solid ${isSelected ? 'var(--primary)' : '#e0e0e0'}; border-radius: 4px; margin-bottom: 10px; cursor: pointer; transition: all 0.2s; ${isSelected ? 'background-color: #f8f8f8;' : ''}">
                    <div style="width: 50px; height: 50px; background: #f5f5f5; border-radius: 4px; margin-right: 15px; display: flex; align-items: center; justify-content: center; overflow: hidden;">
                        ${imageUrl ? 
                            `<img src="${imageUrl}" alt="${product.name}" style="width: 100%; height: 100%; object-fit: cover;">` : 
                            `<i class="material-icons" style="color: #ccc;">image</i>`
                        }
                    </div>
                    <div style="flex: 1;">
                        <div style="font-weight: 500;">${product.name}</div>
                        ${product.price ? `<div style="font-size: 14px; color: #666;">$${product.price.toFixed(2)}</div>` : ''}
                    </div>
                    ${isSelected ? '<i class="material-icons" style="color: var(--primary);">check_circle</i>' : ''}
                </div>
            `;
        });
        
        $productList.html(html);
        
        // Add click event to products
        $('.product-item').off('click.featuredProduct').on('click.featuredProduct', function() {
            const productId = $(this).data('product-id');
            const product = products.find(p => p.id === productId);
            window.WebsiteBuilderModules.FeaturedProduct.selectProduct(product);
        });
        
        // Add hover effect
        $('.product-item').hover(
            function() { 
                if (!$(this).css('background-color') || $(this).css('background-color') === 'transparent') {
                    $(this).css({'background-color': '#f8f8f8', 'box-shadow': '0 2px 4px rgba(0,0,0,0.1)'}); 
                }
            },
            function() { 
                const isSelected = currentSectionsConfig.featuredProduct?.selectedProduct?.id === $(this).data('product-id');
                if (!isSelected) {
                    $(this).css({'background-color': 'transparent', 'box-shadow': 'none'}); 
                }
            }
        );
    },
    
    filterProducts: function(searchTerm) {
        $('.product-item').each(function() {
            const productName = $(this).find('div').first().text().toLowerCase();
            if (productName.includes(searchTerm)) {
                $(this).show();
            } else {
                $(this).hide();
            }
        });
    },
    
    selectProduct: function(product) {
        if (!product) return;
        
        console.log('[DEBUG] selectProduct - Original product:', product);
        console.log('[DEBUG] selectProduct - Description field:', product.Description);
        
        // Update configuration
        if (!currentSectionsConfig.featuredProduct) {
            currentSectionsConfig.featuredProduct = {};
        }
        
        currentSectionsConfig.featuredProduct.selectedProductId = product.id;
        
        // Ensure images are sorted by position before storing
        const sortedImages = product.images ? [...product.images].sort((a, b) => a.position - b.position) : [];
        
        currentSectionsConfig.featuredProduct.selectedProduct = {
            id: product.id,
            name: product.name,
            price: product.price,
            compareAtPrice: product.compareAtPrice,
            vendor: product.vendor,
            description: product.Description || product.description || '',
            images: sortedImages,
            variants: product.variants
        };
        
        console.log('[DEBUG] selectProduct - Saved product:', currentSectionsConfig.featuredProduct.selectedProduct);
        console.log('[DEBUG] selectProduct - Saved description:', currentSectionsConfig.featuredProduct.selectedProduct.description);
        
        // Update button text
        $('#featuredProduct-selectProduct span').text(product.name);
        
        // Close modal
        $('#featuredProduct-productModal').fadeOut();
        
        // Mark as changed
        hasPendingPageStructureChanges = true;
        updateSaveButtonState();
        renderPreview();
    },
    
    refreshProductData: function(productId) {
        if (!productId) return;
        
        console.log('[FeaturedProduct] Refreshing product data for ID:', productId);
        
        // Fetch all products and find the specific one
        $.ajax({
            url: '/api/builder/products',
            method: 'GET',
            success: (products) => {
                const product = products.find(p => p.id === productId);
                
                if (product && currentSectionsConfig.featuredProduct) {
                    // Ensure images are sorted by position
                    const sortedImages = product.images ? [...product.images].sort((a, b) => a.position - b.position) : [];
                    
                    console.log('[FeaturedProduct] Updated product images order:', sortedImages.map(img => img.position));
                    
                    currentSectionsConfig.featuredProduct.selectedProduct = {
                        id: product.id,
                        name: product.name,
                        price: product.price,
                        compareAtPrice: product.compareAtPrice,
                        vendor: product.vendor,
                        description: product.description,
                        images: sortedImages,
                        variants: product.variants
                    };
                    
                    // Update preview
                    if (window.renderPreview) {
                        window.renderPreview();
                    }
                }
            },
            error: (xhr, status, error) => {
                console.error('[FeaturedProduct] Error refreshing product data:', error);
            }
        });
    },
    
    groupVariantOptions: function(variants) {
        const options = {
            'Option 1': new Set(),
            'Option 2': new Set(),
            'Option 3': new Set()
        };
        
        variants.forEach(variant => {
            if (variant.option1) options['Option 1'].add(variant.option1);
            if (variant.option2) options['Option 2'].add(variant.option2);
            if (variant.option3) options['Option 3'].add(variant.option3);
        });
        
        // Convert sets to arrays and filter out empty options
        const result = {};
        Object.keys(options).forEach(key => {
            const values = Array.from(options[key]);
            if (values.length > 0) {
                result[key] = values;
            }
        });
        
        return result;
    },
    
    renderDescriptionSettings: function(config) {
        const configData = config || {};
        
        return `
            <div style="display: flex; flex-direction: column; height: 100%; position: relative; overflow: hidden;">
                <!-- Header con flecha de regreso -->
                <div class="sidebar-view-header" style="position: relative; z-index: 10;">
                    <button class="back-to-sections-btn">
                        <i class="material-icons">arrow_back</i>
                    </button>
                    <h3 data-i18n="featuredProduct.description.title">Description</h3>
                    <button class="description-menu-btn" style="position: absolute; right: 10px; top: 10px; background: none; border: none; cursor: pointer; padding: 5px;">
                        <i class="material-icons">more_vert</i>
                    </button>
                </div>
                
                <!-- Contenido con scroll -->
                <div style="padding: 20px; overflow-y: auto; overflow-x: hidden; flex: 1; height: calc(100% - 60px); box-sizing: border-box;">
                    
                    <!-- Campo Heading -->
                    <div class="form-group">
                        <label style="font-size: 13px; font-weight: 500; margin-bottom: 8px; color: #5c5e60;" 
                               data-i18n="featuredProduct.description.heading">Heading</label>
                        <input type="text" 
                               id="description-heading" 
                               value="${configData.heading || ''}"
                               placeholder="Description"
                               data-i18n-placeholder="featuredProduct.description.headingPlaceholder"
                               style="width: 100%; padding: 8px 12px; border: 1px solid #e0e0e0; border-radius: 4px;">
                    </div>
                    
                    <!-- Campo Type -->
                    <div class="form-group" style="margin-top: 20px;">
                        <label style="font-size: 13px; font-weight: 500; margin-bottom: 8px; color: #5c5e60;" 
                               data-i18n="featuredProduct.description.type">Type</label>
                        <select class="shopify-select" id="description-type" style="width: 100%; padding: 8px 12px; border: 1px solid #e0e0e0; border-radius: 4px; background: white;">
                            <option value="static" ${configData.type === 'static' || !configData.type ? 'selected' : ''} 
                                    data-i18n="featuredProduct.description.typeStatic">Static</option>
                            <option value="expanded-tab" ${configData.type === 'expanded-tab' ? 'selected' : ''} 
                                    data-i18n="featuredProduct.description.typeExpanded">Expanded tab</option>
                            <option value="collapsed-tab" ${configData.type === 'collapsed-tab' ? 'selected' : ''} 
                                    data-i18n="featuredProduct.description.typeCollapsed">Collapsed tab</option>
                        </select>
                    </div>
                    
                    <!-- Campo Icon (solo mostrar si el type no es static) -->
                    <div class="icon-section" style="${configData.type === 'static' || !configData.type ? 'display: none;' : ''}">
                        <div class="form-group" style="margin-top: 20px;">
                            <label style="font-size: 13px; font-weight: 500; margin-bottom: 8px; color: #5c5e60;" 
                                   data-i18n="featuredProduct.description.icon">Icon</label>
                            <select class="shopify-select" id="description-icon" style="width: 100%; padding: 8px 12px; border: 1px solid #e0e0e0; border-radius: 4px; background: white;">
                                <option value="none" ${!configData.icon || configData.icon === 'none' ? 'selected' : ''} 
                                        data-i18n="featuredProduct.description.iconNone">None</option>
                                <optgroup label="General" data-i18n-label="icon.categories.general">
                                    <option value="home" ${configData.icon === 'home' ? 'selected' : ''}>🏠 Home</option>
                                    <option value="star" ${configData.icon === 'star' ? 'selected' : ''}>⭐ Star</option>
                                    <option value="favorite" ${configData.icon === 'favorite' ? 'selected' : ''}>❤️ Favorite</option>
                                    <option value="search" ${configData.icon === 'search' ? 'selected' : ''}>🔍 Search</option>
                                    <option value="info" ${configData.icon === 'info' ? 'selected' : ''}>ℹ️ Info</option>
                                    <option value="help" ${configData.icon === 'help' ? 'selected' : ''}>❓ Help</option>
                                    <option value="settings" ${configData.icon === 'settings' ? 'selected' : ''}>⚙️ Settings</option>
                                    <option value="account_circle" ${configData.icon === 'account_circle' ? 'selected' : ''}>👤 Account</option>
                                    <option value="shopping_bag" ${configData.icon === 'shopping_bag' ? 'selected' : ''}>🛍️ Shopping Bag</option>
                                    <option value="work" ${configData.icon === 'work' ? 'selected' : ''}>💼 Work</option>
                                    <option value="event" ${configData.icon === 'event' ? 'selected' : ''}>📅 Event</option>
                                    <option value="place" ${configData.icon === 'place' ? 'selected' : ''}>📍 Place</option>
                                    <option value="access_time" ${configData.icon === 'access_time' ? 'selected' : ''}>🕐 Time</option>
                                    <option value="check_circle" ${configData.icon === 'check_circle' ? 'selected' : ''}>✅ Check Circle</option>
                                    <option value="verified" ${configData.icon === 'verified' ? 'selected' : ''}>✓ Verified</option>
                                    <option value="thumb_up" ${configData.icon === 'thumb_up' ? 'selected' : ''}>👍 Thumb Up</option>
                                    <option value="grade" ${configData.icon === 'grade' ? 'selected' : ''}>🌟 Grade</option>
                                    <option value="language" ${configData.icon === 'language' ? 'selected' : ''}>🌐 Language</option>
                                    <option value="face" ${configData.icon === 'face' ? 'selected' : ''}>😊 Face</option>
                                    <option value="extension" ${configData.icon === 'extension' ? 'selected' : ''}>🧩 Extension</option>
                                    <option value="pets" ${configData.icon === 'pets' ? 'selected' : ''}>🐾 Pets</option>
                                    <option value="visibility" ${configData.icon === 'visibility' ? 'selected' : ''}>👁️ Visibility</option>
                                    <option value="schedule" ${configData.icon === 'schedule' ? 'selected' : ''}>📋 Schedule</option>
                                    <option value="trending_up" ${configData.icon === 'trending_up' ? 'selected' : ''}>📈 Trending Up</option>
                                    <option value="lightbulb" ${configData.icon === 'lightbulb' ? 'selected' : ''}>💡 Lightbulb</option>
                                    <option value="attach_money" ${configData.icon === 'attach_money' ? 'selected' : ''}>💵 Money</option>
                                    <option value="security" ${configData.icon === 'security' ? 'selected' : ''}>🔒 Security</option>
                                    <option value="palette" ${configData.icon === 'palette' ? 'selected' : ''}>🎨 Palette</option>
                                    <option value="spa" ${configData.icon === 'spa' ? 'selected' : ''}>🌸 Spa</option>
                                </optgroup>
                                <optgroup label="Commerce" data-i18n-label="icon.categories.commerce">
                                    <option value="shopping_cart" ${configData.icon === 'shopping_cart' ? 'selected' : ''}>🛒 Shopping Cart</option>
                                    <option value="store" ${configData.icon === 'store' ? 'selected' : ''}>🏪 Store</option>
                                    <option value="storefront" ${configData.icon === 'storefront' ? 'selected' : ''}>🏬 Storefront</option>
                                    <option value="inventory" ${configData.icon === 'inventory' ? 'selected' : ''}>📦 Inventory</option>
                                    <option value="sell" ${configData.icon === 'sell' ? 'selected' : ''}>🏷️ Sell</option>
                                    <option value="loyalty" ${configData.icon === 'loyalty' ? 'selected' : ''}>🎁 Loyalty</option>
                                    <option value="redeem" ${configData.icon === 'redeem' ? 'selected' : ''}>🎟️ Redeem</option>
                                    <option value="receipt" ${configData.icon === 'receipt' ? 'selected' : ''}>🧾 Receipt</option>
                                    <option value="point_of_sale" ${configData.icon === 'point_of_sale' ? 'selected' : ''}>💳 Point of Sale</option>
                                    <option value="qr_code" ${configData.icon === 'qr_code' ? 'selected' : ''}>📱 QR Code</option>
                                    <option value="qr_code_scanner" ${configData.icon === 'qr_code_scanner' ? 'selected' : ''}>📷 QR Scanner</option>
                                    <option value="barcode" ${configData.icon === 'barcode' ? 'selected' : ''}>📊 Barcode</option>
                                    <option value="confirmation_number" ${configData.icon === 'confirmation_number' ? 'selected' : ''}>🔢 Confirmation</option>
                                    <option value="discount" ${configData.icon === 'discount' ? 'selected' : ''}>🏷️ Discount</option>
                                    <option value="production_quantity_limits" ${configData.icon === 'production_quantity_limits' ? 'selected' : ''}>⚖️ Quantity Limits</option>
                                    <option value="add_shopping_cart" ${configData.icon === 'add_shopping_cart' ? 'selected' : ''}>➕ Add to Cart</option>
                                    <option value="remove_shopping_cart" ${configData.icon === 'remove_shopping_cart' ? 'selected' : ''}>➖ Remove from Cart</option>
                                    <option value="shopping_basket" ${configData.icon === 'shopping_basket' ? 'selected' : ''}>🧺 Shopping Basket</option>
                                    <option value="add_business" ${configData.icon === 'add_business' ? 'selected' : ''}>🏢 Add Business</option>
                                    <option value="business_center" ${configData.icon === 'business_center' ? 'selected' : ''}>💼 Business Center</option>
                                </optgroup>
                                <optgroup label="Shipping" data-i18n-label="icon.categories.shipping">
                                    <option value="local_shipping" ${configData.icon === 'local_shipping' ? 'selected' : ''}>🚚 Local Shipping</option>
                                    <option value="flight" ${configData.icon === 'flight' ? 'selected' : ''}>✈️ Flight</option>
                                    <option value="flight_takeoff" ${configData.icon === 'flight_takeoff' ? 'selected' : ''}>🛫 Takeoff</option>
                                    <option value="flight_land" ${configData.icon === 'flight_land' ? 'selected' : ''}>🛬 Landing</option>
                                    <option value="directions_boat" ${configData.icon === 'directions_boat' ? 'selected' : ''}>⛵ Boat</option>
                                    <option value="directions_car" ${configData.icon === 'directions_car' ? 'selected' : ''}>🚗 Car</option>
                                    <option value="airport_shuttle" ${configData.icon === 'airport_shuttle' ? 'selected' : ''}>🚐 Shuttle</option>
                                    <option value="local_mall" ${configData.icon === 'local_mall' ? 'selected' : ''}>🛍️ Mall</option>
                                    <option value="local_offer" ${configData.icon === 'local_offer' ? 'selected' : ''}>🏷️ Offer</option>
                                    <option value="local_post_office" ${configData.icon === 'local_post_office' ? 'selected' : ''}>📮 Post Office</option>
                                    <option value="markunread_mailbox" ${configData.icon === 'markunread_mailbox' ? 'selected' : ''}>📬 Mailbox</option>
                                    <option value="inventory_2" ${configData.icon === 'inventory_2' ? 'selected' : ''}>📦 Inventory</option>
                                </optgroup>
                                <optgroup label="Payment" data-i18n-label="icon.categories.payment">
                                    <option value="credit_card" ${configData.icon === 'credit_card' ? 'selected' : ''}>💳 Credit Card</option>
                                    <option value="account_balance" ${configData.icon === 'account_balance' ? 'selected' : ''}>🏦 Bank</option>
                                    <option value="account_balance_wallet" ${configData.icon === 'account_balance_wallet' ? 'selected' : ''}>👛 Wallet</option>
                                    <option value="payments" ${configData.icon === 'payments' ? 'selected' : ''}>💸 Payments</option>
                                    <option value="monetization_on" ${configData.icon === 'monetization_on' ? 'selected' : ''}>💰 Monetization</option>
                                    <option value="euro" ${configData.icon === 'euro' ? 'selected' : ''}>€ Euro</option>
                                    <option value="attach_money" ${configData.icon === 'attach_money' ? 'selected' : ''}>💵 Dollar</option>
                                    <option value="money" ${configData.icon === 'money' ? 'selected' : ''}>💴 Money</option>
                                    <option value="price_check" ${configData.icon === 'price_check' ? 'selected' : ''}>✅ Price Check</option>
                                    <option value="price_change" ${configData.icon === 'price_change' ? 'selected' : ''}>📊 Price Change</option>
                                    <option value="currency_exchange" ${configData.icon === 'currency_exchange' ? 'selected' : ''}>💱 Exchange</option>
                                </optgroup>
                                <optgroup label="Communication" data-i18n-label="icon.categories.communication">
                                    <option value="email" ${configData.icon === 'email' ? 'selected' : ''}>📧 Email</option>
                                    <option value="phone" ${configData.icon === 'phone' ? 'selected' : ''}>📞 Phone</option>
                                    <option value="chat" ${configData.icon === 'chat' ? 'selected' : ''}>💬 Chat</option>
                                    <option value="message" ${configData.icon === 'message' ? 'selected' : ''}>✉️ Message</option>
                                    <option value="forum" ${configData.icon === 'forum' ? 'selected' : ''}>🗣️ Forum</option>
                                    <option value="contact_support" ${configData.icon === 'contact_support' ? 'selected' : ''}>🎧 Support</option>
                                    <option value="question_answer" ${configData.icon === 'question_answer' ? 'selected' : ''}>❓ Q&A</option>
                                </optgroup>
                                <optgroup label="Devices" data-i18n-label="icon.categories.devices">
                                    <option value="smartphone" ${configData.icon === 'smartphone' ? 'selected' : ''}>📱 Smartphone</option>
                                    <option value="computer" ${configData.icon === 'computer' ? 'selected' : ''}>💻 Computer</option>
                                </optgroup>
                                <optgroup label="Ecology" data-i18n-label="icon.categories.ecology">
                                    <option value="eco" ${configData.icon === 'eco' ? 'selected' : ''}>🌿 Eco</option>
                                    <option value="recycling" ${configData.icon === 'recycling' ? 'selected' : ''}>♻️ Recycling</option>
                                    <option value="compost" ${configData.icon === 'compost' ? 'selected' : ''}>🌱 Compost</option>
                                    <option value="water_drop" ${configData.icon === 'water_drop' ? 'selected' : ''}>💧 Water</option>
                                    <option value="energy_savings_leaf" ${configData.icon === 'energy_savings_leaf' ? 'selected' : ''}>🍃 Energy Saving</option>
                                </optgroup>
                            </select>
                            <a href="#" id="description-icon-help" style="font-size: 12px; color: #2962ff; text-decoration: underline; margin-top: 4px; display: inline-block;"
                               data-i18n="featuredProduct.description.iconHelp">See what icon stands for each label</a>
                        </div>
                        
                        <!-- Campo Custom icon -->
                        <div class="custom-icon-section" style="${configData.icon !== 'none' ? 'display: none;' : ''} margin-top: 20px;">
                            <div class="form-group">
                                <label style="font-size: 13px; font-weight: 500; margin-bottom: 8px; color: #5c5e60;" 
                                       data-i18n="featuredProduct.description.customIcon">Custom icon</label>
                                ${configData.customIcon ? `
                                    <div class="custom-icon-preview" style="border: 1px solid #e0e0e0; border-radius: 4px; padding: 20px; text-align: center; background: #fafafa;">
                                        <img src="${configData.customIcon}" alt="Custom icon" style="max-width: 100px; max-height: 100px; margin-bottom: 15px;">
                                        <div>
                                            <button type="button" class="shopify-btn change-icon-btn" style="margin-right: 10px;">
                                                <span data-i18n="common.change">Change</span>
                                            </button>
                                            <button type="button" class="shopify-btn remove-icon-btn" style="background: #dc3545; color: white;">
                                                <span data-i18n="common.remove">Remove</span>
                                            </button>
                                        </div>
                                    </div>
                                ` : `
                                    <div style="border: 2px dashed #e0e0e0; border-radius: 4px; padding: 20px; text-align: center; background: #fafafa;">
                                        <input type="file" id="custom-icon-upload" accept="image/*" style="display: none;">
                                        <button type="button" class="shopify-btn upload-icon-btn" style="margin-bottom: 10px;">
                                            <i class="material-icons" style="vertical-align: middle; margin-right: 5px;">upload</i>
                                            <span data-i18n="featuredProduct.description.selectIcon">Seleccionar</span>
                                        </button>
                                        <div style="font-size: 12px; color: #666;">
                                            <span data-i18n="featuredProduct.description.exploreImages">Explorar imágenes gratuitas</span>
                                        </div>
                                    </div>
                                `}
                            </div>
                        </div>
                    </div>
                    
                </div>
            </div>
        `;
    },
    
    attachDescriptionEventListeners: function() {
        // Apply translations
        setTimeout(applyTranslations, 0);
        
        // Back button - regresa al panel lateral principal (blockList)
        $('.back-to-sections-btn').off('click.description').on('click.description', function() {
            window.switchSidebarView('blockList');
        });
        
        // Helper function para actualizar configuración de description
        const updateDescriptionConfig = (key, value) => {
            console.log('[DESCRIPTION] Updating config:', key, '=', value);
            
            if (!window.currentSectionsConfig.featuredProduct) {
                window.currentSectionsConfig.featuredProduct = {};
            }
            if (!window.currentSectionsConfig.featuredProduct.blocks) {
                window.currentSectionsConfig.featuredProduct.blocks = {};
            }
            if (!window.currentSectionsConfig.featuredProduct.blocks.description) {
                window.currentSectionsConfig.featuredProduct.blocks.description = {
                    type: 'description',
                    isHidden: false
                };
            }
            
            window.currentSectionsConfig.featuredProduct.blocks.description[key] = value;
            
            console.log('[DESCRIPTION] Updated config:', window.currentSectionsConfig.featuredProduct.blocks.description);
            
            window.setHasPendingPageStructureChanges(true);
            window.updateSaveButtonState();
            window.renderPreview();
        };
        
        // Heading input
        $('#description-heading').off('input.description').on('input.description', function() {
            updateDescriptionConfig('heading', $(this).val());
        });
        
        // Type select
        $('#description-type').off('change.description').on('change.description', function() {
            const selectedType = $(this).val();
            console.log('[DESCRIPTION] Type changed to:', selectedType);
            
            updateDescriptionConfig('type', selectedType);
            
            // Mostrar/ocultar sección de iconos según el tipo
            if (selectedType === 'static') {
                $('.icon-section').fadeOut(200);
                // Clear icon when switching to static
                updateDescriptionConfig('icon', null);
                updateDescriptionConfig('customIcon', null);
            } else {
                $('.icon-section').fadeIn(200);
                // Set default icon if none exists
                const currentIcon = window.currentSectionsConfig.featuredProduct?.blocks?.description?.icon;
                if (!currentIcon) {
                    updateDescriptionConfig('icon', 'info');
                }
            }
            
            // Force immediate preview update
            setTimeout(() => {
                window.renderPreview();
            }, 100);
        });
        
        // Icon select
        $('#description-icon').off('change.description').on('change.description', function() {
            const selectedIcon = $(this).val();
            updateDescriptionConfig('icon', selectedIcon);
            
            // Mostrar/ocultar custom icon section
            if (selectedIcon === 'none') {
                $('.custom-icon-section').fadeIn(200);
            } else {
                $('.custom-icon-section').fadeOut(200);
                // Si hay un icono seleccionado, limpiar custom icon
                updateDescriptionConfig('customIcon', null);
            }
            
            // Force preview update to show icon change immediately
            window.renderPreview();
        });
        
        // Upload icon button
        $('.upload-icon-btn, .change-icon-btn').off('click.description').on('click.description', function() {
            $('#custom-icon-upload').click();
        });
        
        // Custom icon upload
        $('#custom-icon-upload').off('change.description').on('change.description', function(e) {
            const file = e.target.files[0];
            if (file) {
                // For demonstration, use FileReader to convert to data URL
                // In production, this would upload to server and return URL
                const reader = new FileReader();
                reader.onload = function(e) {
                    const dataUrl = e.target.result;
                    updateDescriptionConfig('customIcon', dataUrl);
                    
                    // Update the preview immediately
                    const previewImg = $('.custom-icon-preview img');
                    if (previewImg.length) {
                        previewImg.attr('src', dataUrl);
                    }
                    
                    // Show/hide appropriate sections
                    $('.upload-icon-section').hide();
                    $('.preview-icon-section').show();
                    
                    // Force preview update
                    window.renderPreview();
                };
                reader.readAsDataURL(file);
            }
        });
        
        // Remove custom icon
        $('.remove-icon-btn').off('click.description').on('click.description', function() {
            updateDescriptionConfig('customIcon', null);
            
            // Show/hide appropriate sections
            $('.upload-icon-section').show();
            $('.preview-icon-section').hide();
            
            // Clear file input
            $('#custom-icon-upload').val('');
            
            // Force preview update
            window.renderPreview();
        });
        
        // Icon help link
        $('#description-icon-help').off('click.description').on('click.description', function(e) {
            e.preventDefault();
            // TODO: Mostrar modal o información sobre los iconos
            console.log('Show icon help');
        });
        
        // Menu button
        $('.description-menu-btn').off('click.description').on('click.description', function(e) {
            e.preventDefault();
            // TODO: Mostrar menú de opciones adicionales
            console.log('Show description menu');
        });
    },
    
    // Buy Buttons configuration view
    renderBuyButtonsSettings: function(configData) {
        const config = configData || {};
        
        return `
            <div style="display: flex; flex-direction: column; height: 100%; position: relative; overflow: hidden;">
                <!-- Header con flecha de regreso -->
                <div class="sidebar-view-header" style="position: relative; z-index: 10;">
                    <button class="back-to-sections-btn">
                        <i class="material-icons">arrow_back</i>
                    </button>
                    <h3 data-i18n="featuredProduct.buyButtons.title">Buy buttons</h3>
                    <button class="buy-buttons-menu-btn" style="position: absolute; right: 10px; top: 10px; background: none; border: none; cursor: pointer; padding: 5px;">
                        <i class="material-icons">more_vert</i>
                    </button>
                </div>
                
                <!-- Contenido con scroll -->
                <div style="padding: 20px; overflow-y: auto; overflow-x: hidden; flex: 1; height: calc(100% - 60px); box-sizing: border-box;">
                    
                    <!-- Toggle: Show dynamic checkout button -->
                    <div class="form-group">
                        <label class="toggle-field">
                            <span data-i18n="featuredProduct.buyButtons.showDynamicCheckout">Show dynamic checkout button</span>
                            <input type="checkbox" class="shopify-toggle" id="buy-buttons-show-dynamic" ${config.showDynamicCheckout !== false ? 'checked' : ''}>
                            <label for="buy-buttons-show-dynamic" class="toggle-slider"></label>
                        </label>
                        <div style="font-size: 12px; color: #666; margin-top: 5px; margin-left: 0;">
                            <span data-i18n="featuredProduct.buyButtons.showDynamicCheckoutHelp">Let customers check out directly using preferred payment method</span>
                        </div>
                    </div>
                    
                    <!-- Toggle: Enable pickup availability feature -->
                    <div class="form-group" style="margin-top: 20px;">
                        <label class="toggle-field">
                            <span data-i18n="featuredProduct.buyButtons.enablePickup">Enable pickup availability feature</span>
                            <input type="checkbox" class="shopify-toggle" id="buy-buttons-enable-pickup" ${config.enablePickupAvailability ? 'checked' : ''}>
                            <label for="buy-buttons-enable-pickup" class="toggle-slider"></label>
                        </label>
                        <div style="font-size: 12px; color: #666; margin-top: 5px; margin-left: 0;">
                            <a href="#" style="color: #2962ff; text-decoration: underline;" data-i18n="featuredProduct.buyButtons.learnPickup">Learn how to setup pickup availability feature</a>
                        </div>
                    </div>
                    
                    <!-- Toggle: Show recipient form for gift cards -->
                    <div class="form-group" style="margin-top: 20px;">
                        <label class="toggle-field">
                            <span data-i18n="featuredProduct.buyButtons.showRecipientForm">Show recipient form for gift cards</span>
                            <input type="checkbox" class="shopify-toggle" id="buy-buttons-show-recipient" ${config.showRecipientForm ? 'checked' : ''}>
                            <label for="buy-buttons-show-recipient" class="toggle-slider"></label>
                        </label>
                        <div style="font-size: 12px; color: #666; margin-top: 5px; margin-left: 0;">
                            <span data-i18n="featuredProduct.buyButtons.showRecipientFormHelp">Let customers send gift card products to a different recipient along with a personal message</span>
                        </div>
                    </div>
                    
                    <!-- Add to cart button style -->
                    <div class="form-group" style="margin-top: 30px;">
                        <label style="font-size: 13px; font-weight: 500; margin-bottom: 12px; color: #5c5e60; display: block;" 
                               data-i18n="featuredProduct.buyButtons.addToCartStyle">"Add to cart" button style</label>
                        <div style="display: flex; gap: 12px;">
                            <label class="radio-option-card" style="flex: 1; padding: 12px; border: 2px solid ${config.addToCartStyle !== 'outline' ? '#2962ff' : '#e0e0e0'}; border-radius: 8px; cursor: pointer; text-align: center;">
                                <input type="radio" name="add-to-cart-style" value="solid" ${config.addToCartStyle !== 'outline' ? 'checked' : ''} style="display: none;">
                                <span data-i18n="featuredProduct.buyButtons.solid">Solid</span>
                            </label>
                            <label class="radio-option-card" style="flex: 1; padding: 12px; border: 2px solid ${config.addToCartStyle === 'outline' ? '#2962ff' : '#e0e0e0'}; border-radius: 8px; cursor: pointer; text-align: center;">
                                <input type="radio" name="add-to-cart-style" value="outline" ${config.addToCartStyle === 'outline' ? 'checked' : ''} style="display: none;">
                                <span data-i18n="featuredProduct.buyButtons.outline">Outline</span>
                            </label>
                        </div>
                    </div>
                    
                    <!-- Dynamic checkout button style -->
                    <div class="form-group" style="margin-top: 20px;">
                        <label style="font-size: 13px; font-weight: 500; margin-bottom: 12px; color: #5c5e60; display: block;" 
                               data-i18n="featuredProduct.buyButtons.dynamicCheckoutStyle">Dynamic checkout button style</label>
                        <div style="display: flex; gap: 12px;">
                            <label class="radio-option-card" style="flex: 1; padding: 12px; border: 2px solid ${config.dynamicCheckoutStyle !== 'outline' ? '#2962ff' : '#e0e0e0'}; border-radius: 8px; cursor: pointer; text-align: center;">
                                <input type="radio" name="dynamic-checkout-style" value="solid" ${config.dynamicCheckoutStyle !== 'outline' ? 'checked' : ''} style="display: none;">
                                <span data-i18n="featuredProduct.buyButtons.solid">Solid</span>
                            </label>
                            <label class="radio-option-card" style="flex: 1; padding: 12px; border: 2px solid ${config.dynamicCheckoutStyle === 'outline' ? '#2962ff' : '#e0e0e0'}; border-radius: 8px; cursor: pointer; text-align: center;">
                                <input type="radio" name="dynamic-checkout-style" value="outline" ${config.dynamicCheckoutStyle === 'outline' ? 'checked' : ''} style="display: none;">
                                <span data-i18n="featuredProduct.buyButtons.outline">Outline</span>
                            </label>
                        </div>
                    </div>
                    
                </div>
            </div>
        `;
    },
    
    attachBuyButtonsEventListeners: function() {
        // Apply translations
        setTimeout(applyTranslations, 0);
        
        // Back button - regresa al panel lateral principal (blockList)
        $('.back-to-sections-btn').off('click.buybuttons').on('click.buybuttons', function() {
            window.switchSidebarView('blockList');
        });
        
        // Helper function para actualizar configuración de buy buttons
        const updateBuyButtonsConfig = (key, value) => {
            if (!window.currentSectionsConfig.featuredProduct) {
                window.currentSectionsConfig.featuredProduct = {};
            }
            if (!window.currentSectionsConfig.featuredProduct.blocks) {
                window.currentSectionsConfig.featuredProduct.blocks = {};
            }
            if (!window.currentSectionsConfig.featuredProduct.blocks.buyButtons) {
                window.currentSectionsConfig.featuredProduct.blocks.buyButtons = {
                    type: 'buy-buttons',
                    isHidden: false
                };
            }
            
            window.currentSectionsConfig.featuredProduct.blocks.buyButtons[key] = value;
            
            // IMPORTANTE: Usar la función setter correcta
            window.setHasPendingPageStructureChanges(true);
            window.updateSaveButtonState();
            window.renderPreview();
        };
        
        // Toggle: Show dynamic checkout
        $('#buy-buttons-show-dynamic').off('change.buybuttons').on('change.buybuttons', function() {
            updateBuyButtonsConfig('showDynamicCheckout', $(this).is(':checked'));
        });
        
        // Toggle: Enable pickup availability
        $('#buy-buttons-enable-pickup').off('change.buybuttons').on('change.buybuttons', function() {
            updateBuyButtonsConfig('enablePickupAvailability', $(this).is(':checked'));
        });
        
        // Toggle: Show recipient form
        $('#buy-buttons-show-recipient').off('change.buybuttons').on('change.buybuttons', function() {
            updateBuyButtonsConfig('showRecipientForm', $(this).is(':checked'));
        });
        
        // Radio: Add to cart style
        $('input[name="add-to-cart-style"]').off('change.buybuttons').on('change.buybuttons', function() {
            const selectedStyle = $(this).val();
            updateBuyButtonsConfig('addToCartStyle', selectedStyle);
            
            // Update visual state
            $('.radio-option-card').each(function() {
                const $card = $(this);
                const $radio = $card.find('input[type="radio"]');
                if ($radio.attr('name') === 'add-to-cart-style') {
                    $card.css('border-color', $radio.is(':checked') ? '#2962ff' : '#e0e0e0');
                }
            });
        });
        
        // Radio: Dynamic checkout style
        $('input[name="dynamic-checkout-style"]').off('change.buybuttons').on('change.buybuttons', function() {
            const selectedStyle = $(this).val();
            updateBuyButtonsConfig('dynamicCheckoutStyle', selectedStyle);
            
            // Update visual state
            $('.radio-option-card').each(function() {
                const $card = $(this);
                const $radio = $card.find('input[type="radio"]');
                if ($radio.attr('name') === 'dynamic-checkout-style') {
                    $card.css('border-color', $radio.is(':checked') ? '#2962ff' : '#e0e0e0');
                }
            });
        });
        
        // Menu button
        $('.buy-buttons-menu-btn').off('click.buybuttons').on('click.buybuttons', function(e) {
            e.preventDefault();
            // TODO: Mostrar menú de opciones adicionales
            console.log('Show buy buttons menu');
        });
    },
    
    // Price configuration view
    renderPriceSettings: function(configData) {
        const config = configData || {};
        
        return `
            <div style="display: flex; flex-direction: column; height: 100%; position: relative; overflow: hidden;">
                <!-- Header con flecha de regreso -->
                <div class="sidebar-view-header" style="position: relative; z-index: 10;">
                    <button class="back-to-sections-btn">
                        <i class="material-icons">arrow_back</i>
                    </button>
                    <h3 data-i18n="featuredProduct.price.title">Price</h3>
                    <button class="price-menu-btn" style="position: absolute; right: 10px; top: 10px; background: none; border: none; cursor: pointer; padding: 5px;">
                        <i class="material-icons">more_vert</i>
                    </button>
                </div>
                
                <!-- Contenido con scroll -->
                <div style="padding: 20px; overflow-y: auto; overflow-x: hidden; flex: 1; height: calc(100% - 60px); box-sizing: border-box;">
                    
                    <!-- Price label size -->
                    <div class="form-group">
                        <label style="font-size: 13px; font-weight: 500; margin-bottom: 8px; color: #5c5e60; display: block;" 
                               data-i18n="featuredProduct.price.labelSize">Price label size</label>
                        <select class="shopify-select" id="price-label-size" 
                                style="width: 100%; padding: 8px 12px; border: 1px solid #e0e0e0; border-radius: 4px; background: white;">
                            <option value="extra-small" ${config.labelSize === 'extra-small' ? 'selected' : ''} 
                                    data-i18n="featuredProduct.price.extraSmall">Extra small</option>
                            <option value="small" ${config.labelSize === 'small' ? 'selected' : ''} 
                                    data-i18n="featuredProduct.price.small">Small</option>
                            <option value="medium" ${config.labelSize === 'medium' || !config.labelSize ? 'selected' : ''} 
                                    data-i18n="featuredProduct.price.medium">Medium</option>
                            <option value="large" ${config.labelSize === 'large' ? 'selected' : ''} 
                                    data-i18n="featuredProduct.price.large">Large</option>
                            <option value="extra-large" ${config.labelSize === 'extra-large' ? 'selected' : ''} 
                                    data-i18n="featuredProduct.price.extraLarge">Extra large</option>
                            <option value="double-extra-large" ${config.labelSize === 'double-extra-large' ? 'selected' : ''} 
                                    data-i18n="featuredProduct.price.doubleExtraLarge">Double extra large</option>
                        </select>
                    </div>
                    
                    <!-- Toggle: Show taxes -->
                    <div class="form-group" style="margin-top: 20px;">
                        <label class="toggle-field">
                            <span data-i18n="featuredProduct.price.showTaxes">Show taxes</span>
                            <input type="checkbox" class="shopify-toggle" id="price-show-taxes" ${config.showTaxes ? 'checked' : ''}>
                            <label for="price-show-taxes" class="toggle-slider"></label>
                        </label>
                    </div>
                    
                    <!-- Toggle: Show 'Sale' badge -->
                    <div class="form-group" style="margin-top: 20px;">
                        <label class="toggle-field">
                            <span data-i18n="featuredProduct.price.showSaleBadge">Show 'Sale' badge next to price</span>
                            <input type="checkbox" class="shopify-toggle" id="price-show-sale-badge" ${config.showSaleBadge ? 'checked' : ''}>
                            <label for="price-show-sale-badge" class="toggle-slider"></label>
                        </label>
                    </div>
                    
                    <!-- Toggle: Highlight sale price -->
                    <div class="form-group" style="margin-top: 20px;">
                        <label class="toggle-field">
                            <span data-i18n="featuredProduct.price.highlightSalePrice">Highlight sale price</span>
                            <input type="checkbox" class="shopify-toggle" id="price-highlight-sale" ${config.highlightSalePrice ? 'checked' : ''}>
                            <label for="price-highlight-sale" class="toggle-slider"></label>
                        </label>
                        <div style="font-size: 12px; color: #666; margin-top: 5px; margin-left: 0;">
                            <a href="#" style="color: #2962ff; text-decoration: underline;" 
                               data-i18n="featuredProduct.price.forProductsOnSale">For the products on sale only</a>
                        </div>
                    </div>
                    
                </div>
            </div>
        `;
    },
    
    attachPriceEventListeners: function() {
        // Apply translations
        setTimeout(applyTranslations, 0);
        
        // Back button - regresa al panel lateral principal (blockList)
        $('.back-to-sections-btn').off('click.price').on('click.price', function() {
            window.switchSidebarView('blockList');
        });
        
        // Helper function para actualizar configuración de price
        const updatePriceConfig = (key, value) => {
            if (!window.currentSectionsConfig.featuredProduct) {
                window.currentSectionsConfig.featuredProduct = {};
            }
            if (!window.currentSectionsConfig.featuredProduct.blocks) {
                window.currentSectionsConfig.featuredProduct.blocks = {};
            }
            if (!window.currentSectionsConfig.featuredProduct.blocks.price) {
                window.currentSectionsConfig.featuredProduct.blocks.price = {
                    type: 'price',
                    isHidden: false
                };
            }
            
            window.currentSectionsConfig.featuredProduct.blocks.price[key] = value;
            
            // IMPORTANTE: Usar la función setter correcta
            window.setHasPendingPageStructureChanges(true);
            window.updateSaveButtonState();
            window.renderPreview();
        };
        
        // Select: Price label size
        $('#price-label-size').off('change.price').on('change.price', function() {
            updatePriceConfig('labelSize', $(this).val());
        });
        
        // Toggle: Show taxes
        $('#price-show-taxes').off('change.price').on('change.price', function() {
            updatePriceConfig('showTaxes', $(this).is(':checked'));
        });
        
        // Toggle: Show sale badge
        $('#price-show-sale-badge').off('change.price').on('change.price', function() {
            updatePriceConfig('showSaleBadge', $(this).is(':checked'));
        });
        
        // Toggle: Highlight sale price
        $('#price-highlight-sale').off('change.price').on('change.price', function() {
            updatePriceConfig('highlightSalePrice', $(this).is(':checked'));
        });
        
        // Link: For products on sale only
        $('a[data-i18n="featuredProduct.price.forProductsOnSale"]').off('click.price').on('click.price', function(e) {
            e.preventDefault();
            // TODO: Implementar funcionalidad o mostrar información
            console.log('Show info about sale products');
        });
        
        // Menu button
        $('.price-menu-btn').off('click.price').on('click.price', function(e) {
            e.preventDefault();
            // TODO: Mostrar menú de opciones adicionales
            console.log('Show price menu');
        });
    },
    
    // Inventory Status configuration view
    renderInventoryStatusSettings: function(configData) {
        const config = configData || {};
        
        return `
            <div style="display: flex; flex-direction: column; height: 100%; position: relative; overflow: hidden;">
                <!-- Header con flecha de regreso -->
                <div class="sidebar-view-header" style="position: relative; z-index: 10;">
                    <button class="back-to-sections-btn">
                        <i class="material-icons">arrow_back</i>
                    </button>
                    <h3 data-i18n="featuredProduct.inventoryStatus.title">Inventory status</h3>
                    <button class="inventory-status-menu-btn" style="position: absolute; right: 10px; top: 10px; background: none; border: none; cursor: pointer; padding: 5px;">
                        <i class="material-icons">more_vert</i>
                    </button>
                </div>
                
                <!-- Contenido con scroll -->
                <div style="padding: 20px; overflow-y: auto; overflow-x: hidden; flex: 1; height: calc(100% - 60px); box-sizing: border-box;">
                    
                    <!-- Show status -->
                    <div class="form-group">
                        <label style="font-size: 13px; font-weight: 500; margin-bottom: 8px; color: #5c5e60; display: block;" 
                               data-i18n="featuredProduct.inventoryStatus.showStatus">Show status</label>
                        <select class="shopify-select" id="inventory-show-status" 
                                style="width: 100%; padding: 8px 12px; border: 1px solid #e0e0e0; border-radius: 4px; background: white;">
                            <option value="always" ${config.showStatus === 'always' || !config.showStatus ? 'selected' : ''} 
                                    data-i18n="featuredProduct.inventoryStatus.always">Always</option>
                            <option value="low-inventory" ${config.showStatus === 'low-inventory' ? 'selected' : ''} 
                                    data-i18n="featuredProduct.inventoryStatus.lowInventoryOnly">Low inventory only</option>
                            <option value="never" ${config.showStatus === 'never' ? 'selected' : ''} 
                                    data-i18n="featuredProduct.inventoryStatus.never">Never</option>
                        </select>
                    </div>
                    
                    <!-- Low inventory threshold -->
                    <div class="form-group" style="margin-top: 20px;">
                        <label style="font-size: 13px; font-weight: 500; margin-bottom: 8px; color: #5c5e60; display: block;" 
                               data-i18n="featuredProduct.inventoryStatus.lowInventoryThreshold">Low inventory threshold</label>
                        <div style="display: flex; align-items: center; gap: 12px;">
                            <input type="range" id="inventory-threshold-slider" 
                                   min="0" max="100" value="${config.lowInventoryThreshold || 5}"
                                   style="flex: 1;">
                            <input type="number" id="inventory-threshold-input" 
                                   value="${config.lowInventoryThreshold || 5}" min="0" max="100"
                                   style="width: 60px; padding: 8px 12px; border: 1px solid #e0e0e0; border-radius: 4px;">
                        </div>
                    </div>
                    
                    <!-- High inventory label -->
                    <div class="form-group" style="margin-top: 20px;">
                        <label style="font-size: 13px; font-weight: 500; margin-bottom: 8px; color: #5c5e60; display: block;" 
                               data-i18n="featuredProduct.inventoryStatus.highInventoryLabel">High inventory label</label>
                        <input type="text" 
                               id="inventory-high-label" 
                               value="${config.highInventoryLabel || 'Many in stock'}"
                               placeholder="Many in stock"
                               data-i18n-placeholder="featuredProduct.inventoryStatus.highInventoryPlaceholder"
                               style="width: 100%; padding: 8px 12px; border: 1px solid #e0e0e0; border-radius: 4px;">
                    </div>
                    
                    <!-- Low inventory label -->
                    <div class="form-group" style="margin-top: 20px;">
                        <label style="font-size: 13px; font-weight: 500; margin-bottom: 8px; color: #5c5e60; display: block;" 
                               data-i18n="featuredProduct.inventoryStatus.lowInventoryLabel">Low inventory label</label>
                        <input type="text" 
                               id="inventory-low-label" 
                               value="${config.lowInventoryLabel || 'Act now, few in stock!'}"
                               placeholder="Act now, few in stock!"
                               data-i18n-placeholder="featuredProduct.inventoryStatus.lowInventoryPlaceholder"
                               style="width: 100%; padding: 8px 12px; border: 1px solid #e0e0e0; border-radius: 4px;">
                    </div>
                    
                    <!-- Toggle: Show inventory counter -->
                    <div class="form-group" style="margin-top: 20px;">
                        <label class="toggle-field">
                            <span data-i18n="featuredProduct.inventoryStatus.showInventoryCounter">Show inventory counter</span>
                            <input type="checkbox" class="shopify-toggle" id="inventory-show-counter" ${config.showInventoryCounter ? 'checked' : ''}>
                            <label for="inventory-show-counter" class="toggle-slider"></label>
                        </label>
                        <div style="font-size: 12px; color: #666; margin-top: 5px; margin-left: 0;">
                            <span data-i18n="featuredProduct.inventoryStatus.counterPriority">Counter has priority over labels</span>
                        </div>
                    </div>
                    
                    <!-- Colors section -->
                    <div style="margin-top: 30px;">
                        <h4 style="font-size: 14px; font-weight: 500; margin-bottom: 16px; color: #202223;" 
                            data-i18n="featuredProduct.inventoryStatus.colors">Colors</h4>
                        
                        <!-- High inventory color -->
                        <div class="form-group">
                            <label style="font-size: 13px; font-weight: 500; margin-bottom: 8px; color: #5c5e60; display: block;" 
                                   data-i18n="featuredProduct.inventoryStatus.highInventory">High inventory</label>
                            <div style="display: flex; align-items: center; gap: 12px;">
                                <input type="color" id="inventory-high-color" 
                                       value="${config.highInventoryColor || '#00BA00'}"
                                       style="width: 40px; height: 40px; border: 1px solid #e0e0e0; border-radius: 4px; cursor: pointer;">
                                <input type="text" id="inventory-high-color-text" 
                                       value="${config.highInventoryColor || '#00BA00'}"
                                       style="flex: 1; padding: 8px 12px; border: 1px solid #e0e0e0; border-radius: 4px;">
                            </div>
                        </div>
                        
                        <!-- Low inventory color -->
                        <div class="form-group" style="margin-top: 20px;">
                            <label style="font-size: 13px; font-weight: 500; margin-bottom: 8px; color: #5c5e60; display: block;" 
                                   data-i18n="featuredProduct.inventoryStatus.lowInventory">Low inventory</label>
                            <div style="display: flex; align-items: center; gap: 12px;">
                                <input type="color" id="inventory-low-color" 
                                       value="${config.lowInventoryColor || '#FF0000'}"
                                       style="width: 40px; height: 40px; border: 1px solid #e0e0e0; border-radius: 4px; cursor: pointer;">
                                <input type="text" id="inventory-low-color-text" 
                                       value="${config.lowInventoryColor || '#FF0000'}"
                                       style="flex: 1; padding: 8px 12px; border: 1px solid #e0e0e0; border-radius: 4px;">
                            </div>
                        </div>
                    </div>
                    
                    <!-- Toggle: Color label and counter -->
                    <div class="form-group" style="margin-top: 20px;">
                        <label class="toggle-field">
                            <span data-i18n="featuredProduct.inventoryStatus.colorLabelAndCounter">Color label and counter</span>
                            <input type="checkbox" class="shopify-toggle" id="inventory-color-label-counter" ${config.colorLabelAndCounter ? 'checked' : ''}>
                            <label for="inventory-color-label-counter" class="toggle-slider"></label>
                        </label>
                    </div>
                    
                </div>
            </div>
        `;
    },
    
    attachInventoryStatusEventListeners: function() {
        // Apply translations
        setTimeout(applyTranslations, 0);
        
        // Back button - regresa al panel lateral principal (blockList)
        $('.back-to-sections-btn').off('click.inventory').on('click.inventory', function() {
            window.switchSidebarView('blockList');
        });
        
        // Helper function para actualizar configuración de inventory status
        const updateInventoryConfig = (key, value) => {
            if (!window.currentSectionsConfig.featuredProduct) {
                window.currentSectionsConfig.featuredProduct = {};
            }
            if (!window.currentSectionsConfig.featuredProduct.blocks) {
                window.currentSectionsConfig.featuredProduct.blocks = {};
            }
            if (!window.currentSectionsConfig.featuredProduct.blocks.inventoryStatus) {
                window.currentSectionsConfig.featuredProduct.blocks.inventoryStatus = {
                    type: 'inventory-status',
                    isHidden: false
                };
            }
            
            window.currentSectionsConfig.featuredProduct.blocks.inventoryStatus[key] = value;
            
            // IMPORTANTE: Usar la función setter correcta
            window.setHasPendingPageStructureChanges(true);
            window.updateSaveButtonState();
            window.renderPreview();
        };
        
        // Select: Show status
        $('#inventory-show-status').off('change.inventory').on('change.inventory', function() {
            updateInventoryConfig('showStatus', $(this).val());
        });
        
        // Slider and input sync for threshold
        $('#inventory-threshold-slider').off('input.inventory').on('input.inventory', function() {
            const value = $(this).val();
            $('#inventory-threshold-input').val(value);
            updateInventoryConfig('lowInventoryThreshold', parseInt(value));
        });
        
        $('#inventory-threshold-input').off('input.inventory').on('input.inventory', function() {
            const value = $(this).val();
            $('#inventory-threshold-slider').val(value);
            updateInventoryConfig('lowInventoryThreshold', parseInt(value));
        });
        
        // Input: High inventory label
        $('#inventory-high-label').off('input.inventory').on('input.inventory', function() {
            updateInventoryConfig('highInventoryLabel', $(this).val());
        });
        
        // Input: Low inventory label
        $('#inventory-low-label').off('input.inventory').on('input.inventory', function() {
            updateInventoryConfig('lowInventoryLabel', $(this).val());
        });
        
        // Toggle: Show inventory counter
        $('#inventory-show-counter').off('change.inventory').on('change.inventory', function() {
            updateInventoryConfig('showInventoryCounter', $(this).is(':checked'));
        });
        
        // Color pickers sync
        $('#inventory-high-color').off('input.inventory').on('input.inventory', function() {
            const value = $(this).val();
            $('#inventory-high-color-text').val(value);
            updateInventoryConfig('highInventoryColor', value);
        });
        
        $('#inventory-high-color-text').off('input.inventory').on('input.inventory', function() {
            const value = $(this).val();
            if (/^#[0-9A-F]{6}$/i.test(value)) {
                $('#inventory-high-color').val(value);
                updateInventoryConfig('highInventoryColor', value);
            }
        });
        
        $('#inventory-low-color').off('input.inventory').on('input.inventory', function() {
            const value = $(this).val();
            $('#inventory-low-color-text').val(value);
            updateInventoryConfig('lowInventoryColor', value);
        });
        
        $('#inventory-low-color-text').off('input.inventory').on('input.inventory', function() {
            const value = $(this).val();
            if (/^#[0-9A-F]{6}$/i.test(value)) {
                $('#inventory-low-color').val(value);
                updateInventoryConfig('lowInventoryColor', value);
            }
        });
        
        // Toggle: Color label and counter
        $('#inventory-color-label-counter').off('change.inventory').on('change.inventory', function() {
            updateInventoryConfig('colorLabelAndCounter', $(this).is(':checked'));
        });
        
        // Menu button
        $('.inventory-status-menu-btn').off('click.inventory').on('click.inventory', function(e) {
            e.preventDefault();
            // TODO: Mostrar menú de opciones adicionales
            console.log('Show inventory status menu');
        });
    },
    
    // Title configuration view
    renderTitleSettings: function(configData) {
        const config = configData || {};
        
        return `
            <div style="display: flex; flex-direction: column; height: 100%; position: relative; overflow: hidden;">
                <!-- Header con flecha de regreso -->
                <div class="sidebar-view-header" style="position: relative; z-index: 10;">
                    <button class="back-to-sections-btn">
                        <i class="material-icons">arrow_back</i>
                    </button>
                    <h3 data-i18n="featuredProduct.title.title">Title</h3>
                    <button class="title-menu-btn" style="position: absolute; right: 10px; top: 10px; background: none; border: none; cursor: pointer; padding: 5px;">
                        <i class="material-icons">more_vert</i>
                    </button>
                </div>
                
                <!-- Contenido con scroll -->
                <div style="padding: 20px; overflow-y: auto; overflow-x: hidden; flex: 1; height: calc(100% - 60px); box-sizing: border-box;">
                    
                    <!-- Heading size -->
                    <div class="form-group">
                        <label style="font-size: 13px; font-weight: 500; margin-bottom: 8px; color: #5c5e60; display: block;" 
                               data-i18n="featuredProduct.title.headingSize">Heading size</label>
                        <select class="shopify-select" id="title-heading-size" 
                                style="width: 100%; padding: 8px 12px; border: 1px solid #e0e0e0; border-radius: 4px; background: white;">
                            <option value="h1" ${config.headingSize === 'h1' ? 'selected' : ''} 
                                    data-i18n="featuredProduct.title.heading1">Heading 1</option>
                            <option value="h2" ${config.headingSize === 'h2' || !config.headingSize ? 'selected' : ''} 
                                    data-i18n="featuredProduct.title.heading2">Heading 2</option>
                            <option value="h3" ${config.headingSize === 'h3' ? 'selected' : ''} 
                                    data-i18n="featuredProduct.title.heading3">Heading 3</option>
                            <option value="h4" ${config.headingSize === 'h4' ? 'selected' : ''} 
                                    data-i18n="featuredProduct.title.heading4">Heading 4</option>
                            <option value="h5" ${config.headingSize === 'h5' ? 'selected' : ''} 
                                    data-i18n="featuredProduct.title.heading5">Heading 5</option>
                            <option value="h6" ${config.headingSize === 'h6' ? 'selected' : ''} 
                                    data-i18n="featuredProduct.title.heading6">Heading 6</option>
                        </select>
                    </div>
                    
                </div>
            </div>
        `;
    },
    
    attachTitleEventListeners: function() {
        // Apply translations
        setTimeout(applyTranslations, 0);
        
        // Back button - regresa al panel lateral principal (blockList)
        $('.back-to-sections-btn').off('click.title').on('click.title', function() {
            window.switchSidebarView('blockList');
        });
        
        // Helper function para actualizar configuración de title
        const updateTitleConfig = (key, value) => {
            if (!window.currentSectionsConfig.featuredProduct) {
                window.currentSectionsConfig.featuredProduct = {};
            }
            if (!window.currentSectionsConfig.featuredProduct.blocks) {
                window.currentSectionsConfig.featuredProduct.blocks = {};
            }
            if (!window.currentSectionsConfig.featuredProduct.blocks.title) {
                window.currentSectionsConfig.featuredProduct.blocks.title = {
                    type: 'title',
                    isHidden: false
                };
            }
            
            window.currentSectionsConfig.featuredProduct.blocks.title[key] = value;
            
            // IMPORTANTE: Usar la función setter correcta
            window.setHasPendingPageStructureChanges(true);
            window.updateSaveButtonState();
            window.renderPreview();
        };
        
        // Select: Heading size
        $('#title-heading-size').off('change.title').on('change.title', function() {
            updateTitleConfig('headingSize', $(this).val());
        });
        
        // Menu button
        $('.title-menu-btn').off('click.title').on('click.title', function(e) {
            e.preventDefault();
            // TODO: Mostrar menú de opciones adicionales
            console.log('Show title menu');
        });
    },
    
    // Variant Picker configuration view
    renderVariantPickerSettings: function(configData) {
        const config = configData || {};
        
        return `
            <div style="display: flex; flex-direction: column; height: 100%; position: relative; overflow: hidden;">
                <!-- Header con flecha de regreso -->
                <div class="sidebar-view-header" style="position: relative; z-index: 10;">
                    <button class="back-to-sections-btn">
                        <i class="material-icons">arrow_back</i>
                    </button>
                    <h3 data-i18n="featuredProduct.variantPicker.title">Variant picker</h3>
                    <button class="variant-picker-menu-btn" style="position: absolute; right: 10px; top: 10px; background: none; border: none; cursor: pointer; padding: 5px;">
                        <i class="material-icons">more_vert</i>
                    </button>
                </div>
                
                <!-- Contenido con scroll -->
                <div style="padding: 20px; overflow-y: auto; overflow-x: hidden; flex: 1; height: calc(100% - 60px); box-sizing: border-box;">
                    
                    <!-- Option type -->
                    <div class="form-group">
                        <label style="font-size: 13px; font-weight: 500; margin-bottom: 8px; color: #5c5e60; display: block;" 
                               data-i18n="featuredProduct.variantPicker.optionType">Option type</label>
                        <select class="shopify-select" id="variant-option-type" 
                                style="width: 100%; padding: 8px 12px; border: 1px solid #e0e0e0; border-radius: 4px; background: white;">
                            <option value="buttons-solid" ${config.optionType === 'buttons-solid' || !config.optionType ? 'selected' : ''} 
                                    data-i18n="featuredProduct.variantPicker.buttonsSolid">Buttons solid</option>
                            <option value="buttons-outline" ${config.optionType === 'buttons-outline' ? 'selected' : ''} 
                                    data-i18n="featuredProduct.variantPicker.buttonsOutline">Buttons outline</option>
                            <option value="buttons-underline" ${config.optionType === 'buttons-underline' ? 'selected' : ''} 
                                    data-i18n="featuredProduct.variantPicker.buttonsUnderline">Buttons underline</option>
                            <option value="dropdown-solid" ${config.optionType === 'dropdown-solid' ? 'selected' : ''} 
                                    data-i18n="featuredProduct.variantPicker.dropdownSolid">Dropdown solid</option>
                            <option value="dropdown-outline" ${config.optionType === 'dropdown-outline' ? 'selected' : ''} 
                                    data-i18n="featuredProduct.variantPicker.dropdownOutline">Dropdown outline</option>
                            <option value="dropdown-underline" ${config.optionType === 'dropdown-underline' ? 'selected' : ''} 
                                    data-i18n="featuredProduct.variantPicker.dropdownUnderline">Dropdown underline</option>
                        </select>
                    </div>
                    
                    <!-- Primary swatch option type -->
                    <div class="form-group" style="margin-top: 20px;">
                        <label style="font-size: 13px; font-weight: 500; margin-bottom: 8px; color: #5c5e60; display: block;" 
                               data-i18n="featuredProduct.variantPicker.primarySwatchType">Primary swatch option type</label>
                        <select class="shopify-select" id="variant-primary-swatch" 
                                style="width: 100%; padding: 8px 12px; border: 1px solid #e0e0e0; border-radius: 4px; background: white;">
                            <option value="swatches" ${config.primarySwatchType === 'swatches' ? 'selected' : ''} 
                                    data-i18n="featuredProduct.variantPicker.swatches">Swatches</option>
                            <option value="variant-images" ${config.primarySwatchType === 'variant-images' || !config.primarySwatchType ? 'selected' : ''} 
                                    data-i18n="featuredProduct.variantPicker.variantImages">Variant images</option>
                            <option value="buttons-solid" ${config.primarySwatchType === 'buttons-solid' ? 'selected' : ''} 
                                    data-i18n="featuredProduct.variantPicker.buttonsSolid">Buttons solid</option>
                            <option value="buttons-outline" ${config.primarySwatchType === 'buttons-outline' ? 'selected' : ''} 
                                    data-i18n="featuredProduct.variantPicker.buttonsOutline">Buttons outline</option>
                            <option value="buttons-underline" ${config.primarySwatchType === 'buttons-underline' ? 'selected' : ''} 
                                    data-i18n="featuredProduct.variantPicker.buttonsUnderline">Buttons underline</option>
                            <option value="dropdown-solid" ${config.primarySwatchType === 'dropdown-solid' ? 'selected' : ''} 
                                    data-i18n="featuredProduct.variantPicker.dropdownSolid">Dropdown solid</option>
                            <option value="dropdown-outline" ${config.primarySwatchType === 'dropdown-outline' ? 'selected' : ''} 
                                    data-i18n="featuredProduct.variantPicker.dropdownOutline">Dropdown outline</option>
                            <option value="dropdown-underline" ${config.primarySwatchType === 'dropdown-underline' ? 'selected' : ''} 
                                    data-i18n="featuredProduct.variantPicker.dropdownUnderline">Dropdown underline</option>
                        </select>
                    </div>
                    
                    <!-- Secondary swatch option type -->
                    <div class="form-group" style="margin-top: 20px;">
                        <label style="font-size: 13px; font-weight: 500; margin-bottom: 8px; color: #5c5e60; display: block;" 
                               data-i18n="featuredProduct.variantPicker.secondarySwatchType">Secondary swatch option type</label>
                        <select class="shopify-select" id="variant-secondary-swatch" 
                                style="width: 100%; padding: 8px 12px; border: 1px solid #e0e0e0; border-radius: 4px; background: white;">
                            <option value="swatches" ${config.secondarySwatchType === 'swatches' || !config.secondarySwatchType ? 'selected' : ''} 
                                    data-i18n="featuredProduct.variantPicker.swatches">Swatches</option>
                            <option value="buttons-solid" ${config.secondarySwatchType === 'buttons-solid' ? 'selected' : ''} 
                                    data-i18n="featuredProduct.variantPicker.buttonsSolid">Buttons solid</option>
                            <option value="buttons-outline" ${config.secondarySwatchType === 'buttons-outline' ? 'selected' : ''} 
                                    data-i18n="featuredProduct.variantPicker.buttonsOutline">Buttons outline</option>
                            <option value="buttons-underline" ${config.secondarySwatchType === 'buttons-underline' ? 'selected' : ''} 
                                    data-i18n="featuredProduct.variantPicker.buttonsUnderline">Buttons underline</option>
                            <option value="dropdown-solid" ${config.secondarySwatchType === 'dropdown-solid' ? 'selected' : ''} 
                                    data-i18n="featuredProduct.variantPicker.dropdownSolid">Dropdown solid</option>
                            <option value="dropdown-outline" ${config.secondarySwatchType === 'dropdown-outline' ? 'selected' : ''} 
                                    data-i18n="featuredProduct.variantPicker.dropdownOutline">Dropdown outline</option>
                            <option value="dropdown-underline" ${config.secondarySwatchType === 'dropdown-underline' ? 'selected' : ''} 
                                    data-i18n="featuredProduct.variantPicker.dropdownUnderline">Dropdown underline</option>
                        </select>
                    </div>
                    
                    <!-- Info text -->
                    <div style="font-size: 12px; color: #666; margin-top: 12px; line-height: 1.4;">
                        <span data-i18n="featuredProduct.variantPicker.swatchInfo">Assign swatches to options and adjust their style in Theme settings->Swatches</span>
                    </div>
                    
                    <!-- Toggle: Hide single-value options -->
                    <div class="form-group" style="margin-top: 20px;">
                        <label class="toggle-field">
                            <span data-i18n="featuredProduct.variantPicker.hideSingleValue">Hide single-value options</span>
                            <input type="checkbox" class="shopify-toggle" id="variant-hide-single" ${config.hideSingleValueOptions ? 'checked' : ''}>
                            <label for="variant-hide-single" class="toggle-slider"></label>
                        </label>
                    </div>
                    
                    <!-- Information drawer section -->
                    <div style="margin-top: 30px;">
                        <h4 style="font-size: 14px; font-weight: 500; margin-bottom: 12px; color: #202223;" 
                            data-i18n="featuredProduct.variantPicker.informationDrawer">Information drawer</h4>
                        
                        <div style="font-size: 12px; color: #666; margin-bottom: 12px;">
                            <span data-i18n="featuredProduct.variantPicker.addSupportingInfo">Add supporting information to option</span>
                        </div>
                        
                        <!-- Option for drawer -->
                        <div class="form-group">
                            <label style="font-size: 13px; font-weight: 500; margin-bottom: 8px; color: #5c5e60; display: block;" 
                                   data-i18n="featuredProduct.variantPicker.optionForDrawer">Option for drawer</label>
                            <input type="text" 
                                   id="variant-drawer-option" 
                                   value="${config.optionForDrawer || ''}"
                                   placeholder="Write the option name the drawer will belong to. Example: size"
                                   data-i18n-placeholder="featuredProduct.variantPicker.optionForDrawerPlaceholder"
                                   style="width: 100%; padding: 8px 12px; border: 1px solid #e0e0e0; border-radius: 4px;">
                        </div>
                        
                        <!-- Drawer label -->
                        <div class="form-group" style="margin-top: 16px;">
                            <label style="font-size: 13px; font-weight: 500; margin-bottom: 8px; color: #5c5e60; display: block;" 
                                   data-i18n="featuredProduct.variantPicker.drawerLabel">Drawer label</label>
                            <input type="text" 
                                   id="variant-drawer-label" 
                                   value="${config.drawerLabel || ''}"
                                   placeholder="Size Guide"
                                   data-i18n-placeholder="featuredProduct.variantPicker.drawerLabelPlaceholder"
                                   style="width: 100%; padding: 8px 12px; border: 1px solid #e0e0e0; border-radius: 4px; margin-bottom: 8px;">
                            <div style="font-size: 12px; color: #666;">
                                <span data-i18n="featuredProduct.variantPicker.drawerIntro">Introduce the information in the drawer. Example: Size Guide</span>
                            </div>
                        </div>
                        
                        <!-- Source -->
                        <div class="form-group" style="margin-top: 16px;">
                            <label style="font-size: 13px; font-weight: 500; margin-bottom: 8px; color: #5c5e60; display: block;" 
                                   data-i18n="featuredProduct.variantPicker.source">Source</label>
                        </div>
                        
                        <!-- Rich text -->
                        <div class="form-group">
                            <label style="font-size: 13px; font-weight: 500; margin-bottom: 8px; color: #5c5e60; display: block;" 
                                   data-i18n="featuredProduct.variantPicker.richText">Rich text</label>
                            <div style="border: 1px solid #e0e0e0; border-radius: 4px; padding: 8px; background: white;">
                                <div style="display: flex; gap: 4px; padding: 4px 0; border-bottom: 1px solid #e0e0e0; margin-bottom: 8px;">
                                    <button type="button" class="text-format-btn" data-format="code" style="padding: 4px 8px; background: none; border: none; cursor: pointer;">
                                        <i class="material-icons" style="font-size: 18px;">code</i>
                                    </button>
                                    <button type="button" class="text-format-btn" data-format="font" style="padding: 4px 8px; background: none; border: none; cursor: pointer;">
                                        <span style="font-size: 14px;">Aa</span>
                                    </button>
                                    <button type="button" class="text-format-btn" data-format="bold" style="padding: 4px 8px; background: none; border: none; cursor: pointer;">
                                        <i class="material-icons" style="font-size: 18px;">format_bold</i>
                                    </button>
                                    <button type="button" class="text-format-btn" data-format="italic" style="padding: 4px 8px; background: none; border: none; cursor: pointer;">
                                        <i class="material-icons" style="font-size: 18px;">format_italic</i>
                                    </button>
                                    <button type="button" class="text-format-btn" data-format="link" style="padding: 4px 8px; background: none; border: none; cursor: pointer;">
                                        <i class="material-icons" style="font-size: 18px;">link</i>
                                    </button>
                                    <button type="button" class="text-format-btn" data-format="list-bullet" style="padding: 4px 8px; background: none; border: none; cursor: pointer;">
                                        <i class="material-icons" style="font-size: 18px;">format_list_bulleted</i>
                                    </button>
                                    <button type="button" class="text-format-btn" data-format="list-number" style="padding: 4px 8px; background: none; border: none; cursor: pointer;">
                                        <i class="material-icons" style="font-size: 18px;">format_list_numbered</i>
                                    </button>
                                </div>
                                <textarea id="variant-rich-text" 
                                          style="width: 100%; border: none; outline: none; min-height: 100px; resize: vertical;"
                                          placeholder="Enter content...">${config.richTextContent || ''}</textarea>
                            </div>
                        </div>
                        
                        <!-- Page selector -->
                        <div class="form-group" style="margin-top: 16px;">
                            <label style="font-size: 13px; font-weight: 500; margin-bottom: 8px; color: #5c5e60; display: block;" 
                                   data-i18n="featuredProduct.variantPicker.page">Page</label>
                            <div style="display: flex; align-items: center; gap: 8px;">
                                <input type="text" 
                                       id="variant-page-selected" 
                                       value="${config.selectedPage || ''}"
                                       readonly
                                       style="flex: 1; padding: 8px 12px; border: 1px solid #e0e0e0; border-radius: 4px; background: #f5f5f5;">
                                <button type="button" id="variant-select-page-btn" 
                                        style="padding: 8px 16px; background: white; border: 1px solid #e0e0e0; border-radius: 4px; cursor: pointer;">
                                    <span data-i18n="common.select">Seleccionar</span>
                                </button>
                            </div>
                        </div>
                        
                        <!-- Image -->
                        <div class="form-group" style="margin-top: 16px;">
                            <label style="font-size: 13px; font-weight: 500; margin-bottom: 8px; color: #5c5e60; display: block;" 
                                   data-i18n="featuredProduct.variantPicker.image">Image</label>
                            <div style="display: flex; align-items: center; gap: 8px;">
                                <div style="flex: 1; padding: 40px 20px; border: 2px dashed #e0e0e0; border-radius: 8px; text-align: center; background: #fafafa;">
                                    ${config.selectedImage ? 
                                        `<img src="${config.selectedImage}" alt="Selected" style="max-width: 100%; max-height: 100px;">` : 
                                        `<span style="color: #666;" data-i18n="featuredProduct.variantPicker.exploreImages">Explorar imágenes gratuitas</span>`
                                    }
                                </div>
                                <button type="button" id="variant-select-image-btn" 
                                        style="padding: 8px 16px; background: white; border: 1px solid #e0e0e0; border-radius: 4px; cursor: pointer;">
                                    <span data-i18n="common.select">Seleccionar</span>
                                </button>
                            </div>
                        </div>
                        
                        <!-- Video -->
                        <div class="form-group" style="margin-top: 16px;">
                            <label style="font-size: 13px; font-weight: 500; margin-bottom: 8px; color: #5c5e60; display: block;" 
                                   data-i18n="featuredProduct.variantPicker.video">Video</label>
                            <div style="display: flex; align-items: center; gap: 8px;">
                                <input type="text" 
                                       id="variant-video-selected" 
                                       value="${config.selectedVideo || ''}"
                                       readonly
                                       style="flex: 1; padding: 8px 12px; border: 1px solid #e0e0e0; border-radius: 4px; background: #f5f5f5;">
                                <button type="button" id="variant-select-video-btn" 
                                        style="padding: 8px 16px; background: white; border: 1px solid #e0e0e0; border-radius: 4px; cursor: pointer;">
                                    <span data-i18n="common.select">Seleccionar</span>
                                </button>
                            </div>
                        </div>
                        
                        <!-- Desktop image size -->
                        <div class="form-group" style="margin-top: 16px;">
                            <label style="font-size: 13px; font-weight: 500; margin-bottom: 8px; color: #5c5e60; display: block;" 
                                   data-i18n="featuredProduct.variantPicker.desktopImageSize">Desktop image size</label>
                            <div style="display: flex; align-items: center; gap: 12px;">
                                <input type="range" id="variant-desktop-size-slider" 
                                       min="50" max="100" value="${config.desktopImageSize || 60}"
                                       style="flex: 1;">
                                <div style="display: flex; align-items: center; gap: 4px;">
                                    <input type="number" id="variant-desktop-size-input" 
                                           value="${config.desktopImageSize || 60}" min="50" max="100"
                                           style="width: 50px; padding: 4px 8px; border: 1px solid #e0e0e0; border-radius: 4px;">
                                    <span style="color: #666;">%</span>
                                </div>
                            </div>
                        </div>
                        
                    </div>
                    
                </div>
            </div>
        `;
    },
    
    attachVariantPickerEventListeners: function() {
        // Apply translations
        setTimeout(applyTranslations, 0);
        
        // Back button - regresa al panel lateral principal (blockList)
        $('.back-to-sections-btn').off('click.variant').on('click.variant', function() {
            window.switchSidebarView('blockList');
        });
        
        // Helper function para actualizar configuración de variant picker
        const updateVariantConfig = (key, value) => {
            if (!window.currentSectionsConfig.featuredProduct) {
                window.currentSectionsConfig.featuredProduct = {};
            }
            if (!window.currentSectionsConfig.featuredProduct.blocks) {
                window.currentSectionsConfig.featuredProduct.blocks = {};
            }
            if (!window.currentSectionsConfig.featuredProduct.blocks.variantPicker) {
                window.currentSectionsConfig.featuredProduct.blocks.variantPicker = {
                    type: 'variant-picker',
                    isHidden: false
                };
            }
            
            window.currentSectionsConfig.featuredProduct.blocks.variantPicker[key] = value;
            
            // IMPORTANTE: Usar la función setter correcta
            window.setHasPendingPageStructureChanges(true);
            window.updateSaveButtonState();
            window.renderPreview();
        };
        
        // Select: Option type
        $('#variant-option-type').off('change.variant').on('change.variant', function() {
            updateVariantConfig('optionType', $(this).val());
        });
        
        // Select: Primary swatch
        $('#variant-primary-swatch').off('change.variant').on('change.variant', function() {
            updateVariantConfig('primarySwatchType', $(this).val());
        });
        
        // Select: Secondary swatch
        $('#variant-secondary-swatch').off('change.variant').on('change.variant', function() {
            updateVariantConfig('secondarySwatchType', $(this).val());
        });
        
        // Toggle: Hide single value
        $('#variant-hide-single').off('change.variant').on('change.variant', function() {
            updateVariantConfig('hideSingleValueOptions', $(this).is(':checked'));
        });
        
        // Input: Option for drawer
        $('#variant-drawer-option').off('input.variant').on('input.variant', function() {
            updateVariantConfig('optionForDrawer', $(this).val());
        });
        
        // Input: Drawer label
        $('#variant-drawer-label').off('input.variant').on('input.variant', function() {
            updateVariantConfig('drawerLabel', $(this).val());
        });
        
        // Rich text content
        $('#variant-rich-text').off('input.variant').on('input.variant', function() {
            updateVariantConfig('richTextContent', $(this).val());
        });
        
        // Text format buttons
        $('.text-format-btn').off('click.variant').on('click.variant', function() {
            const format = $(this).data('format');
            // TODO: Implement text formatting
            console.log('Format:', format);
        });
        
        // Page selector
        $('#variant-select-page-btn').off('click.variant').on('click.variant', function() {
            // TODO: Implement page selector
            console.log('Select page');
        });
        
        // Image selector
        $('#variant-select-image-btn').off('click.variant').on('click.variant', function() {
            // TODO: Implement image selector
            console.log('Select image');
        });
        
        // Video selector
        $('#variant-select-video-btn').off('click.variant').on('click.variant', function() {
            // TODO: Implement video selector
            console.log('Select video');
        });
        
        // Desktop size slider and input sync
        $('#variant-desktop-size-slider').off('input.variant').on('input.variant', function() {
            const value = $(this).val();
            $('#variant-desktop-size-input').val(value);
            updateVariantConfig('desktopImageSize', parseInt(value));
        });
        
        $('#variant-desktop-size-input').off('input.variant').on('input.variant', function() {
            const value = $(this).val();
            $('#variant-desktop-size-slider').val(value);
            updateVariantConfig('desktopImageSize', parseInt(value));
        });
        
        // Menu button
        $('.variant-picker-menu-btn').off('click.variant').on('click.variant', function(e) {
            e.preventDefault();
            // TODO: Mostrar menú de opciones adicionales
            console.log('Show variant picker menu');
        });
    }
};

// Global function to refresh featured product when product images are reordered
window.refreshFeaturedProductImages = function(productId) {
    console.log('[FeaturedProduct] Global refresh called for product:', productId);
    
    // Check if featured product is using this product
    if (window.currentSectionsConfig && 
        window.currentSectionsConfig.featuredProduct && 
        window.currentSectionsConfig.featuredProduct.selectedProductId === productId) {
        
        console.log('[FeaturedProduct] Refreshing featured product data...');
        window.WebsiteBuilderModules.FeaturedProduct.refreshProductData(productId);
    }
};