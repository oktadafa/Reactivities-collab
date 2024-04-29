using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Reactivities_jason.Application.Common.Interfaces;
using Reactivities_jason.Application.Common.Mappings;
using Reactivities_jason.Application.Common.Models;
using Reactivities_jason.Domain.Entities;

namespace Reactivities_jason.Application.Activities.Queries
{
    public record ListQuery : IRequest<PaginatedList<ListActivityDTO>>
    {
        public int ListId { get; set; }
        public int PageNumber { get; set; }
        public int PageSize { get; set; }
        public string param {get;set;} = "all";
        public DateTime startDate {get;set;} = DateTime.UtcNow;
    };

    public class ListHandler : IRequestHandler<ListQuery, PaginatedList<ListActivityDTO>>
    {
        private readonly IApplicationDbContext _context;
        private readonly IMapper _mapper;

        private readonly IUserAccessor _userAccessor;
        public ListHandler(IApplicationDbContext context, IMapper mapper, IUserAccessor userAccessor)
        {
            _context = context;
            _mapper = mapper;
            _userAccessor = userAccessor;
        }
        public async Task<PaginatedList<ListActivityDTO>> Handle(ListQuery request, CancellationToken cancellationToken)
        {
        //    return await _context.Activities.OrderByDescending(x => x.Date).ProjectTo<ListActivityDTO>(_mapper.ConfigurationProvider).PaginatedListAsync(request.PageNumber,request.PageSize);
        var activity =  _context.Activities.OrderByDescending(x => x.Date).Where(x => x.Date >= request.startDate).ProjectTo<ListActivityDTO>(_mapper.ConfigurationProvider).AsQueryable();
         switch (request.param)
         {
            case "going":
                activity = activity.Where(x => x.Attendees.Any(x => x.Username == _userAccessor.GetUsername()));
                break;
            case "hosting":
                activity = activity.Where(x => x.HostUsername == _userAccessor.GetUsername());
                break;
         }
         return await activity.PaginatedListAsync(request.PageNumber, request.PageSize);
        }
    }
}
