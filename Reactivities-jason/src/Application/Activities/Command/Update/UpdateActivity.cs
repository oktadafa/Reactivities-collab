using Reactivities_jason.Application.Activities.Queries;
using Reactivities_jason.Application.Common.Interfaces;
using Reactivities_jason.Application.Common.Models;
using Reactivities_jason.Application.Common.Security;
using Reactivities_jason.Domain.Constants;

namespace Reactivities_jason.Application.Activities.Command.Update
{

    [Authorize(Policy = Policies.IsHost)]
    public record UpdateActivityCommand : IRequest<Result>
    {
        public ListActivityDTO ActivityDTO { get; set; }

    }

    public class UpdateActivityHandler : IRequestHandler<UpdateActivityCommand, Result>
    {
        private readonly IApplicationDbContext _context;
        public UpdateActivityHandler(IApplicationDbContext context)
        {
            _context = context;
        }
        public async Task<Result> Handle(UpdateActivityCommand request, CancellationToken cancellationToken)
        {
            var activity = await _context.Activities.SingleOrDefaultAsync(x => x.Id == request.ActivityDTO.id);

            Guard.Against.NotFound(request.ActivityDTO.id, activity);

            activity.Title = request.ActivityDTO.Title;
            activity.Description = request.ActivityDTO.Description;
            activity.Venue = request.ActivityDTO.Venue;
            activity.Date = request.ActivityDTO.Date;
            activity.Category = request.ActivityDTO.Category;
            activity.City = request.ActivityDTO.City;
            // _context.Activities.ExecuteUpdate()
            var result = await _context.SaveChangesAsync(cancellationToken) > 0;
            return Result.Success();
        }
    }
}
