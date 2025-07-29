using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Hotel.Data;
using Hotel.Models;
using System.Security.Cryptography;
using System.Text;
using System.Globalization;
using CsvHelper;
using iTextSharp.text;
using iTextSharp.text.pdf;
using ClosedXML.Excel;

namespace Hotel.Controllers
{
    [Authorize]
    public class CustomersController : Controller
    {
        private readonly HotelDbContext _context;
        private readonly ILogger<CustomersController> _logger;

        public CustomersController(HotelDbContext context, ILogger<CustomersController> logger)
        {
            _context = context;
            _logger = logger;
        }

        // GET: Customers
        public async Task<IActionResult> Index()
        {
            var customers = await _context.Guests
                .Where(g => !g.IsDeleted)
                .OrderByDescending(g => g.CreatedAt)
                .ToListAsync();
                
            return View(customers);
        }

        // GET: Customers/Create
        public IActionResult Create()
        {
            return View();
        }

        // POST: Customers/Create
        [HttpPost]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> Create(Guest guest)
        {
            try
            {
                // Logging para debug
                _logger.LogInformation($"FirstName: '{guest.FirstName}'");
                _logger.LogInformation($"Email: '{guest.Email}'");
                _logger.LogInformation($"ProfileImageUrl longitud: {guest.ProfileImageUrl?.Length ?? 0}");
                
                // Remover validaciones de campos opcionales y navegaciones
                ModelState.Remove("Username");
                ModelState.Remove("ProfileImageUrl");
                ModelState.Remove("PasswordHash");
                ModelState.Remove("TwoFactorPhone");
                ModelState.Remove("LastLoginAt");
                ModelState.Remove("LoyaltyTier");
                ModelState.Remove("Phone");
                ModelState.Remove("DocumentType");
                ModelState.Remove("DocumentNumber");
                ModelState.Remove("Address");
                ModelState.Remove("City");
                ModelState.Remove("Country");
                ModelState.Remove("PostalCode");
                ModelState.Remove("DateOfBirth");
                ModelState.Remove("UpdatedAt");
                ModelState.Remove("DeletedAt");
                ModelState.Remove("Reservations");
                ModelState.Remove("Addresses");
                ModelState.Remove("PaymentMethods");
                ModelState.Remove("Devices");
                ModelState.Remove("NotificationPreferences");
                
                // Manejar campos nullable con valores por defecto para CREATE
                if (guest.ProfileImageUrl == null) guest.ProfileImageUrl = "";
                if (guest.Username == null) guest.Username = "";
                if (guest.PasswordHash == null) guest.PasswordHash = "";
                if (guest.LoyaltyTier == null) guest.LoyaltyTier = "";
                
                // Generar CustomerId único
                guest.CustomerId = await GenerateUniqueCustomerId();
                
                // Establecer fechas y valores de auditoría
                guest.CreatedAt = DateTime.UtcNow;
                guest.UpdatedAt = DateTime.UtcNow;
                guest.IsDeleted = false;
                
                // Valores por defecto
                if (string.IsNullOrWhiteSpace(guest.Status))
                {
                    guest.Status = "Active";
                }
                
                // TEMPORAL: Limpiar ModelState para forzar guardado y ver errores reales
                ModelState.Clear();
                
                if (ModelState.IsValid)
                {
                    _context.Add(guest);
                    await _context.SaveChangesAsync();
                    
                    TempData["SuccessMessage"] = "Cliente creado exitosamente";
                    return RedirectToAction(nameof(Index));
                }
                else
                {
                    // Log de errores de validación
                    _logger.LogWarning("ModelState no es válido. Errores:");
                    foreach (var key in ModelState.Keys)
                    {
                        var state = ModelState[key];
                        if (state.Errors.Count > 0)
                        {
                            foreach (var error in state.Errors)
                            {
                                _logger.LogWarning($"Campo: {key}, Error: {error.ErrorMessage}");
                            }
                        }
                    }
                }
            }
            catch (DbUpdateException dbEx)
            {
                if (dbEx.InnerException is Npgsql.PostgresException pgEx)
                {
                    _logger.LogError($"PostgreSQL Error: {pgEx.MessageText}");
                    _logger.LogError($"Detail: {pgEx.Detail}");
                    _logger.LogError($"Column: {pgEx.ColumnName}");
                    _logger.LogError($"ConstraintName: {pgEx.ConstraintName}");
                    _logger.LogError($"SqlState: {pgEx.SqlState}");
                    
                    if (pgEx.SqlState == "23505") // Unique violation
                    {
                        if (pgEx.ConstraintName?.Contains("Email") == true)
                        {
                            ModelState.AddModelError("Email", "Este email ya está registrado");
                        }
                        else if (pgEx.ConstraintName?.Contains("Username") == true)
                        {
                            ModelState.AddModelError("Username", "Este nombre de usuario ya está en uso");
                        }
                    }
                    else if (pgEx.SqlState == "22001") // String data too long
                    {
                        TempData["ErrorMessage"] = $"Error: Uno de los campos excede el tamaño permitido. Columna: {pgEx.ColumnName}";
                    }
                    else
                    {
                        TempData["ErrorMessage"] = $"Error PostgreSQL: {pgEx.MessageText}";
                    }
                }
                else
                {
                    _logger.LogError(dbEx, "Error al crear cliente");
                    TempData["ErrorMessage"] = "Error al crear el cliente";
                }
            }
            
            return View(guest);
        }

