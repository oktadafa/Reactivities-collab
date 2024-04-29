using Application.Core;
using Application.Interface;
using MediatR;
using Microsoft.EntityFrameworkCore;
using Persistence;

namespace Application.User
{
    public class SendCodeVerify
    {
        public class Command : IRequest<Result<Unit>>
        {
            
        };

        public class Handler : IRequestHandler<Command, Result<Unit>>
        {
            private readonly DataContext _context;
            private readonly IUserAccessor _user;

            private readonly IEmailService _email;
            public Handler(DataContext context, IUserAccessor user, IEmailService email)
            {
                _context = context;
                _user = user;
                _email = email;
            }
            public async Task<Result<Unit>> Handle(Command request, CancellationToken cancellationToken)
            {
                try
                {
                    var user = await _context.Users.SingleOrDefaultAsync(x => x.UserName == _user.GetUsername());
                    user.VerifyCode = (int)Convert.ToInt64(GenerateVerificationCode());
                    user.ExpireVerifyCode = DateTime.UtcNow.AddMinutes(5);
                    await _context.SaveChangesAsync();
                    await _email.SendVerficationEmail(user.Email, user.VerifyCode.ToString());
                    return Result<Unit>.Success(Unit.Value);
                }
                catch (Exception ex)
                {
                    Console.WriteLine(ex.Message);
                    return Result<Unit>.Failure("gagal");
                }
                 
            }
             private string GenerateVerificationCode()
                {
                    const string chars = "0123456789";
                    Random random = new Random();
                    char[] code = new char[6];
                    for (int i = 0; i < code.Length; i++)
                    {
                        code[i] = chars[random.Next(chars.Length)];
                    }
                    return new string(code);
                }
        }
    }
}