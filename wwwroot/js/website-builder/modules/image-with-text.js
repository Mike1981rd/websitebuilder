// Módulo Image with Text para Website Builder
window.WebsiteBuilderModules = window.WebsiteBuilderModules || {};
window.WebsiteBuilderModules.ImageWithText = {
    render: function(config) {
        if (!config || config.isHidden) return '';
        
        // Obtener configuraciones globales
        const schemeColors = getColorSchemeValues(config.colorScheme || 'scheme1');
        
        // Generar ID único para responsividad
        const uniqueId = 'image-with-text-' + Date.now();
        
        // Detectar si estamos en el editor
        const isInEditor = (typeof window !== 'undefined' && 
                           window.parent !== window && 
                           window.parent.document && 
                           window.parent.document.getElementById('preview-iframe'));
        
        // Renderizar bloques hijos
        // Collect all visible blocks/images
        const visibleBlocks = [];
        if (config.blocks && config.blockOrder) {
            config.blockOrder.forEach(blockId => {
                const block = config.blocks[blockId];
                if (block && !block.isHidden) {
                    visibleBlocks.push(block);
                }
            });
        }
        
        // Render the section with content on one side and images on the other
        let sectionHtml = '';
        if (visibleBlocks.length > 0 || config.image) {
            sectionHtml = window.WebsiteBuilderModules.ImageWithText.renderSectionLayout(config, visibleBlocks, schemeColors, uniqueId);
        } else {
            // Default content when no images
            sectionHtml = window.WebsiteBuilderModules.ImageWithText.renderContent(config, uniqueId);
        }
        
        // Valores por defecto
        const topPadding = config.topPadding || 48;
        const bottomPadding = config.bottomPadding || 48;
        const sidePadding = config.addSidePaddings ? '50px' : '0';
        const sectionTopPadding = config.sectionTopPadding === 0 || config.sectionTopPadding === '0' ? -10 : (config.sectionTopPadding || 0);
        const sectionBottomPadding = config.sectionBottomPadding === 0 || config.sectionBottomPadding === '0' ? -10 : (config.sectionBottomPadding || 0);
        
        return `
            <style>
                #${uniqueId} {
                    background-color: ${schemeColors.background};
                    padding: ${topPadding}px ${sidePadding} ${bottomPadding}px;
                    position: relative;
                }
                
                #${uniqueId} .container {
                    max-width: ${config.fullWidth ? '100%' : '1200px'};
                    margin: 0 auto;
                    padding: 0 ${config.fullWidth ? '0' : '30px'};
                    position: relative;
                }
                
                /* Mobile responsiveness */
                @media (max-width: 768px) {
                    #${uniqueId} {
                        padding: 30px 0 !important;
                    }
                    
                    #${uniqueId} .container {
                        padding: 0 20px !important;
                    }
                    
                    /* Force vertical layout on mobile - target the grid container */
                    #${uniqueId} .image-text-grid {
                        display: flex !important;
                        flex-direction: column !important;
                        gap: 30px !important;
                    }
                    
                    /* Force images to be first on mobile */
                    #${uniqueId} .images-section {
                        order: -1 !important;
                    }
                    
                    /* Force content to be second on mobile */
                    #${uniqueId} .content-section {
                        order: 1 !important;
                    }
                    
                    /* Ensure content wrapper is centered */
                    #${uniqueId} .content-wrapper {
                        max-width: 100% !important;
                        text-align: center !important;
                    }
                    
                    /* Center align text elements on mobile */
                    #${uniqueId} h2,
                    #${uniqueId} .subheading,
                    #${uniqueId} .text-content {
                        text-align: center !important;
                    }
                    
                    /* Adjust font sizes for mobile */
                    #${uniqueId} h2 {
                        font-size: 28px !important;
                    }
                    
                    #${uniqueId} .text-content {
                        font-size: 16px !important;
                    }
                    
                    /* Center buttons on mobile */
                    #${uniqueId} .buttons-wrapper {
                        justify-content: center !important;
                    }
                    
                    /* Adjust collage layout for mobile */
                    #${uniqueId} .collage-container {
                        height: auto !important;
                        display: flex !important;
                        flex-direction: column !important;
                        gap: 15px !important;
                    }
                    
                    #${uniqueId} .collage-container .collage-item {
                        position: relative !important;
                        width: 100% !important;
                        height: auto !important;
                        margin-bottom: 0 !important;
                        top: auto !important;
                        left: auto !important;
                        right: auto !important;
                        bottom: auto !important;
                    }
                    
                    #${uniqueId} .collage-container .collage-item > div {
                        transform: none !important;
                        aspect-ratio: 4/3 !important;
                    }
                    
                    /* Grid adjustments for mobile */
                    #${uniqueId} .images-grid {
                        grid-template-columns: 1fr !important;
                        grid-template-rows: auto !important;
                        gap: 15px !important;
                    }
                    
                    #${uniqueId} .images-grid .image-card {
                        transform: none !important;
                        aspect-ratio: 4/3 !important;
                    }
                    
                    /* Icon centering */
                    #${uniqueId} .icon-wrapper {
                        text-align: center !important;
                    }
                }
            </style>
            
            <div class="section-spacing-wrapper" style="padding-top: ${sectionTopPadding}px; padding-bottom: ${sectionBottomPadding}px;">
                <div id="${uniqueId}" class="section-wrapper image-with-text-section" data-section-id="imageWithText">
                    ${isInEditor ? `
                        <div class="section-header-tag">
                            <span class="material-symbols-outlined">image</span>
                            Image with text
                        </div>
                    ` : ''}
                    
                    <!-- Content will be rendered here -->
                    
                    <div class="container">
                        ${sectionHtml}
                    </div>
                </div>
            </div>
        `;
    },
    
    renderSectionLayout: function(config, blocks, schemeColors, uniqueId) {
        // Get typography settings from global window object
        const globalSettings = window.currentGlobalThemeSettings || {};
        const headingTypography = globalSettings.typography?.heading || { font: 'roboto', fontSize: 100 };
        const bodyTypography = globalSettings.typography?.body || { font: 'roboto', fontSize: 100 };
        
        const headingFont = window.getFontNameFromValueSafe ? 
            window.getFontNameFromValueSafe(headingTypography.font || 'helvetica') : 
            'Helvetica';
        
        const bodyFont = window.getFontNameFromValueSafe ? 
            window.getFontNameFromValueSafe(bodyTypography.font || 'roboto') : 
            'Roboto';
        
        // Layout configuration
        const contentLayout = config.contentLayout || 'left';
        const contentOnLeft = contentLayout === 'left';
        const imageLayout = config.imageLayout || 'grid';
        
        // Combine all images from blocks
        const allImages = [];
        blocks.forEach(block => {
            if (block.images && block.images.length > 0) {
                allImages.push(...block.images);
            } else if (block.image) {
                allImages.push({ src: block.image, alt: block.imageAlt || '' });
            }
        });
        
        console.log('[IMAGE-WITH-TEXT] renderSectionLayout:', {
            blocksCount: blocks.length,
            allImagesCount: allImages.length,
            imageLayout,
            contentLayout,
            contentOnLeft
        });
        
        // Render images based on layout
        let imagesHtml = '';
        if (allImages.length > 0) {
            // Explicitly check for collage with multiple images
            if (imageLayout === 'collage' && allImages.length > 1) {
                // Collage layout - overlapping images with card style
                imagesHtml = `
                    <div class="collage-container" style="
                        position: relative;
                        width: 100%;
                        height: ${400 * (config.imageRatio || 100) / 100}px;
                    ">
                        ${allImages.slice(0, 6).map((image, index) => {
                            let styles = '';
                            // Define rotation angles for collage mode
                            const rotations = [-8, 5, -6, 7, -4, 3];
                            const rotation = config.rotateImages ? rotations[index % 6] : 0;
                            
                            if (index === 0) {
                                // Main large image on the left
                                styles = 'position: absolute; top: 0; left: 0; width: 65%; height: 100%; z-index: 1;';
                            } else if (index === 1) {
                                // Second image overlapping bottom right
                                styles = 'position: absolute; bottom: -20px; right: 10px; width: 45%; height: 60%; z-index: 2;';
                            } else if (index === 2) {
                                // Third image top right
                                styles = 'position: absolute; top: -10px; right: 50px; width: 35%; height: 45%; z-index: 3;';
                            } else if (index === 3) {
                                // Fourth image middle left overlapping
                                styles = 'position: absolute; top: 30%; left: -20px; width: 30%; height: 40%; z-index: 4;';
                            } else if (index === 4) {
                                // Fifth image bottom center
                                styles = 'position: absolute; bottom: -15px; left: 35%; width: 25%; height: 35%; z-index: 5;';
                            } else if (index === 5) {
                                // Sixth image small top center
                                styles = 'position: absolute; top: 10px; left: 40%; width: 20%; height: 30%; z-index: 6;';
                            }
                            
                            return `
                                <div class="collage-item" style="${styles}">
                                    <div style="
                                        background: #ffffff;
                                        border-radius: ${config.cardBorderRadius || 20}px;
                                        overflow: hidden;
                                        box-shadow: 0 8px 30px rgba(0, 0, 0, 0.12);
                                        height: 100%;
                                        transition: transform 0.3s ease, box-shadow 0.3s ease;
                                        cursor: pointer;
                                        transform: rotate(${rotation}deg);
                                    "
                                    onmouseover="this.style.transform='rotate(${rotation}deg) translateY(-4px) scale(1.02)'; this.style.boxShadow='0 12px 40px rgba(0, 0, 0, 0.18)';"
                                    onmouseout="this.style.transform='rotate(${rotation}deg) translateY(0) scale(1)'; this.style.boxShadow='0 8px 30px rgba(0, 0, 0, 0.12)';">
                                        <img src="${image.src || image}" 
                                             alt="${image.alt || 'Image ' + (index + 1)}"
                                             style="width: 100%; height: 100%; object-fit: cover;">
                                    </div>
                                </div>
                            `;
                        }).join('')}
                    </div>
                `;
            } else {
                // Grid layout - adapts to number of images
                const gridColumns = allImages.length === 1 ? '1fr' : 
                                   allImages.length === 2 ? 'repeat(2, 1fr)' : 
                                   'repeat(2, 1fr)';
                const gridRows = allImages.length <= 2 ? '1fr' : 'repeat(2, 1fr)';
                
                imagesHtml = `
                    <div class="images-grid" style="
                        display: grid;
                        grid-template-columns: ${gridColumns};
                        grid-template-rows: ${gridRows};
                        gap: 30px;
                        width: 100%;
                    ">
                        ${allImages.slice(0, 4).map((image, index) => {
                            // Define rotation angles for each image position
                            const rotations = [-5, 3, -3, 5];
                            const rotation = config.rotateImages ? rotations[index % 4] : 0;
                            
                            return `
                            <div class="image-card" style="
                                background: #ffffff;
                                border-radius: ${config.cardBorderRadius || 20}px;
                                overflow: hidden;
                                box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
                                transition: transform 0.3s ease, box-shadow 0.3s ease;
                                cursor: pointer;
                                border: 1px solid rgba(0, 0, 0, 0.05);
                                aspect-ratio: 100/${config.imageRatio || 100};
                                transform: rotate(${rotation}deg);
                            "
                            onmouseover="this.style.transform='rotate(${rotation}deg) translateY(-8px)'; this.style.boxShadow='0 12px 40px rgba(0, 0, 0, 0.15)';"
                            onmouseout="this.style.transform='rotate(${rotation}deg) translateY(0)'; this.style.boxShadow='0 4px 20px rgba(0, 0, 0, 0.1)';">
                                <img src="${image.src || image}" 
                                     alt="${image.alt || 'Image ' + (index + 1)}"
                                     style="width: 100%; height: 100%; object-fit: cover; display: block;">
                            </div>
                            `;
                        }).join('')}
                    </div>
                `;
            }
        } else {
            // Placeholder
            imagesHtml = `
                <div style="background: ${schemeColors.foreground}; 
                            height: 400px; 
                            display: flex; 
                            align-items: center; 
                            justify-content: center; 
                            color: ${schemeColors.text}; 
                            opacity: 0.5;">
                    <span class="material-symbols-outlined" style="font-size: 64px;">add_photo_alternate</span>
                </div>
            `;
        }
        
        // Content section
        const contentHtml = `
            <div class="content-wrapper" style="text-align: ${config.contentAlignment || 'left'};">
                ${config.icon && config.icon !== 'none' ? `
                    <div class="icon-wrapper" style="margin-bottom: 20px;">
                        ${config.icon === 'custom' && config.customIcon ? 
                            `<img src="${config.customIcon}" alt="Icon" style="max-width: 48px; max-height: 48px;">` :
                            `<span class="material-icons" style="font-size: 48px; color: ${schemeColors.text};">${config.icon}</span>`
                        }
                    </div>
                ` : ''}
                
                ${config.subheading ? `
                    <div class="subheading" style="
                        font-family: ${bodyFont}, sans-serif; 
                        font-size: ${Math.round(16 * (bodyTypography.fontSize || 100) / 100)}px; 
                        color: ${schemeColors.text}; 
                        opacity: 0.7; 
                        margin-bottom: 12px;
                        ${bodyTypography.uppercase ? 'text-transform: uppercase;' : ''}
                        letter-spacing: ${bodyTypography.letterSpacing || '0px'};
                    ">${config.subheading}</div>
                ` : ''}
                
                ${config.heading ? `
                    <h2 style="
                        font-family: ${headingFont}, sans-serif; 
                        font-size: ${(() => {
                            const baseSizeMap = {
                                'h0': 64,
                                'h1': 48,
                                'h2': 36,
                                'h3': 28,
                                'h4': 24,
                                'h5': 20,
                                'h6': 18,
                                'h7': 16
                            };
                            const baseSize = baseSizeMap[config.headingSize] || 36;
                            const globalHeadingSize = headingTypography.fontSize || 100;
                            return Math.round(baseSize * globalHeadingSize / 100) + 'px';
                        })()}; 
                        font-weight: 400;
                        line-height: 1.2;
                        color: ${schemeColors.text};
                        margin: 0 0 24px 0;
                        ${headingTypography.uppercase ? 'text-transform: uppercase;' : ''}
                        letter-spacing: ${headingTypography.letterSpacing || '0px'};
                    ">${config.heading}</h2>
                ` : ''}
                
                ${config.body ? `
                    <div class="text-content" style="
                        font-family: ${bodyFont}, sans-serif; 
                        font-size: ${(() => {
                            const baseSizeMap = {
                                'body0': 24,
                                'body1': 20,
                                'body2': 18,
                                'body3': 16,
                                'body4': 14,
                                'body5': 13,
                                'body6': 12
                            };
                            const baseSize = baseSizeMap[config.bodySize] || 16;
                            const globalBodySize = bodyTypography.fontSize || 100;
                            return Math.round(baseSize * globalBodySize / 100) + 'px';
                        })()}; 
                        line-height: 1.6; 
                        color: ${schemeColors.text};
                        opacity: 0.8;
                        margin-bottom: 32px;
                        ${bodyTypography.uppercase ? 'text-transform: uppercase;' : ''}
                        letter-spacing: ${bodyTypography.letterSpacing || '0px'};
                    ">${config.body}</div>
                ` : ''}
                
                ${(config.firstButtonLabel || config.secondButtonLabel) ? `
                    <div class="buttons-wrapper" style="display: flex; gap: 16px; flex-wrap: wrap;">
                        ${config.firstButtonLabel ? `
                            <a href="${config.firstButtonLink || '#'}" 
                               class="button ${config.firstButtonStyle || 'solid'}" 
                               style="
                                   display: inline-block;
                                   padding: 12px 24px;
                                   font-size: 14px;
                                   font-family: ${bodyFont}, sans-serif;
                                   text-decoration: none;
                                   border-radius: 4px;
                                   transition: all 0.2s;
                                   ${config.firstButtonStyle === 'outline' ? `
                                       background: transparent;
                                       border: 2px solid ${schemeColors.text};
                                       color: ${schemeColors.text};
                                   ` : config.firstButtonStyle === 'text' ? `
                                       background: transparent;
                                       border: none;
                                       color: ${schemeColors.text};
                                       text-decoration: underline;
                                       padding: 0;
                                   ` : `
                                       background: ${schemeColors.text};
                                       color: ${schemeColors.background};
                                       border: 2px solid ${schemeColors.text};
                                   `}
                               ">
                                ${config.firstButtonLabel}
                            </a>
                        ` : ''}
                        ${config.secondButtonLabel ? `
                            <a href="${config.secondButtonLink || '#'}" 
                               class="button ${config.secondButtonStyle || 'outline'}"
                               style="
                                   display: inline-block;
                                   padding: 12px 24px;
                                   font-size: 14px;
                                   font-family: ${bodyFont}, sans-serif;
                                   text-decoration: none;
                                   border-radius: 4px;
                                   transition: all 0.2s;
                                   ${config.secondButtonStyle === 'solid' ? `
                                       background: ${schemeColors.text};
                                       color: ${schemeColors.background};
                                       border: 2px solid ${schemeColors.text};
                                   ` : config.secondButtonStyle === 'text' ? `
                                       background: transparent;
                                       border: none;
                                       color: ${schemeColors.text};
                                       text-decoration: underline;
                                       padding: 0;
                                   ` : `
                                       background: transparent;
                                       border: 2px solid ${schemeColors.text};
                                       color: ${schemeColors.text};
                                   `}
                               ">
                                ${config.secondButtonLabel}
                            </a>
                        ` : ''}
                    </div>
                ` : ''}
            </div>
        `;
        
        // Return layout based on content position
        const imagesOrder = contentOnLeft ? 2 : 1;
        const contentOrder = contentOnLeft ? 1 : 2;
        
        return `
            <div class="image-text-grid" style="display: grid; grid-template-columns: 1fr 1fr; gap: 60px; align-items: center;">
                <div class="images-section" style="order: ${imagesOrder};">${imagesHtml}</div>
                <div class="content-section" style="order: ${contentOrder};">${contentHtml}</div>
            </div>
        `;
    },
    
    renderContent: function(config, uniqueId) {
        // Obtener esquema de colores
        const schemeColors = getColorSchemeValues(config.colorScheme || 'scheme1');
        
        // Obtener tipografía del sistema desde window
        const globalSettings = window.currentGlobalThemeSettings || {};
        const headingTypography = globalSettings.typography?.heading || { font: 'roboto', fontSize: 100 };
        const bodyTypography = globalSettings.typography?.body || { font: 'roboto', fontSize: 100 };
        
        // Usar función helper para obtener nombre correcto de fuente
        const headingFont = window.getFontNameFromValueSafe ? 
            window.getFontNameFromValueSafe(headingTypography.font || 'roboto') : 
            'Roboto';
        const bodyFont = window.getFontNameFromValueSafe ? 
            window.getFontNameFromValueSafe(bodyTypography.font || 'roboto') : 
            'Roboto';
        
        // Determinar tamaños según configuración
        const headingSizes = {
            'h1': '40px',
            'h2': '32px',
            'h3': '24px'
        };
        const headingSize = headingSizes[config.headingSize || 'h2'];
        
        const bodySizes = {
            'body1': '18px',
            'body2': '16px',
            'body3': '14px',
            'body4': '12px'
        };
        const bodySize = bodySizes[config.bodySize || 'body3'];
        
        // Configurar layout
        const imageLayout = config.imageLayout || 'grid';
        const isGridLayout = imageLayout === 'grid';
        const contentOnLeft = config.contentLayout === 'left';
        const contentAlignment = config.contentAlignment || 'left';
        const desktopWidth = config.desktopWidth || 360;
        
        // El icono se usa directamente ya que coincide con Material Icons
        const iconName = config.icon || '';
        
        return `
            <div class="image-text-content" style="display: grid; grid-template-columns: 1fr 1fr; gap: 50px; align-items: center;">
                <style>
                    #${uniqueId} .content-wrapper {
                        ${contentOnLeft ? 'order: 1;' : 'order: 2;'}
                        max-width: ${desktopWidth}px;
                    }
                    
                    #${uniqueId} .image-wrapper {
                        ${contentOnLeft ? 'order: 2;' : 'order: 1;'}
                    }
                    
                    #${uniqueId} .icon-wrapper {
                        margin-bottom: 20px;
                        text-align: ${contentAlignment};
                    }
                    
                    #${uniqueId} .icon-wrapper .material-icons {
                        font-size: 48px;
                        color: ${schemeColors.text};
                        opacity: 0.8;
                    }
                    
                    #${uniqueId} .subheading {
                        font-family: ${bodyFont}, sans-serif;
                        font-size: ${parseInt(bodySize) + 2}px;
                        color: ${schemeColors.text};
                        opacity: 0.8;
                        margin: 0 0 10px 0;
                        text-align: ${contentAlignment};
                        ${bodyTypography.uppercase ? 'text-transform: uppercase;' : ''}
                        letter-spacing: ${bodyTypography.letterSpacing || '0px'};
                    }
                    
                    #${uniqueId} h2 {
                        font-family: ${headingFont}, serif;
                        font-size: ${headingSize};
                        ${headingTypography.uppercase ? 'text-transform: uppercase;' : ''}
                        letter-spacing: ${headingTypography.letterSpacing || '0px'};
                        font-weight: 600;
                        color: ${schemeColors.text};
                        margin: 0 0 20px 0;
                        text-align: ${contentAlignment};
                        line-height: 1.2;
                    }
                    
                    #${uniqueId} .body-content {
                        font-family: ${bodyFont}, sans-serif;
                        font-size: ${bodySize};
                        ${bodyTypography.uppercase ? 'text-transform: uppercase;' : ''}
                        letter-spacing: ${bodyTypography.letterSpacing || '0px'};
                        line-height: 1.6;
                        color: ${schemeColors.text};
                        margin: 0 0 25px 0;
                        text-align: ${contentAlignment};
                        white-space: pre-wrap;
                    }
                    
                    #${uniqueId} .buttons-wrapper {
                        display: flex;
                        gap: 15px;
                        flex-wrap: wrap;
                        justify-content: ${contentAlignment === 'center' ? 'center' : contentAlignment === 'right' ? 'flex-end' : 'flex-start'};
                    }
                    
                    #${uniqueId} .button {
                        font-family: ${bodyFont}, sans-serif;
                        font-size: ${bodyTypography.fontSize || '16px'};
                        ${bodyTypography.uppercase ? 'text-transform: uppercase;' : ''}
                        letter-spacing: ${bodyTypography.letterSpacing || '0px'};
                        padding: 12px 30px;
                        border-radius: 4px;
                        cursor: pointer;
                        display: inline-block;
                        text-decoration: none;
                        transition: all 0.2s;
                        text-align: center;
                    }
                    
                    #${uniqueId} .button.solid {
                        background: ${schemeColors['solid-button'] || '#121212'};
                        color: ${schemeColors['solid-button-text'] || '#FFFFFF'};
                        border: 2px solid transparent;
                    }
                    
                    #${uniqueId} .button.outline {
                        background: transparent;
                        color: ${schemeColors.text};
                        border: 2px solid ${schemeColors.text};
                    }
                    
                    #${uniqueId} .button.text {
                        background: transparent;
                        color: ${schemeColors.text};
                        border: none;
                        text-decoration: underline;
                        padding: 0;
                    }
                    
                    #${uniqueId} .button.solid:hover {
                        opacity: 0.8;
                    }
                    
                    #${uniqueId} .button.outline:hover {
                        background: ${schemeColors.text};
                        color: ${schemeColors.background};
                    }
                    
                    #${uniqueId} .button.text:hover {
                        opacity: 0.7;
                    }
                    
                    /* Mobile responsiveness */
                    @media (max-width: 768px) {
                        #${uniqueId} .image-text-content {
                            grid-template-columns: 1fr !important;
                            gap: 20px !important;
                        }
                        
                        #${uniqueId} .image-wrapper {
                            order: 1 !important;
                            margin: 0 !important;
                        }
                        
                        #${uniqueId} .content-wrapper {
                            order: 2 !important;
                            margin: 0 !important;
                            max-width: 100% !important;
                        }
                        
                        #${uniqueId} h2 {
                            font-size: 24px !important;
                        }
                    }
                </style>
                
                <div class="content-wrapper">
                    ${config.icon && config.icon !== 'none' ? `
                        <div class="icon-wrapper">
                            ${config.icon === 'custom' && config.customIcon ? 
                                `<img src="${config.customIcon}" alt="Icon" style="max-width: 48px; max-height: 48px;">` :
                                `<span class="material-icons">${iconName}</span>`
                            }
                        </div>
                    ` : ''}
                    
                    ${config.subheading ? `<div class="subheading">${config.subheading}</div>` : ''}
                    ${config.heading ? `<h2>${config.heading}</h2>` : ''}
                    ${config.body ? `<div class="body-content">${config.body}</div>` : ''}
                    
                    <div class="buttons-wrapper">
                        ${config.firstButtonLabel ? `
                            <a href="${config.firstButtonLink || '#'}" class="button ${config.firstButtonStyle || 'solid'}">
                                ${config.firstButtonLabel}
                            </a>
                        ` : ''}
                        ${config.secondButtonLabel ? `
                            <a href="${config.secondButtonLink || '#'}" class="button ${config.secondButtonStyle || 'outline'}">
                                ${config.secondButtonLabel}
                            </a>
                        ` : ''}
                    </div>
                </div>
                
                <div class="image-wrapper">
                    ${config.image ? `
                        <img src="${config.image}" 
                             alt="${config.imageAlt || config.heading || 'Image'}"
                             style="width: 100%; height: auto; display: block;${config.rotateImages ? ' transform: rotate(2deg);' : ''}">
                    ` : `
                        <div style="background: ${schemeColors.foreground}; 
                                    aspect-ratio: ${config.imageRatio || 100} / 100;
                                    display: flex; 
                                    align-items: center; 
                                    justify-content: center; 
                                    color: ${schemeColors.text}; 
                                    opacity: 0.3;">
                            <span class="material-symbols-outlined" style="font-size: 64px;">add_photo_alternate</span>
                        </div>
                    `}
                </div>
            </div>
        `;
    },
    
    renderBlock: function(block, config, parentId) {
        // Detectar si estamos en el editor
        const isInEditor = (typeof window !== 'undefined' && 
                           window.parent !== window && 
                           window.parent.document && 
                           window.parent.document.getElementById('preview-iframe'));
        
        // Si estamos en el editor y es el placeholder, mostrar diseño especial
        if (isInEditor && block.id === 'placeholder') {
            return `
                <div class="image-text-editor-preview" style="position: relative; padding: 60px 0;">
                    <div style="max-width: 1200px; margin: 0 auto; padding: 0 30px; display: flex; align-items: center; gap: 60px;">
                        <!-- Text Content -->
                        <div style="flex: 1;">
                            <div style="font-size: 12px; color: #666; margin-bottom: 10px; text-transform: uppercase; letter-spacing: 1px;">
                                IMAGES WITH TEXT
                            </div>
                            <h2 style="font-size: 36px; margin: 0 0 20px 0; font-weight: 400; line-height: 1.2;">
                                Promo with featured<br>images
                            </h2>
                            <p style="font-size: 16px; line-height: 1.6; color: #666; margin: 0 0 30px 0;">
                                Share information about your brand with your customers. Describe a product, make announcements or welcome customers to your store.
                            </p>
                            <button style="background: #D4AF37; color: #000; border: none; padding: 12px 30px; font-size: 14px; cursor: pointer;">
                                Button label
                            </button>
                        </div>
                        
                        <!-- Images Grid -->
                        <div style="flex: 1; position: relative;">
                            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 20px; transform: rotate(2deg);">
                                <!-- Top left image -->
                                <div style="background: #D4AF37; aspect-ratio: 1; display: flex; align-items: center; justify-content: center; position: relative;">
                                    <div style="width: 60px; height: 50px; border: 2px solid #333; position: relative;">
                                        <div style="position: absolute; top: 5px; left: 5px; right: 5px; bottom: 20px; border: 2px solid #333;"></div>
                                        <div style="position: absolute; bottom: 8px; right: 8px; width: 8px; height: 8px; background: #333; border-radius: 50%;"></div>
                                    </div>
                                </div>
                                
                                <!-- Top right image - offset -->
                                <div style="background: #D4AF37; aspect-ratio: 1; display: flex; align-items: center; justify-content: center; margin-top: -40px;">
                                    <div style="width: 60px; height: 50px; border: 2px solid #333; position: relative;">
                                        <div style="position: absolute; top: 5px; left: 5px; right: 5px; bottom: 20px; border: 2px solid #333;"></div>
                                        <div style="position: absolute; bottom: 8px; right: 8px; width: 8px; height: 8px; background: #333; border-radius: 50%;"></div>
                                    </div>
                                </div>
                                
                                <!-- Bottom left image -->
                                <div style="background: #D4AF37; aspect-ratio: 1; display: flex; align-items: center; justify-content: center; margin-top: -20px;">
                                    <div style="width: 60px; height: 50px; border: 2px solid #333; position: relative;">
                                        <div style="position: absolute; top: 5px; left: 5px; right: 5px; bottom: 20px; border: 2px solid #333;"></div>
                                        <div style="position: absolute; bottom: 8px; right: 8px; width: 8px; height: 8px; background: #333; border-radius: 50%;"></div>
                                    </div>
                                </div>
                                
                                <!-- Bottom right image -->
                                <div style="background: #D4AF37; aspect-ratio: 1; display: flex; align-items: center; justify-content: center;">
                                    <div style="width: 60px; height: 50px; border: 2px solid #333; position: relative;">
                                        <div style="position: absolute; top: 5px; left: 5px; right: 5px; bottom: 20px; border: 2px solid #333;"></div>
                                        <div style="position: absolute; bottom: 8px; right: 8px; width: 8px; height: 8px; background: #333; border-radius: 50%;"></div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    
                    <!-- Editor Toolbar -->
                    <div style="position: absolute; bottom: 20px; left: 50%; transform: translateX(-50%); 
                                background: #2d2d2d; border-radius: 8px; padding: 8px 12px; 
                                display: flex; gap: 12px; align-items: center; box-shadow: 0 2px 8px rgba(0,0,0,0.2);">
                        <button style="background: none; border: none; color: #999; cursor: pointer; padding: 4px;">
                            <span class="material-icons" style="font-size: 20px;">format_list_bulleted</span>
                        </button>
                        <button style="background: none; border: none; color: #999; cursor: pointer; padding: 4px;">
                            <span class="material-icons" style="font-size: 20px;">format_align_left</span>
                        </button>
                        <button style="background: none; border: none; color: #999; cursor: pointer; padding: 4px;">
                            <span class="material-icons" style="font-size: 20px;">link</span>
                        </button>
                        <button style="background: none; border: none; color: #d73502; cursor: pointer; padding: 4px;">
                            <span class="material-icons" style="font-size: 20px;">delete</span>
                        </button>
                    </div>
                </div>
            `;
        }
        
        // Obtener color scheme del contenido
        const schemeColors = getColorSchemeValues(config.colorScheme || 'scheme1');
        
        // Obtener tipografía
        const headingTypography = currentGlobalThemeSettings?.typography?.heading || {};
        const bodyTypography = currentGlobalThemeSettings?.typography?.body || {};
        
        const headingFont = window.getFontNameFromValueSafe ? 
            window.getFontNameFromValueSafe(headingTypography.font || 'helvetica') : 
            'Helvetica';
        
        const bodyFont = window.getFontNameFromValueSafe ? 
            window.getFontNameFromValueSafe(bodyTypography.font || 'roboto') : 
            'Roboto';
        
        // Determinar tamaños de título
        const titleSizes = {
            'small': '24px',
            'medium': '32px',
            'large': '40px'
        };
        const titleSize = titleSizes[block.titleSize || 'medium'];
        
        // Configurar layout
        const imageFirst = config.imagePosition === 'left';
        const hasOverlap = config.contentLayout === 'overlap';
        
        return `
            <div class="image-text-block" data-block-id="${block.id}" style="margin-bottom: 40px;">
                <style>
                    .image-text-block[data-block-id="${block.id}"] {
                        display: grid;
                        grid-template-columns: ${imageFirst ? '1fr 1fr' : '1fr 1fr'};
                        gap: ${hasOverlap ? '0' : '50px'};
                        align-items: ${config.contentPosition || 'center'};
                        ${hasOverlap ? 'position: relative;' : ''}
                    }
                    
                    .image-text-block[data-block-id="${block.id}"] .image-wrapper {
                        ${imageFirst ? 'order: 1;' : 'order: 2;'}
                        ${hasOverlap && !imageFirst ? 'margin-left: -100px; z-index: 1;' : ''}
                        ${hasOverlap && imageFirst ? 'margin-right: -100px; z-index: 1;' : ''}
                    }
                    
                    .image-text-block[data-block-id="${block.id}"] .content-wrapper {
                        ${imageFirst ? 'order: 2;' : 'order: 1;'}
                        ${hasOverlap ? 'z-index: 2; background: ' + schemeColors.background + '; padding: 40px; box-shadow: 0 4px 20px rgba(0,0,0,0.1);' : ''}
                    }
                    
                    .image-text-block[data-block-id="${block.id}"] img {
                        width: 100%;
                        height: ${config.imageHeight === 'adapt' ? 'auto' : config.imageHeight || 'auto'};
                        object-fit: cover;
                        display: block;
                    }
                    
                    .image-text-block[data-block-id="${block.id}"] h2 {
                        font-family: ${headingFont}, serif;
                        font-size: ${titleSize};
                        ${headingTypography.uppercase ? 'text-transform: uppercase;' : ''}
                        letter-spacing: ${headingTypography.letterSpacing || '0px'};
                        font-weight: 600;
                        color: ${schemeColors.text};
                        margin: 0 0 20px 0;
                        text-align: ${config.contentAlignment || 'left'};
                    }
                    
                    .image-text-block[data-block-id="${block.id}"] .text-content {
                        font-family: ${bodyFont}, sans-serif;
                        font-size: ${bodyTypography.fontSize || '16px'};
                        ${bodyTypography.uppercase ? 'text-transform: uppercase;' : ''}
                        letter-spacing: ${bodyTypography.letterSpacing || '0px'};
                        line-height: 1.6;
                        color: ${schemeColors.text};
                        margin: 0 0 25px 0;
                        text-align: ${config.contentAlignment || 'left'};
                    }
                    
                    .image-text-block[data-block-id="${block.id}"] .text-content.subtitle {
                        font-size: ${parseInt(bodyTypography.fontSize || '16') + 2}px;
                        font-weight: 500;
                        opacity: 0.9;
                    }
                    
                    .image-text-block[data-block-id="${block.id}"] .button {
                        font-family: ${bodyFont}, sans-serif;
                        font-size: ${bodyTypography.fontSize || '16px'};
                        ${bodyTypography.uppercase ? 'text-transform: uppercase;' : ''}
                        letter-spacing: ${bodyTypography.letterSpacing || '0px'};
                        padding: 12px 30px;
                        border-radius: 4px;
                        cursor: pointer;
                        display: inline-block;
                        text-decoration: none;
                        transition: all 0.2s;
                        text-align: center;
                        ${block.buttonOutline ? `
                            background: transparent;
                            color: ${schemeColors.text};
                            border: 2px solid ${schemeColors.text};
                        ` : `
                            background: ${schemeColors['solid-button'] || '#121212'};
                            color: ${schemeColors['solid-button-text'] || '#FFFFFF'};
                            border: 2px solid transparent;
                        `}
                    }
                    
                    .image-text-block[data-block-id="${block.id}"] .button:hover {
                        ${block.buttonOutline ? `
                            background: ${schemeColors.text};
                            color: ${schemeColors.background};
                        ` : `
                            opacity: 0.8;
                        `}
                    }
                    
                    /* Mobile responsiveness */
                    @media (max-width: 768px) {
                        .image-text-block[data-block-id="${block.id}"] {
                            grid-template-columns: 1fr !important;
                            gap: 20px !important;
                        }
                        
                        .image-text-block[data-block-id="${block.id}"] .image-wrapper {
                            order: 1 !important;
                            margin: 0 !important;
                        }
                        
                        .image-text-block[data-block-id="${block.id}"] .content-wrapper {
                            order: 2 !important;
                            margin: 0 !important;
                            ${hasOverlap ? 'padding: 20px !important;' : ''}
                            text-align: ${config.mobileContentAlignment || 'left'} !important;
                        }
                        
                        .image-text-block[data-block-id="${block.id}"] h2 {
                            font-size: 24px !important;
                            text-align: ${config.mobileContentAlignment || 'left'} !important;
                        }
                        
                        .image-text-block[data-block-id="${block.id}"] .text-content {
                            text-align: ${config.mobileContentAlignment || 'left'} !important;
                        }
                    }
                </style>
                
                <div class="image-wrapper">
                    ${window.WebsiteBuilderModules.ImageWithText.renderImageContent(block, config, schemeColors)}
                </div>
                
                <div class="content-wrapper">
                    ${config.heading ? `<h2>${config.heading}</h2>` : ''}
                    ${config.subheading ? `<div class="subheading">${config.subheading}</div>` : ''}
                    ${config.body ? `<div class="text-content">${config.body}</div>` : ''}
                    ${config.firstButtonLabel ? `
                        <a href="${config.firstButtonLink || '#'}" class="button ${config.firstButtonStyle || 'solid'}">
                            ${config.firstButtonLabel}
                        </a>
                    ` : ''}
                    ${config.secondButtonLabel ? `
                        <a href="${config.secondButtonLink || '#'}" class="button ${config.secondButtonStyle || 'outline'}">
                            ${config.secondButtonLabel}
                        </a>
                    ` : ''}
                </div>
            </div>
        `;
    },
    
    renderImageContent: function(block, config, schemeColors) {
        // Check if we have multiple images for collage mode
        const hasMultipleImages = block.images && block.images.length > 0;
        const imageLayout = config.imageLayout || 'grid';
        const isCollageMode = imageLayout === 'collage' && hasMultipleImages;
        
        console.log('[IMAGE-WITH-TEXT] Render image content:', {
            hasMultipleImages,
            imageLayout,
            isCollageMode,
            imagesCount: block.images?.length || 0,
            hasSingleImage: !!block.image
        });
        
        if (isCollageMode) {
            // Render collage layout
            return `
                <div class="collage-container" style="
                    display: grid;
                    grid-template-columns: repeat(2, 1fr);
                    gap: 10px;
                    position: relative;
                ">
                    ${block.images.slice(0, 4).map((image, index) => `
                        <div class="collage-item" style="
                            ${index === 0 ? 'grid-column: span 1; grid-row: span 2;' : ''}
                            ${index === 1 ? 'transform: translateY(-20px);' : ''}
                            ${index === 2 ? 'transform: translateY(20px);' : ''}
                            ${index === 3 ? 'transform: translateY(-10px);' : ''}
                            overflow: hidden;
                            border-radius: 8px;
                        ">
                            <img src="${image.src || image}" 
                                 alt="${image.alt || block.heading || 'Image ' + (index + 1)}"
                                 style="width: 100%; height: 100%; object-fit: cover;">
                        </div>
                    `).join('')}
                </div>
            `;
        } else {
            // Render single image (default)
            const primaryImage = hasMultipleImages ? block.images[0] : block.image;
            
            if (primaryImage) {
                const imageSrc = typeof primaryImage === 'string' ? primaryImage : primaryImage.src;
                const imageAlt = typeof primaryImage === 'string' ? 
                    (block.imageAlt || block.heading || 'Image') : 
                    (primaryImage.alt || block.imageAlt || block.heading || 'Image');
                
                return `
                    <img src="${imageSrc}" 
                         alt="${imageAlt}"
                         class="${config.imageAnimation || ''}"
                         style="width: 100%; height: auto;">
                `;
            } else {
                // Placeholder
                return `
                    <div style="background: ${schemeColors.foreground}; 
                                height: ${config.imageHeight === 'adapt' ? '400px' : config.imageHeight || '400px'}; 
                                display: flex; 
                                align-items: center; 
                                justify-content: center; 
                                color: ${schemeColors.text}; 
                                opacity: 0.5;">
                        <span class="material-symbols-outlined" style="font-size: 64px;">add_photo_alternate</span>
                    </div>
                `;
            }
        }
    },
    
    renderSettings: function(config) {
        console.log('[IMAGE-WITH-TEXT] renderSettings called with config:', config);
        config = config || {};
        
        // Ensure blocks and blockOrder exist
        if (!config.blocks) {
            config.blocks = {};
        }
        if (!config.blockOrder) {
            config.blockOrder = [];
        }
        
        const configData = config;
        
        return `
            <div style="display: flex; flex-direction: column; height: 100%; position: relative; overflow: hidden;">
                <div class="sidebar-view-header" style="position: relative; z-index: 10;">
                    <button class="back-to-sections-btn">
                        <i class="material-icons">arrow_back</i>
                    </button>
                    <h3 data-i18n="imageWithText.settings.title">Images with text</h3>
                </div>
                
                <div style="padding: 20px; overflow-y: auto; overflow-x: hidden; flex: 1; height: calc(100% - 60px); box-sizing: border-box;">
                
                <!-- Main Settings -->
                <div class="settings-group">
                    <!-- Color Scheme -->
                    <div class="settings-field" style="margin-bottom: 20px;">
                        <label style="display: block; font-size: 13px; color: #202223; margin-bottom: 8px;">
                            <span data-i18n="imageWithText.fields.colorScheme">Color scheme</span>
                        </label>
                        <select id="iwt-color-scheme" class="shopify-select" style="width: 100%;">
                            <option value="scheme1" ${configData.colorScheme === 'scheme1' ? 'selected' : ''}>Scheme 1</option>
                            <option value="scheme2" ${configData.colorScheme === 'scheme2' ? 'selected' : ''}>Scheme 2</option>
                            <option value="scheme3" ${configData.colorScheme === 'scheme3' ? 'selected' : ''}>Scheme 3</option>
                            <option value="scheme4" ${configData.colorScheme === 'scheme4' ? 'selected' : ''}>Scheme 4</option>
                            <option value="scheme5" ${configData.colorScheme === 'scheme5' ? 'selected' : ''}>Scheme 5</option>
                        </select>
                    </div>
                    
                    <!-- Width -->
                    <div class="settings-field" style="margin-bottom: 16px;">
                        <label class="toggle-field" style="display: flex; align-items: center; justify-content: space-between;">
                            <span style="font-size: 13px; color: #202223;">
                                <span data-i18n="imageWithText.fields.fullWidth">Make section full width</span>
                            </span>
                            <input type="checkbox" id="iwt-full-width" class="shopify-toggle" ${configData.fullWidth ? 'checked' : ''}>
                            <label for="iwt-full-width" class="toggle-slider"></label>
                        </label>
                    </div>
                    
                    <!-- Content Layout -->
                    <div class="settings-field" style="margin-bottom: 20px;">
                        <label style="display: block; font-size: 13px; color: #202223; margin-bottom: 8px;">
                            <span data-i18n="imageWithText.fields.contentLayout">Content layout</span>
                        </label>
                        <select id="iwt-content-layout" class="shopify-select" style="width: 100%;">
                            <option value="left" ${configData.contentLayout === 'left' ? 'selected' : ''}>Left</option>
                            <option value="right" ${configData.contentLayout === 'right' ? 'selected' : ''}>Right</option>
                        </select>
                    </div>
                    
                    <!-- Image Layout -->
                    <div class="settings-field" style="margin-bottom: 20px;">
                        <label style="display: block; font-size: 13px; color: #202223; margin-bottom: 8px;">
                            <span data-i18n="imageWithText.fields.imageLayout">Image layout</span>
                        </label>
                        <select id="iwt-image-layout" class="shopify-select" style="width: 100%;">
                            <option value="grid" ${configData.imageLayout === 'grid' ? 'selected' : ''}>Grid</option>
                            <option value="collage" ${configData.imageLayout === 'collage' ? 'selected' : ''}>Collage</option>
                        </select>
                    </div>
                    
                    <!-- Image Ratio -->
                    <div class="settings-field" style="margin-bottom: 20px;">
                        <label style="display: block; font-size: 13px; color: #202223; margin-bottom: 8px;">
                            <span data-i18n="imageWithText.fields.imageRatio">Image ratio</span>
                            <span style="float: right; color: #666;">${configData.imageRatio || '100'}%</span>
                        </label>
                        <input type="range" id="iwt-image-ratio" 
                               min="50" max="200" 
                               value="${configData.imageRatio || 100}" 
                               style="width: 100%;">
                    </div>
                    
                    <!-- Rotate Images -->
                    <div class="settings-field" style="margin-bottom: 16px;">
                        <label class="toggle-field" style="display: flex; align-items: center; justify-content: space-between;">
                            <span style="font-size: 13px; color: #202223;">
                                <span data-i18n="imageWithText.fields.rotateImages">Rotate images</span>
                            </span>
                            <input type="checkbox" id="iwt-rotate-images" class="shopify-toggle" ${configData.rotateImages ? 'checked' : ''}>
                            <label for="iwt-rotate-images" class="toggle-slider"></label>
                        </label>
                    </div>
                    
                    <!-- Card Border Radius -->
                    <div class="settings-field" style="margin-bottom: 20px;">
                        <label style="display: block; font-size: 13px; color: #202223; margin-bottom: 8px;">
                            <span data-i18n="imageWithText.fields.cardBorderRadius">Card border radius</span>
                            <span style="float: right; color: #666;">${configData.cardBorderRadius || 20}px</span>
                        </label>
                        <input type="range" id="iwt-card-border-radius" 
                               min="0" max="30" 
                               value="${configData.cardBorderRadius || 20}" 
                               style="width: 100%;">
                        <div style="display: flex; justify-content: space-between; font-size: 11px; color: #999; margin-top: 5px;">
                            <span>Square</span>
                            <span>Rounded</span>
                        </div>
                    </div>
                </div>
                
                <!-- Icon Section -->
                <div class="settings-group" style="margin-top: 30px;">
                    <h4 style="font-size: 14px; color: #666; margin: 0 0 15px 0;">
                        <span data-i18n="imageWithText.settings.icon">Icon</span>
                    </h4>
                    
                    <!-- Icon Selector -->
                    <div class="settings-field" style="margin-bottom: 20px;">
                        <label style="display: block; font-size: 13px; color: #202223; margin-bottom: 8px;">
                            <span data-i18n="imageWithText.fields.icon">Icon</span>
                        </label>
                        <select id="iwt-icon" class="shopify-select" style="width: 100%;">
                            ${window.WebsiteBuilderModules.ImageWithText.generateIconOptions(configData.icon || 'none')}
                        </select>
                        <div style="font-size: 12px; color: #008060; margin-top: 5px;">
                            <a href="#" style="color: #008060;" data-i18n="imageWithText.fields.iconGuide">See what icon stands for each label</a>
                        </div>
                    </div>
                    
                    <!-- Custom Icon -->
                    <div class="settings-field" style="margin-bottom: 20px;">
                        <label style="display: block; font-size: 13px; color: #202223; margin-bottom: 8px;">
                            <span data-i18n="imageWithText.fields.customIcon">Custom icon</span>
                        </label>
                        <div class="custom-icon-upload" style="border: 1px dashed #ddd; border-radius: 4px; padding: 20px; text-align: center; background: #fafafa;">
                            ${configData.customIcon ? 
                                `<div class="custom-icon-preview">
                                    <img src="${configData.customIcon}" alt="Custom icon" style="max-width: 64px; max-height: 64px; margin-bottom: 8px;">
                                    <div>
                                        <button class="shopify-button change-icon-btn" style="background: #fff; border: 1px solid #ddd; padding: 6px 12px; cursor: pointer; font-size: 12px;">
                                            Change icon
                                        </button>
                                        <button class="shopify-button remove-icon-btn" style="background: #fff; border: 1px solid #ddd; padding: 6px 12px; cursor: pointer; font-size: 12px; margin-left: 8px;">
                                            Remove
                                        </button>
                                    </div>
                                </div>` :
                                `<button class="shopify-button select-icon-btn" style="background: #fff; border: 1px solid #ddd; padding: 8px 16px; cursor: pointer;">
                                    <span data-i18n="imageWithText.fields.selectIcon">Seleccionar</span>
                                </button>`
                            }
                        </div>
                        <input type="file" id="custom-icon-input" accept="image/*" style="display: none;">
                        <p style="font-size: 12px; color: #666; margin-top: 8px; text-align: center;" data-i18n="imageWithText.fields.exploreFreeImages">Explorar imágenes gratuitas</p>
                    </div>
                </div>
                
                <!-- Content Section -->
                <div class="settings-group" style="margin-top: 30px;">
                    <h4 style="font-size: 14px; color: #666; margin: 0 0 15px 0;">
                        <span data-i18n="imageWithText.settings.content">Content</span>
                    </h4>
                    
                    <!-- Subheading -->
                    <div class="settings-field" style="margin-bottom: 20px;">
                        <label style="display: block; font-size: 13px; color: #202223; margin-bottom: 8px;">
                            <span data-i18n="imageWithText.fields.subheading">Subheading</span>
                        </label>
                        <input type="text" id="iwt-subheading" 
                               class="shopify-input" 
                               value="${configData.subheading || ''}" 
                               placeholder="">
                    </div>
                    
                    <!-- Heading -->
                    <div class="settings-field" style="margin-bottom: 20px;">
                        <label style="display: block; font-size: 13px; color: #202223; margin-bottom: 8px;">
                            <span data-i18n="imageWithText.fields.heading">Heading</span>
                        </label>
                        <div style="border: 1px solid #ddd; border-radius: 4px;">
                            <textarea id="iwt-heading" 
                                      class="shopify-input" 
                                      placeholder="El control de inventario es el pulmón de tu negocio de alimentos y bebidas."
                                      style="width: 100%; min-height: 60px; resize: vertical; border: none; outline: none; padding: 10px;">${configData.heading || ''}</textarea>
                        </div>
                    </div>
                    
                    <!-- Body -->
                    <div class="settings-field" style="margin-bottom: 20px;">
                        <label style="display: block; font-size: 13px; color: #202223; margin-bottom: 8px;">
                            <span data-i18n="imageWithText.fields.body">Body</span>
                        </label>
                        <div style="border: 1px solid #ddd; border-radius: 4px;">
                            <div style="display: flex; gap: 5px; padding: 5px; border-bottom: 1px solid #eee; flex-wrap: wrap;">
                                <button class="text-format-btn" data-format="bold" style="padding: 5px 10px; background: none; border: none; cursor: pointer;">
                                    <span style="font-size: 14px;">Aa</span>
                                </button>
                                <button class="text-format-btn" data-format="bold" style="padding: 5px 10px; background: none; border: none; cursor: pointer;">
                                    <strong style="font-size: 14px;">B</strong>
                                </button>
                                <button class="text-format-btn" data-format="italic" style="padding: 5px 10px; background: none; border: none; cursor: pointer;">
                                    <em style="font-size: 14px;">I</em>
                                </button>
                                <button class="text-format-btn" data-format="link" style="padding: 5px 10px; background: none; border: none; cursor: pointer;">
                                    <i class="material-icons" style="font-size: 18px;">link</i>
                                </button>
                                <button class="text-format-btn" data-format="list-bullet" style="padding: 5px 10px; background: none; border: none; cursor: pointer;">
                                    <i class="material-icons" style="font-size: 18px;">format_list_bulleted</i>
                                </button>
                                <button class="text-format-btn" data-format="list-number" style="padding: 5px 10px; background: none; border: none; cursor: pointer;">
                                    <i class="material-icons" style="font-size: 18px;">format_list_numbered</i>
                                </button>
                            </div>
                            <textarea id="iwt-body" 
                                      class="shopify-input" 
                                      placeholder="Controlar el inventario significa controlar tus costos. Aurora POS te da la precisión que necesitas para un negocio rentable.\n\n&quot;Cada ingrediente cuenta. Evita el desperdicio y la merma, y optimiza tus márgenes de ganancia&quot;."
                                      style="width: 100%; min-height: 150px; resize: vertical; border: none; outline: none; padding: 10px;">${configData.body || ''}</textarea>
                            <div style="padding: 5px 10px; border-top: 1px solid #eee; font-size: 11px; color: #666;">
                                For "Paragraph" body text formatting
                            </div>
                        </div>
                    </div>
                    
                    <!-- Heading Size -->
                    <div class="settings-field" style="margin-bottom: 20px;">
                        <label style="display: block; font-size: 13px; color: #202223; margin-bottom: 8px;">
                            <span data-i18n="imageWithText.fields.headingSize">Heading size</span>
                        </label>
                        <select id="iwt-heading-size" class="shopify-select" style="width: 100%;">
                            <option value="h7" ${configData.headingSize === 'h7' ? 'selected' : ''}>Heading 7</option>
                            <option value="h6" ${configData.headingSize === 'h6' ? 'selected' : ''}>Heading 6</option>
                            <option value="h5" ${configData.headingSize === 'h5' ? 'selected' : ''}>Heading 5</option>
                            <option value="h4" ${configData.headingSize === 'h4' ? 'selected' : ''}>Heading 4</option>
                            <option value="h3" ${configData.headingSize === 'h3' ? 'selected' : ''}>Heading 3</option>
                            <option value="h2" ${configData.headingSize === 'h2' ? 'selected' : ''}>Heading 2</option>
                            <option value="h1" ${configData.headingSize === 'h1' ? 'selected' : ''}>Heading 1</option>
                            <option value="h0" ${configData.headingSize === 'h0' ? 'selected' : ''}>Heading 0</option>
                        </select>
                    </div>
                    
                    <!-- Body Size -->
                    <div class="settings-field" style="margin-bottom: 20px;">
                        <label style="display: block; font-size: 13px; color: #202223; margin-bottom: 8px;">
                            <span data-i18n="imageWithText.fields.bodySize">Body size</span>
                        </label>
                        <select id="iwt-body-size" class="shopify-select" style="width: 100%;">
                            <option value="body6" ${configData.bodySize === 'body6' ? 'selected' : ''}>Body 6</option>
                            <option value="body5" ${configData.bodySize === 'body5' ? 'selected' : ''}>Body 5</option>
                            <option value="body4" ${configData.bodySize === 'body4' ? 'selected' : ''}>Body 4</option>
                            <option value="body3" ${configData.bodySize === 'body3' ? 'selected' : ''}>Body 3</option>
                            <option value="body2" ${configData.bodySize === 'body2' ? 'selected' : ''}>Body 2</option>
                            <option value="body1" ${configData.bodySize === 'body1' ? 'selected' : ''}>Body 1</option>
                            <option value="body0" ${configData.bodySize === 'body0' ? 'selected' : ''}>Body 0</option>
                        </select>
                    </div>
                    
                    <!-- Content Alignment -->
                    <div class="settings-field" style="margin-bottom: 20px;">
                        <label style="display: block; font-size: 13px; color: #202223; margin-bottom: 8px;">
                            <span data-i18n="imageWithText.fields.contentAlignment">Content alignment</span>
                        </label>
                        <div style="display: flex; gap: 0; border: 1px solid #ddd; border-radius: 4px; overflow: hidden;">
                            <button class="alignment-btn ${configData.contentAlignment === 'left' ? 'active' : ''}" 
                                    data-align="left"
                                    style="flex: 1; padding: 10px; background: ${configData.contentAlignment === 'left' ? '#f0f0f0' : '#fff'}; 
                                           border: none; cursor: pointer; border-right: 1px solid #ddd;">
                                <i class="material-icons" style="font-size: 18px;">format_align_left</i>
                            </button>
                            <button class="alignment-btn ${configData.contentAlignment === 'center' ? 'active' : ''}" 
                                    data-align="center"
                                    style="flex: 1; padding: 10px; background: ${configData.contentAlignment === 'center' ? '#f0f0f0' : '#fff'}; 
                                           border: none; cursor: pointer; border-right: 1px solid #ddd;">
                                <i class="material-icons" style="font-size: 18px;">format_align_center</i>
                            </button>
                            <button class="alignment-btn ${configData.contentAlignment === 'right' ? 'active' : ''}" 
                                    data-align="right"
                                    style="flex: 1; padding: 10px; background: ${configData.contentAlignment === 'right' ? '#f0f0f0' : '#fff'}; 
                                           border: none; cursor: pointer;">
                                <i class="material-icons" style="font-size: 18px;">format_align_right</i>
                            </button>
                        </div>
                    </div>
                    
                    <!-- Desktop Width -->
                    <div class="settings-field" style="margin-bottom: 20px;">
                        <label style="display: block; font-size: 13px; color: #202223; margin-bottom: 8px;">
                            <span data-i18n="imageWithText.fields.desktopWidth">Desktop width</span>
                            <span style="float: right; color: #666;">${configData.desktopWidth || 360}px</span>
                        </label>
                        <input type="range" id="iwt-desktop-width" 
                               min="200" max="600" 
                               value="${configData.desktopWidth || 360}" 
                               style="width: 100%;">
                    </div>
                </div>
                
                <!-- Buttons Section -->
                <div class="settings-group" style="margin-top: 30px;">
                    <h4 style="font-size: 14px; color: #666; margin: 0 0 15px 0;">
                        <span data-i18n="imageWithText.settings.buttons">Buttons</span>
                    </h4>
                    
                    <!-- First Button -->
                    <div class="settings-field" style="margin-bottom: 20px;">
                        <label style="display: block; font-size: 13px; color: #202223; margin-bottom: 8px;">
                            <span data-i18n="imageWithText.fields.firstButtonLabel">First button label</span>
                        </label>
                        <input type="text" id="iwt-first-button-label" 
                               class="shopify-input" 
                               value="${configData.firstButtonLabel || ''}" 
                               placeholder="">
                    </div>
                    
                    <div class="settings-field" style="margin-bottom: 20px;">
                        <label style="display: block; font-size: 13px; color: #202223; margin-bottom: 8px;">
                            <span data-i18n="imageWithText.fields.firstButtonLink">First button link</span>
                        </label>
                        <input type="text" id="iwt-first-button-link" 
                               class="shopify-input" 
                               value="${configData.firstButtonLink || ''}" 
                               placeholder="Pega un enlace o busca">
                    </div>
                    
                    <div class="settings-field" style="margin-bottom: 20px;">
                        <label style="display: block; font-size: 13px; color: #202223; margin-bottom: 8px;">
                            <span data-i18n="imageWithText.fields.firstButtonStyle">First button style</span>
                        </label>
                        <div style="display: flex; gap: 0; border: 1px solid #ddd; border-radius: 4px; overflow: hidden;">
                            <button class="button-style-btn ${configData.firstButtonStyle === 'solid' ? 'active' : ''}" 
                                    data-button="first" data-style="solid"
                                    style="flex: 1; padding: 10px; background: ${configData.firstButtonStyle === 'solid' ? '#f0f0f0' : '#fff'}; 
                                           border: none; cursor: pointer; border-right: 1px solid #ddd;">
                                Solid
                            </button>
                            <button class="button-style-btn ${configData.firstButtonStyle === 'outline' ? 'active' : ''}" 
                                    data-button="first" data-style="outline"
                                    style="flex: 1; padding: 10px; background: ${configData.firstButtonStyle === 'outline' ? '#f0f0f0' : '#fff'}; 
                                           border: none; cursor: pointer; border-right: 1px solid #ddd;">
                                Outline
                            </button>
                            <button class="button-style-btn ${configData.firstButtonStyle === 'text' ? 'active' : ''}" 
                                    data-button="first" data-style="text"
                                    style="flex: 1; padding: 10px; background: ${configData.firstButtonStyle === 'text' ? '#f0f0f0' : '#fff'}; 
                                           border: none; cursor: pointer;">
                                Text
                            </button>
                        </div>
                    </div>
                    
                    <!-- Second Button -->
                    <div class="settings-field" style="margin-bottom: 20px;">
                        <label style="display: block; font-size: 13px; color: #202223; margin-bottom: 8px;">
                            <span data-i18n="imageWithText.fields.secondButtonLabel">Second button label</span>
                        </label>
                        <input type="text" id="iwt-second-button-label" 
                               class="shopify-input" 
                               value="${configData.secondButtonLabel || ''}" 
                               placeholder="">
                    </div>
                    
                    <div class="settings-field" style="margin-bottom: 20px;">
                        <label style="display: block; font-size: 13px; color: #202223; margin-bottom: 8px;">
                            <span data-i18n="imageWithText.fields.secondButtonLink">Second button link</span>
                        </label>
                        <input type="text" id="iwt-second-button-link" 
                               class="shopify-input" 
                               value="${configData.secondButtonLink || ''}" 
                               placeholder="Pega un enlace o busca">
                    </div>
                    
                    <div class="settings-field" style="margin-bottom: 20px;">
                        <label style="display: block; font-size: 13px; color: #202223; margin-bottom: 8px;">
                            <span data-i18n="imageWithText.fields.secondButtonStyle">Second button style</span>
                        </label>
                        <div style="display: flex; gap: 0; border: 1px solid #ddd; border-radius: 4px; overflow: hidden;">
                            <button class="button-style-btn ${configData.secondButtonStyle === 'solid' ? 'active' : ''}" 
                                    data-button="second" data-style="solid"
                                    style="flex: 1; padding: 10px; background: ${configData.secondButtonStyle === 'solid' ? '#f0f0f0' : '#fff'}; 
                                           border: none; cursor: pointer; border-right: 1px solid #ddd;">
                                Solid
                            </button>
                            <button class="button-style-btn ${configData.secondButtonStyle === 'outline' ? 'active' : ''}" 
                                    data-button="second" data-style="outline"
                                    style="flex: 1; padding: 10px; background: ${configData.secondButtonStyle === 'outline' ? '#f0f0f0' : '#fff'}; 
                                           border: none; cursor: pointer; border-right: 1px solid #ddd;">
                                Outline
                            </button>
                            <button class="button-style-btn ${configData.secondButtonStyle === 'text' ? 'active' : ''}" 
                                    data-button="second" data-style="text"
                                    style="flex: 1; padding: 10px; background: ${configData.secondButtonStyle === 'text' ? '#f0f0f0' : '#fff'}; 
                                           border: none; cursor: pointer;">
                                Text
                            </button>
                        </div>
                    </div>
                </div>
                
                <!-- Section Spacing -->
                <div class="settings-group" style="margin-top: 30px;">
                    <h4 style="font-size: 14px; color: #666; margin: 0 0 15px 0;">
                        <span data-i18n="imageWithText.settings.sectionSpacing">Section spacing</span>
                    </h4>
                    
                    <!-- Section Top Padding -->
                    <div class="settings-field" style="margin-bottom: 20px;">
                        <label style="display: block; font-size: 13px; color: #202223; margin-bottom: 8px;">
                            <span data-i18n="imageWithText.fields.sectionTopPadding">Section top padding</span>
                            <span style="float: right; color: #666;">${configData.sectionTopPadding || 0}px</span>
                        </label>
                        <input type="range" id="iwt-section-top-padding" 
                               min="0" max="200" 
                               value="${configData.sectionTopPadding || 0}" 
                               style="width: 100%;">
                    </div>
                    
                    <!-- Section Bottom Padding -->
                    <div class="settings-field" style="margin-bottom: 20px;">
                        <label style="display: block; font-size: 13px; color: #202223; margin-bottom: 8px;">
                            <span data-i18n="imageWithText.fields.sectionBottomPadding">Section bottom padding</span>
                            <span style="float: right; color: #666;">${configData.sectionBottomPadding || 0}px</span>
                        </label>
                        <input type="range" id="iwt-section-bottom-padding" 
                               min="0" max="200" 
                               value="${configData.sectionBottomPadding || 0}" 
                               style="width: 100%;">
                    </div>
                </div>
                
                
                <!-- Content Paddings Section -->
                <div class="settings-group" style="margin-top: 30px;">
                    <h4 style="font-size: 14px; color: #666; margin: 0 0 15px 0;">
                        <span data-i18n="imageWithText.settings.contentPaddings">Content paddings</span>
                    </h4>
                    
                    <!-- Add Side Paddings -->
                    <div class="settings-field" style="margin-bottom: 16px;">
                        <label class="toggle-field" style="display: flex; align-items: center; justify-content: space-between;">
                            <span style="font-size: 13px; color: #202223;">
                                <span data-i18n="imageWithText.fields.addSidePaddings">Add side paddings</span>
                            </span>
                            <input type="checkbox" id="iwt-add-side-paddings" class="shopify-toggle" ${configData.addSidePaddings ? 'checked' : ''}>
                            <label for="iwt-add-side-paddings" class="toggle-slider"></label>
                        </label>
                    </div>
                    
                    <!-- Top Padding -->
                    <div class="settings-field" style="margin-bottom: 20px;">
                        <label style="display: block; font-size: 13px; color: #202223; margin-bottom: 8px;">
                            <span data-i18n="imageWithText.fields.topPadding">Top padding</span>
                            <span style="float: right; color: #666;">${configData.topPadding || 48}px</span>
                        </label>
                        <input type="range" id="iwt-top-padding" 
                               min="0" max="100" 
                               value="${configData.topPadding || 48}" 
                               style="width: 100%;">
                    </div>
                    
                    <!-- Bottom Padding -->
                    <div class="settings-field" style="margin-bottom: 20px;">
                        <label style="display: block; font-size: 13px; color: #202223; margin-bottom: 8px;">
                            <span data-i18n="imageWithText.fields.bottomPadding">Bottom padding</span>
                            <span style="float: right; color: #666;">${configData.bottomPadding || 48}px</span>
                        </label>
                        <input type="range" id="iwt-bottom-padding" 
                               min="0" max="100" 
                               value="${configData.bottomPadding || 48}" 
                               style="width: 100%;">
                    </div>
                </div>
            </div>
        `;
    },
    
    
    renderBlockSettings: function(block, parentConfig) {
        block = block || {};
        
        return `
            <div class="settings-panel" style="display: flex; flex-direction: column; height: 100%;">
                <div class="settings-header" style="display: flex; align-items: center; gap: 10px; margin-bottom: 0; padding: 16px 20px; border-bottom: 1px solid #e3e3e3;">
                    <button class="back-to-sections-btn" 
                            style="background: none; border: none; cursor: pointer; padding: 4px;">
                        <i class="material-icons" style="font-size: 20px;">arrow_back</i>
                    </button>
                    <h3 style="font-size: 16px; font-weight: 500; margin: 0;">
                        <span data-i18n="imageWithText.blockSettings.imageTitle">Image</span>
                    </h3>
                    <div style="margin-left: auto;">
                        <button style="background: none; border: none; cursor: pointer; padding: 4px;">
                            <i class="material-icons" style="font-size: 20px;">more_vert</i>
                        </button>
                    </div>
                </div>
                
                <div style="flex: 1; overflow-y: auto; padding: 20px;">
                    <!-- Image Section -->
                    <div class="settings-group">
                        <div class="settings-field" style="margin-bottom: 20px;">
                            <label style="display: block; font-size: 13px; color: #666; margin-bottom: 8px;">
                                <span data-i18n="imageWithText.blockSettings.image">Image</span>
                            </label>
                            <div style="border: 2px dashed #ddd; border-radius: 8px; padding: 20px; text-align: center; background: #f9f9f9;">
                                ${block.images && block.images.length > 0 ? `
                                    <div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 10px; margin-bottom: 12px;">
                                        ${block.images.slice(0, 4).map((img, index) => `
                                            <div style="position: relative;">
                                                <img src="${img.src || img}" 
                                                     style="width: 100%; height: 80px; object-fit: cover; border-radius: 4px;">
                                                <button onclick="window.removeBlockImageAt('${block.id}', ${index})"
                                                        style="position: absolute; top: 4px; right: 4px; background: rgba(255,255,255,0.9); 
                                                               border: none; border-radius: 50%; width: 24px; height: 24px; 
                                                               cursor: pointer; display: flex; align-items: center; justify-content: center;">
                                                    <i class="material-icons" style="font-size: 16px;">close</i>
                                                </button>
                                            </div>
                                        `).join('')}
                                    </div>
                                    <button class="shopify-button-secondary" onclick="window.addMoreImages('${block.id}')" 
                                            style="padding: 8px 16px; font-size: 13px; background: #fff; border: 1px solid #ddd; border-radius: 4px; cursor: pointer;">
                                        <span data-i18n="imageWithText.blockFields.addMoreImages">Agregar más imágenes</span>
                                    </button>
                                ` : block.image ? `
                                    <img src="${block.image}" style="max-width: 100%; max-height: 150px; margin-bottom: 12px; border-radius: 4px;">
                                    <div>
                                        <button class="shopify-button-secondary" onclick="window.changeBlockImage('${block.id}')" 
                                                style="padding: 8px 16px; font-size: 13px; background: #fff; border: 1px solid #ddd; border-radius: 4px; cursor: pointer;">
                                            <span data-i18n="imageWithText.blockFields.changeImage">Cambiar imagen</span>
                                        </button>
                                    </div>
                                ` : `
                                    <button class="shopify-button" onclick="window.selectBlockImage('${block.id}')"
                                            style="padding: 8px 16px; font-size: 13px; background: #fff; border: 1px solid #ddd; border-radius: 4px; cursor: pointer; margin-bottom: 8px;">
                                        <span data-i18n="imageWithText.blockFields.selectImage">Seleccionar</span>
                                    </button>
                                    <div style="font-size: 12px; color: #666;">
                                        <a href="#" onclick="window.browseFreeImages('${block.id}'); return false;" 
                                           style="color: #008060; text-decoration: none;">
                                            <span data-i18n="imageWithText.blockFields.browseFree">Explorar imágenes gratuitas</span>
                                        </a>
                                    </div>
                                `}
                            </div>
                        </div>
                    </div>
                    
                    <!-- Video Section -->
                    <div class="settings-group" style="margin-top: 24px;">
                        <div class="settings-field">
                            <label style="display: block; font-size: 13px; color: #666; margin-bottom: 8px;">
                                <span data-i18n="imageWithText.blockSettings.video">Video</span>
                            </label>
                            <button class="shopify-button-secondary" onclick="window.selectBlockVideo('${block.id}')"
                                    style="width: 100%; padding: 10px 16px; font-size: 13px; background: #f6f6f7; border: 1px solid #ddd; border-radius: 4px; cursor: pointer; text-align: left; display: flex; justify-content: space-between; align-items: center;">
                                <span data-i18n="imageWithText.blockFields.selectVideo">Seleccionar</span>
                                <i class="material-icons" style="font-size: 18px; color: #999;">folder_open</i>
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        `;
    },
    
    attachEventListeners: function() {
        const self = this;
        
        // El sortable ahora se inicializa desde website-builder.js como multicolumn
        console.log('[IMAGE-WITH-TEXT] attachEventListeners called');
        
        // Back button handler for main settings view
        $('.back-to-sections-btn').off('click.mainview').on('click.mainview', function() {
            console.log('[IWT] Back button clicked, productContainerReturnData:', window.productContainerReturnData);
            if (window.productContainerReturnData && window.productContainerReturnData.returnTo) {
                const returnTo = window.productContainerReturnData.returnTo;
                window.productContainerReturnData = null;
                window.switchSidebarView(returnTo);
            } else {
                window.switchSidebarView('blockList');
            }
        });
        
        const updateConfig = (key, value) => {
            if (!currentSectionsConfig.imageWithText) {
                currentSectionsConfig.imageWithText = {};
            }
            currentSectionsConfig.imageWithText[key] = value;
            hasPendingPageStructureChanges = true;
            updateSaveButtonState();
            renderPreview();
        };
        
        // Main settings
        $('#iwt-color-scheme').on('change', function() {
            updateConfig('colorScheme', $(this).val());
        });
        
        $('#iwt-full-width').on('change', function() {
            updateConfig('fullWidth', $(this).is(':checked'));
        });
        
        $('#iwt-content-layout').on('change', function() {
            updateConfig('contentLayout', $(this).val());
        });
        
        $('#iwt-image-layout').on('change', function() {
            updateConfig('imageLayout', $(this).val());
        });
        
        $('#iwt-image-ratio').on('input', function() {
            const value = $(this).val();
            updateConfig('imageRatio', value);
            $(this).siblings('label').find('span:last').text(value + '%');
        });
        
        $('#iwt-rotate-images').on('change', function() {
            updateConfig('rotateImages', $(this).is(':checked'));
        });
        
        // Icon settings
        $('#iwt-icon').on('change', function() {
            updateConfig('icon', $(this).val());
        });
        
        // Custom icon upload buttons
        $(document).off('click.iwt-icon').on('click.iwt-icon', '.select-icon-btn, .change-icon-btn', function(e) {
            e.preventDefault();
            $('#custom-icon-input').click();
        });
        
        // Remove custom icon button
        $(document).off('click.iwt-remove-icon').on('click.iwt-remove-icon', '.remove-icon-btn', function(e) {
            e.preventDefault();
            updateConfig('customIcon', '');
            updateConfig('icon', 'none'); // Reset to none
            
            // Update UI
            $('.custom-icon-upload').html(`
                <button class="shopify-button select-icon-btn" style="background: #fff; border: 1px solid #ddd; padding: 8px 16px; cursor: pointer;">
                    <span data-i18n="imageWithText.fields.selectIcon">Seleccionar</span>
                </button>
            `);
            
            // Apply translations if needed
            if (typeof applyTranslations === 'function') {
                setTimeout(applyTranslations, 0);
            }
        });
        
        // Handle file upload
        $('#custom-icon-input').off('change').on('change', async function(e) {
            const file = e.target.files[0];
            if (file) {
                // Check file size (max 2MB)
                if (file.size > 2 * 1024 * 1024) {
                    alert('El archivo es demasiado grande. El tamaño máximo es 2MB.');
                    return;
                }
                
                // Check file type
                if (!file.type.startsWith('image/')) {
                    alert('Por favor selecciona un archivo de imagen.');
                    return;
                }
                
                // Convert to base64
                const reader = new FileReader();
                reader.onload = function(event) {
                    const base64 = event.target.result;
                    updateConfig('customIcon', base64);
                    updateConfig('icon', 'custom'); // Set icon to custom
                    
                    // Update UI
                    $('.custom-icon-upload').html(`
                        <div class="custom-icon-preview">
                            <img src="${base64}" alt="Custom icon" style="max-width: 64px; max-height: 64px; margin-bottom: 8px;">
                            <div>
                                <button class="shopify-button change-icon-btn" style="background: #fff; border: 1px solid #ddd; padding: 6px 12px; cursor: pointer; font-size: 12px;">
                                    Change icon
                                </button>
                                <button class="shopify-button remove-icon-btn" style="background: #fff; border: 1px solid #ddd; padding: 6px 12px; cursor: pointer; font-size: 12px; margin-left: 8px;">
                                    Remove
                                </button>
                            </div>
                        </div>
                    `);
                };
                reader.readAsDataURL(file);
            }
        });
        
        // Content settings
        $('#iwt-subheading').on('input', function() {
            updateConfig('subheading', $(this).val());
        });
        
        $('#iwt-heading').on('input', function() {
            updateConfig('heading', $(this).val());
        });
        
        $('#iwt-body').on('input', function() {
            updateConfig('body', $(this).val());
        });
        
        $('#iwt-heading-size').on('change', function() {
            updateConfig('headingSize', $(this).val());
        });
        
        $('#iwt-body-size').on('change', function() {
            updateConfig('bodySize', $(this).val());
        });
        
        // Content alignment buttons
        $('.alignment-btn').on('click', function(e) {
            e.preventDefault();
            const alignment = $(this).data('align');
            updateConfig('contentAlignment', alignment);
            
            // Update UI
            $('.alignment-btn').removeClass('active').css('background', '#fff');
            $(this).addClass('active').css('background', '#f0f0f0');
        });
        
        $('#iwt-desktop-width').on('input', function() {
            const value = $(this).val();
            updateConfig('desktopWidth', value);
            $(this).siblings('label').find('span:last').text(value + 'px');
        });
        
        // Button settings
        $('#iwt-first-button-label').on('input', function() {
            updateConfig('firstButtonLabel', $(this).val());
        });
        
        $('#iwt-first-button-link').on('input', function() {
            updateConfig('firstButtonLink', $(this).val());
        });
        
        $('#iwt-second-button-label').on('input', function() {
            updateConfig('secondButtonLabel', $(this).val());
        });
        
        $('#iwt-second-button-link').on('input', function() {
            updateConfig('secondButtonLink', $(this).val());
        });
        
        // Button style buttons
        $('.button-style-btn').on('click', function(e) {
            e.preventDefault();
            const button = $(this).data('button');
            const style = $(this).data('style');
            const configKey = button === 'first' ? 'firstButtonStyle' : 'secondButtonStyle';
            
            updateConfig(configKey, style);
            
            // Update UI for this button group
            $(this).siblings().removeClass('active').css('background', '#fff');
            $(this).addClass('active').css('background', '#f0f0f0');
        });
        
        // Padding settings
        $('#iwt-add-side-paddings').on('change', function() {
            updateConfig('addSidePaddings', $(this).is(':checked'));
        });
        
        $('#iwt-top-padding').on('input', function() {
            const value = $(this).val();
            updateConfig('topPadding', value);
            $(this).siblings('label').find('span:last').text(value + 'px');
        });
        
        $('#iwt-bottom-padding').on('input', function() {
            const value = $(this).val();
            updateConfig('bottomPadding', value);
            $(this).siblings('label').find('span:last').text(value + 'px');
        });
        
        // Card Border Radius
        $('#iwt-card-border-radius').on('input', function() {
            const value = $(this).val();
            updateConfig('cardBorderRadius', value);
            $(this).siblings('label').find('span:last').text(value + 'px');
        });
        
        // Section Paddings
        $('#iwt-section-top-padding').on('input', function() {
            const value = $(this).val();
            updateConfig('sectionTopPadding', value);
            $(this).siblings('label').find('span:last').text(value + 'px');
        });
        
        $('#iwt-section-bottom-padding').on('input', function() {
            const value = $(this).val();
            updateConfig('sectionBottomPadding', value);
            $(this).siblings('label').find('span:last').text(value + 'px');
        });
        
        // Sortable is now initialized from website-builder.js
        
        // Synchronize visibility toggle states after rendering
        setTimeout(() => {
            // Sync main section toggle
            $('.visibility-toggle[data-section="imageWithText"]').each(function() {
                const $button = $(this);
                const savedIsHidden = currentSectionsConfig.imageWithText?.isHidden;
                
                if (savedIsHidden && !$button.hasClass('is-hidden')) {
                    $button.addClass('is-hidden');
                } else if (!savedIsHidden && $button.hasClass('is-hidden')) {
                    $button.removeClass('is-hidden');
                }
            });
            
            // Sync block toggles
            $('.visibility-toggle[data-element-type="block"]').each(function() {
                const $button = $(this);
                const blockId = $button.data('element-id');
                const block = currentSectionsConfig.imageWithText?.blocks?.[blockId];
                
                if (block) {
                    const savedIsHidden = block.isHidden;
                    
                    if (savedIsHidden && !$button.hasClass('is-hidden')) {
                        $button.addClass('is-hidden');
                    } else if (!savedIsHidden && $button.hasClass('is-hidden')) {
                        $button.removeClass('is-hidden');
                    }
                }
            });
        }, 100);
    },
    
    attachBlockEventListeners: function(blockId) {
        // Back button handler - return to appropriate view
        $('.back-to-sections-btn').off('click.blockview').on('click.blockview', function() {
            if (window.productContainerReturnData && window.productContainerReturnData.returnTo) {
                // Return to Product Container Settings
                window.switchSidebarView(window.productContainerReturnData.returnTo);
                window.productContainerReturnData = null;
            } else {
                // Default behavior - go to Image with Text settings
                window.switchSidebarView('imageWithTextSettings');
            }
        });
        
        const updateBlock = (key, value) => {
            if (!currentSectionsConfig.imageWithText) return;
            if (!currentSectionsConfig.imageWithText.blocks) return;
            if (!currentSectionsConfig.imageWithText.blocks[blockId]) return;
            
            currentSectionsConfig.imageWithText.blocks[blockId][key] = value;
            hasPendingPageStructureChanges = true;
            updateSaveButtonState();
            renderPreview();
        };
        
        // Title settings
        $('#block-heading').on('input', function() {
            updateBlock('heading', $(this).val());
        });
        
        $('#block-title-size').on('change', function() {
            updateBlock('titleSize', $(this).val());
        });
        
        // Text settings
        $('#block-text').on('input', function() {
            updateBlock('text', $(this).val());
        });
        
        // Button settings
        $('#block-button-text').on('input', function() {
            updateBlock('buttonText', $(this).val());
        });
        
        $('#block-button-link').on('input', function() {
            updateBlock('buttonLink', $(this).val());
        });
        
        $('#block-button-outline').on('change', function() {
            updateBlock('buttonOutline', $(this).is(':checked'));
        });
        
        // Image alt text
        $('#block-image-alt').on('input', function() {
            updateBlock('imageAlt', $(this).val());
        });
        
        // Text format buttons
        $('.text-format-btn').on('click', function(e) {
            e.preventDefault();
            const format = $(this).data('format');
            // Aquí iría la lógica de formateo de texto
            console.log('Format:', format);
        });
        
        // Style tabs
        window.setBlockTextStyle = function(style) {
            updateBlock('textStyle', style);
            // Update UI
            $('.style-tab').removeClass('active');
            $('.style-tab').css({
                'background': '#fff',
                'color': '#333'
            });
            $(`.style-tab:contains('${style === 'subtitle' ? 'Subtítulo' : 'Cuerpo'}')`).css({
                'background': '#2962ff',
                'color': '#fff'
            });
        };
    },
    
    // Inicializar sortable para bloques - EXACTO como slideshow
    initializeChildrenSortable: function() {
        console.log('[IMAGE-WITH-TEXT] initializeChildrenSortable called');
        
        const $sortableContainer = $('#children-container');
        if ($sortableContainer.length === 0) {
            console.log('[IMAGE-WITH-TEXT] Container not found');
            return;
        }
        
        // CRÍTICO: Destruir CUALQUIER sortable existente de forma más agresiva
        try {
            if ($sortableContainer.hasClass('ui-sortable') || $sortableContainer.data('ui-sortable')) {
                console.log('[IMAGE-WITH-TEXT] Destroying existing sortable');
                $sortableContainer.sortable('destroy');
            }
        } catch (e) {
            console.log('[IMAGE-WITH-TEXT] Error destroying sortable:', e);
        }
        
        // Limpiar cualquier clase o data residual
        $sortableContainer.removeClass('ui-sortable ui-sortable-disabled');
        $sortableContainer.removeData('sortable').removeData('uiSortable');
        
        // Esperar un momento antes de reinicializar
        setTimeout(() => {
            console.log('[IMAGE-WITH-TEXT] Initializing fresh sortable');
            
            // Inicializar sortable con configuración específica para image-with-text
            $sortableContainer.sortable({
                items: '> .child-item',  // CRÍTICO: Solo hijos directos
                handle: '.drag-handle',
                placeholder: 'child-item-placeholder',
                tolerance: 'pointer',
                cursor: 'move',
                opacity: 0.8,
                revert: 200,
                // Agregar forceHelperSize para mantener el tamaño del helper cuando hay imágenes
                forceHelperSize: true,
                // Forzar placeholder a tener dimensiones correctas
                forcePlaceholderSize: true,
                // Prevenir propagación de eventos
                containment: 'parent',
                // Agregar z-index alto para asegurar que esté sobre otros elementos
                zIndex: 9999,
                start: function(e, ui) {
                    console.log('[IMAGE-WITH-TEXT] Drag started');
                    
                    // Guardar altura original del elemento
                    const originalHeight = ui.item.outerHeight();
                    
                    // Establecer altura fija en el helper para evitar colapso
                    ui.helper.css({
                        'height': originalHeight,
                        'width': ui.item.width(),
                        'z-index': 9999
                    });
                    
                    ui.placeholder.css({
                        'height': originalHeight,
                        'visibility': 'visible',
                        'background': '#f0f0f0',
                        'border': '1px dashed #999',
                        'border-radius': '4px',
                        'margin-bottom': '10px'
                    });
                    
                    // CRÍTICO: Hacer que el contenido del item sea invisible durante el drag
                    // pero mantener las dimensiones
                    ui.item.css('visibility', 'hidden');
                },
                stop: function(e, ui) {
                    console.log('[IMAGE-WITH-TEXT] Drag stopped');
                    
                    // Restaurar visibilidad
                    ui.item.css('visibility', 'visible');
                    
                    // Actualizar orden de bloques
                    const newOrder = [];
                    $('#children-container .child-item').each(function() {
                        const blockId = $(this).data('child-id');
                        if (blockId) {
                            newOrder.push(blockId);
                        }
                    });
                    
                    console.log('[IMAGE-WITH-TEXT] New order:', newOrder);
                    
                    if (!currentSectionsConfig.imageWithText) {
                        currentSectionsConfig.imageWithText = {};
                    }
                    currentSectionsConfig.imageWithText.blockOrder = newOrder;
                    
                    // Marcar cambios pendientes
                    if (typeof window.setHasPendingPageStructureChanges === 'function') {
                        window.setHasPendingPageStructureChanges(true);
                    } else if (typeof hasPendingPageStructureChanges !== 'undefined') {
                        hasPendingPageStructureChanges = true;
                    }
                    
                    if (typeof updateSaveButtonState === 'function') {
                        updateSaveButtonState();
                    }
                    if (typeof renderPreview === 'function') {
                        renderPreview();
                    }
                },
                // Usar helper 'clone' en lugar de función personalizada
                helper: 'clone'
            });
            
            // Verificar que se inicializó correctamente
            const isSortable = $sortableContainer.hasClass('ui-sortable');
            console.log('[IMAGE-WITH-TEXT] Sortable initialized:', isSortable);
            
            // Asegurar que los drag handles sean clickeables
            $('#children-container .drag-handle').each(function() {
                $(this).css({
                    'pointer-events': 'auto',
                    'cursor': 'move',
                    'user-select': 'none'
                });
            });
            
            // Debug: verificar cuántos items hay
            const itemCount = $('#children-container .child-item').length;
            console.log('[IMAGE-WITH-TEXT] Found', itemCount, 'sortable items');
            
        }, 150); // Dar más tiempo para que el DOM se estabilice
    },
    
    // Función de debug mejorada para diagnosticar problemas
    debugSortable: function() {
        console.log('=== IMAGE-WITH-TEXT SORTABLE DIAGNOSTIC ===');
        
        const $container = $('#children-container');
        console.log('1. Container check:', {
            exists: $container.length > 0,
            id: $container.attr('id'),
            classes: $container.attr('class'),
            html: $container.html() ? 'Has content' : 'Empty'
        });
        
        // Check items
        const $items = $container.find('.image-with-text-block-item');
        console.log('2. Items check:', {
            count: $items.length,
            selector: '.image-with-text-block-item'
        });
        
        // Check drag handles
        const $handles = $container.find('.drag-handle');
        console.log('3. Drag handles check:', {
            count: $handles.length,
            selector: '.drag-handle'
        });
        
        // Check sortable status
        console.log('4. Sortable status:', {
            hasClass: $container.hasClass('ui-sortable'),
            hasData: !!$container.data('ui-sortable'),
            sortableInstance: $container.data('ui-sortable')
        });
        
        // Check for conflicts
        const allSortables = $('.ui-sortable');
        console.log('5. All sortables on page:', allSortables.length);
        allSortables.each(function(index) {
            console.log(`   - Sortable ${index}:`, {
                id: $(this).attr('id'),
                items: $(this).find('.ui-sortable-handle').length
            });
        });
        
        // Check event handlers safely
        try {
            const events = $._data ? $._data($container[0], 'events') : null;
            console.log('6. Event handlers on container:', events || 'Unable to access');
        } catch (e) {
            console.log('6. Event handlers on container: Error accessing', e.message);
        }
        
        // Check each handle
        $handles.each(function(index) {
            const $handle = $(this);
            console.log(`7. Handle ${index} analysis:`, {
                css: {
                    cursor: $handle.css('cursor'),
                    pointerEvents: $handle.css('pointer-events'),
                    position: $handle.css('position'),
                    zIndex: $handle.css('z-index'),
                    display: $handle.css('display')
                },
                parent: $handle.parent().attr('class'),
                isVisible: $handle.is(':visible'),
                offset: $handle.offset()
            });
        });
        
        console.log('=== END DIAGNOSTIC ===');
    },
    
    initialize: function() {
        // Add translations for Image with Text module
        if (typeof translations !== 'undefined' && translations) {
            // Ensure structure exists
            if (!translations.es) translations.es = {};
            if (!translations.en) translations.en = {};
            if (!translations.es.imageWithText) translations.es.imageWithText = {};
            if (!translations.en.imageWithText) translations.en.imageWithText = {};
            
            // Spanish translations
            Object.assign(translations.es.imageWithText, {
                "settings.title": "Imagen con texto",
                "settings.blocks": "Bloques",
                "blocks.add": "Agregar bloque",
                "blocks.empty": "No hay bloques. Haz clic en 'Agregar bloque' para comenzar.",
                "actions.deleteConfirm": "¿Eliminar este bloque?",
                "blockSettings.imageTitle": "Imagen",
                "blockSettings.image": "Imagen",
                "blockSettings.video": "Video",
                "blockFields.selectImage": "Seleccionar",
                "blockFields.changeImage": "Cambiar imagen",
                "blockFields.addMoreImages": "Agregar más imágenes",
                "blockFields.browseFree": "Explorar imágenes gratuitas",
                "blockFields.selectVideo": "Seleccionar"
            });
            
            // English translations
            Object.assign(translations.en.imageWithText, {
                "settings.title": "Image with text",
                "settings.blocks": "Blocks",
                "blocks.add": "Add block",
                "blocks.empty": "No blocks. Click 'Add block' to start.",
                "actions.deleteConfirm": "Delete this block?",
                "blockSettings.imageTitle": "Image",
                "blockSettings.image": "Image",
                "blockSettings.video": "Video",
                "blockFields.selectImage": "Select",
                "blockFields.changeImage": "Change image",
                "blockFields.addMoreImages": "Add more images",
                "blockFields.browseFree": "Browse free images",
                "blockFields.selectVideo": "Select"
            });
        }
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
    }
};

