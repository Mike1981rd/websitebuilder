using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Hotel.Data;
using Hotel.Models;
using System;
using System.Linq;
using System.Threading.Tasks;
using System.Text.RegularExpressions;

namespace Hotel.Controllers
{
    [Authorize]
    public class PagesController : Controller
    {
        private readonly HotelDbContext _context;

        public PagesController(HotelDbContext context)
        {
            _context = context;
        }

        // GET: Pages
        public async Task<IActionResult> Index(string searchTerm, int page = 1)
        {
            var query = _context.Pages
                .Where(p => p.CompanyId == 1) // TODO: Obtener CompanyId del usuario actual
                .AsQueryable();

            if (!string.IsNullOrWhiteSpace(searchTerm))
            {
                query = query.Where(p => p.Title.Contains(searchTerm) || p.Content.Contains(searchTerm));
                ViewData["SearchTerm"] = searchTerm;
            }

            var pageSize = 10;
            var totalItems = await query.CountAsync();
            var totalPages = (int)Math.Ceiling(totalItems / (double)pageSize);

            var pages = await query
                .OrderByDescending(p => p.UpdatedAt)
                .Skip((page - 1) * pageSize)
                .Take(pageSize)
                .ToListAsync();

            ViewData["CurrentPage"] = page;
            ViewData["TotalPages"] = totalPages;

            return View(pages);
        }

        // GET: Pages/Create
        public IActionResult Create()
        {
            return View();
        }

        // POST: Pages/Create
        [HttpPost]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> Create([Bind("Title,Handle,Content,Status,PublishDate,IsVisible,MetaTitle,MetaDescription,DisplayOrder,TemplateName")] Page page)
        {
            try
            {
                // Log para debugging
                var logger = HttpContext.RequestServices.GetService<ILogger<PagesController>>();
                logger?.LogInformation($"Creating page - Title: '{page.Title}', IsVisible: {page.IsVisible}");
                
                // Remover validaciones de campos opcionales
                ModelState.Remove("Handle");
                ModelState.Remove("Content");
                ModelState.Remove("MetaTitle");
                ModelState.Remove("MetaDescription");
                ModelState.Remove("PublishDate");
                ModelState.Remove("TemplateName");
                ModelState.Remove("DisplayOrder");
                ModelState.Remove("Company"); // Remover validación de navegación

                // Validar solo el campo requerido
                if (string.IsNullOrWhiteSpace(page.Title))
                {
                    ModelState.AddModelError("Title", "El título es requerido");
                    TempData["ErrorMessage"] = "Por favor, ingrese un título para la página.";
                    return View(page);
                }

                if (ModelState.IsValid)
                {
                    // Generar handle único basado en el título
                    page.Handle = await GenerateUniqueHandle(page.Title);

                    // NO asignar valores vacíos innecesariamente - el modelo ya tiene valores por defecto

                    // Configurar otros campos
                    page.CompanyId = 1; // TODO: Obtener CompanyId del usuario actual
                    page.CreatedAt = DateTime.UtcNow;
                    page.UpdatedAt = DateTime.UtcNow;
                    page.Status = PageStatus.Draft;
                    page.DisplayOrder = 0;

                    _context.Add(page);
                    await _context.SaveChangesAsync();
                    
                    TempData["SuccessMessage"] = "Página creada correctamente.";
                    return RedirectToAction(nameof(Index));
                }
                else
                {
                    // Log de errores de validación
                    foreach (var modelError in ModelState.Values.SelectMany(v => v.Errors))
                    {
                        logger?.LogError($"Validation error: {modelError.ErrorMessage}");
                    }
                }
            }
            catch (DbUpdateException dbEx)
            {
                if (dbEx.InnerException is Npgsql.PostgresException pgEx)
                {
                    TempData["ErrorMessage"] = $"Error en la base de datos: {pgEx.MessageText}";
                }
                else
                {
                    TempData["ErrorMessage"] = "Error al guardar en la base de datos.";
                }
                return View(page);
            }
            catch (Exception ex)
            {
                TempData["ErrorMessage"] = "Error inesperado al crear la página.";
                return View(page);
            }
            
            TempData["ErrorMessage"] = "Por favor, corrija los errores en el formulario.";
            return View(page);
        }

        // GET: Pages/Edit/5
        public async Task<IActionResult> Edit(int? id)
        {
            if (id == null)
            {
                return NotFound();
            }

            var page = await _context.Pages
                .FirstOrDefaultAsync(p => p.Id == id && p.CompanyId == 1); // TODO: Obtener CompanyId

            if (page == null)
            {
                return NotFound();
            }
            return View(page);
        }

