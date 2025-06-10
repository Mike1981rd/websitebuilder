using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Hotel.Data;
using Hotel.Models;
using System.Text.Json;
using System.Text.Json.Serialization;
using Microsoft.AspNetCore.Authorization;
using System.Text;
using System.IO;

namespace Hotel.Controllers
{
    [Route("api/builder/websites")]
    [ApiController]
    [Authorize]
    public class WebSitesController : ControllerBase
    {
        private readonly HotelDbContext _context;
        private readonly ILogger<WebSitesController> _logger;

        public WebSitesController(HotelDbContext context, ILogger<WebSitesController> logger)
        {
            _context = context;
            _logger = logger;
        }

        // GET: api/builder/websites/current
        [HttpGet("current")]
        public async Task<ActionResult<WebSite>> GetCurrentWebSite()
        {
            try
            {
                // Por ahora, obtenemos el primer sitio web de la primera compañía
                // En un escenario real, esto se basaría en el usuario autenticado
                var company = await _context.Companies.FirstOrDefaultAsync();
                if (company == null)
                {
                    return NotFound(new { message = "No company found" });
                }

                var website = await _context.WebSites
                    .FirstOrDefaultAsync(w => w.CompanyId == company.Id);

                if (website == null)
                {
                    // Crear un sitio web por defecto si no existe
                    website = new WebSite
                    {
                        CompanyId = company.Id,
                        Name = company.TradeName + " Website",
                        Subdomain = company.TradeName.ToLower().Replace(" ", "-"),
                        Template = "default",
                        GlobalThemeSettingsJson = GetDefaultGlobalThemeSettings("default"),
                        PagesJson = "[]",
                        NavigationJson = "[]",
                        SeoSettingsJson = "{}"
                    };

                    _context.WebSites.Add(website);
                    await _context.SaveChangesAsync();
                }

                return Ok(website);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error getting current website");
                return StatusCode(500, new { message = "An error occurred while retrieving the website" });
            }
        }

        // PUT: api/builder/websites/current/global-settings
        [HttpPut("current/global-settings")]
        public async Task<IActionResult> UpdateGlobalThemeSettings()
        {
            try
            {
                // PASO 1: Leer el cuerpo de la petición como un string crudo.
                string requestBody;
                using (var reader = new StreamReader(Request.Body, Encoding.UTF8))
                {
                    requestBody = await reader.ReadToEndAsync();
                }

                if (string.IsNullOrEmpty(requestBody))
                {
                    return BadRequest(new { message = "Request body is empty." });
                }

                // PASO 2: Deserializar el string manualmente a nuestro DTO.
                UpdateGlobalThemeSettingsDto dto;
                try
                {
                    // Usamos nuestras propias opciones para asegurar el mapeo correcto.
                    var options = new JsonSerializerOptions
                    {
                        PropertyNameCaseInsensitive = true // Esto hace que "globalSettings" mapee a "GlobalSettings"
                    };
                    dto = JsonSerializer.Deserialize<UpdateGlobalThemeSettingsDto>(requestBody, options);
                }
                catch (JsonException ex)
                {
                    _logger.LogError(ex, "Error deserializing request body: {RequestBody}", requestBody);
                    return BadRequest(new { message = "Invalid JSON format." });
                }

                if (dto == null)
                {
                     return BadRequest(new { message = "Deserialized DTO is null." });
                }

                _logger.LogInformation("Received GlobalSettings: {Json}", JsonSerializer.Serialize(dto.GlobalSettings));

                // PASO 3: El resto de la lógica original (la cual ya era correcta).
                var company = await _context.Companies.FirstOrDefaultAsync();
                if (company == null)
                {
                    return NotFound(new { message = "No company found" });
                }

                var website = await _context.WebSites
                    .FirstOrDefaultAsync(w => w.CompanyId == company.Id);

                if (website == null)
                {
                    return NotFound(new { message = "Website not found" });
                }

                var jsonToSave = JsonSerializer.Serialize(dto.GlobalSettings, new JsonSerializerOptions
                {
                    WriteIndented = false
                });
                
                _logger.LogInformation("JSON to save length: {Length}", jsonToSave.Length);
                
                website.GlobalThemeSettingsJson = jsonToSave;
                website.UpdatedAt = DateTime.UtcNow;

                _context.Entry(website).State = EntityState.Modified;
                
                try
                {
                    await _context.SaveChangesAsync();
                    _logger.LogInformation("Successfully saved global theme settings");
                }
                catch (Exception dbEx)
                {
                    _logger.LogError(dbEx, "Database error while saving global theme settings");
                    throw;
                }

                return NoContent();
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error updating global theme settings");
                return StatusCode(500, new { message = "An error occurred while updating theme settings" });
            }
        }

