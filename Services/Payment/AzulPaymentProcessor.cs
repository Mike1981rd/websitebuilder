using System;
using System.Collections.Generic;
using System.Net.Http;
using System.Net.Http.Headers;
using System.Security.Cryptography.X509Certificates;
using System.Text;
using System.Text.Json;
using System.Threading.Tasks;
using Hotel.Data;
using Hotel.DTOs.Payment;
using Hotel.Models;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Logging;

namespace Hotel.Services.Payment
{
    public class AzulPaymentProcessor : IPaymentProcessor
    {
        private readonly IConfiguration _configuration;
        private readonly ILogger<AzulPaymentProcessor> _logger;
        private readonly IEncryptionService _encryption;
        private readonly HotelDbContext _context;
        private readonly HttpClient _httpClient;
        
        public AzulPaymentProcessor(
            IConfiguration configuration,
            ILogger<AzulPaymentProcessor> logger,
            IEncryptionService encryption,
            HotelDbContext context,
            IHttpClientFactory httpClientFactory)
        {
            _configuration = configuration;
            _logger = logger;
            _encryption = encryption;
            _context = context;
            _httpClient = httpClientFactory.CreateClient("Azul");
        }
        
        public string GetProviderName() => "AZUL_DO";
        
        public async Task<PaymentResult> ProcessPaymentAsync(PaymentRequest request)
        {
            try
            {
                _logger.LogInformation("Processing Azul payment for order {OrderId}", request.OrderId);
                
                // Get active gateway configuration
                var gateway = await _context.PaymentGateways
                    .FirstOrDefaultAsync(g => g.IsActive && g.Provider == GetProviderName());
                    
                if (gateway == null)
                {
                    return PaymentResult.Failure("Payment gateway not configured");
                }
                
                // Decrypt configuration
                var config = JsonSerializer.Deserialize<AzulConfiguration>(
                    _encryption.Decrypt(gateway.ConfigurationJson ?? ""));
                    
                if (config == null)
                {
                    return PaymentResult.Failure("Invalid gateway configuration");
                }
                
                // Build Azul request
                var azulRequest = new Dictionary<string, object>
                {
                    ["Channel"] = "EC",
                    ["Store"] = config.StoreId,
                    ["CardNumber"] = request.CardNumber.Replace(" ", ""),
                    ["Expiration"] = FormatExpiration(request.CardExpiry),
                    ["CVC"] = request.CardCvc,
                    ["PosInputMode"] = "E-Commerce",
                    ["TrxType"] = "Sale",
                    ["Amount"] = FormatAmount(request.Amount),
                    ["Itbis"] = FormatAmount(request.Tax),
                    ["OrderNumber"] = request.OrderId,
                    ["CustomOrderId"] = request.OrderId,
                    ["SaveToDataVault"] = request.SaveCard
                };
                
                // Prepare HTTP request
                var endpoint = gateway.IsTestMode ? config.Endpoints.Test : config.Endpoints.Production;
                var httpRequest = new HttpRequestMessage(HttpMethod.Post, endpoint);
                httpRequest.Headers.Add("Auth1", config.Auth1);
                httpRequest.Headers.Add("Auth2", config.Auth2);
                httpRequest.Content = new StringContent(
                    JsonSerializer.Serialize(azulRequest),
                    Encoding.UTF8,
                    "application/json");
                
                // Log request (without sensitive data)
                _logger.LogDebug("Sending request to Azul: {Endpoint}", endpoint);
                
                // Send request
                var response = await _httpClient.SendAsync(httpRequest);
                var responseContent = await response.Content.ReadAsStringAsync();
                
                // Parse response
                var azulResponse = JsonSerializer.Deserialize<Dictionary<string, JsonElement>>(responseContent);
                
                if (azulResponse == null)
                {
                    return PaymentResult.Failure("Invalid response from payment gateway");
                }
                
                // Check response
                var responseCode = azulResponse.ContainsKey("ResponseCode") 
                    ? azulResponse["ResponseCode"].GetString() 
                    : "99";
                    
                var isApproved = responseCode == "00";
                
                var result = new PaymentResult
                {
                    IsSuccess = isApproved,
                    TransactionId = azulResponse.ContainsKey("AzulOrderId") 
                        ? azulResponse["AzulOrderId"].GetString() 
                        : null,
                    AuthorizationCode = azulResponse.ContainsKey("AuthorizationCode") 
                        ? azulResponse["AuthorizationCode"].GetString() 
                        : null,
                    ResponseCode = responseCode,
                    ResponseMessage = azulResponse.ContainsKey("ResponseMessage") 
                        ? azulResponse["ResponseMessage"].GetString() 
                        : "Unknown",
                    ErrorMessage = azulResponse.ContainsKey("ErrorDescription") 
                        ? azulResponse["ErrorDescription"].GetString() 
                        : null,
                    CardLastFour = request.CardNumber.Length >= 4 
                        ? request.CardNumber.Substring(request.CardNumber.Length - 4) 
                        : "",
                    CardType = DetectCardType(request.CardNumber),
                    Gateway = GetProviderName(),
                    RawResponse = azulResponse.ToDictionary(k => k.Key, v => (object)v.Value.ToString())
                };
                
                // Save transaction log
                await SaveTransactionLog(request, azulRequest, result, responseContent);
                
                return result;
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error processing Azul payment");
                return PaymentResult.Failure($"Payment processing error: {ex.Message}");
            }
        }
        
