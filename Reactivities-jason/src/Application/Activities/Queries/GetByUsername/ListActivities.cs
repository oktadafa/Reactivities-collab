
using Microsoft.Extensions.Caching.Distributed;
using Reactivities_jason.Application.Common.Interfaces;
using Serilog;
using Newtonsoft.Json;
namespace Reactivities_jason.Application.Activities.Queries.GetByUsername
{
    public record ListActivitiesQuery(string username, string predicate) : IRequest<List<UserActivityDTO>>;

    public class ListActivitiesHandler : IRequestHandler<ListActivitiesQuery, List<UserActivityDTO>>
    {
        private readonly ILogger _logger;
        private readonly IApplicationDbContext _context;
        private readonly IMapper _mapper;
        private readonly IDistributedCache _cache;
        private readonly IUserAccessor _user;
        public ListActivitiesHandler(ILogger ilogger, IApplicationDbContext context, IMapper mapper, IUserAccessor user, IDistributedCache cache)
        {
            _cache = cache;
            _logger = ilogger;
            _context = context;
            _mapper = mapper;
            _user = user;
        }
        public async Task<List<UserActivityDTO>> Handle(ListActivitiesQuery request, CancellationToken cancellationToken)
        {
            try
            {

                var query = _context.ActivityAttendees.Where(x => x.AppUser.UserName == request.username).ProjectTo<UserActivityDTO>(_mapper.ConfigurationProvider).AsQueryable();
                switch (request.predicate)
                {
                    case "hosting":
                        query = query.Where(a => a.HostUsername == request.username);
                        break;
                    case "past":
                        query = query.Where(a => a.Date < DateTime.UtcNow);
                        break;
                    default:
                        query = query.Where(a => a.Date > DateTime.UtcNow);
                        break;
                }
                _logger.Information("Successfully Get List Activities");
                return await query.ToListAsync();
            }
            catch (Exception ex)
            {
                _logger.Error("Error List Activities = ", ex.Message);
                // IEnumerable<string> strings = [e.Message];
                return null;
            }
        }
    }
}
