using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Hotel.Data;
using Hotel.Models;

namespace Hotel.Controllers
{
    [Authorize]
    public class ReservationsController : Controller
    {
        private readonly HotelDbContext _context;
        private const int PageSize = 20;

        public ReservationsController(HotelDbContext context)
        {
            _context = context;
        }

        // GET: Reservations
        public async Task<IActionResult> Index(
            string searchString, 
            string dateFilter,
            DateTime? checkinFrom,
            DateTime? checkinTo,
            DateTime? checkoutFrom,
            DateTime? checkoutTo,
            int? page)
        {
            var query = _context.Reservations
                .Include(r => r.Guest)
                .Include(r => r.Product)
                .AsQueryable();

            // Search filter
            if (!string.IsNullOrEmpty(searchString))
            {
                query = query.Where(r => 
                    r.Guest.FirstName.Contains(searchString) ||
                    r.Guest.LastName.Contains(searchString) ||
                    r.Guest.Email.Contains(searchString) ||
                    r.Product.Title.Contains(searchString));
            }

            // Date filters
            var today = DateTime.Today;
            
            switch (dateFilter)
            {
                case "today":
                    query = query.Where(r => r.CheckInDate.Date == today);
                    break;
                case "week":
                    var weekStart = today.AddDays(-(int)today.DayOfWeek);
                    var weekEnd = weekStart.AddDays(7);
                    query = query.Where(r => r.CheckInDate >= weekStart && r.CheckInDate < weekEnd);
                    break;
                case "month":
                    var monthStart = new DateTime(today.Year, today.Month, 1);
                    var monthEnd = monthStart.AddMonths(1);
                    query = query.Where(r => r.CheckInDate >= monthStart && r.CheckInDate < monthEnd);
                    break;
                case "custom":
                    if (checkinFrom.HasValue)
                        query = query.Where(r => r.CheckInDate >= checkinFrom.Value);
                    if (checkinTo.HasValue)
                        query = query.Where(r => r.CheckInDate <= checkinTo.Value);
                    if (checkoutFrom.HasValue)
                        query = query.Where(r => r.CheckOutDate >= checkoutFrom.Value);
                    if (checkoutTo.HasValue)
                        query = query.Where(r => r.CheckOutDate <= checkoutTo.Value);
                    break;
            }

            // Order by check-in date descending
            query = query.OrderByDescending(r => r.CheckInDate);

            // Pagination
            int pageNumber = page ?? 1;
            int totalItems = await query.CountAsync();
            int totalPages = (int)Math.Ceiling(totalItems / (double)PageSize);

            var reservations = await query
                .Skip((pageNumber - 1) * PageSize)
                .Take(PageSize)
                .ToListAsync();

            // Pass data to view
            ViewBag.CurrentFilter = searchString;
            ViewBag.DateFilter = dateFilter;
            ViewBag.CheckinFrom = checkinFrom?.ToString("yyyy-MM-dd");
            ViewBag.CheckinTo = checkinTo?.ToString("yyyy-MM-dd");
            ViewBag.CheckoutFrom = checkoutFrom?.ToString("yyyy-MM-dd");
            ViewBag.CheckoutTo = checkoutTo?.ToString("yyyy-MM-dd");
            ViewBag.CurrentPage = pageNumber;
            ViewBag.TotalPages = totalPages;
            ViewBag.TotalItems = totalItems;

            return View(reservations);
        }

        // GET: Reservations/Details/5
        public async Task<IActionResult> Details(int? id)
        {
            if (id == null)
            {
                return NotFound();
            }

            var reservation = await _context.Reservations
                .Include(r => r.Guest)
                .Include(r => r.Product)
                .FirstOrDefaultAsync(r => r.Id == id);

            if (reservation == null)
            {
                return NotFound();
            }

            // Calculate nights
            var nights = (reservation.CheckOutDate - reservation.CheckInDate).Days;
            ViewBag.Nights = nights;
            ViewBag.PricePerNight = reservation.TotalAmount / nights;

            return View(reservation);
        }
    }
}