using System;

namespace Hotel.ViewModels
{
    public class PaymentGatewayViewModel
    {
        public int Id { get; set; }
        public string Name { get; set; } = string.Empty;
        public string Provider { get; set; } = string.Empty;
        public string Description { get; set; } = string.Empty;
        public string LogoUrl { get; set; } = string.Empty;
        public bool IsActive { get; set; }
        public bool IsTestMode { get; set; }
        public bool IsConfigured { get; set; }
        public DateTime? LastUpdated { get; set; }
        public string Status { get; set; } = "inactive"; // active, inactive, pending
    }
}