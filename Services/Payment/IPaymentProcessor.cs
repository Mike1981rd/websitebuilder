using System.Threading.Tasks;
using Hotel.DTOs.Payment;
using Hotel.Models;

namespace Hotel.Services.Payment
{
    public interface IPaymentProcessor
    {
        Task<PaymentResult> ProcessPaymentAsync(PaymentRequest request);
        Task<PaymentResult> VerifyPaymentAsync(string transactionId);
        Task<PaymentResult> VoidPaymentAsync(string transactionId);
        Task<PaymentResult> RefundPaymentAsync(string transactionId, decimal amount);
        bool ValidateConfiguration(PaymentGateway gateway);
        string GetProviderName();
    }
}