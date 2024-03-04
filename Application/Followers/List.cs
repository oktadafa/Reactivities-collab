using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Application.Core;
using Application.Profiles;
using AutoMapper;
using AutoMapper.QueryableExtensions;
using MediatR;
using Microsoft.EntityFrameworkCore;
using Persistence;

namespace Application.Followers
{
    public class List
    {
        public class Query : IRequest<Result<List<Profiles.Profile>>>
        {
            public string Predicate { get; set; }

            public string Username { get; set; }
        }

        public class Handler : IRequestHandler<Query, Result<List<Profiles.Profile>>>
        {
            private readonly DataContext _contex;
            private readonly IMapper _mapper;
            public Handler(DataContext dataContext, IMapper mapper)
            {
                _contex = dataContext;
                _mapper = mapper;
            }
            public async Task<Result<List<Profiles.Profile>>> Handle(Query request, CancellationToken cancellationToken)
            {
                var profiles = new List<Profiles.Profile>();
                switch(request.Predicate)
                {
                    case "followers" : 
                        profiles = await _contex.userFollowings.Where(x => x.Target.UserName == request.Username).Select(u => u.Observer).ProjectTo<Profiles.Profile>(_mapper.ConfigurationProvider).ToListAsync();
                        break;
                    case "following":
                        profiles = await _contex.userFollowings.Where(x => x.Observer.UserName == request.Username).Select(u => u.Observer).ProjectTo<Profiles.Profile>(_mapper.ConfigurationProvider).ToListAsync();
                        break;
                }

                return Result<List<Profiles.Profile>>.Success(profiles);
            }
        }
    }
}