        // GET: Customers/Edit/5
        public async Task<IActionResult> Edit(int? id)
        {
            if (id == null)
            {
                return NotFound();
            }

            var guest = await _context.Guests
                .FirstOrDefaultAsync(g => g.Id == id && !g.IsDeleted);
                
            if (guest == null)
            {
                return NotFound();
            }
            
            return View(guest);
        }

        // POST: Customers/Edit/5
        [HttpPost]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> Edit(int id, Guest guest)
        {
            if (id != guest.Id)
            {
                return NotFound();
            }

            try
            {
                // Logging para debug
                _logger.LogInformation($"Editando cliente ID: {id}");
                _logger.LogInformation($"FirstName: '{guest.FirstName}'");
                _logger.LogInformation($"Email: '{guest.Email}'");
                _logger.LogInformation($"ProfileImageUrl longitud: {guest.ProfileImageUrl?.Length ?? 0}");
                
                // Remover validaciones de campos opcionales y navegaciones (CRÍTICO)
                ModelState.Remove("Username");
                ModelState.Remove("ProfileImageUrl");
                ModelState.Remove("PasswordHash");
                ModelState.Remove("TwoFactorPhone");
                ModelState.Remove("LastLoginAt");
                ModelState.Remove("LoyaltyTier");
                ModelState.Remove("Phone");
                ModelState.Remove("DocumentType");
                ModelState.Remove("DocumentNumber");
                ModelState.Remove("Address");
                ModelState.Remove("City");
                ModelState.Remove("Country");
                ModelState.Remove("PostalCode");
                ModelState.Remove("DateOfBirth");
                ModelState.Remove("UpdatedAt");
                ModelState.Remove("DeletedAt");
                ModelState.Remove("CustomerId");
                ModelState.Remove("CreatedAt");
                ModelState.Remove("IsDeleted");
                ModelState.Remove("TotalSpent");
                ModelState.Remove("AccountBalance");
                ModelState.Remove("LoyaltyPoints");
                ModelState.Remove("WishlistCount");
                ModelState.Remove("CouponsCount");
                ModelState.Remove("TwoFactorEnabled");
                
                // CRÍTICO: Remover navegaciones (frecuentemente olvidadas)
                ModelState.Remove("Reservations");
                ModelState.Remove("Addresses");
                ModelState.Remove("PaymentMethods");
                ModelState.Remove("Devices");
                ModelState.Remove("NotificationPreferences");
                
                // TEMPORAL: Limpiar ModelState para forzar guardado y ver errores reales
                ModelState.Clear();
                
                if (ModelState.IsValid)
                {
                    try
                    {
                        var existingGuest = await _context.Guests
                            .AsNoTracking()
                            .FirstOrDefaultAsync(g => g.Id == id);
                            
                        if (existingGuest == null)
                        {
                            return NotFound();
                        }
                        
                        // Preservar campos que no deben cambiar
                        guest.CustomerId = existingGuest.CustomerId;
                        guest.CreatedAt = existingGuest.CreatedAt;
                        guest.PasswordHash = existingGuest.PasswordHash;
                        guest.IsDeleted = existingGuest.IsDeleted;
                        guest.DeletedAt = existingGuest.DeletedAt;
                        guest.UpdatedAt = DateTime.UtcNow;
                        
                        // Preservar imagen si no se envió una nueva
                        if (string.IsNullOrWhiteSpace(guest.ProfileImageUrl))
                        {
                            guest.ProfileImageUrl = existingGuest.ProfileImageUrl;
                        }
                        
                        // Manejar campos nullable con valores por defecto para EDIT
                        if (guest.Username == null) guest.Username = existingGuest.Username ?? "";
                        if (guest.LoyaltyTier == null) guest.LoyaltyTier = existingGuest.LoyaltyTier ?? "";
                        
                        _context.Update(guest);
                        await _context.SaveChangesAsync();
                        
                        TempData["SuccessMessage"] = "Cliente actualizado exitosamente";
                        return RedirectToAction(nameof(Index));
                    }
                    catch (DbUpdateConcurrencyException)
                    {
                        if (!GuestExists(guest.Id))
                        {
                            return NotFound();
                        }
                        else
                        {
                            throw;
                        }
                    }
                }
                else
                {
                    // Log de errores de validación
                    _logger.LogWarning("ModelState no es válido. Errores:");
                    foreach (var key in ModelState.Keys)
                    {
                        var state = ModelState[key];
                        if (state.Errors.Count > 0)
                        {
                            foreach (var error in state.Errors)
                            {
                                _logger.LogWarning($"Campo: {key}, Error: {error.ErrorMessage}");
                            }
                        }
                    }
                }
            }
            catch (DbUpdateException dbEx)
            {
                if (dbEx.InnerException is Npgsql.PostgresException pgEx)
                {
                    _logger.LogError($"PostgreSQL Error: {pgEx.MessageText}");
                    _logger.LogError($"Detail: {pgEx.Detail}");
                    _logger.LogError($"Column: {pgEx.ColumnName}");
                    _logger.LogError($"ConstraintName: {pgEx.ConstraintName}");
                    _logger.LogError($"SqlState: {pgEx.SqlState}");
                    
                    if (pgEx.SqlState == "23505") // Unique violation
                    {
                        if (pgEx.ConstraintName?.Contains("Email") == true)
                        {
                            ModelState.AddModelError("Email", "Este email ya está registrado");
                        }
                        else if (pgEx.ConstraintName?.Contains("Username") == true)
                        {
                            ModelState.AddModelError("Username", "Este nombre de usuario ya está en uso");
                        }
                    }
                    else if (pgEx.SqlState == "22001") // String data too long
                    {
                        TempData["ErrorMessage"] = $"Error: Uno de los campos excede el tamaño permitido. Columna: {pgEx.ColumnName}";
                    }
                    else
                    {
                        TempData["ErrorMessage"] = $"Error PostgreSQL: {pgEx.MessageText}";
                    }
                }
                else
                {
                    _logger.LogError(dbEx, "Error al actualizar cliente");
                    TempData["ErrorMessage"] = "Error al actualizar el cliente";
                }
            }
            
            return View(guest);
        }

