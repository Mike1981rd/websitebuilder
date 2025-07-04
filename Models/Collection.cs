using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Hotel.Models
{
    public class Collection
    {
        public int Id { get; set; }

        [Required(ErrorMessage = "El título es requerido")]
        [StringLength(255, ErrorMessage = "El título no puede exceder 255 caracteres")]
        [Display(Name = "Título")]
        public string Title { get; set; }

        [Display(Name = "Descripción")]
        [DataType(DataType.Html)]
        public string? Description { get; set; } = "";

        [StringLength(255)]
        [Display(Name = "Handle")]
        public string? Handle { get; set; } = ""; // URL slug único

        [Display(Name = "URL de imagen")]
        [Column(TypeName = "text")]
        public string? ImageUrl { get; set; } = "";

        [Display(Name = "Activa")]
        public bool IsActive { get; set; } = true;

        [Display(Name = "Orden de productos")]
        [StringLength(50)]
        public string SortOrder { get; set; } = "manual"; // Para ordenar productos dentro

        // SEO
        [Display(Name = "Título SEO")]
        [StringLength(60, ErrorMessage = "El título SEO no puede exceder 60 caracteres")]
        public string? SeoTitle { get; set; } = "";

        [Display(Name = "Descripción SEO")]
        [StringLength(160, ErrorMessage = "La descripción SEO no puede exceder 160 caracteres")]
        public string? SeoDescription { get; set; } = "";

        // Canales de venta (JSON array)
        [Display(Name = "Canales de venta")]
        [Column(TypeName = "jsonb")]
        public string SalesChannels { get; set; } = "[\"tienda-online\"]";

        // Auditoría
        [Display(Name = "Fecha de creación")]
        public DateTime CreatedAt { get; set; }

        [Display(Name = "Fecha de actualización")]
        public DateTime UpdatedAt { get; set; }

        // Navegación (se usará cuando creemos Product)
        public virtual ICollection<CollectionProduct> CollectionProducts { get; set; } = new List<CollectionProduct>();
    }

    // Modelo para la relación muchos a muchos (simplificado por ahora)
    public class CollectionProduct
    {
        public int CollectionId { get; set; }
        public int ProductId { get; set; }
        
        [Display(Name = "Posición")]
        public int Position { get; set; } = 0;

        // Navegación
        public virtual Collection Collection { get; set; }
        // Product se agregará cuando creemos el modelo Product
    }
}