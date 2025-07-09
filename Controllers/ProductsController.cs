using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Hotel.Data;
using Hotel.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.Extensions.Logging;

namespace Hotel.Controllers
{
    [Authorize]
    public class ProductsController : Controller
    {
        private readonly HotelDbContext _context;
        private readonly ILogger<ProductsController> _logger;

        public ProductsController(HotelDbContext context, ILogger<ProductsController> logger)
        {
            _context = context;
            _logger = logger;
        }

        // GET: Products
        public async Task<IActionResult> Index(string status = "all", string search = "", int page = 1)
        {
            try
            {
                var query = _context.Products.AsQueryable();

                // Filtro por estado
                switch (status?.ToLower())
                {
                    case "active":
                        query = query.Where(p => p.Status == "active");
                        break;
                    case "draft":
                        query = query.Where(p => p.Status == "draft");
                        break;
                    case "archived":
                        query = query.Where(p => p.Status == "archived");
                        break;
                }

                // Búsqueda
                if (!string.IsNullOrWhiteSpace(search))
                {
                    query = query.Where(p => 
                        p.Title.Contains(search) || 
                        p.ProductType.Contains(search) || 
                        p.Vendor.Contains(search) ||
                        p.SKU.Contains(search));
                }

                // Cargar datos relacionados
                query = query
                    .Include(p => p.Images)
                    .Include(p => p.Variants)
                    .Include(p => p.CollectionProducts)
                        .ThenInclude(cp => cp.Collection);

                // Paginación
                const int pageSize = 50;
                var totalItems = await query.CountAsync();
                var totalPages = (int)Math.Ceiling(totalItems / (double)pageSize);

                var products = await query
                    .OrderByDescending(p => p.CreatedAt)
                    .Skip((page - 1) * pageSize)
                    .Take(pageSize)
                    .Select(p => new
                    {
                        p.Id,
                        p.Title,
                        p.Status,
                        p.Price,
                        p.Quantity,
                        p.ProductType,
                        p.Vendor,
                        ImageUrl = p.Images.OrderBy(i => i.Position).FirstOrDefault().ImageUrl,
                        VariantCount = p.Variants.Count(),
                        CollectionCount = p.CollectionProducts.Count(),
                        HasInventory = p.TrackQuantity,
                        p.CreatedAt,
                        p.UpdatedAt
                    })
                    .ToListAsync();

                // Métricas para la vista
                ViewData["TotalProducts"] = totalItems;
                ViewData["ActiveProducts"] = await _context.Products.CountAsync(p => p.Status == "active");
                ViewData["DraftProducts"] = await _context.Products.CountAsync(p => p.Status == "draft");
                ViewData["ArchivedProducts"] = await _context.Products.CountAsync(p => p.Status == "archived");
                
                // Datos de inventario
                var totalInventoryValue = await _context.Products
                    .Where(p => p.TrackQuantity)
                    .SumAsync(p => p.Quantity * p.Price);
                ViewData["TotalInventoryValue"] = totalInventoryValue;

                ViewData["Products"] = products;
                ViewData["CurrentPage"] = page;
                ViewData["TotalPages"] = totalPages;
                ViewData["CurrentStatus"] = status;
                ViewData["CurrentSearch"] = search;

                return View();
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error al cargar los productos");
                TempData["ErrorMessage"] = "Error al cargar los productos";
                return View();
            }
        }

        // GET: Products/Create
        public IActionResult Create()
        {
            ViewBag.Collections = _context.Collections
                .Where(c => c.IsActive)
                .OrderBy(c => c.Title)
                .ToList();
                
            return View(new Product());
        }

