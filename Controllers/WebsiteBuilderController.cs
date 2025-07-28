using Microsoft.AspNetCore.Mvc;

namespace Hotel.Controllers
{
    public class WebsiteBuilderController : Controller
    {
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
        public IActionResult Preview(string page = null, string handle = null, string type = null)
        {
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
            return View();
        }
    }
}