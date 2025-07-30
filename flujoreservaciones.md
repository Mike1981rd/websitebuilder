# 🏨 Flujo de Reservaciones - Plan de Implementación

## 📋 Resumen Ejecutivo

Sistema de reservaciones super sencillo que reutiliza la página de checkout existente. Las habitaciones son productos, los clientes se crean/actualizan automáticamente, y el panel de reservaciones es puramente informativo.

## 🎯 Objetivos

1. **Reutilizar al máximo** - Usar el checkout existente agregando solo campos de fechas
2. **No invasivo** - No modificar modelos ni crear migraciones
3. **Super sencillo** - Estado siempre "Pagada", sin gestión compleja
4. **Automático** - Crear/actualizar Guest sin intervención manual

## 📐 Arquitectura del Flujo

```
Cliente → Click "Reservar" → Checkout + Fechas → Pago → Guest + Reservation → Panel Admin (vista)
```

## 🚀 Plan de Implementación

### FASE 1: Habilitar Botones de Reservar (Frontend)

#### 1.1 En Featured Collection
```javascript
// En featured-collection.js - Modificar el renderizado del botón
if (settings.showReserveButton && settings.reserveButtonText) {
    buttonsHtml += `
        <button class="btn ${settings.reserveButtonStyle}-button reserve-btn" 
                onclick="window.location.href='/Checkout?type=reservation&productId=${product.id}'">
            ${settings.reserveButtonText}
        </button>
    `;
}
```

#### 1.2 En Product Page
```javascript
// En product-container.js - Igual lógica
// Buscar donde se renderiza el botón de reservar y agregar:
onclick="window.location.href='/Checkout?type=reservation&productId=${productId}'"
```

### FASE 2: Adaptar Página de Checkout (Mínimo Invasivo)

#### 2.1 Detectar tipo de operación
```csharp
// En CheckoutController.cs - Método Index
public IActionResult Index()
{
    var isReservation = Request.Query["type"] == "reservation";
    var productId = Request.Query["productId"];
    
    ViewBag.IsReservation = isReservation;
    ViewBag.ProductId = productId;
    
    // Si es reservación, cargar datos del producto/habitación
    if (isReservation && !string.IsNullOrEmpty(productId))
    {
        // Cargar producto para mostrar en el resumen
        ViewBag.RoomData = GetProductById(productId);
    }
    
    return View();
}
```

#### 2.2 Agregar campos de fechas con JavaScript (Sugerencia implementada)
```javascript
// En Checkout/Index.cshtml - Agregar al final del script existente
document.addEventListener('DOMContentLoaded', function() {
    // Detectar si es reservación
    const urlParams = new URLSearchParams(window.location.search);
    const isReservation = urlParams.get('type') === 'reservation';
    
    if (isReservation) {
        // Cambiar título de la página
        document.querySelector('.section-title').textContent = 'Datos de Reservación';
        
        // Crear sección de fechas
        const dateSection = `
            <div class="form-section" id="reservation-dates-section">
                <h2 class="section-title">Fechas de Estadía</h2>
                <div class="form-row">
                    <div class="form-group">
                        <label class="form-label">Check-in</label>
                        <input type="date" 
                               class="form-input" 
                               id="checkin-date" 
                               name="checkinDate" 
                               required
                               min="${new Date().toISOString().split('T')[0]}">
                    </div>
                    <div class="form-group">
                        <label class="form-label">Check-out</label>
                        <input type="date" 
                               class="form-input" 
                               id="checkout-date" 
                               name="checkoutDate" 
                               required>
                    </div>
                </div>
                <div class="info-text" id="nights-info" style="margin-top: 10px;"></div>
            </div>
        `;
        
        // Insertar después de la sección de contacto
        const contactSection = document.querySelector('.form-section');
        contactSection.insertAdjacentHTML('afterend', dateSection);
        
        // Cambiar texto del botón
        document.querySelector('.submit-btn').textContent = 'Confirmar Reservación';
        
        // Validación de fechas
        document.getElementById('checkin-date').addEventListener('change', validateDates);
        document.getElementById('checkout-date').addEventListener('change', validateDates);
        
        function validateDates() {
            const checkin = document.getElementById('checkin-date').value;
            const checkout = document.getElementById('checkout-date').value;
            
            if (checkin && checkout) {
                const checkinDate = new Date(checkin);
                const checkoutDate = new Date(checkout);
                
                // Validar que checkout sea después de checkin
                if (checkoutDate <= checkinDate) {
                    document.getElementById('checkout-date').setCustomValidity('La fecha de salida debe ser posterior a la de entrada');
                } else {
                    document.getElementById('checkout-date').setCustomValidity('');
                    
                    // Calcular noches
                    const nights = Math.floor((checkoutDate - checkinDate) / (1000 * 60 * 60 * 24));
                    document.getElementById('nights-info').textContent = `${nights} noche${nights > 1 ? 's' : ''}`;
                    
                    // Actualizar precio total si es necesario
                    updateReservationTotal(nights);
                }
            }
        }
        
        // Actualizar el checkout mínimo cuando se selecciona checkin
        document.getElementById('checkin-date').addEventListener('change', function() {
            const checkinDate = new Date(this.value);
            checkinDate.setDate(checkinDate.getDate() + 1);
            document.getElementById('checkout-date').min = checkinDate.toISOString().split('T')[0];
        });
    }
});

function updateReservationTotal(nights) {
    // Obtener precio por noche del producto
    const cartItems = JSON.parse(localStorage.getItem('websiteBuilderCart') || '[]');
    if (cartItems.length > 0) {
        const pricePerNight = cartItems[0].price;
        const total = pricePerNight * nights;
        
        // Actualizar el total en la UI
        document.getElementById('total').textContent = formatCurrency(total);
        document.getElementById('subtotal').textContent = formatCurrency(total);
    }
}
```

