// Helper functions for Image Banner settings rendering
window.WebsiteBuilderModules = window.WebsiteBuilderModules || {};
window.WebsiteBuilderModules.ImageBanner = window.WebsiteBuilderModules.ImageBanner || {};

// Main settings section
window.WebsiteBuilderModules.ImageBanner.renderMainSettings = function(config) {
    const translations = window.translations[window.currentLanguage] || {};
    
    return `
        <!-- Appearance section -->
        <h4 style="font-size: 13px; font-weight: 500; margin-bottom: 12px; color: #5c5e60;">${translations['settings.appearance'] || 'Appearance'}</h4>
        
        <!-- Color scheme -->
        <div class="settings-field" style="margin-bottom: 20px;">
            <label style="display: block; margin-bottom: 8px; font-size: 13px; color: #333;">
                ${translations['settings.colorScheme'] || 'Color scheme'}
            </label>
            <select data-setting="colorScheme" style="width: 100%; padding: 8px; border: 1px solid #ddd; border-radius: 4px;">
                <option value="primary">${translations['colorSchemes.primary'] || 'Primary'}</option>
                <option value="scheme1" ${config.colorScheme === 'scheme1' ? 'selected' : ''}>1</option>
                <option value="scheme2" ${config.colorScheme === 'scheme2' ? 'selected' : ''}>2</option>
                <option value="scheme3" ${config.colorScheme === 'scheme3' ? 'selected' : ''}>3</option>
                <option value="scheme4" ${config.colorScheme === 'scheme4' ? 'selected' : ''}>4</option>
                <option value="scheme5" ${config.colorScheme === 'scheme5' ? 'selected' : ''}>5</option>
            </select>
            <a href="#" style="font-size: 12px; color: #2962ff; text-decoration: none; margin-top: 4px; display: inline-block;">${translations['colorSchemes.learnMore'] || 'Learn about color schemes'}</a>
        </div>
        
        <!-- Color background toggle -->
        <div class="settings-field" style="margin-bottom: 16px;">
            <label class="toggle-field" style="display: flex; align-items: center; justify-content: space-between;">
                <span style="font-size: 13px; color: #202223;">${translations['settings.colorBackground'] || 'Color background'}</span>
                <input type="checkbox" id="image-banner-color-bg-toggle" class="shopify-toggle" data-setting="useColorBackground" ${config.useColorBackground ? 'checked' : ''}>
                <label for="image-banner-color-bg-toggle" class="toggle-slider"></label>
            </label>
        </div>
        
        <!-- Width -->
        <div class="settings-field" style="margin-bottom: 20px;">
            <label style="display: block; margin-bottom: 8px; font-size: 13px; color: #333;">
                ${translations['settings.width'] || 'Width'}
            </label>
            <select data-setting="width" style="width: 100%; padding: 8px; border: 1px solid #ddd; border-radius: 4px;">
                <option value="small" ${config.width === 'small' ? 'selected' : ''}>${translations['width.small'] || 'Small'}</option>
                <option value="medium" ${config.width === 'medium' ? 'selected' : ''}>${translations['width.medium'] || 'Medium'}</option>
                <option value="large" ${config.width === 'large' ? 'selected' : ''}>${translations['width.large'] || 'Large'}</option>
                <option value="page" ${config.width === 'page' ? 'selected' : ''}>${translations['width.page'] || 'Page'}</option>
                <option value="screen" ${config.width === 'screen' ? 'selected' : ''}>${translations['width.screen'] || 'Screen'}</option>
            </select>
        </div>
        
        <!-- Desktop height type -->
        <div class="settings-field" style="margin-bottom: 20px;">
            <label style="display: block; margin-bottom: 8px; font-size: 13px; color: #333;">
                ${translations['settings.desktopHeightType'] || 'Desktop height type'}
            </label>
            <select data-setting="desktopHeightType" style="width: 100%; padding: 8px; border: 1px solid #ddd; border-radius: 4px;">
                <option value="ratio" ${config.desktopHeightType === 'ratio' || !config.desktopHeightType ? 'selected' : ''}>${translations['heightType.ratio'] || 'Aspect ratio'}</option>
                <option value="fixed" ${config.desktopHeightType === 'fixed' ? 'selected' : ''}>${translations['heightType.fixed'] || 'Fixed height'}</option>
            </select>
        </div>
        
        <!-- Desktop ratio -->
        <div class="settings-field" style="margin-bottom: 20px; ${config.desktopHeightType === 'fixed' ? 'display: none;' : ''}">
            <label style="display: block; margin-bottom: 8px; font-size: 13px; color: #333;">
                ${translations['settings.desktopRatio'] || 'Desktop ratio'}
            </label>
            <div style="display: flex; align-items: center; gap: 12px;">
                <input type="range" min="0.2" max="2" step="0.1" value="${config.desktopRatio}" 
                       data-setting="desktopRatio" 
                       style="flex: 1; height: 4px;">
                <span style="min-width: 45px; font-size: 13px; color: #666; text-align: right;">${config.desktopRatio}</span>
            </div>
        </div>
        
        <!-- Desktop fixed height -->
        <div class="settings-field" style="margin-bottom: 20px; ${config.desktopHeightType !== 'fixed' ? 'display: none;' : ''}">
            <label style="display: block; margin-bottom: 8px; font-size: 13px; color: #333;">
                ${translations['settings.desktopFixedHeight'] || 'Desktop height (px)'}
            </label>
            <div style="display: flex; align-items: center; gap: 12px;">
                <input type="range" min="200" max="2000" step="10" value="${config.desktopFixedHeight || 600}" 
                       data-setting="desktopFixedHeight" 
                       style="flex: 1; height: 4px;">
                <span style="min-width: 60px; font-size: 13px; color: #666; text-align: right;">${config.desktopFixedHeight || 600}px</span>
            </div>
        </div>
        
        <!-- Mobile ratio -->
        <div class="settings-field" style="margin-bottom: 20px;">
            <label style="display: block; margin-bottom: 8px; font-size: 13px; color: #333;">
                ${translations['settings.mobileRatio'] || 'Mobile ratio'}
            </label>
            <div style="display: flex; align-items: center; gap: 12px;">
                <input type="range" min="0.2" max="2" step="0.1" value="${config.mobileRatio}" 
                       data-setting="mobileRatio" 
                       style="flex: 1; height: 4px;">
                <span style="min-width: 45px; font-size: 13px; color: #666; text-align: right;">${config.mobileRatio}</span>
            </div>
        </div>
        
        <!-- Separator -->
        <div style="height: 1px; background: #e3e3e3; margin: 24px 0;"></div>
    `;
};

