using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Hotel.Data;
using Hotel.Models;

namespace Hotel.Controllers
{
    [Authorize]
    public class PoliciesController : Controller
    {
        private readonly HotelDbContext _context;
        private readonly ILogger<PoliciesController> _logger;

        public PoliciesController(HotelDbContext context, ILogger<PoliciesController> logger)
        {
            _context = context;
            _logger = logger;
        }

        // GET: Policies
        public async Task<IActionResult> Index()
        {
            var company = await _context.Companies.FirstOrDefaultAsync();
            if (company == null)
            {
                TempData["ErrorMessage"] = "No se ha configurado la información de la empresa.";
                return RedirectToAction("Index", "Admin");
            }

            var policy = await _context.Policies
                .FirstOrDefaultAsync(p => p.CompanyId == company.Id);

            if (policy == null)
            {
                // Crear registro de políticas si no existe
                policy = new Policy
                {
                    CompanyId = company.Id,
                    RefundPolicyContent = "",
                    PrivacyPolicyContent = "",
                    TermsOfServiceContent = "",
                    ShippingPolicyContent = "",
                    ContactInformationContent = "",
                    CreatedAt = DateTime.UtcNow,
                    UpdatedAt = DateTime.UtcNow
                };

                _context.Policies.Add(policy);
                await _context.SaveChangesAsync();
            }

            return View(policy);
        }

        // GET: Policies/Edit/refund
        public async Task<IActionResult> Edit(string type)
        {
            if (string.IsNullOrEmpty(type))
            {
                return NotFound();
            }

            // Validar que el tipo de política sea válido
            var validTypes = new[] { "refund", "privacy", "terms", "shipping", "contact" };
            if (!validTypes.Contains(type.ToLower()))
            {
                return NotFound();
            }

            var company = await _context.Companies.FirstOrDefaultAsync();
            if (company == null)
            {
                TempData["ErrorMessage"] = "No se ha configurado la información de la empresa.";
                return RedirectToAction("Index", "Admin");
            }

            var policy = await _context.Policies
                .FirstOrDefaultAsync(p => p.CompanyId == company.Id);

            if (policy == null)
            {
                return RedirectToAction(nameof(Index));
            }

            ViewBag.PolicyType = type;
            ViewBag.PolicyTitle = GetPolicyTitle(type);

            return View(policy);
        }

        // POST: Policies/Edit/refund
        [HttpPost]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> Edit(string type, string content)
        {
            if (string.IsNullOrEmpty(type))
            {
                return NotFound();
            }

            // Validar que el tipo de política sea válido
            var validTypes = new[] { "refund", "privacy", "terms", "shipping", "contact" };
            if (!validTypes.Contains(type.ToLower()))
            {
                return NotFound();
            }

            var company = await _context.Companies.FirstOrDefaultAsync();
            if (company == null)
            {
                TempData["ErrorMessage"] = "No se ha configurado la información de la empresa.";
                return RedirectToAction("Index", "Admin");
            }

            var policy = await _context.Policies
                .FirstOrDefaultAsync(p => p.CompanyId == company.Id);

            if (policy == null)
            {
                return NotFound();
            }

            try
            {
                // Actualizar el contenido según el tipo de política
                switch (type.ToLower())
                {
                    case "refund":
                        policy.RefundPolicyContent = content ?? "";
                        break;
                    case "privacy":
                        policy.PrivacyPolicyContent = content ?? "";
                        break;
                    case "terms":
                        policy.TermsOfServiceContent = content ?? "";
                        break;
                    case "shipping":
                        policy.ShippingPolicyContent = content ?? "";
                        break;
                    case "contact":
                        policy.ContactInformationContent = content ?? "";
                        break;
                }

                policy.UpdatedAt = DateTime.UtcNow;

                _context.Update(policy);
                await _context.SaveChangesAsync();

                TempData["SuccessMessage"] = "Política actualizada exitosamente";
                return RedirectToAction(nameof(Index));
            }
            catch (DbUpdateException ex)
            {
                _logger.LogError(ex, "Error al actualizar la política");
                TempData["ErrorMessage"] = "Error al guardar los cambios";
                
                ViewBag.PolicyType = type;
                ViewBag.PolicyTitle = GetPolicyTitle(type);
                return View(policy);
            }
        }

        private string GetPolicyTitle(string type)
        {
            return type.ToLower() switch
            {
                "refund" => "Política de devoluciones y reembolsos",
                "privacy" => "Política de privacidad",
                "terms" => "Términos del servicio",
                "shipping" => "Política de envío",
                "contact" => "Información de contacto",
                _ => "Política"
            };
        }
    }
}