### FASE 3: Procesar Reservación (Backend)

#### 3.1 Modificar CheckoutController
```csharp
[HttpPost]
public async Task<IActionResult> ProcessPayment(CheckoutViewModel model)
{
    var isReservation = Request.Form["isReservation"] == "true";
    
    if (isReservation)
    {
        return await ProcessReservation(model);
    }
    else
    {
        return await ProcessOrder(model);
    }
}

private async Task<IActionResult> ProcessReservation(CheckoutViewModel model)
{
    // 1. Buscar o crear Guest
    var guest = await _context.Guests
        .FirstOrDefaultAsync(g => g.Email == model.Email);
    
    if (guest == null)
    {
        // Crear nuevo Guest
        guest = new Guest
        {
            FirstName = model.FirstName ?? "",
            LastName = model.LastName,
            Email = model.Email,
            Phone = model.Phone,
            Address = $"{model.Address}, {model.State}", // Concatenar dirección + estado
            City = model.City,
            Country = model.Country,
            PostalCode = model.PostalCode,
            CustomerId = GenerateCustomerId(), // Formato #XXXXXX
            Status = "Active",
            CreatedAt = DateTime.UtcNow
        };
        
        _context.Guests.Add(guest);
        await _context.SaveChangesAsync();
    }
    else
    {
        // Actualizar datos si hay cambios
        guest.FirstName = model.FirstName ?? guest.FirstName;
        guest.LastName = model.LastName ?? guest.LastName;
        guest.Phone = model.Phone ?? guest.Phone;
        guest.Address = $"{model.Address}, {model.State}";
        guest.City = model.City ?? guest.City;
        guest.Country = model.Country ?? guest.Country;
        guest.PostalCode = model.PostalCode ?? guest.PostalCode;
        guest.UpdatedAt = DateTime.UtcNow;
        
        await _context.SaveChangesAsync();
    }
    
    // 2. Crear Reservation
    var reservation = new Reservation
    {
        GuestId = guest.Id,
        RoomId = model.ProductId, // Las habitaciones son productos
        CheckInDate = model.CheckInDate,
        CheckOutDate = model.CheckOutDate,
        TotalAmount = model.TotalAmount,
        Status = "Pagada", // Siempre pagada
        PaymentMethod = model.PaymentMethod,
        PaymentStatus = "Completed",
        CreatedAt = DateTime.UtcNow
    };
    
    _context.Reservations.Add(reservation);
    await _context.SaveChangesAsync();
    
    // 3. Limpiar carrito y redirigir
    return Json(new { 
        success = true, 
        message = "Reservación confirmada",
        reservationId = reservation.Id 
    });
}

private string GenerateCustomerId()
{
    var random = new Random();
    return $"#{random.Next(100000, 999999)}";
}
```

### FASE 4: Módulo de Reservaciones (Panel Admin)