// Image settings section
window.WebsiteBuilderModules.ImageBanner.renderImageSettings = function(config) {
    const translations = window.translations[window.currentLanguage] || {};
    
    return `
        <!-- Image section -->
        <h4 style="font-size: 13px; font-weight: 500; margin-bottom: 12px; color: #5c5e60;">${translations['settings.image'] || 'Image'}</h4>
        
        <!-- Desktop image -->
        <div class="settings-field" style="margin-bottom: 20px;">
            <label style="display: block; margin-bottom: 8px; font-size: 13px; color: #333;">
                ${translations['settings.desktopImage'] || 'Desktop image'}
            </label>
            <div class="image-upload-container" data-setting="desktopImage" style="display: flex; flex-direction: column; gap: 8px;">
                <div class="image-preview-container" style="position: relative; width: 100%; height: 120px; border-radius: 4px; overflow: hidden; border: 1px solid #ddd;">
                    ${config.desktopImage ? 
                        `<img src="${config.desktopImage}" alt="Desktop image preview" style="width: 100%; height: 100%; object-fit: cover;">
                         <button class="remove-image-btn" data-setting="desktopImage" style="position: absolute; top: 8px; right: 8px; background: rgba(0,0,0,0.7); color: white; border: none; border-radius: 4px; padding: 4px 8px; cursor: pointer; font-size: 12px;">
                            <i class="material-icons" style="font-size: 16px;">close</i>
                         </button>` :
                        `<div class="image-placeholder" style="width: 100%; height: 100%; background: #f6f6f7; display: flex; align-items: center; justify-content: center; flex-direction: column; gap: 8px;">
                            <i class="material-icons" style="font-size: 32px; color: #999;">add_photo_alternate</i>
                            <span style="color: #666; font-size: 13px;">${translations['common.selectImage'] || 'Seleccionar imagen'}</span>
                         </div>`
                    }
                </div>
                <input type="file" class="image-file-input" data-setting="desktopImage" accept="image/*" style="display: none;">
                <button class="btn-upload-image" data-setting="desktopImage" style="padding: 8px 16px; background: #fff; border: 1px solid #ddd; border-radius: 4px; cursor: pointer;">
                    <i class="material-icons" style="font-size: 16px; vertical-align: middle; margin-right: 4px;">upload</i>
                    ${translations['common.uploadImage'] || 'Subir imagen'}
                </button>
            </div>
        </div>
        
        <!-- Image fit -->
        <div class="settings-field" style="margin-bottom: 20px;">
            <label style="display: block; margin-bottom: 8px; font-size: 13px; color: #333;">
                ${translations['settings.imageFit'] || 'Image fit'}
            </label>
            <select data-setting="imageFit" style="width: 100%; padding: 8px; border: 1px solid #ddd; border-radius: 4px;">
                <option value="cover" ${config.imageFit === 'cover' ? 'selected' : ''}>${translations['imageFit.cover'] || 'Cover (fills container)'}</option>
                <option value="contain" ${config.imageFit === 'contain' ? 'selected' : ''}>${translations['imageFit.contain'] || 'Contain (fits inside)'}</option>
                <option value="fill" ${config.imageFit === 'fill' ? 'selected' : ''}>${translations['imageFit.fill'] || 'Fill (stretches to fit)'}</option>
                <option value="scale-down" ${config.imageFit === 'scale-down' ? 'selected' : ''}>${translations['imageFit.scaleDown'] || 'Scale down'}</option>
            </select>
        </div>
        
        <!-- Image position -->
        <div class="settings-field" style="margin-bottom: 20px;">
            <label style="display: block; margin-bottom: 8px; font-size: 13px; color: #333;">
                ${translations['settings.imagePosition'] || 'Image position'}
            </label>
            <select data-setting="imagePosition" style="width: 100%; padding: 8px; border: 1px solid #ddd; border-radius: 4px;">
                <option value="center" ${config.imagePosition === 'center' ? 'selected' : ''}>${translations['imagePosition.center'] || 'Center'}</option>
                <option value="top" ${config.imagePosition === 'top' ? 'selected' : ''}>${translations['imagePosition.top'] || 'Top'}</option>
                <option value="bottom" ${config.imagePosition === 'bottom' ? 'selected' : ''}>${translations['imagePosition.bottom'] || 'Bottom'}</option>
                <option value="left" ${config.imagePosition === 'left' ? 'selected' : ''}>${translations['imagePosition.left'] || 'Left'}</option>
                <option value="right" ${config.imagePosition === 'right' ? 'selected' : ''}>${translations['imagePosition.right'] || 'Right'}</option>
            </select>
        </div>
        
        <!-- Mobile image -->
        <div class="settings-field" style="margin-bottom: 20px;">
            <label style="display: block; margin-bottom: 8px; font-size: 13px; color: #333;">
                ${translations['settings.mobileImage'] || 'Mobile image'}
            </label>
            <div class="image-upload-container" data-setting="mobileImage" style="display: flex; flex-direction: column; gap: 8px;">
                <div class="image-preview-container" style="position: relative; width: 100%; height: 120px; border-radius: 4px; overflow: hidden; border: 1px solid #ddd;">
                    ${config.mobileImage ? 
                        `<img src="${config.mobileImage}" alt="Mobile image preview" style="width: 100%; height: 100%; object-fit: cover;">
                         <button class="remove-image-btn" data-setting="mobileImage" style="position: absolute; top: 8px; right: 8px; background: rgba(0,0,0,0.7); color: white; border: none; border-radius: 4px; padding: 4px 8px; cursor: pointer; font-size: 12px;">
                            <i class="material-icons" style="font-size: 16px;">close</i>
                         </button>` :
                        `<div class="image-placeholder" style="width: 100%; height: 100%; background: #f6f6f7; display: flex; align-items: center; justify-content: center; flex-direction: column; gap: 8px;">
                            <i class="material-icons" style="font-size: 32px; color: #999;">add_photo_alternate</i>
                            <span style="color: #666; font-size: 13px;">${translations['common.selectImage'] || 'Seleccionar imagen'}</span>
                         </div>`
                    }
                </div>
                <input type="file" class="image-file-input" data-setting="mobileImage" accept="image/*" style="display: none;">
                <button class="btn-upload-image" data-setting="mobileImage" style="padding: 8px 16px; background: #fff; border: 1px solid #ddd; border-radius: 4px; cursor: pointer;">
                    <i class="material-icons" style="font-size: 16px; vertical-align: middle; margin-right: 4px;">upload</i>
                    ${translations['common.uploadImage'] || 'Subir imagen'}
                </button>
            </div>
            <a href="#" class="explore-free-images-link" style="font-size: 12px; color: #2962ff; text-decoration: none; margin-top: 4px; display: inline-block;">
                ${translations['settings.exploreFreeImages'] || 'Explorar imágenes gratuitas'}
            </a>
        </div>
        
        <!-- Video -->
        <div class="settings-field" style="margin-bottom: 20px;">
            <label style="display: block; margin-bottom: 8px; font-size: 13px; color: #333;">
                ${translations['settings.video'] || 'Video'}
            </label>
            <div class="video-upload-container" data-setting="videoFile" style="display: flex; flex-direction: column; gap: 8px;">
                <div class="video-preview-container" style="position: relative; width: 100%; height: 120px; border-radius: 4px; overflow: hidden; border: 1px solid #ddd;">
                    ${(() => {
                        if (config.videoUrl) {
                            // Check if it's YouTube or Vimeo
                            let embedHtml = '';
                            if (config.videoUrl.includes('youtube.com') || config.videoUrl.includes('youtu.be')) {
                                const videoId = config.videoUrl.match(/(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/)?.[1];
                                if (videoId) {
                                    embedHtml = `<iframe src="https://www.youtube.com/embed/${videoId}" style="width: 100%; height: 100%;" frameborder="0" allowfullscreen></iframe>`;
                                }
                            } else if (config.videoUrl.includes('vimeo.com')) {
                                const videoId = config.videoUrl.match(/vimeo\.com\/(\d+)/)?.[1];
                                if (videoId) {
                                    embedHtml = `<iframe src="https://player.vimeo.com/video/${videoId}" style="width: 100%; height: 100%;" frameborder="0" allowfullscreen></iframe>`;
                                }
                            } else {
                                embedHtml = `<video src="${config.videoUrl}" style="width: 100%; height: 100%; object-fit: cover;" controls></video>`;
                            }
                            return embedHtml + `
                                <button class="remove-video-btn" data-setting="videoFile" style="position: absolute; top: 8px; right: 8px; background: rgba(0,0,0,0.7); color: white; border: none; border-radius: 4px; padding: 4px 8px; cursor: pointer; font-size: 12px; z-index: 10;">
                                    <i class="material-icons" style="font-size: 16px;">close</i>
                                </button>`;
                        } else if (config.videoFile) {
                            return `<video src="${config.videoFile}" style="width: 100%; height: 100%; object-fit: cover;" controls></video>
                                <button class="remove-video-btn" data-setting="videoFile" style="position: absolute; top: 8px; right: 8px; background: rgba(0,0,0,0.7); color: white; border: none; border-radius: 4px; padding: 4px 8px; cursor: pointer; font-size: 12px;">
                                    <i class="material-icons" style="font-size: 16px;">close</i>
                                </button>`;
                        } else {
                            return `<div class="video-placeholder" style="width: 100%; height: 100%; background: #f6f6f7; display: flex; align-items: center; justify-content: center; flex-direction: column; gap: 8px;">
                                <i class="material-icons" style="font-size: 32px; color: #999;">videocam</i>
                                <span style="color: #666; font-size: 13px;">${translations['common.selectVideo'] || 'Seleccionar video'}</span>
                            </div>`;
                        }
                    })()}
                </div>
                <input type="file" class="video-file-input" data-setting="videoFile" accept="video/*" style="display: none;">
                <div style="display: flex; gap: 8px;">
                    <button class="btn-upload-video" data-setting="videoFile" style="flex: 1; padding: 8px 16px; background: #fff; border: 1px solid #ddd; border-radius: 4px; cursor: pointer;">
                        <i class="material-icons" style="font-size: 16px; vertical-align: middle; margin-right: 4px;">upload</i>
                        ${translations['common.uploadVideo'] || 'Subir video'}
                    </button>
                    <button class="btn-video-url" style="flex: 1; padding: 8px 16px; background: #fff; border: 1px solid #ddd; border-radius: 4px; cursor: pointer;">
                        <i class="material-icons" style="font-size: 16px; vertical-align: middle; margin-right: 4px;">link</i>
                        ${translations['common.videoUrl'] || 'URL de video'}
                    </button>
                </div>
                <div style="font-size: 12px; color: #666;">
                    ${translations['notes.videoFormats'] || 'Formatos soportados: MP4, WebM, YouTube, Vimeo'}
                </div>
            </div>
        </div>
        
        <!-- Video sound toggle -->
        <div class="settings-field" style="margin-bottom: 20px;">
            <label class="toggle-field" style="display: flex; align-items: center; justify-content: space-between;">
                <span style="font-size: 13px; color: #202223;">${translations['settings.playWithSound'] || 'Reproducir con sonido'}</span>
                <input type="checkbox" id="image-banner-play-sound-toggle" class="shopify-toggle" 
                       data-setting="playWithSound" ${config.playWithSound ? 'checked' : ''}>
                <label for="image-banner-play-sound-toggle" class="toggle-slider"></label>
            </label>
        </div>
        
        <!-- Desktop overlay opacity -->
        <div class="settings-field" style="margin-bottom: 20px;">
            <label style="display: block; margin-bottom: 8px; font-size: 13px; color: #333;">
                ${translations['settings.desktopOverlayOpacity'] || 'Desktop overlay opacity'}
            </label>
            <div style="display: flex; align-items: center; gap: 12px;">
                <input type="range" min="0" max="100" step="5" value="${config.desktopOverlayOpacity}" 
                       data-setting="desktopOverlayOpacity" 
                       style="flex: 1; height: 4px;">
                <span style="min-width: 45px; font-size: 13px; color: #666; text-align: right;">${config.desktopOverlayOpacity}%</span>
            </div>
        </div>
        
        <!-- Mobile overlay opacity -->
        <div class="settings-field" style="margin-bottom: 20px;">
            <label style="display: block; margin-bottom: 8px; font-size: 13px; color: #333;">
                ${translations['settings.mobileOverlayOpacity'] || 'Mobile overlay opacity'}
            </label>
            <div style="display: flex; align-items: center; gap: 12px;">
                <input type="range" min="0" max="100" step="5" value="${config.mobileOverlayOpacity}" 
                       data-setting="mobileOverlayOpacity" 
                       style="flex: 1; height: 4px;">
                <span style="min-width: 45px; font-size: 13px; color: #666; text-align: right;">${config.mobileOverlayOpacity}%</span>
            </div>
        </div>
        
        <!-- Separator -->
        <div style="height: 1px; background: #e3e3e3; margin: 24px 0;"></div>
    `;
};

