# 🌐 Plan de Implementación - Dominios Personalizados para Websites

**Fecha**: 2 de Agosto 2025  
**Objetivo**: Permitir que cada website creado en el builder tenga su propio dominio personalizado  
**Tiempo estimado**: 4-6 horas  
**Impacto en código existente**: MÍNIMO

## 🧒 Explicación Simple - ¡Hasta un niño de 4 años lo entendería!

### 🏨 Imagina que tienes dos casas:

#### 🏢 **Casa 1: La Oficina del Hotel** (Sistema Administrativo)
- **Dirección actual**: `20.169.209.166` (como un número de teléfono feo)
- **Dirección futura**: `www.hotel23sistema.com` (más fácil de recordar)
- **¿Quién entra aquí?**: Solo el dueño del hotel con su llave (usuario y contraseña)
- **¿Qué hay dentro?**: 
  - La computadora para administrar el hotel
  - El lugar donde diseña su página web
  - Donde ve las reservaciones
  - Donde pone los precios

#### 🏖️ **Casa 2: El Hotel Bonito** (Website Público)
- **Dirección actual**: `20.169.209.166/WebsiteBuilder/Preview` (muy largo y feo)
- **Dirección que queremos**: `www.hotelparadise.com` (¡bonito y fácil!)
- **¿Quién entra aquí?**: Todos los turistas sin necesitar llave
- **¿Qué hay dentro?**:
  - Fotos bonitas del hotel
  - Lista de habitaciones
  - Botón para reservar
  - Carrito de compras

### 🎯 ¿Qué vamos a hacer?

Es como poner un **letrero bonito** en la Casa 2:
- **Antes**: Los turistas tenían que recordar `20.169.209.166/WebsiteBuilder/Preview` 😵
- **Después**: Solo escriben `www.hotelparadise.com` 😊

### 🔧 ¿Cómo funciona?

1. **El dueño del hotel** entra a su oficina (Casa 1)
2. Va al **Website Builder** y construye su página bonita
3. En la sección **"Dominios"** escribe: `www.mihotelbonito.com`
4. ¡Listo! Los turistas ya pueden visitar `www.mihotelbonito.com`

### 📊 Diagrama Visual

```
┌─────────────────────────┐         ┌─────────────────────────┐
│   CASA 1 - OFICINA      │         │   CASA 2 - HOTEL        │
│                         │         │                         │
│  🔐 Solo el dueño       │         │  🌍 Todos pueden entrar │
│                         │         │                         │
│  • Login con password   │         │  • Sin password         │
│  • Panel de control     │         │  • Ver habitaciones     │
│  • Editar website       │         │  • Hacer reservas       │
│  • Ver reservaciones    │         │  • Pagar online         │
│                         │         │                         │
│  Dirección futura:      │         │  Dirección futura:      │
│  admin.hotel23.com      │         │  www.hotelparadise.com  │
└─────────────────────────┘         └─────────────────────────┘
          ↓                                     ↑
          └──────── El dueño construye ────────┘
                    y los cambios aparecen
                    ¡instantáneamente!
```

### ❓ Preguntas que un niño haría:

**P: ¿Por qué hay dos casas?**
R: Una es para trabajar (oficina) y otra para mostrar a los visitantes (hotel).

**P: ¿Puedo tener muchos hoteles?**
R: No, cada dueño tiene UN solo hotel. Como tener una sola casa de muñecas.

**P: ¿Si cambio algo en la oficina, se ve en el hotel?**
R: ¡Sí! Es mágico. Si cambias el color en la oficina, el hotel cambia de color al instante.

**P: ¿Los turistas pueden entrar a la oficina?**
R: No, solo el dueño tiene la llave. Los turistas solo ven el hotel bonito.

## 📋 Resumen Ejecutivo (Para Adultos)

**Situación actual**:
- Sistema Hotel23 en Azure: http://20.169.209.166
- Preview del website: http://20.169.209.166/WebsiteBuilder/Preview

**Objetivo**:
- Sistema Hotel23: www.hotel23sistema.com (dominio administrativo)
- Website del cliente: www.hotelparadise.com (dominio público del hotel)

**Arquitectura**:
- **1 Sistema** = 1 instalación de Hotel23
- **1 Base de Datos** = 1 hotel/cliente
- **1 Website** = El construido en Website Builder
- **2 Dominios Separados**:
  - Dominio Admin: Para gestión (con login)
  - Dominio Público: Para huéspedes (el Preview actual)

## 🎯 Estrategia: Cambios Mínimos, Máximo Impacto

### Principio Fundamental
NO modificaremos la lógica existente del Website Builder. Solo agregaremos una capa de routing que detecte dominios personalizados y muestre el preview correspondiente.

## 📊 Base de Datos - Cambios Mínimos

### 1. Nueva tabla CustomDomains
```sql
CREATE TABLE "CustomDomains" (
    "Id" SERIAL PRIMARY KEY,
    "DomainName" VARCHAR(255) NOT NULL UNIQUE,
    "WebSiteId" INTEGER NOT NULL,
    "Status" VARCHAR(50) DEFAULT 'pending',
    "IsActive" BOOLEAN DEFAULT false,
    "CreatedAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    "UpdatedAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY ("WebSiteId") REFERENCES "WebSites"("Id")
);

-- Índice para búsquedas rápidas por dominio
CREATE INDEX idx_customdomains_domain ON "CustomDomains"("DomainName");
```

### 2. Agregar al modelo (Models/CustomDomain.cs)
```csharp
public class CustomDomain
{
    public int Id { get; set; }
    public string DomainName { get; set; }
    public int WebSiteId { get; set; }
    public string Status { get; set; } = "pending";
    public bool IsActive { get; set; } = false;
    public DateTime CreatedAt { get; set; }
    public DateTime UpdatedAt { get; set; }
    
    public virtual WebSite WebSite { get; set; }
}
```

### 3. Actualizar HotelDbContext
```csharp
public DbSet<CustomDomain> CustomDomains { get; set; }
```

Nombre de migración: `AddCustomDomainsTable`

## 🔧 Cambios en el Backend - Mínimos y Seguros

### 1. Nuevo Controller: PublicSiteController.cs
```csharp
[AllowAnonymous]
public class PublicSiteController : Controller
{
    private readonly HotelDbContext _context;
    
    public PublicSiteController(HotelDbContext context)
    {
        _context = context;
    }
    
    [Route("/")]
    [Route("/{*catchall}")]
    public async Task<IActionResult> Index(string catchall = null)
    {
        // 1. Obtener el dominio de la petición
        var requestedDomain = Request.Host.Host.ToLower();
        
        // 2. Si es la IP o dominio del sistema, continuar normal
        if (requestedDomain == "20.169.209.166" || 
            requestedDomain == "localhost" ||
            requestedDomain.Contains("hotel23sistema"))
        {
            // Redirigir al home del sistema
            return Redirect("/Home/ExactIndex");
        }
        
        // 3. Buscar si es un dominio personalizado
        var customDomain = await _context.CustomDomains
            .Include(cd => cd.WebSite)
            .FirstOrDefaultAsync(cd => cd.DomainName == requestedDomain && cd.IsActive);
        
        if (customDomain == null)
        {
            return NotFound("Sitio web no encontrado");
        }
        
        // 4. Cargar el website y mostrar el preview
        var website = customDomain.WebSite;
        
        // Usar la MISMA vista Preview que ya existe
        return View("~/Views/WebsiteBuilder/Preview.cshtml", new PreviewViewModel
        {
            WebsiteId = website.Id,
            IsPublicView = true // Flag para ocultar controles de edición
        });
    }
}
```

