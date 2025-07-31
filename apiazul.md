# 🏦 Integración con Pasarela de Pago Azul - Plan de Implementación

## 📋 Resumen Ejecutivo

Este documento detalla el plan completo para integrar la pasarela de pago Azul (Banco Popular Dominicano) en el sistema Hotel23, manteniendo un enfoque "plug & play" donde la implementación está lista ANTES de recibir las credenciales de Azul. El objetivo es que cuando Azul proporcione las API keys, solo sea necesario ingresarlas en la configuración sin programar nada adicional.

**Fecha de planificación**: 31/07/2025  
**Impacto en código existente**: Mínimo (5-10 líneas en CheckoutController)  
**Arquitectura**: Modular e independiente

## 🎯 Objetivos

1. **Cero fricción**: Al recibir credenciales de Azul, activar en minutos
2. **No invasivo**: El sistema actual sigue funcionando exactamente igual
3. **Multi-gateway**: Arquitectura preparada para agregar otras pasarelas
4. **Seguridad**: Credenciales encriptadas, logs completos, manejo de errores
5. **Profesional**: Igual que Shopify - simple para el usuario, robusto por dentro

## 📐 Información Técnica de Azul

### API Endpoints
```
TEST: https://pruebas.azul.com.do/webservices/JSON/Default.aspx
PROD: https://pagos.azul.com.do/webservices/JSON/Default.aspx
```

### Autenticación
- **Headers HTTP**: Auth1 y Auth2
- **Certificados SSL**: azul.pem y azul.key
- **Canal**: "EC" (E-Commerce)

### Formato de Request
```json
{
  "Channel": "EC",
  "Store": "39038540035",
  "CardNumber": "4111111111111111",
  "Expiration": "202512",      // YYYYMM
  "CVC": "123",
  "PosInputMode": "E-Commerce",
  "TrxType": "Sale",
  "Amount": "1500000",          // $15,000.00 = 1500000 (sin punto decimal)
  "Itbis": "270000",            // $2,700.00 de impuesto
  "OrderNumber": "ABC123",
  "CustomOrderId": "ABC123",
  "DataVaultToken": null,       // Para pagos con token
  "SaveToDataVault": false      // Para guardar tarjeta
}
```

### Formato de Response
```json
{
  "AuthorizationCode": "OK5437",
  "AzulOrderId": "39080",
  "CustomOrderId": "ABC123",
  "DateTime": "20250731120000",
  "IsoCode": "00",
  "ResponseCode": "00",
  "ResponseMessage": "APROBADA",
  "ErrorDescription": "",
  "RRN": "220012840888"
}
```

### Códigos de Respuesta Importantes
- `00`: Aprobada
- `01`: Referir al emisor
- `05`: Rechazada
- `54`: Tarjeta expirada
- `51`: Fondos insuficientes

## 🏗️ Arquitectura de la Solución

### 1. Nuevos Modelos (Sin impacto en existentes)

#### PaymentGateway.cs
```csharp
public class PaymentGateway
{
    public int Id { get; set; }
    public string Name { get; set; } = "Azul";           // Nombre visible
    public string Provider { get; set; } = "AZUL_DO";    // Código interno
    public bool IsActive { get; set; }
    public bool IsTestMode { get; set; }
    public string ConfigurationJson { get; set; }        // Encriptado
    public string CertificateFileName { get; set; }      // azul.pem
    public string CertificateKeyFileName { get; set; }   // azul.key
    public DateTime CreatedAt { get; set; }
    public DateTime? UpdatedAt { get; set; }
}
```

#### PaymentTransaction.cs
```csharp
public class PaymentTransaction
{
    public int Id { get; set; }
    public string Gateway { get; set; }              // AZUL_DO
    public string TransactionId { get; set; }        // ID de Azul
    public string OrderId { get; set; }              // Nuestro OrderId
    public int? ReservationId { get; set; }          // FK a Reservation
    public decimal Amount { get; set; }
    public decimal Tax { get; set; }
    public string Currency { get; set; } = "DOP";
    public string Status { get; set; }               // pending, approved, failed
    public string ResponseCode { get; set; }         // 00, 05, etc
    public string ResponseMessage { get; set; }      // APROBADA, RECHAZADA
    public string AuthorizationCode { get; set; }    // OK5437
    public string CardLastFour { get; set; }         // 1111
    public string CardType { get; set; }             // Visa, MC
    public string RequestJson { get; set; }          // Log completo
    public string ResponseJson { get; set; }         // Log completo
    public DateTime CreatedAt { get; set; }
    
    // Navigation
    public Reservation Reservation { get; set; }
}
```

