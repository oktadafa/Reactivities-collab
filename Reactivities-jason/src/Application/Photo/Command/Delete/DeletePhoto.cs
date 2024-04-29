using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Identity;
using Reactivities_jason.Application.Common.Interfaces;
using Reactivities_jason.Application.Common.Models;
using Reactivities_jason.Domain.Entities;

namespace Reactivities_jason.Application.Photo.Command.Delete
{
    public record DeletePhotoCommand : IRequest<Result>
    {
        public Guid id { get; set; }
    }

    public class DeletePhotoHandler : IRequestHandler<DeletePhotoCommand, Result>
    {
        private readonly IApplicationDbContext _context;
        private readonly UserManager<AppUser> _userManager;
        private readonly IUser _user;

        public DeletePhotoHandler(IApplicationDbContext context, UserManager<AppUser> userManager, IUser user)
        {
            _context = context;
            _userManager = userManager;
            _user= user;
        }
        public async Task<Result> Handle(DeletePhotoCommand request, CancellationToken cancellationToken)
        {
            var user =await _userManager.Users.Include(x => x.Photos).SingleOrDefaultAsync(x => x.Id == _user.Id);
            var photo = user.Photos.SingleOrDefault(x => x.id == request.id);
            if (photo is null)
            {
                return null;
            }
            user.Photos.Remove(photo);
            await _context.SaveChangesAsync(cancellationToken);
            return Result.Success();
        }
    }   

}
