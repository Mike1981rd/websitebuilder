using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Hotel.Data;
using Hotel.Models;
using System.Text.RegularExpressions;

namespace Hotel.Controllers
{
    [Authorize]
    public class CustomDomainsController : Controller
    {
        private readonly HotelDbContext _context;
        private readonly ILogger<CustomDomainsController> _logger;
        private readonly IConfiguration _configuration;

        public CustomDomainsController(HotelDbContext context, ILogger<CustomDomainsController> logger, IConfiguration configuration)
        {
            _context = context;
            _logger = logger;
            _configuration = configuration;
        }

        // GET: CustomDomains
        public async Task<IActionResult> Index()
        {
            var customDomains = await _context.CustomDomains
                .Include(cd => cd.WebSite)
                .OrderByDescending(cd => cd.CreatedAt)
                .ToListAsync();
            
            // Obtener la IP o dominio del sistema actual
            ViewBag.SystemIP = GetSystemIPAddress();
            ViewBag.CurrentSiteUrl = $"{Request.Scheme}://{Request.Host}/WebsiteBuilder/Preview";
                
            return View(customDomains);
        }

        // GET: CustomDomains/Create
        public async Task<IActionResult> Create()
        {
            // Obtener el website actual (patrón single entity)
            var website = await _context.WebSites.FirstOrDefaultAsync();
            if (website == null)
            {
                TempData["ErrorMessage"] = "No se encontró un sitio web configurado";
                return RedirectToAction(nameof(Index));
            }
            
            // Verificar si ya existe un dominio personalizado
            var existingDomain = await _context.CustomDomains
                .FirstOrDefaultAsync(cd => cd.WebSiteId == website.Id);
                
            if (existingDomain != null)
            {
                TempData["ErrorMessage"] = "Ya existe un dominio personalizado configurado";
                return RedirectToAction(nameof(Index));
            }
            
            // Obtener la IP o dominio del sistema
            ViewBag.SystemIP = GetSystemIPAddress();
            
            return View();
        }

        // POST: CustomDomains/Create
        [HttpPost]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> Create(CustomDomain customDomain)
        {
            try
            {
                // Logging para debug
                _logger.LogInformation($"Intentando crear dominio: {customDomain.DomainName}");
                
                // Remover validaciones de navegación
                ModelState.Remove("WebSite");
                
                // Validar formato del dominio
                if (!IsValidDomain(customDomain.DomainName))
                {
                    ModelState.AddModelError("DomainName", "Por favor ingresa un dominio válido (ej: www.mihotel.com)");
                    return View(customDomain);
                }
                
                // Normalizar dominio (lowercase, sin espacios)
                customDomain.DomainName = customDomain.DomainName.Trim().ToLower();
                
                // Obtener el website actual
                var website = await _context.WebSites.FirstOrDefaultAsync();
                if (website == null)
                {
                    TempData["ErrorMessage"] = "No se encontró un sitio web configurado";
                    return RedirectToAction(nameof(Index));
                }
                
                customDomain.WebSiteId = website.Id;
                
                // Verificar duplicados
                var exists = await _context.CustomDomains
                    .AnyAsync(cd => cd.DomainName == customDomain.DomainName);
                    
                if (exists)
                {
                    ModelState.AddModelError("DomainName", "Este dominio ya está en uso");
                    return View(customDomain);
                }
                
                // Establecer valores de auditoría
                customDomain.CreatedAt = DateTime.UtcNow;
                customDomain.UpdatedAt = DateTime.UtcNow;
                customDomain.Status = "pending";
                customDomain.IsActive = true; // Por ahora activar inmediatamente
                
                if (ModelState.IsValid)
                {
                    _context.CustomDomains.Add(customDomain);
                    await _context.SaveChangesAsync();
                    
                    TempData["SuccessMessage"] = "Dominio personalizado agregado exitosamente";
                    return RedirectToAction(nameof(Index));
                }
                else
                {
                    // Log de errores de ModelState
                    foreach (var modelError in ModelState.Values.SelectMany(v => v.Errors))
                    {
                        _logger.LogWarning($"Error de validación: {modelError.ErrorMessage}");
                    }
                }
            }
            catch (DbUpdateException dbEx)
            {
                // Manejo específico para errores de PostgreSQL
                if (dbEx.InnerException is Npgsql.PostgresException pgEx)
                {
                    _logger.LogError($"PostgreSQL Error: {pgEx.MessageText}");
                    if (pgEx.ConstraintName?.Contains("DomainName") == true)
                    {
                        TempData["ErrorMessage"] = "Este dominio ya está registrado";
                    }
                    else
                    {
                        TempData["ErrorMessage"] = $"Error al guardar: {pgEx.MessageText}";
                    }
                }
                else
                {
                    _logger.LogError(dbEx, "Error al crear dominio personalizado");
                    TempData["ErrorMessage"] = "Error al guardar el dominio";
                }
            }
            
            return View(customDomain);
        }

        // GET: CustomDomains/Edit/5
        public async Task<IActionResult> Edit(int? id)
        {
            if (id == null)
            {
                return NotFound();
            }

            var customDomain = await _context.CustomDomains.FindAsync(id);
            if (customDomain == null)
            {
                return NotFound();
            }
            
            // Obtener la IP o dominio del sistema
            ViewBag.SystemIP = GetSystemIPAddress();
            
            return View(customDomain);
        }