        // POST: Customers/Delete/5
        [HttpPost]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> Delete(int id)
        {
            var guest = await _context.Guests.FindAsync(id);
            if (guest == null)
            {
                return NotFound();
            }

            // Soft delete
            guest.IsDeleted = true;
            guest.DeletedAt = DateTime.UtcNow;
            
            await _context.SaveChangesAsync();
            
            TempData["SuccessMessage"] = "Cliente eliminado exitosamente";
            return RedirectToAction(nameof(Index));
        }

        // POST: Customers/ToggleStatus/5
        [HttpPost]
        public async Task<IActionResult> ToggleStatus(int id)
        {
            var guest = await _context.Guests.FindAsync(id);
            if (guest == null)
            {
                return NotFound();
            }

            // Toggle status
            if (guest.Status == "Active")
            {
                guest.Status = "Inactive";
            }
            else
            {
                guest.Status = "Active";
            }
            
            guest.UpdatedAt = DateTime.UtcNow;
            await _context.SaveChangesAsync();

            return Json(new 
            { 
                success = true, 
                message = guest.Status == "Active" ? "Cliente activado exitosamente" : "Cliente desactivado exitosamente",
                newStatus = guest.Status
            });
        }

        // POST: Customers/ChangePassword
        [HttpPost]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> ChangePassword(int guestId, string newPassword, string confirmPassword)
        {
            if (newPassword != confirmPassword)
            {
                TempData["ErrorMessage"] = "Las contraseñas no coinciden";
                return RedirectToAction(nameof(Edit), new { id = guestId, tab = "security" });
            }

            if (string.IsNullOrWhiteSpace(newPassword) || newPassword.Length < 8)
            {
                TempData["ErrorMessage"] = "La contraseña debe tener al menos 8 caracteres";
                return RedirectToAction(nameof(Edit), new { id = guestId, tab = "security" });
            }

            var guest = await _context.Guests.FindAsync(guestId);
            if (guest == null)
            {
                return NotFound();
            }

            // Hash de la contraseña
            guest.PasswordHash = HashPassword(newPassword);
            guest.UpdatedAt = DateTime.UtcNow;
            
            await _context.SaveChangesAsync();
            
            TempData["SuccessMessage"] = "Contraseña actualizada exitosamente";
            return RedirectToAction(nameof(Edit), new { id = guestId, tab = "security" });
        }