// Content settings section
window.WebsiteBuilderModules.ImageBanner.renderContentSettings = function(config) {
    const translations = window.translations[window.currentLanguage] || {};
    
    return `
        <!-- Content section -->
        <h4 style="font-size: 13px; font-weight: 500; margin-bottom: 12px; color: #5c5e60;">${translations['settings.content'] || 'Content'}</h4>
        
        <!-- Subheading -->
        <div class="settings-field" style="margin-bottom: 20px;">
            <label style="display: block; margin-bottom: 8px; font-size: 13px; color: #333;">
                ${translations['settings.subheading'] || 'Subheading'}
            </label>
            <input type="text" data-setting="subheading" 
                   value="${config.subheading}" placeholder="${translations['placeholders.subheading'] || 'IMAGE BANNER'}"
                   style="width: 100%; padding: 8px; border: 1px solid #ddd; border-radius: 4px;">
        </div>
        
        <!-- Heading -->
        <div class="settings-field" style="margin-bottom: 20px;">
            <label style="display: block; margin-bottom: 8px; font-size: 13px; color: #333;">
                ${translations['settings.heading'] || 'Heading'}
            </label>
            <input type="text" data-setting="heading" 
                   value="${config.heading}" placeholder="${translations['placeholders.heading'] || 'Image with text'}"
                   style="width: 100%; padding: 8px; border: 1px solid #ddd; border-radius: 4px;">
        </div>
        
        <!-- Body text -->
        <div class="settings-field" style="margin-bottom: 20px;">
            <label style="display: block; margin-bottom: 8px; font-size: 13px; color: #333;">
                ${translations['settings.body'] || 'Body'}
            </label>
            <div style="border: 1px solid #ddd; border-radius: 4px; overflow: hidden;">
                <div style="display: flex; gap: 4px; padding: 8px; background: #f6f6f7; border-bottom: 1px solid #ddd;">
                    <button class="toolbar-btn" data-action="formatBlock" data-value="p" title="Text"
                            style="width: 32px; height: 32px; background: none; border: none; border-radius: 4px; cursor: pointer;">
                        <span style="font-size: 14px; font-weight: 600;">T</span>
                    </button>
                    <button class="toolbar-btn" data-action="fontSize" data-value="small" title="Small"
                            style="width: 32px; height: 32px; background: none; border: none; border-radius: 4px; cursor: pointer;">
                        <span style="font-size: 14px; font-weight: 600;">Aa</span>
                    </button>
                    <button class="toolbar-btn" data-action="bold" title="Bold"
                            style="width: 32px; height: 32px; background: none; border: none; border-radius: 4px; cursor: pointer;">
                        <i class="material-icons" style="font-size: 18px;">format_bold</i>
                    </button>
                    <button class="toolbar-btn" data-action="italic" title="Italic"
                            style="width: 32px; height: 32px; background: none; border: none; border-radius: 4px; cursor: pointer;">
                        <i class="material-icons" style="font-size: 18px;">format_italic</i>
                    </button>
                    <button class="toolbar-btn" data-action="createLink" title="Link"
                            style="width: 32px; height: 32px; background: none; border: none; border-radius: 4px; cursor: pointer;">
                        <i class="material-icons" style="font-size: 18px;">link</i>
                    </button>
                    <button class="toolbar-btn" data-action="formatBlock" data-value="ul" title="List"
                            style="width: 32px; height: 32px; background: none; border: none; border-radius: 4px; cursor: pointer;">
                        <i class="material-icons" style="font-size: 18px;">format_list_bulleted</i>
                    </button>
                    <button class="toolbar-btn" data-action="formatBlock" data-value="ol" title="Numbered List"
                            style="width: 32px; height: 32px; background: none; border: none; border-radius: 4px; cursor: pointer;">
                        <i class="material-icons" style="font-size: 18px;">format_list_numbered</i>
                    </button>
                </div>
                <div contenteditable="true" data-setting="bodyText"
                     style="min-height: 100px; padding: 12px; font-size: 13px; background: #fff; outline: none;">
                    ${config.bodyText}
                </div>
            </div>
        </div>
        
        <!-- Heading size -->
        <div class="settings-field" style="margin-bottom: 20px;">
            <label style="display: block; margin-bottom: 8px; font-size: 13px; color: #333;">
                ${translations['settings.headingSize'] || 'Heading size'}
            </label>
            <select data-setting="headingSize" style="width: 100%; padding: 8px; border: 1px solid #ddd; border-radius: 4px;">
                ${[0,1,2,3,4,5,6,7].map(size => 
                    `<option value="${size}" ${config.headingSize == size ? 'selected' : ''}>
                        ${translations[`headingSize.${size}`] || `Heading ${size}`}
                    </option>`
                ).join('')}
            </select>
        </div>
        
        <!-- Body size -->
        <div class="settings-field" style="margin-bottom: 20px;">
            <label style="display: block; margin-bottom: 8px; font-size: 13px; color: #333;">
                ${translations['settings.bodySize'] || 'Body size'}
            </label>
            <select data-setting="bodySize" style="width: 100%; padding: 8px; border: 1px solid #ddd; border-radius: 4px;">
                ${[0,1,2,3,4,5,6].map(size => 
                    `<option value="${size}" ${config.bodySize == size ? 'selected' : ''}>
                        ${translations[`bodySize.${size}`] || `Body ${size}`}
                    </option>`
                ).join('')}
            </select>
            <div style="font-size: 12px; color: #666; margin-top: 4px;">
                ${translations['notes.paragraphFormatting'] || "For 'Paragraph' body text formatting"}
            </div>
        </div>
        
        <!-- Separator -->
        <div style="height: 1px; background: #e3e3e3; margin: 24px 0;"></div>
    `;
};

