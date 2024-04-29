using Application.Core;
using Application.Interface;
using MediatR;
using Microsoft.EntityFrameworkCore;
using Microsoft.VisualBasic;
using Persistence;

namespace Application.Notification
{
    public class DeleteFollow
    {
        public class Command : IRequest<Result<string>>
        {
            public string From {get;set;}
            public string To { get; set; }
        }

        public class Handler : IRequestHandler<Command, Result<string>>
        {
            private readonly DataContext _contex;
            private readonly IUserAccessor _user;
            public Handler(DataContext context, IUserAccessor user)
            {
                _contex = context;
                _user = user;
            }   
            public async Task<Result<string>> Handle(Command request, CancellationToken cancellationToken)
            {
                var user = await _contex.Users.SingleOrDefaultAsync(x => x.UserName == request.To);
                var userFrom  = await _contex.Users.SingleOrDefaultAsync(x => x.DisplayName == request.From);
                var Notification = await _contex.Notifications.FirstOrDefaultAsync(x => x.To == user && x.From ==userFrom);
                _contex.Notifications.Remove(Notification);
                var result = await _contex.SaveChangesAsync() > 0;

                return result ? Result<string>.Success(user.Id) : Result<string>.Failure("gagal");
            }
        }
    }
}