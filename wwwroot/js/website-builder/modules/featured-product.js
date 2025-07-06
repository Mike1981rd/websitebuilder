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
                        margin-bottom: 30px;
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
                <div class="container" style="max-width: 1200px; margin: 0 auto;">
                    <div class="product-container" style="display: flex; gap: 40px; align-items: flex-start;">
                        <!-- Product Images Section -->
                        <div class="product-images" style="flex: 1;">
                            ${window.WebsiteBuilderModules.FeaturedProduct.renderProductImages(config)}
                        </div>
                        
                        <!-- Product Info Section -->
                        <div class="product-info-section" style="flex: 1;">
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
                thumbnailsStyle = `display: flex; gap: ${spaceBetween}px; justify-content: center;`;
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
        
        return `
            <div style="${containerStyle}">
                <!-- Thumbnails -->
                ${product.images.length > 1 ? `
                    <div class="product-thumbnails" style="${thumbnailsStyle}">
                        ${product.images.map((img, index) => `
                            <div style="width: ${thumbnailSize}px; height: ${thumbnailSize}px; border-radius: 8px; overflow: hidden; cursor: pointer; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
                                <img src="${img.url}" alt="${img.altText || product.name}" style="width: 100%; height: 100%; object-fit: cover;">
                            </div>
                        `).join('')}
                    </div>
                ` : ''}
                
                <!-- Main Image -->
                <div class="product-main-image" style="${mainImageStyle}">
                    <div style="border-radius: 8px; overflow: hidden; ${this.getImageRatioStyle(config.imageRatio)}">
                        <img src="${mainImage.url}" alt="${mainImage.altText || product.name}" style="width: 100%; height: 100%; ${this.getImageFitStyle(config.imageRatio)}">
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
        
        if (!config.blocks || !config.blockOrder) return '';
        
        let html = '';
        
        // Render blocks in order
        config.blockOrder.forEach(blockId => {
            const block = config.blocks[blockId];
            if (!block || block.isHidden) return;
            
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
                    const description = product?.description || 'Product description goes here. This is where you can add detailed information about your product.';
                    html += `
                        <div style="margin-top: 30px; padding-top: 30px; border-top: 1px solid ${schemeColors.border};">
                            <h3 style="margin-bottom: 15px;">Description</h3>
                            <p style="line-height: 1.6;">${description}</p>
                        </div>
                    `;
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
            desktopSpaceBetween: 20,
            desktopThumbnailSize: 88,
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
                                <option value="1-column-stack" ${configData.desktopLayout === '1-column-stack' ? 'selected' : ''}>1 column stack</option>
                                <option value="2-column-stack" ${configData.desktopLayout === '2-column-stack' ? 'selected' : ''}>2 column stack</option>
                                <option value="1-2-1-column-stack" ${configData.desktopLayout === '1-2-1-column-stack' ? 'selected' : ''}>1-2-1 column stack</option>
                                <option value="1-2-2-column-stack" ${configData.desktopLayout === '1-2-2-column-stack' ? 'selected' : ''}>1-2-2 column stack</option>
                                <option value="2-1-2-column-stack" ${configData.desktopLayout === '2-1-2-column-stack' ? 'selected' : ''}>2-1-2 column stack</option>
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
            description: product.description,
            images: sortedImages,
            variants: product.variants
        };
        
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