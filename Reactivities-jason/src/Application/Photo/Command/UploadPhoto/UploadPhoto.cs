using Microsoft.AspNetCore.Identity;
using Reactivities_jason.Application.Common.Interfaces;
using Reactivities_jason.Application.Common.Models;
using Reactivities_jason.Domain.Entities;

namespace Reactivities_jason.Application.Photo.Command.UploadPhoto
{
    public record UploadPhotoCommand : IRequest<Domain.Entities.Photo>
    {
        public string FileName { get; set; }

        public string fileBase64 { get; set; }
    }

    public class UploadPhotoHandler : IRequestHandler<UploadPhotoCommand, Domain.Entities.Photo>
    {
        private readonly UserManager<AppUser> _userManager;
        private readonly IUser _user;
        private readonly IApplicationDbContext _context;
        private readonly IUserAccessor _userAccessor;
        public UploadPhotoHandler(UserManager<AppUser> userManager, IUser user, IApplicationDbContext context, IUserAccessor userAccessor)
        {
            _userAccessor = userAccessor;
            _user = user;
            _context = context;
            _userManager = userManager;
        }
        public async Task<Domain.Entities.Photo> Handle(UploadPhotoCommand request, CancellationToken cancellationToken)
        {
            var user= await _userManager.Users.Include(x => x.Photos).SingleOrDefaultAsync(x => x.UserName == _userAccessor.GetUsername());
            var photo = new Domain.Entities.Photo {
            fileBase64  = request.fileBase64,
            FileName = request.FileName
            };
            if (!user.Photos.Any(x => x.isMain))
            {
                photo.isMain = true;
            }

            user.Photos.Add(photo);
            var result  = await _context.SaveChangesAsync(cancellationToken) > 0;
            if (result)
            {
                return photo;
            }
            return photo;
        }
    }


}
