// Materialize Admin JS
(function() {
    'use strict';

    // Template Customizer
    const customizer = document.getElementById('template-customizer');
    const customizerToggle = document.getElementById('customizer-toggle');
    const customizerClose = document.querySelector('.customizer-close');
    
    if (customizerToggle) {
        customizerToggle.addEventListener('click', () => {
            customizer.classList.add('open');
        });
    }
    
    if (customizerClose) {
        customizerClose.addEventListener('click', () => {
            customizer.classList.remove('open');
        });
    }

    // Color options
    const colorOptions = document.querySelectorAll('.color-option');
    colorOptions.forEach(option => {
        option.addEventListener('click', function() {
            // Remove active class from all
            colorOptions.forEach(opt => opt.classList.remove('active'));
            // Add active to clicked
            this.classList.add('active');
            
            // Update primary color
            const color = this.dataset.color;
            document.documentElement.style.setProperty('--primary-color', color);
            
            // Save to localStorage
            localStorage.setItem('primary-color', color);
        });
    });

    // Theme options
    const themeOptions = document.querySelectorAll('.theme-option');
    themeOptions.forEach(option => {
        option.addEventListener('click', function() {
            // Remove active class from all
            themeOptions.forEach(opt => opt.classList.remove('active'));
            // Add active to clicked
            this.classList.add('active');
            
            const theme = this.dataset.theme;
            // Here you would implement theme switching logic
            console.log('Theme selected:', theme);
        });
    });

    // Menu toggle for submenu
    const menuToggles = document.querySelectorAll('.menu-toggle');
    menuToggles.forEach(toggle => {
        toggle.addEventListener('click', function(e) {
            e.preventDefault();
            const parent = this.parentElement;
            const submenu = parent.querySelector('.menu-sub');
            
            if (submenu) {
                parent.classList.toggle('open');
                submenu.style.display = parent.classList.contains('open') ? 'block' : 'none';
            }
        });
    });

    // Load saved color
    const savedColor = localStorage.getItem('primary-color');
    if (savedColor) {
        document.documentElement.style.setProperty('--primary-color', savedColor);
        // Update active color option
        colorOptions.forEach(opt => {
            if (opt.dataset.color === savedColor) {
                opt.classList.add('active');
            } else {
                opt.classList.remove('active');
            }
        });
    }

    // Search shortcut (Ctrl+K)
    document.addEventListener('keydown', function(e) {
        if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
            e.preventDefault();
            const searchInput = document.querySelector('.search-input');
            if (searchInput) {
                searchInput.focus();
            }
        }
    });

})();