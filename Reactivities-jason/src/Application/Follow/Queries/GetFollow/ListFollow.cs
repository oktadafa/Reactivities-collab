using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Identity;
using Reactivities_jason.Application.Common.Interfaces;
using Reactivities_jason.Application.Profiles;
using Reactivities_jason.Domain.Entities;
using Serilog;

namespace Reactivities_jason.Application.Follow.Queries.GetFollow
{
    public record ListFollowQuery : IRequest<List<Profiles.Profiles>>
    {
        public string Username { get; set; }

        public string Predicate { get; set; }
    }

    public class ListFollowHandler : IRequestHandler<ListFollowQuery, List<Profiles.Profiles>>
    {
        private readonly IApplicationDbContext _context;
        private readonly IMapper _mapper;
        private readonly IUserAccessor _userAccessor;
        private readonly ILogger _logger;
        private readonly UserManager<AppUser> _user;
        public ListFollowHandler(IApplicationDbContext context, IUserAccessor userAccessor, UserManager<AppUser> user, IMapper mapper, ILogger logger)
        {
            _logger = logger;
            _context = context;
            _user = user;
            _userAccessor = userAccessor;
            _mapper = mapper;
        }
        public async Task<List<Profiles.Profiles>> Handle(ListFollowQuery request, CancellationToken cancellationToken)
        {
            var profiles = new List<Profiles.Profiles>();
            switch (request.Predicate)
            {
                case "followers":
                    profiles = await _context.UserFollowings.Where(x => x.Target.UserName == request.Username).Select(u => u.Observer).ProjectTo<Profiles.Profiles>(_mapper.ConfigurationProvider, new { currentUsername = _userAccessor.GetUsername() }).ToListAsync();
                    _logger.Information($"Successfully Get Followers By {request.Username}");
                    break;
                case "following":
                    profiles = await _context.UserFollowings.Where(x => x.Observer.UserName == request.Username).Select(u => u.Target).ProjectTo<Profiles.Profiles>(_mapper.ConfigurationProvider, new { currentUsername = _userAccessor.GetUsername() }).ToListAsync();
                    _logger.Information($"Successfully Get Following By {request.Username}");
                    break;
            }
            return profiles;
        }
    }


}
