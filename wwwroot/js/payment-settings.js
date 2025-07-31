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
            if (settings.type === 'POST' && !settings.data.includes('__RequestVerificationToken')) {
                const token = $('input[name="__RequestVerificationToken"]').val();
                if (token) {
                    settings.data += '&__RequestVerificationToken=' + encodeURIComponent(token);
                }
            }
        }
    });
});