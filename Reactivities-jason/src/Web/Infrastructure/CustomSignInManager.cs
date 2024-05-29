using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Identity;
using Microsoft.Extensions.Options;
using Reactivities_jason.Domain.Entities;

namespace Reactivities_jason.Web.Infrastructure
{
    public class CustomSignInManager<TUser> : SignInManager<TUser> where TUser : class
    {
        private readonly UserManager<TUser> _userManager;
        private readonly IHttpContextAccessor _httpContextAccessor;
        private readonly IUserClaimsPrincipalFactory<TUser> _userClaimsPrincipalFactory;
        private readonly IOptions<IdentityOptions> _identityOptions;
        private readonly ILogger<SignInManager<TUser>> _logger;
        private readonly IAuthenticationSchemeProvider _authenticationSchemeProvider;
        private readonly IUserConfirmation<TUser> _confirmation;

        public CustomSignInManager(UserManager<TUser> userManager,
                     IHttpContextAccessor contextAccessor,
                       IUserClaimsPrincipalFactory<TUser> claimsFactory,
                       IOptions<IdentityOptions> optionsAccessor,
                       ILogger<SignInManager<TUser>> logger,
                       IAuthenticationSchemeProvider schemes,
                       IUserConfirmation<TUser> confirmation) : base(userManager, contextAccessor, claimsFactory, optionsAccessor, logger, schemes, confirmation)
        {
            _userManager = userManager;
            _httpContextAccessor = contextAccessor;
            _userClaimsPrincipalFactory = claimsFactory;
            _identityOptions = optionsAccessor;
            _logger = logger;
            _confirmation = confirmation;
            _authenticationSchemeProvider = schemes;
        }

        public override Task<SignInResult> PasswordSignInAsync(TUser user, string password, bool isPersistent, bool lockoutOnFailure)
        {
            return base.PasswordSignInAsync(user, password, isPersistent, lockoutOnFailure);
        }
    }
}
