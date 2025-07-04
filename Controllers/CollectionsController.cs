using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using Hotel.Data;
using Hotel.Models;
using System;
using System.Linq;
using System.Threading.Tasks;
using System.Text.RegularExpressions;
using System.Text.Json;

namespace Hotel.Controllers
{
    [Authorize]
    public class CollectionsController : Controller
    {
        private readonly HotelDbContext _context;
        private readonly ILogger<CollectionsController> _logger;

        public CollectionsController(HotelDbContext context, ILogger<CollectionsController> logger)
        {
            _context = context;
            _logger = logger;
        }

        // GET: Collections
        public async Task<IActionResult> Index()
        {
            try
            {
                var collections = await _context.Collections
                    .OrderByDescending(c => c.CreatedAt)
                    .Select(c => new
                    {
                        c.Id,
                        c.Title,
                        c.Handle,
                        c.IsActive,
                        c.ImageUrl,
                        ProductCount = c.CollectionProducts.Count(),
                        c.CreatedAt,
                        c.UpdatedAt
                    })
                    .ToListAsync();

                ViewData["Collections"] = collections;
                return View();
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error al cargar las colecciones");
                TempData["ErrorMessage"] = "Error al cargar las colecciones";
                return View();
            }
        }

        // GET: Collections/Create
        public IActionResult Create()
        {
            ViewBag.SalesChannels = GetAvailableSalesChannels();
            return View();
        }

        // POST: Collections/Create
        [HttpPost]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> Create(Collection collection, string[] selectedChannels)
        {
            try
            {
                // Generar handle automáticamente si no se proporciona
                if (string.IsNullOrWhiteSpace(collection.Handle))
                {
                    collection.Handle = GenerateHandle(collection.Title);
                }

                // Validar que el handle sea único
                if (await _context.Collections.AnyAsync(c => c.Handle == collection.Handle))
                {
                    ModelState.AddModelError("Handle", "Este handle ya está en uso");
                    ViewBag.SalesChannels = GetAvailableSalesChannels();
                    return View(collection);
                }

                // Establecer canales de venta
                if (selectedChannels != null && selectedChannels.Length > 0)
                {
                    collection.SalesChannels = JsonSerializer.Serialize(selectedChannels);
                }

                // Establecer fechas
                collection.CreatedAt = DateTime.UtcNow;
                collection.UpdatedAt = DateTime.UtcNow;

                _context.Add(collection);
                await _context.SaveChangesAsync();

                _logger.LogInformation($"Colección creada: {collection.Title} (ID: {collection.Id})");
                TempData["SuccessMessage"] = "Colección creada exitosamente";
                
                return RedirectToAction(nameof(Edit), new { id = collection.Id });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error al crear la colección");
                TempData["ErrorMessage"] = "Error al crear la colección";
                ViewBag.SalesChannels = GetAvailableSalesChannels();
                return View(collection);
            }
        }

        // GET: Collections/Edit/5
        public async Task<IActionResult> Edit(int? id)
        {
            if (id == null)
            {
                return NotFound();
            }

            var collection = await _context.Collections.FindAsync(id);
            if (collection == null)
            {
                return NotFound();
            }

            ViewBag.SalesChannels = GetAvailableSalesChannels();
            ViewBag.SelectedChannels = JsonSerializer.Deserialize<string[]>(collection.SalesChannels ?? "[]");
            
            return View(collection);
        }

