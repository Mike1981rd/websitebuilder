# Implementación del Botón de Exportar con Dropdown

## Descripción General
Implementación de un botón de exportación con dropdown menu que permite exportar datos en tres formatos: Excel, PDF y CSV. Este patrón está basado en la implementación existente en el módulo de Roles/Users.

## Componentes de la Implementación

### 1. Estructura HTML del Dropdown
```html
<div class="dropdown export-dropdown">
    <button class="btn btn-sm btn-secondary" onclick="toggleExportMenu(event)">
        <i class="fas fa-download"></i>
        <span data-i18n="customers.export">Exportar</span>
    </button>
    <div class="dropdown-menu" id="exportMenu">
        <a href="#" onclick="exportCustomers('excel')" class="dropdown-item">
            <i class="fas fa-file-excel"></i> Excel
        </a>
        <a href="#" onclick="exportCustomers('pdf')" class="dropdown-item">
            <i class="fas fa-file-pdf"></i> PDF
        </a>
        <a href="#" onclick="exportCustomers('csv')" class="dropdown-item">
            <i class="fas fa-file-csv"></i> CSV
        </a>
    </div>
</div>
```

### 2. JavaScript Necesario
```javascript
// Export functions
window.toggleExportMenu = function(e) {
    e.stopPropagation();
    const menu = document.getElementById('exportMenu');
    menu.classList.toggle('show');
}

window.exportCustomers = function(format) {
    window.location.href = '@Url.Action("Export", "Customers")?format=' + format;
    document.getElementById('exportMenu').classList.remove('show');
}

// Close dropdown when clicking outside
document.addEventListener('click', function() {
    document.getElementById('exportMenu')?.classList.remove('show');
});
```

**Nota**: Cambiar `exportCustomers` por el nombre apropiado según el módulo (ej: `exportProducts`, `exportOrders`, etc.)

### 3. Estilos CSS Requeridos
```css
/* Export dropdown styles - Similar to Roles */
.export-dropdown {
    position: relative;
    display: inline-block;
}

.dropdown-menu {
    position: absolute;
    top: 100%;
    right: 0;
    background: #ffffff;
    box-shadow: 0 2px 10px rgba(0,0,0,0.1);
    border-radius: 4px;
    min-width: 150px;
    z-index: 1000;
    display: none;
    margin-top: 5px;
}

.dropdown-menu.show {
    display: block;
}

.dropdown-item {
    display: block;
    padding: 8px 16px;
    color: #333;
    text-decoration: none;
    font-size: 14px;
    transition: all 0.2s;
}

.dropdown-item:hover {
    background-color: #f8f9fa;
    color: #000;
    text-decoration: none;
}

.dropdown-item i {
    font-size: 16px;
    width: 20px;
    text-align: center;
    margin-right: 8px;
}

/* Dark mode for dropdown */
body.dark-mode .dropdown-menu {
    background-color: #3a3c55;
    border: 1px solid #404359;
}

body.dark-mode .dropdown-item {
    color: #e0e0e0;
}

body.dark-mode .dropdown-item:hover {
    background-color: #2d2f45;
    color: #ffffff;
}
```

### 4. Traducciones Necesarias
Agregar en el objeto de traducciones del módulo:
```javascript
es: {
    'export.excel': 'Excel',
    'export.pdf': 'PDF',
    'export.csv': 'CSV'
},
en: {
    'export.excel': 'Excel',
    'export.pdf': 'PDF',
    'export.csv': 'CSV'
}
```

### 5. Implementación en el Controller

#### Método Principal de Export
```csharp
// GET: Customers/Export
public async Task<IActionResult> Export(string format)
{
    var customers = await _context.Guests
        .Where(g => !g.IsDeleted)
        .OrderByDescending(g => g.CreatedAt)
        .ToListAsync();

    switch (format?.ToLower())
    {
        case "excel":
            return ExportToExcel(customers);
        case "pdf":
            return ExportToPdf(customers);
        case "csv":
            return ExportToCsv(customers);
        default:
            TempData["ErrorMessage"] = "Formato de exportación no válido";
            return RedirectToAction(nameof(Index));
    }
}
```

