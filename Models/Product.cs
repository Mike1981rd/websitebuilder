using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace Hotel.Models
{
    public class Product
    {
        public int Id { get; set; }
        
        [Required]
        public string Title { get; set; }
        
        public string Description { get; set; }
        
        [Required]
        public string Handle { get; set; }
        
        public string ProductType { get; set; }
        
        public string Vendor { get; set; }
        
        public string Tags { get; set; }
        
        public string Status { get; set; } = "draft";
        
        public DateTime? PublishedAt { get; set; }
        
        // Pricing
        public decimal Price { get; set; } = 0;
        
        public decimal? CompareAtPrice { get; set; }
        
        public decimal? CostPerItem { get; set; }
        
        public bool TaxEnabled { get; set; } = true;
        
        // Inventory
        public string SKU { get; set; }
        
        public string Barcode { get; set; }
        
        public bool TrackQuantity { get; set; } = true;
        
        public bool ContinueSellingWhenOutOfStock { get; set; } = false;
        
        public int Quantity { get; set; } = 0;
        
        // Shipping
        public bool RequiresShipping { get; set; } = true;
        
        public decimal Weight { get; set; } = 0;
        
        public string WeightUnit { get; set; } = "kg";
        
        public string CountryOfOrigin { get; set; }
        
        public string HSCode { get; set; }
        
        // SEO
        public string SeoTitle { get; set; }
        
        public string SeoDescription { get; set; }
        
        // Metadata
        public DateTime CreatedAt { get; set; }
        
        public DateTime UpdatedAt { get; set; }
        
        // Navigation properties
        public ICollection<ProductImage> Images { get; set; }
        public ICollection<ProductVideo> Videos { get; set; }
        public ICollection<ProductVariant> Variants { get; set; }
        public ICollection<CollectionProduct> CollectionProducts { get; set; }
    }
}