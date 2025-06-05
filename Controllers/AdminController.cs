using Microsoft.AspNetCore.Mvc;

namespace Hotel.Controllers
{
    public class AdminController : Controller
    {
        public IActionResult Index()
        {
            return View();
        }

        public IActionResult Dashboard()
        {
            return View();
        }

        public IActionResult Rooms()
        {
            return View();
        }

        public IActionResult Guests()
        {
            return View();
        }

        public IActionResult Reservations()
        {
            return View();
        }

        public IActionResult MaterializeIndex()
        {
            return View();
        }

        public IActionResult ExactIndex()
        {
            return View();
        }
    }
}