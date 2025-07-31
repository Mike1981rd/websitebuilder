using System;
using System.Threading.Tasks;
using Microsoft.Extensions.DependencyInjection;
using Hotel.DTOs.Payment;
using Hotel.Models;

namespace Hotel.Services.Payment
{
    public class PaymentProcessorFactory
    {
        private readonly IServiceProvider _serviceProvider;
        
        public PaymentProcessorFactory(IServiceProvider serviceProvider)
        {
            _serviceProvider = serviceProvider;
        }
        
        public IPaymentProcessor GetProcessor(string provider)
        {
            return provider?.ToUpperInvariant() switch
            {
                "AZUL_DO" => _serviceProvider.GetRequiredService<AzulPaymentProcessor>(),
                "MOCK" => new MockPaymentProcessor(),
                _ => throw new NotSupportedException($"Payment provider '{provider}' is not supported")
            };
        }
    }
    
    // Mock processor for testing
    public class MockPaymentProcessor : IPaymentProcessor
    {
        public string GetProviderName() => "MOCK";
        
        public Task<PaymentResult> ProcessPaymentAsync(PaymentRequest request)
        {
            // Always approve in mock mode
            return Task.FromResult(PaymentResult.Success("MOCK-" + Guid.NewGuid().ToString(), "MOCK123"));
        }
        
        public Task<PaymentResult> VerifyPaymentAsync(string transactionId)
        {
            return Task.FromResult(PaymentResult.Success(transactionId, "MOCK123"));
        }
        
        public Task<PaymentResult> VoidPaymentAsync(string transactionId)
        {
            return Task.FromResult(PaymentResult.Success(transactionId, "VOID"));
        }
        
        public Task<PaymentResult> RefundPaymentAsync(string transactionId, decimal amount)
        {
            return Task.FromResult(PaymentResult.Success(transactionId, "REFUND"));
        }
        
        public bool ValidateConfiguration(PaymentGateway gateway)
        {
            return true;
        }
    }
}