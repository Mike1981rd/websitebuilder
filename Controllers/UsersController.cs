using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Hotel.Data;
using Hotel.Models;
using System.Security.Cryptography;
using System.Text;
using ClosedXML.Excel;
using QuestPDF.Fluent;
using QuestPDF.Helpers;
using QuestPDF.Infrastructure;

namespace Hotel.Controllers
{
    public class UsersController : Controller
    {
        private readonly HotelDbContext _context;
        private readonly IWebHostEnvironment _environment;

        public UsersController(HotelDbContext context, IWebHostEnvironment environment)
        {
            _context = context;
            _environment = environment;
        }

        // GET: Users/GetAll (AJAX)
        [HttpGet]
        public async Task<IActionResult> GetAll()
        {
            var users = await _context.Users
                .Include(u => u.Role)
                .Select(u => new
                {
                    u.Id,
                    u.FullName,
                    u.UserName,
                    u.Email,
                    u.ProfileImagePath,
                    RoleId = u.RoleId,
                    RoleName = u.Role != null ? u.Role.Name : "Sin rol",
                    u.IsActive,
                    u.CreatedAt
                })
                .ToListAsync();

            return Json(users);
        }

        // GET: Users/Get/5 (AJAX)
        [HttpGet]
        public async Task<IActionResult> Get(int id)
        {
            var user = await _context.Users
                .Where(u => u.Id == id)
                .Select(u => new
                {
                    u.Id,
                    u.FullName,
                    u.UserName,
                    u.Email,
                    u.ProfileImagePath,
                    u.RoleId,
                    u.IsActive
                })
                .FirstOrDefaultAsync();

            if (user == null)
            {
                return NotFound();
            }

            return Json(user);
        }

        // POST: Users/Create (AJAX)
        [HttpPost]
        public async Task<IActionResult> Create([FromBody] UserCreateDto dto)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            // Verificar si el email ya existe
            if (await _context.Users.AnyAsync(u => u.Email == dto.Email))
            {
                return BadRequest(new { message = "El correo electrónico ya está registrado" });
            }

            // Verificar si el username ya existe
            if (await _context.Users.AnyAsync(u => u.UserName == dto.UserName))
            {
                return BadRequest(new { message = "El nombre de usuario ya está registrado" });
            }

            var user = new User
            {
                FullName = dto.FullName,
                UserName = dto.UserName,
                Email = dto.Email,
                PasswordHash = HashPassword(dto.Password),
                RoleId = dto.RoleId,
                IsActive = dto.IsActive,
                ProfileImagePath = dto.ProfileImagePath,
                CreatedAt = DateTime.UtcNow
            };

            _context.Users.Add(user);
            await _context.SaveChangesAsync();

            return Json(new { success = true, message = "Usuario creado exitosamente" });
        }

        // POST: Users/Update (AJAX)
        [HttpPost]
        public async Task<IActionResult> Update([FromBody] UserUpdateDto dto)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var user = await _context.Users.FindAsync(dto.Id);
            if (user == null)
            {
                return NotFound();
            }

            // Verificar si el email ya existe en otro usuario
            if (await _context.Users.AnyAsync(u => u.Email == dto.Email && u.Id != dto.Id))
            {
                return BadRequest(new { message = "El correo electrónico ya está registrado" });
            }

            // Verificar si el username ya existe en otro usuario
            if (await _context.Users.AnyAsync(u => u.UserName == dto.UserName && u.Id != dto.Id))
            {
                return BadRequest(new { message = "El nombre de usuario ya está registrado" });
            }

            user.FullName = dto.FullName;
            user.UserName = dto.UserName;
            user.Email = dto.Email;
            user.RoleId = dto.RoleId;
            user.IsActive = dto.IsActive;
            user.UpdatedAt = DateTime.UtcNow;

            // Actualizar imagen si se proporciona
            if (!string.IsNullOrEmpty(dto.ProfileImagePath))
            {
                user.ProfileImagePath = dto.ProfileImagePath;
            }

            // Solo actualizar contraseña si se proporciona una nueva
            if (!string.IsNullOrEmpty(dto.Password))
            {
                user.PasswordHash = HashPassword(dto.Password);
            }

            await _context.SaveChangesAsync();

