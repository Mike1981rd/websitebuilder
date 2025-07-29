# Implementación del Filtro de Estado Activo/Inactivo

## Descripción General
Sistema de filtrado por estado que permite mostrar usuarios/clientes según su condición (Activo, Inactivo o Todos). Incluye actualización dinámica de la tabla cuando se cambia el estado de un registro, similar al comportamiento del módulo de Roles.

## Componentes de la Implementación

### 1. Estructura HTML del Filtro

#### Ubicación en la Vista
El select de estado debe colocarse dentro del contenedor de búsqueda, junto al input de búsqueda:

```html
<div class="table-controls">
    <div class="search-container">
        <input type="text" 
               id="searchInput" 
               class="form-control search-input" 
               data-i18n-placeholder="customers.searchPlaceholder"
               placeholder="Buscar clientes...">
        <select class="form-control status-filter" id="statusFilter">
            <option value="active" selected data-i18n="status.active">Activo</option>
            <option value="inactive" data-i18n="status.inactive">Inactivo</option>
            <option value="all" data-i18n="status.all">Todos</option>
        </select>
    </div>
    <div class="table-actions">
        <!-- Botones de acción -->
    </div>
</div>
```

**Puntos clave**:
- El select tiene `value="active" selected` por defecto
- Incluye atributos `data-i18n` para traducciones
- ID único para referencia en JavaScript

### 2. Estilos CSS Requeridos

#### En el archivo CSS del módulo (ej: customers.css)

```css
/* Contenedor de búsqueda con flex */
.search-container {
    flex: 1;
    max-width: 600px;
    display: flex;
    gap: 10px;
    align-items: center;
}

/* Input de búsqueda ocupa el espacio disponible */
.search-input {
    flex: 1;
    min-width: 250px;
    padding: 10px 15px;
    border: 1px solid #e0e0e0;
    border-radius: 8px;
    font-size: 14px;
}

/* Select de estado con ancho fijo */
.search-container .status-filter,
#statusFilter {
    flex: 0 0 auto !important;
    width: 100px !important;
    max-width: 100px !important;
    padding: 10px 12px;
    border: 1px solid #e0e0e0;
    border-radius: 8px;
    font-size: 14px;
    background-color: #ffffff;
    cursor: pointer;
}

/* Override específico para form-control */
.search-container .form-control.status-filter {
    width: 100px !important;
    flex: 0 0 100px !important;
}
```

**Consideraciones CSS**:
- Usar selectores específicos para evitar conflictos con `.form-control`
- `!important` necesario para sobrescribir estilos globales
- El select debe tener ancho fijo mientras el input es flexible

### 3. Botón de Acción Dinámico

El botón de activar/desactivar debe cambiar según el estado actual:

```html
<button type="button" 
        class="btn-action toggle-status-btn" 
        data-customer-id="@customer.Id"
        data-customer-name="@customer.FirstName @customer.LastName"
        data-customer-status="@customer.Status"
        data-i18n-title="@(customer.Status == "Active" ? "customers.deactivate" : "customers.activate")"
        title="@(customer.Status == "Active" ? "Desactivar" : "Activar")"
        onclick="toggleCustomerStatus(@customer.Id, '@customer.Status')">
    <i class="fas fa-@(customer.Status == "Active" ? "ban" : "check-circle")"></i>
</button>
```

**Lógica del botón**:
- Si está **Activo**: muestra ícono `fa-ban` con título "Desactivar"
- Si está **Inactivo**: muestra ícono `fa-check-circle` con título "Activar"
- Incluye `data-customer-status` para el filtrado

### 4. JavaScript - Lógica de Filtrado

```javascript
// Variables globales
const searchInput = document.getElementById('searchInput');
const statusFilter = document.getElementById('statusFilter');
const table = document.getElementById('customersTable');

// Función de filtrado combinado
function applyFilters() {
    const searchTerm = searchInput.value.toLowerCase();
    const statusValue = statusFilter.value;
    const rows = table.querySelectorAll('tbody tr');
    
    rows.forEach(row => {
        const text = row.textContent.toLowerCase();
        const matchesSearch = text.includes(searchTerm);
        
        // Obtener el estado del cliente desde el data attribute del botón
        const statusBtn = row.querySelector('.toggle-status-btn');
        const customerStatus = statusBtn ? statusBtn.dataset.customerStatus : '';
        
        let matchesStatus = true;
        if (statusValue === 'active') {
            matchesStatus = customerStatus === 'Active';
        } else if (statusValue === 'inactive') {
            matchesStatus = customerStatus === 'Inactive';
        }
        // Si es 'all', matchesStatus ya es true
        
        row.style.display = (matchesSearch && matchesStatus) ? '' : 'none';
    });
}

// Event listeners
searchInput.addEventListener('input', applyFilters);
statusFilter.addEventListener('change', applyFilters);

// CRÍTICO: Aplicar filtros al cargar la página
applyFilters();
```

