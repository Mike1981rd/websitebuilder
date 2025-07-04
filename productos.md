# 📦 Módulo de Productos - Guía de Implementación

Este documento detalla la implementación completa del módulo de Productos basado en la funcionalidad de Shopify, adaptado a los patrones y soluciones del proyecto Hotel.

## Estado de Implementación

### ✅ Completado
- **Modelos**: Product, ProductImage, ProductVideo, ProductVariant
- **Base de datos**: Migraciones ejecutadas
- **CRUD básico**: Create, Read, Update, Delete funcionando
- **Vista Index**: Con métricas, filtros, búsqueda y paginación
- **Vista Create/Edit**: Con manejo de imágenes drag & drop y colecciones
- **Vista Delete**: Con confirmación y manejo de cascada
- **API endpoints**: Para variantes e imágenes
- **Traducciones**: Español/Inglés completas
- **Validación**: Solo título requerido (como Shopify)
- **Manejo de imágenes**: Drag & drop, reordenamiento, base64
- **Integración con colecciones**: Many-to-many funcionando

### 🚧 Pendiente
- Sistema completo de variantes con UI avanzada
- Manejo de videos (YouTube, Vimeo, MP4)
- Importación/Exportación CSV
- Edición masiva
- Gestión avanzada de inventario por ubicación
- Metadatos SEO completos
- Publicación en múltiples canales

### 🔧 En Progreso - PENDIENTE DE RESOLVER (04/01/2025)
- **Drag & Drop de imágenes**: 
  - ✅ UI visual implementada (hover effects, drag handles, estados)
  - ✅ Event listeners configurados
  - ❌ **PROBLEMA**: Las imágenes se mueven visualmente pero NO se reordenan en el array
  - **Intentos realizados**:
    - Cambiar productImages a variable global (window.productImages)
    - Actualizar todas las referencias
    - Simplificar lógica de reordenamiento con spread operator
    - Agregar debugging con console.log
  - **Próximos pasos sugeridos**:
    1. Verificar si los event listeners se están adjuntando correctamente
    2. Revisar si hay conflictos con el re-renderizado
    3. Considerar usar una librería como SortableJS
    4. Debuggear paso a paso el flujo del drag & drop

## 📸 Referencias Visuales

### Vista Index de Productos
![Vista Index de Productos](C:\Users\hp\Documents\Visual Studio 2022\Projects\Hotel23\TestImages\Productindex.png)

**Características clave de la vista Index:**
- Métricas en la parte superior (Tasa de venta, Inventario restante, Análisis ABC)
- Tabs de navegación (Todos, Activos, Borradores, Archivados)
- Tabla con checkbox de selección múltiple
- Columnas: Producto (con imagen), Estado, Inventario, Categoría, Canales
- Botones de acción: Exportar, Importar, Más acciones, Agregar producto
- Filtros y búsqueda integrados

### Vista Create/Edit de Producto
![Vista Create/Edit de Producto](C:\Users\hp\Documents\Visual Studio 2022\Projects\Hotel23\TestImages\crearproducto.png)

**Características clave de la vista Create/Edit:**
- Diseño en dos columnas (principal y sidebar)
- Editor de texto enriquecido para descripción
- Área de multimedia para imágenes y videos
- Sección de precios con precio regular y precio comparado
- Control de inventario con múltiples ubicaciones
- Sistema de variantes
- Metadatos y SEO
- Publicación en canales de venta
- Organización (Tipo, Proveedor, Colecciones, Etiquetas)

### Vista de Detalle de Variante
![Vista de Variante](C:\Users\hp\Documents\Visual Studio 2022\Projects\Hotel23\TestImages\carddevariante.png)

**Características clave de la vista de Variante:**
- Información del producto padre con imagen
- Lista de todas las variantes del producto (con checkbox para selección múltiple)
- Opciones específicas de la variante (Color, Size)
- Precios individuales para cada variante (Precio, Precio de comparación)
- Control de inventario por variante:
  - Múltiples ubicaciones de almacén
  - SKU específico por variante
  - Código de barras
  - Seguimiento de cantidad
- Control de envío (peso por variante)
- Metadatos específicos (Google Shopping fields)
- Estado de disponibilidad en canales de venta

## 📑 Tabla de Contenidos

