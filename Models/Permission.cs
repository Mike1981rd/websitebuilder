using System.ComponentModel.DataAnnotations;

namespace Hotel.Models
{
    public class Permission
    {
        [Key]
        public int Id { get; set; }

        [Required]
        [Display(Name = "Módulo")]
        [StringLength(100)]
        public string Module { get; set; } = string.Empty;

        [Required]
        [Display(Name = "Acción")]
        [StringLength(50)]
        public string Action { get; set; } = string.Empty; // Read, Write, Create

        [Display(Name = "Descripción")]
        [StringLength(200)]
        public string? Description { get; set; }

        [Display(Name = "Orden")]
        public int DisplayOrder { get; set; }

        // Navigation properties
        public ICollection<RolePermission> RolePermissions { get; set; } = new List<RolePermission>();
    }
}