using System.Collections.Generic;

namespace Hotel.DTOs.Payment
{
    public class PaymentResult
    {
        public bool IsSuccess { get; set; }
        public string? TransactionId { get; set; }
        public string? AuthorizationCode { get; set; }
        public string? ResponseCode { get; set; }
        public string? ResponseMessage { get; set; }
        public string? ErrorMessage { get; set; }
        public Dictionary<string, object> RawResponse { get; set; } = new Dictionary<string, object>();
        
        // Additional metadata
        public string? CardLastFour { get; set; }
        public string? CardType { get; set; }
        public string? Gateway { get; set; }
        
        // Helper method to create success result
        public static PaymentResult Success(string transactionId, string authCode)
        {
            return new PaymentResult
            {
                IsSuccess = true,
                TransactionId = transactionId,
                AuthorizationCode = authCode,
                ResponseCode = "00",
                ResponseMessage = "APROBADA"
            };
        }
        
        // Helper method to create failure result
        public static PaymentResult Failure(string errorMessage, string responseCode = "99")
        {
            return new PaymentResult
            {
                IsSuccess = false,
                ErrorMessage = errorMessage,
                ResponseCode = responseCode,
                ResponseMessage = "RECHAZADA"
            };
        }
    }
}