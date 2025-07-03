// Módulo Multicolumn para Website Builder
console.log('[MULTICOLUMN MODULE] Loading multicolumn module...');
window.WebsiteBuilderModules = window.WebsiteBuilderModules || {};
window.WebsiteBuilderModules.Multicolumn = {
    
    // Renderizar la sección en el preview
    render: function(config) {
        console.log('[MULTICOLUMN MODULE] Rendering with config:', config);
        
        if (!config || config.isHidden) {
            return '';
        }
        
        const schemeColors = typeof getColorSchemeValues !== 'undefined' ? 
            getColorSchemeValues(config.config?.colorScheme || 'scheme1') : 
            { background: '#fff', text: '#333', foreground: '#f0f0f0' };
            
        const columns = config.columns || {};
        const columnOrder = config.columnOrder || [];
        
        // Filter visible columns
        const visibleColumns = columnOrder.filter(columnId => 
            columns[columnId] && !columns[columnId].isHidden
        );
        
        if (visibleColumns.length === 0) {
            return '';
        }
        
        // Get translations
        const currentLanguage = window.currentLanguage || 'es';
        const translations = window.translations || {};
        
        // Get configuration values FIRST
        const configData = config.config || {};
        
        // Get typography settings
        const globalSettings = window.currentGlobalThemeSettings || {};
        const headingTypography = globalSettings.typography?.heading || { font: 'roboto', fontSize: 100 };
        const bodyTypography = globalSettings.typography?.body || { font: 'roboto', fontSize: 100 };
        
        // Get font names
        const headingFontFamily = window.getFontNameFromValueSafe ? 
            window.getFontNameFromValueSafe(headingTypography.font) : 
            'Roboto';
        const bodyFontFamily = window.getFontNameFromValueSafe ? 
            window.getFontNameFromValueSafe(bodyTypography.font) : 
            'Roboto';
        
        // Size mappings for heading and body
        const headingSizeMap = {
            'heading1': 72,
            'heading2': 56,
            'heading3': 48,
            'heading4': 36,
            'heading5': 28,
            'heading6': 24,
            'heading7': 20,
            'heading8': 16
        };
        
        const bodySizeMap = {
            'body1': 20,
            'body2': 18,
            'body3': 16,
            'body4': 14,
            'body5': 12
        };
        
        // Calculate font sizes using configData
        const headingBaseFontSize = headingSizeMap[configData.headingSize] || 36;
        const bodyBaseFontSize = bodySizeMap[configData.bodySize] || 16;
        const headingFontSize = Math.round(headingBaseFontSize * (headingTypography.fontSize || 100) / 100);
        const bodyFontSize = Math.round(bodyBaseFontSize * (bodyTypography.fontSize || 100) / 100);
        
        // Column heading and body sizes
        const columnHeadingBaseSize = headingSizeMap[configData.columnsHeadingSize] || 20;
        const columnBodyBaseSize = bodySizeMap[configData.columnsBodySize] || 14;
        const columnHeadingSize = Math.round(columnHeadingBaseSize * (headingTypography.fontSize || 100) / 100);
        const columnBodySize = Math.round(columnBodyBaseSize * (bodyTypography.fontSize || 100) / 100);
        const desktopLayout = configData.desktopLayout || 'grid';
        const desktopCardsPerRow = configData.desktopCardsPerRow || 3;
        const desktopSpaceBetweenCards = configData.desktopSpaceBetweenCards || 24;
        const contentAlignment = configData.contentAlignment || 'center';
        const columnContentAlignment = configData.columnContentAlignment || 'center';
        const width = configData.width || 'large';
        const topPadding = configData.topPadding || 0;
        const bottomPadding = configData.bottomPadding || 0;
        const addSidePaddings = configData.addSidePaddings !== false;
        const colorColumns = configData.colorColumns || false;
        const showArrowsOnHover = configData.showArrowsOnHover !== false;
        const buttonLabel = configData.buttonLabel || '';
        const buttonLink = configData.buttonLink || '';
        const buttonStyle = configData.buttonStyle || 'solid';
        const mobileSpaceBetweenCards = configData.mobileSpaceBetweenCards || 16;
        const containerTopPadding = configData.containerTopPadding || 60;
        const containerBottomPadding = configData.containerBottomPadding || 60;
        const showArrows = configData.showArrows || false;
        
        // Generate columns HTML (AFTER configuration values are defined)
        const columnsHtml = visibleColumns.map((columnId, index) => {
            const column = columns[columnId];
            
            const columnTitle = column.heading || `${translations[currentLanguage]?.['multicolumn.column'] || 'Column'} ${index + 1}`;
            
            return `
                <div class="section-wrapper multicolumn-column" data-section-id="multicolumn-column" data-column-id="${columnId}" style="position: relative;">
                    <div class="section-header-tag">
                        <span class="material-symbols-outlined" style="font-size: 16px;">view_column</span>
                        ${columnTitle}
                    </div>
                    <div style="text-align: ${columnContentAlignment}; padding: ${colorColumns ? '0' : '20px'};">
                        <!-- Icon Section -->
                        <div style="margin-bottom: 24px; height: ${column.iconSize || 48}px; display: flex; justify-content: ${columnContentAlignment === 'left' ? 'flex-start' : columnContentAlignment === 'right' ? 'flex-end' : 'center'}; align-items: center;">
                            ${column.customIcon && column.icon === 'custom' ? 
                                `<img src="${column.customIcon}" alt="Icon" style="max-width: ${column.iconSize || 48}px; max-height: ${column.iconSize || 48}px;">` :
                                column.icon && column.icon !== 'none' && column.icon !== 'custom' ? 
                                    `<i class="material-icons" style="font-size: ${column.iconSize || 48}px; color: ${schemeColors.text};">${column.icon}</i>` :
                                    ''
                            }
                        </div>
                        
                        <div class="column-content" style="color: ${schemeColors.text};">
                            ${column.heading ? `<h3 style="font-family: '${headingFontFamily}', sans-serif; font-size: ${columnHeadingSize}px; margin: 0 0 16px 0; color: ${schemeColors.text}; font-weight: 400;">${column.heading}</h3>` : ''}
                            ${column.body ? `<div style="font-family: '${bodyFontFamily}', sans-serif; margin: 0 0 20px 0; line-height: 1.6; font-size: ${columnBodySize}px; color: ${schemeColors.text};">${column.body}</div>` : ''}
                            ${column.linkLabel ? `
                                <a href="${column.link || '#'}" 
                                   style="color: ${schemeColors.link}; text-decoration: none; font-size: 14px; display: inline-flex; align-items: center; gap: 4px; transition: opacity 0.2s;"
                                   onmouseover="this.style.opacity='0.7'" onmouseout="this.style.opacity='1'">
                                    ${column.linkLabel}
                                    <span class="material-symbols-outlined" style="font-size: 16px;">arrow_forward</span>
                                </a>
                            ` : ''}
                        </div>
                    </div>
                </div>
            `;
        }).join('');
        
        const sectionTitle = translations[currentLanguage]?.['sections.multicolumn'] || 'Multicolumna';
        
        const columnCount = visibleColumns.length;
        
        // Grid columns configuration for desktop
        let gridColumns = '';
        if (desktopLayout === 'grid') {
            const actualColumns = Math.min(desktopCardsPerRow, columnCount);
            gridColumns = `repeat(${actualColumns}, 1fr)`;
        } else {
            // Carousel layout
            gridColumns = 'none'; // Will be handled by flex
        }
        
        // Determine container max width based on width setting
        let containerMaxWidth = '1200px';
        if (width === 'screen') containerMaxWidth = '100%';
        else if (width === 'page') containerMaxWidth = '1600px';
        else if (width === 'medium') containerMaxWidth = '1000px';
        else if (width === 'large') containerMaxWidth = '1200px';
        
        // Generate unique ID for this multicolumn instance
        const uniqueId = 'multicolumn-' + Date.now();
        
        // Mobile layout configuration
        const mobileLayout = config.config?.mobileLayout || '1column';
        let mobileColumns = '1fr';
        
        // Determine mobile columns based on layout and column count
        if (mobileLayout === '1column') {
            mobileColumns = '1fr';
        } else if (mobileLayout === 'carousel' && columnCount >= 2) {
            // Show 1.5 columns for carousel effect
            mobileColumns = 'repeat(auto-fill, minmax(280px, 1fr))';
        }
        
        return `
            <style>
                /* Desktop styles */
                #${uniqueId} .multicolumn-grid {
                    ${desktopLayout === 'grid' ? `
                        display: grid;
                        grid-template-columns: ${gridColumns};
                        gap: ${desktopSpaceBetweenCards}px;
                    ` : `
                        display: flex;
                        gap: ${desktopSpaceBetweenCards}px;
                        overflow-x: auto;
                        scroll-snap-type: x mandatory;
                        -webkit-overflow-scrolling: touch;
                        padding-bottom: 10px;
                    `}
                }
                
                ${desktopLayout === 'carousel' ? `
                    #${uniqueId} .multicolumn-column {
                        flex: 0 0 calc(${100 / desktopCardsPerRow}% - ${desktopSpaceBetweenCards}px);
                        scroll-snap-align: start;
                    }
                    
                    ${(showArrowsOnHover || showArrows) ? `
                        #${uniqueId} .carousel-nav {
                            position: absolute;
                            top: 50%;
                            transform: translateY(-50%);
                            background: rgba(0,0,0,0.5);
                            color: white;
                            border: none;
                            padding: 12px;
                            cursor: pointer;
                            border-radius: 50%;
                            opacity: ${showArrows ? '1' : '0'};
                            transition: opacity 0.3s;
                            z-index: 10;
                        }
                        
                        ${!showArrows && showArrowsOnHover ? `
                            #${uniqueId}:hover .carousel-nav {
                                opacity: 1;
                            }
                        ` : ''}
                        
                        #${uniqueId} .carousel-nav.prev {
                            left: 20px;
                        }
                        
                        #${uniqueId} .carousel-nav.next {
                            right: 20px;
                        }
                    ` : ''}
                ` : ''}
                
                ${colorColumns ? `
                    #${uniqueId} .multicolumn-column {
                        background-color: ${schemeColors.foreground};
                        border-radius: 8px;
                        padding: 24px;
                    }
                ` : ''}
                
                #${uniqueId} .column-content {
                    text-align: ${columnContentAlignment};
                }
                
                #${uniqueId} .multicolumn-column .material-icons {
                    ${columnContentAlignment === 'left' ? 'margin: 0 auto 0 0;' : 
                      columnContentAlignment === 'right' ? 'margin: 0 0 0 auto;' : 
                      'margin: 0 auto;'}
                }
                /* Mobile styles */
                @media (max-width: 768px) {
                    #${uniqueId} .multicolumn-grid {
                        ${mobileLayout === 'carousel' ? `
                            display: flex !important;
                            overflow-x: auto !important;
                            scroll-snap-type: x mandatory !important;
                            -webkit-overflow-scrolling: touch !important;
                            gap: ${mobileSpaceBetweenCards}px !important;
                            padding-bottom: 10px !important;
                        ` : `
                            grid-template-columns: ${mobileColumns} !important;
                            gap: ${mobileSpaceBetweenCards}px !important;
                        `}
                    }
                    
                    ${mobileLayout === 'carousel' ? `
                        #${uniqueId} .multicolumn-column {
                            flex: 0 0 85% !important;
                            scroll-snap-align: start !important;
                        }
                        
                        /* Hide scrollbar but keep functionality */
                        #${uniqueId} .multicolumn-grid::-webkit-scrollbar {
                            height: 6px;
                        }
                        
                        #${uniqueId} .multicolumn-grid::-webkit-scrollbar-track {
                            background: transparent;
                        }
                        
                        #${uniqueId} .multicolumn-grid::-webkit-scrollbar-thumb {
                            background: rgba(0,0,0,0.2);
                            border-radius: 3px;
                        }
                    ` : ''}
                    
                    #${uniqueId} .multicolumn-container {
                        padding: 0 15px !important;
                        ${mobileLayout === 'carousel' ? 'overflow: hidden !important;' : ''}
                    }
                    
                    #${uniqueId} {
                        padding: 30px 0 !important;
                    }
                    
                    #${uniqueId} h2 {
                        font-size: 24px !important;
                        margin-bottom: 15px !important;
                        line-height: 1.3 !important;
                    }
                    
                    #${uniqueId} > div > p {
                        font-size: 14px !important;
                        margin-bottom: 30px !important;
                        padding: 0 10px !important;
                    }
                    
                    #${uniqueId} .multicolumn-column {
                        padding: 15px !important;
                    }
                    
                    #${uniqueId} .multicolumn-column h3 {
                        font-size: 16px !important;
                        margin-bottom: 10px !important;
                    }
                    
                    #${uniqueId} .multicolumn-column .column-content > div {
                        font-size: 13px !important;
                        line-height: 1.5 !important;
                    }
                    
                    /* Icon size adjustment for mobile */
                    #${uniqueId} .multicolumn-column svg {
                        width: 36px !important;
                        height: 36px !important;
                    }
                    
                    /* Section header tag mobile adjustment */
                    #${uniqueId} .section-header-tag {
                        font-size: 11px !important;
                        padding: 2px 6px !important;
                    }
                }
                
                /* Very small mobile devices */
                @media (max-width: 480px) {
                    ${mobileLayout !== 'carousel' ? `
                        #${uniqueId} .multicolumn-grid {
                            grid-template-columns: 1fr !important;
                        }
                    ` : ''}
                    
                    #${uniqueId} h2 {
                        font-size: 20px !important;
                    }
                    
                    #${uniqueId} .multicolumn-container {
                        padding: 0 10px !important;
                    }
                }
            </style>
            <div id="${uniqueId}" class="section-wrapper" data-section-id="multicolumn" style="margin-top: ${parseInt(containerTopPadding) === 1 ? '-1' : containerTopPadding}px; margin-bottom: ${containerBottomPadding}px; background: ${schemeColors.background}; ${desktopLayout === 'carousel' ? 'position: relative; overflow: hidden;' : ''}">
                <div class="section-header-tag">
                    <span class="material-symbols-outlined" style="font-size: 16px;">view_week</span>
                    ${sectionTitle}
                </div>
                <div class="multicolumn-container" style="max-width: ${containerMaxWidth}; margin: 0 auto; padding: ${topPadding}px ${addSidePaddings ? '20px' : '0'} ${bottomPadding}px ${addSidePaddings ? '20px' : '0'}; ${desktopLayout === 'carousel' && showArrows ? 'position: relative;' : ''}">
                    <h2 style="text-align: ${contentAlignment}; font-family: '${headingFontFamily}', sans-serif; font-size: ${headingFontSize}px; margin: 0 0 20px 0; color: ${schemeColors.text}; font-weight: 400;">
                        ${config.config?.heading || 'Multicolumn'}
                    </h2>
                    <p style="text-align: ${contentAlignment}; font-family: '${bodyFontFamily}', sans-serif; font-size: ${bodyFontSize}px; margin: 0 0 50px 0; color: ${schemeColors.text}; max-width: 800px; ${contentAlignment === 'center' ? 'margin-left: auto; margin-right: auto;' : contentAlignment === 'right' ? 'margin-left: auto; margin-right: 0;' : 'margin-left: 0; margin-right: auto;'} line-height: 1.5;">
                        ${config.config?.body || 'Show multiple columns of text paired with images or icons to share useful information about your store: shipping and return conditions, special offers and upcoming sales.'}
                    </p>
                    <div style="position: relative;">
                        ${desktopLayout === 'carousel' && (showArrows || showArrowsOnHover || columnCount > desktopCardsPerRow) ? `
                            <button class="carousel-nav prev ${showArrows ? 'visible' : ''}" onclick="window.scrollMulticolumnCarousel('${uniqueId}', 'prev')" style="${showArrows ? 'opacity: 1;' : ''}">
                                <i class="material-icons">chevron_left</i>
                            </button>
                            <button class="carousel-nav next ${showArrows ? 'visible' : ''}" onclick="window.scrollMulticolumnCarousel('${uniqueId}', 'next')" style="${showArrows ? 'opacity: 1;' : ''}">
                                <i class="material-icons">chevron_right</i>
                            </button>
                        ` : ''}
                        <div class="multicolumn-grid">
                            ${columnsHtml}
                        </div>
                    </div>
                    ${buttonLabel ? `
                        <div style="margin-top: 40px; text-align: ${contentAlignment};">
                            <a href="${buttonLink || '#'}" 
                               style="display: inline-block; padding: 12px 24px; font-size: 14px; text-decoration: none; border-radius: 4px; cursor: pointer; transition: all 0.3s;
                                      ${buttonStyle === 'solid' ? 
                                        `background: ${schemeColors.text}; color: ${schemeColors.background}; border: 2px solid ${schemeColors.text};` : 
                                        `background: transparent; color: ${schemeColors.text}; border: 2px solid ${schemeColors.text};`}">
                                ${buttonLabel}
                            </a>
                        </div>
                    ` : ''}
                </div>
            </div>
        `;
    },
    
    // Renderizar el panel de configuración
    renderSettings: function(config) {
        const multicolumnConfig = config || window.currentSectionsConfig?.multicolumn || {};
        const configData = multicolumnConfig.config || {};
        
        // Default values
        const width = configData.width || 'large';
        const desktopLayout = configData.desktopLayout || 'grid';
        const mobileLayout = configData.mobileLayout || '1column';
        const headingSize = configData.headingSize || 'heading5';
        const bodySize = configData.bodySize || 'body3';
        const contentAlignment = configData.contentAlignment || 'center';
        const columnsHeadingSize = configData.columnsHeadingSize || 'heading7';
        const columnsBodySize = configData.columnsBodySize || 'body4';
        const columnContentAlignment = configData.columnContentAlignment || 'center';
        const desktopCardsPerRow = configData.desktopCardsPerRow || 3;
        const desktopSpaceBetweenCards = configData.desktopSpaceBetweenCards || 24;
        const desktopSpacing = configData.desktopSpacing || 24;
        const mobileSpaceBetweenCards = configData.mobileSpaceBetweenCards || 16;
        const mobileSpacing = configData.mobileSpacing || 24;
        const colorColumns = configData.colorColumns || false;
        const showArrowsOnHover = configData.showArrowsOnHover !== false;
        const buttonLabel = configData.buttonLabel || '';
        const buttonLink = configData.buttonLink || '';
        const buttonStyle = configData.buttonStyle || 'solid';
        const autoplayMode = configData.autoplayMode || 'none';
        const autoplaySpeed = configData.autoplaySpeed || 3;
        const addSidePaddings = configData.addSidePaddings !== false;
        const topPadding = configData.topPadding || 0;
        const bottomPadding = configData.bottomPadding || 0;
        const showArrows = configData.showArrows || false;
        
        return `
            <div style="display: flex; flex-direction: column; height: 100%; position: relative; overflow: hidden;">
                <div class="sidebar-view-header" style="position: relative; z-index: 10;">
                    <button class="back-to-sections-btn">
                        <i class="material-icons">arrow_back</i>
                    </button>
                    <h3 data-i18n="sections.multicolumn">Multicolumn</h3>
                </div>
                
                <!-- Settings Content -->
                <div class="header-settings-content" style="padding: 20px; overflow-y: auto; overflow-x: hidden; flex: 1; height: calc(100% - 60px); box-sizing: border-box;">
                    <!-- Color Scheme -->
                    <div class="settings-field" style="margin-bottom: 16px;">
                        <label style="display: block; margin-bottom: 4px; font-size: 13px; color: #6d7175;">Color scheme</label>
                        <select id="multicolumn-color-scheme" class="shopify-select">
                            <option value="primary" ${configData.colorScheme === 'primary' ? 'selected' : ''}>Primary</option>
                            <option value="scheme1" ${configData.colorScheme === 'scheme1' ? 'selected' : ''}>Scheme 1</option>
                            <option value="scheme2" ${configData.colorScheme === 'scheme2' ? 'selected' : ''}>Scheme 2</option>
                            <option value="scheme3" ${configData.colorScheme === 'scheme3' ? 'selected' : ''}>Scheme 3</option>
                            <option value="scheme4" ${configData.colorScheme === 'scheme4' ? 'selected' : ''}>Scheme 4</option>
                            <option value="scheme5" ${configData.colorScheme === 'scheme5' ? 'selected' : ''}>Scheme 5</option>
                        </select>
                        <a href="#" style="font-size: 12px; color: #005bd3; text-decoration: none; margin-top: 4px; display: inline-block;">Learn about color schemes</a>
                    </div>
                    
                    <!-- Width -->
                    <div class="settings-field" style="margin-bottom: 16px;">
                        <label style="display: block; margin-bottom: 4px; font-size: 13px; color: #6d7175;">Width</label>
                        <select id="multicolumn-width" class="shopify-select">
                            <option value="screen" ${width === 'screen' ? 'selected' : ''}>Screen</option>
                            <option value="page" ${width === 'page' ? 'selected' : ''}>Page</option>
                            <option value="large" ${width === 'large' ? 'selected' : ''}>Large</option>
                            <option value="medium" ${width === 'medium' ? 'selected' : ''}>Medium</option>
                        </select>
                    </div>
                    
                    <!-- Desktop Layout -->
                    <div class="settings-field" style="margin-bottom: 16px;">
                        <label style="display: block; margin-bottom: 4px; font-size: 13px; color: #6d7175;">Desktop layout</label>
                        <select id="multicolumn-desktop-layout" class="shopify-select">
                            <option value="grid" ${desktopLayout === 'grid' ? 'selected' : ''}>Grid</option>
                            <option value="carousel" ${desktopLayout === 'carousel' ? 'selected' : ''}>Carousel</option>
                        </select>
                    </div>
                    
                    <!-- Mobile Layout -->
                    <div class="settings-field" style="margin-bottom: 20px;">
                        <label style="display: block; margin-bottom: 4px; font-size: 13px; color: #6d7175;">Mobile layout</label>
                        <select id="multicolumn-mobile-layout" class="shopify-select">
                            <option value="carousel" ${mobileLayout === 'carousel' ? 'selected' : ''}>Carousel</option>
                            <option value="1column" ${mobileLayout === '1column' ? 'selected' : ''}>1 column</option>
                            <option value="slideshow" ${mobileLayout === 'slideshow' ? 'selected' : ''}>Slideshow</option>
                        </select>
                    </div>
                    
                    <!-- Content Section -->
                    <div style="border-top: 1px solid #e3e3e3; padding-top: 20px; margin-bottom: 20px;">
                        <h4 style="font-size: 14px; font-weight: 600; margin-bottom: 16px;">Content</h4>
                        
                        <!-- Heading -->
                        <div class="settings-field" style="margin-bottom: 16px;">
                            <label style="display: block; margin-bottom: 4px; font-size: 13px; color: #6d7175;">Heading</label>
                            <div style="position: relative;">
                                <input type="text" id="multicolumn-heading" value="${configData.heading || ''}" 
                                    style="width: 100%; padding-right: 36px;" class="shopify-input">
                                <button style="position: absolute; right: 8px; top: 50%; transform: translateY(-50%); 
                                    background: none; border: none; cursor: pointer; padding: 4px;">
                                    <i class="material-icons" style="font-size: 20px; color: #6d7175;">folder_open</i>
                                </button>
                            </div>
                        </div>
                        
                        <!-- Body -->
                        <div class="settings-field" style="margin-bottom: 16px;">
                            <label style="display: block; margin-bottom: 4px; font-size: 13px; color: #6d7175;">Body</label>
                            <div style="border: 1px solid #c9cccf; border-radius: 3px;">
                                <div style="border-bottom: 1px solid #e3e3e3; padding: 8px; display: flex; gap: 4px; background: #f6f6f7;">
                                    <button class="text-editor-btn" data-action="bold" style="padding: 4px 8px; background: none; border: none; cursor: pointer;">
                                        <i class="material-icons" style="font-size: 18px;">format_bold</i>
                                    </button>
                                    <button class="text-editor-btn" data-action="italic" style="padding: 4px 8px; background: none; border: none; cursor: pointer;">
                                        <i class="material-icons" style="font-size: 18px;">format_italic</i>
                                    </button>
                                    <button class="text-editor-btn" data-action="link" style="padding: 4px 8px; background: none; border: none; cursor: pointer;">
                                        <i class="material-icons" style="font-size: 18px;">link</i>
                                    </button>
                                </div>
                                <textarea id="multicolumn-body" rows="4" class="shopify-textarea" 
                                    style="border: none; width: 100%; resize: vertical;">${configData.body || ''}</textarea>
                            </div>
                        </div>
                        
                        <!-- Heading Size -->
                        <div class="settings-field" style="margin-bottom: 16px;">
                            <label style="display: block; margin-bottom: 4px; font-size: 13px; color: #6d7175;">Heading size</label>
                            <select id="multicolumn-heading-size" class="shopify-select">
                                <option value="heading3" ${headingSize === 'heading3' ? 'selected' : ''}>Heading 3</option>
                                <option value="heading4" ${headingSize === 'heading4' ? 'selected' : ''}>Heading 4</option>
                                <option value="heading5" ${headingSize === 'heading5' ? 'selected' : ''}>Heading 5</option>
                                <option value="heading6" ${headingSize === 'heading6' ? 'selected' : ''}>Heading 6</option>
                                <option value="heading7" ${headingSize === 'heading7' ? 'selected' : ''}>Heading 7</option>
                            </select>
                        </div>
                        
                        <!-- Body Size -->
                        <div class="settings-field" style="margin-bottom: 16px;">
                            <label style="display: block; margin-bottom: 4px; font-size: 13px; color: #6d7175;">Body size</label>
                            <select id="multicolumn-body-size" class="shopify-select">
                                <option value="body1" ${bodySize === 'body1' ? 'selected' : ''}>Body 1</option>
                                <option value="body2" ${bodySize === 'body2' ? 'selected' : ''}>Body 2</option>
                                <option value="body3" ${bodySize === 'body3' ? 'selected' : ''}>Body 3</option>
                                <option value="body4" ${bodySize === 'body4' ? 'selected' : ''}>Body 4</option>
                                <option value="body5" ${bodySize === 'body5' ? 'selected' : ''}>Body 5</option>
                            </select>
                        </div>
                        
                        <!-- Content Alignment -->
                        <div class="settings-field" style="margin-bottom: 20px;">
                            <label style="display: block; margin-bottom: 8px; font-size: 13px; color: #6d7175;">Content alignment</label>
                            <div style="display: flex; border: 1px solid #c9cccf; border-radius: 3px; overflow: hidden;">
                                <button class="alignment-btn ${contentAlignment === 'left' ? 'active' : ''}" data-align="left" 
                                    style="flex: 1; padding: 8px; background: ${contentAlignment === 'left' ? '#005bd3' : '#fff'}; 
                                    color: ${contentAlignment === 'left' ? '#fff' : '#202223'}; border: none; cursor: pointer;">
                                    <i class="material-icons" style="font-size: 20px;">format_align_left</i>
                                </button>
                                <button class="alignment-btn ${contentAlignment === 'center' ? 'active' : ''}" data-align="center" 
                                    style="flex: 1; padding: 8px; background: ${contentAlignment === 'center' ? '#005bd3' : '#fff'}; 
                                    color: ${contentAlignment === 'center' ? '#fff' : '#202223'}; border: none; border-left: 1px solid #c9cccf; 
                                    border-right: 1px solid #c9cccf; cursor: pointer;">
                                    <i class="material-icons" style="font-size: 20px;">format_align_center</i>
                                </button>
                                <button class="alignment-btn ${contentAlignment === 'right' ? 'active' : ''}" data-align="right" 
                                    style="flex: 1; padding: 8px; background: ${contentAlignment === 'right' ? '#005bd3' : '#fff'}; 
                                    color: ${contentAlignment === 'right' ? '#fff' : '#202223'}; border: none; cursor: pointer;">
                                    <i class="material-icons" style="font-size: 20px;">format_align_right</i>
                                </button>
                            </div>
                        </div>
                    </div>
                    
                    <!-- Columns Section -->
                    <div style="border-top: 1px solid #e3e3e3; padding-top: 20px; margin-bottom: 20px;">
                        <h4 style="font-size: 14px; font-weight: 600; margin-bottom: 16px;">Columns</h4>
                        
                        <!-- Columns Heading Size -->
                        <div class="settings-field" style="margin-bottom: 16px;">
                            <label style="display: block; margin-bottom: 4px; font-size: 13px; color: #6d7175;">Heading size</label>
                            <select id="multicolumn-columns-heading-size" class="shopify-select">
                                <option value="heading5" ${columnsHeadingSize === 'heading5' ? 'selected' : ''}>Heading 5</option>
                                <option value="heading6" ${columnsHeadingSize === 'heading6' ? 'selected' : ''}>Heading 6</option>
                                <option value="heading7" ${columnsHeadingSize === 'heading7' ? 'selected' : ''}>Heading 7</option>
                                <option value="heading8" ${columnsHeadingSize === 'heading8' ? 'selected' : ''}>Heading 8</option>
                            </select>
                        </div>
                        
                        <!-- Columns Body Size -->
                        <div class="settings-field" style="margin-bottom: 16px;">
                            <label style="display: block; margin-bottom: 4px; font-size: 13px; color: #6d7175;">Body size</label>
                            <select id="multicolumn-columns-body-size" class="shopify-select">
                                <option value="body2" ${columnsBodySize === 'body2' ? 'selected' : ''}>Body 2</option>
                                <option value="body3" ${columnsBodySize === 'body3' ? 'selected' : ''}>Body 3</option>
                                <option value="body4" ${columnsBodySize === 'body4' ? 'selected' : ''}>Body 4</option>
                                <option value="body5" ${columnsBodySize === 'body5' ? 'selected' : ''}>Body 5</option>
                            </select>
                            <p style="font-size: 12px; color: #6d7175; margin-top: 4px;">For 'Paragraph' body text formatting</p>
                        </div>
                        
                        <!-- Column Content Alignment -->
                        <div class="settings-field" style="margin-bottom: 16px;">
                            <label style="display: block; margin-bottom: 8px; font-size: 13px; color: #6d7175;">Column content alignment</label>
                            <div style="display: flex; border: 1px solid #c9cccf; border-radius: 3px; overflow: hidden;">
                                <button class="column-alignment-btn ${columnContentAlignment === 'left' ? 'active' : ''}" data-align="left" 
                                    style="flex: 1; padding: 8px; background: ${columnContentAlignment === 'left' ? '#005bd3' : '#fff'}; 
                                    color: ${columnContentAlignment === 'left' ? '#fff' : '#202223'}; border: none; cursor: pointer;">
                                    <i class="material-icons" style="font-size: 20px;">format_align_left</i>
                                </button>
                                <button class="column-alignment-btn ${columnContentAlignment === 'center' ? 'active' : ''}" data-align="center" 
                                    style="flex: 1; padding: 8px; background: ${columnContentAlignment === 'center' ? '#005bd3' : '#fff'}; 
                                    color: ${columnContentAlignment === 'center' ? '#fff' : '#202223'}; border: none; border-left: 1px solid #c9cccf; 
                                    border-right: 1px solid #c9cccf; cursor: pointer;">
                                    <i class="material-icons" style="font-size: 20px;">format_align_center</i>
                                </button>
                                <button class="column-alignment-btn ${columnContentAlignment === 'right' ? 'active' : ''}" data-align="right" 
                                    style="flex: 1; padding: 8px; background: ${columnContentAlignment === 'right' ? '#005bd3' : '#fff'}; 
                                    color: ${columnContentAlignment === 'right' ? '#fff' : '#202223'}; border: none; cursor: pointer;">
                                    <i class="material-icons" style="font-size: 20px;">format_align_right</i>
                                </button>
                            </div>
                        </div>
                        
                        <!-- Desktop Cards Per Row -->
                        <div class="settings-field" style="margin-bottom: 16px;">
                            <label style="display: block; margin-bottom: 8px; font-size: 13px; color: #6d7175;">
                                Desktop cards per row
                            </label>
                            <div style="display: flex; align-items: center; gap: 12px;">
                                <input type="range" id="desktop-cards-per-row" min="1" max="6" value="${desktopCardsPerRow}" 
                                    style="flex: 1;" class="shopify-range">
                                <input type="number" id="desktop-cards-per-row-value" value="${desktopCardsPerRow}" min="1" max="6" 
                                    style="width: 60px;" class="shopify-input">
                            </div>
                        </div>
                        
                        <!-- Desktop Space Between Cards -->
                        <div class="settings-field" style="margin-bottom: 20px;">
                            <label style="display: block; margin-bottom: 8px; font-size: 13px; color: #6d7175;">
                                Desktop space between cards
                            </label>
                            <div style="display: flex; align-items: center; gap: 12px;">
                                <input type="range" id="desktop-space-between-cards" min="0" max="60" value="${desktopSpaceBetweenCards}" 
                                    style="flex: 1;" class="shopify-range">
                                <div style="display: flex; align-items: center; gap: 4px;">
                                    <input type="number" id="desktop-space-between-cards-value" value="${desktopSpaceBetweenCards}" 
                                        min="0" max="60" style="width: 60px;" class="shopify-input">
                                    <span style="font-size: 13px; color: #6d7175;">px</span>
                                </div>
                            </div>
                        </div>
                    </div>
                    
                    <!-- Spacing Section -->
                    <div style="border-top: 1px solid #e3e3e3; padding-top: 20px; margin-bottom: 20px;">
                        <!-- Desktop Spacing -->
                        <div class="settings-field" style="margin-bottom: 16px;">
                            <label style="display: block; margin-bottom: 8px; font-size: 13px; color: #6d7175;">Desktop spacing</label>
                            <div style="display: flex; align-items: center; gap: 12px;">
                                <input type="range" id="desktop-spacing" min="0" max="60" value="${desktopSpacing}" 
                                    style="flex: 1;" class="shopify-range">
                                <div style="display: flex; align-items: center; gap: 4px;">
                                    <input type="number" id="desktop-spacing-value" value="${desktopSpacing}" 
                                        min="0" max="60" style="width: 60px;" class="shopify-input">
                                    <span style="font-size: 13px; color: #6d7175;">px</span>
                                </div>
                            </div>
                        </div>
                        
                        <!-- Mobile Space Between Cards -->
                        <div class="settings-field" style="margin-bottom: 16px;">
                            <label style="display: block; margin-bottom: 8px; font-size: 13px; color: #6d7175;">Mobile space between cards</label>
                            <div style="display: flex; align-items: center; gap: 12px;">
                                <input type="range" id="mobile-space-between-cards" min="0" max="40" value="${mobileSpaceBetweenCards}" 
                                    style="flex: 1;" class="shopify-range">
                                <div style="display: flex; align-items: center; gap: 4px;">
                                    <input type="number" id="mobile-space-between-cards-value" value="${mobileSpaceBetweenCards}" 
                                        min="0" max="40" style="width: 60px;" class="shopify-input">
                                    <span style="font-size: 13px; color: #6d7175;">px</span>
                                </div>
                            </div>
                        </div>
                        
                        <!-- Mobile Spacing -->
                        <div class="settings-field" style="margin-bottom: 16px;">
                            <label style="display: block; margin-bottom: 8px; font-size: 13px; color: #6d7175;">Mobile spacing</label>
                            <div style="display: flex; align-items: center; gap: 12px;">
                                <input type="range" id="mobile-spacing" min="0" max="40" value="${mobileSpacing}" 
                                    style="flex: 1;" class="shopify-range">
                                <div style="display: flex; align-items: center; gap: 4px;">
                                    <input type="number" id="mobile-spacing-value" value="${mobileSpacing}" 
                                        min="0" max="40" style="width: 60px;" class="shopify-input">
                                    <span style="font-size: 13px; color: #6d7175;">px</span>
                                </div>
                            </div>
                        </div>
                        
                        <!-- Color Columns -->
                        <div class="settings-field" style="margin-bottom: 16px;">
                            <label class="toggle-field" style="display: flex; align-items: center; justify-content: space-between;">
                                <span style="font-size: 13px; color: #202223;">Color columns</span>
                                <input type="checkbox" id="color-columns" class="shopify-toggle" ${colorColumns ? 'checked' : ''}>
                                <label for="color-columns" class="toggle-slider"></label>
                            </label>
                        </div>
                        
                        <!-- Show Arrows on Hover -->
                        <div class="settings-field" style="margin-bottom: 16px;">
                            <label class="toggle-field" style="display: flex; align-items: center; justify-content: space-between;">
                                <span style="font-size: 13px; color: #202223;">Show arrows on hover</span>
                                <input type="checkbox" id="show-arrows-on-hover" class="shopify-toggle" ${showArrowsOnHover ? 'checked' : ''}>
                                <label for="show-arrows-on-hover" class="toggle-slider"></label>
                            </label>
                        </div>
                        
                        <!-- Show Arrows (Always Visible) -->
                        <div class="settings-field" style="margin-bottom: 20px;">
                            <label class="toggle-field" style="display: flex; align-items: center; justify-content: space-between;">
                                <span style="font-size: 13px; color: #202223;">Show arrows</span>
                                <input type="checkbox" id="show-arrows" class="shopify-toggle" ${showArrows ? 'checked' : ''}>
                                <label for="show-arrows" class="toggle-slider"></label>
                            </label>
                        </div>
                    </div>
                    
                    <!-- Button Section -->
                    <div style="border-top: 1px solid #e3e3e3; padding-top: 20px; margin-bottom: 20px;">
                        <h4 style="font-size: 14px; font-weight: 600; margin-bottom: 16px;">Button</h4>
                        
                        <!-- Button Label -->
                        <div class="settings-field" style="margin-bottom: 16px;">
                            <label style="display: block; margin-bottom: 4px; font-size: 13px; color: #6d7175;">Button label</label>
                            <div style="position: relative;">
                                <input type="text" id="button-label" value="${buttonLabel}" 
                                    style="width: 100%; padding-right: 36px;" class="shopify-input">
                                <button style="position: absolute; right: 8px; top: 50%; transform: translateY(-50%); 
                                    background: none; border: none; cursor: pointer; padding: 4px;">
                                    <i class="material-icons" style="font-size: 20px; color: #6d7175;">folder_open</i>
                                </button>
                            </div>
                        </div>
                        
                        <!-- Button Link -->
                        <div class="settings-field" style="margin-bottom: 16px;">
                            <label style="display: block; margin-bottom: 4px; font-size: 13px; color: #6d7175;">Button link</label>
                            <div style="position: relative;">
                                <input type="text" id="button-link" value="${buttonLink}" 
                                    placeholder="Pega un enlace o busca" 
                                    style="width: 100%; padding-right: 36px;" class="shopify-input">
                                <button style="position: absolute; right: 8px; top: 50%; transform: translateY(-50%); 
                                    background: none; border: none; cursor: pointer; padding: 4px;">
                                    <i class="material-icons" style="font-size: 20px; color: #6d7175;">folder_open</i>
                                </button>
                            </div>
                        </div>
                        
                        <!-- Button Style -->
                        <div class="settings-field" style="margin-bottom: 20px;">
                            <label style="display: block; margin-bottom: 4px; font-size: 13px; color: #6d7175;">Button style</label>
                            <select id="multicolumn-button-style" class="shopify-select">
                                <option value="solid" ${buttonStyle === 'solid' ? 'selected' : ''}>Solid</option>
                                <option value="outline" ${buttonStyle === 'outline' ? 'selected' : ''}>Outline</option>
                            </select>
                        </div>
                    </div>
                    
                    <!-- Autoplay Section -->
                    <div style="border-top: 1px solid #e3e3e3; padding-top: 20px; margin-bottom: 20px;">
                        <h4 style="font-size: 14px; font-weight: 600; margin-bottom: 16px;">Autoplay</h4>
                        
                        <!-- Autoplay Mode -->
                        <div class="settings-field" style="margin-bottom: 16px;">
                            <label style="display: block; margin-bottom: 4px; font-size: 13px; color: #6d7175;">Autoplay mode</label>
                            <select id="autoplay-mode" class="shopify-select">
                                <option value="none" ${autoplayMode === 'none' ? 'selected' : ''}>None</option>
                                <option value="auto" ${autoplayMode === 'auto' ? 'selected' : ''}>Auto</option>
                                <option value="manual" ${autoplayMode === 'manual' ? 'selected' : ''}>Manual</option>
                            </select>
                        </div>
                        
                        <!-- Autoplay Speed -->
                        <div class="settings-field" style="margin-bottom: 20px;">
                            <label style="display: block; margin-bottom: 8px; font-size: 13px; color: #6d7175;">Autoplay speed</label>
                            <div style="display: flex; align-items: center; gap: 12px;">
                                <input type="range" id="autoplay-speed" min="1" max="10" value="${autoplaySpeed}" 
                                    style="flex: 1;" class="shopify-range">
                                <div style="display: flex; align-items: center; gap: 4px;">
                                    <input type="number" id="autoplay-speed-value" value="${autoplaySpeed}" 
                                        min="1" max="10" style="width: 60px;" class="shopify-input">
                                    <span style="font-size: 13px; color: #6d7175;">s</span>
                                </div>
                            </div>
                        </div>
                    </div>
                    
                    <!-- Paddings Section -->
                    <div style="border-top: 1px solid #e3e3e3; padding-top: 20px; margin-bottom: 20px;">
                        <h4 style="font-size: 14px; font-weight: 600; margin-bottom: 16px;">Paddings</h4>
                        
                        <!-- Add Side Paddings -->
                        <div class="settings-field" style="margin-bottom: 16px;">
                            <label class="toggle-field" style="display: flex; align-items: center; justify-content: space-between;">
                                <span style="font-size: 13px; color: #202223;">Add side paddings</span>
                                <input type="checkbox" id="add-side-paddings" class="shopify-toggle" ${addSidePaddings ? 'checked' : ''}>
                                <label for="add-side-paddings" class="toggle-slider"></label>
                            </label>
                        </div>
                        
                        <!-- Top Padding -->
                        <div class="settings-field" style="margin-bottom: 16px;">
                            <label style="display: block; margin-bottom: 8px; font-size: 13px; color: #6d7175;">Top padding</label>
                            <div style="display: flex; align-items: center; gap: 12px;">
                                <input type="range" id="top-padding" min="0" max="100" value="${topPadding}" 
                                    style="flex: 1;" class="shopify-range">
                                <div style="display: flex; align-items: center; gap: 4px;">
                                    <input type="number" id="top-padding-value" value="${topPadding}" 
                                        min="0" max="100" style="width: 60px;" class="shopify-input">
                                    <span style="font-size: 13px; color: #6d7175;">px</span>
                                </div>
                            </div>
                        </div>
                        
                        <!-- Bottom Padding -->
                        <div class="settings-field">
                            <label style="display: block; margin-bottom: 8px; font-size: 13px; color: #6d7175;">Bottom padding</label>
                            <div style="display: flex; align-items: center; gap: 12px;">
                                <input type="range" id="bottom-padding" min="0" max="100" value="${bottomPadding}" 
                                    style="flex: 1;" class="shopify-range">
                                <div style="display: flex; align-items: center; gap: 4px;">
                                    <input type="number" id="bottom-padding-value" value="${bottomPadding}" 
                                        min="0" max="100" style="width: 60px;" class="shopify-input">
                                    <span style="font-size: 13px; color: #6d7175;">px</span>
                                </div>
                            </div>
                        </div>
                    </div>
                    
                    <!-- Container Padding Section -->
                    <div style="border-top: 1px solid #e3e3e3; padding-top: 20px; margin-bottom: 40px;">
                        <h4 style="font-size: 14px; font-weight: 600; margin-bottom: 16px;">Container padding</h4>
                        
                        <!-- Container Top Padding -->
                        <div class="settings-field" style="margin-bottom: 16px;">
                            <label style="display: block; margin-bottom: 8px; font-size: 13px; color: #6d7175;">Container top padding</label>
                            <div style="display: flex; align-items: center; gap: 12px;">
                                <input type="range" id="container-top-padding" min="0" max="100" value="${configData.containerTopPadding || 60}" 
                                    style="flex: 1;" class="shopify-range">
                                <div style="display: flex; align-items: center; gap: 4px;">
                                    <input type="number" id="container-top-padding-value" value="${configData.containerTopPadding || 60}" 
                                        min="0" max="100" style="width: 60px;" class="shopify-input">
                                    <span style="font-size: 13px; color: #6d7175;">px</span>
                                </div>
                            </div>
                        </div>
                        
                        <!-- Container Bottom Padding -->
                        <div class="settings-field">
                            <label style="display: block; margin-bottom: 8px; font-size: 13px; color: #6d7175;">Container bottom padding</label>
                            <div style="display: flex; align-items: center; gap: 12px;">
                                <input type="range" id="container-bottom-padding" min="0" max="100" value="${configData.containerBottomPadding || 60}" 
                                    style="flex: 1;" class="shopify-range">
                                <div style="display: flex; align-items: center; gap: 4px;">
                                    <input type="number" id="container-bottom-padding-value" value="${configData.containerBottomPadding || 60}" 
                                        min="0" max="100" style="width: 60px;" class="shopify-input">
                                    <span style="font-size: 13px; color: #6d7175;">px</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `;
    },
    
    // Adjuntar event listeners
    attachEventListeners: function() {
        const self = this;
        
        // Helper function to update config
        const updateConfig = (key, value) => {
            if (window.currentSectionsConfig.multicolumn && window.currentSectionsConfig.multicolumn.config) {
                window.currentSectionsConfig.multicolumn.config[key] = value;
                window.setHasPendingPageStructureChanges(true);
                window.updateSaveButtonState();
                window.renderPreview();
            }
        };
        
        // Color scheme
        $('#multicolumn-color-scheme').on('change', function() {
            updateConfig('colorScheme', $(this).val());
        });
        
        // Width
        $('#multicolumn-width').on('change', function() {
            updateConfig('width', $(this).val());
        });
        
        // Desktop layout
        $('#multicolumn-desktop-layout').on('change', function() {
            updateConfig('desktopLayout', $(this).val());
        });
        
        // Mobile layout
        $('#multicolumn-mobile-layout').on('change', function() {
            updateConfig('mobileLayout', $(this).val());
        });
        
        // Content heading
        $('#multicolumn-heading').on('input', function() {
            updateConfig('heading', $(this).val());
        });
        
        // Content body
        $('#multicolumn-body').on('input', function() {
            updateConfig('body', $(this).val());
        });
        
        // Heading size
        $('#multicolumn-heading-size').on('change', function() {
            updateConfig('headingSize', $(this).val());
        });
        
        // Body size
        $('#multicolumn-body-size').on('change', function() {
            updateConfig('bodySize', $(this).val());
        });
        
        // Content alignment buttons
        $('.alignment-btn').on('click', function() {
            const align = $(this).data('align');
            $('.alignment-btn').removeClass('active').css({
                'background': '#fff',
                'color': '#202223'
            });
            $(this).addClass('active').css({
                'background': '#005bd3',
                'color': '#fff'
            });
            updateConfig('contentAlignment', align);
        });
        
        // Columns heading size
        $('#multicolumn-columns-heading-size').on('change', function() {
            updateConfig('columnsHeadingSize', $(this).val());
        });
        
        // Columns body size
        $('#multicolumn-columns-body-size').on('change', function() {
            updateConfig('columnsBodySize', $(this).val());
        });
        
        // Column content alignment buttons
        $('.column-alignment-btn').on('click', function() {
            const align = $(this).data('align');
            $('.column-alignment-btn').removeClass('active').css({
                'background': '#fff',
                'color': '#202223'
            });
            $(this).addClass('active').css({
                'background': '#005bd3',
                'color': '#fff'
            });
            updateConfig('columnContentAlignment', align);
        });
        
        // Desktop cards per row - slider
        $('#desktop-cards-per-row').on('input', function() {
            const value = $(this).val();
            $('#desktop-cards-per-row-value').val(value);
            updateConfig('desktopCardsPerRow', parseInt(value));
        });
        
        // Desktop cards per row - input
        $('#desktop-cards-per-row-value').on('change', function() {
            const value = $(this).val();
            $('#desktop-cards-per-row').val(value);
            updateConfig('desktopCardsPerRow', parseInt(value));
        });
        
        // Desktop space between cards - slider
        $('#desktop-space-between-cards').on('input', function() {
            const value = $(this).val();
            $('#desktop-space-between-cards-value').val(value);
            updateConfig('desktopSpaceBetweenCards', parseInt(value));
        });
        
        // Desktop space between cards - input
        $('#desktop-space-between-cards-value').on('change', function() {
            const value = $(this).val();
            $('#desktop-space-between-cards').val(value);
            updateConfig('desktopSpaceBetweenCards', parseInt(value));
        });
        
        // Desktop spacing - slider
        $('#desktop-spacing').on('input', function() {
            const value = $(this).val();
            $('#desktop-spacing-value').val(value);
            updateConfig('desktopSpacing', parseInt(value));
        });
        
        // Desktop spacing - input
        $('#desktop-spacing-value').on('change', function() {
            const value = $(this).val();
            $('#desktop-spacing').val(value);
            updateConfig('desktopSpacing', parseInt(value));
        });
        
        // Mobile space between cards - slider
        $('#mobile-space-between-cards').on('input', function() {
            const value = $(this).val();
            $('#mobile-space-between-cards-value').val(value);
            updateConfig('mobileSpaceBetweenCards', parseInt(value));
        });
        
        // Mobile space between cards - input
        $('#mobile-space-between-cards-value').on('change', function() {
            const value = $(this).val();
            $('#mobile-space-between-cards').val(value);
            updateConfig('mobileSpaceBetweenCards', parseInt(value));
        });
        
        // Mobile spacing - slider
        $('#mobile-spacing').on('input', function() {
            const value = $(this).val();
            $('#mobile-spacing-value').val(value);
            updateConfig('mobileSpacing', parseInt(value));
        });
        
        // Mobile spacing - input
        $('#mobile-spacing-value').on('change', function() {
            const value = $(this).val();
            $('#mobile-spacing').val(value);
            updateConfig('mobileSpacing', parseInt(value));
        });
        
        // Color columns toggle
        $('#color-columns').on('change', function() {
            updateConfig('colorColumns', $(this).is(':checked'));
        });
        
        // Show arrows on hover toggle
        $('#show-arrows-on-hover').on('change', function() {
            updateConfig('showArrowsOnHover', $(this).is(':checked'));
        });
        
        // Button label
        $('#button-label').on('input', function() {
            updateConfig('buttonLabel', $(this).val());
        });
        
        // Button link
        $('#button-link').on('input', function() {
            updateConfig('buttonLink', $(this).val());
        });
        
        // Button style
        $('#multicolumn-button-style').on('change', function() {
            updateConfig('buttonStyle', $(this).val());
        });
        
        // Autoplay mode
        $('#autoplay-mode').on('change', function() {
            updateConfig('autoplayMode', $(this).val());
        });
        
        // Autoplay speed - slider
        $('#autoplay-speed').on('input', function() {
            const value = $(this).val();
            $('#autoplay-speed-value').val(value);
            updateConfig('autoplaySpeed', parseInt(value));
        });
        
        // Autoplay speed - input
        $('#autoplay-speed-value').on('change', function() {
            const value = $(this).val();
            $('#autoplay-speed').val(value);
            updateConfig('autoplaySpeed', parseInt(value));
        });
        
        // Add side paddings toggle
        $('#add-side-paddings').on('change', function() {
            updateConfig('addSidePaddings', $(this).is(':checked'));
        });
        
        // Top padding - slider
        $('#top-padding').on('input', function() {
            const value = $(this).val();
            $('#top-padding-value').val(value);
            updateConfig('topPadding', parseInt(value));
        });
        
        // Top padding - input
        $('#top-padding-value').on('change', function() {
            const value = $(this).val();
            $('#top-padding').val(value);
            updateConfig('topPadding', parseInt(value));
        });
        
        // Bottom padding - slider
        $('#bottom-padding').on('input', function() {
            const value = $(this).val();
            $('#bottom-padding-value').val(value);
            updateConfig('bottomPadding', parseInt(value));
        });
        
        // Bottom padding - input
        $('#bottom-padding-value').on('change', function() {
            const value = $(this).val();
            $('#bottom-padding').val(value);
            updateConfig('bottomPadding', parseInt(value));
        });
        
        // Container top padding - slider
        $('#container-top-padding').on('input', function() {
            const value = $(this).val();
            $('#container-top-padding-value').val(value);
            updateConfig('containerTopPadding', parseInt(value));
        });
        
        // Container top padding - input
        $('#container-top-padding-value').on('change', function() {
            const value = $(this).val();
            $('#container-top-padding').val(value);
            updateConfig('containerTopPadding', parseInt(value));
        });
        
        // Container bottom padding - slider
        $('#container-bottom-padding').on('input', function() {
            const value = $(this).val();
            $('#container-bottom-padding-value').val(value);
            updateConfig('containerBottomPadding', parseInt(value));
        });
        
        // Container bottom padding - input
        $('#container-bottom-padding-value').on('change', function() {
            const value = $(this).val();
            $('#container-bottom-padding').val(value);
            updateConfig('containerBottomPadding', parseInt(value));
        });
        
        // Show arrows toggle
        $('#show-arrows').on('change', function() {
            updateConfig('showArrows', $(this).is(':checked'));
        });
        
        // Back button handler
        $('.back-to-sections-btn').off('click').on('click', function() {
            window.switchSidebarView('blockList');
        });
        
        // CSS styles are already loaded from website-builder.css
    },
    
    // Renderizar configuración de columna individual
    renderColumnSettings: function(data) {
        console.log('[MULTICOLUMN] renderColumnSettings called with data:', data);
        
        // Verificar datos de entrada
        if (!data || !data.columnId) {
            console.error('[MULTICOLUMN] No column ID provided in data:', data);
            return '<div style="padding: 20px;"><p>Error: No column ID provided</p></div>';
        }
        
        const columnId = data.columnId;
        console.log('[MULTICOLUMN] Looking for column:', columnId);
        
        // Try to access currentSectionsConfig from parent scope or window
        const sectionsConfig = (typeof currentSectionsConfig !== 'undefined' ? currentSectionsConfig : window.currentSectionsConfig);
        
        // Verificar que existe la configuración de multicolumn
        if (!sectionsConfig || !sectionsConfig.multicolumn) {
            console.error('[MULTICOLUMN] Multicolumn not found in currentSectionsConfig');
            console.log('[MULTICOLUMN] currentSectionsConfig:', sectionsConfig);
            console.log('[MULTICOLUMN] window.currentSectionsConfig:', window.currentSectionsConfig);
            console.log('[MULTICOLUMN] typeof currentSectionsConfig:', typeof currentSectionsConfig);
            return '<div style="padding: 20px;"><p>Error: Multicolumn configuration not found</p></div>';
        }
        
        // Verificar que existe el objeto columns
        if (!sectionsConfig.multicolumn.columns) {
            console.error('[MULTICOLUMN] No columns object in multicolumn config');
            return '<div style="padding: 20px;"><p>Error: No columns found</p></div>';
        }
        
        // Buscar la columna específica
        const column = sectionsConfig.multicolumn.columns[columnId];
        if (!column) {
            console.error('[MULTICOLUMN] Column not found for ID:', columnId);
            console.log('[MULTICOLUMN] Available columns:', Object.keys(sectionsConfig.multicolumn.columns));
            return '<div style="padding: 20px;"><p>Error: Column not found</p></div>';
        }
        
        console.log('[MULTICOLUMN] Column found:', column);
        
        // Default values
        const icon = column.icon || 'barcode';
        const customIcon = column.customIcon || '';
        const iconSize = column.iconSize || 64;
        const heading = column.heading || '';
        const body = column.body || '';
        const linkLabel = column.linkLabel || '';
        const link = column.link || '';
        
        const html = `
            <div style="display: flex; flex-direction: column; height: 100%; position: relative; overflow: hidden;">
                <div class="sidebar-view-header" style="position: relative; z-index: 10;">
                    <button class="back-to-sections-btn">
                        <i class="material-icons">arrow_back</i>
                    </button>
                    <h3 data-i18n="multicolumn.column">Column</h3>
                </div>
                
                <!-- Settings Content -->
                <div class="header-settings-content" style="padding: 20px; overflow-y: auto; overflow-x: hidden; flex: 1; height: calc(100% - 60px); box-sizing: border-box;">
                    <!-- Icon Section -->
                    <div class="settings-field" style="margin-bottom: 16px;">
                        <label style="display: block; margin-bottom: 4px; font-size: 13px; color: #6d7175;">Icon</label>
                        <select id="column-icon" class="shopify-select">
                            ${this.generateIconOptions(icon)}
                        </select>
                        <a href="#" style="font-size: 12px; color: #005bd3; text-decoration: none; margin-top: 4px; display: inline-block;">See what icon stands for each label</a>
                    </div>
                    
                    <!-- Custom Icon -->
                    <div class="settings-field" style="margin-bottom: 16px;">
                        <label style="display: block; margin-bottom: 4px; font-size: 13px; color: #6d7175;">Custom icon</label>
                        <div class="custom-icon-upload" style="border: 1px dashed #c9cccf; border-radius: 3px; padding: 20px; text-align: center; background: #fafafa;">
                            ${customIcon ? 
                                `<div class="custom-icon-preview">
                                    <img src="${customIcon}" alt="Custom icon" style="max-width: 64px; max-height: 64px; margin-bottom: 8px;">
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
                                    Seleccionar
                                </button>`
                            }
                        </div>
                        <input type="file" id="custom-icon-input" accept="image/*" style="display: none;" data-column-id="${columnId}">
                        <p style="font-size: 12px; color: #6d7175; margin-top: 8px; text-align: center;">Explorar imágenes gratuitas</p>
                    </div>
                    
                    <!-- Icon Size -->
                    <div class="settings-field" style="margin-bottom: 20px;">
                        <label style="display: block; margin-bottom: 8px; font-size: 13px; color: #6d7175;">Icon size</label>
                        <div style="display: flex; align-items: center; gap: 12px;">
                            <input type="range" id="icon-size" min="32" max="128" value="${iconSize}" 
                                style="flex: 1;" class="shopify-range">
                            <div style="display: flex; align-items: center; gap: 4px;">
                                <input type="number" id="icon-size-value" value="${iconSize}" 
                                    min="32" max="128" style="width: 60px;" class="shopify-input">
                                <span style="font-size: 13px; color: #6d7175;">px</span>
                            </div>
                        </div>
                    </div>
                    
                    <!-- Content Section -->
                    <div style="border-top: 1px solid #e3e3e3; padding-top: 20px; margin-bottom: 20px;">
                        <h4 style="font-size: 14px; font-weight: 600; margin-bottom: 16px;">Content</h4>
                        
                        <!-- Heading -->
                        <div class="settings-field" style="margin-bottom: 16px;">
                            <label style="display: block; margin-bottom: 4px; font-size: 13px; color: #6d7175;">Heading</label>
                            <div style="position: relative;">
                                <input type="text" id="column-heading" value="${heading}" 
                                    placeholder="Manejo de Códigos de Barras"
                                    style="width: 100%; padding-right: 36px;" class="shopify-input">
                                <button style="position: absolute; right: 8px; top: 50%; transform: translateY(-50%); 
                                    background: none; border: none; cursor: pointer; padding: 4px;">
                                    <i class="material-icons" style="font-size: 20px; color: #6d7175;">folder_open</i>
                                </button>
                            </div>
                        </div>
                        
                        <!-- Body -->
                        <div class="settings-field" style="margin-bottom: 16px;">
                            <label style="display: block; margin-bottom: 4px; font-size: 13px; color: #6d7175;">Body</label>
                            <div style="border: 1px solid #c9cccf; border-radius: 3px;">
                                <div style="border-bottom: 1px solid #e3e3e3; padding: 8px; display: flex; gap: 4px; background: #f6f6f7;">
                                    <button class="text-editor-btn" data-action="bold" style="padding: 4px 8px; background: none; border: none; cursor: pointer;">
                                        <i class="material-icons" style="font-size: 18px;">format_bold</i>
                                    </button>
                                    <button class="text-editor-btn" data-action="italic" style="padding: 4px 8px; background: none; border: none; cursor: pointer;">
                                        <i class="material-icons" style="font-size: 18px;">format_italic</i>
                                    </button>
                                    <button class="text-editor-btn" data-action="link" style="padding: 4px 8px; background: none; border: none; cursor: pointer;">
                                        <i class="material-icons" style="font-size: 18px;">link</i>
                                    </button>
                                    <button class="text-editor-btn" data-action="list" style="padding: 4px 8px; background: none; border: none; cursor: pointer;">
                                        <i class="material-icons" style="font-size: 18px;">format_list_bulleted</i>
                                    </button>
                                </div>
                                <textarea id="column-body" rows="4" class="shopify-textarea" 
                                    style="border: none; width: 100%; resize: vertical;"
                                    placeholder="Aurora POS optimiza ventas e inventario con códigos de barras, facilitando ventas rápidas, conteo preciso y gestión eficiente de existencias.">${body}</textarea>
                            </div>
                        </div>
                        
                        <!-- Link Label -->
                        <div class="settings-field" style="margin-bottom: 16px;">
                            <label style="display: block; margin-bottom: 4px; font-size: 13px; color: #6d7175;">Link label</label>
                            <div style="position: relative;">
                                <input type="text" id="column-link-label" value="${linkLabel}" 
                                    style="width: 100%; padding-right: 36px;" class="shopify-input">
                                <button style="position: absolute; right: 8px; top: 50%; transform: translateY(-50%); 
                                    background: none; border: none; cursor: pointer; padding: 4px;">
                                    <i class="material-icons" style="font-size: 20px; color: #6d7175;">folder_open</i>
                                </button>
                            </div>
                        </div>
                        
                        <!-- Link -->
                        <div class="settings-field" style="margin-bottom: 16px;">
                            <label style="display: block; margin-bottom: 4px; font-size: 13px; color: #6d7175;">Link</label>
                            <div style="position: relative;">
                                <input type="text" id="column-link" value="${link}" 
                                    placeholder="Pega un enlace o busca"
                                    style="width: 100%; padding-right: 36px;" class="shopify-input">
                                <button style="position: absolute; right: 8px; top: 50%; transform: translateY(-50%); 
                                    background: none; border: none; cursor: pointer; padding: 4px;">
                                    <i class="material-icons" style="font-size: 20px; color: #6d7175;">folder_open</i>
                                </button>
                            </div>
                            <p style="font-size: 12px; color: #6d7175; margin-top: 4px;">Leave link label empty to make the whole column a link</p>
                        </div>
                        
                        <!-- Delete Block Button -->
                        <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #e3e3e3;">
                            <button class="delete-block-btn" style="color: #d72c0d; background: none; border: none; padding: 8px 0; cursor: pointer; font-size: 14px; display: flex; align-items: center; gap: 6px;">
                                <i class="material-icons" style="font-size: 20px;">delete</i>
                                Eliminar bloque
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        `;
        
        console.log('[MULTICOLUMN] renderColumnSettings returning HTML content');
        return html;
    },
    
    // Adjuntar event listeners para configuración de columna
    attachColumnEventListeners: function(columnId) {
        if (!columnId) return;
        
        const self = this;
        
        // Helper function to update column config
        const updateColumn = (key, value) => {
            if (window.currentSectionsConfig.multicolumn?.columns?.[columnId]) {
                window.currentSectionsConfig.multicolumn.columns[columnId][key] = value;
                window.setHasPendingPageStructureChanges(true);
                window.updateSaveButtonState();
                window.renderPreview();
                
                // Update the column display name in sidebar if heading changes
                if (key === 'heading') {
                    const $columnItem = $(`.multicolumn-column-item[data-element-id="${columnId}"]`);
                    if ($columnItem.length > 0) {
                        const currentIndex = $columnItem.index() + 1;
                        const displayText = value || `${window.translations?.[window.currentLanguage]?.['multicolumn.column'] || 'Column'} ${currentIndex}`;
                        $columnItem.find('.subsection-text').text(displayText);
                    }
                }
            }
        };
        
        // Icon selector
        $('#column-icon').on('change', function() {
            updateColumn('icon', $(this).val());
        });
        
        // Custom icon upload buttons
        $('.select-icon-btn, .change-icon-btn').on('click', function(e) {
            e.preventDefault();
            $('#custom-icon-input').click();
        });
        
        // Remove custom icon button
        $('.remove-icon-btn').on('click', function(e) {
            e.preventDefault();
            updateColumn('customIcon', '');
            updateColumn('icon', 'barcode'); // Reset to default icon
            
            // Update UI
            $('.custom-icon-upload').html(`
                <button class="shopify-button select-icon-btn" style="background: #fff; border: 1px solid #c9cccf; padding: 8px 16px; cursor: pointer;">
                    Seleccionar
                </button>
            `);
            
            // Re-attach event listener
            $('.select-icon-btn').on('click', function(e) {
                e.preventDefault();
                $('#custom-icon-input').click();
            });
        });
        
        // Handle file upload
        $('#custom-icon-input').on('change', async function(e) {
            const file = e.target.files[0];
            if (file) {
                try {
                    // Create FormData for upload
                    const formData = new FormData();
                    formData.append('iconFile', file);
                    formData.append('columnId', columnId);
                    
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
                        updateColumn('customIcon', result.iconUrl);
                        updateColumn('icon', 'custom'); // Set icon to custom to use the uploaded image
                        
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
                            updateColumn('customIcon', '');
                            updateColumn('icon', 'barcode');
                            $('.custom-icon-upload').html(`
                                <button class="shopify-button select-icon-btn" style="background: #fff; border: 1px solid #c9cccf; padding: 8px 16px; cursor: pointer;">
                                    Seleccionar
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
                                Seleccionar
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
                            Seleccionar
                        </button>
                    `);
                    $('.select-icon-btn').on('click', function(e) {
                        e.preventDefault();
                        $('#custom-icon-input').click();
                    });
                }
            }
        });
        
        // Icon size - slider
        $('#icon-size').on('input', function() {
            const value = $(this).val();
            $('#icon-size-value').val(value);
            updateColumn('iconSize', parseInt(value));
        });
        
        // Icon size - input
        $('#icon-size-value').on('change', function() {
            const value = Math.max(32, Math.min(128, parseInt($(this).val()) || 64));
            $(this).val(value);
            $('#icon-size').val(value);
            updateColumn('iconSize', value);
        });
        
        // Heading
        $('#column-heading').on('input', function() {
            updateColumn('heading', $(this).val());
        });
        
        // Body
        $('#column-body').on('input', function() {
            updateColumn('body', $(this).val());
        });
        
        // Text editor buttons
        $('.text-editor-btn').on('click', function(e) {
            e.preventDefault();
            const action = $(this).data('action');
            const textarea = $('#column-body')[0];
            
            if (action === 'bold') {
                self.wrapSelectedText(textarea, '**', '**');
            } else if (action === 'italic') {
                self.wrapSelectedText(textarea, '*', '*');
            } else if (action === 'link') {
                const url = prompt('Enter URL:');
                if (url) {
                    self.wrapSelectedText(textarea, '[', `](${url})`);
                }
            } else if (action === 'list') {
                self.insertAtCursor(textarea, '\n• ');
            }
            
            // Update the column data
            updateColumn('body', $(textarea).val());
        });
        
        // Link label
        $('#column-link-label').on('input', function() {
            updateColumn('linkLabel', $(this).val());
        });
        
        // Link
        $('#column-link').on('input', function() {
            updateColumn('link', $(this).val());
        });
        
        // Delete button
        $('.delete-block-btn').on('click', function() {
            if (confirm('¿Estás seguro de que deseas eliminar esta columna?')) {
                // Remove from columns object
                delete window.currentSectionsConfig.multicolumn.columns[columnId];
                
                // Remove from columnOrder array
                const index = window.currentSectionsConfig.multicolumn.columnOrder.indexOf(columnId);
                if (index > -1) {
                    window.currentSectionsConfig.multicolumn.columnOrder.splice(index, 1);
                }
                
                // Mark changes and update
                window.hasPendingPageStructureChanges = true;
                window.updateSaveButtonState();
                window.renderPreview();
                
                // Go back to multicolumn settings
                window.switchSidebarView('multicolumnSettings');
            }
        });
        
        // Back button handler - return to sidebar panel
        $('.back-to-sections-btn').off('click').on('click', function() {
            window.switchSidebarView('blockList');
        });
        
        // Apply translations
        setTimeout(() => {
            if (typeof applyTranslations === 'function') {
                applyTranslations();
            }
        }, 0);
    },
    
    // Helper function to wrap selected text
    wrapSelectedText: function(textarea, before, after) {
        const start = textarea.selectionStart;
        const end = textarea.selectionEnd;
        const text = textarea.value;
        const selectedText = text.substring(start, end);
        const replacement = before + selectedText + after;
        
        textarea.value = text.substring(0, start) + replacement + text.substring(end);
        
        // Set cursor position after the inserted text
        const newCursorPos = start + replacement.length;
        textarea.setSelectionRange(newCursorPos, newCursorPos);
        textarea.focus();
    },
    
    // Helper function to insert text at cursor
    insertAtCursor: function(textarea, text) {
        const start = textarea.selectionStart;
        const end = textarea.selectionEnd;
        const value = textarea.value;
        
        textarea.value = value.substring(0, start) + text + value.substring(end);
        
        // Set cursor position after the inserted text
        const newCursorPos = start + text.length;
        textarea.setSelectionRange(newCursorPos, newCursorPos);
        textarea.focus();
    },
    
    // Generate icon options for select dropdown
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
            { value: 'directions_car', label: 'Car', group: 'Commerce' },
            { value: 'coffee', label: 'Cup', group: 'Commerce' },
            { value: 'cake', label: 'Cake', group: 'Commerce' },
            { value: 'checkroom', label: 'Hanger', group: 'Commerce' },
            { value: 'shirt', label: 'T-shirt', group: 'Commerce' },
            { value: 'dress', label: 'Dress', group: 'Commerce' },
            { value: 'jewelry', label: 'Jewelry', group: 'Commerce' },
            { value: 'chair', label: 'Furniture', group: 'Commerce' },
            { value: 'toys', label: 'Toy', group: 'Commerce' },
            
            // Shipping
            { value: 'local_shipping', label: 'Shipping', group: 'Shipping' },
            { value: 'inventory_2', label: 'Shipping box', group: 'Shipping' },
            { value: 'location_on', label: 'Address pin', group: 'Shipping' },
            { value: 'speed', label: 'Fast delivery', group: 'Shipping' },
            { value: 'local_shipping', label: 'Delivery truck', group: 'Shipping' },
            { value: 'assignment_return', label: 'Easy returns', group: 'Shipping' },
            { value: 'public', label: 'World', group: 'Shipping' },
            { value: 'flight', label: 'Plane', group: 'Shipping' },
            { value: 'search', label: 'Search order', group: 'Shipping' },
            { value: 'work', label: 'Briefcase', group: 'Shipping' },
            { value: 'store', label: 'Store', group: 'Shipping' },
            { value: 'route', label: 'Routing', group: 'Shipping' },
            
            // Payment & Security
            { value: 'security', label: 'Payment security', group: 'Payment' },
            { value: 'credit_card', label: 'Credit card', group: 'Payment' },
            { value: 'lock', label: 'Lock', group: 'Payment' },
            { value: 'shield', label: 'Shield', group: 'Payment' },
            { value: 'verified_user', label: 'Secure payment', group: 'Payment' },
            { value: 'account_balance_wallet', label: 'Wallet', group: 'Payment' },
            { value: 'payments', label: 'Cash', group: 'Payment' },
            { value: 'receipt', label: 'Receipt', group: 'Payment' },
            { value: 'label', label: 'Tag', group: 'Payment' },
            { value: 'list', label: 'List', group: 'Payment' },
            { value: 'qr_code_scanner', label: 'Scanner', group: 'Payment' },
            
            // Communication
            { value: 'forum', label: 'Communication', group: 'Communication' },
            { value: 'phone', label: 'Phone', group: 'Communication' },
            { value: 'chat', label: 'Chat', group: 'Communication' },
            { value: 'message', label: 'Message', group: 'Communication' },
            { value: 'email', label: 'Email', group: 'Communication' },
            { value: 'support_agent', label: 'Customer support', group: 'Communication' },
            { value: 'print', label: 'Printer outline', group: 'Communication' },
            
            // Devices
            { value: 'devices', label: 'Devices', group: 'Devices' },
            { value: 'smartphone', label: 'Mobile', group: 'Devices' },
            
            // Ecology
            { value: 'eco', label: 'Ecology', group: 'Ecology' },
            { value: 'bug_report', label: 'Virus', group: 'Ecology' },
            { value: 'masks', label: 'Mask', group: 'Ecology' },
            { value: 'eco', label: 'Eco', group: 'Ecology' },
            { value: 'pets', label: 'Rabbit', group: 'Ecology' },
            
            // Social (usando iconos alternativos de Material Icons)
            { value: 'group', label: 'Social', group: 'Social' },
            { value: 'alternate_email', label: 'Twitter', group: 'Social' },
            { value: 'facebook', label: 'Facebook', group: 'Social' },
            { value: 'interests', label: 'Pinterest', group: 'Social' },
            { value: 'photo_camera', label: 'Instagram', group: 'Social' },
            { value: 'music_note', label: 'TikTok', group: 'Social' },
            { value: 'web', label: 'Tumblr', group: 'Social' },
            { value: 'photo', label: 'Snapchat', group: 'Social' },
            { value: 'play_circle', label: 'YouTube', group: 'Social' },
            { value: 'videocam', label: 'Vimeo', group: 'Social' },
            { value: 'work_outline', label: 'LinkedIn', group: 'Social' },
            { value: 'collections', label: 'Flickr', group: 'Social' },
            { value: 'reddit', label: 'Reddit', group: 'Social' },
            { value: 'email', label: 'Email', group: 'Social' },
            { value: 'brush', label: 'Behance', group: 'Social' },
            { value: 'discord', label: 'Discord', group: 'Social' },
            { value: 'sports_basketball', label: 'Dribbble', group: 'Social' },
            { value: 'article', label: 'Medium', group: 'Social' },
            { value: 'stream', label: 'Twitch', group: 'Social' },
            { value: 'whatsapp', label: 'WhatsApp', group: 'Social' },
            { value: 'phone_in_talk', label: 'Viber', group: 'Social' },
            { value: 'telegram', label: 'Telegram', group: 'Social' }
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
    
    // Inicializar módulo
    initialize: function() {
        console.log('[MULTICOLUMN MODULE] Initialized');
        
        // Add global function for carousel navigation
        window.scrollMulticolumnCarousel = function(containerId, direction) {
            const container = document.querySelector(`#${containerId} .multicolumn-grid`);
            if (!container) return;
            
            const scrollAmount = container.offsetWidth * 0.8; // Scroll 80% of container width
            if (direction === 'prev') {
                container.scrollBy({ left: -scrollAmount, behavior: 'smooth' });
            } else {
                container.scrollBy({ left: scrollAmount, behavior: 'smooth' });
            }
        };
    }
};

// Auto-inicializar cuando el DOM esté listo
if (typeof document !== 'undefined') {
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', function() {
            window.WebsiteBuilderModules.Multicolumn.initialize();
        });
    } else {
        window.WebsiteBuilderModules.Multicolumn.initialize();
    }
}