### 5. JavaScript - Toggle de Estado

```javascript
// Función para cambiar estado
window.toggleCustomerStatus = async function(customerId, currentStatus) {
    try {
        const response = await fetch('@Url.Action("ToggleStatus", "Customers")/' + customerId, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'RequestVerificationToken': document.querySelector('input[name="__RequestVerificationToken"]').value
            }
        });
        
        if (response.ok) {
            const result = await response.json();
            
            // Mostrar mensaje de éxito
            showAlert(result.message, 'success');
            
            // Actualizar la fila sin recargar toda la página
            updateCustomerRow(customerId, result.newStatus);
            
        } else {
            showAlert('Error al cambiar el estado del cliente', 'error');
        }
    } catch (error) {
        console.error('Error:', error);
        showAlert('Error al cambiar el estado del cliente', 'error');
    }
}

// Actualizar fila después del cambio
function updateCustomerRow(customerId, newStatus) {
    const row = document.querySelector(`tr[data-customer-id="${customerId}"]`);
    if (!row) return;
    
    // Actualizar badge de estado
    const statusBadge = row.querySelector('.status-badge');
    if (statusBadge) {
        statusBadge.className = `status-badge status-${newStatus.toLowerCase()}`;
        statusBadge.textContent = newStatus === 'Active' ? 'Activo' : 'Inactivo';
        statusBadge.setAttribute('data-i18n', `status.${newStatus.toLowerCase()}`);
    }
    
    // Actualizar botón de acción
    const toggleBtn = row.querySelector('.toggle-status-btn');
    if (toggleBtn) {
        const icon = toggleBtn.querySelector('i');
        const isActive = newStatus === 'Active';
        
        icon.className = `fas fa-${isActive ? 'ban' : 'check-circle'}`;
        toggleBtn.title = isActive ? 'Desactivar' : 'Activar';
        toggleBtn.setAttribute('data-i18n-title', isActive ? 'customers.deactivate' : 'customers.activate');
        toggleBtn.dataset.customerStatus = newStatus;
        toggleBtn.setAttribute('onclick', `toggleCustomerStatus(${customerId}, '${newStatus}')`);
    }
    
    // Aplicar traducciones
    const currentLang = localStorage.getItem('preferredLanguage') || 'es';
    if (typeof translatePage === 'function') {
        translatePage(currentLang);
    }
    
    // CRÍTICO: Re-aplicar filtros para ocultar/mostrar según filtro actual
    applyFilters();
}
```

### 6. Función de Alerta

```javascript
function showAlert(message, type) {
    // Crear alerta temporal
    const alertDiv = document.createElement('div');
    alertDiv.className = `alert alert-${type === 'success' ? 'success' : 'danger'} alert-dismissible fade show`;
    alertDiv.style.position = 'fixed';
    alertDiv.style.top = '20px';
    alertDiv.style.right = '20px';
    alertDiv.style.zIndex = '9999';
    alertDiv.innerHTML = `
        <i class="fas fa-${type === 'success' ? 'check' : 'exclamation'}-circle me-2"></i>
        ${message}
        <button type="button" class="btn-close" onclick="this.parentElement.remove()"></button>
    `;
    
    document.body.appendChild(alertDiv);
    
    // Auto-remover después de 5 segundos
    setTimeout(() => alertDiv.remove(), 5000);
}
```

### 7. Backend - Controller

```csharp
// POST: Customers/ToggleStatus/5
[HttpPost]
public async Task<IActionResult> ToggleStatus(int id)
{
    var guest = await _context.Guests.FindAsync(id);
    if (guest == null)
    {
        return NotFound();
    }

    // Toggle status
    if (guest.Status == "Active")
    {
        guest.Status = "Inactive";
    }
    else
    {
        guest.Status = "Active";
    }
    
    guest.UpdatedAt = DateTime.UtcNow;
    await _context.SaveChangesAsync();

    return Json(new 
    { 
        success = true, 
        message = guest.Status == "Active" ? "Cliente activado exitosamente" : "Cliente desactivado exitosamente",
        newStatus = guest.Status
    });
}
```

### 8. Traducciones Necesarias

Agregar al objeto de traducciones del módulo:

