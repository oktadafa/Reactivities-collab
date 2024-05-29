using Microsoft.AspNetCore.Identity;
using Reactivities_jason.Application.Common.Interfaces;
using Reactivities_jason.Application.Common.Models;
using Reactivities_jason.Application.Common.Security;
using Reactivities_jason.Domain.Entities;
using Serilog;

namespace Reactivities_jason.Application.Profiles.Commands.UpdateProfiles
{
    [Authorize]
    public record UpdateProfileCommand(UpdateProfileDTO UpdateProfile) : IRequest<Result>;

    public class UpdateProfileHandler : IRequestHandler<UpdateProfileCommand, Result>
    {
        private readonly ILogger _logger;
        private readonly IUserAccessor _user;
        private readonly UserManager<AppUser> _userManager;
        private readonly IApplicationDbContext _context;
        public UpdateProfileHandler(IApplicationDbContext context, IUserAccessor user, UserManager<AppUser> userManager, ILogger logger)
        {
            _logger = logger;
            _user = user;
            _userManager = userManager;
            _context = context;
        }
        public async Task<Result> Handle(UpdateProfileCommand request, CancellationToken cancellationToken)
        {
            var user = await _userManager.Users.SingleOrDefaultAsync(x => x.UserName == _user.GetUsername());
            user.Bio = request.UpdateProfile.Bio;
            user.DisplayName = request.UpdateProfile.DisplayName;
            await _userManager.UpdateAsync(user);
            _logger.Information($"User ID {user.Id} Update Profile");
            return Result.Success();
        }
    }
}