        // POST: Products/Create
        [HttpPost]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> Create(Product product, List<string> productImages, int[] collectionIds)
        {
            try
            {
                _logger.LogInformation("=== INICIANDO CREATE PRODUCT ===");
                
                // ÚNICA VALIDACIÓN REQUERIDA - Como en Shopify
                // Solo el título es obligatorio para crear un producto
                if (string.IsNullOrWhiteSpace(product.Title))
                {
                    ModelState.AddModelError("Title", "El título es requerido");
                    ViewBag.Collections = _context.Collections.Where(c => c.IsActive).OrderBy(c => c.Title).ToList();
                    return View(product);
                }
                
                // Campos opcionales - asignar "" si son null (campos NOT NULL en DB)
                if (product.Description == null) product.Description = "";
                if (product.ProductType == null) product.ProductType = "";
                if (product.Vendor == null) product.Vendor = "";
                if (product.Tags == null) product.Tags = "";
                if (product.SKU == null) product.SKU = "";
                if (product.Barcode == null) product.Barcode = "";
                if (product.CountryOfOrigin == null) product.CountryOfOrigin = "";
                if (product.HSCode == null) product.HSCode = "";
                if (product.SeoTitle == null) product.SeoTitle = "";
                if (product.SeoDescription == null) product.SeoDescription = "";
                
                // Generar handle si no existe
                if (string.IsNullOrWhiteSpace(product.Handle))
                {
                    product.Handle = GenerateHandle(product.Title);
                }
                
                // Establecer fechas
                product.CreatedAt = DateTime.UtcNow;
                product.UpdatedAt = DateTime.UtcNow;
                
                // Si el estado es 'active', establecer fecha de publicación
                if (product.Status == "active" && !product.PublishedAt.HasValue)
                {
                    product.PublishedAt = DateTime.UtcNow;
                }
                
                // Guardar producto
                _context.Products.Add(product);
                await _context.SaveChangesAsync();
                
                // Procesar imágenes
                if (productImages != null && productImages.Any())
                {
                    await ProcessProductImages(product.Id, productImages);
                }
                
                // Procesar colecciones
                if (collectionIds != null && collectionIds.Any())
                {
                    foreach (var collectionId in collectionIds)
                    {
                        _context.CollectionProducts.Add(new CollectionProduct
                        {
                            ProductId = product.Id,
                            CollectionId = collectionId,
                            Position = 0
                        });
                    }
                    await _context.SaveChangesAsync();
                }
                
                TempData["SuccessMessage"] = "Producto creado exitosamente";
                return RedirectToAction(nameof(Index));
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error al crear el producto");
                TempData["ErrorMessage"] = "Error al crear el producto";
                ViewBag.Collections = _context.Collections.Where(c => c.IsActive).OrderBy(c => c.Title).ToList();
                return View(product);
            }
        }

        private async Task ProcessProductImages(int productId, List<string> images, int startPosition = 0)
        {
            int position = startPosition;
            foreach (var imageData in images)
            {
                var productImage = new ProductImage
                {
                    ProductId = productId,
                    ImageUrl = imageData,
                    Position = position++,
                    AltText = "",
                    CreatedAt = DateTime.UtcNow
                };
                _context.ProductImages.Add(productImage);
            }
            await _context.SaveChangesAsync();
        }

        private string GenerateHandle(string title)
        {
            if (string.IsNullOrWhiteSpace(title))
                return "";
            
            // Convertir a minúsculas
            var handle = title.ToLowerInvariant();
            
            // Reemplazar caracteres especiales y espacios
            handle = System.Text.RegularExpressions.Regex.Replace(handle, @"[^a-z0-9\s-]", "");
            handle = System.Text.RegularExpressions.Regex.Replace(handle, @"\s+", "-");
            handle = System.Text.RegularExpressions.Regex.Replace(handle, @"-+", "-");
            
            // Eliminar guiones al inicio y final
            handle = handle.Trim('-');
            
            // Asegurar unicidad
            var baseHandle = handle;
            var counter = 1;
            while (_context.Products.Any(p => p.Handle == handle))
            {
                handle = $"{baseHandle}-{counter}";
                counter++;
            }
            
            return handle;
        }