### 2. Estructura de Configuración

El `ConfigurationJson` almacenará (encriptado):
```json
{
  "storeId": "39038540035",
  "auth1": "nombreusuario",
  "auth2": "claveacceso",
  "endpoints": {
    "test": "https://pruebas.azul.com.do/webservices/JSON/Default.aspx",
    "production": "https://pagos.azul.com.do/webservices/JSON/Default.aspx"
  }
}
```

### 3. Interfaces y Servicios

#### IPaymentProcessor.cs
```csharp
public interface IPaymentProcessor
{
    Task<PaymentResult> ProcessPaymentAsync(PaymentRequest request);
    Task<PaymentResult> VerifyPaymentAsync(string transactionId);
    Task<PaymentResult> VoidPaymentAsync(string transactionId);
    Task<PaymentResult> RefundPaymentAsync(string transactionId, decimal amount);
    bool ValidateConfiguration(PaymentGateway gateway);
    string GetProviderName();
}
```

#### PaymentRequest.cs
```csharp
public class PaymentRequest
{
    public string OrderId { get; set; }
    public decimal Amount { get; set; }
    public decimal Tax { get; set; }
    public string CardNumber { get; set; }
    public string CardExpiry { get; set; }     // MM/YY from form
    public string CardCvc { get; set; }
    public string CardHolderName { get; set; }
    public CustomerInfo Customer { get; set; }
    public bool SaveCard { get; set; }
    public string SavedCardToken { get; set; }
}
```

#### PaymentResult.cs
```csharp
public class PaymentResult
{
    public bool IsSuccess { get; set; }
    public string TransactionId { get; set; }
    public string AuthorizationCode { get; set; }
    public string ResponseCode { get; set; }
    public string ResponseMessage { get; set; }
    public string ErrorMessage { get; set; }
    public Dictionary<string, object> RawResponse { get; set; }
}
```

#### AzulPaymentProcessor.cs
```csharp
public class AzulPaymentProcessor : IPaymentProcessor
{
    private readonly IConfiguration _configuration;
    private readonly ILogger<AzulPaymentProcessor> _logger;
    private readonly IEncryptionService _encryption;
    
    public async Task<PaymentResult> ProcessPaymentAsync(PaymentRequest request)
    {
        // 1. Cargar configuración
        // 2. Formatear request (fechas, montos sin decimales)
        // 3. Preparar certificados SSL
        // 4. Hacer POST a Azul
        // 5. Parsear response
        // 6. Retornar resultado
    }
    
    private string FormatAmount(decimal amount)
    {
        // $150.00 → "15000" (multiplicar por 100)
        return ((int)(amount * 100)).ToString();
    }
    
    private string FormatExpiration(string cardExpiry)
    {
        // "12/25" → "202512"
        var parts = cardExpiry.Split('/');
        return $"20{parts[1]}{parts[0]}";
    }
}
```

### 4. Factory Pattern para Procesadores

#### PaymentProcessorFactory.cs
```csharp
public class PaymentProcessorFactory
{
    private readonly IServiceProvider _serviceProvider;
    
    public IPaymentProcessor GetProcessor(string provider)
    {
        return provider switch
        {
            "AZUL_DO" => _serviceProvider.GetService<AzulPaymentProcessor>(),
            "PAYPAL" => _serviceProvider.GetService<PayPalPaymentProcessor>(),
            "STRIPE" => _serviceProvider.GetService<StripePaymentProcessor>(),
            _ => throw new NotSupportedException($"Provider {provider} not supported")
        };
    }
}
```

### 5. Integración Mínima en CheckoutController

```csharp
[HttpPost]
public async Task<IActionResult> ProcessPayment(CheckoutViewModel model)
{
    // Buscar gateway activo
    var activeGateway = await _context.PaymentGateways
        .FirstOrDefaultAsync(g => g.IsActive);
    
    // ÚNICA MODIFICACIÓN AL CÓDIGO EXISTENTE
    if (activeGateway != null && activeGateway.Provider != "MOCK")
    {
        return await ProcessRealPayment(model, activeGateway);
    }
    
    // FLUJO ACTUAL INTACTO
    return await ProcessMockPayment(model);
}

private async Task<IActionResult> ProcessRealPayment(CheckoutViewModel model, PaymentGateway gateway)
{
    try
    {
        // Obtener procesador
        var processor = _paymentFactory.GetProcessor(gateway.Provider);
        
        // Crear request
        var paymentRequest = new PaymentRequest
        {
            OrderId = GenerateOrderId(),
            Amount = model.TotalAmount,
            Tax = model.TaxAmount,
            CardNumber = model.CardNumber,
            CardExpiry = model.CardExpiry,
            CardCvc = model.CardCvc,
            // ... mapear resto de campos
        };
        
        // Procesar pago
        var result = await processor.ProcessPaymentAsync(paymentRequest);
        
        // Guardar transacción
        var transaction = new PaymentTransaction
        {
            Gateway = gateway.Provider,
            TransactionId = result.TransactionId,
            Status = result.IsSuccess ? "approved" : "failed",
            // ... guardar todos los detalles
        };
        
        _context.PaymentTransactions.Add(transaction);
        
        if (result.IsSuccess)
        {
            // Continuar con creación de Guest/Reservation
            return await CreateReservationAndRedirect(model, transaction);
        }
        else
        {
            // Mostrar error al usuario
            return Json(new { 
                success = false, 
                message = result.ErrorMessage ?? "Pago rechazado" 
            });
        }
    }
    catch (Exception ex)
    {
        _logger.LogError(ex, "Error processing payment");
        return Json(new { success = false, message = "Error procesando pago" });
    }
}
```

