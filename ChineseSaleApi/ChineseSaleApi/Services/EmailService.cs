using MimeKit;
using System.Net.Mail;

namespace ChineseSaleApi.Services
{
    using ChineseSaleApi.Dto;
    using ChineseSaleApi.ServiceInterfaces;
    using MailKit.Net.Smtp;
    using Microsoft.Extensions.Options;
    using MimeKit;

    public class EmailService : IEmailService
    {
        private readonly EmailSettingsDto _emailSettings;

        public EmailService(IOptions<EmailSettingsDto> emailSettings)
        {
            _emailSettings = emailSettings.Value;
        }

        public void SendEmail(EmailRequestDto emailRequest)
        {
            var message = new MimeMessage();
            message.From.Add(new MailboxAddress(_emailSettings.SenderEmail, _emailSettings.SenderEmail));
            message.To.Add(new MailboxAddress("", emailRequest.To));
            message.Subject = emailRequest.Subject;

            message.Body = new TextPart("html")
            {
                Text = emailRequest.Body
            };

            using (var client = new SmtpClient())
            {
                client.Connect(_emailSettings.SmtpServer, _emailSettings.SmtpPort, MailKit.Security.SecureSocketOptions.StartTls); // Use settings from appsettings
                client.Authenticate("daatchava@gmail.com", "vnvi chvo hfjn nrdn");

                client.Send(message);
                client.Disconnect(true);
            }
        }
    }
}