        // GET: Products/Edit/5
        public async Task<IActionResult> Edit(int? id)
        {
            if (id == null)
            {
                return NotFound();
            }

            var product = await _context.Products
                .Include(p => p.Images)
                .Include(p => p.Videos)
                .Include(p => p.Variants)
                .Include(p => p.CollectionProducts)
                .FirstOrDefaultAsync(p => p.Id == id);

            if (product == null)
            {
                return NotFound();
            }

            ViewBag.Collections = await _context.Collections
                .Where(c => c.IsActive)
                .OrderBy(c => c.Title)
                .ToListAsync();

            ViewBag.SelectedCollections = product.CollectionProducts
                .Select(cp => cp.CollectionId)
                .ToList();

            return View(product);
        }

        // POST: Products/Edit/5
        [HttpPost]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> Edit(int id, Product product, List<string> productImages, int[] collectionIds, int[] deletedImageIds, string imageOrder)
        {
            if (id != product.Id)
            {
                return NotFound();
            }

            try
            {
                _logger.LogInformation("=== INICIANDO EDIT PRODUCT ===");
                
                // ÚNICA VALIDACIÓN REQUERIDA - Como en Shopify
                if (string.IsNullOrWhiteSpace(product.Title))
                {
                    ModelState.AddModelError("Title", "El título es requerido");
                    ViewBag.Collections = await _context.Collections.Where(c => c.IsActive).OrderBy(c => c.Title).ToListAsync();
                    ViewBag.SelectedCollections = await _context.CollectionProducts
                        .Where(cp => cp.ProductId == id)
                        .Select(cp => cp.CollectionId)
                        .ToListAsync();
                    return View(product);
                }

                // Obtener el producto existente para preservar campos no editables
                var existingProduct = await _context.Products
                    .Include(p => p.Images)
                    .Include(p => p.CollectionProducts)
                    .FirstOrDefaultAsync(p => p.Id == id);

                if (existingProduct == null)
                {
                    return NotFound();
                }

                // Actualizar solo los campos editables
                existingProduct.Title = product.Title;
                // Handle no se debe cambiar después de crear el producto
                // existingProduct.Handle = product.Handle;
                existingProduct.Description = product.Description ?? existingProduct.Description;
                existingProduct.ProductType = product.ProductType ?? existingProduct.ProductType;
                existingProduct.Vendor = product.Vendor ?? existingProduct.Vendor;
                existingProduct.Tags = product.Tags ?? existingProduct.Tags;
                existingProduct.Status = product.Status ?? existingProduct.Status;
                existingProduct.Price = product.Price;
                existingProduct.CompareAtPrice = product.CompareAtPrice;
                existingProduct.CostPerItem = product.CostPerItem;
                existingProduct.TrackQuantity = product.TrackQuantity;
                existingProduct.ContinueSellingWhenOutOfStock = product.ContinueSellingWhenOutOfStock;
                existingProduct.Quantity = product.Quantity;
                existingProduct.SKU = product.SKU ?? existingProduct.SKU;
                existingProduct.Barcode = product.Barcode ?? existingProduct.Barcode;
                existingProduct.Weight = product.Weight;
                existingProduct.WeightUnit = product.WeightUnit ?? existingProduct.WeightUnit;
                existingProduct.RequiresShipping = product.RequiresShipping;
                existingProduct.CountryOfOrigin = product.CountryOfOrigin ?? existingProduct.CountryOfOrigin;
                existingProduct.HSCode = product.HSCode ?? existingProduct.HSCode;
                existingProduct.SeoTitle = product.SeoTitle ?? existingProduct.SeoTitle;
                existingProduct.SeoDescription = product.SeoDescription ?? existingProduct.SeoDescription;
                existingProduct.UpdatedAt = DateTime.UtcNow;

                // Si el estado cambió a 'active' y no tenía fecha de publicación
                if (product.Status == "active" && !existingProduct.PublishedAt.HasValue)
                {
                    existingProduct.PublishedAt = DateTime.UtcNow;
                }

                // Eliminar imágenes marcadas para eliminar
                if (deletedImageIds != null && deletedImageIds.Any())
                {
                    var imagesToDelete = existingProduct.Images
                        .Where(i => deletedImageIds.Contains(i.Id))
                        .ToList();
                    
                    foreach (var image in imagesToDelete)
                    {
                        _context.ProductImages.Remove(image);
                    }
                }

                // Actualizar el orden de las imágenes existentes
                if (!string.IsNullOrEmpty(imageOrder))
                {
                    var imageIds = imageOrder.Split(',').Select(int.Parse).ToList();
                    for (int i = 0; i < imageIds.Count; i++)
                    {
                        var image = existingProduct.Images.FirstOrDefault(img => img.Id == imageIds[i]);
                        if (image != null)
                        {
                            image.Position = i;
                        }
                    }
                }

                // Procesar nuevas imágenes
                if (productImages != null && productImages.Any())
                {
                    // Obtener la posición más alta actual
                    var maxPosition = existingProduct.Images.Any() 
                        ? existingProduct.Images.Max(i => i.Position) 
                        : -1;
                    
                    await ProcessProductImages(product.Id, productImages, maxPosition + 1);
                }

                // Actualizar colecciones
                // Primero eliminar todas las relaciones existentes
                _context.CollectionProducts.RemoveRange(existingProduct.CollectionProducts);

                // Luego agregar las nuevas
                if (collectionIds != null && collectionIds.Any())
                {
                    foreach (var collectionId in collectionIds)
                    {
                        _context.CollectionProducts.Add(new CollectionProduct
                        {
                            ProductId = product.Id,
                            CollectionId = collectionId,
                            Position = 0
                        });
                    }
                }

                await _context.SaveChangesAsync();
                
                TempData["SuccessMessage"] = "Producto actualizado exitosamente";
                return RedirectToAction(nameof(Index));
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error al actualizar el producto");
                TempData["ErrorMessage"] = "Error al actualizar el producto";
                
                ViewBag.Collections = await _context.Collections.Where(c => c.IsActive).OrderBy(c => c.Title).ToListAsync();
                ViewBag.SelectedCollections = await _context.CollectionProducts
                    .Where(cp => cp.ProductId == id)
                    .Select(cp => cp.CollectionId)
                    .ToListAsync();
                    
                return View(product);
            }
        }

