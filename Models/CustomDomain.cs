using System;
using System.ComponentModel.DataAnnotations;

namespace Hotel.Models
{
    public class CustomDomain
    {
        public int Id { get; set; }
        
        [Required]
        [MaxLength(255)]
        public string DomainName { get; set; }
        
        [Required]
        public int WebSiteId { get; set; }
        
        [MaxLength(50)]
        public string Status { get; set; } = "pending";
        
        public bool IsActive { get; set; } = false;
        
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
        
        public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;
        
        // Navigation property
        public virtual WebSite WebSite { get; set; }
    }
}