using System.ComponentModel.DataAnnotations;

namespace Hotel.Models
{
    public class CustomerNotificationPreference
    {
        public int Id { get; set; }
        
        [Required]
        public int GuestId { get; set; }
        
        [Required]
        [StringLength(50)]
        public string Type { get; set; } = string.Empty; // NewForYou/AccountActivity/NewBrowserUsed/NewDeviceLinked
        
        public bool EmailEnabled { get; set; } = true;
        
        public bool BrowserEnabled { get; set; } = true;
        
        public bool AppEnabled { get; set; } = true;
        
        public DateTime CreatedAt { get; set; }
        
        public DateTime? UpdatedAt { get; set; }
        
        // Navegación
        public virtual Guest Guest { get; set; } = null!;
    }
}