### 2. Modificación MÍNIMA en Program.cs
```csharp
// Agregar ANTES de las rutas existentes
app.MapControllerRoute(
    name: "publicSite",
    pattern: "{*catchall}",
    defaults: new { controller = "PublicSite", action = "Index" },
    constraints: new { catchall = new CustomDomainConstraint() }
);

// Mantener las rutas existentes como están
app.MapControllerRoute(
    name: "default",
    pattern: "{controller=Account}/{action=Login}/{id?}");
```

### 3. CustomDomainConstraint.cs (nuevo archivo)
```csharp
public class CustomDomainConstraint : IRouteConstraint
{
    public bool Match(HttpContext httpContext, IRouter route, string routeKey, 
                     RouteValueDictionary values, RouteDirection routeDirection)
    {
        var host = httpContext.Request.Host.Host.ToLower();
        
        // NO interceptar si es el dominio del sistema
        if (host == "20.169.209.166" || 
            host == "localhost" || 
            host.Contains("hotel23sistema"))
        {
            return false;
        }
        
        // SI interceptar para cualquier otro dominio
        return true;
    }
}
```

## 🎨 UI/UX Detallada - Experiencia del Usuario

### 📍 Ubicación en el Website Builder
El usuario verá una nueva sección en el panel lateral:
- 🏠 Tema
- 📱 Diseño de móvil
- 🎨 Colores
- 🔤 Tipografía
- ➕ Secciones de plantilla
- 📄 Páginas
- 🗂️ Colecciones
- 📦 Productos
- ⚙️ Configuración
- 🌐 Dominio personalizado ← NUEVA SECCIÓN

### 🖼️ Estados de la UI

#### Estado 1: Sin dominio configurado
```
┌─────────────────────────────────────┐
│ 🌐 Dominio Personalizado            │
│                                     │
│ Tu sitio actual:                   │
│ 🔗 20.169.209.166/WebsiteBuilder/  │
│     Preview                         │
│                                     │
│ Conecta tu propio dominio:         │
│ ┌─────────────────────────────┐    │
│ │ www.mihotel.com             │    │
│ └─────────────────────────────┘    │
│                                     │
│ [🔗 Conectar Dominio]               │
│                                     │
│ 📋 Instrucciones:                   │
│ 1. Ve a tu proveedor (Namecheap)   │
│ 2. Agrega estos registros DNS:     │
│    ┌──────────────────────────┐    │
│    │ Tipo: A Record           │    │
│    │ Host: @                  │    │
│    │ Valor: 20.169.209.166   │    │
│    │                          │    │
│    │ Tipo: A Record           │    │
│    │ Host: www                │    │
│    │ Valor: 20.169.209.166   │    │
│    └──────────────────────────┘    │
│ 3. Espera 10-30 min              │
└─────────────────────────────────────┘
```

#### Estado 2: Dominio conectado y activo
```
┌─────────────────────────────────────┐
│ 🌐 Dominio Personalizado            │
│                                     │
│ ✅ Dominio activo:                  │
│ 🌍 www.hotelparadise.com           │
│                                     │
│ Estado: ● Activo                    │
│ Conectado: Hace 2 días              │
│                                     │
│ [📝 Cambiar dominio]                │
│                                     │
│ 💡 Tip: Los cambios en el editor   │
│ se reflejan inmediatamente en tu   │
│ dominio personalizado.             │
└─────────────────────────────────────┘
```

### 🔄 Flujo de Usuario Paso a Paso

1. **Click en "Dominio personalizado"**
   - Se abre la sección en el panel lateral
   - Muestra URL actual y campo para nuevo dominio

2. **Ingreso del dominio**
   - Usuario escribe: `www.hotelparadise.com`
   - Validación en tiempo real del formato
   - Feedback visual inmediato

3. **Guardar dominio**
   - Click en "Conectar Dominio"
   - Spinner de "Guardando..."
   - Mensaje de éxito

4. **Configuración DNS**
   - Usuario copia valores mostrados
   - Los configura en Namecheap
   - Espera propagación

### 💬 Mensajes y Validaciones

**Errores**:
- ❌ "Por favor ingresa un dominio válido (ej: www.mihotel.com)"
- ❌ "Este dominio ya está en uso"

**Éxito**:
- ✅ "Dominio guardado correctamente"
- ✅ "DNS configurado correctamente" (futura verificación)

**Estados**:
- ⏳ "Pendiente - Configura los DNS"
- 🔄 "Propagando - Espera 10-30 minutos"
- ✅ "Activo - Tu sitio está disponible"

## 🎨 UI en Website Builder - Implementación Técnica

### 1. En website-builder.js - Agregar nueva sección (~línea 5500)
```javascript
// Agregar después de las secciones existentes
else if (sectionId === 'domain-settings') {
    html += `
        <div class="settings-section" style="margin-top: 30px; padding: 20px; background: #f8f9fa; border-radius: 8px;">
            <h4 style="font-size: 13px; font-weight: 500; color: #5c5e60; margin-bottom: 15px;">
                <i class="material-icons" style="vertical-align: middle; font-size: 18px;">language</i>
                Dominio Personalizado
            </h4>
            
            <div id="domain-config-container">
                <!-- Se carga dinámicamente -->
            </div>
        </div>
    `;
}
```

