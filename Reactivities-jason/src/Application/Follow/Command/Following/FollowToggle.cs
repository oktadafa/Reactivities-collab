using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Identity;
using Reactivities_jason.Application.Common.Interfaces;
using Reactivities_jason.Application.Common.Models;
using Reactivities_jason.Domain.Entities;
using Serilog;

namespace Reactivities_jason.Application.Follow.Command.Following
{
    public record FollowToggleCommand : IRequest<Result>
    {
        public string TargetUsername { get; set; }

    }

    public class FollowToggleHandler : IRequestHandler<FollowToggleCommand, Result>
    {
        private readonly ILogger _logger;
        private readonly IApplicationDbContext _context;
        private readonly IUserAccessor _user;
        private readonly UserManager<AppUser> _userManager;

        public FollowToggleHandler(IApplicationDbContext context, IUserAccessor user, UserManager<AppUser> userManager, ILogger logger)
        {
            _logger = logger;
            _context = context;
            _user = user;
            _userManager = userManager;
        }
        public async Task<Result> Handle(FollowToggleCommand request, CancellationToken cancellationToken)
        {
            var observer = await _userManager.Users.SingleOrDefaultAsync(x => x.UserName == _user.GetUsername());
            var target = await _userManager.Users.SingleOrDefaultAsync(x => x.UserName == request.TargetUsername);

            if (target is null)
            {
                _logger.Error($"Error Because Does Not User With Username With Username {request.TargetUsername}");
                throw new NotFoundException(nameof(target), request.TargetUsername);
            }

            var following = await _context.UserFollowings.FindAsync(observer.Id, target.Id);
            if (following is null)
            {
                following = new UserFollowing
                {
                    Observer = observer,
                    Target = target
                };
                _context.UserFollowings.Add(following);
                _logger.Information($"User ID {observer.Id} Following {target.Id}");
            }
            else
            {
                _context.UserFollowings.Remove(following);
                _logger.Information($"User ID {observer.Id} Unfollow {target.Id}");
            }
            var success = await _context.SaveChangesAsync(cancellationToken) > 0;
            if (success)
            {
                return Result.Success();
            }
            IEnumerable<string> strings = ["gagal"];
            return Result.Failure(strings);
        }
    }
}