#### 4.1 Crear ReservationsController
```csharp
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace Hotel.Controllers
{
    [Authorize]
    public class ReservationsController : Controller
    {
        private readonly HotelDbContext _context;

        public ReservationsController(HotelDbContext context)
        {
            _context = context;
        }

        // GET: Reservations
        public async Task<IActionResult> Index(string searchString, int? page)
        {
            var query = _context.Reservations
                .Include(r => r.Guest)
                .Include(r => r.Room)
                .AsQueryable();

            // Búsqueda
            if (!string.IsNullOrEmpty(searchString))
            {
                query = query.Where(r => 
                    r.Guest.FirstName.Contains(searchString) ||
                    r.Guest.LastName.Contains(searchString) ||
                    r.Guest.Email.Contains(searchString));
            }

            // Ordenar por fecha de creación descendente
            query = query.OrderByDescending(r => r.CreatedAt);

            // Paginación simple
            int pageSize = 20;
            int pageNumber = page ?? 1;
            
            var reservations = await query
                .Skip((pageNumber - 1) * pageSize)
                .Take(pageSize)
                .ToListAsync();

            ViewBag.CurrentFilter = searchString;
            ViewBag.CurrentPage = pageNumber;
            ViewBag.TotalPages = Math.Ceiling(await query.CountAsync() / (double)pageSize);

            return View(reservations);
        }

        // GET: Reservations/Details/5
        public async Task<IActionResult> Details(int? id)
        {
            if (id == null)
            {
                return NotFound();
            }

            var reservation = await _context.Reservations
                .Include(r => r.Guest)
                .Include(r => r.Room)
                .FirstOrDefaultAsync(r => r.Id == id);

            if (reservation == null)
            {
                return NotFound();
            }

            // Calcular noches
            var nights = (reservation.CheckOutDate - reservation.CheckInDate).Days;
            ViewBag.Nights = nights;

            return View(reservation);
        }
    }
}
```

#### 4.2 Vista Index
```html
@model IEnumerable<Hotel.Models.Reservation>

@{
    ViewData["Title"] = "Reservaciones";
    Layout = "_MaterializeExactLayout";
}

<div class="page-header">
    <nav class="breadcrumb-container" aria-label="breadcrumb">
        <ol class="breadcrumb">
            <li class="breadcrumb-item"><a href="@Url.Action("Index", "Home")">Home</a></li>
            <li class="breadcrumb-item active" aria-current="page">Reservaciones</li>
        </ol>
    </nav>
</div>

<div class="card">
    <div class="card-content">
        <div class="table-controls">
            <div class="search-container">
                <form method="get" style="display: flex; gap: 10px;">
                    <input type="text" 
                           name="searchString" 
                           value="@ViewBag.CurrentFilter" 
                           class="form-control search-input" 
                           placeholder="Buscar por cliente...">
                    <button type="submit" class="btn btn-secondary">
                        <i class="fas fa-search"></i>
                    </button>
                </form>
            </div>
        </div>

        @if (!Model.Any())
        {
            <div class="empty-state">
                <i class="fas fa-calendar-alt empty-state-icon"></i>
                <h3>No hay reservaciones</h3>
                <p>Las reservaciones aparecerán aquí cuando los clientes reserven habitaciones</p>
            </div>
        }
        else
        {
            <div class="table-responsive">
                <table class="table table-hover">
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>CLIENTE</th>
                            <th>HABITACIÓN</th>
                            <th>CHECK-IN</th>
                            <th>CHECK-OUT</th>
                            <th>TOTAL</th>
                            <th>ESTADO</th>
                            <th>ACCIONES</th>
                        </tr>
                    </thead>
                    <tbody>
                        @foreach (var item in Model)
                        {
                            <tr>
                                <td>#@item.Id</td>
                                <td>
                                    <div class="user-info">
                                        <div class="user-details">
                                            <div class="user-name">@item.Guest.FirstName @item.Guest.LastName</div>
                                            <div class="user-email">@item.Guest.Email</div>
                                        </div>
                                    </div>
                                </td>
                                <td>@item.Room.Name</td>
                                <td>@item.CheckInDate.ToString("dd/MM/yyyy")</td>
                                <td>@item.CheckOutDate.ToString("dd/MM/yyyy")</td>
                                <td>$@item.TotalAmount.ToString("N2")</td>
                                <td>
                                    <span class="status-badge active">@item.Status</span>
                                </td>
                                <td>
                                    <div class="action-buttons">
                                        <button class="btn-action" 
                                                onclick="window.location.href='@Url.Action("Details", new { id = item.Id })'" 
                                                title="Ver detalles">
                                            <i class="fas fa-eye"></i>
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        }
                    </tbody>
                </table>
            </div>

            <!-- Paginación simple -->
            @if (ViewBag.TotalPages > 1)
            {
                <div style="display: flex; justify-content: center; gap: 10px; margin-top: 20px;">
                    @for (int i = 1; i <= ViewBag.TotalPages; i++)
                    {
                        <a href="?page=@i&searchString=@ViewBag.CurrentFilter" 
                           class="btn @(i == ViewBag.CurrentPage ? "btn-primary" : "btn-secondary")">
                            @i
                        </a>
                    }
                </div>
            }
        }
    </div>
</div>
```

