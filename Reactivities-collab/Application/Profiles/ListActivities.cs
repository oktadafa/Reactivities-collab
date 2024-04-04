using Application.Core;
using Application.Interface;
using AutoMapper;
using AutoMapper.QueryableExtensions;
using MediatR;
using Microsoft.EntityFrameworkCore;
using Persistence;

namespace Application.Profiles
{
    public class ListActivities
    {
        public class Query : IRequest<Result<List<UserActivityDto>>>
        {
            public string Username { get; set; }
            public string Predicate { get; set; }
        }

        public class Handler : IRequestHandler<Query, Result<List<UserActivityDto>>>
        {
            private readonly DataContext context1;
            private readonly IMapper _mapper;

            private readonly IUserAccessor _user;
            public Handler(DataContext context, IMapper mapper, IUserAccessor user)
            {
                context1 = context;
                _mapper = mapper;
                _user = user;
            }
            public async Task<Result<List<UserActivityDto>>> Handle(Query request, CancellationToken cancellationToken)
            {
                try
                {
                var query = context1.ActivityAttendees.Where(x => x.AppUser.UserName == request.Username).ProjectTo<UserActivityDto>(_mapper.ConfigurationProvider).AsQueryable();          
                // var user = await context1.Users.SingleOrDefaultAsync(x => x.UserName == _user.GetUsername());
                    switch (request.Predicate)
                    {
                        case "hosting":
                            query = query.Where(a => a.HostUsername == request.Username && a.isPrivate == false);
                            break;
                        case "past":
                            query = query.Where(a => a.Date < DateTime.UtcNow && a.isPrivate ==false);
                            break;
                        case "private":
                            query = query.Where(a => a.isPrivate == true && a.HostUsername == _user.GetUsername());
                            break;
                        default :
                            query = query.Where(a => a.Date > DateTime.UtcNow && a.isPrivate == false);
                            break;
                    }
                    return Result<List<UserActivityDto>>.Success(await query.ToListAsync());
                }
                catch (System.Exception)
                {
                   return Result<List<UserActivityDto>>.Failure("gagal");
                }
                
            }
        }
    }
}