        // GET: Products/Delete/5
        public async Task<IActionResult> Delete(int? id)
        {
            if (id == null)
            {
                return NotFound();
            }

            var product = await _context.Products
                .Include(p => p.Images)
                .Include(p => p.Variants)
                .FirstOrDefaultAsync(m => m.Id == id);

            if (product == null)
            {
                return NotFound();
            }

            return View(product);
        }

        // POST: Products/Delete/5
        [HttpPost, ActionName("Delete")]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> DeleteConfirmed(int id)
        {
            try
            {
                var product = await _context.Products.FindAsync(id);
                if (product != null)
                {
                    _context.Products.Remove(product);
                    await _context.SaveChangesAsync();
                    TempData["SuccessMessage"] = "Producto eliminado exitosamente";
                }
                return RedirectToAction(nameof(Index));
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error al eliminar el producto");
                TempData["ErrorMessage"] = "Error al eliminar el producto";
                return RedirectToAction(nameof(Index));
            }
        }

        private bool ProductExists(int id)
        {
            return _context.Products.Any(e => e.Id == id);
        }

        #region API Methods

        // GET: api/products/{id}/variants
        [HttpGet]
        public async Task<IActionResult> GetVariants(int id)
        {
            var variants = await _context.ProductVariants
                .Where(v => v.ProductId == id)
                .OrderBy(v => v.Position)
                .Select(v => new
                {
                    v.Id,
                    v.Title,
                    v.Option1,
                    v.Option2,
                    v.Option3,
                    v.Price,
                    v.CompareAtPrice,
                    v.SKU,
                    v.Barcode,
                    v.Quantity,
                    v.Weight,
                    v.WeightUnit,
                    v.Position
                })
                .ToListAsync();

            return Json(new { success = true, variants });
        }

