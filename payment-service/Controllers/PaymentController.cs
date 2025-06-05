using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using PaymentService.Models;
using PaymentService.Services;

namespace PaymentService.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize]
public class PaymentController : ControllerBase
{
    private readonly IPaymentService _paymentService;
    private readonly ILogger<PaymentController> _logger;

    public PaymentController(IPaymentService paymentService, ILogger<PaymentController> logger)
    {
        _paymentService = paymentService;
        _logger = logger;
    }

    [HttpPost("create")]
    public async Task<ActionResult<PaymentIntent>> CreatePaymentIntent(
        [FromBody] CreatePaymentIntentRequest request)
    {
        try
        {
            var paymentIntent = await _paymentService.CreatePaymentIntentAsync(
                request.Amount,
                request.Currency,
                request.CustomerId);

            return Ok(paymentIntent);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error creating payment intent");
            return StatusCode(500, "An error occurred while creating the payment intent");
        }
    }

    [HttpPost("{paymentIntentId}/confirm")]
    public async Task<ActionResult<PaymentIntent>> ConfirmPaymentIntent(string paymentIntentId)
    {
        try
        {
            var paymentIntent = await _paymentService.ConfirmPaymentIntentAsync(paymentIntentId);
            return Ok(paymentIntent);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error confirming payment intent {PaymentIntentId}", paymentIntentId);
            return StatusCode(500, "An error occurred while confirming the payment intent");
        }
    }

    [HttpPost("{paymentIntentId}/cancel")]
    public async Task<ActionResult<PaymentIntent>> CancelPaymentIntent(string paymentIntentId)
    {
        try
        {
            var paymentIntent = await _paymentService.CancelPaymentIntentAsync(paymentIntentId);
            return Ok(paymentIntent);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error cancelling payment intent {PaymentIntentId}", paymentIntentId);
            return StatusCode(500, "An error occurred while cancelling the payment intent");
        }
    }

    [HttpGet("{paymentIntentId}")]
    public async Task<ActionResult<PaymentIntent>> GetPaymentIntent(string paymentIntentId)
    {
        try
        {
            var paymentIntent = await _paymentService.GetPaymentIntentAsync(paymentIntentId);
            return Ok(paymentIntent);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error retrieving payment intent {PaymentIntentId}", paymentIntentId);
            return StatusCode(500, "An error occurred while retrieving the payment intent");
        }
    }

    [HttpGet("customer/{customerId}")]
    public async Task<ActionResult<IEnumerable<PaymentIntent>>> GetCustomerPayments(string customerId)
    {
        try
        {
            var payments = await _paymentService.GetCustomerPaymentsAsync(customerId);
            return Ok(payments);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error retrieving payments for customer {CustomerId}", customerId);
            return StatusCode(500, "An error occurred while retrieving the customer payments");
        }
    }
}

public class CreatePaymentIntentRequest
{
    public decimal Amount { get; set; }
    public string Currency { get; set; } = string.Empty;
    public string CustomerId { get; set; } = string.Empty;
} 