// Newsletter Module for Website Builder
window.WebsiteBuilderModules = window.WebsiteBuilderModules || {};
window.WebsiteBuilderModules.Newsletter = {
    render: function(config) {
        if (!config || config.isHidden) return '';
        
        const schemeColors = getColorSchemeValues(config.colorScheme || 'scheme1');
        const uniqueId = 'newsletter-' + Date.now();
        
        // CRÍTICO: Incluir section-header-tag para la pestaña azul al hover
        return `
            <div class="section-wrapper" data-section-id="newsletter" style="padding: 40px 0; background-color: ${schemeColors.background};">
                <div class="section-header-tag">
                    <span class="material-symbols-outlined" style="font-size: 16px;">mail</span>
                    ${window.translations && window.translations[window.currentLanguage] ? 
                        (window.translations[window.currentLanguage]['sections.newsletter'] || 'Newsletter') : 
                        'Newsletter'}
                </div>
                <div class="container" style="max-width: 1200px; margin: 0 auto; padding: 0 20px;">
                    <div style="text-align: center;">
                        <h2 style="font-size: 36px; margin-bottom: 20px; color: ${schemeColors.text};">
                            ${config.heading || 'Subscribe to Our Newsletter'}
                        </h2>
                        <p style="font-size: 16px; margin-bottom: 30px; color: ${schemeColors.text};">
                            ${config.subheading || 'Sign up for the latest updates, news, and exclusive offers delivered directly to your inbox.'}
                        </p>
                        
                        <!-- Form placeholder -->
                        <div style="max-width: 500px; margin: 0 auto;">
                            <div style="display: flex; gap: 10px; align-items: stretch;">
                                <input type="email" placeholder="${config.placeholder || 'Enter your email'}" 
                                       style="flex: 1; padding: 12px 16px; border: 1px solid ${schemeColors.border}; 
                                              border-radius: 4px; font-size: 16px; background: white;">
                                <button style="padding: 12px 24px; background-color: ${config.buttonColor || '#2962ff'}; 
                                               color: ${config.buttonTextColor || '#ffffff'}; border: none; 
                                               border-radius: 4px; font-size: 16px; cursor: pointer;">
                                    ${config.buttonText || 'Subscribe'}
                                </button>
                            </div>
                        </div>
                        
                        <p style="font-size: 14px; margin-top: 20px; color: ${schemeColors.text}; opacity: 0.8;">
                            ${config.disclaimer || 'We respect your privacy. Unsubscribe at any time.'}
                        </p>
                    </div>
                </div>
            </div>
        `;
    },
    
    renderSettings: function(config) {
        return `<div>Settings placeholder - Will implement in ETAPA 5</div>`;
    },
    
    attachEventListeners: function() {
        // Will implement in ETAPA 6
    },
    
    initialize: function() {
        // Initialize if needed
    }
};