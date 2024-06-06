using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using AutoMapper;
using AutoMapper.QueryableExtensions;
using MediatR;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Caching.Distributed;
using Newtonsoft.Json;
using Reactivities_jason.Application.Common.Interfaces;
using Reactivities_jason.Application.Common.Models;
using Reactivities_jason.Domain.Entities;
using Serilog;

namespace Reactivities_jason.Application.Activities.Queries
{
    public record ListQuery : IRequest<PaginatedList<ListActivityDTO>>
    {
        public int ListId { get; set; }
        public int PageNumber { get; set; }
        public int PageSize { get; set; }
        public string Param { get; set; } = "all";
        public DateTime StartDate { get; set; } = DateTime.UtcNow;
    }

    public class ListHandler : IRequestHandler<ListQuery, PaginatedList<ListActivityDTO>>
    {
        private readonly IApplicationDbContext _context;
        private readonly IMapper _mapper;
        private readonly IUserAccessor _userAccessor;
        private readonly ILogger _logger;

        public ListHandler(IApplicationDbContext context, IMapper mapper, IUserAccessor userAccessor, IDistributedCache cache, ILogger logger)
        {
            _context = context;
            _mapper = mapper;
            _userAccessor = userAccessor;
            _logger = logger;
        }

        public async Task<PaginatedList<ListActivityDTO>> Handle(ListQuery request, CancellationToken cancellationToken)
        {
            var query = _context.Activities
                .Where(x => x.Date >= request.StartDate)
                .OrderByDescending(x => x.Date)
                .ProjectTo<ListActivityDTO>(_mapper.ConfigurationProvider)
                .AsQueryable();
            switch (request.Param)
            {
                case "going":
                    query = query.Where(x => x.Attendees.Any(a => a.Username == _userAccessor.GetUsername()));
                    break;
                case "hosting":
                    query = query.Where(x => x.HostUsername == _userAccessor.GetUsername());
                    break;
            }

            var paginatedList = await PaginatedList<ListActivityDTO>.CreateAsync(query, request.PageNumber, request.PageSize);
            return paginatedList;
        }
    }
}