#### 4.3 Vista Details
```html
@model Hotel.Models.Reservation

@{
    ViewData["Title"] = "Detalles de Reservación";
    Layout = "_MaterializeExactLayout";
}

<div class="page-header">
    <nav class="breadcrumb-container" aria-label="breadcrumb">
        <ol class="breadcrumb">
            <li class="breadcrumb-item"><a href="@Url.Action("Index", "Home")">Home</a></li>
            <li class="breadcrumb-item"><a href="@Url.Action("Index")">Reservaciones</a></li>
            <li class="breadcrumb-item active" aria-current="page">Detalles</li>
        </ol>
    </nav>
    <div class="page-title-container">
        <h1 class="page-title">Reservación #@Model.Id</h1>
        <button class="btn btn-secondary" onclick="window.location.href='@Url.Action("Index")'">
            <i class="fas fa-arrow-left"></i>
            <span>Volver</span>
        </button>
    </div>
</div>

<div class="row">
    <!-- Información del Cliente -->
    <div class="col-md-6">
        <div class="card">
            <div class="card-content">
                <h3>Información del Cliente</h3>
                <table class="detail-table">
                    <tr>
                        <td><strong>ID Cliente:</strong></td>
                        <td>@Model.Guest.CustomerId</td>
                    </tr>
                    <tr>
                        <td><strong>Nombre:</strong></td>
                        <td>@Model.Guest.FirstName @Model.Guest.LastName</td>
                    </tr>
                    <tr>
                        <td><strong>Email:</strong></td>
                        <td>@Model.Guest.Email</td>
                    </tr>
                    @if (!string.IsNullOrEmpty(Model.Guest.Phone))
                    {
                        <tr>
                            <td><strong>Teléfono:</strong></td>
                            <td>@Model.Guest.Phone</td>
                        </tr>
                    }
                    <tr>
                        <td><strong>Dirección:</strong></td>
                        <td>@Model.Guest.Address</td>
                    </tr>
                    <tr>
                        <td><strong>Ciudad:</strong></td>
                        <td>@Model.Guest.City, @Model.Guest.Country @Model.Guest.PostalCode</td>
                    </tr>
                </table>
            </div>
        </div>
    </div>

    <!-- Información de la Reservación -->
    <div class="col-md-6">
        <div class="card">
            <div class="card-content">
                <h3>Detalles de la Reservación</h3>
                <table class="detail-table">
                    <tr>
                        <td><strong>Habitación:</strong></td>
                        <td>@Model.Room.Name</td>
                    </tr>
                    <tr>
                        <td><strong>Check-in:</strong></td>
                        <td>@Model.CheckInDate.ToString("dddd, dd 'de' MMMM 'de' yyyy")</td>
                    </tr>
                    <tr>
                        <td><strong>Check-out:</strong></td>
                        <td>@Model.CheckOutDate.ToString("dddd, dd 'de' MMMM 'de' yyyy")</td>
                    </tr>
                    <tr>
                        <td><strong>Noches:</strong></td>
                        <td>@ViewBag.Nights</td>
                    </tr>
                    <tr>
                        <td><strong>Total Pagado:</strong></td>
                        <td style="font-size: 1.2em; font-weight: 600;">$@Model.TotalAmount.ToString("N2")</td>
                    </tr>
                    <tr>
                        <td><strong>Estado:</strong></td>
                        <td><span class="status-badge active">@Model.Status</span></td>
                    </tr>
                    <tr>
                        <td><strong>Método de Pago:</strong></td>
                        <td>@Model.PaymentMethod</td>
                    </tr>
                    <tr>
                        <td><strong>Fecha de Reserva:</strong></td>
                        <td>@Model.CreatedAt.ToString("dd/MM/yyyy HH:mm")</td>
                    </tr>
                </table>
            </div>
        </div>
    </div>
</div>

<style>
    .detail-table {
        width: 100%;
        margin-top: 20px;
    }
    
    .detail-table td {
        padding: 10px 0;
        border-bottom: 1px solid #f0f0f0;
    }
    
    .detail-table tr:last-child td {
        border-bottom: none;
    }
    
    .row {
        display: flex;
        gap: 20px;
        margin-top: 20px;
    }
    
    .col-md-6 {
        flex: 1;
    }
    
    @media (max-width: 768px) {
        .row {
            flex-direction: column;
        }
    }
</style>
```

