using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Identity;
using Reactivities_jason.Application.Common.Models;
using Reactivities_jason.Domain.Entities;

namespace Reactivities_jason.Application.User.Command
{
    public class RegisterUserCommand:IRequest<Result>
    {
        public string Username { get; set; }
        
        public string DisplayName { get; set; }
        
        public string Password { get; set; }
        
        public string Email { get; set; }
        
    }

    public class RegisterUserHandler : IRequestHandler<RegisterUserCommand, Result>
    {
        private readonly UserManager<AppUser> _userManager;
        public RegisterUserHandler(UserManager<AppUser> userManager)
        {
                _userManager = userManager;
        }
        public async Task<Result> Handle(RegisterUserCommand request, CancellationToken cancellationToken)
        {
            try
            {
                var newUser = new AppUser
                {
                    UserName = request.Username,
                    DisplayName = request.DisplayName,
                    Email = request.Email,
                };

                var result = await _userManager.CreateAsync(newUser, request.Password);
               
                    return Result.Success();
                
            }
            catch (System.Exception ex)
            {
                
           return Result.Failure([ex.Message]);
            }

        }
    }
}
