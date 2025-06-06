using System.ComponentModel.DataAnnotations;

namespace Hotel.Models
{
    public class Role
    {
        [Key]
        public int Id { get; set; }

        [Required(ErrorMessage = "El nombre del rol es requerido")]
        [Display(Name = "Nombre del Rol")]
        [StringLength(100)]
        public string Name { get; set; } = string.Empty;

        [Display(Name = "Descripción")]
        [StringLength(500)]
        public string? Description { get; set; }

        [Display(Name = "Activo")]
        public bool IsActive { get; set; } = true;

        // Navigation properties
        public ICollection<RolePermission> RolePermissions { get; set; } = new List<RolePermission>();
        
        // Timestamps
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
        public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;
    }
}