#### 4.4 CSS para Reservaciones
```css
/* /wwwroot/css/reservations.css */
.status-badge.active {
    background: #e8f5e9;
    color: #388e3c;
    padding: 0.25rem 0.75rem;
    border-radius: 0.25rem;
    font-size: 0.75rem;
    font-weight: 500;
}

.empty-state {
    text-align: center;
    padding: 60px 20px;
}

.empty-state-icon {
    font-size: 48px;
    color: #ccc;
    margin-bottom: 20px;
}

.empty-state h3 {
    color: #666;
    margin-bottom: 10px;
}

.empty-state p {
    color: #999;
}

/* Mantener consistencia con otros módulos */
.table thead th {
    text-align: left;
    padding: 1rem;
    font-weight: 600;
    color: #666;
    font-size: 0.75rem;
    text-transform: uppercase;
    letter-spacing: 0.5px;
    border-bottom: 1px solid #e0e0e0;
}

.table tbody td {
    padding: 1rem;
    border-bottom: 1px solid #f5f5f9;
}

.user-info {
    display: flex;
    align-items: center;
    gap: 12px;
}

.user-name {
    font-weight: 600;
    color: #444564;
    font-size: 0.875rem;
}

.user-email {
    color: #a5a3ae;
    font-size: 0.75rem;
}
```

### FASE 5: Activar en Panel Lateral

#### 5.1 Modificar _MaterializeExactLayout.cshtml
```html
<!-- Buscar el item de Reservaciones (aproximadamente línea 70-80) -->
<li class="menu-item">
    <a href="@Url.Action("Index", "Reservations")" class="menu-link">
        <i class="menu-icon fas fa-calendar-alt"></i>
        <span class="menu-text" data-i18n="menu.reservations">Reservaciones</span>
        <span class="menu-tooltip" data-i18n="menu.reservations">Reservaciones</span>
    </a>
</li>
```

#### 5.2 Agregar el CSS en el Layout
```html
<!-- En la sección head del _MaterializeExactLayout.cshtml -->
<link rel="stylesheet" href="~/css/reservations.css" asp-append-version="true" />
```

### FASE 6: Testing y Ajustes

#### 6.1 Checklist de Pruebas
- [ ] Click en "Reservar" desde Featured Collection → Lleva a checkout con type=reservation
- [ ] Click en "Reservar" desde Product Page → Lleva a checkout con type=reservation
- [ ] Campos de fecha aparecen solo cuando es reservación
- [ ] Validación: Check-out debe ser después de Check-in
- [ ] Cálculo de noches funciona correctamente
- [ ] Precio total = precio por noche × número de noches
- [ ] Guest se crea si es nuevo
- [ ] Guest se actualiza si ya existe (mismo email)
- [ ] Reservation se crea con estado "Pagada"
- [ ] Panel de Reservaciones muestra todas las reservaciones
- [ ] Vista de detalles muestra información completa
- [ ] Búsqueda por cliente funciona
- [ ] Paginación funciona si hay muchas reservaciones

#### 6.2 Datos de Prueba
```sql
-- Para probar con datos existentes
INSERT INTO Reservations (GuestId, RoomId, CheckInDate, CheckOutDate, TotalAmount, Status, PaymentMethod, PaymentStatus, CreatedAt)
VALUES 
(1, 1, '2025-08-01', '2025-08-03', 200.00, 'Pagada', 'Tarjeta', 'Completed', CURRENT_TIMESTAMP),
(2, 2, '2025-08-05', '2025-08-07', 300.00, 'Pagada', 'Tarjeta', 'Completed', CURRENT_TIMESTAMP);
```

