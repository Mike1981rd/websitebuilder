using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace Hotel.Models
{
    public class ProductVariant
    {
        public int Id { get; set; }
        
        [Required]
        public int ProductId { get; set; }
        
        [Required]
        public string Title { get; set; }
        
        // Opciones de variante
        public string Option1 { get; set; }
        public string Option2 { get; set; }
        public string Option3 { get; set; }
        
        // Precios
        public decimal Price { get; set; }
        public decimal? CompareAtPrice { get; set; }
        public decimal? CostPerItem { get; set; }
        
        // Inventario
        public string SKU { get; set; }
        public string Barcode { get; set; }
        public int Quantity { get; set; } = 0;
        public bool TrackQuantity { get; set; } = true;
        
        // Envío
        public decimal Weight { get; set; } = 0;
        public string WeightUnit { get; set; } = "kg";
        
        // Metadatos Google Shopping
        public string GoogleAgeGroup { get; set; }
        public string GoogleCondition { get; set; }
        public string GoogleGender { get; set; }
        public string GoogleMPN { get; set; }
        
        // Metadata
        public int Position { get; set; } = 0;
        public DateTime CreatedAt { get; set; }
        public DateTime UpdatedAt { get; set; }
        
        // Navigation property
        public Product Product { get; set; }
    }
}