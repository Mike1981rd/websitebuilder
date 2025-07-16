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
                        
                        // Get cart color scheme for solid button color
                        if (themeSettings.TryGetProperty("cart", out JsonElement cartSettings) &&
                            cartSettings.TryGetProperty("colorScheme", out JsonElement colorScheme))
                        {
                            var schemeName = colorScheme.GetString() ?? "scheme1";
                            
                            // Get the color scheme values
                            if (themeSettings.TryGetProperty("colorSchemes", out JsonElement colorSchemes) &&
                                colorSchemes.TryGetProperty(schemeName, out JsonElement schemeColors))
                            {
                                if (schemeColors.TryGetProperty("solid-button", out JsonElement solidButton))
                                {
                                    ViewBag.SolidButtonColor = solidButton.GetString() ?? "#e91e63";
                                }
                                if (schemeColors.TryGetProperty("solid-button-text", out JsonElement solidButtonText))
                                {
                                    ViewBag.SolidButtonTextColor = solidButtonText.GetString() ?? "#ffffff";
                                }
                            }
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