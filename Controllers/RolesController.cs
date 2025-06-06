using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
using Microsoft.EntityFrameworkCore;
using Hotel.Data;
using Hotel.Models;
using System.Linq;

namespace Hotel.Controllers
{
    [Authorize]
    public class RolesController : Controller
    {
        private readonly HotelDbContext _context;

        public RolesController(HotelDbContext context)
        {
            _context = context;
        }

        // GET: Roles
        public async Task<IActionResult> Index()
        {
            var roles = await _context.Roles
                .Include(r => r.RolePermissions)
                .ThenInclude(rp => rp.Permission)
                .OrderBy(r => r.Name)
                .ToListAsync();

            // Get users for each role
            var roleUsers = new Dictionary<int, List<User>>();
            var userCounts = new Dictionary<int, int>();

            foreach (var role in roles)
            {
                var users = await _context.Users
                    .Where(u => u.RoleId == role.Id && u.IsActive)
                    .Take(4) // Solo tomar los primeros 4 usuarios para mostrar
                    .ToListAsync();
                
                roleUsers[role.Id] = users;
                userCounts[role.Id] = await _context.Users.CountAsync(u => u.RoleId == role.Id);
            }

            ViewBag.RoleUsers = roleUsers;
            ViewBag.UserCounts = userCounts;

            return View(roles);
        }

        // GET: Roles/Create
        public async Task<IActionResult> Create()
        {
            ViewBag.Permissions = await GetGroupedPermissions();
            return View(new Role());
        }

        // POST: Roles/Create
        [HttpPost]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> Create(Role role, int[] selectedPermissions)
        {
            if (ModelState.IsValid)
            {
                try
                {
                    _context.Add(role);
                    await _context.SaveChangesAsync();

                    // Add permissions
                    if (selectedPermissions != null && selectedPermissions.Length > 0)
                    {
                        foreach (var permissionId in selectedPermissions)
                        {
                            _context.RolePermissions.Add(new RolePermission
                            {
                                RoleId = role.Id,
                                PermissionId = permissionId
                            });
                        }
                        await _context.SaveChangesAsync();
                    }

                    TempData["SuccessMessage"] = "El rol se ha creado correctamente.";
                    return RedirectToAction(nameof(Index));
                }
                catch (Exception ex)
                {
                    TempData["ErrorMessage"] = "Error al crear el rol.";
                    ModelState.AddModelError("", "Error: " + ex.Message);
                }
            }

            ViewBag.Permissions = await GetGroupedPermissions();
            return View(role);
        }

        // GET: Roles/Edit/5
        public async Task<IActionResult> Edit(int? id)
        {
            if (id == null)
            {
                return NotFound();
            }

            var role = await _context.Roles
                .Include(r => r.RolePermissions)
                .FirstOrDefaultAsync(r => r.Id == id);

            if (role == null)
            {
                return NotFound();
            }

            ViewBag.Permissions = await GetGroupedPermissions();
            ViewBag.SelectedPermissions = role.RolePermissions.Select(rp => rp.PermissionId).ToList();
            
            return View(role);
        }

        // POST: Roles/Edit/5
        [HttpPost]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> Edit(int id, Role role, int[] selectedPermissions)
        {
            if (id != role.Id)
            {
                return NotFound();
            }

            if (ModelState.IsValid)
            {
                try
                {
                    var existingRole = await _context.Roles
                        .Include(r => r.RolePermissions)
                        .FirstOrDefaultAsync(r => r.Id == id);

                    if (existingRole == null)
                    {
                        return NotFound();
                    }

                    // Update role properties
                    existingRole.Name = role.Name;
                    existingRole.Description = role.Description;
                    existingRole.IsActive = role.IsActive;
                    existingRole.UpdatedAt = DateTime.UtcNow;

                    // Remove existing permissions
                    _context.RolePermissions.RemoveRange(existingRole.RolePermissions);

                    // Add new permissions
                    if (selectedPermissions != null && selectedPermissions.Length > 0)
                    {
                        foreach (var permissionId in selectedPermissions)
                        {
                            _context.RolePermissions.Add(new RolePermission
                            {
                                RoleId = role.Id,
                                PermissionId = permissionId
                            });
                        }
                    }

                    await _context.SaveChangesAsync();
                    TempData["SuccessMessage"] = "El rol se ha actualizado correctamente.";
                    return RedirectToAction(nameof(Index));
                }
                catch (DbUpdateConcurrencyException)
                {
                    if (!RoleExists(role.Id))
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
                    TempData["ErrorMessage"] = "Error al actualizar el rol.";
                    ModelState.AddModelError("", "Error: " + ex.Message);
                }
            }

            ViewBag.Permissions = await GetGroupedPermissions();
            ViewBag.SelectedPermissions = selectedPermissions?.ToList() ?? new List<int>();
            
            return View(role);
        }

        // POST: Roles/Delete/5
        [HttpPost]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> Delete(int id)
        {
            try
            {
                var role = await _context.Roles.FindAsync(id);
                if (role != null)
                {
                    // Verificar si el rol tiene usuarios asignados
                    var hasUsers = await _context.Users.AnyAsync(u => u.RoleId == id);
                    if (hasUsers)
                    {
                        TempData["ErrorMessage"] = "No se puede eliminar este rol porque tiene usuarios asignados. Primero debe reasignar o eliminar los usuarios.";
                        return RedirectToAction(nameof(Index));
                    }

                    _context.Roles.Remove(role);
                    await _context.SaveChangesAsync();
                    TempData["SuccessMessage"] = "El rol se ha eliminado correctamente.";
                }
            }
            catch (Exception)
            {
                TempData["ErrorMessage"] = "Error al eliminar el rol. Es posible que esté siendo utilizado.";
            }

            return RedirectToAction(nameof(Index));
        }

        private bool RoleExists(int id)
        {
            return _context.Roles.Any(e => e.Id == id);
        }

        private async Task<Dictionary<string, List<Permission>>> GetGroupedPermissions()
        {
            var permissions = await _context.Permissions
                .OrderBy(p => p.DisplayOrder)
                .ThenBy(p => p.Module)
                .ToListAsync();

            return permissions
                .GroupBy(p => p.Module)
                .ToDictionary(g => g.Key, g => g.ToList());
        }
    }
}