// Testimonials Module for Website Builder
window.WebsiteBuilderModules = window.WebsiteBuilderModules || {};

// Helper functions for size calculations
function getHeadingSize(level) {
    const sizes = ['48px', '42px', '36px', '32px', '28px', '24px', '20px', '18px'];
    return sizes[level] || '32px';
}

function getBodySize(level) {
    const sizes = ['20px', '18px', '16px', '14px', '13px', '12px', '11px'];
    return sizes[level] || '16px';
}

window.WebsiteBuilderModules.Testimonials = {
    
    // Render testimonials section in preview
    render: function(config) {
        console.log('[TESTIMONIALS] Render called with config:', config);
        
        if (!config || config.isHidden) {
            console.log('[TESTIMONIALS] Not rendering - config is null or isHidden is true');
            return '';
        }
        
        // Get color scheme values
        const schemeColors = window.getColorSchemeValues ? window.getColorSchemeValues(config.colorScheme || 'scheme3') : {
            background: '#ffffff',
            text: '#333333',
            foreground: '#f8f8f8',
            border: '#e0e0e0'
        };
        
        // Get typography
        const headingTypography = window.currentGlobalThemeSettings?.typography?.heading || {};
        const bodyTypography = window.currentGlobalThemeSettings?.typography?.body || {};
        
        const headingFont = window.getFontNameFromValueSafe ? 
            window.getFontNameFromValueSafe(headingTypography.font || 'helvetica') : 
            'Helvetica';
        const bodyFont = window.getFontNameFromValueSafe ? 
            window.getFontNameFromValueSafe(bodyTypography.font || 'roboto') : 
            'Roboto';
        
        // Calculate paddings
        const sidePadding = config.addSidePaddings ? '20px' : '0';
        const topPadding = config.topPadding || 96;
        const bottomPadding = config.bottomPadding || 30;
        
        // Build styles based on width
        let containerStyles = 'margin: 0 auto;';
        if (config.width === 'page') {
            containerStyles += 'max-width: 1200px;';
        } else if (config.width === 'container') {
            containerStyles += 'max-width: 1000px;';
        } else {
            containerStyles += 'max-width: 100%;';
        }
        
        // Background styles
        let sectionStyles = `padding: ${topPadding}px ${sidePadding} ${bottomPadding}px;`;
        if (config.colorBackground) {
            sectionStyles += `background-color: ${schemeColors.background};`;
        }
        
        // Render testimonials
        let testimonialsHtml = '';
        if (config.testimonials && config.testimonialsOrder && config.testimonialsOrder.length > 0) {
            const visibleTestimonials = config.testimonialsOrder.filter(id => 
                config.testimonials[id] && !config.testimonials[id].isHidden
            );
            
            if (visibleTestimonials.length > 0) {
                // Desktop layout styles
                const cardsPerRow = config.desktopCardsPerRow || 2;
                const spaceBetween = config.desktopSpaceBetweenCards || 16;
                const gridStyles = config.desktopLayout === 'bottom-carousel' ? 
                    `display: grid; grid-template-columns: repeat(${cardsPerRow}, 1fr); gap: ${spaceBetween}px;` :
                    'display: flex; overflow-x: auto; gap: 16px; scroll-snap-type: x mandatory; -webkit-overflow-scrolling: touch;';
                
                testimonialsHtml = `<div class="testimonials-grid" style="${gridStyles}">`;
                
                visibleTestimonials.forEach(testimonialId => {
                    const testimonial = config.testimonials[testimonialId];
                    testimonialsHtml += window.WebsiteBuilderModules.Testimonials.renderTestimonialCard(testimonial, config);
                });
                
                testimonialsHtml += '</div>';
            }
        }
        
        // Generate unique ID for this instance
        const uniqueId = 'testimonials-' + Date.now();
        
        const html = `
            <style>
                @media (max-width: 768px) {
                    #${uniqueId} .testimonials-grid {
                        grid-template-columns: 1fr !important;
                        gap: 16px !important;
                    }
                    
                    #${uniqueId} .testimonials-header {
                        text-align: ${config.mobileContentAlignment || 'center'} !important;
                        margin-bottom: 30px !important;
                    }
                    
                    #${uniqueId} .testimonials-header h2 {
                        font-size: 24px !important;
                    }
                    
                    #${uniqueId} .testimonials-header p,
                    #${uniqueId} .testimonials-header div {
                        font-size: 14px !important;
                    }
                    
                    #${uniqueId} .testimonial-card {
                        text-align: ${config.mobileContentAlignment || 'center'} !important;
                        padding: 20px !important;
                    }
                    
                    #${uniqueId} .testimonial-author {
                        ${config.mobileContentAlignment === 'center' ? 'justify-content: center !important;' : ''}
                    }
                    
                    #${uniqueId} {
                        padding: 40px 20px !important;
                    }
                    
                    #${uniqueId} .testimonial-card .testimonial-author img,
                    #${uniqueId} .testimonial-card .testimonial-author > div:first-child {
                        width: 36px !important;
                        height: 36px !important;
                    }
                    
                    #${uniqueId} .testimonial-card div[style*="font-size"] {
                        font-size: 14px !important;
                    }
                    
                    #${uniqueId} .testimonial-card div[style*="margin-bottom: 24px"] {
                        margin-bottom: 16px !important;
                    }
                    
                    /* Adjust rating stars for mobile */
                    #${uniqueId} .testimonial-card span[style*="font-size"] {
                        font-size: 14px !important;
                    }
                    
                    /* Mobile carousel styles */
                    #${uniqueId} .testimonials-grid[style*="display: flex"] {
                        padding-bottom: 10px !important;
                        scroll-snap-type: x mandatory !important;
                    }
                    
                    #${uniqueId} .testimonials-grid[style*="display: flex"] .testimonial-card {
                        min-width: 85% !important;
                        scroll-snap-align: center !important;
                        flex-shrink: 0 !important;
                    }
                    
                    /* Mobile scrollbar styling */
                    #${uniqueId} .testimonials-grid[style*="display: flex"]::-webkit-scrollbar {
                        height: 6px !important;
                    }
                    
                    #${uniqueId} .testimonials-grid[style*="display: flex"]::-webkit-scrollbar-track {
                        background: #f1f1f1 !important;
                        border-radius: 3px !important;
                    }
                    
                    #${uniqueId} .testimonials-grid[style*="display: flex"]::-webkit-scrollbar-thumb {
                        background: #888 !important;
                        border-radius: 3px !important;
                    }
                }
            </style>
            <div id="${uniqueId}" class="section-wrapper testimonials-section" data-section-id="testimonials" style="${sectionStyles}">
                <div class="section-header-tag">
                    <span class="material-symbols-outlined" style="font-size: 16px;">rate_review</span>
                    ${window.translations && window.translations[window.currentLanguage] ? 
                        (window.translations[window.currentLanguage]['sections.testimonials'] || 'Testimonials') : 
                        'Testimonials'}
                </div>
                <div class="container" style="${containerStyles}">
                    ${config.subheading || config.heading || config.body ? `
                        <div class="testimonials-header" style="text-align: ${config.desktopContentAlignment || 'left'}; margin-bottom: 40px;">
                            ${config.subheading ? `<p style="color: ${schemeColors.text}; opacity: 0.7; margin: 0 0 10px; font-family: '${bodyFont}', sans-serif; font-size: 14px; text-transform: uppercase;">${config.subheading}</p>` : ''}
                            ${config.heading ? `<h2 style="color: ${schemeColors.text}; margin: 0 0 20px; font-family: '${headingFont}', sans-serif; font-size: ${getHeadingSize(config.headingSize || 3)};">${config.heading}</h2>` : ''}
                            ${config.body ? `<div style="color: ${schemeColors.text}; opacity: 0.8; font-family: '${bodyFont}', sans-serif; font-size: ${getBodySize(config.bodySize || 3)};">${config.body}</div>` : ''}
                            ${config.linkLabel && config.linkUrl ? `<a href="${config.linkUrl}" style="color: ${schemeColors.text}; text-decoration: underline; margin-top: 15px; display: inline-block; font-family: '${bodyFont}', sans-serif;">${config.linkLabel}</a>` : ''}
                        </div>
                    ` : ''}
                    
                    ${testimonialsHtml || `
                        <div style="text-align: center; padding: 40px; color: #999;">
                            <i class="material-icons" style="font-size: 48px; color: #ddd;">rate_review</i>
                            <p>Add testimonials to showcase customer reviews</p>
                        </div>
                    `}
                </div>
            </div>
        `;
        
        console.log('[TESTIMONIALS] Returning dynamic HTML');
        return html;
    },
    
    // Render individual testimonial card
    renderTestimonialCard: function(testimonial, config) {
        const schemeColors = window.getColorSchemeValues ? window.getColorSchemeValues(config.colorScheme || 'scheme3') : {
            background: '#ffffff',
            text: '#333333',
            foreground: '#f8f8f8',
            border: '#e0e0e0'
        };
        
        const bodyTypography = window.currentGlobalThemeSettings?.typography?.body || {};
        const bodyFont = window.getFontNameFromValueSafe ? 
            window.getFontNameFromValueSafe(bodyTypography.font || 'roboto') : 
            'Roboto';
        
        // Card background
        const cardBg = config.colorTestimonials ? schemeColors.foreground : '#ffffff';
        const borderColor = config.colorTestimonials ? 'transparent' : schemeColors.border;
        
        // Card size configurations
        const cardSize = config.cardSize || 'medium';
        const sizeConfigs = {
            small: {
                padding: '15px',
                contentFontSize: '12px',
                authorFontSize: '11px',
                authorInfoFontSize: '10px',
                starSize: '12px',
                ratingMargin: '8px'
            },
            medium: {
                padding: '30px',
                contentFontSize: '16px',
                authorFontSize: '14px',
                authorInfoFontSize: '13px',
                starSize: '16px',
                ratingMargin: '15px'
            },
            large: {
                padding: '40px',
                contentFontSize: '18px',
                authorFontSize: '16px',
                authorInfoFontSize: '14px',
                starSize: '20px',
                ratingMargin: '20px'
            }
        };
        
        const currentSize = sizeConfigs[cardSize];
        
        // Rating stars
        let ratingHtml = '';
        if (config.showRating && testimonial.rating) {
            const fullStars = Math.floor(testimonial.rating);
            const hasHalfStar = testimonial.rating % 1 !== 0;
            
            ratingHtml = `<div style="margin-bottom: ${currentSize.ratingMargin};">`;
            for (let i = 0; i < 5; i++) {
                if (i < fullStars) {
                    ratingHtml += `<span style="color: ${config.ratingStarsColor || '#F49A13'}; font-size: ${currentSize.starSize};">★</span>`;
                } else if (i === fullStars && hasHalfStar) {
                    ratingHtml += `<span style="color: ${config.ratingStarsColor || '#F49A13'}; font-size: ${currentSize.starSize};">★</span>`; // Simplified for now
                } else {
                    ratingHtml += `<span style="color: #ddd; font-size: ${currentSize.starSize};">★</span>`;
                }
            }
            ratingHtml += '</div>';
        }
        
        return `
            <div class="testimonial-card" style="background: ${cardBg}; border: 1px solid ${borderColor}; border-radius: 8px; padding: ${currentSize.padding}; text-align: ${config.desktopContentAlignment || 'left'};">
                ${ratingHtml}
                
                <div style="color: ${schemeColors.text}; font-family: '${bodyFont}', sans-serif; font-size: ${currentSize.contentFontSize}; margin-bottom: 24px; line-height: 1.6;">
                    ${testimonial.content || 'Customer testimonial content...'}
                </div>
                
                <div class="testimonial-author" style="display: flex; align-items: center; gap: 12px; ${config.desktopContentAlignment === 'center' ? 'justify-content: center;' : ''}">
                    ${testimonial.avatar ? `
                        <img src="${testimonial.avatar}" alt="${testimonial.author}" style="width: ${testimonial.avatarSize || 40}px; height: ${testimonial.avatarSize || 40}px; border-radius: ${testimonial.avatarShape === 'square' ? '4px' : '50%'}; object-fit: cover;">
                    ` : `
                        <div style="width: ${testimonial.avatarSize || 40}px; height: ${testimonial.avatarSize || 40}px; border-radius: ${testimonial.avatarShape === 'square' ? '4px' : '50%'}; background: ${schemeColors.foreground}; display: flex; align-items: center; justify-content: center;">
                            <i class="material-icons" style="color: ${testimonial.avatarIconColor || '#666666'}; font-size: 20px;">person</i>
                        </div>
                    `}
                    
                    <div>
                        <div style="color: ${schemeColors.text}; font-weight: 600; font-family: '${bodyFont}', sans-serif; font-size: ${currentSize.authorFontSize}; margin-bottom: 2px;">
                            ${testimonial.author || 'Author'}
                        </div>
                        ${testimonial.authorInfo ? `
                            <div style="color: ${schemeColors.text}; opacity: 0.7; font-size: ${currentSize.authorInfoFontSize}; font-family: '${bodyFont}', sans-serif;">
                                ${testimonial.authorInfo}
                            </div>
                        ` : ''}
                    </div>
                </div>
                
                ${testimonial.productImage ? `
                    <div style="margin-top: 20px; text-align: ${config.desktopContentAlignment || 'left'};">
                        <img src="${testimonial.productImage}" alt="Product" style="width: ${testimonial.productImageSize || 200}px; height: auto; border-radius: ${testimonial.productImageShape === 'circle' ? '50%' : '4px'}; max-width: 100%;">
                    </div>
                ` : ''}
            </div>
        `;
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
                    <h4 data-i18n="testimonials.testimonialsTitle" style="font-size: 13px; font-weight: 500; margin-bottom: 12px; color: #5c5e60;">Testimonials</h4>
                    
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
                    
                    <!-- Card size -->
                    <div class="settings-field">
                        <label data-i18n="testimonials.cardSize">Card size</label>
                        <select class="shopify-select" id="testimonials-card-size">
                            <option value="small" ${configData.cardSize === 'small' ? 'selected' : ''} data-i18n="testimonials.small">Small</option>
                            <option value="medium" ${configData.cardSize === 'medium' ? 'selected' : ''} data-i18n="testimonials.medium">Medium</option>
                            <option value="large" ${configData.cardSize === 'large' ? 'selected' : ''} data-i18n="testimonials.large">Large</option>
                        </select>
                        <p class="help-text" data-i18n="testimonials.cardSizeHelp">Affects padding, font sizes, and spacing</p>
                    </div>
                    
                    <div class="settings-divider"></div>
                    
                    <!-- Content section -->
                    <h4 data-i18n="testimonials.content" style="font-size: 13px; font-weight: 500; margin-bottom: 12px; color: #5c5e60;">Content</h4>
                    
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
                        <div style="display: flex; align-items: center; gap: 10px;">
                            <input type="range" class="shopify-range" id="testimonials-heading-size" min="0" max="7" value="${configData.headingSize || 3}">
                            <input type="number" class="shopify-number-input" id="testimonials-heading-size-input" value="${configData.headingSize || 3}" min="0" max="7" style="width: 60px;">
                        </div>
                    </div>
                    
                    <!-- Body size -->
                    <div class="settings-field">
                        <label data-i18n="testimonials.bodySize">Body size</label>
                        <div style="display: flex; align-items: center; gap: 10px;">
                            <input type="range" class="shopify-range" id="testimonials-body-size" min="0" max="6" value="${configData.bodySize || 3}">
                            <input type="number" class="shopify-number-input" id="testimonials-body-size-input" value="${configData.bodySize || 3}" min="0" max="6" style="width: 60px;">
                        </div>
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
                    <h4 data-i18n="testimonials.backgroundImage" style="font-size: 13px; font-weight: 500; margin-bottom: 12px; color: #5c5e60;">Background image</h4>
                    
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
                    <h4 data-i18n="testimonials.autoplay" style="font-size: 13px; font-weight: 500; margin-bottom: 12px; color: #5c5e60;">Autoplay</h4>
                    
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
                    <h4 data-i18n="testimonials.paddings" style="font-size: 13px; font-weight: 500; margin-bottom: 12px; color: #5c5e60;">Paddings</h4>
                    
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
                    
                    <!-- Testimonials list section removed - managed in sidebar -->
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
    
    // Render individual testimonial settings (collapsed view)
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
    
    // Render full testimonial child settings view
    renderTestimonialChildSettings: function(testimonialId, parentConfig) {
        const testimonial = parentConfig.testimonials[testimonialId] || {};
        
        return `
            <div style="display: flex; flex-direction: column; height: 100%; position: relative; overflow: hidden;">
                <div class="sidebar-view-header" style="position: relative; z-index: 10;">
                    <button class="back-to-sections-btn">
                        <i class="material-icons">arrow_back</i>
                    </button>
                    <h3 data-i18n="testimonials.testimonialSettings">Testimonial</h3>
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
                    <!-- Rating -->
                    <div class="settings-field">
                        <label data-i18n="testimonials.rating">Rating</label>
                        <div style="display: flex; align-items: center; gap: 10px;">
                            <input type="range" class="shopify-range" id="testimonial-rating-slider" min="1" max="5" value="${testimonial.rating || 4.5}" step="0.5">
                            <input type="number" class="shopify-number-input" id="testimonial-rating-input" value="${testimonial.rating || 4.5}" min="1" max="5" step="0.5" style="width: 60px;">
                        </div>
                    </div>
                    
                    <!-- Testimonial (Rich text) -->
                    <div class="settings-field">
                        <label data-i18n="testimonials.testimonial">Testimonial</label>
                        <div class="rich-text-toolbar">
                            <button class="toolbar-btn" data-command="formatBlock" data-value="p" title="Paragraph">
                                <span style="font-size: 11px;">Aa</span>
                            </button>
                            <button class="toolbar-btn" data-command="bold" title="Bold">
                                <span style="font-weight: bold;">B</span>
                            </button>
                            <button class="toolbar-btn" data-command="italic" title="Italic">
                                <span style="font-style: italic;">I</span>
                            </button>
                            <button class="toolbar-btn" data-command="createLink" title="Link">
                                <i class="material-icons" style="font-size: 16px;">link</i>
                            </button>
                            <button class="toolbar-btn" data-command="insertUnorderedList" title="Bullet list">
                                <i class="material-icons" style="font-size: 16px;">format_list_bulleted</i>
                            </button>
                            <button class="toolbar-btn" data-command="insertOrderedList" title="Numbered list">
                                <i class="material-icons" style="font-size: 16px;">format_list_numbered</i>
                            </button>
                        </div>
                        <div contenteditable="true" class="rich-text-editor shopify-input" id="testimonial-content-editor" style="min-height: 100px; padding: 10px;">${testimonial.content || 'Add authentic testimonials of your customers talking about your products or brand in their own words, so that customers can identify with them and their needs.'}</div>
                    </div>
                    
                    <!-- Author avatar -->
                    <div class="settings-field">
                        <label data-i18n="testimonials.authorAvatar">Author avatar</label>
                        <div class="image-selector" id="testimonial-avatar-selector" style="border: 2px dashed #e0e0e0; border-radius: 4px; padding: 30px; text-align: center; cursor: pointer;">
                            ${testimonial.avatar ? 
                                `<img src="${testimonial.avatar}" style="max-width: 80px; height: auto; border-radius: ${testimonial.avatarShape === 'square' ? '4px' : '50%'};">` : 
                                `<div>
                                    <button class="shopify-button-secondary">
                                        <span data-i18n="common.selectImage">Seleccionar</span>
                                    </button>
                                    <p class="help-text" style="margin-top: 10px;" data-i18n="common.exploreImagesAlt">Explorar imágenes gratuitas</p>
                                </div>`
                            }
                        </div>
                    </div>
                    
                    <!-- Avatar size -->
                    <div class="settings-field">
                        <label data-i18n="testimonials.avatarSize">Avatar size</label>
                        <div style="display: flex; align-items: center; gap: 10px;">
                            <input type="range" class="shopify-range" id="testimonial-avatar-size" min="30" max="80" value="${testimonial.avatarSize || 40}">
                            <input type="number" class="shopify-number-input" id="testimonial-avatar-size-input" value="${testimonial.avatarSize || 40}" min="30" max="80" style="width: 60px;">
                            <span style="font-size: 13px; color: #6d7175;">px</span>
                        </div>
                    </div>
                    
                    <!-- Avatar shape -->
                    <div class="settings-field">
                        <label data-i18n="testimonials.avatarShape">Avatar shape</label>
                        <div class="button-group">
                            <button class="shape-btn ${testimonial.avatarShape !== 'square' ? 'active' : ''}" data-shape="circle">
                                <span data-i18n="testimonials.circle">Circle</span>
                            </button>
                            <button class="shape-btn ${testimonial.avatarShape === 'square' ? 'active' : ''}" data-shape="square">
                                <span data-i18n="testimonials.square">Square</span>
                            </button>
                        </div>
                    </div>
                    
                    <!-- Avatar icon color -->
                    <div class="settings-field">
                        <label data-i18n="testimonials.avatarIconColor">Avatar icon color</label>
                        <div style="display: flex; align-items: center; gap: 10px;">
                            <input type="color" class="color-picker" id="testimonial-avatar-icon-color" value="${testimonial.avatarIconColor || '#666666'}" style="width: 50px; height: 38px; border: 1px solid #e3e3e3; border-radius: 4px; cursor: pointer;">
                            <input type="text" class="color-text-input shopify-input" value="${testimonial.avatarIconColor || '#666666'}" placeholder="#666666" style="flex: 1;">
                        </div>
                        <p class="help-text" data-i18n="testimonials.avatarIconColorHelp">Color of the person icon when no avatar image is uploaded</p>
                    </div>
                    
                    <!-- Author name -->
                    <div class="settings-field">
                        <label data-i18n="testimonials.authorName">Author name</label>
                        <input type="text" class="shopify-input" id="testimonial-author-name" value="${testimonial.author || ''}" placeholder="Author">
                    </div>
                    
                    <!-- Author details -->
                    <div class="settings-field">
                        <label data-i18n="testimonials.authorDetails">Author details</label>
                        <input type="text" class="shopify-input" id="testimonial-author-details" value="${testimonial.authorInfo || ''}" placeholder="Author details">
                    </div>
                    
                    <!-- Product -->
                    <div class="settings-field">
                        <label data-i18n="testimonials.product">Product</label>
                        <button class="shopify-button-secondary" style="width: 100%; justify-content: space-between;">
                            <span data-i18n="common.select">Seleccionar</span>
                            <i class="material-icons" style="font-size: 18px;">expand_more</i>
                        </button>
                    </div>
                    
                    <!-- Image -->
                    <div class="settings-field">
                        <label data-i18n="testimonials.image">Image</label>
                        <div class="image-selector" id="testimonial-product-image-selector" style="border: 2px dashed #e0e0e0; border-radius: 4px; padding: 30px; text-align: center; cursor: pointer;">
                            ${testimonial.productImage ? 
                                `<img src="${testimonial.productImage}" style="max-width: 100%; height: auto; border-radius: ${testimonial.productImageShape === 'circle' ? '50%' : '4px'};">` : 
                                `<div>
                                    <button class="shopify-button-secondary">
                                        <span data-i18n="common.selectImage">Seleccionar</span>
                                    </button>
                                    <p class="help-text" style="margin-top: 10px;" data-i18n="testimonials.imageUsePriorityProduct">Image use priority over product</p>
                                </div>`
                            }
                        </div>
                    </div>
                    
                    <!-- Product image size -->
                    <div class="settings-field">
                        <label data-i18n="testimonials.productImageSize">Product image size</label>
                        <div style="display: flex; align-items: center; gap: 10px;">
                            <input type="range" class="shopify-range" id="testimonial-product-image-size" min="100" max="300" value="${testimonial.productImageSize || 200}">
                            <input type="number" class="shopify-number-input" id="testimonial-product-image-size-input" value="${testimonial.productImageSize || 200}" min="100" max="300" style="width: 60px;">
                            <span style="font-size: 13px; color: #6d7175;">px</span>
                        </div>
                    </div>
                    
                    <!-- Product image shape -->
                    <div class="settings-field">
                        <label data-i18n="testimonials.productImageShape">Product image shape</label>
                        <div class="button-group">
                            <button class="shape-btn ${testimonial.productImageShape !== 'circle' ? 'active' : ''}" data-shape="square" data-type="product">
                                <span data-i18n="testimonials.square">Square</span>
                            </button>
                            <button class="shape-btn ${testimonial.productImageShape === 'circle' ? 'active' : ''}" data-shape="circle" data-type="product">
                                <span data-i18n="testimonials.circle">Circle</span>
                            </button>
                        </div>
                    </div>
                    
                    <!-- Testimonial link -->
                    <div class="settings-field">
                        <label data-i18n="testimonials.testimonialLink">Testimonial link</label>
                        <input type="text" class="shopify-input" id="testimonial-link" value="${testimonial.link || ''}" placeholder="Pega un enlace o busca">
                        <p class="help-text" data-i18n="testimonials.linkHelp">If left blank, the testimonial slides in from the left</p>
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
        
        // Card size
        $('#testimonials-card-size').off('change').on('change', function() {
            updateConfig('cardSize', $(this).val());
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
        
        // Heading size slider and input sync
        $('#testimonials-heading-size').off('input').on('input', function() {
            const value = $(this).val();
            $('#testimonials-heading-size-input').val(value);
            updateConfig('headingSize', parseInt(value));
        });
        
        $('#testimonials-heading-size-input').off('change').on('change', function() {
            const value = Math.max(0, Math.min(7, parseInt($(this).val()) || 3));
            $(this).val(value);
            $('#testimonials-heading-size').val(value);
            updateConfig('headingSize', value);
        });
        
        // Body size slider and input sync
        $('#testimonials-body-size').off('input').on('input', function() {
            const value = $(this).val();
            $('#testimonials-body-size-input').val(value);
            updateConfig('bodySize', parseInt(value));
        });
        
        $('#testimonials-body-size-input').off('change').on('change', function() {
            const value = Math.max(0, Math.min(6, parseInt($(this).val()) || 3));
            $(this).val(value);
            $('#testimonials-body-size').val(value);
            updateConfig('bodySize', value);
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
        
        // Click handler for testimonial items - open child settings view
        $(document).off('click.testimonials-item').on('click.testimonials-item', '.testimonial-item-settings', function(e) {
            // Don't open if clicking on action buttons or inside collapsed content
            if ($(e.target).closest('.action-icon, .collapsible-content').length) return;
            
            const testimonialId = $(this).data('testimonial-id');
            if (testimonialId) {
                // Store the testimonial ID for the child view
                window.currentTestimonialId = testimonialId;
                // Navigate to child settings view
                window.switchSidebarView('testimonialChildSettings');
            }
        });
        
        // Collapsible headers for testimonials (when not navigating to child view)
        $(document).off('click.testimonials-collapse').on('click.testimonials-collapse', '.collapsible-header', function(e) {
            // Don't collapse if clicking on action buttons
            if ($(e.target).closest('.action-icon').length) return;
            
            e.stopPropagation(); // Prevent parent click handler
            
            const $header = $(this);
            const targetId = $header.data('target');
            const $content = $('#' + targetId);
            const $icon = $header.find('.collapse-icon');
            
            $content.slideToggle(200);
            $icon.text($icon.text() === 'expand_more' ? 'expand_less' : 'expand_more');
        });
        
        // Delete testimonial - Handler moved to website-builder.js attachBlockListEventListeners
        
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
    
    // Attach event listeners for testimonial child settings view
    attachTestimonialChildEventListeners: function(testimonialId) {
        console.log('[TESTIMONIALS] Attaching child event listeners for:', testimonialId);
        
        // Helper function to update testimonial
        const updateTestimonial = (key, value) => {
            if (window.currentSectionsConfig.testimonials?.testimonials?.[testimonialId]) {
                window.currentSectionsConfig.testimonials.testimonials[testimonialId][key] = value;
                
                window.setHasPendingPageStructureChanges(true);
                window.updateSaveButtonState();
                window.renderPreview();
            }
        };
        
        // Back button - CRÍTICO según documentación punto 3.3.1
        $('.back-to-sections-btn').off('click').on('click', function() {
            window.switchSidebarView('blockList');
        });
        
        // Section menu
        $('.section-menu').off('click').on('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            $(this).siblings('.section-menu-dropdown').toggleClass('active');
        });
        
        // Close menu when clicking outside
        $(document).off('click.testimonial-menu-close').on('click.testimonial-menu-close', function(e) {
            if (!$(e.target).closest('.section-menu-wrapper').length) {
                $('.section-menu-dropdown').removeClass('active');
            }
        });
        
        // Rating slider and input sync
        $('#testimonial-rating-slider').off('input').on('input', function() {
            const value = $(this).val();
            $('#testimonial-rating-input').val(value);
            updateTestimonial('rating', parseFloat(value));
        });
        
        $('#testimonial-rating-input').off('change').on('change', function() {
            const value = Math.max(1, Math.min(5, parseFloat($(this).val()) || 4.5));
            $(this).val(value);
            $('#testimonial-rating-slider').val(value);
            updateTestimonial('rating', value);
        });
        
        // Testimonial content (Rich text)
        $('#testimonial-content-editor').off('input').on('input', function() {
            updateTestimonial('content', $(this).html());
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
            
            $('#testimonial-content-editor').trigger('input');
        });
        
        // Author avatar selector
        $('#testimonial-avatar-selector').off('click').on('click', function() {
            // Create hidden file input
            const fileInput = $('<input type="file" accept="image/*" style="display: none;">');
            
            fileInput.on('change', function(e) {
                const file = e.target.files[0];
                if (file) {
                    const reader = new FileReader();
                    reader.onload = function(e) {
                        const imageUrl = e.target.result;
                        
                        // Update the selector UI
                        $('#testimonial-avatar-selector').html(`
                            <img src="${imageUrl}" style="max-width: 80px; height: auto; border-radius: 50%;">
                        `);
                        
                        // Update testimonial data
                        updateTestimonial('avatar', imageUrl);
                    };
                    reader.readAsDataURL(file);
                }
            });
            
            // Trigger file input click
            fileInput.click();
        });
        
        // Author name
        $('#testimonial-author-name').off('input').on('input', function() {
            updateTestimonial('author', $(this).val());
        });
        
        // Author details
        $('#testimonial-author-details').off('input').on('input', function() {
            updateTestimonial('authorInfo', $(this).val());
        });
        
        // Avatar icon color picker and text input sync
        $('#testimonial-avatar-icon-color').off('input').on('input', function() {
            const value = $(this).val();
            $(this).siblings('.color-text-input').val(value);
            updateTestimonial('avatarIconColor', value);
        });
        
        $('#testimonial-avatar-icon-color').siblings('.color-text-input').off('change').on('change', function() {
            let value = $(this).val();
            if (!value.startsWith('#')) value = '#' + value;
            if (/^#[0-9A-F]{6}$/i.test(value)) {
                $(this).val(value);
                $('#testimonial-avatar-icon-color').val(value);
                updateTestimonial('avatarIconColor', value);
            }
        });
        
        // Avatar size slider and input sync
        $('#testimonial-avatar-size').off('input').on('input', function() {
            const value = $(this).val();
            $('#testimonial-avatar-size-input').val(value);
            updateTestimonial('avatarSize', parseInt(value));
        });
        
        $('#testimonial-avatar-size-input').off('change').on('change', function() {
            const value = Math.max(30, Math.min(80, parseInt($(this).val()) || 40));
            $(this).val(value);
            $('#testimonial-avatar-size').val(value);
            updateTestimonial('avatarSize', value);
        });
        
        // Avatar shape buttons
        $('.shape-btn').off('click').on('click', function(e) {
            e.preventDefault();
            $('.shape-btn').removeClass('active');
            $(this).addClass('active');
            const shape = $(this).data('shape');
            updateTestimonial('avatarShape', shape === 'square' ? 'square' : 'circle');
            
            // Update avatar preview shape
            const $avatarImg = $('#testimonial-avatar-selector img');
            if ($avatarImg.length) {
                $avatarImg.css('border-radius', shape === 'square' ? '4px' : '50%');
            }
        });
        
        // Product selector - commented out for now
        // $('.shopify-button-secondary').off('click').on('click', function() {
        //     // TODO: Implement product selector
        // });
        
        // Product image selector
        $('#testimonial-product-image-selector').off('click').on('click', function() {
            // Create hidden file input
            const fileInput = $('<input type="file" accept="image/*" style="display: none;">');
            
            fileInput.on('change', function(e) {
                const file = e.target.files[0];
                if (file) {
                    const reader = new FileReader();
                    reader.onload = function(e) {
                        const imageUrl = e.target.result;
                        
                        // Get current shape setting
                        const currentShape = window.currentSectionsConfig.testimonials?.testimonials?.[testimonialId]?.productImageShape || 'square';
                        
                        // Update the selector UI with current shape
                        $('#testimonial-product-image-selector').html(`
                            <img src="${imageUrl}" style="max-width: 100%; height: auto; border-radius: ${currentShape === 'circle' ? '50%' : '4px'};">
                        `);
                        
                        // Update testimonial data
                        updateTestimonial('productImage', imageUrl);
                    };
                    reader.readAsDataURL(file);
                }
            });
            
            // Trigger file input click
            fileInput.click();
        });
        
        // Product image size slider and input sync
        $('#testimonial-product-image-size').off('input').on('input', function() {
            const value = $(this).val();
            $('#testimonial-product-image-size-input').val(value);
            updateTestimonial('productImageSize', parseInt(value));
        });
        
        $('#testimonial-product-image-size-input').off('change').on('change', function() {
            const value = Math.max(100, Math.min(300, parseInt($(this).val()) || 200));
            $(this).val(value);
            $('#testimonial-product-image-size').val(value);
            updateTestimonial('productImageSize', value);
        });
        
        // Product image shape buttons
        $('.shape-btn[data-type="product"]').off('click').on('click', function(e) {
            e.preventDefault();
            $('.shape-btn[data-type="product"]').removeClass('active');
            $(this).addClass('active');
            const shape = $(this).data('shape');
            updateTestimonial('productImageShape', shape);
            
            // Update product image preview shape
            const $productImg = $('#testimonial-product-image-selector img');
            if ($productImg.length) {
                $productImg.css('border-radius', shape === 'circle' ? '50%' : '4px');
            }
        });
        
        // Testimonial link
        $('#testimonial-link').off('input').on('input', function() {
            updateTestimonial('link', $(this).val());
        });
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
            'avatar': 'Avatar',
            'testimonialSettings': 'Testimonio',
            'testimonial': 'Testimonio',
            'authorAvatar': 'Avatar del autor',
            'authorName': 'Nombre del autor',
            'authorDetails': 'Detalles del autor',
            'product': 'Producto',
            'testimonialLink': 'Enlace del testimonio',
            'linkHelp': 'Si se deja en blanco, el testimonio se desliza desde la izquierda',
            'imageUsePriorityProduct': 'La imagen tiene prioridad sobre el producto',
            'avatarSize': 'Tamaño del avatar',
            'avatarShape': 'Forma del avatar',
            'circle': 'Círculo',
            'square': 'Cuadrado'
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
            'avatar': 'Avatar',
            'testimonialSettings': 'Testimonial',
            'testimonial': 'Testimonial',
            'authorAvatar': 'Author avatar',
            'authorName': 'Author name',
            'authorDetails': 'Author details',
            'product': 'Product',
            'testimonialLink': 'Testimonial link',
            'linkHelp': 'If left blank, the testimonial slides in from the left',
            'imageUsePriorityProduct': 'Image use priority over product',
            'avatarSize': 'Avatar size',
            'avatarShape': 'Avatar shape',
            'circle': 'Circle',
            'square': 'Square'
        };
    }
};

// Initialize on load
$(document).ready(function() {
    if (window.WebsiteBuilderModules.Testimonials.initialize) {
        window.WebsiteBuilderModules.Testimonials.initialize();
    }
});