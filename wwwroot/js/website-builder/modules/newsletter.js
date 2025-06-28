// Newsletter Module for Website Builder
window.WebsiteBuilderModules = window.WebsiteBuilderModules || {};
window.WebsiteBuilderModules.Newsletter = {
    render: function(config) {
        if (!config || config.isHidden) return '';
        
        const schemeColors = typeof getColorSchemeValues !== 'undefined' ? 
            getColorSchemeValues(config.colorScheme || 'scheme1') : 
            { 
                background: '#ffffff', 
                text: '#333333', 
                border: '#e5e5e5',
                'solid-button': '#121212',
                'solid-button-text': '#FFFFFF'
            };
        const uniqueId = 'newsletter-' + Date.now();
        
        // Typography
        const headingTypography = window.currentGlobalThemeSettings?.typography?.heading || {};
        const bodyTypography = window.currentGlobalThemeSettings?.typography?.body || {};
        
        const headingFont = window.getFontNameFromValueSafe ? 
            window.getFontNameFromValueSafe(headingTypography.font || 'helvetica') : 
            'Helvetica';
        
        const bodyFont = window.getFontNameFromValueSafe ? 
            window.getFontNameFromValueSafe(bodyTypography.font || 'roboto') : 
            'Roboto';
        
        // CRÍTICO: Incluir section-header-tag para la pestaña azul al hover
        return `
            <style>
                #${uniqueId} {
                    padding: ${config.topPadding || 40}px 0 ${config.bottomPadding || 40}px 0;
                    background-color: ${config.colorBackground ? schemeColors.background : 'transparent'};
                    ${config.desktopBackground === 'blur' ? 'backdrop-filter: blur(10px);' : ''}
                    ${config.desktopRatio > 0 ? `min-height: calc(100vw * ${config.desktopRatio || 0.2}); max-height: 600px;` : ''}
                }
                
                #${uniqueId} .newsletter-heading {
                    font-family: ${headingFont};
                    font-size: ${headingTypography.fontSize || '36px'};
                    font-weight: ${headingTypography.fontWeight || '600'};
                    margin-bottom: 20px;
                    color: ${schemeColors.text};
                }
                
                #${uniqueId} .newsletter-subheading {
                    font-family: ${bodyFont};
                    font-size: ${bodyTypography.fontSize || '16px'};
                    margin-bottom: 30px;
                    color: ${schemeColors.text};
                }
                
                #${uniqueId} .newsletter-wrapper {
                    display: flex;
                    justify-content: ${config.desktopPosition === 'left' ? 'flex-start' : config.desktopPosition === 'right' ? 'flex-end' : 'center'};
                    padding: 0 20px;
                }
                
                #${uniqueId} .newsletter-container {
                    max-width: ${config.desktopWidth || 704}px;
                    width: 100%;
                    padding: ${config.desktopSpacing || 16}px;
                    text-align: ${config.desktopAlignment || 'center'};
                }
                
                #${uniqueId} .newsletter-form {
                    display: flex;
                    gap: 10px;
                    align-items: stretch;
                    max-width: 500px;
                    margin: 0 ${config.desktopAlignment === 'left' ? '0' : config.desktopAlignment === 'center' ? 'auto' : '0 0 0 auto'};
                }
                
                #${uniqueId} .newsletter-input {
                    flex: 1;
                    padding: 12px 16px;
                    border: 1px solid ${schemeColors.border};
                    border-radius: 4px;
                    font-size: 16px;
                    font-family: ${bodyFont};
                    background: white;
                }
                
                #${uniqueId} .newsletter-button {
                    padding: 12px 24px;
                    background-color: ${schemeColors['solid-button'] || '#2962ff'} !important;
                    color: ${schemeColors['solid-button-text'] || '#ffffff'} !important;
                    border: none;
                    border-radius: 4px;
                    font-size: 16px;
                    font-family: ${bodyFont};
                    cursor: pointer;
                    transition: opacity 0.2s ease;
                }
                
                #${uniqueId} .newsletter-button:hover {
                    opacity: 0.9;
                }
                
                #${uniqueId} .newsletter-disclaimer {
                    font-family: ${bodyFont};
                    font-size: 14px;
                    margin-top: 20px;
                    color: ${schemeColors.text};
                    opacity: 0.8;
                }
                
                /* Mobile responsiveness */
                @media (max-width: 768px) {
                    #${uniqueId} {
                        padding: ${Math.round((config.topPadding || 40) * 0.7)}px 0 ${Math.round((config.bottomPadding || 40) * 0.7)}px 0;
                        ${config.mobileBackground === 'blur' ? 'backdrop-filter: blur(10px);' : ''}
                        ${config.mobileRatio > 0 ? `min-height: calc(100vw * ${config.mobileRatio || 1.6}); max-height: 400px;` : ''}
                    }
                    
                    #${uniqueId} .newsletter-wrapper {
                        ${config.mobilePosition ? `
                            display: flex;
                            flex-direction: column;
                            justify-content: ${config.mobilePosition === 'top' ? 'flex-start' : config.mobilePosition === 'bottom' ? 'flex-end' : 'center'};
                            min-height: inherit;
                        ` : ''}
                    }
                    
                    #${uniqueId} .newsletter-container {
                        text-align: ${config.mobileAlignment || 'center'};
                    }
                    
                    #${uniqueId} .newsletter-heading {
                        font-size: 28px;
                    }
                    
                    #${uniqueId} .newsletter-subheading {
                        font-size: 14px;
                        margin-bottom: 20px;
                    }
                    
                    #${uniqueId} .newsletter-form {
                        flex-direction: column;
                    }
                    
                    #${uniqueId} .newsletter-input,
                    #${uniqueId} .newsletter-button {
                        width: 100%;
                        font-size: 16px;
                    }
                    
                    #${uniqueId} .newsletter-disclaimer {
                        font-size: 12px;
                    }
                }
                
                @media (max-width: 480px) {
                    #${uniqueId} .newsletter-heading {
                        font-size: 24px;
                    }
                }
            </style>
            
            <div id="${uniqueId}" class="section-wrapper" data-section-id="newsletter">
                <div class="section-header-tag">
                    <span class="material-symbols-outlined" style="font-size: 16px; margin-right: 6px;">mail</span>
                    ${window.translations && window.translations[window.currentLanguage] ? 
                        (window.translations[window.currentLanguage]['sections.newsletter'] || 'Newsletter') : 
                        'Newsletter'}
                </div>
                <div class="container" style="max-width: ${config.width === 'container' ? '1200px' : '100%'}; margin: 0 auto; padding: 0 ${config.addSidePaddings ? '20px' : '0'};">
                    <div class="newsletter-wrapper">
                        <div class="newsletter-container">
                        <h2 class="newsletter-heading">
                            ${config.heading || 'Subscribe to Our Newsletter'}
                        </h2>
                        <p class="newsletter-subheading">
                            ${config.subheading || 'Sign up for the latest updates, news, and exclusive offers delivered directly to your inbox.'}
                        </p>
                        
                        <!-- Form -->
                        <div class="newsletter-form">
                                <input type="email" 
                                       class="newsletter-input"
                                       placeholder="${config.placeholder || 'Enter your email'}">
                                <button class="newsletter-button">
                                    ${config.buttonText || 'Subscribe'}
                                </button>
                        </div>
                        
                        <p class="newsletter-disclaimer">
                            ${config.disclaimer || 'We respect your privacy. Unsubscribe at any time.'}
                        </p>
                        </div>
                    </div>
                </div>
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
                    <h3 data-i18n="newsletter.settings.title">Newsletter</h3>
                </div>
                
                <div style="padding: 20px; overflow-y: auto; overflow-x: hidden; flex: 1; height: calc(100% - 60px); box-sizing: border-box;">
                    ${window.WebsiteBuilderModules.Newsletter.renderMainSettings(configData)}
                    ${window.WebsiteBuilderModules.Newsletter.renderContentPositionSettings(configData)}
                    ${window.WebsiteBuilderModules.Newsletter.renderContentBackgroundSettings(configData)}
                    ${window.WebsiteBuilderModules.Newsletter.renderPaddingSettings(configData)}
                </div>
            </div>
        `;
    },
    
    renderMainSettings: function(config) {
        return `
            <div class="settings-group">
                <p style="font-size: 13px; color: #5c5e60; margin-bottom: 20px;">
                    <span data-i18n="newsletter.settings.description">Each email subscription creates a customer account.</span>
                </p>
                
                <!-- Heading -->
                <div class="settings-field" style="margin-bottom: 16px;">
                    <label style="display: block; font-size: 13px; color: #5c5e60; margin-bottom: 8px;">
                        <span data-i18n="newsletter.fields.heading">Heading</span>
                    </label>
                    <input type="text" id="newsletter-heading" value="${config.heading || 'Subscribe to Our Newsletter'}" 
                           style="width: 100%; padding: 8px 12px; border: 1px solid #d3d7dc; border-radius: 4px;">
                </div>
                
                <!-- Subheading -->
                <div class="settings-field" style="margin-bottom: 16px;">
                    <label style="display: block; font-size: 13px; color: #5c5e60; margin-bottom: 8px;">
                        <span data-i18n="newsletter.fields.subheading">Subheading</span>
                    </label>
                    <textarea id="newsletter-subheading" rows="3" 
                              style="width: 100%; padding: 8px 12px; border: 1px solid #d3d7dc; border-radius: 4px;">${config.subheading || 'Sign up for the latest updates, news, and exclusive offers delivered directly to your inbox.'}</textarea>
                </div>
                
                <!-- Text -->
                <div class="settings-field" style="margin-bottom: 16px;">
                    <label style="display: block; font-size: 13px; color: #5c5e60; margin-bottom: 8px;">
                        <span data-i18n="newsletter.fields.text">Text</span>
                    </label>
                    <input type="text" id="newsletter-text" value="${config.placeholder || 'Enter your email'}" 
                           style="width: 100%; padding: 8px 12px; border: 1px solid #d3d7dc; border-radius: 4px;">
                </div>
                
                <!-- Subscribe -->
                <div class="settings-field" style="margin-bottom: 16px;">
                    <label style="display: block; font-size: 13px; color: #5c5e60; margin-bottom: 8px;">
                        <span data-i18n="newsletter.fields.subscribe">Subscribe</span>
                    </label>
                    <input type="text" id="newsletter-subscribe" value="${config.buttonText || 'Subscribe'}" 
                           style="width: 100%; padding: 8px 12px; border: 1px solid #d3d7dc; border-radius: 4px;">
                </div>
                
                <!-- Disclaimer -->
                <div class="settings-field" style="margin-bottom: 16px;">
                    <label style="display: block; font-size: 13px; color: #5c5e60; margin-bottom: 8px;">
                        <span data-i18n="newsletter.fields.disclaimer">Disclaimer</span>
                    </label>
                    <input type="text" id="newsletter-disclaimer" value="${config.disclaimer || 'We respect your privacy. Unsubscribe at any time.'}" 
                           style="width: 100%; padding: 8px 12px; border: 1px solid #d3d7dc; border-radius: 4px;">
                </div>
                
                <!-- Color scheme -->
                <div class="settings-field" style="margin-bottom: 16px;">
                    <label style="display: block; font-size: 13px; color: #5c5e60; margin-bottom: 8px;">
                        <span data-i18n="newsletter.fields.colorScheme">Color scheme</span>
                    </label>
                    <select id="newsletter-color-scheme" class="shopify-select" style="width: 100%;">
                        <option value="scheme1" ${config.colorScheme === 'scheme1' ? 'selected' : ''}>Scheme 1</option>
                        <option value="scheme2" ${config.colorScheme === 'scheme2' ? 'selected' : ''}>Scheme 2</option>
                        <option value="scheme3" ${config.colorScheme === 'scheme3' ? 'selected' : ''}>Scheme 3</option>
                        <option value="scheme4" ${config.colorScheme === 'scheme4' ? 'selected' : ''}>Scheme 4</option>
                        <option value="scheme5" ${config.colorScheme === 'scheme5' ? 'selected' : ''}>Scheme 5</option>
                    </select>
                    <a href="#" style="font-size: 12px; color: #2962ff; text-decoration: underline; margin-top: 4px; display: inline-block;">
                        <span data-i18n="newsletter.fields.learnColorSchemes">Learn about color schemes</span>
                    </a>
                </div>
                
                <!-- Color background toggle -->
                <div class="settings-field" style="margin-bottom: 16px;">
                    <label class="toggle-field" style="display: flex; align-items: center; justify-content: space-between;">
                        <span style="font-size: 13px; color: #5c5e60;" data-i18n="newsletter.fields.colorBackground">Color background</span>
                        <input type="checkbox" id="newsletter-color-background" class="shopify-toggle" ${config.colorBackground ? 'checked' : ''}>
                        <label for="newsletter-color-background" class="toggle-slider"></label>
                    </label>
                </div>
                
                <!-- Width -->
                <div class="settings-field" style="margin-bottom: 16px;">
                    <label style="display: block; font-size: 13px; color: #5c5e60; margin-bottom: 8px;">
                        <span data-i18n="newsletter.fields.width">Width</span>
                    </label>
                    <select id="newsletter-width" class="shopify-select" style="width: 100%;">
                        <option value="screen" ${config.width === 'screen' ? 'selected' : ''}>Screen</option>
                        <option value="container" ${config.width === 'container' ? 'selected' : ''}>Container</option>
                    </select>
                </div>
                
                <!-- Desktop ratio -->
                <div class="settings-field" style="margin-bottom: 16px;">
                    <label style="display: block; font-size: 13px; color: #5c5e60; margin-bottom: 8px;">
                        <span data-i18n="newsletter.fields.desktopRatio">Desktop ratio</span>
                    </label>
                    <div style="display: flex; gap: 10px; align-items: center;">
                        <input type="range" id="newsletter-desktop-ratio" min="0" max="3" step="0.1" value="${config.desktopRatio || 0.2}" style="flex: 1;">
                        <input type="number" id="newsletter-desktop-ratio-value" value="${config.desktopRatio || 0.2}" min="0" max="3" step="0.1" style="width: 60px; padding: 4px 8px;">
                    </div>
                </div>
                
                <!-- Mobile ratio -->
                <div class="settings-field" style="margin-bottom: 16px;">
                    <label style="display: block; font-size: 13px; color: #5c5e60; margin-bottom: 8px;">
                        <span data-i18n="newsletter.fields.mobileRatio">Mobile ratio</span>
                    </label>
                    <div style="display: flex; gap: 10px; align-items: center;">
                        <input type="range" id="newsletter-mobile-ratio" min="0" max="3" step="0.1" value="${config.mobileRatio || 1.6}" style="flex: 1;">
                        <input type="number" id="newsletter-mobile-ratio-value" value="${config.mobileRatio || 1.6}" min="0" max="3" step="0.1" style="width: 60px; padding: 4px 8px;">
                    </div>
                </div>
            </div>
        `;
    },
    
    renderContentPositionSettings: function(config) {
        return `
            <div class="settings-group" style="margin-top: 24px;">
                <h4 style="font-size: 13px; font-weight: 500; margin-bottom: 12px; color: #5c5e60;" data-i18n="newsletter.contentPosition.title">Content position</h4>
                
                <!-- Desktop position -->
                <div class="settings-field" style="margin-bottom: 16px;">
                    <label style="display: block; font-size: 13px; color: #5c5e60; margin-bottom: 8px;">
                        <span data-i18n="newsletter.fields.desktopPosition">Desktop position</span>
                    </label>
                    <div style="display: flex; gap: 8px;">
                        <button class="position-btn ${config.desktopPosition === 'left' ? 'active' : ''}" data-position="left" data-type="desktop" style="flex: 1; padding: 8px;">Left</button>
                        <button class="position-btn ${config.desktopPosition === 'center' ? 'active' : ''}" data-position="center" data-type="desktop" style="flex: 1; padding: 8px;">Center</button>
                        <button class="position-btn ${config.desktopPosition === 'right' ? 'active' : ''}" data-position="right" data-type="desktop" style="flex: 1; padding: 8px;">Right</button>
                    </div>
                </div>
                
                <!-- Desktop alignment -->
                <div class="settings-field" style="margin-bottom: 16px;">
                    <label style="display: block; font-size: 13px; color: #5c5e60; margin-bottom: 8px;">
                        <span data-i18n="newsletter.fields.desktopAlignment">Desktop alignment</span>
                    </label>
                    <div style="display: flex; gap: 8px;">
                        <button class="alignment-btn ${config.desktopAlignment === 'left' ? 'active' : ''}" data-alignment="left" data-type="desktop" style="flex: 1; padding: 8px;">Left</button>
                        <button class="alignment-btn ${config.desktopAlignment === 'center' ? 'active' : ''}" data-alignment="center" data-type="desktop" style="flex: 1; padding: 8px;">Center</button>
                    </div>
                </div>
                
                <!-- Desktop width -->
                <div class="settings-field" style="margin-bottom: 16px;">
                    <label style="display: block; font-size: 13px; color: #5c5e60; margin-bottom: 8px;">
                        <span data-i18n="newsletter.fields.desktopWidth">Desktop width</span>
                    </label>
                    <div style="display: flex; gap: 10px; align-items: center;">
                        <input type="range" id="newsletter-desktop-width" min="300" max="1200" value="${config.desktopWidth || 704}" style="flex: 1;">
                        <div style="display: flex; align-items: center;">
                            <input type="number" id="newsletter-desktop-width-value" value="${config.desktopWidth || 704}" min="300" max="1200" style="width: 60px; padding: 4px 8px;">
                            <span style="margin-left: 4px;">px</span>
                        </div>
                    </div>
                </div>
                
                <!-- Desktop spacing -->
                <div class="settings-field" style="margin-bottom: 16px;">
                    <label style="display: block; font-size: 13px; color: #5c5e60; margin-bottom: 8px;">
                        <span data-i18n="newsletter.fields.desktopSpacing">Desktop spacing</span>
                    </label>
                    <div style="display: flex; gap: 10px; align-items: center;">
                        <input type="range" id="newsletter-desktop-spacing" min="0" max="100" value="${config.desktopSpacing || 16}" style="flex: 1;">
                        <div style="display: flex; align-items: center;">
                            <input type="number" id="newsletter-desktop-spacing-value" value="${config.desktopSpacing || 16}" min="0" max="100" style="width: 60px; padding: 4px 8px;">
                            <span style="margin-left: 4px;">px</span>
                        </div>
                    </div>
                    <p style="font-size: 11px; color: #5c5e60; margin-top: 4px; line-height: 1.4;">
                        <span data-i18n="newsletter.fields.spacingNote">"Adjust the spacing between the section borders and content."</span>
                    </p>
                </div>
                
                <!-- Mobile position -->
                <div class="settings-field" style="margin-bottom: 16px;">
                    <label style="display: block; font-size: 13px; color: #5c5e60; margin-bottom: 8px;">
                        <span data-i18n="newsletter.fields.mobilePosition">Mobile position</span>
                    </label>
                    <div style="display: flex; gap: 8px;">
                        <button class="position-btn ${config.mobilePosition === 'top' ? 'active' : ''}" data-position="top" data-type="mobile" style="flex: 1; padding: 8px;">Top</button>
                        <button class="position-btn ${config.mobilePosition === 'center' ? 'active' : ''}" data-position="center" data-type="mobile" style="flex: 1; padding: 8px;">Center</button>
                        <button class="position-btn ${config.mobilePosition === 'bottom' ? 'active' : ''}" data-position="bottom" data-type="mobile" style="flex: 1; padding: 8px;">Bottom</button>
                    </div>
                </div>
                
                <!-- Mobile alignment -->
                <div class="settings-field" style="margin-bottom: 16px;">
                    <label style="display: block; font-size: 13px; color: #5c5e60; margin-bottom: 8px;">
                        <span data-i18n="newsletter.fields.mobileAlignment">Mobile alignment</span>
                    </label>
                    <div style="display: flex; gap: 8px;">
                        <button class="alignment-btn ${config.mobileAlignment === 'left' ? 'active' : ''}" data-alignment="left" data-type="mobile" style="flex: 1; padding: 8px;">Left</button>
                        <button class="alignment-btn ${config.mobileAlignment === 'center' ? 'active' : ''}" data-alignment="center" data-type="mobile" style="flex: 1; padding: 8px;">Center</button>
                    </div>
                </div>
            </div>
        `;
    },
    
    renderContentBackgroundSettings: function(config) {
        return `
            <div class="settings-group" style="margin-top: 24px;">
                <h4 style="font-size: 13px; font-weight: 500; margin-bottom: 12px; color: #5c5e60;" data-i18n="newsletter.contentBackground.title">Content background</h4>
                
                <!-- Desktop -->
                <div class="settings-field" style="margin-bottom: 16px;">
                    <label style="display: block; font-size: 13px; color: #5c5e60; margin-bottom: 8px;">
                        <span data-i18n="newsletter.fields.desktop">Desktop</span>
                    </label>
                    <select id="newsletter-desktop-background" class="shopify-select" style="width: 100%;">
                        <option value="none" ${config.desktopBackground === 'none' ? 'selected' : ''}>None</option>
                        <option value="blur" ${config.desktopBackground === 'blur' ? 'selected' : ''}>Blur</option>
                    </select>
                </div>
                
                <!-- Mobile -->
                <div class="settings-field" style="margin-bottom: 16px;">
                    <label style="display: block; font-size: 13px; color: #5c5e60; margin-bottom: 8px;">
                        <span data-i18n="newsletter.fields.mobile">Mobile</span>
                    </label>
                    <select id="newsletter-mobile-background" class="shopify-select" style="width: 100%;">
                        <option value="none" ${config.mobileBackground === 'none' ? 'selected' : ''}>None</option>
                        <option value="blur" ${config.mobileBackground === 'blur' ? 'selected' : ''}>Blur</option>
                    </select>
                </div>
            </div>
        `;
    },
    
    renderPaddingSettings: function(config) {
        return `
            <div class="settings-group" style="margin-top: 24px;">
                <h4 style="font-size: 13px; font-weight: 500; margin-bottom: 12px; color: #5c5e60;" data-i18n="newsletter.paddings.title">Paddings</h4>
                
                <!-- Add side paddings toggle -->
                <div class="settings-field" style="margin-bottom: 16px;">
                    <label class="toggle-field" style="display: flex; align-items: center; justify-content: space-between;">
                        <span style="font-size: 13px; color: #5c5e60;" data-i18n="newsletter.fields.addSidePaddings">Add side paddings</span>
                        <input type="checkbox" id="newsletter-side-paddings" class="shopify-toggle" ${config.addSidePaddings ? 'checked' : ''}>
                        <label for="newsletter-side-paddings" class="toggle-slider"></label>
                    </label>
                </div>
                
                <!-- Top padding -->
                <div class="settings-field" style="margin-bottom: 16px;">
                    <label style="display: block; font-size: 13px; color: #5c5e60; margin-bottom: 8px;">
                        <span data-i18n="newsletter.fields.topPadding">Top padding</span>
                    </label>
                    <div style="display: flex; gap: 10px; align-items: center;">
                        <input type="range" id="newsletter-top-padding" min="0" max="200" value="${config.topPadding || 10}" style="flex: 1;">
                        <div style="display: flex; align-items: center;">
                            <input type="number" id="newsletter-top-padding-value" value="${config.topPadding || 10}" min="0" max="200" style="width: 60px; padding: 4px 8px;">
                            <span style="margin-left: 4px;">px</span>
                        </div>
                    </div>
                </div>
                
                <!-- Bottom padding -->
                <div class="settings-field" style="margin-bottom: 16px;">
                    <label style="display: block; font-size: 13px; color: #5c5e60; margin-bottom: 8px;">
                        <span data-i18n="newsletter.fields.bottomPadding">Bottom padding</span>
                    </label>
                    <div style="display: flex; gap: 10px; align-items: center;">
                        <input type="range" id="newsletter-bottom-padding" min="0" max="200" value="${config.bottomPadding || 85}" style="flex: 1;">
                        <div style="display: flex; align-items: center;">
                            <input type="number" id="newsletter-bottom-padding-value" value="${config.bottomPadding || 85}" min="0" max="200" style="width: 60px; padding: 4px 8px;">
                            <span style="margin-left: 4px;">px</span>
                        </div>
                    </div>
                </div>
            </div>
        `;
    },
    
    attachEventListeners: function() {
        // Back button fix
        $('.back-to-sections-btn').off('click').on('click', function() {
            window.switchSidebarView('blockList', window.getUpdatedPageData());
        });
        
        // Helper function to update config
        const updateConfig = (key, value) => {
            if (window.currentSectionsConfig.newsletter) {
                window.currentSectionsConfig.newsletter[key] = value;
                window.setHasPendingPageStructureChanges(true);
                window.updateSaveButtonState();
                window.renderPreview();
            }
        };
        
        // Text fields
        $('#newsletter-heading').on('input', function() {
            updateConfig('heading', $(this).val());
        });
        
        $('#newsletter-subheading').on('input', function() {
            updateConfig('subheading', $(this).val());
        });
        
        $('#newsletter-text').on('input', function() {
            updateConfig('placeholder', $(this).val());
        });
        
        $('#newsletter-subscribe').on('input', function() {
            updateConfig('buttonText', $(this).val());
        });
        
        $('#newsletter-disclaimer').on('input', function() {
            updateConfig('disclaimer', $(this).val());
        });
        
        // Color scheme
        $('#newsletter-color-scheme').on('change', function() {
            updateConfig('colorScheme', $(this).val());
        });
        
        // Toggles
        $('#newsletter-color-background').on('change', function() {
            updateConfig('colorBackground', $(this).is(':checked'));
        });
        
        $('#newsletter-side-paddings').on('change', function() {
            updateConfig('addSidePaddings', $(this).is(':checked'));
        });
        
        // Width
        $('#newsletter-width').on('change', function() {
            updateConfig('width', $(this).val());
        });
        
        // Ratios with sync
        $('#newsletter-desktop-ratio').on('input', function() {
            const value = parseFloat($(this).val());
            $('#newsletter-desktop-ratio-value').val(value);
            updateConfig('desktopRatio', value);
        });
        
        $('#newsletter-desktop-ratio-value').on('input', function() {
            const value = parseFloat($(this).val());
            $('#newsletter-desktop-ratio').val(value);
            updateConfig('desktopRatio', value);
        });
        
        $('#newsletter-mobile-ratio').on('input', function() {
            const value = parseFloat($(this).val());
            $('#newsletter-mobile-ratio-value').val(value);
            updateConfig('mobileRatio', value);
        });
        
        $('#newsletter-mobile-ratio-value').on('input', function() {
            const value = parseFloat($(this).val());
            $('#newsletter-mobile-ratio').val(value);
            updateConfig('mobileRatio', value);
        });
        
        // Overlay opacity with sync
        $('#newsletter-desktop-overlay').on('input', function() {
            const value = parseInt($(this).val());
            $('#newsletter-desktop-overlay-value').val(value);
            updateConfig('desktopOverlayOpacity', value);
        });
        
        $('#newsletter-desktop-overlay-value').on('input', function() {
            const value = parseInt($(this).val());
            $('#newsletter-desktop-overlay').val(value);
            updateConfig('desktopOverlayOpacity', value);
        });
        
        $('#newsletter-mobile-overlay').on('input', function() {
            const value = parseInt($(this).val());
            $('#newsletter-mobile-overlay-value').val(value);
            updateConfig('mobileOverlayOpacity', value);
        });
        
        $('#newsletter-mobile-overlay-value').on('input', function() {
            const value = parseInt($(this).val());
            $('#newsletter-mobile-overlay').val(value);
            updateConfig('mobileOverlayOpacity', value);
        });
        
        // Position buttons
        $('.position-btn').on('click', function() {
            const position = $(this).data('position');
            const type = $(this).data('type');
            
            // Update active state
            $(this).siblings().removeClass('active');
            $(this).addClass('active');
            
            if (type === 'desktop') {
                updateConfig('desktopPosition', position);
            } else {
                updateConfig('mobilePosition', position);
            }
        });
        
        // Alignment buttons
        $('.alignment-btn').on('click', function() {
            const alignment = $(this).data('alignment');
            const type = $(this).data('type');
            
            // Update active state
            $(this).siblings().removeClass('active');
            $(this).addClass('active');
            
            if (type === 'desktop') {
                updateConfig('desktopAlignment', alignment);
            } else {
                updateConfig('mobileAlignment', alignment);
            }
        });
        
        // Width and spacing
        $('#newsletter-desktop-width').on('input', function() {
            const value = parseInt($(this).val());
            $('#newsletter-desktop-width-value').val(value);
            updateConfig('desktopWidth', value);
        });
        
        $('#newsletter-desktop-width-value').on('input', function() {
            const value = parseInt($(this).val());
            $('#newsletter-desktop-width').val(value);
            updateConfig('desktopWidth', value);
        });
        
        $('#newsletter-desktop-spacing').on('input', function() {
            const value = parseInt($(this).val());
            $('#newsletter-desktop-spacing-value').val(value);
            updateConfig('desktopSpacing', value);
        });
        
        $('#newsletter-desktop-spacing-value').on('input', function() {
            const value = parseInt($(this).val());
            $('#newsletter-desktop-spacing').val(value);
            updateConfig('desktopSpacing', value);
        });
        
        // Background settings
        $('#newsletter-desktop-background').on('change', function() {
            updateConfig('desktopBackground', $(this).val());
        });
        
        $('#newsletter-mobile-background').on('change', function() {
            updateConfig('mobileBackground', $(this).val());
        });
        
        // Padding settings with sync
        $('#newsletter-top-padding').on('input', function() {
            const value = parseInt($(this).val());
            $('#newsletter-top-padding-value').val(value);
            updateConfig('topPadding', value);
        });
        
        $('#newsletter-top-padding-value').on('input', function() {
            const value = parseInt($(this).val());
            $('#newsletter-top-padding').val(value);
            updateConfig('topPadding', value);
        });
        
        $('#newsletter-bottom-padding').on('input', function() {
            const value = parseInt($(this).val());
            $('#newsletter-bottom-padding-value').val(value);
            updateConfig('bottomPadding', value);
        });
        
        $('#newsletter-bottom-padding-value').on('input', function() {
            const value = parseInt($(this).val());
            $('#newsletter-bottom-padding').val(value);
            updateConfig('bottomPadding', value);
        });
    },
    
    initialize: function() {
        // Initialize translations
        if (!window.translations) window.translations = { es: {}, en: {} };
        if (!window.translations.es.newsletter) window.translations.es.newsletter = {};
        if (!window.translations.en.newsletter) window.translations.en.newsletter = {};
        
        window.translations.es.newsletter = {
            'settings.title': 'Newsletter',
            'settings.description': 'Cada suscripción de correo electrónico crea una cuenta de cliente.',
            'fields.heading': 'Encabezado',
            'fields.subheading': 'Subtítulo',
            'fields.text': 'Texto',
            'fields.subscribe': 'Suscribir',
            'fields.disclaimer': 'Descargo de responsabilidad',
            'fields.colorScheme': 'Esquema de colores',
            'fields.learnColorSchemes': 'Aprender sobre esquemas de colores',
            'fields.colorBackground': 'Fondo de color',
            'fields.width': 'Ancho',
            'fields.desktopRatio': 'Proporción de escritorio',
            'fields.mobileRatio': 'Proporción móvil',
            'contentPosition.title': 'Posición del contenido',
            'fields.desktopPosition': 'Posición en escritorio',
            'fields.desktopAlignment': 'Alineación en escritorio',
            'fields.desktopWidth': 'Ancho en escritorio',
            'fields.desktopSpacing': 'Espaciado en escritorio',
            'fields.spacingNote': 'Ajusta el espaciado entre los bordes de la sección y el contenido.',
            'fields.mobilePosition': 'Posición móvil',
            'fields.mobileAlignment': 'Alineación móvil',
            'contentBackground.title': 'Fondo del contenido',
            'fields.desktop': 'Escritorio',
            'fields.mobile': 'Móvil',
            'paddings.title': 'Rellenos',
            'fields.addSidePaddings': 'Agregar rellenos laterales',
            'fields.topPadding': 'Relleno superior',
            'fields.bottomPadding': 'Relleno inferior'
        };
        
        window.translations.en.newsletter = {
            'settings.title': 'Newsletter',
            'settings.description': 'Each email subscription creates a customer account.',
            'fields.heading': 'Heading',
            'fields.subheading': 'Subheading',
            'fields.text': 'Text',
            'fields.subscribe': 'Subscribe',
            'fields.disclaimer': 'Disclaimer',
            'fields.colorScheme': 'Color scheme',
            'fields.learnColorSchemes': 'Learn about color schemes',
            'fields.colorBackground': 'Color background',
            'fields.width': 'Width',
            'fields.desktopRatio': 'Desktop ratio',
            'fields.mobileRatio': 'Mobile ratio',
            'contentPosition.title': 'Content position',
            'fields.desktopPosition': 'Desktop position',
            'fields.desktopAlignment': 'Desktop alignment',
            'fields.desktopWidth': 'Desktop width',
            'fields.desktopSpacing': 'Desktop spacing',
            'fields.spacingNote': 'Adjust the spacing between the section borders and content.',
            'fields.mobilePosition': 'Mobile position',
            'fields.mobileAlignment': 'Mobile alignment',
            'contentBackground.title': 'Content background',
            'fields.desktop': 'Desktop',
            'fields.mobile': 'Mobile',
            'paddings.title': 'Paddings',
            'fields.addSidePaddings': 'Add side paddings',
            'fields.topPadding': 'Top padding',
            'fields.bottomPadding': 'Bottom padding'
        };
        
        // También agregar a las traducciones principales
        window.translations.es['sections.newsletter'] = 'Newsletter';
        window.translations.en['sections.newsletter'] = 'Newsletter';
    }
};