using System.Security.Cryptography.X509Certificates;
using Application.Core;
using Application.Interface;
using Domain;
using FluentValidation;
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

        public class CommandValidator : AbstractValidator<Command>
        {
            public CommandValidator()
            {
                RuleFor(x =>x.File).Must(x => x.Length < 3000000).WithMessage("File size very big");
                RuleFor(x =>x.File).NotEmpty().WithMessage("File Not Empty");
                RuleFor(x => x.File).Must(x => IsValid(x.ContentType)).WithMessage("File Type Not Supported");
            }

            private bool IsValid(string contentType)
            {
                var allowedContentTypes = new[] { "image/jpeg", "image/png" };
                return allowedContentTypes.Contains(contentType);
            }
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