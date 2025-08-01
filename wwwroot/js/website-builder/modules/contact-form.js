// Contact Form Module for Website Builder
window.WebsiteBuilderModules = window.WebsiteBuilderModules || {};
window.WebsiteBuilderModules.ContactForm = {
    render: function(config) {
        if (!config || config.isHidden) return '';
        
        const schemeColors = window.getColorSchemeValues ? window.getColorSchemeValues(config.colorScheme || 'scheme1') : { text: '#121212', background: '#FFFFFF' };
        
        // Get typography settings
        const headingTypography = window.currentGlobalThemeSettings?.typography?.heading || { font: 'assistant', fontSize: '36px' };
        const bodyTypography = window.currentGlobalThemeSettings?.typography?.body || { font: 'assistant', fontSize: '16px' };
        
        // Get fonts
        const headingFont = window.getFontNameFromValueSafe ? 
            window.getFontNameFromValueSafe(headingTypography.font) : 
            'Assistant';
        const bodyFont = window.getFontNameFromValueSafe ? 
            window.getFontNameFromValueSafe(bodyTypography.font) : 
            'Assistant';
            
        // Configuration values
        const width = config.width || 'extra-small';
        const contentAlignment = config.contentAlignment || 'left';
        const addSidePaddings = config.addSidePaddings !== false;
        const paddingTop = config.paddingTop || 40;
        const paddingBottom = config.paddingBottom || 40;
        
        // Content
        const heading = config.heading || 'Estamos aquí para aclarar todas tus interrogantes.';
        const headingSize = config.headingSize || 'h5';
        const body = config.body || 'Solicita una demostración en línea adaptada a tus necesidades y descubre todo lo que Aurora puede ofrecerte.';
        const bodySize = config.bodySize || '3';
        
        // Form settings
        const inputStyle = config.inputStyle || 'solid';
        const showPhoneNumber = config.showPhoneNumber || false;
        const showRecaptcha = config.showRecaptcha || false;
        
        // Determine container width
        let containerMaxWidth = '600px';
        if (width === 'narrow') containerMaxWidth = '800px';
        else if (width === 'page') containerMaxWidth = '1200px';
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
        
        // Input styles
        const inputBorderStyle = inputStyle === 'outline' ? `
            border: 1px solid ${schemeColors.text}30;
            background-color: transparent;
        ` : `
            border: none;
            background-color: ${schemeColors.text}08;
        `;
        
        // Generate unique ID for this contact form instance
        const uniqueId = `contact-form-${config.id || Date.now()}`;
        
        return `
            <style>
                /* Mobile responsiveness */
                @media (max-width: 768px) {
                    #${uniqueId} .contact-form-section {
                        padding: 30px 15px !important;
                    }
                    
                    #${uniqueId} .contact-form-container {
                        padding: 0 !important;
                    }
                    
                    #${uniqueId} h1, #${uniqueId} h2, #${uniqueId} h3 {
                        font-size: 24px !important;
                    }
                    
                    #${uniqueId} h4, #${uniqueId} h5 {
                        font-size: 20px !important;
                    }
                    
                    #${uniqueId} h6, #${uniqueId} h7 {
                        font-size: 18px !important;
                    }
                    
                    #${uniqueId} .contact-form-body {
                        font-size: 14px !important;
                        margin-bottom: 20px !important;
                    }
                    
                    #${uniqueId} .contact-form-fields > div {
                        flex-direction: column !important;
                        gap: 12px !important;
                    }
                    
                    #${uniqueId} input[type="text"],
                    #${uniqueId} input[type="email"],
                    #${uniqueId} input[type="tel"],
                    #${uniqueId} textarea {
                        font-size: 16px !important; /* Prevents zoom on iOS */
                        padding: 14px !important;
                    }
                    
                    #${uniqueId} button[type="submit"] {
                        width: 100% !important;
                        padding: 16px !important;
                        font-size: 16px !important;
                    }
                }
                
                /* Extra small screens */
                @media (max-width: 480px) {
                    #${uniqueId} .contact-form-section {
                        padding: 20px 10px !important;
                    }
                }
            </style>
            
            <div class="section-wrapper" data-section-id="${config.id || 'contact-form'}" data-element-id="${config.id || uniqueId}" id="${uniqueId}" style="padding: 0;">
                <div class="section-header-tag">
                    <span class="material-symbols-outlined" style="font-size: 16px;">mail</span>
                    ${window.translations && window.translations[window.currentLanguage] ? 
                        (window.translations[window.currentLanguage]['sections.contactForm'] || 'Contact form') : 
                        'Contact form'}
                </div>
                <div class="contact-form-section" style="
                    background-color: ${schemeColors.background};
                    color: ${schemeColors.text};
                    padding: ${paddingTop}px ${addSidePaddings ? '20px' : '0'} ${paddingBottom}px;
                ">
                    <div class="contact-form-container" style="
                    max-width: ${containerMaxWidth};
                    margin: 0 auto;
                    text-align: ${contentAlignment};
                ">
                    ${heading ? `
                        <h${headingSize.replace('h', '')} style="${`
                            font-family: ${headingFont};
                            font-size: ${headingSizes[headingSize] || '24px'};
                            font-weight: 600;
                            line-height: 1.2;
                            margin: 0 0 16px 0;
                            color: ${schemeColors.text};
                        `}">
                            ${heading}
                        </h${headingSize.replace('h', '')}>
                    ` : ''}
                    
                    ${body ? `
                        <div class="contact-form-body" style="
                            font-family: ${bodyFont};
                            font-size: ${bodySizes[bodySize] || '18px'};
                            line-height: 1.6;
                            margin: 0 0 32px 0;
                            color: ${schemeColors.text};
                            opacity: 0.9;
                        ">
                            ${body}
                        </div>
                    ` : ''}
                    
                    <form class="contact-form-fields" style="
                        display: flex;
                        flex-direction: column;
                        gap: 16px;
                    ">
                        <div style="display: flex; gap: 16px;">
                            <input 
                                type="text" 
                                placeholder="Nombre" 
                                style="
                                    flex: 1;
                                    padding: 12px 16px;
                                    font-family: ${bodyFont};
                                    font-size: 16px;
                                    color: ${schemeColors.text};
                                    ${inputBorderStyle}
                                    border-radius: 4px;
                                    outline: none;
                                    transition: all 0.3s ease;
                                "
                            />
                            <input 
                                type="email" 
                                placeholder="Correo electrónico" 
                                style="
                                    flex: 1;
                                    padding: 12px 16px;
                                    font-family: ${bodyFont};
                                    font-size: 16px;
                                    color: ${schemeColors.text};
                                    ${inputBorderStyle}
                                    border-radius: 4px;
                                    outline: none;
                                    transition: all 0.3s ease;
                                "
                            />
                        </div>
                        
                        ${showPhoneNumber ? `
                            <input 
                                type="tel" 
                                placeholder="Número de teléfono" 
                                style="
                                    padding: 12px 16px;
                                    font-family: ${bodyFont};
                                    font-size: 16px;
                                    color: ${schemeColors.text};
                                    ${inputBorderStyle}
                                    border-radius: 4px;
                                    outline: none;
                                    transition: all 0.3s ease;
                                "
                            />
                        ` : ''}
                        
                        <textarea 
                            placeholder="Mensaje" 
                            rows="4"
                            style="
                                padding: 12px 16px;
                                font-family: ${bodyFont};
                                font-size: 16px;
                                color: ${schemeColors.text};
                                ${inputBorderStyle}
                                border-radius: 4px;
                                outline: none;
                                resize: vertical;
                                min-height: 120px;
                                transition: all 0.3s ease;
                            "
                        ></textarea>
                        
                        ${showRecaptcha ? `
                            <div style="
                                font-size: 12px;
                                color: ${schemeColors.text};
                                opacity: 0.7;
                                margin: 8px 0;
                            ">
                                This site is protected by reCAPTCHA and the Google Privacy Policy and Terms of Service apply.
                            </div>
                        ` : ''}
                        
                        <button 
                            type="submit" 
                            style="
                                align-self: ${contentAlignment === 'center' ? 'center' : contentAlignment === 'right' ? 'flex-end' : 'flex-start'};
                                padding: 12px 32px;
                                background-color: ${schemeColors['solid-button']};
                                color: ${schemeColors['solid-button-text']};
                                border: none;
                                border-radius: 4px;
                                font-family: ${bodyFont};
                                font-size: 16px;
                                font-weight: 500;
                                cursor: pointer;
                                transition: all 0.3s ease;
                            "
                            onmouseover="this.style.opacity='0.8'"
                            onmouseout="this.style.opacity='1'"
                        >
                            Enviar
                        </button>
                    </form>
                </div>
            </div>
            </div>
        `;
    },
    
    // Function to add contact form section when clicked from modal
    addContactForm: function() {
        console.log('[CONTACT-FORM] Adding new contact form section');
        
        // Generate unique ID
        const contactFormId = 'contact-form-' + Date.now();
        
        // Default configuration
        const defaultConfig = {
            type: 'contact-form',
            id: contactFormId,
            colorScheme: 'scheme1',
            width: 'extra-small',
            contentAlignment: 'left',
            heading: 'Estamos aquí para aclarar todas tus interrogantes.',
            headingSize: 'h5',
            body: 'Solicita una demostración en línea adaptada a tus necesidades y descubre todo lo que Aurora puede ofrecerte.',
            bodySize: '3',
            inputStyle: 'solid',
            showPhoneNumber: false,
            showRecaptcha: false,
            addSidePaddings: true,
            paddingTop: 40,
            paddingBottom: 40,
            isHidden: false
        };
        
        // Add to sections config
        if (!window.currentSectionsConfig.contactForms) {
            window.currentSectionsConfig.contactForms = {};
        }
        window.currentSectionsConfig.contactForms[contactFormId] = defaultConfig;
        
        // Add to section order - insert before footer if it exists
        if (!window.currentSectionsConfig.sectionOrder) {
            window.currentSectionsConfig.sectionOrder = [];
        }
        
        // Find footer position and insert before it
        const footerIndex = window.currentSectionsConfig.sectionOrder.indexOf('footer');
        if (footerIndex > -1) {
            // Insert before footer
            window.currentSectionsConfig.sectionOrder.splice(footerIndex, 0, contactFormId);
        } else {
            // No footer, add at the end
            window.currentSectionsConfig.sectionOrder.push(contactFormId);
        }
        
        // Re-render just the template sections content
        const templateContainer = document.getElementById('template-sections-container');
        if (templateContainer && window.renderTemplateSections) {
            // Find the add section button to preserve it
            const addSectionDiv = templateContainer.querySelector('div:has(.add-section-button.add-template-section)');
            
            // Render the updated sections
            const sectionsHTML = window.renderTemplateSections();
            
            // Update the container while preserving the add button
            if (addSectionDiv) {
                templateContainer.innerHTML = sectionsHTML + addSectionDiv.outerHTML;
            } else {
                templateContainer.innerHTML = sectionsHTML;
            }
            
            // Re-apply translations
            if (window.applyTranslations) {
                setTimeout(window.applyTranslations, 0);
            }
        }
        
        // Update preview
        if (window.renderPreview) {
            window.renderPreview();
        }
        
        // Mark as having changes - CRÍTICO: usar la función correcta
        window.setHasPendingPageStructureChanges(true);
        window.updateSaveButtonState();
        
        // Initialize drag and drop if available
        setTimeout(() => {
            if (window.initializeDragAndDrop) {
                console.log('[CONTACT-FORM] Initializing drag and drop after adding contact form');
                window.initializeDragAndDrop();
            }
        }, 100);
    },
    
    // Toggle visibility
    toggleVisibility: function(contactFormId) {
        console.log('[CONTACT-FORM] Toggling visibility for:', contactFormId);
        
        const config = window.currentSectionsConfig.contactForms[contactFormId];
        if (!config) return;
        
        // Toggle hidden state
        config.isHidden = !config.isHidden;
        
        // Update button state
        const button = document.querySelector(`.visibility-toggle[data-element-id="${contactFormId}"]`);
        if (button) {
            const visibleIcon = button.querySelector('.visibility-icon-visible');
            const hiddenIcon = button.querySelector('.visibility-icon-hidden');
            
            if (config.isHidden) {
                button.classList.add('is-hidden');
                visibleIcon.style.display = 'none';
                hiddenIcon.style.display = 'block';
            } else {
                button.classList.remove('is-hidden');
                visibleIcon.style.display = 'block';
                hiddenIcon.style.display = 'none';
            }
        }
        
        // Update preview
        if (window.renderPreview) {
            window.renderPreview();
        }
        
        // Mark as having changes - CRÍTICO: usar la función correcta
        window.setHasPendingPageStructureChanges(true);
        window.updateSaveButtonState();
    },
    
    // Delete contact form
    deleteContactForm: function(contactFormId) {
        console.log('[CONTACT-FORM] Deleting:', contactFormId);
        
        if (confirm('Are you sure you want to delete this contact form?')) {
            // Remove from config
            delete window.currentSectionsConfig.contactForms[contactFormId];
            
            // Remove from section order
            const index = window.currentSectionsConfig.sectionOrder.indexOf(contactFormId);
            if (index > -1) {
                window.currentSectionsConfig.sectionOrder.splice(index, 1);
            }
            
            // Remove from DOM
            const element = document.querySelector(`[data-element-id="${contactFormId}"]`);
            if (element) {
                element.remove();
            }
            
            // Update preview
            if (window.renderPreview) {
                window.renderPreview();
            }
            
            // Mark as having changes
            window.hasPendingPageStructureChanges = true;
            window.updateSaveButtonState();
        }
    },
    
    // Open settings
    openSettings: function(contactFormId) {
        console.log('[CONTACT-FORM] Opening settings for:', contactFormId);
        
        const config = window.currentSectionsConfig.contactForms[contactFormId];
        if (!config) return;
        
        // Switch to settings view
        if (window.switchSidebarView) {
            window.switchSidebarView('contactFormSettings', { 
                contactFormId: contactFormId,
                config: config 
            });
        }
    },
    
    // Render settings view
    renderSettings: function(data) {
        const { contactFormId, config } = data;
        console.log('[CONTACT-FORM] Rendering settings for:', contactFormId, config);
        
        return `
            <div style="display: flex; flex-direction: column; height: 100%; position: relative; overflow: hidden;">
                <div class="sidebar-view-header" style="position: relative; z-index: 10;">
                    <button class="back-to-sections-btn">
                        <i class="material-icons">arrow_back</i>
                    </button>
                    <h3>Contact form</h3>
                </div>
                
                <div style="padding: 15px; overflow-y: auto; overflow-x: hidden; flex: 1; height: calc(100% - 60px); box-sizing: border-box;">
                
                <!-- Style CSS for modern UI -->
                <style>
                    .contact-form-settings {
                        font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
                        width: 100%;
                    }
                    
                    .contact-form-settings * {
                        box-sizing: border-box;
                    }
                    
                    .settings-section {
                        background: #ffffff;
                        border: 1px solid #e3e3e3;
                        border-radius: 8px;
                        margin-bottom: 20px;
                        overflow: hidden;
                        width: 100%;
                        box-sizing: border-box;
                    }
                    
                    .settings-section-header {
                        background: #f7f7f7;
                        padding: 16px 20px;
                        border-bottom: 1px solid #e3e3e3;
                        font-weight: 600;
                        font-size: 14px;
                        color: #303030;
                    }
                    
                    .settings-field {
                        padding: 16px 20px;
                        border-bottom: 1px solid #f0f0f0;
                        width: 100%;
                        box-sizing: border-box;
                    }
                    
                    .settings-field:last-child {
                        border-bottom: none;
                    }
                    
                    .settings-field label {
                        display: block;
                        font-size: 13px;
                        font-weight: 500;
                        color: #303030;
                        margin-bottom: 8px;
                    }
                    
                    .shopify-select {
                        width: 100%;
                        padding: 8px 12px;
                        border: 1px solid #d9d9d9;
                        border-radius: 4px;
                        font-size: 14px;
                        color: #303030;
                        background-color: #ffffff;
                        transition: border-color 0.15s ease;
                        cursor: pointer;
                    }
                    
                    .shopify-select:hover {
                        border-color: #8c8c8c;
                    }
                    
                    .shopify-select:focus {
                        outline: none;
                        border-color: #2962ff;
                        box-shadow: 0 0 0 1px #2962ff;
                    }
                    
                    .help-link {
                        display: inline-block;
                        margin-top: 6px;
                        font-size: 12px;
                        color: #2962ff;
                        text-decoration: none;
                    }
                    
                    .help-link:hover {
                        text-decoration: underline;
                    }
                    
                    .edit-icon-btn {
                        padding: 6px;
                        border: 1px solid #d9d9d9;
                        border-radius: 4px;
                        background: #ffffff;
                        cursor: pointer;
                        transition: all 0.15s ease;
                    }
                    
                    .edit-icon-btn:hover {
                        background: #f7f7f7;
                        border-color: #8c8c8c;
                    }
                    
                    .edit-icon-btn i {
                        font-size: 18px;
                        color: #303030;
                    }
                    
                    .text-editor-field {
                        width: 100% !important;
                        min-height: 120px;
                        padding: 12px 14px;
                        border: 1px solid #d9d9d9;
                        border-radius: 4px;
                        font-size: 14px;
                        line-height: 1.6;
                        resize: vertical;
                        transition: border-color 0.15s ease;
                        font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
                        box-sizing: border-box;
                        display: block;
                    }
                    
                    .text-editor-field.heading-field {
                        min-height: 60px;
                    }
                    
                    .text-editor-field.body-field {
                        min-height: 100px;
                    }
                    
                    .text-editor-field:focus {
                        outline: none;
                        border-color: #2962ff;
                        box-shadow: 0 0 0 1px #2962ff;
                    }
                    
                    .editor-toolbar {
                        display: flex;
                        gap: 4px;
                        padding: 8px;
                        background: #f7f7f7;
                        border: 1px solid #d9d9d9;
                        border-bottom: none;
                        border-radius: 4px 4px 0 0;
                        width: 100%;
                        box-sizing: border-box;
                    }
                    
                    .editor-btn {
                        padding: 4px 8px;
                        border: 1px solid transparent;
                        border-radius: 3px;
                        background: transparent;
                        cursor: pointer;
                        font-size: 14px;
                        color: #303030;
                        transition: all 0.15s ease;
                    }
                    
                    .editor-btn:hover {
                        background: #e3e3e3;
                    }
                    
                    .editor-btn.active {
                        background: #2962ff;
                        color: white;
                    }
                    
                    .button-group {
                        display: flex;
                        gap: 0;
                        border: 1px solid #d9d9d9;
                        border-radius: 4px;
                        overflow: hidden;
                    }
                    
                    .button-group button {
                        flex: 1;
                        padding: 8px 16px;
                        border: none;
                        background: #ffffff;
                        color: #303030;
                        font-size: 14px;
                        cursor: pointer;
                        transition: all 0.15s ease;
                    }
                    
                    .button-group button:not(:last-child) {
                        border-right: 1px solid #d9d9d9;
                    }
                    
                    .button-group button:hover {
                        background: #f7f7f7;
                    }
                    
                    .button-group button.active {
                        background: #2962ff;
                        color: white;
                    }
                    
                    
                    
                    .slider-field {
                        margin-top: 12px;
                    }
                    
                    .slider-container {
                        display: flex;
                        align-items: center;
                        gap: 12px;
                    }
                    
                    .slider-input {
                        flex: 1;
                        -webkit-appearance: none;
                        height: 4px;
                        background: #e3e3e3;
                        border-radius: 2px;
                        outline: none;
                    }
                    
                    .slider-input::-webkit-slider-thumb {
                        -webkit-appearance: none;
                        appearance: none;
                        width: 16px;
                        height: 16px;
                        background: #2962ff;
                        border-radius: 50%;
                        cursor: pointer;
                    }
                    
                    .slider-input::-moz-range-thumb {
                        width: 16px;
                        height: 16px;
                        background: #2962ff;
                        border-radius: 50%;
                        cursor: pointer;
                        border: none;
                    }
                    
                    .slider-value {
                        min-width: 45px;
                        padding: 4px 8px;
                        background: #f7f7f7;
                        border: 1px solid #d9d9d9;
                        border-radius: 4px;
                        font-size: 13px;
                        text-align: center;
                    }
                </style>
                
                <div class="contact-form-settings">
                    <!-- Appearance Section -->
                    <div class="settings-section">
                        <div class="settings-section-header">
                            Appearance
                        </div>
                        
                        <!-- Color scheme -->
                        <div class="settings-field">
                            <label data-i18n="settings.colorScheme">Color scheme</label>
                            <select id="contact-form-color-scheme" class="shopify-select">
                                <option value="scheme1" ${config.colorScheme === 'scheme1' ? 'selected' : ''}>Scheme 1</option>
                                <option value="scheme2" ${config.colorScheme === 'scheme2' ? 'selected' : ''}>Scheme 2</option>
                                <option value="scheme3" ${config.colorScheme === 'scheme3' ? 'selected' : ''}>Scheme 3</option>
                                <option value="scheme4" ${config.colorScheme === 'scheme4' ? 'selected' : ''}>Scheme 4</option>
                                <option value="scheme5" ${config.colorScheme === 'scheme5' ? 'selected' : ''}>Scheme 5</option>
                            </select>
                            <a href="#" class="help-link" data-i18n="settings.learnAboutColorSchemes">Learn about color schemes</a>
                        </div>
                        
                        <!-- Width -->
                        <div class="settings-field">
                            <label data-i18n="settings.width">Width</label>
                            <select id="contact-form-width" class="shopify-select">
                                <option value="extra-small" ${config.width === 'extra-small' ? 'selected' : ''}>Extra small</option>
                                <option value="narrow" ${config.width === 'narrow' ? 'selected' : ''}>Narrow</option>
                                <option value="page" ${config.width === 'page' ? 'selected' : ''}>Page</option>
                                <option value="full" ${config.width === 'full' ? 'selected' : ''}>Full</option>
                            </select>
                        </div>
                    </div>
                    
                    <!-- Content Section -->
                    <div class="settings-section">
                        <div class="settings-section-header">
                            Content
                        </div>
                        
                        <!-- Heading -->
                        <div class="settings-field">
                            <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 8px;">
                                <label data-i18n="settings.heading" style="margin-bottom: 0;">Heading</label>
                                <button class="edit-icon-btn" onclick="window.WebsiteBuilderModules.ContactForm.openTextEditor('heading')" title="Open text editor" style="margin-top: 0;">
                                    <i class="material-icons">edit</i>
                                </button>
                            </div>
                            <textarea 
                                id="contact-form-heading"
                                class="text-editor-field heading-field"
                                placeholder="Enter your heading text..."
                            >${config.heading || ''}</textarea>
                        </div>
                        
                        <!-- Body -->
                        <div class="settings-field">
                            <label data-i18n="settings.body">Body</label>
                            <div class="editor-toolbar">
                                <button 
                                    id="bold-btn"
                                    class="editor-btn"
                                    title="Bold"
                                ><i class="material-icons" style="font-size: 16px;">format_bold</i></button>
                                <button 
                                    id="italic-btn"
                                    class="editor-btn"
                                    title="Italic"
                                ><i class="material-icons" style="font-size: 16px;">format_italic</i></button>
                                <button 
                                    id="link-btn"
                                    class="editor-btn"
                                    title="Link"
                                ><i class="material-icons" style="font-size: 16px;">link</i></button>
                            </div>
                            <textarea 
                                id="contact-form-body"
                                class="text-editor-field body-field"
                                style="border-radius: 0 0 4px 4px; margin-top: -1px;"
                                placeholder="Enter your body text..."
                            >${config.body || ''}</textarea>
                        </div>
                        
                        <!-- Heading size -->
                        <div class="settings-field">
                            <label data-i18n="settings.headingSize">Heading size</label>
                            <select id="contact-form-heading-size" class="shopify-select">
                                <option value="h1" ${config.headingSize === 'h1' ? 'selected' : ''}>Extra large (H1)</option>
                                <option value="h2" ${config.headingSize === 'h2' ? 'selected' : ''}>Large (H2)</option>
                                <option value="h3" ${config.headingSize === 'h3' ? 'selected' : ''}>Medium large (H3)</option>
                                <option value="h4" ${config.headingSize === 'h4' ? 'selected' : ''}>Medium (H4)</option>
                                <option value="h5" ${config.headingSize === 'h5' ? 'selected' : ''}>Small (H5)</option>
                                <option value="h6" ${config.headingSize === 'h6' ? 'selected' : ''}>Extra small (H6)</option>
                            </select>
                        </div>
                        
                        <!-- Body size -->
                        <div class="settings-field">
                            <label data-i18n="settings.bodySize">Body size</label>
                            <select id="contact-form-body-size" class="shopify-select">
                                <option value="0" ${config.bodySize === '0' ? 'selected' : ''}>Extra small</option>
                                <option value="1" ${config.bodySize === '1' ? 'selected' : ''}>Small</option>
                                <option value="2" ${config.bodySize === '2' ? 'selected' : ''}>Medium</option>
                                <option value="3" ${config.bodySize === '3' ? 'selected' : ''}>Large (Default)</option>
                                <option value="4" ${config.bodySize === '4' ? 'selected' : ''}>Extra large</option>
                            </select>
                        </div>
                        
                        <!-- Content alignment -->
                        <div class="settings-field">
                            <label data-i18n="settings.contentAlignment">Content alignment</label>
                            <div class="button-group">
                                <button 
                                    data-align="left"
                                    class="${config.contentAlignment === 'left' ? 'active' : ''}"
                                    onclick="window.WebsiteBuilderModules.ContactForm.setAlignment('${contactFormId}', 'left')"
                                >
                                    <i class="material-icons" style="font-size: 16px;">format_align_left</i>
                                </button>
                                <button 
                                    data-align="center"
                                    class="${config.contentAlignment === 'center' ? 'active' : ''}"
                                    onclick="window.WebsiteBuilderModules.ContactForm.setAlignment('${contactFormId}', 'center')"
                                >
                                    <i class="material-icons" style="font-size: 16px;">format_align_center</i>
                                </button>
                                <button 
                                    data-align="right"
                                    class="${config.contentAlignment === 'right' ? 'active' : ''}"
                                    onclick="window.WebsiteBuilderModules.ContactForm.setAlignment('${contactFormId}', 'right')"
                                >
                                    <i class="material-icons" style="font-size: 16px;">format_align_right</i>
                                </button>
                            </div>
                        </div>
                    </div>
                    
                    <!-- Form Section -->
                    <div class="settings-section">
                        <div class="settings-section-header">
                            Form
                        </div>
                        
                        <!-- Input style -->
                        <div class="settings-field">
                            <label data-i18n="settings.inputStyle">Input style</label>
                            <div class="button-group">
                                <button 
                                    data-style="solid"
                                    class="${config.inputStyle === 'solid' || !config.inputStyle ? 'active' : ''}"
                                    onclick="window.WebsiteBuilderModules.ContactForm.setInputStyle('${contactFormId}', 'solid')"
                                >
                                    Solid
                                </button>
                                <button 
                                    data-style="outline"
                                    class="${config.inputStyle === 'outline' ? 'active' : ''}"
                                    onclick="window.WebsiteBuilderModules.ContactForm.setInputStyle('${contactFormId}', 'outline')"
                                >
                                    Outline
                                </button>
                            </div>
                        </div>
                        
                        <!-- Show phone number input -->
                        <div class="settings-field">
                            <label style="display: flex; align-items: center; justify-content: space-between;">
                                <span data-i18n="settings.showPhoneNumber">Show phone number input</span>
                                <div style="position: relative; display: inline-block;">
                                    <input 
                                        type="checkbox" 
                                        id="contact-form-show-phone"
                                        class="shopify-toggle"
                                        ${config.showPhoneNumber ? 'checked' : ''}
                                    />
                                    <label for="contact-form-show-phone" class="toggle-slider"></label>
                                </div>
                            </label>
                        </div>
                        
                        <!-- Show reCAPTCHA terms -->
                        <div class="settings-field">
                            <label style="display: flex; align-items: center; justify-content: space-between;">
                                <span data-i18n="settings.showRecaptcha">Show reCAPTCHA terms</span>
                                <div style="position: relative; display: inline-block;">
                                    <input 
                                        type="checkbox" 
                                        id="contact-form-show-recaptcha"
                                        class="shopify-toggle"
                                        ${config.showRecaptcha ? 'checked' : ''}
                                    />
                                    <label for="contact-form-show-recaptcha" class="toggle-slider"></label>
                                </div>
                            </label>
                        </div>
                    </div>
                    
                    <!-- Paddings Section -->
                    <div class="settings-section">
                        <div class="settings-section-header">
                            Paddings
                        </div>
                        
                        <!-- Add side paddings -->
                        <div class="settings-field">
                            <label style="display: flex; align-items: center; justify-content: space-between;">
                                <span data-i18n="settings.addSidePaddings">Add side paddings</span>
                                <div style="position: relative; display: inline-block;">
                                    <input 
                                        type="checkbox" 
                                        id="contact-form-side-paddings"
                                        class="shopify-toggle"
                                        ${config.addSidePaddings !== false ? 'checked' : ''}
                                    />
                                    <label for="contact-form-side-paddings" class="toggle-slider"></label>
                                </div>
                            </label>
                        </div>
                        
                        <!-- Top padding -->
                        <div class="settings-field">
                            <label data-i18n="settings.topPadding">Top padding</label>
                            <div class="slider-container">
                                <input 
                                    type="range" 
                                    id="contact-form-padding-top"
                                    class="slider-input"
                                    min="0" 
                                    max="120" 
                                    value="${config.paddingTop || 40}"
                                />
                                <div class="slider-value" id="contact-form-padding-top-value">${config.paddingTop || 40}px</div>
                            </div>
                        </div>
                        
                        <!-- Bottom padding -->
                        <div class="settings-field">
                            <label data-i18n="settings.bottomPadding">Bottom padding</label>
                            <div class="slider-container">
                                <input 
                                    type="range" 
                                    id="contact-form-padding-bottom"
                                    class="slider-input"
                                    min="0" 
                                    max="120" 
                                    value="${config.paddingBottom || 40}"
                                />
                                <div class="slider-value" id="contact-form-padding-bottom-value">${config.paddingBottom || 40}px</div>
                            </div>
                        </div>
                    </div>
                
                </div>
            </div>
        `;
    },
    
    // Attach event listeners
    attachEventListeners: function(data) {
        const { contactFormId } = data;
        console.log('[CONTACT-FORM] Attaching event listeners for:', contactFormId);
        
        // Back button - CRÍTICO: usar la clase correcta
        $('.back-to-sections-btn').off('click.contactForm').on('click.contactForm', function() {
            window.switchSidebarView('blockList');
            // Contact forms are now rendered by renderTemplateSections in switchSidebarView
        });
        
        // Color scheme
        $('#contact-form-color-scheme').off('change.contactForm').on('change.contactForm', function() {
            const newScheme = $(this).val();
            if (window.currentSectionsConfig.contactForms && window.currentSectionsConfig.contactForms[contactFormId]) {
                window.currentSectionsConfig.contactForms[contactFormId].colorScheme = newScheme;
                window.WebsiteBuilderModules.ContactForm.updateAndRender(contactFormId);
            }
        });
        
        // Width
        $('#contact-form-width').off('change.contactForm').on('change.contactForm', function() {
            if (window.currentSectionsConfig.contactForms && window.currentSectionsConfig.contactForms[contactFormId]) {
                window.currentSectionsConfig.contactForms[contactFormId].width = $(this).val();
                window.WebsiteBuilderModules.ContactForm.updateAndRender(contactFormId);
            }
        });
        
        // Heading
        $('#contact-form-heading').off('input.contactForm').on('input.contactForm', function() {
            if (window.currentSectionsConfig.contactForms && window.currentSectionsConfig.contactForms[contactFormId]) {
                window.currentSectionsConfig.contactForms[contactFormId].heading = $(this).val();
                window.WebsiteBuilderModules.ContactForm.updateAndRender(contactFormId);
            }
        });
        
        // Body
        $('#contact-form-body').off('input.contactForm').on('input.contactForm', function() {
            if (window.currentSectionsConfig.contactForms && window.currentSectionsConfig.contactForms[contactFormId]) {
                window.currentSectionsConfig.contactForms[contactFormId].body = $(this).val();
                window.WebsiteBuilderModules.ContactForm.updateAndRender(contactFormId);
            }
        });
        
        // Heading size
        $('#contact-form-heading-size').off('change.contactForm').on('change.contactForm', function() {
            if (window.currentSectionsConfig.contactForms && window.currentSectionsConfig.contactForms[contactFormId]) {
                window.currentSectionsConfig.contactForms[contactFormId].headingSize = $(this).val();
                window.WebsiteBuilderModules.ContactForm.updateAndRender(contactFormId);
            }
        });
        
        // Body size
        $('#contact-form-body-size').off('change.contactForm').on('change.contactForm', function() {
            if (window.currentSectionsConfig.contactForms && window.currentSectionsConfig.contactForms[contactFormId]) {
                window.currentSectionsConfig.contactForms[contactFormId].bodySize = $(this).val();
                window.WebsiteBuilderModules.ContactForm.updateAndRender(contactFormId);
            }
        });
        
        // Content alignment
        $('.alignment-button').off('click.contactForm').on('click.contactForm', function() {
            $('.alignment-button').removeClass('active');
            $(this).addClass('active');
            if (window.currentSectionsConfig.contactForms && window.currentSectionsConfig.contactForms[contactFormId]) {
                window.currentSectionsConfig.contactForms[contactFormId].contentAlignment = $(this).data('alignment');
                window.WebsiteBuilderModules.ContactForm.updateAndRender(contactFormId);
            }
        });
        
        // Input style
        $('.style-button').off('click.contactForm').on('click.contactForm', function() {
            $('.style-button').removeClass('active').css({
                'background': '#fff',
                'color': '#333'
            });
            $(this).addClass('active').css({
                'background': '#333',
                'color': '#fff'
            });
            if (window.currentSectionsConfig.contactForms && window.currentSectionsConfig.contactForms[contactFormId]) {
                window.currentSectionsConfig.contactForms[contactFormId].inputStyle = $(this).data('style');
                window.WebsiteBuilderModules.ContactForm.updateAndRender(contactFormId);
            }
        });
        
        // Show phone number
        $('#contact-form-show-phone').off('change.contactForm').on('change.contactForm', function() {
            if (window.currentSectionsConfig.contactForms && window.currentSectionsConfig.contactForms[contactFormId]) {
                window.currentSectionsConfig.contactForms[contactFormId].showPhoneNumber = $(this).is(':checked');
                window.WebsiteBuilderModules.ContactForm.updateAndRender(contactFormId);
            }
        });
        
        // Show reCAPTCHA
        $('#contact-form-show-recaptcha').off('change.contactForm').on('change.contactForm', function() {
            if (window.currentSectionsConfig.contactForms && window.currentSectionsConfig.contactForms[contactFormId]) {
                window.currentSectionsConfig.contactForms[contactFormId].showRecaptcha = $(this).is(':checked');
                window.WebsiteBuilderModules.ContactForm.updateAndRender(contactFormId);
            }
        });
        
        // Side paddings
        $('#contact-form-side-paddings').off('change.contactForm').on('change.contactForm', function() {
            if (window.currentSectionsConfig.contactForms && window.currentSectionsConfig.contactForms[contactFormId]) {
                window.currentSectionsConfig.contactForms[contactFormId].addSidePaddings = $(this).is(':checked');
                window.WebsiteBuilderModules.ContactForm.updateAndRender(contactFormId);
            }
        });
        
        // Top padding
        $('#contact-form-padding-top').off('input.contactForm').on('input.contactForm', function() {
            const value = $(this).val();
            $('#contact-form-padding-top-value').text(value + 'px');
            if (window.currentSectionsConfig.contactForms && window.currentSectionsConfig.contactForms[contactFormId]) {
                window.currentSectionsConfig.contactForms[contactFormId].paddingTop = parseInt(value);
                window.WebsiteBuilderModules.ContactForm.updateAndRender(contactFormId);
            }
        });
        
        // Bottom padding
        $('#contact-form-padding-bottom').off('input.contactForm').on('input.contactForm', function() {
            const value = $(this).val();
            $('#contact-form-padding-bottom-value').text(value + 'px');
            if (window.currentSectionsConfig.contactForms && window.currentSectionsConfig.contactForms[contactFormId]) {
                window.currentSectionsConfig.contactForms[contactFormId].paddingBottom = parseInt(value);
                window.WebsiteBuilderModules.ContactForm.updateAndRender(contactFormId);
            }
        });
        
        // Rich text toolbar
        $('.toolbar-button').off('click.contactForm').on('click.contactForm', function(e) {
            e.preventDefault();
            const command = $(this).data('command');
            const textarea = $('#contact-form-body')[0];
            const start = textarea.selectionStart;
            const end = textarea.selectionEnd;
            const selectedText = textarea.value.substring(start, end);
            
            let newText = selectedText;
            if (command === 'bold') {
                newText = `**${selectedText}**`;
            } else if (command === 'italic') {
                newText = `*${selectedText}*`;
            } else if (command === 'link') {
                newText = `[${selectedText}](url)`;
            }
            
            textarea.value = textarea.value.substring(0, start) + newText + textarea.value.substring(end);
            if (window.currentSectionsConfig.contactForms && window.currentSectionsConfig.contactForms[contactFormId]) {
                window.currentSectionsConfig.contactForms[contactFormId].body = textarea.value;
                window.WebsiteBuilderModules.ContactForm.updateAndRender(contactFormId);
            }
        });
    },
    
    // Update and render
    updateAndRender: function(contactFormId) {
        console.log('[CONTACT-FORM] Updating and rendering:', contactFormId);
        
        // Mark as having changes - CRÍTICO: usar la función correcta
        window.setHasPendingPageStructureChanges(true);
        window.updateSaveButtonState();
        
        // Update preview
        if (window.renderPreview) {
            window.renderPreview();
        }
        
        // Update sidebar text if visible
        const sidebarElement = document.querySelector(`[data-element-id="${contactFormId}"] .section-content`);
        if (sidebarElement) {
            const config = window.currentSectionsConfig.contactForms[contactFormId];
            sidebarElement.innerHTML = `
                <div style="font-size: 14px; color: #333; margin-bottom: 4px;">
                    ${config.heading || 'Contact form'}
                </div>
                <div style="font-size: 12px; color: #666; opacity: 0.8;">
                    Click to configure
                </div>
            `;
        }
    },
    
    // Placeholder for text editor (to be implemented later)
    openTextEditor: function(field) {
        console.log('[CONTACT-FORM] Opening text editor for:', field);
        // TODO: Implement rich text editor modal
    },
    
    // Set alignment helper
    setAlignment: function(contactFormId, alignment) {
        if (window.currentSectionsConfig.contactForms && window.currentSectionsConfig.contactForms[contactFormId]) {
            window.currentSectionsConfig.contactForms[contactFormId].contentAlignment = alignment;
            
            // Update button states
            $('.button-group button[data-align]').removeClass('active');
            $(`.button-group button[data-align="${alignment}"]`).addClass('active');
            
            // Update and render
            this.updateAndRender(contactFormId);
        }
    },
    
    // Set input style helper
    setInputStyle: function(contactFormId, style) {
        if (window.currentSectionsConfig.contactForms && window.currentSectionsConfig.contactForms[contactFormId]) {
            window.currentSectionsConfig.contactForms[contactFormId].inputStyle = style;
            
            // Update button states
            $('.button-group button[data-style]').removeClass('active');
            $(`.button-group button[data-style="${style}"]`).addClass('active');
            
            // Update and render
            this.updateAndRender(contactFormId);
        }
    },
    
    // Reconstruct contact forms after page load
    reconstructContactForms: function() {
        console.log('[CONTACT-FORM] Reconstructing contact forms from saved config');
        
        if (!window.currentSectionsConfig || !window.currentSectionsConfig.contactForms) {
            console.log('[CONTACT-FORM] No contact forms found in config');
            return;
        }
        
        // Get the template sections container
        const templateContainer = document.getElementById('template-sections-container');
        if (!templateContainer) {
            console.log('[CONTACT-FORM] Template container not found, might not be in block list view');
            return;
        }
        
        // Process each contact form in sectionOrder
        const sectionOrder = window.currentSectionsConfig.sectionOrder || [];
        sectionOrder.forEach(sectionId => {
            if (sectionId.startsWith('contact-form-')) {
                const config = window.currentSectionsConfig.contactForms[sectionId];
                if (config) {
                    console.log('[CONTACT-FORM] Reconstructing contact form:', sectionId);
                    
                    // Check if element already exists
                    const existingElement = document.querySelector(`[data-element-id="${sectionId}"]`);
                    if (existingElement) {
                        console.log('[CONTACT-FORM] Element already exists, skipping:', sectionId);
                        return;
                    }
                    
                    // Create the sidebar element
                    const sidebarElement = `
                        <div class="sidebar-subsection" 
                             data-element-id="${sectionId}" 
                             data-block-type="contact-form"
                             data-section-id="${sectionId}">
                            <i class="material-icons drag-handle">drag_handle</i>
                            <span class="subsection-text">Contact form</span>
                            <div class="subsection-actions">
                                <button class="action-icon visibility-toggle ${config.isHidden ? 'is-hidden' : ''}" 
                                        data-element-id="${sectionId}"
                                        data-section="contact-form"
                                        title="Toggle visibility">
                                    <i class="material-icons icon-visible">visibility</i>
                                    <i class="material-icons icon-hidden">visibility_off</i>
                                </button>
                                <button class="action-icon delete-icon" 
                                        data-element-id="${sectionId}"
                                        data-section="contact-form" 
                                        title="Delete">
                                    <i class="material-icons">delete</i>
                                </button>
                            </div>
                        </div>
                    `;
                    
                    // Find the add button to insert before it
                    const addButton = templateContainer.querySelector('.add-section-button');
                    if (addButton && addButton.parentElement) {
                        addButton.parentElement.insertAdjacentHTML('beforebegin', sidebarElement);
                    } else {
                        templateContainer.insertAdjacentHTML('beforeend', sidebarElement);
                    }
                }
            }
        });
        
        console.log('[CONTACT-FORM] Reconstruction complete');
    }
};

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', function() {
    console.log('[CONTACT-FORM] Module loaded and ready');
});