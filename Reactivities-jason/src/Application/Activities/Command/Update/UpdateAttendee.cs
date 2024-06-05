using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Identity;
using Reactivities_jason.Application.Common.Interfaces;
using Reactivities_jason.Application.Common.Models;
using Reactivities_jason.Application.Common.Security;
using Reactivities_jason.Domain.Entities;
using Serilog;

namespace Reactivities_jason.Application.Activities.Command.Update
{
    [Authorize]
    public record UpdateAttendeeCommand : IRequest<Result>
    {
        public Guid id { get; set; }

    }

    public class UpdateAttendeeHandler : IRequestHandler<UpdateAttendeeCommand, Result>
    {
        private readonly ILogger _logger;
        private readonly IApplicationDbContext _context;
        private readonly IUserAccessor _user;
        private readonly UserManager<AppUser> _manager;
        public UpdateAttendeeHandler(IApplicationDbContext context, ILogger logger, IUserAccessor user, UserManager<AppUser> manager)
        {
            _logger = logger;
            _context = context;
            _user = user;
            _manager = manager;
        }

        public async Task<Result> Handle(UpdateAttendeeCommand request, CancellationToken cancellationToken)
        {
            var user = await _manager.Users.SingleOrDefaultAsync(x => x.UserName == _user.GetUsername());
            if (user is null) throw new UnauthorizedAccessException();
            var activity = await _context.Activities.Include(x => x.Attendees).ThenInclude(x => x.AppUser).SingleOrDefaultAsync(x => x.Id == request.id);
            if (activity is null) throw new NotFoundException(nameof(activity), request.id.ToString());

            var hostUsername = activity.Attendees.FirstOrDefault(x => x.isHost)?.AppUser?.UserName;
            var attendance = activity.Attendees.FirstOrDefault(x => x.AppUser.UserName == user.UserName);

            if (attendance != null && hostUsername == user.UserName)
            {
                activity.isCanceled = !activity.isCanceled;
                _logger.Information($"Activity With {activity.Id} is ${activity.isCanceled}");
            }
            if (attendance != null && hostUsername != user.UserName)
            {
                activity.Attendees.Remove(attendance);
                _logger.Information($"User ID {attendance.AppUser.Id} Leave Activity {activity.Id}");
            }
            if (attendance is null)
            {
                attendance = new ActivityAttendee
                {
                    AppUser = user,
                    Activity = activity,
                    isHost = false
                };
                activity.Attendees.Add(attendance);
                _logger.Information($"User ID {attendance.AppUser.Id} Join Activity {activity.Id}");
            }

            var result = await _context.SaveChangesAsync(cancellationToken) > 0;
            if (result)
            {
                _logger.Information("Success Execute");
                return Result.Success();
            }
            IEnumerable<string> strings = ["Gagal"];
            return Result.Failure(strings);
        }
    }

}
