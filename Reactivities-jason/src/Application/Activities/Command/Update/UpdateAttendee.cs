using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Identity;
using Reactivities_jason.Application.Common.Interfaces;
using Reactivities_jason.Application.Common.Models;
using Reactivities_jason.Domain.Entities;

namespace Reactivities_jason.Application.Activities.Command.Update
{
public record UpdateAttendeeCommand : IRequest<Result>
    {
        public Guid id { get; set; } 
        
    }

public class UpdateAttendeeHandler : IRequestHandler<UpdateAttendeeCommand, Result>
    {
        private readonly IApplicationDbContext _context;
        private readonly IUserAccessor _user;
        private readonly UserManager<AppUser> _manager;
        public UpdateAttendeeHandler(IApplicationDbContext context, IUserAccessor user, UserManager<AppUser> manager)
        {
            _context = context;
            _user = user;
            _manager = manager;
        }

        public async Task<Result> Handle(UpdateAttendeeCommand request, CancellationToken cancellationToken)
        {
            var user =await _manager.Users.SingleOrDefaultAsync(x => x.UserName == _user.GetUsername());
            if(user is null) return null;
            var activity =await _context.Activities.Include(x => x.Attendees).ThenInclude(x => x.AppUser).SingleOrDefaultAsync(x => x.Id == request.id);
            if(activity is null) return null;

            var hostUsername = activity.Attendees.FirstOrDefault(x => x.isHost)?.AppUser?.UserName;
            var attendance = activity.Attendees.FirstOrDefault(x => x.AppUser.UserName == user.UserName);

            if (attendance != null && hostUsername == user.UserName)
            {
                activity.isCanceled = !activity.isCanceled;
            }
            if (attendance != null && hostUsername != user.UserName)
            {
                activity.Attendees.Remove(attendance);        
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
            }

            var result = await _context.SaveChangesAsync(cancellationToken) > 0;
            if (result)
            {
                return Result.Success();
            }
            IEnumerable<string> strings = ["Gagal"];
            return Result.Failure(strings);
        }   
    }

}
