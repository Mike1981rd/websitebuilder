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
    }
}