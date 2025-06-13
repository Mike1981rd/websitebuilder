using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Hotel.Data;
using Hotel.Models;
using System.Text.Json;
using System.Text.Json.Serialization;
using System.Text.Json.Nodes;
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
                        Domain = company.TradeName.ToLower().Replace(" ", "-") + ".com",
                        Template = "default",
                        GlobalThemeSettingsJson = GetDefaultGlobalThemeSettings("default"),
                        SectionsConfigJson = GetDefaultSectionsConfig(),
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

        private string GetDefaultSectionsConfig()
        {
            return @"{
                ""sectionOrder"": [""announcement"", ""header""],
                ""announcementBar"": {
                    ""isHidden"": false,
                    ""colorScheme"": ""scheme1"",
                    ""showOnlyHomePage"": false,
                    ""width"": ""screen"",
                    ""showNavigationArrows"": true,
                    ""autoplayMode"": ""none"",
                    ""autoplaySpeed"": 6,
                    ""animationStyle"": ""none"",
                    ""showLanguageSelector"": false,
                    ""showCurrencySelector"": false,
                    ""showSocialMediaIcons"": false
                },
                ""announcements"": {},
                ""announcementOrder"": [],
                ""header"": {
                    ""isHidden"": false,
                    ""colorScheme"": ""primary"",
                    ""width"": ""large"",
                    ""layout"": ""logo-center-menu-left-inline"",
                    ""showDivider"": true,
                    ""enableStickyHeader"": false,
                    ""openMenuDropdown"": ""hover"",
                    ""navigationMenuId"": ""main-menu"",
                    ""logoAlignment"": ""center"",
                    ""menu"": """",
                    ""desktopLogoSize"": 190,
                    ""mobileLogoSize"": 120,
                    ""iconStyle"": ""outline"",
                    ""cartType"": ""bag"",
                    ""desktopLogoUrl"": """",
                    ""mobileLogoUrl"": """",
                    ""sectionVisibility"": {
                        ""menu"": true,
                        ""logo"": true,
                        ""icons"": true
                    }
                }
            }";
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

        // PUT: api/builder/websites/{id}/pages/{pageId}
        [HttpPut("{id}/pages/{pageId}")]
        public async Task<IActionResult> UpdatePageStructure(int id, int pageId)
        {
            try
            {
                // Read the request body
                string requestBody;
                using (var reader = new StreamReader(Request.Body, Encoding.UTF8))
                {
                    requestBody = await reader.ReadToEndAsync();
                }

                if (string.IsNullOrEmpty(requestBody))
                {
                    return BadRequest(new { message = "Request body is empty." });
                }

                // Deserialize the request
                UpdatePageStructureDto dto;
                try
                {
                    var options = new JsonSerializerOptions
                    {
                        PropertyNameCaseInsensitive = true
                    };
                    dto = JsonSerializer.Deserialize<UpdatePageStructureDto>(requestBody, options);
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

                var website = await _context.WebSites.FindAsync(id);
                if (website == null)
                {
                    return NotFound(new { message = "Website not found" });
                }

                // Parse the page structure to extract sectionsConfig
                try
                {
                    var pageData = JsonDocument.Parse(dto.PageStructureJson).RootElement;
                    
                    // Extract sectionsConfig if it exists
                    if (pageData.TryGetProperty("sectionsConfig", out JsonElement sectionsConfig))
                    {
                        website.SectionsConfigJson = sectionsConfig.GetRawText();
                        _logger.LogInformation("Saving sectionsConfig to SectionsConfigJson");
                    }
                    else
                    {
                        // If no sectionsConfig property, save the entire structure
                        website.SectionsConfigJson = dto.PageStructureJson;
                        _logger.LogInformation("No sectionsConfig found, saving entire structure");
                    }
                }
                catch (JsonException)
                {
                    // If parsing fails, save as is
                    website.SectionsConfigJson = dto.PageStructureJson;
                }
                
                website.UpdatedAt = DateTime.UtcNow;

                _context.Entry(website).State = EntityState.Modified;
                await _context.SaveChangesAsync();

                _logger.LogInformation("Successfully saved page structure for website {WebsiteId}, page {PageId}", id, pageId);

                return NoContent();
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error updating page structure");
                return StatusCode(500, new { message = "An error occurred while updating the page structure" });
            }
        }

        // GET: api/builder/navigation
        [HttpGet("/api/builder/navigation")]
        public async Task<ActionResult<List<NavigationItem>>> GetNavigation()
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

                // Parse NavigationJson
                var navigation = new List<NavigationItem>();
                if (!string.IsNullOrEmpty(website.NavigationJson) && website.NavigationJson != "[]")
                {
                    try
                    {
                        navigation = JsonSerializer.Deserialize<List<NavigationItem>>(website.NavigationJson);
                    }
                    catch (JsonException ex)
                    {
                        _logger.LogError(ex, "Error parsing NavigationJson");
                        navigation = new List<NavigationItem>();
                    }
                }

                return Ok(navigation);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error getting navigation");
                return StatusCode(500, new { message = "An error occurred while retrieving navigation" });
            }
        }

        // POST: api/builder/navigation
        [HttpPost("/api/builder/navigation")]
        public async Task<IActionResult> SaveNavigation([FromBody] List<NavigationItem> navigation)
        {
            try
            {
                if (navigation == null)
                {
                    return BadRequest(new { message = "Navigation data is required" });
                }

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

                // Serialize navigation to JSON
                var navigationJson = JsonSerializer.Serialize(navigation, new JsonSerializerOptions
                {
                    WriteIndented = false
                });

                website.NavigationJson = navigationJson;
                website.UpdatedAt = DateTime.UtcNow;

                _context.Entry(website).State = EntityState.Modified;
                await _context.SaveChangesAsync();

                _logger.LogInformation("Successfully saved navigation structure");

                return NoContent();
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error saving navigation");
                return StatusCode(500, new { message = "An error occurred while saving navigation" });
            }
        }

        // PUT: api/builder/navigation/reorder
        [HttpPut("/api/builder/navigation/reorder")]
        public async Task<IActionResult> ReorderNavigation([FromBody] ReorderNavigationDto dto)
        {
            try
            {
                if (dto == null || dto.ItemIds == null || !dto.ItemIds.Any())
                {
                    return BadRequest(new { message = "Item IDs are required for reordering" });
                }

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

                // Parse current navigation
                var navigation = new List<NavigationItem>();
                if (!string.IsNullOrEmpty(website.NavigationJson) && website.NavigationJson != "[]")
                {
                    try
                    {
                        navigation = JsonSerializer.Deserialize<List<NavigationItem>>(website.NavigationJson);
                    }
                    catch (JsonException ex)
                    {
                        _logger.LogError(ex, "Error parsing NavigationJson");
                        return StatusCode(500, new { message = "Error processing current navigation" });
                    }
                }

                // Create a dictionary for quick lookup
                var navDict = navigation.ToDictionary(n => n.Id, n => n);

                // Reorder based on provided IDs
                var reorderedNavigation = new List<NavigationItem>();
                foreach (var id in dto.ItemIds)
                {
                    if (navDict.ContainsKey(id))
                    {
                        reorderedNavigation.Add(navDict[id]);
                    }
                }

                // Add any items that weren't in the reorder list (shouldn't happen, but safety check)
                foreach (var item in navigation)
                {
                    if (!dto.ItemIds.Contains(item.Id))
                    {
                        reorderedNavigation.Add(item);
                    }
                }

                // Save reordered navigation
                website.NavigationJson = JsonSerializer.Serialize(reorderedNavigation);
                website.UpdatedAt = DateTime.UtcNow;

                _context.Entry(website).State = EntityState.Modified;
                await _context.SaveChangesAsync();

                _logger.LogInformation("Successfully reordered navigation");

                return NoContent();
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error reordering navigation");
                return StatusCode(500, new { message = "An error occurred while reordering navigation" });
            }
        }

        // DELETE: api/builder/navigation/{id}
        [HttpDelete("/api/builder/navigation/{id}")]
        public async Task<IActionResult> DeleteNavigationItem(string id)
        {
            try
            {
                if (string.IsNullOrEmpty(id))
                {
                    return BadRequest(new { message = "Item ID is required" });
                }

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

                // Parse current navigation
                var navigation = new List<NavigationItem>();
                if (!string.IsNullOrEmpty(website.NavigationJson) && website.NavigationJson != "[]")
                {
                    try
                    {
                        navigation = JsonSerializer.Deserialize<List<NavigationItem>>(website.NavigationJson);
                    }
                    catch (JsonException ex)
                    {
                        _logger.LogError(ex, "Error parsing NavigationJson");
                        return StatusCode(500, new { message = "Error processing current navigation" });
                    }
                }

                // Recursive function to remove item
                bool RemoveItem(List<NavigationItem> items, string itemId)
                {
                    var item = items.FirstOrDefault(i => i.Id == itemId);
                    if (item != null)
                    {
                        items.Remove(item);
                        return true;
                    }

                    foreach (var navItem in items)
                    {
                        if (navItem.Children != null && RemoveItem(navItem.Children, itemId))
                        {
                            return true;
                        }
                    }
                    return false;
                }

                if (!RemoveItem(navigation, id))
                {
                    return NotFound(new { message = "Navigation item not found" });
                }

                // Save updated navigation
                website.NavigationJson = JsonSerializer.Serialize(navigation);
                website.UpdatedAt = DateTime.UtcNow;

                _context.Entry(website).State = EntityState.Modified;
                await _context.SaveChangesAsync();

                _logger.LogInformation("Successfully deleted navigation item {ItemId}", id);

                return NoContent();
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error deleting navigation item");
                return StatusCode(500, new { message = "An error occurred while deleting navigation item" });
            }
        }

        // POST: api/builder/websites/current/upload-logo
        [HttpPost("current/upload-logo")]
        [DisableRequestSizeLimit]
        public async Task<IActionResult> UploadLogo([FromForm] IFormFile logoFile, [FromForm] string logoType)
        {
            try
            {
                if (logoFile == null || logoFile.Length == 0)
                {
                    return BadRequest(new { message = "No file uploaded" });
                }

                // Validar tipo de archivo
                var allowedExtensions = new[] { ".jpg", ".jpeg", ".png", ".gif", ".svg", ".webp" };
                var extension = Path.GetExtension(logoFile.FileName).ToLowerInvariant();
                
                if (!allowedExtensions.Contains(extension))
                {
                    return BadRequest(new { message = "Invalid file type. Allowed types: jpg, jpeg, png, gif, svg, webp" });
                }

                // Validar tamaño del archivo (5MB máximo)
                if (logoFile.Length > 5 * 1024 * 1024)
                {
                    return BadRequest(new { message = "File size exceeds 5MB limit" });
                }

                // Validar logoType
                if (logoType != "desktop" && logoType != "mobile")
                {
                    return BadRequest(new { message = "Invalid logo type. Must be 'desktop' or 'mobile'" });
                }

                // Obtener el sitio web actual
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

                // Crear directorio si no existe
                var uploadsPath = Path.Combine("wwwroot", "uploads", "website-logos");
                if (!Directory.Exists(uploadsPath))
                {
                    Directory.CreateDirectory(uploadsPath);
                }

                // Generar nombre único para el archivo
                var uniqueFileName = $"{website.Id}_{logoType}_{Guid.NewGuid()}{extension}";
                var filePath = Path.Combine(uploadsPath, uniqueFileName);

                // Guardar el archivo
                using (var stream = new FileStream(filePath, FileMode.Create))
                {
                    await logoFile.CopyToAsync(stream);
                }

                // URL relativa del archivo
                var logoUrl = $"/uploads/website-logos/{uniqueFileName}";

                // Actualizar la configuración del sitio web
                var currentSettings = string.IsNullOrEmpty(website.GlobalThemeSettingsJson) 
                    ? new JsonObject() 
                    : JsonSerializer.Deserialize<JsonObject>(website.GlobalThemeSettingsJson) ?? new JsonObject();

                // Asegurarse de que existe la sección header
                if (!currentSettings.ContainsKey("header"))
                {
                    currentSettings["header"] = new JsonObject();
                }

                var headerSettings = currentSettings["header"] as JsonObject ?? new JsonObject();
                
                // Guardar la URL del logo según el tipo
                if (logoType == "desktop")
                {
                    headerSettings["desktopLogoUrl"] = JsonValue.Create(logoUrl);
                }
                else
                {
                    headerSettings["mobileLogoUrl"] = JsonValue.Create(logoUrl);
                }

                currentSettings["header"] = headerSettings;

                // Guardar cambios
                website.GlobalThemeSettingsJson = JsonSerializer.Serialize(currentSettings);
                website.UpdatedAt = DateTime.UtcNow;

                _context.Entry(website).State = EntityState.Modified;
                await _context.SaveChangesAsync();

                _logger.LogInformation("Successfully uploaded {LogoType} logo for website {WebsiteId}", logoType, website.Id);

                return Ok(new { 
                    message = "Logo uploaded successfully", 
                    logoUrl = logoUrl,
                    logoType = logoType
                });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error uploading logo");
                return StatusCode(500, new { message = "An error occurred while uploading the logo" });
            }
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

    public class UpdatePageStructureDto
    {
        [JsonPropertyName("pageStructureJson")]
        public string PageStructureJson { get; set; } = string.Empty;
    }

    public class NavigationItem
    {
        [JsonPropertyName("id")]
        public string Id { get; set; } = string.Empty;

        [JsonPropertyName("label")]
        public string Label { get; set; } = string.Empty;

        [JsonPropertyName("url")]
        public string Url { get; set; } = string.Empty;

        [JsonPropertyName("target")]
        public string Target { get; set; } = "_self";

        [JsonPropertyName("children")]
        public List<NavigationItem> Children { get; set; } = new List<NavigationItem>();
    }

    public class ReorderNavigationDto
    {
        [JsonPropertyName("itemIds")]
        public List<string> ItemIds { get; set; } = new List<string>();
    }
}