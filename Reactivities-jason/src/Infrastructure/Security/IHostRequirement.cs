using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Claims;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Hosting;
using Reactivities_jason.Infrastructure.Data;

namespace Reactivities_jason.Infrastructure.Security
{
    public class IHostRequirement : IAuthorizationRequirement
    {
        
    }

    public class IHostRequirementHandler : AuthorizationHandler<IHostRequirement>
    {
        private readonly ApplicationDbContext _context;
        private readonly IHttpContextAccessor _accessor;
        public IHostRequirementHandler(ApplicationDbContext context, IHttpContextAccessor accessor)
        {
            _context = context;
            _accessor = accessor;
        }

        protected override Task HandleRequirementAsync(AuthorizationHandlerContext context, IHostRequirement requirement)
        {
            var user =context.User.FindFirstValue(ClaimTypes.NameIdentifier);
            if(user ==null) return Task.CompletedTask;
            var activityId = Guid.Parse(_accessor.HttpContext.Request.RouteValues.SingleOrDefault(x => x.Key == "id").Value.ToString());
            var attende = _context.ActivityAttendees.AsNoTracking().SingleOrDefaultAsync(x => x.AppUserId == user && x.ActivityId == activityId).Result;
            if (attende == null)
            {
                return Task.CompletedTask;
            }
            if (attende.isHost)
            {
                context.Succeed(requirement);
            }
            return Task.CompletedTask;
        }
    }
}
