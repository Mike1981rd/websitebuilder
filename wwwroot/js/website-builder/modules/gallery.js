// Gallery Module for Website Builder
window.WebsiteBuilderModules = window.WebsiteBuilderModules || {};
window.WebsiteBuilderModules.Gallery = {
    render: function(config) {
        if (!config || config.isHidden) return '';
        
        const schemeColors = typeof getColorSchemeValues !== 'undefined' ? 
            getColorSchemeValues(config.colorScheme || 'default') : 
            { background: '#ffffff', text: '#333333' };
        
        const uniqueId = 'gallery-' + Date.now();
        const images = config.imageOrder || [];
        const isGrid = config.desktopLayout === 'grid';
        const containerClass = config.width === 'full' ? 'container-fluid' : 'container';
        const alignment = config.contentAlignment || 'center';
        
        // Debug imageRatio
        console.log('[GALLERY] Rendering with imageRatio:', config.imageRatio);
        
        // Get typography from global settings
        const headingTypography = window.currentGlobalThemeSettings?.typography?.heading || {};
        const bodyTypography = window.currentGlobalThemeSettings?.typography?.body || {};
        
        const headingFont = window.getFontNameFromValueSafe ? 
            window.getFontNameFromValueSafe(headingTypography.font || 'helvetica') : 
            'Helvetica';
        
        const bodyFont = window.getFontNameFromValueSafe ? 
            window.getFontNameFromValueSafe(bodyTypography.font || 'roboto') : 
            'Roboto';
        
        // Typography
        const headingTag = config.headingSize || 'h5';
        const bodyClass = config.bodySize || 'body3';
        
        // Get visible images
        const visibleImages = images.filter(imageId => {
            const image = config.images[imageId];
            return image && !image.isHidden;
        });
        
        return `
            <style>
                #${uniqueId} .gallery-content {
                    text-align: ${alignment};
                    margin-bottom: ${visibleImages.length > 0 ? '30px' : '0'};
                }
                
                #${uniqueId} h1, #${uniqueId} h2, #${uniqueId} h3, 
                #${uniqueId} h4, #${uniqueId} h5, #${uniqueId} h6 {
                    font-family: ${headingFont};
                    font-size: ${headingTypography.fontSize || '24px'};
                    font-weight: ${headingTypography.fontWeight || '600'};
                    margin: 0 0 10px 0;
                }
                
                #${uniqueId} .body1, #${uniqueId} .body2, #${uniqueId} .body3, #${uniqueId} .body4 {
                    font-family: ${bodyFont};
                    font-size: ${bodyTypography.fontSize || '16px'};
                    line-height: 1.5;
                }
                
                #${uniqueId} .gallery-grid {
                    display: grid;
                    grid-template-columns: repeat(${config.desktopCardsPerRow || 5}, 1fr);
                    gap: ${config.desktopSpaceBetweenCards || 16}px;
                }
                
                #${uniqueId} .gallery-carousel {
                    display: flex;
                    overflow-x: auto;
                    scroll-snap-type: x mandatory;
                    gap: ${config.desktopSpaceBetweenCards || 16}px;
                    ${config.showArrowsOnHover ? 'position: relative;' : ''}
                }
                
                #${uniqueId} .gallery-item {
                    position: relative;
                    border-radius: 4px;
                    overflow: hidden;
                    cursor: pointer;
                    transition: transform 0.2s ease;
                    width: 100%;
                    ${!isGrid ? 'flex: 0 0 calc(100% / ' + (config.desktopCardsPerRow || 5) + ' - ' + (config.desktopSpaceBetweenCards || 16) + 'px); scroll-snap-align: start;' : ''}
                }
                
                /* Image ratio implementation */
                #${uniqueId} .gallery-item-wrapper {
                    position: relative;
                    width: 100%;
                    height: 0;
                    padding-bottom: ${100 / (config.imageRatio || 1)}%;
                }
                
                #${uniqueId} .gallery-item-content {
                    position: absolute;
                    top: 0;
                    left: 0;
                    width: 100%;
                    height: 100%;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                }
                
                #${uniqueId} .gallery-item img,
                #${uniqueId} .gallery-item video {
                    width: 100%;
                    height: 100%;
                    object-fit: ${config.imageFit || 'cover'};
                }
                
                #${uniqueId} .gallery-item:hover {
                    transform: scale(1.02);
                }
                
                #${uniqueId} .gallery-item:hover > div[style*="opacity: 0"],
                #${uniqueId} .gallery-item:hover a > div[style*="opacity: 0"] {
                    opacity: 1 !important;
                }
                
                @media (max-width: 768px) {
                    #${uniqueId} .gallery-grid {
                        ${config.mobileLayout === 'grid' ? 
                            `grid-template-columns: repeat(2, 1fr); gap: ${config.mobileSpaceBetweenCards || 16}px;` : 
                            `display: flex; overflow-x: auto; scroll-snap-type: x mandatory; gap: ${config.mobileSpaceBetweenCards || 16}px; -webkit-overflow-scrolling: touch;`
                        }
                    }
                    
                    ${config.mobileLayout === 'carousel' ? `
                        #${uniqueId} .gallery-grid .gallery-item {
                            flex: 0 0 calc(50% - ${(config.mobileSpaceBetweenCards || 16) / 2}px);
                            scroll-snap-align: start;
                        }
                        
                        #${uniqueId} .gallery-carousel .gallery-item {
                            flex: 0 0 calc(50% - ${(config.mobileSpaceBetweenCards || 16) / 2}px);
                            scroll-snap-align: start;
                        }
                    ` : ''}
                    
                    #${uniqueId} h1, #${uniqueId} h2, #${uniqueId} h3, 
                    #${uniqueId} h4, #${uniqueId} h5, #${uniqueId} h6 {
                        font-size: calc(${headingTypography.fontSize || '24px'} * 0.85);
                    }
                    
                    #${uniqueId} .body1, #${uniqueId} .body2, #${uniqueId} .body3, #${uniqueId} .body4 {
                        font-size: calc(${bodyTypography.fontSize || '16px'} * 0.9);
                    }
                }
                
                #${uniqueId} .gallery-button {
                    margin-top: 30px;
                    text-align: ${alignment};
                }
                
                #${uniqueId} .gallery-button a {
                    display: inline-block;
                    padding: 12px 24px;
                    text-decoration: none;
                    border-radius: 4px;
                    transition: all 0.2s ease;
                    font-family: ${bodyFont};
                    font-size: ${bodyTypography.fontSize || '16px'};
                    ${config.buttonStyle === 'solid' ? 
                        `background: ${schemeColors.text}; color: ${schemeColors.background}; border: 2px solid ${schemeColors.text};` :
                        `background: transparent; color: ${schemeColors.text}; border: 2px solid ${schemeColors.text};`
                    }
                }
                
                #${uniqueId} .gallery-button a:hover {
                    ${config.buttonStyle === 'solid' ? 
                        `background: ${schemeColors.background}; color: ${schemeColors.text};` :
                        `background: ${schemeColors.text}; color: ${schemeColors.background};`
                    }
                }
                
                #${uniqueId} .video-play-overlay {
                    transition: opacity 0.3s ease;
                }
                
                #${uniqueId} .gallery-item:hover .video-play-overlay {
                    opacity: 0.8;
                }
                
                #${uniqueId} video {
                    cursor: pointer;
                }
            </style>
            <div id="${uniqueId}" class="section-wrapper" data-section-id="gallery" 
                 style="padding-top: ${config.topPadding || 64}px; padding-bottom: ${config.bottomPadding || 8}px; background-color: ${schemeColors.background}; color: ${schemeColors.text};">
                <div class="section-header-tag">
                    <span class="material-symbols-outlined" style="font-size: 16px; margin-right: 6px;">photo_library</span>
                    ${window.translations && window.translations[window.currentLanguage] ? 
                        (window.translations[window.currentLanguage]['sections.gallery'] || 'Gallery') : 
                        'Gallery'}
                </div>
                <div class="${containerClass}" style="${containerClass === 'container' ? 'max-width: 1200px;' : ''} margin: 0 auto; padding: 0 ${config.addSidePaddings ? '20px' : '0'};">
                    ${config.heading || config.body ? `
                        <div class="gallery-content">
                            ${config.heading ? `<${headingTag}>${config.heading}</${headingTag}>` : ''}
                            ${config.body ? `<div class="${bodyClass}">${config.body}</div>` : ''}
                        </div>
                    ` : ''}
                    
                    ${visibleImages.length > 0 ? `
                        <div class="${isGrid ? 'gallery-grid' : 'gallery-carousel'}">
                            ${visibleImages.map(imageId => {
                                const image = config.images[imageId];
                                const hasLink = image.link && image.link.trim() !== '' && image.link !== 'Pega un enlace o busca';
                                const showIcon = image.icon && image.icon !== 'none' && hasLink;
                                const hasVideo = image.videoSrc && image.videoSrc.trim() !== '';
                                
                                const iconMap = {
                                    'zoom': 'zoom_in',
                                    'play': 'play_arrow',
                                    'link': 'link'
                                };
                                
                                const mediaContent = hasVideo ? `
                                    <video src="${image.videoSrc}" 
                                           muted loop ${config.autoplayMode !== 'none' ? 'autoplay' : ''}
                                           poster="${image.src || ''}">
                                    </video>
                                    ${!config.autoplayMode || config.autoplayMode === 'none' ? `
                                        <div class="video-play-overlay" style="position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%); 
                                                    background: rgba(0,0,0,0.7); color: white; border-radius: 50%; 
                                                    width: 60px; height: 60px; display: flex; align-items: center; 
                                                    justify-content: center; cursor: pointer;">
                                            <i class="material-icons" style="font-size: 30px;">play_arrow</i>
                                        </div>
                                    ` : ''}
                                ` : (
                                    image.src ? 
                                        `<img src="${image.src}" alt="${image.alt || ''}">` :
                                        `<div style="width: 100%; height: 100%; display: flex; align-items: center; justify-content: center; background: transparent; border: 1px dashed #ddd;">
                                            <i class="material-icons" style="font-size: 48px; color: #ccc;">image</i>
                                         </div>`
                                );
                                
                                const content = `
                                    <div class="gallery-item-wrapper">
                                        <div class="gallery-item-content">
                                            ${mediaContent}
                                            ${showIcon && !hasVideo ? `
                                                <div style="position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%); 
                                                            background: rgba(0,0,0,0.7); color: white; border-radius: 50%; 
                                                            width: 50px; height: 50px; display: flex; align-items: center; 
                                                            justify-content: center; opacity: 0; transition: opacity 0.3s;">
                                                    <i class="material-icons">${iconMap[image.icon] || 'link'}</i>
                                                </div>
                                            ` : ''}
                                        </div>
                                    </div>
                                `;
                                
                                return `
                                    <div class="gallery-item gallery-item-${imageId}" data-image-id="${imageId}">
                                        ${hasLink ? `<a href="${image.link}" style="display: block; width: 100%; height: 100%;">${content}</a>` : content}
                                    </div>
                                `;
                            }).join('')}
                        </div>
                    ` : `
                        <div style="text-align: center; padding: 60px 20px;">
                            <i class="material-icons" style="font-size: 48px; color: #999;">photo_library</i>
                            <p style="margin-top: 20px; color: #666;">Click the + button to add images</p>
                        </div>
                    `}
                    
                    ${config.buttonLabel && config.buttonLabel.trim() !== '' && config.buttonLink && config.buttonLink.trim() !== '' && config.buttonLink !== 'Pega un enlace o busca' ? `
                        <div class="gallery-button">
                            <a href="${config.buttonLink}">${config.buttonLabel}</a>
                        </div>
                    ` : ''}
                </div>
            </div>
            
            <script>
                // Handle video play/pause
                document.querySelectorAll('#${uniqueId} .video-play-overlay').forEach(overlay => {
                    overlay.addEventListener('click', function(e) {
                        e.preventDefault();
                        e.stopPropagation();
                        const video = this.parentElement.querySelector('video');
                        if (video) {
                            video.play();
                            this.style.display = 'none';
                            video.setAttribute('controls', 'true');
                        }
                    });
                });
                
                // Handle video click to play/pause
                document.querySelectorAll('#${uniqueId} video').forEach(video => {
                    video.addEventListener('click', function(e) {
                        if (!this.hasAttribute('controls')) {
                            e.preventDefault();
                            e.stopPropagation();
                            this.play();
                            this.setAttribute('controls', 'true');
                            const overlay = this.parentElement.querySelector('.video-play-overlay');
                            if (overlay) overlay.style.display = 'none';
                        }
                    });
                });
                
                // Autoplay functionality
                ${config.autoplayMode === 'auto' ? `
                    let currentIndex = 0;
                    const items = document.querySelectorAll('#${uniqueId} .gallery-item');
                    const totalItems = items.length;
                    
                    if (totalItems > 1) {
                        setInterval(() => {
                            // Simulate carousel behavior for autoplay
                            if (document.querySelector('#${uniqueId} .gallery-carousel')) {
                                const carousel = document.querySelector('#${uniqueId} .gallery-carousel');
                                currentIndex = (currentIndex + 1) % totalItems;
                                const scrollAmount = items[0].offsetWidth + ${config.desktopSpaceBetweenCards || 16};
                                carousel.scrollTo({
                                    left: scrollAmount * currentIndex,
                                    behavior: 'smooth'
                                });
                            }
                        }, ${(config.autoplaySpeed || 3) * 1000});
                    }
                ` : ''}
            </script>
        `;
    },
    
    renderSettings: function(config) {
        const configData = config || {};
        
        return `
            <div style="display: flex; flex-direction: column; height: 100%; position: relative; overflow: hidden;">
                <div class="sidebar-view-header" style="position: relative; z-index: 10;">
                    <button class="back-to-sections-btn" onclick="if(window.productContainerReturnData && window.productContainerReturnData.returnTo) { window.switchSidebarView(window.productContainerReturnData.returnTo); window.productContainerReturnData = null; } else { window.switchSidebarView('blockList'); }">
                        <i class="material-icons">arrow_back</i>
                    </button>
                    <h3 data-i18n="sections.gallery">Gallery</h3>
                </div>
                
                <div style="padding: 20px; overflow-y: auto; overflow-x: hidden; flex: 1; height: calc(100% - 60px); box-sizing: border-box;">
                    ${this.renderColorSchemeSettings(configData)}
                    ${this.renderLayoutSettings(configData)}
                    ${this.renderContentSettings(configData)}
                    ${this.renderCardSettings(configData)}
                    ${this.renderButtonSettings(configData)}
                    ${this.renderAutoplaySettings(configData)}
                    ${this.renderPaddingSettings(configData)}
                </div>
            </div>
        `;
    },
    
    renderColorSchemeSettings: function(config) {
        return `
            <div class="settings-group">
                <h4 style="font-size: 13px; font-weight: 500; margin-bottom: 12px; color: #5c5e60;">Color scheme</h4>
                <select id="gallery-color-scheme" class="setting-select" data-field="colorScheme" style="width: 100%;">
                    <option value="default" ${config.colorScheme === 'default' ? 'selected' : ''}>Default</option>
                    <option value="scheme1" ${config.colorScheme === 'scheme1' ? 'selected' : ''}>Scheme 1</option>
                    <option value="scheme2" ${config.colorScheme === 'scheme2' ? 'selected' : ''}>Scheme 2</option>
                    <option value="scheme3" ${config.colorScheme === 'scheme3' ? 'selected' : ''}>Scheme 3</option>
                    <option value="scheme4" ${config.colorScheme === 'scheme4' ? 'selected' : ''}>Scheme 4</option>
                    <option value="scheme5" ${config.colorScheme === 'scheme5' ? 'selected' : ''}>Scheme 5</option>
                </select>
                <a href="#" style="color: #2962ff; font-size: 12px; text-decoration: none; margin-top: 5px; display: inline-block;">Learn about color schemes</a>
            </div>
        `;
    },
    
    renderLayoutSettings: function(config) {
        return `
            <div class="settings-group" style="margin-top: 20px;">
                <h4 style="font-size: 13px; font-weight: 500; margin-bottom: 12px; color: #5c5e60;">Width</h4>
                <select id="gallery-width" class="setting-select" data-field="width" style="width: 100%;">
                    <option value="page" ${config.width === 'page' ? 'selected' : ''}>Page</option>
                    <option value="full" ${config.width === 'full' ? 'selected' : ''}>Full width</option>
                </select>
            </div>
            
            <div class="settings-group" style="margin-top: 20px;">
                <h4 style="font-size: 13px; font-weight: 500; margin-bottom: 12px; color: #5c5e60;">Desktop layout</h4>
                <div style="display: flex; gap: 10px;">
                    <button class="layout-option ${config.desktopLayout === 'grid' ? 'active' : ''}" data-layout="grid" data-field="desktopLayout" style="flex: 1; padding: 10px; border: 1px solid #e3e3e3; background: ${config.desktopLayout === 'grid' ? '#f0f0f0' : 'white'}; cursor: pointer;">
                        Grid
                    </button>
                    <button class="layout-option ${config.desktopLayout === 'carousel' ? 'active' : ''}" data-layout="carousel" data-field="desktopLayout" style="flex: 1; padding: 10px; border: 1px solid #e3e3e3; background: ${config.desktopLayout === 'carousel' ? '#f0f0f0' : 'white'}; cursor: pointer;">
                        Carousel
                    </button>
                </div>
            </div>
            
            <div class="settings-group" style="margin-top: 20px;">
                <h4 style="font-size: 13px; font-weight: 500; margin-bottom: 12px; color: #5c5e60;">Mobile layout</h4>
                <select id="gallery-mobile-layout" class="setting-select" data-field="mobileLayout" style="width: 100%;">
                    <option value="carousel" ${config.mobileLayout === 'carousel' ? 'selected' : ''}>Carousel</option>
                    <option value="grid" ${config.mobileLayout === 'grid' ? 'selected' : ''}>Grid</option>
                </select>
            </div>
        `;
    },
    
    renderContentSettings: function(config) {
        return `
            <div class="settings-group" style="margin-top: 20px;">
                <h4 style="font-size: 13px; font-weight: 500; margin-bottom: 12px; color: #5c5e60;">Content</h4>
                
                <div style="margin-bottom: 15px;">
                    <label style="display: block; font-size: 12px; color: #5c5e60; margin-bottom: 5px;">Heading</label>
                    <input type="text" id="gallery-heading" value="${config.heading || 'Gallery'}" data-field="heading" 
                           style="width: 100%; padding: 8px 12px; border: 1px solid #e3e3e3; border-radius: 4px;">
                </div>
                
                <div style="margin-bottom: 15px;">
                    <label style="display: block; font-size: 12px; color: #5c5e60; margin-bottom: 5px;">Body</label>
                    <div style="border: 1px solid #e3e3e3; border-radius: 4px; padding: 8px;">
                        <div style="display: flex; gap: 5px; margin-bottom: 5px;">
                            <button class="text-format-btn" data-format="bold" style="padding: 4px 8px; border: 1px solid #e3e3e3; background: white; cursor: pointer;">
                                <i class="material-icons" style="font-size: 16px;">format_bold</i>
                            </button>
                            <button class="text-format-btn" data-format="italic" style="padding: 4px 8px; border: 1px solid #e3e3e3; background: white; cursor: pointer;">
                                <i class="material-icons" style="font-size: 16px;">format_italic</i>
                            </button>
                            <button class="text-format-btn" data-format="underline" style="padding: 4px 8px; border: 1px solid #e3e3e3; background: white; cursor: pointer;">
                                <i class="material-icons" style="font-size: 16px;">format_underlined</i>
                            </button>
                            <button class="text-format-btn" data-format="link" style="padding: 4px 8px; border: 1px solid #e3e3e3; background: white; cursor: pointer;">
                                <i class="material-icons" style="font-size: 16px;">link</i>
                            </button>
                        </div>
                        <textarea id="gallery-body" data-field="body" rows="3" 
                                  style="width: 100%; border: none; outline: none; resize: vertical;">${config.body || 'Show your products, collections, and social media photos or tell about recent events.'}</textarea>
                    </div>
                </div>
                
                <div style="margin-bottom: 15px;">
                    <label style="display: block; font-size: 12px; color: #5c5e60; margin-bottom: 5px;">Heading size</label>
                    <select id="gallery-heading-size" class="setting-select" data-field="headingSize" style="width: 100%;">
                        <option value="h1" ${config.headingSize === 'h1' ? 'selected' : ''}>Heading 1</option>
                        <option value="h2" ${config.headingSize === 'h2' ? 'selected' : ''}>Heading 2</option>
                        <option value="h3" ${config.headingSize === 'h3' ? 'selected' : ''}>Heading 3</option>
                        <option value="h4" ${config.headingSize === 'h4' ? 'selected' : ''}>Heading 4</option>
                        <option value="h5" ${config.headingSize === 'h5' ? 'selected' : ''}>Heading 5</option>
                    </select>
                </div>
                
                <div style="margin-bottom: 15px;">
                    <label style="display: block; font-size: 12px; color: #5c5e60; margin-bottom: 5px;">Body size</label>
                    <select id="gallery-body-size" class="setting-select" data-field="bodySize" style="width: 100%;">
                        <option value="body1" ${config.bodySize === 'body1' ? 'selected' : ''}>Body 1</option>
                        <option value="body2" ${config.bodySize === 'body2' ? 'selected' : ''}>Body 2</option>
                        <option value="body3" ${config.bodySize === 'body3' ? 'selected' : ''}>Body 3</option>
                        <option value="body4" ${config.bodySize === 'body4' ? 'selected' : ''}>Body 4</option>
                    </select>
                </div>
                
                <div style="margin-bottom: 15px;">
                    <label style="display: block; font-size: 12px; color: #5c5e60; margin-bottom: 5px;">Content alignment</label>
                    <div style="display: flex; gap: 5px;">
                        <button class="align-btn ${config.contentAlignment === 'left' ? 'active' : ''}" data-align="left" data-field="contentAlignment" 
                                style="flex: 1; padding: 8px; border: 1px solid #e3e3e3; background: ${config.contentAlignment === 'left' ? '#f0f0f0' : 'white'}; cursor: pointer;">
                            <i class="material-icons" style="font-size: 18px;">format_align_left</i>
                        </button>
                        <button class="align-btn ${config.contentAlignment === 'center' ? 'active' : ''}" data-align="center" data-field="contentAlignment" 
                                style="flex: 1; padding: 8px; border: 1px solid #e3e3e3; background: ${config.contentAlignment === 'center' ? '#f0f0f0' : 'white'}; cursor: pointer;">
                            <i class="material-icons" style="font-size: 18px;">format_align_center</i>
                        </button>
                        <button class="align-btn ${config.contentAlignment === 'right' ? 'active' : ''}" data-align="right" data-field="contentAlignment" 
                                style="flex: 1; padding: 8px; border: 1px solid #e3e3e3; background: ${config.contentAlignment === 'right' ? '#f0f0f0' : 'white'}; cursor: pointer;">
                            <i class="material-icons" style="font-size: 18px;">format_align_right</i>
                        </button>
                    </div>
                </div>
            </div>
        `;
    },
    
    renderCardSettings: function(config) {
        return `
            <div class="settings-group" style="margin-top: 20px;">
                <h4 style="font-size: 13px; font-weight: 500; margin-bottom: 12px; color: #5c5e60;">Cards</h4>
                
                <div style="margin-bottom: 15px;">
                    <label style="display: block; font-size: 12px; color: #5c5e60; margin-bottom: 5px;">Image ratio (width:height)</label>
                    <div style="display: flex; align-items: center; gap: 10px;">
                        <input type="range" id="gallery-image-ratio" min="0.5" max="2" step="0.1" 
                               value="${config.imageRatio || 1}" data-field="imageRatio"
                               style="flex: 1;">
                        <input type="number" id="gallery-image-ratio-value" min="0.5" max="2" step="0.1"
                               value="${config.imageRatio || 1}" data-field="imageRatio"
                               style="width: 60px; padding: 4px 8px; border: 1px solid #e3e3e3; border-radius: 4px;">
                    </div>
                    <small style="color: #999; font-size: 11px;">
                        ${config.imageRatio < 1 ? 'Portrait' : config.imageRatio > 1 ? 'Landscape' : 'Square'} 
                        (${config.imageRatio || 1}:1)
                    </small>
                </div>
                
                <div style="margin-bottom: 15px;">
                    <label style="display: block; font-size: 12px; color: #5c5e60; margin-bottom: 5px;">Image fit</label>
                    <select id="gallery-image-fit" class="setting-select" data-field="imageFit" style="width: 100%;">
                        <option value="cover" ${config.imageFit === 'cover' || !config.imageFit ? 'selected' : ''}>Cover (crop to fill)</option>
                        <option value="contain" ${config.imageFit === 'contain' ? 'selected' : ''}>Contain (show full image)</option>
                        <option value="fill" ${config.imageFit === 'fill' ? 'selected' : ''}>Fill (stretch to fit)</option>
                    </select>
                </div>
                
                <div style="margin-bottom: 15px;">
                    <label style="display: block; font-size: 12px; color: #5c5e60; margin-bottom: 5px;">Desktop cards per row</label>
                    <div style="display: flex; align-items: center; gap: 10px;">
                        <input type="range" id="gallery-desktop-cards" min="1" max="6" 
                               value="${config.desktopCardsPerRow || 5}" data-field="desktopCardsPerRow"
                               style="flex: 1;">
                        <input type="number" id="gallery-desktop-cards-value" min="1" max="6"
                               value="${config.desktopCardsPerRow || 5}" data-field="desktopCardsPerRow"
                               style="width: 60px; padding: 4px 8px; border: 1px solid #e3e3e3; border-radius: 4px;">
                    </div>
                </div>
                
                <div style="margin-bottom: 15px;">
                    <label style="display: block; font-size: 12px; color: #5c5e60; margin-bottom: 5px;">Desktop space between cards</label>
                    <div style="display: flex; align-items: center; gap: 10px;">
                        <input type="range" id="gallery-desktop-space" min="0" max="40" 
                               value="${config.desktopSpaceBetweenCards || 16}" data-field="desktopSpaceBetweenCards"
                               style="flex: 1;">
                        <div style="display: flex; align-items: center; gap: 5px;">
                            <input type="number" id="gallery-desktop-space-value" min="0" max="40"
                                   value="${config.desktopSpaceBetweenCards || 16}" data-field="desktopSpaceBetweenCards"
                                   style="width: 60px; padding: 4px 8px; border: 1px solid #e3e3e3; border-radius: 4px;">
                            <span style="font-size: 12px; color: #5c5e60;">px</span>
                        </div>
                    </div>
                </div>
                
                <div style="margin-bottom: 15px;">
                    <label style="display: block; font-size: 12px; color: #5c5e60; margin-bottom: 5px;">Mobile space between cards</label>
                    <div style="display: flex; align-items: center; gap: 10px;">
                        <input type="range" id="gallery-mobile-space" min="0" max="40" 
                               value="${config.mobileSpaceBetweenCards || 16}" data-field="mobileSpaceBetweenCards"
                               style="flex: 1;">
                        <div style="display: flex; align-items: center; gap: 5px;">
                            <input type="number" id="gallery-mobile-space-value" min="0" max="40"
                                   value="${config.mobileSpaceBetweenCards || 16}" data-field="mobileSpaceBetweenCards"
                                   style="width: 60px; padding: 4px 8px; border: 1px solid #e3e3e3; border-radius: 4px;">
                            <span style="font-size: 12px; color: #5c5e60;">px</span>
                        </div>
                    </div>
                </div>
                
                <div style="margin-bottom: 15px;">
                    <label style="display: flex; align-items: center; gap: 10px;">
                        <input type="checkbox" id="gallery-show-arrows" ${config.showArrowsOnHover ? 'checked' : ''} data-field="showArrowsOnHover">
                        <span style="font-size: 12px; color: #5c5e60;">Show arrows on hover</span>
                    </label>
                </div>
            </div>
        `;
    },
    
    renderButtonSettings: function(config) {
        return `
            <div class="settings-group" style="margin-top: 20px;">
                <h4 style="font-size: 13px; font-weight: 500; margin-bottom: 12px; color: #5c5e60;">Button</h4>
                
                <div style="margin-bottom: 15px;">
                    <label style="display: block; font-size: 12px; color: #5c5e60; margin-bottom: 5px;">Button label</label>
                    <input type="text" id="gallery-button-label" value="${config.buttonLabel || ''}" data-field="buttonLabel" 
                           style="width: 100%; padding: 8px 12px; border: 1px solid #e3e3e3; border-radius: 4px;">
                </div>
                
                <div style="margin-bottom: 15px;">
                    <label style="display: block; font-size: 12px; color: #5c5e60; margin-bottom: 5px;">Button link</label>
                    <input type="text" id="gallery-button-link" value="${config.buttonLink || 'Pega un enlace o busca'}" data-field="buttonLink" 
                           style="width: 100%; padding: 8px 12px; border: 1px solid #e3e3e3; border-radius: 4px;">
                </div>
                
                <div style="margin-bottom: 15px;">
                    <label style="display: block; font-size: 12px; color: #5c5e60; margin-bottom: 5px;">Button style</label>
                    <div style="display: flex; gap: 10px;">
                        <button class="style-option ${config.buttonStyle === 'solid' ? 'active' : ''}" data-style="solid" data-field="buttonStyle" 
                                style="flex: 1; padding: 10px; border: 1px solid #e3e3e3; background: ${config.buttonStyle === 'solid' ? '#f0f0f0' : 'white'}; cursor: pointer;">
                            Solid
                        </button>
                        <button class="style-option ${config.buttonStyle === 'outline' ? 'active' : ''}" data-style="outline" data-field="buttonStyle" 
                                style="flex: 1; padding: 10px; border: 1px solid #e3e3e3; background: ${config.buttonStyle === 'outline' ? '#f0f0f0' : 'white'}; cursor: pointer;">
                            Outline
                        </button>
                    </div>
                </div>
            </div>
        `;
    },
    
    renderAutoplaySettings: function(config) {
        return `
            <div class="settings-group" style="margin-top: 20px;">
                <h4 style="font-size: 13px; font-weight: 500; margin-bottom: 12px; color: #5c5e60;">Autoplay</h4>
                
                <div style="margin-bottom: 15px;">
                    <label style="display: block; font-size: 12px; color: #5c5e60; margin-bottom: 5px;">Autoplay mode</label>
                    <select id="gallery-autoplay-mode" class="setting-select" data-field="autoplayMode" style="width: 100%;">
                        <option value="none" ${config.autoplayMode === 'none' ? 'selected' : ''}>None</option>
                        <option value="auto" ${config.autoplayMode === 'auto' ? 'selected' : ''}>Auto</option>
                        <option value="manual" ${config.autoplayMode === 'manual' ? 'selected' : ''}>Manual</option>
                    </select>
                </div>
                
                <div style="margin-bottom: 15px; ${config.autoplayMode === 'none' ? 'display: none;' : ''}">
                    <label style="display: block; font-size: 12px; color: #5c5e60; margin-bottom: 5px;">Autoplay speed</label>
                    <div style="display: flex; align-items: center; gap: 10px;">
                        <input type="range" id="gallery-autoplay-speed" min="1" max="10" 
                               value="${config.autoplaySpeed || 3}" data-field="autoplaySpeed"
                               style="flex: 1;">
                        <input type="number" id="gallery-autoplay-speed-value" min="1" max="10"
                               value="${config.autoplaySpeed || 3}" data-field="autoplaySpeed"
                               style="width: 60px; padding: 4px 8px; border: 1px solid #e3e3e3; border-radius: 4px;">
                    </div>
                </div>
            </div>
        `;
    },
    
    renderPaddingSettings: function(config) {
        return `
            <div class="settings-group" style="margin-top: 20px;">
                <h4 style="font-size: 13px; font-weight: 500; margin-bottom: 12px; color: #5c5e60;">Paddings</h4>
                
                <div style="margin-bottom: 15px;">
                    <label style="display: flex; align-items: center; gap: 10px;">
                        <span style="font-size: 12px; color: #5c5e60;">Add side paddings</span>
                        <input type="checkbox" id="gallery-add-paddings" ${config.addSidePaddings ? 'checked' : ''} data-field="addSidePaddings" 
                               style="margin-left: auto;">
                    </label>
                </div>
                
                <div style="margin-bottom: 15px;">
                    <label style="display: block; font-size: 12px; color: #5c5e60; margin-bottom: 5px;">Top padding</label>
                    <div style="display: flex; align-items: center; gap: 10px;">
                        <input type="range" id="gallery-top-padding" min="0" max="100" 
                               value="${config.topPadding || 64}" data-field="topPadding"
                               style="flex: 1;">
                        <div style="display: flex; align-items: center; gap: 5px;">
                            <input type="number" id="gallery-top-padding-value" min="0" max="100"
                                   value="${config.topPadding || 64}" data-field="topPadding"
                                   style="width: 60px; padding: 4px 8px; border: 1px solid #e3e3e3; border-radius: 4px;">
                            <span style="font-size: 12px; color: #5c5e60;">px</span>
                        </div>
                    </div>
                </div>
                
                <div style="margin-bottom: 15px;">
                    <label style="display: block; font-size: 12px; color: #5c5e60; margin-bottom: 5px;">Bottom padding</label>
                    <div style="display: flex; align-items: center; gap: 10px;">
                        <input type="range" id="gallery-bottom-padding" min="0" max="100" 
                               value="${config.bottomPadding || 8}" data-field="bottomPadding"
                               style="flex: 1;">
                        <div style="display: flex; align-items: center; gap: 5px;">
                            <input type="number" id="gallery-bottom-padding-value" min="0" max="100"
                                   value="${config.bottomPadding || 8}" data-field="bottomPadding"
                                   style="width: 60px; padding: 4px 8px; border: 1px solid #e3e3e3; border-radius: 4px;">
                            <span style="font-size: 12px; color: #5c5e60;">px</span>
                        </div>
                    </div>
                </div>
            </div>
        `;
    },
    
    renderImageSettings: function(imageId) {
        const galleryConfig = currentSectionsConfig.gallery || {};
        const image = galleryConfig.images?.[imageId] || {};
        
        return `
            <div style="display: flex; flex-direction: column; height: 100%; position: relative; overflow: hidden;">
                <div class="sidebar-view-header" style="position: relative; z-index: 10;">
                    <button class="back-to-sections-btn" onclick="if(window.productContainerReturnData && window.productContainerReturnData.returnTo) { window.switchSidebarView(window.productContainerReturnData.returnTo); window.productContainerReturnData = null; } else { window.switchSidebarView('gallerySettings'); }">
                        <i class="material-icons">arrow_back</i>
                    </button>
                    <h3 data-i18n="gallery.image.title">Image</h3>
                </div>
                
                <div style="padding: 20px; overflow-y: auto; overflow-x: hidden; flex: 1; height: calc(100% - 60px); box-sizing: border-box;">
                    <div class="settings-group">
                        <h4 style="font-size: 13px; font-weight: 500; margin-bottom: 12px; color: #5c5e60;" data-i18n="gallery.image.title">Image</h4>
                        <div class="image-upload-area" style="border: 2px dashed #e3e3e3; border-radius: 4px; padding: 20px; text-align: center; cursor: pointer; margin-bottom: 10px;">
                            ${image.src ? 
                                `<img src="${image.src}" alt="${image.alt || ''}" style="max-width: 100%; max-height: 200px; margin-bottom: 10px;">` :
                                `<i class="material-icons" style="font-size: 48px; color: #999;">image</i>`
                            }
                            <p style="margin: 10px 0; font-size: 13px; color: #5c5e60;" data-i18n="gallery.image.select">Seleccionar</p>
                            <p style="margin: 0; font-size: 11px; color: #999;" data-i18n="gallery.image.browse">Explorar imágenes<br>gratuitas</p>
                        </div>
                        <input type="file" id="gallery-image-upload-${imageId}" accept="image/*" style="display: none;" data-image-id="${imageId}">
                        
                        <div style="margin-top: 10px;">
                            <label style="display: block; font-size: 12px; color: #5c5e60; margin-bottom: 5px;" data-i18n="gallery.image.altText">Alt text</label>
                            <input type="text" id="gallery-image-alt-${imageId}" value="${image.alt || ''}" 
                                   placeholder="Describe la imagen para accesibilidad" data-field="alt" data-image-id="${imageId}"
                                   data-i18n-placeholder="gallery.image.altPlaceholder"
                                   style="width: 100%; padding: 8px 12px; border: 1px solid #e3e3e3; border-radius: 4px;">
                            <p style="font-size: 11px; color: #999; margin-top: 5px;" data-i18n="gallery.image.altHelp">Importante para SEO y accesibilidad</p>
                        </div>
                    </div>
                    
                    <div class="settings-group" style="margin-top: 20px;">
                        <h4 style="font-size: 13px; font-weight: 500; margin-bottom: 12px; color: #5c5e60;" data-i18n="gallery.video.title">Video</h4>
                        <div class="video-upload-area" style="border: 1px solid #e3e3e3; border-radius: 4px; padding: 15px; text-align: center; cursor: pointer; position: relative;">
                            ${image.videoSrc ? 
                                `<video src="${image.videoSrc}" style="max-width: 100%; max-height: 150px;" controls></video>
                                 <button class="remove-video-btn" data-image-id="${imageId}" style="position: absolute; top: 5px; right: 5px; background: rgba(0,0,0,0.7); color: white; border: none; border-radius: 50%; width: 30px; height: 30px; cursor: pointer;">
                                     <i class="material-icons" style="font-size: 16px;">close</i>
                                 </button>` :
                                `<i class="material-icons" style="font-size: 36px; color: #999;">videocam</i>
                                 <p style="margin: 10px 0 0 0; font-size: 13px; color: #5c5e60;" data-i18n="gallery.video.select">Seleccionar video</p>`
                            }
                        </div>
                        <input type="file" id="gallery-video-upload-${imageId}" accept="video/*" style="display: none;" data-image-id="${imageId}">
                        <p style="font-size: 11px; color: #999; margin-top: 5px;" data-i18n="gallery.video.help">El video reemplazará la imagen cuando se reproduzca</p>
                    </div>
                    
                    <div class="settings-group" style="margin-top: 20px;">
                        <h4 style="font-size: 13px; font-weight: 500; margin-bottom: 12px; color: #5c5e60;" data-i18n="gallery.link.title">Link</h4>
                        <input type="text" id="gallery-image-link-${imageId}" value="${image.link || ''}" 
                               placeholder="Pega un enlace o busca" data-field="link" data-image-id="${imageId}"
                               data-i18n-placeholder="gallery.link.placeholder"
                               style="width: 100%; padding: 8px 12px; border: 1px solid #e3e3e3; border-radius: 4px;">
                    </div>
                    
                    <div class="settings-group" style="margin-top: 20px;">
                        <h4 style="font-size: 13px; font-weight: 500; margin-bottom: 12px; color: #5c5e60;" data-i18n="gallery.icon.title">Icon</h4>
                        <select id="gallery-image-icon-${imageId}" class="setting-select" data-field="icon" data-image-id="${imageId}" style="width: 100%;">
                            <option value="none" ${image.icon === 'none' ? 'selected' : ''} data-i18n="gallery.icon.none">None</option>
                            <option value="zoom" ${image.icon === 'zoom' ? 'selected' : ''} data-i18n="gallery.icon.zoom">Zoom</option>
                            <option value="play" ${image.icon === 'play' ? 'selected' : ''} data-i18n="gallery.icon.play">Play</option>
                            <option value="link" ${image.icon === 'link' ? 'selected' : ''} data-i18n="gallery.icon.link">Link</option>
                        </select>
                        <a href="#" style="color: #2962ff; font-size: 12px; text-decoration: none; margin-top: 5px; display: inline-block;" data-i18n="gallery.icon.help">See what icon stands for each label.</a>
                        <p style="font-size: 11px; color: #999; margin-top: 5px;" data-i18n="gallery.icon.note">Without a link the icon disappears</p>
                    </div>
                </div>
            </div>
        `;
    },
    
    attachImageEventListeners: function(imageId) {
        console.log('[GALLERY] Attaching image event listeners for:', imageId);
        
        // Helper function to update image data and sync with product container
        const updateImageData = (key, value) => {
            const galleryConfig = window.currentSectionsConfig.gallery || {};
            if (galleryConfig.images && galleryConfig.images[imageId]) {
                galleryConfig.images[imageId][key] = value;
                
                // If coming from product container, also update the gallery images in product container structure
                if (window.productContainerReturnData && window.productContainerReturnData.fromView === 'productContainer') {
                    const productContainer = window.currentSectionsConfig['product-container'];
                    if (productContainer?.sections?.gallery?.config?.images) {
                        const galleryImage = productContainer.sections.gallery.config.images.find(img => String(img.id) === String(imageId));
                        if (galleryImage) {
                            galleryImage[key] = value;
                            console.log('[GALLERY] Synced gallery image update to product container:', imageId, key, value);
                        }
                    }
                }
                
                if (window.setHasPendingPageStructureChanges) {
                    window.setHasPendingPageStructureChanges(true);
                } else {
                    window.hasPendingPageStructureChanges = true;
                }
                
                if (window.updateSaveButtonState) {
                    window.updateSaveButtonState();
                }
                
                if (window.renderPreview) {
                    window.renderPreview();
                }
            }
        };
        
        // Add translations for image settings
        if (!window.translations) window.translations = { es: {}, en: {} };
        
        // Spanish translations
        window.translations.es['gallery.image.title'] = 'Imagen';
        window.translations.es['gallery.image.select'] = 'Seleccionar';
        window.translations.es['gallery.image.browse'] = 'Explorar imágenes gratuitas';
        window.translations.es['gallery.image.altText'] = 'Texto alternativo';
        window.translations.es['gallery.image.altPlaceholder'] = 'Describe la imagen para accesibilidad';
        window.translations.es['gallery.image.altHelp'] = 'Importante para SEO y accesibilidad';
        window.translations.es['gallery.video.title'] = 'Video';
        window.translations.es['gallery.video.select'] = 'Seleccionar video';
        window.translations.es['gallery.video.help'] = 'El video reemplazará la imagen cuando se reproduzca';
        window.translations.es['gallery.link.title'] = 'Enlace';
        window.translations.es['gallery.link.placeholder'] = 'Pega un enlace o busca';
        window.translations.es['gallery.icon.title'] = 'Ícono';
        window.translations.es['gallery.icon.none'] = 'Ninguno';
        window.translations.es['gallery.icon.zoom'] = 'Zoom';
        window.translations.es['gallery.icon.play'] = 'Reproducir';
        window.translations.es['gallery.icon.link'] = 'Enlace';
        window.translations.es['gallery.icon.help'] = 'Ver qué representa cada ícono';
        window.translations.es['gallery.icon.note'] = 'Sin un enlace el ícono desaparece';
        
        // English translations
        window.translations.en['gallery.image.title'] = 'Image';
        window.translations.en['gallery.image.select'] = 'Select';
        window.translations.en['gallery.image.browse'] = 'Browse free images';
        window.translations.en['gallery.image.altText'] = 'Alt text';
        window.translations.en['gallery.image.altPlaceholder'] = 'Describe the image for accessibility';
        window.translations.en['gallery.image.altHelp'] = 'Important for SEO and accessibility';
        window.translations.en['gallery.video.title'] = 'Video';
        window.translations.en['gallery.video.select'] = 'Select video';
        window.translations.en['gallery.video.help'] = 'Video will replace the image when played';
        window.translations.en['gallery.link.title'] = 'Link';
        window.translations.en['gallery.link.placeholder'] = 'Paste a link or search';
        window.translations.en['gallery.icon.title'] = 'Icon';
        window.translations.en['gallery.icon.none'] = 'None';
        window.translations.en['gallery.icon.zoom'] = 'Zoom';
        window.translations.en['gallery.icon.play'] = 'Play';
        window.translations.en['gallery.icon.link'] = 'Link';
        window.translations.en['gallery.icon.help'] = 'See what icon stands for each label';
        window.translations.en['gallery.icon.note'] = 'Without a link the icon disappears';
        
        // Back button - CRÍTICO: Debe regresar al panel lateral, no a gallery settings
        // Comentado porque el onclick inline en el botón ya maneja esto correctamente
        // $('.back-to-sections-btn').off('click').on('click', function() {
        //     if (window.productContainerReturnData && window.productContainerReturnData.returnTo) {
        //         window.switchSidebarView(window.productContainerReturnData.returnTo);
        //         window.productContainerReturnData = null;
        //     } else {
        //         window.switchSidebarView('blockList');
        //     }
        // });
        
        // Image upload
        $('.image-upload-area').off('click').on('click', function() {
            $(`#gallery-image-upload-${imageId}`).click();
        });
        
        $(document).off('change.gallery-image-upload').on('change.gallery-image-upload', `#gallery-image-upload-${imageId}`, function(e) {
            const file = e.target.files[0];
            if (file) {
                const reader = new FileReader();
                reader.onload = function(e) {
                    // Update image source
                    updateImageData('src', e.target.result);
                    
                    // Update preview UI
                    const $uploadArea = $('.image-upload-area');
                    $uploadArea.find('img').remove();
                    $uploadArea.find('i').remove();
                    const $paragraphs = $uploadArea.find('p');
                    $paragraphs.first().before(`<img src="${e.target.result}" alt="" style="max-width: 100%; max-height: 200px; margin-bottom: 10px;">`);
                };
                reader.readAsDataURL(file);
            }
        });
        
        // Video upload
        $('.video-upload-area').off('click').on('click', function(e) {
            if (!$(e.target).hasClass('remove-video-btn') && !$(e.target).parent().hasClass('remove-video-btn')) {
                $(`#gallery-video-upload-${imageId}`).click();
            }
        });
        
        $(document).off('change.gallery-video-upload').on('change.gallery-video-upload', `#gallery-video-upload-${imageId}`, function(e) {
            const file = e.target.files[0];
            if (file) {
                const reader = new FileReader();
                reader.onload = function(e) {
                    // Update video source
                    updateImageData('videoSrc', e.target.result);
                    
                    // Update preview UI
                    const $uploadArea = $('.video-upload-area');
                    $uploadArea.html(`
                        <video src="${e.target.result}" style="max-width: 100%; max-height: 150px;" controls></video>
                        <button class="remove-video-btn" data-image-id="${imageId}" style="position: absolute; top: 5px; right: 5px; background: rgba(0,0,0,0.7); color: white; border: none; border-radius: 50%; width: 30px; height: 30px; cursor: pointer;">
                            <i class="material-icons" style="font-size: 16px;">close</i>
                        </button>
                    `);
                };
                reader.readAsDataURL(file);
            }
        });
        
        // Remove video button
        $(document).off('click.gallery-remove-video').on('click.gallery-remove-video', '.remove-video-btn', function(e) {
            e.preventDefault();
            e.stopPropagation();
            
            // Remove video source
            updateImageData('videoSrc', '');
            
            // Update preview UI
            const $uploadArea = $('.video-upload-area');
            $uploadArea.html(`
                <i class="material-icons" style="font-size: 36px; color: #999;">videocam</i>
                <p style="margin: 10px 0 0 0; font-size: 13px; color: #5c5e60;">Seleccionar video</p>
            `);
        });
        
        // Alt text input
        $(document).off('input.gallery-image-alt').on('input.gallery-image-alt', `#gallery-image-alt-${imageId}`, function() {
            updateImageData('alt', $(this).val());
        });
        
        // Link input
        $(document).off('input.gallery-image-link').on('input.gallery-image-link', `#gallery-image-link-${imageId}`, function() {
            updateImageData('link', $(this).val());
        });
        
        // Icon select
        $(document).off('change.gallery-image-icon').on('change.gallery-image-icon', `#gallery-image-icon-${imageId}`, function() {
            updateImageData('icon', $(this).val());
        });
        
        // Apply translations
        if (window.applyTranslations) {
            setTimeout(() => window.applyTranslations(), 0);
        }
    },
    
    // Helper function to sync gallery config changes with product container
    syncGalleryConfigToProductContainer: function(field, value) {
        if (window.productContainerReturnData && window.productContainerReturnData.fromView === 'productContainer') {
            const productContainer = window.currentSectionsConfig['product-container'];
            if (productContainer?.sections?.gallery?.config) {
                productContainer.sections.gallery.config[field] = value;
                console.log('[GALLERY] Synced gallery config to product container:', field, value);
            }
        }
    },
    
    attachEventListeners: function() {
        console.log('[GALLERY] Attaching event listeners...');
        
        // Add translations
        if (!window.translations) window.translations = { es: {}, en: {} };
        
        // Spanish translations
        window.translations.es['gallery.colorScheme'] = 'Esquema de color';
        window.translations.es['gallery.width'] = 'Ancho';
        window.translations.es['gallery.width.page'] = 'Página';
        window.translations.es['gallery.width.full'] = 'Ancho completo';
        window.translations.es['gallery.desktopLayout'] = 'Diseño de escritorio';
        window.translations.es['gallery.mobileLayout'] = 'Diseño móvil';
        window.translations.es['gallery.content'] = 'Contenido';
        window.translations.es['gallery.heading'] = 'Encabezado';
        window.translations.es['gallery.body'] = 'Cuerpo';
        window.translations.es['gallery.headingSize'] = 'Tamaño del encabezado';
        window.translations.es['gallery.bodySize'] = 'Tamaño del cuerpo';
        window.translations.es['gallery.contentAlignment'] = 'Alineación del contenido';
        window.translations.es['gallery.cards'] = 'Tarjetas';
        window.translations.es['gallery.imageRatio'] = 'Proporción de imagen';
        window.translations.es['gallery.desktopCardsPerRow'] = 'Tarjetas por fila en escritorio';
        window.translations.es['gallery.desktopSpaceBetweenCards'] = 'Espacio entre tarjetas en escritorio';
        window.translations.es['gallery.mobileSpaceBetweenCards'] = 'Espacio entre tarjetas en móvil';
        window.translations.es['gallery.showArrowsOnHover'] = 'Mostrar flechas al pasar el cursor';
        window.translations.es['gallery.button'] = 'Botón';
        window.translations.es['gallery.buttonLabel'] = 'Etiqueta del botón';
        window.translations.es['gallery.buttonLink'] = 'Enlace del botón';
        window.translations.es['gallery.buttonStyle'] = 'Estilo del botón';
        window.translations.es['gallery.autoplay'] = 'Reproducción automática';
        window.translations.es['gallery.autoplayMode'] = 'Modo de reproducción automática';
        window.translations.es['gallery.autoplaySpeed'] = 'Velocidad de reproducción automática';
        window.translations.es['gallery.paddings'] = 'Rellenos';
        window.translations.es['gallery.addSidePaddings'] = 'Agregar rellenos laterales';
        window.translations.es['gallery.topPadding'] = 'Relleno superior';
        window.translations.es['gallery.bottomPadding'] = 'Relleno inferior';
        
        // English translations
        window.translations.en['gallery.colorScheme'] = 'Color scheme';
        window.translations.en['gallery.width'] = 'Width';
        window.translations.en['gallery.width.page'] = 'Page';
        window.translations.en['gallery.width.full'] = 'Full width';
        window.translations.en['gallery.desktopLayout'] = 'Desktop layout';
        window.translations.en['gallery.mobileLayout'] = 'Mobile layout';
        window.translations.en['gallery.content'] = 'Content';
        window.translations.en['gallery.heading'] = 'Heading';
        window.translations.en['gallery.body'] = 'Body';
        window.translations.en['gallery.headingSize'] = 'Heading size';
        window.translations.en['gallery.bodySize'] = 'Body size';
        window.translations.en['gallery.contentAlignment'] = 'Content alignment';
        window.translations.en['gallery.cards'] = 'Cards';
        window.translations.en['gallery.imageRatio'] = 'Image ratio';
        window.translations.en['gallery.desktopCardsPerRow'] = 'Desktop cards per row';
        window.translations.en['gallery.desktopSpaceBetweenCards'] = 'Desktop space between cards';
        window.translations.en['gallery.mobileSpaceBetweenCards'] = 'Mobile space between cards';
        window.translations.en['gallery.showArrowsOnHover'] = 'Show arrows on hover';
        window.translations.en['gallery.button'] = 'Button';
        window.translations.en['gallery.buttonLabel'] = 'Button label';
        window.translations.en['gallery.buttonLink'] = 'Button link';
        window.translations.en['gallery.buttonStyle'] = 'Button style';
        window.translations.en['gallery.autoplay'] = 'Autoplay';
        window.translations.en['gallery.autoplayMode'] = 'Autoplay mode';
        window.translations.en['gallery.autoplaySpeed'] = 'Autoplay speed';
        window.translations.en['gallery.paddings'] = 'Paddings';
        window.translations.en['gallery.addSidePaddings'] = 'Add side paddings';
        window.translations.en['gallery.topPadding'] = 'Top padding';
        window.translations.en['gallery.bottomPadding'] = 'Bottom padding';
        
        // CRÍTICO: Navegación correcta
        // Comentado porque el onclick inline en el botón ya maneja esto correctamente
        // $('.back-to-sections-btn').off('click').on('click', function() {
        //     if (window.productContainerReturnData && window.productContainerReturnData.returnTo) {
        //         window.switchSidebarView(window.productContainerReturnData.returnTo);
        //         window.productContainerReturnData = null;
        //     } else {
        //         window.switchSidebarView('blockList');
        //     }
        // });
        
        // Handle click on gallery images in sidebar
        $(document).off('click.gallery-image-settings').on('click.gallery-image-settings', '.gallery-image-item', function(e) {
            // Don't trigger if clicking on action buttons
            if ($(e.target).closest('.subsection-actions').length) {
                return;
            }
            
            // Don't trigger if clicking on drag handle
            if ($(e.target).hasClass('drag-handle') || $(e.target).closest('.drag-handle').length) {
                return;
            }
            
            const imageId = $(this).data('element-id');
            if (imageId) {
                window.currentGalleryImageId = imageId;
                window.switchSidebarView('galleryImageSettings', { imageId: imageId });
            }
        });
        
        // PARTE 1: Inicialización en el módulo (solo para vista de configuración)
        // Solo inicializar si estamos en la vista de configuración
        if ($('.gallery-images-container').length > 0) {
            this.initializeDragAndDrop();
        }
        
        // Reintentar si falla (DOM no listo)
        setTimeout(() => {
            const $container = $('.gallery-images-container');
            if ($container.length && !$container.hasClass('ui-sortable')) {
                console.log('[GALLERY] Sortable not initialized, retrying...');
                window.WebsiteBuilderModules.Gallery.initializeDragAndDrop();
            }
        }, 500);
        
        // Add image button
        $(document).off('click.gallery-add').on('click.gallery-add', '.add-gallery-image', function(e) {
            e.preventDefault();
            const galleryConfig = currentSectionsConfig.gallery || {};
            
            // Initialize arrays if they don't exist
            if (!galleryConfig.imageOrder) galleryConfig.imageOrder = [];
            if (!galleryConfig.images) galleryConfig.images = {};
            
            // Create new image
            const imageId = 'img-' + Date.now();
            galleryConfig.images[imageId] = {
                id: imageId,
                isHidden: false,
                src: '',
                alt: '',
                link: '',
                icon: 'none'
            };
            galleryConfig.imageOrder.push(imageId);
            
            // Update config
            currentSectionsConfig.gallery = galleryConfig;
            hasPendingPageStructureChanges = true;
            updateSaveButtonState();
            
            // Re-render settings view
            switchSidebarView('gallerySettings');
            renderPreview();
        });
        
        // Toggle visibility - with fix for two-click problem
        $(document).off('click.gallery-visibility').on('click.gallery-visibility', '.gallery-image-item .toggle-visibility', function(e) {
            e.preventDefault();
            const $button = $(this);
            const imageId = $button.data('image-id');
            const galleryConfig = currentSectionsConfig.gallery || {};
            
            // Prevent clicks during transition
            if ($button.data('transitioning')) return;
            $button.data('transitioning', true);
            setTimeout(() => $button.data('transitioning', false), 300);
            
            if (galleryConfig.images && galleryConfig.images[imageId]) {
                galleryConfig.images[imageId].isHidden = !galleryConfig.images[imageId].isHidden;
                
                // Update icon and state
                const isHidden = galleryConfig.images[imageId].isHidden;
                
                // Clean up state completely before applying new state
                $button.removeClass('is-hidden');
                if (isHidden) {
                    $button.addClass('is-hidden');
                }
                
                // Remove ALL inline styles (not just empty them)
                const $visibleIcon = $button.find('.icon-visible');
                const $hiddenIcon = $button.find('.icon-hidden');
                $visibleIcon.removeAttr('style');
                $hiddenIcon.removeAttr('style');
                
                // Update the text icon as backup
                $button.find('i').text(isHidden ? 'visibility_off' : 'visibility');
                $button.attr('data-hidden', isHidden);
                
                hasPendingPageStructureChanges = true;
                updateSaveButtonState();
                renderPreview();
            }
        });
        
        // Delete image
        $(document).off('click.gallery-delete').on('click.gallery-delete', '.gallery-image-item .delete-image', function(e) {
            e.preventDefault();
            const imageId = $(this).data('image-id');
            const galleryConfig = currentSectionsConfig.gallery || {};
            
            if (galleryConfig.images && galleryConfig.images[imageId]) {
                // Remove from images object
                delete galleryConfig.images[imageId];
                
                // Remove from order array
                if (galleryConfig.imageOrder) {
                    const index = galleryConfig.imageOrder.indexOf(imageId);
                    if (index > -1) {
                        galleryConfig.imageOrder.splice(index, 1);
                    }
                }
                
                hasPendingPageStructureChanges = true;
                updateSaveButtonState();
                
                // Re-render settings view
                switchSidebarView('gallerySettings');
                renderPreview();
            }
        });
        
        // Configuration changes - selects and inputs
        $(document).off('change.gallery-config input.gallery-config').on('change.gallery-config input.gallery-config', '[data-field]', function() {
            const field = $(this).data('field');
            if (!field) return;
            
            const galleryConfig = window.currentSectionsConfig.gallery || {};
            
            if ($(this).is('input[type="checkbox"]')) {
                galleryConfig[field] = $(this).is(':checked');
            } else if ($(this).is('input[type="number"]')) {
                galleryConfig[field] = parseFloat($(this).val()) || 0;
            } else {
                galleryConfig[field] = $(this).val();
            }
            
            window.currentSectionsConfig.gallery = galleryConfig;
            
            // Sync with product container if needed
            window.WebsiteBuilderModules.Gallery.syncGalleryConfigToProductContainer(field, galleryConfig[field]);
            
            // Use window functions to ensure proper scope
            if (window.setHasPendingPageStructureChanges) {
                window.setHasPendingPageStructureChanges(true);
            } else {
                window.hasPendingPageStructureChanges = true;
            }
            
            if (window.updateSaveButtonState) {
                window.updateSaveButtonState();
            }
            
            if (window.renderPreview) {
                window.renderPreview();
            }
        });
        
        // Range inputs with synchronized number inputs
        $(document).off('input.gallery-range').on('input.gallery-range', 'input[type="range"][data-field]', function() {
            const field = $(this).data('field');
            if (!field) return;
            
            const value = parseFloat($(this).val()) || 0;
            const galleryConfig = window.currentSectionsConfig.gallery || {};
            galleryConfig[field] = value;
            
            // Update corresponding number input
            const $numberInput = $(`#${$(this).attr('id')}-value`);
            if ($numberInput.length) {
                $numberInput.val(value);
            }
            
            window.currentSectionsConfig.gallery = galleryConfig;
            
            // Sync with product container if needed
            window.WebsiteBuilderModules.Gallery.syncGalleryConfigToProductContainer(field, value);
            
            // Mark as having pending changes
            if (window.setHasPendingPageStructureChanges) {
                window.setHasPendingPageStructureChanges(true);
            } else {
                window.hasPendingPageStructureChanges = true;
            }
            
            if (window.updateSaveButtonState) {
                window.updateSaveButtonState();
            }
            
            // Render preview to show changes immediately
            if (window.renderPreview) {
                window.renderPreview();
            }
        });
        
        // Number inputs synchronized with range sliders
        $(document).off('input.gallery-number').on('input.gallery-number', 'input[type="number"][data-field]', function() {
            const field = $(this).data('field');
            if (!field) return;
            
            const value = parseFloat($(this).val()) || 0;
            const galleryConfig = window.currentSectionsConfig.gallery || {};
            galleryConfig[field] = value;
            
            // Update corresponding range input
            const $rangeInput = $(`#gallery-${field.replace(/([A-Z])/g, '-$1').toLowerCase()}`);
            if ($rangeInput.length) {
                $rangeInput.val(value);
            }
            
            window.currentSectionsConfig.gallery = galleryConfig;
            
            // Sync with product container if needed
            window.WebsiteBuilderModules.Gallery.syncGalleryConfigToProductContainer(field, value);
            
            // Mark as having pending changes
            if (window.setHasPendingPageStructureChanges) {
                window.setHasPendingPageStructureChanges(true);
            } else {
                window.hasPendingPageStructureChanges = true;
            }
            
            if (window.updateSaveButtonState) {
                window.updateSaveButtonState();
            }
            
            if (window.renderPreview) {
                window.renderPreview();
            }
        });
        
        // Number inputs synchronized with range
        $(document).off('input.gallery-number change.gallery-number').on('input.gallery-number change.gallery-number', 'input[type="number"][data-field]', function() {
            const field = $(this).data('field');
            if (!field) return;
            
            const value = parseFloat($(this).val()) || 0;
            const galleryConfig = window.currentSectionsConfig.gallery || {};
            galleryConfig[field] = value;
            
            // Update corresponding range input
            const rangeId = $(this).attr('id').replace('-value', '');
            const $rangeInput = $(`#${rangeId}`);
            if ($rangeInput.length) {
                $rangeInput.val(value);
            }
            
            window.currentSectionsConfig.gallery = galleryConfig;
            
            if (window.setHasPendingPageStructureChanges) {
                window.setHasPendingPageStructureChanges(true);
            } else {
                window.hasPendingPageStructureChanges = true;
            }
            
            if (window.updateSaveButtonState) {
                window.updateSaveButtonState();
            }
            
            if (window.renderPreview) {
                window.renderPreview();
            }
        });
        
        // Layout option buttons
        $(document).off('click.gallery-layout').on('click.gallery-layout', '.layout-option', function() {
            const field = $(this).data('field');
            const value = $(this).data('layout');
            
            if (!field || !value) return;
            
            // Update visual state
            $(this).siblings('.layout-option').removeClass('active').css('background', 'white');
            $(this).addClass('active').css('background', '#f0f0f0');
            
            const galleryConfig = window.currentSectionsConfig.gallery || {};
            galleryConfig[field] = value;
            
            window.currentSectionsConfig.gallery = galleryConfig;
            
            // Sync with product container if needed
            window.WebsiteBuilderModules.Gallery.syncGalleryConfigToProductContainer(field, value);
            
            if (window.setHasPendingPageStructureChanges) {
                window.setHasPendingPageStructureChanges(true);
            } else {
                window.hasPendingPageStructureChanges = true;
            }
            
            if (window.updateSaveButtonState) {
                window.updateSaveButtonState();
            }
            
            if (window.renderPreview) {
                window.renderPreview();
            }
        });
        
        // Alignment buttons
        $(document).off('click.gallery-align').on('click.gallery-align', '.align-btn', function() {
            const field = $(this).data('field');
            const value = $(this).data('align');
            
            if (!field || !value) return;
            
            // Update visual state
            $(this).siblings('.align-btn').removeClass('active').css('background', 'white');
            $(this).addClass('active').css('background', '#f0f0f0');
            
            const galleryConfig = window.currentSectionsConfig.gallery || {};
            galleryConfig[field] = value;
            
            window.currentSectionsConfig.gallery = galleryConfig;
            
            // Sync with product container if needed
            window.WebsiteBuilderModules.Gallery.syncGalleryConfigToProductContainer(field, value);
            
            if (window.setHasPendingPageStructureChanges) {
                window.setHasPendingPageStructureChanges(true);
            } else {
                window.hasPendingPageStructureChanges = true;
            }
            
            if (window.updateSaveButtonState) {
                window.updateSaveButtonState();
            }
            
            if (window.renderPreview) {
                window.renderPreview();
            }
        });
        
        // Button style buttons
        $(document).off('click.gallery-style').on('click.gallery-style', '.style-option', function() {
            const field = $(this).data('field');
            const value = $(this).data('style');
            
            if (!field || !value) return;
            
            // Update visual state
            $(this).siblings('.style-option').removeClass('active').css('background', 'white');
            $(this).addClass('active').css('background', '#f0f0f0');
            
            const galleryConfig = window.currentSectionsConfig.gallery || {};
            galleryConfig[field] = value;
            
            window.currentSectionsConfig.gallery = galleryConfig;
            
            // Sync with product container if needed
            window.WebsiteBuilderModules.Gallery.syncGalleryConfigToProductContainer(field, value);
            
            if (window.setHasPendingPageStructureChanges) {
                window.setHasPendingPageStructureChanges(true);
            } else {
                window.hasPendingPageStructureChanges = true;
            }
            
            if (window.updateSaveButtonState) {
                window.updateSaveButtonState();
            }
            
            if (window.renderPreview) {
                window.renderPreview();
            }
        });
        
        // Text formatting buttons
        $(document).off('click.gallery-format').on('click.gallery-format', '.text-format-btn', function() {
            const format = $(this).data('format');
            // TODO: Implement text formatting if needed
            console.log('Text format clicked:', format);
        });
        
        // Autoplay mode change - show/hide speed control
        $(document).off('change.gallery-autoplay').on('change.gallery-autoplay', '#gallery-autoplay-mode', function() {
            const mode = $(this).val();
            const $speedControl = $(this).closest('.settings-group').find('> div:last-child');
            
            if (mode === 'none') {
                $speedControl.hide();
            } else {
                $speedControl.show();
            }
        });
        
        // Checkbox change
        $(document).off('change.gallery-checkbox').on('change.gallery-checkbox', 'input[type="checkbox"][data-field]', function() {
            const field = $(this).data('field');
            if (!field) return;
            
            const galleryConfig = window.currentSectionsConfig.gallery || {};
            galleryConfig[field] = $(this).is(':checked');
            
            window.currentSectionsConfig.gallery = galleryConfig;
            
            // Sync with product container if needed
            window.WebsiteBuilderModules.Gallery.syncGalleryConfigToProductContainer(field, galleryConfig[field]);
            
            if (window.setHasPendingPageStructureChanges) {
                window.setHasPendingPageStructureChanges(true);
            } else {
                window.hasPendingPageStructureChanges = true;
            }
            
            if (window.updateSaveButtonState) {
                window.updateSaveButtonState();
            }
            
            if (window.renderPreview) {
                window.renderPreview();
            }
        });
    },
    
    // Función de inicialización del drag & drop en el módulo
    initializeDragAndDrop: function() {
        console.log('[GALLERY] Initializing drag & drop...');
        
        // CRÍTICO: Usar referencias completas, NO 'this'
        setTimeout(() => {
            const $container = $('.gallery-images-container'); // Nota: clase genérica para config view
            
            if (!$container.length) {
                console.error('[GALLERY] Container not found!');
                return;
            }
            
            $container.sortable({
                items: '.gallery-image-item',
                handle: '.drag-handle',
                placeholder: 'sortable-placeholder',
                forcePlaceholderSize: true,
                cursor: 'move',
                tolerance: 'pointer',
                axis: 'y',
                containment: 'parent',
                start: function(e, ui) {
                    ui.placeholder.height(ui.item.outerHeight());
                    ui.placeholder.css({
                        'visibility': 'visible',
                        'background': '#f0f0f0',
                        'border': '2px dashed #2962ff',
                        'border-radius': '8px',
                        'margin-bottom': '10px'
                    });
                },
                stop: function(e, ui) {
                    const newOrder = [];
                    $container.find('.gallery-image-item').each(function() {
                        const imageId = $(this).data('image-id');
                        if (imageId) {
                            newOrder.push(imageId);
                        }
                    });
                    
                    if (window.currentSectionsConfig.gallery) {
                        window.currentSectionsConfig.gallery.imageOrder = newOrder;
                        window.setHasPendingPageStructureChanges(true);
                        window.updateSaveButtonState();
                        window.renderPreview();
                    }
                }
            });
        }, 300);
    },
    
    initialize: function() {
        console.log('[GALLERY] Initializing module...');
        
        // Initialize gallery configuration if it doesn't exist
        if (!window.currentSectionsConfig) {
            console.error('[GALLERY] currentSectionsConfig not found!');
            return;
        }
        
        if (!window.currentSectionsConfig.gallery) {
            window.currentSectionsConfig.gallery = {
                isHidden: false,
                colorScheme: 'default',
                width: 'page',
                desktopLayout: 'grid',
                mobileLayout: 'carousel',
                heading: 'Gallery',
                body: 'Show your products, collections, and social media photos or tell about recent events.',
                headingSize: 'h5',
                bodySize: 'body3',
                contentAlignment: 'center',
                imageRatio: 1,
                desktopCardsPerRow: 5,
                desktopSpaceBetweenCards: 16,
                mobileSpaceBetweenCards: 16,
                showArrowsOnHover: true,
                buttonLabel: '',
                buttonLink: '',
                buttonStyle: 'solid',
                autoplayMode: 'none',
                autoplaySpeed: 3,
                addSidePaddings: true,
                topPadding: 64,
                bottomPadding: 8,
                imageOrder: [],
                images: {}
            };
        }
        
        // Attach event listeners
        this.attachEventListeners();
        
        // Apply translations
        if (window.applyTranslations) {
            setTimeout(() => window.applyTranslations(), 0);
        }
    }
};