        // POST: CustomDomains/Edit/5
        [HttpPost]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> Edit(int id, CustomDomain customDomain)
        {
            if (id != customDomain.Id)
            {
                return NotFound();
            }

            try
            {
                // Logging para debug
                _logger.LogInformation($"Intentando editar dominio ID: {id}, Nuevo valor: {customDomain.DomainName}");
                
                // Remover validaciones de navegación
                ModelState.Remove("WebSite");
                
                // Validar formato del dominio
                if (!IsValidDomain(customDomain.DomainName))
                {
                    ModelState.AddModelError("DomainName", "Por favor ingresa un dominio válido (ej: www.mihotel.com)");
                    return View(customDomain);
                }
                
                // Normalizar dominio
                customDomain.DomainName = customDomain.DomainName.Trim().ToLower();
                
                // Verificar duplicados (excluyendo el actual)
                var exists = await _context.CustomDomains
                    .AnyAsync(cd => cd.DomainName == customDomain.DomainName && cd.Id != id);
                    
                if (exists)
                {
                    ModelState.AddModelError("DomainName", "Este dominio ya está en uso");
                    return View(customDomain);
                }

                if (ModelState.IsValid)
                {
                    try
                    {
                        // Cargar la entidad original para preservar campos no editables
                        var originalDomain = await _context.CustomDomains.FindAsync(id);
                        if (originalDomain == null)
                        {
                            return NotFound();
                        }
                        
                        // Actualizar solo los campos editables
                        originalDomain.DomainName = customDomain.DomainName;
                        originalDomain.Status = customDomain.Status;
                        originalDomain.IsActive = customDomain.IsActive;
                        originalDomain.UpdatedAt = DateTime.UtcNow;
                        
                        await _context.SaveChangesAsync();
                        
                        TempData["SuccessMessage"] = "Dominio actualizado exitosamente";
                        return RedirectToAction(nameof(Index));
                    }
                    catch (DbUpdateConcurrencyException)
                    {
                        if (!CustomDomainExists(customDomain.Id))
                        {
                            return NotFound();
                        }
                        else
                        {
                            throw;
                        }
                    }
                }
                else
                {
                    // Log de errores de ModelState
                    foreach (var modelError in ModelState.Values.SelectMany(v => v.Errors))
                    {
                        _logger.LogWarning($"Error de validación: {modelError.ErrorMessage}");
                    }
                }
            }
            catch (DbUpdateException dbEx)
            {
                // Manejo específico para errores de PostgreSQL
                if (dbEx.InnerException is Npgsql.PostgresException pgEx)
                {
                    _logger.LogError($"PostgreSQL Error: {pgEx.MessageText}");
                    TempData["ErrorMessage"] = $"Error al actualizar: {pgEx.MessageText}";
                }
                else
                {
                    _logger.LogError(dbEx, "Error al actualizar dominio personalizado");
                    TempData["ErrorMessage"] = "Error al actualizar el dominio";
                }
            }
            
            return View(customDomain);
        }

        // POST: CustomDomains/Delete/5
        [HttpPost]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> Delete(int id)
        {
            try
            {
                var customDomain = await _context.CustomDomains.FindAsync(id);
                if (customDomain == null)
                {
                    return Json(new { success = false, message = "Dominio no encontrado" });
                }

                _context.CustomDomains.Remove(customDomain);
                await _context.SaveChangesAsync();
                
                TempData["SuccessMessage"] = "Dominio eliminado exitosamente";
                return Json(new { success = true });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error al eliminar dominio personalizado");
                return Json(new { success = false, message = "Error al eliminar el dominio" });
            }
        }

        // POST: CustomDomains/ToggleStatus/5
        [HttpPost]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> ToggleStatus(int id)
        {
            try
            {
                var customDomain = await _context.CustomDomains.FindAsync(id);
                if (customDomain == null)
                {
                    return Json(new { success = false, message = "Dominio no encontrado" });
                }

                customDomain.IsActive = !customDomain.IsActive;
                customDomain.UpdatedAt = DateTime.UtcNow;
                
                await _context.SaveChangesAsync();
                
                var message = customDomain.IsActive ? "Dominio activado" : "Dominio desactivado";
                return Json(new { success = true, isActive = customDomain.IsActive, message = message });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error al cambiar estado del dominio");
                return Json(new { success = false, message = "Error al cambiar el estado" });
            }
        }

        // Método auxiliar para validar formato de dominio
        private bool IsValidDomain(string domain)
        {
            if (string.IsNullOrWhiteSpace(domain))
                return false;
                
            // Regex para validar formato de dominio
            var domainRegex = new Regex(@"^[a-zA-Z0-9][a-zA-Z0-9-]{0,61}[a-zA-Z0-9](\.[a-zA-Z]{2,})+$");
            return domainRegex.IsMatch(domain);
        }

        private bool CustomDomainExists(int id)
        {
            return _context.CustomDomains.Any(e => e.Id == id);
        }
        
        // Método para obtener la IP o dominio del sistema
        private string GetSystemIPAddress()
        {
            // Primero intentar obtener de configuración
            var configuredIP = _configuration["SystemSettings:PublicIP"];
            if (!string.IsNullOrEmpty(configuredIP))
            {
                return configuredIP;
            }
            
            // Si no está configurado, usar el host actual
            var host = Request.Host.Host;
            
            // Si es localhost, devolver la IP de Azure conocida
            if (host == "localhost" || host.StartsWith("127.") || host.StartsWith("192."))
            {
                return "20.169.209.166"; // IP de Azure por defecto
            }
            
            return host;
        }
    }
}