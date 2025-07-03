// Accordion/FAQ Module for Website Builder
window.WebsiteBuilderModules = window.WebsiteBuilderModules || {};
window.WebsiteBuilderModules.Accordion = {
    getToggleIcon: function(style, isActive) {
        const toggleStyle = style || 'plus-minus';
        
        const icons = {
            'plus-minus': { closed: '+', open: '−' },
            'chevron': { closed: '›', open: '⌄' },
            'arrow': { closed: '→', open: '↓' },
            'caret': { closed: '▶', open: '▼' },
            'none': { closed: '', open: '' }
        };
        
        return icons[toggleStyle] ? (isActive ? icons[toggleStyle].open : icons[toggleStyle].closed) : '+';
    },
    
    render: function(config) {
        if (!config || config.isHidden) return '';
        
        const schemeColors = getColorSchemeValues(config.colorScheme || 'scheme5');
        const items = config.itemOrder || [];
        const uniqueId = 'accordion-' + Date.now();
        // Get typography settings
        const headingTypography = window.currentGlobalThemeSettings?.typography?.heading || {};
        const bodyTypography = window.currentGlobalThemeSettings?.typography?.body || {};
        
        // Convert font values to actual font names
        const headingFont = window.getFontNameFromValueSafe ? 
            window.getFontNameFromValueSafe(headingTypography.font || 'helvetica') : 
            'Helvetica';
        const bodyFont = window.getFontNameFromValueSafe ? 
            window.getFontNameFromValueSafe(bodyTypography.font || 'helvetica') : 
            'Helvetica';
        
        // Get heading and body sizes - arrays with 8 and 7 elements respectively
        const headingSizes = ['48px', '42px', '36px', '32px', '28px', '24px', '20px', '18px'];
        const bodySizes = ['20px', '18px', '16px', '14px', '13px', '12px', '11px'];
        const headingSize = headingSizes[config.headingSize || 3];
        const bodySize = bodySizes[config.bodySize || 3];
        
        // Calculate paddings
        const sidePadding = config.addSidePaddings ? '20px' : '0';
        const topPadding = config.topPadding || 96;
        const bottomPadding = config.bottomPadding || 96;
        
        // Get container width
        let containerMaxWidth = '800px';
        switch(config.width) {
            case 'extra-small': containerMaxWidth = '600px'; break;
            case 'small': containerMaxWidth = '800px'; break;
            case 'medium': containerMaxWidth = '1000px'; break;
            case 'large': containerMaxWidth = '1200px'; break;
            case 'extra-large': containerMaxWidth = '1400px'; break;
        }
        
        // Section padding styles (background will be handled separately)
        let sectionStyles = `padding: ${topPadding}px ${sidePadding} ${bottomPadding}px;`;
        
        // Container background styles
        let containerBackgroundStyle = '';
        if (!config.colorBackground) {
            // Toggle OFF: Only accordion container has background color
            containerBackgroundStyle = `background-color: ${schemeColors.background}; padding: 40px; border-radius: 8px;`;
        } else {
            // Toggle ON: Entire section has background color
            sectionStyles += `background-color: ${schemeColors.background};`;
        }
        
        // Tab colors logic
        let tabBackground = schemeColors.background;
        let tabBorder = 'transparent';
        let tabTextColor = schemeColors.text;
        
        switch(config.colorTabs) {
            case 'none':
                tabBackground = 'transparent';
                tabBorder = 'transparent';
                break;
            case 'all':
                tabBackground = schemeColors.foreground;
                tabBorder = schemeColors.border;
                break;
            case 'categories':
                tabBackground = schemeColors.foreground;
                tabBorder = schemeColors.border;
                break;
            case 'content-tab':
                tabBackground = schemeColors.foreground;
                tabBorder = 'transparent';
                break;
            case 'all-separately':
                // Each tab can have different colors - for now use alternating
                tabBackground = schemeColors.foreground;
                tabBorder = schemeColors.border;
                break;
            case 'content-tab-separately':
                // Content tabs have different color
                tabBackground = schemeColors.foreground;
                tabBorder = 'transparent';
                break;
        }
        
        // Layout styles
        let layoutClass = '';
        let containerStyles = '';
        switch(config.layout) {
            case 'tabs-to-the-left':
                layoutClass = 'tabs-left';
                containerStyles = 'display: flex; flex-direction: row; gap: 20px;';
                break;
            case 'tabs-to-the-right':
                layoutClass = 'tabs-right';
                containerStyles = 'display: flex; flex-direction: row; gap: 20px;';
                break;
            case 'tabs-at-the-bottom':
            default:
                layoutClass = 'tabs-bottom';
                containerStyles = '';
                break;
        }
        
        return `
            <style>
                #${uniqueId} .faq-item {
                    border: 1px solid ${schemeColors.border || '#e3e3e3'};
                    border-radius: 0;
                    margin-bottom: -1px;
                    overflow: hidden;
                    transition: all 0.3s ease;
                }
                
                #${uniqueId} .faq-item:first-child {
                    border-radius: 4px 4px 0 0;
                }
                
                #${uniqueId} .faq-item:last-child {
                    border-radius: 0 0 4px 4px;
                    margin-bottom: 0;
                }
                
                #${uniqueId} .faq-header {
                    padding: 16px 20px;
                    cursor: pointer;
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    background: ${tabBackground};
                    border-bottom: 1px solid ${tabBorder};
                    transition: background 0.3s ease;
                }
                
                #${uniqueId} .faq-header:hover {
                    background: ${schemeColors.foreground || '#f5f5f5'};
                }
                
                #${uniqueId} .faq-header.active {
                    border-bottom: 1px solid transparent;
                }
                
                #${uniqueId} .faq-question {
                    font-family: ${bodyFont};
                    font-size: 16px;
                    font-weight: 500;
                    color: ${schemeColors.text};
                    margin: 0;
                    flex: 1;
                    padding-right: 20px;
                }
                
                #${uniqueId} .faq-toggle {
                    font-size: ${config.toggleStyle === 'chevron' || config.toggleStyle === 'arrow' ? '20px' : '24px'};
                    color: ${schemeColors.text};
                    transition: transform 0.3s ease;
                    font-weight: ${config.toggleStyle === 'chevron' || config.toggleStyle === 'arrow' ? '400' : '300'};
                    line-height: 1;
                    width: 24px;
                    text-align: center;
                    display: ${config.toggleStyle === 'none' ? 'none' : 'inline-block'};
                }
                
                #${uniqueId} .faq-header.active .faq-toggle {
                    transform: ${config.toggleStyle === 'plus-minus' ? 'rotate(45deg)' : 
                                config.toggleStyle === 'caret' ? 'rotate(90deg)' : 
                                'none'};
                }
                
                #${uniqueId} .faq-content {
                    max-height: 0;
                    overflow: hidden;
                    transition: max-height 0.3s ease;
                    background: ${schemeColors.background};
                }
                
                #${uniqueId} .faq-content.active {
                    max-height: 1000px;
                }
                
                #${uniqueId} .faq-answer {
                    padding: 20px;
                    font-family: ${bodyFont};
                    font-size: 14px;
                    color: ${schemeColors.text};
                    line-height: 1.6;
                }
                
                /* Layout styles for side positioning */
                #${uniqueId} .faq-container.tabs-left,
                #${uniqueId} .faq-container.tabs-right {
                    display: flex;
                    flex-direction: row;
                    gap: 40px;
                    align-items: flex-start;
                }
                
                /* Default tabs-bottom layout */
                #${uniqueId} .faq-container.tabs-bottom {
                    display: block;
                }
                
                @media (max-width: 768px) {
                    #${uniqueId} h2 {
                        font-size: 24px !important;
                    }
                    
                    #${uniqueId} .faq-question {
                        font-size: 14px;
                    }
                    
                    #${uniqueId} .faq-answer {
                        font-size: 13px;
                    }
                    
                    #${uniqueId} .container {
                        padding: 0 15px;
                    }
                    
                    /* Reset layout for mobile */
                    #${uniqueId} .faq-container.tabs-left,
                    #${uniqueId} .faq-container.tabs-right {
                        display: flex;
                        flex-direction: column;
                    }
                    
                    #${uniqueId} .faq-container.tabs-left .faq-heading-area {
                        width: 100%;
                        margin-bottom: 30px;
                        padding: 0;
                        order: -1; /* Move heading to top on mobile */
                    }
                    
                    #${uniqueId} .faq-container.tabs-right .faq-heading-area {
                        width: 100%;
                        margin-bottom: 30px;
                        padding: 0;
                    }
                    
                    #${uniqueId} .faq-container.tabs-left .faq-accordions-wrapper,
                    #${uniqueId} .faq-container.tabs-right .faq-accordions-wrapper {
                        width: 100%;
                    }
                }
            </style>
            
            <div id="${uniqueId}" class="section-wrapper" data-section-id="accordion" style="${sectionStyles}">
                <div class="section-header-tag">
                    <span class="material-symbols-outlined" style="font-size: 16px;">help</span>
                    ${window.translations && window.translations[window.currentLanguage] ? 
                        (window.translations[window.currentLanguage]['sections.accordion'] || 'Accordion/FAQ') : 
                        'Accordion/FAQ'}
                </div>
                <div class="container" style="max-width: ${containerMaxWidth}; margin: 0 auto;">
                    ${layoutClass === 'tabs-bottom' && (config.heading || config.body) ? `
                        <div style="text-align: center; margin-bottom: 40px;">
                            ${config.heading ? `<h2 style="font-family: ${headingFont}; font-size: ${headingSize}; color: ${schemeColors.text}; margin-bottom: 16px;">
                                ${config.heading}
                            </h2>` : ''}
                            ${config.body ? `<div style="font-family: ${bodyFont}; font-size: ${bodySize}; color: ${schemeColors.text}; opacity: 0.8;">
                                ${config.body}
                            </div>` : ''}
                        </div>
                    ` : ''}
                    
                    ${items.length > 0 ? `
                        <div class="faq-container ${layoutClass}" style="${containerStyles} ${containerBackgroundStyle}">
                            ${layoutClass === 'tabs-bottom' ? 
                                // Standard accordion layout for tabs at bottom
                                items.map((itemId, index) => {
                                    const item = config.items[itemId];
                                    if (!item || item.isHidden) return '';
                                    
                                    const isExpanded = config.expandFirstTab && index === 0;
                                    
                                    return `
                                        <div class="faq-item">
                                            <div class="faq-header faq-header-${uniqueId} ${isExpanded ? 'active' : ''}" 
                                                 data-accordion-toggle="true"
                                                 data-accordion-id="${uniqueId}"
                                                 data-item-index="${index}"
                                                 style="cursor: pointer;">
                                                <h3 class="faq-question">${item.question || `Question ${index + 1}`}</h3>
                                                <span class="faq-toggle">${window.WebsiteBuilderModules.Accordion.getToggleIcon(config.toggleStyle, isExpanded)}</span>
                                            </div>
                                            <div class="faq-content faq-content-${uniqueId}-${index} ${isExpanded ? 'active' : ''}" style="${isExpanded ? 'max-height: 1000px;' : 'max-height: 0;'}">
                                                <div class="faq-answer">
                                                    ${item.answer || `Answer ${index + 1}`}
                                                </div>
                                            </div>
                                        </div>
                                    `;
                                }).join('')
                            : 
                                // Side layouts - heading on one side, accordions on the other
                                layoutClass === 'tabs-left' ? 
                                `
                                <div class="faq-accordions-wrapper" style="flex: 1;">
                                    ${items.map((itemId, index) => {
                                        const item = config.items[itemId];
                                        if (!item || item.isHidden) return '';
                                        
                                        const isExpanded = config.expandFirstTab && index === 0;
                                        
                                        return `
                                            <div class="faq-item">
                                                <div class="faq-header faq-header-${uniqueId} ${isExpanded ? 'active' : ''}" 
                                                     data-accordion-toggle="true"
                                                     data-accordion-id="${uniqueId}"
                                                     data-item-index="${index}"
                                                     style="cursor: pointer;">
                                                    <h3 class="faq-question">${item.question || `Question ${index + 1}`}</h3>
                                                    <span class="faq-toggle">${window.WebsiteBuilderModules.Accordion.getToggleIcon(config.toggleStyle, isExpanded)}</span>
                                                </div>
                                                <div class="faq-content faq-content-${uniqueId}-${index} ${isExpanded ? 'active' : ''}" style="${isExpanded ? 'max-height: 1000px;' : 'max-height: 0;'}">
                                                    <div class="faq-answer">
                                                        ${item.answer || `Answer ${index + 1}`}
                                                    </div>
                                                </div>
                                            </div>
                                        `;
                                    }).join('')}
                                </div>
                                <div class="faq-heading-area" style="width: 300px; flex-shrink: 0; padding-left: 40px;">
                                    <h2 style="font-family: ${headingFont}; font-size: ${headingSize}; color: ${schemeColors.text}; margin: 0;">
                                        ${config.heading || 'Preguntas Frecuentes'}
                                    </h2>
                                    ${config.body ? `<div style="font-family: ${bodyFont}; font-size: ${bodySize}; color: ${schemeColors.text}; opacity: 0.8; margin-top: 16px;">
                                        ${config.body}
                                    </div>` : ''}
                                </div>
                                ` : 
                                // tabs-right - heading left, accordions right
                                `
                                <div class="faq-heading-area" style="width: 300px; flex-shrink: 0; padding-right: 40px;">
                                    <h2 style="font-family: ${headingFont}; font-size: ${headingSize}; color: ${schemeColors.text}; margin: 0;">
                                        ${config.heading || 'Preguntas Frecuentes'}
                                    </h2>
                                    ${config.body ? `<div style="font-family: ${bodyFont}; font-size: ${bodySize}; color: ${schemeColors.text}; opacity: 0.8; margin-top: 16px;">
                                        ${config.body}
                                    </div>` : ''}
                                </div>
                                <div class="faq-accordions-wrapper" style="flex: 1;">
                                    ${items.map((itemId, index) => {
                                        const item = config.items[itemId];
                                        if (!item || item.isHidden) return '';
                                        
                                        const isExpanded = config.expandFirstTab && index === 0;
                                        
                                        return `
                                            <div class="faq-item">
                                                <div class="faq-header faq-header-${uniqueId} ${isExpanded ? 'active' : ''}" 
                                                     data-accordion-toggle="true"
                                                     data-accordion-id="${uniqueId}"
                                                     data-item-index="${index}"
                                                     style="cursor: pointer;">
                                                    <h3 class="faq-question">${item.question || `Question ${index + 1}`}</h3>
                                                    <span class="faq-toggle">${window.WebsiteBuilderModules.Accordion.getToggleIcon(config.toggleStyle, isExpanded)}</span>
                                                </div>
                                                <div class="faq-content faq-content-${uniqueId}-${index} ${isExpanded ? 'active' : ''}" style="${isExpanded ? 'max-height: 1000px;' : 'max-height: 0;'}">
                                                    <div class="faq-answer">
                                                        ${item.answer || `Answer ${index + 1}`}
                                                    </div>
                                                </div>
                                            </div>
                                        `;
                                    }).join('')}
                                </div>
                                `
                            }
                        </div>
                    ` : `
                        <div style="text-align: center; padding: 60px 20px;">
                            <i class="material-icons" style="font-size: 48px; color: #999;">help_outline</i>
                            <p style="margin-top: 20px; color: #666; font-family: ${bodyFont};">Click the + button to add FAQ items</p>
                        </div>
                    `}
                    
                    ${config.buttonLabel ? `
                        <div style="text-align: center; margin-top: 40px;">
                            <a href="${config.buttonLink || '#'}" class="accordion-button" 
                               style="display: inline-block; padding: 12px 24px; font-family: ${bodyFont}; font-size: 14px; 
                                      ${config.buttonStyle === 'solid' ? 
                                        `background: ${schemeColors.text}; color: ${schemeColors.background}; border: 2px solid ${schemeColors.text};` : 
                                        config.buttonStyle === 'outline' ? 
                                        `background: transparent; color: ${schemeColors.text}; border: 2px solid ${schemeColors.text};` :
                                        `background: transparent; color: ${schemeColors.text}; border: none; text-decoration: underline;`
                                      }
                                      border-radius: 4px; text-decoration: none; transition: all 0.3s ease;">
                                ${config.buttonLabel}
                            </a>
                        </div>
                    ` : ''}
                </div>
            </div>
        `;
    },
    
    renderSettings: function(config) {
        const configData = config || {
            colorScheme: 'scheme5',
            colorBackground: false,
            colorTabs: 'categories',
            width: 'extra-small',
            layout: 'tabs-at-the-bottom',
            expandFirstTab: false,
            heading: 'Preguntas Frecuentes',
            body: '',
            headingSize: 3,
            bodySize: 3,
            buttonLabel: '',
            buttonLink: '',
            buttonStyle: 'solid',
            addSidePaddings: false,
            topPadding: 96,
            bottomPadding: 96,
            items: {},
            itemOrder: []
        };
        
        // Merge with existing config
        if (config) {
            Object.assign(configData, config);
        }
        
        return `
            <style>
                .accordion-faq-item.dragging {
                    opacity: 0.5;
                    transform: scale(0.98);
                }
                
                .accordion-faq-item .drag-handle:hover {
                    color: #2962ff !important;
                    transform: scale(1.1);
                }
                
                .sortable-placeholder {
                    background: #f0f0f0 !important;
                    border: 2px dashed #2962ff !important;
                    border-radius: 8px !important;
                    margin-bottom: 15px !important;
                    opacity: 0.5 !important;
                }
                
                .ui-sortable-helper {
                    box-shadow: 0 4px 8px rgba(0,0,0,0.15) !important;
                }
            </style>
            
            <div style="display: flex; flex-direction: column; height: 100%; position: relative; overflow: hidden;">
                <div class="sidebar-view-header" style="position: relative; z-index: 10;">
                    <button class="back-to-sections-btn">
                        <i class="material-icons">arrow_back</i>
                    </button>
                    <h3>Accordion</h3>
                    <div class="section-menu-wrapper">
                        <button class="btn-icon section-menu">
                            <i class="material-icons">more_vert</i>
                        </button>
                        <div class="section-menu-dropdown">
                            <a href="#" class="menu-item" data-action="locate">
                                <i class="material-icons">my_location</i>
                                <span data-i18n="common.locate">Locate</span>
                            </a>
                        </div>
                    </div>
                </div>
                
                <div style="padding: 20px; overflow-y: auto; overflow-x: hidden; flex: 1; height: calc(100% - 60px); box-sizing: border-box;">
                    ${window.WebsiteBuilderModules.Accordion.renderMainSettings(configData)}
                    ${window.WebsiteBuilderModules.Accordion.renderContentSettings(configData)}
                    ${window.WebsiteBuilderModules.Accordion.renderButtonSettings(configData)}
                    ${window.WebsiteBuilderModules.Accordion.renderPaddingSettings(configData)}
                </div>
            </div>
        `;
    },
    
    renderMainSettings: function(config) {
        return `
            <!-- Color scheme -->
            <div class="settings-field">
                <label data-i18n="accordion.colorScheme">Color scheme</label>
                <select class="shopify-select" id="accordion-color-scheme">
                    <option value="scheme1" ${config.colorScheme === 'scheme1' ? 'selected' : ''}>Scheme 1</option>
                    <option value="scheme2" ${config.colorScheme === 'scheme2' ? 'selected' : ''}>Scheme 2</option>
                    <option value="scheme3" ${config.colorScheme === 'scheme3' ? 'selected' : ''}>Scheme 3</option>
                    <option value="scheme4" ${config.colorScheme === 'scheme4' ? 'selected' : ''}>Scheme 4</option>
                    <option value="scheme5" ${config.colorScheme === 'scheme5' ? 'selected' : ''}>Scheme 5</option>
                </select>
                <a href="#" class="settings-link" data-i18n="common.learnAboutColorSchemes">Learn about color schemes</a>
            </div>
            
            <!-- Color background -->
            <div class="settings-field">
                <label class="toggle-field">
                    <span data-i18n="accordion.colorBackground">Color background</span>
                    <input type="checkbox" class="shopify-toggle" id="accordion-color-background" ${config.colorBackground ? 'checked' : ''}>
                    <label for="accordion-color-background" class="toggle-slider"></label>
                </label>
            </div>
            
            <!-- Color tabs -->
            <div class="settings-field">
                <label data-i18n="accordion.colorTabs">Color tabs</label>
                <select class="shopify-select" id="accordion-color-tabs">
                    <option value="none" ${config.colorTabs === 'none' ? 'selected' : ''} data-i18n="accordion.colorTabs.none">None</option>
                    <option value="all" ${config.colorTabs === 'all' ? 'selected' : ''} data-i18n="accordion.colorTabs.all">All</option>
                    <option value="categories" ${config.colorTabs === 'categories' ? 'selected' : ''} data-i18n="accordion.colorTabs.categories">Categories</option>
                    <option value="content-tab" ${config.colorTabs === 'content-tab' ? 'selected' : ''} data-i18n="accordion.colorTabs.contentTab">Content tab</option>
                    <option value="all-separately" ${config.colorTabs === 'all-separately' ? 'selected' : ''} data-i18n="accordion.colorTabs.allSeparately">All separately</option>
                    <option value="content-tab-separately" ${config.colorTabs === 'content-tab-separately' ? 'selected' : ''} data-i18n="accordion.colorTabs.contentTabSeparately">Content tab separately</option>
                </select>
            </div>
            
            <!-- Width -->
            <div class="settings-field">
                <label data-i18n="accordion.width">Width</label>
                <select class="shopify-select" id="accordion-width">
                    <option value="extra-small" ${config.width === 'extra-small' ? 'selected' : ''}>Extra small</option>
                    <option value="small" ${config.width === 'small' ? 'selected' : ''}>Small</option>
                    <option value="medium" ${config.width === 'medium' ? 'selected' : ''}>Medium</option>
                    <option value="large" ${config.width === 'large' ? 'selected' : ''}>Large</option>
                    <option value="extra-large" ${config.width === 'extra-large' ? 'selected' : ''}>Extra large</option>
                </select>
            </div>
            
            <!-- Layout -->
            <div class="settings-field">
                <label data-i18n="accordion.layout">Layout</label>
                <select class="shopify-select" id="accordion-layout">
                    <option value="tabs-to-the-right" ${config.layout === 'tabs-to-the-right' ? 'selected' : ''} data-i18n="accordion.layout.right">Tabs to the right</option>
                    <option value="tabs-to-the-left" ${config.layout === 'tabs-to-the-left' ? 'selected' : ''} data-i18n="accordion.layout.left">Tabs to the left</option>
                    <option value="tabs-at-the-bottom" ${config.layout === 'tabs-at-the-bottom' ? 'selected' : ''} data-i18n="accordion.layout.bottom">Tabs at the bottom</option>
                </select>
                <p class="help-text" data-i18n="accordion.layoutHelp">Bottom is the default mobile layout</p>
            </div>
            
            <!-- Toggle style -->
            <div class="settings-field">
                <label data-i18n="accordion.toggleStyle">Toggle style</label>
                <select class="shopify-select" id="accordion-toggle-style">
                    <option value="plus-minus" ${config.toggleStyle === 'plus-minus' || !config.toggleStyle ? 'selected' : ''}>Plus/Minus (+/-)</option>
                    <option value="chevron" ${config.toggleStyle === 'chevron' ? 'selected' : ''}>Chevron (›)</option>
                    <option value="arrow" ${config.toggleStyle === 'arrow' ? 'selected' : ''}>Arrow (→)</option>
                    <option value="caret" ${config.toggleStyle === 'caret' ? 'selected' : ''}>Caret (▶)</option>
                    <option value="none" ${config.toggleStyle === 'none' ? 'selected' : ''}>None</option>
                </select>
            </div>
            
            <!-- Expand first tab -->
            <div class="settings-field">
                <label class="toggle-field">
                    <span data-i18n="accordion.expandFirstTab">Expand first tab</span>
                    <input type="checkbox" class="shopify-toggle" id="accordion-expand-first" ${config.expandFirstTab ? 'checked' : ''}>
                    <label for="accordion-expand-first" class="toggle-slider"></label>
                </label>
            </div>
            
            <div class="settings-divider"></div>
        `;
    },
    
    renderContentSettings: function(config) {
        return `
            <!-- Content section -->
            <h4 data-i18n="accordion.content" style="font-size: 13px; font-weight: 500; margin-bottom: 12px; color: #5c5e60;">Content</h4>
            
            <!-- Heading -->
            <div class="settings-field">
                <label data-i18n="accordion.heading">Heading</label>
                <input type="text" class="shopify-input" id="accordion-heading" value="${config.heading || 'Preguntas Frecuentes'}" placeholder="Preguntas Frecuentes">
            </div>
            
            <!-- Body (Rich text) -->
            <div class="settings-field">
                <label data-i18n="accordion.body">Body</label>
                <div class="rich-text-toolbar">
                    <button class="toolbar-btn" data-command="formatBlock" data-value="p" title="Paragraph">
                        <i class="material-icons">notes</i>
                    </button>
                    <button class="toolbar-btn" data-command="bold" title="Bold">
                        <span style="font-weight: bold;">B</span>
                    </button>
                    <button class="toolbar-btn" data-command="italic" title="Italic">
                        <span style="font-style: italic;">I</span>
                    </button>
                    <button class="toolbar-btn" data-command="createLink" title="Link">
                        <i class="material-icons">link</i>
                    </button>
                </div>
                <div contenteditable="true" class="rich-text-editor shopify-input" id="accordion-body" style="min-height: 100px; padding: 10px;">${config.body || ''}</div>
            </div>
            
            <!-- Heading size -->
            <div class="settings-field">
                <label data-i18n="accordion.headingSize">Heading size</label>
                <select class="shopify-select" id="accordion-heading-size">
                    <option value="0" ${config.headingSize === 0 ? 'selected' : ''}>Heading 0</option>
                    <option value="1" ${config.headingSize === 1 ? 'selected' : ''}>Heading 1</option>
                    <option value="2" ${config.headingSize === 2 ? 'selected' : ''}>Heading 2</option>
                    <option value="3" ${config.headingSize === 3 ? 'selected' : ''}>Heading 3</option>
                    <option value="4" ${config.headingSize === 4 ? 'selected' : ''}>Heading 4</option>
                    <option value="5" ${config.headingSize === 5 ? 'selected' : ''}>Heading 5</option>
                    <option value="6" ${config.headingSize === 6 ? 'selected' : ''}>Heading 6</option>
                    <option value="7" ${config.headingSize === 7 ? 'selected' : ''}>Heading 7</option>
                </select>
            </div>
            
            <!-- Body size -->
            <div class="settings-field">
                <label data-i18n="accordion.bodySize">Body size</label>
                <select class="shopify-select" id="accordion-body-size">
                    <option value="0" ${config.bodySize === 0 ? 'selected' : ''}>Body 0</option>
                    <option value="1" ${config.bodySize === 1 ? 'selected' : ''}>Body 1</option>
                    <option value="2" ${config.bodySize === 2 ? 'selected' : ''}>Body 2</option>
                    <option value="3" ${config.bodySize === 3 ? 'selected' : ''}>Body 3</option>
                    <option value="4" ${config.bodySize === 4 ? 'selected' : ''}>Body 4</option>
                    <option value="5" ${config.bodySize === 5 ? 'selected' : ''}>Body 5</option>
                    <option value="6" ${config.bodySize === 6 ? 'selected' : ''}>Body 6</option>
                </select>
            </div>
            
            <div class="settings-divider"></div>
        `;
    },
    
    renderButtonSettings: function(config) {
        return `
            <!-- Button section -->
            <h4 data-i18n="accordion.button" style="font-size: 13px; font-weight: 500; margin-bottom: 12px; color: #5c5e60;">Button</h4>
            
            <!-- Button label -->
            <div class="settings-field">
                <label data-i18n="accordion.buttonLabel">Button label</label>
                <input type="text" class="shopify-input" id="accordion-button-label" value="${config.buttonLabel || ''}" placeholder="">
            </div>
            
            <!-- Button link -->
            <div class="settings-field">
                <label data-i18n="accordion.buttonLink">Button link</label>
                <input type="text" class="shopify-input" id="accordion-button-link" value="${config.buttonLink || ''}" placeholder="Pega un enlace o busca">
            </div>
            
            <!-- Button style -->
            <div class="settings-field">
                <label data-i18n="accordion.buttonStyle">Button style</label>
                <div class="button-group">
                    <button class="style-btn ${config.buttonStyle === 'solid' ? 'active' : ''}" data-value="solid">
                        <span data-i18n="common.solid">Solid</span>
                    </button>
                    <button class="style-btn ${config.buttonStyle === 'outline' ? 'active' : ''}" data-value="outline">
                        <span data-i18n="common.outline">Outline</span>
                    </button>
                    <button class="style-btn ${config.buttonStyle === 'text' ? 'active' : ''}" data-value="text">
                        <span data-i18n="common.text">Text</span>
                    </button>
                </div>
            </div>
            
            <div class="settings-divider"></div>
        `;
    },
    
    renderPaddingSettings: function(config) {
        return `
            <!-- Paddings section -->
            <h4 data-i18n="accordion.paddings" style="font-size: 13px; font-weight: 500; margin-bottom: 12px; color: #5c5e60;">Paddings</h4>
            
            <!-- Add side paddings -->
            <div class="settings-field">
                <label class="toggle-field">
                    <span data-i18n="accordion.addSidePaddings">Add side paddings</span>
                    <input type="checkbox" class="shopify-toggle" id="accordion-side-paddings" ${config.addSidePaddings ? 'checked' : ''}>
                    <label for="accordion-side-paddings" class="toggle-slider"></label>
                </label>
            </div>
            
            <!-- Top padding -->
            <div class="settings-field">
                <label data-i18n="accordion.topPadding">Top padding</label>
                <div class="range-with-inputs">
                    <input type="range" class="shopify-range" id="accordion-top-padding" min="0" max="200" value="${config.topPadding || 96}">
                    <div class="range-inputs">
                        <input type="number" class="shopify-number-input" id="accordion-top-padding-input" value="${config.topPadding || 96}" min="0" max="200">
                        <span class="unit">px</span>
                    </div>
                </div>
            </div>
            
            <!-- Bottom padding -->
            <div class="settings-field">
                <label data-i18n="accordion.bottomPadding">Bottom padding</label>
                <div class="range-with-inputs">
                    <input type="range" class="shopify-range" id="accordion-bottom-padding" min="0" max="200" value="${config.bottomPadding || 96}">
                    <div class="range-inputs">
                        <input type="number" class="shopify-number-input" id="accordion-bottom-padding-input" value="${config.bottomPadding || 96}" min="0" max="200">
                        <span class="unit">px</span>
                    </div>
                </div>
            </div>
            
            <div class="settings-divider"></div>
        `;
    },
    
    renderItemsSection: function(config) {
        const items = config.itemOrder || [];
        
        return `
            <div class="settings-group" style="margin-top: 30px;">
                <div class="settings-group-header" style="display: flex; justify-content: space-between; align-items: center;">
                    <h4 data-i18n="accordion.items.title">Preguntas FAQ</h4>
                    <button class="add-faq-btn" onclick="window.addAccordionItem()" 
                            style="background: #2962ff; color: white; border: none; padding: 5px 15px; border-radius: 4px; cursor: pointer;">
                        <i class="material-icons" style="font-size: 16px; vertical-align: middle;">add</i>
                        <span data-i18n="accordion.items.add">Agregar pregunta</span>
                    </button>
                </div>
                
                <div id="accordion-items-container" style="margin-top: 20px;">
                    ${items.map((itemId, index) => {
                        const item = config.items ? config.items[itemId] : null;
                        return item ? window.WebsiteBuilderModules.Accordion.renderItemCollapsible(item, index) : '';
                    }).join('')}
                </div>
                
                ${items.length === 0 ? `
                    <div style="text-align: center; padding: 40px 20px; background: #f5f5f5; border-radius: 8px; margin-top: 20px;">
                        <i class="material-icons" style="font-size: 48px; color: #999;">help_outline</i>
                        <p style="margin-top: 10px; color: #666;">No hay preguntas FAQ todavía</p>
                        <p style="color: #999; font-size: 14px;">Haz clic en "Agregar pregunta" para empezar</p>
                    </div>
                ` : ''}
            </div>
        `;
    },
    
    renderItemCollapsible: function(item, index) {
        if (!item) return '';
        
        return `
            <div class="accordion-faq-item" data-item-id="${item.id}" style="margin-bottom: 15px; border: 1px solid #e3e3e3; border-radius: 8px; overflow: hidden; transition: all 0.3s ease;">
                <div class="collapsible-header" data-target="faq-content-${item.id}" 
                     style="padding: 15px; cursor: pointer; display: flex; align-items: center; justify-content: space-between; background: #fafafa;"
                     onclick="event.stopPropagation(); console.log('[ACCORDION] Header clicked inline', 'faq-content-${item.id}')">
                    <div style="display: flex; align-items: center; gap: 10px;">
                        <i class="material-icons drag-handle" style="cursor: move; color: #8c9196; font-size: 20px; margin-right: 8px;" title="Arrastrar para reordenar">drag_indicator</i>
                        <i class="material-icons collapse-icon" style="transition: transform 0.3s; margin-right: 8px;">expand_more</i>
                        <span style="font-weight: 500;">Pregunta ${index + 1}</span>
                    </div>
                    <div style="display: flex; gap: 10px;">
                        <button class="visibility-toggle ${item.isHidden ? 'is-hidden' : ''}" 
                                data-element-id="${item.id}" data-element-type="accordion-item"
                                style="background: none; border: none; cursor: pointer; padding: 4px;">
                            <i class="material-icons icon-visible">visibility</i>
                            <i class="material-icons icon-hidden">visibility_off</i>
                        </button>
                        <button class="delete-faq-btn" data-item-id="${item.id}" 
                                style="background: none; border: none; cursor: pointer; padding: 4px;">
                            <i class="material-icons" style="color: #dc3545;">delete</i>
                        </button>
                    </div>
                </div>
                
                <div id="faq-content-${item.id}" class="collapsible-content" style="display: none; padding: 20px; background: white;">
                    <div class="settings-field" style="margin-bottom: 15px;">
                        <label style="display: block; margin-bottom: 5px; font-weight: 500;">Pregunta</label>
                        <input type="text" class="faq-question-input" data-item-id="${item.id}" 
                               value="${item.question || ''}" placeholder="Escribe la pregunta aquí..."
                               style="width: 100%; padding: 8px 12px; border: 1px solid #ddd; border-radius: 4px;">
                    </div>
                    
                    <div class="settings-field">
                        <label style="display: block; margin-bottom: 5px; font-weight: 500;">Respuesta</label>
                        <textarea class="faq-answer-input" data-item-id="${item.id}" 
                                  placeholder="Escribe la respuesta aquí..."
                                  style="width: 100%; min-height: 100px; padding: 8px 12px; border: 1px solid #ddd; border-radius: 4px; resize: vertical;">${item.answer || ''}</textarea>
                    </div>
                </div>
            </div>
        `;
    },
    
    renderItemSettings: function(itemId) {
        const item = window.currentSectionsConfig?.accordion?.items?.[itemId];
        if (!item) {
            console.error('[ACCORDION] Item not found:', itemId);
            return '<div>Error: Item not found</div>';
        }
        
        return `
            <div style="display: flex; flex-direction: column; height: 100%; position: relative; overflow: hidden;">
                <div class="sidebar-view-header" style="position: relative; z-index: 10;">
                    <button class="back-to-sections-btn">
                        <i class="material-icons">arrow_back</i>
                    </button>
                    <h3>Content tab</h3>
                    <div class="section-menu-wrapper">
                        <button class="btn-icon section-menu">
                            <i class="material-icons">more_vert</i>
                        </button>
                        <div class="section-menu-dropdown">
                            <a href="#" class="menu-item" data-action="duplicate">
                                <i class="material-icons">content_copy</i>
                                <span data-i18n="common.duplicate">Duplicate</span>
                            </a>
                            <a href="#" class="menu-item" data-action="delete">
                                <i class="material-icons">delete</i>
                                <span data-i18n="common.delete">Delete</span>
                            </a>
                        </div>
                    </div>
                </div>
                
                <div style="padding: 20px; overflow-y: auto; overflow-x: hidden; flex: 1; height: calc(100% - 60px); box-sizing: border-box;">
                    <!-- Heading section -->
                    <div class="settings-group">
                        <h4 style="font-size: 13px; font-weight: 500; margin-bottom: 12px; color: #5c5e60;">Heading</h4>
                        
                        <div class="settings-field">
                            <input type="text" class="shopify-input" id="item-heading" 
                                   value="${item.question || ''}" 
                                   placeholder="Requerimientos ?">
                        </div>
                        
                        <div class="settings-field">
                            <label data-i18n="accordion.item.icon">Icon</label>
                            <select class="shopify-select" id="item-icon">
                                ${window.WebsiteBuilderModules.Accordion.generateIconOptions(item.icon || 'none')}
                            </select>
                            <a href="#" class="settings-link" data-i18n="accordion.item.seeIconStands">See what icon stands for each label</a>
                        </div>
                        
                        <div class="settings-field">
                            <label data-i18n="accordion.item.customIcon">Custom icon</label>
                            <div class="custom-icon-upload" style="border: 2px dashed #e3e3e3; border-radius: 4px; padding: 20px; text-align: center;">
                                ${item.customIcon ? 
                                    `<div class="custom-icon-preview">
                                        <img src="${item.customIcon}" alt="Custom icon" style="max-width: 64px; max-height: 64px; margin-bottom: 8px;">
                                        <div>
                                            <button class="shopify-button change-icon-btn" style="background: #fff; border: 1px solid #c9cccf; padding: 6px 12px; cursor: pointer; font-size: 12px;">
                                                Change icon
                                            </button>
                                            <button class="shopify-button remove-icon-btn" style="background: #fff; border: 1px solid #c9cccf; padding: 6px 12px; cursor: pointer; font-size: 12px; margin-left: 8px;">
                                                Remove
                                            </button>
                                        </div>
                                    </div>` :
                                    `<button class="shopify-button select-icon-btn" style="background: #fff; border: 1px solid #c9cccf; padding: 8px 16px; cursor: pointer;">
                                        <span data-i18n="accordion.item.selectIcon">Seleccionar</span>
                                    </button>`
                                }
                            </div>
                            <input type="file" id="custom-icon-input" accept="image/*" style="display: none;" data-item-id="${item.id}">
                            <p style="margin: 0; color: #6b7177; font-size: 12px; margin-top: 8px;">
                                <span data-i18n="accordion.item.exploreImages">Explorar imágenes gratuitas</span>
                            </p>
                        </div>
                    </div>
                    
                    <div class="settings-divider"></div>
                    
                    <!-- Source section -->
                    <div class="settings-group">
                        <h4 style="font-size: 13px; font-weight: 500; margin-bottom: 12px; color: #5c5e60;">Source</h4>
                        
                        <div class="settings-field">
                            <label data-i18n="accordion.item.richText">Rich text</label>
                            <div class="rich-text-toolbar">
                                <button class="toolbar-btn" data-command="formatBlock" data-value="p" title="Paragraph">
                                    <i class="material-icons">notes</i>
                                </button>
                                <button class="toolbar-btn" data-command="bold" title="Bold">
                                    <span style="font-weight: bold;">B</span>
                                </button>
                                <button class="toolbar-btn" data-command="italic" title="Italic">
                                    <span style="font-style: italic;">I</span>
                                </button>
                                <button class="toolbar-btn" data-command="createLink" title="Link">
                                    <i class="material-icons">link</i>
                                </button>
                                <button class="toolbar-btn" data-command="insertUnorderedList" title="Bullet list">
                                    <i class="material-icons">format_list_bulleted</i>
                                </button>
                                <button class="toolbar-btn" data-command="insertOrderedList" title="Numbered list">
                                    <i class="material-icons">format_list_numbered</i>
                                </button>
                            </div>
                            <div contenteditable="true" class="rich-text-editor shopify-input" id="item-rich-text" 
                                 style="min-height: 150px; padding: 10px;">${item.answer || ''}</div>
                        </div>
                        
                        <div class="settings-field">
                            <label data-i18n="accordion.item.page">Page</label>
                            <button class="shopify-button" id="select-page" style="width: 100%; text-align: left; justify-content: space-between;">
                                <span>Seleccionar</span>
                                <i class="material-icons" style="font-size: 20px;">chevron_right</i>
                            </button>
                        </div>
                        
                        <div class="settings-divider"></div>
                        
                        <!-- Image section -->
                        <div class="settings-field">
                            <label data-i18n="accordion.item.image">Image</label>
                            <div style="border: 2px dashed #e3e3e3; border-radius: 4px; padding: 20px; text-align: center;">
                                <button class="shopify-button" id="select-image" style="margin-bottom: 10px;">
                                    <span data-i18n="accordion.item.selectImage">Seleccionar</span>
                                </button>
                                <p style="margin: 0; color: #6b7177; font-size: 12px;">
                                    <span data-i18n="accordion.item.exploreImages">Explorar imágenes gratuitas</span>
                                </p>
                            </div>
                        </div>
                        
                        <!-- Video section -->
                        <div class="settings-field">
                            <label data-i18n="accordion.item.video">Video</label>
                            <button class="shopify-button" id="select-video" style="width: 100%; text-align: left;">
                                <span>Seleccionar</span>
                            </button>
                        </div>
                        
                        <!-- Desktop image size -->
                        <div class="settings-field">
                            <label data-i18n="accordion.item.desktopImageSize">Desktop image size</label>
                            <div class="range-with-inputs">
                                <input type="range" class="shopify-range" id="desktop-image-size" 
                                       min="0" max="200" value="${item.desktopImageSize || 100}">
                                <div class="range-inputs">
                                    <input type="number" class="shopify-number-input" id="desktop-image-size-input" 
                                           value="${item.desktopImageSize || 100}" min="0" max="200">
                                    <span class="unit">%</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `;
    },
    
    attachItemEventListeners: function(itemId) {
        // Back button
        $('.back-to-sections-btn').off('click').on('click', function() {
            window.switchSidebarView('blockList', window.getUpdatedPageData());
        });
        
        // Helper function to update item
        const updateItem = (key, value) => {
            if (window.currentSectionsConfig.accordion?.items?.[itemId]) {
                window.currentSectionsConfig.accordion.items[itemId][key] = value;
                window.setHasPendingPageStructureChanges(true);
                window.updateSaveButtonState();
                window.renderPreview();
            }
        };
        
        // Heading/Question
        $('#item-heading').off('input').on('input', function() {
            updateItem('question', $(this).val());
        });
        
        // Icon selection
        $('#item-icon').off('change').on('change', function() {
            updateItem('icon', $(this).val());
        });
        
        // Rich text editor
        $('#item-rich-text').off('input').on('input', function() {
            updateItem('answer', $(this).html());
        });
        
        // Rich text toolbar
        $('.rich-text-toolbar .toolbar-btn').off('click').on('click', function(e) {
            e.preventDefault();
            const command = $(this).data('command');
            const value = $(this).data('value') || null;
            
            if (command === 'createLink') {
                const url = prompt('Enter URL:');
                if (url) {
                    document.execCommand(command, false, url);
                }
            } else {
                document.execCommand(command, false, value);
            }
            
            // Update after command
            updateItem('answer', $('#item-rich-text').html());
        });
        
        // Desktop image size range
        $('#desktop-image-size').off('input').on('input', function() {
            const value = $(this).val();
            $('#desktop-image-size-input').val(value);
            updateItem('desktopImageSize', parseInt(value));
        });
        
        // Desktop image size input
        $('#desktop-image-size-input').off('input').on('input', function() {
            const value = $(this).val();
            $('#desktop-image-size').val(value);
            updateItem('desktopImageSize', parseInt(value));
        });
        
        // More menu toggle
        $('.section-menu').off('click').on('click', function(e) {
            e.stopPropagation();
            $(this).next('.section-menu-dropdown').toggle();
        });
        
        // Close menu when clicking outside
        $(document).off('click.accordionItemMenu').on('click.accordionItemMenu', function() {
            $('.section-menu-dropdown').hide();
        });
        
        // Menu actions
        $('.section-menu-dropdown .menu-item').off('click').on('click', function(e) {
            e.preventDefault();
            const action = $(this).data('action');
            
            if (action === 'duplicate') {
                // Duplicate item
                const newItemId = 'faq-' + Date.now();
                const originalItem = window.currentSectionsConfig.accordion.items[itemId];
                
                window.currentSectionsConfig.accordion.items[newItemId] = {
                    ...originalItem,
                    id: newItemId,
                    question: originalItem.question + ' (copy)'
                };
                
                // Add to order after current item
                const currentIndex = window.currentSectionsConfig.accordion.itemOrder.indexOf(itemId);
                window.currentSectionsConfig.accordion.itemOrder.splice(currentIndex + 1, 0, newItemId);
                
                window.setHasPendingPageStructureChanges(true);
                window.updateSaveButtonState();
                window.renderPreview();
                
                // Go back to block list
                window.switchSidebarView('blockList', window.getUpdatedPageData());
                
            } else if (action === 'delete') {
                if (confirm('¿Estás seguro de que quieres eliminar esta pregunta?')) {
                    // Delete item
                    delete window.currentSectionsConfig.accordion.items[itemId];
                    
                    // Remove from order
                    const index = window.currentSectionsConfig.accordion.itemOrder.indexOf(itemId);
                    if (index > -1) {
                        window.currentSectionsConfig.accordion.itemOrder.splice(index, 1);
                    }
                    
                    window.setHasPendingPageStructureChanges(true);
                    window.updateSaveButtonState();
                    window.renderPreview();
                    
                    // Go back to block list
                    window.switchSidebarView('blockList', window.getUpdatedPageData());
                }
            }
            
            $('.section-menu-dropdown').hide();
        });
        
        // Custom icon upload buttons
        $('.select-icon-btn, .change-icon-btn').off('click').on('click', function(e) {
            e.preventDefault();
            $('#custom-icon-input').click();
        });
        
        // Remove custom icon button
        $('.remove-icon-btn').off('click').on('click', function(e) {
            e.preventDefault();
            updateItem('customIcon', '');
            updateItem('icon', 'none'); // Reset to no icon
            
            // Update UI
            $('.custom-icon-upload').html(`
                <button class="shopify-button select-icon-btn" style="background: #fff; border: 1px solid #c9cccf; padding: 8px 16px; cursor: pointer;">
                    <span data-i18n="accordion.item.selectIcon">Seleccionar</span>
                </button>
            `);
            
            // Re-attach event listener
            $('.select-icon-btn').on('click', function(e) {
                e.preventDefault();
                $('#custom-icon-input').click();
            });
        });
        
        // Handle file upload
        $('#custom-icon-input').off('change').on('change', async function(e) {
            const file = e.target.files[0];
            if (file) {
                try {
                    // Create FormData for upload
                    const formData = new FormData();
                    formData.append('iconFile', file);
                    formData.append('itemId', itemId);
                    
                    // Show loading state
                    $('.custom-icon-upload').html('<p>Uploading...</p>');
                    
                    // Upload to server
                    const response = await fetch('/api/builder/websites/current/upload-icon', {
                        method: 'POST',
                        body: formData,
                        headers: {
                            'RequestVerificationToken': $('[name="__RequestVerificationToken"]').val() || ''
                        }
                    });
                    
                    if (response.ok) {
                        const result = await response.json();
                        updateItem('customIcon', result.iconUrl);
                        updateItem('icon', 'custom'); // Set icon to custom to use the uploaded image
                        
                        // Update UI
                        $('.custom-icon-upload').html(`
                            <div class="custom-icon-preview">
                                <img src="${result.iconUrl}" alt="Custom icon" style="max-width: 64px; max-height: 64px; margin-bottom: 8px;">
                                <div>
                                    <button class="shopify-button change-icon-btn" style="background: #fff; border: 1px solid #c9cccf; padding: 6px 12px; cursor: pointer; font-size: 12px;">
                                        Change icon
                                    </button>
                                    <button class="shopify-button remove-icon-btn" style="background: #fff; border: 1px solid #c9cccf; padding: 6px 12px; cursor: pointer; font-size: 12px; margin-left: 8px;">
                                        Remove
                                    </button>
                                </div>
                            </div>
                        `);
                        
                        // Re-attach event listeners
                        $('.change-icon-btn').on('click', function(e) {
                            e.preventDefault();
                            $('#custom-icon-input').click();
                        });
                        
                        $('.remove-icon-btn').on('click', function(e) {
                            e.preventDefault();
                            updateItem('customIcon', '');
                            updateItem('icon', 'none');
                            $('.custom-icon-upload').html(`
                                <button class="shopify-button select-icon-btn" style="background: #fff; border: 1px solid #c9cccf; padding: 8px 16px; cursor: pointer;">
                                    <span data-i18n="accordion.item.selectIcon">Seleccionar</span>
                                </button>
                            `);
                            $('.select-icon-btn').on('click', function(e) {
                                e.preventDefault();
                                $('#custom-icon-input').click();
                            });
                        });
                        
                    } else {
                        alert('Upload failed. Please try again.');
                        // Restore button
                        $('.custom-icon-upload').html(`
                            <button class="shopify-button select-icon-btn" style="background: #fff; border: 1px solid #c9cccf; padding: 8px 16px; cursor: pointer;">
                                <span data-i18n="accordion.item.selectIcon">Seleccionar</span>
                            </button>
                        `);
                        $('.select-icon-btn').on('click', function(e) {
                            e.preventDefault();
                            $('#custom-icon-input').click();
                        });
                    }
                } catch (error) {
                    console.error('Error uploading icon:', error);
                    alert('Upload failed. Please try again.');
                    // Restore button
                    $('.custom-icon-upload').html(`
                        <button class="shopify-button select-icon-btn" style="background: #fff; border: 1px solid #c9cccf; padding: 8px 16px; cursor: pointer;">
                            <span data-i18n="accordion.item.selectIcon">Seleccionar</span>
                        </button>
                    `);
                    $('.select-icon-btn').on('click', function(e) {
                        e.preventDefault();
                        $('#custom-icon-input').click();
                    });
                }
            }
        });
        
        // Placeholder buttons
        $('#select-page, #select-image, #select-video').off('click').on('click', function(e) {
            e.preventDefault();
            alert('Esta funcionalidad será implementada próximamente');
        });
    },
    
    attachEventListeners: function() {
        // Back button
        $('.back-to-sections-btn').off('click').on('click', function() {
            window.switchSidebarView('blockList', window.getUpdatedPageData());
        });
        
        // Helper function to update config
        const updateConfig = (key, value) => {
            if (window.currentSectionsConfig.accordion) {
                window.currentSectionsConfig.accordion[key] = value;
                window.setHasPendingPageStructureChanges(true);
                window.updateSaveButtonState();
                window.renderPreview();
            }
        };
        
        // Color scheme change
        $('#accordion-color-scheme').off('change').on('change', function() {
            updateConfig('colorScheme', $(this).val());
        });
        
        // Color background toggle
        $('#accordion-color-background').off('change').on('change', function() {
            updateConfig('colorBackground', $(this).is(':checked'));
        });
        
        // Color tabs
        $('#accordion-color-tabs').off('change').on('change', function() {
            updateConfig('colorTabs', $(this).val());
        });
        
        // Width
        $('#accordion-width').off('change').on('change', function() {
            updateConfig('width', $(this).val());
        });
        
        // Layout
        $('#accordion-layout').off('change').on('change', function() {
            updateConfig('layout', $(this).val());
        });
        
        // Toggle style
        $('#accordion-toggle-style').off('change').on('change', function() {
            updateConfig('toggleStyle', $(this).val());
        });
        
        // Expand first tab
        $('#accordion-expand-first').off('change').on('change', function() {
            updateConfig('expandFirstTab', $(this).is(':checked'));
        });
        
        // Heading
        $('#accordion-heading').off('input').on('input', function() {
            updateConfig('heading', $(this).val());
        });
        
        // Body (Rich text)
        $('#accordion-body').off('input').on('input', function() {
            updateConfig('body', $(this).html());
        });
        
        // Rich text toolbar
        $('.rich-text-toolbar .toolbar-btn').off('click').on('click', function(e) {
            e.preventDefault();
            const command = $(this).data('command');
            const value = $(this).data('value') || null;
            
            if (command === 'createLink') {
                const url = prompt('Enter URL:');
                if (url) {
                    document.execCommand(command, false, url);
                }
            } else {
                document.execCommand(command, false, value);
            }
            
            // Update config after command
            updateConfig('body', $('#accordion-body').html());
        });
        
        // Heading size
        $('#accordion-heading-size').off('change').on('change', function() {
            updateConfig('headingSize', parseInt($(this).val()));
        });
        
        // Body size
        $('#accordion-body-size').off('change').on('change', function() {
            updateConfig('bodySize', parseInt($(this).val()));
        });
        
        // Button label
        $('#accordion-button-label').off('input').on('input', function() {
            updateConfig('buttonLabel', $(this).val());
        });
        
        // Button link
        $('#accordion-button-link').off('input').on('input', function() {
            updateConfig('buttonLink', $(this).val());
        });
        
        // Button style
        $('.button-group .style-btn').off('click').on('click', function() {
            $('.button-group .style-btn').removeClass('active');
            $(this).addClass('active');
            updateConfig('buttonStyle', $(this).data('value'));
        });
        
        // Add side paddings
        $('#accordion-side-paddings').off('change').on('change', function() {
            updateConfig('addSidePaddings', $(this).is(':checked'));
        });
        
        // Top padding range
        $('#accordion-top-padding').off('input').on('input', function() {
            const value = $(this).val();
            $('#accordion-top-padding-input').val(value);
            updateConfig('topPadding', parseInt(value));
        });
        
        // Top padding input
        $('#accordion-top-padding-input').off('input').on('input', function() {
            const value = $(this).val();
            $('#accordion-top-padding').val(value);
            updateConfig('topPadding', parseInt(value));
        });
        
        // Bottom padding range
        $('#accordion-bottom-padding').off('input').on('input', function() {
            const value = $(this).val();
            $('#accordion-bottom-padding-input').val(value);
            updateConfig('bottomPadding', parseInt(value));
        });
        
        // Bottom padding input
        $('#accordion-bottom-padding-input').off('input').on('input', function() {
            const value = $(this).val();
            $('#accordion-bottom-padding').val(value);
            updateConfig('bottomPadding', parseInt(value));
        });
        
        // More menu toggle
        $('.section-menu').off('click').on('click', function(e) {
            e.stopPropagation();
            $(this).next('.section-menu-dropdown').toggle();
        });
        
        // Close menu when clicking outside
        $(document).off('click.accordionMenu').on('click.accordionMenu', function() {
            $('.section-menu-dropdown').hide();
        });
        
        // Menu actions
        $('.section-menu-dropdown .menu-item').off('click').on('click', function(e) {
            e.preventDefault();
            const action = $(this).data('action');
            
            if (action === 'locate') {
                // Close settings and go to block list
                window.switchSidebarView('blockList', window.getUpdatedPageData());
                
                // Scroll to accordion section in preview
                setTimeout(() => {
                    const previewFrame = document.getElementById('preview-frame');
                    if (previewFrame && previewFrame.contentWindow) {
                        const accordionSection = previewFrame.contentWindow.document.querySelector('[data-section-id="accordion"]');
                        if (accordionSection) {
                            accordionSection.scrollIntoView({ behavior: 'smooth', block: 'center' });
                            
                            // Add highlight effect
                            accordionSection.style.boxShadow = '0 0 0 3px #2962ff';
                            setTimeout(() => {
                                accordionSection.style.boxShadow = '';
                            }, 2000);
                        }
                    }
                }, 500);
            }
            
            $('.section-menu-dropdown').hide();
        });
        
        // Collapsible functionality
        console.log('[ACCORDION] Setting up collapsible functionality');
        
        // First, remove any existing handlers to prevent duplicates
        $(document).off('click.accordionCollapse');
        
        // Then attach the new handler
        $(document).on('click.accordionCollapse', '.collapsible-header', function(e) {
            e.stopPropagation(); // Prevent propagation to parent elements
            console.log('[ACCORDION] Collapsible header clicked', e.target);
            
            // Don't collapse if clicking on action buttons
            if ($(e.target).closest('.visibility-toggle, .delete-faq-btn, .drag-handle').length > 0) {
                console.log('[ACCORDION] Click on action button, ignoring');
                return;
            }
            
            const targetId = $(this).data('target');
            const $content = $('#' + targetId);
            const $icon = $(this).find('.collapse-icon');
            
            console.log('[ACCORDION] Target ID:', targetId, 'Content found:', $content.length);
            
            if ($content.is(':visible')) {
                console.log('[ACCORDION] Hiding content');
                $content.slideUp(300);
                $icon.css('transform', 'rotate(0deg)');
            } else {
                console.log('[ACCORDION] Showing content');
                $content.slideDown(300);
                $icon.css('transform', 'rotate(180deg)');
            }
        });
        
        // Verify that collapsible headers exist
        setTimeout(() => {
            const headers = $('.collapsible-header');
            console.log('[ACCORDION] Found', headers.length, 'collapsible headers');
            headers.each(function() {
                console.log('[ACCORDION] Header target:', $(this).data('target'));
            });
        }, 100);
        
        // FAQ question input change
        $(document).off('input.faqQuestion').on('input.faqQuestion', '.faq-question-input', function() {
            const itemId = $(this).data('item-id');
            const newValue = $(this).val();
            
            if (window.currentSectionsConfig.accordion && 
                window.currentSectionsConfig.accordion.items && 
                window.currentSectionsConfig.accordion.items[itemId]) {
                window.currentSectionsConfig.accordion.items[itemId].question = newValue;
                window.setHasPendingPageStructureChanges(true);
                window.updateSaveButtonState();
                window.renderPreview();
            }
        });
        
        // FAQ answer input change
        $(document).off('input.faqAnswer').on('input.faqAnswer', '.faq-answer-input', function() {
            const itemId = $(this).data('item-id');
            const newValue = $(this).val();
            
            if (window.currentSectionsConfig.accordion && 
                window.currentSectionsConfig.accordion.items && 
                window.currentSectionsConfig.accordion.items[itemId]) {
                window.currentSectionsConfig.accordion.items[itemId].answer = newValue;
                window.setHasPendingPageStructureChanges(true);
                window.updateSaveButtonState();
                window.renderPreview();
            }
        });
        
        // Delete FAQ item
        $(document).off('click.deleteFaq').on('click.deleteFaq', '.delete-faq-btn', function(e) {
            e.preventDefault();
            e.stopPropagation();
            
            const itemId = $(this).data('item-id');
            
            if (confirm('¿Estás seguro de que quieres eliminar esta pregunta?')) {
                if (window.currentSectionsConfig.accordion && 
                    window.currentSectionsConfig.accordion.items && 
                    window.currentSectionsConfig.accordion.items[itemId]) {
                    
                    // Remove from items
                    delete window.currentSectionsConfig.accordion.items[itemId];
                    
                    // Remove from itemOrder
                    const index = window.currentSectionsConfig.accordion.itemOrder.indexOf(itemId);
                    if (index > -1) {
                        window.currentSectionsConfig.accordion.itemOrder.splice(index, 1);
                    }
                    
                    // Update preview first
                    window.setHasPendingPageStructureChanges(true);
                    window.updateSaveButtonState();
                    window.renderPreview();
                    
                    // Re-render the settings view
                    window.switchSidebarView('accordionSettings', window.currentSectionsConfig.accordion);
                }
            }
        });
        
        // Initialize drag and drop for FAQ items
        // Llamar inmediatamente y también con delay para asegurar que funcione
        window.WebsiteBuilderModules.Accordion.initializeDragAndDrop();
        
        // Reintentar después de un delay mayor por si el DOM no está listo
        setTimeout(() => {
            const $container = $('#accordion-items-container');
            if ($container.length && !$container.hasClass('ui-sortable')) {
                console.log('[ACCORDION] Sortable not initialized, retrying...');
                window.WebsiteBuilderModules.Accordion.initializeDragAndDrop();
            }
            
            // Ensure collapsible headers are clickable
            console.log('[ACCORDION] Setting up collapsible header clicks');
            $('.collapsible-header').each(function() {
                const $header = $(this);
                const targetId = $header.data('target');
                console.log('[ACCORDION] Found header with target:', targetId);
                
                // Remove any existing click handlers
                $header.off('click.accordionToggle');
                
                // Add new click handler
                $header.on('click.accordionToggle', function(e) {
                    e.stopPropagation(); // Prevent propagation
                    console.log('[ACCORDION] Direct click handler triggered');
                    
                    // Don't collapse if clicking on action buttons
                    if ($(e.target).closest('.visibility-toggle, .delete-faq-btn, .drag-handle').length > 0) {
                        console.log('[ACCORDION] Click on action button, ignoring');
                        return;
                    }
                    
                    const $content = $('#' + targetId);
                    const $icon = $(this).find('.collapse-icon');
                    
                    if ($content.is(':visible')) {
                        console.log('[ACCORDION] Hiding content');
                        $content.slideUp(300);
                        $icon.css('transform', 'rotate(0deg)');
                    } else {
                        console.log('[ACCORDION] Showing content');
                        $content.slideDown(300);
                        $icon.css('transform', 'rotate(180deg)');
                    }
                });
            });
        }, 500);
    },
    
    initializeDragAndDrop: function() {
        console.log('[ACCORDION] Initializing drag & drop...');
        
        // Verificar si jQuery UI sortable está disponible
        if (typeof $.fn.sortable !== 'function') {
            console.error('[ACCORDION] jQuery UI sortable not available!');
            return;
        }
        
        setTimeout(() => {
            const $container = $('#accordion-items-container');
            
            if (!$container.length) {
                console.error('[ACCORDION] Container #accordion-items-container not found!');
                return;
            }
            
            // Destroy any existing sortable instance
            if ($container.hasClass('ui-sortable')) {
                $container.sortable('destroy');
                console.log('[ACCORDION] Destroyed existing sortable instance');
            }
            
            // Initialize sortable
            $container.sortable({
                items: '.accordion-faq-item',
                handle: '.drag-handle',
                placeholder: 'sortable-placeholder',
                forcePlaceholderSize: true, // CRÍTICO según documentación
                cursor: 'move',
                tolerance: 'pointer',
                axis: 'y', // Restringir movimiento solo vertical
                containment: 'parent', // Mantener dentro del contenedor
                connectWith: false, // Explicitly prevent connection with parent sortables
                start: function(e, ui) {
                    console.log('[ACCORDION] Drag started for item:', ui.item.data('item-id'));
                    
                    // CRÍTICO: usar outerHeight para incluir bordes y padding
                    ui.placeholder.height(ui.item.outerHeight());
                    ui.placeholder.css({
                        'visibility': 'visible',
                        'background': '#f0f0f0',
                        'border': '2px dashed #2962ff',
                        'border-radius': '8px',
                        'margin-bottom': '15px',
                        'opacity': '0.5'
                    });
                    
                    // Colapsar el contenido si está expandido para evitar problemas visuales
                    const $content = ui.item.find('.collapsible-content');
                    if ($content.is(':visible')) {
                        $content.slideUp(100);
                        ui.item.find('.collapse-icon').css('transform', 'rotate(0deg)');
                    }
                    
                    // Añadir clase para feedback visual
                    ui.item.addClass('dragging');
                },
                stop: function(e, ui) {
                    console.log('[ACCORDION] Drag stopped');
                    
                    // Remover clase de dragging
                    ui.item.removeClass('dragging');
                    
                    // Update itemOrder based on new order
                    const newOrder = [];
                    $container.find('.accordion-faq-item').each(function() {
                        const itemId = $(this).data('item-id');
                        if (itemId) {
                            newOrder.push(itemId);
                        }
                    });
                    
                    console.log('[ACCORDION] New order:', newOrder);
                    
                    if (window.currentSectionsConfig.accordion) {
                        window.currentSectionsConfig.accordion.itemOrder = newOrder;
                        
                        // CRÍTICO: SIEMPRE estas 3 líneas juntas según documentación
                        window.setHasPendingPageStructureChanges(true);
                        window.updateSaveButtonState();
                        window.renderPreview();
                        
                        console.log('[ACCORDION] Configuration updated successfully');
                    }
                }
            });
            
            // Verificar que se inicializó correctamente
            if ($container.hasClass('ui-sortable')) {
                console.log('[ACCORDION] ✓ Drag & drop initialized successfully');
                console.log('[ACCORDION] Found', $container.find('.accordion-faq-item').length, 'sortable items');
                console.log('[ACCORDION] Found', $container.find('.drag-handle').length, 'drag handles');
                
                // Test: agregar evento de mousedown al drag handle para verificar
                $container.find('.drag-handle').on('mousedown', function(e) {
                    console.log('[ACCORDION] Drag handle clicked!', e);
                });
            } else {
                console.error('[ACCORDION] Failed to initialize sortable!');
            }
        }, 300); // Aumentar timeout a 300ms
    },
    
    // Generate icon options for select dropdown (same as multicolumn)
    generateIconOptions: function(selectedIcon) {
        const icons = [
            // General
            { value: 'none', label: 'None', group: 'General' },
            { value: 'settings', label: 'Settings', group: 'General' },
            { value: 'search', label: 'Search', group: 'General' },
            { value: 'visibility', label: 'Eye', group: 'General' },
            { value: 'visibility_off', label: 'Eye slash', group: 'General' },
            { value: 'person', label: 'User', group: 'General' },
            { value: 'favorite_border', label: 'Love outline', group: 'General' },
            { value: 'favorite', label: 'Love solid', group: 'General' },
            { value: 'thumb_up', label: 'Like', group: 'General' },
            { value: 'thumb_down', label: 'Dislike', group: 'General' },
            { value: 'lightbulb', label: 'Lamp', group: 'General' },
            { value: 'star_outline', label: 'Star outline', group: 'General' },
            { value: 'star', label: 'Star solid', group: 'General' },
            { value: 'delete', label: 'Trash', group: 'General' },
            { value: 'description', label: 'Document', group: 'General' },
            { value: 'content_copy', label: 'Copy', group: 'General' },
            { value: 'share', label: 'Share', group: 'General' },
            { value: 'add', label: 'Plus', group: 'General' },
            { value: 'remove', label: 'Minus', group: 'General' },
            { value: 'check', label: 'Checkmark', group: 'General' },
            { value: 'arrow_forward', label: 'Arrow right', group: 'General' },
            { value: 'arrow_back', label: 'Arrow left', group: 'General' },
            { value: 'undo', label: 'Undo', group: 'General' },
            { value: 'redo', label: 'Redo', group: 'General' },
            { value: 'refresh', label: 'Refresh', group: 'General' },
            { value: 'notifications', label: 'Notification', group: 'General' },
            { value: 'schedule', label: 'Clock', group: 'General' },
            { value: 'event', label: 'Calendar', group: 'General' },
            { value: 'info', label: 'Information', group: 'General' },
            { value: 'help', label: 'Help', group: 'General' },
            { value: 'warning', label: 'Warning', group: 'General' },
            
            // Shop
            { value: 'store', label: 'Shop', group: 'Commerce' },
            { value: 'shopping_bag', label: 'Bag', group: 'Commerce' },
            { value: 'shopping_cart', label: 'Cart', group: 'Commerce' },
            { value: 'barcode', label: 'Barcode', group: 'Commerce' },
            { value: 'local_offer', label: 'Coupon', group: 'Commerce' },
            { value: 'card_giftcard', label: 'Gift', group: 'Commerce' },
            { value: 'sell', label: 'Discount outline', group: 'Commerce' },
            { value: 'discount', label: 'Discount solid', group: 'Commerce' },
            { value: 'military_tech', label: 'Medal', group: 'Commerce' },
            { value: 'edit', label: 'Pen and ruler', group: 'Commerce' },
            { value: 'palette', label: 'Color swatch', group: 'Commerce' },
            
            // Shipping
            { value: 'local_shipping', label: 'Shipping', group: 'Shipping' },
            { value: 'inventory_2', label: 'Shipping box', group: 'Shipping' },
            { value: 'location_on', label: 'Address pin', group: 'Shipping' },
            { value: 'speed', label: 'Fast delivery', group: 'Shipping' },
            { value: 'assignment_return', label: 'Easy returns', group: 'Shipping' },
            { value: 'public', label: 'World', group: 'Shipping' },
            { value: 'flight', label: 'Plane', group: 'Shipping' },
            
            // Payment & Security
            { value: 'security', label: 'Payment security', group: 'Payment' },
            { value: 'credit_card', label: 'Credit card', group: 'Payment' },
            { value: 'lock', label: 'Lock', group: 'Payment' },
            { value: 'shield', label: 'Shield', group: 'Payment' },
            { value: 'verified_user', label: 'Secure payment', group: 'Payment' },
            { value: 'account_balance_wallet', label: 'Wallet', group: 'Payment' },
            { value: 'payments', label: 'Cash', group: 'Payment' },
            { value: 'receipt', label: 'Receipt', group: 'Payment' },
            
            // Communication
            { value: 'forum', label: 'Communication', group: 'Communication' },
            { value: 'phone', label: 'Phone', group: 'Communication' },
            { value: 'chat', label: 'Chat', group: 'Communication' },
            { value: 'message', label: 'Message', group: 'Communication' },
            { value: 'email', label: 'Email', group: 'Communication' },
            { value: 'support_agent', label: 'Customer support', group: 'Communication' },
            { value: 'print', label: 'Printer outline', group: 'Communication' }
        ];
        
        let html = '';
        let currentGroup = '';
        
        icons.forEach(icon => {
            // Add optgroup when group changes
            if (icon.group !== currentGroup) {
                if (currentGroup !== '') {
                    html += '</optgroup>';
                }
                html += `<optgroup label="${icon.group}">`;
                currentGroup = icon.group;
            }
            
            html += `<option value="${icon.value}" ${selectedIcon === icon.value ? 'selected' : ''}>${icon.label}</option>`;
        });
        
        // Close last optgroup
        if (currentGroup !== '') {
            html += '</optgroup>';
        }
        
        return html;
    },
    
    initialize: function() {
        // Exponer función global para reinicializar el sortable manualmente si es necesario
        window.reinitializeAccordionSortable = () => {
            console.log('[ACCORDION] Manual reinitialization requested');
            window.WebsiteBuilderModules.Accordion.initializeDragAndDrop();
        };
    }
};