        // POST: Collections/Edit/5
        [HttpPost]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> Edit(int id, Collection collection, string[] selectedChannels)
        {
            if (id != collection.Id)
            {
                return NotFound();
            }

            try
            {
                // Obtener la colección original para preservar algunos campos
                var originalCollection = await _context.Collections
                    .AsNoTracking()
                    .FirstOrDefaultAsync(c => c.Id == id);

                if (originalCollection == null)
                {
                    return NotFound();
                }

                // Validar que el handle sea único (excepto para la colección actual)
                if (await _context.Collections.AnyAsync(c => c.Handle == collection.Handle && c.Id != id))
                {
                    ModelState.AddModelError("Handle", "Este handle ya está en uso");
                    ViewBag.SalesChannels = GetAvailableSalesChannels();
                    ViewBag.SelectedChannels = selectedChannels;
                    return View(collection);
                }

                // Establecer canales de venta
                if (selectedChannels != null && selectedChannels.Length > 0)
                {
                    collection.SalesChannels = JsonSerializer.Serialize(selectedChannels);
                }

                // Preservar fecha de creación y actualizar fecha de modificación
                collection.CreatedAt = originalCollection.CreatedAt;
                collection.UpdatedAt = DateTime.UtcNow;

                _context.Update(collection);
                await _context.SaveChangesAsync();

                _logger.LogInformation($"Colección actualizada: {collection.Title} (ID: {collection.Id})");
                TempData["SuccessMessage"] = "Colección actualizada exitosamente";
                
                return RedirectToAction(nameof(Edit), new { id = collection.Id });
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!CollectionExists(collection.Id))
                {
                    return NotFound();
                }
                else
                {
                    throw;
                }
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error al actualizar la colección");
                TempData["ErrorMessage"] = "Error al actualizar la colección";
                ViewBag.SalesChannels = GetAvailableSalesChannels();
                ViewBag.SelectedChannels = selectedChannels;
                return View(collection);
            }
        }

        // POST: Collections/Delete/5
        [HttpPost]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> Delete(int id)
        {
            try
            {
                var collection = await _context.Collections.FindAsync(id);
                if (collection == null)
                {
                    return NotFound();
                }

                _context.Collections.Remove(collection);
                await _context.SaveChangesAsync();

                _logger.LogInformation($"Colección eliminada: {collection.Title} (ID: {collection.Id})");
                TempData["SuccessMessage"] = "Colección eliminada exitosamente";
                
                return RedirectToAction(nameof(Index));
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error al eliminar la colección");
                TempData["ErrorMessage"] = "Error al eliminar la colección. Es posible que tenga productos asociados.";
                return RedirectToAction(nameof(Index));
            }
        }

        // AJAX: Validar handle único
        [HttpGet]
        public async Task<IActionResult> ValidateHandle(string handle, int? id)
        {
            if (string.IsNullOrWhiteSpace(handle))
            {
                return Json(new { isValid = false, message = "El handle es requerido" });
            }

            // Validar formato del handle
            if (!Regex.IsMatch(handle, @"^[a-z0-9-]+$"))
            {
                return Json(new { isValid = false, message = "El handle solo puede contener letras minúsculas, números y guiones" });
            }

            // Verificar si ya existe
            var exists = await _context.Collections
                .AnyAsync(c => c.Handle == handle && (!id.HasValue || c.Id != id.Value));

            return Json(new { 
                isValid = !exists, 
                message = exists ? "Este handle ya está en uso" : "Handle disponible" 
            });
        }

        // AJAX: Generar handle desde título
        [HttpGet]
        public IActionResult GenerateHandleFromTitle(string title)
        {
            if (string.IsNullOrWhiteSpace(title))
            {
                return Json(new { handle = "" });
            }

            var handle = GenerateHandle(title);
            return Json(new { handle });
        }

        // Métodos auxiliares
        private bool CollectionExists(int id)
        {
            return _context.Collections.Any(e => e.Id == id);
        }

        private string GenerateHandle(string title)
        {
            if (string.IsNullOrWhiteSpace(title))
                return "";

            // Convertir a minúsculas
            var handle = title.ToLowerInvariant();

            // Reemplazar caracteres especiales y espacios con guiones
            handle = Regex.Replace(handle, @"[^a-z0-9\s-]", "");
            handle = Regex.Replace(handle, @"\s+", "-");
            handle = Regex.Replace(handle, @"-+", "-");

            // Eliminar guiones al inicio y final
            handle = handle.Trim('-');

            return handle;
        }

        private string[] GetAvailableSalesChannels()
        {
            return new[]
            {
                "tienda-online",
                "punto-de-venta",
                "facebook",
                "instagram",
                "tiktok",
                "whatsapp-business"
            };
        }
    }
}