        // POST: api/products/{id}/variants
        [HttpPost]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> CreateVariant(int id, ProductVariant variant)
        {
            try
            {
                // Verificar que el producto existe
                if (!ProductExists(id))
                {
                    return Json(new { success = false, message = "Producto no encontrado" });
                }

                // Asignar valores por defecto para campos NOT NULL
                variant.ProductId = id;
                variant.Title = variant.Title ?? "";
                variant.SKU = variant.SKU ?? "";
                variant.Barcode = variant.Barcode ?? "";
                variant.WeightUnit = variant.WeightUnit ?? "kg";
                variant.Option1 = variant.Option1 ?? "";
                variant.Option2 = variant.Option2 ?? "";
                variant.Option3 = variant.Option3 ?? "";
                variant.CreatedAt = DateTime.UtcNow;
                variant.UpdatedAt = DateTime.UtcNow;

                // Obtener la posición más alta
                var maxPosition = await _context.ProductVariants
                    .Where(v => v.ProductId == id)
                    .MaxAsync(v => (int?)v.Position) ?? -1;
                variant.Position = maxPosition + 1;

                _context.ProductVariants.Add(variant);
                await _context.SaveChangesAsync();

                return Json(new { success = true, variant, message = "Variante creada exitosamente" });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error al crear variante");
                return Json(new { success = false, message = "Error al crear la variante" });
            }
        }

        // PUT: api/products/{productId}/variants/{variantId}
        [HttpPut]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> UpdateVariant(int productId, int variantId, ProductVariant variant)
        {
            try
            {
                var existingVariant = await _context.ProductVariants
                    .FirstOrDefaultAsync(v => v.Id == variantId && v.ProductId == productId);

                if (existingVariant == null)
                {
                    return Json(new { success = false, message = "Variante no encontrada" });
                }

                // Actualizar campos
                existingVariant.Title = variant.Title ?? existingVariant.Title;
                existingVariant.Option1 = variant.Option1 ?? existingVariant.Option1;
                existingVariant.Option2 = variant.Option2 ?? existingVariant.Option2;
                existingVariant.Option3 = variant.Option3 ?? existingVariant.Option3;
                existingVariant.Price = variant.Price;
                existingVariant.CompareAtPrice = variant.CompareAtPrice;
                existingVariant.SKU = variant.SKU ?? existingVariant.SKU;
                existingVariant.Barcode = variant.Barcode ?? existingVariant.Barcode;
                existingVariant.Quantity = variant.Quantity;
                existingVariant.Weight = variant.Weight;
                existingVariant.WeightUnit = variant.WeightUnit ?? existingVariant.WeightUnit;
                existingVariant.UpdatedAt = DateTime.UtcNow;

                await _context.SaveChangesAsync();

                return Json(new { success = true, message = "Variante actualizada exitosamente" });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error al actualizar variante");
                return Json(new { success = false, message = "Error al actualizar la variante" });
            }
        }

        // DELETE: api/products/{productId}/variants/{variantId}
        [HttpDelete]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> DeleteVariant(int productId, int variantId)
        {
            try
            {
                var variant = await _context.ProductVariants
                    .FirstOrDefaultAsync(v => v.Id == variantId && v.ProductId == productId);

                if (variant == null)
                {
                    return Json(new { success = false, message = "Variante no encontrada" });
                }

                _context.ProductVariants.Remove(variant);
                await _context.SaveChangesAsync();

                return Json(new { success = true, message = "Variante eliminada exitosamente" });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error al eliminar variante");
                return Json(new { success = false, message = "Error al eliminar la variante" });
            }
        }