// Content position settings
window.WebsiteBuilderModules.ImageBanner.renderPositionSettings = function(config) {
    const translations = window.translations[window.currentLanguage] || {};
    
    return `
        <!-- Content Position section -->
        <h4 style="font-size: 13px; font-weight: 500; margin-bottom: 12px; color: #5c5e60;">${translations['settings.contentPosition'] || 'Content Position'}</h4>
        
        <!-- Desktop position -->
        <div class="settings-field" style="margin-bottom: 20px;">
            <label style="display: block; margin-bottom: 8px; font-size: 13px; color: #333;">
                ${translations['settings.desktopPosition'] || 'Desktop position'}
            </label>
            <select data-setting="desktopPosition" style="width: 100%; padding: 8px; border: 1px solid #ddd; border-radius: 4px;">
                <option value="top-left" ${config.desktopPosition === 'top-left' ? 'selected' : ''}>${translations['position.topLeft'] || 'Top left'}</option>
                <option value="top-center" ${config.desktopPosition === 'top-center' ? 'selected' : ''}>${translations['position.topCenter'] || 'Top center'}</option>
                <option value="top-right" ${config.desktopPosition === 'top-right' ? 'selected' : ''}>${translations['position.topRight'] || 'Top right'}</option>
                <option value="center-left" ${config.desktopPosition === 'center-left' ? 'selected' : ''}>${translations['position.centerLeft'] || 'Center left'}</option>
                <option value="center" ${config.desktopPosition === 'center' ? 'selected' : ''}>${translations['position.center'] || 'Center'}</option>
                <option value="center-right" ${config.desktopPosition === 'center-right' ? 'selected' : ''}>${translations['position.centerRight'] || 'Center right'}</option>
                <option value="bottom-left" ${config.desktopPosition === 'bottom-left' ? 'selected' : ''}>${translations['position.bottomLeft'] || 'Bottom left'}</option>
                <option value="bottom-center" ${config.desktopPosition === 'bottom-center' ? 'selected' : ''}>${translations['position.bottomCenter'] || 'Bottom center'}</option>
                <option value="bottom-right" ${config.desktopPosition === 'bottom-right' ? 'selected' : ''}>${translations['position.bottomRight'] || 'Bottom right'}</option>
            </select>
        </div>
        
        <!-- Desktop alignment -->
        <div class="settings-field" style="margin-bottom: 20px;">
            <label style="display: block; margin-bottom: 8px; font-size: 13px; color: #333;">
                ${translations['settings.desktopAlignment'] || 'Desktop alignment'}
            </label>
            <div style="display: flex; gap: 4px;">
                <button class="button-group-item ${config.desktopAlignment === 'left' ? 'active' : ''}" 
                        data-setting="desktopAlignment" data-value="left"
                        style="flex: 1; padding: 8px; background: ${config.desktopAlignment === 'left' ? '#2962ff' : '#fff'}; 
                               color: ${config.desktopAlignment === 'left' ? '#fff' : '#333'}; 
                               border: 1px solid ${config.desktopAlignment === 'left' ? '#2962ff' : '#ddd'}; 
                               border-radius: 4px 0 0 4px; cursor: pointer;">
                    ${translations['alignment.left'] || 'Left'}
                </button>
                <button class="button-group-item ${config.desktopAlignment === 'center' ? 'active' : ''}" 
                        data-setting="desktopAlignment" data-value="center"
                        style="flex: 1; padding: 8px; background: ${config.desktopAlignment === 'center' ? '#2962ff' : '#fff'}; 
                               color: ${config.desktopAlignment === 'center' ? '#fff' : '#333'}; 
                               border: 1px solid ${config.desktopAlignment === 'center' ? '#2962ff' : '#ddd'}; 
                               border-radius: 0 4px 4px 0; cursor: pointer;">
                    ${translations['alignment.center'] || 'Center'}
                </button>
            </div>
        </div>
        
        <!-- Desktop width -->
        <div class="settings-field" style="margin-bottom: 20px;">
            <label style="display: block; margin-bottom: 8px; font-size: 13px; color: #333;">
                ${translations['settings.desktopWidth'] || 'Desktop width'}
            </label>
            <div style="display: flex; align-items: center; gap: 12px;">
                <input type="range" min="300" max="800" step="4" value="${config.desktopWidth}" 
                       data-setting="desktopWidth" 
                       style="flex: 1; height: 4px;">
                <span style="min-width: 45px; font-size: 13px; color: #666; text-align: right;">${config.desktopWidth}px</span>
            </div>
        </div>
        
        <!-- Desktop spacing -->
        <div class="settings-field" style="margin-bottom: 20px;">
            <label style="display: block; margin-bottom: 8px; font-size: 13px; color: #333;">
                ${translations['settings.desktopSpacing'] || 'Desktop spacing'}
            </label>
            <div style="display: flex; align-items: center; gap: 12px;">
                <input type="range" min="0" max="200" step="4" value="${config.desktopSpacing}" 
                       data-setting="desktopSpacing" 
                       style="flex: 1; height: 4px;">
                <span style="min-width: 45px; font-size: 13px; color: #666; text-align: right;">${config.desktopSpacing}px</span>
            </div>
            <div style="font-size: 12px; color: #666; margin-top: 4px;">
                ${translations['notes.spacingDescription'] || 'Adjust the spacing between the section edges and content.'}
            </div>
        </div>
        
        <!-- Mobile position -->
        <div class="settings-field" style="margin-bottom: 20px;">
            <label style="display: block; margin-bottom: 8px; font-size: 13px; color: #333;">
                ${translations['settings.mobilePosition'] || 'Mobile position'}
            </label>
            <div style="display: flex; gap: 4px;">
                <button class="button-group-item ${config.mobilePosition === 'top' ? 'active' : ''}" 
                        data-setting="mobilePosition" data-value="top"
                        style="flex: 1; padding: 8px; background: ${config.mobilePosition === 'top' ? '#2962ff' : '#fff'}; 
                               color: ${config.mobilePosition === 'top' ? '#fff' : '#333'}; 
                               border: 1px solid ${config.mobilePosition === 'top' ? '#2962ff' : '#ddd'}; 
                               border-radius: 4px 0 0 4px; cursor: pointer;">
                    ${translations['position.top'] || 'Top'}
                </button>
                <button class="button-group-item ${config.mobilePosition === 'center' ? 'active' : ''}" 
                        data-setting="mobilePosition" data-value="center"
                        style="flex: 1; padding: 8px; background: ${config.mobilePosition === 'center' ? '#2962ff' : '#fff'}; 
                               color: ${config.mobilePosition === 'center' ? '#fff' : '#333'}; 
                               border: 1px solid ${config.mobilePosition === 'center' ? '#2962ff' : '#ddd'}; 
                               border-left: none; cursor: pointer;">
                    ${translations['position.center'] || 'Center'}
                </button>
                <button class="button-group-item ${config.mobilePosition === 'bottom' ? 'active' : ''}" 
                        data-setting="mobilePosition" data-value="bottom"
                        style="flex: 1; padding: 8px; background: ${config.mobilePosition === 'bottom' ? '#2962ff' : '#fff'}; 
                               color: ${config.mobilePosition === 'bottom' ? '#fff' : '#333'}; 
                               border: 1px solid ${config.mobilePosition === 'bottom' ? '#2962ff' : '#ddd'}; 
                               border-left: none; border-radius: 0 4px 4px 0; cursor: pointer;">
                    ${translations['position.bottom'] || 'Bottom'}
                </button>
            </div>
        </div>
        
        <!-- Mobile alignment -->
        <div class="settings-field" style="margin-bottom: 20px;">
            <label style="display: block; margin-bottom: 8px; font-size: 13px; color: #333;">
                ${translations['settings.mobileAlignment'] || 'Mobile alignment'}
            </label>
            <div style="display: flex; gap: 4px;">
                <button class="button-group-item ${config.mobileAlignment === 'left' ? 'active' : ''}" 
                        data-setting="mobileAlignment" data-value="left"
                        style="flex: 1; padding: 8px; background: ${config.mobileAlignment === 'left' ? '#2962ff' : '#fff'}; 
                               color: ${config.mobileAlignment === 'left' ? '#fff' : '#333'}; 
                               border: 1px solid ${config.mobileAlignment === 'left' ? '#2962ff' : '#ddd'}; 
                               border-radius: 4px 0 0 4px; cursor: pointer;">
                    ${translations['alignment.left'] || 'Left'}
                </button>
                <button class="button-group-item ${config.mobileAlignment === 'center' ? 'active' : ''}" 
                        data-setting="mobileAlignment" data-value="center"
                        style="flex: 1; padding: 8px; background: ${config.mobileAlignment === 'center' ? '#2962ff' : '#fff'}; 
                               color: ${config.mobileAlignment === 'center' ? '#fff' : '#333'}; 
                               border: 1px solid ${config.mobileAlignment === 'center' ? '#2962ff' : '#ddd'}; 
                               border-radius: 0 4px 4px 0; cursor: pointer;">
                    ${translations['alignment.center'] || 'Center'}
                </button>
            </div>
        </div>
        
        <!-- Separator -->
        <div style="height: 1px; background: #e3e3e3; margin: 24px 0;"></div>
    `;
};