## 💼 Interfaz de Administración

### PaymentSettingsController.cs
```csharp
[Authorize]
public class PaymentSettingsController : Controller
{
    public async Task<IActionResult> Index()
    {
        var gateways = await _context.PaymentGateways.ToListAsync();
        return View(gateways);
    }
    
    [HttpPost]
    public async Task<IActionResult> UpdateGateway(PaymentGatewayViewModel model)
    {
        // Validar configuración
        // Encriptar credenciales
        // Guardar certificados
        // Actualizar BD
    }
    
    [HttpPost]
    public async Task<IActionResult> TestConnection(int gatewayId)
    {
        // Hacer transacción de $1 y void inmediato
        // Retornar resultado
    }
}
```

### Vista de Configuración (/Views/PaymentSettings/Index.cshtml)
```html
<!-- Estilo Shopify -->
<div class="payment-gateway-card">
    <div class="gateway-header">
        <img src="/images/azul-logo.png" alt="Azul">
        <h3>Azul Payment Gateway</h3>
        <label class="toggle">
            <input type="checkbox" id="azul-active">
            <span class="toggle-slider"></span>
        </label>
    </div>
    
    <div class="gateway-config" style="display:none;">
        <div class="form-group">
            <label>Store ID</label>
            <input type="text" id="store-id" placeholder="39038540035">
        </div>
        
        <div class="form-group">
            <label>Usuario (Auth1)</label>
            <input type="text" id="auth1">
        </div>
        
        <div class="form-group">
            <label>Contraseña (Auth2)</label>
            <input type="password" id="auth2">
        </div>
        
        <div class="form-group">
            <label>Certificado (.pem)</label>
            <input type="file" id="certificate" accept=".pem">
        </div>
        
        <div class="form-group">
            <label>Llave Certificado (.key)</label>
            <input type="file" id="certificate-key" accept=".key">
        </div>
        
        <div class="form-group">
            <label>Modo</label>
            <select id="test-mode">
                <option value="true">Pruebas</option>
                <option value="false">Producción</option>
            </select>
        </div>
        
        <button class="btn btn-primary" onclick="saveGatewayConfig()">
            Guardar Configuración
        </button>
        
        <button class="btn btn-secondary" onclick="testConnection()">
            Probar Conexión
        </button>
    </div>
</div>
```

## 🚀 Plan de Implementación por Fases

### Fase 1: Infraestructura Base (0% impacto)
1. Crear modelos `PaymentGateway` y `PaymentTransaction`
2. Crear migración: `Add-Migration AddPaymentGatewaySystem`
3. Crear interfaces `IPaymentProcessor`, `IEncryptionService`
4. Implementar `EncryptionService` para proteger credenciales
5. Crear DTOs: `PaymentRequest`, `PaymentResult`

### Fase 2: Procesador Azul (0% impacto)
1. Implementar `AzulPaymentProcessor`
2. Manejar certificados SSL
3. Formateo de montos y fechas
4. Logging detallado
5. Manejo de errores y timeouts

### Fase 3: UI de Configuración (0% impacto)
1. Crear `PaymentSettingsController`
2. Vista de configuración estilo Shopify
3. Upload seguro de certificados
4. Validación de campos
5. Test de conexión

### Fase 4: Integración (5-10 líneas de impacto)
1. Modificar `CheckoutController.ProcessPayment`
2. Agregar condicional para gateway activo
3. Mantener flujo mock como fallback
4. Testing exhaustivo

### Fase 5: Webhooks y Extras (0% impacto)
1. Endpoint para webhooks de Azul
2. Vista de transacciones
3. Reportes de pagos
4. Reconciliación

