using System;
using System.IO;
using System.Linq;
using System.Text.Json;
using System.Threading.Tasks;
using Hotel.Data;
using Hotel.DTOs.Payment;
using Hotel.Models;
using Hotel.Services;
using Hotel.Services.Payment;
using Hotel.ViewModels;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;

namespace Hotel.Controllers
{
    [Authorize]
    public class PaymentSettingsController : Controller
    {
        private readonly HotelDbContext _context;
        private readonly IEncryptionService _encryptionService;
        private readonly PaymentProcessorFactory _paymentFactory;
        private readonly IWebHostEnvironment _environment;
        private readonly ILogger<PaymentSettingsController> _logger;
        
        public PaymentSettingsController(
            HotelDbContext context,
            IEncryptionService encryptionService,
            PaymentProcessorFactory paymentFactory,
            IWebHostEnvironment environment,
            ILogger<PaymentSettingsController> logger)
        {
            _context = context;
            _encryptionService = encryptionService;
            _paymentFactory = paymentFactory;
            _environment = environment;
            _logger = logger;
        }
        
        // GET: PaymentSettings
        public async Task<IActionResult> Index()
        {
            // Ensure Azul gateway exists
            var azulGateway = await _context.PaymentGateways
                .FirstOrDefaultAsync(g => g.Provider == "AZUL_DO");
                
            if (azulGateway == null)
            {
                // Create default Azul gateway
                azulGateway = new PaymentGateway
                {
                    Name = "Azul",
                    Provider = "AZUL_DO",
                    IsActive = false,
                    IsTestMode = true,
                    CreatedAt = DateTime.UtcNow
                };
                
                _context.PaymentGateways.Add(azulGateway);
                await _context.SaveChangesAsync();
            }
            
            // Get all gateways
            var gateways = await _context.PaymentGateways.ToListAsync();
            
            // Map to ViewModels
            var viewModels = gateways.Select(g => new PaymentGatewayViewModel
            {
                Id = g.Id,
                Name = g.Name,
                Provider = g.Provider,
                Description = GetGatewayDescription(g.Provider),
                LogoUrl = GetGatewayLogoUrl(g.Provider),
                IsActive = g.IsActive,
                IsTestMode = g.IsTestMode,
                IsConfigured = !string.IsNullOrEmpty(g.ConfigurationJson),
                LastUpdated = g.UpdatedAt,
                Status = g.IsActive ? "active" : (string.IsNullOrEmpty(g.ConfigurationJson) ? "pending" : "inactive")
            }).ToList();
            
            // Load checkout settings from Company
            var company = await _context.Companies.FirstOrDefaultAsync();
            if (company != null)
            {
                ViewBag.CheckoutLogoUrl = company.CheckoutLogoUrl;
                ViewBag.CheckoutLogoPosition = company.CheckoutLogoPosition;
            }
            
            return View(viewModels);
        }
        
        // GET: PaymentSettings/Configure/5
        public async Task<IActionResult> Configure(int id)
        {
            var gateway = await _context.PaymentGateways.FindAsync(id);
            if (gateway == null)
            {
                return NotFound();
            }
            
            var viewModel = new ConfigureGatewayViewModel
            {
                Id = gateway.Id,
                Name = gateway.Name,
                Provider = gateway.Provider,
                IsTestMode = gateway.IsTestMode,
                IsActive = gateway.IsActive,
                HasCertificate = !string.IsNullOrEmpty(gateway.CertificateFileName),
                HasCertificateKey = !string.IsNullOrEmpty(gateway.CertificateKeyFileName),
                CertificateFileName = gateway.CertificateFileName,
                CertificateKeyFileName = gateway.CertificateKeyFileName
            };
            
            // If configured, show masked values
            if (!string.IsNullOrEmpty(gateway.ConfigurationJson))
            {
                try
                {
                    var config = JsonSerializer.Deserialize<AzulConfig>(
                        _encryptionService.Decrypt(gateway.ConfigurationJson));
                        
                    if (config != null)
                    {
                        viewModel.StoreId = MaskValue(config.StoreId);
                        viewModel.Auth1 = MaskValue(config.Auth1);
                        viewModel.Auth2 = "********"; // Always mask password
                    }
                }
                catch (Exception ex)
                {
                    _logger.LogError(ex, "Error decrypting configuration");
                }
            }
            
            return View(viewModel);
        }
        
