// Product Container Module for Website Builder
console.log('[PRODUCT-CONTAINER] Module loading...');
window.WebsiteBuilderModules = window.WebsiteBuilderModules || {};

window.WebsiteBuilderModules.ProductContainer = {
    // Store loaded products
    cachedProducts: null,
    currentProduct: null,
    productsCache: {}, // Cache products by handle
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
                        images: {},  // Object structure like Gallery expects
                        imageOrder: [],  // Array for ordering
                        colorScheme: 'inherit'
                    }
                },
                testimonials: {
                    enabled: true,
                    order: 5,
                    config: {
                        title: 'Lo que dicen nuestros clientes',
                        layout: 'slider',
                        testimonials: {},  // Object structure like Testimonials expects
                        testimonialsOrder: [],  // Array for ordering
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
        
        // Check if we have a product handle passed in config (from Preview.cshtml)
        // CRITICAL FIX: Always load the correct product when handle changes
        if (config.productHandle) {
            // First check if we have the product in cache
            const cachedProduct = this.productsCache[config.productHandle];
            if (cachedProduct && (!this.currentProduct || this.currentProduct.handle !== config.productHandle)) {
                console.log('[PRODUCT-CONTAINER] Using cached product:', cachedProduct.name);
                this.currentProduct = cachedProduct;
            } else if (!this.currentProduct || this.currentProduct.handle !== config.productHandle) {
                console.log('[PRODUCT-CONTAINER] Product handle found in config:', config.productHandle);
                console.log('[PRODUCT-CONTAINER] Current product handle:', this.currentProduct?.handle || 'none');
                console.log('[PRODUCT-CONTAINER] Loading new product because handle changed');
                
                // Load the product
                this.loadProductByHandle(config.productHandle).then(product => {
                    if (product) {
                        console.log('[PRODUCT-CONTAINER] Product loaded from config handle:', product.name);
                        this.currentProduct = product;
                        // Cache the product
                        this.productsCache[config.productHandle] = product;
                        // Re-render the section
                        if (typeof renderPreviewContent === 'function') {
                            console.log('[PRODUCT-CONTAINER] Re-rendering preview content with loaded product');
                            renderPreviewContent();
                        }
                    }
                }).catch(error => {
                    console.error('[PRODUCT-CONTAINER] Error loading product from config handle:', error);
                });
                
                // Return loading state instead of demo product
                return `
                    <div class="section-wrapper product-container-section" style="padding: 40px 0;">
                        <div class="container" style="max-width: 1200px; margin: 0 auto; padding: 0 20px;">
                            <div class="product-loading" style="text-align: center; padding: 60px 20px;">
                                <div class="spinner" style="width: 40px; height: 40px; border: 3px solid #f3f3f3; border-top: 3px solid #333; border-radius: 50%; animation: spin 1s linear infinite; margin: 0 auto 20px;"></div>
                                <style>@keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }</style>
                                <p style="color: #666;">Cargando producto...</p>
                            </div>
                        </div>
                    </div>
                `;
            }
        }
        
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
            
            // Use saved order or default order (excluding productInfo as it's rendered separately)
            const defaultOrder = [
                'imageWithText',
                'gallery', 
                'testimonials',
                'faq',
                'productTabs',
                'relatedProducts'
            ];
            
            // If we have a saved sectionOrder, filter out productInfo from it
            const sectionOrder = config.sectionOrder ? 
                config.sectionOrder.filter(key => key !== 'productInfo') : 
                defaultOrder;
            
            console.log('[PRODUCT-CONTAINER] Using section order:', sectionOrder);
            
            // Filter and order sections based on saved order
            const sortedSections = sectionOrder
                .filter(sectionKey => {
                    const section = config.sections?.[sectionKey];
                    return section && section.enabled;
                })
                .map(sectionKey => [sectionKey, config.sections[sectionKey]]);
            
            console.log('[PRODUCT-CONTAINER] Sections ordered by saved order:', sortedSections.map(s => s[0]));
            
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
            <div class="product-container">
                <!-- Product Images Section -->
                <div class="product-images">
                    ${window.WebsiteBuilderModules.ProductContainer.renderProductImages(product, productInfoConfig)}
                </div>
                
                <!-- Product Info Section -->
                <div class="product-info-section">
                    ${window.WebsiteBuilderModules.ProductContainer.renderProductDetails(product, productInfoConfig, schemeColors, headingFont, bodyFont)}
                </div>
            </div>
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
            <div class="product-images-container" data-layout="${desktopLayout}">
                ${desktopLayout === 'thumbnails-left' && images.length > 1 ? `
                    <!-- Thumbnails on left -->
                    <div class="product-thumbnails vertical" style="width: ${parseInt(thumbDims.width) + 20}px;">
                        ${images.map((img, index) => `
                            <div class="product-thumbnail ${index === 0 ? 'active' : ''}" 
                                 data-image-url="${img.url}"
                                 data-image-index="${index}"
                                 style="width: ${thumbDims.width}; height: ${thumbDims.height};">
                                <img src="${img.url}" 
                                     alt="${img.altText || ''}" 
                                     loading="${index > 2 ? 'lazy' : 'eager'}">
                            </div>
                        `).join('')}
                    </div>
                ` : ''}
                
                <!-- Main Image Container -->
                <div style="flex: 1; position: relative;">
                    <div class="product-main-image">
                        ${imageRatio !== 'adapt' ? `<div class="aspect-ratio-container" data-ratio="${imageRatio.replace('-fill', '')}">` : ''}
                        <img id="main-product-image" 
                             src="${mainImage.url}" 
                             alt="${mainImage.altText || ''}" 
                             ${imageRatio !== 'adapt' ? 'style="position: absolute; top: 0; left: 0; width: 100%; height: 100%; object-fit: cover;"' : ''}>
                        ${enableImageZoom ? `
                            <div class="image-zoom-indicator">
                                <i class="material-icons">zoom_in</i>
                            </div>
                        ` : ''}
                        ${imageRatio !== 'adapt' ? `</div>` : ''}
                    </div>
                </div>
                
                ${desktopLayout === 'thumbnails-right' && images.length > 1 ? `
                    <!-- Thumbnails on right -->
                    <div class="product-thumbnails vertical" style="width: ${parseInt(thumbDims.width) + 20}px;">
                        ${images.map((img, index) => `
                            <div class="product-thumbnail ${index === 0 ? 'active' : ''}" 
                                 data-image-url="${img.url}"
                                 data-image-index="${index}"
                                 style="width: ${thumbDims.width}; height: ${thumbDims.height};">
                                <img src="${img.url}" 
                                     alt="${img.altText || ''}" 
                                     loading="${index > 2 ? 'lazy' : 'eager'}">
                            </div>
                        `).join('')}
                    </div>
                ` : ''}
                
                ${desktopLayout === 'thumbnails-bottom' && images.length > 1 ? `
                    <!-- Thumbnails below -->
                    <div class="product-thumbnails horizontal">
                        ${images.map((img, index) => `
                            <div class="product-thumbnail ${index === 0 ? 'active' : ''}" 
                                 data-image-url="${img.url}"
                                 data-image-index="${index}"
                                 style="width: ${thumbDims.width}; height: ${thumbDims.height};">
                                <img src="${img.url}" 
                                     alt="${img.altText || ''}" 
                                     loading="${index > 2 ? 'lazy' : 'eager'}">
                            </div>
                        `).join('')}
                    </div>
                ` : ''}
            </div>
            
            <script>
                // PERFORMANCE OPTIMIZED: Event delegation with single listener
                (function() {
                    // Only attach once
                    if (!window.productThumbnailListenerAttached) {
                        window.productThumbnailListenerAttached = true;
                        
                        document.addEventListener('click', function(e) {
                            const thumbnail = e.target.closest('.product-thumbnail');
                            if (!thumbnail) return;
                            
                            const imageUrl = thumbnail.getAttribute('data-image-url');
                            if (!imageUrl) return;
                            
                            const mainImage = document.getElementById('main-product-image');
                            if (!mainImage) return;
                            
                            // Update main image
                            mainImage.src = imageUrl;
                            
                            // Update active state (use CSS classes only)
                            const container = thumbnail.closest('.product-images-container');
                            if (container) {
                                container.querySelectorAll('.product-thumbnail').forEach(t => {
                                    t.classList.toggle('active', t === thumbnail);
                                });
                            }
                        });
                    }
                })();
            </script>
        `;
    },
    
    // Render product block - Similar to Featured Product
    renderProductBlock: function(blockId, block, product, config, schemeColors, headingFont, bodyFont) {
        if (!block || block.isHidden) return '';
        
        let html = '';
        
        switch(block.type) {
            case 'vendor':
                if (config.showVendor !== false && product.vendor) {
                    html += `<div class="product-vendor" style="font-family: ${bodyFont}; color: ${schemeColors.text};">${product.vendor}</div>`;
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
        
        // Detect correct context for modules (iframe or parent window)
        const modules = window.WebsiteBuilderModules || 
                       (window.parent && window.parent !== window && window.parent.WebsiteBuilderModules) || 
                       {};
        console.log('[PRODUCT-CONTAINER] Using modules from:', window.WebsiteBuilderModules ? 'current window' : 'parent window');
        console.log('[PRODUCT-CONTAINER] Available modules in context:', Object.keys(modules));
        
        try {
            // Prepare config for the section
            let sectionConfig = section.config || {};
            
            // If colorScheme is 'inherit', use the container's scheme colors
            if (sectionConfig.colorScheme === 'inherit') {
                sectionConfig.colorScheme = schemeColors;
            }
            
            switch(sectionKey) {
                case 'imageWithText':
                    if (modules.ImageWithText?.render) {
                        // Migration: Convert array format to object format if needed
                        if (Array.isArray(sectionConfig.blocks)) {
                            console.log('[PRODUCT-CONTAINER] Migrating blocks from array to object format');
                            const blocksArray = sectionConfig.blocks;
                            sectionConfig.blocks = {};
                            sectionConfig.blockOrder = [];
                            
                            blocksArray.forEach((block) => {
                                if (block && block.id) {
                                    sectionConfig.blocks[block.id] = block;
                                    sectionConfig.blockOrder.push(block.id);
                                }
                            });
                            
                            // Update the stored config with migrated data
                            if (section.config) {
                                section.config.blocks = sectionConfig.blocks;
                                section.config.blockOrder = sectionConfig.blockOrder;
                            }
                        }
                        
                        // Pass config directly - it already has the correct structure (blocks, blockOrder, etc)
                        console.log('[PRODUCT-CONTAINER] Image with Text section:', section);
                        console.log('[PRODUCT-CONTAINER] Image with Text sectionConfig:', sectionConfig);
                        console.log('[PRODUCT-CONTAINER] Does sectionConfig have blocks?', !!sectionConfig.blocks);
                        console.log('[PRODUCT-CONTAINER] Number of blocks:', Object.keys(sectionConfig.blocks || {}).length);
                        
                        const imageWithTextConfig = {
                            ...sectionConfig,
                            colorScheme: section.config.colorScheme === 'inherit' ? null : section.config.colorScheme,
                            isHidden: false // Force visible since we're already checking enabled
                        };
                        console.log('[PRODUCT-CONTAINER] Final config being passed:', imageWithTextConfig);
                        return modules.ImageWithText.render(imageWithTextConfig);
                    }
                    break;
                    
                case 'multicolumn':
                    if (modules.Multicolumn?.render) {
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
                        return modules.Multicolumn.render(multicolumnConfig);
                    }
                    break;
                    
                case 'gallery':
                    if (modules.Gallery?.render) {
                        console.log('[PRODUCT-CONTAINER] Rendering Gallery section');
                        console.log('[PRODUCT-CONTAINER] Gallery sectionConfig before migration:', sectionConfig);
                        
                        // Migration: Convert array format to object format if needed
                        if (Array.isArray(sectionConfig.images)) {
                            console.log('[PRODUCT-CONTAINER] Migrating Gallery images from array to object format');
                            const imagesArray = sectionConfig.images;
                            sectionConfig.images = {};
                            sectionConfig.imageOrder = [];
                            
                            imagesArray.forEach((image) => {
                                if (image && image.id) {
                                    // Convert field names: url -> src, caption -> alt
                                    const convertedImage = {
                                        id: image.id,
                                        src: image.url || image.src || '',
                                        alt: image.caption || image.alt || '',
                                        link: image.link || '',
                                        icon: image.icon || 'none',
                                        isHidden: image.isHidden || false,
                                        videoSrc: image.videoSrc || ''
                                    };
                                    sectionConfig.images[image.id] = convertedImage;
                                    sectionConfig.imageOrder.push(image.id);
                                }
                            });
                            
                            // Update the stored config with migrated data
                            if (section.config) {
                                section.config.images = sectionConfig.images;
                                section.config.imageOrder = sectionConfig.imageOrder;
                            }
                            console.log('[PRODUCT-CONTAINER] Gallery migrated to object format with imageOrder');
                        }
                        
                        // Ensure imageOrder exists even if images is already object format
                        if (!sectionConfig.imageOrder && sectionConfig.images && typeof sectionConfig.images === 'object') {
                            sectionConfig.imageOrder = Object.keys(sectionConfig.images);
                        }
                        
                        console.log('[PRODUCT-CONTAINER] Gallery config after migration:', sectionConfig);
                        console.log('[PRODUCT-CONTAINER] Number of images:', sectionConfig.imageOrder ? sectionConfig.imageOrder.length : 0);
                        
                        // Adapt config to match gallery module expectations
                        const galleryConfig = {
                            ...sectionConfig,  // Include all the section config
                            title: sectionConfig.title || 'Galería del producto',
                            layout: sectionConfig.layout || 'grid',
                            imagesPerRow: sectionConfig.imagesPerRow || 3,
                            images: sectionConfig.images || {},
                            imageOrder: sectionConfig.imageOrder || [],
                            // Pass the color scheme at the top level, as Gallery expects
                            colorScheme: section.config.colorScheme === 'inherit' ? schemeColors : section.config.colorScheme,
                            // Include other Gallery-specific fields with defaults
                            width: sectionConfig.width || 'page',
                            desktopLayout: sectionConfig.desktopLayout || 'grid',
                            mobileLayout: sectionConfig.mobileLayout || 'carousel',
                            heading: sectionConfig.heading || 'Gallery',
                            body: sectionConfig.body || 'Show your products, collections, and social media photos or tell about recent events.',
                            headingSize: sectionConfig.headingSize || 'h5',
                            bodySize: sectionConfig.bodySize || 'body3',
                            contentAlignment: sectionConfig.contentAlignment || 'center',
                            imageRatio: sectionConfig.imageRatio || 1,
                            desktopCardsPerRow: sectionConfig.desktopCardsPerRow || 5,
                            desktopSpaceBetweenCards: sectionConfig.desktopSpaceBetweenCards || 16,
                            mobileSpaceBetweenCards: sectionConfig.mobileSpaceBetweenCards || 16,
                            showArrowsOnHover: sectionConfig.showArrowsOnHover !== undefined ? sectionConfig.showArrowsOnHover : true,
                            buttonLabel: sectionConfig.buttonLabel || '',
                            buttonLink: sectionConfig.buttonLink || '',
                            buttonStyle: sectionConfig.buttonStyle || 'solid',
                            autoplayMode: sectionConfig.autoplayMode || 'none',
                            autoplaySpeed: sectionConfig.autoplaySpeed || 3,
                            addSidePaddings: sectionConfig.addSidePaddings !== undefined ? sectionConfig.addSidePaddings : true,
                            topPadding: sectionConfig.topPadding || 64,
                            bottomPadding: sectionConfig.bottomPadding || 8
                        };
                        console.log('[PRODUCT-CONTAINER] Final Gallery config being passed:', galleryConfig);
                        return modules.Gallery.render(galleryConfig);
                    }
                    break;
                    
                case 'testimonials':
                    if (modules.Testimonials?.render) {
                        console.log('[PRODUCT-CONTAINER] Rendering Testimonials section');
                        console.log('[PRODUCT-CONTAINER] Testimonials sectionConfig before migration:', sectionConfig);
                        
                        // Migration: Convert array format to object format if needed
                        if (Array.isArray(sectionConfig.testimonials)) {
                            console.log('[PRODUCT-CONTAINER] Migrating Testimonials from array to object format');
                            const testimonialsArray = sectionConfig.testimonials;
                            sectionConfig.testimonials = {};
                            sectionConfig.testimonialsOrder = [];
                            
                            testimonialsArray.forEach((testimonial, index) => {
                                const testimonialId = testimonial.id || `testimonial-${Date.now()}-${index}`;
                                // Convert field names to match what Testimonials module expects
                                const convertedTestimonial = {
                                    id: testimonialId,
                                    author: testimonial.author || testimonial.name || '',
                                    content: testimonial.content || testimonial.text || '',
                                    rating: testimonial.rating || 5,
                                    authorInfo: testimonial.authorInfo || testimonial.position || testimonial.date || '',
                                    avatar: testimonial.avatar || '',
                                    isHidden: testimonial.isHidden || false
                                };
                                sectionConfig.testimonials[testimonialId] = convertedTestimonial;
                                sectionConfig.testimonialsOrder.push(testimonialId);
                            });
                            
                            // Update the stored config with migrated data
                            if (section.config) {
                                section.config.testimonials = sectionConfig.testimonials;
                                section.config.testimonialsOrder = sectionConfig.testimonialsOrder;
                            }
                            console.log('[PRODUCT-CONTAINER] Testimonials migrated to object format with testimonialsOrder');
                        }
                        
                        // Ensure testimonialsOrder exists even if testimonials is already object format
                        if (!sectionConfig.testimonialsOrder && sectionConfig.testimonials && typeof sectionConfig.testimonials === 'object') {
                            sectionConfig.testimonialsOrder = Object.keys(sectionConfig.testimonials);
                        }
                        
                        console.log('[PRODUCT-CONTAINER] Testimonials config after migration:', sectionConfig);
                        console.log('[PRODUCT-CONTAINER] Number of testimonials:', sectionConfig.testimonialsOrder ? sectionConfig.testimonialsOrder.length : 0);
                        
                        // Helper to convert heading size format (h1-h8) to number (0-7)
                        const convertHeadingSize = (size) => {
                            if (typeof size === 'number') return size;
                            const match = size?.match(/h(\d)/);
                            return match ? parseInt(match[1]) - 1 : 2; // Default to h3 (index 2)
                        };
                        
                        // Helper to convert body size format (body1-body7) to number (0-6)
                        const convertBodySize = (size) => {
                            if (typeof size === 'number') return size;
                            const match = size?.match(/body(\d)/);
                            return match ? parseInt(match[1]) - 1 : 2; // Default to body3 (index 2)
                        };
                        
                        // Adapt config to match testimonials module expectations
                        const testimonialsConfig = {
                            // Testimonials expects 'heading' not 'title'
                            heading: sectionConfig.title || sectionConfig.heading || 'Lo que dicen nuestros clientes',
                            body: sectionConfig.body || '',
                            layout: sectionConfig.layout || 'slider',
                            testimonials: sectionConfig.testimonials || {},
                            testimonialsOrder: sectionConfig.testimonialsOrder || [],
                            // Pass the color scheme correctly
                            colorScheme: section.config.colorScheme === 'inherit' ? schemeColors : section.config.colorScheme,
                            // Pass all testimonials-specific config fields
                            width: sectionConfig.width || 'container',
                            colorBackground: sectionConfig.colorBackground !== false,
                            showRating: sectionConfig.showRating !== false,
                            ratingStarsColor: sectionConfig.ratingStarsColor || '#F49A13',
                            subheading: sectionConfig.subheading || '',
                            // Convert size formats to numbers
                            headingSize: convertHeadingSize(sectionConfig.headingSize || 'h3'),
                            subheadingSize: convertBodySize(sectionConfig.subheadingSize || 'body5'),
                            bodySize: convertBodySize(sectionConfig.bodySize || 'body2'),
                            desktopContentAlignment: sectionConfig.desktopContentAlignment || 'center',
                            mobileContentAlignment: sectionConfig.mobileContentAlignment || 'center',
                            desktopCardsPerRow: sectionConfig.desktopCardsPerRow || 1,
                            showArrows: sectionConfig.showArrows !== false,
                            showDots: sectionConfig.showDots !== false,
                            autoplayMode: sectionConfig.autoplayMode || 'none',
                            autoplaySpeed: sectionConfig.autoplaySpeed || 5,
                            addSidePaddings: sectionConfig.addSidePaddings !== false,
                            topPadding: sectionConfig.topPadding || 64,
                            bottomPadding: sectionConfig.bottomPadding || 64,
                            linkLabel: sectionConfig.linkLabel || '',
                            linkUrl: sectionConfig.linkUrl || '',
                            // Card size and desktop layout fields that were missing
                            cardSize: sectionConfig.cardSize || 'medium',
                            desktopLayout: sectionConfig.desktopLayout || 'bottom-carousel',
                            desktopSpaceBetweenCards: sectionConfig.desktopSpaceBetweenCards || 16,
                            colorTestimonials: sectionConfig.colorTestimonials || false,
                            mobileLayout: sectionConfig.mobileLayout || 'slideshow'
                        };
                        console.log('[PRODUCT-CONTAINER] Final Testimonials config being passed:', testimonialsConfig);
                        return modules.Testimonials.render(testimonialsConfig);
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
                        // Migration: Convert array format to object format if needed
                        if (Array.isArray(sectionConfig.items)) {
                            console.log('[PRODUCT-CONTAINER] Migrating FAQ items from array to object format');
                            const itemsArray = sectionConfig.items;
                            sectionConfig.items = {};
                            sectionConfig.itemOrder = [];
                            
                            itemsArray.forEach((item) => {
                                if (item && item.id) {
                                    sectionConfig.items[item.id] = item;
                                    sectionConfig.itemOrder.push(item.id);
                                }
                            });
                            
                            // Mark changes to persist migration
                            hasPendingPageStructureChanges = true;
                            updateSaveButtonState();
                        }
                        
                        // Ensure itemOrder exists
                        if (!sectionConfig.itemOrder && sectionConfig.items) {
                            sectionConfig.itemOrder = Object.keys(sectionConfig.items);
                        }
                        
                        // Use accordion module for FAQ
                        const faqConfig = {
                            // Accordion expects 'heading' not 'title'
                            heading: sectionConfig.title || sectionConfig.heading || 'Preguntas Frecuentes',
                            body: sectionConfig.body || '',
                            items: sectionConfig.items || {},
                            itemOrder: sectionConfig.itemOrder || [],
                            colorScheme: section.config.colorScheme === 'inherit' ? schemeColors : section.config.colorScheme,
                            // Pass all accordion-specific config fields
                            toggleStyle: sectionConfig.toggleStyle || 'plus-minus',
                            width: sectionConfig.width || 'small',
                            colorBackground: sectionConfig.colorBackground !== false,
                            colorTabs: sectionConfig.colorTabs || 'none',
                            layout: sectionConfig.layout || 'tabs-at-the-bottom',
                            expandFirstTab: sectionConfig.expandFirstTab || false,
                            buttonLabel: sectionConfig.buttonLabel || '',
                            buttonLink: sectionConfig.buttonLink || '',
                            buttonStyle: sectionConfig.buttonStyle || 'solid',
                            addSidePaddings: sectionConfig.addSidePaddings !== false,
                            topPadding: sectionConfig.topPadding || 96,
                            bottomPadding: sectionConfig.bottomPadding || 96,
                            headingSize: sectionConfig.headingSize || 3,
                            bodySize: sectionConfig.bodySize || 3,
                            contentAlignment: sectionConfig.contentAlignment || 'left',
                            desktopItemsDirection: sectionConfig.desktopItemsDirection || 'vertical',
                            desktopItemsPerRow: sectionConfig.desktopItemsPerRow || 1,
                            desktopGapBetweenItems: sectionConfig.desktopGapBetweenItems || 16,
                            addDividerLines: sectionConfig.addDividerLines !== false,
                            dividerLineStyle: sectionConfig.dividerLineStyle || 'solid',
                            addImageOrIcon: sectionConfig.addImageOrIcon || false,
                            imageSize: sectionConfig.imageSize || 100,
                            imageShape: sectionConfig.imageShape || 'square',
                            contentOnHover: sectionConfig.contentOnHover || false
                        };
                        console.log('[PRODUCT-CONTAINER] Final FAQ config being passed:', faqConfig);
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
        
        // Check if we have a product handle from the URL (in preview real)
        const productHandle = this.getProductHandleFromUrl();
        
        if (productHandle) {
            console.log('[PRODUCT-CONTAINER] Product handle detected from URL:', productHandle);
            // Load specific product by handle
            this.loadProductByHandle(productHandle).then(product => {
                if (product) {
                    console.log('[PRODUCT-CONTAINER] Product loaded by handle:', product.name);
                    this.currentProduct = product;
                    // Re-render preview if we're on product page
                    if (window.currentPageId === 'product' && typeof renderPreview === 'function') {
                        console.log('[PRODUCT-CONTAINER] Re-rendering preview with specific product');
                        renderPreview();
                    }
                }
            }).catch(error => {
                console.error('[PRODUCT-CONTAINER] Error loading product by handle:', error);
                // Fall back to first product
                this.loadFirstProduct();
            });
        } else {
            // Load products in background (editor mode)
            this.loadFirstProduct();
        }
    },
    
    // Get product handle from URL
    getProductHandleFromUrl: function() {
        // Check if we're in preview real (not in editor iframe)
        const isEditor = window.parent !== window;
        if (isEditor) {
            return null; // In editor, don't use URL
        }
        
        // Check URL path for /products/{handle}
        const path = window.location.pathname;
        const productPathMatch = path.match(/^\/products\/([^\/]+)$/);
        if (productPathMatch) {
            return productPathMatch[1];
        }
        
        return null;
    },
    
    // Load first product (for editor)
    loadFirstProduct: function() {
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
    
    // Load product by handle
    loadProductByHandle: function(handle) {
        return new Promise((resolve, reject) => {
            // First check if we have preloaded products
            if (window.preloadedProductsByHandle && window.preloadedProductsByHandle[handle]) {
                const product = window.preloadedProductsByHandle[handle];
                console.log('[PRODUCT-CONTAINER] Using preloaded product:', product.title);
                // Transform to match our expected format
                const transformedProduct = {
                    id: product.id,
                    name: product.title,
                    handle: product.handle,
                    description: product.description,
                    price: product.price,
                    compareAtPrice: product.compareAtPrice,
                    vendor: product.vendor,
                    images: product.images?.map(img => ({
                        id: img.id,
                        url: img.imageUrl,
                        altText: img.altText
                    })) || []
                };
                resolve(transformedProduct);
                return;
            }
            
            // If not preloaded, fetch from API
            $.ajax({
                url: `/api/builder/products/by-handle/${handle}`,
                method: 'GET',
                success: (product) => {
                    console.log('[PRODUCT-CONTAINER] Product loaded by handle:', product);
                    // Transform to match our expected format
                    const transformedProduct = {
                        id: product.id,
                        name: product.title,
                        handle: product.handle,
                        description: product.description,
                        price: product.price,
                        compareAtPrice: product.compareAtPrice,
                        vendor: product.vendor,
                        images: product.images?.map(img => ({
                            id: img.id,
                            url: img.imageUrl,
                            altText: img.altText
                        })) || []
                    };
                    resolve(transformedProduct);
                },
                error: (xhr, status, error) => {
                    console.error('[PRODUCT-CONTAINER] Error loading product by handle:', error);
                    reject(error);
                }
            });
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
        let html = '<div id="product-container-sections" style="position: relative;">';
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
                <div class="section-management" data-section-key="productInfo" style="margin-bottom: 20px; border: 1px solid #e3e3e3; border-radius: 4px; overflow: hidden;">
                    <div class="section-header" style="padding: 12px 15px; background: #f8f8f8; display: flex; align-items: center; justify-content: space-between;">
                        <div style="display: flex; align-items: center;">
                            <i class="material-icons section-drag-handle" style="font-size: 18px; color: #666; margin-right: 12px; cursor: move;">drag_indicator</i>
                            <span style="width: 8px; height: 8px; border-radius: 50%; background: ${sections.productInfo.enabled ? '#4caf50' : '#ccc'}; margin-right: 10px;"></span>
                            <span style="font-size: 13px; font-weight: 500;">Product Info</span>
                        </div>
                        <div style="display: flex; gap: 5px;">
                            <button class="visibility-toggle section-visibility-toggle ${!sections.productInfo.enabled ? 'is-hidden' : ''}" data-section="productInfo" style="background: none; border: none; cursor: pointer; padding: 4px;">
                                <i class="material-icons icon-visible" style="font-size: 18px; ${sections.productInfo.enabled ? '' : 'display: none;'}">visibility</i>
                                <i class="material-icons icon-hidden" style="font-size: 18px; ${sections.productInfo.enabled ? 'display: none;' : ''}">visibility_off</i>
                            </button>
                            <button id="product-info-settings-btn" style="background: none; border: none; cursor: pointer; padding: 4px;" title="Configuración de Product Info">
                                <i class="material-icons" style="font-size: 18px; color: #5c6068;">settings</i>
                            </button>
                        </div>
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
            const blocksConfig = sections.imageWithText.config || {};
            const blockOrder = blocksConfig.blockOrder || [];
            const blocksObj = blocksConfig.blocks || {};
            
            // Convert blocks object to array for rendering
            const blocks = blockOrder.map(blockId => blocksObj[blockId]).filter(block => block);
            html += `
                <div class="section-management" data-section-key="imageWithText" style="margin-bottom: 20px; border: 1px solid #e3e3e3; border-radius: 4px; overflow: hidden;">
                    <div class="section-header" data-section-type="imageWithText" style="padding: 12px 15px; background: #f8f8f8; display: flex; align-items: center; justify-content: space-between; cursor: pointer;">
                        <div style="display: flex; align-items: center;">
                            <i class="material-icons section-drag-handle" style="font-size: 18px; color: #666; margin-right: 12px; cursor: move;">drag_indicator</i>
                            <span style="width: 8px; height: 8px; border-radius: 50%; background: ${sections.imageWithText.enabled ? '#4caf50' : '#ccc'}; margin-right: 10px;"></span>
                            <span style="font-size: 13px; font-weight: 500;">Image with Text</span>
                        </div>
                        <div style="display: flex; gap: 5px;">
                            <button class="visibility-toggle section-visibility-toggle ${!sections.imageWithText.enabled ? 'is-hidden' : ''}" data-section="imageWithText" style="background: none; border: none; cursor: pointer; padding: 4px;">
                                <i class="material-icons icon-visible" style="font-size: 18px; ${sections.imageWithText.enabled ? '' : 'display: none;'}">visibility</i>
                                <i class="material-icons icon-hidden" style="font-size: 18px; ${sections.imageWithText.enabled ? 'display: none;' : ''}">visibility_off</i>
                            </button>
                            <button class="btn btn-sm" id="product-image-text-add-btn" style="background: transparent; border: 1px solid #e3e3e3; padding: 4px 8px; border-radius: 4px; font-size: 12px; cursor: pointer; transition: all 0.2s ease; display: flex; align-items: center; justify-content: center;">
                                <i class="material-icons" style="font-size: 18px; color: #5c6068;">add</i>
                            </button>
                        </div>
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
            // Convert images object to array for display, using imageOrder if available
            const imageOrder = sections.gallery.config?.imageOrder || [];
            const imagesObj = sections.gallery.config?.images || {};
            let imagesArray = [];
            
            if (imageOrder.length > 0) {
                // Use imageOrder to maintain correct order
                imagesArray = imageOrder.map(imageId => imagesObj[imageId]).filter(Boolean);
            } else if (typeof imagesObj === 'object' && !Array.isArray(imagesObj)) {
                // Fallback if no imageOrder exists
                imagesArray = Object.values(imagesObj);
            } else if (Array.isArray(imagesObj)) {
                // Legacy array format
                imagesArray = imagesObj;
            }
            
            console.log('[PRODUCT-CONTAINER] Gallery images for display:', imagesArray);
            console.log('[PRODUCT-CONTAINER] Gallery imageOrder:', imageOrder);
            
            html += `
                <div class="section-management" data-section-key="gallery" style="margin-bottom: 20px; border: 1px solid #e3e3e3; border-radius: 4px; overflow: hidden;">
                    <div class="section-header" data-section-type="gallery" style="padding: 12px 15px; background: #f8f8f8; display: flex; align-items: center; justify-content: space-between; cursor: pointer;">
                        <div style="display: flex; align-items: center;">
                            <i class="material-icons section-drag-handle" style="font-size: 18px; color: #666; margin-right: 12px; cursor: move;">drag_indicator</i>
                            <span style="width: 8px; height: 8px; border-radius: 50%; background: ${sections.gallery.enabled ? '#4caf50' : '#ccc'}; margin-right: 10px;"></span>
                            <span style="font-size: 13px; font-weight: 500;">Gallery</span>
                        </div>
                        <div style="display: flex; gap: 5px;">
                            <button class="visibility-toggle section-visibility-toggle ${!sections.gallery.enabled ? 'is-hidden' : ''}" data-section="gallery" style="background: none; border: none; cursor: pointer; padding: 4px;">
                                <i class="material-icons icon-visible" style="font-size: 18px; ${sections.gallery.enabled ? '' : 'display: none;'}">visibility</i>
                                <i class="material-icons icon-hidden" style="font-size: 18px; ${sections.gallery.enabled ? 'display: none;' : ''}">visibility_off</i>
                            </button>
                            <button class="btn btn-sm" id="product-gallery-add-btn" style="background: transparent; border: 1px solid #e3e3e3; padding: 4px 8px; border-radius: 4px; font-size: 12px; cursor: pointer; transition: all 0.2s ease; display: flex; align-items: center; justify-content: center;">
                                <i class="material-icons" style="font-size: 18px; color: #5c6068;">add</i>
                            </button>
                        </div>
                    </div>
                    ${imagesArray.length > 0 ? `
                        <div class="section-items" style="padding: 10px;">
                            ${imagesArray.map((img, index) => `
                                <div class="item-row" style="display: flex; align-items: center; justify-content: space-between; padding: 8px 10px; background: #fff; border: 1px solid #e3e3e3; border-radius: 4px; margin-bottom: 8px; cursor: pointer;"
                                     data-item-type="gallery-image" data-item-id="${img.id}">
                                    <span style="font-size: 13px;">${img.alt || img.caption || `Imagen ${index + 1}`}</span>
                                    <div style="display: flex; gap: 5px;">
                                        <button class="visibility-toggle ${img.isHidden ? 'is-hidden' : ''}" data-item-type="gallery-image" data-item-id="${img.id}" style="background: none; border: none; cursor: pointer; padding: 4px;">
                                            <i class="material-icons icon-visible" style="font-size: 18px;">visibility</i>
                                            <i class="material-icons icon-hidden" style="font-size: 18px;">visibility_off</i>
                                        </button>
                                        <button class="delete-item-btn" data-item-type="gallery-image" data-item-id="${img.id}" style="background: none; border: none; cursor: pointer; padding: 4px;">
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
            // Convert testimonials object to array for display, using testimonialsOrder if available
            const testimonialsOrder = sections.testimonials.config?.testimonialsOrder || [];
            const testimonialsObj = sections.testimonials.config?.testimonials || {};
            let testimonialsArray = [];
            
            if (testimonialsOrder.length > 0) {
                // Use testimonialsOrder to maintain correct order
                testimonialsArray = testimonialsOrder.map(testimonialId => testimonialsObj[testimonialId]).filter(Boolean);
            } else if (typeof testimonialsObj === 'object' && !Array.isArray(testimonialsObj)) {
                // Fallback if no testimonialsOrder exists
                testimonialsArray = Object.values(testimonialsObj);
            } else if (Array.isArray(testimonialsObj)) {
                // Legacy array format
                testimonialsArray = testimonialsObj;
            }
            
            console.log('[PRODUCT-CONTAINER] Testimonials for display:', testimonialsArray);
            console.log('[PRODUCT-CONTAINER] Testimonials testimonialsOrder:', testimonialsOrder);
            
            html += `
                <div class="section-management" data-section-key="testimonials" style="margin-bottom: 20px; border: 1px solid #e3e3e3; border-radius: 4px; overflow: hidden;">
                    <div class="section-header" data-section-type="testimonials" style="padding: 12px 15px; background: #f8f8f8; display: flex; align-items: center; justify-content: space-between; cursor: pointer;">
                        <div style="display: flex; align-items: center;">
                            <i class="material-icons section-drag-handle" style="font-size: 18px; color: #666; margin-right: 12px; cursor: move;">drag_indicator</i>
                            <span style="width: 8px; height: 8px; border-radius: 50%; background: ${sections.testimonials.enabled ? '#4caf50' : '#ccc'}; margin-right: 10px;"></span>
                            <span style="font-size: 13px; font-weight: 500;">Testimonials</span>
                        </div>
                        <div style="display: flex; gap: 5px;">
                            <button class="visibility-toggle section-visibility-toggle ${!sections.testimonials.enabled ? 'is-hidden' : ''}" data-section="testimonials" style="background: none; border: none; cursor: pointer; padding: 4px;">
                                <i class="material-icons icon-visible" style="font-size: 18px; ${sections.testimonials.enabled ? '' : 'display: none;'}">visibility</i>
                                <i class="material-icons icon-hidden" style="font-size: 18px; ${sections.testimonials.enabled ? 'display: none;' : ''}">visibility_off</i>
                            </button>
                            <button class="btn btn-sm" id="product-testimonials-add-btn" style="background: transparent; border: 1px solid #e3e3e3; padding: 4px 8px; border-radius: 4px; font-size: 12px; cursor: pointer; transition: all 0.2s ease; display: flex; align-items: center; justify-content: center;">
                                <i class="material-icons" style="font-size: 18px; color: #5c6068;">add</i>
                            </button>
                        </div>
                    </div>
                    ${testimonialsArray.length > 0 ? `
                        <div class="section-items" style="padding: 10px;">
                            ${testimonialsArray.map((testimonial, index) => `
                                <div class="item-row" style="display: flex; align-items: center; justify-content: space-between; padding: 8px 10px; background: #fff; border: 1px solid #e3e3e3; border-radius: 4px; margin-bottom: 8px; cursor: pointer;"
                                     data-item-type="testimonial" data-item-id="${testimonial.id}">
                                    <span style="font-size: 13px;">${testimonial.author || testimonial.name || `Testimonio ${index + 1}`}</span>
                                    <div style="display: flex; gap: 5px;">
                                        <button class="visibility-toggle ${testimonial.isHidden ? 'is-hidden' : ''}" data-item-type="testimonial" data-item-id="${testimonial.id}" style="background: none; border: none; cursor: pointer; padding: 4px;">
                                            <i class="material-icons icon-visible" style="font-size: 18px;">visibility</i>
                                            <i class="material-icons icon-hidden" style="font-size: 18px;">visibility_off</i>
                                        </button>
                                        <button class="delete-item-btn" data-item-type="testimonial" data-item-id="${testimonial.id}" style="background: none; border: none; cursor: pointer; padding: 4px;">
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
            const itemsObj = sections.faq.config?.items || {};
            const itemOrder = sections.faq.config?.itemOrder || [];
            html += `
                <div class="section-management" data-section-key="faq" style="margin-bottom: 20px; border: 1px solid #e3e3e3; border-radius: 4px; overflow: hidden;">
                    <div class="section-header" data-section-type="faq" style="padding: 12px 15px; background: #f8f8f8; display: flex; align-items: center; justify-content: space-between; cursor: pointer;">
                        <div style="display: flex; align-items: center;">
                            <i class="material-icons section-drag-handle" style="font-size: 18px; color: #666; margin-right: 12px; cursor: move;">drag_indicator</i>
                            <span style="width: 8px; height: 8px; border-radius: 50%; background: ${sections.faq.enabled ? '#4caf50' : '#ccc'}; margin-right: 10px;"></span>
                            <span style="font-size: 13px; font-weight: 500;">FAQ</span>
                        </div>
                        <div style="display: flex; gap: 5px;">
                            <button class="visibility-toggle section-visibility-toggle ${!sections.faq.enabled ? 'is-hidden' : ''}" data-section="faq" style="background: none; border: none; cursor: pointer; padding: 4px;">
                                <i class="material-icons icon-visible" style="font-size: 18px; ${sections.faq.enabled ? '' : 'display: none;'}">visibility</i>
                                <i class="material-icons icon-hidden" style="font-size: 18px; ${sections.faq.enabled ? 'display: none;' : ''}">visibility_off</i>
                            </button>
                            <button class="btn btn-sm" id="product-faq-add-btn" style="background: transparent; border: 1px solid #e3e3e3; padding: 4px 8px; border-radius: 4px; font-size: 12px; cursor: pointer; transition: all 0.2s ease; display: flex; align-items: center; justify-content: center;">
                                <i class="material-icons" style="font-size: 18px; color: #5c6068;">add</i>
                            </button>
                        </div>
                    </div>
                    ${itemOrder.length > 0 ? `
                        <div class="section-items" style="padding: 10px;">
                            ${itemOrder.map((itemId, index) => {
                                const item = itemsObj[itemId];
                                if (!item) return '';
                                return `
                                <div class="item-row" style="display: flex; align-items: center; justify-content: space-between; padding: 8px 10px; background: #fff; border: 1px solid #e3e3e3; border-radius: 4px; margin-bottom: 8px; cursor: pointer;"
                                     data-item-type="faq-item" data-item-id="${item.id}">
                                    <span style="font-size: 13px;">${item.question || `Pregunta ${index + 1}`}</span>
                                    <div style="display: flex; gap: 5px;">
                                        <button class="visibility-toggle ${item.isHidden ? 'is-hidden' : ''}" data-item-type="faq-item" data-item-id="${item.id}" style="background: none; border: none; cursor: pointer; padding: 4px;">
                                            <i class="material-icons icon-visible" style="font-size: 18px;">visibility</i>
                                            <i class="material-icons icon-hidden" style="font-size: 18px;">visibility_off</i>
                                        </button>
                                        <button class="delete-item-btn" data-item-type="faq-item" data-item-id="${item.id}" style="background: none; border: none; cursor: pointer; padding: 4px;">
                                            <i class="material-icons" style="font-size: 18px; color: #dc3545;">delete</i>
                                        </button>
                                    </div>
                                </div>
                                `;
                            }).join('')}
                        </div>
                    ` : ''}
                </div>
            `;
        }
        
        // Product Tabs Section (Información del Producto)
        if (sections.productTabs) {
            html += `
                <div class="section-management" data-section-key="productTabs" style="margin-bottom: 20px; border: 1px solid #e3e3e3; border-radius: 4px; overflow: hidden;">
                    <div class="section-header" style="padding: 12px 15px; background: #f8f8f8; display: flex; align-items: center; justify-content: space-between;">
                        <div style="display: flex; align-items: center;">
                            <i class="material-icons section-drag-handle" style="font-size: 18px; color: #666; margin-right: 12px; cursor: move;">drag_indicator</i>
                            <span style="width: 8px; height: 8px; border-radius: 50%; background: ${sections.productTabs.enabled ? '#4caf50' : '#ccc'}; margin-right: 10px;"></span>
                            <span style="font-size: 13px; font-weight: 500;">Información del Producto</span>
                        </div>
                        <button class="visibility-toggle section-visibility-toggle ${!sections.productTabs.enabled ? 'is-hidden' : ''}" data-section="productTabs" style="background: none; border: none; cursor: pointer; padding: 4px;">
                            <i class="material-icons icon-visible" style="font-size: 18px; ${sections.productTabs.enabled ? '' : 'display: none;'}">visibility</i>
                            <i class="material-icons icon-hidden" style="font-size: 18px; ${sections.productTabs.enabled ? 'display: none;' : ''}">visibility_off</i>
                        </button>
                    </div>
                </div>
            `;
        }
        
        // Related Products Section
        if (sections.relatedProducts) {
            html += `
                <div class="section-management" data-section-key="relatedProducts" style="margin-bottom: 20px; border: 1px solid #e3e3e3; border-radius: 4px; overflow: hidden;">
                    <div class="section-header" style="padding: 12px 15px; background: #f8f8f8; display: flex; align-items: center; justify-content: space-between;">
                        <div style="display: flex; align-items: center;">
                            <i class="material-icons section-drag-handle" style="font-size: 18px; color: #666; margin-right: 12px; cursor: move;">drag_indicator</i>
                            <span style="width: 8px; height: 8px; border-radius: 50%; background: ${sections.relatedProducts.enabled ? '#4caf50' : '#ccc'}; margin-right: 10px;"></span>
                            <span style="font-size: 13px; font-weight: 500;">Productos Relacionados</span>
                        </div>
                        <button class="visibility-toggle section-visibility-toggle ${!sections.relatedProducts.enabled ? 'is-hidden' : ''}" data-section="relatedProducts" style="background: none; border: none; cursor: pointer; padding: 4px;">
                            <i class="material-icons icon-visible" style="font-size: 18px; ${sections.relatedProducts.enabled ? '' : 'display: none;'}">visibility</i>
                            <i class="material-icons icon-hidden" style="font-size: 18px; ${sections.relatedProducts.enabled ? 'display: none;' : ''}">visibility_off</i>
                        </button>
                    </div>
                </div>
            `;
        }
        
        html += '</div>'; // Close product-container-sections
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
        
        // Initialize sortable for main sections
        setTimeout(() => {
            const $sectionsContainer = $('#product-container-sections');
            
            // Destroy existing sortable if any
            if ($sectionsContainer.hasClass('ui-sortable')) {
                console.log('[PRODUCT-CONTAINER] Destroying existing sortable for sections');
                $sectionsContainer.sortable('destroy');
            }
            
            // Create new sortable for sections
            if ($sectionsContainer.length > 0) {
                console.log('[PRODUCT-CONTAINER] Creating new sortable instance for sections');
                $sectionsContainer.sortable({
                    items: '.section-management',
                    handle: '.section-drag-handle',
                    axis: 'y',
                    tolerance: 'pointer',
                    placeholder: 'section-placeholder',
                    forcePlaceholderSize: true,
                    helper: 'clone',
                    containment: 'parent',
                    start: function(event, ui) {
                        // Create placeholder with height
                        ui.placeholder.height(ui.helper.outerHeight());
                        // Add dragging class
                        ui.item.addClass('dragging');
                    },
                    stop: function(event, ui) {
                        // Remove dragging class
                        ui.item.removeClass('dragging');
                    },
                    update: function(event, ui) {
                        // Get new order
                        const newOrder = [];
                        $('#product-container-sections .section-management').each(function() {
                            const sectionKey = $(this).data('section-key');
                            if (sectionKey) {
                                newOrder.push(sectionKey);
                            }
                        });
                        
                        console.log('[PRODUCT-CONTAINER] New section order:', newOrder);
                        
                        // Update config with new order
                        const productContainerConfig = window.currentSectionsConfig['product-container'];
                        if (productContainerConfig) {
                            if (!productContainerConfig.sectionOrder) {
                                productContainerConfig.sectionOrder = [];
                            }
                            productContainerConfig.sectionOrder = newOrder;
                            
                            window.hasPendingPageStructureChanges = true;
                            window.updateSaveButtonState();
                            window.renderPreview();
                        }
                    }
                });
                console.log('[PRODUCT-CONTAINER] Sortable initialized successfully for sections');
            }
        }, 150);
        
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
                sections.imageWithText = { enabled: true, config: { blocks: {}, blockOrder: [] } };
            }
            if (!sections.imageWithText.config) {
                sections.imageWithText.config = { blocks: {}, blockOrder: [] };
            }
            if (!sections.imageWithText.config.blocks) {
                sections.imageWithText.config.blocks = {};
            }
            if (!sections.imageWithText.config.blockOrder) {
                sections.imageWithText.config.blockOrder = [];
            }
            
            // Add block to the blocks object
            sections.imageWithText.config.blocks[blockId] = {
                id: blockId,
                imageUrl: '/placeholder-image.jpg',
                title: 'Nuevo bloque',
                description: 'Descripción del bloque',
                buttonText: 'Botón',
                buttonUrl: '#',
                imagePosition: 'left',
                isHidden: false
            };
            
            // Add to blockOrder array
            sections.imageWithText.config.blockOrder.push(blockId);
            
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
                sections.gallery = { enabled: true, config: { images: {}, imageOrder: [] } };
            }
            if (!sections.gallery.config) {
                sections.gallery.config = { images: {}, imageOrder: [] };
            }
            if (!sections.gallery.config.images) {
                sections.gallery.config.images = {};
                sections.gallery.config.imageOrder = [];
            }
            
            // Add image using object structure like Gallery module expects
            sections.gallery.config.images[imageId] = {
                id: imageId,
                src: '/placeholder-image.jpg',  // Gallery uses 'src' not 'url'
                alt: 'Nueva imagen',  // Gallery uses 'alt' not 'caption'
                link: '',
                icon: 'none',
                isHidden: false,
                videoSrc: ''
            };
            
            // Add to imageOrder array
            if (!sections.gallery.config.imageOrder) {
                sections.gallery.config.imageOrder = [];
            }
            sections.gallery.config.imageOrder.push(imageId);
            
            console.log('[PRODUCT-CONTAINER] Added new Gallery image:', imageId);
            console.log('[PRODUCT-CONTAINER] Gallery config after add:', sections.gallery.config);
            
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
                sections.testimonials = { enabled: true, config: { testimonials: {}, testimonialsOrder: [] } };
            }
            if (!sections.testimonials.config) {
                sections.testimonials.config = { testimonials: {}, testimonialsOrder: [] };
            }
            if (!sections.testimonials.config.testimonials) {
                sections.testimonials.config.testimonials = {};
                sections.testimonials.config.testimonialsOrder = [];
            }
            
            // Add testimonial using object structure like Testimonials module expects
            sections.testimonials.config.testimonials[testimonialId] = {
                id: testimonialId,
                author: 'Nuevo testimonio',
                content: 'Texto del testimonio',  // Testimonials uses 'content' not 'text'
                rating: 5,
                authorInfo: 'Cliente',  // Testimonials uses 'authorInfo' not 'position'
                avatar: '',
                isHidden: false
            };
            
            // Add to testimonialsOrder array
            if (!sections.testimonials.config.testimonialsOrder) {
                sections.testimonials.config.testimonialsOrder = [];
            }
            sections.testimonials.config.testimonialsOrder.push(testimonialId);
            
            console.log('[PRODUCT-CONTAINER] Added new Testimonial:', testimonialId);
            console.log('[PRODUCT-CONTAINER] Testimonials config after add:', sections.testimonials.config);
            
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
                    
                    // SYNC: Copy Product Container's Image with Text config to the expected location
                    const productContainerIwtConfig = currentSectionsConfig['product-container']?.sections?.imageWithText?.config;
                    console.log('[PRODUCT-CONTAINER] Syncing Image with Text config before navigation');
                    console.log('[PRODUCT-CONTAINER] Product Container config:', productContainerIwtConfig);
                    console.log('[PRODUCT-CONTAINER] Current imageWithText config:', currentSectionsConfig.imageWithText);
                    
                    // ALWAYS sync, even if imageWithText already exists from homepage
                    if (productContainerIwtConfig) {
                        currentSectionsConfig.imageWithText = productContainerIwtConfig;
                        console.log('[PRODUCT-CONTAINER] Config synced to currentSectionsConfig.imageWithText');
                    } else {
                        console.error('[PRODUCT-CONTAINER] No Image with Text config found in Product Container!');
                    }
                    
                    // Open Image with Text settings
                    window.switchSidebarView('imageWithTextSettings');
                    break;
                    
                case 'gallery':
                    // Store return view info
                    window.productContainerReturnData = {
                        fromView: 'productContainer',
                        returnTo: 'productContainerSettings'
                    };
                    
                    // SYNC: Copy Product Container's Gallery config to the expected location
                    const productContainerGalleryConfig = currentSectionsConfig['product-container']?.sections?.gallery?.config;
                    console.log('[PRODUCT-CONTAINER] Syncing Gallery config before navigation');
                    console.log('[PRODUCT-CONTAINER] Product Container gallery config:', productContainerGalleryConfig);
                    console.log('[PRODUCT-CONTAINER] Current gallery config:', currentSectionsConfig.gallery);
                    
                    // ALWAYS sync, even if gallery already exists from homepage
                    if (productContainerGalleryConfig) {
                        // Ensure we have a proper Gallery config structure with all necessary fields
                        currentSectionsConfig.gallery = {
                            ...productContainerGalleryConfig,
                            // Ensure color scheme is passed correctly
                            colorScheme: section.config.colorScheme === 'inherit' ? 
                                (currentSectionsConfig['product-container']?.colorScheme || 'scheme1') : 
                                section.config.colorScheme,
                            // Add default values for any missing fields
                            width: productContainerGalleryConfig.width || 'page',
                            desktopLayout: productContainerGalleryConfig.desktopLayout || 'grid',
                            mobileLayout: productContainerGalleryConfig.mobileLayout || 'carousel',
                            heading: productContainerGalleryConfig.heading || 'Gallery',
                            body: productContainerGalleryConfig.body || 'Show your products, collections, and social media photos or tell about recent events.',
                            headingSize: productContainerGalleryConfig.headingSize || 'h5',
                            bodySize: productContainerGalleryConfig.bodySize || 'body3',
                            contentAlignment: productContainerGalleryConfig.contentAlignment || 'center',
                            imageRatio: productContainerGalleryConfig.imageRatio || 1,
                            desktopCardsPerRow: productContainerGalleryConfig.desktopCardsPerRow || 5,
                            desktopSpaceBetweenCards: productContainerGalleryConfig.desktopSpaceBetweenCards || 16,
                            mobileSpaceBetweenCards: productContainerGalleryConfig.mobileSpaceBetweenCards || 16,
                            showArrowsOnHover: productContainerGalleryConfig.showArrowsOnHover !== undefined ? productContainerGalleryConfig.showArrowsOnHover : true,
                            buttonLabel: productContainerGalleryConfig.buttonLabel || '',
                            buttonLink: productContainerGalleryConfig.buttonLink || '',
                            buttonStyle: productContainerGalleryConfig.buttonStyle || 'solid',
                            autoplayMode: productContainerGalleryConfig.autoplayMode || 'none',
                            autoplaySpeed: productContainerGalleryConfig.autoplaySpeed || 3,
                            addSidePaddings: productContainerGalleryConfig.addSidePaddings !== undefined ? productContainerGalleryConfig.addSidePaddings : true,
                            topPadding: productContainerGalleryConfig.topPadding || 64,
                            bottomPadding: productContainerGalleryConfig.bottomPadding || 8
                        };
                        console.log('[PRODUCT-CONTAINER] Config synced to currentSectionsConfig.gallery');
                    } else {
                        console.error('[PRODUCT-CONTAINER] No Gallery config found in Product Container!');
                    }
                    
                    // Open Gallery settings
                    window.switchSidebarView('gallerySettings');
                    break;
                    
                case 'testimonials':
                    // Store return view info
                    window.productContainerReturnData = {
                        fromView: 'productContainer',
                        returnTo: 'productContainerSettings'
                    };
                    
                    // SYNC: Copy Product Container's Testimonials config to the expected location
                    const productContainerTestimonialsConfig = currentSectionsConfig['product-container']?.sections?.testimonials?.config;
                    console.log('[PRODUCT-CONTAINER] Syncing Testimonials config before navigation');
                    console.log('[PRODUCT-CONTAINER] Product Container config:', productContainerTestimonialsConfig);
                    console.log('[PRODUCT-CONTAINER] Current testimonials config:', currentSectionsConfig.testimonials);
                    
                    if (productContainerTestimonialsConfig) {
                        // Ensure currentSectionsConfig.testimonials exists
                        if (!currentSectionsConfig.testimonials) {
                            currentSectionsConfig.testimonials = {};
                        }
                        
                        // Copy all config properties
                        Object.assign(currentSectionsConfig.testimonials, productContainerTestimonialsConfig);
                        console.log('[PRODUCT-CONTAINER] Config synced to currentSectionsConfig.testimonials');
                    } else {
                        console.error('[PRODUCT-CONTAINER] No Testimonials config found in Product Container!');
                    }
                    
                    // Open Testimonials settings
                    window.switchSidebarView('testimonialsSettings');
                    break;
                    
                case 'faq':
                    // Store return view info
                    window.productContainerReturnData = {
                        fromView: 'productContainer',
                        returnTo: 'productContainerSettings'
                    };
                    
                    // Sync FAQ config to accordion section for the settings view
                    const productContainerFaqConfig = currentSectionsConfig['product-container']?.sections?.faq?.config || {};
                    if (!currentSectionsConfig.accordion) {
                        currentSectionsConfig.accordion = {};
                    }
                    
                    // Copy all FAQ config to accordion structure
                    Object.assign(currentSectionsConfig.accordion, productContainerFaqConfig);
                    console.log('[PRODUCT-CONTAINER] Synced FAQ config to accordion:', currentSectionsConfig.accordion);
                    
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
                sections.faq = { enabled: true, config: { items: {}, itemOrder: [] } };
            }
            if (!sections.faq.config) {
                sections.faq.config = { items: {}, itemOrder: [] };
            }
            if (!sections.faq.config.items) {
                sections.faq.config.items = {};
            }
            if (!sections.faq.config.itemOrder) {
                sections.faq.config.itemOrder = [];
            }
            
            // Add new FAQ item in object format
            sections.faq.config.items[faqId] = {
                id: faqId,
                question: 'Nueva pregunta',
                answer: 'Respuesta a la pregunta',
                isHidden: false
            };
            sections.faq.config.itemOrder.push(faqId);
            
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
                    item = sections.imageWithText?.config?.blocks?.[itemId];
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
                    const galleryImagesObj = sections.gallery?.config?.images || {};
                    const galleryImage = galleryImagesObj[itemId];
                    
                    console.log('[PRODUCT-CONTAINER] Gallery image navigation:', {
                        itemId,
                        galleryImagesObj,
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
                                images: {},
                                imageOrder: []
                            };
                        }
                        
                        // Copy image to the expected structure
                        currentSectionsConfig.gallery.images[itemId] = galleryImage;
                        
                        // Navigate to gallery image settings
                        window.switchSidebarView('galleryImageSettings', { imageId: itemId });
                        return;
                    }
                    break;
                case 'testimonial':
                case 'testimonial-item':
                    // Navigate to testimonial child settings instead of inline editing
                    const testimonialsObj = sections.testimonials?.config?.testimonials || {};
                    const testimonialItem = testimonialsObj[itemId];
                    
                    console.log('[PRODUCT-CONTAINER] Testimonial navigation:', {
                        itemId,
                        testimonialsObj,
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
                        
                        // Ensure nested structure exists
                        if (!currentSectionsConfig.testimonials.testimonials) {
                            currentSectionsConfig.testimonials.testimonials = {};
                        }
                        if (!currentSectionsConfig.testimonials.testimonialsOrder) {
                            currentSectionsConfig.testimonials.testimonialsOrder = [];
                        }
                        
                        // Copy testimonial to the expected structure
                        currentSectionsConfig.testimonials.testimonials[itemId] = testimonialItem;
                        
                        // Ensure testimonialsOrder exists and includes this ID
                        if (!currentSectionsConfig.testimonials.testimonialsOrder) {
                            currentSectionsConfig.testimonials.testimonialsOrder = [];
                        }
                        if (!currentSectionsConfig.testimonials.testimonialsOrder.includes(itemId)) {
                            currentSectionsConfig.testimonials.testimonialsOrder.push(itemId);
                        }
                        
                        // Set the current testimonial ID and navigate to child settings
                        window.currentTestimonialId = itemId;
                        window.switchSidebarView('testimonialChildSettings');
                        return;
                    }
                    break;
                case 'faq-item':
                    // Navigate to accordion item settings instead of inline editing
                    const faqItemsObj = sections.faq?.config?.items || {};
                    const faqItem = faqItemsObj[itemId];
                    
                    console.log('[PRODUCT-CONTAINER] FAQ item navigation:', {
                        itemId,
                        faqItemsObj,
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
                        if (!currentSectionsConfig.accordion.items) {
                            currentSectionsConfig.accordion.items = {};
                        }
                        if (!currentSectionsConfig.accordion.itemOrder) {
                            currentSectionsConfig.accordion.itemOrder = [];
                        }
                        
                        // Copy faq item to accordion structure
                        currentSectionsConfig.accordion.items[itemId] = faqItem;
                        
                        // Ensure itemOrder includes this ID
                        if (!currentSectionsConfig.accordion.itemOrder.includes(itemId)) {
                            currentSectionsConfig.accordion.itemOrder.push(itemId);
                        }
                        
                        // Set the current item ID and navigate to accordion item settings
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
                    item = sections.imageWithText?.config?.blocks?.[itemId];
                    break;
                case 'gallery-image':
                    item = sections.gallery?.config?.images?.[itemId];
                    break;
                case 'testimonial-item':
                    item = sections.testimonials?.config?.testimonials?.[itemId];
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
        
        // Handler for section visibility toggle (productInfo and relatedProducts)
        $(document).off('click', '.section-visibility-toggle').on('click', '.section-visibility-toggle', function(e) {
            e.stopPropagation();
            const section = $(this).data('section');
            const $button = $(this);
            
            const sections = currentSectionsConfig['product-container'].sections || {};
            
            if (sections[section]) {
                sections[section].enabled = !sections[section].enabled;
                
                // Update visual state
                const isEnabled = sections[section].enabled;
                $button.find('.icon-visible').css('display', isEnabled ? '' : 'none');
                $button.find('.icon-hidden').css('display', isEnabled ? 'none' : '');
                
                // Update the indicator dot
                const $indicator = $button.closest('.section-header').find('span[style*="background"]').first();
                if ($indicator.length) {
                    $indicator.css('background', isEnabled ? '#4caf50' : '#ccc');
                }
                
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
                    if (sections.imageWithText?.config?.blocks?.[itemId]) {
                        sections.imageWithText.config.blocks[itemId].isHidden = !sections.imageWithText.config.blocks[itemId].isHidden;
                        found = true;
                    }
                    break;
                case 'gallery-image':
                    if (sections.gallery?.config?.images?.[itemId]) {
                        sections.gallery.config.images[itemId].isHidden = !sections.gallery.config.images[itemId].isHidden;
                        found = true;
                    }
                    break;
                case 'testimonial':
                    if (sections.testimonials?.config?.testimonials?.[itemId]) {
                        sections.testimonials.config.testimonials[itemId].isHidden = !sections.testimonials.config.testimonials[itemId].isHidden;
                        found = true;
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
                        if (sections.imageWithText?.config) {
                            // Delete from blocks object
                            if (sections.imageWithText.config.blocks) {
                                delete sections.imageWithText.config.blocks[itemId];
                            }
                            // Remove from blockOrder array
                            if (sections.imageWithText.config.blockOrder) {
                                sections.imageWithText.config.blockOrder = sections.imageWithText.config.blockOrder.filter(id => id !== itemId);
                            }
                        }
                        break;
                    case 'gallery-image':
                        if (sections.gallery?.config?.images) {
                            // Delete from images object
                            delete sections.gallery.config.images[itemId];
                            // Remove from imageOrder array
                            if (sections.gallery.config.imageOrder) {
                                sections.gallery.config.imageOrder = sections.gallery.config.imageOrder.filter(id => id !== itemId);
                            }
                        }
                        break;
                    case 'testimonial':
                        if (sections.testimonials?.config?.testimonials) {
                            // Delete from testimonials object
                            delete sections.testimonials.config.testimonials[itemId];
                            // Remove from testimonialsOrder array
                            if (sections.testimonials.config.testimonialsOrder) {
                                sections.testimonials.config.testimonialsOrder = sections.testimonials.config.testimonialsOrder.filter(id => id !== itemId);
                            }
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
        const productPrice = product.price || 0;
        
        // Get colors from scheme
        const solidButtonBg = schemeColors['solid-button'] || '#121212';
        const solidButtonText = schemeColors['solid-button-text'] || '#ffffff';
        const outlineButtonBorder = schemeColors['outline-button'] || '#121212';
        const outlineButtonText = schemeColors['outline-button-text'] || '#121212';
        
        if (isOutline) {
            return `
                <button class="buy-now-button buy-now-outline-${uniqueId}" 
                        data-product-id="${product.id || 'demo-product'}"
                        data-price="${productPrice}"
                        onclick="event.preventDefault(); event.stopPropagation(); window.handleProductContainerBuyNow('${product.id || 'demo-product'}', ${productPrice}); return false;"
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
                        data-price="${productPrice}"
                        onclick="event.preventDefault(); event.stopPropagation(); window.handleProductContainerBuyNow('${product.id || 'demo-product'}', ${productPrice}); return false;"
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
                        data-product-title="${product.title || 'Producto'}"
                        data-product-price="${product.price || 0}"
                        onclick="event.stopPropagation(); event.preventDefault(); window.handleProductReservation(event, ${product.id || 'null'}); return false;"
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
                        data-product-title="${product.title || 'Producto'}"
                        data-product-price="${product.price || 0}"
                        onclick="event.stopPropagation(); event.preventDefault(); window.handleProductReservation(event, ${product.id || 'null'}); return false;"
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

// Confirm module is loaded
// Global function for handling product reservation
window.handleProductReservation = function(event, productId) {
    console.log('[PRODUCT-CONTAINER] Reserve button clicked, product ID:', productId);
    
    if (event) {
        event.preventDefault();
        event.stopPropagation();
    }
    
    // Get product data
    let productData = null;
    
    // Try to get from module's current product
    if (window.WebsiteBuilderModules && window.WebsiteBuilderModules.ProductContainer && window.WebsiteBuilderModules.ProductContainer.currentProduct) {
        productData = window.WebsiteBuilderModules.ProductContainer.currentProduct;
        console.log('[PRODUCT-CONTAINER] Using current product from module:', productData);
    } else if (productId) {
        // Try to find product in cached products
        const cachedProducts = window.WebsiteBuilderModules?.ProductContainer?.cachedProducts || [];
        productData = cachedProducts.find(p => p.id === productId);
        
        if (!productData) {
            // Create minimal product data
            productData = {
                id: productId,
                title: 'Producto',
                price: 0
            };
        }
    }
    
    if (!productData) {
        console.error('[PRODUCT-CONTAINER] No product data available');
        return;
    }
    
    console.log('[PRODUCT-CONTAINER] Product data for reservation:', productData);
    
    // Create reservation item
    const reservationItem = {
        id: productData.id,
        name: productData.name || productData.title,
        title: productData.title || productData.name,
        price: productData.price || 0,
        vendor: productData.vendor || 'Store',
        image: productData.images && productData.images.length > 0 ? productData.images[0].url : null,
        quantity: 1,
        isReservation: true
    };
    
    // Get existing cart items
    let existingCart = [];
    try {
        const savedCart = localStorage.getItem('websiteBuilderCart');
        if (savedCart) {
            const parsedCart = JSON.parse(savedCart);
            // Handle both array format and object format for backward compatibility
            if (Array.isArray(parsedCart)) {
                existingCart = parsedCart;
            } else if (parsedCart && parsedCart.items && Array.isArray(parsedCart.items)) {
                // Convert old object format to array format
                existingCart = parsedCart.items;
            }
        }
    } catch (e) {
        console.error('[PRODUCT-CONTAINER] Error parsing existing cart:', e);
        existingCart = [];
    }
    
    // Check if there are normal products in the cart
    const hasNormalProducts = existingCart.some(item => !item.isReservation);
    
    if (hasNormalProducts) {
        // Show alert in Spanish
        alert('No puede agregar reservaciones mientras tenga productos en el carrito. Complete primero su compra.');
        return; // Don't add the reservation
    }
    
    // Remove any existing reservations (only one reservation allowed at a time)
    existingCart = existingCart.filter(item => !item.isReservation);
    
    // Add the new reservation
    existingCart.push(reservationItem);
    
    // Save back to localStorage in array format
    localStorage.setItem('websiteBuilderCart', JSON.stringify(existingCart));
    console.log('[PRODUCT-CONTAINER] Saved reservation data to localStorage');
    
    // Redirect to checkout
    const checkoutUrl = `/Checkout?type=reservation&productId=${productData.id}`;
    console.log('[PRODUCT-CONTAINER] Redirecting to:', checkoutUrl);
    
    // Check if we're in iframe or standalone
    if (window.parent && window.parent !== window) {
        // In iframe, redirect parent
        window.parent.location.href = checkoutUrl;
    } else {
        // Standalone, redirect current window
        window.location.href = checkoutUrl;
    }
};

// Handle Buy Now for Product Container
window.handleProductContainerBuyNow = function(productId, productPrice) {
    console.log('[PRODUCT-CONTAINER BUY NOW] Starting buy now for product:', productId, 'price:', productPrice);
    
    // Get product data from the current module's data
    const productData = window.WebsiteBuilderModules.ProductContainer.currentProduct || {};
    
    // Extract product information
    const productName = productData.title || 'Producto';
    const price = productPrice || productData.price || 0;
    
    // Get image from DOM (more reliable than data)
    let productImage = '/images/placeholder.jpg';
    
    // Try to get image from the main product image in DOM
    const mainImageElement = document.querySelector('#main-product-image');
    if (mainImageElement && mainImageElement.src) {
        productImage = mainImageElement.src;
    } else if (productData.images && productData.images.length > 0) {
        // Fallback to data if DOM element not found
        if (typeof productData.images[0] === 'string') {
            productImage = productData.images[0];
        } else if (productData.images[0].url) {
            productImage = productData.images[0].url;
        }
    }
    
    // Read existing cart
    let existingCart = [];
    try {
        const savedCart = localStorage.getItem('websiteBuilderCart');
        if (savedCart) {
            const parsedCart = JSON.parse(savedCart);
            if (Array.isArray(parsedCart)) {
                existingCart = parsedCart;
            } else if (parsedCart && parsedCart.items && Array.isArray(parsedCart.items)) {
                existingCart = parsedCart.items;
            }
        }
    } catch (e) {
        console.error('[PRODUCT-CONTAINER BUY NOW] Error parsing existing cart:', e);
        existingCart = [];
    }
    
    // Create buy now item
    const buyNowItem = {
        id: productId || productData.id,
        name: productName,
        price: price,
        quantity: 1,
        image: productImage,
        vendor: productData.vendor || 'Hotel',
        isBuyNow: true
    };
    
    // Add to existing cart
    existingCart.push(buyNowItem);
    
    // Save to localStorage
    localStorage.setItem('websiteBuilderCart', JSON.stringify(existingCart));
    
    console.log('[PRODUCT-CONTAINER BUY NOW] Cart saved with', existingCart.length, 'items. Redirecting to checkout...');
    
    // Redirect to checkout
    if (window.parent && window.parent !== window) {
        window.parent.location.href = '/Checkout';
    } else {
        window.location.href = '/Checkout';
    }
};

console.log('[PRODUCT-CONTAINER] Module loaded successfully');
console.log('[PRODUCT-CONTAINER] Module available at:', window.WebsiteBuilderModules.ProductContainer);

// Initialize module if we're in preview
$(document).ready(function() {
    // Check if we're in preview mode (not in editor)
    if (window.location.pathname.includes('/products/') || window.currentPageId === 'product') {
        console.log('[PRODUCT-CONTAINER] Initializing module for preview');
        window.WebsiteBuilderModules.ProductContainer.initialize();
    }
});