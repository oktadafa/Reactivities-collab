using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Application.Core;
using Application.DTO;
using AutoMapper;
using Domain;
using MediatR;
using Microsoft.EntityFrameworkCore;
using Persistence;

namespace Application.Activities
{
    public class List
    {
        public class Query : IRequest<Result<List<ActivityDTO>>>
        {}
        public class Handler : IRequestHandler<Query, Result<List<ActivityDTO>>>
        {
            private readonly DataContext _context;

            private readonly IMapper _imapper;
            public Handler(DataContext context, IMapper mapper)
            {
                _context = context;
                _imapper = mapper;
            }

            public async Task<Result<List<ActivityDTO>>> Handle(Query request, CancellationToken cancellationToken)
            {
                var activities = await _context.Activities
                .Include(a => a.Attendees)
                .ThenInclude(u => u.AppUser)
                .ToListAsync(cancellationToken);
                var activitiesReturm = _imapper.Map<List<ActivityDTO>>(activities);
                return Result<List<ActivityDTO>>.Success(activitiesReturm); 
            }

            
        }
    }
}