        // POST: PaymentSettings/SaveConfiguration
        [HttpPost]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> SaveConfiguration(ConfigureGatewayViewModel model)
        {
            if (!ModelState.IsValid)
            {
                return View("Configure", model);
            }
            
            try
            {
                var gateway = await _context.PaymentGateways.FindAsync(model.Id);
                if (gateway == null)
                {
                    return NotFound();
                }
                
                // Create configuration object
                var config = new AzulConfig
                {
                    StoreId = model.StoreId ?? "",
                    Auth1 = model.Auth1 ?? "",
                    Auth2 = model.Auth2 ?? "",
                    Endpoints = new AzulEndpoints
                    {
                        Test = "https://pruebas.azul.com.do/webservices/JSON/Default.aspx",
                        Production = "https://pagos.azul.com.do/webservices/JSON/Default.aspx"
                    }
                };
                
                // Handle certificate uploads
                if (model.CertificateFile != null)
                {
                    var certPath = await SaveCertificateFile(model.CertificateFile, "cert");
                    gateway.CertificateFileName = Path.GetFileName(certPath);
                }
                
                if (model.CertificateKeyFile != null)
                {
                    var keyPath = await SaveCertificateFile(model.CertificateKeyFile, "key");
                    gateway.CertificateKeyFileName = Path.GetFileName(keyPath);
                }
                
                // Encrypt and save configuration
                gateway.ConfigurationJson = _encryptionService.Encrypt(JsonSerializer.Serialize(config));
                gateway.IsTestMode = model.IsTestMode;
                gateway.UpdatedAt = DateTime.UtcNow;
                
                await _context.SaveChangesAsync();
                
                TempData["SuccessMessage"] = "Configuración guardada exitosamente";
                return RedirectToAction(nameof(Index));
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error saving configuration");
                TempData["ErrorMessage"] = "Error al guardar la configuración";
                return View("Configure", model);
            }
        }
        
        // POST: PaymentSettings/ToggleGateway
        [HttpPost]
        public async Task<IActionResult> ToggleGateway(int id, bool isActive)
        {
            try
            {
                var gateway = await _context.PaymentGateways.FindAsync(id);
                if (gateway == null)
                {
                    return Json(new { success = false, message = "Gateway no encontrado" });
                }
                
                // Validate configuration before activating
                if (isActive && string.IsNullOrEmpty(gateway.ConfigurationJson))
                {
                    return Json(new { success = false, message = "Configure el gateway antes de activarlo" });
                }
                
                // If activating, deactivate all others
                if (isActive)
                {
                    var allGateways = await _context.PaymentGateways.ToListAsync();
                    foreach (var g in allGateways)
                    {
                        g.IsActive = false;
                    }
                }
                
                gateway.IsActive = isActive;
                gateway.UpdatedAt = DateTime.UtcNow;
                
                await _context.SaveChangesAsync();
                
                return Json(new { 
                    success = true, 
                    message = isActive ? "Gateway activado" : "Gateway desactivado" 
                });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error toggling gateway");
                return Json(new { success = false, message = "Error al cambiar estado" });
            }
        }
        
        // POST: PaymentSettings/TestConnection
        [HttpPost]
        public async Task<IActionResult> TestConnection(int id)
        {
            try
            {
                var gateway = await _context.PaymentGateways.FindAsync(id);
                if (gateway == null)
                {
                    return Json(new { success = false, message = "Gateway no encontrado" });
                }
                
                if (string.IsNullOrEmpty(gateway.ConfigurationJson))
                {
                    return Json(new { success = false, message = "Gateway no configurado" });
                }
                
                // Create test payment request
                var testRequest = new PaymentRequest
                {
                    OrderId = "TEST-" + Guid.NewGuid().ToString().Substring(0, 8),
                    Amount = 1.00m,
                    Tax = 0.00m,
                    CardNumber = "4111111111111111", // Test card
                    CardExpiry = "12/25",
                    CardCvc = "123",
                    CardHolderName = "Test User",
                    Customer = new CustomerInfo
                    {
                        FirstName = "Test",
                        LastName = "User",
                        Email = "test@hotel23.com"
                    }
                };
                
                // Get processor and test
                var processor = _paymentFactory.GetProcessor(gateway.Provider);
                var result = await processor.ProcessPaymentAsync(testRequest);
                
                if (result.IsSuccess)
                {
                    // Immediately void the transaction
                    if (!string.IsNullOrEmpty(result.TransactionId))
                    {
                        await processor.VoidPaymentAsync(result.TransactionId);
                    }
                    
                    return Json(new { 
                        success = true, 
                        message = "Conexión exitosa. Transacción de prueba aprobada y anulada." 
                    });
                }
                else
                {
                    return Json(new { 
                        success = false, 
                        message = $"Error de conexión: {result.ErrorMessage ?? result.ResponseMessage}" 
                    });
                }
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error testing connection");
                return Json(new { success = false, message = $"Error: {ex.Message}" });
            }
        }
        
        private string GetGatewayDescription(string provider)
        {
            return provider switch
            {
                "AZUL_DO" => "Pasarela de pago dominicana",
                "PAYPAL" => "Pagos internacionales",
                "STRIPE" => "Pagos globales",
                _ => "Método de pago"
            };
        }
        
        private string GetGatewayLogoUrl(string provider)
        {
            return provider switch
            {
                "AZUL_DO" => "/images/payment/azul-logo.jpg",
                "PAYPAL" => "/images/payment/paypal-logo.jpg",
                "STRIPE" => "/images/payment/stripe-logo.png",
                _ => "/images/payment/default-logo.png"
            };
        }
        
