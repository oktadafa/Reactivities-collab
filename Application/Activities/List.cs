using Application.Core;
using Application.DTO;
using Application.Interface;
using AutoMapper;
using AutoMapper.QueryableExtensions;
using MediatR;
using Microsoft.AspNetCore.Http.Features;
using Microsoft.EntityFrameworkCore;
using Persistence;

namespace Application.Activities
{
    public class List
    {
        public class Query : IRequest<Result<PagedList<ActivityDTO>>>
        {
            public ActivityParams Params { get; set; }
        }
        public class Handler : IRequestHandler<Query, Result<PagedList<ActivityDTO>>>
        {
        
            private readonly DataContext _context;

            private readonly IMapper _imapper;

            private readonly IUserAccessor userAccessor1;
            public Handler(DataContext context, IMapper mapper, IUserAccessor userAccessor)
            {
                _context = context;
                _imapper = mapper;
                userAccessor1 = userAccessor;
            }

            public async Task<Result<PagedList<ActivityDTO>>> Handle(Query request, CancellationToken cancellationToken)
            {
                var query =  _context.Activities
                .Where(d => d.Date >= request.Params.startDate)
                .OrderBy(d => d.Date)
                .ProjectTo<ActivityDTO>(_imapper.ConfigurationProvider, new {currentUsername = userAccessor1.GetUsername()})
                .AsQueryable();

                if (request.Params.isGoing && !request.Params.isHost)
                {
                    query = query.Where(x => x.Attendees.Any(a => a.Username == userAccessor1.GetUsername()));
                }
                if (request.Params.isHost && !request.Params.isGoing)
                {
                    query = query.Where(x => x.HostUsername == userAccessor1.GetUsername());
                }
                return Result<PagedList<ActivityDTO>>.Success(
                    await PagedList<ActivityDTO>.CreateAsync(query, request.Params.pageNumber, request.Params.PageSize)
                ); 
            }

            
        }
    }
}