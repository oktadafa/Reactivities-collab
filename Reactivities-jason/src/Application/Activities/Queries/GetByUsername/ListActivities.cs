using Reactivities_jason.Application.Common.Interfaces;

namespace Reactivities_jason.Application.Activities.Queries.GetByUsername
{
    public record ListActivitiesQuery(string username, string predicate) : IRequest<List<UserActivityDTO>>;

    public class ListActivitiesHandler : IRequestHandler<ListActivitiesQuery, List<UserActivityDTO>>
    {

        private readonly IApplicationDbContext _context;
        private readonly IMapper _mapper;

        private readonly IUserAccessor _user;
        public ListActivitiesHandler(IApplicationDbContext context, IMapper mapper, IUserAccessor user)
        {
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
                    query = query.Where(a => a.HostUsername == request.username && a.isPrivate == false);
                    break;

                    case "past" : 
                    query = query.Where(a => a.Date < DateTime.UtcNow && a.isPrivate == false);
                    break;

                    case "private":
                    query = query.Where(a => a.isPrivate == true && a.HostUsername == _user.GetUsername());
                    break;

                    default:
                    query = query.Where(a => a.Date > DateTime.UtcNow && a.isPrivate == false);
                    break;
                }

                return await query.ToListAsync();
            }
            catch (Exception )
            {
                // IEnumerable<string> strings = [e.Message];
                return null;
            }
        }
    }
}