## 🔒 Consideraciones de Seguridad

1. **Encriptación**: Todas las credenciales con AES-256
2. **Certificados**: Almacenados fuera de wwwroot
3. **PCI Compliance**: No almacenar números de tarjeta completos
4. **Logs**: Sin datos sensibles, solo últimos 4 dígitos
5. **HTTPS**: Obligatorio en producción
6. **Validación**: Server-side de todos los inputs

## 📊 Estructura de Base de Datos

```sql
-- Tabla PaymentGateways
CREATE TABLE PaymentGateways (
    Id INT PRIMARY KEY IDENTITY,
    Name NVARCHAR(100) NOT NULL,
    Provider NVARCHAR(50) NOT NULL,
    IsActive BIT NOT NULL DEFAULT 0,
    IsTestMode BIT NOT NULL DEFAULT 1,
    ConfigurationJson NVARCHAR(MAX),  -- Encriptado
    CertificateFileName NVARCHAR(255),
    CertificateKeyFileName NVARCHAR(255),
    CreatedAt DATETIME2 NOT NULL,
    UpdatedAt DATETIME2
);

-- Tabla PaymentTransactions
CREATE TABLE PaymentTransactions (
    Id INT PRIMARY KEY IDENTITY,
    Gateway NVARCHAR(50) NOT NULL,
    TransactionId NVARCHAR(100),
    OrderId NVARCHAR(100) NOT NULL,
    ReservationId INT NULL,
    Amount DECIMAL(18,2) NOT NULL,
    Tax DECIMAL(18,2) NOT NULL,
    Currency NVARCHAR(3) DEFAULT 'DOP',
    Status NVARCHAR(50) NOT NULL,
    ResponseCode NVARCHAR(10),
    ResponseMessage NVARCHAR(255),
    AuthorizationCode NVARCHAR(50),
    CardLastFour NVARCHAR(4),
    CardType NVARCHAR(20),
    RequestJson NVARCHAR(MAX),
    ResponseJson NVARCHAR(MAX),
    CreatedAt DATETIME2 NOT NULL,
    FOREIGN KEY (ReservationId) REFERENCES Reservations(Id)
);

-- Índices para performance
CREATE INDEX IX_PaymentTransactions_OrderId ON PaymentTransactions(OrderId);
CREATE INDEX IX_PaymentTransactions_TransactionId ON PaymentTransactions(TransactionId);
CREATE INDEX IX_PaymentTransactions_CreatedAt ON PaymentTransactions(CreatedAt DESC);
```

## 🧪 Testing

### Tarjetas de Prueba Azul
```
Visa Aprobada: 4111111111111111
MasterCard Aprobada: 5555555555554444
Visa Fondos Insuf.: 4000000000000002
MasterCard Rechazada: 5000000000000009
```

### Escenarios de Prueba
1. Pago exitoso
2. Tarjeta rechazada
3. Fondos insuficientes
4. Timeout de red
5. Certificado inválido
6. Modo test vs producción

## 📈 Monitoreo y Mantenimiento

1. **Dashboard de Transacciones**
   - Total procesado por día/mes
   - Tasa de aprobación
   - Errores comunes
   - Tiempo de respuesta promedio

2. **Alertas**
   - Múltiples rechazos consecutivos
   - Timeouts frecuentes
   - Certificados por expirar

3. **Logs**
   - Todas las transacciones
   - Errores de configuración
   - Intentos de fraude

## ✅ Checklist Pre-Producción

- [ ] Credenciales de producción configuradas
- [ ] Certificados SSL instalados
- [ ] Modo producción activado
- [ ] Montos de prueba realizados
- [ ] Logs funcionando correctamente
- [ ] Backup de configuración
- [ ] Plan de rollback listo
- [ ] Equipo de Azul notificado del go-live

## 🎯 Resultado Final

Cuando Azul proporcione las credenciales:

1. Ir a `/PaymentSettings`
2. Ingresar credenciales
3. Subir certificados
4. Click en "Test Connection"
5. Si exitoso, activar gateway
6. ¡Listo! Pagos reales funcionando

**Tiempo estimado**: 5-10 minutos máximo

## 📞 Contactos Importantes

- **Azul Afiliación**: 809-544-2985 / 1-809-200-0305
- **Soporte Técnico**: Solicitar al afiliar
- **Documentación**: https://dev.azul.com.do/

---

*Este documento fue creado el 31/07/2025 para el proyecto Hotel23. La implementación está diseñada para ser completamente modular y no invasiva, permitiendo que el sistema actual continúe funcionando mientras se prepara la integración con Azul.*