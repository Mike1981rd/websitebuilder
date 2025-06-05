using System.ComponentModel.DataAnnotations;

namespace Hotel.Models
{
    public class RoomType
    {
        public int Id { get; set; }
        
        [Required]
        [StringLength(50)]
        public string Name { get; set; } = string.Empty;
        
        [StringLength(200)]
        public string? Description { get; set; }
        
        [Required]
        [Range(0.01, double.MaxValue)]
        public decimal BasePrice { get; set; }
        
        [Required]
        [Range(1, 10)]
        public int MaxOccupancy { get; set; }
        
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
        
        public DateTime? UpdatedAt { get; set; }
        
        // Navegación
        public ICollection<Room> Rooms { get; set; } = new List<Room>();
    }
}