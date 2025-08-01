// Payment Settings JavaScript
$(document).ready(function() {
    
    // Toggle gateway active/inactive
    $('.gateway-active-toggle').on('change', function() {
        const $toggle = $(this);
        const gatewayId = $toggle.data('gateway-id');
        const isActive = $toggle.is(':checked');
        
        // Disable toggle during request
        $toggle.prop('disabled', true);
        
        $.ajax({
            url: '/PaymentSettings/ToggleGateway',
            type: 'POST',
            data: {
                id: gatewayId,
                isActive: isActive,
                __RequestVerificationToken: $('input[name="__RequestVerificationToken"]').val()
            },
            success: function(response) {
                if (response.success) {
                    // Update UI
                    const $card = $(`.payment-gateway-card[data-gateway-id="${gatewayId}"]`);
                    
                    if (isActive) {
                        // Deactivate all other gateways
                        $('.gateway-active-toggle').not($toggle).prop('checked', false);
                        $('.payment-gateway-card').removeClass('active').addClass('configured');
                        
                        // Activate this gateway
                        $card.removeClass('configured').addClass('active');
                        $card.find('.status-indicator').removeClass('configured').addClass('active');
                        $card.find('.status-indicator i').removeClass('fa-pause-circle').addClass('fa-check-circle');
                        $card.find('.status-indicator span').text('Activo');
                    } else {
                        // Deactivate this gateway
                        $card.removeClass('active').addClass('configured');
                        $card.find('.status-indicator').removeClass('active').addClass('configured');
                        $card.find('.status-indicator i').removeClass('fa-check-circle').addClass('fa-pause-circle');
                        $card.find('.status-indicator span').text('Configurado');
                    }
                    
                    showNotification(response.message, 'success');
                } else {
                    // Revert toggle
                    $toggle.prop('checked', !isActive);
                    showNotification(response.message, 'error');
                }
            },
            error: function() {
                // Revert toggle
                $toggle.prop('checked', !isActive);
                showNotification('Error al cambiar el estado del gateway', 'error');
            },
            complete: function() {
                // Re-enable toggle
                $toggle.prop('disabled', false);
            }
        });
    });
    
    // Test connection button
    $('.test-connection-btn').on('click', function() {
        const $button = $(this);
        const gatewayId = $button.data('gateway-id');
        const originalHtml = $button.html();
        
        // Show loading state
        $button.prop('disabled', true);
        $button.html('<i class="fas fa-spinner fa-spin"></i> <span>Probando...</span>');
        
        $.ajax({
            url: '/PaymentSettings/TestConnection',
            type: 'POST',
            data: {
                id: gatewayId,
                __RequestVerificationToken: $('input[name="__RequestVerificationToken"]').val()
            },
            success: function(response) {
                if (response.success) {
                    showNotification(response.message, 'success');
                } else {
                    showNotification(response.message, 'error');
                }
            },
            error: function() {
                showNotification('Error al probar la conexión', 'error');
            },
            complete: function() {
                // Restore button
                $button.prop('disabled', false);
                $button.html(originalHtml);
            }
        });
    });
    
    // File input handling
    $('.file-input').on('change', function() {
        const $input = $(this);
        const $wrapper = $input.closest('.file-upload-wrapper');
        const $fileName = $wrapper.find('.file-name');
        const fileName = $input[0].files[0]?.name || '';
        
        if (fileName) {
            $fileName.text(fileName);
            $wrapper.addClass('has-file');
        } else {
            $fileName.text('');
            $wrapper.removeClass('has-file');
        }
    });
    
    // Password visibility toggle
    window.togglePasswordVisibility = function(inputId) {
        const $input = $('#' + inputId);
        const $icon = $('#' + inputId + '-toggle-icon');
        
        if ($input.attr('type') === 'password') {
            $input.attr('type', 'text');
            $icon.removeClass('fa-eye').addClass('fa-eye-slash');
        } else {
            $input.attr('type', 'password');
            $icon.removeClass('fa-eye-slash').addClass('fa-eye');
        }
    };
    
    // Form validation
    $('#gateway-config-form').on('submit', function(e) {
        const $form = $(this);
        const storeId = $('#StoreId').val();
        const auth1 = $('#Auth1').val();
        const auth2 = $('#Auth2').val();
        
        // Basic validation
        if (!storeId || !auth1 || !auth2) {
            e.preventDefault();
            showNotification('Por favor complete todos los campos requeridos', 'error');
            return false;
        }
        
        // Show loading state
        const $submitBtn = $form.find('button[type="submit"]');
        $submitBtn.prop('disabled', true);
        $submitBtn.html('<i class="fas fa-spinner fa-spin"></i> <span>Guardando...</span>');
    });
    
    // Notification helper
    function showNotification(message, type) {
        // Check if using Materialize toast
        if (typeof M !== 'undefined' && M.toast) {
            M.toast({
                html: message,
                classes: type === 'success' ? 'green' : 'red'
            });
        } else {
            // Fallback to alert
            alert(message);
        }
    }
    
    // Add CSRF token to AJAX requests
    $.ajaxSetup({
        beforeSend: function(xhr, settings) {
            if (settings.type === 'POST') {
                const token = $('input[name="__RequestVerificationToken"]').val();
                if (token) {
                    // Check if data is FormData (file upload)
                    if (settings.data instanceof FormData) {
                        settings.data.append('__RequestVerificationToken', token);
                    } 
                    // Check if data is a string
                    else if (typeof settings.data === 'string' && !settings.data.includes('__RequestVerificationToken')) {
                        settings.data += '&__RequestVerificationToken=' + encodeURIComponent(token);
                    }
                    // If data is an object, add the token
                    else if (settings.data && typeof settings.data === 'object' && !(settings.data instanceof FormData)) {
                        settings.data.__RequestVerificationToken = token;
                    }
                }
            }
        }
    });
    
    // Checkout Customization
    let currentCheckoutLogo = null;
    let currentLogoSize = 45; // Default size
    
    // Load existing checkout settings
    loadCheckoutSettings();
    
    function loadCheckoutSettings() {
        $.ajax({
            url: '/PaymentSettings/GetCheckoutSettings',
            type: 'GET',
            success: function(response) {
                if (response.success) {
                    if (response.logoUrl) {
                        currentCheckoutLogo = response.logoUrl;
                        $('#logo-preview-img').attr('src', response.logoUrl);
                        // Show preview state
                        $('#upload-state').hide();
                        $('#logo-preview-state').show();
                    }
                    if (response.position) {
                        $(`input[name="logo-position"][value="${response.position}"]`).prop('checked', true);
                        // Update active state
                        updatePositionCardState(response.position);
                    }
                    if (response.size) {
                        currentLogoSize = response.size;
                        $('#logo-size-slider').val(response.size);
                        $('#size-value').text(response.size);
                        updateSliderProgress(response.size);
                    }
                }
            }
        });
    }
    
    // Handle position selection styling
    $('input[name="logo-position"]').on('change', function() {
        updatePositionCardState($(this).val());
    });
    
    function updatePositionCardState(selectedValue) {
        // Reset all cards
        $('.position-card').css({
            'border-color': '#e0e0e0',
            'background-color': 'transparent'
        });
        $('.position-card i').css('color', '#666');
        
        // Highlight selected card
        const $selectedCard = $(`input[name="logo-position"][value="${selectedValue}"]`).siblings('.position-card');
        $selectedCard.css({
            'border-color': 'var(--primary)',
            'background-color': 'rgba(233, 30, 99, 0.05)'
        });
        $selectedCard.find('i').css('color', 'var(--primary)');
    }
    
    // Upload logo button
    $('#upload-logo-btn').on('click', function() {
        $('#checkout-logo-input').click();
    });
    
    // Change logo button
    $('#change-logo-btn').on('click', function() {
        $('#checkout-logo-input').click();
    });
    
    // Handle file selection
    $('#checkout-logo-input').on('change', function() {
        const file = this.files[0];
        if (file) {
            // Validate file size (max 2MB)
            if (file.size > 2 * 1024 * 1024) {
                showNotification('El archivo no debe superar los 2MB', 'error');
                return;
            }
            
            // Create FormData and upload
            const formData = new FormData();
            formData.append('logoFile', file);
            
            // Show loading state
            $('#upload-logo-btn').prop('disabled', true).html('<i class="material-icons">hourglass_empty</i> <span>Subiendo...</span>');
            
            $.ajax({
                url: '/PaymentSettings/UploadCheckoutLogo',
                type: 'POST',
                data: formData,
                processData: false,
                contentType: false,
                success: function(response) {
                    if (response.success) {
                        currentCheckoutLogo = response.logoUrl;
                        $('#logo-preview-img').attr('src', response.logoUrl);
                        // Switch to preview state
                        $('#upload-state').hide();
                        $('#logo-preview-state').show();
                        showNotification('Logo subido exitosamente', 'success');
                    } else {
                        showNotification(response.message, 'error');
                    }
                },
                error: function() {
                    showNotification('Error al subir el logo', 'error');
                },
                complete: function() {
                    $('#upload-logo-btn').prop('disabled', false).html('<i class="material-icons">upload</i> <span>Subir Logo</span>');
                }
            });
        }
    });
    
    // Remove logo button
    $('#remove-logo-btn').on('click', function() {
        if (confirm('¿Está seguro de eliminar el logo?')) {
            currentCheckoutLogo = null;
            // Switch back to upload state
            $('#logo-preview-state').hide();
            $('#upload-state').show();
            $('#checkout-logo-input').val('');
        }
    });
    
    // Handle logo size slider
    $('#logo-size-slider').on('input', function() {
        const size = $(this).val();
        currentLogoSize = parseInt(size);
        $('#size-value').text(size);
        updateSliderProgress(size);
        
        // Update preview logo size in real-time
        if (currentCheckoutLogo) {
            $('#logo-preview-img').css('max-height', size + 'px');
        }
    });
    
    // Update slider progress bar color
    function updateSliderProgress(value) {
        const min = parseInt($('#logo-size-slider').attr('min'));
        const max = parseInt($('#logo-size-slider').attr('max'));
        const percentage = ((value - min) / (max - min)) * 100;
        
        $('#logo-size-slider').css('background', `linear-gradient(to right, var(--primary) 0%, var(--primary) ${percentage}%, #ddd ${percentage}%, #ddd 100%)`);
    }
    
    // Save checkout settings
    $('#checkout-customization-form').on('submit', function(e) {
        e.preventDefault();
        
        const position = $('input[name="logo-position"]:checked').val();
        
        // Show loading state
        $('#save-checkout-settings').prop('disabled', true).html('<i class="fas fa-hourglass-half"></i> Guardando...');
        
        $.ajax({
            url: '/PaymentSettings/SaveCheckoutSettings',
            type: 'POST',
            data: {
                logoUrl: currentCheckoutLogo || '',
                position: position,
                size: currentLogoSize
            },
            success: function(response) {
                if (response.success) {
                    showNotification(response.message, 'success');
                } else {
                    showNotification(response.message, 'error');
                }
            },
            error: function() {
                showNotification('Error al guardar la configuración', 'error');
            },
            complete: function() {
                $('#save-checkout-settings').prop('disabled', false).html('<i class="fas fa-save" style="margin-right: 8px;"></i>Guardar Configuración');
            }
        });
    });
});