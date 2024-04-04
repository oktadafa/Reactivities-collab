using Application.Core;
using Domain;
using MediatR;
using Microsoft.EntityFrameworkCore;
using Persistence;

namespace Application.Activities
{
    public class AddAttende
    {
        public class Command : IRequest<Result<Unit>>
        {
            public string Username{get;set;}
            public Guid ActivityId { get; set; }
        }

        public class Handler : IRequestHandler<Command, Result<Unit>>
        {
            private readonly DataContext _contex;
            public Handler(DataContext context)
            {
                _contex = context;
            }
            public async Task<Result<Unit>> Handle(Command request, CancellationToken cancellationToken)
            {
                var activity = await _contex.Activities.Include(x => x.Attendees).ThenInclude(x => x.AppUser).SingleOrDefaultAsync(x => x.Id == request.ActivityId);
                var user = await _contex.Users.SingleOrDefaultAsync(x => x.UserName == request.Username);
                if(user is null || activity is null) return null;
                var attendee = activity.Attendees.SingleOrDefault(x => x.AppUser.UserName == request.Username);
                if (attendee != null)
                {
                    return null;
                }
                attendee = new ActivityAttendee {
                    AppUser = user,
                    Activity = activity,
                    isHost= false
                };

                activity.Attendees.Add(attendee);
                var result = await _contex.SaveChangesAsync() > 0;
            return result ? Result<Unit>.Success(Unit.Value) : Result<Unit>.Failure("Yah gagagl");
            }
        }
    }
}