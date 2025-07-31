using System;
using System.ComponentModel.DataAnnotations;

namespace Hotel.Models
{
    public class PaymentGateway
    {
        public int Id { get; set; }
        
        [Required]
        [MaxLength(100)]
        public string Name { get; set; } = string.Empty;
        
        [Required]
        [MaxLength(50)]
        public string Provider { get; set; } = string.Empty;
        
        public bool IsActive { get; set; }
        
        public bool IsTestMode { get; set; } = true;
        
        public string? ConfigurationJson { get; set; }
        
        [MaxLength(255)]
        public string? CertificateFileName { get; set; }
        
        [MaxLength(255)]
        public string? CertificateKeyFileName { get; set; }
        
        public DateTime CreatedAt { get; set; }
        
        public DateTime? UpdatedAt { get; set; }
    }
}