        // POST: Customers/AddAddress
        [HttpPost]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> AddAddress(CustomerAddress address)
        {
            if (ModelState.IsValid)
            {
                address.CreatedAt = DateTime.UtcNow;
                
                // Si es la primera dirección, hacerla por defecto
                var hasAddresses = await _context.CustomerAddresses
                    .AnyAsync(a => a.GuestId == address.GuestId);
                    
                if (!hasAddresses)
                {
                    address.IsDefault = true;
                }
                
                _context.CustomerAddresses.Add(address);
                await _context.SaveChangesAsync();
                
                TempData["SuccessMessage"] = "Dirección agregada exitosamente";
            }
            
            return RedirectToAction(nameof(Edit), new { id = address.GuestId, tab = "address" });
        }

        // POST: Customers/UpdateNotifications
        [HttpPost]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> UpdateNotifications(int guestId, Dictionary<string, NotificationSettings> notifications)
        {
            var preferences = await _context.CustomerNotificationPreferences
                .Where(p => p.GuestId == guestId)
                .ToListAsync();

            foreach (var notification in notifications)
            {
                var preference = preferences.FirstOrDefault(p => p.Type == notification.Key);
                
                if (preference == null)
                {
                    preference = new CustomerNotificationPreference
                    {
                        GuestId = guestId,
                        Type = notification.Key,
                        CreatedAt = DateTime.UtcNow
                    };
                    _context.CustomerNotificationPreferences.Add(preference);
                }
                
                preference.EmailEnabled = notification.Value.Email;
                preference.BrowserEnabled = notification.Value.Browser;
                preference.AppEnabled = notification.Value.App;
                preference.UpdatedAt = DateTime.UtcNow;
            }
            
            await _context.SaveChangesAsync();
            
            TempData["SuccessMessage"] = "Preferencias de notificación actualizadas";
            return RedirectToAction(nameof(Edit), new { id = guestId, tab = "notifications" });
        }