// Global functions for Image with Text module
window.addImageWithTextBlock = function() {
    const blockId = 'block-' + Date.now();
    
    if (!currentSectionsConfig.imageWithText) {
        currentSectionsConfig.imageWithText = {};
    }
    if (!currentSectionsConfig.imageWithText.blocks) {
        currentSectionsConfig.imageWithText.blocks = {};
    }
    if (!currentSectionsConfig.imageWithText.blockOrder) {
        currentSectionsConfig.imageWithText.blockOrder = [];
    }
    
    currentSectionsConfig.imageWithText.blocks[blockId] = {
        id: blockId,
        image: '',
        images: [], // For collage mode
        video: '',
        isHidden: false
    };
    
    currentSectionsConfig.imageWithText.blockOrder.push(blockId);
    
    hasPendingPageStructureChanges = true;
    updateSaveButtonState();
    renderPreview();
    
    // Re-render the settings view with updated configuration
    const updatedConfig = currentSectionsConfig.imageWithText || {};
    window.backToImageWithTextSettings();
};

window.toggleImageWithTextBlockVisibility = function(blockId) {
    if (!currentSectionsConfig.imageWithText || 
        !currentSectionsConfig.imageWithText.blocks || 
        !currentSectionsConfig.imageWithText.blocks[blockId]) {
        return;
    }
    
    const block = currentSectionsConfig.imageWithText.blocks[blockId];
    block.isHidden = !block.isHidden;
    
    hasPendingPageStructureChanges = true;
    updateSaveButtonState();
    renderPreview();
    
    // Update visibility toggle button state
    const $button = $(`.visibility-toggle[onclick*="${blockId}"]`);
    if (block.isHidden) {
        $button.addClass('is-hidden');
    } else {
        $button.removeClass('is-hidden');
    }
};

