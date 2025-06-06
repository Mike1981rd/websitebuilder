using System.ComponentModel.DataAnnotations;

namespace Hotel.Models
{
    public class Company
    {
        [Key]
        public int Id { get; set; }

        // Datos generales
        [Display(Name = "Logo")]
        public string? Logo { get; set; }

        [Required(ErrorMessage = "La razón social es requerida")]
        [Display(Name = "Razón social")]
        [StringLength(200)]
        public string BusinessName { get; set; } = string.Empty;

        [Required(ErrorMessage = "El RNC o Cédula es requerido")]
        [Display(Name = "RNC o Cédula")]
        [StringLength(20)]
        public string RncOrId { get; set; } = string.Empty;

        [Required(ErrorMessage = "El nombre comercial es requerido")]
        [Display(Name = "Nombre comercial")]
        [StringLength(200)]
        public string TradeName { get; set; } = string.Empty;

        [Required(ErrorMessage = "El correo electrónico es requerido")]
        [Display(Name = "Correo electrónico")]
        [EmailAddress(ErrorMessage = "Formato de correo inválido")]
        public string Email { get; set; } = string.Empty;

        [Display(Name = "Sitio web")]
        public string? Website { get; set; }

        [Required(ErrorMessage = "El teléfono es requerido")]
        [Display(Name = "Teléfono")]
        [Phone(ErrorMessage = "Formato de teléfono inválido")]
        public string Phone { get; set; } = string.Empty;

        // Facturación electrónica
        [Display(Name = "Facturación electrónica")]
        public bool ElectronicBilling { get; set; }

        // Datos de ubicación
        [Required(ErrorMessage = "La dirección es requerida")]
        [Display(Name = "Dirección")]
        [StringLength(500)]
        public string Address { get; set; } = string.Empty;

        [Required(ErrorMessage = "La provincia es requerida")]
        [Display(Name = "Provincia")]
        public string Province { get; set; } = string.Empty;

        [Required(ErrorMessage = "El municipio es requerido")]
        [Display(Name = "Municipio")]
        public string Municipality { get; set; } = string.Empty;

        // Datos adicionales
        [Display(Name = "Régimen")]
        public string? TaxRegime { get; set; }

        [Display(Name = "Sector")]
        public string? Sector { get; set; }

        [Display(Name = "Número de empleados")]
        public int? EmployeeCount { get; set; }

        [Required(ErrorMessage = "La moneda es requerida")]
        [Display(Name = "Moneda")]
        public string Currency { get; set; } = "DOP";

        [Display(Name = "Precisión decimal")]
        public int DecimalPrecision { get; set; } = 2;

        [Display(Name = "Separador decimal")]
        public string DecimalSeparator { get; set; } = ".";

        // Campos adicionales del diseño
        [Display(Name = "Zona horaria")]
        public string TimeZone { get; set; } = "(GMT-04:00) Santo Domingo";

        [Display(Name = "Métrica")]
        public string Metric { get; set; } = "Metric";

        [Display(Name = "Peso")]
        public string Weight { get; set; } = "Kilograms";

        [Display(Name = "Prefijo de orden")]
        public string OrderPrefix { get; set; } = "#";

        [Display(Name = "Sufijo de orden")]
        public string? OrderSuffix { get; set; }

        // Timestamps
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
        public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;
    }
}