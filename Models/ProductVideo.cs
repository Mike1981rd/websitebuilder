using System;
using System.ComponentModel.DataAnnotations;

namespace Hotel.Models
{
    public class ProductVideo
    {
        public int Id { get; set; }
        
        [Required]
        public int ProductId { get; set; }
        
        [Required]
        public string VideoUrl { get; set; }
        
        public string VideoType { get; set; } = "youtube"; // youtube, vimeo, mp4
        
        public string ThumbnailUrl { get; set; }
        
        public int Duration { get; set; } = 0; // en segundos
        
        public int Position { get; set; } = 0;
        
        public string Title { get; set; }
        
        public DateTime CreatedAt { get; set; }
        
        // Navigation property
        public Product Product { get; set; }
    }
}