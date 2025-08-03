# 📧 Contact Form - Plan de Implementación

## 🎯 Objetivo
Implementar un sistema completo de mensajes de contacto que:
- Guarde los mensajes en la base de datos
- Muestre notificaciones en el panel lateral del backoffice
- Envíe emails automáticos al administrador

## 📊 Base de Datos

### Nueva tabla: ContactMessages
```sql
CREATE TABLE "ContactMessages" (
    "Id" SERIAL PRIMARY KEY,
    "Name" VARCHAR(100) NOT NULL,
    "Email" VARCHAR(255) NOT NULL,
    "Phone" VARCHAR(50),
    "Subject" VARCHAR(200) NOT NULL,
    "Message" TEXT NOT NULL,
    "IsRead" BOOLEAN DEFAULT FALSE,
    "IsArchived" BOOLEAN DEFAULT FALSE,
    "CreatedAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    "WebSiteId" INTEGER NOT NULL,
    FOREIGN KEY ("WebSiteId") REFERENCES "WebSites"("Id")
);

-- Índices para mejorar rendimiento
CREATE INDEX idx_contact_messages_website ON "ContactMessages"("WebSiteId");
CREATE INDEX idx_contact_messages_read ON "ContactMessages"("IsRead");
CREATE INDEX idx_contact_messages_created ON "ContactMessages"("CreatedAt" DESC);
```

### Modelo Entity Framework
```csharp
public class ContactMessage
{
    public int Id { get; set; }
    public string Name { get; set; }
    public string Email { get; set; }
    public string? Phone { get; set; }
    public string Subject { get; set; }
    public string Message { get; set; }
    public bool IsRead { get; set; }
    public bool IsArchived { get; set; }
    public DateTime CreatedAt { get; set; }
    public int WebSiteId { get; set; }
    public virtual WebSite WebSite { get; set; }
}
```

## 📧 Integración de Email

### 1. Configuración SMTP en appsettings.json
```json
{
  "EmailSettings": {
    "SmtpHost": "smtp.gmail.com",
    "SmtpPort": 587,
    "SmtpUser": "tucorreo@gmail.com",
    "SmtpPassword": "tu-app-password",
    "FromEmail": "noreply@tuhotel.com",
    "FromName": "Hotel System",
    "AdminEmail": "admin@tuhotel.com"
  }
}
```

