window.WebsiteBuilderModules = window.WebsiteBuilderModules || {};
window.WebsiteBuilderModules.FeaturedProduct = {
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
            
            <div id="${uniqueId}" class="section-wrapper featured-product-section" data-section-id="featured-product">
                <div class="section-header-tag">
                    <span class="material-symbols-outlined" style="font-size: 16px;">shopping_bag</span>
                    ${window.translations && window.translations[window.currentLanguage] ? 
                        (window.translations[window.currentLanguage]['sections.featuredProduct'] || 'Featured Product') : 
                        'Featured Product'}
                </div>
                <div class="container" style="max-width: 1200px; margin: 0 auto; padding: 0 20px;">
                    <div class="product-container" style="display: flex; gap: 40px; align-items: flex-start;">
                        <!-- Product Images Section -->
                        <div class="product-images" style="flex: 1; display: flex; gap: 30px;">
                            <!-- Thumbnails -->
                            <div class="product-thumbnails" style="display: flex; flex-direction: column; gap: 12px;">
                                ${[1, 2, 3, 4].map(() => `
                                    <div style="width: 80px; height: 80px; background: #d4a574; border-radius: 8px; display: flex; align-items: center; justify-content: center; cursor: pointer; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
                                        <i class="material-icons" style="font-size: 24px; color: #fff;">image</i>
                                    </div>
                                `).join('')}
                            </div>
                            
                            <!-- Main Image -->
                            <div class="product-main-image" style="flex: 1; background: #d4a574; border-radius: 8px; aspect-ratio: 1; display: flex; align-items: center; justify-content: center;">
                                <i class="material-icons" style="font-size: 64px; color: #fff;">image</i>
                            </div>
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
    
    renderProductInfo: function(config, schemeColors) {
        if (!config.blocks || !config.blockOrder) return '';
        
        let html = '';
        
        // Render blocks in order
        config.blockOrder.forEach(blockId => {
            const block = config.blocks[blockId];
            if (!block || block.isHidden) return;
            
            switch(block.type) {
                case 'vendor':
                    html += `<div class="product-vendor" style="font-size: 14px; color: ${schemeColors.text}; opacity: 0.7; margin-bottom: 5px;">Proveedor</div>`;
                    break;
                    
                case 'title':
                    html += `<h1 class="product-title">Nombre del producto</h1>`;
                    break;
                    
                case 'price':
                    html += `
                        <div class="product-price">$0.00</div>
                        <div style="font-size: 14px; color: ${schemeColors.text}; opacity: 0.7; margin-bottom: 20px;">
                            Los impuestos y gastos de envío se calculan en la pantalla de pago
                        </div>
                    `;
                    break;
                    
                case 'sku':
                    html += `<div style="margin-bottom: 15px; font-size: 14px;">SKU: 21623612</div>`;
                    break;
                    
                case 'variant-picker':
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
                    html += `
                        <div style="margin-top: 30px; padding-top: 30px; border-top: 1px solid ${schemeColors.border};">
                            <h3 style="margin-bottom: 15px;">Description</h3>
                            <p style="line-height: 1.6;">Product description goes here. This is where you can add detailed information about your product.</p>
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
        return `<div>Settings coming soon</div>`;
    },
    
    attachEventListeners: function() {},
    
    initialize: function() {}
};