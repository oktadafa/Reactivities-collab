using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Reactivities_jason.Application.Comments.Dto;
using Reactivities_jason.Application.Common.Interfaces;
using Reactivities_jason.Application.Common.Security;
using Serilog;

namespace Reactivities_jason.Application.Comments.List
{
    [Authorize]
    public record ListQuery : IRequest<List<CommentDto>>
    {
        public Guid ActivityId { get; set; }
    }

    public class ListHandler : IRequestHandler<ListQuery, List<CommentDto>>
    {
        private readonly IApplicationDbContext _context;
        private readonly IMapper _mapper;
        private readonly ILogger _logger;

        public ListHandler(IApplicationDbContext context, IMapper mapper, ILogger logger)
        {
            _logger = logger;
            _mapper = mapper;
            _context = context;
        }

        public async Task<List<CommentDto>> Handle(ListQuery request, CancellationToken cancellationToken)
        {
            var comments = await _context.Comments.Where(x => x.Activity.Id == request.ActivityId).Where(x => x.CommentParent == null).OrderByDescending(x => x.CreatedAt).ProjectTo<CommentDto>(_mapper.ConfigurationProvider).ToListAsync();
            if (comments == null)
            {
                _logger.Warning($"No Activity With ID Equal {request.ActivityId}");
                throw new NotFoundException(nameof(comments), request.ActivityId.ToString());
            }

            foreach (var comment in comments)
            {
                comment.ReplyComments = comment.ReplyComments.OrderByDescending(x => x.CreatedAt).ToList();
            }
            _logger.Information($"Successfully Get Comments From Activity With Id equals {request.ActivityId}");
            return comments;
        }
    }
}
