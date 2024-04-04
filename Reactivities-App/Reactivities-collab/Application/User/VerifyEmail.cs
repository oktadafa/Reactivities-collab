using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Application.Core;
using Application.Interface;
using MediatR;
using Microsoft.EntityFrameworkCore;
using Persistence;

namespace Application.User
{
    public class VerifyEmail
    {
     public class Command : IRequest<Result<Unit>>
    {
        public int code;
     }
        public class Handler : IRequestHandler<Command, Result<Unit>>
        {
            private readonly DataContext _context;
            private readonly IUserAccessor _user;
            public Handler(DataContext context, IUserAccessor user)
            {
                _context = context;
                _user = user;
            }
            public async Task<Result<Unit>> Handle(Command request, CancellationToken cancellationToken)
            {
                var user = await _context.Users.SingleOrDefaultAsync(x => x.UserName == _user.GetUsername());
                if (user.VerifyCode == request.code && DateTime.UtcNow <= user.ExpireVerifyCode )
                {
                    user.EmailConfirmed = true;
                    var result = await _context.SaveChangesAsync() > 0;
                    return result ? Result<Unit>.Success(Unit.Value) : Result<Unit>.Failure("gagal"); 
                }
                return Result<Unit>.Failure("Gagal");
            }
        }
    }
}