using ChineseSaleApi.Dto;
using ChineseSaleApi.ServiceInterfaces;
using MailKit.Net.Smtp;
using Microsoft.Extensions.Options;
using MimeKit;

namespace ChineseSaleApi.Services
{
    public class EmailService : IEmailService
    {
        private readonly EmailSettingsDto _emailSettings;
        public EmailService(IOptions<EmailSettingsDto> emailSettings)
        {
            _emailSettings = emailSettings.Value;
        }
        public void SendEmail(EmailRequestDto emailRequest)
        {
            var emailMessage = new MimeMessage();
            emailMessage.From.Add(new MailboxAddress(_emailSettings.SenderName, _emailSettings.SenderEmail));
            emailMessage.To.Add(new MailboxAddress("", emailRequest.To));
            emailMessage.Subject = emailRequest.Subject;
            emailMessage.Body = new TextPart("html")
            {
                Text = emailRequest.Body
            };
            using (var client = new SmtpClient())
            {
                client.Connect(_emailSettings.SmtpServer, _emailSettings.SmtpPort, MailKit.Security.SecureSocketOptions.StartTls);
                client.Authenticate(_emailSettings.SenderEmail, _emailSettings.SenderPassword);
                client.Send(emailMessage);
                client.Disconnect(true);
            }
        }
    }
}
