window.WebsiteBuilderModules = window.WebsiteBuilderModules || {};

window.WebsiteBuilderModules.Footer = {
    render: function(config) {
        if (!config || config.isHidden) return '';
        
        const schemeColors = window.getColorSchemeValues ? window.getColorSchemeValues(config.colorScheme || 'scheme1') : {
            background: '#000000',
            text: '#ffffff',
            border: '#333333'
        };
        
        const uniqueId = 'footer-' + Date.now();
        const columnCount = config.desktopColumnCount || 4;
        const width = config.width || 'screen';
        const showSeparator = config.showSeparator !== false;
        const showBottomBar = config.showBottomBar !== false;
        
        // Get typography settings
        const bodyTypography = window.currentGlobalThemeSettings?.typography?.body || {};
        const headingTypography = window.currentGlobalThemeSettings?.typography?.heading || {};
        
        const bodyFont = window.getFontNameFromValueSafe ? 
            window.getFontNameFromValueSafe(bodyTypography.font || 'helvetica') : 
            'Helvetica';
        
        const headingFont = window.getFontNameFromValueSafe ? 
            window.getFontNameFromValueSafe(headingTypography.font || 'helvetica') : 
            'Helvetica';
        
        // Use real blocks from configuration instead of mock data
        const blocks = config.blocks || {};
        const blockOrder = config.blockOrder || [];
        
        let html = `
            <style>
                #${uniqueId} {
                    background-color: ${config.useBackgroundColor !== false ? schemeColors.background : 'transparent'};
                    color: ${schemeColors.text};
                    font-family: ${bodyFont};
                    position: relative;
                    margin-top: auto;
                }
                
                #${uniqueId} .footer-container {
                    ${width === 'container' ? 'max-width: 1200px; margin: 0 auto;' : ''}
                    padding: 40px 20px 20px;
                }
                
                #${uniqueId} .footer-grid {
                    display: grid;
                    grid-template-columns: repeat(${columnCount}, 1fr);
                    gap: 30px;
                    margin-bottom: 30px;
                }
                
                #${uniqueId} .footer-block {
                    min-height: 150px;
                }
                
                #${uniqueId} .footer-block-title {
                    font-family: ${headingFont};
                    font-size: 16px;
                    font-weight: 600;
                    margin-bottom: 15px;
                    color: ${schemeColors.text};
                }
                
                #${uniqueId} .footer-block-content {
                    font-size: 14px;
                    line-height: 1.6;
                    color: ${schemeColors.text};
                    opacity: 0.8;
                }
                
                #${uniqueId} .footer-separator {
                    border-top: 1px solid ${schemeColors.border};
                    margin: 30px 0;
                    opacity: 0.3;
                }
                
                #${uniqueId} .footer-bottom-bar {
                    padding: 20px 0;
                    border-top: 1px solid ${schemeColors.border};
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    flex-wrap: wrap;
                    gap: 20px;
                }
                
                #${uniqueId} .social-icons {
                    display: flex;
                    gap: 15px;
                }
                
                #${uniqueId} .social-icons a {
                    color: ${schemeColors.text};
                    font-size: 20px;
                    transition: opacity 0.3s;
                }
                
                #${uniqueId} .social-icons a:hover {
                    opacity: 0.7;
                }
                
                #${uniqueId} .newsletter-form {
                    display: flex;
                    gap: 10px;
                    max-width: 300px;
                }
                
                #${uniqueId} .newsletter-input {
                    flex: 1;
                    padding: 10px 15px;
                    border: 1px solid ${schemeColors.border};
                    background: transparent;
                    color: ${schemeColors.text};
                    border-radius: 4px;
                }
                
                #${uniqueId} .newsletter-button {
                    padding: 10px 20px;
                    background: ${schemeColors.text};
                    color: ${schemeColors.background};
                    border: none;
                    border-radius: 4px;
                    cursor: pointer;
                    transition: opacity 0.3s;
                }
                
                #${uniqueId} .newsletter-button:hover {
                    opacity: 0.8;
                }
                
                #${uniqueId} .footer-logo {
                    text-align: center;
                }
                
                #${uniqueId} .footer-logo img {
                    max-height: 60px;
                    margin-bottom: 10px;
                }
                
                #${uniqueId} .footer-menu {
                    list-style: none;
                    padding: 0;
                    margin: 0;
                }
                
                #${uniqueId} .footer-menu li {
                    margin-bottom: 10px;
                }
                
                #${uniqueId} .footer-menu a {
                    color: ${schemeColors.text};
                    text-decoration: none;
                    opacity: 0.8;
                    transition: opacity 0.3s;
                }
                
                #${uniqueId} .footer-menu a:hover {
                    opacity: 1;
                }
                
                #${uniqueId} .payment-icons {
                    display: flex;
                    gap: 10px;
                    align-items: center;
                }
                
                #${uniqueId} .payment-icons img {
                    height: 30px;
                    opacity: 0.8;
                }
                
                @media (max-width: 768px) {
                    #${uniqueId} .footer-grid {
                        grid-template-columns: 1fr;
                        gap: 20px;
                    }
                    
                    #${uniqueId} .footer-bottom-bar {
                        flex-direction: column;
                        text-align: center;
                    }
                }
            </style>
            
            <footer id="${uniqueId}" class="section-wrapper" data-section-id="footer">
                <div class="section-header-tag">
                    <span class="material-symbols-outlined" style="font-size: 16px;">contact_support</span>
                    ${window.translations && window.translations[window.currentLanguage] ? 
                        (window.translations[window.currentLanguage]['sections.footer'] || 'Footer') : 
                        'Footer'}
                </div>
                <div class="footer-container">
                    <div class="footer-grid">
                        ${window.WebsiteBuilderModules.Footer.renderBlocks(blocks, blockOrder, schemeColors, columnCount)}
                    </div>
                    
                    ${showSeparator ? '<div class="footer-separator"></div>' : ''}
                    
                    ${showBottomBar ? window.WebsiteBuilderModules.Footer.renderBottomBar(config, schemeColors) : ''}
                </div>
            </footer>
        `;
        
        return html;
    },
    
    renderBlocks: function(blocks, blockOrder, schemeColors, columnCount) {
        let html = '';
        
        // If no blocks, return empty
        if (!blockOrder || blockOrder.length === 0) {
            return '<div class="footer-block" style="text-align: center; color: #999;">No blocks added yet</div>';
        }
        
        // Render blocks based on column count
        blockOrder.forEach((blockId, index) => {
            const block = blocks[blockId];
            if (block && !block.isHidden) {
                html += window.WebsiteBuilderModules.Footer.renderBlock(block, schemeColors);
            }
        });
        
        // Add empty divs to complete the grid if needed
        const blocksRendered = blockOrder.filter(blockId => blocks[blockId] && !blocks[blockId].isHidden).length;
        const totalCells = columnCount === 3 ? 6 : 8; // 3 columns = 2 rows of 3, 4 columns = 2 rows of 4
        const emptyCellsNeeded = totalCells - blocksRendered;
        
        for (let i = 0; i < emptyCellsNeeded; i++) {
            html += '<div class="footer-block"></div>';
        }
        
        return html;
    },
    
    renderBlock: function(block, schemeColors) {
        let content = '';
        
        switch (block.type) {
            case 'text':
                content = `
                    ${block.heading || block.title ? `<h3 class="footer-block-title">${block.heading || block.title}</h3>` : ''}
                    <div class="footer-block-content">
                        ${(block.body || block.content || '').split('\n').join('<br>')}
                    </div>
                `;
                break;
                
            case 'menu':
                // TODO: In the future, this should load real menu items from block.menuId
                const menuItems = block.menuItems || [
                    'Terminos & Condiciones de Uso',
                    'Politicas de Privacidad',
                    'Politicas de Cookies'
                ];
                content = `
                    ${block.heading || block.title ? `<h3 class="footer-block-title">${block.heading || block.title}</h3>` : ''}
                    <ul class="footer-menu">
                        ${menuItems.map(item => `<li><a href="#">${typeof item === 'string' ? item : item.text}</a></li>`).join('')}
                    </ul>
                `;
                break;
                
            case 'social':
            case 'social-media':
                content = `
                    ${block.heading || block.title ? `<h3 class="footer-block-title">${block.heading || block.title}</h3>` : ''}
                    <div class="social-icons">
                        ${block.showInstagram !== false ? '<a href="#" title="Instagram"><i class="material-icons">photo_camera</i></a>' : ''}
                        ${block.showFacebook !== false ? '<a href="#" title="Facebook"><i class="material-icons">facebook</i></a>' : ''}
                        ${block.showTwitter !== false ? '<a href="#" title="Twitter"><i class="material-icons">close</i></a>' : ''}
                        ${block.showPinterest !== false ? '<a href="#" title="Pinterest"><i class="material-icons">push_pin</i></a>' : ''}
                        ${block.showYoutube ? '<a href="#" title="YouTube"><i class="material-icons">play_circle</i></a>' : ''}
                        ${block.showTiktok ? '<a href="#" title="TikTok"><i class="material-icons">music_note</i></a>' : ''}
                    </div>
                `;
                break;
                
            case 'logo-with-text':
                content = `
                    <div class="footer-logo">
                        ${block.logo ? `<img src="${block.logo}" alt="Logo" style="max-height: ${block.logoSize || 60}px; margin-bottom: 10px;">` : ''}
                        ${block.heading ? `<h3 class="footer-block-title">${block.heading}</h3>` : ''}
                        ${block.body ? `<div class="footer-block-content">${block.body}</div>` : ''}
                    </div>
                `;
                break;
                
            case 'subscribe':
                content = `
                    ${block.heading ? `<h3 class="footer-block-title">${block.heading}</h3>` : ''}
                    ${block.body ? `<div class="footer-block-content" style="margin-bottom: 15px;">${block.body}</div>` : ''}
                    <form class="newsletter-form" onsubmit="return false;">
                        <input type="email" class="newsletter-input" placeholder="Email" required>
                        <button type="submit" class="newsletter-button">Subscribe</button>
                    </form>
                `;
                break;
                
        }
        
        return `<div class="footer-block">${content}</div>`;
    },
    
    renderBottomBar: function(config, schemeColors) {
        const paymentIcons = [
            'amazon', 'american_express', 'apple_pay', 'diners_club', 
            'discover', 'google_pay', 'mastercard', 'visa'
        ];
        
        return `
            <div class="footer-bottom-bar">
                <div class="footer-bottom-left">
                    <select style="background: transparent; color: ${schemeColors.text}; border: 1px solid ${schemeColors.border}; padding: 5px 10px; margin-right: 10px;">
                        <option>Español</option>
                        <option>English</option>
                    </select>
                    <select style="background: transparent; color: ${schemeColors.text}; border: 1px solid ${schemeColors.border}; padding: 5px 10px;">
                        <option>USD</option>
                        <option>EUR</option>
                    </select>
                </div>
                
                <div class="footer-bottom-center">
                    <p style="margin: 0; font-size: 12px; opacity: 0.8;">
                        ${config.copyrightText || 'Purrteam All Rights Reserved by Mango Pos Solutions LLC© Copyright 2022.'}
                    </p>
                </div>
                
                ${config.showPaymentIcons !== false ? `
                    <div class="payment-icons">
                        ${paymentIcons.map(icon => 
                            `<div style="width: 40px; height: 25px; background: #${Math.floor(Math.random()*16777215).toString(16)}; border-radius: 4px;"></div>`
                        ).join('')}
                    </div>
                ` : ''}
            </div>
            
            <div style="display: flex; justify-content: center; gap: 20px; margin-top: 15px; font-size: 12px;">
                <a href="#" style="color: ${schemeColors.text}; text-decoration: none; opacity: 0.8;">Politica de reembolso</a>
                <a href="#" style="color: ${schemeColors.text}; text-decoration: none; opacity: 0.8;">Politica de privacidad</a>
                <a href="#" style="color: ${schemeColors.text}; text-decoration: none; opacity: 0.8;">Terminos del servicio</a>
                <a href="#" style="color: ${schemeColors.text}; text-decoration: none; opacity: 0.8;">Politica</a>
            </div>
        `;
    },
    
    renderSettings: function(config) {
        const configData = config || {};
        
        return `
            <div style="display: flex; flex-direction: column; height: 100%; position: relative; overflow: hidden;">
                <div class="sidebar-view-header" style="position: relative; z-index: 10;">
                    <button class="back-to-sections-btn">
                        <i class="material-icons">arrow_back</i>
                    </button>
                    <h3 data-i18n="footer.settings.title">Footer Settings</h3>
                </div>
                
                <div style="padding: 20px; overflow-y: auto; overflow-x: hidden; flex: 1; height: calc(100% - 60px); box-sizing: border-box;">
                    ${window.WebsiteBuilderModules.Footer.renderMainSettings(configData)}
                    ${window.WebsiteBuilderModules.Footer.renderBottomBarSettings(configData)}
                </div>
            </div>
        `;
    },
    
    renderMainSettings: function(config) {
        return `
            <div class="settings-group">
                <h4 style="font-size: 13px; font-weight: 500; margin-bottom: 12px; color: #5c5e60;">General</h4>
                
                <!-- Color scheme -->
                <div class="settings-field">
                    <label data-i18n="footer.colorScheme">Color scheme</label>
                    <select class="shopify-select" id="footer-color-scheme">
                        <option value="scheme1" ${config.colorScheme === 'scheme1' || !config.colorScheme ? 'selected' : ''}>Scheme 1</option>
                        <option value="scheme2" ${config.colorScheme === 'scheme2' ? 'selected' : ''}>Scheme 2</option>
                        <option value="scheme3" ${config.colorScheme === 'scheme3' ? 'selected' : ''}>Scheme 3</option>
                        <option value="scheme4" ${config.colorScheme === 'scheme4' ? 'selected' : ''}>Scheme 4</option>
                        <option value="scheme5" ${config.colorScheme === 'scheme5' ? 'selected' : ''}>Scheme 5</option>
                    </select>
                </div>
                
                <!-- Background color toggle -->
                <div class="settings-field">
                    <label style="display: flex; align-items: center; justify-content: space-between;">
                        <span data-i18n="footer.useBackgroundColor">Color background</span>
                        <div style="display: flex; align-items: center;">
                            <input type="checkbox" id="footer-use-background-color" class="shopify-toggle" ${config.useBackgroundColor !== false ? 'checked' : ''}>
                            <label for="footer-use-background-color" class="toggle-slider"></label>
                        </div>
                    </label>
                </div>
                
                <!-- Width -->
                <div class="settings-field">
                    <label data-i18n="footer.width">Width</label>
                    <select class="shopify-select" id="footer-width">
                        <option value="screen" ${config.width === 'screen' || !config.width ? 'selected' : ''}>Screen</option>
                        <option value="container" ${config.width === 'container' ? 'selected' : ''}>Container</option>
                    </select>
                </div>
                
                <!-- Desktop column count -->
                <div class="settings-field">
                    <label data-i18n="footer.desktopColumnCount">Desktop column count</label>
                    <div class="radio-group">
                        <label class="radio-label">
                            <input type="radio" name="footer-column-count" value="3" ${config.desktopColumnCount === 3 ? 'checked' : ''}>
                            <span>3</span>
                        </label>
                        <label class="radio-label">
                            <input type="radio" name="footer-column-count" value="4" ${config.desktopColumnCount === 4 || !config.desktopColumnCount ? 'checked' : ''}>
                            <span>4</span>
                        </label>
                    </div>
                </div>
                
                <!-- Show separator -->
                <div class="settings-field">
                    <label style="display: flex; align-items: center; justify-content: space-between;">
                        <span data-i18n="footer.showSeparator">Show separator</span>
                        <div style="display: flex; align-items: center;">
                            <input type="checkbox" id="footer-show-separator" class="shopify-toggle" ${config.showSeparator !== false ? 'checked' : ''}>
                            <label for="footer-show-separator" class="toggle-slider"></label>
                        </div>
                    </label>
                </div>
            </div>
        `;
    },
    
    renderBottomBarSettings: function(config) {
        return `
            <div class="settings-group" style="margin-top: 30px;">
                <h4 style="font-size: 13px; font-weight: 500; margin-bottom: 12px; color: #5c5e60;">Bottom bar</h4>
                
                <!-- Show bottom bar -->
                <div class="settings-field">
                    <label style="display: flex; align-items: center; justify-content: space-between;">
                        <span data-i18n="footer.showBottomBar">Show bottom bar</span>
                        <div style="display: flex; align-items: center;">
                            <input type="checkbox" id="footer-show-bottom-bar" class="shopify-toggle" ${config.showBottomBar !== false ? 'checked' : ''}>
                            <label for="footer-show-bottom-bar" class="toggle-slider"></label>
                        </div>
                    </label>
                </div>
                
                <!-- Navigation menu -->
                <div class="settings-field">
                    <label data-i18n="footer.navigationMenu">Choose navigation menu</label>
                    <select class="shopify-select" id="footer-navigation-menu">
                        <option value="" ${!config.navigationMenu ? 'selected' : ''}>Menu without dropdown items</option>
                        <option value="footer-menu" ${config.navigationMenu === 'footer-menu' ? 'selected' : ''}>Footer menu</option>
                    </select>
                </div>
                
                <!-- Show payment icons -->
                <div class="settings-field">
                    <label style="display: flex; align-items: center; justify-content: space-between;">
                        <span data-i18n="footer.showPaymentIcons">Show payment icons</span>
                        <div style="display: flex; align-items: center;">
                            <input type="checkbox" id="footer-show-payment-icons" class="shopify-toggle" ${config.showPaymentIcons !== false ? 'checked' : ''}>
                            <label for="footer-show-payment-icons" class="toggle-slider"></label>
                        </div>
                    </label>
                </div>
                
                <!-- Copyright notice -->
                <div class="settings-field">
                    <label data-i18n="footer.copyrightNotice" style="display: block; margin-bottom: 8px;">Copyright notice</label>
                    <textarea 
                        id="footer-copyright-text" 
                        rows="5" 
                        style="
                            width: 100%; 
                            padding: 12px; 
                            border: 1px solid #c9cccf; 
                            border-radius: 4px;
                            font-size: 13px;
                            line-height: 1.5;
                            resize: vertical;
                            min-height: 100px;
                            font-family: inherit;
                            box-sizing: border-box;
                        "
                        placeholder="Enter your copyright notice..."
                    >${config.copyrightText || 'Purrteam All Rights Reserved by Mango Pos Solutions LLC© Copyright 2022.'}</textarea>
                </div>
            </div>
        `;
    },
    
    attachEventListeners: function() {
        const updateConfig = (key, value) => {
            if (window.currentSectionsConfig && window.currentSectionsConfig.footer) {
                window.currentSectionsConfig.footer[key] = value;
                
                window.hasPendingPageStructureChanges = true;
                window.updateSaveButtonState();
                window.renderPreview();
            }
        };
        
        // Back button
        $('.back-to-sections-btn').off('click').on('click', function() {
            window.switchSidebarView('blockList');
        });
        
        // Color scheme
        $('#footer-color-scheme').off('change').on('change', function() {
            updateConfig('colorScheme', $(this).val());
        });
        
        // Background color toggle
        $('#footer-use-background-color').off('change').on('change', function() {
            updateConfig('useBackgroundColor', $(this).is(':checked'));
        });
        
        // Width
        $('#footer-width').off('change').on('change', function() {
            updateConfig('width', $(this).val());
        });
        
        // Column count
        $('input[name="footer-column-count"]').off('change').on('change', function() {
            updateConfig('desktopColumnCount', parseInt($(this).val()));
        });
        
        // Show separator
        $('#footer-show-separator').off('change').on('change', function() {
            updateConfig('showSeparator', $(this).is(':checked'));
        });
        
        // Show bottom bar
        $('#footer-show-bottom-bar').off('change').on('change', function() {
            updateConfig('showBottomBar', $(this).is(':checked'));
        });
        
        // Navigation menu
        $('#footer-navigation-menu').off('change').on('change', function() {
            updateConfig('navigationMenu', $(this).val());
        });
        
        // Show payment icons
        $('#footer-show-payment-icons').off('change').on('change', function() {
            updateConfig('showPaymentIcons', $(this).is(':checked'));
        });
        
        // Copyright text
        $('#footer-copyright-text').off('input').on('input', function() {
            updateConfig('copyrightText', $(this).val());
        });
        
        // Apply translations
        setTimeout(window.applyTranslations, 0);
    },
    
    initialize: function() {
        console.log('[FOOTER] Module initialized');
    }
};