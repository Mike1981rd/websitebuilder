using System.ComponentModel.DataAnnotations;

namespace Hotel.Models
{
    public class CustomerAddress
    {
        public int Id { get; set; }
        
        [Required]
        public int GuestId { get; set; }
        
        [Required]
        [StringLength(50)]
        public string Type { get; set; } = "Home"; // Home/Office/Family/Other
        
        [Required]
        [StringLength(200)]
        public string Street { get; set; } = string.Empty;
        
        [Required]
        [StringLength(100)]
        public string City { get; set; } = string.Empty;
        
        [StringLength(100)]
        public string? State { get; set; }
        
        [Required]
        [StringLength(100)]
        public string Country { get; set; } = string.Empty;
        
        [Required]
        [StringLength(20)]
        public string PostalCode { get; set; } = string.Empty;
        
        public bool IsDefault { get; set; } = false;
        
        public DateTime CreatedAt { get; set; }
        
        public DateTime? UpdatedAt { get; set; }
        
        // Navegación
        public virtual Guest Guest { get; set; } = null!;
    }
}