// Content background settings
window.WebsiteBuilderModules.ImageBanner.renderBackgroundSettings = function(config) {
    const translations = window.translations[window.currentLanguage] || {};
    
    return `
        <!-- Content background -->
        <h4 style="font-size: 13px; font-weight: 500; margin-bottom: 12px; color: #5c5e60;">${translations['settings.contentBackground'] || 'Content background'}</h4>
        
        <!-- Desktop content background -->
        <div class="settings-field" style="margin-bottom: 20px;">
            <label style="display: block; margin-bottom: 8px; font-size: 13px; color: #333;">
                ${translations['settings.desktop'] || 'Desktop'}
            </label>
            <select data-setting="desktopContentBackground" style="width: 100%; padding: 8px; border: 1px solid #ddd; border-radius: 4px;">
                <option value="none" ${config.desktopContentBackground === 'none' ? 'selected' : ''}>${translations['contentBackground.none'] || 'None'}</option>
                <option value="solid" ${config.desktopContentBackground === 'solid' ? 'selected' : ''}>${translations['contentBackground.solid'] || 'Solid'}</option>
                <option value="outline" ${config.desktopContentBackground === 'outline' ? 'selected' : ''}>${translations['contentBackground.outline'] || 'Outline'}</option>
                <option value="shadow" ${config.desktopContentBackground === 'shadow' ? 'selected' : ''}>${translations['contentBackground.shadow'] || 'Shadow'}</option>
                <option value="blurred" ${config.desktopContentBackground === 'blurred' ? 'selected' : ''}>${translations['contentBackground.blurred'] || 'Blurred'}</option>
                <option value="transparent" ${config.desktopContentBackground === 'transparent' ? 'selected' : ''}>${translations['contentBackground.transparent'] || 'Transparent'}</option>
            </select>
        </div>
        
        <!-- Mobile content background -->
        <div class="settings-field" style="margin-bottom: 20px;">
            <label style="display: block; margin-bottom: 8px; font-size: 13px; color: #333;">
                ${translations['settings.mobile'] || 'Mobile'}
            </label>
            <select data-setting="mobileContentBackground" style="width: 100%; padding: 8px; border: 1px solid #ddd; border-radius: 4px;">
                <option value="none" ${config.mobileContentBackground === 'none' ? 'selected' : ''}>${translations['contentBackground.none'] || 'None'}</option>
                <option value="solid" ${config.mobileContentBackground === 'solid' ? 'selected' : ''}>${translations['contentBackground.solid'] || 'Solid'}</option>
                <option value="outline" ${config.mobileContentBackground === 'outline' ? 'selected' : ''}>${translations['contentBackground.outline'] || 'Outline'}</option>
                <option value="shadow" ${config.mobileContentBackground === 'shadow' ? 'selected' : ''}>${translations['contentBackground.shadow'] || 'Shadow'}</option>
                <option value="blurred" ${config.mobileContentBackground === 'blurred' ? 'selected' : ''}>${translations['contentBackground.blurred'] || 'Blurred'}</option>
                <option value="transparent" ${config.mobileContentBackground === 'transparent' ? 'selected' : ''}>${translations['contentBackground.transparent'] || 'Transparent'}</option>
            </select>
        </div>
        
        <!-- Separator -->
        <div style="height: 1px; background: #e3e3e3; margin: 24px 0;"></div>
    `;
};