### 2. Función para cargar configuración de dominio CON TRADUCCIONES Y COLORES
```javascript
// Agregar traducciones para la sección de dominios
if (!translations.es['domain.title']) {
    translations.es['domain.title'] = 'Dominio Personalizado';
    translations.es['domain.active'] = 'Dominio activo:';
    translations.es['domain.status'] = 'Estado:';
    translations.es['domain.connected'] = 'Conectado';
    translations.es['domain.connectButton'] = 'Conectar Dominio';
    translations.es['domain.changeButton'] = 'Cambiar dominio';
    translations.es['domain.inputLabel'] = 'Ingresa tu dominio personalizado:';
    translations.es['domain.placeholder'] = 'www.mihotel.com';
    translations.es['domain.instructions'] = 'Instrucciones:';
    translations.es['domain.step1'] = 'Ve a tu proveedor de dominio (Namecheap, GoDaddy, etc)';
    translations.es['domain.step2'] = 'Agrega estos registros DNS:';
    translations.es['domain.step3'] = 'Espera 10-30 minutos para propagación';
    translations.es['domain.tip'] = 'Tip: Los cambios en el editor se reflejan inmediatamente en tu dominio personalizado.';
    translations.es['domain.currentSite'] = 'Tu sitio actual:';
    translations.es['domain.invalidFormat'] = 'Por favor ingresa un dominio válido';
    translations.es['domain.saveSuccess'] = 'Dominio guardado correctamente';
    
    translations.en['domain.title'] = 'Custom Domain';
    translations.en['domain.active'] = 'Active domain:';
    translations.en['domain.status'] = 'Status:';
    translations.en['domain.connected'] = 'Connected';
    translations.en['domain.connectButton'] = 'Connect Domain';
    translations.en['domain.changeButton'] = 'Change domain';
    translations.en['domain.inputLabel'] = 'Enter your custom domain:';
    translations.en['domain.placeholder'] = 'www.myhotel.com';
    translations.en['domain.instructions'] = 'Instructions:';
    translations.en['domain.step1'] = 'Go to your domain provider (Namecheap, GoDaddy, etc)';
    translations.en['domain.step2'] = 'Add these DNS records:';
    translations.en['domain.step3'] = 'Wait 10-30 minutes for propagation';
    translations.en['domain.tip'] = 'Tip: Changes in the editor are immediately reflected on your custom domain.';
    translations.en['domain.currentSite'] = 'Your current site:';
    translations.en['domain.invalidFormat'] = 'Please enter a valid domain';
    translations.en['domain.saveSuccess'] = 'Domain saved successfully';
}

window.loadDomainConfiguration = function() {
    $.get('/api/builder/websites/current/domain')
        .done(function(data) {
            let html = '';
            
            if (data.customDomain) {
                html = `
                    <div style="padding: 15px; background: #e8f5e9; border-radius: 4px; margin-bottom: 15px;">
                        <p style="margin: 0; color: #2e7d32;">
                            <i class="material-icons" style="vertical-align: middle; font-size: 16px;">check_circle</i>
                            <span data-i18n="domain.active">Dominio activo:</span> 
                            <strong>${data.customDomain.domainName}</strong>
                        </p>
                    </div>
                    
                    <div style="margin-bottom: 15px;">
                        <p style="font-size: 13px; color: #666;">
                            <span data-i18n="domain.status">Estado:</span> 
                            <span style="color: #2e7d32; font-weight: 500;">● <span data-i18n="domain.connected">Conectado</span></span>
                        </p>
                    </div>
                    
                    <button id="change-domain-btn" class="btn" 
                            style="background: transparent; border: 1px solid var(--primary); color: var(--primary); width: 100%;">
                        <i class="material-icons" style="font-size: 16px; vertical-align: middle;">edit</i>
                        <span data-i18n="domain.changeButton">Cambiar dominio</span>
                    </button>
                    
                    <div style="margin-top: 15px; padding: 15px; background: #f5f5f5; border-radius: 4px;">
                        <p style="font-size: 12px; color: #666; margin: 0;">
                            💡 <span data-i18n="domain.tip">Tip: Los cambios en el editor se reflejan inmediatamente en tu dominio personalizado.</span>
                        </p>
                    </div>
                `;
            } else {
                html = `
                    <div style="margin-bottom: 15px;">
                        <p style="font-size: 13px; color: #666;">
                            <span data-i18n="domain.currentSite">Tu sitio actual:</span><br>
                            <code style="background: #f5f5f5; padding: 4px 8px; border-radius: 4px; font-size: 12px;">
                                20.169.209.166/WebsiteBuilder/Preview
                            </code>
                        </p>
                    </div>
                
                    <div style="margin-bottom: 20px;">
                        <label style="display: block; margin-bottom: 8px; font-size: 13px;" data-i18n="domain.inputLabel">
                            Ingresa tu dominio personalizado:
                        </label>
                        <input type="text" id="custom-domain-input" 
                               data-i18n-placeholder="domain.placeholder"
                               placeholder="www.mihotel.com" 
                               style="width: 100%; padding: 10px; border: 1px solid #ddd; border-radius: 4px; font-size: 14px; transition: border-color 0.3s;">
                    </div>
                    
                    <button id="save-domain-btn" class="btn" 
                            style="background: var(--primary); color: white; width: 100%; padding: 12px; font-size: 14px; font-weight: 500; border: none; border-radius: 6px; cursor: pointer; transition: opacity 0.3s;">
                        <i class="material-icons" style="font-size: 18px; vertical-align: middle;">link</i>
                        <span data-i18n="domain.connectButton">Conectar Dominio</span>
                    </button>
                    
                    <div style="margin-top: 15px; padding: 15px; background: #f5f5f5; border-radius: 4px;">
                        <p style="font-size: 12px; color: #666; margin: 0 0 10px 0;">
                            <strong data-i18n="domain.instructions">Instrucciones:</strong>
                        </p>
                        <ol style="font-size: 12px; color: #666; margin: 0; padding-left: 20px;">
                            <li data-i18n="domain.step1">Ve a tu proveedor de dominio (Namecheap, GoDaddy, etc)</li>
                            <li data-i18n="domain.step2">Agrega estos registros DNS:</li>
                            <li style="font-family: monospace; background: #fff; padding: 8px; margin: 5px 0; border-radius: 4px;">
                                Tipo: A Record<br>
                                Host: @<br>
                                Valor: 20.169.209.166<br><br>
                                Tipo: A Record<br>
                                Host: www<br>
                                Valor: 20.169.209.166
                            </li>
                            <li data-i18n="domain.step3">Espera 10-30 minutos para propagación</li>
                        </ol>
                    </div>
                `;
            }
            
            $('#domain-config-container').html(html);
            
            // Aplicar traducciones después de insertar HTML
            setTimeout(applyTranslations, 0);
            
            // Event listeners
            $('#save-domain-btn').on('click', function() {
                const domain = $('#custom-domain-input').val().trim();
                if (domain) {
                    saveDomainConfiguration(domain);
                }
            });
            
            $('#change-domain-btn').on('click', function() {
                // Recargar vista para mostrar formulario de edición
                loadDomainConfiguration();
            });
            
            // Hover effect para botón principal (respetando var(--primary))
            $('#save-domain-btn').hover(
                function() { $(this).css('opacity', '0.9'); },
                function() { $(this).css('opacity', '1'); }
            );
            
            // Focus effect para input (usando var(--primary))
            $('#custom-domain-input').on('focus', function() {
                $(this).css('border-color', 'var(--primary)');
            }).on('blur', function() {
                $(this).css('border-color', '#ddd');
            });
        });
};

// Función para guardar configuración de dominio
window.saveDomainConfiguration = function(domain) {
    // Validación básica del formato de dominio
    const domainRegex = /^[a-zA-Z0-9][a-zA-Z0-9-]{0,61}[a-zA-Z0-9](\.[a-zA-Z]{2,})+$/;
    if (!domainRegex.test(domain)) {
        alert(translations[currentLanguage]['domain.invalidFormat'] || 'Por favor ingresa un dominio válido');
        return;
    }
    
    // Mostrar loading
    const $button = $('#save-domain-btn');
    const originalText = $button.html();
    $button.html('<i class="material-icons spin" style="font-size: 18px;">sync</i> Guardando...').prop('disabled', true);
    
    $.post('/api/builder/websites/current/domain', { domainName: domain })
        .done(function() {
            // Marcar cambios pendientes
            hasPendingGlobalSettingsChanges = true;
            updateSaveButtonState();
            
            // Mostrar mensaje de éxito
            showToast(translations[currentLanguage]['domain.saveSuccess'] || 'Dominio guardado correctamente');
            
            // Recargar la vista
            loadDomainConfiguration();
        })
        .fail(function(xhr) {
            const error = xhr.responseJSON?.message || 'Error al guardar el dominio';
            alert(error);
        })
        .always(function() {
            $button.html(originalText).prop('disabled', false);
        });
};

// CSS adicional necesario (agregar a website-builder.css)
/*
.spin {
    animation: spin 1s linear infinite;
}

@keyframes spin {
    from { transform: rotate(0deg); }
    to { transform: rotate(360deg); }
}
*/
```

### 3. Endpoint API para dominio
```csharp
[HttpGet("api/builder/websites/current/domain")]
public async Task<IActionResult> GetDomainConfiguration()
{
    var website = await _context.WebSites.FirstOrDefaultAsync();
    if (website == null) return NotFound();
    
    var customDomain = await _context.CustomDomains
        .FirstOrDefaultAsync(cd => cd.WebSiteId == website.Id);
    
    return Ok(new { customDomain });
}

[HttpPost("api/builder/websites/current/domain")]
public async Task<IActionResult> SaveDomainConfiguration([FromBody] DomainRequest request)
{
    var website = await _context.WebSites.FirstOrDefaultAsync();
    if (website == null) return NotFound();
    
    // Verificar si ya existe
    var existing = await _context.CustomDomains
        .FirstOrDefaultAsync(cd => cd.WebSiteId == website.Id);
    
    if (existing != null)
    {
        existing.DomainName = request.DomainName;
        existing.UpdatedAt = DateTime.UtcNow;
    }
    else
    {
        _context.CustomDomains.Add(new CustomDomain
        {
            DomainName = request.DomainName,
            WebSiteId = website.Id,
            Status = "pending",
            IsActive = true // Por ahora activar inmediatamente
        });
    }
    
    await _context.SaveChangesAsync();
    return Ok();
}
```