        // POST: Pages/Edit/5
        [HttpPost]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> Edit(int id, [Bind("Id,Title,Handle,Content,Status,PublishDate,IsVisible,MetaTitle,MetaDescription,DisplayOrder,TemplateName,CompanyId,CreatedAt")] Page page)
        {
            if (id != page.Id)
            {
                return NotFound();
            }

            // Remover validaciones de campos opcionales
            ModelState.Remove("Handle");
            ModelState.Remove("Content");
            ModelState.Remove("MetaTitle");
            ModelState.Remove("MetaDescription");
            ModelState.Remove("PublishDate");
            ModelState.Remove("TemplateName");
            ModelState.Remove("DisplayOrder");
            ModelState.Remove("Company"); // Remover validación de navegación

            if (ModelState.IsValid)
            {
                try
                {
                    // Si el handle está vacío, generar uno basado en el título
                    if (string.IsNullOrWhiteSpace(page.Handle))
                    {
                        page.Handle = await GenerateUniqueHandle(page.Title, page.Id);
                    }

                    page.UpdatedAt = DateTime.UtcNow;
                    _context.Update(page);
                    await _context.SaveChangesAsync();
                    
                    TempData["SuccessMessage"] = "Página actualizada correctamente.";
                }
                catch (DbUpdateConcurrencyException)
                {
                    if (!PageExists(page.Id))
                    {
                        return NotFound();
                    }
                    else
                    {
                        throw;
                    }
                }
                return RedirectToAction(nameof(Index));
            }
            return View(page);
        }

        // GET: Pages/Delete/5
        public async Task<IActionResult> Delete(int? id)
        {
            if (id == null)
            {
                return NotFound();
            }

            var page = await _context.Pages
                .FirstOrDefaultAsync(p => p.Id == id && p.CompanyId == 1); // TODO: Obtener CompanyId

            if (page == null)
            {
                return NotFound();
            }

            return View(page);
        }

        // POST: Pages/Delete/5
        [HttpPost, ActionName("Delete")]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> DeleteConfirmed(int id)
        {
            var page = await _context.Pages
                .FirstOrDefaultAsync(p => p.Id == id && p.CompanyId == 1); // TODO: Obtener CompanyId
            
            if (page != null)
            {
                _context.Pages.Remove(page);
                await _context.SaveChangesAsync();
                TempData["SuccessMessage"] = "Página eliminada correctamente.";
            }
            
            return RedirectToAction(nameof(Index));
        }

        private bool PageExists(int id)
        {
            return _context.Pages.Any(e => e.Id == id);
        }

        // GET: api/builder/pages
        [HttpGet]
        [Route("api/builder/pages")]
        [AllowAnonymous] // Permitir acceso anónimo para el Website Builder
        public async Task<IActionResult> GetPagesForBuilder()
        {
            try
            {
                var company = await _context.Companies.FirstOrDefaultAsync();
                if (company == null)
                {
                    return Json(new[] { new { id = 0, name = "Error: No hay empresa configurada", handle = "" } });
                }

                var pages = await _context.Pages
                    .Where(p => p.CompanyId == company.Id && p.IsVisible && p.Status == PageStatus.Published)
                    .OrderBy(p => p.DisplayOrder)
                    .ThenBy(p => p.Title)
                    .Select(p => new
                    {
                        id = p.Id,
                        name = p.Title,
                        handle = p.Handle
                    })
                    .ToListAsync();

                return Json(pages);
            }
            catch (Exception ex)
            {
                var logger = HttpContext.RequestServices.GetService<ILogger<PagesController>>();
                logger?.LogError(ex, "Error al obtener páginas para builder");
                return Json(new[] { new { id = 0, name = "Error al cargar páginas", handle = "" } });
            }
        }

        // GET: api/builder/pages/{handle}
        [HttpGet]
        [Route("api/builder/pages/{handle}")]
        [AllowAnonymous]
        public async Task<IActionResult> GetPageContent(string handle)
        {
            try
            {
                if (string.IsNullOrWhiteSpace(handle))
                {
                    return Json(new { success = false, message = "Handle no válido" });
                }

                var company = await _context.Companies.FirstOrDefaultAsync();
                if (company == null)
                {
                    return Json(new { success = false, message = "No se ha configurado la empresa" });
                }

                var page = await _context.Pages
                    .FirstOrDefaultAsync(p => p.CompanyId == company.Id && p.Handle == handle && p.IsVisible && p.Status == PageStatus.Published);

                if (page == null)
                {
                    return Json(new { success = false, message = "Página no encontrada" });
                }

                return Json(new
                {
                    success = true,
                    handle = page.Handle,
                    title = page.Title,
                    content = page.Content,
                    metaTitle = page.MetaTitle,
                    metaDescription = page.MetaDescription
                });
            }
            catch (Exception ex)
            {
                var logger = HttpContext.RequestServices.GetService<ILogger<PagesController>>();
                logger?.LogError(ex, "Error al obtener contenido de página");
                return Json(new { success = false, message = "Error al cargar la página" });
            }
        }

        // Método auxiliar para generar handle único
        private async Task<string> GenerateUniqueHandle(string title, int? excludeId = null)
        {
            if (string.IsNullOrWhiteSpace(title))
                return "";

            // Convertir a minúsculas y reemplazar caracteres especiales
            var handle = title.ToLower();
            handle = Regex.Replace(handle, @"[^a-z0-9\s-]", "");
            handle = Regex.Replace(handle, @"\s+", "-");
            handle = handle.Trim('-');

            // Verificar si ya existe
            var baseHandle = handle;
            var counter = 1;
            var companyId = 1; // TODO: Obtener CompanyId del usuario actual

            while (await _context.Pages.AnyAsync(p => p.Handle == handle && p.CompanyId == companyId && p.Id != excludeId))
            {
                handle = $"{baseHandle}-{counter}";
                counter++;
            }

            return handle;
        }
    }
}