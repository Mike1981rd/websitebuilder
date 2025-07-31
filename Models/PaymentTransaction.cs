using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Hotel.Models
{
    public class PaymentTransaction
    {
        public int Id { get; set; }
        
        [Required]
        [MaxLength(50)]
        public string Gateway { get; set; } = string.Empty;
        
        [MaxLength(100)]
        public string? TransactionId { get; set; }
        
        [Required]
        [MaxLength(100)]
        public string OrderId { get; set; } = string.Empty;
        
        public int? ReservationId { get; set; }
        
        [Column(TypeName = "decimal(18,2)")]
        public decimal Amount { get; set; }
        
        [Column(TypeName = "decimal(18,2)")]
        public decimal Tax { get; set; }
        
        [MaxLength(3)]
        public string Currency { get; set; } = "DOP";
        
        [Required]
        [MaxLength(50)]
        public string Status { get; set; } = string.Empty;
        
        [MaxLength(10)]
        public string? ResponseCode { get; set; }
        
        [MaxLength(255)]
        public string? ResponseMessage { get; set; }
        
        [MaxLength(50)]
        public string? AuthorizationCode { get; set; }
        
        [MaxLength(4)]
        public string? CardLastFour { get; set; }
        
        [MaxLength(20)]
        public string? CardType { get; set; }
        
        public string? RequestJson { get; set; }
        
        public string? ResponseJson { get; set; }
        
        public DateTime CreatedAt { get; set; }
        
        // Navigation property
        public virtual Reservation? Reservation { get; set; }
    }
}