```javascript
es: {
    'customers.activate': 'Activar',
    'customers.deactivate': 'Desactivar',
    'status.all': 'Todos',
    'status.active': 'Activo',
    'status.inactive': 'Inactivo'
},
en: {
    'customers.activate': 'Activate',
    'customers.deactivate': 'Deactivate',
    'status.all': 'All',
    'status.active': 'Active',
    'status.inactive': 'Inactive'
}
```

## Flujo Completo del Sistema

### 1. Al cargar la página:
1. El select muestra "Activo" por defecto
2. Se ejecuta `applyFilters()` automáticamente
3. Solo se muestran registros con estado "Active"
4. Los registros "Inactive" están ocultos

### 2. Al cambiar el filtro:
1. Usuario selecciona "Inactivo" o "Todos"
2. Se dispara evento `change` 
3. `applyFilters()` evalúa cada fila
4. Muestra/oculta filas según el criterio

### 3. Al cambiar estado de un registro:
1. Usuario hace clic en botón ban/check-circle
2. Se ejecuta `toggleCustomerStatus()`
3. Petición AJAX al backend
4. Backend invierte el estado en BD
5. Frontend recibe respuesta con nuevo estado
6. `updateCustomerRow()` actualiza:
   - Badge de estado (color y texto)
   - Ícono del botón (ban ↔ check-circle)
   - Título del botón
   - Data attributes
7. Se ejecuta `applyFilters()`
8. Si el registro ya no cumple el filtro, desaparece

### 4. Comportamiento según filtro activo:

#### Con filtro "Activo":
- Al desactivar → el registro desaparece
- Al activar → no aplicable (no se ven inactivos)

#### Con filtro "Inactivo":
- Al activar → el registro desaparece
- Al desactivar → no aplicable (no se ven activos)

#### Con filtro "Todos":
- Cambios visibles pero registros permanecen

## Checklist de Implementación

- [ ] Agregar select HTML con las 3 opciones
- [ ] Aplicar CSS para tamaño correcto (100px)
- [ ] Modificar botón de acción para que sea dinámico
- [ ] Implementar función `applyFilters()`
- [ ] Agregar event listeners para búsqueda y filtro
- [ ] **CRÍTICO**: Llamar `applyFilters()` al cargar
- [ ] Implementar `toggleCustomerStatus()`
- [ ] Implementar `updateCustomerRow()`
- [ ] **CRÍTICO**: Llamar `applyFilters()` después de actualizar
- [ ] Crear método `ToggleStatus` en controller
- [ ] Agregar traducciones necesarias
- [ ] Probar los 3 escenarios de filtrado

## Problemas Comunes y Soluciones

### 1. El select es muy ancho
**Problema**: `.form-control` tiene `width: 100%`
**Solución**: Usar selectores más específicos con `!important`

```css
.search-container .form-control.status-filter {
    width: 100px !important;
    flex: 0 0 100px !important;
}
```

### 2. Filtro no se aplica al cargar
**Problema**: Falta llamar `applyFilters()` inicialmente
**Solución**: Agregar al final de DOMContentLoaded:
```javascript
// Aplicar filtros al cargar la página
applyFilters();
```

### 3. Registro no desaparece al cambiar estado
**Problema**: No se re-aplican filtros después de actualizar
**Solución**: Agregar al final de `updateCustomerRow()`:
```javascript
// Re-aplicar filtros
applyFilters();
```

### 4. Estado no se actualiza en data attribute
**Problema**: El filtrado usa data attributes obsoletos
**Solución**: Actualizar en `updateCustomerRow()`:
```javascript
toggleBtn.dataset.customerStatus = newStatus;
```

## Adaptación a Otros Módulos

Para implementar en otros módulos, cambiar:

1. **Nombres de funciones**: 
   - `toggleCustomerStatus` → `toggleProductStatus`, `toggleOrderStatus`, etc.
   - `updateCustomerRow` → `updateProductRow`, `updateOrderRow`, etc.

2. **Endpoints**:
   - `/Customers/ToggleStatus/` → `/Products/ToggleStatus/`, etc.

3. **Selectores y IDs**:
   - `#customersTable` → `#productsTable`, etc.
   - `.toggle-status-btn` → mantener igual

4. **Campos de estado**:
   - Verificar si usan "Active/Inactive" o algún otro esquema
   - Ajustar la lógica de toggle según corresponda

## Notas Finales

Esta implementación proporciona una experiencia fluida donde los cambios de estado se reflejan inmediatamente y los registros se filtran dinámicamente sin recargar la página. El comportamiento es idéntico al del módulo de Roles pero adaptado a la estructura específica de cada módulo.