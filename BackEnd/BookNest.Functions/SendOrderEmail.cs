using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Azure.Functions.Worker;
using Microsoft.Extensions.Logging;
using SendGrid;
using SendGrid.Helpers.Mail;
using System.Text.Json;

namespace BookNest.Functions;

public class SendOrderEmail
{
    private readonly ILogger<SendOrderEmail> _logger;

    public SendOrderEmail(ILogger<SendOrderEmail> logger)
    {
        _logger = logger;
    }

    [Function("SendOrderEmail")]
    public async Task<IActionResult> Run([HttpTrigger(AuthorizationLevel.Function, "post")] HttpRequest req)
    {
        _logger.LogInformation("Processing a new order email request...");

        try
        {
            // 1. Read the incoming order data (JSON) from BookNest.Api
            string requestBody = await new StreamReader(req.Body).ReadToEndAsync();
            var orderData = JsonSerializer.Deserialize<OrderEmailRequest>(requestBody, new JsonSerializerOptions { PropertyNameCaseInsensitive = true });

            if (orderData == null || string.IsNullOrEmpty(orderData.CustomerEmail))
            {
                return new BadRequestObjectResult("Invalid order data.");
            }

            // 2. Get your secret keys from local.settings.json
            var apiKey = Environment.GetEnvironmentVariable("SendGridApiKey");
            var senderEmail = Environment.GetEnvironmentVariable("SenderEmail");

            if (string.IsNullOrEmpty(apiKey) || string.IsNullOrEmpty(senderEmail))
            {
                _logger.LogError("SendGrid configuration is missing!");
                return new StatusCodeResult(500);
            }

            // 3. Prepare the Email via SendGrid
            var client = new SendGridClient(apiKey);
            var from = new EmailAddress(senderEmail, "BookNest Store");
            var to = new EmailAddress(orderData.CustomerEmail, orderData.CustomerName);
            var subject = $"Your BookNest Order #{orderData.OrderId} is Confirmed!";
            
            var plainTextContent = $"Hi {orderData.CustomerName}, thank you for your order! Total: ₹{orderData.TotalAmount}";
            var htmlContent = $"<strong>Hi {orderData.CustomerName},</strong><br/><br/>Thank you for your order! Your total is <strong>₹{orderData.TotalAmount}</strong>. We will notify you when it ships.";
            
            var msg = MailHelper.CreateSingleEmail(from, to, subject, plainTextContent, htmlContent);

            // 4. Send it!
            var response = await client.SendEmailAsync(msg);

            _logger.LogInformation($"SendGrid Response StatusCode: {response.StatusCode}");

            return new OkObjectResult("Email sent successfully!");
        }
        catch (Exception ex)
        {
            _logger.LogError($"Failed to send email: {ex.Message}");
            return new StatusCodeResult(500);
        }
    }
}

// Data model matching what BookNest.Api will send us
public class OrderEmailRequest
{
    public int OrderId { get; set; }
    public string CustomerName { get; set; } = string.Empty;
    public string CustomerEmail { get; set; } = string.Empty;
    public decimal TotalAmount { get; set; }
}
