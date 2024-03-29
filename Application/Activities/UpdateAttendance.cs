using Application.Core;
using Application.Interface;
using Domain;
using MediatR;
using Microsoft.EntityFrameworkCore;
using Persistence;

namespace Application.Activities
{
    public class UpdateAttendance
    {
        public class Command : IRequest<Result<Unit>>
        {
            public Guid id { get; set; }
        }

        public class Handler : IRequestHandler<Command, Result<Unit>>
        {
            private readonly DataContext _context;
            private readonly IUserAccessor _userAccesor;
            public Handler(DataContext context, IUserAccessor userAccessor)
            {
                _context = context;
                _userAccesor = userAccessor;
            }

            public async Task<Result<Unit>> Handle(Command request, CancellationToken cancellationToken)
            {
                var activity = await _context.Activities.Include(a => a.Attendees
                ).ThenInclude(u => u.AppUser).SingleOrDefaultAsync(x => x.Id == request.id);

                if(activity is null) return null;

                var user = await _context.Users.FirstOrDefaultAsync(a => a.UserName == _userAccesor.GetUsername());

                if(user is null) return null;

                var hostUsername  = activity.Attendees.FirstOrDefault(x => x.isHost)?.AppUser?.UserName;

                var attendance = activity.Attendees.FirstOrDefault(x => x.AppUser.UserName == user.UserName);

                if(attendance != null && hostUsername == user.UserName)
                activity.isCanceled = !activity.isCanceled;

                if(attendance != null && hostUsername != user.UserName)
                activity.Attendees.Remove(attendance);
                if(attendance is null){
                    attendance=  new ActivityAttendee
                    {
                        AppUser = user,
                        Activity = activity,
                        isHost = false
                    };

                    activity.Attendees.Add(attendance);
                }

                var result = await _context.SaveChangesAsync() > 0;
                return result ? Result<Unit>.Success(Unit.Value) : Result<Unit>.Failure("Problem upload");
            }
        }
    }
}