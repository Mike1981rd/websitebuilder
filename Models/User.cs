using System.ComponentModel.DataAnnotations;

namespace Hotel.Models
{
    public class User
    {
        public int Id { get; set; }
        
        [Required(ErrorMessage = "El nombre completo es requerido")]
        [StringLength(100, ErrorMessage = "El nombre no puede exceder 100 caracteres")]
        public string FullName { get; set; } = string.Empty;
        
        [Required(ErrorMessage = "El nombre de usuario es requerido")]
        [StringLength(50, ErrorMessage = "El nombre de usuario no puede exceder 50 caracteres")]
        public string UserName { get; set; } = string.Empty;
        
        [Required(ErrorMessage = "El correo electrónico es requerido")]
        [EmailAddress(ErrorMessage = "El correo electrónico no es válido")]
        [StringLength(100, ErrorMessage = "El correo no puede exceder 100 caracteres")]
        public string Email { get; set; } = string.Empty;
        
        // Campo para la imagen de perfil
        public string? ProfileImagePath { get; set; }
        
        [Required(ErrorMessage = "La contraseña es requerida")]
        [StringLength(255)]
        public string PasswordHash { get; set; } = string.Empty;
        
        public int? RoleId { get; set; }
        public virtual Role? Role { get; set; }
        
        public bool IsActive { get; set; } = true;
        
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
        public DateTime? UpdatedAt { get; set; }
    }
}