window.deleteImageWithTextBlock = function(blockId) {
    if (!currentSectionsConfig.imageWithText || 
        !currentSectionsConfig.imageWithText.blocks || 
        !currentSectionsConfig.imageWithText.blocks[blockId]) {
        return;
    }
    
    const blockText = translations[currentLanguage]['imageWithText.actions.deleteConfirm'] || '¿Eliminar este bloque?';
    
    if (confirm(blockText)) {
        // Delete from blocks object
        delete currentSectionsConfig.imageWithText.blocks[blockId];
        
        // Remove from blockOrder array
        const index = currentSectionsConfig.imageWithText.blockOrder.indexOf(blockId);
        if (index > -1) {
            currentSectionsConfig.imageWithText.blockOrder.splice(index, 1);
        }
        
        hasPendingPageStructureChanges = true;
        updateSaveButtonState();
        renderPreview();
        
        // Re-render the settings view with updated configuration
        const updatedConfig = currentSectionsConfig.imageWithText || {};
        window.backToImageWithTextSettings();
    }
};


// Image/Video selection functions for block settings
window.selectBlockImage = function(blockId) {
    console.log('[IMAGE WITH TEXT] Select image for block:', blockId);
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';
    input.multiple = true; // Allow multiple selection
    
    input.onchange = function(e) {
        const files = Array.from(e.target.files);
        const config = currentSectionsConfig.imageWithText || {};
        const isCollageMode = config.imageLayout === 'collage';
        
        if (files.length > 0) {
            const processFiles = async () => {
                const images = [];
                
                for (const file of files) {
                    const dataUrl = await new Promise((resolve) => {
                        const reader = new FileReader();
                        reader.onload = (event) => resolve(event.target.result);
                        reader.readAsDataURL(file);
                    });
                    images.push({ src: dataUrl, alt: file.name });
                }
                
                if (currentSectionsConfig.imageWithText && 
                    currentSectionsConfig.imageWithText.blocks && 
                    currentSectionsConfig.imageWithText.blocks[blockId]) {
                    
                    const block = currentSectionsConfig.imageWithText.blocks[blockId];
                    
                    if (isCollageMode && images.length > 1) {
                        // For collage mode, store multiple images
                        block.images = images.slice(0, 4); // Max 4 images for collage
                        delete block.image; // Remove single image if exists
                    } else {
                        // For single image or grid mode
                        block.image = images[0].src;
                        block.imageAlt = images[0].alt;
                        delete block.images; // Remove multiple images if exists
                    }
                    
                    hasPendingPageStructureChanges = true;
                    updateSaveButtonState();
                    renderPreview();
                    
                    // NO recargar la vista - mantener al usuario en la misma vista
                    // Solo actualizar la imagen visualmente si es necesario
                    
                    // El sortable se maneja ahora desde website-builder.js
                }
            };
            
            processFiles();
        }
    };
    input.click();
};

