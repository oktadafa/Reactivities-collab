using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Identity;
using Reactivities_jason.Application.Common.Interfaces;
using Reactivities_jason.Application.Common.Models;
using Reactivities_jason.Domain.Entities;
using Serilog;

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
        private readonly ILogger _logger;

        public DeletePhotoHandler(IApplicationDbContext context, UserManager<AppUser> userManager, IUser user, ILogger logger)
        {
            _logger = logger;
            _context = context;
            _userManager = userManager;
            _user = user;
        }
        public async Task<Result> Handle(DeletePhotoCommand request, CancellationToken cancellationToken)
        {
            var user = await _userManager.Users.Include(x => x.Photos).SingleOrDefaultAsync(x => x.Id == _user.Id);
            var photo = user.Photos.SingleOrDefault(x => x.id == request.id);
            if (photo is null)
            {
                _logger.Error($"No Photo With ID {request.id}");
                return null;
            }
            user.Photos.Remove(photo);
            await _context.SaveChangesAsync(cancellationToken);
            _logger.Information($"Successfully Delete Photo Where Photo ID Equal {photo.id}");
            return Result.Success();
        }
    }

}
