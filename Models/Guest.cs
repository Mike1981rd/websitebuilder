using System.ComponentModel.DataAnnotations;

namespace Hotel.Models
{
    public class Guest
    {
        public int Id { get; set; }
        
        [Required]
        [StringLength(100)]
        public string FirstName { get; set; } = string.Empty;
        
        [Required]
        [StringLength(100)]
        public string LastName { get; set; } = string.Empty;
        
        [Required]
        [EmailAddress]
        [StringLength(200)]
        public string Email { get; set; } = string.Empty;
        
        [Phone]
        [StringLength(20)]
        public string? Phone { get; set; }
        
        [StringLength(50)]
        public string? DocumentType { get; set; }
        
        [StringLength(50)]
        public string? DocumentNumber { get; set; }
        
        [StringLength(200)]
        public string? Address { get; set; }
        
        [StringLength(100)]
        public string? City { get; set; }
        
        [StringLength(100)]
        public string? Country { get; set; }
        
        [StringLength(20)]
        public string? PostalCode { get; set; }
        
        public DateTime? DateOfBirth { get; set; }
        
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
        
        public DateTime? UpdatedAt { get; set; }
        
        // Navegación
        public ICollection<Reservation> Reservations { get; set; } = new List<Reservation>();
    }
}