using Microsoft.AspNetCore.Mvc;

namespace Hotel.Controllers
{
    public class WebsiteBuilderController : Controller
    {
        public IActionResult Index()
        {
            return View();
        }
    }
}