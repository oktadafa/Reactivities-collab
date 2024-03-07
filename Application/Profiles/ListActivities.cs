using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Application.Activities;
using Application.Core;
using AutoMapper;
using AutoMapper.QueryableExtensions;
using Domain;
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
            public Handler(DataContext context, IMapper mapper)
            {
                context1 = context;
                _mapper = mapper;
            }
            public async Task<Result<List<UserActivityDto>>> Handle(Query request, CancellationToken cancellationToken)
            {
                try
                {
                var query = context1.ActivityAttendees.Where(x => x.AppUser.UserName == request.Username).ProjectTo<UserActivityDto>(_mapper.ConfigurationProvider).AsQueryable();          
                
                    switch (request.Predicate)
                    {
                        case "hosting":
                            query = query.Where(a => a.HostUsername == request.Username);
                            break;
                        case "past":
                            query = query.Where(a => a.Date < DateTime.UtcNow);
                            break;
                        case "private":
                            query = query.Where(a => a.isPrivate == true);
                            break;
                        default :
                            query = query.Where(a => a.Date > DateTime.UtcNow);
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