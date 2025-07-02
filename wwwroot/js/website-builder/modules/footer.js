window.WebsiteBuilderModules = window.WebsiteBuilderModules || {};

window.WebsiteBuilderModules.Footer = {
    render: function(config) {
        if (!config || config.isHidden) return '';
        
        console.log('[FOOTER DEBUG] Rendering with config:', config);
        console.log('[FOOTER DEBUG] Footer height:', config.footerHeight);
        
        const schemeColors = window.getColorSchemeValues ? window.getColorSchemeValues(config.colorScheme || 'scheme1') : {
            background: '#000000',
            text: '#ffffff',
            border: '#333333'
        };
        
        const uniqueId = 'footer-' + Date.now();
        const columnCount = config.desktopColumnCount || 4;
        const width = config.width || 'screen';
        const showSeparator = config.showSeparator !== false;
        const showBottomBar = config.showBottomBar !== false;
        const footerHeight = config.footerHeight || 300;
        
        console.log('[FOOTER DEBUG] Using height:', footerHeight);
        
        // Get typography settings
        const bodyTypography = window.currentGlobalThemeSettings?.typography?.body || {};
        const headingTypography = window.currentGlobalThemeSettings?.typography?.heading || {};
        
        const bodyFont = window.getFontNameFromValueSafe ? 
            window.getFontNameFromValueSafe(bodyTypography.font || 'helvetica') : 
            'Helvetica';
        
        const headingFont = window.getFontNameFromValueSafe ? 
            window.getFontNameFromValueSafe(headingTypography.font || 'helvetica') : 
            'Helvetica';
        
        // Use real blocks from configuration instead of mock data
        const blocks = config.blocks || {};
        const blockOrder = config.blockOrder || [];
        
        let html = `
            <style>
                #${uniqueId} {
                    background-color: ${config.useBackgroundColor !== false ? schemeColors.background : 'transparent'};
                    color: ${schemeColors.text};
                    font-family: ${bodyFont};
                    position: relative;
                    margin-top: auto;
                }
                
                #${uniqueId} {
                    min-height: ${footerHeight}px !important;
                    box-sizing: border-box;
                }
                
                #${uniqueId}.section-wrapper {
                    min-height: ${footerHeight}px !important;
                    height: auto !important;
                }
                
                #${uniqueId} .footer-container {
                    ${width === 'container' ? 'max-width: 1200px; margin: 0 auto;' : ''}
                    padding: 40px 20px 20px;
                    height: 100%;
                    display: flex;
                    flex-direction: column;
                    justify-content: space-between;
                    box-sizing: border-box;
                }
                
                #${uniqueId} .footer-grid {
                    display: grid;
                    grid-template-columns: repeat(${columnCount}, 1fr);
                    gap: 30px;
                    margin-bottom: 30px;
                }
                
                #${uniqueId} .footer-block {
                    min-height: 150px;
                }
                
                #${uniqueId} .footer-block-title {
                    font-family: ${headingFont};
                    font-size: 16px;
                    font-weight: 600;
                    margin-bottom: 15px;
                    color: ${schemeColors.text};
                }
                
                #${uniqueId} .footer-block-content {
                    font-size: 14px;
                    line-height: 1.6;
                    color: ${schemeColors.text};
                    opacity: 0.8;
                }
                
                #${uniqueId} .footer-separator {
                    border-top: 1px solid ${schemeColors.border};
                    margin: 30px 0;
                    opacity: 0.3;
                }
                
                #${uniqueId} .footer-bottom-bar {
                    padding: 24px 0;
                    border-top: 1px solid ${schemeColors.border};
                }
                
                #${uniqueId} .social-icons {
                    display: flex;
                    gap: 15px;
                }
                
                #${uniqueId} .social-icons a {
                    color: ${schemeColors.text};
                    font-size: 20px;
                    transition: opacity 0.3s;
                }
                
                #${uniqueId} .social-icons a:hover {
                    opacity: 0.7;
                    transform: translateY(-2px);
                }
                
                #${uniqueId} .social-icons a:hover i {
                    opacity: 1 !important;
                }
                
                #${uniqueId} .newsletter-form {
                    display: flex;
                    gap: 10px;
                    max-width: 300px;
                }
                
                #${uniqueId} .newsletter-input {
                    flex: 1;
                    padding: 10px 15px;
                    border: 1px solid ${schemeColors.border};
                    background: transparent;
                    color: ${schemeColors.text};
                    border-radius: 4px;
                }
                
                #${uniqueId} .newsletter-button {
                    padding: 10px 20px;
                    background: ${schemeColors.text};
                    color: ${schemeColors.background};
                    border: none;
                    border-radius: 4px;
                    cursor: pointer;
                    transition: opacity 0.3s;
                }
                
                #${uniqueId} .newsletter-button:hover {
                    opacity: 0.8;
                }
                
                #${uniqueId} .footer-logo {
                    text-align: center;
                }
                
                #${uniqueId} .footer-logo img {
                    max-height: 60px;
                    margin-bottom: 10px;
                }
                
                #${uniqueId} .footer-menu {
                    list-style: none;
                    padding: 0;
                    margin: 0;
                }
                
                #${uniqueId} .footer-menu li {
                    margin-bottom: 10px;
                }
                
                #${uniqueId} .footer-menu a {
                    color: ${schemeColors.text};
                    text-decoration: none;
                    opacity: 0.8;
                    transition: opacity 0.3s;
                }
                
                #${uniqueId} .footer-menu a:hover {
                    opacity: 1;
                }
                
                #${uniqueId} .payment-icons {
                    display: flex;
                    gap: 10px;
                    align-items: center;
                }
                
                #${uniqueId} .payment-icons img {
                    height: 30px;
                    opacity: 0.8;
                }
                
                @media (max-width: 768px) {
                    #${uniqueId} .footer-grid {
                        grid-template-columns: 1fr;
                        gap: 20px;
                    }
                    
                    #${uniqueId} .footer-bottom-bar {
                        flex-direction: column;
                        text-align: center;
                    }
                }
                
                /* Style the select dropdowns and their options */
                #${uniqueId} select {
                    background: ${schemeColors.background};
                    color: ${schemeColors.text};
                    border: 1px solid ${schemeColors.border};
                }
                
                #${uniqueId} select:focus {
                    outline: none;
                    border-color: ${schemeColors.text};
                }
                
                #${uniqueId} select option {
                    background-color: ${schemeColors.background};
                    color: ${schemeColors.text};
                    padding: 8px;
                }
                
                #${uniqueId} select option:hover,
                #${uniqueId} select option:checked {
                    background-color: ${schemeColors.text};
                    color: ${schemeColors.background};
                }
                
                /* For webkit browsers (Chrome, Safari) - dropdown styling */
                #${uniqueId} select::-webkit-inner-spin-button,
                #${uniqueId} select::-webkit-outer-spin-button {
                    -webkit-appearance: none;
                }
                
                /* Firefox dropdown styling */
                #${uniqueId} select {
                    -moz-appearance: none;
                    -webkit-appearance: none;
                    appearance: none;
                }
            </style>
            
            <footer id="${uniqueId}" class="section-wrapper" data-section-id="footer" style="min-height: ${footerHeight}px !important; display: flex; flex-direction: column; box-sizing: border-box;">
                <div class="section-header-tag">
                    <span class="material-symbols-outlined" style="font-size: 16px;">contact_support</span>
                    ${window.translations && window.translations[window.currentLanguage] ? 
                        (window.translations[window.currentLanguage]['sections.footer'] || 'Footer') : 
                        'Footer'}
                </div>
                <div class="footer-container" style="flex: 1;">
                    <div class="footer-grid">
                        ${window.WebsiteBuilderModules.Footer.renderBlocks(blocks, blockOrder, schemeColors, columnCount)}
                    </div>
                    
                    ${showSeparator ? '<div class="footer-separator"></div>' : ''}
                    
                    ${showBottomBar ? window.WebsiteBuilderModules.Footer.renderBottomBar(config, schemeColors) : ''}
                </div>
            </footer>
        `;
        
        return html;
    },
    
    renderBlocks: function(blocks, blockOrder, schemeColors, columnCount) {
        let html = '';
        
        // If no blocks, return empty
        if (!blockOrder || blockOrder.length === 0) {
            return '<div class="footer-block" style="text-align: center; color: #999;">No blocks added yet</div>';
        }
        
        // Render blocks based on column count
        blockOrder.forEach((blockId, index) => {
            const block = blocks[blockId];
            if (block && !block.isHidden) {
                html += window.WebsiteBuilderModules.Footer.renderBlock(block, schemeColors);
            }
        });
        
        // Add empty divs to complete the grid if needed
        const blocksRendered = blockOrder.filter(blockId => blocks[blockId] && !blocks[blockId].isHidden).length;
        const totalCells = columnCount === 3 ? 6 : 8; // 3 columns = 2 rows of 3, 4 columns = 2 rows of 4
        const emptyCellsNeeded = totalCells - blocksRendered;
        
        for (let i = 0; i < emptyCellsNeeded; i++) {
            html += '<div class="footer-block"></div>';
        }
        
        return html;
    },
    
    renderBlock: function(block, schemeColors) {
        let content = '';
        
        switch (block.type) {
            case 'text':
                content = `
                    ${block.heading || block.title ? `<h3 class="footer-block-title">${block.heading || block.title}</h3>` : ''}
                    <div class="footer-block-content">
                        ${(block.body || block.content || '').split('\n').join('<br>')}
                    </div>
                `;
                break;
                
            case 'menu':
                // Get real menu items if menuId is set
                let menuItems = [];
                
                console.log('[FOOTER] Rendering menu block with menuId:', block.menuId);
                console.log('[FOOTER] Available menus:', window.currentMenusData);
                
                // Check both sources for menu data - same as header
                let menusData = window.currentMenusData;
                if (!menusData || menusData.length === 0) {
                    console.log('[FOOTER] No menus in currentMenusData, checking globalThemeSettings');
                    if (window.currentGlobalThemeSettings && window.currentGlobalThemeSettings.menus) {
                        menusData = window.currentGlobalThemeSettings.menus;
                        console.log('[FOOTER] Found menus in globalThemeSettings:', menusData);
                    }
                }
                
                if (block.menuId && menusData && Array.isArray(menusData)) {
                    const selectedMenu = menusData.find(menu => menu.id === block.menuId);
                    if (selectedMenu) {
                        console.log('[FOOTER] Found menu:', selectedMenu.name);
                        
                        // Handle menu items - they might be in 'items' or 'menuItems' property
                        const items = selectedMenu.items || selectedMenu.menuItems || [];
                        console.log('[FOOTER] Menu items:', items);
                        
                        if (items.length > 0) {
                            menuItems = items
                                .filter(item => !item.isHidden && (!item.level || item.level === 1))
                                .sort((a, b) => (a.order || 0) - (b.order || 0))
                                .map(item => ({
                                    text: item.text || item.label || item.name || '',
                                    url: item.url || item.link || '#'
                                }));
                            console.log('[FOOTER] Processed menu items:', menuItems);
                        }
                    } else {
                        console.log('[FOOTER] Menu not found with id:', block.menuId);
                    }
                }
                
                // Don't show any items if no menu selected
                if (menuItems.length === 0) {
                    console.log('[FOOTER] No menu items to display');
                }
                
                content = `
                    ${block.heading || block.title ? `<h3 class="footer-block-title">${block.heading || block.title}</h3>` : ''}
                    ${menuItems.length > 0 ? `
                        <ul class="footer-menu">
                            ${menuItems.map(item => `<li><a href="${item.url}">${item.text}</a></li>`).join('')}
                        </ul>
                    ` : ''}
                `;
                break;
                
            case 'social':
            case 'social-media':
                // Build social icons based on enabled networks
                let socialIcons = '';
                
                if (block.socialMedia) {
                    // Get style settings
                    const iconStyle = block.socialMedia.iconStyle || 'monochrome';
                    const iconSize = block.socialMedia.iconSize || 'medium';
                    const iconSpacing = block.socialMedia.iconSpacing || 16;
                    
                    // Size mapping
                    const sizeMap = {
                        small: 20,
                        medium: 24,
                        large: 32
                    };
                    const size = sizeMap[iconSize];
                    
                    // Map of social networks to their Material Icons and brand colors
                    const socialIconMap = {
                        facebook: { icon: 'facebook', title: 'Facebook', color: '#1877F2' },
                        instagram: { icon: 'photo_camera', title: 'Instagram', color: '#E4405F' },
                        twitter: { icon: 'close', title: 'Twitter / X', color: '#1DA1F2' },
                        pinterest: { icon: 'push_pin', title: 'Pinterest', color: '#E60023' },
                        youtube: { icon: 'play_circle', title: 'YouTube', color: '#FF0000' },
                        tiktok: { icon: 'music_note', title: 'TikTok', color: '#000000' },
                        linkedin: { icon: 'work', title: 'LinkedIn', color: '#0A66C2' },
                        snapchat: { icon: 'camera_alt', title: 'Snapchat', color: '#FFFC00' }
                    };
                    
                    // SVG icons for brand colors style
                    const brandSvgIcons = {
                        facebook: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>',
                        instagram: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zM5.838 12a6.162 6.162 0 1112.324 0 6.162 6.162 0 01-12.324 0zM12 16a4 4 0 110-8 4 4 0 010 8zm4.965-10.405a1.44 1.44 0 112.881.001 1.44 1.44 0 01-2.881-.001z"/></svg>',
                        twitter: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>',
                        pinterest: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 0C5.373 0 0 5.372 0 12c0 5.084 3.163 9.426 7.627 11.174-.105-.949-.2-2.405.042-3.441.218-.937 1.407-5.965 1.407-5.965s-.359-.719-.359-1.782c0-1.668.967-2.914 2.171-2.914 1.023 0 1.518.769 1.518 1.69 0 1.029-.655 2.568-.994 3.995-.283 1.194.599 2.169 1.777 2.169 2.133 0 3.772-2.249 3.772-5.495 0-2.873-2.064-4.882-5.012-4.882-3.414 0-5.418 2.561-5.418 5.207 0 1.031.397 2.138.893 2.738a.36.36 0 01.083.345l-.333 1.36c-.053.22-.174.267-.402.161-1.499-.698-2.436-2.889-2.436-4.649 0-3.785 2.75-7.262 7.929-7.262 4.163 0 7.398 2.967 7.398 6.931 0 4.136-2.607 7.464-6.227 7.464-1.216 0-2.359-.631-2.75-1.378l-.748 2.853c-.271 1.043-1.002 2.35-1.492 3.146C9.57 23.812 10.763 24 12 24c6.627 0 12-5.373 12-12 0-6.628-5.373-12-12-12z"/></svg>',
                        youtube: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/></svg>',
                        tiktok: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.15 1.07-.14 1.61.24 1.64 1.82 3.02 3.5 2.87 1.12-.01 2.19-.66 2.77-1.61.19-.33.4-.67.41-1.06.1-1.79.06-3.57.07-5.36.01-4.03-.01-8.05.02-12.07z"/></svg>',
                        linkedin: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg>',
                        snapchat: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M12.065.803c-.035 0-.07 0-.105.002C11.033.803 6.05.803 5.78 6.62c-.03.824-.035 1.647-.05 2.468-.007.198-.136.718-.4.718-.134 0-.268-.04-.402-.08-.203-.06-.406-.12-.61-.117a.708.708 0 00-.508.213.644.644 0 00-.065.79c.1.124.278.213.455.268.4.124.802.168 1.163.345.128.062.196.139.196.283 0 .044-.009.089-.018.134-.069.337-.468 1.864-1.614 3.032a4.296 4.296 0 01-.823.543c-.27.134-.54.224-.647.251-.017.004-.033.007-.042.008-.113.012-.197.021-.197.14 0 .11.07.19.14.22.172.073.506.096.778.117.293.023.532.041.638.091.047.022.078.057.09.124a.38.38 0 01-.019.196c-.087.24-.25.684-.283.835a.178.178 0 00.045.19c.062.053.151.065.256.065.157 0 .356-.029.616-.029.431 0 .991.068 1.576.316.88.323 1.295 1.304 2.748 1.304a3.29 3.29 0 00.923-.135 3.266 3.266 0 00.922.135c1.453 0 1.868-.98 2.75-1.304.584-.248 1.144-.316 1.574-.316.26 0 .459.029.616.029.105 0 .194-.012.256-.065a.178.178 0 00.046-.19c-.034-.15-.197-.595-.284-.835a.38.38 0 01-.018-.196c.011-.067.042-.102.09-.124.105-.05.344-.068.637-.091.273-.021.606-.044.778-.117.07-.03.14-.11.14-.22 0-.119-.084-.128-.197-.14-.01-.001-.025-.004-.042-.008a2.47 2.47 0 01-.647-.251 4.309 4.309 0 01-.824-.544c-1.146-1.167-1.545-2.694-1.613-3.03-.01-.046-.019-.091-.019-.136 0-.144.069-.22.196-.283.361-.177.763-.221 1.163-.345.177-.055.355-.144.455-.268a.644.644 0 00-.065-.79.708.708 0 00-.508-.213c-.204-.003-.407.057-.61.118-.134.04-.268.08-.402.08-.263 0-.392-.52-.4-.718-.014-.82-.019-1.644-.049-2.468C17.948.803 12.965.803 12.037.803h.028z"/></svg>'
                    };
                    
                    // Style-specific CSS
                    let iconStyleCss = '';
                    if (iconStyle === 'monochrome') {
                        iconStyleCss = `color: ${schemeColors.text}; opacity: 0.8;`;
                    } else if (iconStyle === 'outline') {
                        iconStyleCss = `
                            color: ${schemeColors.text};
                            border: 1px solid ${schemeColors.text};
                            border-radius: 50%;
                            padding: 8px;
                            width: ${size + 16}px;
                            height: ${size + 16}px;
                            display: inline-flex;
                            align-items: center;
                            justify-content: center;
                        `;
                    } else if (iconStyle === 'filled') {
                        iconStyleCss = `
                            color: ${schemeColors.background};
                            background-color: ${schemeColors.text};
                            border-radius: 50%;
                            padding: 8px;
                            width: ${size + 16}px;
                            height: ${size + 16}px;
                            display: inline-flex;
                            align-items: center;
                            justify-content: center;
                        `;
                    }
                    
                    // Add icons for enabled social networks
                    Object.entries(block.socialMedia).forEach(([network, data]) => {
                        if (data.enabled && socialIconMap[network]) {
                            const url = data.url || '#';
                            const { icon, title, color } = socialIconMap[network];
                            
                            // Use SVG for brand colors, Material Icons for others
                            if (iconStyle === 'color' && brandSvgIcons[network]) {
                                socialIcons += `
                                    <a href="${url}" 
                                       target="_blank" 
                                       rel="noopener noreferrer" 
                                       title="${title}"
                                       style="text-decoration: none; transition: all 0.3s ease; display: inline-block;">
                                        <span style="display: inline-block; width: ${size}px; height: ${size}px; color: ${color};">
                                            ${brandSvgIcons[network]}
                                        </span>
                                    </a>
                                `;
                            } else {
                                // Apply style for Material Icons
                                let individualStyle = iconStyleCss;
                                
                                socialIcons += `
                                    <a href="${url}" 
                                       target="_blank" 
                                       rel="noopener noreferrer" 
                                       title="${title}"
                                       style="text-decoration: none; transition: all 0.3s ease; ${iconStyle === 'outline' || iconStyle === 'filled' ? 'margin: 0 4px;' : ''}">
                                        <i class="material-icons" style="font-size: ${size}px; ${individualStyle} transition: all 0.3s ease;">${icon}</i>
                                    </a>
                                `;
                            }
                        }
                    });
                }
                
                content = `
                    ${block.heading || block.title ? `<h3 class="footer-block-title">${block.heading || block.title}</h3>` : ''}
                    ${socialIcons ? `<div class="social-icons" style="gap: ${block.socialMedia?.iconSpacing || 16}px;">${socialIcons}</div>` : ''}
                `;
                break;
                
            case 'logo-with-text':
                content = `
                    <div class="footer-logo">
                        ${block.logo ? `<img src="${block.logo}" alt="Logo" style="max-height: ${block.logoSize || 60}px; margin-bottom: 10px;">` : ''}
                        ${block.heading ? `<h3 class="footer-block-title">${block.heading}</h3>` : ''}
                        ${block.body ? `<div class="footer-block-content">${block.body}</div>` : ''}
                    </div>
                `;
                break;
                
            case 'subscribe':
                content = `
                    ${block.heading ? `<h3 class="footer-block-title">${block.heading}</h3>` : ''}
                    ${block.body ? `<div class="footer-block-content" style="margin-bottom: 15px;">${block.body}</div>` : ''}
                    <form class="newsletter-form" onsubmit="return false;">
                        <input type="email" class="newsletter-input" placeholder="Email" required>
                        <button type="submit" class="newsletter-button">Subscribe</button>
                    </form>
                `;
                break;
                
        }
        
        return `<div class="footer-block">${content}</div>`;
    },
    
    renderBottomBar: function(config, schemeColors) {
        return `
            <div class="footer-bottom-bar" style="
                border-top: 1px solid ${schemeColors.border};
                padding: 24px 0;
                margin-top: 40px;
            ">
                <div style="
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    flex-wrap: wrap;
                    gap: 24px;
                    margin-bottom: 24px;
                ">
                    <!-- Language and Currency Selectors -->
                    <div style="display: flex; gap: 12px; align-items: center;">
                        <select class="footer-select-language" style="
                            background-color: ${schemeColors.background};
                            color: ${schemeColors.text};
                            border: 1px solid ${schemeColors.border};
                            padding: 8px 32px 8px 12px;
                            border-radius: 4px;
                            font-size: 13px;
                            cursor: pointer;
                            appearance: none;
                            background-image: url('data:image/svg+xml;charset=UTF-8,%3Csvg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 12 12"%3E%3Cpath fill="%23${schemeColors.text.replace('#', '')}" d="M10.293 3.293L6 7.586 1.707 3.293A1 1 0 00.293 4.707l5 5a1 1 0 001.414 0l5-5a1 1 0 10-1.414-1.414z"/%3E%3C/svg%3E');
                            background-repeat: no-repeat;
                            background-position: right 12px center;
                        ">
                            <option value="es">Español</option>
                            <option value="en">English</option>
                        </select>
                        <select class="footer-select-currency" style="
                            background-color: ${schemeColors.background};
                            color: ${schemeColors.text};
                            border: 1px solid ${schemeColors.border};
                            padding: 8px 32px 8px 12px;
                            border-radius: 4px;
                            font-size: 13px;
                            cursor: pointer;
                            appearance: none;
                            background-image: url('data:image/svg+xml;charset=UTF-8,%3Csvg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 12 12"%3E%3Cpath fill="%23${schemeColors.text.replace('#', '')}" d="M10.293 3.293L6 7.586 1.707 3.293A1 1 0 00.293 4.707l5 5a1 1 0 001.414 0l5-5a1 1 0 10-1.414-1.414z"/%3E%3C/svg%3E');
                            background-repeat: no-repeat;
                            background-position: right 12px center;
                        ">
                            <option value="usd">USD</option>
                            <option value="eur">EUR</option>
                        </select>
                    </div>
                    
                    <!-- Copyright Text -->
                    <div style="
                        font-size: 12px;
                        color: ${schemeColors.text};
                        opacity: 0.7;
                        text-align: center;
                        flex: 1;
                    ">
                        ${config.copyrightText || 'Purrteam All Rights Reserved by Mango Pos Solutions LLC© Copyright 2022.'}
                    </div>
                    
                    <!-- Payment Icons -->
                    ${config.showPaymentIcons !== false ? `
                        <div style="display: flex; gap: 8px; align-items: center;">
                            ${(() => {
                                // Check if custom payment methods exist
                                if (config.paymentMethods && config.paymentMethods.length > 0) {
                                    // Render custom payment methods
                                    return config.paymentMethods.map(method => `
                                        <div style="width: ${method.size || 48}px; height: 32px; display: flex; align-items: center;">
                                            ${method.image ? `
                                                <img src="${method.image}" alt="${method.name}" style="
                                                    max-width: 100%;
                                                    max-height: 100%;
                                                    object-fit: contain;
                                                " title="${method.name}">
                                            ` : `
                                                <div style="
                                                    width: 100%;
                                                    height: 100%;
                                                    background: #f4f4f4;
                                                    border: 1px solid #e3e5e7;
                                                    border-radius: 4px;
                                                    display: flex;
                                                    align-items: center;
                                                    justify-content: center;
                                                    font-size: 10px;
                                                    color: #999;
                                                    text-align: center;
                                                    padding: 2px;
                                                ">${method.name}</div>
                                            `}
                                        </div>
                                    `).join('');
                                } else {
                                    // No default payment icons - show empty state
                                    return '';
                                }
                            })()}
                        </div>
                    ` : ''}
                </div>
                
                <!-- Policy Links -->
                <div style="
                    display: flex;
                    justify-content: center;
                    gap: 24px;
                    font-size: 12px;
                    padding-top: 20px;
                    border-top: 1px solid ${schemeColors.border};
                    opacity: 0.7;
                ">
                    <a href="#" style="
                        color: ${schemeColors.text};
                        text-decoration: none;
                        transition: opacity 0.2s;
                    " onmouseover="this.style.opacity='1'" onmouseout="this.style.opacity='0.7'">
                        Política de reembolso
                    </a>
                    <a href="#" style="
                        color: ${schemeColors.text};
                        text-decoration: none;
                        transition: opacity 0.2s;
                    " onmouseover="this.style.opacity='1'" onmouseout="this.style.opacity='0.7'">
                        Política de privacidad
                    </a>
                    <a href="#" style="
                        color: ${schemeColors.text};
                        text-decoration: none;
                        transition: opacity 0.2s;
                    " onmouseover="this.style.opacity='1'" onmouseout="this.style.opacity='0.7'">
                        Términos del servicio
                    </a>
                    <a href="#" style="
                        color: ${schemeColors.text};
                        text-decoration: none;
                        transition: opacity 0.2s;
                    " onmouseover="this.style.opacity='1'" onmouseout="this.style.opacity='0.7'">
                        Política de envío
                    </a>
                </div>
            </div>
        `;
    },
    
    renderSettings: function(config) {
        const configData = config || {};
        
        return `
            <div style="display: flex; flex-direction: column; height: 100%; position: relative; overflow: hidden;">
                <div class="sidebar-view-header" style="position: relative; z-index: 10;">
                    <button class="back-to-sections-btn">
                        <i class="material-icons">arrow_back</i>
                    </button>
                    <h3 data-i18n="footer.settings.title">Footer Settings</h3>
                </div>
                
                <div style="padding: 20px; overflow-y: auto; overflow-x: hidden; flex: 1; height: calc(100% - 60px); box-sizing: border-box;">
                    ${window.WebsiteBuilderModules.Footer.renderMainSettings(configData)}
                    ${window.WebsiteBuilderModules.Footer.renderBottomBarSettings(configData)}
                </div>
            </div>
        `;
    },
    
    renderMainSettings: function(config) {
        return `
            <div class="settings-group">
                <h4 style="font-size: 13px; font-weight: 500; margin-bottom: 12px; color: #5c5e60;">General</h4>
                
                <!-- Color scheme -->
                <div class="settings-field">
                    <label data-i18n="footer.colorScheme">Color scheme</label>
                    <select class="shopify-select" id="footer-color-scheme">
                        <option value="scheme1" ${config.colorScheme === 'scheme1' || !config.colorScheme ? 'selected' : ''}>Scheme 1</option>
                        <option value="scheme2" ${config.colorScheme === 'scheme2' ? 'selected' : ''}>Scheme 2</option>
                        <option value="scheme3" ${config.colorScheme === 'scheme3' ? 'selected' : ''}>Scheme 3</option>
                        <option value="scheme4" ${config.colorScheme === 'scheme4' ? 'selected' : ''}>Scheme 4</option>
                        <option value="scheme5" ${config.colorScheme === 'scheme5' ? 'selected' : ''}>Scheme 5</option>
                    </select>
                </div>
                
                <!-- Background color toggle -->
                <div class="settings-field">
                    <label style="display: flex; align-items: center; justify-content: space-between;">
                        <span data-i18n="footer.useBackgroundColor">Color background</span>
                        <div style="display: flex; align-items: center;">
                            <input type="checkbox" id="footer-use-background-color" class="shopify-toggle" ${config.useBackgroundColor !== false ? 'checked' : ''}>
                            <label for="footer-use-background-color" class="toggle-slider"></label>
                        </div>
                    </label>
                </div>
                
                <!-- Width -->
                <div class="settings-field">
                    <label data-i18n="footer.width">Width</label>
                    <select class="shopify-select" id="footer-width">
                        <option value="screen" ${config.width === 'screen' || !config.width ? 'selected' : ''}>Screen</option>
                        <option value="container" ${config.width === 'container' ? 'selected' : ''}>Container</option>
                    </select>
                </div>
                
                <!-- Desktop column count -->
                <div class="settings-field">
                    <label data-i18n="footer.desktopColumnCount">Desktop column count</label>
                    <div class="radio-group">
                        <label class="radio-label">
                            <input type="radio" name="footer-column-count" value="3" ${config.desktopColumnCount === 3 ? 'checked' : ''}>
                            <span>3</span>
                        </label>
                        <label class="radio-label">
                            <input type="radio" name="footer-column-count" value="4" ${config.desktopColumnCount === 4 || !config.desktopColumnCount ? 'checked' : ''}>
                            <span>4</span>
                        </label>
                    </div>
                </div>
                
                <!-- Show separator -->
                <div class="settings-field">
                    <label style="display: flex; align-items: center; justify-content: space-between;">
                        <span data-i18n="footer.showSeparator">Show separator</span>
                        <div style="display: flex; align-items: center;">
                            <input type="checkbox" id="footer-show-separator" class="shopify-toggle" ${config.showSeparator !== false ? 'checked' : ''}>
                            <label for="footer-show-separator" class="toggle-slider"></label>
                        </div>
                    </label>
                </div>
                
                <!-- Footer Height -->
                <div class="settings-field">
                    <label data-i18n="footer.height">Footer height</label>
                    <div style="
                        background: #f7f8f9;
                        border: 1px solid #e3e5e7;
                        border-radius: 8px;
                        padding: 16px;
                        margin-top: 8px;
                    ">
                        <input type="range" id="footer-height" min="200" max="600" step="20" value="${config.footerHeight || 300}" style="
                            width: 100%;
                            -webkit-appearance: none;
                            height: 6px;
                            background: #e3e5e7;
                            border-radius: 3px;
                            outline: none;
                            cursor: pointer;
                        ">
                        <div style="
                            display: flex;
                            justify-content: space-between;
                            align-items: center;
                            margin-top: 12px;
                        ">
                            <span style="font-size: 12px; color: #637381;">Compact</span>
                            <span id="footer-height-value" style="
                                font-size: 14px;
                                font-weight: 600;
                                color: #202223;
                                background: #fff;
                                padding: 4px 12px;
                                border-radius: 6px;
                                border: 1px solid #e3e5e7;
                            ">${config.footerHeight || 300}px</span>
                            <span style="font-size: 12px; color: #637381;">Spacious</span>
                        </div>
                    </div>
                </div>
            </div>
        `;
    },
    
    renderBottomBarSettings: function(config) {
        return `
            <div class="settings-group" style="margin-top: 30px;">
                <h4 style="font-size: 13px; font-weight: 500; margin-bottom: 12px; color: #5c5e60;">Bottom bar</h4>
                
                <!-- Show bottom bar -->
                <div class="settings-field">
                    <label style="display: flex; align-items: center; justify-content: space-between;">
                        <span data-i18n="footer.showBottomBar">Show bottom bar</span>
                        <div style="display: flex; align-items: center;">
                            <input type="checkbox" id="footer-show-bottom-bar" class="shopify-toggle" ${config.showBottomBar !== false ? 'checked' : ''}>
                            <label for="footer-show-bottom-bar" class="toggle-slider"></label>
                        </div>
                    </label>
                </div>
                
                <!-- Navigation menu -->
                <div class="settings-field">
                    <label data-i18n="footer.navigationMenu">Choose navigation menu</label>
                    <select class="shopify-select" id="footer-navigation-menu">
                        <option value="" ${!config.navigationMenu ? 'selected' : ''}>Menu without dropdown items</option>
                        <option value="footer-menu" ${config.navigationMenu === 'footer-menu' ? 'selected' : ''}>Footer menu</option>
                    </select>
                </div>
                
                <!-- Show payment icons -->
                <div class="settings-field">
                    <label style="display: flex; align-items: center; justify-content: space-between;">
                        <span data-i18n="footer.showPaymentIcons">Show payment icons</span>
                        <div style="display: flex; align-items: center;">
                            <input type="checkbox" id="footer-show-payment-icons" class="shopify-toggle" ${config.showPaymentIcons !== false ? 'checked' : ''}>
                            <label for="footer-show-payment-icons" class="toggle-slider"></label>
                        </div>
                    </label>
                </div>
                
                <!-- Configure Payment Methods Link -->
                <div class="settings-field" style="margin-top: -8px; margin-bottom: 16px; padding-left: 20px;">
                    <a href="#" id="configure-payment-methods" class="configure-link" style="
                        display: inline-flex;
                        align-items: center;
                        gap: 4px;
                        color: #2c6ecb;
                        text-decoration: none;
                        font-size: 13px;
                        transition: opacity 0.2s;
                    ">
                        <span data-i18n="footer.configurePaymentMethods">Configurar</span>
                        <i class="material-icons" style="font-size: 16px;">arrow_forward</i>
                    </a>
                </div>
                
                <!-- Copyright notice -->
                <div class="settings-field">
                    <label data-i18n="footer.copyrightNotice" style="display: block; margin-bottom: 8px;">Copyright notice</label>
                    <textarea 
                        id="footer-copyright-text" 
                        rows="5" 
                        style="
                            width: 100%; 
                            padding: 12px; 
                            border: 1px solid #c9cccf; 
                            border-radius: 4px;
                            font-size: 13px;
                            line-height: 1.5;
                            resize: vertical;
                            min-height: 100px;
                            font-family: inherit;
                            box-sizing: border-box;
                        "
                        placeholder="Enter your copyright notice..."
                    >${config.copyrightText || 'Purrteam All Rights Reserved by Mango Pos Solutions LLC© Copyright 2022.'}</textarea>
                </div>
            </div>
        `;
    },
    
    attachEventListeners: function() {
        const updateConfig = (key, value) => {
            console.log('[FOOTER DEBUG] updateConfig called:', key, value);
            
            if (window.currentSectionsConfig && window.currentSectionsConfig.footer) {
                window.currentSectionsConfig.footer[key] = value;
                console.log('[FOOTER DEBUG] Updated config:', window.currentSectionsConfig.footer);
                
                // Use the setter function to properly set the pending changes flag
                if (window.setHasPendingPageStructureChanges) {
                    window.setHasPendingPageStructureChanges(true);
                } else {
                    window.hasPendingPageStructureChanges = true;
                }
                
                // Update save button state
                if (window.updateSaveButtonState) {
                    window.updateSaveButtonState();
                }
                
                // Render preview
                if (window.renderPreview) {
                    console.log('[FOOTER DEBUG] Calling renderPreview...');
                    window.renderPreview();
                }
            }
        };
        
        // Back button
        $('.back-to-sections-btn').off('click').on('click', function() {
            window.switchSidebarView('blockList');
        });
        
        // Color scheme
        $('#footer-color-scheme').off('change').on('change', function() {
            updateConfig('colorScheme', $(this).val());
        });
        
        // Background color toggle
        $('#footer-use-background-color').off('change').on('change', function() {
            updateConfig('useBackgroundColor', $(this).is(':checked'));
        });
        
        // Width
        $('#footer-width').off('change').on('change', function() {
            updateConfig('width', $(this).val());
        });
        
        // Column count
        $('input[name="footer-column-count"]').off('change').on('change', function() {
            updateConfig('desktopColumnCount', parseInt($(this).val()));
        });
        
        // Show separator
        $('#footer-show-separator').off('change').on('change', function() {
            updateConfig('showSeparator', $(this).is(':checked'));
        });
        
        // Footer height
        $('#footer-height').off('input').on('input', function() {
            const value = $(this).val();
            console.log('[FOOTER DEBUG] Height slider changed to:', value);
            $('#footer-height-value').text(value + 'px');
            updateConfig('footerHeight', parseInt(value));
        });
        
        // Show bottom bar
        $('#footer-show-bottom-bar').off('change').on('change', function() {
            updateConfig('showBottomBar', $(this).is(':checked'));
        });
        
        // Navigation menu
        $('#footer-navigation-menu').off('change').on('change', function() {
            updateConfig('navigationMenu', $(this).val());
        });
        
        // Show payment icons
        $('#footer-show-payment-icons').off('change').on('change', function() {
            updateConfig('showPaymentIcons', $(this).is(':checked'));
        });
        
        // Configure payment methods link
        $('#configure-payment-methods').off('click').on('click', function(e) {
            e.preventDefault();
            window.switchSidebarView('paymentMethodsSettings');
        });
        
        // Apply hover effect to configure link
        $('#configure-payment-methods').hover(
            function() { $(this).css('text-decoration', 'underline'); },
            function() { $(this).css('text-decoration', 'none'); }
        );
        
        // Copyright text
        $('#footer-copyright-text').off('input').on('input', function() {
            updateConfig('copyrightText', $(this).val());
        });
        
        // Apply translations
        setTimeout(window.applyTranslations, 0);
    },
    
    initialize: function() {
        console.log('[FOOTER] Module initialized');
    }
};