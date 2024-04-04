using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Application.Interface
{
    public interface IEmailService
    {
        Task SendVerficationEmail(string email, string codeVerify);
    }
}