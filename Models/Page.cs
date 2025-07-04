using System;
using System.ComponentModel.DataAnnotations;

namespace Hotel.Models
{
    public class Page
    {
        public int Id { get; set; }
        
        // Información básica
        [Required(ErrorMessage = "El título es requerido")]
        [StringLength(200)]
        public string Title { get; set; }
        
        [StringLength(200)]
        [RegularExpression(@"^[a-z0-9-]+$", ErrorMessage = "La URL solo puede contener letras minúsculas, números y guiones")]
        public string? Handle { get; set; } = "";
        
        public string? Content { get; set; } = "";
        
        // Estado y visibilidad
        public PageStatus Status { get; set; } = PageStatus.Draft;
        public DateTime? PublishDate { get; set; }
        public bool IsVisible { get; set; } = true;
        
        // SEO
        [StringLength(160)]
        public string? MetaTitle { get; set; } = "";
        
        [StringLength(320)]
        public string? MetaDescription { get; set; } = "";
        
        // Organización
        public int DisplayOrder { get; set; } = 0;
        
        [StringLength(50)]
        public string? TemplateName { get; set; } = "default";
        
        // Auditoría
        public DateTime CreatedAt { get; set; }
        public DateTime UpdatedAt { get; set; }
        
        // Relación con Company (multi-tenant)
        public int CompanyId { get; set; }
        public Company Company { get; set; }
    }

    public enum PageStatus
    {
        Draft = 0,
        Published = 1,
        Scheduled = 2
    }
}