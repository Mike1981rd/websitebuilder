// Testimonials Module for Website Builder
window.WebsiteBuilderModules = window.WebsiteBuilderModules || {};
window.WebsiteBuilderModules.Testimonials = {
    
    // Render testimonials section in preview
    render: function(config) {
        console.log('[TESTIMONIALS] Render called with config:', config);
        
        if (!config || config.isHidden) {
            console.log('[TESTIMONIALS] Not rendering - config is null or isHidden is true');
            return '';
        }
        
        console.log('[TESTIMONIALS] Rendering testimonials section');
        
        // Show the preview image initially
        const html = `
            <div class="section-wrapper testimonials-section" data-section-id="testimonials" style="padding: 40px 0; background: #ffffff;">
                <div class="section-header-tag">
                    <span class="material-symbols-outlined" style="font-size: 16px;">rate_review</span>
                    ${window.translations && window.translations[window.currentLanguage] ? 
                        (window.translations[window.currentLanguage]['sections.testimonials'] || 'Testimonials') : 
                        'Testimonials'}
                </div>
                <div class="container" style="max-width: 1200px; margin: 0 auto; padding: 0 20px;">
                    <div style="text-align: center;">
                        <img src="/TestImages/testimonialstructure.png?v=${Date.now()}" alt="Testimonials Preview" style="max-width: 100%; height: auto;">
                    </div>
                </div>
            </div>
        `;
        
        console.log('[TESTIMONIALS] Returning HTML:', html);
        return html;
    },
    
    // Render settings panel
    renderSettings: function(config) {
        console.log('[TESTIMONIALS] Rendering settings with config:', config);
        
        // Initialize if config is null/undefined
        if (!config) {
            console.log('[TESTIMONIALS] Config is null/undefined, using defaults');
        }
        
        const configData = config || {
            colorScheme: 'scheme3',
            colorBackground: false,
            colorTestimonials: false,
            width: 'page',
            desktopLayout: 'bottom-carousel',
            mobileLayout: 'slideshow',
            desktopCardsPerRow: 2,
            desktopSpaceBetweenCards: 16,
            desktopContentAlignment: 'left',
            mobileContentAlignment: 'left',
            showRating: true,
            ratingStarsColor: '#F49A13',
            subheading: 'TESTIMONIALS',
            heading: 'Customer stories',
            body: 'Show customer reviews: tweets, blog posts, or interviews. Invite customers to share their impressions of your products.',
            headingSize: 'heading3',
            bodySize: 'body3',
            linkLabel: '',
            linkUrl: '',
            backgroundImage: null,
            overlayOpacity: 20,
            imageSize: 100,
            autoplayMode: 'none',
            autoplaySpeed: 3,
            addSidePaddings: true,
            topPadding: 96,
            bottomPadding: 30,
            testimonials: {},
            testimonialsOrder: []
        };
        
        // Merge with existing config
        if (config) {
            Object.assign(configData, config);
        }
        
        return `
            <div style="display: flex; flex-direction: column; height: 100%; position: relative; overflow: hidden;">
                <div class="sidebar-view-header" style="position: relative; z-index: 10;">
                    <button class="back-to-sections-btn">
                        <i class="material-icons">arrow_back</i>
                    </button>
                    <h3 data-i18n="testimonials.settings.title">Testimonials</h3>
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
                    <!-- Color scheme -->
                    <div class="settings-field">
                        <label data-i18n="testimonials.colorScheme">Color scheme</label>
                        <select class="shopify-select" id="testimonials-color-scheme">
                            <option value="scheme1" ${configData.colorScheme === 'scheme1' ? 'selected' : ''}>Scheme 1</option>
                            <option value="scheme2" ${configData.colorScheme === 'scheme2' ? 'selected' : ''}>Scheme 2</option>
                            <option value="scheme3" ${configData.colorScheme === 'scheme3' ? 'selected' : ''}>Scheme 3</option>
                            <option value="scheme4" ${configData.colorScheme === 'scheme4' ? 'selected' : ''}>Scheme 4</option>
                            <option value="scheme5" ${configData.colorScheme === 'scheme5' ? 'selected' : ''}>Scheme 5</option>
                        </select>
                        <a href="#" class="settings-link" data-i18n="common.learnAboutColorSchemes">Learn about color schemes</a>
                    </div>
                    
                    <!-- Color background -->
                    <div class="settings-field">
                        <label class="toggle-field">
                            <span data-i18n="testimonials.colorBackground">Color background</span>
                            <input type="checkbox" class="shopify-toggle" id="testimonials-color-background" ${configData.colorBackground ? 'checked' : ''}>
                            <label for="testimonials-color-background" class="toggle-slider"></label>
                        </label>
                    </div>
                    
                    <!-- Color testimonials -->
                    <div class="settings-field">
                        <label class="toggle-field">
                            <span data-i18n="testimonials.colorTestimonials">Color testimonials</span>
                            <input type="checkbox" class="shopify-toggle" id="testimonials-color-testimonials" ${configData.colorTestimonials ? 'checked' : ''}>
                            <label for="testimonials-color-testimonials" class="toggle-slider"></label>
                        </label>
                    </div>
                    
                    <!-- Width -->
                    <div class="settings-field">
                        <label data-i18n="testimonials.width">Width</label>
                        <select class="shopify-select" id="testimonials-width">
                            <option value="page" ${configData.width === 'page' ? 'selected' : ''}>Page</option>
                            <option value="container" ${configData.width === 'container' ? 'selected' : ''}>Container</option>
                            <option value="full" ${configData.width === 'full' ? 'selected' : ''}>Full width</option>
                        </select>
                    </div>
                    
                    <div class="settings-divider"></div>
                    
                    <!-- Testimonials section -->
                    <h4 data-i18n="testimonials.testimonialsTitle" style="margin-bottom: 15px;">Testimonials</h4>
                    
                    <!-- Desktop layout -->
                    <div class="settings-field">
                        <label data-i18n="testimonials.desktopLayout">Desktop layout</label>
                        <select class="shopify-select" id="testimonials-desktop-layout">
                            <option value="bottom-carousel" ${configData.desktopLayout === 'bottom-carousel' ? 'selected' : ''}>Bottom - Carousel</option>
                            <option value="slideshow" ${configData.desktopLayout === 'slideshow' ? 'selected' : ''}>Slideshow</option>
                        </select>
                    </div>
                    
                    <!-- Mobile layout -->
                    <div class="settings-field">
                        <label data-i18n="testimonials.mobileLayout">Mobile layout</label>
                        <select class="shopify-select" id="testimonials-mobile-layout">
                            <option value="slideshow" ${configData.mobileLayout === 'slideshow' ? 'selected' : ''}>Slideshow</option>
                        </select>
                    </div>
                    
                    <!-- Desktop cards per row -->
                    <div class="settings-field">
                        <label data-i18n="testimonials.desktopCardsPerRow">Desktop cards per row</label>
                        <div class="range-with-inputs">
                            <input type="range" class="shopify-range" id="testimonials-desktop-cards" min="1" max="4" value="${configData.desktopCardsPerRow}">
                            <div class="range-inputs">
                                <input type="number" class="shopify-number-input" value="${configData.desktopCardsPerRow}" min="1" max="4">
                            </div>
                        </div>
                    </div>
                    
                    <!-- Desktop space between cards -->
                    <div class="settings-field">
                        <label data-i18n="testimonials.desktopSpaceBetweenCards">Desktop space between cards</label>
                        <div class="range-with-inputs">
                            <input type="range" class="shopify-range" id="testimonials-desktop-space" min="0" max="32" value="${configData.desktopSpaceBetweenCards}">
                            <div class="range-inputs">
                                <input type="number" class="shopify-number-input" value="${configData.desktopSpaceBetweenCards}" min="0" max="32">
                                <span class="unit">px</span>
                            </div>
                        </div>
                    </div>
                    
                    <!-- Desktop content alignment -->
                    <div class="settings-field">
                        <label data-i18n="testimonials.desktopContentAlignment">Desktop content alignment</label>
                        <div class="button-group">
                            <button class="alignment-btn ${configData.desktopContentAlignment === 'left' ? 'active' : ''}" data-value="left" data-type="desktop">
                                <span data-i18n="common.left">Left</span>
                            </button>
                            <button class="alignment-btn ${configData.desktopContentAlignment === 'center' ? 'active' : ''}" data-value="center" data-type="desktop">
                                <span data-i18n="common.center">Center</span>
                            </button>
                        </div>
                    </div>
                    
                    <!-- Mobile content alignment -->
                    <div class="settings-field">
                        <label data-i18n="testimonials.mobileContentAlignment">Mobile content alignment</label>
                        <div class="button-group">
                            <button class="alignment-btn ${configData.mobileContentAlignment === 'left' ? 'active' : ''}" data-value="left" data-type="mobile">
                                <span data-i18n="common.left">Left</span>
                            </button>
                            <button class="alignment-btn ${configData.mobileContentAlignment === 'center' ? 'active' : ''}" data-value="center" data-type="mobile">
                                <span data-i18n="common.center">Center</span>
                            </button>
                        </div>
                    </div>
                    
                    <!-- Show rating -->
                    <div class="settings-field">
                        <label class="toggle-field">
                            <span data-i18n="testimonials.showRating">Show rating</span>
                            <input type="checkbox" class="shopify-toggle" id="testimonials-show-rating" ${configData.showRating ? 'checked' : ''}>
                            <label for="testimonials-show-rating" class="toggle-slider"></label>
                        </label>
                    </div>
                    
                    <!-- Rating stars color -->
                    <div class="settings-field" id="rating-stars-field" style="${configData.showRating ? '' : 'display: none;'}">
                        <label data-i18n="testimonials.ratingStars">Rating stars</label>
                        <div class="color-picker-wrapper">
                            <input type="color" id="testimonials-rating-color" value="${configData.ratingStarsColor}" class="color-picker-input">
                            <input type="text" value="${configData.ratingStarsColor}" class="color-text-input shopify-input" placeholder="#000000">
                        </div>
                    </div>
                    
                    <div class="settings-divider"></div>
                    
                    <!-- Content section -->
                    <h4 data-i18n="testimonials.content" style="margin-bottom: 15px;">Content</h4>
                    
                    <!-- Subheading -->
                    <div class="settings-field">
                        <label data-i18n="testimonials.subheading">Subheading</label>
                        <input type="text" class="shopify-input" id="testimonials-subheading" value="${configData.subheading || ''}" placeholder="TESTIMONIALS">
                    </div>
                    
                    <!-- Heading -->
                    <div class="settings-field">
                        <label data-i18n="testimonials.heading">Heading</label>
                        <input type="text" class="shopify-input" id="testimonials-heading" value="${configData.heading || ''}" placeholder="Customer stories">
                    </div>
                    
                    <!-- Body (Rich text) -->
                    <div class="settings-field">
                        <label data-i18n="testimonials.body">Body</label>
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
                        <div contenteditable="true" class="rich-text-editor shopify-input" id="testimonials-body" style="min-height: 100px; padding: 10px;">${configData.body || ''}</div>
                    </div>
                    
                    <!-- Heading size -->
                    <div class="settings-field">
                        <label data-i18n="testimonials.headingSize">Heading size</label>
                        <select class="shopify-select" id="testimonials-heading-size">
                            <option value="heading1" ${configData.headingSize === 'heading1' ? 'selected' : ''}>Heading 1</option>
                            <option value="heading2" ${configData.headingSize === 'heading2' ? 'selected' : ''}>Heading 2</option>
                            <option value="heading3" ${configData.headingSize === 'heading3' ? 'selected' : ''}>Heading 3</option>
                            <option value="heading4" ${configData.headingSize === 'heading4' ? 'selected' : ''}>Heading 4</option>
                        </select>
                    </div>
                    
                    <!-- Body size -->
                    <div class="settings-field">
                        <label data-i18n="testimonials.bodySize">Body size</label>
                        <select class="shopify-select" id="testimonials-body-size">
                            <option value="body1" ${configData.bodySize === 'body1' ? 'selected' : ''}>Body 1</option>
                            <option value="body2" ${configData.bodySize === 'body2' ? 'selected' : ''}>Body 2</option>
                            <option value="body3" ${configData.bodySize === 'body3' ? 'selected' : ''}>Body 3</option>
                            <option value="body4" ${configData.bodySize === 'body4' ? 'selected' : ''}>Body 4</option>
                        </select>
                        <p class="help-text" data-i18n="testimonials.bodySizeHelp">For 'Paragraph' body text formatting</p>
                    </div>
                    
                    <!-- Link label -->
                    <div class="settings-field">
                        <label data-i18n="testimonials.linkLabel">Link label</label>
                        <input type="text" class="shopify-input" id="testimonials-link-label" value="${configData.linkLabel || ''}" placeholder="">
                    </div>
                    
                    <!-- Link -->
                    <div class="settings-field">
                        <label data-i18n="testimonials.link">Link</label>
                        <input type="text" class="shopify-input" id="testimonials-link-url" value="${configData.linkUrl || ''}" placeholder="Pega un enlace o busca">
                    </div>
                    
                    <div class="settings-divider"></div>
                    
                    <!-- Background image section -->
                    <h4 data-i18n="testimonials.backgroundImage" style="margin-bottom: 15px;">Background image</h4>
                    
                    <!-- Image selector -->
                    <div class="settings-field">
                        <label data-i18n="testimonials.image">Image</label>
                        <div class="image-selector" id="testimonials-bg-image-selector" style="border: 2px dashed #e0e0e0; border-radius: 4px; padding: 40px; text-align: center; cursor: pointer;">
                            ${configData.backgroundImage ? 
                                `<img src="${configData.backgroundImage}" style="max-width: 100%; height: auto;">` : 
                                `<div>
                                    <button class="shopify-button-secondary">
                                        <span data-i18n="common.selectImage">Seleccionar</span>
                                    </button>
                                    <p class="help-text" style="margin-top: 10px;" data-i18n="common.exploreImages">Explorar imágenes gratuitas</p>
                                </div>`
                            }
                        </div>
                    </div>
                    
                    <!-- Overlay opacity -->
                    <div class="settings-field">
                        <label data-i18n="testimonials.overlayOpacity">Overlay opacity</label>
                        <div class="range-with-inputs">
                            <input type="range" class="shopify-range" id="testimonials-overlay-opacity" min="0" max="100" value="${configData.overlayOpacity}">
                            <div class="range-inputs">
                                <input type="number" class="shopify-number-input" value="${configData.overlayOpacity}" min="0" max="100">
                                <span class="unit">%</span>
                            </div>
                        </div>
                    </div>
                    
                    <!-- Image size -->
                    <div class="settings-field">
                        <label data-i18n="testimonials.imageSize">Image size</label>
                        <div class="range-with-inputs">
                            <input type="range" class="shopify-range" id="testimonials-image-size" min="50" max="200" value="${configData.imageSize}">
                            <div class="range-inputs">
                                <input type="number" class="shopify-number-input" value="${configData.imageSize}" min="50" max="200">
                                <span class="unit">%</span>
                            </div>
                        </div>
                    </div>
                    
                    <div class="settings-divider"></div>
                    
                    <!-- Autoplay section -->
                    <h4 data-i18n="testimonials.autoplay" style="margin-bottom: 15px;">Autoplay</h4>
                    
                    <!-- Autoplay mode -->
                    <div class="settings-field">
                        <label data-i18n="testimonials.autoplayMode">Autoplay mode</label>
                        <select class="shopify-select" id="testimonials-autoplay-mode">
                            <option value="none" ${configData.autoplayMode === 'none' ? 'selected' : ''}>None</option>
                            <option value="seamless" ${configData.autoplayMode === 'seamless' ? 'selected' : ''} data-i18n="testimonials.seamlessCarousel">Seamless is only for 'Carousel' layouts</option>
                        </select>
                    </div>
                    
                    <!-- Autoplay speed -->
                    <div class="settings-field">
                        <label data-i18n="testimonials.autoplaySpeed">Autoplay speed</label>
                        <div class="range-with-inputs">
                            <input type="range" class="shopify-range" id="testimonials-autoplay-speed" min="1" max="10" value="${configData.autoplaySpeed}">
                            <div class="range-inputs">
                                <input type="number" class="shopify-number-input" value="${configData.autoplaySpeed}" min="1" max="10">
                                <span class="unit">s</span>
                            </div>
                        </div>
                    </div>
                    
                    <div class="settings-divider"></div>
                    
                    <!-- Paddings section -->
                    <h4 data-i18n="testimonials.paddings" style="margin-bottom: 15px;">Paddings</h4>
                    
                    <!-- Add side paddings -->
                    <div class="settings-field">
                        <label class="toggle-field">
                            <span data-i18n="testimonials.addSidePaddings">Add side paddings</span>
                            <input type="checkbox" class="shopify-toggle" id="testimonials-side-paddings" ${configData.addSidePaddings ? 'checked' : ''}>
                            <label for="testimonials-side-paddings" class="toggle-slider"></label>
                        </label>
                    </div>
                    
                    <!-- Top padding -->
                    <div class="settings-field">
                        <label data-i18n="testimonials.topPadding">Top padding</label>
                        <div class="range-with-inputs">
                            <input type="range" class="shopify-range" id="testimonials-top-padding" min="0" max="200" value="${configData.topPadding}">
                            <div class="range-inputs">
                                <input type="number" class="shopify-number-input" value="${configData.topPadding}" min="0" max="200">
                                <span class="unit">px</span>
                            </div>
                        </div>
                    </div>
                    
                    <!-- Bottom padding -->
                    <div class="settings-field">
                        <label data-i18n="testimonials.bottomPadding">Bottom padding</label>
                        <div class="range-with-inputs">
                            <input type="range" class="shopify-range" id="testimonials-bottom-padding" min="0" max="200" value="${configData.bottomPadding}">
                            <div class="range-inputs">
                                <input type="number" class="shopify-number-input" value="${configData.bottomPadding}" min="0" max="200">
                                <span class="unit">px</span>
                            </div>
                        </div>
                    </div>
                    
                    <div class="settings-divider"></div>
                    
                    <!-- Testimonials list -->
                    <h4 data-i18n="testimonials.testimonialsListTitle" style="margin-bottom: 15px;">Testimonials</h4>
                    
                    <button class="shopify-button" style="width: 100%; margin-bottom: 20px;" onclick="window.WebsiteBuilderModules.Testimonials.addTestimonial()">
                        <i class="material-icons" style="vertical-align: middle; margin-right: 5px;">add</i>
                        <span data-i18n="testimonials.add.button">Add testimonial</span>
                    </button>
                    
                    ${this.renderTestimonialsList(configData.testimonials, configData.testimonialsOrder)}
                </div>
            </div>
        `;
    },
    
    // Render testimonials list
    renderTestimonialsList: function(testimonials, testimonialsOrder) {
        if (!testimonialsOrder || testimonialsOrder.length === 0) {
            return `
                <div style="text-align: center; padding: 40px; color: #666;">
                    <i class="material-icons" style="font-size: 48px; color: #ddd;">rate_review</i>
                    <p data-i18n="testimonials.empty.message">No testimonials yet. Click "Add testimonial" to start.</p>
                </div>
            `;
        }
        
        let html = '<div class="testimonials-list" id="testimonials-list" style="margin-top: 20px;">';
        testimonialsOrder.forEach((testimonialId, index) => {
            const testimonial = testimonials[testimonialId];
            if (testimonial) {
                html += `
                    <div class="testimonial-item-settings collapsible-parent" data-testimonial-id="${testimonialId}" style="margin-bottom: 20px; border: 1px solid #e3e3e3; border-radius: 8px;">
                        <div class="collapsible-header" data-target="testimonial-content-${testimonialId}" 
                             style="padding: 15px; cursor: pointer; display: flex; align-items: center; justify-content: space-between; background: #fafafa;">
                            <div style="display: flex; align-items: center; gap: 10px;">
                                <span class="drag-handle material-icons" style="cursor: move; color: #8c9196;">drag_indicator</span>
                                <span class="material-icons collapse-icon">expand_more</span>
                                <span>${testimonial.author || `Testimonial ${index + 1}`}</span>
                            </div>
                            <div style="display: flex; gap: 10px;">
                                <button class="action-icon visibility-toggle ${testimonial.isHidden ? 'is-hidden' : ''}" 
                                        data-element-id="${testimonialId}"
                                        data-element-type="child"
                                        title="Toggle visibility">
                                    <i class="material-icons icon-visible">visibility</i>
                                    <i class="material-icons icon-hidden">visibility_off</i>
                                </button>
                                <button class="action-icon delete-testimonial" data-testimonial-id="${testimonialId}" style="background: none; border: none; cursor: pointer;">
                                    <span class="material-icons" style="color: #dc3545;">delete</span>
                                </button>
                            </div>
                        </div>
                        
                        <div id="testimonial-content-${testimonialId}" class="collapsible-content" style="display: none; padding: 15px; border-top: 1px solid #e3e3e3;">
                            ${this.renderTestimonialSettings(testimonial)}
                        </div>
                    </div>
                `;
            }
        });
        html += '</div>';
        return html;
    },
    
    // Render individual testimonial settings
    renderTestimonialSettings: function(testimonial) {
        return `
            <div class="testimonial-settings">
                <!-- Author -->
                <div class="settings-field">
                    <label data-i18n="testimonials.author">Author</label>
                    <input type="text" class="shopify-input testimonial-author" value="${testimonial.author || ''}" placeholder="Customer name">
                </div>
                
                <!-- Content -->
                <div class="settings-field">
                    <label data-i18n="testimonials.testimonialContent">Content</label>
                    <textarea class="shopify-input testimonial-content" rows="4" placeholder="Customer testimonial...">${testimonial.content || ''}</textarea>
                </div>
                
                <!-- Rating -->
                <div class="settings-field">
                    <label data-i18n="testimonials.rating">Rating</label>
                    <div class="star-rating-selector">
                        ${[1,2,3,4,5].map(star => `
                            <i class="material-icons star-icon ${star <= (testimonial.rating || 5) ? 'filled' : ''}" data-rating="${star}">
                                ${star <= (testimonial.rating || 5) ? 'star' : 'star_border'}
                            </i>
                        `).join('')}
                    </div>
                </div>
                
                <!-- Author info -->
                <div class="settings-field">
                    <label data-i18n="testimonials.authorInfo">Author info</label>
                    <input type="text" class="shopify-input testimonial-author-info" value="${testimonial.authorInfo || ''}" placeholder="e.g., CEO at Company">
                </div>
                
                <!-- Avatar -->
                <div class="settings-field">
                    <label data-i18n="testimonials.avatar">Avatar</label>
                    <div class="image-selector testimonial-avatar-selector" style="border: 2px dashed #e0e0e0; border-radius: 4px; padding: 20px; text-align: center; cursor: pointer;">
                        ${testimonial.avatar ? 
                            `<img src="${testimonial.avatar}" style="max-width: 100px; height: auto; border-radius: 50%;">` : 
                            `<button class="shopify-button-secondary">
                                <span data-i18n="common.selectImage">Select image</span>
                            </button>`
                        }
                    </div>
                </div>
            </div>
        `;
    },
    
    // Attach event listeners after rendering settings
    attachEventListeners: function() {
        console.log('[TESTIMONIALS] Attaching event listeners');
        
        // Helper function to update config
        const updateConfig = (key, value) => {
            if (!window.currentSectionsConfig.testimonials) {
                window.currentSectionsConfig.testimonials = {};
            }
            window.currentSectionsConfig.testimonials[key] = value;
            
            window.setHasPendingPageStructureChanges(true);
            window.updateSaveButtonState();
            window.renderPreview();
        };
        
        // Back button
        $(document).off('click.testimonials-back').on('click.testimonials-back', '.back-to-sections-btn', function(e) {
            e.preventDefault();
            e.stopPropagation();
            window.switchSidebarView('blockList', window.getUpdatedPageData());
        });
        
        // Section menu
        $(document).off('click.testimonials-menu').on('click.testimonials-menu', '.section-menu', function(e) {
            e.preventDefault();
            e.stopPropagation();
            $(this).siblings('.section-menu-dropdown').toggleClass('active');
        });
        
        // Close menu when clicking outside
        $(document).off('click.testimonials-menu-close').on('click.testimonials-menu-close', function(e) {
            if (!$(e.target).closest('.section-menu-wrapper').length) {
                $('.section-menu-dropdown').removeClass('active');
            }
        });
        
        // Color scheme
        $('#testimonials-color-scheme').off('change').on('change', function() {
            updateConfig('colorScheme', $(this).val());
        });
        
        // Color background toggle
        $('#testimonials-color-background').off('change').on('change', function() {
            updateConfig('colorBackground', $(this).is(':checked'));
        });
        
        // Color testimonials toggle
        $('#testimonials-color-testimonials').off('change').on('change', function() {
            updateConfig('colorTestimonials', $(this).is(':checked'));
        });
        
        // Width
        $('#testimonials-width').off('change').on('change', function() {
            updateConfig('width', $(this).val());
        });
        
        // Desktop layout
        $('#testimonials-desktop-layout').off('change').on('change', function() {
            updateConfig('desktopLayout', $(this).val());
        });
        
        // Mobile layout
        $('#testimonials-mobile-layout').off('change').on('change', function() {
            updateConfig('mobileLayout', $(this).val());
        });
        
        // Desktop cards per row
        $('#testimonials-desktop-cards').off('input').on('input', function() {
            const value = $(this).val();
            $(this).siblings('.range-inputs').find('input[type="number"]').val(value);
            updateConfig('desktopCardsPerRow', parseInt(value));
        });
        
        $('#testimonials-desktop-cards').siblings('.range-inputs').find('input[type="number"]').off('change').on('change', function() {
            const value = Math.max(1, Math.min(4, parseInt($(this).val()) || 2));
            $(this).val(value);
            $('#testimonials-desktop-cards').val(value);
            updateConfig('desktopCardsPerRow', value);
        });
        
        // Desktop space between cards
        $('#testimonials-desktop-space').off('input').on('input', function() {
            const value = $(this).val();
            $(this).siblings('.range-inputs').find('input[type="number"]').val(value);
            updateConfig('desktopSpaceBetweenCards', parseInt(value));
        });
        
        $('#testimonials-desktop-space').siblings('.range-inputs').find('input[type="number"]').off('change').on('change', function() {
            const value = Math.max(0, Math.min(32, parseInt($(this).val()) || 16));
            $(this).val(value);
            $('#testimonials-desktop-space').val(value);
            updateConfig('desktopSpaceBetweenCards', value);
        });
        
        // Desktop content alignment
        $('.alignment-btn[data-type="desktop"]').off('click').on('click', function() {
            $('.alignment-btn[data-type="desktop"]').removeClass('active');
            $(this).addClass('active');
            updateConfig('desktopContentAlignment', $(this).data('value'));
        });
        
        // Mobile content alignment
        $('.alignment-btn[data-type="mobile"]').off('click').on('click', function() {
            $('.alignment-btn[data-type="mobile"]').removeClass('active');
            $(this).addClass('active');
            updateConfig('mobileContentAlignment', $(this).data('value'));
        });
        
        // Show rating toggle
        $('#testimonials-show-rating').off('change').on('change', function() {
            const isChecked = $(this).is(':checked');
            updateConfig('showRating', isChecked);
            $('#rating-stars-field').toggle(isChecked);
        });
        
        // Rating stars color
        $('#testimonials-rating-color').off('input').on('input', function() {
            const value = $(this).val();
            $(this).siblings('.color-text-input').val(value);
            updateConfig('ratingStarsColor', value);
        });
        
        $('#testimonials-rating-color').siblings('.color-text-input').off('change').on('change', function() {
            let value = $(this).val();
            if (!value.startsWith('#')) value = '#' + value;
            if (/^#[0-9A-F]{6}$/i.test(value)) {
                $(this).val(value);
                $('#testimonials-rating-color').val(value);
                updateConfig('ratingStarsColor', value);
            }
        });
        
        // Subheading
        $('#testimonials-subheading').off('input').on('input', function() {
            updateConfig('subheading', $(this).val());
        });
        
        // Heading
        $('#testimonials-heading').off('input').on('input', function() {
            updateConfig('heading', $(this).val());
        });
        
        // Body (Rich text)
        $('#testimonials-body').off('input').on('input', function() {
            updateConfig('body', $(this).html());
        });
        
        // Rich text toolbar
        $('.toolbar-btn').off('click').on('click', function(e) {
            e.preventDefault();
            const command = $(this).data('command');
            const value = $(this).data('value') || null;
            
            if (command === 'createLink') {
                const url = prompt('Enter URL:');
                if (url) document.execCommand(command, false, url);
            } else {
                document.execCommand(command, false, value);
            }
            
            $('#testimonials-body').trigger('input');
        });
        
        // Heading size
        $('#testimonials-heading-size').off('change').on('change', function() {
            updateConfig('headingSize', $(this).val());
        });
        
        // Body size
        $('#testimonials-body-size').off('change').on('change', function() {
            updateConfig('bodySize', $(this).val());
        });
        
        // Link label
        $('#testimonials-link-label').off('input').on('input', function() {
            updateConfig('linkLabel', $(this).val());
        });
        
        // Link URL
        $('#testimonials-link-url').off('input').on('input', function() {
            updateConfig('linkUrl', $(this).val());
        });
        
        // Background image selector
        $('#testimonials-bg-image-selector').off('click').on('click', function() {
            // TODO: Implement image selector
            alert('Image selector will be implemented');
        });
        
        // Overlay opacity
        $('#testimonials-overlay-opacity').off('input').on('input', function() {
            const value = $(this).val();
            $(this).siblings('.range-inputs').find('input[type="number"]').val(value);
            updateConfig('overlayOpacity', parseInt(value));
        });
        
        $('#testimonials-overlay-opacity').siblings('.range-inputs').find('input[type="number"]').off('change').on('change', function() {
            const value = Math.max(0, Math.min(100, parseInt($(this).val()) || 20));
            $(this).val(value);
            $('#testimonials-overlay-opacity').val(value);
            updateConfig('overlayOpacity', value);
        });
        
        // Image size
        $('#testimonials-image-size').off('input').on('input', function() {
            const value = $(this).val();
            $(this).siblings('.range-inputs').find('input[type="number"]').val(value);
            updateConfig('imageSize', parseInt(value));
        });
        
        $('#testimonials-image-size').siblings('.range-inputs').find('input[type="number"]').off('change').on('change', function() {
            const value = Math.max(50, Math.min(200, parseInt($(this).val()) || 100));
            $(this).val(value);
            $('#testimonials-image-size').val(value);
            updateConfig('imageSize', value);
        });
        
        // Autoplay mode
        $('#testimonials-autoplay-mode').off('change').on('change', function() {
            updateConfig('autoplayMode', $(this).val());
        });
        
        // Autoplay speed
        $('#testimonials-autoplay-speed').off('input').on('input', function() {
            const value = $(this).val();
            $(this).siblings('.range-inputs').find('input[type="number"]').val(value);
            updateConfig('autoplaySpeed', parseInt(value));
        });
        
        $('#testimonials-autoplay-speed').siblings('.range-inputs').find('input[type="number"]').off('change').on('change', function() {
            const value = Math.max(1, Math.min(10, parseInt($(this).val()) || 3));
            $(this).val(value);
            $('#testimonials-autoplay-speed').val(value);
            updateConfig('autoplaySpeed', value);
        });
        
        // Add side paddings toggle
        $('#testimonials-side-paddings').off('change').on('change', function() {
            updateConfig('addSidePaddings', $(this).is(':checked'));
        });
        
        // Top padding
        $('#testimonials-top-padding').off('input').on('input', function() {
            const value = $(this).val();
            $(this).siblings('.range-inputs').find('input[type="number"]').val(value);
            updateConfig('topPadding', parseInt(value));
        });
        
        $('#testimonials-top-padding').siblings('.range-inputs').find('input[type="number"]').off('change').on('change', function() {
            const value = Math.max(0, Math.min(200, parseInt($(this).val()) || 96));
            $(this).val(value);
            $('#testimonials-top-padding').val(value);
            updateConfig('topPadding', value);
        });
        
        // Bottom padding
        $('#testimonials-bottom-padding').off('input').on('input', function() {
            const value = $(this).val();
            $(this).siblings('.range-inputs').find('input[type="number"]').val(value);
            updateConfig('bottomPadding', parseInt(value));
        });
        
        $('#testimonials-bottom-padding').siblings('.range-inputs').find('input[type="number"]').off('change').on('change', function() {
            const value = Math.max(0, Math.min(200, parseInt($(this).val()) || 30));
            $(this).val(value);
            $('#testimonials-bottom-padding').val(value);
            updateConfig('bottomPadding', value);
        });
        
        // Collapsible headers for testimonials
        $(document).off('click.testimonials-collapse').on('click.testimonials-collapse', '.collapsible-header', function(e) {
            // Don't collapse if clicking on action buttons
            if ($(e.target).closest('.action-icon').length) return;
            
            const $header = $(this);
            const targetId = $header.data('target');
            const $content = $('#' + targetId);
            const $icon = $header.find('.collapse-icon');
            
            $content.slideToggle(200);
            $icon.text($icon.text() === 'expand_more' ? 'expand_less' : 'expand_more');
        });
        
        // Delete testimonial
        $(document).off('click.testimonials-delete').on('click.testimonials-delete', '.delete-testimonial', function(e) {
            e.preventDefault();
            e.stopPropagation();
            
            const testimonialId = $(this).data('testimonial-id');
            if (confirm('Are you sure you want to delete this testimonial?')) {
                // Remove from data
                if (window.currentSectionsConfig.testimonials.testimonials[testimonialId]) {
                    delete window.currentSectionsConfig.testimonials.testimonials[testimonialId];
                }
                
                // Remove from order
                const index = window.currentSectionsConfig.testimonials.testimonialsOrder.indexOf(testimonialId);
                if (index > -1) {
                    window.currentSectionsConfig.testimonials.testimonialsOrder.splice(index, 1);
                }
                
                // Update UI
                window.setHasPendingPageStructureChanges(true);
                window.updateSaveButtonState();
                window.renderPreview();
                window.switchSidebarView('testimonialsSettings');
            }
        });
        
        // Event listeners for individual testimonial fields
        $(document).off('input.testimonials-fields').on('input.testimonials-fields', '.testimonial-author, .testimonial-content, .testimonial-author-info', function() {
            const $testimonialItem = $(this).closest('.testimonial-item-settings');
            const testimonialId = $testimonialItem.data('testimonial-id');
            
            if (testimonialId && window.currentSectionsConfig.testimonials.testimonials[testimonialId]) {
                const testimonial = window.currentSectionsConfig.testimonials.testimonials[testimonialId];
                
                if ($(this).hasClass('testimonial-author')) {
                    testimonial.author = $(this).val();
                    // Update header text
                    $testimonialItem.find('.collapsible-header span:last').text(testimonial.author || `Testimonial`);
                } else if ($(this).hasClass('testimonial-content')) {
                    testimonial.content = $(this).val();
                } else if ($(this).hasClass('testimonial-author-info')) {
                    testimonial.authorInfo = $(this).val();
                }
                
                window.setHasPendingPageStructureChanges(true);
                window.updateSaveButtonState();
                window.renderPreview();
            }
        });
        
        // Star rating clicks
        $(document).off('click.testimonials-rating').on('click.testimonials-rating', '.star-icon', function() {
            const rating = $(this).data('rating');
            const $testimonialItem = $(this).closest('.testimonial-item-settings');
            const testimonialId = $testimonialItem.data('testimonial-id');
            
            if (testimonialId && window.currentSectionsConfig.testimonials.testimonials[testimonialId]) {
                window.currentSectionsConfig.testimonials.testimonials[testimonialId].rating = rating;
                
                // Update stars UI
                $(this).parent().find('.star-icon').each(function(index) {
                    if (index < rating) {
                        $(this).addClass('filled').text('star');
                    } else {
                        $(this).removeClass('filled').text('star_border');
                    }
                });
                
                window.setHasPendingPageStructureChanges(true);
                window.updateSaveButtonState();
                window.renderPreview();
            }
        });
        
        // Avatar image selector
        $(document).off('click.testimonials-avatar').on('click.testimonials-avatar', '.testimonial-avatar-selector', function() {
            // TODO: Implement image selector
            alert('Avatar image selector will be implemented');
        });
        
        // Initialize drag & drop for testimonials
        // this.initializeTestimonialsSortable(); // Commented out - drag n drop handled by main file
        
        // HANDLER DEL TOGGLE PARA LA SECCIÓN PRINCIPAL (según documentación punto 5.3)
        $(document).on('click', '.visibility-toggle[data-section="testimonials"]', function(e) {
            e.preventDefault();
            e.stopPropagation();
            
            const $button = $(this);
            
            // Prevenir clicks durante transición
            if ($button.data('transitioning')) return;
            $button.data('transitioning', true);
            
            // Toggle estado
            const isCurrentlyHidden = $button.hasClass('is-hidden');
            const newHiddenState = !isCurrentlyHidden;
            
            // SOLUCIÓN CRÍTICA: Limpiar estado completamente
            $button.removeClass('is-hidden');
            if (newHiddenState) {
                $button.addClass('is-hidden');
            }
            
            // SOLUCIÓN CRÍTICA: Remover estilos inline
            $button.find('.icon-visible').removeAttr('style');
            $button.find('.icon-hidden').removeAttr('style');
            
            // Actualizar modelo
            window.currentSectionsConfig.testimonials.isHidden = newHiddenState;
            
            // Actualizar preview inmediatamente
            window.setHasPendingPageStructureChanges(true);
            window.updateSaveButtonState();
            window.renderPreview();
            
            // Liberar flag después de animación
            setTimeout(() => {
                $button.data('transitioning', false);
            }, 300);
        });
        
        // HANDLER PARA ELEMENTOS HIJOS (testimonial items) - según punto 5.3
        $(document).on('click', '.testimonial-item .visibility-toggle[data-element-type="child"], .testimonial-item-settings .visibility-toggle[data-element-type="child"]', function(e) {
            e.preventDefault();
            e.stopPropagation();
            
            const $button = $(this);
            const childId = $button.data('element-id');
            
            if ($button.data('transitioning')) return;
            $button.data('transitioning', true);
            
            const isCurrentlyHidden = $button.hasClass('is-hidden');
            const newHiddenState = !isCurrentlyHidden;
            
            // Limpiar y actualizar estado
            $button.removeClass('is-hidden');
            if (newHiddenState) {
                $button.addClass('is-hidden');
            }
            
            $button.find('.icon-visible').removeAttr('style');
            $button.find('.icon-hidden').removeAttr('style');
            
            // Actualizar modelo del hijo
            if (window.currentSectionsConfig.testimonials && 
                window.currentSectionsConfig.testimonials.testimonials && 
                window.currentSectionsConfig.testimonials.testimonials[childId]) {
                window.currentSectionsConfig.testimonials.testimonials[childId].isHidden = newHiddenState;
            }
            
            window.setHasPendingPageStructureChanges(true);
            window.updateSaveButtonState();
            window.renderPreview();
            
            setTimeout(() => {
                $button.data('transitioning', false);
            }, 300);
        });
        
        // SINCRONIZAR ESTADOS AL RENDERIZAR (según documentación punto 5.4)
        setTimeout(() => {
            // Sincronizar estado de toggles con datos guardados - sección principal
            $('.visibility-toggle[data-section="testimonials"]').each(function() {
                const $button = $(this);
                const savedIsHidden = window.currentSectionsConfig.testimonials?.isHidden || false;
                
                if (savedIsHidden && !$button.hasClass('is-hidden')) {
                    $button.addClass('is-hidden');
                } else if (!savedIsHidden && $button.hasClass('is-hidden')) {
                    $button.removeClass('is-hidden');
                }
                
                // Limpiar estilos inline
                $button.find('.icon-visible').removeAttr('style');
                $button.find('.icon-hidden').removeAttr('style');
            });
            
            // Para testimonial items (usando data-element-type="child") - en ambos lugares
            $('.testimonial-item .visibility-toggle[data-element-type="child"], .testimonial-item-settings .visibility-toggle[data-element-type="child"]').each(function() {
                const $button = $(this);
                const childId = $button.data('element-id');
                const testimonial = window.currentSectionsConfig.testimonials?.testimonials?.[childId];
                
                if (testimonial) {
                    const savedIsHidden = testimonial.isHidden || false;
                    
                    if (savedIsHidden && !$button.hasClass('is-hidden')) {
                        $button.addClass('is-hidden');
                    } else if (!savedIsHidden && $button.hasClass('is-hidden')) {
                        $button.removeClass('is-hidden');
                    }
                    
                    // Limpiar estilos inline
                    $button.find('.icon-visible').removeAttr('style');
                    $button.find('.icon-hidden').removeAttr('style');
                }
            });
        }, 100);
    },
    
    // Drag & drop is handled by the main website-builder.js file
    // to avoid conflicts with the main sortable functionality
    
    // Add new testimonial
    addTestimonial: function() {
        console.log('[TESTIMONIALS] Adding new testimonial');
        
        // Initialize structure if needed
        if (!window.currentSectionsConfig.testimonials) {
            window.currentSectionsConfig.testimonials = {
                isHidden: false,
                testimonials: {},
                testimonialsOrder: []
            };
        }
        
        // Generate unique ID
        const testimonialId = 'testimonial_' + Date.now();
        
        // Create new testimonial
        window.currentSectionsConfig.testimonials.testimonials[testimonialId] = {
            id: testimonialId,
            author: 'New Author',
            content: 'Your testimonial content here...',
            isHidden: false
        };
        
        // Add to order
        window.currentSectionsConfig.testimonials.testimonialsOrder.push(testimonialId);
        
        // Mark as changed and refresh
        window.setHasPendingPageStructureChanges(true);
        window.updateSaveButtonState();
        window.renderPreview();
        
        // Refresh the settings view
        window.switchSidebarView('testimonialsSettings');
    },
    
    // Initialize module
    initialize: function() {
        console.log('[TESTIMONIALS] Module initialized');
        
        // Add translations
        if (!window.translations) window.translations = { es: {}, en: {} };
        if (!window.translations.es.testimonials) window.translations.es.testimonials = {};
        if (!window.translations.en.testimonials) window.translations.en.testimonials = {};
        
        window.translations.es.testimonials = {
            'settings.title': 'Testimonios',
            'add.button': 'Agregar testimonio',
            'empty.message': 'No hay testimonios. Haz clic en "Agregar testimonio" para empezar.',
            'colorScheme': 'Esquema de color',
            'colorBackground': 'Color de fondo',
            'colorTestimonials': 'Color de testimonios',
            'width': 'Ancho',
            'testimonialsTitle': 'Testimonios',
            'desktopLayout': 'Diseño de escritorio',
            'mobileLayout': 'Diseño móvil',
            'desktopCardsPerRow': 'Tarjetas por fila en escritorio',
            'desktopSpaceBetweenCards': 'Espacio entre tarjetas en escritorio',
            'desktopContentAlignment': 'Alineación de contenido en escritorio',
            'mobileContentAlignment': 'Alineación de contenido en móvil',
            'showRating': 'Mostrar calificación',
            'ratingStars': 'Estrellas de calificación',
            'content': 'Contenido',
            'subheading': 'Subtítulo',
            'heading': 'Título',
            'body': 'Cuerpo',
            'headingSize': 'Tamaño del título',
            'bodySize': 'Tamaño del cuerpo',
            'bodySizeHelp': 'Para formato de texto "Párrafo"',
            'linkLabel': 'Etiqueta del enlace',
            'link': 'Enlace',
            'backgroundImage': 'Imagen de fondo',
            'image': 'Imagen',
            'overlayOpacity': 'Opacidad de superposición',
            'imageSize': 'Tamaño de imagen',
            'autoplay': 'Reproducción automática',
            'autoplayMode': 'Modo de reproducción automática',
            'seamlessCarousel': 'Sin interrupciones es solo para diseños "Carrusel"',
            'autoplaySpeed': 'Velocidad de reproducción automática',
            'paddings': 'Rellenos',
            'addSidePaddings': 'Agregar rellenos laterales',
            'topPadding': 'Relleno superior',
            'bottomPadding': 'Relleno inferior',
            'testimonialsListTitle': 'Testimonios',
            'author': 'Autor',
            'testimonialContent': 'Contenido',
            'rating': 'Calificación',
            'authorInfo': 'Información del autor',
            'avatar': 'Avatar'
        };
        
        window.translations.en.testimonials = {
            'settings.title': 'Testimonials',
            'add.button': 'Add testimonial',
            'empty.message': 'No testimonials yet. Click "Add testimonial" to start.',
            'colorScheme': 'Color scheme',
            'colorBackground': 'Color background',
            'colorTestimonials': 'Color testimonials',
            'width': 'Width',
            'testimonialsTitle': 'Testimonials',
            'desktopLayout': 'Desktop layout',
            'mobileLayout': 'Mobile layout',
            'desktopCardsPerRow': 'Desktop cards per row',
            'desktopSpaceBetweenCards': 'Desktop space between cards',
            'desktopContentAlignment': 'Desktop content alignment',
            'mobileContentAlignment': 'Mobile content alignment',
            'showRating': 'Show rating',
            'ratingStars': 'Rating stars',
            'content': 'Content',
            'subheading': 'Subheading',
            'heading': 'Heading',
            'body': 'Body',
            'headingSize': 'Heading size',
            'bodySize': 'Body size',
            'bodySizeHelp': 'For "Paragraph" body text formatting',
            'linkLabel': 'Link label',
            'link': 'Link',
            'backgroundImage': 'Background image',
            'image': 'Image',
            'overlayOpacity': 'Overlay opacity',
            'imageSize': 'Image size',
            'autoplay': 'Autoplay',
            'autoplayMode': 'Autoplay mode',
            'seamlessCarousel': 'Seamless is only for "Carousel" layouts',
            'autoplaySpeed': 'Autoplay speed',
            'paddings': 'Paddings',
            'addSidePaddings': 'Add side paddings',
            'topPadding': 'Top padding',
            'bottomPadding': 'Bottom padding',
            'testimonialsListTitle': 'Testimonials',
            'author': 'Author',
            'testimonialContent': 'Content',
            'rating': 'Rating',
            'authorInfo': 'Author info',
            'avatar': 'Avatar'
        };
    }
};

// Initialize on load
$(document).ready(function() {
    if (window.WebsiteBuilderModules.Testimonials.initialize) {
        window.WebsiteBuilderModules.Testimonials.initialize();
    }
});