// Button settings
window.WebsiteBuilderModules.ImageBanner.renderButtonSettings = function(config) {
    const translations = window.translations[window.currentLanguage] || {};
    
    return `
        <!-- Buttons section -->
        <h4 style="font-size: 13px; font-weight: 500; margin-bottom: 12px; color: #5c5e60;">${translations['settings.buttons'] || 'Buttons'}</h4>
        
        <!-- First button -->
        <div class="settings-field" style="margin-bottom: 20px;">
            <label style="display: block; margin-bottom: 8px; font-size: 13px; color: #333;">
                ${translations['settings.firstButtonLabel'] || 'First button label'}
            </label>
            <input type="text" data-setting="button1Label" 
                   value="${config.button1Label}" placeholder="${translations['placeholders.buttonLabel'] || 'Button label'}"
                   style="width: 100%; padding: 8px; border: 1px solid #ddd; border-radius: 4px;">
        </div>
        
        <div class="settings-field" style="margin-bottom: 20px;">
            <label style="display: block; margin-bottom: 8px; font-size: 13px; color: #333;">
                ${translations['settings.firstButtonLink'] || 'First button link'}
            </label>
            <input type="text" data-setting="button1Link" 
                   value="${config.button1Link}" placeholder="${translations['placeholders.pasteOrSearch'] || 'Pega un enlace o busca'}"
                   style="width: 100%; padding: 8px; border: 1px solid #ddd; border-radius: 4px;">
        </div>
        
        <div style="font-size: 12px; color: #666; margin-bottom: 20px;">
            ${translations['notes.emptyButtonLabels'] || 'Leave button labels empty to make the whole image a link'}
        </div>
        
        <div class="settings-field" style="margin-bottom: 20px;">
            <label style="display: block; margin-bottom: 8px; font-size: 13px; color: #333;">
                ${translations['settings.firstButtonStyle'] || 'First button style'}
            </label>
            <div style="display: flex; gap: 4px;">
                <button class="button-group-item ${config.button1Style === 'solid' ? 'active' : ''}" 
                        data-setting="button1Style" data-value="solid"
                        style="flex: 1; padding: 8px; background: ${config.button1Style === 'solid' ? '#2962ff' : '#fff'}; 
                               color: ${config.button1Style === 'solid' ? '#fff' : '#333'}; 
                               border: 1px solid ${config.button1Style === 'solid' ? '#2962ff' : '#ddd'}; 
                               border-radius: 4px 0 0 4px; cursor: pointer;">
                    ${translations['buttonStyle.solid'] || 'Solid'}
                </button>
                <button class="button-group-item ${config.button1Style === 'outline' ? 'active' : ''}" 
                        data-setting="button1Style" data-value="outline"
                        style="flex: 1; padding: 8px; background: ${config.button1Style === 'outline' ? '#2962ff' : '#fff'}; 
                               color: ${config.button1Style === 'outline' ? '#fff' : '#333'}; 
                               border: 1px solid ${config.button1Style === 'outline' ? '#2962ff' : '#ddd'}; 
                               border-left: none; cursor: pointer;">
                    ${translations['buttonStyle.outline'] || 'Outline'}
                </button>
                <button class="button-group-item ${config.button1Style === 'text' ? 'active' : ''}" 
                        data-setting="button1Style" data-value="text"
                        style="flex: 1; padding: 8px; background: ${config.button1Style === 'text' ? '#2962ff' : '#fff'}; 
                               color: ${config.button1Style === 'text' ? '#fff' : '#333'}; 
                               border: 1px solid ${config.button1Style === 'text' ? '#2962ff' : '#ddd'}; 
                               border-left: none; border-radius: 0 4px 4px 0; cursor: pointer;">
                    ${translations['buttonStyle.text'] || 'Text'}
                </button>
            </div>
        </div>
        
        <!-- Second button -->
        <div class="settings-field" style="margin-bottom: 20px;">
            <label style="display: block; margin-bottom: 8px; font-size: 13px; color: #333;">
                ${translations['settings.secondButtonLabel'] || 'Second button label'}
            </label>
            <input type="text" data-setting="button2Label" 
                   value="${config.button2Label}" placeholder="${translations['placeholders.buttonLabel'] || 'Button label'}"
                   style="width: 100%; padding: 8px; border: 1px solid #ddd; border-radius: 4px;">
        </div>
        
        <div class="settings-field" style="margin-bottom: 20px;">
            <label style="display: block; margin-bottom: 8px; font-size: 13px; color: #333;">
                ${translations['settings.secondButtonLink'] || 'Second button link'}
            </label>
            <input type="text" data-setting="button2Link" 
                   value="${config.button2Link}" placeholder="${translations['placeholders.pasteOrSearch'] || 'Pega un enlace o busca'}"
                   style="width: 100%; padding: 8px; border: 1px solid #ddd; border-radius: 4px;">
        </div>
        
        <div class="settings-field" style="margin-bottom: 20px;">
            <label style="display: block; margin-bottom: 8px; font-size: 13px; color: #333;">
                ${translations['settings.secondButtonStyle'] || 'Second button style'}
            </label>
            <div style="display: flex; gap: 4px;">
                <button class="button-group-item ${config.button2Style === 'solid' ? 'active' : ''}" 
                        data-setting="button2Style" data-value="solid"
                        style="flex: 1; padding: 8px; background: ${config.button2Style === 'solid' ? '#2962ff' : '#fff'}; 
                               color: ${config.button2Style === 'solid' ? '#fff' : '#333'}; 
                               border: 1px solid ${config.button2Style === 'solid' ? '#2962ff' : '#ddd'}; 
                               border-radius: 4px 0 0 4px; cursor: pointer;">
                    ${translations['buttonStyle.solid'] || 'Solid'}
                </button>
                <button class="button-group-item ${config.button2Style === 'outline' ? 'active' : ''}" 
                        data-setting="button2Style" data-value="outline"
                        style="flex: 1; padding: 8px; background: ${config.button2Style === 'outline' ? '#2962ff' : '#fff'}; 
                               color: ${config.button2Style === 'outline' ? '#fff' : '#333'}; 
                               border: 1px solid ${config.button2Style === 'outline' ? '#2962ff' : '#ddd'}; 
                               border-left: none; cursor: pointer;">
                    ${translations['buttonStyle.outline'] || 'Outline'}
                </button>
                <button class="button-group-item ${config.button2Style === 'text' ? 'active' : ''}" 
                        data-setting="button2Style" data-value="text"
                        style="flex: 1; padding: 8px; background: ${config.button2Style === 'text' ? '#2962ff' : '#fff'}; 
                               color: ${config.button2Style === 'text' ? '#fff' : '#333'}; 
                               border: 1px solid ${config.button2Style === 'text' ? '#2962ff' : '#ddd'}; 
                               border-left: none; border-radius: 0 4px 4px 0; cursor: pointer;">
                    ${translations['buttonStyle.text'] || 'Text'}
                </button>
            </div>
        </div>
        
        <!-- Separator -->
        <div style="height: 1px; background: #e3e3e3; margin: 24px 0;"></div>
    `;
};

