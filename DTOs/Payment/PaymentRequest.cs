using System.ComponentModel.DataAnnotations;

namespace Hotel.DTOs.Payment
{
    public class PaymentRequest
    {
        [Required]
        public string OrderId { get; set; } = string.Empty;
        
        [Required]
        [Range(0.01, double.MaxValue)]
        public decimal Amount { get; set; }
        
        public decimal Tax { get; set; }
        
        [Required]
        [CreditCard]
        public string CardNumber { get; set; } = string.Empty;
        
        [Required]
        [RegularExpression(@"^\d{2}/\d{2}$", ErrorMessage = "Format must be MM/YY")]
        public string CardExpiry { get; set; } = string.Empty;
        
        [Required]
        [StringLength(4, MinimumLength = 3)]
        public string CardCvc { get; set; } = string.Empty;
        
        [Required]
        public string CardHolderName { get; set; } = string.Empty;
        
        public CustomerInfo Customer { get; set; } = new CustomerInfo();
        
        public bool SaveCard { get; set; }
        
        public string? SavedCardToken { get; set; }
        
        // For reservation context
        public int? ReservationId { get; set; }
    }
    
    public class CustomerInfo
    {
        public string FirstName { get; set; } = string.Empty;
        public string LastName { get; set; } = string.Empty;
        public string Email { get; set; } = string.Empty;
        public string? Phone { get; set; }
        public string? Address { get; set; }
        public string? City { get; set; }
        public string? Country { get; set; }
        public string? PostalCode { get; set; }
    }
}