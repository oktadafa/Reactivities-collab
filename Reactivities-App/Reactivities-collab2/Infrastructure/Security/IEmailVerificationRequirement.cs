using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Claims;
using System.Threading.Tasks;
using Application.Interface;
using Microsoft.AspNetCore.Authorization;
using Microsoft.EntityFrameworkCore;
using Persistence;

namespace Infrastructure.Security
{
    public class IEmailVerificationRequirement : IAuthorizationRequirement
    {
        
    }
    public class IEmailVerificationRequirementHandler : AuthorizationHandler<IEmailVerificationRequirement>
    {
        private readonly DataContext _context;
        private readonly IUserAccessor _user;

        public IEmailVerificationRequirementHandler(DataContext context, IUserAccessor user)
        {
            _user = user;
            _context = context;
        }

        protected override Task HandleRequirementAsync(AuthorizationHandlerContext context, IEmailVerificationRequirement requirement)
        {
            var user =  _context.Users.SingleOrDefault(x => x.UserName == _user.GetUsername());
            if(user is null ) return Task.CompletedTask;
            if (user.EmailConfirmed  == true)
            {
              context.Succeed(requirement);   
            }
            return Task.CompletedTask;
        }
    }
}