## 🚀 Configuración de Azure/Nginx

### 1. Actualizar Nginx para aceptar cualquier dominio
```bash
sudo nano /etc/nginx/sites-available/hotel23

# Cambiar server_name de:
server_name 20.169.209.166;

# A:
server_name _;  # Acepta CUALQUIER dominio
```

### 2. Reiniciar Nginx
```bash
sudo nginx -t
sudo systemctl reload nginx
```

## 📝 Pasos de Implementación (4-6 horas)

### Hora 1: Base de Datos
1. Crear modelo CustomDomain
2. Actualizar DbContext
3. Crear y ejecutar migración

### Hora 2: Backend
1. Crear PublicSiteController
2. Agregar CustomDomainConstraint
3. Modificar Program.cs

### Hora 3: API Endpoints
1. Crear endpoints Get/Post para dominios
2. Probar con Postman

### Hora 4: Frontend
1. Agregar sección en website-builder.js
2. Implementar loadDomainConfiguration
3. Probar guardado de dominio

### Hora 5: Configuración Servidor
1. Actualizar Nginx
2. Probar con dominio real

### Hora 6: Testing y Ajustes
1. Probar flujo completo
2. Ajustes finales

## ✅ Testing - Paso a Paso

### 1. Probar sin dominio real (usando hosts file)
En tu computadora local:
```
# Windows: C:\Windows\System32\drivers\etc\hosts
# Agregar:
20.169.209.166  test.mihotel.com
```

### 2. Verificar que funciona
- Navegar a http://test.mihotel.com
- Debe mostrar el website del builder
- El sistema admin sigue en http://20.169.209.166

### 3. Probar con dominio real
- Comprar dominio barato para pruebas
- Configurar CNAME
- Verificar después de propagación DNS

## 🎯 Resultado Final

**Para el administrador del hotel**:
- Accede a http://20.169.209.166 (o futuro hotel23sistema.com)
- Configura su dominio en el Website Builder
- Ve su sitio inmediatamente en www.suhotel.com

**Para los huéspedes**:
- Navegan a www.suhotel.com
- Ven el sitio del hotel sin saber que usa Hotel23
- Pueden hacer reservaciones bajo el dominio del hotel

## ⚠️ PRECAUCIONES CRÍTICAS - BASADAS EN REVISIÓN DEL SISTEMA

### 1. **Autenticación y Autorización**
- **CRÍTICO**: WebsiteBuilderController NO tiene atributo [Authorize]
- **Implicación**: Las rutas de Preview son públicas actualmente
- **Acción**: PublicSiteController debe ser [AllowAnonymous] explícitamente
- **Verificar**: Que los endpoints API del dominio SÍ tengan [Authorize]

### 2. **Rutas Existentes**
El sistema ya tiene rutas específicas mapeadas en Program.cs:
```csharp
- /cart → WebsiteBuilder/Preview
- /products → WebsiteBuilder/Preview  
- /collections → WebsiteBuilder/Preview
- /policies → WebsiteBuilder/Preview
- /pages → WebsiteBuilder/Preview
```
**CRÍTICO**: Nuestro catchall route debe respetar estas rutas en dominios personalizados

### 3. **Estructura de Preview**
- Preview.cshtml detecta la página por Request.Path
- Usa ViewBag para pasar handles y tipos
- **IMPORTANTE**: Mantener esta lógica al servir desde dominio personalizado

### 4. **Base de Datos - Single Entity**
- El sistema asume UN website por base de datos
- WebSites.FirstOrDefaultAsync() se usa en todo el código
- **NO cambiar este patrón**

### 5. **Orden de las Rutas**
```csharp
// CORRECTO - Agregar ANTES de rutas existentes
app.UseRouting();
app.UseCors();
app.UseAuthentication();
app.UseAuthorization();

// AQUÍ va nuestra ruta catchall con constraint
app.MapControllerRoute(
    name: "publicSite",
    pattern: "{*catchall}",
    defaults: new { controller = "PublicSite", action = "Index" },
    constraints: new { catchall = new CustomDomainConstraint() }
);

// DESPUÉS las rutas existentes
app.MapControllerRoute(name: "default"...);
// etc...
```

### 6. **Modificación al PublicSiteController**
Debe manejar las sub-rutas correctamente:
```csharp
// En Index action, después de verificar el dominio:
if (customDomain != null)
{
    // Pasar la ruta al Preview para que detecte la página
    return View("~/Views/WebsiteBuilder/Preview.cshtml");
    // El Preview.cshtml ya maneja Request.Path para determinar qué mostrar
}
```

### 7. **Seguridad del Dominio**
- **Validar formato**: Solo permitir dominios válidos (regex)
- **Lowercase siempre**: Los dominios deben guardarse en minúsculas
- **Sin protocolo**: Guardar solo "www.hotel.com", no "https://www.hotel.com"
- **Prevenir XSS**: Sanitizar entrada del dominio

### 8. **Endpoints API**
Agregar [Authorize] a los endpoints:
```csharp
[Authorize]
[HttpGet("api/builder/websites/current/domain")]
public async Task<IActionResult> GetDomainConfiguration()

[Authorize]
[HttpPost("api/builder/websites/current/domain")]
public async Task<IActionResult> SaveDomainConfiguration()
```

### 9. **Caché y Performance**
- Considerar cachear la búsqueda de CustomDomains
- El lookup se hará en CADA request al dominio personalizado
- Implementar MemoryCache si es necesario

### 10. **Logs y Monitoreo**
Agregar logs para debugging:
```csharp
_logger.LogInformation($"Domain request: {requestedDomain}");
_logger.LogInformation($"Custom domain found: {customDomain?.DomainName}");
```

## 🔄 Próximos Pasos (Futuro)

1. Verificación automática de DNS
2. SSL automático con Let's Encrypt
3. Múltiples dominios por hotel
4. Subdominios automáticos como fallback

---

## 📝 TRANSCRIPTS DE LA CONVERSACIÓN

### Conversación inicial sobre la estrategia:
**Usuario**: "Claude cuando compre un dominio la aplicacion tendra un xxxx, ahora bien aqui viene lo interesante. la website que hemos construido en el website builder, cuando le das a preview te lleva a la pagina real. pero que es lo queremos, que esa pagina de preview le asignemos un dominio real. para que los clientes puedan accedar a ella..."

**Claude**: Explicó el concepto de dominios personalizados estilo Shopify, donde cada hotel tendría su propio dominio pero usando la misma base de datos y sistema.

### Aclaración del modelo:
**Usuario**: "el sistema se construyo que solo puedes construir un website por db, para no complicarnos. la magia seria que si hago un cambio en el editor en la pagina real , ya con el dominio real, se actualiza ya que esta llamando al editor. como lo hace shopify..."

**Claude**: Confirmó que es el modelo perfecto de "Un Hotel = Una DB = Un Website = Un Dominio" y explicó cómo los cambios serían instantáneos sin necesidad de "publicar".

### Solicitud del plan:
**Usuario**: "me gusta. no nos podemos complicar , el sistema tendra su dominio pero el website que se construyo dentro le asignamos otro dominio... necesito que hagas un plan detallado con lo que hemos hablado y crees un arhivo dominiositioweb.md para implementar en unas horas, recuerda no debemos tocar nada de lo que esta implementado..."

### Revisión del sistema:
**Usuario**: "ok , ahora quiero que revises el sistema , para ver cuales precauciones o consideraciones importantes debemos tomar para implementar esto..."

---

## 🎨 CONSIDERACIONES DE COLORES Y TRADUCCIONES

### Sistema de Colores Primarios
Según `keypoints.md`, es OBLIGATORIO usar la variable CSS `--primary` para todos los elementos interactivos:

