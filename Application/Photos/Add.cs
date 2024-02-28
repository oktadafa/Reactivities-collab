using System;
using System.Collections.Generic;
using System.Linq;
using System.Reflection.Metadata;
using System.Threading.Tasks;
using Application.Core;
using Application.Interface;
using Domain;
using MediatR;
using Microsoft.AspNetCore.Http;
using Microsoft.EntityFrameworkCore;
using Persistence;

namespace Application.Photos
{
    public class Add
    {
        public class Command : IRequest<Result<Photo>>
        {
            public IFormFile File { get; set; }
        }

        public class Handler : IRequestHandler<Command, Result<Photo>>
        {
            private readonly DataContext dataContext1;
            private readonly IPhotoAcessor photoAcessor1;

            private IUserAccessor userAccessor1;
            public Handler(DataContext dataContext, IPhotoAcessor photoAcessor, IUserAccessor userAccessor)
            {
                dataContext1 = dataContext;
                photoAcessor1 = photoAcessor;
                userAccessor1 = userAccessor;
            }
            public async Task<Result<Photo>> Handle(Command request, CancellationToken cancellationToken)
            {
                var user= await dataContext1.Users.Include(p => p.Photos).FirstOrDefaultAsync(x => x.UserName == userAccessor1.GetUsername());

                if (user == null)
                {
                    return null;
                }

                var photoUploadResult = await photoAcessor1.AddPhoto(request.File);

                var photo = new Photo
                {
                    Url = photoUploadResult.Url,
                    id = photoUploadResult.PublicId
                };

                if (!user.Photos.Any(x => x.IsMain))
                {
                    photo.IsMain = true;
                }
                user.Photos.Add(photo);

                var result = await dataContext1.SaveChangesAsync() > 0;

                if (result)
                {
                    return Result<Photo>.Success(photo);
                }
                return Result<Photo>.Failure("Problem adding Photo");
            }
        }
    }
}