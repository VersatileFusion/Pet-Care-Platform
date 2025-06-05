using PaymentService.Models;
using Stripe;

namespace PaymentService.Services;

public class StripePaymentService : IPaymentService
{
    private readonly PaymentDbContext _context;
    private readonly ILogger<StripePaymentService> _logger;

    public StripePaymentService(PaymentDbContext context, ILogger<StripePaymentService> logger)
    {
        _context = context;
        _logger = logger;
    }

    public async Task<PaymentIntent> CreatePaymentIntentAsync(decimal amount, string currency, string customerId)
    {
        try
        {
            var options = new PaymentIntentCreateOptions
            {
                Amount = (long)(amount * 100), // Convert to cents
                Currency = currency.ToLower(),
                Customer = customerId,
                PaymentMethodTypes = new List<string> { "card" },
            };

            var service = new PaymentIntentService();
            var intent = await service.CreateAsync(options);

            _logger.LogInformation("Created payment intent {PaymentIntentId} for customer {CustomerId}", 
                intent.Id, customerId);

            return new PaymentIntent
            {
                Id = intent.Id,
                Amount = amount,
                Currency = currency,
                Status = intent.Status,
                CustomerId = customerId,
                CreatedAt = DateTime.UtcNow
            };
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error creating payment intent for customer {CustomerId}", customerId);
            throw;
        }
    }

    public async Task<PaymentIntent> ConfirmPaymentIntentAsync(string paymentIntentId)
    {
        try
        {
            var service = new PaymentIntentService();
            var intent = await service.ConfirmAsync(paymentIntentId);

            _logger.LogInformation("Confirmed payment intent {PaymentIntentId}", paymentIntentId);

            return new PaymentIntent
            {
                Id = intent.Id,
                Amount = intent.Amount / 100m,
                Currency = intent.Currency,
                Status = intent.Status,
                CustomerId = intent.CustomerId,
                CreatedAt = DateTime.UtcNow
            };
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error confirming payment intent {PaymentIntentId}", paymentIntentId);
            throw;
        }
    }

    public async Task<PaymentIntent> CancelPaymentIntentAsync(string paymentIntentId)
    {
        try
        {
            var service = new PaymentIntentService();
            var intent = await service.CancelAsync(paymentIntentId);

            _logger.LogInformation("Cancelled payment intent {PaymentIntentId}", paymentIntentId);

            return new PaymentIntent
            {
                Id = intent.Id,
                Amount = intent.Amount / 100m,
                Currency = intent.Currency,
                Status = intent.Status,
                CustomerId = intent.CustomerId,
                CreatedAt = DateTime.UtcNow
            };
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error cancelling payment intent {PaymentIntentId}", paymentIntentId);
            throw;
        }
    }

    public async Task<PaymentIntent> GetPaymentIntentAsync(string paymentIntentId)
    {
        try
        {
            var service = new PaymentIntentService();
            var intent = await service.GetAsync(paymentIntentId);

            _logger.LogInformation("Retrieved payment intent {PaymentIntentId}", paymentIntentId);

            return new PaymentIntent
            {
                Id = intent.Id,
                Amount = intent.Amount / 100m,
                Currency = intent.Currency,
                Status = intent.Status,
                CustomerId = intent.CustomerId,
                CreatedAt = DateTime.UtcNow
            };
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error retrieving payment intent {PaymentIntentId}", paymentIntentId);
            throw;
        }
    }

    public async Task<IEnumerable<PaymentIntent>> GetCustomerPaymentsAsync(string customerId)
    {
        try
        {
            var options = new PaymentIntentListOptions
            {
                Customer = customerId,
                Limit = 100
            };

            var service = new PaymentIntentService();
            var intents = await service.ListAsync(options);

            _logger.LogInformation("Retrieved {Count} payment intents for customer {CustomerId}", 
                intents.Data.Count, customerId);

            return intents.Data.Select(intent => new PaymentIntent
            {
                Id = intent.Id,
                Amount = intent.Amount / 100m,
                Currency = intent.Currency,
                Status = intent.Status,
                CustomerId = intent.CustomerId,
                CreatedAt = DateTime.UtcNow
            });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error retrieving payment intents for customer {CustomerId}", customerId);
            throw;
        }
    }
} 