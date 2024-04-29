using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Reactivities_jason.Application.Common.Interfaces;

namespace Reactivities_jason.Application.Activities.Queries.GetById
{
    public record ActivityByIdQuery : IRequest<ListActivityDTO>
    {
        public Guid id { get; set; }
        
        
    }

    public class ActivityByIdHandler : IRequestHandler<ActivityByIdQuery, ListActivityDTO>
    {
        private readonly IApplicationDbContext _context;
        private readonly IMapper _mapper;

        public ActivityByIdHandler(IApplicationDbContext context, IMapper mapper)
        {
            _context = context;
            _mapper = mapper;
        }
        public async Task<ListActivityDTO> Handle(ActivityByIdQuery request, CancellationToken cancellationToken)
        {
            var activity = await _context.Activities.ProjectTo<ListActivityDTO>(_mapper.ConfigurationProvider).FirstOrDefaultAsync(x => x.id == request.id);
            if (activity is null)
            {
                return null;
            }
            return activity;
        }
    }
}
