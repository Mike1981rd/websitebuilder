// Image Banner Module for Website Builder
window.WebsiteBuilderModules = window.WebsiteBuilderModules || {};

// Initialize ImageBanner object if it doesn't exist (may have been partially created by settings file)
if (!window.WebsiteBuilderModules.ImageBanner) {
    window.WebsiteBuilderModules.ImageBanner = {};
}

// Add main module functions
Object.assign(window.WebsiteBuilderModules.ImageBanner, {
    render: function(config) {
        if (!config || config.isHidden) return '';
        
        const schemeColors = getColorSchemeValues(config.colorScheme || 'scheme1');
        const uniqueId = 'image-banner-' + Date.now();
        
        // Get typography settings
        const headingTypography = window.currentGlobalThemeSettings?.typography?.heading || {};
        const bodyTypography = window.currentGlobalThemeSettings?.typography?.body || {};
        
        const headingFont = window.getFontNameFromValueSafe ? 
            window.getFontNameFromValueSafe(headingTypography.font || 'helvetica') : 
            'Helvetica';
        
        const bodyFont = window.getFontNameFromValueSafe ? 
            window.getFontNameFromValueSafe(bodyTypography.font || 'roboto') : 
            'Roboto';
        
        // Calculate heading sizes based on headingSize setting (0-7)
        const headingSizes = ['24px', '32px', '40px', '48px', '56px', '64px', '72px', '80px'];
        const headingSize = headingSizes[config.headingSize || 2];
        
        // Calculate body sizes based on bodySize setting (0-6)
        const bodySizes = ['12px', '14px', '16px', '18px', '20px', '22px', '24px'];
        const bodySize = bodySizes[config.bodySize || 3];
        
        // Get desktop position
        const positionMap = {
            'top-left': { alignItems: 'flex-start', justifyContent: 'flex-start' },
            'top-center': { alignItems: 'flex-start', justifyContent: 'center' },
            'top-right': { alignItems: 'flex-start', justifyContent: 'flex-end' },
            'center-left': { alignItems: 'center', justifyContent: 'flex-start' },
            'center': { alignItems: 'center', justifyContent: 'center' },
            'center-right': { alignItems: 'center', justifyContent: 'flex-end' },
            'bottom-left': { alignItems: 'flex-end', justifyContent: 'flex-start' },
            'bottom-center': { alignItems: 'flex-end', justifyContent: 'center' },
            'bottom-right': { alignItems: 'flex-end', justifyContent: 'flex-end' }
        };
        
        const desktopPosition = positionMap[config.desktopPosition || 'center'];
        
        // Determine if we have video before logging
        const hasVideo = config.videoFile || config.videoUrl;
        
        // Get container padding values (for margin on section-wrapper)
        const containerTopPadding = config.containerTopPadding || 60;
        const containerBottomPadding = config.containerBottomPadding || 60;
        
        // Debug logging
        console.log('[Image Banner] Render Config:', {
            desktopPosition: config.desktopPosition,
            calculatedPosition: desktopPosition,
            topPadding: config.topPadding,
            bottomPadding: config.bottomPadding,
            containerTopPadding: containerTopPadding,
            containerBottomPadding: containerBottomPadding,
            desktopSpacing: config.desktopSpacing,
            hasVideo: hasVideo
        });
        
        // Calculate height based on ratio and width settings
        const widthClass = config.width || 'screen';
        let containerMaxWidth = '100%';
        if (widthClass === 'small') containerMaxWidth = '800px';
        else if (widthClass === 'medium') containerMaxWidth = '1000px';
        else if (widthClass === 'large') containerMaxWidth = '1200px';
        else if (widthClass === 'page') containerMaxWidth = '1400px';
        
        // Calculate heights considering container max-width for proper aspect ratio
        const getHeightCalc = (ratio, maxWidth) => {
            if (widthClass === 'screen') {
                return `calc(100vw * ${ratio})`;
            } else {
                return `calc(min(100vw, ${maxWidth}) * ${ratio})`;
            }
        };
        
        const desktopHeight = `${config.desktopFixedHeight || 600}px`;
        const mobileHeight = `calc(100vw * ${config.mobileRatio || 1.6})`;
        
        // Debug height calculation
        console.log('[Image Banner] Height calculation:', {
            width: widthClass,
            containerMaxWidth: containerMaxWidth,
            desktopRatio: config.desktopRatio || 0.4,
            desktopHeight: desktopHeight,
            mobileRatio: config.mobileRatio || 1.6,
            mobileHeight: mobileHeight
        });
        
        // Get content background styles
        const getContentBackground = (type) => {
            // Explicitly check for 'none' or empty values
            if (!type || type === 'none') {
                return '';
            }
            
            switch(type) {
                case 'solid':
                    return `background-color: ${schemeColors.background}; padding: 30px; border-radius: 8px;`;
                case 'outline':
                    return `border: 2px solid ${schemeColors.text}; padding: 30px; border-radius: 8px;`;
                case 'shadow':
                    return `box-shadow: 0 4px 20px rgba(0,0,0,0.15); padding: 30px; border-radius: 8px; background-color: ${schemeColors.background};`;
                case 'blurred':
                    return `backdrop-filter: blur(10px); background-color: rgba(255,255,255,0.8); padding: 30px; border-radius: 8px;`;
                case 'transparent':
                    return `background-color: rgba(255,255,255,0.6); padding: 30px; border-radius: 8px;`;
                default:
                    return '';
            }
        };
        
        const desktopContentBg = getContentBackground(config.desktopContentBackground || 'none');
        const mobileContentBg = getContentBackground(config.mobileContentBackground || 'none');
        
        // Get button styles
        const getButtonStyles = (style, isPrimary) => {
            // First check if there are global button settings
            const buttonColors = window.currentGlobalThemeSettings?.buttons || {};
            
            // Use color scheme button colors as the primary source
            let solidBgColor, solidTextColor, outlineBorderColor, outlineTextColor;
            
            if (buttonColors.backgroundColor || buttonColors.textColor) {
                // If global button settings exist, use them
                solidBgColor = buttonColors.backgroundColor;
                solidTextColor = buttonColors.textColor;
                outlineBorderColor = buttonColors.backgroundColor;
                outlineTextColor = buttonColors.backgroundColor;
            } else {
                // Otherwise, use the color scheme's button colors
                solidBgColor = schemeColors['solid-button'] || '#121212';
                solidTextColor = schemeColors['solid-button-text'] || '#FFFFFF';
                outlineBorderColor = schemeColors['outline-button'] || '#DDDDDD';
                outlineTextColor = schemeColors['outline-button-text'] || '#121212';
            }
            
            switch(style) {
                case 'outline':
                    return `background: transparent; border: 2px solid ${outlineBorderColor}; color: ${outlineTextColor};`;
                case 'text':
                    return `background: transparent; border: none; color: ${solidBgColor}; text-decoration: underline;`;
                default: // solid
                    return `background-color: ${solidBgColor}; color: ${solidTextColor}; border: none;`;
            }
        };
        
        // Determine background media (video or image)
        const backgroundImage = config.desktopImage || '/TestImages/imagebannereditor.png';
        const mobileImage = config.mobileImage || backgroundImage;
        
        // Generate video HTML if needed
        const getVideoHtml = () => {
            const muted = config.playWithSound ? '' : 'muted';
            const muteParam = config.playWithSound ? '0' : '1';
            
            if (config.videoFile) {
                return `<video autoplay ${muted} loop playsinline style="position: absolute; top: 0; left: 0; width: 100%; height: 100%; object-fit: cover; z-index: 0;">
                    <source src="${config.videoFile}" type="video/mp4">
                </video>`;
            } else if (config.videoUrl) {
                // Check if it's YouTube or Vimeo
                if (config.videoUrl.includes('youtube.com') || config.videoUrl.includes('youtu.be')) {
                    const videoId = config.videoUrl.match(/(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/)?.[1];
                    if (videoId) {
                        return `<iframe src="https://www.youtube.com/embed/${videoId}?autoplay=1&mute=${muteParam}&loop=1&playlist=${videoId}&controls=0&showinfo=0&modestbranding=1" 
                                style="position: absolute; top: 0; left: 0; width: 100%; height: 100%; border: 0; z-index: 0;" 
                                allow="autoplay; fullscreen"></iframe>`;
                    }
                } else if (config.videoUrl.includes('vimeo.com')) {
                    const videoId = config.videoUrl.match(/vimeo\.com\/(\d+)/)?.[1];
                    if (videoId) {
                        return `<iframe src="https://player.vimeo.com/video/${videoId}?autoplay=1&muted=${muteParam}&loop=1&background=1" 
                                style="position: absolute; top: 0; left: 0; width: 100%; height: 100%; border: 0; z-index: 0;" 
                                allow="autoplay; fullscreen"></iframe>`;
                    }
                } else {
                    return `<video autoplay ${muted} loop playsinline style="position: absolute; top: 0; left: 0; width: 100%; height: 100%; object-fit: cover; z-index: 0;">
                        <source src="${config.videoUrl}" type="video/mp4">
                    </video>`;
                }
            }
            return '';
        };
        
        // Overlay styles
        const desktopOverlay = config.desktopOverlayOpacity > 0 ? 
            `rgba(0,0,0,${(config.desktopOverlayOpacity || 0) / 100})` : 'transparent';
        const mobileOverlay = config.mobileOverlayOpacity > 0 ? 
            `rgba(0,0,0,${(config.mobileOverlayOpacity || 0) / 100})` : 'transparent';
        
        return `
            <style>
                #${uniqueId} {
                    width: 100%;
                    max-width: ${widthClass === 'screen' ? '100%' : containerMaxWidth};
                    margin: 0 auto;
                    position: relative;
                }
                
                #${uniqueId} .banner-container {
                    ${hasVideo ? '' : `background-image: url('${backgroundImage}');`}
                    background-size: ${config.imageFit || (config.width === 'screen' ? 'cover' : 'contain')};
                    background-position: ${config.imagePosition || 'center'};
                    background-repeat: no-repeat;
                    height: ${desktopHeight};
                    min-height: 400px;
                    position: relative;
                    overflow: hidden;
                    ${config.useColorBackground ? `background-color: ${schemeColors.background};` : ''}
                }
                
                #${uniqueId} .banner-inner {
                    display: flex;
                    align-items: ${desktopPosition.alignItems};
                    justify-content: ${desktopPosition.justifyContent};
                    height: 100%;
                    width: 100%;
                    position: relative;
                    z-index: 1;
                    box-sizing: border-box;
                    padding: ${config.topPadding || 0}px ${config.addSidePaddings ? '60px' : '20px'} ${config.bottomPadding || 0}px;
                }
                
                #${uniqueId} .banner-container::before {
                    content: '';
                    position: absolute;
                    top: 0;
                    left: 0;
                    right: 0;
                    bottom: 0;
                    background-color: ${desktopOverlay};
                    pointer-events: none;
                    z-index: 1;
                }
                
                #${uniqueId} .banner-content-wrapper {
                    width: 100%;
                    max-width: ${config.desktopWidth || 528}px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                }
                
                #${uniqueId} .banner-content {
                    text-align: ${config.desktopAlignment || 'center'};
                    padding: ${config.desktopSpacing || 40}px;
                    width: 100%;
                    z-index: 2;
                    position: relative;
                    ${desktopContentBg}
                    box-sizing: border-box;
                }
                
                #${uniqueId} .banner-subheading {
                    font-family: ${bodyFont};
                    font-size: ${bodySize};
                    text-transform: uppercase;
                    letter-spacing: 1px;
                    margin-bottom: 16px;
                    color: ${schemeColors.text};
                }
                
                #${uniqueId} .banner-heading {
                    font-family: ${headingFont};
                    font-size: ${headingSize};
                    font-weight: ${headingTypography.fontWeight || '600'};
                    margin-bottom: 20px;
                    color: ${schemeColors.text};
                    line-height: 1.2;
                }
                
                #${uniqueId} .banner-text {
                    font-family: ${bodyFont};
                    font-size: ${bodySize};
                    margin-bottom: 30px;
                    color: ${schemeColors.text};
                    line-height: 1.6;
                }
                
                #${uniqueId} .banner-text * {
                    color: ${schemeColors.text};
                }
                
                #${uniqueId} .banner-buttons {
                    display: flex;
                    gap: 16px;
                    justify-content: ${config.desktopAlignment === 'left' ? 'flex-start' : 'center'};
                    flex-wrap: wrap;
                }
                
                #${uniqueId} .banner-button {
                    padding: 12px 24px;
                    text-decoration: none;
                    border-radius: 4px;
                    font-family: ${bodyFont};
                    font-size: 14px;
                    display: inline-block;
                    transition: opacity 0.3s ease;
                    cursor: pointer;
                }
                
                #${uniqueId} .banner-button.primary {
                    ${getButtonStyles(config.button1Style || 'solid', true)}
                }
                
                #${uniqueId} .banner-button.secondary {
                    ${getButtonStyles(config.button2Style || 'solid', false)}
                }
                
                #${uniqueId} .banner-button:hover {
                    opacity: 0.8;
                }
                
                @media (max-width: 768px) {
                    #${uniqueId} {
                        background-color: #ffffff !important;
                        padding: 0 !important;
                        margin: 0 !important;
                    }
                    
                    #${uniqueId}.stick-to-header {
                        margin-top: 0 !important;
                    }
                    
                    #${uniqueId} .banner-container {
                        height: ${mobileHeight};
                        min-height: 50px;
                        max-height: none;
                        ${hasVideo ? '' : `background-image: url('${mobileImage}');`}
                        background-size: cover !important;
                        background-position: center center !important;
                        background-repeat: no-repeat !important;
                        background-color: #ffffff !important;
                    }
                    
                    #${uniqueId} .banner-inner {
                        align-items: ${config.mobilePosition === 'top' ? 'flex-start' : 
                                       config.mobilePosition === 'bottom' ? 'flex-end' : 'center'};
                        justify-content: center;
                        padding: ${config.topPadding || 0}px ${config.addSidePaddings ? '20px' : '20px'} ${config.bottomPadding || 0}px;
                    }
                    
                    #${uniqueId} .banner-container::before {
                        background-color: ${mobileOverlay};
                    }
                    
                    #${uniqueId} .banner-content-wrapper {
                        max-width: 100%;
                    }
                    
                    #${uniqueId} .banner-content {
                        text-align: ${config.mobileAlignment || 'center'};
                        padding: 30px 20px 40px 20px;
                        max-width: 100%;
                        ${mobileContentBg}
                        ${(!config.mobileContentBackground || config.mobileContentBackground === 'none') ? 'background-color: transparent !important;' : ''}
                    }
                    
                    #${uniqueId} .banner-heading {
                        font-size: ${parseInt(headingSize) * 0.7}px !important;
                    }
                    
                    #${uniqueId} .banner-text {
                        font-size: ${parseInt(bodySize) * 0.9}px !important;
                    }
                    
                    #${uniqueId} .banner-buttons {
                        justify-content: center !important;
                        margin: 0;
                        padding: 0;
                        width: 100%;
                        text-align: center;
                    }
                    
                    #${uniqueId} .banner-button {
                        margin: 5px auto;
                        min-width: 120px;
                        text-align: center;
                        display: inline-block;
                    }
                }
            </style>
            
            <div id="${uniqueId}" class="section-wrapper image-banner-section ${parseInt(containerTopPadding) === 1 ? 'stick-to-header' : ''}" data-section-id="imageBanner" data-block-type="imageBanner" style="background-color: #ffffff !important; margin-top: ${parseInt(containerTopPadding) === 1 ? '-20' : containerTopPadding}px; margin-bottom: ${parseInt(containerBottomPadding) === 1 ? '-20' : containerBottomPadding}px;">
                <div class="section-header-tag">
                    <span class="material-symbols-outlined" style="font-size: 16px;">image</span>
                    ${window.translations && window.translations[window.currentLanguage] ? 
                        (window.translations[window.currentLanguage]['sections.imageBanner'] || 'Image Banner') : 
                        'Image Banner'}
                </div>
                <div class="banner-container">
                    ${hasVideo ? getVideoHtml() : ''}
                    <div class="banner-inner">
                        <div class="banner-content-wrapper">
                            <div class="banner-content">
                                ${config.subheading ? `<div class="banner-subheading">${config.subheading}</div>` : ''}
                                ${config.heading ? `<h2 class="banner-heading">${config.heading}</h2>` : ''}
                                ${config.bodyText ? `<div class="banner-text">${config.bodyText}</div>` : ''}
                                
                                ${(config.button1Label || config.button2Label) ? `
                                    <div class="banner-buttons">
                                        ${config.button1Label ? `
                                            <a href="${config.button1Link || '#'}" class="banner-button primary">
                                                ${config.button1Label}
                                            </a>
                                        ` : ''}
                                        ${config.button2Label ? `
                                            <a href="${config.button2Link || '#'}" class="banner-button secondary">
                                                ${config.button2Label}
                                            </a>
                                        ` : ''}
                                    </div>
                                ` : ''}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `;
    },
    
    renderSettings: function(config) {
        const currentConfig = window.currentSectionsConfig.imageBanner || {};
        const translations = window.translations[window.currentLanguage] || {};
        
        // Check if helper functions are available
        if (!window.WebsiteBuilderModules.ImageBanner.renderMainSettings) {
            console.error('[ImageBanner] Helper functions not loaded. Make sure image-banner-settings.js is loaded before image-banner.js');
            return '<div style="padding: 20px;">Error: Settings functions not loaded</div>';
        }
        
        // Default values
        const defaults = {
            colorScheme: 'scheme1',
            useColorBackground: false,
            width: 'screen',
            desktopRatio: 0.56,
            mobileRatio: 1.6,
            desktopImage: '/TestImages/imagebannereditor.png',
            mobileImage: '',
            videoUrl: '',
            desktopOverlayOpacity: 20,
            mobileOverlayOpacity: 20,
            subheading: 'IMAGE BANNER',
            heading: 'Image with text',
            bodyText: 'Fill in the text to tell customers by what your products are inspired.',
            headingSize: 2,
            bodySize: 3,
            desktopPosition: 'center',
            desktopAlignment: 'center',
            desktopWidth: 528,
            desktopSpacing: 116,
            mobilePosition: 'center',
            mobileAlignment: 'center',
            desktopContentBackground: 'none',
            mobileContentBackground: 'none',
            button1Label: 'Button label',
            button1Link: '',
            button1Style: 'solid',
            button2Label: 'Button label',
            button2Link: '',
            button2Style: 'solid',
            addSidePaddings: false,
            topPadding: 0,
            bottomPadding: 0,
            containerTopPadding: 60,
            containerBottomPadding: 60,
            imageFit: 'cover',
            imagePosition: 'center',
            desktopFixedHeight: 600
        };
        
        // Merge with current config
        const mergedConfig = { ...defaults, ...currentConfig };
        
        return `
            <div style="display: flex; flex-direction: column; height: 100%; position: relative; overflow: hidden;">
                <!-- Back button header -->
                <button class="back-to-sections-list" style="display: flex; align-items: center; gap: 8px; padding: 12px 16px; background: transparent; border: none; cursor: pointer; width: 100%; text-align: left; border-bottom: 1px solid #e3e3e3;">
                    <i class="material-icons" style="font-size: 20px;">arrow_back</i>
                    <span style="font-size: 14px;">${translations['sections.imageBanner'] || 'Image banner'}</span>
                </button>
                
                <!-- Scrollable content area -->
                <div style="padding: 20px; overflow-y: auto; overflow-x: hidden; flex: 1; height: calc(100% - 60px); box-sizing: border-box;">
                    ${window.WebsiteBuilderModules.ImageBanner.renderMainSettings(mergedConfig)}
                    ${window.WebsiteBuilderModules.ImageBanner.renderImageSettings(mergedConfig)}
                    ${window.WebsiteBuilderModules.ImageBanner.renderContentSettings(mergedConfig)}
                    ${window.WebsiteBuilderModules.ImageBanner.renderPositionSettings(mergedConfig)}
                    ${window.WebsiteBuilderModules.ImageBanner.renderBackgroundSettings(mergedConfig)}
                    ${window.WebsiteBuilderModules.ImageBanner.renderButtonSettings(mergedConfig)}
                    ${window.WebsiteBuilderModules.ImageBanner.renderPaddingSettings(mergedConfig)}
                </div>
            </div>
        `;
    },
    
    attachEventListeners: function() {
        const module = this;
        
        // Back button
        $('.back-to-sections-list').off('click').on('click', function() {
            window.switchSidebarView('blockList');
        });
        
        // Initialize config if not exists
        if (!window.currentSectionsConfig.imageBanner) {
            window.currentSectionsConfig.imageBanner = {};
        }
        
        // Helper function to update config and render
        const updateConfig = (setting, value) => {
            window.currentSectionsConfig.imageBanner[setting] = value;
            window.setHasPendingPageStructureChanges(true);
            window.updateSaveButtonState();
            if (window.renderPreview) {
                window.renderPreview();
            }
        };
        
        // Select change handlers - Fixed selector
        $('select[data-setting]').off('change').on('change', function() {
            const setting = $(this).data('setting');
            const value = $(this).val();
            updateConfig(setting, value);
            
        });
        
        // Text input handlers
        $('input[type="text"][data-setting]').off('input blur').on('input blur', function() {
            const setting = $(this).data('setting');
            const value = $(this).val();
            updateConfig(setting, value);
        });
        
        // Checkbox handlers
        $('input[type="checkbox"][data-setting]').off('change').on('change', function() {
            const setting = $(this).data('setting');
            const value = $(this).is(':checked');
            updateConfig(setting, value);
        });
        
        // Range slider handlers - Fixed selector
        $('input[type="range"][data-setting]').off('input change').on('input change', function() {
            const setting = $(this).data('setting');
            const value = parseFloat($(this).val());
            const $valueDisplay = $(this).siblings('span');
            
            // Update display
            if (setting.includes('Opacity')) {
                $valueDisplay.text(value + '%');
            } else if (setting.includes('ratio') || setting.includes('Ratio')) {
                $valueDisplay.text(value);
            } else {
                $valueDisplay.text(value + 'px');
            }
            
            updateConfig(setting, value);
        });
        
        // Button group handlers
        $('.button-group-item[data-setting]').off('click').on('click', function() {
            const setting = $(this).data('setting');
            const value = $(this).data('value');
            
            // Debug log for position changes
            if (setting === 'desktopPosition' || setting === 'mobilePosition') {
                console.log(`[Image Banner] Setting ${setting} to:`, value);
            }
            
            // Update active state
            $(this).siblings().removeClass('active');
            $(this).addClass('active');
            
            // Update button styles
            $(this).siblings().css({
                'background': '#fff',
                'color': '#333',
                'border-color': '#ddd'
            });
            $(this).css({
                'background': '#2962ff',
                'color': '#fff',
                'border-color': '#2962ff'
            });
            
            updateConfig(setting, value);
        });
        
        // Rich text editor handlers - Fixed selector
        $('[contenteditable="true"][data-setting]').off('input blur').on('input blur', function() {
            const setting = $(this).data('setting');
            const value = $(this).html();
            updateConfig(setting, value);
        });
        
        // Toolbar button handlers for rich text editor
        $('.toolbar-btn').off('click').on('click', function(e) {
            e.preventDefault();
            const action = $(this).data('action');
            const value = $(this).data('value');
            
            // Save current selection
            const selection = window.getSelection();
            const range = selection.getRangeAt(0);
            
            if (action === 'bold') {
                document.execCommand('bold', false, null);
            } else if (action === 'italic') {
                document.execCommand('italic', false, null);
            } else if (action === 'createLink') {
                const url = prompt('Enter URL:');
                if (url) {
                    document.execCommand('createLink', false, url);
                }
            } else if (action === 'formatBlock') {
                if (value === 'ul') {
                    document.execCommand('insertUnorderedList', false, null);
                } else if (value === 'ol') {
                    document.execCommand('insertOrderedList', false, null);
                } else {
                    document.execCommand('formatBlock', false, value);
                }
            } else if (action === 'fontSize') {
                // Toggle between normal and small size
                const currentSize = document.queryCommandValue('fontSize');
                document.execCommand('fontSize', false, value === 'small' ? '2' : '3');
            }
            
            // Trigger input event to save changes
            $('[contenteditable="true"][data-setting="bodyText"]').trigger('input');
        });
        
        // Image upload button handler
        $('.btn-upload-image').off('click').on('click', function() {
            const setting = $(this).data('setting');
            const fileInput = $(`.image-file-input[data-setting="${setting}"]`);
            fileInput.trigger('click');
        });
        
        // Click on image preview to upload
        $('.image-preview-container').off('click').on('click', function(e) {
            if (!$(e.target).hasClass('remove-image-btn') && !$(e.target).parent().hasClass('remove-image-btn')) {
                const $container = $(this).closest('.image-upload-container');
                const setting = $container.data('setting');
                const fileInput = $container.find('.image-file-input');
                fileInput.trigger('click');
            }
        });
        
        // Handle file selection
        $('.image-file-input').off('change').on('change', function() {
            const file = this.files[0];
            if (!file) return;
            
            const setting = $(this).data('setting');
            const reader = new FileReader();
            
            reader.onload = function(e) {
                const dataUrl = e.target.result;
                
                // Store the data URL
                window.currentSectionsConfig.imageBanner[setting] = dataUrl;
                
                // Update preview
                const $container = $(`.image-upload-container[data-setting="${setting}"]`);
                const $previewContainer = $container.find('.image-preview-container');
                
                $previewContainer.html(`
                    <img src="${dataUrl}" alt="Preview" style="width: 100%; height: 100%; object-fit: cover;">
                    <button class="remove-image-btn" data-setting="${setting}" style="position: absolute; top: 8px; right: 8px; background: rgba(0,0,0,0.7); color: white; border: none; border-radius: 4px; padding: 4px 8px; cursor: pointer; font-size: 12px;">
                        <i class="material-icons" style="font-size: 16px;">close</i>
                    </button>
                `);
                
                window.setHasPendingPageStructureChanges(true);
                window.updateSaveButtonState();
                if (window.renderPreview) {
                    window.renderPreview();
                }
            };
            
            reader.readAsDataURL(file);
        });
        
        // Remove image handler - Use event delegation
        $(document).off('click', '.remove-image-btn').on('click', '.remove-image-btn', function(e) {
            e.stopPropagation();
            const setting = $(this).data('setting');
            const translations = window.translations[window.currentLanguage] || {};
            
            // Clear the stored image
            window.currentSectionsConfig.imageBanner[setting] = '';
            
            // Reset file input
            const $fileInput = $(`.image-file-input[data-setting="${setting}"]`);
            $fileInput.val('');
            
            // Update preview to show placeholder
            const $container = $(`.image-upload-container[data-setting="${setting}"]`);
            const $previewContainer = $container.find('.image-preview-container');
            
            $previewContainer.html(`
                <div class="image-placeholder" style="width: 100%; height: 100%; background: #ffffff !important; display: flex; align-items: center; justify-content: center; flex-direction: column; gap: 8px; cursor: pointer;">
                    <i class="material-icons" style="font-size: 32px; color: #999;">add_photo_alternate</i>
                    <span style="color: #666; font-size: 13px;">${translations['common.selectImage'] || 'Seleccionar imagen'}</span>
                </div>
            `);
            
            window.setHasPendingPageStructureChanges(true);
            window.updateSaveButtonState();
            if (window.renderPreview) {
                window.renderPreview();
            }
        });
        
        // Explore free images link
        $('.explore-free-images-link').off('click').on('click', function(e) {
            e.preventDefault();
            // In a real implementation, this would open a modal with free stock images
            window.open('https://unsplash.com', '_blank');
        });
        
        // Video upload button handler
        $('.btn-upload-video').off('click').on('click', function() {
            const setting = $(this).data('setting');
            const fileInput = $(`.video-file-input[data-setting="${setting}"]`);
            fileInput.trigger('click');
        });
        
        // Video URL button handler
        $('.btn-video-url').off('click').on('click', function() {
            const videoUrl = prompt('Enter video URL (YouTube or Vimeo):', window.currentSectionsConfig.imageBanner.videoUrl || '');
            if (videoUrl !== null && videoUrl.trim() !== '') {
                window.currentSectionsConfig.imageBanner.videoUrl = videoUrl;
                window.currentSectionsConfig.imageBanner.videoFile = ''; // Clear file if URL is set
                
                // Update preview with embedded video
                const $container = $('.video-upload-container[data-setting="videoFile"]');
                const $previewContainer = $container.find('.video-preview-container');
                
                // Check if it's YouTube or Vimeo
                let embedHtml = '';
                if (videoUrl.includes('youtube.com') || videoUrl.includes('youtu.be')) {
                    const videoId = videoUrl.match(/(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/)?.[1];
                    if (videoId) {
                        embedHtml = `<iframe src="https://www.youtube.com/embed/${videoId}" style="width: 100%; height: 100%;" frameborder="0" allowfullscreen></iframe>`;
                    }
                } else if (videoUrl.includes('vimeo.com')) {
                    const videoId = videoUrl.match(/vimeo\.com\/(\d+)/)?.[1];
                    if (videoId) {
                        embedHtml = `<iframe src="https://player.vimeo.com/video/${videoId}" style="width: 100%; height: 100%;" frameborder="0" allowfullscreen></iframe>`;
                    }
                } else {
                    embedHtml = `<video src="${videoUrl}" style="width: 100%; height: 100%; object-fit: cover;" controls></video>`;
                }
                
                $previewContainer.html(`
                    ${embedHtml}
                    <button class="remove-video-btn" data-setting="videoFile" style="position: absolute; top: 8px; right: 8px; background: rgba(0,0,0,0.7); color: white; border: none; border-radius: 4px; padding: 4px 8px; cursor: pointer; font-size: 12px; z-index: 10;">
                        <i class="material-icons" style="font-size: 16px;">close</i>
                    </button>
                `);
                
                window.setHasPendingPageStructureChanges(true);
                window.updateSaveButtonState();
                if (window.renderPreview) {
                    window.renderPreview();
                }
            }
        });
        
        // Handle video file selection
        $('.video-file-input').off('change').on('change', function() {
            const file = this.files[0];
            if (!file) return;
            
            // Check file type
            const validVideoTypes = ['video/mp4', 'video/webm', 'video/ogg', 'video/quicktime'];
            if (!validVideoTypes.includes(file.type)) {
                alert('Por favor selecciona un archivo de video válido (MP4, WebM, OGG, o MOV).');
                this.value = ''; // Clear the input
                return;
            }
            
            // Check file size (25MB max)
            if (file.size > 25 * 1024 * 1024) {
                alert('El archivo excede el límite de 25MB.');
                this.value = ''; // Clear the input
                return;
            }
            
            const setting = $(this).data('setting');
            const $container = $(`.video-upload-container[data-setting="${setting}"]`);
            const $previewContainer = $container.find('.video-preview-container');
            
            // Show loading state
            $previewContainer.html(`
                <div style="width: 100%; height: 100%; background: #ffffff !important; display: flex; align-items: center; justify-content: center; flex-direction: column; gap: 8px;">
                    <div class="spinner" style="
                        width: 40px;
                        height: 40px;
                        border: 4px solid #f3f3f3;
                        border-top: 4px solid #3498db;
                        border-radius: 50%;
                        animation: spin 1s linear infinite;
                    "></div>
                    <span style="color: #666; font-size: 13px;">Subiendo video...</span>
                </div>
            `);
            
            // Upload video to server
            const formData = new FormData();
            formData.append('videoFile', file);
            
            $.ajax({
                url: '/api/builder/websites/current/upload-video',
                type: 'POST',
                data: formData,
                processData: false,
                contentType: false,
                success: function(response) {
                    // Save the video URL
                    window.currentSectionsConfig.imageBanner.videoUrl = response.videoUrl;
                    window.currentSectionsConfig.imageBanner.videoFile = ''; // Clear file data
                    
                    // Update preview with uploaded video
                    $previewContainer.html(`
                        <video src="${response.videoUrl}" style="width: 100%; height: 100%; object-fit: cover;" controls></video>
                        <button class="remove-video-btn" data-setting="${setting}" style="position: absolute; top: 8px; right: 8px; background: rgba(0,0,0,0.7); color: white; border: none; border-radius: 4px; padding: 4px 8px; cursor: pointer; font-size: 12px;">
                            <i class="material-icons" style="font-size: 16px;">close</i>
                        </button>
                        <div style="position: absolute; bottom: 8px; left: 8px; right: 8px; background: rgba(0,0,0,0.8); color: white; padding: 8px; border-radius: 4px; font-size: 12px;">
                            <i class="material-icons" style="font-size: 16px; vertical-align: middle;">check_circle</i>
                            Video subido exitosamente
                        </div>
                    `);
                    
                    window.setHasPendingPageStructureChanges(true);
                    window.updateSaveButtonState();
                    if (window.renderPreview) {
                        window.renderPreview();
                    }
                    
                    // Hide success message after 3 seconds
                    setTimeout(function() {
                        $previewContainer.find('div[style*="bottom: 8px"]').fadeOut();
                    }, 3000);
                },
                error: function(xhr, status, error) {
                    const errorMessage = xhr.responseJSON?.message || 'Error al subir el video';
                    alert(errorMessage);
                    
                    // Reset to placeholder
                    $previewContainer.html(`
                        <div class="video-placeholder" style="width: 100%; height: 100%; background: #ffffff !important; display: flex; align-items: center; justify-content: center; flex-direction: column; gap: 8px;">
                            <i class="material-icons" style="font-size: 32px; color: #999;">videocam</i>
                            <span style="color: #666; font-size: 13px;">Seleccionar video</span>
                        </div>
                    `);
                }
            });
        });
        
        // Remove video handler
        $(document).off('click', '.remove-video-btn').on('click', '.remove-video-btn', function(e) {
            e.stopPropagation();
            const setting = $(this).data('setting');
            const translations = window.translations[window.currentLanguage] || {};
            
            // Clear both video file and URL
            window.currentSectionsConfig.imageBanner.videoFile = '';
            window.currentSectionsConfig.imageBanner.videoUrl = '';
            
            // Reset file input
            const $fileInput = $(`.video-file-input[data-setting="${setting}"]`);
            $fileInput.val('');
            
            // Update preview to show placeholder
            const $container = $(`.video-upload-container[data-setting="${setting}"]`);
            const $previewContainer = $container.find('.video-preview-container');
            
            $previewContainer.html(`
                <div class="video-placeholder" style="width: 100%; height: 100%; background: #ffffff !important; display: flex; align-items: center; justify-content: center; flex-direction: column; gap: 8px;">
                    <i class="material-icons" style="font-size: 32px; color: #999;">videocam</i>
                    <span style="color: #666; font-size: 13px;">${translations['common.selectVideo'] || 'Seleccionar video'}</span>
                </div>
            `);
            
            window.setHasPendingPageStructureChanges(true);
            window.updateSaveButtonState();
            if (window.renderPreview) {
                window.renderPreview();
            }
        });
        
        // Color scheme learn more link
        $('.setting-link').off('click').on('click', function(e) {
            e.preventDefault();
            // In a real implementation, this would open a help modal or documentation
            alert('Color schemes help you maintain consistent colors across your website.');
        });
        
        // Add CSS for additional styles if not already present
        if (!$('#image-banner-additional-styles').length) {
            $('head').append(`
                <style id="image-banner-additional-styles">
                    .toolbar-btn:hover {
                        background: #e3e3e3 !important;
                    }
                    
                    .button-group-item {
                        transition: all 0.3s ease;
                    }
                    
                    @keyframes spin {
                        0% { transform: rotate(0deg); }
                        100% { transform: rotate(360deg); }
                    }
                    
                    input[type="range"] {
                        -webkit-appearance: none;
                        appearance: none;
                        background: transparent;
                        cursor: pointer;
                    }
                    
                    input[type="range"]::-webkit-slider-track {
                        background: #e3e3e3;
                        height: 4px;
                        border-radius: 2px;
                    }
                    
                    input[type="range"]::-webkit-slider-thumb {
                        -webkit-appearance: none;
                        appearance: none;
                        background: #2962ff;
                        height: 16px;
                        width: 16px;
                        border-radius: 50%;
                        margin-top: -6px;
                    }
                    
                    input[type="range"]::-moz-range-track {
                        background: #e3e3e3;
                        height: 4px;
                        border-radius: 2px;
                    }
                    
                    input[type="range"]::-moz-range-thumb {
                        background: #2962ff;
                        height: 16px;
                        width: 16px;
                        border-radius: 50%;
                        border: 0;
                    }
                    
                    [contenteditable="true"]:focus {
                        outline: 2px solid #2962ff;
                        outline-offset: -2px;
                    }
                    
                    @keyframes spin {
                        0% { transform: rotate(0deg); }
                        100% { transform: rotate(360deg); }
                    }
                </style>
            `);
        }
    },
    
    initialize: function() {}
});