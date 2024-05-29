using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;
using Reactivities_jason.Application.Common.Interfaces;
using Reactivities_jason.Application.Common.Models;

namespace Reactivities_jason.Application.Activities.Command.DeleteActivity
{
    [Authorize(Policy = "IsHost")]
    public record DeleteActivityCommand(Guid id) : IRequest<Result>;

    public class DeleteActivityHandler : IRequestHandler<DeleteActivityCommand, Result>
    {
        private readonly IApplicationDbContext _context;
        public DeleteActivityHandler(IApplicationDbContext context)
        {
            _context = context;
        }
        public async Task<Result> Handle(DeleteActivityCommand request, CancellationToken cancellationToken)
        {
            var Activity = await _context.Activities.SingleOrDefaultAsync(x => x.Id == request.id);
            if (Activity is null)
            {
                IEnumerable<string> strings = ["activity is null"];
                return Result.Failure(strings);
            }
            _context.Activities.Remove(Activity);
            var result = await _context.SaveChangesAsync(cancellationToken);
            if (result > 0)
            {
                return Result.Success();
            }
            IEnumerable<string> strings1 = ["Upload Error"];
            return Result.Failure(strings1);
        }
    }
}