#### Implementación de Excel (usando ClosedXML)
```csharp
private IActionResult ExportToExcel(List<Guest> customers)
{
    using (var workbook = new XLWorkbook())
    {
        var worksheet = workbook.Worksheets.Add("Clientes");
        
        // Headers
        worksheet.Cell(1, 1).Value = "ID Cliente";
        worksheet.Cell(1, 2).Value = "Nombre";
        worksheet.Cell(1, 3).Value = "Email";
        // ... más columnas según necesidad
        
        // Styling headers
        var headerRange = worksheet.Range(1, 1, 1, 8);
        headerRange.Style.Font.Bold = true;
        headerRange.Style.Fill.BackgroundColor = XLColor.LightGray;
        headerRange.Style.Border.BottomBorder = XLBorderStyleValues.Thin;
        
        // Data
        int row = 2;
        foreach (var customer in customers)
        {
            worksheet.Cell(row, 1).Value = customer.CustomerId;
            worksheet.Cell(row, 2).Value = $"{customer.FirstName} {customer.LastName}";
            worksheet.Cell(row, 3).Value = customer.Email;
            // ... más datos
            row++;
        }
        
        // Auto-fit columns
        worksheet.Columns().AdjustToContents();
        
        using (var stream = new MemoryStream())
        {
            workbook.SaveAs(stream);
            var content = stream.ToArray();
            return File(content, "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet", 
                $"Clientes_{DateTime.Now:yyyyMMdd}.xlsx");
        }
    }
}
```

#### Implementación de PDF (usando iTextSharp)
```csharp
private IActionResult ExportToPdf(List<Guest> customers)
{
    using (var stream = new MemoryStream())
    {
        var document = new Document(PageSize.A4.Rotate());
        PdfWriter.GetInstance(document, stream);
        document.Open();
        
        // Title
        var titleFont = FontFactory.GetFont(FontFactory.HELVETICA_BOLD, 18);
        var title = new Paragraph("Lista de Clientes", titleFont);
        title.Alignment = Element.ALIGN_CENTER;
        document.Add(title);
        document.Add(new Paragraph(" ")); // Space
        
        // Table
        var table = new PdfPTable(8); // Número de columnas
        table.WidthPercentage = 100;
        table.SetWidths(new float[] { 10f, 20f, 25f, 15f, 10f, 10f, 10f, 15f });
        
        // Headers
        var headerFont = FontFactory.GetFont(FontFactory.HELVETICA_BOLD, 10, BaseColor.WHITE);
        var headerBackground = new BaseColor(52, 58, 64);
        
        string[] headers = { "ID Cliente", "Nombre", "Email", "Teléfono", "País", "Estado", "Total", "Registro" };
        foreach (var header in headers)
        {
            var cell = new PdfPCell(new Phrase(header, headerFont));
            cell.BackgroundColor = headerBackground;
            cell.HorizontalAlignment = Element.ALIGN_CENTER;
            cell.Padding = 5;
            table.AddCell(cell);
        }
        
        // Data
        var dataFont = FontFactory.GetFont(FontFactory.HELVETICA, 9);
        foreach (var customer in customers)
        {
            table.AddCell(new PdfPCell(new Phrase(customer.CustomerId, dataFont)));
            table.AddCell(new PdfPCell(new Phrase($"{customer.FirstName} {customer.LastName}", dataFont)));
            // ... más celdas
        }
        
        document.Add(table);
        document.Close();
        
        return File(stream.ToArray(), "application/pdf", 
            $"Clientes_{DateTime.Now:yyyyMMdd}.pdf");
    }
}
```