        // POST: api/products/{id}/reorder-images
        [HttpPost]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> ReorderImages(int id, List<int> imageIds)
        {
            try
            {
                var images = await _context.ProductImages
                    .Where(i => i.ProductId == id && imageIds.Contains(i.Id))
                    .ToListAsync();

                for (int i = 0; i < imageIds.Count; i++)
                {
                    var image = images.FirstOrDefault(img => img.Id == imageIds[i]);
                    if (image != null)
                    {
                        image.Position = i;
                    }
                }

                await _context.SaveChangesAsync();

                return Json(new { success = true, message = "Orden actualizado" });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error al reordenar imágenes");
                return Json(new { success = false, message = "Error al reordenar las imágenes" });
            }
        }

        #endregion

        #region API Methods for Website Builder

        // GET: api/builder/products/search
        [HttpGet]
        [Route("api/builder/products/search")]
        public async Task<IActionResult> SearchProductsForBuilder(string query = "")
        {
            try
            {
                var productsQuery = _context.Products
                    .Where(p => p.Status == "active"); // Solo productos activos

                // Si hay query, filtrar
                if (!string.IsNullOrWhiteSpace(query))
                {
                    productsQuery = productsQuery.Where(p => 
                        p.Title.ToLower().Contains(query.ToLower()) || 
                        p.ProductType.ToLower().Contains(query.ToLower()) ||
                        p.Vendor.ToLower().Contains(query.ToLower()) ||
                        p.SKU.ToLower().Contains(query.ToLower())
                    );
                }

                var products = await productsQuery
                    .Take(20) // Limitar a 20 resultados
                    .Select(p => new
                    {
                        id = p.Id,
                        title = p.Title,
                        productType = p.ProductType,
                        vendor = p.Vendor,
                        price = p.Price,
                        compareAtPrice = p.CompareAtPrice,
                        imageUrl = _context.ProductImages
                            .Where(img => img.ProductId == p.Id)
                            .OrderBy(img => img.Position)
                            .Select(img => img.ImageUrl)
                            .FirstOrDefault()
                    })
                    .ToListAsync();

                return Json(new { success = true, products });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error al buscar productos para builder");
                return Json(new { success = false, message = "Error al buscar productos" });
            }
        }

        // GET: api/builder/products
        [HttpGet]
        [Route("api/builder/products")]
        public async Task<IActionResult> GetProductsForBuilder()
        {
            try
            {
                var products = await _context.Products
                    .Where(p => p.Status == "active") // Solo productos activos
                    .Select(p => new
                    {
                        p.Id,
                        name = p.Title, // Usar Title y mapearlo a name para el frontend
                        p.Description,
                        p.Price,
                        p.CompareAtPrice,
                        p.ProductType,
                        p.Vendor,
                        images = _context.ProductImages
                            .Where(img => img.ProductId == p.Id)
                            .OrderBy(img => img.Position)
                            .Select(img => new
                            {
                                img.Id,
                                url = img.ImageUrl, // Usar ImageUrl y mapearlo a url para el frontend
                                img.AltText,
                                img.Position
                            })
                            .ToList(),
                        variants = _context.ProductVariants
                            .Where(v => v.ProductId == p.Id)
                            .OrderBy(v => v.Position)
                            .Select(v => new
                            {
                                v.Id,
                                v.Title,
                                v.Price,
                                v.CompareAtPrice,
                                v.SKU,
                                v.Option1,
                                v.Option2,
                                v.Option3,
                                v.Quantity
                            })
                            .ToList()
                    })
                    .OrderBy(p => p.name)
                    .ToListAsync();

                return Json(products);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error al obtener productos para Website Builder");
                return Json(new List<object>());
            }
        }

        #endregion
    }
}