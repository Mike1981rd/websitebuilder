// JavaScript para el módulo de Clientes
document.addEventListener('DOMContentLoaded', function() {
    
    // Traducción adicional para Edit
    const editCustomerTranslations = {
        es: {
            'tabs.overview': 'General',
            'tabs.security': 'Seguridad',
            'tabs.addressBilling': 'Dirección y Facturación',
            'tabs.notifications': 'Notificaciones',
            'customers.createdOn': 'Creado el',
            'customers.deleteCustomer': 'Eliminar Cliente',
            'customers.details': 'Detalles',
            'customers.orders': 'Órdenes',
            'customers.spent': 'Gastado',
            'customers.editDetails': 'Editar Detalles',
            'customers.accountBalance': 'Balance de Cuenta',
            'customers.creditLeft': 'Crédito Restante',
            'customers.balanceForPurchase': 'Balance de cuenta para próxima compra',
            'customers.loyaltyProgram': 'Programa de Lealtad',
            'customers.pointsToNextTier': 'puntos para el siguiente nivel',
            'customers.wishlist': 'Lista de Deseos',
            'customers.itemsInWishlist': 'artículos en lista de deseos',
            'customers.receiveNotification': 'Recibir notificación cuando los artículos estén en oferta',
            'customers.coupons': 'Cupones',
            'customers.couponsAvailable': 'Cupones que ganaste',
            'customers.useCoupon': 'Usar cupón en la próxima compra',
            'customers.ordersPlaced': 'Órdenes realizadas',
            'customers.order': 'ORDEN',
            'customers.date': 'FECHA',
            'customers.changePassword': 'Cambiar Contraseña',
            'customers.passwordRequirements': 'Asegúrate de que se cumplan estos requisitos:',
            'customers.minimumChars': 'Mínimo 8 caracteres, mayúsculas y símbolo',
            'customers.newPassword': 'Nueva Contraseña',
            'customers.confirmPassword': 'Confirmar Nueva Contraseña',
            'customers.twoFactorAuth': 'Verificación en dos pasos',
            'customers.twoFactorDesc': 'Mantén tu cuenta segura con paso de autenticación.',
            'customers.twoFactorInfo': 'La autenticación de dos factores agrega una capa adicional de seguridad a tu cuenta al requerir más que solo una contraseña para iniciar sesión.',
            'customers.recentDevices': 'Dispositivos Recientes',
            'customers.browser': 'NAVEGADOR',
            'customers.device': 'DISPOSITIVO',
            'customers.location': 'UBICACIÓN',
            'customers.recentActivity': 'ACTIVIDADES RECIENTES',
            'customers.addressBook': 'Libreta de Direcciones',
            'customers.addNewAddress': 'Agregar Nueva Dirección',
            'customers.defaultAddress': 'Dirección por Defecto',
            'customers.paymentMethods': 'Métodos de Pago',
            'customers.addPaymentMethod': 'Agregar Método de Pago',
            'customers.name': 'Nombre',
            'customers.number': 'Número',
            'customers.expires': 'Expira',
            'customers.type': 'Tipo',
            'customers.issuer': 'Emisor',
            'customers.notifications': 'Notificaciones',
            'customers.notificationsDesc': 'Recibirás notificación para los elementos seleccionados a continuación.',
            'customers.email': 'CORREO',
            'customers.browser': 'NAVEGADOR',
            'customers.app': 'APP',
            'customers.addressType': 'Tipo de Dirección',
            'customers.street': 'Calle',
            'customers.state': 'Estado',
            'customers.setAsDefault': 'Establecer como dirección por defecto',
            'customers.upgradeToPremium': 'Actualizar a premium',
            'customers.upgradeDescription': 'Actualiza al cliente a membresía premium para acceder a funciones pro.',
            'common.enabled': 'Habilitado',
            'common.discard': 'Descartar',
            'common.saveChanges': 'Guardar Cambios',
            'address.home': 'Casa',
            'address.office': 'Oficina',
            'address.family': 'Familia',
            'address.other': 'Otro'
        },
        en: {
            'tabs.overview': 'Overview',
            'tabs.security': 'Security',
            'tabs.addressBilling': 'Address & Billing',
            'tabs.notifications': 'Notifications',
            'customers.createdOn': 'Created on',
            'customers.deleteCustomer': 'Delete Customer',
            'customers.details': 'Details',
            'customers.orders': 'Orders',
            'customers.spent': 'Spent',
            'customers.editDetails': 'Edit Details',
            'customers.accountBalance': 'Account Balance',
            'customers.creditLeft': 'Credit Left',
            'customers.balanceForPurchase': 'Account balance for next purchase',
            'customers.loyaltyProgram': 'Loyalty Program',
            'customers.pointsToNextTier': 'points to next tier',
            'customers.wishlist': 'Wishlist',
            'customers.itemsInWishlist': 'items in wishlist',
            'customers.receiveNotification': 'Receive notification when items go on sale',
            'customers.coupons': 'Coupons',
            'customers.couponsAvailable': 'Coupons you win',
            'customers.useCoupon': 'Use coupon on next purchase',
            'customers.ordersPlaced': 'Orders placed',
            'customers.order': 'ORDER',
            'customers.date': 'DATE',
            'customers.changePassword': 'Change Password',
            'customers.passwordRequirements': 'Ensure that these requirements are met:',
            'customers.minimumChars': 'Minimum 8 characters long, uppercase & symbol',
            'customers.newPassword': 'New Password',
            'customers.confirmPassword': 'Confirm New Password',
            'customers.twoFactorAuth': 'Two-steps verification',
            'customers.twoFactorDesc': 'Keep your account secure with authentication step.',
            'customers.twoFactorInfo': 'Two-factor authentication adds an additional layer of security to your account by requiring more than just a password to log in.',
            'customers.recentDevices': 'Recent Devices',
            'customers.browser': 'BROWSER',
            'customers.device': 'DEVICE',
            'customers.location': 'LOCATION',
            'customers.recentActivity': 'RECENT ACTIVITIES',
            'customers.addressBook': 'Address Book',
            'customers.addNewAddress': 'Add New Address',
            'customers.defaultAddress': 'Default Address',
            'customers.paymentMethods': 'Payment Methods',
            'customers.addPaymentMethod': 'Add Payment Methods',
            'customers.name': 'Name',
            'customers.number': 'Number',
            'customers.expires': 'Expires',
            'customers.type': 'Type',
            'customers.issuer': 'Issuer',
            'customers.notifications': 'Notifications',
            'customers.notificationsDesc': 'You will receive notification for the below selected items.',
            'customers.email': 'EMAIL',
            'customers.browser': 'BROWSER',
            'customers.app': 'APP',
            'customers.addressType': 'Address Type',
            'customers.street': 'Street',
            'customers.state': 'State',
            'customers.setAsDefault': 'Set as default address',
            'customers.upgradeToPremium': 'Upgrade to premium',
            'customers.upgradeDescription': 'Upgrade customer to premium membership to access pro features.',
            'common.enabled': 'Enabled',
            'common.discard': 'Discard',
            'common.saveChanges': 'Save Changes',
            'address.home': 'Home',
            'address.office': 'Office',
            'address.family': 'Family',
            'address.other': 'Other'
        }
    };

    // Fusionar con el objeto global
    if (typeof translations !== 'undefined') {
        Object.assign(translations.es, editCustomerTranslations.es);
        Object.assign(translations.en, editCustomerTranslations.en);
    }

    // Aplicar traducciones
    if (typeof translatePage === 'function') {
        const currentLang = localStorage.getItem('preferredLanguage') || 'es';
        translatePage(currentLang);
    }

    // Modal de editar detalles
    const editDetailsBtn = document.getElementById('editDetailsBtn');
    if (editDetailsBtn) {
        editDetailsBtn.addEventListener('click', function() {
            const modal = new bootstrap.Modal(document.getElementById('editDetailsModal'));
            modal.show();
        });
    }

    // Modal de eliminar cliente
    const deleteCustomerBtn = document.getElementById('deleteCustomerBtn');
    if (deleteCustomerBtn) {
        deleteCustomerBtn.addEventListener('click', function() {
            const customerId = this.dataset.customerId;
            const customerName = this.dataset.customerName;
            
            if (confirm(`¿Estás seguro de que deseas eliminar a ${customerName}?`)) {
                const form = document.createElement('form');
                form.method = 'POST';
                form.action = `/Customers/Delete/${customerId}`;
                
                const token = document.querySelector('input[name="__RequestVerificationToken"]').value;
                const tokenInput = document.createElement('input');
                tokenInput.type = 'hidden';
                tokenInput.name = '__RequestVerificationToken';
                tokenInput.value = token;
                
                form.appendChild(tokenInput);
                document.body.appendChild(form);
                form.submit();
            }
        });
    }

    // Función para alternar visibilidad de contraseña
    window.togglePassword = function(inputId) {
        const input = document.getElementById(inputId);
        const button = input.nextElementSibling;
        const icon = button.querySelector('i');
        
        if (input.type === 'password') {
            input.type = 'text';
            icon.classList.remove('fa-eye');
            icon.classList.add('fa-eye-slash');
        } else {
            input.type = 'password';
            icon.classList.remove('fa-eye-slash');
            icon.classList.add('fa-eye');
        }
    };

    // Manejo de imagen en modal de edición
    const imageUploadArea = document.getElementById('imageUploadArea');
    const imageInput = document.getElementById('imageInput');
    const imagePreview = document.getElementById('imagePreview');
    const previewImg = document.getElementById('previewImg');
    const profileImageUrl = document.getElementById('profileImageUrl');
    const removeImageBtn = document.getElementById('removeImage');

    if (imageUploadArea) {
        // Click en área de upload
        imageUploadArea.addEventListener('click', () => imageInput.click());

        // Drag and drop
        imageUploadArea.addEventListener('dragover', (e) => {
            e.preventDefault();
            imageUploadArea.classList.add('drag-over');
        });

        imageUploadArea.addEventListener('dragleave', () => {
            imageUploadArea.classList.remove('drag-over');
        });

        imageUploadArea.addEventListener('drop', (e) => {
            e.preventDefault();
            imageUploadArea.classList.remove('drag-over');
            
            const files = e.dataTransfer.files;
            if (files.length > 0 && files[0].type.startsWith('image/')) {
                handleImageFile(files[0]);
            }
        });

        // Selección de archivo
        imageInput.addEventListener('change', (e) => {
            if (e.target.files.length > 0) {
                handleImageFile(e.target.files[0]);
            }
        });

        // Remover imagen
        if (removeImageBtn) {
            removeImageBtn.addEventListener('click', () => {
                previewImg.src = '';
                profileImageUrl.value = '';
                imageInput.value = '';
                imageUploadArea.style.display = 'block';
                imagePreview.style.display = 'none';
            });
        }
    }

    // Función para manejar archivo de imagen
    function handleImageFile(file) {
        const maxSizeMB = 25;
        const maxSizeBytes = maxSizeMB * 1024 * 1024;
        
        if (file.size > maxSizeBytes) {
            alert(`La imagen es demasiado grande. Máximo ${maxSizeMB}MB.`);
            return;
        }
        
        const reader = new FileReader();
        reader.onload = function(e) {
            previewImg.src = e.target.result;
            profileImageUrl.value = e.target.result;
            
            imageUploadArea.style.display = 'none';
            imagePreview.style.display = 'block';
        };
        reader.readAsDataURL(file);
    }

    // Two-factor authentication toggle
    const twoFactorEnabled = document.getElementById('twoFactorEnabled');
    if (twoFactorEnabled) {
        twoFactorEnabled.addEventListener('change', function() {
            // Aquí se puede agregar lógica para habilitar/deshabilitar 2FA
            console.log('2FA:', this.checked);
        });
    }

    // Eliminar dirección
    document.querySelectorAll('.delete-address').forEach(btn => {
        btn.addEventListener('click', function() {
            const addressId = this.dataset.addressId;
            if (confirm('¿Estás seguro de que deseas eliminar esta dirección?')) {
                // Implementar eliminación de dirección
                console.log('Eliminar dirección:', addressId);
            }
        });
    });

    // Editar dirección
    document.querySelectorAll('.edit-address').forEach(btn => {
        btn.addEventListener('click', function() {
            const addressId = this.dataset.addressId;
            // Implementar edición de dirección
            console.log('Editar dirección:', addressId);
        });
    });

    // Validación de formulario de contraseña
    const passwordForm = document.querySelector('form[action*="ChangePassword"]');
    if (passwordForm) {
        passwordForm.addEventListener('submit', function(e) {
            const newPassword = document.getElementById('newPassword').value;
            const confirmPassword = document.getElementById('confirmPassword').value;
            
            if (newPassword !== confirmPassword) {
                e.preventDefault();
                alert('Las contraseñas no coinciden');
                return false;
            }
            
            if (newPassword.length < 8) {
                e.preventDefault();
                alert('La contraseña debe tener al menos 8 caracteres');
                return false;
            }
        });
    }

    // Manejo de checkboxes de notificaciones
    const notificationCheckboxes = document.querySelectorAll('.notifications-table input[type="checkbox"]');
    notificationCheckboxes.forEach(checkbox => {
        checkbox.addEventListener('change', function() {
            // Marcar el formulario como modificado
            const form = this.closest('form');
            if (form) {
                form.classList.add('modified');
            }
        });
    });

    // Advertencia al salir con cambios sin guardar
    window.addEventListener('beforeunload', function(e) {
        const modifiedForm = document.querySelector('form.modified');
        if (modifiedForm) {
            e.preventDefault();
            e.returnValue = '';
        }
    });
});