### 2. Servicio de Email
```csharp
public interface IEmailService
{
    Task SendContactFormEmailAsync(ContactMessage message);
    Task SendEmailAsync(string to, string subject, string htmlBody);
}

public class EmailService : IEmailService
{
    private readonly IConfiguration _configuration;
    private readonly ILogger<EmailService> _logger;

    public EmailService(IConfiguration configuration, ILogger<EmailService> logger)
    {
        _configuration = configuration;
        _logger = logger;
    }

    public async Task SendContactFormEmailAsync(ContactMessage message)
    {
        var emailSettings = _configuration.GetSection("EmailSettings");
        var adminEmail = emailSettings["AdminEmail"];
        
        var htmlBody = $@"
        <!DOCTYPE html>
        <html>
        <head>
            <style>
                body {{ font-family: Arial, sans-serif; line-height: 1.6; }}
                .container {{ max-width: 600px; margin: 0 auto; padding: 20px; }}
                .header {{ background: #2962ff; color: white; padding: 20px; text-align: center; }}
                .content {{ background: #f4f4f4; padding: 20px; margin: 20px 0; }}
                .field {{ margin: 10px 0; }}
                .label {{ font-weight: bold; color: #333; }}
                .value {{ color: #666; }}
                .message-box {{ background: white; padding: 15px; border-left: 4px solid #2962ff; }}
            </style>
        </head>
        <body>
            <div class='container'>
                <div class='header'>
                    <h2>Nuevo Mensaje de Contacto</h2>
                </div>
                <div class='content'>
                    <div class='field'>
                        <span class='label'>Nombre:</span>
                        <span class='value'>{message.Name}</span>
                    </div>
                    <div class='field'>
                        <span class='label'>Email:</span>
                        <span class='value'>{message.Email}</span>
                    </div>
                    <div class='field'>
                        <span class='label'>Teléfono:</span>
                        <span class='value'>{message.Phone ?? "No proporcionado"}</span>
                    </div>
                    <div class='field'>
                        <span class='label'>Asunto:</span>
                        <span class='value'>{message.Subject}</span>
                    </div>
                    <div class='field'>
                        <span class='label'>Mensaje:</span>
                        <div class='message-box'>{message.Message}</div>
                    </div>
                    <div class='field'>
                        <span class='label'>Fecha:</span>
                        <span class='value'>{message.CreatedAt:dd/MM/yyyy HH:mm}</span>
                    </div>
                </div>
                <div style='text-align: center; color: #666; font-size: 12px;'>
                    <p>Este mensaje fue enviado desde el formulario de contacto del sitio web.</p>
                    <p>Puedes ver todos los mensajes en el panel de administración.</p>
                </div>
            </div>
        </body>
        </html>";

        await SendEmailAsync(adminEmail, $"Nuevo contacto: {message.Subject}", htmlBody);
    }

    public async Task SendEmailAsync(string to, string subject, string htmlBody)
    {
        try
        {
            var emailSettings = _configuration.GetSection("EmailSettings");
            
            using var client = new SmtpClient(emailSettings["SmtpHost"], int.Parse(emailSettings["SmtpPort"]))
            {
                Credentials = new NetworkCredential(emailSettings["SmtpUser"], emailSettings["SmtpPassword"]),
                EnableSsl = true
            };

            var mailMessage = new MailMessage
            {
                From = new MailAddress(emailSettings["FromEmail"], emailSettings["FromName"]),
                Subject = subject,
                Body = htmlBody,
                IsBodyHtml = true
            };
            
            mailMessage.To.Add(to);

            await client.SendMailAsync(mailMessage);
            _logger.LogInformation($"Email enviado a {to}");
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, $"Error enviando email a {to}");
            throw;
        }
    }
}
```

### 3. Configuración para Gmail
Para usar Gmail necesitas:
1. Habilitar autenticación de 2 factores
2. Generar una "App Password" específica
3. Usar esa contraseña en lugar de tu contraseña normal

**Pasos para Gmail:**
1. Ve a https://myaccount.google.com/security
2. Activa "Verificación en 2 pasos"
3. Ve a "Contraseñas de aplicaciones"
4. Genera una nueva contraseña para "Correo"
5. Usa esa contraseña de 16 caracteres en la configuración

### 4. Alternativas de Email

#### SendGrid (Recomendado para producción)
```json
{
  "EmailSettings": {
    "Provider": "SendGrid",
    "SendGridApiKey": "SG.xxxxxxxxxxxxxx",
    "FromEmail": "noreply@tuhotel.com",
    "FromName": "Hotel System",
    "AdminEmail": "admin@tuhotel.com"
  }
}
```

#### SMTP Genérico
```json
{
  "EmailSettings": {
    "SmtpHost": "mail.tudominio.com",
    "SmtpPort": 587,
    "SmtpUser": "noreply@tudominio.com",
    "SmtpPassword": "tupassword",
    "EnableSsl": true,
    "FromEmail": "noreply@tudominio.com",
    "FromName": "Hotel System",
    "AdminEmail": "admin@tudominio.com"
  }
}
```

## 🎨 Frontend - Contact Form