        // PUT: api/builder/websites/current
        [HttpPut("current")]
        public async Task<IActionResult> UpdateWebSite([FromBody] UpdateWebSiteDto dto)
        {
            try
            {
                var company = await _context.Companies.FirstOrDefaultAsync();
                if (company == null)
                {
                    return NotFound(new { message = "No company found" });
                }

                var website = await _context.WebSites
                    .FirstOrDefaultAsync(w => w.CompanyId == company.Id);

                if (website == null)
                {
                    return NotFound(new { message = "Website not found" });
                }

                // Actualizar propiedades básicas si se proporcionan
                if (!string.IsNullOrEmpty(dto.Name))
                    website.Name = dto.Name;
                
                if (!string.IsNullOrEmpty(dto.Subdomain))
                    website.Subdomain = dto.Subdomain;
                
                if (dto.CustomDomain != null)
                    website.CustomDomain = dto.CustomDomain;
                
                if (dto.IsActive.HasValue)
                    website.IsActive = dto.IsActive.Value;
                
                if (dto.IsPublished.HasValue)
                {
                    website.IsPublished = dto.IsPublished.Value;
                    if (dto.IsPublished.Value && !website.PublishedAt.HasValue)
                        website.PublishedAt = DateTime.UtcNow;
                }

                website.UpdatedAt = DateTime.UtcNow;
                
                _context.Entry(website).State = EntityState.Modified;
                await _context.SaveChangesAsync();

                return NoContent();
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error updating website");
                return StatusCode(500, new { message = "An error occurred while updating the website" });
            }
        }

        private string GetDefaultGlobalThemeSettings(string template)
        {
            // Aquí puedes definir configuraciones por defecto para cada plantilla
            if (template == "default" || template == "dawn")
            {
                return @"{
                    ""appearance"": {
                        ""colorScheme"": ""light"",
                        ""primaryColor"": ""#007bff"",
                        ""secondaryColor"": ""#6c757d"",
                        ""successColor"": ""#28a745"",
                        ""dangerColor"": ""#dc3545"",
                        ""warningColor"": ""#ffc107"",
                        ""infoColor"": ""#17a2b8""
                    },
                    ""typography"": {
                        ""fontFamily"": ""Inter, sans-serif"",
                        ""baseFontSize"": ""16px"",
                        ""headingFontFamily"": ""Inter, sans-serif"",
                        ""headingFontWeight"": ""700""
                    },
                    ""layout"": {
                        ""containerWidth"": ""1200px"",
                        ""pageWidth"": ""100%"",
                        ""headerLayout"": ""centered"",
                        ""footerLayout"": ""multi-column""
                    },
                    ""productCards"": {
                        ""imageRatio"": ""square"",
                        ""showVendor"": false,
                        ""showSecondImage"": true,
                        ""textAlignment"": ""left""
                    }
                }";
            }
            
            // Plantilla por defecto mínima
            return "{}";
        }
    }

    public class UpdateGlobalThemeSettingsDto
    {
        // Le decimos explícitamente al serializador que busque "globalSettings" (con 'g' minúscula) en el JSON entrante.
        [JsonPropertyName("globalSettings")]
        public JsonElement GlobalSettings { get; set; }
    }

    public class UpdateWebSiteDto
    {
        public string? Name { get; set; }
        public string? Subdomain { get; set; }
        public string? CustomDomain { get; set; }
        public bool? IsActive { get; set; }
        public bool? IsPublished { get; set; }
    }
}