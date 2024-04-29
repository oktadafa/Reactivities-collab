using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Identity;
using Reactivities_jason.Application.Common.Interfaces;
using Reactivities_jason.Domain.Entities;

namespace Reactivities_jason.Application.Profiles.Queries.Detail
{
    public record DetailQuery(string Username) : IRequest<Profiles>;

    public class DetailHandler : IRequestHandler<DetailQuery, Profiles>
    {
        private readonly IApplicationDbContext _context;
        private readonly IUserAccessor _user;
        private readonly UserManager<AppUser> _userManager;

        private readonly IMapper _mapper;
        public DetailHandler(IApplicationDbContext context, IUserAccessor user, UserManager<AppUser> userManager, IMapper mapper)
        {
            _context= context;
            _user =user;
            _userManager = userManager;
            _mapper = mapper;
        }
        public async Task<Profiles> Handle(DetailQuery request, CancellationToken cancellationToken)
        {
            var user = await _userManager.Users.ProjectTo<Profiles>(_mapper.ConfigurationProvider, new {currentUsername = _user.GetUsername()}).SingleOrDefaultAsync(x => x.Username == request.Username);
            if (user is null)
            {
                return null;
            }
            return user;
        }
    }


}