        public async Task<PaymentResult> VerifyPaymentAsync(string transactionId)
        {
            // Implementation for verify payment
            _logger.LogInformation("Verifying payment {TransactionId}", transactionId);
            return await Task.FromResult(PaymentResult.Failure("Verify not implemented"));
        }
        
        public async Task<PaymentResult> VoidPaymentAsync(string transactionId)
        {
            // Implementation for void payment
            _logger.LogInformation("Voiding payment {TransactionId}", transactionId);
            return await Task.FromResult(PaymentResult.Failure("Void not implemented"));
        }
        
        public async Task<PaymentResult> RefundPaymentAsync(string transactionId, decimal amount)
        {
            // Implementation for refund payment
            _logger.LogInformation("Refunding payment {TransactionId} for amount {Amount}", transactionId, amount);
            return await Task.FromResult(PaymentResult.Failure("Refund not implemented"));
        }
        
        public bool ValidateConfiguration(PaymentGateway gateway)
        {
            try
            {
                if (string.IsNullOrEmpty(gateway.ConfigurationJson))
                    return false;
                    
                var config = JsonSerializer.Deserialize<AzulConfiguration>(
                    _encryption.Decrypt(gateway.ConfigurationJson));
                    
                return config != null &&
                       !string.IsNullOrEmpty(config.StoreId) &&
                       !string.IsNullOrEmpty(config.Auth1) &&
                       !string.IsNullOrEmpty(config.Auth2);
            }
            catch
            {
                return false;
            }
        }
        
        private string FormatAmount(decimal amount)
        {
            // Azul expects amount without decimal point
            // $150.00 becomes "15000"
            return ((int)(amount * 100)).ToString();
        }
        
        private string FormatExpiration(string cardExpiry)
        {
            // Convert MM/YY to YYYYMM
            if (string.IsNullOrEmpty(cardExpiry) || !cardExpiry.Contains("/"))
                return "";
                
            var parts = cardExpiry.Split('/');
            if (parts.Length != 2)
                return "";
                
            var month = parts[0].PadLeft(2, '0');
            var year = parts[1];
            
            // Assume 20XX for two-digit years
            if (year.Length == 2)
                year = "20" + year;
                
            return year + month;
        }
        
        private string DetectCardType(string cardNumber)
        {
            cardNumber = cardNumber.Replace(" ", "");
            
            if (cardNumber.StartsWith("4"))
                return "Visa";
            else if (cardNumber.StartsWith("5"))
                return "MasterCard";
            else if (cardNumber.StartsWith("3"))
                return "AmEx";
            else if (cardNumber.StartsWith("6"))
                return "Discover";
            else
                return "Unknown";
        }
        
        private async Task SaveTransactionLog(
            PaymentRequest request,
            Dictionary<string, object> azulRequest,
            PaymentResult result,
            string responseJson)
        {
            try
            {
                var transaction = new PaymentTransaction
                {
                    Gateway = GetProviderName(),
                    TransactionId = result.TransactionId,
                    OrderId = request.OrderId,
                    ReservationId = request.ReservationId,
                    Amount = request.Amount,
                    Tax = request.Tax,
                    Currency = "DOP",
                    Status = result.IsSuccess ? "approved" : "failed",
                    ResponseCode = result.ResponseCode,
                    ResponseMessage = result.ResponseMessage,
                    AuthorizationCode = result.AuthorizationCode,
                    CardLastFour = result.CardLastFour,
                    CardType = result.CardType,
                    RequestJson = JsonSerializer.Serialize(new
                    {
                        OrderId = request.OrderId,
                        Amount = request.Amount,
                        Tax = request.Tax,
                        CardLastFour = result.CardLastFour
                        // Don't log sensitive card data
                    }),
                    ResponseJson = responseJson,
                    CreatedAt = DateTime.UtcNow
                };
                
                _context.PaymentTransactions.Add(transaction);
                await _context.SaveChangesAsync();
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error saving transaction log");
                // Don't fail the payment if we can't save the log
            }
        }
        
        private class AzulConfiguration
        {
            public string StoreId { get; set; } = string.Empty;
            public string Auth1 { get; set; } = string.Empty;
            public string Auth2 { get; set; } = string.Empty;
            public AzulEndpoints Endpoints { get; set; } = new AzulEndpoints();
        }
        
        private class AzulEndpoints
        {
            public string Test { get; set; } = "https://pruebas.azul.com.do/webservices/JSON/Default.aspx";
            public string Production { get; set; } = "https://pagos.azul.com.do/webservices/JSON/Default.aspx";
        }
    }
}