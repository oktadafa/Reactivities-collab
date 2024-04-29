using Microsoft.AspNetCore.Identity;
using Microsoft.Extensions.Logging;
using Reactivities_jason.Application.Common.Interfaces;
using Reactivities_jason.Domain.Entities;


namespace Reactivities_jason.Application.Activities.Command.CreateActivity
{
    public class CreateActivityCommand : IRequest<Guid>
    {
        public CreateActivityDTO ActivityDTO { get; set; }
    }
 public class CreateActivityHandler : IRequestHandler<CreateActivityCommand, Guid>
    {   
        private readonly IApplicationDbContext _context;
        private readonly IUserAccessor _userAccessor;
        private readonly UserManager<AppUser> _user;
        // private readonly IMapper _mapper;
        public CreateActivityHandler(IApplicationDbContext context, UserManager<AppUser> user, IUserAccessor userAccessor)
        {
            // _mapper = mapper;
            _context = context;
            _user = user;
            _userAccessor = userAccessor;
        }
        public async Task<Guid> Handle(CreateActivityCommand request, CancellationToken cancellationToken)
        {
            var context = await _user.Users.SingleOrDefaultAsync(x => x.UserName == _userAccessor.GetUsername());
            var activity = new Activity {
                Id = request.ActivityDTO.id,
                Title = request.ActivityDTO.Title,
                City = request.ActivityDTO.City,
                Venue = request.ActivityDTO.Venue,
                Description = request.ActivityDTO.Description,
                Category = request.ActivityDTO.Category,
                Date = request.ActivityDTO.Date
            };
            // var activity = _mapper.Map<Activity>(request.ActivityDTO);
            var attendee = new ActivityAttendee {
                AppUser = context,
                Activity = activity,
                isHost = true
            };
            activity.Attendees.Add(attendee);
            _context.Activities.Add(activity);
            await _context.SaveChangesAsync(cancellationToken);
            return activity.Id;
        }
    }
}
