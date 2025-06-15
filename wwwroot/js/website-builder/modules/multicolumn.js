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
        
        // Generate columns HTML
        const columnsHtml = visibleColumns.map((columnId, index) => {
            const column = columns[columnId];
            
            return `
                <div class="multicolumn-column" style="text-align: center; padding: 20px;">
                    ${column.icon || column.customIcon ? `
                        <div class="column-icon" style="margin-bottom: 16px;">
                            ${column.customIcon ? 
                                `<img src="${column.customIcon}" alt="" style="width: ${column.iconSize || 64}px; height: ${column.iconSize || 64}px;">` :
                                `<i class="material-icons" style="font-size: ${column.iconSize || 64}px; color: ${schemeColors.text};">${column.icon}</i>`
                            }
                        </div>
                    ` : ''}
                    <div class="column-content" style="color: ${schemeColors.text};">
                        ${column.heading ? `<h3 style="font-size: 20px; margin: 0 0 12px 0; color: ${schemeColors.text};">${column.heading}</h3>` : ''}
                        ${column.body ? `<div style="margin: 0 0 16px 0; line-height: 1.6;">${column.body}</div>` : ''}
                        ${column.linkLabel && column.link ? `
                            <a href="${column.link}" 
                               style="color: ${schemeColors.text}; text-decoration: underline;">
                                ${column.linkLabel}
                            </a>
                        ` : ''}
                    </div>
                </div>
            `;
        }).join('');
        
        const currentLanguage = window.currentLanguage || 'es';
        const translations = window.translations || {};
        const sectionTitle = translations[currentLanguage]?.['sections.multicolumn'] || 'Multicolumna';
        
        const columnCount = visibleColumns.length;
        const gridColumns = columnCount === 1 ? '1fr' : 
                           columnCount === 2 ? '1fr 1fr' : 
                           columnCount === 3 ? '1fr 1fr 1fr' : 
                           'repeat(auto-fit, minmax(250px, 1fr))';
        
        return `
            <div class="section-wrapper" data-section-id="multicolumn" style="padding: 40px 0; background: ${schemeColors.background};">
                <div class="section-header-tag">
                    <span class="material-symbols-outlined" style="font-size: 16px;">view_week</span>
                    ${sectionTitle}
                </div>
                <div class="multicolumn-container" style="max-width: 1200px; margin: 0 auto; padding: 0 20px;">
                    ${config.config?.heading ? `
                        <h2 style="text-align: center; font-size: 32px; margin: 0 0 20px 0; color: ${schemeColors.text};">
                            ${config.config.heading}
                        </h2>
                    ` : ''}
                    ${config.config?.body ? `
                        <p style="text-align: center; font-size: 16px; margin: 0 0 40px 0; color: ${schemeColors.text}; max-width: 800px; margin-left: auto; margin-right: auto;">
                            ${config.config.body}
                        </p>
                    ` : ''}
                    <div class="multicolumn-grid" style="display: grid; grid-template-columns: ${gridColumns}; gap: 40px;">
                        ${columnsHtml}
                    </div>
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
        const showArrowsOnHover = configData.showArrowsOnHover || true;
        const buttonLabel = configData.buttonLabel || '';
        const buttonLink = configData.buttonLink || '';
        const buttonStyle = configData.buttonStyle || 'solid';
        const autoplayMode = configData.autoplayMode || 'none';
        const autoplaySpeed = configData.autoplaySpeed || 3;
        const addSidePaddings = configData.addSidePaddings !== false;
        const topPadding = configData.topPadding || 0;
        const bottomPadding = configData.bottomPadding || 0;
        
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
                        <label style="display: block; margin-bottom: 8px; font-size: 13px; color: #6d7175;">Desktop layout</label>
                        <div style="display: flex; gap: 16px;">
                            <label style="display: flex; align-items: center; cursor: pointer;">
                                <input type="radio" name="desktop-layout" value="grid" ${desktopLayout === 'grid' ? 'checked' : ''} 
                                    style="margin-right: 6px;"> Grid
                            </label>
                            <label style="display: flex; align-items: center; cursor: pointer;">
                                <input type="radio" name="desktop-layout" value="carousel" ${desktopLayout === 'carousel' ? 'checked' : ''} 
                                    style="margin-right: 6px;"> Carousel
                            </label>
                        </div>
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
                            <label style="display: flex; align-items: center; justify-content: space-between; cursor: pointer;">
                                <span style="font-size: 13px; color: #202223;">Color columns</span>
                                <div class="shopify-toggle">
                                    <input type="checkbox" id="color-columns" ${colorColumns ? 'checked' : ''}>
                                    <span class="toggle-slider"></span>
                                </div>
                            </label>
                        </div>
                        
                        <!-- Show Arrows on Hover -->
                        <div class="settings-field" style="margin-bottom: 20px;">
                            <label style="display: flex; align-items: center; justify-content: space-between; cursor: pointer;">
                                <span style="font-size: 13px; color: #202223;">Show arrows on hover</span>
                                <div class="shopify-toggle">
                                    <input type="checkbox" id="show-arrows-on-hover" ${showArrowsOnHover ? 'checked' : ''}>
                                    <span class="toggle-slider"></span>
                                </div>
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
                            <label style="display: block; margin-bottom: 8px; font-size: 13px; color: #6d7175;">Button style</label>
                            <div style="display: flex; gap: 16px;">
                                <label style="display: flex; align-items: center; cursor: pointer;">
                                    <input type="radio" name="button-style" value="solid" ${buttonStyle === 'solid' ? 'checked' : ''} 
                                        style="margin-right: 6px;"> Solid
                                </label>
                                <label style="display: flex; align-items: center; cursor: pointer;">
                                    <input type="radio" name="button-style" value="outline" ${buttonStyle === 'outline' ? 'checked' : ''} 
                                        style="margin-right: 6px;"> Outline
                                </label>
                            </div>
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
                    <div style="border-top: 1px solid #e3e3e3; padding-top: 20px; margin-bottom: 40px;">
                        <h4 style="font-size: 14px; font-weight: 600; margin-bottom: 16px;">Paddings</h4>
                        
                        <!-- Add Side Paddings -->
                        <div class="settings-field" style="margin-bottom: 16px;">
                            <label style="display: flex; align-items: center; justify-content: space-between; cursor: pointer;">
                                <span style="font-size: 13px; color: #202223;">Add side paddings</span>
                                <div class="shopify-toggle">
                                    <input type="checkbox" id="add-side-paddings" ${addSidePaddings ? 'checked' : ''}>
                                    <span class="toggle-slider"></span>
                                </div>
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
                window.hasPendingPageStructureChanges = true;
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
        
        // Desktop layout radio buttons
        $('input[name="desktop-layout"]').on('change', function() {
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
        
        // Button style radio buttons
        $('input[name="button-style"]').on('change', function() {
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
        
        // Back button handler
        $('.back-to-sections-btn').off('click').on('click', function() {
            window.switchSidebarView('blockList');
        });
        
        // Initialize CSS for Shopify toggles and inputs
        if (!$('#multicolumn-styles').length) {
            $(`<style id="multicolumn-styles">
                .shopify-toggle {
                    position: relative;
                    display: inline-block;
                    width: 36px;
                    height: 20px;
                }
                .shopify-toggle input {
                    opacity: 0;
                    width: 0;
                    height: 0;
                }
                .toggle-slider {
                    position: absolute;
                    cursor: pointer;
                    top: 0;
                    left: 0;
                    right: 0;
                    bottom: 0;
                    background-color: #c9cccf;
                    transition: .3s;
                    border-radius: 20px;
                }
                .toggle-slider:before {
                    position: absolute;
                    content: "";
                    height: 14px;
                    width: 14px;
                    left: 3px;
                    bottom: 3px;
                    background-color: white;
                    transition: .3s;
                    border-radius: 50%;
                }
                .shopify-toggle input:checked + .toggle-slider {
                    background-color: #008060;
                }
                .shopify-toggle input:checked + .toggle-slider:before {
                    transform: translateX(16px);
                }
                
                /* Fix for inputs */
                .shopify-input, .shopify-select, .shopify-textarea {
                    width: 100%;
                    padding: 8px 12px;
                    border: 1px solid #c9cccf;
                    border-radius: 3px;
                    font-size: 13px;
                    color: #202223;
                    background: #fff;
                    box-sizing: border-box;
                }
                
                .shopify-textarea {
                    padding: 8px 12px;
                    min-height: 80px;
                }
                
                .shopify-range {
                    width: 100%;
                    -webkit-appearance: none;
                    height: 4px;
                    background: #e3e3e3;
                    outline: none;
                    cursor: pointer;
                }
                
                .shopify-range::-webkit-slider-thumb {
                    -webkit-appearance: none;
                    width: 16px;
                    height: 16px;
                    background: #202223;
                    cursor: pointer;
                    border-radius: 50%;
                    border: 2px solid #fff;
                    box-shadow: 0 1px 3px rgba(0,0,0,0.3);
                }
            </style>`).appendTo('head');
        }
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
                            <option value="barcode" ${icon === 'barcode' ? 'selected' : ''}>Barcode</option>
                            <option value="qr_code" ${icon === 'qr_code' ? 'selected' : ''}>QR Code</option>
                            <option value="shopping_cart" ${icon === 'shopping_cart' ? 'selected' : ''}>Shopping Cart</option>
                            <option value="local_shipping" ${icon === 'local_shipping' ? 'selected' : ''}>Shipping</option>
                            <option value="credit_card" ${icon === 'credit_card' ? 'selected' : ''}>Credit Card</option>
                            <option value="star" ${icon === 'star' ? 'selected' : ''}>Star</option>
                            <option value="favorite" ${icon === 'favorite' ? 'selected' : ''}>Heart</option>
                            <option value="check_circle" ${icon === 'check_circle' ? 'selected' : ''}>Check Circle</option>
                        </select>
                        <a href="#" style="font-size: 12px; color: #005bd3; text-decoration: none; margin-top: 4px; display: inline-block;">See what icon stands for each label</a>
                    </div>
                    
                    <!-- Custom Icon -->
                    <div class="settings-field" style="margin-bottom: 16px;">
                        <label style="display: block; margin-bottom: 4px; font-size: 13px; color: #6d7175;">Custom icon</label>
                        <div style="border: 1px dashed #c9cccf; border-radius: 3px; padding: 20px; text-align: center; background: #fafafa;">
                            ${customIcon ? 
                                `<img src="${customIcon}" alt="Custom icon" style="max-width: 64px; max-height: 64px;">` :
                                `<button class="shopify-button" style="background: #fff; border: 1px solid #c9cccf; padding: 8px 16px; cursor: pointer;">
                                    Seleccionar
                                </button>`
                            }
                        </div>
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
                window.hasPendingPageStructureChanges = true;
                window.updateSaveButtonState();
                window.renderPreview();
            }
        };
        
        // Icon selector
        $('#column-icon').on('change', function() {
            updateColumn('icon', $(this).val());
        });
        
        // Custom icon upload button
        $('.shopify-button').on('click', function(e) {
            e.preventDefault();
            // TODO: Implement image picker/upload functionality
            console.log('[MULTICOLUMN] Custom icon upload clicked');
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
    
    // Inicializar módulo
    initialize: function() {
        console.log('[MULTICOLUMN MODULE] Initialized');
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