window.changeBlockImage = function(blockId) {
    // Same as select for now
    window.selectBlockImage(blockId);
};

window.browseFreeImages = function(blockId) {
    console.log('[IMAGE WITH TEXT] Browse free images for block:', blockId);
    // TODO: Implement free images browser
    alert('Esta funcionalidad estará disponible próximamente');
};

window.selectBlockVideo = function(blockId) {
    console.log('[IMAGE WITH TEXT] Select video for block:', blockId);
    // TODO: Implement video selection
    alert('La selección de video estará disponible próximamente');
};

// Functions for handling multiple images
window.addMoreImages = function(blockId) {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';
    input.multiple = true;
    
    input.onchange = function(e) {
        const files = Array.from(e.target.files);
        
        if (files.length > 0) {
            const processFiles = async () => {
                const block = currentSectionsConfig.imageWithText?.blocks?.[blockId];
                if (!block) return;
                
                // Initialize images array if not exists
                if (!block.images) {
                    block.images = [];
                }
                
                for (const file of files) {
                    if (block.images.length >= 4) break; // Max 4 images
                    
                    const dataUrl = await new Promise((resolve) => {
                        const reader = new FileReader();
                        reader.onload = (event) => resolve(event.target.result);
                        reader.readAsDataURL(file);
                    });
                    
                    block.images.push({ src: dataUrl, alt: file.name });
                }
                
                hasPendingPageStructureChanges = true;
                updateSaveButtonState();
                renderPreview();
                
                // NO recargar la vista - mantener al usuario en la misma vista
                // window.switchSidebarView('imageWithTextBlockSettings', { blockId: blockId });
                
                // El sortable se maneja ahora desde website-builder.js
            };
            
            processFiles();
        }
    };
    input.click();
};

window.removeBlockImageAt = function(blockId, index) {
    const block = currentSectionsConfig.imageWithText?.blocks?.[blockId];
    if (!block || !block.images) return;
    
    block.images.splice(index, 1);
    
    // If no images left, switch back to single image mode
    if (block.images.length === 0) {
        delete block.images;
    }
    
    hasPendingPageStructureChanges = true;
    updateSaveButtonState();
    renderPreview();
    
    // NO recargar la vista - mantener al usuario en la misma vista
    // window.switchSidebarView('imageWithTextBlockSettings', { blockId: blockId });
    
    // El sortable se maneja ahora desde website-builder.js
};

// Exponer función de debug
window.debugImageWithTextSortable = function() {
    if (window.WebsiteBuilderModules && window.WebsiteBuilderModules.ImageWithText) {
        window.WebsiteBuilderModules.ImageWithText.debugSortable();
    }
};

// Auto-initialize when DOM is ready
if (typeof document !== 'undefined') {
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', function() {
            window.WebsiteBuilderModules.ImageWithText.initialize();
        });
    } else {
        window.WebsiteBuilderModules.ImageWithText.initialize();
    }
}