### Actualización del módulo contact-form.js
```javascript
// Agregar en el event handler del submit
handleSubmit: function(e) {
    e.preventDefault();
    
    const formData = {
        name: document.getElementById('contact-name').value,
        email: document.getElementById('contact-email').value,
        phone: document.getElementById('contact-phone').value,
        subject: document.getElementById('contact-subject').value,
        message: document.getElementById('contact-message').value
    };
    
    // Mostrar loading
    const submitButton = e.target.querySelector('button[type="submit"]');
    const originalText = submitButton.textContent;
    submitButton.textContent = 'Enviando...';
    submitButton.disabled = true;
    
    // Enviar al servidor
    fetch('/api/contact/send', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData)
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            // Mostrar mensaje de éxito
            alert('Mensaje enviado correctamente. Nos pondremos en contacto pronto.');
            e.target.reset();
        } else {
            alert('Error al enviar el mensaje. Por favor intenta nuevamente.');
        }
    })
    .catch(error => {
        console.error('Error:', error);
        alert('Error al enviar el mensaje. Por favor intenta nuevamente.');
    })
    .finally(() => {
        submitButton.textContent = originalText;
        submitButton.disabled = false;
    });
}
```

## 🏢 Backend - Controllers

### ContactMessagesController.cs
```csharp
[Authorize]
[Route("api/[controller]")]
[ApiController]
public class ContactMessagesController : ControllerBase
{
    private readonly HotelDbContext _context;
    private readonly IEmailService _emailService;
    private readonly ILogger<ContactMessagesController> _logger;

    public ContactMessagesController(
        HotelDbContext context, 
        IEmailService emailService,
        ILogger<ContactMessagesController> logger)
    {
        _context = context;
        _emailService = emailService;
        _logger = logger;
    }

    // GET: api/contactmessages
    [HttpGet]
    public async Task<ActionResult<IEnumerable<ContactMessage>>> GetMessages()
    {
        var websiteId = GetCurrentWebsiteId();
        return await _context.ContactMessages
            .Where(m => m.WebSiteId == websiteId)
            .OrderByDescending(m => m.CreatedAt)
            .ToListAsync();
    }

    // GET: api/contactmessages/unread-count
    [HttpGet("unread-count")]
    public async Task<ActionResult<int>> GetUnreadCount()
    {
        var websiteId = GetCurrentWebsiteId();
        return await _context.ContactMessages
            .Where(m => m.WebSiteId == websiteId && !m.IsRead)
            .CountAsync();
    }

    // POST: api/contact/send (público, sin autorización)
    [AllowAnonymous]
    [HttpPost("/api/contact/send")]
    public async Task<IActionResult> SendMessage([FromBody] ContactMessageDto dto)
    {
        try
        {
            // Obtener WebSiteId del dominio actual
            var websiteId = await GetWebsiteIdFromDomain();
            
            var message = new ContactMessage
            {
                Name = dto.Name,
                Email = dto.Email,
                Phone = dto.Phone,
                Subject = dto.Subject,
                Message = dto.Message,
                WebSiteId = websiteId,
                CreatedAt = DateTime.UtcNow
            };

            _context.ContactMessages.Add(message);
            await _context.SaveChangesAsync();

            // Enviar email de forma asíncrona
            _ = Task.Run(async () => {
                try
                {
                    await _emailService.SendContactFormEmailAsync(message);
                }
                catch (Exception ex)
                {
                    _logger.LogError(ex, "Error enviando email de contacto");
                }
            });

            return Ok(new { success = true, message = "Mensaje enviado correctamente" });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error procesando mensaje de contacto");
            return Ok(new { success = false, message = "Error al enviar el mensaje" });
        }
    }

    // PUT: api/contactmessages/5/read
    [HttpPut("{id}/read")]
    public async Task<IActionResult> MarkAsRead(int id)
    {
        var message = await _context.ContactMessages.FindAsync(id);
        if (message == null) return NotFound();

        message.IsRead = true;
        await _context.SaveChangesAsync();

        return NoContent();
    }

    // DELETE: api/contactmessages/5
    [HttpDelete("{id}")]
    public async Task<IActionResult> DeleteMessage(int id)
    {
        var message = await _context.ContactMessages.FindAsync(id);
        if (message == null) return NotFound();

        _context.ContactMessages.Remove(message);
        await _context.SaveChangesAsync();

        return NoContent();
    }
}
```

