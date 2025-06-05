// ========================================
// Admin Panel JavaScript
// ========================================

(function() {
    'use strict';

    // ========================================
    // Variables y Elementos DOM
    // ========================================
    
    const body = document.body;
    const sidebar = document.querySelector('.sidebar');
    const sidebarToggleBtn = document.querySelector('.sidebar-toggle-btn');
    const sidebarOverlay = document.createElement('div');
    
    // Configurar overlay para móviles
    sidebarOverlay.className = 'sidebar-overlay';
    body.appendChild(sidebarOverlay);

    // ========================================
    // Funcionalidad Toggle Sidebar
    // ========================================
    
    function toggleSidebar() {
        // Toggle clases
        sidebar.classList.toggle('active');
        sidebarOverlay.classList.toggle('active');
        body.classList.toggle('sidebar-open');
        
        // Actualizar aria-expanded
        const isExpanded = sidebar.classList.contains('active');
        sidebarToggleBtn.setAttribute('aria-expanded', isExpanded);
    }
    
    // Event listeners para sidebar
    if (sidebarToggleBtn) {
        sidebarToggleBtn.addEventListener('click', toggleSidebar);
    }
    
    // Cerrar sidebar al hacer clic en el overlay
    sidebarOverlay.addEventListener('click', toggleSidebar);
    
    // Cerrar sidebar con tecla Escape
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && sidebar.classList.contains('active')) {
            toggleSidebar();
        }
    });

    // ========================================
    // Funcionalidad Cambio de Tema
    // ========================================
    
    const THEME_KEY = 'hotel-admin-theme';
    const THEME_DARK = 'dark';
    const THEME_LIGHT = 'light';
    const themeSwitchInput = document.getElementById('theme-switch-input');
    
    function getCurrentTheme() {
        return localStorage.getItem(THEME_KEY) || THEME_LIGHT;
    }
    
    function setTheme(theme) {
        // Guardar en localStorage
        localStorage.setItem(THEME_KEY, theme);
        
        // Aplicar clase al body
        if (theme === THEME_DARK) {
            body.classList.add('theme-dark');
        } else {
            body.classList.remove('theme-dark');
        }
        
        // Sincronizar el switch
        if (themeSwitchInput) {
            themeSwitchInput.checked = theme === THEME_DARK;
        }
    }
    
    // Event listener para cambio de tema
    if (themeSwitchInput) {
        themeSwitchInput.addEventListener('change', function() {
            const newTheme = this.checked ? THEME_DARK : THEME_LIGHT;
            setTheme(newTheme);
        });
    }

    // ========================================
    // Funcionalidad Cambio de Color Primario
    // ========================================

    const COLOR_KEY = 'hotel-admin-primary-color';
    const COLOR_RGB_KEY = 'hotel-admin-primary-color-rgb';
    const colorOptions = document.querySelectorAll('.color-option');

    // Función para convertir hex a RGB
    function hexToRgb(hex) {
        const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
        return result ? {
            r: parseInt(result[1], 16),
            g: parseInt(result[2], 16),
            b: parseInt(result[3], 16)
        } : null;
    }

    // Función para obtener el color primario actual
    function getCurrentPrimaryColor() {
        return localStorage.getItem(COLOR_KEY) || '#7c3aed';
    }

    // Función para establecer el color primario
    function setPrimaryColor(color) {
        // Guardar en localStorage
        localStorage.setItem(COLOR_KEY, color);
        
        // Convertir a RGB
        const rgb = hexToRgb(color);
        if (rgb) {
            const rgbString = `${rgb.r}, ${rgb.g}, ${rgb.b}`;
            localStorage.setItem(COLOR_RGB_KEY, rgbString);
            
            // Actualizar variables CSS
            document.documentElement.style.setProperty('--primary-color', color);
            document.documentElement.style.setProperty('--primary-color-rgb', rgbString);
        }
        
        // Actualizar indicador activo
        colorOptions.forEach(option => {
            if (option.dataset.color === color) {
                option.classList.add('active');
            } else {
                option.classList.remove('active');
            }
        });
    }

    // Event listeners para opciones de color
    colorOptions.forEach(option => {
        option.addEventListener('click', function() {
            const color = this.dataset.color;
            setPrimaryColor(color);
            
            // Feedback visual
            this.style.transform = 'scale(0.9)';
            setTimeout(() => {
                this.style.transform = '';
            }, 100);
        });
        
        // Accesibilidad con teclado
        option.setAttribute('tabindex', '0');
        option.setAttribute('role', 'button');
        
        option.addEventListener('keydown', function(e) {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                this.click();
            }
        });
    });

    // ========================================
    // Template Customizer
    // ========================================

    const templateCustomizer = document.getElementById('template-customizer');
    const customizerToggleBtn = document.getElementById('customizer-toggle');
    const customizerCloseBtn = document.querySelector('.customizer-close');
    const customizerOverlay = document.getElementById('customizer-overlay');
    const layoutOptions = document.querySelectorAll('.layout-option');

    // ========================================
    // Funciones del Customizer
    // ========================================

    function openCustomizer() {
        templateCustomizer.classList.add('open');
        customizerOverlay.classList.add('show');
        customizerToggleBtn.classList.add('spin');
        document.body.style.overflow = 'hidden';
    }

    function closeCustomizer() {
        templateCustomizer.classList.remove('open');
        customizerOverlay.classList.remove('show');
        document.body.style.overflow = '';
    }

    // Event listeners para customizer
    if (customizerToggleBtn) {
        customizerToggleBtn.addEventListener('click', openCustomizer);
    }

    if (customizerCloseBtn) {
        customizerCloseBtn.addEventListener('click', closeCustomizer);
    }

    if (customizerOverlay) {
        customizerOverlay.addEventListener('click', closeCustomizer);
    }

    // Cerrar con tecla Escape
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && templateCustomizer.classList.contains('open')) {
            closeCustomizer();
        }
    });

    // ========================================
    // Layout Menu Functionality
    // ========================================

    const LAYOUT_KEY = 'hotel-admin-layout';
    const LAYOUT_VERTICAL = 'vertical';
    const LAYOUT_HORIZONTAL = 'horizontal';

    function getCurrentLayout() {
        return localStorage.getItem(LAYOUT_KEY) || LAYOUT_VERTICAL;
    }

    function setLayout(layout) {
        // Guardar en localStorage
        localStorage.setItem(LAYOUT_KEY, layout);
        
        // Actualizar clases del body
        if (layout === LAYOUT_HORIZONTAL) {
            body.classList.remove('layout-vertical');
            body.classList.add('layout-horizontal');
        } else {
            body.classList.remove('layout-horizontal');
            body.classList.add('layout-vertical');
        }
        
        // Actualizar indicador activo
        layoutOptions.forEach(option => {
            if (option.dataset.layout === layout) {
                option.classList.add('active');
            } else {
                option.classList.remove('active');
            }
        });
        
        // Cerrar sidebar si está abierta en móvil al cambiar a horizontal
        if (layout === LAYOUT_HORIZONTAL && sidebar && sidebar.classList.contains('active')) {
            toggleSidebar();
        }
    }

    // Event listeners para opciones de layout
    layoutOptions.forEach(option => {
        option.addEventListener('click', function() {
            const layout = this.dataset.layout;
            setLayout(layout);
        });
    });

    // ========================================
    // Language Selector
    // ========================================

    const LANGUAGE_KEY = 'hotel-admin-language';
    const languageSelector = document.getElementById('language-selector');
    const currentLangBtn = document.getElementById('current-lang-btn');
    const languageDropdown = document.getElementById('language-dropdown');
    const langOptions = document.querySelectorAll('.lang-option');

    // Idiomas disponibles
    const languages = {
        es: { flag: '🇪🇸', name: 'Español', code: 'ES' },
        en: { flag: '🇬🇧', name: 'English', code: 'EN' },
        fr: { flag: '🇫🇷', name: 'Français', code: 'FR' },
        de: { flag: '🇩🇪', name: 'Deutsch', code: 'DE' },
        pt: { flag: '🇵🇹', name: 'Português', code: 'PT' }
    };

    // Obtener idioma actual
    function getCurrentLanguage() {
        return localStorage.getItem(LANGUAGE_KEY) || 'es';
    }

    // Establecer idioma
    function setLanguage(langCode) {
        // Guardar en localStorage
        localStorage.setItem(LANGUAGE_KEY, langCode);
        
        // Actualizar el botón actual
        const lang = languages[langCode];
        if (lang && currentLangBtn) {
            const flagElement = currentLangBtn.querySelector('.lang-flag');
            const codeElement = currentLangBtn.querySelector('.lang-code');
            
            if (flagElement) flagElement.textContent = lang.flag;
            if (codeElement) codeElement.textContent = lang.code;
        }
        
        // Actualizar opción activa en el dropdown
        langOptions.forEach(option => {
            if (option.dataset.lang === langCode) {
                option.classList.add('active');
            } else {
                option.classList.remove('active');
            }
        });
        
        // Simulación de cambio de idioma
        console.log(`Idioma cambiado a: ${lang.name} (${langCode})`);
        
        // Aquí podrías disparar un evento personalizado para que otros componentes reaccionen
        window.dispatchEvent(new CustomEvent('languageChanged', { detail: { language: langCode } }));
    }

    // Toggle dropdown
    function toggleLanguageDropdown() {
        const isOpen = languageDropdown.hasAttribute('hidden');
        
        if (isOpen) {
            languageDropdown.removeAttribute('hidden');
            currentLangBtn.setAttribute('aria-expanded', 'true');
        } else {
            languageDropdown.setAttribute('hidden', '');
            currentLangBtn.setAttribute('aria-expanded', 'false');
        }
    }

    // Cerrar dropdown
    function closeLanguageDropdown() {
        languageDropdown.setAttribute('hidden', '');
        currentLangBtn.setAttribute('aria-expanded', 'false');
    }

    // Event listeners
    if (currentLangBtn) {
        currentLangBtn.addEventListener('click', function(e) {
            e.stopPropagation();
            toggleLanguageDropdown();
        });
    }

    // Opciones de idioma
    langOptions.forEach(option => {
        option.addEventListener('click', function(e) {
            e.stopPropagation();
            const langCode = this.dataset.lang;
            setLanguage(langCode);
            closeLanguageDropdown();
        });
    });

    // Cerrar dropdown al hacer clic fuera
    document.addEventListener('click', function(e) {
        if (languageSelector && !languageSelector.contains(e.target)) {
            closeLanguageDropdown();
        }
    });

    // ========================================
    // Inicialización
    // ========================================
    
    function init() {
        // Aplicar tema guardado
        const savedTheme = getCurrentTheme();
        setTheme(savedTheme);
        
        // Aplicar color primario guardado
        const savedColor = getCurrentPrimaryColor();
        setPrimaryColor(savedColor);
        
        // Aplicar layout guardado
        const savedLayout = getCurrentLayout();
        setLayout(savedLayout);
        
        // Aplicar idioma guardado
        const savedLanguage = getCurrentLanguage();
        setLanguage(savedLanguage);
        
        // Configurar estado inicial del sidebar toggle button
        if (sidebarToggleBtn) {
            sidebarToggleBtn.setAttribute('aria-expanded', 'false');
        }
        
        // Asegurar que el body tenga una clase de layout por defecto
        if (!body.classList.contains('layout-vertical') && !body.classList.contains('layout-horizontal')) {
            body.classList.add('layout-vertical');
        }
    }
    
    // Inicializar cuando el DOM esté listo
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

    // ========================================
    // Sincronización entre pestañas
    // ========================================

    window.addEventListener('storage', function(e) {
        if (e.key === COLOR_KEY && e.newValue) {
            setPrimaryColor(e.newValue);
        } else if (e.key === THEME_KEY && e.newValue) {
            setTheme(e.newValue);
        } else if (e.key === LAYOUT_KEY && e.newValue) {
            setLayout(e.newValue);
        } else if (e.key === LANGUAGE_KEY && e.newValue) {
            setLanguage(e.newValue);
        }
    });

    // ========================================
    // API pública
    // ========================================

    window.adminPanel = window.adminPanel || {};
    window.adminPanel.setPrimaryColor = setPrimaryColor;
    window.adminPanel.setTheme = setTheme;
    window.adminPanel.setLayout = setLayout;
    window.adminPanel.setLanguage = setLanguage;
    window.adminPanel.openCustomizer = openCustomizer;
    window.adminPanel.closeCustomizer = closeCustomizer;

})();