1. **Botón principal "Conectar Dominio"**:
   - Usa `background: var(--primary)` (NO hardcodear colores)
   - Hover con `opacity: 0.9` manteniendo el color primario

2. **Botón secundario "Cambiar dominio"**:
   - Borde y texto usando `var(--primary)`
   - Estilo outline para diferenciarlo del principal

3. **Focus states del input**:
   - Border cambia a `var(--primary)` al hacer focus
   - Transición suave de 0.3s

4. **Enlaces y elementos activos**:
   - Cualquier enlace debe usar `color: var(--primary)`

### Sistema de Traducciones
Como estamos en el Website Builder, debemos usar el sistema interno:

1. **Definir traducciones**:
   - Agregar todas las keys necesarias en ES y EN
   - Usar prefijo consistente: `domain.*`

2. **En HTML**:
   - Usar `data-i18n="key"` para textos
   - Usar `data-i18n-placeholder="key"` para placeholders
   - Usar `data-i18n-title="key"` para tooltips

3. **Aplicar traducciones**:
   - SIEMPRE llamar `setTimeout(applyTranslations, 0)` después de insertar HTML
   - Para textos dinámicos usar `translations[currentLanguage]['key']`

4. **LocalStorage key**:
   - Website Builder usa `selectedLanguage` (NO `preferredLanguage`)

### CSS Adicional Requerido
```css
/* Animación de loading */
.spin {
    animation: spin 1s linear infinite;
}

@keyframes spin {
    from { transform: rotate(0deg); }
    to { transform: rotate(360deg); }
}

/* Focus states respetando color primario */
#custom-domain-input:focus {
    border-color: var(--primary);
    box-shadow: 0 0 0 3px rgba(var(--primary-rgb), 0.1);
}

/* Botón secundario con color primario */
#change-domain-btn:hover {
    background-color: var(--primary);
    color: white;
    border-color: var(--primary);
}
```

### Checklist de Implementación
- [ ] Todos los botones usan `var(--primary)`
- [ ] Todas las keys de traducción definidas en ES y EN
- [ ] `data-i18n` agregado a todos los elementos
- [ ] `setTimeout(applyTranslations, 0)` después de cada innerHTML
- [ ] Focus states usando el color primario
- [ ] Sin colores hardcodeados en ningún lugar

---

**IMPORTANTE**: Este plan está diseñado para implementarse SIN romper nada existente. Cada paso es aditivo, no modificamos código core.

---

## 📊 IMPLEMENTACIÓN REALIZADA - FASE 1 (02/08/2025)

### ✅ Módulo CRUD de Dominios Personalizados Completado

#### 1. **Modelo y Base de Datos**
- ✅ Creado modelo `CustomDomain` en `/Models/CustomDomain.cs`
- ✅ Agregado a `HotelDbContext` línea 45: `public DbSet<CustomDomain> CustomDomains { get; set; }`
- ✅ Configuración en `OnModelCreating` líneas 251-259:
  - Índice único en DomainName
  - Relación con WebSite con cascade delete
- **Migración requerida**: `AddCustomDomainsPermissions`

#### 2. **Controller CRUD**
- ✅ Creado `CustomDomainsController.cs` con todas las acciones:
  - **Index** (líneas 23-31): Lista dominios con Include de WebSite
  - **Create GET** (líneas 34-55): Verifica single entity pattern
  - **Create POST** (líneas 58-146): Validación con regex, normalización lowercase
  - **Edit GET/POST** (líneas 149-262): Preserva campos no editables
  - **Delete** (líneas 265-288): Retorna JSON para AJAX
  - **ToggleStatus** (líneas 291-316): Activa/desactiva dominios vía AJAX
  - **IsValidDomain** (líneas 319-327): Validación regex del formato

#### 3. **Vistas Implementadas**
- ✅ **Index.cshtml** (473 líneas):
  - Búsqueda en tiempo real
  - Empty state para nuevos usuarios
  - Toggle switches para activación
  - Modales para eliminación e instrucciones DNS
  - AJAX para operaciones sin recargar página
  
- ✅ **Create.cshtml** (219 líneas):
  - Formulario con validación client-side
  - Instrucciones DNS con botón copiar
  - Estados inicial (pending/active)
  - Checkbox para activación inmediata
  
- ✅ **Edit.cshtml** (224 líneas):
  - Muestra fechas de auditoría
  - Selector de estados (pending/active/error/inactive)
  - Mantiene instrucciones DNS visibles

#### 4. **Estilos CSS**
- ✅ Creado `/wwwroot/css/custom-domains.css` (558 líneas):
  - Empty state con ícono grande
  - Status badges con colores semánticos
  - Toggle switches custom
  - Modales con overlay
  - DNS code blocks con botón copiar
  - Dark mode parcialmente soportado
  - Totalmente responsive

#### 5. **Integraciones al Sistema**
- ✅ Menú lateral en `_MaterializeExactLayout.cshtml`:
  - Agregado después de "Sitio Web" línea ~160
  - Ícono: `link`
  - Traducciones ES/EN incluidas
  
- ✅ Link CSS agregado al layout:
  ```html
  <link rel="stylesheet" href="~/css/custom-domains.css" asp-append-version="true" />
  ```

#### 6. **Sistema de Permisos**
- ✅ Agregados en `HotelDbContext` líneas 440-442:
  ```csharp
  // Dominios
  permissions.Add(new Permission { Id = permissionId++, Module = "Dominios", Action = "Read", Description = "Ver dominios personalizados", DisplayOrder = 11 });
  permissions.Add(new Permission { Id = permissionId++, Module = "Dominios", Action = "Write", Description = "Editar dominios personalizados", DisplayOrder = 11 });
  permissions.Add(new Permission { Id = permissionId++, Module = "Dominios", Action = "Create", Description = "Crear dominios personalizados", DisplayOrder = 11 });
  ```

#### 7. **Patrones Seguidos**
- ✅ Single Entity Pattern: `FirstOrDefaultAsync()` para WebSite
- ✅ ModelState.Remove("WebSite") para navigation properties
- ✅ DateTime.UtcNow para PostgreSQL
- ✅ TempData para mensajes Success/Error
- ✅ Traducción con `translatePage()` (módulos regulares)
- ✅ CSS variable `--primary` para botones e interactividad
- ✅ Breadcrumbs con Home enlazando a ExactIndex

#### 8. **Correcciones Aplicadas**
- ✅ Escapado símbolo @ en vistas Razor: `Host: @@`
- ✅ Sintaxis partial views: `<partial name="_ValidationScriptsPartial" />`
- ✅ CSS para dark mode: texto blanco en sección DNS
- ✅ Alert warning con colores dark mode friendly
- ✅ Botón secundario con `color: #ffffff !important`

### 📋 Características del Módulo

1. **Límite de dominios**: Máximo 3 por cliente (customizable)
2. **Validación**: Regex estricto para formato de dominio
3. **Normalización**: Dominios guardados en lowercase
4. **Estados**: pending, active, error, inactive
5. **DNS Instructions**: IP hardcodeada 20.169.209.166
6. **Sin verificación DNS**: Por ahora manual

### 🔄 Próxima Fase - Routing de Dominios

La siguiente fase implementará el routing real de dominios:

1. **PublicSiteController** - Servir websites en dominios custom
2. **CustomDomainConstraint** - Detectar requests de dominios
3. **Modificación Program.cs** - Agregar rutas con constraints
4. **API endpoints** en WebsiteBuilderController
5. **UI en Website Builder** - Sección para configurar dominio
6. **Nginx configuration** - Aceptar cualquier dominio

### 📝 Notas de Implementación