## 📱 Panel Lateral - Notificaciones

### Agregar al menú lateral
```html
<!-- En _MaterializeExactLayout.cshtml -->
<li>
    <a href="/ContactMessages" class="waves-effect">
        <i class="material-icons">mail</i>
        <span data-i18n="menu.messages">Mensajes</span>
        <span class="badge new" id="unread-messages-count" style="display: none;">0</span>
    </a>
</li>
```

### JavaScript para actualizar badge
```javascript
// Actualizar cada 30 segundos
setInterval(updateUnreadMessagesCount, 30000);

function updateUnreadMessagesCount() {
    fetch('/api/contactmessages/unread-count')
        .then(response => response.json())
        .then(count => {
            const badge = document.getElementById('unread-messages-count');
            if (count > 0) {
                badge.textContent = count;
                badge.style.display = 'inline-block';
            } else {
                badge.style.display = 'none';
            }
        });
}
```

## 🔒 Seguridad

### 1. Rate Limiting
Para evitar spam, implementar límite de mensajes:
```csharp
// En Program.cs
services.AddMemoryCache();
services.AddSingleton<IIpPolicyStore, MemoryCacheIpPolicyStore>();
services.AddSingleton<IRateLimitCounterStore, MemoryCacheRateLimitCounterStore>();

// Configurar rate limit para contact form
services.Configure<IpRateLimitOptions>(options =>
{
    options.GeneralRules = new List<RateLimitRule>
    {
        new RateLimitRule
        {
            Endpoint = "POST:/api/contact/send",
            Period = "1h",
            Limit = 5 // Máximo 5 mensajes por hora por IP
        }
    };
});
```

### 2. Validación
- Sanitizar HTML en mensajes
- Validar formato de email
- Límite de caracteres en mensaje (max 5000)
- Validación de campos requeridos

### 3. reCAPTCHA (Opcional)
```javascript
// En el formulario
<div class="g-recaptcha" data-sitekey="tu-site-key"></div>

// Validar en backend
var recaptchaResponse = Request.Form["g-recaptcha-response"];
var isValid = await ValidateRecaptcha(recaptchaResponse);
```

## 📋 Checklist de Implementación

- [ ] Crear migración para tabla ContactMessages
- [ ] Implementar modelo ContactMessage
- [ ] Crear servicio IEmailService
- [ ] Configurar SMTP en appsettings
- [ ] Crear ContactMessagesController
- [ ] Actualizar módulo contact-form.js
- [ ] Crear vista Index para mensajes
- [ ] Agregar opción al menú lateral
- [ ] Implementar badge de mensajes no leídos
- [ ] Configurar rate limiting
- [ ] Probar envío de emails
- [ ] Agregar logging
- [ ] Documentar configuración de email para el cliente

## 🚀 Consideraciones de Producción

1. **Email Provider**: Para producción, usar SendGrid o servicio similar
2. **Queue**: Considerar usar Hangfire para procesar emails en background
3. **Archivado**: Implementar archivado automático después de X días
4. **Notificaciones Push**: Considerar SignalR para notificaciones en tiempo real
5. **Templates**: Crear templates de email reutilizables
6. **Backup**: Los mensajes deben incluirse en backups de BD

## 🔧 Troubleshooting Email

### Gmail no envía
- Verificar que uses App Password, no tu contraseña normal
- Revisar que la cuenta no tenga restricciones de "Less secure apps"
- Verificar que no hayas alcanzado límite diario (500 emails/día)

### Emails van a spam
- Configurar SPF y DKIM en tu dominio
- Usar un servicio profesional como SendGrid
- Evitar palabras spam en asunto
- Incluir link de desuscripción

### Timeout al enviar
- Aumentar timeout del SMTP client
- Verificar firewall no bloquee puerto SMTP
- Usar envío asíncrono para no bloquear request