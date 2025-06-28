// Rich Text Module for Website Builder
window.WebsiteBuilderModules = window.WebsiteBuilderModules || {};
window.WebsiteBuilderModules.RichText = {
    render: function(config) {
        if (!config || config.isHidden) return '';
        
        const schemeColors = getColorSchemeValues(config.colorScheme || 'scheme1');
        
        // CRÍTICO: Incluir section-header-tag para la pestaña azul al hover
        return `
            <div class="section-wrapper" data-section-id="richText" style="padding: 40px 0; background-color: ${schemeColors.background};">
                <div class="section-header-tag">
                    <span class="material-symbols-outlined" style="font-size: 16px;">text_fields</span>
                    ${window.translations && window.translations[window.currentLanguage] ? 
                        (window.translations[window.currentLanguage]['sections.richText'] || 'Rich Text') : 
                        'Rich Text'}
                </div>
                <div class="container" style="max-width: 1200px; margin: 0 auto; padding: 0 20px;">
                    <div class="rich-text-content" style="color: ${schemeColors.text};">
                        ${config.content || '<p style="text-align: center; color: #666;">Click to add rich text content</p>'}
                    </div>
                </div>
            </div>
        `;
    },
    
    renderSettings: function(config) {
        return `<div>Settings placeholder</div>`;
    },
    
    attachEventListeners: function() {},
    
    initialize: function() {}
};