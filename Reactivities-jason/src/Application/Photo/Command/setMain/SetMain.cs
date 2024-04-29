using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Identity;
using Reactivities_jason.Application.Common.Interfaces;
using Reactivities_jason.Application.Common.Models;
using Reactivities_jason.Domain.Entities;

namespace Reactivities_jason.Application.Photo.Command.setMain
{
    public record SetMainCommand : IRequest<Result>
    {
        public Guid id { get; set; }
    }

    public class SetMainHandler : IRequestHandler<SetMainCommand, Result>
    {
        private readonly IApplicationDbContext _context;
        private readonly IUser _user;
        private readonly UserManager<AppUser> _userManager;
        
        public SetMainHandler(IApplicationDbContext context, IUser user, UserManager<AppUser> userManager)
        {
            _context = context;
            _user = user;
            _userManager = userManager;
        }
        public async Task<Result> Handle(SetMainCommand request, CancellationToken cancellationToken)
        {
            var user = await _userManager.Users.Include(x=> x.Photos).SingleOrDefaultAsync(x => x.Id == _user.Id);
            var photo = await _context.Photos.SingleOrDefaultAsync(x => x.id == request.id);
            if (photo is null)
            {
                return null;
            }

            var currentMain = user.Photos.SingleOrDefault(x => x.isMain);
            if (currentMain != null)
            {
                currentMain.isMain = false;
            }
            photo.isMain = true;
            var result = await _context.SaveChangesAsync(cancellationToken) > 0;
            if (result)
            {
                return Result.Success();
            }
            IEnumerable<string> strings = ["Tidak Bisa Setting Photo"];

            return Result.Failure(strings);

        }
    }
}
