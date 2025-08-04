using Microsoft.AspNetCore.Mvc;
using Hotel.Data;
using Microsoft.EntityFrameworkCore;

namespace Hotel.Controllers
{
    public class WebsiteBuilderController : Controller
    {
        private readonly HotelDbContext _context;

        public WebsiteBuilderController(HotelDbContext context)
        {
            _context = context;
        }

        public IActionResult Index()
        {
            return View();
        }

        public IActionResult Appearance()
        {
            return View();
        }

        // Sirve la vista en blanco que se cargará en el iframe de la previsualización.
        public IActionResult PreviewTemplate()
        {
            return View();
        }

        // Vista de preview completa en nueva pestaña
        public async Task<IActionResult> Preview(string page = null, string handle = null, string type = null)
        {
            // Get the website to use its UpdatedAt as cache version
            var website = await _context.WebSites.FirstOrDefaultAsync();
            if (website != null)
            {
                // Use the UpdatedAt timestamp as version for cache busting
                // Convert to Unix timestamp to ensure consistent format
                ViewBag.CacheVersion = ((DateTimeOffset)website.UpdatedAt).ToUnixTimeSeconds();
            }
            else
            {
                // Fallback to current timestamp if no website exists
                ViewBag.CacheVersion = DateTimeOffset.UtcNow.ToUnixTimeSeconds();
            }

            // Check if this is being accessed via /cart route
            if (Request.Path.Value?.Equals("/cart", StringComparison.OrdinalIgnoreCase) == true)
            {
                page = "cart";
            }
            
            // Check if this is being accessed via /collections route
            if (Request.Path.Value?.Equals("/collections", StringComparison.OrdinalIgnoreCase) == true)
            {
                page = "collections";
            }
            
            // Check if this is being accessed via /collections/{handle} route
            if (Request.Path.Value?.StartsWith("/collections/", StringComparison.OrdinalIgnoreCase) == true && !string.IsNullOrEmpty(handle))
            {
                page = "collection"; // singular for individual collection
                ViewBag.CollectionHandle = handle;
            }
            
            // Check if this is being accessed via /products route (all products)
            if (Request.Path.Value?.Equals("/products", StringComparison.OrdinalIgnoreCase) == true)
            {
                page = "products";
            }
            
            // Check if this is being accessed via /products/{handle} route
            if (Request.Path.Value?.StartsWith("/products/", StringComparison.OrdinalIgnoreCase) == true && !string.IsNullOrEmpty(handle))
            {
                page = "product";
                ViewBag.ProductHandle = handle;
            }
            
            // Check if this is being accessed via /policies route
            if (Request.Path.Value?.Equals("/policies", StringComparison.OrdinalIgnoreCase) == true)
            {
                page = "policies";
            }
            
            // Check if this is being accessed via /policies/{type} route
            if (Request.Path.Value?.StartsWith("/policies/", StringComparison.OrdinalIgnoreCase) == true)
            {
                page = "policy"; // singular for individual policy
                ViewBag.PolicyType = type; // Use the type parameter
            }
            
            // Check if this is being accessed via /pages route
            if (Request.Path.Value?.Equals("/pages", StringComparison.OrdinalIgnoreCase) == true)
            {
                page = "pages";
            }
            
            // Check if this is being accessed via /pages/{handle} route
            if (Request.Path.Value?.StartsWith("/pages/", StringComparison.OrdinalIgnoreCase) == true && !string.IsNullOrEmpty(handle))
            {
                page = "page"; // singular for individual page
                ViewBag.PageHandle = handle;
            }
            
            // Pass the page parameter to the view
            ViewBag.Page = page;
            
            // Detectar si viene de un dominio personalizado
            var isCustomDomain = HttpContext.Items.ContainsKey("IsCustomDomain") && 
                                (bool)HttpContext.Items["IsCustomDomain"];
            
            // Only add no-cache headers if we're in development or if it's accessed from the editor
            var referrer = Request.Headers["Referer"].ToString();
            var isFromEditor = referrer.Contains("/WebsiteBuilder") || referrer.Contains("/websitebuilder");
            var isDevelopment = Environment.GetEnvironmentVariable("ASPNETCORE_ENVIRONMENT") == "Development";
            
            if (isDevelopment || isFromEditor)
            {
                // Add cache control headers to prevent browser caching in development/editor preview
                Response.Headers["Cache-Control"] = "no-cache, no-store, must-revalidate";
                Response.Headers["Pragma"] = "no-cache";
                Response.Headers["Expires"] = "0";
            }
            else if (isCustomDomain)
            {
                // Para dominios personalizados, usar cache más corto para mejor balance entre performance y frescura
                Response.Headers["Cache-Control"] = "public, max-age=30"; // Cache por 30 segundos
                Response.Headers["Vary"] = "Accept-Encoding"; // Permitir cache por encoding
            }
            else
            {
                // In production for public visitors (preview directo), allow caching for better performance
                Response.Headers["Cache-Control"] = "public, max-age=300"; // Cache for 5 minutes
            }
            
            // Pasar información del dominio personalizado a la vista
            ViewBag.IsCustomDomain = isCustomDomain;
            if (isCustomDomain)
            {
                ViewBag.CustomDomainId = HttpContext.Items["CustomDomainId"];
                ViewBag.WebSiteId = HttpContext.Items["WebSiteId"];
            }
            
            return View();
        }
    }
}