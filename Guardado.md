# 📝 Guía de Guardado - Patrones y Soluciones

Este documento documenta todos los problemas encontrados y sus soluciones al implementar el guardado en los módulos del sistema Hotel.

## 📑 Tabla de Contenidos
1. [Problema de Fechas con PostgreSQL](#problema-de-fechas-con-postgresql)
2. [Campos Nullable y Valores por Defecto](#campos-nullable-y-valores-por-defecto)
3. [Guardado de Imágenes](#guardado-de-imágenes)
4. [Patrón Completo de Guardado](#patrón-completo-de-guardado)
5. [Consideraciones para Múltiples Imágenes](#consideraciones-para-múltiples-imágenes)

---

## Problema de Fechas con PostgreSQL

### 🔴 Problema
PostgreSQL requiere fechas en formato UTC con zona horaria (`timestamp with time zone`).

### ✅ Solución Aplicada

1. **En Program.cs** - Agregar configuración global:
```csharp
// Configurar Npgsql para manejar correctamente DateTime con PostgreSQL
AppContext.SetSwitch("Npgsql.EnableLegacyTimestampBehavior", true);
```

2. **En el Controlador** - Asignar fechas UTC:
```csharp
collection.CreatedAt = DateTime.UtcNow;
collection.UpdatedAt = DateTime.UtcNow;
```

3. **En el Modelo** - NO inicializar con valores por defecto:
```csharp
// ❌ INCORRECTO
public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

// ✅ CORRECTO
public DateTime CreatedAt { get; set; }
```

---

## Campos Nullable y Valores por Defecto

### 🔴 Problema
La migración inicial creó campos como NOT NULL cuando el modelo los tenía como nullable.

### ✅ Solución Aplicada

1. **En el Modelo** - Usar nullable con valores por defecto:
```csharp
public string? Description { get; set; } = "";
public string? Handle { get; set; } = "";
public string? ImageUrl { get; set; } = "";
public string? SeoTitle { get; set; } = "";
public string? SeoDescription { get; set; } = "";
```

2. **En el Controlador** - Manejo correcto según contexto:

### Para CREATE (nuevos registros):
```csharp
// ✅ CORRECTO para CREATE - Los campos NOT NULL necesitan valor inicial
if (string.IsNullOrWhiteSpace(collection.ImageUrl))
{
    ModelState.Remove("ImageUrl");
    collection.ImageUrl = ""; // SÍ asignar vacío en CREATE
}
```

### Para EDIT (registros existentes):
```csharp
// ❌ INCORRECTO para EDIT - Esto borraba la imagen existente!
if (string.IsNullOrWhiteSpace(collection.ImageUrl))
{
    ModelState.Remove("ImageUrl");
    collection.ImageUrl = ""; // NO HACER ESTO en EDIT
}

// ✅ CORRECTO para EDIT - Preservar valores existentes
if (string.IsNullOrWhiteSpace(collection.ImageUrl))
{
    ModelState.Remove("ImageUrl");
    // Solo asignar "" si el valor es null (no si está vacío)
    if (collection.ImageUrl == null) collection.ImageUrl = "";
}
```

3. **Validación y Asignación Correcta**:
```csharp
// Solo asignar valores por defecto a campos que realmente están vacíos
if (string.IsNullOrWhiteSpace(collection.Handle))
{
    collection.Handle = GenerateHandle(collection.Title);
}

if (string.IsNullOrWhiteSpace(collection.SortOrder))
{
    collection.SortOrder = "manual";
}
```

---

## Guardado de Imágenes

### 🔴 Problema Principal
El campo `ImageUrl` tenía límite de 500 caracteres (`varchar(500)`), pero las imágenes en base64 pueden tener miles de caracteres.

### ✅ Solución Completa

#### 1. **Configuración del Modelo**
```csharp
[Display(Name = "URL de imagen")]
[Column(TypeName = "text")]  // ← CRÍTICO: Define como text, no varchar
public string? ImageUrl { get; set; } = "";
```

#### 2. **Configuración en DbContext**
```csharp
modelBuilder.Entity<Collection>()
    .Property(c => c.ImageUrl)
    .HasColumnType("text");  // ← Asegurar tipo text
```

#### 3. **JavaScript - Manejo de Imágenes**
```javascript
function handleImageFile(file) {
    // Validar tamaño
    const maxSizeMB = 25;
    const maxSizeBytes = maxSizeMB * 1024 * 1024;
    
    if (file.size > maxSizeBytes) {
        alert(`La imagen es demasiado grande. Máximo ${maxSizeMB}MB.`);
        return;
    }
    
    // Convertir a Data URL
    const reader = new FileReader();
    reader.onload = function(e) {
        previewImg.src = e.target.result;
        imageUrlInput.value = e.target.result; // Guardar base64
        
        imageUploadArea.style.display = 'none';
        imagePreview.style.display = 'block';
    };
    reader.readAsDataURL(file);
}
```

#### 4. **HTML - Input Correcto**
```html
<input type="file" id="imageInput" accept="image/*" style="display: none;" />
<input type="hidden" asp-for="ImageUrl" />
```

### 🚨 Solución de Emergencia (SQL Directo)
Si la migración no funciona, ejecutar en pgAdmin:
```sql
ALTER TABLE "Collections" 
ALTER COLUMN "ImageUrl" TYPE text;
```

---

## Patrón Completo de Guardado

### Método Create en el Controlador

```csharp
[HttpPost]
[ValidateAntiForgeryToken]
public async Task<IActionResult> Create(Collection collection, string[] selectedChannels)
{
    try
    {
        // 1. Logging para debug
        _logger.LogInformation($"Title: '{collection.Title}'");
        _logger.LogInformation($"ImageUrl longitud: {collection.ImageUrl?.Length ?? 0}");
        
        // 2. Remover validaciones de campos opcionales SIN modificar valores
        if (string.IsNullOrWhiteSpace(collection.Description))
        {
            ModelState.Remove("Description");
            // NO asignar "" aquí
        }
        
        // 3. Validar campos requeridos
        if (string.IsNullOrWhiteSpace(collection.Title))
        {
            ModelState.AddModelError("Title", "El título es requerido");
            return View(collection);
        }
        
        // 4. Generar valores automáticos solo si es necesario
        if (string.IsNullOrWhiteSpace(collection.Handle))
        {
            collection.Handle = GenerateHandle(collection.Title);
        }
        
        // 5. Establecer valores de auditoría
        collection.CreatedAt = DateTime.UtcNow;
        collection.UpdatedAt = DateTime.UtcNow;
        
        // 6. Valores por defecto para campos específicos
        collection.SalesChannels = selectedChannels?.Length > 0 
            ? JsonSerializer.Serialize(selectedChannels) 
            : "[\"tienda-online\"]";
            
        if (string.IsNullOrWhiteSpace(collection.SortOrder))
        {
            collection.SortOrder = "manual";
        }
        
        // 7. Guardar
        _context.Collections.Add(collection);
        await _context.SaveChangesAsync();
        
        TempData["SuccessMessage"] = "Colección creada exitosamente";
        return RedirectToAction(nameof(Index));
    }
    catch (DbUpdateException dbEx)
    {
        // Manejo específico para errores de PostgreSQL
        if (dbEx.InnerException is Npgsql.PostgresException pgEx)
        {
            _logger.LogError($"PostgreSQL Error: {pgEx.MessageText}");
            _logger.LogError($"Column: {pgEx.ColumnName}");
            TempData["ErrorMessage"] = $"Error PostgreSQL: {pgEx.MessageText}";
        }
        return View(collection);
    }
}
```

---

## Consideraciones para Múltiples Imágenes (Productos)

### Opción 1: Campo JSON con Array de Data URLs
```csharp
// Modelo
[Column(TypeName = "jsonb")]
public string ImagesJson { get; set; } = "[]";

// Propiedad calculada
[NotMapped]
public List<string> Images 
{
    get => JsonSerializer.Deserialize<List<string>>(ImagesJson ?? "[]");
    set => ImagesJson = JsonSerializer.Serialize(value);
}
```

### Opción 2: Tabla Separada (Recomendado)
```csharp
// Modelo ProductImage
public class ProductImage
{
    public int Id { get; set; }
    public int ProductId { get; set; }
    
    [Column(TypeName = "text")]
    public string ImageUrl { get; set; }
    
    public int DisplayOrder { get; set; }
    public bool IsPrimary { get; set; }
    
    public virtual Product Product { get; set; }
}

// En Product
public virtual ICollection<ProductImage> Images { get; set; }
```

### JavaScript para Múltiples Imágenes
```javascript
let productImages = [];

function handleMultipleImages(files) {
    const maxImages = 10;
    const maxSizeMB = 25;
    
    for (let file of files) {
        if (productImages.length >= maxImages) {
            alert(`Máximo ${maxImages} imágenes permitidas`);
            break;
        }
        
        if (file.size > maxSizeMB * 1024 * 1024) {
            alert(`${file.name} es muy grande (máx ${maxSizeMB}MB)`);
            continue;
        }
        
        const reader = new FileReader();
        reader.onload = function(e) {
            productImages.push({
                url: e.target.result,
                name: file.name,
                size: file.size
            });
            updateImagesPreview();
        };
        reader.readAsDataURL(file);
    }
}
```

---

## 🎯 Checklist para Nuevos Módulos

- [ ] Campos de texto largo definidos como `[Column(TypeName = "text")]`
- [ ] Configuración explícita en DbContext con `.HasColumnType("text")`
- [ ] Fechas usando `DateTime.UtcNow`
- [ ] NO inicializar fechas en el modelo
- [ ] NO sobrescribir campos vacíos con `""`
- [ ] Validación de tamaño de archivo (25MB)
- [ ] Manejo de errores específicos de PostgreSQL
- [ ] Logging detallado para debugging

---

## 🚨 Errores Comunes a Evitar

1. **NO hacer esto**:
```csharp
collection.ImageUrl = ""; // Borra el valor!
```

2. **NO crear migraciones manuales** - Siempre usar:
```
Add-Migration NombreMigracion
Update-Database
```

3. **NO confiar solo en anotaciones** - Agregar configuración en DbContext también

4. **NO olvidar** el switch de Npgsql en Program.cs para fechas

---

Esta documentación debe actualizarse con cada nuevo patrón o problema resuelto.