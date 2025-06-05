using System.ComponentModel.DataAnnotations;

namespace Hotel.Models
{
    public class Room
    {
        public int Id { get; set; }
        
        [Required]
        [StringLength(10)]
        public string RoomNumber { get; set; } = string.Empty;
        
        [Required]
        public int RoomTypeId { get; set; }
        
        public RoomType RoomType { get; set; } = null!;
        
        [Required]
        public int Floor { get; set; }
        
        public string? Description { get; set; }
        
        public bool IsAvailable { get; set; } = true;
        
        public bool IsClean { get; set; } = true;
        
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
        
        public DateTime? UpdatedAt { get; set; }
        
        // Navegación
        public ICollection<Reservation> Reservations { get; set; } = new List<Reservation>();
    }
}