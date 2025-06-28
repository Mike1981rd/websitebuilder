// Rich Text Module for Website Builder
window.WebsiteBuilderModules = window.WebsiteBuilderModules || {};
window.WebsiteBuilderModules.RichText = {
    render: function(config) {
        if (!config || config.isHidden) return '';
        
        const schemeColors = window.getColorSchemeValues ? window.getColorSchemeValues(config.colorScheme || 'scheme1') : { text: '#121212', background: '#FFFFFF' };
        
        // Get typography settings
        const headingTypography = window.currentGlobalThemeSettings?.typography?.heading || { font: 'assistant', fontSize: '36px' };
        const menuTypography = window.currentGlobalThemeSettings?.typography?.menu || { font: 'assistant', fontSize: '18px' };
        const bodyTypography = window.currentGlobalThemeSettings?.typography?.body || { font: 'assistant', fontSize: '16px' };
        
        // Get heading and body fonts
        const headingFont = window.getFontNameFromValueSafe ? 
            window.getFontNameFromValueSafe(headingTypography.font) : 
            'Assistant';
        const menuFont = window.getFontNameFromValueSafe ? 
            window.getFontNameFromValueSafe(menuTypography.font) : 
            'Assistant';
        const bodyFont = window.getFontNameFromValueSafe ? 
            window.getFontNameFromValueSafe(bodyTypography.font) : 
            'Assistant';
            
        // Configuration values
        const colorBackground = config.colorBackground || false;
        const width = config.width || 'page';
        const contentAlignment = config.contentAlignment || 'left';
        const addSidePaddings = config.addSidePaddings || false;
        const paddingTop = config.paddingTop || 40;
        const paddingBottom = config.paddingBottom || 40;
        
        // Icon settings
        const icon = config.icon || 'none';
        const customIcon = config.customIcon || '';
        const iconSize = config.iconSize || 48;
        
        // Content
        const subheading = config.subheading || '';
        const heading = config.heading || 'Tell about your brand';
        const headingSize = config.headingSize || 'h2';
        const bodySize = config.bodySize || '3';
        const column1 = config.column1 || 'Share information about your brand with your customers. Describe a product, make announcements, or welcome customers to your store.';
        const column2 = config.column2 || '';
        const column3 = config.column3 || '';
        
        // Buttons
        const button1Label = config.button1Label || '';
        const button1Link = config.button1Link || '';
        const button1Style = config.button1Style || 'solid';
        const button2Label = config.button2Label || '';
        const button2Link = config.button2Link || '';
        const button2Style = config.button2Style || 'outline';
        
        // Determine container width
        let containerMaxWidth = '1200px';
        if (width === 'narrow') containerMaxWidth = '800px';
        else if (width === 'full') containerMaxWidth = '100%';
        
        // Determine heading sizes
        const headingSizes = {
            'h1': '48px',
            'h2': '40px',
            'h3': '32px',
            'h4': '28px',
            'h5': '24px',
            'h6': '20px',
            'h7': '18px'
        };
        
        // Determine body sizes
        const bodySizes = {
            '0': '12px',
            '1': '14px',
            '2': '16px',
            '3': '18px',
            '4': '20px',
            '5': '24px',
            '6': '28px'
        };
        
        // Calculate column layout
        const columnCount = [column1, column2, column3].filter(col => col && col.trim()).length;
        
        // Generate styles for typography
        const headingStyles = `
            font-family: ${headingFont};
            font-size: ${headingSizes[headingSize] || '40px'};
            font-weight: 600;
            line-height: 1.2;
            margin: 0 0 16px 0;
        `;
        
        const subheadingStyles = `
            font-family: ${menuFont};
            font-size: ${menuTypography.fontSize};
            font-weight: 500;
            opacity: 0.8;
            margin: 0 0 8px 0;
        `;
        
        const bodyStyles = `
            font-family: ${bodyFont};
            font-size: ${bodySizes[bodySize] || '18px'};
            line-height: 1.6;
        `;
        
        // CRÍTICO: Incluir section-header-tag para la pestaña azul al hover
        return `
            <div class="section-wrapper" data-section-id="richText" 
                 style="padding: ${paddingTop}px 0 ${paddingBottom}px 0; 
                        background-color: ${colorBackground ? schemeColors.background : 'transparent'};">
                <div class="section-header-tag">
                    <span class="material-symbols-outlined" style="font-size: 16px;">text_fields</span>
                    ${window.translations && window.translations[window.currentLanguage] ? 
                        (window.translations[window.currentLanguage]['sections.richText'] || 'Rich Text') : 
                        'Rich Text'}
                </div>
                <div class="container" style="max-width: ${containerMaxWidth}; margin: 0 auto; padding: 0 ${addSidePaddings ? '40px' : '20px'};">
                    <div class="rich-text-content" style="text-align: ${contentAlignment};">
                        ${icon !== 'none' ? `
                            <div class="rich-text-icon" style="margin-bottom: 24px;">
                                ${icon === 'custom' && customIcon ? 
                                    `<img src="${customIcon}" alt="Icon" style="width: ${iconSize}px; height: ${iconSize}px;">` :
                                    icon !== 'custom' ? 
                                        `<i class="material-icons" style="font-size: ${iconSize}px; color: ${schemeColors.text};">${icon}</i>` : 
                                        ''
                                }
                            </div>
                        ` : ''}
                        
                        ${subheading ? `<div style="${subheadingStyles} color: ${schemeColors.text};">${subheading}</div>` : ''}
                        
                        ${heading ? `<${headingSize} style="${headingStyles} color: ${schemeColors.text};">${heading}</${headingSize}>` : ''}
                        
                        <div class="rich-text-columns" style="display: ${columnCount > 1 ? 'grid' : 'block'}; 
                             grid-template-columns: repeat(${columnCount}, 1fr); 
                             gap: 40px; 
                             margin-bottom: ${button1Label || button2Label ? '32px' : '0'};">
                            ${column1 ? `<div class="rich-text-column" style="${bodyStyles} color: ${schemeColors.text};">${column1}</div>` : ''}
                            ${column2 ? `<div class="rich-text-column" style="${bodyStyles} color: ${schemeColors.text};">${column2}</div>` : ''}
                            ${column3 ? `<div class="rich-text-column" style="${bodyStyles} color: ${schemeColors.text};">${column3}</div>` : ''}
                        </div>
                        
                        ${button1Label || button2Label ? `
                            <div class="rich-text-buttons" style="display: flex; gap: 16px; justify-content: ${contentAlignment};">
                                ${button1Label ? `
                                    <a href="${button1Link || '#'}" 
                                       class="rich-text-button button-${button1Style}"
                                       style="padding: 12px 24px; 
                                              border-radius: 4px; 
                                              text-decoration: none; 
                                              font-family: ${bodyFont};
                                              font-size: 16px;
                                              font-weight: 500;
                                              transition: all 0.2s;
                                              ${button1Style === 'solid' ? 
                                                `background: ${schemeColors.text}; color: ${schemeColors.background}; border: 2px solid transparent;` :
                                                button1Style === 'outline' ? 
                                                `background: transparent; color: ${schemeColors.text}; border: 2px solid ${schemeColors.text};` :
                                                `background: transparent; color: ${schemeColors.text}; border: none; text-decoration: underline;`
                                              }">
                                        ${button1Label}
                                    </a>
                                ` : ''}
                                ${button2Label ? `
                                    <a href="${button2Link || '#'}" 
                                       class="rich-text-button button-${button2Style}"
                                       style="padding: 12px 24px; 
                                              border-radius: 4px; 
                                              text-decoration: none; 
                                              font-family: ${bodyFont};
                                              font-size: 16px;
                                              font-weight: 500;
                                              transition: all 0.2s;
                                              ${button2Style === 'solid' ? 
                                                `background: ${schemeColors.text}; color: ${schemeColors.background}; border: 2px solid transparent;` :
                                                button2Style === 'outline' ? 
                                                `background: transparent; color: ${schemeColors.text}; border: 2px solid ${schemeColors.text};` :
                                                `background: transparent; color: ${schemeColors.text}; border: none; text-decoration: underline;`
                                              }">
                                        ${button2Label}
                                    </a>
                                ` : ''}
                            </div>
                        ` : ''}
                    </div>
                </div>
            </div>
        `;
    },
    
    renderSettings: function(config) {
        const configData = config || {};
        
        // Default values
        const colorScheme = configData.colorScheme || 'scheme1';
        const colorBackground = configData.colorBackground || false;
        const width = configData.width || 'page';
        const contentAlignment = configData.contentAlignment || 'left';
        const addSidePaddings = configData.addSidePaddings || false;
        const paddingTop = configData.paddingTop || 40;
        const paddingBottom = configData.paddingBottom || 40;
        
        // Icon settings
        const icon = configData.icon || 'none';
        const customIcon = configData.customIcon || '';
        const iconSize = configData.iconSize || 48;
        
        // Content
        const subheading = configData.subheading || '';
        const heading = configData.heading || 'Tell about your brand';
        const headingSize = configData.headingSize || 'h2';
        const bodySize = configData.bodySize || '3';
        const column1 = configData.column1 || 'Share information about your brand with your customers. Describe a product, make announcements, or welcome customers to your store.';
        const column2 = configData.column2 || '';
        const column3 = configData.column3 || '';
        
        // Buttons
        const button1Label = configData.button1Label || '';
        const button1Link = configData.button1Link || '';
        const button1Style = configData.button1Style || 'solid';
        const button2Label = configData.button2Label || '';
        const button2Link = configData.button2Link || '';
        const button2Style = configData.button2Style || 'outline';
        
        return `
            <div style="display: flex; flex-direction: column; height: 100%; position: relative; overflow: hidden;">
                <div class="sidebar-view-header" style="position: relative; z-index: 10;">
                    <button class="back-to-sections-btn">
                        <i class="material-icons">arrow_back</i>
                    </button>
                    <h3>Rich text</h3>
                </div>
                
                <div style="padding: 20px; overflow-y: auto; overflow-x: hidden; flex: 1; height: calc(100% - 60px); box-sizing: border-box;">
                    <!-- Main Settings -->
                    <div class="settings-group" style="margin-bottom: 24px; padding-bottom: 24px; border-bottom: 1px solid #e3e3e3;">
                        <!-- Color Scheme -->
                        <div class="settings-field" style="margin-bottom: 16px;">
                            <label style="display: block; margin-bottom: 8px; font-size: 13px; color: #6d7175;">
                                Color scheme
                            </label>
                            <select id="richText-color-scheme" class="shopify-select" style="width: 100%; padding: 8px 12px; border: 1px solid #c9cccf; border-radius: 4px; background: white;">
                                <option value="scheme1" ${colorScheme === 'scheme1' ? 'selected' : ''}>Color scheme 1</option>
                                <option value="scheme2" ${colorScheme === 'scheme2' ? 'selected' : ''}>Color scheme 2</option>
                                <option value="scheme3" ${colorScheme === 'scheme3' ? 'selected' : ''}>Color scheme 3</option>
                                <option value="scheme4" ${colorScheme === 'scheme4' ? 'selected' : ''}>Color scheme 4</option>
                                <option value="scheme5" ${colorScheme === 'scheme5' ? 'selected' : ''}>Color scheme 5</option>
                            </select>
                            <a href="#" style="font-size: 12px; color: #005bd3; text-decoration: none; margin-top: 4px; display: inline-block;">Learn about color schemes</a>
                        </div>
                        
                        <!-- Color Background -->
                        <div class="settings-field" style="margin-bottom: 16px;">
                            <label class="toggle-field" style="display: flex; justify-content: space-between; align-items: center; cursor: pointer;">
                                <span style="font-size: 13px; color: #6d7175;">Color background</span>
                                <input type="checkbox" class="shopify-toggle" id="richText-color-background" ${colorBackground ? 'checked' : ''}>
                                <label for="richText-color-background" class="toggle-slider"></label>
                            </label>
                        </div>
                        
                        <!-- Width -->
                        <div class="settings-field" style="margin-bottom: 16px;">
                            <label style="display: block; margin-bottom: 8px; font-size: 13px; color: #6d7175;">
                                Width
                            </label>
                            <select id="richText-width" class="shopify-select" style="width: 100%; padding: 8px 12px; border: 1px solid #c9cccf; border-radius: 4px; background: white;">
                                <option value="page" ${width === 'page' ? 'selected' : ''}>Page</option>
                                <option value="narrow" ${width === 'narrow' ? 'selected' : ''}>Narrow</option>
                                <option value="full" ${width === 'full' ? 'selected' : ''}>Full width</option>
                            </select>
                        </div>
                        
                        <!-- Content Alignment -->
                        <div class="settings-field" style="margin-bottom: 16px;">
                            <label style="display: block; margin-bottom: 8px; font-size: 13px; color: #6d7175;">
                                Content alignment
                            </label>
                            <div class="alignment-buttons" style="display: flex; gap: 4px;">
                                <button class="alignment-btn ${contentAlignment === 'left' ? 'active' : ''}" 
                                        data-align="left" 
                                        style="flex: 1; padding: 8px; border: 1px solid #c9cccf; background: ${contentAlignment === 'left' ? '#005bd3' : '#fff'}; 
                                               color: ${contentAlignment === 'left' ? '#fff' : '#202223'}; cursor: pointer; border-radius: 4px; transition: all 0.2s;">
                                    <i class="material-icons" style="font-size: 20px;">format_align_left</i>
                                </button>
                                <button class="alignment-btn ${contentAlignment === 'center' ? 'active' : ''}" 
                                        data-align="center" 
                                        style="flex: 1; padding: 8px; border: 1px solid #c9cccf; background: ${contentAlignment === 'center' ? '#005bd3' : '#fff'}; 
                                               color: ${contentAlignment === 'center' ? '#fff' : '#202223'}; cursor: pointer; border-radius: 4px; transition: all 0.2s;">
                                    <i class="material-icons" style="font-size: 20px;">format_align_center</i>
                                </button>
                                <button class="alignment-btn ${contentAlignment === 'right' ? 'active' : ''}" 
                                        data-align="right" 
                                        style="flex: 1; padding: 8px; border: 1px solid #c9cccf; background: ${contentAlignment === 'right' ? '#005bd3' : '#fff'}; 
                                               color: ${contentAlignment === 'right' ? '#fff' : '#202223'}; cursor: pointer; border-radius: 4px; transition: all 0.2s;">
                                    <i class="material-icons" style="font-size: 20px;">format_align_right</i>
                                </button>
                            </div>
                        </div>
                    </div>
                    
                    <!-- Paddings Section -->
                    <div class="settings-group" style="margin-bottom: 24px; padding-bottom: 24px; border-bottom: 1px solid #e3e3e3;">
                        <h4 style="font-size: 13px; font-weight: 500; margin-bottom: 12px; color: #202223;">Paddings</h4>
                        
                        <!-- Add side paddings -->
                        <div class="settings-field" style="margin-bottom: 16px;">
                            <label class="toggle-field" style="display: flex; justify-content: space-between; align-items: center; cursor: pointer;">
                                <span style="font-size: 13px; color: #6d7175;">Add side paddings</span>
                                <input type="checkbox" class="shopify-toggle" id="richText-add-side-paddings" ${addSidePaddings ? 'checked' : ''}>
                                <label for="richText-add-side-paddings" class="toggle-slider"></label>
                            </label>
                        </div>
                        
                        <!-- Top padding -->
                        <div class="settings-field" style="margin-bottom: 16px;">
                            <label style="display: block; margin-bottom: 8px; font-size: 13px; color: #6d7175;">
                                Top padding
                            </label>
                            <div style="display: flex; align-items: center; gap: 12px;">
                                <input type="range" id="richText-padding-top" min="0" max="100" value="${paddingTop}" 
                                       style="flex: 1;" class="shopify-range">
                                <div style="display: flex; align-items: center; gap: 4px;">
                                    <input type="number" id="richText-padding-top-value" min="0" max="100" value="${paddingTop}" 
                                           style="width: 50px; padding: 4px 8px; border: 1px solid #c9cccf; border-radius: 4px; text-align: center;">
                                    <span style="font-size: 12px; color: #6d7175;">px</span>
                                </div>
                            </div>
                        </div>
                        
                        <!-- Bottom padding -->
                        <div class="settings-field">
                            <label style="display: block; margin-bottom: 8px; font-size: 13px; color: #6d7175;">
                                Bottom padding
                            </label>
                            <div style="display: flex; align-items: center; gap: 12px;">
                                <input type="range" id="richText-padding-bottom" min="0" max="100" value="${paddingBottom}" 
                                       style="flex: 1;" class="shopify-range">
                                <div style="display: flex; align-items: center; gap: 4px;">
                                    <input type="number" id="richText-padding-bottom-value" min="0" max="100" value="${paddingBottom}" 
                                           style="width: 50px; padding: 4px 8px; border: 1px solid #c9cccf; border-radius: 4px; text-align: center;">
                                    <span style="font-size: 12px; color: #6d7175;">px</span>
                                </div>
                            </div>
                        </div>
                    </div>
                    
                    <!-- Icon Section -->
                    <div class="settings-group" style="margin-bottom: 24px; padding-bottom: 24px; border-bottom: 1px solid #e3e3e3;">
                        <h4 style="font-size: 13px; font-weight: 500; margin-bottom: 12px; color: #202223;">Icon</h4>
                        
                        <!-- Icon selector -->
                        <div class="settings-field" style="margin-bottom: 16px;">
                            <label style="display: block; margin-bottom: 8px; font-size: 13px; color: #6d7175;">Icon</label>
                            <select id="richText-icon" class="shopify-select" style="width: 100%; padding: 8px 12px; border: 1px solid #c9cccf; border-radius: 4px; background: white;">
                                ${this.generateIconOptions(icon)}
                            </select>
                            <a href="#" style="font-size: 12px; color: #005bd3; text-decoration: none; margin-top: 4px; display: inline-block;">See what icon stands for each label</a>
                        </div>
                        
                        <!-- Custom icon -->
                        <div class="settings-field" style="margin-bottom: 16px;">
                            <label style="display: block; margin-bottom: 8px; font-size: 13px; color: #6d7175;">Custom icon</label>
                            <div class="custom-icon-upload" style="border: 1px dashed #c9cccf; border-radius: 4px; padding: 24px; text-align: center; background: #fafbfb;">
                                ${customIcon ? 
                                    `<div class="custom-icon-preview">
                                        <img src="${customIcon}" alt="Custom icon" style="max-width: 64px; max-height: 64px; margin-bottom: 12px;">
                                        <div style="display: flex; gap: 8px; justify-content: center;">
                                            <button class="shopify-button change-icon-btn" style="background: #fff; border: 1px solid #c9cccf; padding: 6px 16px; cursor: pointer; font-size: 13px; border-radius: 4px;">
                                                Change icon
                                            </button>
                                            <button class="shopify-button remove-icon-btn" style="background: #fff; border: 1px solid #c9cccf; padding: 6px 16px; cursor: pointer; font-size: 13px; border-radius: 4px;">
                                                Remove
                                            </button>
                                        </div>
                                    </div>` :
                                    `<button class="shopify-button select-icon-btn" style="background: #fff; border: 1px solid #c9cccf; padding: 8px 24px; cursor: pointer; font-size: 13px; border-radius: 4px;">
                                        Seleccionar
                                    </button>`
                                }
                            </div>
                            <input type="file" id="richText-custom-icon-input" accept="image/*" style="display: none;">
                            <p style="font-size: 12px; color: #6d7175; margin-top: 8px; text-align: center;">Explorar imágenes gratuitas</p>
                        </div>
                        
                        <!-- Icon size -->
                        <div class="settings-field">
                            <label style="display: block; margin-bottom: 8px; font-size: 13px; color: #6d7175;">Icon size</label>
                            <div style="display: flex; align-items: center; gap: 12px;">
                                <input type="range" id="richText-icon-size" min="24" max="120" value="${iconSize}" 
                                       style="flex: 1;" class="shopify-range">
                                <div style="display: flex; align-items: center; gap: 4px;">
                                    <input type="number" id="richText-icon-size-value" min="24" max="120" value="${iconSize}" 
                                           style="width: 50px; padding: 4px 8px; border: 1px solid #c9cccf; border-radius: 4px; text-align: center;">
                                    <span style="font-size: 12px; color: #6d7175;">px</span>
                                </div>
                            </div>
                        </div>
                    </div>
                    
                    <!-- Subheading Section -->
                    <div class="settings-group" style="margin-bottom: 24px; padding-bottom: 24px; border-bottom: 1px solid #e3e3e3;">
                        <h4 style="font-size: 13px; font-weight: 500; margin-bottom: 12px; color: #202223;">Subheading</h4>
                        <div class="settings-field">
                            <label style="display: block; margin-bottom: 8px; font-size: 13px; color: #6d7175;">Subheading</label>
                            <input type="text" id="richText-subheading" value="${subheading}" placeholder="RICH TEXT"
                                   style="width: 100%; padding: 8px 12px; border: 1px solid #c9cccf; border-radius: 4px; font-size: 13px;">
                        </div>
                    </div>
                    
                    <!-- Heading Section -->
                    <div class="settings-group" style="margin-bottom: 24px; padding-bottom: 24px; border-bottom: 1px solid #e3e3e3;">
                        <h4 style="font-size: 13px; font-weight: 500; margin-bottom: 12px; color: #202223;">Heading</h4>
                        
                        <!-- Heading editor -->
                        <div class="settings-field" style="margin-bottom: 16px;">
                            <label style="display: block; margin-bottom: 8px; font-size: 13px; color: #6d7175;">Heading</label>
                            
                            <!-- Mini toolbar for heading -->
                            <div style="border: 1px solid #c9cccf; border-radius: 4px; overflow: hidden;">
                                <div style="background: #f7f7f7; padding: 6px; display: flex; gap: 2px; border-bottom: 1px solid #c9cccf;">
                                    <button class="heading-toolbar-btn" data-command="bold" title="Bold" style="background: white; border: 1px solid #c9cccf; padding: 4px 8px; cursor: pointer; border-radius: 3px;">
                                        <i class="material-icons" style="font-size: 16px;">format_bold</i>
                                    </button>
                                    <button class="heading-toolbar-btn" data-command="italic" title="Italic" style="background: white; border: 1px solid #c9cccf; padding: 4px 8px; cursor: pointer; border-radius: 3px;">
                                        <i class="material-icons" style="font-size: 16px;">format_italic</i>
                                    </button>
                                    <button class="heading-toolbar-btn" data-command="createLink" title="Link" style="background: white; border: 1px solid #c9cccf; padding: 4px 8px; cursor: pointer; border-radius: 3px;">
                                        <i class="material-icons" style="font-size: 16px;">link</i>
                                    </button>
                                </div>
                                <div id="richText-heading-editor" contenteditable="true" 
                                     style="padding: 8px 12px; min-height: 60px; background: white; font-size: 14px;">
                                    ${heading}
                                </div>
                            </div>
                        </div>
                        
                        <!-- Heading size -->
                        <div class="settings-field">
                            <label style="display: block; margin-bottom: 8px; font-size: 13px; color: #6d7175;">Heading size</label>
                            <select id="richText-heading-size" class="shopify-select" style="width: 100%; padding: 8px 12px; border: 1px solid #c9cccf; border-radius: 4px; background: white;">
                                <option value="h1" ${headingSize === 'h1' ? 'selected' : ''}>Heading 1</option>
                                <option value="h2" ${headingSize === 'h2' ? 'selected' : ''}>Heading 2</option>
                                <option value="h3" ${headingSize === 'h3' ? 'selected' : ''}>Heading 3</option>
                                <option value="h4" ${headingSize === 'h4' ? 'selected' : ''}>Heading 4</option>
                                <option value="h5" ${headingSize === 'h5' ? 'selected' : ''}>Heading 5</option>
                                <option value="h6" ${headingSize === 'h6' ? 'selected' : ''}>Heading 6</option>
                                <option value="h7" ${headingSize === 'h7' ? 'selected' : ''}>Heading 7</option>
                            </select>
                        </div>
                    </div>
                    
                    <!-- Text Section -->
                    <div class="settings-group" style="margin-bottom: 24px; padding-bottom: 24px; border-bottom: 1px solid #e3e3e3;">
                        <h4 style="font-size: 13px; font-weight: 500; margin-bottom: 12px; color: #202223;">Text</h4>
                        <p style="font-size: 13px; color: #6d7175; margin-bottom: 16px;">Distribute the section body among up to three columns</p>
                        
                        <!-- Column 1 -->
                        <div class="settings-field" style="margin-bottom: 16px;">
                            <label style="display: block; margin-bottom: 8px; font-size: 13px; color: #6d7175;">Column 1</label>
                            <div style="border: 1px solid #c9cccf; border-radius: 4px; overflow: hidden;">
                                <div style="background: #f7f7f7; padding: 6px; display: flex; gap: 2px; border-bottom: 1px solid #c9cccf;">
                                    ${this.renderTextToolbar('column1')}
                                </div>
                                <div id="richText-column1-editor" contenteditable="true" 
                                     style="padding: 8px 12px; min-height: 100px; background: white; font-size: 13px; line-height: 1.5;">
                                    ${column1}
                                </div>
                            </div>
                        </div>
                        
                        <!-- Column 2 -->
                        <div class="settings-field" style="margin-bottom: 16px;">
                            <label style="display: block; margin-bottom: 8px; font-size: 13px; color: #6d7175;">Column 2</label>
                            <div style="border: 1px solid #c9cccf; border-radius: 4px; overflow: hidden;">
                                <div style="background: #f7f7f7; padding: 6px; display: flex; gap: 2px; border-bottom: 1px solid #c9cccf;">
                                    ${this.renderTextToolbar('column2')}
                                </div>
                                <div id="richText-column2-editor" contenteditable="true" 
                                     style="padding: 8px 12px; min-height: 100px; background: white; font-size: 13px; line-height: 1.5;">
                                    ${column2}
                                </div>
                            </div>
                        </div>
                        
                        <!-- Column 3 -->
                        <div class="settings-field" style="margin-bottom: 16px;">
                            <label style="display: block; margin-bottom: 8px; font-size: 13px; color: #6d7175;">Column 3</label>
                            <div style="border: 1px solid #c9cccf; border-radius: 4px; overflow: hidden;">
                                <div style="background: #f7f7f7; padding: 6px; display: flex; gap: 2px; border-bottom: 1px solid #c9cccf;">
                                    ${this.renderTextToolbar('column3')}
                                </div>
                                <div id="richText-column3-editor" contenteditable="true" 
                                     style="padding: 8px 12px; min-height: 100px; background: white; font-size: 13px; line-height: 1.5;">
                                    ${column3}
                                </div>
                            </div>
                        </div>
                        
                        <!-- Body size -->
                        <div class="settings-field">
                            <label style="display: block; margin-bottom: 8px; font-size: 13px; color: #6d7175;">Body size</label>
                            <select id="richText-body-size" class="shopify-select" style="width: 100%; padding: 8px 12px; border: 1px solid #c9cccf; border-radius: 4px; background: white;">
                                <option value="1" ${bodySize === '1' ? 'selected' : ''}>Body 1</option>
                                <option value="2" ${bodySize === '2' ? 'selected' : ''}>Body 2</option>
                                <option value="3" ${bodySize === '3' ? 'selected' : ''}>Body 3</option>
                                <option value="4" ${bodySize === '4' ? 'selected' : ''}>Body 4</option>
                                <option value="5" ${bodySize === '5' ? 'selected' : ''}>Body 5</option>
                                <option value="6" ${bodySize === '6' ? 'selected' : ''}>Body 6</option>
                            </select>
                        </div>
                    </div>
                    
                    <!-- Buttons Section -->
                    <div class="settings-group">
                        <h4 style="font-size: 13px; font-weight: 500; margin-bottom: 12px; color: #202223;">Buttons</h4>
                        
                        <!-- First button -->
                        <div style="margin-bottom: 20px;">
                            <div class="settings-field" style="margin-bottom: 12px;">
                                <label style="display: block; margin-bottom: 8px; font-size: 13px; color: #6d7175;">First button label</label>
                                <input type="text" id="richText-button1-label" value="${button1Label}" placeholder="Button label"
                                       style="width: 100%; padding: 8px 12px; border: 1px solid #c9cccf; border-radius: 4px; font-size: 13px;">
                            </div>
                            
                            <div class="settings-field" style="margin-bottom: 12px;">
                                <label style="display: block; margin-bottom: 8px; font-size: 13px; color: #6d7175;">First button link</label>
                                <input type="text" id="richText-button1-link" value="${button1Link}" placeholder="Pega un enlace o busca"
                                       style="width: 100%; padding: 8px 12px; border: 1px solid #c9cccf; border-radius: 4px; font-size: 13px;">
                            </div>
                            
                            <div class="settings-field">
                                <label style="display: block; margin-bottom: 8px; font-size: 13px; color: #6d7175;">First button style</label>
                                <div style="display: flex; gap: 8px;">
                                    <button class="button-style-btn ${button1Style === 'solid' ? 'active' : ''}" data-button="1" data-style="solid"
                                            style="flex: 1; padding: 8px; border: 1px solid #c9cccf; background: ${button1Style === 'solid' ? '#005bd3' : '#fff'}; 
                                                   color: ${button1Style === 'solid' ? '#fff' : '#202223'}; cursor: pointer; border-radius: 4px; font-size: 13px;">
                                        Solid
                                    </button>
                                    <button class="button-style-btn ${button1Style === 'outline' ? 'active' : ''}" data-button="1" data-style="outline"
                                            style="flex: 1; padding: 8px; border: 1px solid #c9cccf; background: ${button1Style === 'outline' ? '#005bd3' : '#fff'}; 
                                                   color: ${button1Style === 'outline' ? '#fff' : '#202223'}; cursor: pointer; border-radius: 4px; font-size: 13px;">
                                        Outline
                                    </button>
                                    <button class="button-style-btn ${button1Style === 'text' ? 'active' : ''}" data-button="1" data-style="text"
                                            style="flex: 1; padding: 8px; border: 1px solid #c9cccf; background: ${button1Style === 'text' ? '#005bd3' : '#fff'}; 
                                                   color: ${button1Style === 'text' ? '#fff' : '#202223'}; cursor: pointer; border-radius: 4px; font-size: 13px;">
                                        Text
                                    </button>
                                </div>
                            </div>
                        </div>
                        
                        <!-- Second button -->
                        <div>
                            <div class="settings-field" style="margin-bottom: 12px;">
                                <label style="display: block; margin-bottom: 8px; font-size: 13px; color: #6d7175;">Second button label</label>
                                <input type="text" id="richText-button2-label" value="${button2Label}" placeholder="Button label"
                                       style="width: 100%; padding: 8px 12px; border: 1px solid #c9cccf; border-radius: 4px; font-size: 13px;">
                            </div>
                            
                            <div class="settings-field" style="margin-bottom: 12px;">
                                <label style="display: block; margin-bottom: 8px; font-size: 13px; color: #6d7175;">Second button link</label>
                                <input type="text" id="richText-button2-link" value="${button2Link}" placeholder="Pega un enlace o busca"
                                       style="width: 100%; padding: 8px 12px; border: 1px solid #c9cccf; border-radius: 4px; font-size: 13px;">
                            </div>
                            
                            <div class="settings-field">
                                <label style="display: block; margin-bottom: 8px; font-size: 13px; color: #6d7175;">Second button style</label>
                                <div style="display: flex; gap: 8px;">
                                    <button class="button-style-btn ${button2Style === 'solid' ? 'active' : ''}" data-button="2" data-style="solid"
                                            style="flex: 1; padding: 8px; border: 1px solid #c9cccf; background: ${button2Style === 'solid' ? '#005bd3' : '#fff'}; 
                                                   color: ${button2Style === 'solid' ? '#fff' : '#202223'}; cursor: pointer; border-radius: 4px; font-size: 13px;">
                                        Solid
                                    </button>
                                    <button class="button-style-btn ${button2Style === 'outline' ? 'active' : ''}" data-button="2" data-style="outline"
                                            style="flex: 1; padding: 8px; border: 1px solid #c9cccf; background: ${button2Style === 'outline' ? '#005bd3' : '#fff'}; 
                                                   color: ${button2Style === 'outline' ? '#fff' : '#202223'}; cursor: pointer; border-radius: 4px; font-size: 13px;">
                                        Outline
                                    </button>
                                    <button class="button-style-btn ${button2Style === 'text' ? 'active' : ''}" data-button="2" data-style="text"
                                            style="flex: 1; padding: 8px; border: 1px solid #c9cccf; background: ${button2Style === 'text' ? '#005bd3' : '#fff'}; 
                                                   color: ${button2Style === 'text' ? '#fff' : '#202223'}; cursor: pointer; border-radius: 4px; font-size: 13px;">
                                        Text
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `;
    },
    
    renderTextToolbar: function(columnId) {
        return `
            <button class="column-toolbar-btn" data-column="${columnId}" data-command="bold" title="Bold" style="background: white; border: 1px solid #c9cccf; padding: 2px 6px; cursor: pointer; border-radius: 3px;">
                <i class="material-icons" style="font-size: 14px;">format_bold</i>
            </button>
            <div style="width: 1px; background: #ddd; margin: 0 2px;"></div>
            <button class="column-toolbar-btn" data-column="${columnId}" data-command="heading" title="Heading" style="background: white; border: 1px solid #c9cccf; padding: 2px 6px; cursor: pointer; border-radius: 3px;">
                <span style="font-size: 12px; font-weight: 600;">Aa</span>
            </button>
            <button class="column-toolbar-btn" data-column="${columnId}" data-command="bold" title="Bold" style="background: white; border: 1px solid #c9cccf; padding: 2px 6px; cursor: pointer; border-radius: 3px;">
                <i class="material-icons" style="font-size: 14px;">format_bold</i>
            </button>
            <button class="column-toolbar-btn" data-column="${columnId}" data-command="italic" title="Italic" style="background: white; border: 1px solid #c9cccf; padding: 2px 6px; cursor: pointer; border-radius: 3px;">
                <i class="material-icons" style="font-size: 14px;">format_italic</i>
            </button>
            <button class="column-toolbar-btn" data-column="${columnId}" data-command="createLink" title="Link" style="background: white; border: 1px solid #c9cccf; padding: 2px 6px; cursor: pointer; border-radius: 3px;">
                <i class="material-icons" style="font-size: 14px;">link</i>
            </button>
            <button class="column-toolbar-btn" data-column="${columnId}" data-command="insertUnorderedList" title="Bullet List" style="background: white; border: 1px solid #c9cccf; padding: 2px 6px; cursor: pointer; border-radius: 3px;">
                <i class="material-icons" style="font-size: 14px;">format_list_bulleted</i>
            </button>
            <button class="column-toolbar-btn" data-column="${columnId}" data-command="insertOrderedList" title="Numbered List" style="background: white; border: 1px solid #c9cccf; padding: 2px 6px; cursor: pointer; border-radius: 3px;">
                <i class="material-icons" style="font-size: 14px;">format_list_numbered</i>
            </button>
        `;
    },
    
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
            
            // Shop
            { value: 'store', label: 'Shop', group: 'Commerce' },
            { value: 'shopping_bag', label: 'Bag', group: 'Commerce' },
            { value: 'shopping_cart', label: 'Cart', group: 'Commerce' },
            { value: 'local_offer', label: 'Coupon', group: 'Commerce' },
            { value: 'card_giftcard', label: 'Gift', group: 'Commerce' },
            { value: 'sell', label: 'Discount outline', group: 'Commerce' },
            { value: 'discount', label: 'Discount solid', group: 'Commerce' },
            
            // Communication
            { value: 'email', label: 'Email', group: 'Communication' },
            { value: 'phone', label: 'Phone', group: 'Communication' },
            { value: 'chat', label: 'Chat', group: 'Communication' },
            { value: 'message', label: 'Message', group: 'Communication' },
            { value: 'forum', label: 'Forum', group: 'Communication' },
            
            // Transport
            { value: 'local_shipping', label: 'Truck', group: 'Transport' },
            { value: 'flight', label: 'Plane', group: 'Transport' },
            { value: 'directions_car', label: 'Car', group: 'Transport' }
        ];
        
        let optionsHtml = '';
        let currentGroup = '';
        
        icons.forEach(icon => {
            if (icon.group !== currentGroup) {
                if (currentGroup !== '') {
                    optionsHtml += '</optgroup>';
                }
                currentGroup = icon.group;
                optionsHtml += `<optgroup label="${currentGroup}">`;
            }
            optionsHtml += `<option value="${icon.value}" ${selectedIcon === icon.value ? 'selected' : ''}>${icon.label}</option>`;
        });
        
        if (currentGroup !== '') {
            optionsHtml += '</optgroup>';
        }
        
        return optionsHtml;
    },
    
    attachEventListeners: function() {
        console.log('[RICHTEXT] Attaching event listeners');
        
        // Helper function to update config
        const updateConfig = (key, value) => {
            if (window.currentSectionsConfig.richText) {
                window.currentSectionsConfig.richText[key] = value;
                
                window.setHasPendingPageStructureChanges(true);
                window.updateSaveButtonState();
                window.renderPreview();
            }
        };
        
        // Back button
        $('.back-to-sections-btn').off('click').on('click', function() {
            window.switchSidebarView('blockList');
        });
        
        // Color scheme
        $('#richText-color-scheme').on('change', function() {
            updateConfig('colorScheme', $(this).val());
        });
        
        // Color background toggle
        $('#richText-color-background').on('change', function() {
            const isChecked = $(this).is(':checked');
            updateConfig('colorBackground', isChecked);
        });
        
        // Width
        $('#richText-width').on('change', function() {
            updateConfig('width', $(this).val());
        });
        
        // Content alignment buttons
        $('.alignment-btn').on('click', function() {
            const alignment = $(this).data('align');
            
            // Update visual state
            $('.alignment-btn').css({
                'background': '#fff',
                'color': '#202223'
            });
            $(this).css({
                'background': '#005bd3',
                'color': '#fff'
            });
            
            updateConfig('contentAlignment', alignment);
        });
        
        // Add side paddings toggle
        $('#richText-add-side-paddings').on('change', function() {
            const isChecked = $(this).is(':checked');
            updateConfig('addSidePaddings', isChecked);
        });
        
        // Top padding
        $('#richText-padding-top').on('input', function() {
            const value = $(this).val();
            $('#richText-padding-top-value').val(value);
            updateConfig('paddingTop', parseInt(value));
        });
        
        $('#richText-padding-top-value').on('input', function() {
            const value = $(this).val();
            $('#richText-padding-top').val(value);
            updateConfig('paddingTop', parseInt(value));
        });
        
        // Bottom padding
        $('#richText-padding-bottom').on('input', function() {
            const value = $(this).val();
            $('#richText-padding-bottom-value').val(value);
            updateConfig('paddingBottom', parseInt(value));
        });
        
        $('#richText-padding-bottom-value').on('input', function() {
            const value = $(this).val();
            $('#richText-padding-bottom').val(value);
            updateConfig('paddingBottom', parseInt(value));
        });
        
        // Icon selector
        $('#richText-icon').on('change', function() {
            updateConfig('icon', $(this).val());
        });
        
        // Custom icon upload
        $('.select-icon-btn, .change-icon-btn').on('click', function(e) {
            e.preventDefault();
            $('#richText-custom-icon-input').click();
        });
        
        // Remove custom icon
        $('.remove-icon-btn').on('click', function(e) {
            e.preventDefault();
            updateConfig('customIcon', '');
            updateConfig('icon', 'none');
            
            // Update UI
            $('.custom-icon-upload').html(`
                <button class="shopify-button select-icon-btn" style="background: #fff; border: 1px solid #c9cccf; padding: 8px 24px; cursor: pointer; font-size: 13px; border-radius: 4px;">
                    Seleccionar
                </button>
            `);
            
            // Re-attach event listener
            $('.select-icon-btn').on('click', function(e) {
                e.preventDefault();
                $('#richText-custom-icon-input').click();
            });
        });
        
        // Handle file upload
        $('#richText-custom-icon-input').on('change', async function(e) {
            const file = e.target.files[0];
            if (file) {
                // For now, use a data URL
                const reader = new FileReader();
                reader.onload = function(e) {
                    const dataUrl = e.target.result;
                    updateConfig('customIcon', dataUrl);
                    updateConfig('icon', 'custom');
                    
                    // Update UI
                    $('.custom-icon-upload').html(`
                        <div class="custom-icon-preview">
                            <img src="${dataUrl}" alt="Custom icon" style="max-width: 64px; max-height: 64px; margin-bottom: 12px;">
                            <div style="display: flex; gap: 8px; justify-content: center;">
                                <button class="shopify-button change-icon-btn" style="background: #fff; border: 1px solid #c9cccf; padding: 6px 16px; cursor: pointer; font-size: 13px; border-radius: 4px;">
                                    Change icon
                                </button>
                                <button class="shopify-button remove-icon-btn" style="background: #fff; border: 1px solid #c9cccf; padding: 6px 16px; cursor: pointer; font-size: 13px; border-radius: 4px;">
                                    Remove
                                </button>
                            </div>
                        </div>
                    `);
                    
                    // Re-attach event listeners
                    $('.change-icon-btn').on('click', function(e) {
                        e.preventDefault();
                        $('#richText-custom-icon-input').click();
                    });
                    
                    $('.remove-icon-btn').on('click', function(e) {
                        e.preventDefault();
                        updateConfig('customIcon', '');
                        updateConfig('icon', 'none');
                        
                        $('.custom-icon-upload').html(`
                            <button class="shopify-button select-icon-btn" style="background: #fff; border: 1px solid #c9cccf; padding: 8px 24px; cursor: pointer; font-size: 13px; border-radius: 4px;">
                                Seleccionar
                            </button>
                        `);
                        
                        $('.select-icon-btn').on('click', function(e) {
                            e.preventDefault();
                            $('#richText-custom-icon-input').click();
                        });
                    });
                };
                reader.readAsDataURL(file);
            }
        });
        
        // Icon size
        $('#richText-icon-size').on('input', function() {
            const value = $(this).val();
            $('#richText-icon-size-value').val(value);
            updateConfig('iconSize', parseInt(value));
        });
        
        $('#richText-icon-size-value').on('change', function() {
            const value = $(this).val();
            $('#richText-icon-size').val(value);
            updateConfig('iconSize', parseInt(value));
        });
        
        // Subheading
        $('#richText-subheading').on('input', function() {
            updateConfig('subheading', $(this).val());
        });
        
        // Heading editor
        $('#richText-heading-editor').on('input blur', function() {
            updateConfig('heading', $(this).html());
        });
        
        // Heading toolbar
        $('.heading-toolbar-btn').on('click', function(e) {
            e.preventDefault();
            const command = $(this).data('command');
            
            // Save selection before showing prompt
            const selection = window.getSelection();
            const range = selection.rangeCount > 0 ? selection.getRangeAt(0) : null;
            
            if (command === 'createLink') {
                const url = prompt('Enter URL:');
                if (url && range) {
                    // Restore selection
                    selection.removeAllRanges();
                    selection.addRange(range);
                    document.execCommand('createLink', false, url);
                    $('#richText-heading-editor').trigger('input');
                }
            } else {
                document.execCommand(command, false, null);
                $('#richText-heading-editor').trigger('input');
            }
            
            $('#richText-heading-editor').focus();
        });
        
        // Heading size
        $('#richText-heading-size').on('change', function() {
            updateConfig('headingSize', $(this).val());
        });
        
        // Column editors
        $('#richText-column1-editor').on('input blur', function() {
            updateConfig('column1', $(this).html());
        });
        
        $('#richText-column2-editor').on('input blur', function() {
            updateConfig('column2', $(this).html());
        });
        
        $('#richText-column3-editor').on('input blur', function() {
            updateConfig('column3', $(this).html());
        });
        
        // Column toolbar buttons
        $('.column-toolbar-btn').on('click', function(e) {
            e.preventDefault();
            const command = $(this).data('command');
            const columnId = $(this).data('column');
            const editorId = `#richText-${columnId}-editor`;
            
            if (command === 'heading') {
                // Insert heading tag
                document.execCommand('formatBlock', false, 'h3');
                $(editorId).trigger('input');
            } else if (command === 'createLink') {
                const url = prompt('Enter URL:');
                if (url) {
                    document.execCommand('createLink', false, url);
                    $(editorId).trigger('input');
                }
            } else {
                document.execCommand(command, false, null);
                $(editorId).trigger('input');
            }
            
            $(editorId).focus();
        });
        
        // Body size
        $('#richText-body-size').on('change', function() {
            updateConfig('bodySize', $(this).val());
        });
        
        // Button fields
        $('#richText-button1-label').on('input', function() {
            updateConfig('button1Label', $(this).val());
        });
        
        $('#richText-button1-link').on('input', function() {
            updateConfig('button1Link', $(this).val());
        });
        
        $('#richText-button2-label').on('input', function() {
            updateConfig('button2Label', $(this).val());
        });
        
        $('#richText-button2-link').on('input', function() {
            updateConfig('button2Link', $(this).val());
        });
        
        // Button style buttons
        $('.button-style-btn').on('click', function() {
            const buttonNum = $(this).data('button');
            const style = $(this).data('style');
            
            // Update visual state for this button group
            $(`.button-style-btn[data-button="${buttonNum}"]`).css({
                'background': '#fff',
                'color': '#202223'
            });
            $(this).css({
                'background': '#005bd3',
                'color': '#fff'
            });
            
            // Update config
            if (buttonNum === 1) {
                updateConfig('button1Style', style);
            } else {
                updateConfig('button2Style', style);
            }
        });
        
        // Alignment buttons
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
        
        // Padding sliders
        $('#richText-padding-top').on('input', function() {
            const value = $(this).val();
            $('#richText-padding-top-value').val(value);
            updateConfig('paddingTop', parseInt(value));
        });
        
        $('#richText-padding-top-value').on('change', function() {
            const value = $(this).val();
            $('#richText-padding-top').val(value);
            updateConfig('paddingTop', parseInt(value));
        });
        
        $('#richText-padding-bottom').on('input', function() {
            const value = $(this).val();
            $('#richText-padding-bottom-value').val(value);
            updateConfig('paddingBottom', parseInt(value));
        });
        
        $('#richText-padding-bottom-value').on('change', function() {
            const value = $(this).val();
            $('#richText-padding-bottom').val(value);
            updateConfig('paddingBottom', parseInt(value));
        });
        
        // Apply translations
        setTimeout(() => {
            if (window.applyTranslations) {
                window.applyTranslations();
            }
        }, 100);
    },
    
    initialize: function() {}
};