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
using Npgsql;

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

        // GET: Collections/TestCreate - TEMPORAL PARA DEBUG
        public IActionResult TestCreate()
        {
            return View();
        }

        // GET: Collections/CreateSimple - TEMPORAL PARA DEBUG
        public IActionResult CreateSimple()
        {
            ViewBag.SalesChannels = GetAvailableSalesChannels();
            return View();
        }

        // POST: Collections/Create
        [HttpPost]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> Create(Collection collection, string[] selectedChannels)
        {
            _logger.LogInformation("=====================================================");
            _logger.LogInformation("[CREATE POST] MÉTODO CREATE POST ALCANZADO");
            _logger.LogInformation($"[CREATE POST] Title recibido: {collection?.Title}");
            _logger.LogInformation($"[CREATE POST] Request Method: {Request.Method}");
            _logger.LogInformation($"[CREATE POST] Content Type: {Request.ContentType}");
            _logger.LogInformation($"[CREATE POST] Form Keys: {string.Join(", ", Request.Form.Keys)}");
            _logger.LogInformation("=====================================================");
            
            try
            {
                _logger.LogInformation("=== INICIANDO CREATE POST ===");
                _logger.LogInformation($"Title recibido: '{collection.Title}'");
                _logger.LogInformation($"Description recibido: '{collection.Description}'");
                _logger.LogInformation($"Handle recibido: '{collection.Handle}'");
                _logger.LogInformation($"ImageUrl recibido - primeros 100 chars: '{collection.ImageUrl?.Substring(0, Math.Min(collection.ImageUrl?.Length ?? 0, 100))}'");
                _logger.LogInformation($"ImageUrl longitud: {collection.ImageUrl?.Length ?? 0} caracteres");
                _logger.LogInformation($"ModelState.IsValid: {ModelState.IsValid}");
                
                if (!ModelState.IsValid)
                {
                    _logger.LogWarning("ModelState no es válido. Errores:");
                    foreach (var modelError in ModelState.Values.SelectMany(v => v.Errors))
                    {
                        _logger.LogWarning($"Error: {modelError.ErrorMessage}");
                    }
                }

                // Remover validaciones de campos opcionales y asignar valores vacíos si son null
                if (string.IsNullOrWhiteSpace(collection.Description))
                {
                    ModelState.Remove("Description");
                    collection.Description = "";
                }
                if (string.IsNullOrWhiteSpace(collection.Handle))
                {
                    ModelState.Remove("Handle");
                    collection.Handle = "";
                }
                if (string.IsNullOrWhiteSpace(collection.ImageUrl))
                {
                    ModelState.Remove("ImageUrl");
                    collection.ImageUrl = "";  // DEBE asignar vacío porque el campo es NOT NULL
                }
                if (string.IsNullOrWhiteSpace(collection.SeoTitle))
                {
                    ModelState.Remove("SeoTitle");
                    collection.SeoTitle = "";
                }
                if (string.IsNullOrWhiteSpace(collection.SeoDescription))
                {
                    ModelState.Remove("SeoDescription");
                    collection.SeoDescription = "";
                }

                // Validar solo el título manualmente
                if (string.IsNullOrWhiteSpace(collection.Title))
                {
                    ModelState.AddModelError("Title", "El título es requerido");
                    ViewBag.SalesChannels = GetAvailableSalesChannels();
                    _logger.LogWarning("Título vacío, retornando a la vista");
                    return View(collection);
                }

                // Si llegamos aquí, el título existe
                _logger.LogInformation($"Título válido: '{collection.Title}'");

                // Generar handle si no existe
                if (string.IsNullOrWhiteSpace(collection.Handle))
                {
                    collection.Handle = GenerateHandle(collection.Title);
                    _logger.LogInformation($"Handle generado: '{collection.Handle}'");
                }

                // Establecer valores por defecto
                collection.CreatedAt = DateTime.UtcNow;
                collection.UpdatedAt = DateTime.UtcNow;
                collection.SalesChannels = selectedChannels?.Length > 0 
                    ? JsonSerializer.Serialize(selectedChannels) 
                    : "[\"tienda-online\"]";
                
                // Asegurar que SortOrder tenga un valor
                if (string.IsNullOrWhiteSpace(collection.SortOrder))
                {
                    collection.SortOrder = "manual";
                }
                
                _logger.LogInformation($"SalesChannels: {collection.SalesChannels}");
                _logger.LogInformation($"IsActive: {collection.IsActive}");
                
                // Log todos los valores antes de guardar
                _logger.LogInformation("=== VALORES FINALES ANTES DE GUARDAR ===");
                _logger.LogInformation($"Title: '{collection.Title}'");
                _logger.LogInformation($"Description: '{collection.Description}'");
                _logger.LogInformation($"Handle: '{collection.Handle}'");
                _logger.LogInformation($"ImageUrl: '{collection.ImageUrl}'");
                _logger.LogInformation($"SeoTitle: '{collection.SeoTitle}'");
                _logger.LogInformation($"SeoDescription: '{collection.SeoDescription}'");
                _logger.LogInformation($"SortOrder: '{collection.SortOrder}'");
                _logger.LogInformation($"SalesChannels: '{collection.SalesChannels}'");
                _logger.LogInformation($"IsActive: {collection.IsActive}");
                _logger.LogInformation($"CreatedAt: {collection.CreatedAt:yyyy-MM-dd HH:mm:ss}");
                _logger.LogInformation($"UpdatedAt: {collection.UpdatedAt:yyyy-MM-dd HH:mm:ss}");

                // Guardar
                _context.Collections.Add(collection);
                _logger.LogInformation("Entidad agregada al contexto, intentando SaveChangesAsync...");
                
                var result = await _context.SaveChangesAsync();
                
                _logger.LogInformation($"SaveChangesAsync resultado: {result} registros guardados");
                _logger.LogInformation($"Colección creada con ID: {collection.Id}");

                TempData["SuccessMessage"] = "Colección creada exitosamente";
                return RedirectToAction(nameof(Index));
            }
            catch (DbUpdateException dbEx)
            {
                _logger.LogError(dbEx, "Error de base de datos al crear la colección");
                _logger.LogError($"Inner Exception: {dbEx.InnerException?.Message}");
                _logger.LogError($"StackTrace: {dbEx.StackTrace}");
                
                var errorMessage = "Error al guardar en la base de datos: ";
                if (dbEx.InnerException != null)
                {
                    errorMessage += dbEx.InnerException.Message;
                    
                    // Si es un error de PostgreSQL, mostrar más detalles
                    if (dbEx.InnerException is Npgsql.PostgresException pgEx)
                    {
                        _logger.LogError($"PostgreSQL Error Code: {pgEx.SqlState}");
                        _logger.LogError($"PostgreSQL Detail: {pgEx.Detail}");
                        _logger.LogError($"PostgreSQL Column: {pgEx.ColumnName}");
                        errorMessage = $"Error PostgreSQL: {pgEx.MessageText}";
                        if (!string.IsNullOrEmpty(pgEx.Detail))
                        {
                            errorMessage += $" - Detalle: {pgEx.Detail}";
                        }
                        if (!string.IsNullOrEmpty(pgEx.ColumnName))
                        {
                            errorMessage += $" - Columna: {pgEx.ColumnName}";
                        }
                    }
                }
                else
                {
                    errorMessage += dbEx.Message;
                }
                
                TempData["ErrorMessage"] = errorMessage;
                ViewBag.SalesChannels = GetAvailableSalesChannels();
                return View(collection);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error general al crear la colección");
                _logger.LogError($"Tipo de excepción: {ex.GetType().FullName}");
                _logger.LogError($"Mensaje: {ex.Message}");
                _logger.LogError($"StackTrace: {ex.StackTrace}");
                
                TempData["ErrorMessage"] = $"Error inesperado: {ex.Message}";
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

            var collection = await _context.Collections
                .Include(c => c.CollectionProducts)
                    .ThenInclude(cp => cp.Product)
                        .ThenInclude(p => p.Images)
                .FirstOrDefaultAsync(c => c.Id == id);
                
            if (collection == null)
            {
                return NotFound();
            }

            // Obtener productos ordenados por Position
            var productsInCollection = collection.CollectionProducts
                .OrderBy(cp => cp.Position)
                .Select(cp => new
                {
                    cp.Product.Id,
                    cp.Product.Title,
                    cp.Product.Handle,
                    cp.Product.Status,
                    ImageUrl = cp.Product.Images.FirstOrDefault()?.ImageUrl ?? "",
                    DisplayOrder = cp.Position
                })
                .ToList();

            ViewBag.SalesChannels = GetAvailableSalesChannels();
            ViewBag.SelectedChannels = JsonSerializer.Deserialize<string[]>(collection.SalesChannels ?? "[]");
            ViewBag.ProductsInCollection = productsInCollection;
            
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
                _logger.LogInformation("=== INICIANDO EDIT POST ===");
                _logger.LogInformation($"ID: {id}, Title: '{collection.Title}'");
                _logger.LogInformation($"ModelState.IsValid: {ModelState.IsValid}");
                
                // Validar título primero
                if (string.IsNullOrWhiteSpace(collection.Title))
                {
                    ModelState.AddModelError("Title", "El título es requerido");
                    ViewBag.SalesChannels = GetAvailableSalesChannels();
                    ViewBag.SelectedChannels = selectedChannels;
                    return View(collection);
                }
                
                // Remover validaciones de campos opcionales y asignar valores por defecto solo si son null
                if (string.IsNullOrWhiteSpace(collection.Description))
                {
                    ModelState.Remove("Description");
                    if (collection.Description == null) collection.Description = "";
                }
                if (string.IsNullOrWhiteSpace(collection.Handle))
                {
                    ModelState.Remove("Handle");
                    // Si el handle está vacío, generar uno
                    collection.Handle = GenerateHandle(collection.Title);
                }
                if (string.IsNullOrWhiteSpace(collection.ImageUrl))
                {
                    ModelState.Remove("ImageUrl");
                    if (collection.ImageUrl == null) collection.ImageUrl = "";
                }
                if (string.IsNullOrWhiteSpace(collection.SeoTitle))
                {
                    ModelState.Remove("SeoTitle");
                    if (collection.SeoTitle == null) collection.SeoTitle = "";
                }
                if (string.IsNullOrWhiteSpace(collection.SeoDescription))
                {
                    ModelState.Remove("SeoDescription");
                    if (collection.SeoDescription == null) collection.SeoDescription = "";
                }

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
                else
                {
                    collection.SalesChannels = "[\"tienda-online\"]";
                }

                // Asegurar que SortOrder tenga un valor
                if (string.IsNullOrWhiteSpace(collection.SortOrder))
                {
                    collection.SortOrder = originalCollection.SortOrder ?? "manual";
                }

                // Preservar fecha de creación y actualizar fecha de modificación
                collection.CreatedAt = originalCollection.CreatedAt;
                collection.UpdatedAt = DateTime.UtcNow;

                // Log antes de actualizar
                _logger.LogInformation("=== VALORES FINALES ANTES DE UPDATE ===");
                _logger.LogInformation($"Id: {collection.Id}");
                _logger.LogInformation($"Title: '{collection.Title}'");
                _logger.LogInformation($"Handle: '{collection.Handle}'");
                _logger.LogInformation($"IsActive: {collection.IsActive}");
                _logger.LogInformation($"SalesChannels: '{collection.SalesChannels}'");
                _logger.LogInformation($"SortOrder: '{collection.SortOrder}'");
                _logger.LogInformation($"CreatedAt: {collection.CreatedAt:yyyy-MM-dd HH:mm:ss}");
                _logger.LogInformation($"UpdatedAt: {collection.UpdatedAt:yyyy-MM-dd HH:mm:ss}");

                _context.Update(collection);
                var saveResult = await _context.SaveChangesAsync();
                
                _logger.LogInformation($"SaveChangesAsync resultado: {saveResult} registros actualizados");
                _logger.LogInformation($"Colección actualizada: {collection.Title} (ID: {collection.Id})");
                TempData["SuccessMessage"] = "Colección actualizada exitosamente";
                
                _logger.LogInformation("Redirigiendo a Index...");
                return RedirectToAction(nameof(Index));
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

        // AJAX: Subir imagen (placeholder para implementación futura)
        [HttpPost]
        public async Task<IActionResult> UploadImage()
        {
            try
            {
                // TODO: Implementar lógica de subida de imagen
                // 1. Validar el archivo
                // 2. Guardar en el servidor o servicio de almacenamiento
                // 3. Devolver la URL
                
                return Json(new { 
                    success = false, 
                    message = "La funcionalidad de carga de imágenes estará disponible próximamente." 
                });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error al subir imagen");
                return Json(new { 
                    success = false, 
                    message = "Error al procesar la imagen." 
                });
            }
        }

        // AJAX: Actualizar orden de productos en la colección
        [HttpPost]
        public async Task<IActionResult> UpdateProductOrder(int collectionId, string productIds)
        {
            try
            {
                _logger.LogInformation($"Actualizando orden de productos para colección {collectionId}");
                
                // Parse the comma-separated string to array
                var productIdArray = productIds.Split(',').Select(int.Parse).ToArray();
                
                var collection = await _context.Collections
                    .Include(c => c.CollectionProducts)
                    .FirstOrDefaultAsync(c => c.Id == collectionId);
                    
                if (collection == null)
                {
                    return Json(new { success = false, message = "Colección no encontrada" });
                }

                // Actualizar el Position de cada producto
                for (int i = 0; i < productIdArray.Length; i++)
                {
                    var productCollection = collection.CollectionProducts
                        .FirstOrDefault(cp => cp.ProductId == productIdArray[i]);
                        
                    if (productCollection != null)
                    {
                        productCollection.Position = i;
                    }
                }

                await _context.SaveChangesAsync();
                
                _logger.LogInformation($"Orden actualizado exitosamente para {productIdArray.Length} productos");
                return Json(new { success = true, message = "Orden actualizado exitosamente" });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error al actualizar el orden de productos");
                return Json(new { success = false, message = "Error al actualizar el orden" });
            }
        }

        // AJAX: Remover producto de la colección
        [HttpPost]
        public async Task<IActionResult> RemoveProductFromCollection(int collectionId, int productId)
        {
            try
            {
                _logger.LogInformation($"Removiendo producto {productId} de colección {collectionId}");
                
                var productCollection = await _context.CollectionProducts
                    .FirstOrDefaultAsync(pc => pc.CollectionId == collectionId && pc.ProductId == productId);
                    
                if (productCollection == null)
                {
                    return Json(new { success = false, message = "Producto no encontrado en la colección" });
                }

                _context.CollectionProducts.Remove(productCollection);
                await _context.SaveChangesAsync();
                
                _logger.LogInformation($"Producto {productId} removido exitosamente de colección {collectionId}");
                return Json(new { success = true, message = "Producto removido exitosamente" });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error al remover producto de la colección");
                return Json(new { success = false, message = "Error al remover el producto" });
            }
        }

        #region API Methods for Website Builder

        // GET: api/builder/collections/search
        [HttpGet]
        [Route("api/builder/collections/search")]
        [AllowAnonymous]
        public async Task<IActionResult> SearchCollectionsForBuilder(string query = "")
        {
            try
            {
                var collectionsQuery = _context.Collections
                    .Where(c => c.IsActive); // Solo colecciones activas

                // Si hay query, filtrar
                if (!string.IsNullOrWhiteSpace(query))
                {
                    collectionsQuery = collectionsQuery.Where(c => 
                        c.Title.ToLower().Contains(query.ToLower()) || 
                        c.Handle.ToLower().Contains(query.ToLower())
                    );
                }

                var collections = await collectionsQuery
                    .Take(20) // Limitar a 20 resultados
                    .Select(c => new
                    {
                        c.Id,
                        c.Title,
                        c.Handle,
                        c.ImageUrl,
                        ProductCount = c.CollectionProducts.Count()
                    })
                    .ToListAsync();

                return Json(new { success = true, collections });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error al buscar colecciones para builder");
                return Json(new { success = false, message = "Error al buscar colecciones" });
            }
        }

        #endregion

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