#### Implementación de CSV (usando CsvHelper)
```csharp
private IActionResult ExportToCsv(List<Guest> customers)
{
    using (var stream = new MemoryStream())
    using (var writer = new StreamWriter(stream))
    using (var csv = new CsvWriter(writer, CultureInfo.InvariantCulture))
    {
        // Write records
        csv.WriteRecords(customers.Select(c => new
        {
            IDCliente = c.CustomerId,
            Nombre = $"{c.FirstName} {c.LastName}",
            Email = c.Email,
            Telefono = c.Phone ?? "-",
            Pais = c.Country ?? "-",
            Estado = c.Status,
            TotalGastado = c.TotalSpent,
            FechaRegistro = c.CreatedAt.ToString("dd/MM/yyyy")
        }));
        
        writer.Flush();
        return File(stream.ToArray(), "text/csv", 
            $"Clientes_{DateTime.Now:yyyyMMdd}.csv");
    }
}
```

### 6. Dependencias NuGet Requeridas
Agregar al archivo `.csproj`:
```xml
<PackageReference Include="ClosedXML" Version="0.105.0" />
<PackageReference Include="CsvHelper" Version="33.0.1" />
<PackageReference Include="iTextSharp" Version="5.5.13.3" />
```

### 7. Imports Necesarios en el Controller
```csharp
using System.Globalization;
using CsvHelper;
using iTextSharp.text;
using iTextSharp.text.pdf;
using ClosedXML.Excel;
```

## Checklist de Implementación

- [ ] Reemplazar el botón simple por la estructura del dropdown
- [ ] Agregar las funciones JavaScript (toggleExportMenu y export[Module])
- [ ] Agregar los estilos CSS al archivo CSS del módulo
- [ ] Agregar las traducciones para los formatos
- [ ] Crear el método Export en el controller
- [ ] Implementar los tres métodos privados de exportación
- [ ] Agregar las dependencias NuGet necesarias
- [ ] Agregar los using statements requeridos
- [ ] Probar la exportación en los tres formatos
- [ ] Verificar que funcione en dark mode

## Consideraciones Importantes

1. **Naming Convention**: Cambiar nombres según el módulo:
   - `exportCustomers` → `exportProducts`, `exportOrders`, etc.
   - `Export` action → Mantener siempre este nombre
   - ID del menu → `exportMenu` (puede mantenerse igual)

2. **Columnas del Export**: Ajustar las columnas según los datos del módulo

3. **Permisos**: El método Export hereda los permisos del controller (generalmente `[Authorize]`)

4. **Performance**: Para grandes volúmenes de datos, considerar:
   - Paginación en la exportación
   - Generación asíncrona
   - Límites de registros

5. **Localización**: Los headers de las columnas deberían idealmente usar el sistema de traducciones

## Ejemplo de Uso en Otros Módulos

### Para módulo Products:
```javascript
window.exportProducts = function(format) {
    window.location.href = '@Url.Action("Export", "Products")?format=' + format;
    document.getElementById('exportMenu').classList.remove('show');
}
```

### Para módulo Orders:
```javascript
window.exportOrders = function(format) {
    window.location.href = '@Url.Action("Export", "Orders")?format=' + format;
    document.getElementById('exportMenu').classList.remove('show');
}
```

## Troubleshooting

### El dropdown no se muestra
- Verificar que el CSS incluya `.dropdown-menu.show { display: block; }`
- Asegurar que no haya conflictos de z-index

### Error al exportar
- Verificar que las dependencias NuGet estén instaladas
- Revisar los logs para errores de serialización
- Asegurar que los datos no contengan caracteres especiales que rompan el formato

### El dropdown no se cierra al hacer clic fuera
- Verificar que el event listener global esté registrado
- Usar el optional chaining operator `?.` para evitar errores si el elemento no existe

## Notas Finales

Esta implementación está probada y funcionando en el módulo Customers. Al replicarla en otros módulos, principalmente se deben ajustar:
1. Los nombres de las funciones JavaScript
2. Las columnas de datos a exportar
3. El nombre del archivo exportado

El patrón es consistente y reutilizable en todos los módulos que requieran funcionalidad de exportación.