            return Json(new { success = true, message = "Usuario actualizado exitosamente" });
        }

        // POST: Users/ToggleStatus/5 (AJAX)
        [HttpPost]
        public async Task<IActionResult> ToggleStatus(int id)
        {
            var user = await _context.Users.FindAsync(id);
            if (user == null)
            {
                return NotFound();
            }

            user.IsActive = !user.IsActive;
            user.UpdatedAt = DateTime.UtcNow;
            await _context.SaveChangesAsync();

            return Json(new 
            { 
                success = true, 
                message = user.IsActive ? "Usuario activado" : "Usuario desactivado",
                isActive = user.IsActive
            });
        }

        // POST: Users/Delete/5 (AJAX)
        [HttpPost]
        public async Task<IActionResult> Delete(int id)
        {
            var user = await _context.Users.FindAsync(id);
            if (user == null)
            {
                return NotFound();
            }

            _context.Users.Remove(user);
            await _context.SaveChangesAsync();

            return Json(new { success = true, message = "Usuario eliminado exitosamente" });
        }

        // POST: Users/UploadImage (AJAX)
        [HttpPost]
        public async Task<IActionResult> UploadImage(IFormFile file)
        {
            if (file == null || file.Length == 0)
            {
                return BadRequest(new { message = "No se proporcionó ningún archivo" });
            }

            // Validar tipo de archivo
            var allowedTypes = new[] { "image/jpeg", "image/jpg", "image/png", "image/webp" };
            if (!allowedTypes.Contains(file.ContentType.ToLower()))
            {
                return BadRequest(new { message = "Tipo de archivo no permitido. Solo se permiten JPG, PNG y WebP" });
            }

            // Validar tamaño (max 5MB)
            if (file.Length > 5 * 1024 * 1024)
            {
                return BadRequest(new { message = "El archivo no debe superar los 5MB" });
            }

            try
            {
                // Crear directorio si no existe
                var uploadsFolder = Path.Combine(_environment.WebRootPath, "uploads", "profiles");
                if (!Directory.Exists(uploadsFolder))
                {
                    Directory.CreateDirectory(uploadsFolder);
                }

                // Generar nombre único
                var fileName = $"{Guid.NewGuid()}_{Path.GetFileName(file.FileName)}";
                var filePath = Path.Combine(uploadsFolder, fileName);

                // Guardar archivo
                using (var fileStream = new FileStream(filePath, FileMode.Create))
                {
                    await file.CopyToAsync(fileStream);
                }

                // Retornar ruta relativa
                var relativePath = $"/uploads/profiles/{fileName}";
                return Json(new { success = true, path = relativePath });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Error al cargar la imagen", error = ex.Message });
            }
        }

        // GET: Users/Export (AJAX)
        [HttpGet]
        public async Task<IActionResult> Export(string format)
        {
            var users = await _context.Users
                .Include(u => u.Role)
                .Select(u => new UserExportDto
                {
                    FullName = u.FullName,
                    UserName = u.UserName,
                    Email = u.Email,
                    RoleName = u.Role != null ? u.Role.Name : "Sin rol",
                    Status = u.IsActive ? "Activo" : "Inactivo",
                    CreatedAt = u.CreatedAt.ToString("dd/MM/yyyy")
                })
                .ToListAsync();

            switch (format?.ToLower())
            {
                case "excel":
                    return ExportToExcel(users);
                case "pdf":
                    return ExportToPdf(users);
                case "csv":
                    return ExportToCsv(users);
                default:
                    return BadRequest("Formato no válido");
            }
        }

        private IActionResult ExportToExcel(List<UserExportDto> users)
        {
            using (var workbook = new XLWorkbook())
            {
                var worksheet = workbook.Worksheets.Add("Usuarios");

                // Headers
                worksheet.Cell(1, 1).Value = "Nombre Completo";
                worksheet.Cell(1, 2).Value = "Nombre de Usuario";
                worksheet.Cell(1, 3).Value = "Correo Electrónico";
                worksheet.Cell(1, 4).Value = "Rol";
                worksheet.Cell(1, 5).Value = "Estado";
                worksheet.Cell(1, 6).Value = "Fecha de Creación";

                // Style headers
                var headerRange = worksheet.Range(1, 1, 1, 6);
                headerRange.Style.Font.Bold = true;
                headerRange.Style.Fill.BackgroundColor = XLColor.FromHtml("#e91e63");
                headerRange.Style.Font.FontColor = XLColor.White;

                // Data
                int row = 2;
                foreach (var user in users)
                {
                    worksheet.Cell(row, 1).Value = user.FullName;
                    worksheet.Cell(row, 2).Value = user.UserName;
                    worksheet.Cell(row, 3).Value = user.Email;
                    worksheet.Cell(row, 4).Value = user.RoleName;
                    worksheet.Cell(row, 5).Value = user.Status;
                    worksheet.Cell(row, 6).Value = user.CreatedAt;
                    row++;
                }

                // Autofit columns
                worksheet.Columns().AdjustToContents();

                using (var stream = new MemoryStream())
                {
                    workbook.SaveAs(stream);
                    return File(stream.ToArray(), "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet", $"usuarios_{DateTime.Now:yyyyMMdd}.xlsx");
                }
            }
        }

        private IActionResult ExportToPdf(List<UserExportDto> users)
        {
            QuestPDF.Settings.License = LicenseType.Community;
            
            var document = Document.Create(container =>
            {
                container.Page(page =>
                {
                    page.Size(PageSizes.A4);
                    page.Margin(2, Unit.Centimetre);
                    page.PageColor(Colors.White);
                    
                    page.Header()
                        .Text("Lista de Usuarios")
                        .SemiBold().FontSize(20).FontColor(Colors.Blue.Medium);
                    
                    page.Content()
                        .PaddingVertical(1, Unit.Centimetre)
                        .Table(table =>
                        {
                            // Define columns
                            table.ColumnsDefinition(columns =>
                            {
                                columns.RelativeColumn(3);
                                columns.RelativeColumn(2);
                                columns.RelativeColumn(3);
                                columns.RelativeColumn(2);
                                columns.RelativeColumn(1.5f);
                                columns.RelativeColumn(2);
                            });
                            
                            // Header
                            table.Header(header =>
                            {
                                header.Cell().Background("#e91e63").PaddingVertical(5).Text("Nombre Completo").FontColor(Colors.White);
                                header.Cell().Background("#e91e63").PaddingVertical(5).Text("Usuario").FontColor(Colors.White);
                                header.Cell().Background("#e91e63").PaddingVertical(5).Text("Email").FontColor(Colors.White);
                                header.Cell().Background("#e91e63").PaddingVertical(5).Text("Rol").FontColor(Colors.White);
                                header.Cell().Background("#e91e63").PaddingVertical(5).Text("Estado").FontColor(Colors.White);
                                header.Cell().Background("#e91e63").PaddingVertical(5).Text("Fecha").FontColor(Colors.White);
                            });
                            
                            // Content
                            foreach (var user in users)
                            {
                                table.Cell().BorderBottom(1).BorderColor(Colors.Grey.Lighten2).PaddingVertical(5).Text(user.FullName);
                                table.Cell().BorderBottom(1).BorderColor(Colors.Grey.Lighten2).PaddingVertical(5).Text(user.UserName);
                                table.Cell().BorderBottom(1).BorderColor(Colors.Grey.Lighten2).PaddingVertical(5).Text(user.Email).FontSize(10);
                                table.Cell().BorderBottom(1).BorderColor(Colors.Grey.Lighten2).PaddingVertical(5).Text(user.RoleName);
                                table.Cell().BorderBottom(1).BorderColor(Colors.Grey.Lighten2).PaddingVertical(5).Text(user.Status);
                                table.Cell().BorderBottom(1).BorderColor(Colors.Grey.Lighten2).PaddingVertical(5).Text(user.CreatedAt);
                            }
                        });
                    
                    page.Footer()
                        .AlignCenter()
                        .Text(x =>
                        {
                            x.Span("Página ");
                            x.CurrentPageNumber();
                            x.Span(" de ");
                            x.TotalPages();
                        });
                });
            });

            var pdf = document.GeneratePdf();
            return File(pdf, "application/pdf", $"usuarios_{DateTime.Now:yyyyMMdd}.pdf");
        }

        private IActionResult ExportToCsv(List<UserExportDto> users)
        {
            var csv = new StringBuilder();
            csv.AppendLine("Nombre Completo,Nombre de Usuario,Correo Electrónico,Rol,Estado,Fecha de Creación");

            foreach (var user in users)
            {
                csv.AppendLine($"{user.FullName},{user.UserName},{user.Email},{user.RoleName},{user.Status},{user.CreatedAt}");
            }

            return File(Encoding.UTF8.GetBytes(csv.ToString()), "text/csv", $"usuarios_{DateTime.Now:yyyyMMdd}.csv");
        }

        private string HashPassword(string password)
        {
            using (SHA256 sha256Hash = SHA256.Create())
            {
                byte[] bytes = sha256Hash.ComputeHash(Encoding.UTF8.GetBytes(password));
                StringBuilder builder = new StringBuilder();
                for (int i = 0; i < bytes.Length; i++)
                {
                    builder.Append(bytes[i].ToString("x2"));
                }
                return builder.ToString();
            }
        }
    }

    public class UserCreateDto
    {
        public string FullName { get; set; } = string.Empty;
        public string UserName { get; set; } = string.Empty;
        public string Email { get; set; } = string.Empty;
        public string Password { get; set; } = string.Empty;
        public int? RoleId { get; set; }
        public bool IsActive { get; set; } = true;
        public string? ProfileImagePath { get; set; }
    }

    public class UserUpdateDto
    {
        public int Id { get; set; }
        public string FullName { get; set; } = string.Empty;
        public string UserName { get; set; } = string.Empty;
        public string Email { get; set; } = string.Empty;
        public string? Password { get; set; }
        public int? RoleId { get; set; }
        public bool IsActive { get; set; }
        public string? ProfileImagePath { get; set; }
    }

    public class UserExportDto
    {
        public string FullName { get; set; } = string.Empty;
        public string UserName { get; set; } = string.Empty;
        public string Email { get; set; } = string.Empty;
        public string RoleName { get; set; } = string.Empty;
        public string Status { get; set; } = string.Empty;
        public string CreatedAt { get; set; } = string.Empty;
    }
}