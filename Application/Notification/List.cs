using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Application.Core;
using Application.Interface;
using AutoMapper;
using AutoMapper.QueryableExtensions;
using MediatR;
using Microsoft.EntityFrameworkCore;
using Persistence;

namespace Application.Notification
{
    public class List
    {
        public class Query : IRequest<Result<List<NotificationDTO>>>;


        public class Handler : IRequestHandler<Query, Result<List<NotificationDTO>>>
        {
            private readonly DataContext _context;
            private readonly IUserAccessor _user;
            private readonly IMapper _mapper;
            public Handler(DataContext context, IUserAccessor user, IMapper mapper)
            {
                _context = context;
                _user = user;
                _mapper = mapper;
            }
            public async Task<Result<List<NotificationDTO>>> Handle(Query request, CancellationToken cancellationToken)
            {
                var getUser = await _context.Users.SingleOrDefaultAsync(x => x.UserName == _user.GetUsername());
                if(getUser is null) return null;
                var notifications =  await _context.Notifications.OrderByDescending(x => x.Date).Where(x => x.To.UserName == getUser.UserName).ProjectTo<NotificationDTO>(_mapper.ConfigurationProvider).ToListAsync();
                if (notifications is null)
                {
                    return Result<List<NotificationDTO>>.Failure("Gagal");
                }          
                return Result<List<NotificationDTO>>.Success(notifications.Take(3).ToList());
            }
        }
    }
}