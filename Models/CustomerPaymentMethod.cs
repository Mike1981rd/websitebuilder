using System.ComponentModel.DataAnnotations;

namespace Hotel.Models
{
    public class CustomerPaymentMethod
    {
        public int Id { get; set; }
        
        [Required]
        public int GuestId { get; set; }
        
        [Required]
        [StringLength(50)]
        public string Type { get; set; } = "Card"; // Card/Bank/PayPal/Other
        
        [StringLength(50)]
        public string? CardType { get; set; } // Visa/Mastercard/Amex
        
        [Required]
        [StringLength(4)]
        public string LastFourDigits { get; set; } = string.Empty;
        
        [Required]
        [StringLength(100)]
        public string HolderName { get; set; } = string.Empty;
        
        public DateTime? ExpiryDate { get; set; }
        
        public bool IsDefault { get; set; } = false;
        
        [StringLength(100)]
        public string? BankName { get; set; }
        
        [StringLength(50)]
        public string? AccountType { get; set; } // Checking/Savings
        
        public DateTime CreatedAt { get; set; }
        
        public DateTime? UpdatedAt { get; set; }
        
        // Navegación
        public virtual Guest Guest { get; set; } = null!;
    }
}