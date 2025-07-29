using System.ComponentModel.DataAnnotations;

namespace Hotel.Models
{
    public class CustomerDevice
    {
        public int Id { get; set; }
        
        [Required]
        public int GuestId { get; set; }
        
        [Required]
        [StringLength(100)]
        public string Browser { get; set; } = string.Empty; // Chrome/Firefox/Safari/Edge
        
        [Required]
        [StringLength(100)]
        public string Device { get; set; } = string.Empty; // HP Spectre 360/iPhone 12x/etc
        
        [StringLength(100)]
        public string? OperatingSystem { get; set; } // Windows/macOS/iOS/Android
        
        [Required]
        [StringLength(100)]
        public string Location { get; set; } = string.Empty; // Switzerland/Australia/etc
        
        [StringLength(50)]
        public string? IpAddress { get; set; }
        
        public DateTime LastActivity { get; set; }
        
        public DateTime CreatedAt { get; set; }
        
        // Navegación
        public virtual Guest Guest { get; set; } = null!;
    }
}