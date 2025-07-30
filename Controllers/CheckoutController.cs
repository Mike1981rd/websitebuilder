using Microsoft.AspNetCore.Mvc;
using Hotel.Data;
using Hotel.Models;
using Microsoft.EntityFrameworkCore;
using System.Text.Json;
using Npgsql;

namespace Hotel.Controllers
{
    public class CheckoutController : Controller
    {
        private readonly HotelDbContext _context;

        public CheckoutController(HotelDbContext context)
        {
            _context = context;
        }

        public async Task<IActionResult> Index()
        {
            // Get current website for logo and theme settings
            var website = await _context.WebSites.FirstOrDefaultAsync();
            
            if (website != null)
            {
                // Parse global theme settings
                if (!string.IsNullOrEmpty(website.GlobalThemeSettingsJson))
                {
                    try
                    {
                        var themeSettings = JsonSerializer.Deserialize<JsonElement>(website.GlobalThemeSettingsJson);
                        ViewBag.ThemeSettings = themeSettings;
                        
                        // Debug: Log the entire theme settings structure
                        Console.WriteLine($"[CHECKOUT DEBUG] Full theme settings: {themeSettings}");
                        
                        // Get logo from header settings
                        if (themeSettings.TryGetProperty("header", out JsonElement header) &&
                            header.TryGetProperty("logo", out JsonElement logo) &&
                            logo.TryGetProperty("url", out JsonElement logoUrl))
                        {
                            ViewBag.LogoUrl = logoUrl.GetString();
                        }
                        
                        // Get store name
                        if (themeSettings.TryGetProperty("header", out JsonElement headerSettings) &&
                            headerSettings.TryGetProperty("storeName", out JsonElement storeName))
                        {
                            ViewBag.StoreName = storeName.GetString();
                        }
                        else
                        {
                            ViewBag.StoreName = "Aurora"; // Default store name
                        }
                        
                        // Get cart color scheme - try multiple possible locations
                        string schemeName = "scheme1"; // default
                        bool foundScheme = false;
                        
                        // Try 1: Direct cart settings in global theme
                        if (themeSettings.TryGetProperty("cart", out JsonElement cartSettings) &&
                            cartSettings.TryGetProperty("colorScheme", out JsonElement colorScheme))
                        {
                            schemeName = colorScheme.GetString() ?? "scheme1";
                            foundScheme = true;
                            Console.WriteLine($"[CHECKOUT] Found cart color scheme in global theme: {schemeName}");
                        }
                        
                        // Try 2: Check in pages config
                        if (!foundScheme && website.PagesConfigJson != null)
                        {
                            try
                            {
                                var pagesConfig = JsonSerializer.Deserialize<JsonElement>(website.PagesConfigJson);
                                if (pagesConfig.TryGetProperty("cart", out JsonElement cartPage) &&
                                    cartPage.TryGetProperty("sectionsConfig", out JsonElement sectionsConfig) &&
                                    sectionsConfig.TryGetProperty("cart", out JsonElement cartSection) &&
                                    cartSection.TryGetProperty("colorScheme", out JsonElement pageColorScheme))
                                {
                                    schemeName = pageColorScheme.GetString() ?? "scheme1";
                                    foundScheme = true;
                                    Console.WriteLine($"[CHECKOUT] Found cart color scheme in pages config: {schemeName}");
                                }
                            }
                            catch (Exception ex)
                            {
                                Console.WriteLine($"[CHECKOUT] Error parsing pages config: {ex.Message}");
                            }
                        }
                        
                        // Try 3: Check home page sections config as fallback
                        if (!foundScheme && website.SectionsConfigJson != null)
                        {
                            try
                            {
                                var sectionsConfig = JsonSerializer.Deserialize<JsonElement>(website.SectionsConfigJson);
                                if (sectionsConfig.TryGetProperty("cart", out JsonElement cartSection) &&
                                    cartSection.TryGetProperty("colorScheme", out JsonElement homeColorScheme))
                                {
                                    schemeName = homeColorScheme.GetString() ?? "scheme1";
                                    foundScheme = true;
                                    Console.WriteLine($"[CHECKOUT] Found cart color scheme in sections config: {schemeName}");
                                }
                            }
                            catch (Exception ex)
                            {
                                Console.WriteLine($"[CHECKOUT] Error parsing sections config: {ex.Message}");
                            }
                        }
                        
                        Console.WriteLine($"[CHECKOUT] Using color scheme: {schemeName}");
                        
                        // Get the color scheme values
                        if (themeSettings.TryGetProperty("colorSchemes", out JsonElement colorSchemes) &&
                            colorSchemes.TryGetProperty(schemeName, out JsonElement schemeColors))
                        {
                            // Log the scheme colors structure
                            Console.WriteLine($"[CHECKOUT] Scheme colors found for {schemeName}");
                            
                            // Try different property names
                            if (schemeColors.TryGetProperty("solid-button", out JsonElement solidButton))
                            {
                                ViewBag.SolidButtonColor = solidButton.GetString() ?? "#e91e63";
                                Console.WriteLine($"[CHECKOUT] Found solid-button: {ViewBag.SolidButtonColor}");
                            }
                            else if (schemeColors.TryGetProperty("solidButton", out JsonElement solidButtonAlt))
                            {
                                ViewBag.SolidButtonColor = solidButtonAlt.GetString() ?? "#e91e63";
                                Console.WriteLine($"[CHECKOUT] Found solidButton: {ViewBag.SolidButtonColor}");
                            }
                            
                            if (schemeColors.TryGetProperty("solid-button-text", out JsonElement solidButtonText))
                            {
                                ViewBag.SolidButtonTextColor = solidButtonText.GetString() ?? "#ffffff";
                                Console.WriteLine($"[CHECKOUT] Found solid-button-text: {ViewBag.SolidButtonTextColor}");
                            }
                            else if (schemeColors.TryGetProperty("solidButtonText", out JsonElement solidButtonTextAlt))
                            {
                                ViewBag.SolidButtonTextColor = solidButtonTextAlt.GetString() ?? "#ffffff";
                                Console.WriteLine($"[CHECKOUT] Found solidButtonText: {ViewBag.SolidButtonTextColor}");
                            }
                        }
                        else
                        {
                            Console.WriteLine($"[CHECKOUT] Could not find color scheme: {schemeName} in colorSchemes");
                            
                            // Use default colors based on scheme name
                            switch (schemeName)
                            {
                                case "scheme2":
                                    ViewBag.SolidButtonColor = "#666666";
                                    ViewBag.SolidButtonTextColor = "#FFFFFF";
                                    break;
                                case "scheme3":
                                    ViewBag.SolidButtonColor = "#FFFFFF";
                                    ViewBag.SolidButtonTextColor = "#121212";
                                    break;
                                case "scheme4":
                                    ViewBag.SolidButtonColor = "#AEC6CF";
                                    ViewBag.SolidButtonTextColor = "#121212";
                                    break;
                                case "scheme5":
                                    ViewBag.SolidButtonColor = "#8B4513";
                                    ViewBag.SolidButtonTextColor = "#FFFFFF";
                                    break;
                                default:
                                    ViewBag.SolidButtonColor = "#121212";
                                    ViewBag.SolidButtonTextColor = "#FFFFFF";
                                    break;
                            }
                            Console.WriteLine($"[CHECKOUT] Using default colors for {schemeName}: {ViewBag.SolidButtonColor} / {ViewBag.SolidButtonTextColor}");
                        }
                        
                        // Default colors if not found
                        ViewBag.SolidButtonColor = ViewBag.SolidButtonColor ?? "#e91e63";
                        ViewBag.SolidButtonTextColor = ViewBag.SolidButtonTextColor ?? "#ffffff";
                    }
                    catch
                    {
                        ViewBag.StoreName = "Aurora";
                    }
                }
            }
            
            return View();
        }

