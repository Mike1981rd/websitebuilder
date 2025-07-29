using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

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
        
        // Campos nuevos - Básicos
        [Required]
        [StringLength(20)]
        public string CustomerId { get; set; } = string.Empty; // Formato: #XXXXXX
        
        [StringLength(50)]
        public string? Username { get; set; }
        
        [Column(TypeName = "text")]
        public string? ProfileImageUrl { get; set; }
        
        [Required]
        [StringLength(20)]
        public string Status { get; set; } = "Active"; // Active/Inactive/Guest
        
        [Column(TypeName = "decimal(18,2)")]
        public decimal TotalSpent { get; set; } = 0;
        
        // Campos de Seguridad
        public string? PasswordHash { get; set; }
        
        public bool TwoFactorEnabled { get; set; } = false;
        
        [StringLength(20)]
        public string? TwoFactorPhone { get; set; }
        
        public DateTime? LastLoginAt { get; set; }
        
        // Campos de Lealtad
        public int LoyaltyPoints { get; set; } = 0;
        
        [StringLength(50)]
        public string? LoyaltyTier { get; set; } // Platinum/Gold/Silver
        
        [Column(TypeName = "decimal(18,2)")]
        public decimal AccountBalance { get; set; } = 0;
        
        // Campos de Contadores
        public int WishlistCount { get; set; } = 0;
        
        public int CouponsCount { get; set; } = 0;
        
        // Campos de Auditoría
        public DateTime CreatedAt { get; set; }
        
        public DateTime? UpdatedAt { get; set; }
        
        public bool IsDeleted { get; set; } = false;
        
        public DateTime? DeletedAt { get; set; }
        
        // Navegación
        public ICollection<Reservation> Reservations { get; set; } = new List<Reservation>();
        public ICollection<CustomerAddress> Addresses { get; set; } = new List<CustomerAddress>();
        public ICollection<CustomerPaymentMethod> PaymentMethods { get; set; } = new List<CustomerPaymentMethod>();
        public ICollection<CustomerDevice> Devices { get; set; } = new List<CustomerDevice>();
        public ICollection<CustomerNotificationPreference> NotificationPreferences { get; set; } = new List<CustomerNotificationPreference>();
    }
}