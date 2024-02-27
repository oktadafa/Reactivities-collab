using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Claims;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.EntityFrameworkCore;
using Persistence;

namespace Infrastructure.Security
{
    public class IHostRequirement : IAuthorizationRequirement
    {
        
    }
    public class IHostRequirementHandler : AuthorizationHandler<IHostRequirement>
    {
        private readonly DataContext _context;
        private readonly IHttpContextAccessor _httpContextAccessor;
        public IHostRequirementHandler(DataContext context, IHttpContextAccessor httpContextAccessor)
        {
            _context = context;
            _httpContextAccessor = httpContextAccessor;
        }
        protected override Task HandleRequirementAsync(AuthorizationHandlerContext context, IHostRequirement requirement)
        {
                var user =context.User.FindFirstValue(ClaimTypes.NameIdentifier);
                if(user == null) return Task.CompletedTask;
                var acctivityId = Guid.Parse(_httpContextAccessor.HttpContext?.Request.RouteValues.SingleOrDefault(x => x.Key == "id").Value?.ToString() );
                var attendee = _context.ActivityAttendees.AsNoTracking().SingleOrDefaultAsync(x => x.AppUserId == user && x.ActivityId == acctivityId).Result;
                if(attendee == null ) return Task.CompletedTask;
                if(attendee.isHost) context.Succeed(requirement);
               return Task.CompletedTask; 
        }
    }
}