- **NO se modificó** código existente del Website Builder
- **NO se tocó** la lógica de Preview
- **Solo se agregaron** nuevos archivos y referencias
- **Totalmente aditivo** - sin romper funcionalidad existente

### 🧪 Testing Pendiente

1. Crear migración: `Add-Migration AddCustomDomainsPermissions`
2. Ejecutar: `Update-Database`
3. Probar CRUD completo
4. Verificar permisos en roles
5. Confirmar traducciones ES/EN

---

**Estado**: Fase 1 (CRUD) completada. Lista para testing y luego proceder con Fase 2 (Routing).

## 📅 Estado de la sesión (02/08/2025)

### ✅ Trabajo completado hoy:
- ✅ Fase 1 CRUD: Implementada completamente
- ✅ Correcciones aplicadas: 
  - CSS dark mode para mejor legibilidad
  - Símbolos @@ escapados en vistas Razor
  - Botones con colores ajustados
- ✅ IP dinámica: Implementada con `GetSystemIPAddress()`
- ✅ Documentación: Actualizada con toda la implementación

### ⏳ Pendiente antes de Fase 2:
- Testing completo del CRUD (crear/editar/eliminar dominios)
- Verificar permisos en roles
- Confirmar que las migraciones funcionan correctamente

### 🎯 Próxima sesión - Plan de acción:
1. **Verificar CRUD**: Asegurar que todo funciona correctamente
2. **Comenzar Fase 2**: Implementar PublicSiteController.cs
3. **Seguir el orden**: 
   - PublicSiteController → CustomDomainConstraint → Program.cs → API → UI
4. **Referencia**: Seguir el código base en líneas 67-156 del documento

### 💡 Notas importantes para retomar:
- El CRUD está completo pero los dominios aún NO sirven websites
- La Fase 2 conectará los dominios guardados con el preview real
- No modificar código existente del Website Builder
- Reutilizar Preview.cshtml existente

---

**Sesión concluida exitosamente** ✅

## 📊 IMPLEMENTACIÓN REALIZADA - FASE 2 (02/08/2025)

### ✅ Routing de Dominios Personalizados Completado

#### 🚨 PROBLEMA INICIAL Y SOLUCIÓN

**Intento fallido #1**: Usar routing constraints
- **Problema**: La ruta catchall `{*catchall}` era muy agresiva e interceptaba TODAS las peticiones, incluyendo localhost
- **Síntoma**: La aplicación no cargaba en Visual Studio ("página no encontrada")
- **Causa**: El constraint se evaluaba después del pattern matching, haciendo imposible excluir localhost
- **Archivos revertidos**: PublicSiteController.cs, CustomDomainConstraint.cs, modificaciones en Program.cs

**Solución correcta**: Middleware approach
- **Por qué funciona**: El middleware se ejecuta ANTES del routing
- **Ventaja**: No interfiere con las rutas existentes
- **Resultado**: Sistema funcionando perfectamente

#### 1. **Middleware Implementado**
✅ **Creado**: `/Middleware/CustomDomainMiddleware.cs` (120 líneas)

**Características principales**:
- **Líneas 30-35**: Constructor con inyección de dependencias
- **Líneas 42-95**: Método `InvokeAsync` que procesa cada request
- **Líneas 43**: Obtiene el host de la petición y lo convierte a minúsculas
- **Líneas 46-49**: Obtiene dominios del sistema desde configuración
- **Líneas 52-58**: Si es dominio del sistema, continúa normal
- **Líneas 61-89**: Si no es del sistema, busca en CustomDomains
- **Líneas 75-81**: Si es dominio personalizado Y es la raíz ("/"), redirige a "/WebsiteBuilder/Preview"
- **Líneas 98-114**: Método `IsSystemDomain` con verificaciones exhaustivas
- **Líneas 117-122**: Extension method para registro fácil

**Manejo de errores**:
- **Línea 91**: Try-catch envolvente para que errores no rompan la aplicación
- **Línea 94**: Si hay error, continúa con el pipeline normal

#### 2. **Configuración en appsettings.json**
✅ **Modificado**: `appsettings.json`

**Agregado** (líneas 9 y 13-20):
```json
"Hotel.Middleware.CustomDomainMiddleware": "Debug"  // Línea 9
"SystemDomains": {                                   // Líneas 13-20
  "AllowedHosts": [
    "localhost",
    "127.0.0.1",
    "::1",
    "20.169.209.166"
  ]
}
```

#### 3. **Integración en Program.cs**
✅ **Modificado**: `Program.cs`

**Cambios mínimos**:
- **Línea 9**: Agregado `using Hotel.Middleware;`
- **Línea 96**: Agregado `app.UseCustomDomainRouting();` ANTES de `app.UseRouting()`

**Por qué antes del routing**: Para interceptar y modificar las peticiones antes de que el sistema de rutas las procese.

#### 4. **Fix del Logo - Preview Principal**
✅ **Modificado**: `/Views/WebsiteBuilder/Preview.cshtml`

**Problema**: El logo redirigía a `/WebsiteBuilder/Preview` mostrando la ruta completa
**Solución** (líneas 1547-1552):
```javascript
// ANTES: window.location.href = '/WebsiteBuilder/Preview';
// DESPUÉS: window.location.href = '/';  // Línea 1550
```

#### 5. **Fix del Logo - Checkout**
✅ **Modificado**: `/Views/Checkout/Index.cshtml`

**Problema**: El logo no era clickeable en el checkout
**Solución** (línea 641):
```html
<!-- ANTES: <div class="logo-container"> -->
<!-- DESPUÉS: -->
<div class="logo-container" style="cursor: pointer;" onclick="window.location.href='/';">
```

### 🧪 Proceso de Testing Realizado

#### 1. **Configuración del archivo hosts**:
```
# C:\Windows\System32\drivers\etc\hosts
127.0.0.1    test2hotelwebsite.store
```

#### 2. **Activación del dominio**:
- Dominio en BD: `test2hotelwebsite.store`
- Estado: `active`
- IsActive: `true`

#### 3. **Verificación de funcionamiento**:
- ✅ Sistema admin: `https://localhost:7060` → Login normal
- ✅ Website hotel: `https://test2hotelwebsite.store:7060` → Preview del hotel
- ✅ Navegación: Todas las rutas funcionan (/products, /cart, etc.)
- ✅ Logo: Redirige correctamente a "/" manteniendo el dominio

### 📝 Logs de Debug

El middleware genera logs útiles para debugging:
```
[CustomDomainMiddleware] Processing request for host: localhost
[CustomDomainMiddleware] System domain detected: localhost, bypassing custom domain check
[CustomDomainMiddleware] Processing request for host: test2hotelwebsite.store
[CustomDomainMiddleware] Custom domain found: test2hotelwebsite.store (ID: 1, WebSiteId: 1)
```

### 🔄 Cómo Revertir (si necesario)

**Opción rápida (5 segundos)**:
```csharp
// En Program.cs línea 96, comentar:
// app.UseCustomDomainRouting();
```

**Opción completa (30 segundos)**:
1. Eliminar: `/Middleware/CustomDomainMiddleware.cs`
2. En Program.cs:
   - Quitar línea 9: `using Hotel.Middleware;`
   - Quitar línea 96: `app.UseCustomDomainRouting();`
3. En appsettings.json:
   - Quitar línea 9 (logging del middleware)
   - Quitar líneas 13-20 (SystemDomains)
4. En Preview.cshtml:
   - Cambiar línea 1550 de `'/'` a `'/WebsiteBuilder/Preview'`
5. En Checkout/Index.cshtml:
   - Quitar el onclick de la línea 641

### 🚀 Configuración para Producción (Azure)

#### 1. **Nginx** - Aceptar cualquier dominio:
```nginx
# En /etc/nginx/sites-available/hotel23
# Cambiar:
server_name 20.169.209.166;
# Por:
server_name _;
```

