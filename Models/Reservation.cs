using System.ComponentModel.DataAnnotations;

namespace Hotel.Models
{
    public class Reservation
    {
        public int Id { get; set; }
        
        [Required]
        public int GuestId { get; set; }
        
        public Guest Guest { get; set; } = null!;
        
        [Required]
        public int RoomId { get; set; }
        
        public Room Room { get; set; } = null!;
        
        [Required]
        public DateTime CheckInDate { get; set; }
        
        [Required]
        public DateTime CheckOutDate { get; set; }
        
        public DateTime? ActualCheckInDate { get; set; }
        
        public DateTime? ActualCheckOutDate { get; set; }
        
        [Required]
        [Range(1, 10)]
        public int NumberOfGuests { get; set; }
        
        [Required]
        [Range(0.01, double.MaxValue)]
        public decimal TotalAmount { get; set; }
        
        [Required]
        [StringLength(20)]
        public string Status { get; set; } = "Pendiente"; // Pendiente, Confirmada, EnProgreso, Completada, Cancelada
        
        [StringLength(500)]
        public string? SpecialRequests { get; set; }
        
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
        
        public DateTime? UpdatedAt { get; set; }
        
        // Navegación
        public ICollection<Payment> Payments { get; set; } = new List<Payment>();
    }
}