// Product Container Module for Website Builder
window.WebsiteBuilderModules = window.WebsiteBuilderModules || {};

window.WebsiteBuilderModules.ProductContainer = {
    // Store loaded products
    cachedProducts: null,
    currentProduct: null,
    // Module configuration
    moduleId: 'product-container',
    moduleName: 'Product Container',
    // Store scroll position
    savedScrollPosition: 0,
    
    // Default configuration for new instances
    getDefaultConfig: function() {
        return {
            id: 'product-container',
            type: 'product-container',
            isHidden: false,
            colorScheme: 'scheme1',
            width: 'large',
            // Sub-sections configuration
            sections: {
                productInfo: {
                    enabled: true,
                    order: 1,
                    layout: 'images-left', // images-left, images-right, stacked
                    config: {
                        colorScheme: 'inherit',
                        desktopLayout: 'thumbnails-left',
                        imageRatio: 'portrait-3-4-fill',
                        enableImageZoom: true,
                        showVendor: true,
                        blocks: {
                            'vendor': { type: 'vendor', isHidden: false },
                            'title': { type: 'title', isHidden: false },
                            'price': { type: 'price', isHidden: false, labelSize: 'medium', highlightSalePrice: true, showSaleBadge: true },
                            'sku': { type: 'sku', isHidden: false },
                            'variant-picker': { type: 'variant-picker', isHidden: false },
                            'inventory-status': { type: 'inventory-status', isHidden: false },
                            'quantity-selector': { type: 'quantity-selector', isHidden: false },
                            'buy-buttons': { 
                                type: 'buy-buttons', 
                                isHidden: false,
                                showAddToCartButton: true,
                                addToCartButtonStyle: 'solid',
                                addToCartButtonText: 'Agregar al carrito',
                                showBuyButton: false,
                                buyButtonStyle: 'solid',
                                buyButtonText: 'Comprar ahora',
                                showReserveButton: false,
                                reserveButtonStyle: 'solid',
                                reserveButtonText: 'Reservar'
                            },
                            'description': { type: 'description', isHidden: false },
                            'share': { type: 'share', isHidden: false }
                        },
                        blockOrder: ['vendor', 'title', 'price', 'sku', 'variant-picker', 'inventory-status', 'quantity-selector', 'buy-buttons', 'description', 'share']
                    }
                },
                imageWithText: {
                    enabled: true,
                    order: 2,
                    config: {
                        title: 'Característica Principal',
                        description: 'Descubre por qué este producto es especial. Diseñado con los mejores materiales y la última tecnología.',
                        buttonText: 'Conoce más',
                        imageUrl: 'https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?w=600&h=400&fit=crop',
                        imagePosition: 'left',
                        colorScheme: 'inherit' // Hereda del container
                    }
                },
                multicolumn: {
                    enabled: true,
                    order: 3,
                    config: {
                        title: '¿Por qué elegir este producto?',
                        columns: [],
                        colorScheme: 'inherit'
                    }
                },
                gallery: {
                    enabled: true,
                    order: 4,
                    config: {
                        title: 'Galería del Producto',
                        layout: 'grid',
                        imagesPerRow: 3,
                        images: [],
                        colorScheme: 'inherit'
                    }
                },
                testimonials: {
                    enabled: true,
                    order: 5,
                    config: {
                        title: 'Lo que dicen nuestros clientes',
                        layout: 'slider',
                        testimonials: [],
                        colorScheme: 'inherit'
                    }
                },
                productTabs: {
                    enabled: true,
                    order: 6,
                    config: {
                        activeTab: 'description',
                        tabs: {
                            description: {
                                title: 'Descripción',
                                content: 'Descripción detallada del producto. Aquí puedes incluir toda la información relevante sobre características, materiales, y beneficios.',
                                enabled: true
                            },
                            specifications: {
                                title: 'Especificaciones',
                                content: 'Dimensiones: 30cm x 20cm x 10cm\nPeso: 500g\nMaterial: Aluminio de alta calidad\nColor: Disponible en varios colores',
                                enabled: true
                            },
                            shipping: {
                                title: 'Envío y Devoluciones',
                                content: 'Envío gratis en pedidos superiores a $50. Entrega en 3-5 días hábiles. Política de devolución de 30 días.',
                                enabled: true
                            }
                        }
                    }
                },
                relatedProducts: {
                    enabled: true,
                    order: 7,
                    config: {
                        title: 'Productos Relacionados',
                        productsToShow: 4,
                        collection: 'all', // Por ahora mostrar todos
                        colorScheme: 'inherit'
                    }
                },
                faq: {
                    enabled: true,
                    order: 8,
                    config: {
                        title: 'Preguntas Frecuentes',
                        items: [],
                        itemOrder: [],
                        colorScheme: 'inherit'
                    }
                }
            }
        };
    },
    
    // Render the product container
    render: function(config) {
        console.log('[PRODUCT-CONTAINER] Render called with config:', config);
        
        if (!config || config.isHidden) return '';
        
        const uniqueId = 'product-container-' + Date.now();
        
        // Get color scheme values with multiple fallbacks - Pattern from Announcement Bar fix
        let schemeColors = { background: '#ffffff', text: '#000000', border: '#e5e5e5' };
        try {
            if (window.getColorSchemeValues) {
                schemeColors = window.getColorSchemeValues(config.colorScheme || 'scheme1');
            } else if (window.parent && window.parent.getColorSchemeValues) {
                schemeColors = window.parent.getColorSchemeValues(config.colorScheme || 'scheme1');
            }
        } catch (e) {
            console.log('[PRODUCT-CONTAINER] Error getting color scheme:', e);
        }
        
        // Check if we're in the product page
        const isProductPage = window.currentPageId === 'product';
        
        // Phase 2: Render product info if enabled
        let productInfoHtml = '';
        try {
            if (config.sections?.productInfo?.enabled) {
                // Use the module reference to maintain context
                productInfoHtml = window.WebsiteBuilderModules.ProductContainer.renderProductInfo(config, schemeColors);
            }
        } catch (e) {
            console.error('[PRODUCT-CONTAINER] Error rendering product info:', e);
            console.error('[PRODUCT-CONTAINER] Error stack:', e.stack);
            console.error('[PRODUCT-CONTAINER] Config:', config);
            console.error('[PRODUCT-CONTAINER] SchemeColors:', schemeColors);
            productInfoHtml = '<p style="color: red;">Error rendering product info: ' + e.message + '</p>';
        }
        
        // Phase 3: Render additional sections
        let additionalSectionsHtml = '';
        try {
            console.log('[PRODUCT-CONTAINER] Starting Phase 3 - Rendering additional sections');
            console.log('[PRODUCT-CONTAINER] Config sections:', config.sections);
            
            // Sort sections by order
            const sortedSections = Object.entries(config.sections || {})
                .filter(([key, section]) => key !== 'productInfo' && section.enabled)
                .sort((a, b) => (a[1].order || 999) - (b[1].order || 999));
            
            console.log('[PRODUCT-CONTAINER] Sorted sections to render:', sortedSections.map(s => s[0]));
            
            for (const [sectionKey, section] of sortedSections) {
                console.log(`[PRODUCT-CONTAINER] Attempting to render section: ${sectionKey}`);
                const sectionHtml = window.WebsiteBuilderModules.ProductContainer.renderSection(sectionKey, section, schemeColors);
                if (sectionHtml) {
                    console.log(`[PRODUCT-CONTAINER] Successfully rendered ${sectionKey}, length: ${sectionHtml.length}`);
                    additionalSectionsHtml += `<div style="margin-top: 60px;">${sectionHtml}</div>`;
                } else {
                    console.log(`[PRODUCT-CONTAINER] No HTML returned for ${sectionKey}`);
                }
            }
            console.log(`[PRODUCT-CONTAINER] Total additional sections HTML length: ${additionalSectionsHtml.length}`);
        } catch (e) {
            console.error('[PRODUCT-CONTAINER] Error rendering additional sections:', e);
            console.error('[PRODUCT-CONTAINER] Error stack:', e.stack);
        }
        
        return `
            <section id="${uniqueId}" class="product-container-section" data-section-id="product-container" style="
                background-color: ${schemeColors.background};
                color: ${schemeColors.text};
                padding: ${config.sections?.productInfo?.enabled ? '40px 0' : '60px 0'};
                min-height: ${config.sections?.productInfo?.enabled ? 'auto' : '500px'};
            ">
                <div class="container" style="
                    max-width: ${config.width === 'large' ? '1200px' : config.width === 'medium' ? '1000px' : '800px'};
                    margin: 0 auto;
                    padding: 0 20px;
                ">
                    ${productInfoHtml || `
                        <div style="
                            text-align: center;
                            padding: 80px 20px;
                            background: ${schemeColors.accent || '#f5f5f5'};
                            border-radius: 8px;
                            border: 2px dashed ${schemeColors.text};
                            opacity: 0.5;
                        ">
                            <h2 style="
                                font-size: 32px;
                                margin-bottom: 20px;
                                font-weight: 300;
                            ">Product Template</h2>
                            <p style="
                                font-size: 18px;
                                opacity: 0.8;
                            ">Product info will be displayed here when enabled</p>
                            <p style="
                                font-size: 14px;
                                margin-top: 30px;
                                opacity: 0.6;
                            ">Phase 2: Product Info Integration Ready</p>
                        </div>
                    `}
                    ${additionalSectionsHtml}
                </div>
            </section>
        `;
    },
    
    // Render product info section - Phase 2
    renderProductInfo: function(config, schemeColors) {
        console.log('[PRODUCT-CONTAINER] renderProductInfo called');
        console.log('[PRODUCT-CONTAINER] window.currentGlobalThemeSettings:', window.currentGlobalThemeSettings);
        console.log('[PRODUCT-CONTAINER] window.getFontNameFromValueSafe:', typeof window.getFontNameFromValueSafe);
        
        // Get product info specific configuration
        const productInfoConfig = config.sections?.productInfo?.config || {};
        
        console.log('[PRODUCT-CONTAINER] Product info config:', productInfoConfig);
        console.log('[PRODUCT-CONTAINER] Full config:', config);
        console.log('[PRODUCT-CONTAINER] Config colorScheme:', config.colorScheme);
        console.log('[PRODUCT-CONTAINER] ProductInfo colorScheme:', productInfoConfig.colorScheme);
        
        // Get typography settings
        const headingTypography = window.currentGlobalThemeSettings?.typography?.heading || {};
        const bodyTypography = window.currentGlobalThemeSettings?.typography?.body || {};
        
        // Get font names with fallback
        let headingFont = 'Helvetica';
        let bodyFont = 'Roboto';
        
        try {
            if (window.getFontNameFromValueSafe) {
                headingFont = window.getFontNameFromValueSafe(headingTypography.font || 'helvetica');
                bodyFont = window.getFontNameFromValueSafe(bodyTypography.font || 'roboto');
            } else if (window.parent && window.parent.getFontNameFromValueSafe) {
                headingFont = window.parent.getFontNameFromValueSafe(headingTypography.font || 'helvetica');
                bodyFont = window.parent.getFontNameFromValueSafe(bodyTypography.font || 'roboto');
            }
        } catch (e) {
            console.log('[PRODUCT-CONTAINER] Error getting font names:', e);
        }
        
        // Get the current product - use first product from DB or fallback to demo
        const product = this.getCurrentProduct();
        console.log('[PRODUCT-CONTAINER] Current product being rendered:', product);
        
        // Get layout configuration with defaults
        const desktopLayout = productInfoConfig.desktopLayout || 'thumbnails-left';
        const imageRatio = productInfoConfig.imageRatio || 'portrait-3-4-fill';
        const thumbnailSize = productInfoConfig.thumbnailSize || 'medium';
        const enableImageZoom = productInfoConfig.enableImageZoom !== false;
        const enableVideoLoop = productInfoConfig.enableVideoLoop !== false;
        const showVendor = productInfoConfig.showVendor !== false;
        const quantitySelectorStyle = productInfoConfig.quantitySelectorStyle || 'default';
        
        console.log('[PRODUCT-CONTAINER] renderProductInfo - desktopLayout:', desktopLayout);
        console.log('[PRODUCT-CONTAINER] renderProductInfo - productInfoConfig:', productInfoConfig);
        
        // Determine layout styles based on configuration
        let containerStyles = 'display: flex; gap: 40px; align-items: flex-start;';
        let imageStyles = 'flex: 0 0 50%; max-width: 50%;';
        let infoStyles = 'flex: 0 0 50%; max-width: 50%;';
        
        // Adjust layout when thumbnails are on the side
        if (desktopLayout === 'thumbnails-left' || desktopLayout === 'thumbnails-right') {
            // When thumbnails are lateral, images need more space
            imageStyles = 'flex: 0 0 60%; max-width: 60%;';
            infoStyles = 'flex: 0 0 40%; max-width: 40%;';
        } else if (desktopLayout === 'thumbnails-none') {
            // Stacked layout
            containerStyles = 'display: block;';
            imageStyles = 'width: 100%; margin-bottom: 40px;';
            infoStyles = 'width: 100%;';
        }
        
        return `
            <div class="product-container" style="${containerStyles}">
                <!-- Product Images Section -->
                <div class="product-images" style="${imageStyles}">
                    ${window.WebsiteBuilderModules.ProductContainer.renderProductImages(product, productInfoConfig)}
                </div>
                
                <!-- Product Info Section -->
                <div class="product-info-section" style="${infoStyles}">
                    ${window.WebsiteBuilderModules.ProductContainer.renderProductDetails(product, productInfoConfig, schemeColors, headingFont, bodyFont)}
                </div>
            </div>
            
            <style>
                @media (max-width: 768px) {
                    .product-container {
                        flex-direction: column !important;
                    }
                    
                    .product-images,
                    .product-info-section {
                        flex: 1 1 100% !important;
                        max-width: 100% !important;
                    }
                    
                    .product-images {
                        margin-bottom: 30px;
                    }
                }
            </style>
        `;
    },
    
    // Render product images
    renderProductImages: function(product, config) {
        const images = product.images || [];
        const mainImage = images[0] || { url: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600&h=600&fit=crop', altText: 'No Image' };
        
        // Get configuration options
        const imageRatio = config.imageRatio || 'portrait-3-4-fill';
        const enableImageZoom = config.enableImageZoom !== false;
        const desktopLayout = config.desktopLayout || 'thumbnails-left';
        
        // Handle thumbnail width - use the numeric value directly
        let thumbnailWidth = 90; // default
        if (config.desktopThumbnailSize) {
            thumbnailWidth = parseInt(config.desktopThumbnailSize);
        }
        
        console.log('[PRODUCT-CONTAINER] renderProductImages config:', config);
        console.log('[PRODUCT-CONTAINER] desktopLayout:', desktopLayout);
        console.log('[PRODUCT-CONTAINER] desktopThumbnailSize:', config.desktopThumbnailSize);
        console.log('[PRODUCT-CONTAINER] thumbnailWidth:', thumbnailWidth);
        
        // Calculate thumbnail height based on image aspect ratio
        let thumbnailHeight = thumbnailWidth; // default square
        
        // Adjust height based on the selected image ratio
        const ratioMultipliers = {
            'portrait-3-4-fill': 1.333,  // 4/3
            'portrait-2-3-fill': 1.5,     // 3/2
            'square-1-1-fill': 1,         // 1/1
            'landscape-4-3-fill': 0.75,   // 3/4
            'landscape-16-9-fill': 0.5625, // 9/16
            'adapt': 1 // For adapt, we'll use square thumbnails
        };
        
        const multiplier = ratioMultipliers[imageRatio] || 1;
        thumbnailHeight = Math.round(thumbnailWidth * multiplier);
        
        const thumbDims = { 
            width: `${thumbnailWidth}px`, 
            height: `${thumbnailHeight}px` 
        };
        
        // Calculate aspect ratio styles
        const aspectRatios = {
            'portrait-3-4-fill': 'padding-bottom: 133.33%;',
            'portrait-2-3-fill': 'padding-bottom: 150%;',
            'square-1-1-fill': 'padding-bottom: 100%;',
            'landscape-4-3-fill': 'padding-bottom: 75%;',
            'landscape-16-9-fill': 'padding-bottom: 56.25%;'
        };
        const ratioStyle = aspectRatios[imageRatio] || aspectRatios['portrait-3-4-fill'];
        
        // Determine if thumbnails are on the side (left or right)
        const isLateralThumbnails = desktopLayout === 'thumbnails-left' || desktopLayout === 'thumbnails-right';
        const thumbnailDirection = isLateralThumbnails ? 'column' : 'row';
        
        // Build container styles
        let containerStyles = `position: relative; display: ${isLateralThumbnails ? 'flex' : 'block'}; gap: 20px; align-items: flex-start;`;
        
        // Add flex-direction for thumbnails-right
        if (desktopLayout === 'thumbnails-right') {
            containerStyles += ' flex-direction: row-reverse;';
        }
        
        console.log('[PRODUCT-CONTAINER] Container styles:', containerStyles);
        console.log('[PRODUCT-CONTAINER] isLateralThumbnails:', isLateralThumbnails);
        
        return `
            <div class="product-images-container" data-layout="${desktopLayout}" style="${containerStyles}">
                ${desktopLayout === 'thumbnails-left' && images.length > 1 ? `
                    <!-- Thumbnails on left -->
                    <div class="product-thumbnails" style="display: flex; gap: 10px; flex-direction: ${thumbnailDirection}; flex-shrink: 0; width: ${parseInt(thumbDims.width) + 20}px;">
                        ${images.map((img, index) => `
                            <div class="product-thumbnail ${index === 0 ? 'active' : ''}" 
                                 onclick="(function() { 
                                     try {
                                         var mainImage = document.getElementById('main-product-image');
                                         if (mainImage) {
                                             mainImage.src = '${img.url}';
                                             // Update active thumbnail
                                             document.querySelectorAll('.product-thumbnail').forEach(function(thumb) {
                                                 var thumbImg = thumb.querySelector('img');
                                                 if (thumbImg && thumbImg.src === '${img.url}') {
                                                     thumb.style.borderColor = 'var(--primary)';
                                                     thumb.classList.add('active');
                                                 } else {
                                                     thumb.style.borderColor = '#e0e0e0';
                                                     thumb.classList.remove('active');
                                                 }
                                             });
                                         }
                                     } catch (e) {
                                         console.error('[PRODUCT-CONTAINER] Error changing image:', e);
                                     }
                                 })()"
                                 style="flex-shrink: 0; width: ${thumbDims.width}; height: ${thumbDims.height}; border-radius: 8px; overflow: hidden; cursor: pointer; border: 2px solid ${index === 0 ? 'var(--primary)' : '#e0e0e0'}; transition: all 0.3s ease;">
                                <img src="${img.url}" alt="${img.altText || ''}" style="width: 100%; height: 100%; object-fit: cover; transition: transform 0.3s ease;">
                            </div>
                        `).join('')}
                    </div>
                ` : ''}
                
                <!-- Main Image Container -->
                <div style="flex: 1; position: relative;">
                    <div class="product-main-image" style="position: relative; border-radius: 8px; overflow: hidden;">
                        ${imageRatio !== 'adapt' ? `<div style="position: relative; ${ratioStyle}">` : ''}
                        <img id="main-product-image" src="${mainImage.url}" alt="${mainImage.altText || ''}" style="position: ${imageRatio !== 'adapt' ? 'absolute' : 'static'}; top: 0; left: 0; width: 100%; height: ${imageRatio !== 'adapt' ? '100%' : 'auto'}; object-fit: cover; display: block;">
                        ${enableImageZoom ? `
                            <div class="image-zoom-indicator" style="position: absolute; top: 10px; right: 10px; background: rgba(0,0,0,0.5); color: white; padding: 5px 10px; border-radius: 4px; font-size: 12px; pointer-events: none;">
                                <i class="material-icons" style="font-size: 16px; vertical-align: middle;">zoom_in</i>
                            </div>
                        ` : ''}
                        ${imageRatio !== 'adapt' ? `</div>` : ''}
                    </div>
                </div>
                
                ${desktopLayout === 'thumbnails-right' && images.length > 1 ? `
                    <!-- Thumbnails on right -->
                    <div class="product-thumbnails" style="display: flex; gap: 10px; flex-direction: ${thumbnailDirection}; flex-shrink: 0; width: ${parseInt(thumbDims.width) + 20}px;">
                        ${images.map((img, index) => `
                            <div class="product-thumbnail ${index === 0 ? 'active' : ''}" 
                                 onclick="(function() { 
                                     try {
                                         var mainImage = document.getElementById('main-product-image');
                                         if (mainImage) {
                                             mainImage.src = '${img.url}';
                                             // Update active thumbnail
                                             document.querySelectorAll('.product-thumbnail').forEach(function(thumb) {
                                                 var thumbImg = thumb.querySelector('img');
                                                 if (thumbImg && thumbImg.src === '${img.url}') {
                                                     thumb.style.borderColor = 'var(--primary)';
                                                     thumb.classList.add('active');
                                                 } else {
                                                     thumb.style.borderColor = '#e0e0e0';
                                                     thumb.classList.remove('active');
                                                 }
                                             });
                                         }
                                     } catch (e) {
                                         console.error('[PRODUCT-CONTAINER] Error changing image:', e);
                                     }
                                 })()"
                                 style="flex-shrink: 0; width: ${thumbDims.width}; height: ${thumbDims.height}; border-radius: 8px; overflow: hidden; cursor: pointer; border: 2px solid ${index === 0 ? 'var(--primary)' : '#e0e0e0'}; transition: all 0.3s ease;">
                                <img src="${img.url}" alt="${img.altText || ''}" style="width: 100%; height: 100%; object-fit: cover; transition: transform 0.3s ease;">
                            </div>
                        `).join('')}
                    </div>
                ` : ''}
                
                ${desktopLayout === 'thumbnails-bottom' && images.length > 1 ? `
                    <!-- Thumbnails below -->
                    <div class="product-thumbnails" style="display: flex; gap: 10px; flex-direction: row; margin-top: 20px; justify-content: flex-start;">
                        ${images.map((img, index) => `
                            <div class="product-thumbnail ${index === 0 ? 'active' : ''}" 
                                 onclick="(function() { 
                                     try {
                                         var mainImage = document.getElementById('main-product-image');
                                         if (mainImage) {
                                             mainImage.src = '${img.url}';
                                             // Update active thumbnail
                                             document.querySelectorAll('.product-thumbnail').forEach(function(thumb) {
                                                 var thumbImg = thumb.querySelector('img');
                                                 if (thumbImg && thumbImg.src === '${img.url}') {
                                                     thumb.style.borderColor = 'var(--primary)';
                                                     thumb.classList.add('active');
                                                 } else {
                                                     thumb.style.borderColor = '#e0e0e0';
                                                     thumb.classList.remove('active');
                                                 }
                                             });
                                         }
                                     } catch (e) {
                                         console.error('[PRODUCT-CONTAINER] Error changing image:', e);
                                     }
                                 })()"
                                 style="flex-shrink: 0; width: ${thumbDims.width}; height: ${thumbDims.height}; border-radius: 8px; overflow: hidden; cursor: pointer; border: 2px solid ${index === 0 ? 'var(--primary)' : '#e0e0e0'}; transition: all 0.3s ease;">
                                <img src="${img.url}" alt="${img.altText || ''}" style="width: 100%; height: 100%; object-fit: cover; transition: transform 0.3s ease;">
                            </div>
                        `).join('')}
                    </div>
                ` : ''}
            </div>
        `;
    },
    
    // Render product block - Similar to Featured Product
    renderProductBlock: function(blockId, block, product, config, schemeColors, headingFont, bodyFont) {
        if (!block || block.isHidden) return '';
        
        let html = '';
        
        switch(block.type) {
            case 'vendor':
                if (config.showVendor !== false && product.vendor) {
                    html += `<div class="product-vendor" style="font-family: ${bodyFont}; font-size: 14px; color: ${schemeColors.text}; opacity: 0.7; margin-bottom: 5px;">${product.vendor}</div>`;
                }
                break;
                
            case 'title':
                const titleConfig = block;
                const titleSize = titleConfig.headingSize || 'medium';
                
                console.log('[PRODUCT-CONTAINER] Title block config:', titleConfig);
                console.log('[PRODUCT-CONTAINER] Title headingSize:', titleSize);
                
                // Map heading sizes to font sizes (same as Featured Product)
                const titleSizeMap = {
                    'extra-small': '20px',
                    'small': '24px', 
                    'medium': '32px',
                    'large': '40px',
                    'extra-large': '48px',
                    'double-extra-large': '56px'
                };
                
                const titleFontSize = titleSizeMap[titleSize] || '32px';
                console.log('[PRODUCT-CONTAINER] Title font size:', titleFontSize);
                
                html += `<h1 class="product-title" style="font-family: ${headingFont}; font-size: ${titleFontSize}; font-weight: 600; color: ${schemeColors.text}; margin: 0 0 15px 0;">${product.name}</h1>`;
                break;
                
            case 'price':
                const isOnSale = product.compareAtPrice && product.compareAtPrice > product.price;
                const priceConfig = block;
                const labelSize = priceConfig.labelSize || 'medium';
                
                // Map label sizes to font sizes (same as Featured Product)
                const labelSizeMap = {
                    'extra-small': '18px',
                    'small': '20px',
                    'medium': '24px',
                    'large': '28px',
                    'extra-large': '32px',
                    'double-extra-large': '36px'
                };
                
                const fontSize = labelSizeMap[labelSize] || '24px';
                
                html += `
                    <div style="margin-bottom: 20px;">
                        <span class="product-price" style="font-family: ${bodyFont}; font-size: ${fontSize}; font-weight: 600; color: ${priceConfig.highlightSalePrice && isOnSale ? '#dc3545' : schemeColors.text};">
                            $${product.price.toFixed(2)}
                        </span>
                        ${isOnSale ? `
                            <span style="font-family: ${bodyFont}; font-size: ${fontSize}; text-decoration: line-through; color: ${schemeColors.text}; opacity: 0.6; margin-left: 10px;">
                                $${product.compareAtPrice.toFixed(2)}
                            </span>
                            ${priceConfig.showSaleBadge ? `
                                <span style="font-family: ${bodyFont}; font-size: 12px; background-color: #dc3545; color: white; padding: 2px 8px; border-radius: 4px; margin-left: 10px; font-weight: 500; text-transform: uppercase;">
                                    Sale
                                </span>
                            ` : ''}
                        ` : ''}
                    </div>
                `;
                break;
                
            case 'sku':
                if (product.sku) {
                    html += `
                        <div style="font-family: ${bodyFont}; margin-bottom: 15px; font-size: 14px; color: ${schemeColors.text};">
                            SKU: ${product.sku}
                        </div>
                    `;
                }
                break;
                
            case 'variant-picker':
                if (product.variants && product.variants.length > 0) {
                    product.variants.forEach(variant => {
                        html += `
                            <div style="margin-bottom: 20px;">
                                <label style="font-family: ${bodyFont}; display: block; margin-bottom: 8px; font-weight: 500; font-size: 14px; color: ${schemeColors.text};">
                                    ${variant.name}
                                </label>
                                <select style="font-family: ${bodyFont}; width: 100%; padding: 10px; border: 1px solid ${schemeColors.border || '#ddd'}; border-radius: 4px; background: white; font-size: 14px; color: ${schemeColors.text};">
                                    ${variant.options.map(option => `<option>${option}</option>`).join('')}
                                </select>
                            </div>
                        `;
                    });
                }
                break;
                
            case 'inventory-status':
                const inStock = product.inventory > 0;
                if (inStock) {
                    html += `
                        <div style="margin-bottom: 30px; display: inline-flex; align-items: center; gap: 8px;">
                            <span style="width: 8px; height: 8px; background: #4caf50; border-radius: 50%; display: inline-block;"></span>
                            <span style="font-family: ${bodyFont}; font-size: 14px; color: ${schemeColors.text};">En stock</span>
                        </div>
                    `;
                } else {
                    html += `
                        <div style="margin-bottom: 30px; display: inline-flex; align-items: center; gap: 8px;">
                            <span style="width: 8px; height: 8px; background: #f44336; border-radius: 50%; display: inline-block;"></span>
                            <span style="font-family: ${bodyFont}; font-size: 14px; color: ${schemeColors.text};">Agotado</span>
                        </div>
                    `;
                }
                break;
                
            case 'quantity-selector':
                // Copy the beautiful styles from Featured Product
                html += `
                    <div style="margin-bottom: 30px;">
                        <label style="font-family: ${bodyFont}; display: block; margin-bottom: 12px; font-size: 14px; font-weight: 500; color: ${schemeColors.text};">Cantidad</label>
                        <div class="quantity-selector" style="display: inline-flex; align-items: center; gap: 20px;">
                            <button class="qty-decrease" style="width: 32px; height: 32px; border: none; background: transparent; cursor: pointer; font-size: 24px; color: ${schemeColors.text}; display: flex; align-items: center; justify-content: center; transition: all 0.2s; padding: 0;">
                                <span style="margin-top: -4px; font-weight: 300;">−</span>
                            </button>
                            <input type="number" class="qty-input" value="1" min="1" style="font-family: ${bodyFont}; width: 50px; height: 44px; text-align: center; border: none; background: transparent; padding: 0; font-size: 16px; font-weight: 500; color: ${schemeColors.text}; -moz-appearance: textfield;">
                            <button class="qty-increase" style="width: 32px; height: 32px; border: none; background: transparent; cursor: pointer; font-size: 20px; color: ${schemeColors.text}; display: flex; align-items: center; justify-content: center; transition: all 0.2s; padding: 0;">
                                <span style="font-weight: 300;">+</span>
                            </button>
                        </div>
                        <style>
                            .product-container .quantity-selector input[type="number"]::-webkit-inner-spin-button,
                            .product-container .quantity-selector input[type="number"]::-webkit-outer-spin-button {
                                -webkit-appearance: none;
                                margin: 0;
                            }
                            .product-container .quantity-selector button:hover {
                                opacity: 0.7;
                            }
                            .product-container .quantity-selector button:active {
                                opacity: 0.5;
                            }
                            .product-container .quantity-selector input:focus {
                                outline: none;
                                border-bottom: 1px solid ${schemeColors.text || '#000'};
                            }
                        </style>
                    </div>
                `;
                break;
                
            case 'buy-buttons':
                const buyConfig = block;
                const uniqueId = 'product-' + Date.now();
                
                html += `<div style="margin-bottom: 30px; display: flex; flex-direction: column; gap: 12px;">`;
                
                // Add to cart button
                if (buyConfig.showAddToCartButton !== false) {
                    html += window.WebsiteBuilderModules.ProductContainer.renderAddToCartButton(buyConfig, schemeColors, uniqueId, product, bodyFont);
                }
                
                // Buy now button
                if (buyConfig.showBuyButton) {
                    html += window.WebsiteBuilderModules.ProductContainer.renderBuyButton(buyConfig, schemeColors, uniqueId, product, bodyFont);
                }
                
                // Reserve button
                if (buyConfig.showReserveButton) {
                    html += window.WebsiteBuilderModules.ProductContainer.renderReserveButton(buyConfig, schemeColors, uniqueId, product, bodyFont);
                }
                
                html += `</div>`;
                break;
                
            case 'description':
                const descConfig = block;
                const descType = descConfig.displayType || 'static';
                const descHeading = descConfig.heading || 'Description';
                const iconName = descConfig.icon && descConfig.icon !== 'none' ? descConfig.icon : null;
                const customIcon = descConfig.customIcon;
                
                console.log('[PRODUCT-CONTAINER] Description config:', descConfig);
                console.log('[PRODUCT-CONTAINER] Description displayType:', descType);
                console.log('[PRODUCT-CONTAINER] Description icon:', iconName);
                
                if (product.description) {
                    // Generate unique ID for this description block
                    const descId = 'desc-' + Date.now() + '-' + Math.random().toString(36).substr(2, 9);
                    
                    if (descType === 'static') {
                        // Static type - just show the content
                        html += `
                            <div style="margin-top: 30px; padding-top: 30px; border-top: 1px solid ${schemeColors.border || '#e0e0e0'}; position: relative;">
                                <div style="display: flex; align-items: center; gap: 10px; margin-bottom: 15px;">
                                    ${iconName ? `<i class="material-icons" style="font-size: 20px; color: ${schemeColors.text};">${iconName}</i>` : ''}
                                    ${customIcon ? `<img src="${customIcon}" alt="${descHeading}" style="width: 20px; height: 20px; object-fit: contain;">` : ''}
                                    <h3 style="font-family: ${headingFont}; margin: 0; font-size: 18px; font-weight: 500; color: ${schemeColors.text};">${descHeading}</h3>
                                </div>
                                <div style="font-family: ${bodyFont}; line-height: 1.6; color: ${schemeColors.text}; font-size: 14px;">${product.description}</div>
                            </div>
                        `;
                    } else {
                        // Tab types (expanded or collapsed)
                        const isExpanded = descType === 'expanded-tab';
                        
                        html += `
                            <div style="margin-top: 30px; padding-top: 30px; border-top: 1px solid ${schemeColors.border || '#e0e0e0'}; position: relative;">
                                <div class="product-description-tab" id="${descId}-tab" 
                                     onclick="(function() { 
                                         var content = document.getElementById('${descId}-content'); 
                                         var icon = document.getElementById('${descId}-icon'); 
                                         var tab = document.getElementById('${descId}-tab');
                                         var isExpanded = tab.getAttribute('data-expanded') === 'true';
                                         if (content && icon) {
                                             if (isExpanded) {
                                                 content.style.display = 'none';
                                                 icon.textContent = '+';
                                                 tab.setAttribute('data-expanded', 'false');
                                             } else {
                                                 content.style.display = 'block';
                                                 icon.textContent = '−';
                                                 tab.setAttribute('data-expanded', 'true');
                                             }
                                         }
                                     })()"
                                     style="cursor: pointer; display: flex; align-items: center; justify-content: space-between; padding: 15px 0; border-bottom: 1px solid ${schemeColors.border || '#e0e0e0'}; position: relative;" 
                                     data-expanded="${isExpanded ? 'true' : 'false'}"
                                     data-desc-id="${descId}">
                                    <div style="display: flex; align-items: center; gap: 10px;">
                                        ${iconName ? `<i class="material-icons" style="font-size: 20px; color: ${schemeColors.text};">${iconName}</i>` : ''}
                                        ${customIcon ? `<img src="${customIcon}" alt="${descHeading}" style="width: 20px; height: 20px; object-fit: contain;">` : ''}
                                        <h3 style="margin: 0; font-size: 18px; font-weight: 500; color: ${schemeColors.text};">${descHeading}</h3>
                                    </div>
                                    <span class="product-expand-icon" id="${descId}-icon" style="font-size: 24px; color: #000000; display: inline-block; line-height: 1; user-select: none; position: absolute; right: 40%; top: 50%; transform: translateY(-50%);">${isExpanded ? '−' : '+'}</span>
                                </div>
                                <div class="description-content" id="${descId}-content" style="display: ${isExpanded ? 'block' : 'none'}; padding: 20px 0; transition: all 0.3s ease;">
                                    <div style="font-family: ${bodyFont}; line-height: 1.6; color: ${schemeColors.text}; font-size: 14px;">${product.description}</div>
                                </div>
                            </div>
                        `;
                    }
                }
                break;
                
            case 'share':
                html += `
                    <div style="margin-bottom: 30px;">
                        <h4 style="font-family: ${headingFont}; font-size: 14px; font-weight: 500; margin-bottom: 12px; color: ${schemeColors.text};">Compartir</h4>
                        <div style="display: flex; gap: 12px;">
                            <button style="padding: 8px; background: transparent; border: 1px solid ${schemeColors.border || '#ddd'}; border-radius: 4px; cursor: pointer;">
                                <i class="material-icons" style="font-size: 20px; color: ${schemeColors.text};">share</i>
                            </button>
                            <button style="padding: 8px; background: transparent; border: 1px solid ${schemeColors.border || '#ddd'}; border-radius: 4px; cursor: pointer;">
                                <i class="material-icons" style="font-size: 20px; color: ${schemeColors.text};">content_copy</i>
                            </button>
                        </div>
                    </div>
                `;
                break;
        }
        
        return html;
    },
    
    // Render product details using blocks
    renderProductDetails: function(product, config, schemeColors, headingFont, bodyFont) {
        let html = '';
        
        // Get blocks configuration
        const blocks = config.blocks || {};
        const blockOrder = config.blockOrder || ['vendor', 'title', 'price', 'sku', 'variant-picker', 'inventory-status', 'quantity-selector', 'buy-buttons', 'description', 'share'];
        
        // Render blocks in order
        blockOrder.forEach(blockId => {
            const block = blocks[blockId];
            if (block) {
                html += this.renderProductBlock(blockId, block, product, config, schemeColors, headingFont, bodyFont);
            }
        });
        
        return html + `
            
            <script>
                // Quantity selector functions
                (function() {
                    // Attach quantity listeners using event delegation
                    document.addEventListener('click', function(e) {
                        // Check if clicked element is inside a quantity selector
                        const qtyDecrease = e.target.closest('.qty-decrease');
                        const qtyIncrease = e.target.closest('.qty-increase');
                        
                        if (qtyDecrease) {
                            e.preventDefault();
                            e.stopPropagation();
                            const input = qtyDecrease.parentElement.querySelector('.qty-input');
                            if (input) {
                                const currentValue = parseInt(input.value) || 1;
                                if (currentValue > 1) {
                                    input.value = currentValue - 1;
                                }
                            }
                        }
                        
                        if (qtyIncrease) {
                            e.preventDefault();
                            e.stopPropagation();
                            const input = qtyIncrease.parentElement.querySelector('.qty-input');
                            if (input) {
                                const currentValue = parseInt(input.value) || 1;
                                input.value = currentValue + 1;
                            }
                        }
                    });
                })();
            </script>
        `;
    },
    
    // Render individual section based on type
    renderSection: function(sectionKey, section, schemeColors) {
        if (!section || !section.enabled) return '';
        
        console.log('[PRODUCT-CONTAINER] Rendering section:', sectionKey);
        console.log('[PRODUCT-CONTAINER] Section config:', section);
        console.log('[PRODUCT-CONTAINER] Available modules:', Object.keys(window.WebsiteBuilderModules || {}));
        
        try {
            // Prepare config for the section
            let sectionConfig = section.config || {};
            
            // If colorScheme is 'inherit', use the container's scheme colors
            if (sectionConfig.colorScheme === 'inherit') {
                sectionConfig.colorScheme = schemeColors;
            }
            
            switch(sectionKey) {
                case 'imageWithText':
                    if (window.WebsiteBuilderModules?.ImageWithText?.render) {
                        // Adapt config to match image-with-text module expectations
                        const imageWithTextConfig = {
                            ...sectionConfig,
                            image: sectionConfig.imageUrl,
                            content: sectionConfig.description,
                            buttonLabel: sectionConfig.buttonText,
                            // Pass the color scheme
                            colorScheme: section.config.colorScheme === 'inherit' ? null : section.config.colorScheme
                        };
                        return window.WebsiteBuilderModules.ImageWithText.render(imageWithTextConfig);
                    }
                    break;
                    
                case 'multicolumn':
                    if (window.WebsiteBuilderModules?.Multicolumn?.render) {
                        // Adapt config to match multicolumn module expectations
                        // The multicolumn module expects columns as an object, not array
                        const columnsObj = {};
                        if (sectionConfig.columns && Array.isArray(sectionConfig.columns)) {
                            sectionConfig.columns.forEach((col, index) => {
                                columnsObj[`column-${index + 1}`] = {
                                    id: `column-${index + 1}`,
                                    icon: col.icon,
                                    title: col.title,
                                    description: col.description,
                                    link: col.link || '',
                                    isHidden: false
                                };
                            });
                        }
                        
                        const multicolumnConfig = {
                            title: sectionConfig.title,
                            columns: columnsObj,
                            columnOrder: Object.keys(columnsObj),
                            config: {
                                colorScheme: section.config.colorScheme === 'inherit' ? schemeColors : section.config.colorScheme
                            }
                        };
                        console.log('[PRODUCT-CONTAINER] Multicolumn config prepared:', multicolumnConfig);
                        return window.WebsiteBuilderModules.Multicolumn.render(multicolumnConfig);
                    }
                    break;
                    
                case 'gallery':
                    if (window.WebsiteBuilderModules?.Gallery?.render) {
                        // Adapt config to match gallery module expectations
                        const galleryConfig = {
                            ...sectionConfig,
                            title: sectionConfig.title,
                            layout: sectionConfig.layout || 'grid',
                            imagesPerRow: sectionConfig.imagesPerRow || 3,
                            images: sectionConfig.images || [],
                            // Pass the color scheme
                            colorScheme: section.config.colorScheme === 'inherit' ? null : section.config.colorScheme
                        };
                        return window.WebsiteBuilderModules.Gallery.render(galleryConfig);
                    }
                    break;
                    
                case 'testimonials':
                    if (window.WebsiteBuilderModules?.Testimonials?.render) {
                        // Adapt config to match testimonials module expectations
                        const testimonialsConfig = {
                            ...sectionConfig,
                            title: sectionConfig.title,
                            layout: sectionConfig.layout || 'slider',
                            items: sectionConfig.testimonials?.map((testimonial, index) => ({
                                id: `testimonial-${index}`,
                                author: testimonial.name,
                                content: testimonial.text,
                                position: testimonial.date,
                                rating: testimonial.rating,
                                isHidden: false
                            })) || [],
                            itemOrder: sectionConfig.testimonials?.map((_, index) => `testimonial-${index}`) || [],
                            // Pass the color scheme
                            colorScheme: section.config.colorScheme === 'inherit' ? null : section.config.colorScheme
                        };
                        return window.WebsiteBuilderModules.Testimonials.render(testimonialsConfig);
                    }
                    break;
                    
                case 'productTabs':
                    // Simple tabs implementation for now
                    const tabsHtml = `
                        <div class="product-tabs-section" style="margin-top: 40px;">
                            <h2 style="text-align: center; margin-bottom: 30px; color: ${schemeColors.text};">Información del Producto</h2>
                            <div class="tabs-container" style="border: 1px solid ${schemeColors.border || '#e0e0e0'}; border-radius: 8px; overflow: hidden;">
                                ${Object.entries(sectionConfig.tabs || {}).map(([key, tab]) => tab.enabled ? `
                                    <div class="tab-content" style="padding: 30px; border-bottom: 1px solid ${schemeColors.border || '#e0e0e0'};">
                                        <h3 style="margin-bottom: 15px; color: ${schemeColors.text};">${tab.title}</h3>
                                        <div style="color: ${schemeColors.text}; white-space: pre-line;">${tab.content}</div>
                                    </div>
                                ` : '').join('')}
                            </div>
                        </div>
                    `;
                    return tabsHtml;
                    
                case 'relatedProducts':
                    // For now, return a placeholder
                    const relatedHtml = `
                        <div class="related-products-section" style="margin-top: 60px; text-align: center;">
                            <h2 style="margin-bottom: 30px; color: ${schemeColors.text};">${sectionConfig.title || 'Productos Relacionados'}</h2>
                            <div style="padding: 60px; background: ${schemeColors.accent || '#f5f5f5'}; border-radius: 8px;">
                                <p style="color: ${schemeColors.text}; opacity: 0.6;">Los productos relacionados aparecerán aquí</p>
                                <p style="color: ${schemeColors.text}; opacity: 0.4; font-size: 12px; margin-top: 10px;">Se mostrarán ${sectionConfig.productsToShow || 4} productos</p>
                            </div>
                        </div>
                    `;
                    return relatedHtml;
                    
                case 'faq':
                    if (window.WebsiteBuilderModules?.Accordion?.render) {
                        // Use accordion module for FAQ
                        const faqConfig = {
                            title: sectionConfig.title,
                            items: sectionConfig.items || {},
                            itemOrder: sectionConfig.itemOrder || [],
                            colorScheme: section.config.colorScheme === 'inherit' ? null : section.config.colorScheme,
                            toggleStyle: 'plus-minus'
                        };
                        return window.WebsiteBuilderModules.Accordion.render(faqConfig);
                    } else {
                        // Fallback simple FAQ
                        const faqHtml = `
                            <div class="faq-section" style="margin-top: 60px;">
                                <h2 style="text-align: center; margin-bottom: 30px; color: ${schemeColors.text};">${sectionConfig.title || 'Preguntas Frecuentes'}</h2>
                                <div class="faq-items">
                                    ${(sectionConfig.items || []).map(item => !item.isHidden ? `
                                        <div style="margin-bottom: 20px; padding: 20px; background: ${schemeColors.accent || '#f5f5f5'}; border-radius: 8px;">
                                            <h4 style="margin-bottom: 10px; color: ${schemeColors.text};">${item.question}</h4>
                                            <p style="color: ${schemeColors.text}; opacity: 0.8;">${item.answer}</p>
                                        </div>
                                    ` : '').join('')}
                                </div>
                            </div>
                        `;
                        return faqHtml;
                    }
                    break;
                    
                default:
                    console.warn('[PRODUCT-CONTAINER] Unknown section type:', sectionKey);
                    return '';
            }
        } catch (e) {
            console.error('[PRODUCT-CONTAINER] Error rendering section:', sectionKey, e);
            return `<div style="padding: 20px; background: #fee; color: #c00; border-radius: 4px;">Error rendering ${sectionKey}: ${e.message}</div>`;
        }
        
        // Fallback if module not found
        console.warn('[PRODUCT-CONTAINER] Module not found for section:', sectionKey);
        return `
            <div style="padding: 40px; background: ${schemeColors.accent || '#f5f5f5'}; border-radius: 8px; text-align: center;">
                <p style="color: ${schemeColors.text}; opacity: 0.6;">
                    ${sectionKey} module not available
                </p>
                <p style="color: ${schemeColors.text}; opacity: 0.4; font-size: 12px; margin-top: 10px;">
                    Available modules: ${Object.keys(window.WebsiteBuilderModules || {}).join(', ') || 'none'}
                </p>
            </div>
        `;
    },
    
    // Load products from API
    loadProducts: function() {
        return new Promise((resolve, reject) => {
            // If already cached, return immediately
            if (this.cachedProducts) {
                resolve(this.cachedProducts);
                return;
            }
            
            // Load from API
            $.ajax({
                url: '/api/builder/products',
                method: 'GET',
                success: (products) => {
                    console.log('[PRODUCT-CONTAINER] Products loaded:', products.length);
                    this.cachedProducts = products;
                    resolve(products);
                },
                error: (xhr, status, error) => {
                    console.error('[PRODUCT-CONTAINER] Error loading products:', error);
                    reject(error);
                }
            });
        });
    },
    
    // Get current product for display
    getCurrentProduct: function() {
        // Pattern from Announcement Bar - check multiple sources
        // First check if we're in iframe context and have access to parent
        if (window.parent && window.parent !== window && window.parent.WebsiteBuilderModules?.ProductContainer?.currentProduct) {
            console.log('[PRODUCT-CONTAINER] Getting product from parent context');
            return window.parent.WebsiteBuilderModules.ProductContainer.currentProduct;
        }
        
        // If we have a current product, return it
        if (this.currentProduct) {
            console.log('[PRODUCT-CONTAINER] Using current product:', this.currentProduct.name);
            return this.currentProduct;
        }
        
        // If we have cached products, use the first one
        if (this.cachedProducts && this.cachedProducts.length > 0) {
            console.log('[PRODUCT-CONTAINER] Using first cached product');
            this.currentProduct = this.cachedProducts[0];
            return this.currentProduct;
        }
        
        // Return demo product as fallback
        console.log('[PRODUCT-CONTAINER] Using demo product as fallback');
        return this.getDemoProduct();
    },
    
    // Get demo product for testing
    getDemoProduct: function() {
        return {
            id: 'demo-product',
            name: 'Demo Product',
            vendor: 'Demo Vendor',
            price: 99.99,
            compareAtPrice: 129.99,
            sku: 'SKU-DEMO',
            description: 'This is a demo product for testing the product template. In production, real product data will be displayed here.',
            images: [
                {
                    url: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e',
                    altText: 'Demo Product Image 1'
                },
                {
                    url: 'https://images.unsplash.com/photo-1572635196237-14b3f281503f',
                    altText: 'Demo Product Image 2'
                },
                {
                    url: 'https://images.unsplash.com/photo-1560343090-f0409e92791a',
                    altText: 'Demo Product Image 3'
                }
            ],
            variants: [
                { name: 'Size', options: ['Small', 'Medium', 'Large'] },
                { name: 'Color', options: ['Red', 'Blue', 'Green'] }
            ]
        };
    },
    
    // Initialize module - load products on start
    initialize: function() {
        console.log('[PRODUCT-CONTAINER] Initializing module');
        console.log('[PRODUCT-CONTAINER] Current page:', window.currentPageId);
        
        // Load products in background
        this.loadProducts().then(products => {
            console.log('[PRODUCT-CONTAINER] Products loaded successfully:', products);
            if (products && products.length > 0) {
                console.log('[PRODUCT-CONTAINER] Using first product:', products[0].name);
                this.currentProduct = products[0];
                
                // Re-render preview if we're on product page
                if (window.currentPageId === 'product' && typeof renderPreview === 'function') {
                    console.log('[PRODUCT-CONTAINER] Re-rendering preview with new product');
                    renderPreview();
                }
            }
        }).catch(error => {
            console.error('[PRODUCT-CONTAINER] Error loading products:', error);
            console.log('[PRODUCT-CONTAINER] Using demo product due to error');
        });
    },
    
    // Render settings panel
    renderSettings: function(config) {
        const currentLang = window.currentLanguage || 'es';
        
        return `
            <div class="product-container-settings" style="height: 100%; display: flex; flex-direction: column;">
                <div class="sidebar-view-header" style="padding: 16px; border-bottom: 1px solid #e3e3e3;">
                    <button class="back-to-sections-btn" onclick="window.switchSidebarView('blockList')">
                        <i class="material-icons">arrow_back</i>
                    </button>
                    <h3 style="font-size: 16px; font-weight: 500; margin: 0;">
                        ${currentLang === 'es' ? 'Configuración del Product Container' : 'Product Container Settings'}
                    </h3>
                </div>
                
                <div style="flex: 1; overflow-y: auto; padding: 20px;">
                    <!-- General Settings -->
                    <div class="settings-group">
                        <h4 style="font-size: 13px; font-weight: 500; margin-bottom: 12px; color: #5c5e60;">
                            ${currentLang === 'es' ? 'Configuración General' : 'General Settings'}
                        </h4>
                        
                        <div class="form-group">
                            <label style="font-size: 13px; font-weight: 500; margin-bottom: 8px; display: block;">
                                ${currentLang === 'es' ? 'Esquema de color' : 'Color scheme'}
                            </label>
                            <select id="product-container-color-scheme" class="form-control" style="width: 100%; padding: 8px;">
                                <option value="scheme1" ${config.colorScheme === 'scheme1' ? 'selected' : ''}>
                                    ${currentLang === 'es' ? 'Esquema 1' : 'Scheme 1'}
                                </option>
                                <option value="scheme2" ${config.colorScheme === 'scheme2' ? 'selected' : ''}>
                                    ${currentLang === 'es' ? 'Esquema 2' : 'Scheme 2'}
                                </option>
                                <option value="scheme3" ${config.colorScheme === 'scheme3' ? 'selected' : ''}>
                                    ${currentLang === 'es' ? 'Esquema 3' : 'Scheme 3'}
                                </option>
                                <option value="scheme4" ${config.colorScheme === 'scheme4' ? 'selected' : ''}>
                                    ${currentLang === 'es' ? 'Esquema 4' : 'Scheme 4'}
                                </option>
                                <option value="scheme5" ${config.colorScheme === 'scheme5' ? 'selected' : ''}>
                                    ${currentLang === 'es' ? 'Esquema 5' : 'Scheme 5'}
                                </option>
                            </select>
                        </div>
                        
                        <div class="form-group" style="margin-top: 15px;">
                            <label style="font-size: 13px; font-weight: 500; margin-bottom: 8px; display: block;">
                                ${currentLang === 'es' ? 'Ancho' : 'Width'}
                            </label>
                            <select id="product-container-width" class="form-control" style="width: 100%; padding: 8px;">
                                <option value="small" ${config.width === 'small' ? 'selected' : ''}>
                                    ${currentLang === 'es' ? 'Pequeño' : 'Small'}
                                </option>
                                <option value="medium" ${config.width === 'medium' ? 'selected' : ''}>
                                    ${currentLang === 'es' ? 'Mediano' : 'Medium'}
                                </option>
                                <option value="large" ${config.width === 'large' ? 'selected' : ''}>
                                    ${currentLang === 'es' ? 'Grande' : 'Large'}
                                </option>
                            </select>
                        </div>
                    </div>
                    
                    <!-- Content Sections Management -->
                    <div class="settings-group" style="margin-top: 30px;">
                        <h4 style="font-size: 13px; font-weight: 500; margin-bottom: 12px; color: #5c5e60;">
                            ${currentLang === 'es' ? 'Gestión de Contenido' : 'Content Management'}
                        </h4>
                        
                        ${window.WebsiteBuilderModules.ProductContainer.renderSectionsManagement(config, currentLang)}
                    </div>
                </div>
            </div>
        `;
    },
    
    // Render sections management UI
    renderSectionsManagement: function(config, currentLang) {
        let html = '';
        const sections = config.sections || {};
        
        console.log('[PRODUCT-CONTAINER] renderSectionsManagement - config:', config);
        console.log('[PRODUCT-CONTAINER] sections:', sections);
        console.log('[PRODUCT-CONTAINER] productInfo:', sections.productInfo);
        console.log('[PRODUCT-CONTAINER] productInfo.config:', sections.productInfo?.config);
        console.log('[PRODUCT-CONTAINER] productInfo.config.blocks:', sections.productInfo?.config?.blocks);
        
        // Product Info Section - Special case: show blocks with drag & drop
        if (sections.productInfo) {
            const blocks = sections.productInfo.config?.blocks || {};
            const blockOrder = sections.productInfo.config?.blockOrder || ['vendor', 'title', 'price', 'sku', 'variant-picker', 'inventory-status', 'quantity-selector', 'buy-buttons', 'description', 'share'];
            
            console.log('[PRODUCT-CONTAINER] blocks object:', blocks);
            console.log('[PRODUCT-CONTAINER] blocks keys:', Object.keys(blocks));
            console.log('[PRODUCT-CONTAINER] blockOrder:', blockOrder);
            
            html += `
                <div class="section-management" style="margin-bottom: 20px; border: 1px solid #e3e3e3; border-radius: 4px; overflow: hidden;">
                    <div class="section-header" style="padding: 12px 15px; background: #f8f8f8; display: flex; align-items: center; justify-content: space-between;">
                        <div style="display: flex; align-items: center;">
                            <span style="width: 8px; height: 8px; border-radius: 50%; background: ${sections.productInfo.enabled ? '#4caf50' : '#ccc'}; margin-right: 10px;"></span>
                            <span style="font-size: 13px; font-weight: 500;">Product Info</span>
                        </div>
                        <button class="btn btn-sm" id="product-info-settings-btn" style="background: transparent; border: 1px solid #e3e3e3; padding: 4px 8px; border-radius: 4px; font-size: 12px; cursor: pointer;">
                            <i class="material-icons" style="font-size: 16px;">settings</i>
                        </button>
                    </div>
                    
                    <!-- Product Info Blocks -->
                    <div id="product-info-blocks" class="section-items" style="padding: 10px; position: relative; min-height: 50px;">
                        ${blockOrder.map(blockId => {
                            const block = blocks[blockId];
                            console.log(`[PRODUCT-CONTAINER] Processing block ${blockId}:`, block);
                            if (!block) {
                                console.log(`[PRODUCT-CONTAINER] Block ${blockId} not found in blocks object, creating default`);
                                // Create default block if it doesn't exist
                                if (blockId === 'buy-buttons') {
                                    blocks[blockId] = { 
                                        type: blockId, 
                                        isHidden: false,
                                        showAddToCartButton: true,
                                        addToCartButtonStyle: 'solid',
                                        addToCartButtonText: 'Agregar al carrito',
                                        showBuyButton: false,
                                        buyButtonStyle: 'solid',
                                        buyButtonText: 'Comprar ahora',
                                        showReserveButton: false,
                                        reserveButtonStyle: 'solid',
                                        reserveButtonText: 'Reservar'
                                    };
                                } else {
                                    blocks[blockId] = { type: blockId, isHidden: false };
                                }
                            }
                            
                            const blockNames = {
                                'vendor': 'Vendor',
                                'title': 'Título',
                                'price': 'Precio',
                                'sku': 'SKU',
                                'variant-picker': 'Selector de variantes',
                                'inventory-status': 'Estado de inventario',
                                'quantity-selector': 'Selector de cantidad',
                                'buy-buttons': 'Botones de compra',
                                'description': 'Descripción',
                                'share': 'Compartir'
                            };
                            
                            return `
                                <div class="product-info-block" data-block-id="${blockId}" style="display: flex; align-items: center; justify-content: space-between; padding: 8px 10px; background: #fff; border: 1px solid #e3e3e3; border-radius: 4px; margin-bottom: 8px; cursor: pointer; padding-left: calc(10px + 32%);">
                                    <i class="material-icons drag-handle" style="font-size: 18px; color: #666; margin-right: 8px; cursor: move; margin-left: -10%;">drag_indicator</i>
                                    <span style="font-size: 13px;">${blockNames[blockId] || blockId}</span>
                                    <button class="visibility-toggle ${block.isHidden ? 'is-hidden' : ''}" data-block-id="${blockId}" style="background: none; border: none; cursor: pointer; padding: 4px; margin-left: auto;">
                                        <i class="material-icons icon-visible" style="font-size: 18px;">visibility</i>
                                        <i class="material-icons icon-hidden" style="font-size: 18px;">visibility_off</i>
                                    </button>
                                </div>
                            `;
                        }).join('')}
                    </div>
                </div>
            `;
        }
        
        // Image with Text Section
        if (sections.imageWithText) {
            const blocks = sections.imageWithText.config?.blocks || [];
            html += `
                <div class="section-management" style="margin-bottom: 20px; border: 1px solid #e3e3e3; border-radius: 4px; overflow: hidden;">
                    <div class="section-header" data-section-type="imageWithText" style="padding: 12px 15px; background: #f8f8f8; display: flex; align-items: center; justify-content: space-between; cursor: pointer;">
                        <div style="display: flex; align-items: center;">
                            <span style="width: 8px; height: 8px; border-radius: 50%; background: ${sections.imageWithText.enabled ? '#4caf50' : '#ccc'}; margin-right: 10px;"></span>
                            <span style="font-size: 13px; font-weight: 500;">Image with Text</span>
                        </div>
                        <button class="btn btn-sm" id="product-image-text-add-btn" style="background: transparent; border: 1px solid #e3e3e3; padding: 4px 8px; border-radius: 4px; font-size: 12px; cursor: pointer; transition: all 0.2s ease; display: flex; align-items: center; justify-content: center;">
                            <i class="material-icons" style="font-size: 18px; color: #5c6068;">add</i>
                        </button>
                    </div>
                    ${blocks.length > 0 ? `
                        <div class="section-items" style="padding: 10px;">
                            ${blocks.map((block, index) => `
                                <div class="item-row" style="display: flex; align-items: center; justify-content: space-between; padding: 8px 10px; background: #fff; border: 1px solid #e3e3e3; border-radius: 4px; margin-bottom: 8px; cursor: pointer;" 
                                     data-item-type="iwt-block" data-item-id="${block.id || index}">
                                    <span style="font-size: 13px;">Bloque ${index + 1}</span>
                                    <div style="display: flex; gap: 5px;">
                                        <button class="visibility-toggle ${block.isHidden ? 'is-hidden' : ''}" data-item-type="iwt-block" data-item-id="${block.id || index}" style="background: none; border: none; cursor: pointer; padding: 4px;">
                                            <i class="material-icons icon-visible" style="font-size: 18px;">visibility</i>
                                            <i class="material-icons icon-hidden" style="font-size: 18px;">visibility_off</i>
                                        </button>
                                        <button class="delete-item-btn" data-item-type="iwt-block" data-item-id="${block.id || index}" style="background: none; border: none; cursor: pointer; padding: 4px;">
                                            <i class="material-icons" style="font-size: 18px; color: #dc3545;">delete</i>
                                        </button>
                                    </div>
                                </div>
                            `).join('')}
                        </div>
                    ` : ''}
                </div>
            `;
        }
        
        // Gallery Section
        if (sections.gallery) {
            const images = sections.gallery.config?.images || [];
            console.log('[PRODUCT-CONTAINER] Gallery images:', images);
            html += `
                <div class="section-management" style="margin-bottom: 20px; border: 1px solid #e3e3e3; border-radius: 4px; overflow: hidden;">
                    <div class="section-header" data-section-type="gallery" style="padding: 12px 15px; background: #f8f8f8; display: flex; align-items: center; justify-content: space-between; cursor: pointer;">
                        <div style="display: flex; align-items: center;">
                            <span style="width: 8px; height: 8px; border-radius: 50%; background: ${sections.gallery.enabled ? '#4caf50' : '#ccc'}; margin-right: 10px;"></span>
                            <span style="font-size: 13px; font-weight: 500;">Gallery</span>
                        </div>
                        <button class="btn btn-sm" id="product-gallery-add-btn" style="background: transparent; border: 1px solid #e3e3e3; padding: 4px 8px; border-radius: 4px; font-size: 12px; cursor: pointer; transition: all 0.2s ease; display: flex; align-items: center; justify-content: center;">
                            <i class="material-icons" style="font-size: 18px; color: #5c6068;">add</i>
                        </button>
                    </div>
                    ${images.length > 0 ? `
                        <div class="section-items" style="padding: 10px;">
                            ${images.map((img, index) => `
                                <div class="item-row" style="display: flex; align-items: center; justify-content: space-between; padding: 8px 10px; background: #fff; border: 1px solid #e3e3e3; border-radius: 4px; margin-bottom: 8px; cursor: pointer;"
                                     data-item-type="gallery-image" data-item-id="${img.id || index}">
                                    <span style="font-size: 13px;">${img.caption || `Imagen ${index + 1}`}</span>
                                    <div style="display: flex; gap: 5px;">
                                        <button class="visibility-toggle ${img.isHidden ? 'is-hidden' : ''}" data-item-type="gallery-image" data-item-id="${img.id || index}" style="background: none; border: none; cursor: pointer; padding: 4px;">
                                            <i class="material-icons icon-visible" style="font-size: 18px;">visibility</i>
                                            <i class="material-icons icon-hidden" style="font-size: 18px;">visibility_off</i>
                                        </button>
                                        <button class="delete-item-btn" data-item-type="gallery-image" data-item-id="${img.id || index}" style="background: none; border: none; cursor: pointer; padding: 4px;">
                                            <i class="material-icons" style="font-size: 18px; color: #dc3545;">delete</i>
                                        </button>
                                    </div>
                                </div>
                            `).join('')}
                        </div>
                    ` : ''}
                </div>
            `;
        }
        
        // Testimonials Section
        if (sections.testimonials) {
            const testimonials = sections.testimonials.config?.testimonials || [];
            html += `
                <div class="section-management" style="margin-bottom: 20px; border: 1px solid #e3e3e3; border-radius: 4px; overflow: hidden;">
                    <div class="section-header" data-section-type="testimonials" style="padding: 12px 15px; background: #f8f8f8; display: flex; align-items: center; justify-content: space-between; cursor: pointer;">
                        <div style="display: flex; align-items: center;">
                            <span style="width: 8px; height: 8px; border-radius: 50%; background: ${sections.testimonials.enabled ? '#4caf50' : '#ccc'}; margin-right: 10px;"></span>
                            <span style="font-size: 13px; font-weight: 500;">Testimonials</span>
                        </div>
                        <button class="btn btn-sm" id="product-testimonials-add-btn" style="background: transparent; border: 1px solid #e3e3e3; padding: 4px 8px; border-radius: 4px; font-size: 12px; cursor: pointer; transition: all 0.2s ease; display: flex; align-items: center; justify-content: center;">
                            <i class="material-icons" style="font-size: 18px; color: #5c6068;">add</i>
                        </button>
                    </div>
                    ${testimonials.length > 0 ? `
                        <div class="section-items" style="padding: 10px;">
                            ${testimonials.map((testimonial, index) => `
                                <div class="item-row" style="display: flex; align-items: center; justify-content: space-between; padding: 8px 10px; background: #fff; border: 1px solid #e3e3e3; border-radius: 4px; margin-bottom: 8px; cursor: pointer;"
                                     data-item-type="testimonial" data-item-id="${testimonial.id || index}">
                                    <span style="font-size: 13px;">${testimonial.name || `Testimonio ${index + 1}`}</span>
                                    <div style="display: flex; gap: 5px;">
                                        <button class="visibility-toggle ${testimonial.isHidden ? 'is-hidden' : ''}" data-item-type="testimonial" data-item-id="${testimonial.id || index}" style="background: none; border: none; cursor: pointer; padding: 4px;">
                                            <i class="material-icons icon-visible" style="font-size: 18px;">visibility</i>
                                            <i class="material-icons icon-hidden" style="font-size: 18px;">visibility_off</i>
                                        </button>
                                        <button class="delete-item-btn" data-item-type="testimonial" data-item-id="${testimonial.id || index}" style="background: none; border: none; cursor: pointer; padding: 4px;">
                                            <i class="material-icons" style="font-size: 18px; color: #dc3545;">delete</i>
                                        </button>
                                    </div>
                                </div>
                            `).join('')}
                        </div>
                    ` : ''}
                </div>
            `;
        }
        
        // FAQ Section
        if (sections.faq) {
            const items = sections.faq.config?.items || [];
            html += `
                <div class="section-management" style="margin-bottom: 20px; border: 1px solid #e3e3e3; border-radius: 4px; overflow: hidden;">
                    <div class="section-header" data-section-type="faq" style="padding: 12px 15px; background: #f8f8f8; display: flex; align-items: center; justify-content: space-between; cursor: pointer;">
                        <div style="display: flex; align-items: center;">
                            <span style="width: 8px; height: 8px; border-radius: 50%; background: ${sections.faq.enabled ? '#4caf50' : '#ccc'}; margin-right: 10px;"></span>
                            <span style="font-size: 13px; font-weight: 500;">FAQ</span>
                        </div>
                        <button class="btn btn-sm" id="product-faq-add-btn" style="background: transparent; border: 1px solid #e3e3e3; padding: 4px 8px; border-radius: 4px; font-size: 12px; cursor: pointer; transition: all 0.2s ease; display: flex; align-items: center; justify-content: center;">
                            <i class="material-icons" style="font-size: 18px; color: #5c6068;">add</i>
                        </button>
                    </div>
                    ${items.length > 0 ? `
                        <div class="section-items" style="padding: 10px;">
                            ${items.map((item, index) => `
                                <div class="item-row" style="display: flex; align-items: center; justify-content: space-between; padding: 8px 10px; background: #fff; border: 1px solid #e3e3e3; border-radius: 4px; margin-bottom: 8px; cursor: pointer;"
                                     data-item-type="faq-item" data-item-id="${item.id || index}">
                                    <span style="font-size: 13px;">${item.question || `Pregunta ${index + 1}`}</span>
                                    <div style="display: flex; gap: 5px;">
                                        <button class="visibility-toggle ${item.isHidden ? 'is-hidden' : ''}" data-item-type="faq-item" data-item-id="${item.id || index}" style="background: none; border: none; cursor: pointer; padding: 4px;">
                                            <i class="material-icons icon-visible" style="font-size: 18px;">visibility</i>
                                            <i class="material-icons icon-hidden" style="font-size: 18px;">visibility_off</i>
                                        </button>
                                        <button class="delete-item-btn" data-item-type="faq-item" data-item-id="${item.id || index}" style="background: none; border: none; cursor: pointer; padding: 4px;">
                                            <i class="material-icons" style="font-size: 18px; color: #dc3545;">delete</i>
                                        </button>
                                    </div>
                                </div>
                            `).join('')}
                        </div>
                    ` : ''}
                </div>
            `;
        }
        
        return html;
    },
    
    // Attach event handlers for blocks (clicks, drag, etc)
    attachBlockEventHandlers: function() {
        console.log('[PRODUCT-CONTAINER] Attaching block event handlers');
        console.log('[PRODUCT-CONTAINER] Found blocks:', $('.product-info-block').length);
        
        // Handler for Product Info block clicks (open configuration)
        $(document).off('click', '.product-info-block').on('click', '.product-info-block', function(e) {
            e.preventDefault();
            console.log('[PRODUCT-CONTAINER] Block clicked', e.target);
            console.log('[PRODUCT-CONTAINER] Current target:', e.currentTarget);
            
            // Don't trigger if clicking on visibility toggle or the drag handle
            if ($(e.target).closest('.visibility-toggle').length || 
                $(e.target).hasClass('drag-handle') || $(e.target).closest('.drag-handle').length) {
                console.log('[PRODUCT-CONTAINER] Click on toggle or drag handle, ignoring');
                return;
            }
            
            const blockId = $(this).data('block-id');
            console.log('[PRODUCT-CONTAINER] Block ID:', blockId);
            
            // Get the current product container config
            const productContainerConfig = window.currentSectionsConfig['product-container'];
            if (!productContainerConfig || !productContainerConfig.sections || !productContainerConfig.sections.productInfo) {
                console.error('[PRODUCT-CONTAINER] Product container config not found');
                return;
            }
            
            const blocks = productContainerConfig.sections.productInfo.config?.blocks || {};
            const block = blocks[blockId] || { type: blockId, isHidden: false };
            
            console.log('[PRODUCT-CONTAINER] Block data:', block);
            
            // Set return context for Product Container
            window.productContainerReturnData = {
                fromView: 'productContainer',
                returnTo: 'productContainerSettings'
            };
            
            // Copy block data to the expected context for featured product views
            if (!window.currentSectionsConfig.featuredProduct) {
                window.currentSectionsConfig.featuredProduct = { blocks: {} };
            }
            if (!window.currentSectionsConfig.featuredProduct.blocks) {
                window.currentSectionsConfig.featuredProduct.blocks = {};
            }
            window.currentSectionsConfig.featuredProduct.blocks[blockId] = block;
            
            // Route to appropriate settings view based on block type
            switch(blockId) {
                case 'description':
                    console.log('[PRODUCT-CONTAINER] Opening description settings');
                    window.switchSidebarView('descriptionSettings', block);
                    break;
                case 'buy-buttons':
                    console.log('[PRODUCT-CONTAINER] Opening buy buttons settings');
                    // Use custom settings view for buy buttons
                    window.switchSidebarView('productContainerBuyButtonsSettings', block);
                    break;
                case 'price':
                    console.log('[PRODUCT-CONTAINER] Opening price settings');
                    window.switchSidebarView('priceSettings', block);
                    break;
                case 'inventory-status':
                    console.log('[PRODUCT-CONTAINER] Opening inventory status settings');
                    window.switchSidebarView('inventoryStatusSettings', block);
                    break;
                case 'title':
                    console.log('[PRODUCT-CONTAINER] Opening title settings');
                    window.switchSidebarView('titleSettings', block);
                    break;
                case 'variant-picker':
                    console.log('[PRODUCT-CONTAINER] Opening variant picker settings');
                    window.switchSidebarView('variantPickerSettings', block);
                    break;
                default:
                    // Blocks without configuration views
                    console.log('[PRODUCT-CONTAINER] No configuration view for block:', blockId);
            }
        });
        
        // Handler for Product Info block visibility toggles
        $(document).off('click', '.product-info-block .visibility-toggle').on('click', '.product-info-block .visibility-toggle', function(e) {
            e.stopPropagation();
            const blockId = $(this).data('block-id');
            const $button = $(this);
            
            const productContainerConfig = window.currentSectionsConfig['product-container'];
            if (!productContainerConfig || !productContainerConfig.sections || !productContainerConfig.sections.productInfo) {
                return;
            }
            
            if (!productContainerConfig.sections.productInfo.config.blocks) {
                productContainerConfig.sections.productInfo.config.blocks = {};
            }
            
            const block = productContainerConfig.sections.productInfo.config.blocks[blockId];
            if (block) {
                block.isHidden = !block.isHidden;
                $button.toggleClass('is-hidden');
                window.hasPendingPageStructureChanges = true;
                window.updateSaveButtonState();
                window.renderPreview();
            }
        });
        
        // Initialize sortable for Product Info blocks
        setTimeout(() => {
            console.log('[PRODUCT-CONTAINER] Initializing sortable for product info blocks');
            const $blocks = $('#product-info-blocks');
            
            // Destroy existing sortable if any
            if ($blocks.hasClass('ui-sortable')) {
                console.log('[PRODUCT-CONTAINER] Destroying existing sortable');
                $blocks.sortable('destroy');
            }
            
            // Create new sortable
            if ($blocks.length > 0) {
                console.log('[PRODUCT-CONTAINER] Creating new sortable instance');
                $blocks.sortable({
                    items: '.product-info-block',
                    handle: '.drag-handle',
                    axis: 'y',
                    tolerance: 'pointer',
                    placeholder: 'product-info-block-placeholder',
                    forcePlaceholderSize: true,
                    helper: 'clone',
                    containment: 'parent',
                    start: function(event, ui) {
                        // Set placeholder height to match the dragged item
                        ui.placeholder.height(ui.helper.outerHeight());
                        // Add class to the helper for proper styling
                        ui.helper.addClass('dragging');
                    },
                    stop: function(event, ui) {
                        // Remove dragging class
                        ui.item.removeClass('dragging');
                    },
                    update: function(event, ui) {
                        // Get new order
                        const newOrder = [];
                        $('#product-info-blocks .product-info-block').each(function() {
                            newOrder.push($(this).data('block-id'));
                        });
                        
                        // Update config
                        const productContainerConfig = window.currentSectionsConfig['product-container'];
                        if (productContainerConfig && productContainerConfig.sections && productContainerConfig.sections.productInfo) {
                            if (!productContainerConfig.sections.productInfo.config) {
                                productContainerConfig.sections.productInfo.config = {};
                            }
                            productContainerConfig.sections.productInfo.config.blockOrder = newOrder;
                            
                            window.hasPendingPageStructureChanges = true;
                            window.updateSaveButtonState();
                            window.renderPreview();
                        }
                    }
                });
                console.log('[PRODUCT-CONTAINER] Sortable initialized successfully');
            }
        }, 150);
    },
    
    // Initialize event handlers for settings
    initializeSettingsHandlers: function(config, updateCallback) {
        // Restore scroll position if saved
        if (window.WebsiteBuilderModules.ProductContainer.savedScrollPosition > 0) {
            // Hide content initially to prevent flicker
            const mainContainer = document.querySelector('#sidebar-dynamic-content .product-container-settings');
            if (mainContainer) {
                mainContainer.style.opacity = '0';
            }
            
            // Use requestAnimationFrame for smoother restoration
            requestAnimationFrame(() => {
                const scrollContainer = document.querySelector('#sidebar-dynamic-content .product-container-settings > div[style*="overflow-y: auto"]');
                if (scrollContainer) {
                    // Set the scroll position immediately without animation
                    scrollContainer.scrollTop = window.WebsiteBuilderModules.ProductContainer.savedScrollPosition;
                    
                    // Fade in the content after scroll is set
                    if (mainContainer) {
                        mainContainer.style.transition = 'opacity 0.2s ease-out';
                        requestAnimationFrame(() => {
                            mainContainer.style.opacity = '1';
                        });
                    }
                    
                    // Reset saved position
                    window.WebsiteBuilderModules.ProductContainer.savedScrollPosition = 0;
                }
            });
        } else {
            // If no scroll position saved, just fade in normally
            const mainContainer = document.querySelector('#sidebar-dynamic-content .product-container-settings');
            if (mainContainer) {
                mainContainer.style.opacity = '0';
                mainContainer.style.transition = 'opacity 0.2s ease-out';
                requestAnimationFrame(() => {
                    mainContainer.style.opacity = '1';
                });
            }
        }
        
        // Color scheme change
        $('#product-container-color-scheme').on('change', function() {
            config.colorScheme = $(this).val();
            updateCallback('colorScheme', config.colorScheme);
        });
        
        // Width change
        $('#product-container-width').on('change', function() {
            config.width = $(this).val();
            updateCallback('width', config.width);
        });
        
        // Handler for Image with Text add button
        $(document).off('click', '#product-image-text-add-btn').on('click', '#product-image-text-add-btn', function() {
            const blockId = 'block-' + Date.now();
            const sections = currentSectionsConfig['product-container'].sections || {};
            
            if (!sections.imageWithText) {
                sections.imageWithText = { enabled: true, config: { blocks: [] } };
            }
            if (!sections.imageWithText.config) {
                sections.imageWithText.config = { blocks: [] };
            }
            if (!sections.imageWithText.config.blocks) {
                sections.imageWithText.config.blocks = [];
            }
            
            sections.imageWithText.config.blocks.push({
                id: blockId,
                imageUrl: '/placeholder-image.jpg',
                title: 'Nuevo bloque',
                description: 'Descripción del bloque',
                buttonText: 'Botón',
                buttonUrl: '#',
                imagePosition: 'left',
                isHidden: false
            });
            
            hasPendingPageStructureChanges = true;
            updateSaveButtonState();
            // Save scroll position before re-rendering
            const scrollContainer = document.querySelector('#sidebar-dynamic-content .product-container-settings > div[style*="overflow-y: auto"]');
            if (scrollContainer) {
                window.WebsiteBuilderModules.ProductContainer.savedScrollPosition = scrollContainer.scrollTop;
            }
            // Re-render the settings view
            window.switchSidebarView('productContainerSettings');
        });
        
        // Handler for Gallery add button
        $(document).off('click', '#product-gallery-add-btn').on('click', '#product-gallery-add-btn', function() {
            const imageId = 'img-' + Date.now();
            const sections = currentSectionsConfig['product-container'].sections || {};
            
            if (!sections.gallery) {
                sections.gallery = { enabled: true, config: { images: [] } };
            }
            if (!sections.gallery.config) {
                sections.gallery.config = { images: [] };
            }
            if (!sections.gallery.config.images) {
                sections.gallery.config.images = [];
            }
            
            sections.gallery.config.images.push({
                id: imageId,
                url: '/placeholder-image.jpg',
                caption: 'Nueva imagen',
                altText: '',
                isHidden: false
            });
            
            hasPendingPageStructureChanges = true;
            updateSaveButtonState();
            // Save scroll position before re-rendering
            const scrollContainer = document.querySelector('#sidebar-dynamic-content > div');
            const scrollPosition = scrollContainer ? scrollContainer.scrollTop : 0;
            window.switchSidebarView('productContainerSettings');
            // Restore scroll position after a small delay
            setTimeout(() => {
                const newScrollContainer = document.querySelector('#sidebar-dynamic-content > div');
                if (newScrollContainer && scrollPosition > 0) {
                    newScrollContainer.scrollTop = scrollPosition;
                }
            }, 50);
        });
        
        // Handler for Testimonials add button
        $(document).off('click', '#product-testimonials-add-btn').on('click', '#product-testimonials-add-btn', function() {
            const testimonialId = 'test-' + Date.now();
            const sections = currentSectionsConfig['product-container'].sections || {};
            
            if (!sections.testimonials) {
                sections.testimonials = { enabled: true, config: { testimonials: [] } };
            }
            if (!sections.testimonials.config) {
                sections.testimonials.config = { testimonials: [] };
            }
            if (!sections.testimonials.config.testimonials) {
                sections.testimonials.config.testimonials = [];
            }
            
            sections.testimonials.config.testimonials.push({
                id: testimonialId,
                author: 'Nuevo testimonio',
                text: 'Texto del testimonio',
                rating: 5,
                position: 'Cliente',
                isHidden: false
            });
            
            hasPendingPageStructureChanges = true;
            updateSaveButtonState();
            // Save scroll position before re-rendering
            const scrollContainer = document.querySelector('#sidebar-dynamic-content > div');
            const scrollPosition = scrollContainer ? scrollContainer.scrollTop : 0;
            window.switchSidebarView('productContainerSettings');
            // Restore scroll position after a small delay
            setTimeout(() => {
                const newScrollContainer = document.querySelector('#sidebar-dynamic-content > div');
                if (newScrollContainer && scrollPosition > 0) {
                    newScrollContainer.scrollTop = scrollPosition;
                }
            }, 50);
        });
        
        // Handler for Product Info Settings button
        $(document).off('click', '#product-info-settings-btn').on('click', '#product-info-settings-btn', function(e) {
            e.stopPropagation();
            
            // Store return view info
            window.productContainerReturnData = {
                fromView: 'productContainer',
                returnTo: 'productContainerSettings',
                hideProductSelector: true
            };
            
            // Copy current product info config to featured product context temporarily
            if (!currentSectionsConfig.featuredProduct) {
                currentSectionsConfig.featuredProduct = {};
            }
            
            // Get product info config from product container
            const productInfoConfig = currentSectionsConfig['product-container']?.sections?.productInfo?.config || {};
            
            // Copy all settings
            Object.assign(currentSectionsConfig.featuredProduct, productInfoConfig);
            
            // Open featured product settings (which will detect the context)
            window.switchSidebarView('featuredProductSettings');
        });
        
        // Handler for section headers - open configuration
        $(document).off('click', '.section-header[data-section-type]').on('click', '.section-header[data-section-type]', function(e) {
            // Don't do anything if clicking on buttons
            if ($(e.target).closest('button').length) return;
            
            const sectionType = $(this).data('section-type');
            
            switch(sectionType) {
                case 'productInfo':
                    // Special case for Product Info - needs to copy configuration
                    window.productContainerReturnData = {
                        fromView: 'productContainer',
                        returnTo: 'productContainerSettings',
                        hideProductSelector: true
                    };
                    
                    // Copy current product info config to featured product context temporarily
                    if (!currentSectionsConfig.featuredProduct) {
                        currentSectionsConfig.featuredProduct = {};
                    }
                    
                    // Get product info config from product container
                    const productInfoConfig = currentSectionsConfig['product-container']?.sections?.productInfo?.config || {};
                    
                    // Copy all settings
                    Object.assign(currentSectionsConfig.featuredProduct, productInfoConfig);
                    
                    // Open featured product settings (which will detect the context)
                    window.switchSidebarView('featuredProductSettings');
                    break;
                    
                case 'imageWithText':
                    // Store return view info
                    window.productContainerReturnData = {
                        fromView: 'productContainer',
                        returnTo: 'productContainerSettings'
                    };
                    console.log('[PRODUCT-CONTAINER] Setting productContainerReturnData:', window.productContainerReturnData);
                    // Open Image with Text settings
                    window.switchSidebarView('imageWithTextSettings');
                    break;
                    
                case 'gallery':
                    // Store return view info
                    window.productContainerReturnData = {
                        fromView: 'productContainer',
                        returnTo: 'productContainerSettings'
                    };
                    // Open Gallery settings
                    window.switchSidebarView('gallerySettings');
                    break;
                    
                case 'testimonials':
                    // Store return view info
                    window.productContainerReturnData = {
                        fromView: 'productContainer',
                        returnTo: 'productContainerSettings'
                    };
                    // Open Testimonials settings
                    window.switchSidebarView('testimonialsSettings');
                    break;
                    
                case 'faq':
                    // Store return view info
                    window.productContainerReturnData = {
                        fromView: 'productContainer',
                        returnTo: 'productContainerSettings'
                    };
                    // Open FAQ/Accordion settings
                    window.switchSidebarView('accordionSettings');
                    break;
            }
        });
        
        // Handler for FAQ add button
        $(document).off('click', '#product-faq-add-btn').on('click', '#product-faq-add-btn', function() {
            const faqId = 'faq-' + Date.now();
            const sections = currentSectionsConfig['product-container'].sections || {};
            
            if (!sections.faq) {
                sections.faq = { enabled: true, config: { items: [] } };
            }
            if (!sections.faq.config) {
                sections.faq.config = { items: [] };
            }
            if (!sections.faq.config.items) {
                sections.faq.config.items = [];
            }
            
            sections.faq.config.items.push({
                id: faqId,
                question: 'Nueva pregunta',
                answer: 'Respuesta a la pregunta',
                isHidden: false
            });
            
            hasPendingPageStructureChanges = true;
            updateSaveButtonState();
            // Save scroll position before re-rendering
            const scrollContainer = document.querySelector('#sidebar-dynamic-content > div');
            const scrollPosition = scrollContainer ? scrollContainer.scrollTop : 0;
            window.switchSidebarView('productContainerSettings');
            // Restore scroll position after a small delay
            setTimeout(() => {
                const newScrollContainer = document.querySelector('#sidebar-dynamic-content > div');
                if (newScrollContainer && scrollPosition > 0) {
                    newScrollContainer.scrollTop = scrollPosition;
                }
            }, 50);
        });
        
        // Handler for clicking on item rows - inline editing
        $(document).on('click', '.item-row[data-item-type]', function(e) {
            // Don't navigate if clicking on buttons
            if ($(e.target).closest('button').length) return;
            
            const itemType = $(this).data('item-type');
            const itemId = $(this).data('item-id');
            const $row = $(this);
            
            // Find the item in the configuration
            const sections = currentSectionsConfig['product-container'].sections || {};
            let item = null;
            let itemName = '';
            
            switch(itemType) {
                case 'iwt-block':
                case 'image-text-block':
                    item = sections.imageWithText?.config?.blocks?.find(b => b.id === itemId);
                    itemName = 'Bloque';
                    // Open Image with Text block configuration view
                    if (item) {
                        // Store return view info for the block settings
                        window.productContainerReturnData = {
                            fromView: 'productContainer', 
                            returnTo: 'productContainerSettings'
                        };
                        
                        // First need to set the imageWithText context in currentSectionsConfig
                        if (!currentSectionsConfig.imageWithText) {
                            currentSectionsConfig.imageWithText = {
                                blocks: {}
                            };
                        }
                        // Copy the block to the expected location
                        currentSectionsConfig.imageWithText.blocks[itemId] = item;
                        
                        // Open the existing Image with Text block settings view
                        window.switchSidebarView('imageWithTextBlockSettings', { blockId: itemId });
                        return;
                    }
                    break;
                case 'gallery-image':
                    // Navigate to gallery image settings instead of inline editing
                    const galleryImages = sections.gallery?.config?.images || [];
                    const galleryImage = galleryImages.find(i => String(i.id) === String(itemId));
                    
                    console.log('[PRODUCT-CONTAINER] Gallery image navigation:', {
                        itemId,
                        galleryImages,
                        galleryImage,
                        found: !!galleryImage
                    });
                    
                    if (galleryImage) {
                        // Store return view info for navigation
                        window.productContainerReturnData = {
                            fromView: 'productContainer',
                            returnTo: 'productContainerSettings'
                        };
                        
                        // Ensure gallery config exists in currentSectionsConfig
                        if (!currentSectionsConfig.gallery) {
                            currentSectionsConfig.gallery = {
                                images: {}
                            };
                        }
                        
                        // Copy all images to the expected structure
                        galleryImages.forEach(img => {
                            currentSectionsConfig.gallery.images[img.id] = img;
                        });
                        
                        // Navigate to gallery image settings
                        window.switchSidebarView('galleryImageSettings', { imageId: itemId });
                        return;
                    }
                    break;
                case 'testimonial':
                case 'testimonial-item':
                    // Navigate to testimonial child settings instead of inline editing
                    const testimonialArray = sections.testimonials?.config?.testimonials || [];
                    const testimonialItem = testimonialArray.find(t => String(t.id) === String(itemId));
                    
                    console.log('[PRODUCT-CONTAINER] Testimonial navigation:', {
                        itemId,
                        testimonialArray,
                        testimonialItem,
                        found: !!testimonialItem
                    });
                    
                    if (testimonialItem) {
                        // Store return view info for navigation
                        window.productContainerReturnData = {
                            fromView: 'productContainer',
                            returnTo: 'productContainerSettings'
                        };
                        
                        // Ensure testimonials config exists in currentSectionsConfig
                        if (!currentSectionsConfig.testimonials) {
                            currentSectionsConfig.testimonials = {
                                testimonials: {},
                                testimonialsOrder: []
                            };
                        }
                        
                        // Copy all testimonials to the expected structure
                        testimonialArray.forEach(t => {
                            currentSectionsConfig.testimonials.testimonials[t.id] = t;
                            if (!currentSectionsConfig.testimonials.testimonialsOrder.includes(t.id)) {
                                currentSectionsConfig.testimonials.testimonialsOrder.push(t.id);
                            }
                        });
                        
                        // Set the current testimonial ID and navigate to child settings
                        window.currentTestimonialId = itemId;
                        window.switchSidebarView('testimonialChildSettings');
                        return;
                    }
                    break;
                case 'faq-item':
                    // Navigate to accordion item settings instead of inline editing
                    const faqItems = sections.faq?.config?.items || [];
                    const faqItem = faqItems.find(i => String(i.id) === String(itemId));
                    
                    console.log('[PRODUCT-CONTAINER] FAQ item navigation:', {
                        itemId,
                        faqItems,
                        faqItem,
                        found: !!faqItem
                    });
                    
                    if (faqItem) {
                        // Store return view info for navigation
                        window.productContainerReturnData = {
                            fromView: 'productContainer',
                            returnTo: 'productContainerSettings'
                        };
                        
                        // Ensure accordion config exists in currentSectionsConfig (FAQ uses accordion module)
                        if (!currentSectionsConfig.accordion) {
                            currentSectionsConfig.accordion = {
                                items: {},
                                itemOrder: []
                            };
                        }
                        
                        // Copy all FAQ items to the expected accordion structure
                        faqItems.forEach(item => {
                            currentSectionsConfig.accordion.items[item.id] = item;
                            if (!currentSectionsConfig.accordion.itemOrder.includes(item.id)) {
                                currentSectionsConfig.accordion.itemOrder.push(item.id);
                            }
                        });
                        
                        // Set the current accordion item ID and navigate to item settings
                        window.currentAccordionItemId = itemId;
                        window.switchSidebarView('accordionItemSettings', { itemId: itemId });
                        return;
                    }
                    break;
            }
            
            if (!item) return;
            
            // Create simple edit dialog based on item type
            let editHtml = `<div class="edit-dialog" style="padding: 15px; background: #f5f5f5; border: 1px solid #ddd; border-radius: 4px; margin-top: 10px;">`;
            
            switch(itemType) {
                case 'image-text-block':
                    editHtml += `
                        <h5 style="margin: 0 0 10px 0; font-size: 14px;">Editar ${itemName}</h5>
                        <input type="text" class="edit-field" data-field="title" value="${item.title || ''}" placeholder="Título" style="width: 100%; margin-bottom: 8px; padding: 6px;">
                        <textarea class="edit-field" data-field="description" placeholder="Descripción" style="width: 100%; margin-bottom: 8px; padding: 6px;">${item.description || ''}</textarea>
                        <input type="text" class="edit-field" data-field="imageUrl" value="${item.imageUrl || ''}" placeholder="URL de imagen" style="width: 100%; margin-bottom: 8px; padding: 6px;">
                    `;
                    break;
                case 'gallery-image':
                    editHtml += `
                        <h5 style="margin: 0 0 10px 0; font-size: 14px;">Editar ${itemName}</h5>
                        <input type="text" class="edit-field" data-field="url" value="${item.url || ''}" placeholder="URL de imagen" style="width: 100%; margin-bottom: 8px; padding: 6px;">
                        <input type="text" class="edit-field" data-field="caption" value="${item.caption || ''}" placeholder="Subtítulo" style="width: 100%; margin-bottom: 8px; padding: 6px;">
                    `;
                    break;
                case 'testimonial-item':
                    editHtml += `
                        <h5 style="margin: 0 0 10px 0; font-size: 14px;">Editar ${itemName}</h5>
                        <input type="text" class="edit-field" data-field="author" value="${item.author || ''}" placeholder="Autor" style="width: 100%; margin-bottom: 8px; padding: 6px;">
                        <input type="text" class="edit-field" data-field="position" value="${item.position || ''}" placeholder="Cargo" style="width: 100%; margin-bottom: 8px; padding: 6px;">
                        <textarea class="edit-field" data-field="text" placeholder="Testimonio" style="width: 100%; margin-bottom: 8px; padding: 6px;">${item.text || ''}</textarea>
                    `;
                    break;
                case 'faq-item':
                    editHtml += `
                        <h5 style="margin: 0 0 10px 0; font-size: 14px;">Editar ${itemName}</h5>
                        <input type="text" class="edit-field" data-field="question" value="${item.question || ''}" placeholder="Pregunta" style="width: 100%; margin-bottom: 8px; padding: 6px;">
                        <textarea class="edit-field" data-field="answer" placeholder="Respuesta" style="width: 100%; margin-bottom: 8px; padding: 6px;">${item.answer || ''}</textarea>
                    `;
                    break;
            }
            
            editHtml += `
                <div style="display: flex; gap: 10px; margin-top: 10px;">
                    <button class="save-edit-btn" style="background: var(--primary); color: white; border: none; padding: 6px 12px; border-radius: 3px; cursor: pointer;">Guardar</button>
                    <button class="cancel-edit-btn" style="background: #ccc; color: #333; border: none; padding: 6px 12px; border-radius: 3px; cursor: pointer;">Cancelar</button>
                </div>
            </div>`;
            
            // Remove any existing edit dialogs
            $('.edit-dialog').remove();
            
            // Insert edit dialog after the row
            $row.after(editHtml);
            
            // Handle save button
            $('.save-edit-btn').on('click', function() {
                $('.edit-field').each(function() {
                    const field = $(this).data('field');
                    const value = $(this).val();
                    item[field] = value;
                });
                
                hasPendingPageStructureChanges = true;
                updateSaveButtonState();
                renderPreview();
                
                // Update the row label
                const newLabel = item.title || item.author || item.question || item.caption || itemName;
                $row.find('span').first().text(newLabel);
                
                // Remove edit dialog
                $('.edit-dialog').remove();
            });
            
            // Handle cancel button
            $('.cancel-edit-btn').on('click', function() {
                $('.edit-dialog').remove();
            });
        });
        
        // Handler for visibility toggle buttons
        $(document).on('click', '.visibility-toggle[data-item-type]', function(e) {
            e.stopPropagation();
            const itemType = $(this).data('item-type');
            const itemId = $(this).data('item-id');
            const $button = $(this);
            
            // Find the item in the configuration
            const sections = currentSectionsConfig['product-container'].sections || {};
            let item = null;
            
            switch(itemType) {
                case 'image-text-block':
                    item = sections.imageWithText?.config?.blocks?.find(b => b.id === itemId);
                    break;
                case 'gallery-image':
                    item = sections.gallery?.config?.images?.find(i => i.id === itemId);
                    break;
                case 'testimonial-item':
                    item = sections.testimonials?.config?.testimonials?.find(t => t.id === itemId);
                    break;
                case 'faq-item':
                    item = sections.faq?.config?.items?.find(i => i.id === itemId);
                    break;
            }
            
            if (item) {
                item.isHidden = !item.isHidden;
                $button.toggleClass('is-hidden');
                hasPendingPageStructureChanges = true;
                updateSaveButtonState();
                renderPreview();
            }
        });
        
        // Handler for visibility toggle on child items
        $(document).off('click', '.visibility-toggle[data-item-type]').on('click', '.visibility-toggle[data-item-type]', function(e) {
            e.stopPropagation();
            const itemType = $(this).data('item-type');
            const itemId = $(this).data('item-id');
            const $button = $(this);
            
            const sections = currentSectionsConfig['product-container'].sections || {};
            let found = false;
            
            switch(itemType) {
                case 'iwt-block':
                case 'image-text-block':
                    if (sections.imageWithText?.config?.blocks) {
                        const block = sections.imageWithText.config.blocks.find((b, index) => 
                            String(b.id || index) === String(itemId)
                        );
                        if (block) {
                            block.isHidden = !block.isHidden;
                            found = true;
                        }
                    }
                    break;
                case 'gallery-image':
                    if (sections.gallery?.config?.images) {
                        const img = sections.gallery.config.images.find((i, index) => 
                            String(i.id || index) === String(itemId)
                        );
                        if (img) {
                            img.isHidden = !img.isHidden;
                            found = true;
                        }
                    }
                    break;
                case 'testimonial':
                    if (sections.testimonials?.config?.testimonials) {
                        const testimonial = sections.testimonials.config.testimonials.find((t, index) => 
                            String(t.id || index) === String(itemId)
                        );
                        if (testimonial) {
                            testimonial.isHidden = !testimonial.isHidden;
                            found = true;
                        }
                    }
                    break;
                case 'faq-item':
                    if (sections.faq?.config?.items) {
                        const item = sections.faq.config.items.find((i, index) => 
                            String(i.id || index) === String(itemId)
                        );
                        if (item) {
                            item.isHidden = !item.isHidden;
                            found = true;
                        }
                    }
                    break;
            }
            
            if (found) {
                $button.toggleClass('is-hidden');
                hasPendingPageStructureChanges = true;
                updateSaveButtonState();
                renderPreview();
            }
        });
        
        // Handler for delete buttons
        $(document).off('click', '.delete-item-btn[data-item-type]').on('click', '.delete-item-btn[data-item-type]', function(e) {
            e.stopPropagation();
            const itemType = $(this).data('item-type');
            const itemId = $(this).data('item-id');
            
            if (confirm('¿Estás seguro de que deseas eliminar este elemento?')) {
                const sections = currentSectionsConfig['product-container'].sections || {};
                
                switch(itemType) {
                    case 'iwt-block':
                    case 'image-text-block':
                        if (sections.imageWithText?.config?.blocks) {
                            sections.imageWithText.config.blocks = sections.imageWithText.config.blocks.filter(b => {
                                // Compare both as strings to avoid type mismatch
                                return String(b.id) !== String(itemId);
                            });
                        }
                        break;
                    case 'gallery-image':
                        if (sections.gallery?.config?.images) {
                            sections.gallery.config.images = sections.gallery.config.images.filter((img, index) => {
                                // Compare both id and index position
                                return String(img.id || index) !== String(itemId);
                            });
                        }
                        break;
                    case 'testimonial':
                        if (sections.testimonials?.config?.testimonials) {
                            sections.testimonials.config.testimonials = sections.testimonials.config.testimonials.filter((t, index) => {
                                // Compare both id and index position
                                return String(t.id || index) !== String(itemId);
                            });
                        }
                        break;
                    case 'faq-item':
                        if (sections.faq?.config?.items) {
                            sections.faq.config.items = sections.faq.config.items.filter((item, index) => {
                                // Compare both id and index position
                                return String(item.id || index) !== String(itemId);
                            });
                        }
                        break;
                }
                
                hasPendingPageStructureChanges = true;
                updateSaveButtonState();
                // Save scroll position before re-rendering
                const scrollContainer = document.querySelector('#sidebar-dynamic-content .product-container-settings > div[style*="overflow-y: auto"]');
                if (scrollContainer) {
                    window.WebsiteBuilderModules.ProductContainer.savedScrollPosition = scrollContainer.scrollTop;
                    console.log('[PRODUCT-CONTAINER] Saved scroll position:', scrollContainer.scrollTop);
                }
                window.switchSidebarView('productContainerSettings');
                renderPreview();
            }
        });
    },
    
    // Render Buy Buttons Settings view
    renderBuyButtonsSettings: function(configData) {
        const config = configData || {};
        const currentLang = window.currentLanguage || 'es';
        
        return `
            <div style="display: flex; flex-direction: column; height: 100%; position: relative; overflow: hidden;">
                <!-- Header con flecha de regreso -->
                <div class="sidebar-view-header" style="position: relative; z-index: 10;">
                    <button class="back-to-sections-btn">
                        <i class="material-icons">arrow_back</i>
                    </button>
                    <h3>${currentLang === 'es' ? 'Botones de compra' : 'Buy buttons'}</h3>
                </div>
                
                <!-- Contenido con scroll -->
                <div style="padding: 20px; overflow-y: auto; overflow-x: hidden; flex: 1; height: calc(100% - 60px); box-sizing: border-box;">
                    
                    <!-- Show add to cart button (toggle) -->
                    <div class="form-group">
                        <label class="toggle-field">
                            <span>${currentLang === 'es' ? 'Mostrar botón agregar al carrito' : 'Show add to cart button'}</span>
                            <input type="checkbox" class="shopify-toggle" id="productContainerShowAddToCartButton" ${config.showAddToCartButton !== false ? 'checked' : ''}>
                            <label for="productContainerShowAddToCartButton" class="toggle-slider"></label>
                        </label>
                    </div>

                    <!-- Add to cart button style -->
                    <div class="form-group" style="margin-top: 20px; ${config.showAddToCartButton !== false ? '' : 'display:none;'}" id="addToCartButtonStyleContainer">
                        <label style="font-size: 13px; font-weight: 500; margin-bottom: 8px; color: #5c5e60; display: block;">
                            ${currentLang === 'es' ? 'Estilo del botón agregar al carrito' : 'Add to cart button style'}</label>
                        <select class="shopify-select" id="productContainerAddToCartButtonStyle" 
                                style="width: 100%; padding: 8px 12px; border: 1px solid #e0e0e0; border-radius: 4px; background: white;">
                            <option value="solid" ${config.addToCartButtonStyle === 'solid' || !config.addToCartButtonStyle ? 'selected' : ''}>${currentLang === 'es' ? 'Sólido' : 'Solid'}</option>
                            <option value="outline" ${config.addToCartButtonStyle === 'outline' ? 'selected' : ''}>${currentLang === 'es' ? 'Contorno' : 'Outline'}</option>
                        </select>
                        
                        <!-- Add to cart button text -->
                        <label style="font-size: 13px; font-weight: 500; margin-bottom: 8px; margin-top: 16px; color: #5c5e60; display: block;">
                            ${currentLang === 'es' ? 'Texto del botón agregar al carrito' : 'Add to cart button text'}</label>
                        <input type="text" 
                               id="productContainerAddToCartButtonText" 
                               value="${config.addToCartButtonText || 'Agregar al carrito'}"
                               style="width: 100%; padding: 8px 12px; border: 1px solid #e0e0e0; border-radius: 4px;">
                    </div>

                    <!-- Show buy button (toggle) -->
                    <div class="form-group" style="margin-top: 20px;">
                        <label class="toggle-field">
                            <span>${currentLang === 'es' ? 'Mostrar botón comprar' : 'Show buy button'}</span>
                            <input type="checkbox" class="shopify-toggle" id="productContainerShowBuyButton" ${config.showBuyButton ? 'checked' : ''}>
                            <label for="productContainerShowBuyButton" class="toggle-slider"></label>
                        </label>
                    </div>

                    <!-- Buy button style -->
                    <div class="form-group" style="margin-top: 20px; ${config.showBuyButton ? '' : 'display:none;'}" id="buyButtonStyleContainer">
                        <label style="font-size: 13px; font-weight: 500; margin-bottom: 8px; color: #5c5e60; display: block;">
                            ${currentLang === 'es' ? 'Estilo del botón comprar' : 'Buy button style'}</label>
                        <select class="shopify-select" id="productContainerBuyButtonStyle" 
                                style="width: 100%; padding: 8px 12px; border: 1px solid #e0e0e0; border-radius: 4px; background: white;">
                            <option value="solid" ${config.buyButtonStyle === 'solid' || !config.buyButtonStyle ? 'selected' : ''}>${currentLang === 'es' ? 'Sólido' : 'Solid'}</option>
                            <option value="outline" ${config.buyButtonStyle === 'outline' ? 'selected' : ''}>${currentLang === 'es' ? 'Contorno' : 'Outline'}</option>
                        </select>
                        
                        <!-- Buy button text -->
                        <label style="font-size: 13px; font-weight: 500; margin-bottom: 8px; margin-top: 16px; color: #5c5e60; display: block;">
                            ${currentLang === 'es' ? 'Texto del botón comprar' : 'Buy button text'}</label>
                        <input type="text" 
                               id="productContainerBuyButtonText" 
                               value="${config.buyButtonText || 'Comprar ahora'}"
                               style="width: 100%; padding: 8px 12px; border: 1px solid #e0e0e0; border-radius: 4px;">
                    </div>

                    <!-- Show reserve button (toggle) -->
                    <div class="form-group" style="margin-top: 20px;">
                        <label class="toggle-field">
                            <span>${currentLang === 'es' ? 'Mostrar botón reservar' : 'Show reserve button'}</span>
                            <input type="checkbox" class="shopify-toggle" id="productContainerShowReserveButton" ${config.showReserveButton ? 'checked' : ''}>
                            <label for="productContainerShowReserveButton" class="toggle-slider"></label>
                        </label>
                    </div>

                    <!-- Reserve button style -->
                    <div class="form-group" style="margin-top: 20px; ${config.showReserveButton ? '' : 'display:none;'}" id="reserveButtonStyleContainer">
                        <label style="font-size: 13px; font-weight: 500; margin-bottom: 8px; color: #5c5e60; display: block;">
                            ${currentLang === 'es' ? 'Estilo del botón reservar' : 'Reserve button style'}</label>
                        <select class="shopify-select" id="productContainerReserveButtonStyle" 
                                style="width: 100%; padding: 8px 12px; border: 1px solid #e0e0e0; border-radius: 4px; background: white;">
                            <option value="solid" ${config.reserveButtonStyle === 'solid' || !config.reserveButtonStyle ? 'selected' : ''}>${currentLang === 'es' ? 'Sólido' : 'Solid'}</option>
                            <option value="outline" ${config.reserveButtonStyle === 'outline' ? 'selected' : ''}>${currentLang === 'es' ? 'Contorno' : 'Outline'}</option>
                        </select>
                        
                        <!-- Reserve button text -->
                        <label style="font-size: 13px; font-weight: 500; margin-bottom: 8px; margin-top: 16px; color: #5c5e60; display: block;">
                            ${currentLang === 'es' ? 'Texto del botón reservar' : 'Reserve button text'}</label>
                        <input type="text" 
                               id="productContainerReserveButtonText" 
                               value="${config.reserveButtonText || 'Reservar'}"
                               style="width: 100%; padding: 8px 12px; border: 1px solid #e0e0e0; border-radius: 4px;">
                    </div>
                    
                </div>
            </div>
        `;
    },
    
    // Attach Buy Buttons Event Listeners
    attachBuyButtonsEventListeners: function() {
        // Back button
        $('.back-to-sections-btn').off('click.buybuttons').on('click.buybuttons', function() {
            window.switchSidebarView('productContainerSettings');
        });
        
        // Helper function to update buy buttons config
        const updateBuyButtonsConfig = (key, value) => {
            console.log('[PRODUCT-CONTAINER] Updating buy buttons config:', key, value);
            
            const productContainerConfig = window.currentSectionsConfig['product-container'];
            if (productContainerConfig?.sections?.productInfo?.config?.blocks?.['buy-buttons']) {
                productContainerConfig.sections.productInfo.config.blocks['buy-buttons'][key] = value;
                window.hasPendingPageStructureChanges = true;
                window.updateSaveButtonState();
                window.renderPreview();
            }
        };
        
        // Show/hide add to cart button
        $('#productContainerShowAddToCartButton').on('change', function() {
            const isChecked = $(this).is(':checked');
            updateBuyButtonsConfig('showAddToCartButton', isChecked);
            if (isChecked) {
                $('#addToCartButtonStyleContainer').show();
            } else {
                $('#addToCartButtonStyleContainer').hide();
            }
        });
        
        // Add to cart button style
        $('#productContainerAddToCartButtonStyle').on('change', function() {
            updateBuyButtonsConfig('addToCartButtonStyle', $(this).val());
        });
        
        // Add to cart button text
        $('#productContainerAddToCartButtonText').on('input', function() {
            updateBuyButtonsConfig('addToCartButtonText', $(this).val());
        });
        
        // Show/hide buy button
        $('#productContainerShowBuyButton').on('change', function() {
            const isChecked = $(this).is(':checked');
            updateBuyButtonsConfig('showBuyButton', isChecked);
            if (isChecked) {
                $('#buyButtonStyleContainer').show();
            } else {
                $('#buyButtonStyleContainer').hide();
            }
        });
        
        // Buy button style
        $('#productContainerBuyButtonStyle').on('change', function() {
            updateBuyButtonsConfig('buyButtonStyle', $(this).val());
        });
        
        // Buy button text
        $('#productContainerBuyButtonText').on('input', function() {
            updateBuyButtonsConfig('buyButtonText', $(this).val());
        });
        
        // Show/hide reserve button
        $('#productContainerShowReserveButton').on('change', function() {
            const isChecked = $(this).is(':checked');
            updateBuyButtonsConfig('showReserveButton', isChecked);
            if (isChecked) {
                $('#reserveButtonStyleContainer').show();
            } else {
                $('#reserveButtonStyleContainer').hide();
            }
        });
        
        // Reserve button style
        $('#productContainerReserveButtonStyle').on('change', function() {
            updateBuyButtonsConfig('reserveButtonStyle', $(this).val());
        });
        
        // Reserve button text
        $('#productContainerReserveButtonText').on('input', function() {
            updateBuyButtonsConfig('reserveButtonText', $(this).val());
        });
    },
    
    // Render Add to Cart button
    renderAddToCartButton: function(settings, schemeColors, uniqueId, product, bodyFont) {
        const isOutline = settings.addToCartButtonStyle === 'outline';
        const buttonText = settings.addToCartButtonText || 'Agregar al carrito';
        
        // Get colors from scheme
        const solidButtonBg = schemeColors['solid-button'] || '#121212';
        const solidButtonText = schemeColors['solid-button-text'] || '#ffffff';
        const outlineButtonBorder = schemeColors['outline-button'] || '#121212';
        const outlineButtonText = schemeColors['outline-button-text'] || '#121212';
        
        if (isOutline) {
            return `
                <button class="add-to-cart-button add-to-cart-outline-${uniqueId}" 
                        data-product-id="${product.id || 'demo-product'}"
                        data-product-name="${product.name || 'Demo Product'}"
                        data-product-price="${product.price || 0}"
                        data-product-vendor="${product.vendor || 'Store'}"
                        data-product-image="${product.images && product.images[0] ? product.images[0].url : ''}"
                        style="font-family: ${bodyFont}; width: 100%; padding: 14px 24px; background-color: transparent; color: ${outlineButtonText}; border: 1px solid ${outlineButtonBorder}; border-radius: 4px; font-size: 14px; font-weight: 500; cursor: pointer; transition: all 0.2s;">
                    ${buttonText}
                </button>
                <style>
                    .add-to-cart-outline-${uniqueId}:hover {
                        background-color: ${outlineButtonBorder} !important;
                        color: ${solidButtonText} !important;
                    }
                </style>
            `;
        } else {
            return `
                <button class="add-to-cart-button add-to-cart-solid-${uniqueId}" 
                        data-product-id="${product.id || 'demo-product'}"
                        data-product-name="${product.name || 'Demo Product'}"
                        data-product-price="${product.price || 0}"
                        data-product-vendor="${product.vendor || 'Store'}"
                        data-product-image="${product.images && product.images[0] ? product.images[0].url : ''}"
                        style="font-family: ${bodyFont}; width: 100%; padding: 14px 24px; background-color: ${solidButtonBg}; color: ${solidButtonText}; border: none; border-radius: 4px; font-size: 14px; font-weight: 500; cursor: pointer; transition: opacity 0.2s;">
                    ${buttonText}
                </button>
                <style>
                    .add-to-cart-solid-${uniqueId}:hover {
                        opacity: 0.9 !important;
                    }
                </style>
            `;
        }
    },
    
    // Render Buy button
    renderBuyButton: function(settings, schemeColors, uniqueId, product, bodyFont) {
        const isOutline = settings.buyButtonStyle === 'outline';
        const buttonText = settings.buyButtonText || 'Comprar ahora';
        
        // Get colors from scheme
        const solidButtonBg = schemeColors['solid-button'] || '#121212';
        const solidButtonText = schemeColors['solid-button-text'] || '#ffffff';
        const outlineButtonBorder = schemeColors['outline-button'] || '#121212';
        const outlineButtonText = schemeColors['outline-button-text'] || '#121212';
        
        if (isOutline) {
            return `
                <button class="buy-now-button buy-now-outline-${uniqueId}" 
                        data-product-id="${product.id || 'demo-product'}"
                        style="font-family: ${bodyFont}; width: 100%; padding: 14px 24px; background-color: transparent; color: ${outlineButtonText}; border: 1px solid ${outlineButtonBorder}; border-radius: 4px; font-size: 14px; font-weight: 500; cursor: pointer; transition: all 0.2s;">
                    ${buttonText}
                </button>
                <style>
                    .buy-now-outline-${uniqueId}:hover {
                        background-color: ${outlineButtonBorder} !important;
                        color: ${solidButtonText} !important;
                    }
                </style>
            `;
        } else {
            return `
                <button class="buy-now-button buy-now-solid-${uniqueId}" 
                        data-product-id="${product.id || 'demo-product'}"
                        style="font-family: ${bodyFont}; width: 100%; padding: 14px 24px; background-color: ${solidButtonBg}; color: ${solidButtonText}; border: none; border-radius: 4px; font-size: 14px; font-weight: 500; cursor: pointer; transition: opacity 0.2s;">
                    ${buttonText}
                </button>
                <style>
                    .buy-now-solid-${uniqueId}:hover {
                        opacity: 0.9 !important;
                    }
                </style>
            `;
        }
    },
    
    // Render Reserve button
    renderReserveButton: function(settings, schemeColors, uniqueId, product, bodyFont) {
        const isOutline = settings.reserveButtonStyle === 'outline';
        const buttonText = settings.reserveButtonText || 'Reservar';
        
        // Get colors from scheme
        const solidButtonBg = schemeColors['solid-button'] || '#121212';
        const solidButtonText = schemeColors['solid-button-text'] || '#ffffff';
        const outlineButtonBorder = schemeColors['outline-button'] || '#121212';
        const outlineButtonText = schemeColors['outline-button-text'] || '#121212';
        
        if (isOutline) {
            return `
                <button class="reserve-button reserve-outline-${uniqueId}" 
                        data-product-id="${product.id || 'demo-product'}"
                        style="font-family: ${bodyFont}; width: 100%; padding: 14px 24px; background-color: transparent; color: ${outlineButtonText}; border: 1px solid ${outlineButtonBorder}; border-radius: 4px; font-size: 14px; font-weight: 500; cursor: pointer; transition: all 0.2s;">
                    ${buttonText}
                </button>
                <style>
                    .reserve-outline-${uniqueId}:hover {
                        background-color: ${outlineButtonBorder} !important;
                        color: ${solidButtonText} !important;
                    }
                </style>
            `;
        } else {
            return `
                <button class="reserve-button reserve-solid-${uniqueId}" 
                        data-product-id="${product.id || 'demo-product'}"
                        style="font-family: ${bodyFont}; width: 100%; padding: 14px 24px; background-color: ${solidButtonBg}; color: ${solidButtonText}; border: none; border-radius: 4px; font-size: 14px; font-weight: 500; cursor: pointer; transition: opacity 0.2s;">
                    ${buttonText}
                </button>
                <style>
                    .reserve-solid-${uniqueId}:hover {
                        opacity: 0.9 !important;
                    }
                </style>
            `;
        }
    }
};

// Register the module as a renderable section
window.renderProductContainer = function(config) {
    return window.WebsiteBuilderModules.ProductContainer.render(config);
};

// Register module with the system
if (window.registerWebsiteBuilderModule) {
    window.registerWebsiteBuilderModule({
        config: {
            name: 'productContainer',
            displayName: {
                es: 'Product Container',
                en: 'Product Container'
            }
        },
        renderSettings: function(data) {
            return window.WebsiteBuilderModules.ProductContainer.renderSettings(data || currentSectionsConfig['product-container']);
        },
        attachEventHandlers: function() {
            console.log('[PRODUCT-CONTAINER] Attaching event handlers');
            const config = currentSectionsConfig['product-container'] || {};
            window.WebsiteBuilderModules.ProductContainer.initializeSettingsHandlers(config, function(key, value) {
                if (!currentSectionsConfig['product-container']) {
                    currentSectionsConfig['product-container'] = {};
                }
                currentSectionsConfig['product-container'][key] = value;
                hasPendingPageStructureChanges = true;
                updateSaveButtonState();
                renderPreview();
            });
            
            // Attach block-specific event handlers
            window.WebsiteBuilderModules.ProductContainer.attachBlockEventHandlers();
        }
    });
    console.log('[PRODUCT-CONTAINER] Module registered with system');
} else {
    console.warn('[PRODUCT-CONTAINER] Module registration system not available');
}