1. [Referencias Visuales](#referencias-visuales)
2. [Estructura de Base de Datos](#estructura-de-base-de-datos)
3. [Modelo Product](#modelo-product)
4. [Implementación del Controller](#implementación-del-controller)
5. [Vista Index](#vista-index)
6. [Vista Create](#vista-create)
7. [Vista Edit](#vista-edit)
8. [Sistema de Variantes](#sistema-de-variantes)
9. [Manejo de Imágenes Múltiples](#manejo-de-imágenes-múltiples)
10. [Manejo de Videos](#manejo-de-videos)
11. [SEO y URLs](#seo-y-urls)
12. [Inventario y Stock](#inventario-y-stock)
13. [Integración con Collections](#integración-con-collections)
14. [Sistema de Permisos](#sistema-de-permisos)
15. [Sistema de Traducciones](#sistema-de-traducciones)
16. [Integración con el Menú](#integración-con-el-menú)
17. [Importación Masiva CSV](#importación-masiva-csv)
18. [Sistema de Colores y Estilos](#sistema-de-colores-y-estilos)

---

## Estructura de Base de Datos

### Tabla Products
```sql
CREATE TABLE "Products" (
    "Id" SERIAL PRIMARY KEY,
    "Title" VARCHAR(255) NOT NULL,
    "Description" TEXT DEFAULT '',
    "Handle" VARCHAR(255) NOT NULL UNIQUE,
    "ProductType" VARCHAR(100) DEFAULT '',
    "Vendor" VARCHAR(100) DEFAULT '',
    "Tags" TEXT DEFAULT '',
    "Status" VARCHAR(20) DEFAULT 'draft',
    "PublishedAt" TIMESTAMP WITH TIME ZONE,
    
    -- Pricing
    "Price" DECIMAL(10,2) NOT NULL DEFAULT 0,
    "CompareAtPrice" DECIMAL(10,2),
    "CostPerItem" DECIMAL(10,2),
    "TaxEnabled" BOOLEAN DEFAULT true,
    
    -- Inventory
    "SKU" VARCHAR(100) DEFAULT '',
    "Barcode" VARCHAR(100) DEFAULT '',
    "TrackQuantity" BOOLEAN DEFAULT true,
    "ContinueSellingWhenOutOfStock" BOOLEAN DEFAULT false,
    "Quantity" INTEGER DEFAULT 0,
    
    -- Shipping
    "RequiresShipping" BOOLEAN DEFAULT true,
    "Weight" DECIMAL(10,3) DEFAULT 0,
    "WeightUnit" VARCHAR(10) DEFAULT 'kg',
    "CountryOfOrigin" VARCHAR(2) DEFAULT '',
    "HSCode" VARCHAR(20) DEFAULT '',
    
    -- SEO
    "SeoTitle" VARCHAR(70) DEFAULT '',
    "SeoDescription" VARCHAR(320) DEFAULT '',
    
    -- Metadata
    "CreatedAt" TIMESTAMP WITH TIME ZONE NOT NULL,
    "UpdatedAt" TIMESTAMP WITH TIME ZONE NOT NULL
);
```

### Tabla ProductImages
```sql
CREATE TABLE "ProductImages" (
    "Id" SERIAL PRIMARY KEY,
    "ProductId" INTEGER NOT NULL REFERENCES "Products"("Id") ON DELETE CASCADE,
    "ImageUrl" TEXT NOT NULL,
    "Position" INTEGER DEFAULT 0,
    "AltText" VARCHAR(255) DEFAULT '',
    "CreatedAt" TIMESTAMP WITH TIME ZONE NOT NULL
);
```

### Tabla ProductVideos
```sql
CREATE TABLE "ProductVideos" (
    "Id" SERIAL PRIMARY KEY,
    "ProductId" INTEGER NOT NULL REFERENCES "Products"("Id") ON DELETE CASCADE,
    "VideoUrl" TEXT NOT NULL,
    "VideoType" VARCHAR(20) DEFAULT 'youtube', -- youtube, vimeo, mp4
    "ThumbnailUrl" TEXT DEFAULT '',
    "Duration" INTEGER DEFAULT 0, -- en segundos
    "Position" INTEGER DEFAULT 0,
    "Title" VARCHAR(255) DEFAULT '',
    "CreatedAt" TIMESTAMP WITH TIME ZONE NOT NULL
);
```

### Tabla ProductVariants
```sql
CREATE TABLE "ProductVariants" (
    "Id" SERIAL PRIMARY KEY,
    "ProductId" INTEGER NOT NULL REFERENCES "Products"("Id") ON DELETE CASCADE,
    "Title" VARCHAR(255) NOT NULL,
    "Option1" VARCHAR(100),
    "Option2" VARCHAR(100),
    "Option3" VARCHAR(100),
    "SKU" VARCHAR(100) DEFAULT '',
    "Barcode" VARCHAR(100) DEFAULT '',
    "Price" DECIMAL(10,2) NOT NULL,
    "CompareAtPrice" DECIMAL(10,2),
    "Weight" DECIMAL(10,3),
    "Quantity" INTEGER DEFAULT 0,
    "ImageId" INTEGER REFERENCES "ProductImages"("Id"),
    "Position" INTEGER DEFAULT 0,
    "CreatedAt" TIMESTAMP WITH TIME ZONE NOT NULL,
    "UpdatedAt" TIMESTAMP WITH TIME ZONE NOT NULL
);
```

### Tabla CollectionProducts (ya existe)
```sql
-- Ya implementada para relacionar productos con colecciones
```

---

## Modelo Product

```csharp
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Hotel.Models
{
    public class Product
    {
        public int Id { get; set; }
        
        [Required(ErrorMessage = "El título es requerido")]
        [StringLength(255)]
        [Display(Name = "Título")]
        public string Title { get; set; } = "";
        
        [Display(Name = "Descripción")]
        [Column(TypeName = "text")]
        public string? Description { get; set; } = "";
        
        [Required(ErrorMessage = "El handle es requerido")]
        [StringLength(255)]
        [Display(Name = "Handle")]
        public string Handle { get; set; } = "";
        
        [StringLength(100)]
        [Display(Name = "Tipo de producto")]
        public string? ProductType { get; set; } = "";
        
        [StringLength(100)]
        [Display(Name = "Proveedor")]
        public string? Vendor { get; set; } = "";
        
        [Display(Name = "Etiquetas")]
        [Column(TypeName = "text")]
        public string? Tags { get; set; } = "";
        
        [StringLength(20)]
        [Display(Name = "Estado")]
        public string Status { get; set; } = "draft";
        
        [Display(Name = "Fecha de publicación")]
        public DateTime? PublishedAt { get; set; }
        
        // Pricing
        [Required]
        [Display(Name = "Precio")]
        [Column(TypeName = "decimal(10,2)")]
        public decimal Price { get; set; } = 0;
        
        [Display(Name = "Precio comparado")]
        [Column(TypeName = "decimal(10,2)")]
        public decimal? CompareAtPrice { get; set; }
        
        [Display(Name = "Costo por artículo")]
        [Column(TypeName = "decimal(10,2)")]
        public decimal? CostPerItem { get; set; }
        
        [Display(Name = "Cobrar impuestos")]
        public bool TaxEnabled { get; set; } = true;
        
        // Inventory
        [StringLength(100)]
        [Display(Name = "SKU")]
        public string? SKU { get; set; } = "";
        
        [StringLength(100)]
        [Display(Name = "Código de barras")]
        public string? Barcode { get; set; } = "";
        
        [Display(Name = "Rastrear cantidad")]
        public bool TrackQuantity { get; set; } = true;
        
        [Display(Name = "Continuar vendiendo sin stock")]
        public bool ContinueSellingWhenOutOfStock { get; set; } = false;
        
        [Display(Name = "Cantidad")]
        public int Quantity { get; set; } = 0;
        
        // Shipping
        [Display(Name = "Requiere envío")]
        public bool RequiresShipping { get; set; } = true;
        
        [Display(Name = "Peso")]
        [Column(TypeName = "decimal(10,3)")]
        public decimal Weight { get; set; } = 0;
        
        [StringLength(10)]
        [Display(Name = "Unidad de peso")]
        public string WeightUnit { get; set; } = "kg";
        
        [StringLength(2)]
        [Display(Name = "País de origen")]
        public string? CountryOfOrigin { get; set; } = "";
        
        [StringLength(20)]
        [Display(Name = "Código HS")]
        public string? HSCode { get; set; } = "";
        
        // SEO
        [StringLength(70)]
        [Display(Name = "Título SEO")]
        public string? SeoTitle { get; set; } = "";
        
        [StringLength(320)]
        [Display(Name = "Descripción SEO")]
        public string? SeoDescription { get; set; } = "";
        
        // Metadata
        public DateTime CreatedAt { get; set; }
        public DateTime UpdatedAt { get; set; }
        
        // Navigation properties
        public virtual ICollection<ProductImage> Images { get; set; } = new List<ProductImage>();
        public virtual ICollection<ProductVideo> Videos { get; set; } = new List<ProductVideo>();
        public virtual ICollection<ProductVariant> Variants { get; set; } = new List<ProductVariant>();
        public virtual ICollection<CollectionProduct> CollectionProducts { get; set; } = new List<CollectionProduct>();
    }
    
    public class ProductVideo
    {
        public int Id { get; set; }
        public int ProductId { get; set; }
        
        [Required]
        [Column(TypeName = "text")]
        public string VideoUrl { get; set; } = "";
        
        [StringLength(20)]
        public string VideoType { get; set; } = "youtube"; // youtube, vimeo, mp4
        
        [Column(TypeName = "text")]
        public string? ThumbnailUrl { get; set; } = "";
        
        public int Duration { get; set; } = 0; // en segundos
        public int Position { get; set; } = 0;
        
        [StringLength(255)]
        public string? Title { get; set; } = "";
        
        public DateTime CreatedAt { get; set; }
        
        // Navigation property
        public virtual Product Product { get; set; }
    }
}
```

---

## Implementación del Controller

### Puntos Cruciales para el Controller:
- ✅ **Usar patrón de Collections** como base
- ✅ **Aplicar fixes de guardado** desde el inicio
- ✅ **Manejo correcto de fechas UTC**
- ✅ **No sobrescribir campos vacíos en Edit**
- ✅ **Validación de handle único**
- ✅ **Logging detallado para debug**

```csharp
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
    public async Task<IActionResult> Index()
    {
        try
        {
            var products = await _context.Products
                .Include(p => p.Images)
                .Include(p => p.Variants)
                .OrderByDescending(p => p.CreatedAt)
                .Select(p => new
                {
                    p.Id,
                    p.Title,
                    p.Handle,
                    p.Status,
                    p.Price,
                    p.Quantity,
                    p.ProductType,
                    p.Vendor,
                    ImageUrl = p.Images.OrderBy(i => i.Position).FirstOrDefault().ImageUrl,
                    VariantCount = p.Variants.Count(),
                    p.CreatedAt,
                    p.UpdatedAt
                })
                .ToListAsync();

            ViewData["Products"] = products;
            return View();
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error al cargar los productos");
            TempData["ErrorMessage"] = "Error al cargar los productos";
            return View();
        }
    }

    // POST: Products/Create
    [HttpPost]
    [ValidateAntiForgeryToken]
    public async Task<IActionResult> Create(Product product, List<IFormFile> productImages, string[] variantOptions)
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
            
            // Procesar variantes si existen
            if (variantOptions != null && variantOptions.Any())
            {
                await ProcessProductVariants(product.Id, variantOptions);
            }
            
            TempData["SuccessMessage"] = "Producto creado exitosamente";
            return RedirectToAction(nameof(Index));
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error al crear el producto");
            TempData["ErrorMessage"] = "Error al crear el producto";
            return View(product);
        }
    }
}
```

---

## Vista Create

### Estructura de la Vista Create
La vista seguirá el patrón establecido en Collections con mejoras para productos:

1. **Sección Principal (Izquierda)**
   - Título del producto
   - Descripción con editor enriquecido
   - Imágenes múltiples con drag & drop
   - Pricing (precio, precio comparado, costo)
   - Inventario (SKU, código de barras, cantidad)
   - Envío (peso, país de origen, código HS)
   - SEO (título, descripción, handle)

2. **Sidebar (Derecha)**
   - Estado del producto (borrador/activo)
   - Visibilidad en canales
   - Tipo de producto
   - Proveedor
   - Colecciones
   - Etiquetas

### Validaciones - Importante
⚠️ **COMO EN SHOPIFY**: La única validación requerida es el campo **Título**. Todos los demás campos son opcionales:
- Precio: puede ser 0 o vacío
- Inventario: puede ser 0 o sin rastreo
- Imágenes: opcionales
- Descripción: opcional
- Todos los demás campos: opcionales

### Puntos Cruciales para la Vista:
- ✅ **Usar Font Awesome** para iconos (no Material Icons)
- ✅ **Implementar drag & drop** para múltiples imágenes
- ✅ **Editor de texto** igual que Collections
- ✅ **Solo validar título** en client-side
- ✅ **Preview de imágenes** con opción de eliminar
- ✅ **Sistema de variantes** dinámico con JavaScript

---

## Sistema de Variantes

### Vista de Edición de Variante Individual
Cuando se hace clic en una variante desde la vista del producto, se abre una vista dedicada que permite editar todos los detalles específicos de esa variante.

### Estructura de Datos de Variantes
```csharp
public class ProductVariant
{
    public int Id { get; set; }
    public int ProductId { get; set; }
    public string Title { get; set; } // "p2665-1 white / XXXL"
    
    // Opciones de variante
    public string Option1 { get; set; } // "white"
    public string Option2 { get; set; } // "XXXL"
    public string Option3 { get; set; } // null o tercera opción
    
    // Precios
    public decimal Price { get; set; }
    public decimal? CompareAtPrice { get; set; }
    public decimal? CostPerItem { get; set; }
    public decimal? Margin { get; set; }
    
    // Inventario
    public string SKU { get; set; }
    public string Barcode { get; set; }
    public int Quantity { get; set; }
    public bool TrackQuantity { get; set; }
    
    // Envío
    public decimal Weight { get; set; }
    public string WeightUnit { get; set; }
    
    // Metadatos Google Shopping
    public string GoogleAgeGroup { get; set; }
    public string GoogleCondition { get; set; }
    public string GoogleGender { get; set; }
    public string GoogleMPN { get; set; }
    
    // Relaciones
    public Product Product { get; set; }
    public ICollection<InventoryLocation> InventoryLocations { get; set; }
}
```

### Implementación de Variantes en JavaScript
```javascript
// Estructura para manejar variantes dinámicamente
let productVariants = {
    options: [], // ['Color', 'Size']
    values: {}, // { 'Color': ['white', 'black'], 'Size': ['S', 'M', 'L', 'XL', 'XXL', 'XXXL'] }
    combinations: [] // Todas las combinaciones posibles
};

// Generar todas las combinaciones de variantes
function generateVariantCombinations() {
    const options = productVariants.options;
    const values = productVariants.values;
    
    if (options.length === 0) return [];
    
    // Generar combinaciones recursivamente
    function combine(index, current) {
        if (index === options.length) {
            return [current];
        }
        
        const option = options[index];
        const optionValues = values[option] || [];
        const results = [];
        
        for (const value of optionValues) {
            const combination = { ...current, [option]: value };
            results.push(...combine(index + 1, combination));
        }
        
        return results;
    }
    
    return combine(0, {});
}

// UI para lista de variantes con checkboxes
function renderVariantsList(variants) {
    return variants.map((variant, index) => `
        <div class="variant-row">
            <input type="checkbox" class="variant-checkbox" data-variant-id="${variant.id}">
            <div class="variant-info">
                <span class="variant-title">${variant.title}</span>
                <span class="variant-options">${variant.option1} / ${variant.option2}</span>
            </div>
            <div class="variant-details">
                <span>SKU: ${variant.sku || '-'}</span>
                <span>Inventario: ${variant.quantity}</span>
                <span>Precio: $${variant.price}</span>
            </div>
        </div>
    `).join('');
}
```

### Gestión de Inventario por Ubicación
```javascript
// Múltiples ubicaciones de almacén
const inventoryLocations = [
    {
        name: "Múltiples sucursales",
        variants: [
            { variantId: 1, location: "Almacén Central", quantity: 100 },
            { variantId: 1, location: "Tienda Norte", quantity: 50 },
            { variantId: 1, location: "Tienda Sur", quantity: 30 }
        ]
    }
];

// UI para editar inventario por ubicación
function renderInventoryLocations() {
    return `
        <div class="inventory-locations">
            <h4>Inventario por ubicación</h4>
            <select id="locationSelect">
                <option>Múltiples sucursales</option>
            </select>
            <table class="locations-table">
                <thead>
                    <tr>
                        <th>Ubicación</th>
                        <th>Disponible</th>
                        <th>Comprometido</th>
                        <th>En existencia</th>
                    </tr>
                </thead>
                <tbody id="locationsBody">
                    <!-- Filas dinámicas -->
                </tbody>
            </table>
        </div>
    `;
}
```

### Puntos Cruciales del Sistema de Variantes:
- ✅ **Máximo 3 opciones** de variantes (ej: Color, Size, Material)
- ✅ **Vista individual de variante** con todos los campos editables
- ✅ **Gestión de inventario por ubicación** para cada variante
- ✅ **Precios independientes** por variante (precio, precio comparado, costo, margen)
- ✅ **SKU y código de barras** únicos por variante
- ✅ **Metadatos para Google Shopping** por variante
- ✅ **Selección múltiple** con checkboxes para acciones en bulk
- ✅ **Búsqueda rápida** de variantes dentro del producto
- ✅ **Peso individual** para cálculo de envío
- ✅ **Estado de disponibilidad** en canales de venta

### Acciones en Bulk para Variantes:
1. **Editar precios** de múltiples variantes
2. **Actualizar inventario** en masa
3. **Cambiar SKU** con patrón
4. **Activar/Desactivar** seguimiento de inventario
5. **Eliminar variantes** seleccionadas

---

## Manejo de Imágenes Múltiples

### Implementación Frontend
```javascript
let productImages = [];
const MAX_IMAGES = 10;
const MAX_SIZE_MB = 25;

function handleMultipleImages(files) {
    for (let file of files) {
        if (productImages.length >= MAX_IMAGES) {
            alert(`Máximo ${MAX_IMAGES} imágenes permitidas`);
            break;
        }
        
        if (file.size > MAX_SIZE_MB * 1024 * 1024) {
            alert(`${file.name} es muy grande (máx ${MAX_SIZE_MB}MB)`);
            continue;
        }
        
        const reader = new FileReader();
        reader.onload = function(e) {
            productImages.push({
                id: Date.now() + Math.random(),
                url: e.target.result,
                name: file.name,
                position: productImages.length
            });
            updateImagesPreview();
        };
        reader.readAsDataURL(file);
    }
}

function updateImagesPreview() {
    // Mostrar preview con drag & drop para reordenar
    // Opción de eliminar cada imagen
    // Primera imagen es la principal
}
```

### Puntos Cruciales:
- ✅ **Guardar imágenes como base64** en campo TEXT
- ✅ **Límite de 10 imágenes** por producto
- ✅ **Tamaño máximo 25MB** por imagen
- ✅ **Drag & drop** para reordenar
- ✅ **Primera imagen** es la principal

---

## Manejo de Videos

### Implementación Frontend para Videos
```javascript
let productVideos = [];
const MAX_VIDEOS = 5;
const MAX_VIDEO_SIZE_MB = 1000; // 1GB para videos MP4
const MAX_VIDEO_DURATION = 600; // 10 minutos en segundos

function addProductVideo(type = 'youtube') {
    if (productVideos.length >= MAX_VIDEOS) {
        alert(`Máximo ${MAX_VIDEOS} videos permitidos`);
        return;
    }
    
    const videoId = Date.now();
    const videoHtml = `
        <div class="video-item" data-video-id="${videoId}">
            <div class="video-type-selector">
                <select onchange="changeVideoType(${videoId}, this.value)">
                    <option value="youtube" ${type === 'youtube' ? 'selected' : ''}>YouTube</option>
                    <option value="vimeo" ${type === 'vimeo' ? 'selected' : ''}>Vimeo</option>
                    <option value="mp4" ${type === 'mp4' ? 'selected' : ''}>Archivo MP4</option>
                </select>
            </div>
            
            <div class="video-input-${videoId}">
                ${getVideoInputHTML(videoId, type)}
            </div>
            
            <button onclick="removeVideo(${videoId})" class="btn-remove">
                <i class="fas fa-trash"></i>
            </button>
        </div>
    `;
    
    document.getElementById('videosContainer').insertAdjacentHTML('beforeend', videoHtml);
}

function getVideoInputHTML(videoId, type) {
    switch(type) {
        case 'youtube':
            return `
                <input type="text" 
                       placeholder="URL de YouTube (ej: https://youtube.com/watch?v=...)" 
                       onchange="processYouTubeUrl(${videoId}, this.value)">
                <div class="video-preview" id="preview-${videoId}"></div>
            `;
        case 'vimeo':
            return `
                <input type="text" 
                       placeholder="URL de Vimeo (ej: https://vimeo.com/...)" 
                       onchange="processVimeoUrl(${videoId}, this.value)">
                <div class="video-preview" id="preview-${videoId}"></div>
            `;
        case 'mp4':
            return `
                <input type="file" 
                       accept="video/mp4,video/webm" 
                       onchange="processVideoFile(${videoId}, this.files[0])">
                <div class="upload-progress" id="progress-${videoId}"></div>
                <div class="video-preview" id="preview-${videoId}"></div>
            `;
    }
}

function processYouTubeUrl(videoId, url) {
    // Extraer ID del video de YouTube
    const regex = /(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&\n?#]+)/;
    const match = url.match(regex);
    
    if (match && match[1]) {
        const youtubeId = match[1];
        const embedUrl = `https://www.youtube.com/embed/${youtubeId}`;
        const thumbnailUrl = `https://img.youtube.com/vi/${youtubeId}/maxresdefault.jpg`;
        
        productVideos.push({
            id: videoId,
            type: 'youtube',
            url: embedUrl,
            thumbnailUrl: thumbnailUrl,
            originalUrl: url
        });
        
        // Mostrar preview
        document.getElementById(`preview-${videoId}`).innerHTML = `
            <iframe width="320" height="180" src="${embedUrl}" frameborder="0"></iframe>
        `;
    }
}

function processVideoFile(videoId, file) {
    if (!file) return;
    
    // Validar tamaño
    if (file.size > MAX_VIDEO_SIZE_MB * 1024 * 1024) {
        alert(`El video es muy grande. Máximo ${MAX_VIDEO_SIZE_MB}MB`);
        return;
    }
    
    // Validar duración
    const video = document.createElement('video');
    video.preload = 'metadata';
    
    video.onloadedmetadata = function() {
        if (video.duration > MAX_VIDEO_DURATION) {
            alert(`El video es muy largo. Máximo ${MAX_VIDEO_DURATION/60} minutos`);
            return;
        }
        
        // Convertir a base64 (para videos pequeños) o subir a servidor
        const reader = new FileReader();
        reader.onload = function(e) {
            productVideos.push({
                id: videoId,
                type: 'mp4',
                url: e.target.result,
                duration: Math.floor(video.duration),
                thumbnailUrl: captureVideoThumbnail(video)
            });
            
            // Mostrar preview
            document.getElementById(`preview-${videoId}`).innerHTML = `
                <video width="320" height="180" controls>
                    <source src="${e.target.result}" type="video/mp4">
                </video>
            `;
        };
        
        // Mostrar progreso
        reader.onprogress = function(e) {
            if (e.lengthComputable) {
                const progress = (e.loaded / e.total) * 100;
                document.getElementById(`progress-${videoId}`).innerHTML = 
                    `<div class="progress-bar" style="width: ${progress}%"></div>`;
            }
        };
        
        reader.readAsDataURL(file);
    };
    
    video.src = URL.createObjectURL(file);
}

function captureVideoThumbnail(video) {
    const canvas = document.createElement('canvas');
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    
    const ctx = canvas.getContext('2d');
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
    
    return canvas.toDataURL('image/jpeg');
}
```

### Backend - Procesamiento de Videos
```csharp
private async Task ProcessProductVideos(int productId, List<VideoInput> videos)
{
    int position = 0;
    
    foreach (var video in videos)
    {
        var productVideo = new ProductVideo
        {
            ProductId = productId,
            VideoUrl = video.Url,
            VideoType = video.Type,
            ThumbnailUrl = video.ThumbnailUrl ?? "",
            Duration = video.Duration,
            Position = position++,
            Title = video.Title ?? "",
            CreatedAt = DateTime.UtcNow
        };
        
        _context.ProductVideos.Add(productVideo);
    }
    
    await _context.SaveChangesAsync();
}
```

### Puntos Cruciales para Videos:
- ✅ **Soporte para YouTube, Vimeo y MP4** (subida directa)
- ✅ **Límite de 5 videos** por producto
- ✅ **Validación de duración** (máximo 10 minutos)
- ✅ **Tamaño máximo 1GB** para archivos MP4
- ✅ **Captura automática de thumbnail** para videos MP4
- ✅ **Preview en tiempo real** antes de guardar
- ✅ **Orden personalizable** con drag & drop

### Consideraciones de Almacenamiento:
1. **Videos de YouTube/Vimeo**: Solo guardar URL
2. **Videos MP4 pequeños (<50MB)**: Considerar base64
3. **Videos MP4 grandes**: Implementar subida a:
   - Azure Blob Storage
   - AWS S3
   - Servidor de archivos dedicado

---

## SEO y URLs

### Generación de Handles
```csharp
private string GenerateHandle(string title)
{
    if (string.IsNullOrWhiteSpace(title))
        return "";
    
    // Convertir a minúsculas
    var handle = title.ToLowerInvariant();
    
    // Reemplazar caracteres especiales y espacios
    handle = Regex.Replace(handle, @"[^a-z0-9\s-]", "");
    handle = Regex.Replace(handle, @"\s+", "-");
    handle = Regex.Replace(handle, @"-+", "-");
    
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
```

### Puntos Cruciales SEO:
- ✅ **URLs no deben cambiar** después de crear
- ✅ **Handles únicos** con auto-incremento
- ✅ **Meta tags** optimizados (70 chars título, 320 descripción)
- ✅ **Preview en tiempo real** del resultado en Google

---

## Inventario y Stock

### Sistema de Control de Inventario
```csharp
public class InventoryService
{
    // Verificar disponibilidad antes de venta
    public bool IsAvailable(int productId, int quantity)
    {
        var product = _context.Products.Find(productId);
        
        if (!product.TrackQuantity || product.ContinueSellingWhenOutOfStock)
            return true;
            
        return product.Quantity >= quantity;
    }
    
    // Actualizar stock después de venta
    public async Task UpdateStock(int productId, int quantitySold)
    {
        var product = await _context.Products.FindAsync(productId);
        
        if (product.TrackQuantity)
        {
            product.Quantity -= quantitySold;
            product.UpdatedAt = DateTime.UtcNow;
            await _context.SaveChangesAsync();
        }
    }
}
```

### Puntos Cruciales:
- ✅ **Verificar stock** antes de permitir compra
- ✅ **Actualizar automáticamente** después de venta
- ✅ **Alertas de stock bajo** (opcional)
- ✅ **Historial de movimientos** (opcional)

---

## Integración con Collections

### Relación Producto-Colecciones (Many-to-Many)

**IMPORTANTE**: Un producto puede pertenecer a múltiples colecciones simultáneamente. Esta es una característica fundamental del sistema.

#### Ejemplos de uso:
- Una "Camiseta Roja Talla M" puede estar en:
  - Colección "Ropa de Verano"
  - Colección "Ofertas Black Friday"
  - Colección "Novedades"
  - Colección "Tallas Medianas"
  - Colección "Productos Destacados"

### Implementación en el Modelo
```csharp
// En el modelo Product
public class Product
{
    // ... otras propiedades
    public ICollection<CollectionProduct> CollectionProducts { get; set; }
}

// En el Controller al guardar
var collectionIds = Request.Form["collectionIds"];
foreach (var collectionId in collectionIds)
{
    _context.CollectionProducts.Add(new CollectionProduct
    {
        ProductId = product.Id,
        CollectionId = int.Parse(collectionId)
    });
}
```

### Asignación a Colecciones en la UI
```javascript
// En la vista de producto
function loadCollections() {
    fetch('/api/collections/available')
        .then(response => response.json())
        .then(collections => {
            renderCollectionCheckboxes(collections);
        });
}

function renderCollectionCheckboxes(collections) {
    const container = document.getElementById('collectionsContainer');
    collections.forEach(collection => {
        const checkbox = `
            <label class="collection-checkbox">
                <input type="checkbox" 
                       name="collectionIds" 
                       value="${collection.id}"
                       ${productCollections.includes(collection.id) ? 'checked' : ''}>
                <span>${collection.title}</span>
                <small>${collection.productCount} productos</small>
            </label>
        `;
        container.innerHTML += checkbox;
    });
}
```

### Vista de Collections en el Producto
```html
<div class="form-group">
    <label>Colecciones</label>
    <div class="help-text">
        <i class="fas fa-info-circle"></i>
        Un producto puede estar en múltiples colecciones al mismo tiempo
    </div>
    <div id="collectionsContainer" class="checkbox-grid">
        <!-- Los checkboxes se cargan dinámicamente -->
    </div>
</div>
```

### Puntos Cruciales:
- ✅ **Un producto puede estar en MÚLTIPLES colecciones** simultáneamente
- ✅ **Relación muchos a muchos** a través de la tabla CollectionProducts
- ✅ **Checkboxes** para permitir selección múltiple
- ✅ **Mostrar conteo** de productos en cada colección
- ✅ **Preservar selecciones** al editar producto
- ✅ **Sin límite** en cantidad de colecciones por producto

---

## Importación Masiva CSV

### Estructura del CSV
```csv
Title,Description,Handle,ProductType,Vendor,Tags,Status,Price,CompareAtPrice,SKU,Quantity,Weight,ImageUrl
"Camiseta Básica","Descripción...","camiseta-basica","Ropa","Nike","verano,casual","active",29.99,39.99,"SKU001",100,0.2,"https://..."
```

### Implementación
```csharp
[HttpPost]
public async Task<IActionResult> ImportCSV(IFormFile csvFile)
{
    if (csvFile == null || csvFile.Length == 0)
    {
        TempData["ErrorMessage"] = "Por favor selecciona un archivo CSV";
        return RedirectToAction(nameof(Index));
    }
    
    try
    {
        using var reader = new StreamReader(csvFile.OpenReadStream());
        using var csv = new CsvReader(reader, CultureInfo.InvariantCulture);
        
        var products = csv.GetRecords<ProductCsvModel>().ToList();
        
        foreach (var productCsv in products)
        {
            var product = MapCsvToProduct(productCsv);
            _context.Products.Add(product);
        }
        
        await _context.SaveChangesAsync();
        
        TempData["SuccessMessage"] = $"{products.Count} productos importados exitosamente";
        return RedirectToAction(nameof(Index));
    }
    catch (Exception ex)
    {
        _logger.LogError(ex, "Error al importar CSV");
        TempData["ErrorMessage"] = "Error al procesar el archivo CSV";
        return RedirectToAction(nameof(Index));
    }
}
```

### Puntos Cruciales:
- ✅ **Validar formato CSV** antes de procesar
- ✅ **Manejo de errores** por fila
- ✅ **Límite de tamaño** del archivo
- ✅ **Progreso en tiempo real** para archivos grandes

---

## Sistema de Colores y Estilos

### Uso del Color Primario del Theme

El módulo de Productos DEBE respetar el sistema de colores personalizable del proyecto, usando la variable CSS `--primary` para todos los elementos interactivos principales.

#### Elementos que deben usar `var(--primary)`:

```css
/* Botón Agregar Producto */
.btn-create, .btn-add-product {
    background-color: var(--primary);
    color: #ffffff;
}

.btn-create:hover {
    background-color: var(--primary);
    opacity: 0.9;
}

/* Botón Guardar en formularios */
.btn-save, .btn-primary {
    background-color: var(--primary);
    color: #ffffff;
}

/* Checkboxes */
input[type="checkbox"]:checked {
    background-color: var(--primary);
    border-color: var(--primary);
}

/* Radio buttons */
input[type="radio"]:checked {
    background-color: var(--primary);
    border-color: var(--primary);
}

/* Enlaces importantes y tabs activos */
.nav-tab.active {
    border-bottom: 2px solid var(--primary);
    color: var(--primary);
}

/* Focus states */
.form-control:focus {
    border-color: var(--primary);
    box-shadow: 0 0 0 3px rgba(var(--primary-rgb), 0.1);
}

/* Badges de estado activo */
.badge-active, .status-active {
    background-color: var(--primary);
    color: #ffffff;
}

/* Indicadores de progreso */
.progress-bar {
    background-color: var(--primary);
}
```

#### Elementos que NO deben usar el color primario:
- Botones secundarios o de cancelar
- Textos de contenido
- Bordes estándar de cards
- Fondos de secciones
- Iconos informativos

### Puntos Cruciales de Estilos:
- ✅ **SIEMPRE usar `var(--primary)`** para botones principales
- ✅ **NO hardcodear colores** como #000000 o #e91e63
- ✅ **Mantener consistencia** con Collections y otros módulos
- ✅ **El usuario puede personalizar** el color desde el panel de configuración
- ✅ **Probar con diferentes colores** del theme para asegurar que funciona

---

## Migración Necesaria

```sql
-- Nombre de migración: AddProductsModule

-- Esta migración creará:
-- 1. Tabla Products con todos los campos
-- 2. Tabla ProductImages
-- 3. Tabla ProductVideos
-- 4. Tabla ProductVariants
-- 5. Índices necesarios
-- 6. Relaciones con Collections
```

---

## Sistema de Permisos

### Permisos ya configurados
Los permisos de Productos ya fueron agregados en la migración `InsertCollectionsAndProductsPermissions`:
- **Productos - Read**: Ver productos (ID: 19)
- **Productos - Write**: Editar productos (ID: 20)
- **Productos - Create**: Crear productos (ID: 21)

### Agregar al Menú Lateral
En `_MaterializeExactLayout.cshtml`, agregar después de Collections:

```html
<li class="menu-item">
    <a href="@Url.Action("Index", "Products")" class="menu-link">
        <i class="menu-icon fas fa-box"></i>
        <span class="menu-text" data-i18n="menu.products">Productos</span>
        <span class="menu-tooltip" data-i18n="menu.products">Productos</span>
    </a>
</li>
```

Y agregar las traducciones al objeto global del layout:
```javascript
es: {
    // ... otras traducciones
    'menu.products': 'Productos',
},
en: {
    // ... otras traducciones  
    'menu.products': 'Products',
}
```

---

## Integración con el Menú

### Agregar Products al Menú Lateral

Para que el módulo de Products aparezca en el menú lateral, necesitas modificar el archivo `_MaterializeExactLayout.cshtml`:

#### 1. Localizar el menú (alrededor de la línea 63)
Buscar donde están los otros items del menú y agregar después de Collections:

```html
<!-- Collections -->
<li class="menu-item">
    <a href="@Url.Action("Index", "Collections")" class="menu-link">
        <i class="menu-icon fas fa-layer-group"></i>
        <span class="menu-text" data-i18n="menu.collections">Colecciones</span>
        <span class="menu-tooltip" data-i18n="menu.collections">Colecciones</span>
    </a>
</li>

<!-- AGREGAR: Products -->
<li class="menu-item">
    <a href="@Url.Action("Index", "Products")" class="menu-link">
        <i class="menu-icon fas fa-box"></i>
        <span class="menu-text" data-i18n="menu.products">Productos</span>
        <span class="menu-tooltip" data-i18n="menu.products">Productos</span>
    </a>
</li>
```

#### 2. Agregar traducciones al layout (alrededor de la línea 609)
En el objeto de traducciones del layout, agregar:

```javascript
const translations = {
    es: {
        // ... otras traducciones existentes
        'menu.collections': 'Colecciones',
        'menu.products': 'Productos', // AGREGAR ESTA LÍNEA
        // ... más traducciones
    },
    en: {
        // ... otras traducciones existentes
        'menu.collections': 'Collections',  
        'menu.products': 'Products', // AGREGAR ESTA LÍNEA
        // ... más traducciones
    }
};
```

### Puntos Importantes:
- ✅ **Ícono consistente**: Usar `fas fa-box` para productos
- ✅ **Orden en el menú**: Después de Collections, antes de otros módulos
- ✅ **Traducciones**: Agregar tanto en español como inglés
- ✅ **data-i18n**: Usar la misma key para `menu-text` y `menu-tooltip`

---

## Sistema de Traducciones

### Implementación en las Vistas
Siguiendo el patrón de módulos regulares (NO Website Builder):

```javascript
// En cada vista de Products (Index, Create, Edit)
const productTranslations = {
    es: {
        // Index
        'products': 'Productos',
        'create_product': 'Crear producto',
        'search_products': 'Buscar productos...',
        'title': 'Título',
        'price': 'Precio',
        'inventory': 'Inventario',
        'status': 'Estado',
        'type': 'Tipo',
        'vendor': 'Proveedor',
        'edit': 'Editar',
        'delete': 'Eliminar',
        'no_products': 'No hay productos aún',
        'no_products_desc': 'Los productos son los artículos que vendes en tu tienda',
        
        // Create/Edit
        'create_product': 'Crear producto',
        'edit_product': 'Editar producto',
        'product_information': 'Información del producto',
        'pricing': 'Precios',
        'inventory_tracking': 'Control de inventario',
        'shipping': 'Envío',
        'organization': 'Organización',
        'visibility': 'Visibilidad',
        'save': 'Guardar',
        'cancel': 'Cancelar',
        'saving': 'Guardando...',
        
        // Campos específicos
        'title_placeholder': 'Camiseta de algodón, iPhone 15, etc.',
        'description': 'Descripción',
        'description_placeholder': 'Describe tu producto en detalle...',
        'images': 'Imágenes',
        'add_images': 'Agregar imágenes',
        'drag_drop_images': 'o arrastra imágenes para subir',
        'videos': 'Videos',
        'add_video': 'Agregar video',
        'price': 'Precio',
        'compare_at_price': 'Precio comparado',
        'cost_per_item': 'Costo por artículo',
        'charge_tax': 'Cobrar impuestos en este producto',
        'sku': 'SKU (Código de inventario)',
        'barcode': 'Código de barras',
        'track_quantity': 'Rastrear cantidad',
        'continue_selling': 'Continuar vendiendo cuando esté agotado',
        'quantity': 'Cantidad',
        'weight': 'Peso',
        'requires_shipping': 'Este es un producto físico',
        'country_of_origin': 'País de origen',
        'hs_code': 'Código armonizado (HS)',
        'product_type': 'Tipo de producto',
        'vendor': 'Proveedor',
        'collections': 'Colecciones',
        'tags': 'Etiquetas',
        'tags_help': 'Separa las etiquetas con comas',
        'active': 'Activo',
        'draft': 'Borrador',
        'product_status_help': 'Los productos activos son visibles en tu tienda',
        
        // Variantes
        'variants': 'Variantes',
        'add_variant': 'Agregar variante',
        'option_name': 'Nombre de opción',
        'option_values': 'Valores de opción',
        'size': 'Talla',
        'color': 'Color',
        'material': 'Material',
        'style': 'Estilo',
        
        // SEO
        'search_engine_listing': 'Publicación en motores de búsqueda',
        'seo_title': 'Título SEO',
        'seo_description': 'Descripción SEO',
        'url_handle': 'URL y handle',
        
        // Mensajes
        'product_created': 'Producto creado exitosamente',
        'product_updated': 'Producto actualizado exitosamente',
        'product_deleted': 'Producto eliminado exitosamente',
        'error_creating': 'Error al crear el producto',
        'error_updating': 'Error al actualizar el producto',
        'error_deleting': 'Error al eliminar el producto',
        'confirm_delete': '¿Estás seguro de eliminar el producto "{title}"?',
        
        // Validaciones
        'title_required': 'El título es requerido'
    },
    en: {
        // Index
        'products': 'Products',
        'create_product': 'Create product',
        'search_products': 'Search products...',
        'title': 'Title',
        'price': 'Price',
        'inventory': 'Inventory',
        'status': 'Status',
        'type': 'Type',
        'vendor': 'Vendor',
        'edit': 'Edit',
        'delete': 'Delete',
        'no_products': 'No products yet',
        'no_products_desc': 'Products are the items you sell in your store',
        
        // Create/Edit
        'create_product': 'Create product',
        'edit_product': 'Edit product',
        'product_information': 'Product information',
        'pricing': 'Pricing',
        'inventory_tracking': 'Inventory tracking',
        'shipping': 'Shipping',
        'organization': 'Organization',
        'visibility': 'Visibility',
        'save': 'Save',
        'cancel': 'Cancel',
        'saving': 'Saving...',
        
        // ... todas las demás traducciones en inglés
    }
};

// Fusionar con el objeto global ANTES del DOMContentLoaded
if (typeof translations !== 'undefined') {
    if (!translations.es) translations.es = {};
    if (!translations.en) translations.en = {};
    
    Object.assign(translations.es, productTranslations.es);
    Object.assign(translations.en, productTranslations.en);
}

// Aplicar después del DOM ready
document.addEventListener('DOMContentLoaded', function() {
    if (typeof translatePage === 'function') {
        const currentLang = localStorage.getItem('preferredLanguage') || 'es';
        translatePage(currentLang);
    }
});
```

### Puntos Cruciales para Traducciones:
- ✅ **Usar sistema del layout** (NO el del Website Builder)
- ✅ **Fusionar traducciones** antes del DOMContentLoaded
- ✅ **localStorage key**: `preferredLanguage` (no `selectedLanguage`)
- ✅ **Agregar data-i18n** a todos los elementos HTML
- ✅ **Traducir placeholders** con data-i18n-placeholder
- ✅ **Traducir tooltips** con data-i18n-title

---

## Checklist de Implementación

### Fase 1: Base
- [ ] Crear modelos (Product, ProductImage, ProductVariant)
- [ ] Crear migración con todas las tablas
- [ ] Implementar ProductsController base
- [ ] Crear vista Index con diseño similar a Collections

### Fase 2: CRUD Básico
- [ ] Implementar Create con todos los campos
- [ ] Sistema de imágenes múltiples
- [ ] Sistema de videos (YouTube, Vimeo, MP4)
- [ ] Implementar Edit preservando datos
- [ ] Implementar Delete con confirmación

### Fase 3: Features Avanzadas
- [ ] Sistema de variantes dinámico
- [ ] Integración con Collections
- [ ] Importación CSV
- [ ] Búsqueda y filtros avanzados

### Fase 4: Optimización
- [ ] Validaciones client-side
- [ ] Preview de producto
- [ ] Bulk actions
- [ ] APIs para integraciones

---

## Notas Importantes

1. **Seguir patrones existentes**: Usar Collections como referencia
2. **Aplicar todos los fixes**: Especialmente guardado de imágenes
3. **Mantener consistencia UI**: Mismo estilo que Collections
4. **Traducciones**: Agregar todas las claves necesarias
5. **Testing**: Probar con productos simples y con variantes

Este documento debe actualizarse conforme se encuentren nuevos patrones o problemas durante la implementación.