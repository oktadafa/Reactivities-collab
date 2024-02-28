using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Application.Core;
using Application.Interface;
using MediatR;
using Microsoft.EntityFrameworkCore;
using Persistence;

namespace Application.Photos
{
    public class Delete
    {
        public class Command : IRequest<Result<Unit>>
        {
            public string Id { get; set; }
        }

        public class Handler : IRequestHandler<Command, Result<Unit>>
        {
            private readonly DataContext _context;
            private readonly IPhotoAcessor _photoAcessor;
            private readonly IUserAccessor _userAccessor;
            public Handler(DataContext context, IPhotoAcessor photoAcessor, IUserAccessor userAccessor)
            {
                _context = context;
                _photoAcessor = photoAcessor;
                _userAccessor = userAccessor;
            }

            public async Task<Result<Unit>> Handle(Command request, CancellationToken cancellationToken)
            {
                var user = await _context.Users.Include(p => p.Photos).FirstOrDefaultAsync(x => x.UserName == _userAccessor.GetUsername());

                if (user == null)
                {
                    return null;
                }

                var photo = user.Photos.FirstOrDefault(x => x.id == request.Id);

                if (photo is null)
                {
                    return null;
                }
                if(photo.IsMain) return Result<Unit>.Failure("You Cannot Delete Your Main Photo");

                var result = await _photoAcessor.deletePhoto(photo.id);

                if(result is null) return Result<Unit>.Failure("Problem Deleting Photo From Cloudinary");

                user.Photos.Remove(photo);

                var success = await _context.SaveChangesAsync() > 0;
                if (success)
                {
                    return Result<Unit>.Success(Unit.Value);
                }
                return Result<Unit>.Failure("Problem deleting photo from API");
            }
        }
    }
}