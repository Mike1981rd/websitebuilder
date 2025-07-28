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

        // GET: api/builder/policies
        [HttpGet]
        [Route("api/builder/policies")]
        [AllowAnonymous] // Permitir acceso anónimo para el Website Builder
        public async Task<IActionResult> GetPoliciesForBuilder()
        {
            try
            {
                var company = await _context.Companies.FirstOrDefaultAsync();
                if (company == null)
                {
                    return Json(new[] { new { id = 0, name = "Error: No hay empresa configurada", handle = "" } });
                }

                var policy = await _context.Policies
                    .FirstOrDefaultAsync(p => p.CompanyId == company.Id);

                var policies = new List<object>();

                if (policy != null)
                {
                    // Agregar cada política con su handle y nombre
                    if (!string.IsNullOrWhiteSpace(policy.RefundPolicyContent))
                    {
                        policies.Add(new
                        {
                            id = "refund",
                            name = "Política de devoluciones",
                            handle = "refund"
                        });
                    }

                    if (!string.IsNullOrWhiteSpace(policy.PrivacyPolicyContent))
                    {
                        policies.Add(new
                        {
                            id = "privacy",
                            name = "Política de privacidad",
                            handle = "privacy"
                        });
                    }

                    if (!string.IsNullOrWhiteSpace(policy.TermsOfServiceContent))
                    {
                        policies.Add(new
                        {
                            id = "terms",
                            name = "Términos del servicio",
                            handle = "terms"
                        });
                    }

                    if (!string.IsNullOrWhiteSpace(policy.ShippingPolicyContent))
                    {
                        policies.Add(new
                        {
                            id = "shipping",
                            name = "Política de envío",
                            handle = "shipping"
                        });
                    }

                    if (!string.IsNullOrWhiteSpace(policy.ContactInformationContent))
                    {
                        policies.Add(new
                        {
                            id = "contact",
                            name = "Información de contacto",
                            handle = "contact"
                        });
                    }
                }

                return Json(policies);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error al obtener políticas para builder");
                return Json(new[] { new { id = 0, name = "Error al cargar políticas", handle = "" } });
            }
        }

        // GET: api/builder/policies/{type}
        [HttpGet]
        [Route("api/builder/policies/{type}")]
        [AllowAnonymous]
        public async Task<IActionResult> GetPolicyContent(string type)
        {
            try
            {
                // Validar que el tipo de política sea válido
                var validTypes = new[] { "refund", "privacy", "terms", "shipping", "contact" };
                if (!validTypes.Contains(type.ToLower()))
                {
                    return Json(new { success = false, message = "Tipo de política no válido" });
                }

                var company = await _context.Companies.FirstOrDefaultAsync();
                if (company == null)
                {
                    return Json(new { success = false, message = "No se ha configurado la empresa" });
                }

                var policy = await _context.Policies
                    .FirstOrDefaultAsync(p => p.CompanyId == company.Id);

                if (policy == null)
                {
                    return Json(new { success = false, message = "No se encontraron políticas" });
                }

                string content = type.ToLower() switch
                {
                    "refund" => policy.RefundPolicyContent,
                    "privacy" => policy.PrivacyPolicyContent,
                    "terms" => policy.TermsOfServiceContent,
                    "shipping" => policy.ShippingPolicyContent,
                    "contact" => policy.ContactInformationContent,
                    _ => ""
                };

                return Json(new
                {
                    success = true,
                    type = type,
                    title = GetPolicyTitle(type),
                    content = content
                });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error al obtener contenido de política");
                return Json(new { success = false, message = "Error al cargar la política" });
            }
        }
    }
}