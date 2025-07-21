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
        public IActionResult Preview(string page = null, string handle = null)
        {
            // Check if this is being accessed via /cart route
            if (Request.Path.Value?.Equals("/cart", StringComparison.OrdinalIgnoreCase) == true)
            {
                page = "cart";
            }
            
            // Check if this is being accessed via /products/{handle} route
            if (!string.IsNullOrEmpty(handle) || Request.Path.Value?.StartsWith("/products/", StringComparison.OrdinalIgnoreCase) == true)
            {
                page = "product";
                ViewBag.ProductHandle = handle;
            }
            
            // Pass the page parameter to the view
            ViewBag.Page = page;
            return View();
        }
    }
}