        // Métodos auxiliares privados
        private bool GuestExists(int id)
        {
            return _context.Guests.Any(e => e.Id == id);
        }

        private async Task<string> GenerateUniqueCustomerId()
        {
            string customerId;
            bool exists;
            
            do
            {
                // Generar número aleatorio de 6 dígitos
                var random = new Random();
                var number = random.Next(100000, 999999);
                customerId = $"#{number}";
                
                // Verificar si ya existe
                exists = await _context.Guests.AnyAsync(g => g.CustomerId == customerId);
            } while (exists);
            
            return customerId;
        }

        private async Task<decimal> CalculateTotalSpent(int guestId)
        {
            // Calcular desde reservaciones pagadas
            var total = await _context.Reservations
                .Where(r => r.GuestId == guestId && r.Status == "Completed")
                .SumAsync(r => r.TotalAmount);
                
            return total;
        }

        private string HashPassword(string password)
        {
            using (var sha256 = SHA256.Create())
            {
                var hashedBytes = sha256.ComputeHash(Encoding.UTF8.GetBytes(password));
                return Convert.ToBase64String(hashedBytes);
            }
        }

        // GET: Customers/Export
        public async Task<IActionResult> Export(string format)
        {
            var customers = await _context.Guests
                .Where(g => !g.IsDeleted)
                .OrderByDescending(g => g.CreatedAt)
                .ToListAsync();

            switch (format?.ToLower())
            {
                case "excel":
                    return ExportToExcel(customers);
                case "pdf":
                    return ExportToPdf(customers);
                case "csv":
                    return ExportToCsv(customers);
                default:
                    TempData["ErrorMessage"] = "Formato de exportación no válido";
                    return RedirectToAction(nameof(Index));
            }
        }

        private IActionResult ExportToExcel(List<Guest> customers)
        {
            using (var workbook = new XLWorkbook())
            {
                var worksheet = workbook.Worksheets.Add("Clientes");
                
                // Headers
                worksheet.Cell(1, 1).Value = "ID Cliente";
                worksheet.Cell(1, 2).Value = "Nombre";
                worksheet.Cell(1, 3).Value = "Email";
                worksheet.Cell(1, 4).Value = "Teléfono";
                worksheet.Cell(1, 5).Value = "País";
                worksheet.Cell(1, 6).Value = "Estado";
                worksheet.Cell(1, 7).Value = "Total Gastado";
                worksheet.Cell(1, 8).Value = "Fecha Registro";

                // Styling headers
                var headerRange = worksheet.Range(1, 1, 1, 8);
                headerRange.Style.Font.Bold = true;
                headerRange.Style.Fill.BackgroundColor = XLColor.LightGray;
                headerRange.Style.Border.BottomBorder = XLBorderStyleValues.Thin;

                // Data
                int row = 2;
                foreach (var customer in customers)
                {
                    worksheet.Cell(row, 1).Value = customer.CustomerId;
                    worksheet.Cell(row, 2).Value = $"{customer.FirstName} {customer.LastName}";
                    worksheet.Cell(row, 3).Value = customer.Email;
                    worksheet.Cell(row, 4).Value = customer.Phone ?? "-";
                    worksheet.Cell(row, 5).Value = customer.Country ?? "-";
                    worksheet.Cell(row, 6).Value = customer.Status;
                    worksheet.Cell(row, 7).Value = customer.TotalSpent;
                    worksheet.Cell(row, 8).Value = customer.CreatedAt.ToString("dd/MM/yyyy");
                    row++;
                }

                // Auto-fit columns
                worksheet.Columns().AdjustToContents();

                using (var stream = new MemoryStream())
                {
                    workbook.SaveAs(stream);
                    var content = stream.ToArray();
                    return File(content, "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet", 
                        $"Clientes_{DateTime.Now:yyyyMMdd}.xlsx");
                }
            }
        }

