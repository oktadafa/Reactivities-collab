using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Mail;
using System.Threading.Tasks;
using Application.Interface;

namespace API.Services
{
    public class EmailService : IEmailService
    {
        private readonly IConfiguration _configuration;
        private readonly Microsoft.AspNetCore.Hosting.IHostingEnvironment _hosting;
        public EmailService(IConfiguration configuration, Microsoft.AspNetCore.Hosting.IHostingEnvironment hosting)
        {
            
        }
        public async Task SendVerficationEmail(string email, string codeVerify)
        {
            try
            {
                string body = string.Empty;
                string path = Path.Combine(_hosting.WebRootPath, "email\\email.htm");
                using (StreamReader reader = new StreamReader(path))
                {
                    body = reader.ReadToEnd();
                }
                body = body.Replace("{Token}", codeVerify);

                string host = _configuration.GetValue<string>("Smtp:Server");
                int port = _configuration.GetValue<int>("Smtp:Port");
                string fromAddress = _configuration.GetValue<string>("Smtp:FromAddress");
                string userName = _configuration.GetValue<string>("Smtp:UserName");
                string password = _configuration.GetValue<string>("Smtp:Password");

                var client = new SmtpClient("smtp.mailtrap.io", 2525)
                {
                    Credentials = new NetworkCredential(userName, password),
                    EnableSsl = true
                };

                var mailMessage = new MailMessage();
                mailMessage.From = new MailAddress("your_email@example.com");
                mailMessage.To.Add("recipient@example.com");
                mailMessage.Subject = "Test HTML Email";
                mailMessage.Body = body;
                mailMessage.IsBodyHtml = true;

                client.Send(mailMessage);
            }
            catch (Exception ex)
            {
                Console.WriteLine(ex.Message);
            }
            
            
        }
    }
        
}