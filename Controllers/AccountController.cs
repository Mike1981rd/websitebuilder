using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Authentication.Cookies;
using Microsoft.EntityFrameworkCore;
using Hotel.Data;
using Hotel.Models;
using System.Security.Claims;
using System.Security.Cryptography;
using System.Text;

namespace Hotel.Controllers
{
    public class AccountController : Controller
    {
        private readonly HotelDbContext _context;

        public AccountController(HotelDbContext context)
        {
            _context = context;
        }

        // GET: Account/Login
        [HttpGet]
        public IActionResult Login(string? returnUrl = null)
        {
            // Si el usuario ya está autenticado, redirigir a Admin
            if (User.Identity?.IsAuthenticated == true)
            {
                return RedirectToAction("ExactIndex", "Admin");
            }

            ViewData["ReturnUrl"] = returnUrl;
            return View();
        }

        // POST: Account/Login
        [HttpPost]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> Login(LoginViewModel model, string? returnUrl = null)
        {
            ViewData["ReturnUrl"] = returnUrl;

            if (ModelState.IsValid)
            {
                // Buscar usuario por email o username
                var user = await _context.Users
                    .Include(u => u.Role)
                    .FirstOrDefaultAsync(u => 
                        (u.Email == model.UsernameOrEmail || u.UserName == model.UsernameOrEmail) && 
                        u.IsActive);

                if (user != null && VerifyPassword(model.Password, user.PasswordHash))
                {
                    // Crear claims
                    var claims = new List<Claim>
                    {
                        new Claim(ClaimTypes.NameIdentifier, user.Id.ToString()),
                        new Claim(ClaimTypes.Name, user.UserName),
                        new Claim(ClaimTypes.Email, user.Email),
                        new Claim("FullName", user.FullName),
                        new Claim(ClaimTypes.Role, user.Role?.Name ?? "User")
                    };

                    if (!string.IsNullOrEmpty(user.ProfileImagePath))
                    {
                        claims.Add(new Claim("ProfileImagePath", user.ProfileImagePath));
                    }

                    var claimsIdentity = new ClaimsIdentity(claims, CookieAuthenticationDefaults.AuthenticationScheme);
                    var authProperties = new AuthenticationProperties
                    {
                        IsPersistent = model.RememberMe,
                        ExpiresUtc = model.RememberMe ? DateTimeOffset.UtcNow.AddDays(30) : DateTimeOffset.UtcNow.AddHours(12)
                    };

                    await HttpContext.SignInAsync(
                        CookieAuthenticationDefaults.AuthenticationScheme,
                        new ClaimsPrincipal(claimsIdentity),
                        authProperties);

                    // Actualizar último login
                    user.UpdatedAt = DateTime.UtcNow;
                    await _context.SaveChangesAsync();

                    if (!string.IsNullOrEmpty(returnUrl) && Url.IsLocalUrl(returnUrl))
                    {
                        return Redirect(returnUrl);
                    }

                    return RedirectToAction("ExactIndex", "Admin");
                }

                ModelState.AddModelError(string.Empty, "Usuario o contraseña inválidos.");
            }

            return View(model);
        }

        // POST: Account/Logout
        [HttpPost]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> Logout()
        {
            await HttpContext.SignOutAsync(CookieAuthenticationDefaults.AuthenticationScheme);
            return RedirectToAction("Login", "Account");
        }

        // GET: Account/AccessDenied
        public IActionResult AccessDenied()
        {
            return View();
        }

        private bool VerifyPassword(string password, string hashedPassword)
        {
            using (SHA256 sha256Hash = SHA256.Create())
            {
                byte[] bytes = sha256Hash.ComputeHash(Encoding.UTF8.GetBytes(password));
                StringBuilder builder = new StringBuilder();
                for (int i = 0; i < bytes.Length; i++)
                {
                    builder.Append(bytes[i].ToString("x2"));
                }
                return builder.ToString() == hashedPassword;
            }
        }
    }

    public class LoginViewModel
    {
        public string UsernameOrEmail { get; set; } = string.Empty;
        public string Password { get; set; } = string.Empty;
        public bool RememberMe { get; set; }
    }
}