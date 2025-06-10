using System.ComponentModel.DataAnnotations;

namespace Hotel.Models
{
    public class WebSite
    {
        [Key]
        public int Id { get; set; }

        [Required]
        public int CompanyId { get; set; }

        [Required]
        [StringLength(100)]
        public string Name { get; set; } = string.Empty;

        [Required]
        [StringLength(100)]
        public string Subdomain { get; set; } = string.Empty;

        [StringLength(255)]
        public string? CustomDomain { get; set; }

        public bool IsActive { get; set; } = true;

        public bool IsPublished { get; set; } = false;

        [Required]
        [StringLength(50)]
        public string Template { get; set; } = "default";

        // JSON storage for theme settings - default to empty object
        public string GlobalThemeSettingsJson { get; set; } = "{}";

        // JSON storage for pages
        public string PagesJson { get; set; } = "[]";

        // JSON storage for navigation
        public string NavigationJson { get; set; } = "[]";

        // JSON storage for SEO settings
        public string SeoSettingsJson { get; set; } = "{}";

        // Timestamps
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
        public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;
        public DateTime? PublishedAt { get; set; }

        // Navigation property
        public Company Company { get; set; } = null!;
    }
}