## 🔧 Resumen de Archivos a Modificar

1. **Frontend (2 archivos)**
   - `/wwwroot/js/website-builder/modules/featured-collection.js` - Agregar URL con params
   - `/wwwroot/js/website-builder/modules/product-container.js` - Agregar URL con params

2. **Checkout (2 archivos)**
   - `/Views/Checkout/Index.cshtml` - Agregar script para campos de fecha
   - `/Controllers/CheckoutController.cs` - Agregar lógica de reservación

3. **Nuevo Módulo (4 archivos nuevos)**
   - `/Controllers/ReservationsController.cs` ✨
   - `/Views/Reservations/Index.cshtml` ✨
   - `/Views/Reservations/Details.cshtml` ✨
   - `/wwwroot/css/reservations.css` ✨

4. **Layout (1 archivo)**
   - `/Views/Shared/_MaterializeExactLayout.cshtml` - Activar link y agregar CSS

## ⚠️ Consideraciones Importantes

1. **Sin validación de disponibilidad** - Por ahora no verificamos si la habitación está ocupada
2. **Precio fijo** - Usamos el precio del producto sin variaciones por temporada
3. **Sin cancelaciones** - Una vez pagada, la reservación no se puede cancelar desde el panel
4. **Guest automático** - Se crea/actualiza sin validación adicional de identidad

## ✅ Ventajas de Esta Implementación

1. **Mínimo código nuevo** - Reutilizamos checkout y estructura CRUD existente
2. **No invasivo** - No modificamos modelos ni creamos migraciones
3. **Fácil de extender** - Se puede agregar más funcionalidad después
4. **Consistente** - Sigue los mismos patrones del proyecto

## 🚀 Próximos Pasos (Futuras Mejoras)

1. **Calendario de disponibilidad** - Mostrar fechas ocupadas
2. **Confirmación por email** - Enviar detalles de la reservación
3. **Check-in/Check-out** - Marcar cuando el cliente llega/sale
4. **Reportes** - Ocupación, ingresos por período
5. **Políticas de cancelación** - Si se requiere en el futuro

---

## 🐛 Problemas Encontrados y Soluciones

### PROBLEMA #1: Botón Reservar redirige a página de producto en lugar de checkout
**Fecha**: 30/07/2025
**Archivo**: `/wwwroot/js/website-builder/modules/featured-collection.js`

#### Descripción del problema
Al hacer click en el botón "Reservar" en el preview real, el usuario era llevado a la página del producto en lugar del checkout. Esto ocurría porque el botón estaba dentro de un elemento `<a>` que envolvía toda la card del producto.

#### Causa raíz
- Los product cards tienen un link (`<a href="${productUrl}">`) que envuelve todo el contenido cuando `shouldAddLink = true` (línea 690)
- El evento click del botón se propagaba al elemento padre `<a>`, causando la navegación a la página del producto

#### Solución implementada
Se modificó la función `renderReserveButton` (líneas 1519 y 1534) para prevenir la propagación del evento:

```javascript
// Antes:
'onclick="window.location.href=\'/Checkout?type=reservation&productId=' + productId + '\'"'

// Después:
'onclick="event.stopPropagation(); event.preventDefault(); window.location.href=\'/Checkout?type=reservation&productId=' + productId + '\'; return false;"'
```

**Cambios específicos:**
- `event.stopPropagation()` - Detiene la propagación del evento al elemento padre
- `event.preventDefault()` - Previene el comportamiento por defecto del click
- `return false` - Asegura que el evento no continúe propagándose

#### Resultado
✅ El botón "Reservar" ahora redirige correctamente a `/Checkout?type=reservation&productId=[ID]`
✅ No interfiere con la navegación normal al hacer click en otras partes de la card

### PROBLEMA #2: Producto no se muestra en el panel derecho del checkout
**Fecha**: 30/07/2025
**Archivos**: 
- `/wwwroot/js/website-builder/modules/featured-collection.js`
- `/Views/Checkout/Index.cshtml`

#### Descripción del problema
Al hacer click en "Reservar", el checkout no mostraba el producto en el panel derecho. Solo funcionaba cuando se agregaba al carrito y se pagaba desde el offcanvas.

