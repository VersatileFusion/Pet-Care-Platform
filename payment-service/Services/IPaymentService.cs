using PaymentService.Models;

namespace PaymentService.Services;

public interface IPaymentService
{
    Task<PaymentIntent> CreatePaymentIntentAsync(decimal amount, string currency, string customerId);
    Task<PaymentIntent> ConfirmPaymentIntentAsync(string paymentIntentId);
    Task<PaymentIntent> CancelPaymentIntentAsync(string paymentIntentId);
    Task<PaymentIntent> GetPaymentIntentAsync(string paymentIntentId);
    Task<IEnumerable<PaymentIntent>> GetCustomerPaymentsAsync(string customerId);
} 