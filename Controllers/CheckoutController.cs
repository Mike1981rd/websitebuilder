using Microsoft.AspNetCore.Mvc;
using Hotel.Data;
using Hotel.Models;
using Microsoft.EntityFrameworkCore;
using System.Text.Json;

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
    }
}