// Padding settings
window.WebsiteBuilderModules.ImageBanner.renderPaddingSettings = function(config) {
    const translations = window.translations[window.currentLanguage] || {};
    
    return `
        <!-- Paddings section -->
        <h4 style="font-size: 13px; font-weight: 500; margin-bottom: 12px; color: #5c5e60;">${translations['settings.paddings'] || 'Paddings'}</h4>
        
        <!-- Add side paddings -->
        <div class="settings-field" style="margin-bottom: 16px;">
            <label class="toggle-field" style="display: flex; align-items: center; justify-content: space-between;">
                <span style="font-size: 13px; color: #202223;">${translations['settings.addSidePaddings'] || 'Add side paddings'}</span>
                <input type="checkbox" id="image-banner-side-paddings-toggle" class="shopify-toggle" data-setting="addSidePaddings" ${config.addSidePaddings ? 'checked' : ''}>
                <label for="image-banner-side-paddings-toggle" class="toggle-slider"></label>
            </label>
        </div>
        
        <!-- Top padding -->
        <div class="settings-field" style="margin-bottom: 20px;">
            <label style="display: block; margin-bottom: 8px; font-size: 13px; color: #333;">
                ${translations['settings.topPadding'] || 'Top padding'}
            </label>
            <div style="display: flex; align-items: center; gap: 12px;">
                <input type="range" min="0" max="100" step="4" value="${config.topPadding}" 
                       data-setting="topPadding" 
                       style="flex: 1; height: 4px;">
                <span style="min-width: 45px; font-size: 13px; color: #666; text-align: right;">${config.topPadding}px</span>
            </div>
        </div>
        
        <!-- Bottom padding -->
        <div class="settings-field" style="margin-bottom: 20px;">
            <label style="display: block; margin-bottom: 8px; font-size: 13px; color: #333;">
                ${translations['settings.bottomPadding'] || 'Bottom padding'}
            </label>
            <div style="display: flex; align-items: center; gap: 12px;">
                <input type="range" min="0" max="100" step="4" value="${config.bottomPadding}" 
                       data-setting="bottomPadding" 
                       style="flex: 1; height: 4px;">
                <span style="min-width: 45px; font-size: 13px; color: #666; text-align: right;">${config.bottomPadding}px</span>
            </div>
        </div>
        
        <!-- Container top padding -->
        <div class="settings-field" style="margin-bottom: 20px;">
            <label style="display: block; margin-bottom: 8px; font-size: 13px; color: #333;">
                ${translations['settings.containerTopPadding'] || 'Container top padding'}
            </label>
            <div style="display: flex; align-items: center; gap: 12px;">
                <input type="range" min="1" max="100" step="1" value="${config.containerTopPadding || 60}" 
                       data-setting="containerTopPadding" 
                       style="flex: 1; height: 4px;">
                <span style="min-width: 45px; font-size: 13px; color: #666; text-align: right;">${config.containerTopPadding || 60}px</span>
            </div>
        </div>
        
        <!-- Container bottom padding -->
        <div class="settings-field" style="margin-bottom: 20px;">
            <label style="display: block; margin-bottom: 8px; font-size: 13px; color: #333;">
                ${translations['settings.containerBottomPadding'] || 'Container bottom padding'}
            </label>
            <div style="display: flex; align-items: center; gap: 12px;">
                <input type="range" min="1" max="100" step="1" value="${config.containerBottomPadding || 60}" 
                       data-setting="containerBottomPadding" 
                       style="flex: 1; height: 4px;">
                <span style="min-width: 45px; font-size: 13px; color: #666; text-align: right;">${config.containerBottomPadding || 60}px</span>
            </div>
        </div>
    `;
};