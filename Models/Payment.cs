using System.ComponentModel.DataAnnotations;

namespace Hotel.Models
{
    public class Payment
    {
        public int Id { get; set; }
        
        [Required]
        public int ReservationId { get; set; }
        
        public Reservation Reservation { get; set; } = null!;
        
        [Required]
        [Range(0.01, double.MaxValue)]
        public decimal Amount { get; set; }
        
        [Required]
        public DateTime PaymentDate { get; set; }
        
        [Required]
        [StringLength(50)]
        public string PaymentMethod { get; set; } = string.Empty; // Efectivo, TarjetaCredito, TarjetaDebito, Transferencia
        
        [StringLength(100)]
        public string? TransactionReference { get; set; }
        
        [Required]
        [StringLength(20)]
        public string Status { get; set; } = "Completado"; // Pendiente, Completado, Rechazado, Reembolsado
        
        [StringLength(500)]
        public string? Notes { get; set; }
        
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
        
        public DateTime? UpdatedAt { get; set; }
    }
}