        private IActionResult ExportToPdf(List<Guest> customers)
        {
            using (var stream = new MemoryStream())
            {
                var document = new Document(PageSize.A4.Rotate());
                PdfWriter.GetInstance(document, stream);
                document.Open();

                // Title
                var titleFont = FontFactory.GetFont(FontFactory.HELVETICA_BOLD, 18);
                var title = new Paragraph("Lista de Clientes", titleFont);
                title.Alignment = Element.ALIGN_CENTER;
                document.Add(title);
                document.Add(new Paragraph(" ")); // Space

                // Table
                var table = new PdfPTable(8);
                table.WidthPercentage = 100;
                table.SetWidths(new float[] { 10f, 20f, 25f, 15f, 10f, 10f, 10f, 15f });

                // Headers
                var headerFont = FontFactory.GetFont(FontFactory.HELVETICA_BOLD, 10, BaseColor.WHITE);
                var headerBackground = new BaseColor(52, 58, 64);

                string[] headers = { "ID Cliente", "Nombre", "Email", "Teléfono", "País", "Estado", "Total", "Registro" };
                foreach (var header in headers)
                {
                    var cell = new PdfPCell(new Phrase(header, headerFont));
                    cell.BackgroundColor = headerBackground;
                    cell.HorizontalAlignment = Element.ALIGN_CENTER;
                    cell.Padding = 5;
                    table.AddCell(cell);
                }

                // Data
                var dataFont = FontFactory.GetFont(FontFactory.HELVETICA, 9);
                foreach (var customer in customers)
                {
                    table.AddCell(new PdfPCell(new Phrase(customer.CustomerId, dataFont)));
                    table.AddCell(new PdfPCell(new Phrase($"{customer.FirstName} {customer.LastName}", dataFont)));
                    table.AddCell(new PdfPCell(new Phrase(customer.Email, dataFont)));
                    table.AddCell(new PdfPCell(new Phrase(customer.Phone ?? "-", dataFont)));
                    table.AddCell(new PdfPCell(new Phrase(customer.Country ?? "-", dataFont)));
                    table.AddCell(new PdfPCell(new Phrase(customer.Status, dataFont)));
                    table.AddCell(new PdfPCell(new Phrase($"${customer.TotalSpent:N2}", dataFont)));
                    table.AddCell(new PdfPCell(new Phrase(customer.CreatedAt.ToString("dd/MM/yyyy"), dataFont)));
                }

                document.Add(table);
                document.Close();

                return File(stream.ToArray(), "application/pdf", 
                    $"Clientes_{DateTime.Now:yyyyMMdd}.pdf");
            }
        }

        private IActionResult ExportToCsv(List<Guest> customers)
        {
            using (var stream = new MemoryStream())
            using (var writer = new StreamWriter(stream))
            using (var csv = new CsvWriter(writer, CultureInfo.InvariantCulture))
            {
                // Write records
                csv.WriteRecords(customers.Select(c => new
                {
                    IDCliente = c.CustomerId,
                    Nombre = $"{c.FirstName} {c.LastName}",
                    Email = c.Email,
                    Telefono = c.Phone ?? "-",
                    Pais = c.Country ?? "-",
                    Estado = c.Status,
                    TotalGastado = c.TotalSpent,
                    FechaRegistro = c.CreatedAt.ToString("dd/MM/yyyy")
                }));

                writer.Flush();
                return File(stream.ToArray(), "text/csv", 
                    $"Clientes_{DateTime.Now:yyyyMMdd}.csv");
            }
        }

        // Clase auxiliar para notificaciones
        public class NotificationSettings
        {
            public bool Email { get; set; }
            public bool Browser { get; set; }
            public bool App { get; set; }
        }
    }
}