#### Causa raíz
- El checkout está diseñado para leer productos desde `localStorage` (key: `websiteBuilderCart`)
- Los botones "Comprar ahora" y "Reservar" no agregaban nada al localStorage
- Se intentó cargar desde API pero era más complejo y no necesario

#### Solución implementada
Se optó por la solución más sencilla: guardar temporalmente el producto en localStorage al hacer click en "Reservar".

**Paso 1**: Crear función global (líneas 3196-3226 en featured-collection.js)
```javascript
window.handleReservation = function(event, productId) {
    // Extraer info del producto del DOM
    const productCard = event.target.closest('.product-card');
    const productName = productCard.querySelector('h3')?.textContent || 'Producto';
    // ... extraer precio e imagen
    
    // Crear objeto temporal
    const reservationItem = {
        id: productId,
        name: productName,
        price: productPrice,
        quantity: 1,
        image: productImage,
        vendor: 'Hotel',
        isReservation: true
    };
    
    // Guardar en localStorage
    localStorage.setItem('websiteBuilderCart', JSON.stringify([reservationItem]));
    
    // Redirigir
    window.location.href = '/Checkout?type=reservation&productId=' + productId;
};
```

**Paso 2**: Modificar botón para usar la función (líneas 1519 y 1534)
```javascript
'onclick="event.stopPropagation(); event.preventDefault(); window.handleReservation(event, ' + productId + '); return false;"'
```

**Paso 3**: Ajustar checkout para no interferir con flujo normal (línea 718)
- Se mantiene `loadCartItems()` para ambos casos (normal y reservación)
- Se eliminó código que intentaba cargar desde API

#### Resultado parcial
✅ El producto ahora se muestra en el panel derecho
✅ No afecta el checkout normal
⚠️ **PENDIENTE**: El precio no se está extrayendo correctamente del DOM

#### Problema pendiente
La línea 3201 intenta extraer el precio con:
```javascript
const priceText = productCard.querySelector('[style*="font-size"][style*="font-weight: 600"]')?.textContent || '0';
```
Este selector no está encontrando el elemento correcto con el precio.

### SOLUCIÓN AL PROBLEMA #2: Precio no se mostraba (siempre $0.00)
**Fecha**: 30/07/2025
**Archivo**: `/wwwroot/js/website-builder/modules/featured-collection.js`

#### Descripción del problema
El producto se mostraba en el checkout pero con precio $0.00. El selector CSS usado para extraer el precio del DOM no funcionaba correctamente.

#### Solución implementada
Se optó por la solución más segura: agregar el precio como data attribute al botón.

**Paso 1**: Pasar el precio como parámetro adicional (línea 756)
```javascript
// Antes:
${settings.showReserveButton ? window.WebsiteBuilderModules.FeaturedCollection.renderReserveButton(settings, schemeColors, cardId, productId) : ''}

// Después:
${settings.showReserveButton ? window.WebsiteBuilderModules.FeaturedCollection.renderReserveButton(settings, schemeColors, cardId, productId, productPrice) : ''}
```

**Paso 2**: Actualizar la función para recibir el precio (línea 1489)
```javascript
renderReserveButton: function(settings, schemeColors, cardId, productId, productPrice) {
```

**Paso 3**: Agregar data-price al botón (líneas 1519 y 1535)
```javascript
// En ambos estilos de botón (outline y solid):
'data-price="' + (productPrice || 0) + '" ' +
```

**Paso 4**: Leer el precio del data attribute (línea 3204)
```javascript
// Antes:
const priceText = productCard.querySelector('[style*="font-size"][style*="font-weight: 600"]')?.textContent || '0';
const productPrice = parseFloat(priceText.replace(/[^0-9.-]+/g, '')) || 0;

// Después:
const button = event.target.closest('button');
const productPrice = parseFloat(button.getAttribute('data-price')) || 0;
```

#### Resultado
✅ El precio ahora se muestra correctamente en el checkout
✅ Solución más segura que no depende de selectores CSS
✅ El precio es exactamente el mismo que se muestra al usuario

---

## Confirmación de cumplimiento
✅ Plan super sencillo como se solicitó
✅ Reutiliza página de checkout existente
✅ No modifica modelos ni requiere migraciones
✅ Estado siempre "Pagada"
✅ Guest se crea/actualiza automáticamente
✅ Panel de reservaciones es solo lectura