using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Hotel.Data;
using Hotel.Models;
using System.Globalization;
using CsvHelper;
using iTextSharp.text;
using iTextSharp.text.pdf;
using ClosedXML.Excel;

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

            // Get billing address if exists
            var billingAddress = await _context.CustomerAddresses
                .FirstOrDefaultAsync(ca => ca.GuestId == reservation.GuestId && ca.Type == "Billing");
            
            ViewBag.BillingAddress = billingAddress;

            return View(reservation);
        }

        // GET: Reservations/Export
        public async Task<IActionResult> Export(string format)
        {
            var reservations = await _context.Reservations
                .Include(r => r.Guest)
                .Include(r => r.Product)
                .OrderByDescending(r => r.CheckInDate)
                .ToListAsync();

            switch (format?.ToLower())
            {
                case "excel":
                    return ExportToExcel(reservations);
                case "pdf":
                    return ExportToPdf(reservations);
                case "csv":
                    return ExportToCsv(reservations);
                default:
                    TempData["ErrorMessage"] = "Formato de exportación no válido";
                    return RedirectToAction(nameof(Index));
            }
        }

        private IActionResult ExportToExcel(List<Reservation> reservations)
        {
            using (var workbook = new XLWorkbook())
            {
                var worksheet = workbook.Worksheets.Add("Reservaciones");
                
                // Headers
                worksheet.Cell(1, 1).Value = "ID Reservación";
                worksheet.Cell(1, 2).Value = "Cliente";
                worksheet.Cell(1, 3).Value = "Email";
                worksheet.Cell(1, 4).Value = "Producto/Habitación";
                worksheet.Cell(1, 5).Value = "Check-in";
                worksheet.Cell(1, 6).Value = "Check-out";
                worksheet.Cell(1, 7).Value = "Noches";
                worksheet.Cell(1, 8).Value = "Total";
                worksheet.Cell(1, 9).Value = "Estado";
                worksheet.Cell(1, 10).Value = "Fecha Creación";
                
                // Styling headers
                var headerRange = worksheet.Range(1, 1, 1, 10);
                headerRange.Style.Font.Bold = true;
                headerRange.Style.Fill.BackgroundColor = XLColor.LightGray;
                headerRange.Style.Border.BottomBorder = XLBorderStyleValues.Thin;
                
                // Data
                int row = 2;
                foreach (var reservation in reservations)
                {
                    var nights = (reservation.CheckOutDate - reservation.CheckInDate).Days;
                    worksheet.Cell(row, 1).Value = reservation.Id;
                    worksheet.Cell(row, 2).Value = $"{reservation.Guest.FirstName} {reservation.Guest.LastName}";
                    worksheet.Cell(row, 3).Value = reservation.Guest.Email;
                    worksheet.Cell(row, 4).Value = reservation.Product.Title;
                    worksheet.Cell(row, 5).Value = reservation.CheckInDate.ToString("dd/MM/yyyy");
                    worksheet.Cell(row, 6).Value = reservation.CheckOutDate.ToString("dd/MM/yyyy");
                    worksheet.Cell(row, 7).Value = nights;
                    worksheet.Cell(row, 8).Value = reservation.TotalAmount;
                    worksheet.Cell(row, 8).Style.NumberFormat.Format = "$#,##0.00";
                    worksheet.Cell(row, 9).Value = reservation.Status;
                    worksheet.Cell(row, 10).Value = reservation.CreatedAt.ToString("dd/MM/yyyy HH:mm");
                    row++;
                }
                
                // Auto-fit columns
                worksheet.Columns().AdjustToContents();
                
                using (var stream = new MemoryStream())
                {
                    workbook.SaveAs(stream);
                    var content = stream.ToArray();
                    return File(content, "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet", 
                        $"Reservaciones_{DateTime.Now:yyyyMMdd}.xlsx");
                }
            }
        }

        private IActionResult ExportToPdf(List<Reservation> reservations)
        {
            using (var stream = new MemoryStream())
            {
                var document = new iTextSharp.text.Document(iTextSharp.text.PageSize.A4.Rotate());
                PdfWriter.GetInstance(document, stream);
                document.Open();
                
                // Title
                var titleFont = FontFactory.GetFont(FontFactory.HELVETICA_BOLD, 18);
                var title = new iTextSharp.text.Paragraph("Lista de Reservaciones", titleFont);
                title.Alignment = iTextSharp.text.Element.ALIGN_CENTER;
                document.Add(title);
                document.Add(new iTextSharp.text.Paragraph(" ")); // Space
                
                // Date
                var dateFont = FontFactory.GetFont(FontFactory.HELVETICA, 10);
                var date = new iTextSharp.text.Paragraph($"Fecha: {DateTime.Now:dd/MM/yyyy HH:mm}", dateFont);
                date.Alignment = iTextSharp.text.Element.ALIGN_RIGHT;
                document.Add(date);
                document.Add(new iTextSharp.text.Paragraph(" ")); // Space
                
                // Table
                var table = new PdfPTable(9); // Número de columnas
                table.WidthPercentage = 100;
                table.SetWidths(new float[] { 8f, 20f, 20f, 12f, 12f, 8f, 10f, 10f, 10f });
                
                // Headers
                var headerFont = FontFactory.GetFont(FontFactory.HELVETICA_BOLD, 10, BaseColor.WHITE);
                var headerBackground = new BaseColor(52, 58, 64);
                
                string[] headers = { "ID", "Cliente", "Habitación", "Check-in", "Check-out", "Noches", "Total", "Estado", "Creado" };
                foreach (var header in headers)
                {
                    var cell = new PdfPCell(new Phrase(header, headerFont));
                    cell.BackgroundColor = headerBackground;
                    cell.HorizontalAlignment = iTextSharp.text.Element.ALIGN_CENTER;
                    cell.Padding = 5;
                    table.AddCell(cell);
                }
                
                // Data
                var dataFont = FontFactory.GetFont(FontFactory.HELVETICA, 9);
                foreach (var reservation in reservations)
                {
                    var nights = (reservation.CheckOutDate - reservation.CheckInDate).Days;
                    table.AddCell(new PdfPCell(new Phrase(reservation.Id.ToString(), dataFont)));
                    table.AddCell(new PdfPCell(new Phrase($"{reservation.Guest.FirstName} {reservation.Guest.LastName}", dataFont)));
                    table.AddCell(new PdfPCell(new Phrase(reservation.Product.Title, dataFont)));
                    table.AddCell(new PdfPCell(new Phrase(reservation.CheckInDate.ToString("dd/MM/yyyy"), dataFont)));
                    table.AddCell(new PdfPCell(new Phrase(reservation.CheckOutDate.ToString("dd/MM/yyyy"), dataFont)));
                    table.AddCell(new PdfPCell(new Phrase(nights.ToString(), dataFont)));
                    table.AddCell(new PdfPCell(new Phrase($"${reservation.TotalAmount:N2}", dataFont)));
                    table.AddCell(new PdfPCell(new Phrase(reservation.Status, dataFont)));
                    table.AddCell(new PdfPCell(new Phrase(reservation.CreatedAt.ToString("dd/MM/yyyy"), dataFont)));
                }
                
                document.Add(table);
                document.Close();
                
                return File(stream.ToArray(), "application/pdf", 
                    $"Reservaciones_{DateTime.Now:yyyyMMdd}.pdf");
            }
        }

        private IActionResult ExportToCsv(List<Reservation> reservations)
        {
            using (var stream = new MemoryStream())
            using (var writer = new StreamWriter(stream))
            using (var csv = new CsvWriter(writer, CultureInfo.InvariantCulture))
            {
                // Write records
                csv.WriteRecords(reservations.Select(r => new
                {
                    IDReservacion = r.Id,
                    Cliente = $"{r.Guest.FirstName} {r.Guest.LastName}",
                    Email = r.Guest.Email,
                    Telefono = r.Guest.Phone ?? "-",
                    Habitacion = r.Product.Title,
                    CheckIn = r.CheckInDate.ToString("dd/MM/yyyy"),
                    CheckOut = r.CheckOutDate.ToString("dd/MM/yyyy"),
                    Noches = (r.CheckOutDate - r.CheckInDate).Days,
                    Total = r.TotalAmount,
                    Estado = r.Status,
                    FechaCreacion = r.CreatedAt.ToString("dd/MM/yyyy HH:mm")
                }));
                
                writer.Flush();
                return File(stream.ToArray(), "text/csv", 
                    $"Reservaciones_{DateTime.Now:yyyyMMdd}.csv");
            }
        }
    }
}