        private string MaskValue(string? value)
        {
            if (string.IsNullOrEmpty(value) || value.Length <= 4)
                return "****";
                
            return value.Substring(0, 2) + "****" + value.Substring(value.Length - 2);
        }
        
        private async Task<string> SaveCertificateFile(IFormFile file, string type)
        {
            // Create certificates directory
            var certsPath = Path.Combine(_environment.ContentRootPath, "App_Data", "Certificates");
            if (!Directory.Exists(certsPath))
            {
                Directory.CreateDirectory(certsPath);
            }
            
            // Generate unique filename
            var fileName = $"azul_{type}_{DateTime.UtcNow.Ticks}{Path.GetExtension(file.FileName)}";
            var filePath = Path.Combine(certsPath, fileName);
            
            // Save file
            using (var stream = new FileStream(filePath, FileMode.Create))
            {
                await file.CopyToAsync(stream);
            }
            
            return filePath;
        }
        
        // POST: PaymentSettings/UploadCheckoutLogo
        [HttpPost]
        public async Task<IActionResult> UploadCheckoutLogo(IFormFile logoFile)
        {
            try
            {
                if (logoFile == null || logoFile.Length == 0)
                {
                    return Json(new { success = false, message = "No se seleccionó ningún archivo" });
                }
                
                // Validate file type
                var allowedTypes = new[] { "image/jpeg", "image/jpg", "image/png", "image/gif", "image/svg+xml", "image/webp" };
                if (!allowedTypes.Contains(logoFile.ContentType.ToLower()))
                {
                    return Json(new { success = false, message = "Tipo de archivo no permitido. Use JPG, PNG, GIF, SVG o WebP." });
                }
                
                // For better quality, recommend SVG or high-res images
                var fileExtension = Path.GetExtension(logoFile.FileName).ToLower();
                bool isVector = fileExtension == ".svg";
                
                // Check if image is high resolution (for raster images)
                if (!isVector && logoFile.Length < 50 * 1024) // Less than 50KB might be low quality
                {
                    _logger.LogWarning("Low resolution image uploaded for checkout logo");
                }
                
                // Create uploads directory
                var uploadsPath = Path.Combine(_environment.WebRootPath, "uploads", "checkout");
                if (!Directory.Exists(uploadsPath))
                {
                    Directory.CreateDirectory(uploadsPath);
                }
                
                // Generate unique filename
                var fileName = $"checkout_logo_{DateTime.UtcNow.Ticks}{Path.GetExtension(logoFile.FileName)}";
                var filePath = Path.Combine(uploadsPath, fileName);
                
                // Save file
                using (var stream = new FileStream(filePath, FileMode.Create))
                {
                    await logoFile.CopyToAsync(stream);
                }
                
                // Return the URL
                var logoUrl = $"/uploads/checkout/{fileName}";
                return Json(new { success = true, logoUrl = logoUrl });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error uploading checkout logo");
                return Json(new { success = false, message = "Error al subir el archivo" });
            }
        }
        
        // POST: PaymentSettings/SaveCheckoutSettings
        [HttpPost]
        public async Task<IActionResult> SaveCheckoutSettings(string logoUrl, string position, int size = 45)
        {
            try
            {
                var company = await _context.Companies.FirstOrDefaultAsync();
                if (company == null)
                {
                    return Json(new { success = false, message = "Empresa no encontrada" });
                }
                
                // Update checkout settings
                company.CheckoutLogoUrl = logoUrl;
                company.CheckoutLogoPosition = position ?? "left";
                company.CheckoutLogoSize = size;
                company.UpdatedAt = DateTime.UtcNow;
                
                await _context.SaveChangesAsync();
                
                return Json(new { success = true, message = "Configuración guardada exitosamente" });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error saving checkout settings");
                return Json(new { success = false, message = "Error al guardar la configuración" });
            }
        }
        
        // GET: PaymentSettings/GetCheckoutSettings
        [HttpGet]
        public async Task<IActionResult> GetCheckoutSettings()
        {
            try
            {
                var company = await _context.Companies.FirstOrDefaultAsync();
                if (company == null)
                {
                    return Json(new { success = false, message = "Empresa no encontrada" });
                }
                
                return Json(new
                {
                    success = true,
                    logoUrl = company.CheckoutLogoUrl,
                    position = company.CheckoutLogoPosition ?? "left",
                    size = company.CheckoutLogoSize
                });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error getting checkout settings");
                return Json(new { success = false, message = "Error al obtener la configuración" });
            }
        }
        
        private class AzulConfig
        {
            public string StoreId { get; set; } = string.Empty;
            public string Auth1 { get; set; } = string.Empty;
            public string Auth2 { get; set; } = string.Empty;
            public AzulEndpoints Endpoints { get; set; } = new AzulEndpoints();
        }
        
        private class AzulEndpoints
        {
            public string Test { get; set; } = string.Empty;
            public string Production { get; set; } = string.Empty;
        }
    }
}