        [HttpPost]
        public async Task<IActionResult> ProcessPayment([FromBody] CheckoutFormData formData)
        {
            try 
            {
                // Validate required fields
                if (string.IsNullOrEmpty(formData.Email) || string.IsNullOrEmpty(formData.LastName))
                {
                    return Json(new { success = false, message = "Por favor complete los campos requeridos" });
                }

                if (formData.IsReservation)
                {
                    return await ProcessReservation(formData);
                }
                else
                {
                    // TODO: Process regular product orders in the future
                    return Json(new { success = false, message = "Procesamiento de productos aún no implementado" });
                }
            }
            catch (Exception ex)
            {
                Console.WriteLine($"[CHECKOUT ERROR] {ex.Message}");
                return Json(new { success = false, message = "Ocurrió un error al procesar el pago" });
            }
        }

        private async Task<IActionResult> ProcessReservation(CheckoutFormData formData)
        {
            try
            {
                Console.WriteLine($"[RESERVATION] Processing reservation for email: {formData.Email}");
                
                // 1. Find or create Guest
                var guest = await _context.Guests
                    .FirstOrDefaultAsync(g => g.Email == formData.Email);

                if (guest == null)
                {
                    Console.WriteLine("[RESERVATION] Creating new guest");
                    
                    // Create new Guest
                    guest = new Guest
                    {
                        FirstName = formData.FirstName ?? "",
                        LastName = formData.LastName,
                        Email = formData.Email,
                        Phone = "", // No phone field in checkout yet
                        Address = $"{formData.Address}, {formData.State}", // Concatenate address + state
                        City = formData.City ?? "",
                        Country = formData.Country ?? "",
                        PostalCode = formData.PostalCode ?? "",
                        CustomerId = GenerateCustomerId(),
                        Status = "Active",
                        CreatedAt = DateTime.UtcNow
                    };

                    _context.Guests.Add(guest);
                    await _context.SaveChangesAsync();
                    
                    Console.WriteLine($"[RESERVATION] Guest created with ID: {guest.Id}");
                }
                else
                {
                    // Update existing guest data
                    guest.FirstName = formData.FirstName ?? guest.FirstName;
                    guest.LastName = formData.LastName ?? guest.LastName;
                    guest.Address = $"{formData.Address}, {formData.State}";
                    guest.City = formData.City ?? guest.City;
                    guest.Country = formData.Country ?? guest.Country;
                    guest.PostalCode = formData.PostalCode ?? guest.PostalCode;
                    guest.UpdatedAt = DateTime.UtcNow;

                    await _context.SaveChangesAsync();
                }

                // 2. Verify the product exists
                var product = await _context.Products.FindAsync(formData.ProductId);
                if (product == null)
                {
                    Console.WriteLine($"[RESERVATION] Product not found with ID: {formData.ProductId}");
                    return Json(new { 
                        success = false, 
                        message = "El producto seleccionado no está disponible." 
                    });
                }
                
                Console.WriteLine($"[RESERVATION] Creating reservation for Product: {product.Title}");
                Console.WriteLine($"[RESERVATION] CheckIn: {formData.CheckinDate}, CheckOut: {formData.CheckoutDate}");
                Console.WriteLine($"[RESERVATION] Total Amount: {formData.TotalAmount}");
                
                var reservation = new Reservation
                {
                    GuestId = guest.Id,
                    ProductId = formData.ProductId,
                    CheckInDate = DateTime.Parse(formData.CheckinDate).ToUniversalTime(),
                    CheckOutDate = DateTime.Parse(formData.CheckoutDate).ToUniversalTime(),
                    NumberOfGuests = 2, // Default value for now
                    TotalAmount = formData.TotalAmount,
                    Status = "Confirmada", // Always confirmed after payment
                    CreatedAt = DateTime.UtcNow
                };

                _context.Reservations.Add(reservation);
                await _context.SaveChangesAsync();
                
                Console.WriteLine($"[RESERVATION] Reservation created with ID: {reservation.Id}");

                // 3. Return success response
                return Json(new 
                { 
                    success = true, 
                    message = "Reservación confirmada",
                    reservationId = reservation.Id 
                });
            }
            catch (DbUpdateException dbEx)
            {
                Console.WriteLine($"[RESERVATION DB ERROR] {dbEx.Message}");
                
                if (dbEx.InnerException != null)
                {
                    Console.WriteLine($"[RESERVATION INNER ERROR] {dbEx.InnerException.Message}");
                    
                    if (dbEx.InnerException is Npgsql.PostgresException pgEx)
                    {
                        Console.WriteLine($"[RESERVATION POSTGRES ERROR] Code: {pgEx.SqlState}");
                        Console.WriteLine($"[RESERVATION POSTGRES ERROR] Message: {pgEx.MessageText}");
                        Console.WriteLine($"[RESERVATION POSTGRES ERROR] Detail: {pgEx.Detail}");
                        Console.WriteLine($"[RESERVATION POSTGRES ERROR] Column: {pgEx.ColumnName}");
                        
                        return Json(new { 
                            success = false, 
                            message = $"Error en base de datos: {pgEx.MessageText}" 
                        });
                    }
                }
                
                return Json(new { 
                    success = false, 
                    message = "Error al guardar en la base de datos" 
                });
            }
            catch (Exception ex)
            {
                Console.WriteLine($"[RESERVATION ERROR] {ex.Message}");
                Console.WriteLine($"[RESERVATION ERROR STACKTRACE] {ex.StackTrace}");
                return Json(new { success = false, message = "Error al procesar la reservación" });
            }
        }

        private string GenerateCustomerId()
        {
            var random = new Random();
            return $"#{random.Next(100000, 999999)}";
        }
    }

    // Data model for form submission
    public class CheckoutFormData
    {
        public string Email { get; set; }
        public string FirstName { get; set; }
        public string LastName { get; set; }
        public string Country { get; set; }
        public string Address { get; set; }
        public string Apartment { get; set; }
        public string City { get; set; }
        public string State { get; set; }
        public string PostalCode { get; set; }
        public string CardNumber { get; set; }
        public string CardExpiry { get; set; }
        public string CardCvv { get; set; }
        public string CardName { get; set; }
        public bool Newsletter { get; set; }
        public bool SaveInfo { get; set; }
        public bool BillingSame { get; set; }
        public bool IsReservation { get; set; }
        public string CheckinDate { get; set; }
        public string CheckoutDate { get; set; }
        public int ProductId { get; set; }
        public string ProductName { get; set; }
        public decimal PricePerNight { get; set; }
        public int Nights { get; set; }
        public decimal TotalAmount { get; set; }
    }
}