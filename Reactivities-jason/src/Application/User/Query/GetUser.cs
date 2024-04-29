using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Identity;
using Reactivities_jason.Application.Common.Interfaces;
using Reactivities_jason.Application.Common.Models;
using Reactivities_jason.Application.Common.Security;
using Reactivities_jason.Domain.Entities;

namespace Reactivities_jason.Application.User.Query
{
    [Authorize]
    public class GetUserQuery :IRequest<UserDTO>;

    public class GetUserHandler : IRequestHandler<GetUserQuery, UserDTO>
    {
        private readonly IUser _user;
        private readonly UserManager<AppUser> _userManager;
        private readonly IMapper _mapper;
        public GetUserHandler(IMapper mapper, UserManager<AppUser> userManager, IUser user)
        {
            _user = user;
            _userManager = userManager;
            _mapper = mapper;
        }

        public async Task<UserDTO> Handle(GetUserQuery request, CancellationToken cancellationToken)
        {
            var user = await _userManager.Users.Include(p => p.Photos).FirstOrDefaultAsync(x => x.Id == _user.Id);
            var UserDTO = _mapper.Map<UserDTO>(user);
            return UserDTO;
        }
    }
}