#### 2. **DNS en Namecheap**:
```
Type: A Record
Host: @
Value: 20.169.209.166
TTL: Automatic

Type: A Record
Host: www
Value: 20.169.209.166
TTL: Automatic
```

#### 3. **Agregar dominio futuro del sistema**:
Cuando tengas el dominio del sistema (ej: admin.hotel23.com), agregarlo en:
- `appsettings.json` → SystemDomains.AllowedHosts
- `appsettings.Production.json` → Lo mismo

### 📋 Resumen de Archivos Modificados

1. **Creados**:
   - `/Middleware/CustomDomainMiddleware.cs` (120 líneas)

2. **Modificados**:
   - `Program.cs` (líneas 9 y 96)
   - `appsettings.json` (líneas 9 y 13-20)
   - `/Views/WebsiteBuilder/Preview.cshtml` (línea 1550)
   - `/Views/Checkout/Index.cshtml` (línea 641)

### ⚠️ Consideraciones Importantes

1. **Puerto en desarrollo**: El `:7060` siempre se verá en localhost, es normal
2. **Puerto en producción**: NO se verá, Nginx maneja los puertos 80/443
3. **Performance**: Cada request hace un lookup en BD, considerar caché en el futuro
4. **Seguridad**: El middleware valida dominios activos, no hay riesgo de acceso no autorizado

### 🎯 Resultado Final

- **Fase 1 (CRUD)**: ✅ Completada - Gestión de dominios
- **Fase 2 (Routing)**: ✅ Completada - Los dominios sirven el preview
- **Sistema 100% funcional**: Los hoteles pueden usar sus propios dominios

---

**Estado**: Sistema de dominios personalizados completamente implementado y funcionando. 🎉

## 🚀 FASE 3: DEPLOYMENT A PRODUCCIÓN (02/08/2025 - PENDIENTE)

### 📍 PUNTO DE PARTIDA - ¿Dónde estamos exactamente?

#### Estado actual del proyecto:
1. **Código**: 100% funcional en desarrollo local
2. **Testing local**: Probado con `test2hotelwebsite.store` usando archivo hosts
3. **Dominio real**: `test2hotelwebsite.store` comprado hace 3 horas en Namecheap
4. **Servidor Azure**: 
   - IP: `20.169.209.166`
   - NO tiene los cambios de dominios personalizados
   - Nginx configurado solo para la IP
   - App corriendo con nohup (no como servicio)

#### Lo que YA funciona:
- ✅ CRUD de dominios (agregar/editar/eliminar)
- ✅ Middleware detecta dominios personalizados
- ✅ Preview se muestra en dominio personalizado
- ✅ Logo redirige correctamente
- ✅ Todas las rutas funcionan (/cart, /products, etc.)

#### Lo que FALTA:
- ❌ Código no está en el servidor Azure
- ❌ Nginx no acepta cualquier dominio
- ❌ DNS no apuntan a Azure
- ❌ No probado en producción

### 🎯 PLAN DE ACCIÓN DETALLADO

#### PASO 1: Preparar el deployment (30 minutos)

##### 1.1 Publicar el proyecto
```powershell
# En la carpeta del proyecto
dotnet publish Hotel.csproj -c Release -o publish --runtime linux-x64 --self-contained false
```

**¿Por qué estos parámetros?**
- `-c Release`: Optimizado para producción
- `--runtime linux-x64`: El servidor es Ubuntu
- `--self-contained false`: Usa el runtime instalado en el servidor

##### 1.2 Comprimir los archivos
```powershell
# Opción 1: ZIP (más fácil en Windows)
Compress-Archive -Path publish\* -DestinationPath hotel23-app.zip -Force

# Opción 2: TAR.GZ (más eficiente para Linux)
# En Git Bash o WSL:
cd publish
tar -czf ../hotel23-app.tar.gz .
cd ..
```

##### 1.3 Verificar archivos críticos
Antes de subir, verificar que estén:
- ✅ `/publish/appsettings.json` (con SystemDomains)
- ✅ `/publish/appsettings.Production.json`
- ✅ Todos los DLLs necesarios

#### PASO 2: Backup del servidor (15 minutos)

##### 2.1 Conectar por SSH
```bash
ssh azureuser@20.169.209.166
```

##### 2.2 Crear backup de la app actual
```bash
# Crear carpeta de backups si no existe
mkdir -p ~/backups

# Backup con fecha
sudo cp -r /home/azureuser/hotel-app /home/azureuser/backups/hotel-app-$(date +%Y%m%d-%H%M%S)

# Verificar
ls -la ~/backups/
```

##### 2.3 Backup de la base de datos
```bash
# Backup de la BD (por si acaso)
pg_dump -h localhost -U hoteluser -d Hotel > ~/backups/hotel-db-$(date +%Y%m%d-%H%M%S).sql
# Password: 123456
```

#### PASO 3: Subir y desplegar (20 minutos)

##### 3.1 Subir archivo desde local
```powershell
# Desde tu máquina local (PowerShell)
scp hotel23-app.zip azureuser@20.169.209.166:/home/azureuser/
```

##### 3.2 En el servidor - Detener app actual
```bash
# Encontrar el proceso
ps aux | grep dotnet | grep -v grep

# Anotar el PID y detenerlo
kill -9 [PID]

# O usar el one-liner
ps aux | grep dotnet | grep -v grep | awk '{print $2}' | xargs kill -9
```

##### 3.3 Descomprimir y reemplazar
```bash
# Ir al directorio
cd /home/azureuser

# Descomprimir en carpeta temporal
mkdir -p hotel-app-new
unzip hotel23-app.zip -d hotel-app-new/

# Reemplazar
rm -rf hotel-app-old
mv hotel-app hotel-app-old
mv hotel-app-new hotel-app

# Verificar permisos
chmod +x hotel-app/Hotel
```

##### 3.4 Iniciar la aplicación
```bash
cd /home/azureuser/hotel-app
ASPNETCORE_ENVIRONMENT=Production ASPNETCORE_URLS=http://0.0.0.0:5002 nohup dotnet Hotel.dll > app.log 2>&1 &

# Verificar que inició
tail -f app.log
# Ctrl+C para salir del tail
```

#### PASO 4: Configurar Nginx (10 minutos)

##### 4.1 Editar configuración
```bash
sudo nano /etc/nginx/sites-available/hotel23
```

##### 4.2 Cambiar server_name
```nginx
# ANTES:
server_name 20.169.209.166;

# DESPUÉS:
server_name _;  # Acepta CUALQUIER dominio
```

##### 4.3 Aplicar cambios
```bash
# Verificar sintaxis
sudo nginx -t

# Si todo está OK:
sudo systemctl reload nginx
```

#### PASO 5: Probar con archivo hosts (15 minutos)

##### 5.1 En TU computadora local
```
# C:\Windows\System32\drivers\etc\hosts
# Cambiar de:
127.0.0.1    test2hotelwebsite.store

# A:
20.169.209.166    test2hotelwebsite.store
```

##### 5.2 Probar en el navegador
- Sistema admin: `http://20.169.209.166` → Debe mostrar login
- Dominio personalizado: `http://test2hotelwebsite.store` → Debe mostrar el preview

##### 5.3 Verificar logs en el servidor
```bash
# Ver logs de la app
tail -100 /home/azureuser/hotel-app/app.log | grep CustomDomainMiddleware

# Deberías ver:
# [CustomDomainMiddleware] Processing request for host: test2hotelwebsite.store
# [CustomDomainMiddleware] Custom domain found: test2hotelwebsite.store
```

#### PASO 6: Configurar DNS real en Namecheap (10 minutos)

**⚠️ SOLO hacer esto DESPUÉS de verificar que todo funciona con hosts**

