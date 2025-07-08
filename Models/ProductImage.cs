using System;
using System.ComponentModel.DataAnnotations;

namespace Hotel.Models
{
    public class ProductImage
    {
        public int Id { get; set; }
        
        [Required]
        public int ProductId { get; set; }
        
        [Required]
        public string ImageUrl { get; set; }
        
        public int Position { get; set; } = 0;
        
        public string AltText { get; set; }
        
        public DateTime CreatedAt { get; set; }
        
        // Navigation property
        public Product Product { get; set; }
    }
}