using System.Net.Http;
using System.Text;
using System.Text.Json;
using System.Threading.Tasks;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Configuration;
using BookNest.Api.Models;

namespace BookNest.Api.Services;

public interface IEmailTriggerService
{
    Task TriggerOrderConfirmationEmailAsync(Order order, string customerName, string customerEmail);
}

public class EmailTriggerService : IEmailTriggerService
{
    private readonly HttpClient _httpClient;
    private readonly ILogger<EmailTriggerService> _logger;
    private readonly string _functionUrl;

    public EmailTriggerService(HttpClient httpClient, ILogger<EmailTriggerService> logger, IConfiguration configuration)
    {
        _httpClient = httpClient;
        _logger = logger;
        // In local development, Azure Functions usually run on port 7071
        _functionUrl = configuration["EmailFunctionUrl"] ?? "http://localhost:7071/api/SendOrderEmail";
    }

    public async Task TriggerOrderConfirmationEmailAsync(Order order, string customerName, string customerEmail)
    {
        try
        {
            var payload = new
            {
                OrderId = order.Id,
                CustomerName = customerName,
                CustomerEmail = customerEmail,
                TotalAmount = order.TotalAmount
            };

            var jsonPayload = JsonSerializer.Serialize(payload);
            var content = new StringContent(jsonPayload, Encoding.UTF8, "application/json");

            _logger.LogInformation($"Sending email trigger to Azure Function for Order #{order.Id}");
            
            // Fire and forget - don't await the response here if you want it to be truly background, 
            // but for learning purposes we'll await it to see any errors in the API logs
            var response = await _httpClient.PostAsync(_functionUrl, content);

            if (!response.IsSuccessStatusCode)
            {
                _logger.LogWarning($"Email function returned status code: {response.StatusCode}");
            }
        }
        catch (Exception ex)
        {
            _logger.LogError($"Failed to trigger email function: {ex.Message}");
            // We don't throw here because if the email fails, we still want the user's order to succeed!
        }
    }
}
