using System.ComponentModel.DataAnnotations;
using Microsoft.AspNetCore.Http;

namespace Hotel.ViewModels
{
    public class ConfigureGatewayViewModel
    {
        public int Id { get; set; }
        public string Name { get; set; } = string.Empty;
        public string Provider { get; set; } = string.Empty;
        
        [Required(ErrorMessage = "Store ID es requerido")]
        [Display(Name = "Store ID")]
        public string? StoreId { get; set; }
        
        [Required(ErrorMessage = "Usuario (Auth1) es requerido")]
        [Display(Name = "Usuario (Auth1)")]
        public string? Auth1 { get; set; }
        
        [Required(ErrorMessage = "Contraseña (Auth2) es requerida")]
        [Display(Name = "Contraseña (Auth2)")]
        [DataType(DataType.Password)]
        public string? Auth2 { get; set; }
        
        [Display(Name = "Certificado (.pem)")]
        public IFormFile? CertificateFile { get; set; }
        
        [Display(Name = "Llave del Certificado (.key)")]
        public IFormFile? CertificateKeyFile { get; set; }
        
        [Display(Name = "Modo de Prueba")]
        public bool IsTestMode { get; set; } = true;
        
        public bool IsActive { get; set; }
        
        // For display purposes
        public bool HasCertificate { get; set; }
        public bool HasCertificateKey { get; set; }
        public string? CertificateFileName { get; set; }
        public string? CertificateKeyFileName { get; set; }
    }
}