##### 6.1 Entrar a Namecheap
1. Login → Domain List → Manage (en test2hotelwebsite.store)
2. Advanced DNS

##### 6.2 Agregar registros
```
Type: A Record
Host: @
Value: 20.169.209.166
TTL: Automatic

Type: A Record
Host: www
Value: 20.169.209.166
TTL: Automatic
```

##### 6.3 Eliminar registros default
- Eliminar cualquier registro que apunte a la página de parking

##### 6.4 Guardar y esperar
- Propagación: 10-30 minutos (máximo 48 horas)
- Verificar con: https://www.whatsmydns.net/

### 🚨 PUNTOS DE VERIFICACIÓN Y ROLLBACK

#### Checkpoints críticos:
1. ✅ Después del backup → Continuar
2. ✅ App inicia sin errores → Continuar
3. ✅ Sistema admin funciona → Continuar
4. ✅ Funciona con hosts → Continuar
5. ❌ Si algo falla → ROLLBACK

#### Plan de Rollback (si algo sale mal):
```bash
# 1. Detener app nueva
ps aux | grep dotnet | grep -v grep | awk '{print $2}' | xargs kill -9

# 2. Restaurar backup
cd /home/azureuser
rm -rf hotel-app
cp -r hotel-app-old hotel-app

# 3. Iniciar app anterior
cd hotel-app
ASPNETCORE_ENVIRONMENT=Production ASPNETCORE_URLS=http://0.0.0.0:5002 nohup dotnet Hotel.dll > app.log 2>&1 &

# 4. Restaurar Nginx si se cambió
sudo nano /etc/nginx/sites-available/hotel23
# Poner server_name 20.169.209.166; de nuevo
sudo systemctl reload nginx
```

### 📋 CHECKLIST FINAL

- [ ] Backup creado (app + BD)
- [ ] Aplicación nueva iniciada sin errores
- [ ] Sistema admin accesible en IP
- [ ] Logs muestran CustomDomainMiddleware activo
- [ ] Probado con archivo hosts
- [ ] DNS configurados en Namecheap
- [ ] Dominio real funcionando

### ⚠️ PRECAUCIONES IMPORTANTES

1. **NO configurar DNS antes de probar con hosts**
2. **NO eliminar backups hasta confirmar 24 horas de estabilidad**
3. **NO olvidar quitar el dominio del archivo hosts local después**
4. **SI algo falla, no entrar en pánico - usar el rollback**

### 🎯 RESULTADO ESPERADO

Después de completar estos pasos:
- `http://20.169.209.166` → Sistema administrativo (login)
- `http://test2hotelwebsite.store` → Preview del hotel
- Ambos funcionando simultáneamente sin interferencia

### 📅 TIEMPO TOTAL ESTIMADO

- Preparación y backup: 45 minutos
- Deployment: 20 minutos
- Configuración y pruebas: 25 minutos
- DNS y verificación: 30 minutos
- **TOTAL**: ~2 horas (sin contar propagación DNS)

---

**PRÓXIMO PASO**: Ejecutar este plan cuando estés listo. El documento está diseñado para seguirse paso a paso sin pensar, solo ejecutar.

## 🚀 IMPLEMENTACIÓN REAL EN PRODUCCIÓN (03/08/2025)

### 📋 Resumen de lo Implementado

**Objetivo**: Configurar el servidor para aceptar múltiples dominios personalizados automáticamente.

**Problema inicial**: Los dominios personalizados no funcionaban porque nginx solo aceptaba la IP del servidor.

**Solución**: Configurar nginx para aceptar cualquier dominio con wildcard.

### 🔧 Cambios Realizados en el Servidor

#### 1. **Configuración Original de Nginx**
```nginx
server {
    listen 80;
    server_name 20.169.209.166 www.hodelpa.com hodelpa.com test2hotelwebsite.store www.test2hotelwebsite.store;
    # ... resto de la configuración
}
```

#### 2. **Nueva Configuración con Wildcard**
```nginx
server {
    listen 80;
    server_name _;  # Acepta CUALQUIER dominio
    # ... resto de la configuración (sin cambios)
}
```

### 🐛 Problemas Encontrados y Soluciones

#### Problema 1: Dominio no resolvía
**Síntoma**: Al acceder a `test2hotelwebsite.store`, el navegador no encontraba el sitio.

**Diagnóstico**:
- Los logs de nginx mostraban tráfico llegando al dominio
- El DNS resolvía correctamente a 20.169.209.166
- Pero el navegador local no conectaba

**Causa**: El archivo hosts de Windows tenía una entrada que redirigía el dominio a localhost:
```
127.0.0.1    test2hotelwebsite.store
```

**Solución**: 
1. Editar `C:\Windows\System32\drivers\etc\hosts` como administrador
2. Eliminar la línea con el dominio
3. Guardar y limpiar caché DNS con `ipconfig /flushdns`

#### Problema 2: Configuración manual para cada dominio
**Síntoma**: Cada vez que un usuario agregaba un dominio nuevo, había que actualizar nginx manualmente.

**Solución**: Cambiar de lista específica de dominios a wildcard (`server_name _`).

### 📝 Proceso de Implementación Paso a Paso

#### 1. Verificación inicial
```bash
ssh azureuser@20.169.209.166
sudo nginx -v  # nginx/1.18.0 (Ubuntu)
ps aux | grep dotnet  # Aplicación corriendo en puerto 5002
```

#### 2. Backup de configuración
```bash
sudo cp /etc/nginx/sites-available/hotel23 /etc/nginx/sites-available/hotel23.backup-$(date +%Y%m%d-%H%M%S)
```

#### 3. Actualización de nginx (Primera vez - Dominios específicos)
```bash
# Crear archivo temporal con nueva configuración
sudo nano /etc/nginx/sites-available/hotel23
# Agregar dominios a server_name
sudo nginx -t  # Verificar sintaxis
sudo systemctl reload nginx
```

#### 4. Actualización final a Wildcard
```bash
# Cambiar server_name a _
sudo nano /etc/nginx/sites-available/hotel23
sudo nginx -t
sudo systemctl reload nginx
```

#### 5. Verificación
```bash
# Verificar logs
sudo tail -f /var/log/nginx/access.log

# Probar con curl
curl -I -H "Host: test2hotelwebsite.store" http://20.169.209.166
# Respuesta: HTTP/1.1 200 OK
```

### ✅ Resultado Final

**Sistema completamente automático**:
1. Usuario agrega dominio en `/CustomDomains`
2. Configura DNS en su registrador (A record → 20.169.209.166)
3. ¡Funciona inmediatamente! Sin intervención técnica

**Ventajas**:
- No requiere acceso SSH para nuevos dominios
- No requiere modificar nginx para cada dominio
- Completamente self-service para los usuarios

### 🔒 Consideraciones de Seguridad

1. **Validación en la aplicación**: Aunque nginx acepta cualquier dominio, la aplicación valida contra la tabla `CustomDomains`
2. **Dominios no registrados**: Mostrarán el sitio por defecto o error
3. **Headers preservados**: `proxy_set_header Host $host` permite a la app detectar el dominio

### 📊 Documentación Adicional Creada

Se creó el archivo `NGINX-MULTIDOMINIO-CONFIG.md` con:
- Instrucciones detalladas de configuración
- Proceso de troubleshooting
- Guía para agregar nuevos dominios
- Consideraciones de seguridad

### 🎯 Estado Final del Sistema

- **Dominio principal**: Funcionando correctamente
- **Dominio personalizado** (`test2hotelwebsite.store`): Funcionando correctamente
- **Nuevos dominios**: Se agregarán automáticamente sin cambios en servidor
- **Sistema user-friendly**: Los usuarios pueden gestionar sus dominios sin ayuda técnica

---

**Implementación completada exitosamente** ✅