using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Hotel.Models
{
    public class Policy
    {
        public int Id { get; set; }

        [Required]
        public int CompanyId { get; set; }

        [Display(Name = "Política de devoluciones y reembolsos")]
        [Column(TypeName = "text")]
        public string? RefundPolicyContent { get; set; } = "";

        [Display(Name = "Política de privacidad")]
        [Column(TypeName = "text")]
        public string? PrivacyPolicyContent { get; set; } = "";

        [Display(Name = "Términos del servicio")]
        [Column(TypeName = "text")]
        public string? TermsOfServiceContent { get; set; } = "";

        [Display(Name = "Política de envío")]
        [Column(TypeName = "text")]
        public string? ShippingPolicyContent { get; set; } = "";

        [Display(Name = "Información de contacto")]
        [Column(TypeName = "text")]
        public string? ContactInformationContent { get; set; } = "";

        [Display(Name = "Fecha de creación")]
        public DateTime CreatedAt { get; set; }

        [Display(Name = "Fecha de actualización")]
        public DateTime UpdatedAt { get; set; }

        // Navegación
        public virtual Company Company { get; set; }
    }
}