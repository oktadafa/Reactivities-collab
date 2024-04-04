using System.Net;
using System.Net.Mail;
using System.Threading.Tasks;
using Application.Interface;
using Microsoft.AspNetCore.Hosting;
using Microsoft.Extensions.Configuration;

namespace Infrastructure.Security
{
    public class EmailService : IEmailService
    {
        private readonly IConfiguration _configuration;
        private IHostingEnvironment _hosting;
        public EmailService(IConfiguration configuration, IHostingEnvironment hosting)
        {
            _configuration = configuration;
            _hosting = hosting;
        }
        public async Task SendVerficationEmail(string email, string codeVerify)
        {
            string body = this.PopulateBody(codeVerify);
            this.SendHtmlFormattedEmail(email, body);
        }

        private string PopulateBody(string token)
        {
            string body = string.Empty;
            string path = Path.Combine(_hosting.WebRootPath, "email\\email.htm");
            using (StreamReader reader = new StreamReader(path))
            {
                body = reader.ReadToEnd();
            }
            body = body.Replace("{Token}", token);
            return body;
        }

        private void SendHtmlFormattedEmail(string recepientEmail, string body)
        {
            string host = _configuration.GetValue<string>("Smtp:Server");
            int port = _configuration.GetValue<int>("Smtp:Port");
            string fromAddress = _configuration.GetValue<string>("Smtp:FromAddress");
            string userName = _configuration.GetValue<string>("Smtp:UserName");
            string password = _configuration.GetValue<string>("Smtp:Password");

            var client = new SmtpClient(host, port)
            {
                Credentials = new NetworkCredential(userName, password),
                EnableSsl = true
            };

            var mailMessage = new MailMessage();
            mailMessage.From = new MailAddress(fromAddress);
            mailMessage.To.Add(recepientEmail);
            mailMessage.Subject = "Email Verify Code";
            mailMessage.Body = body;
            mailMessage.IsBodyHtml = true;
            client.Send(mailMessage);
        }
    }
}