using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Cryptography.X509Certificates;
using System.Threading.Tasks;
using Application.Core;
using MediatR;
using Microsoft.EntityFrameworkCore;
using Persistence;

namespace Application.Activities
{
    public class KickUser
    {
        public class Command : IRequest<Result<Unit>>
        {
            public string Username { get; set; }

            public Guid ActivityId {get;set;}
            
        }

        public class Handler : IRequestHandler<Command, Result<Unit>>
        {
            private readonly DataContext _context;
            public Handler(DataContext context)
            {   
                _context = context;
            }
            public async Task<Result<Unit>> Handle(Command request, CancellationToken cancellationToken)
            {
                var activity = await _context.Activities.Include(x => x.Attendees).ThenInclude(x => x.AppUser).FirstOrDefaultAsync(x => x.Id ==request.ActivityId);
            // var result = await _context.SaveChangesAsync() > 0;
                if (activity is null)
                {
                    return null;           
                }

                var user=  activity.Attendees.FirstOrDefault(x => x.AppUser.UserName == request.Username);
                if (user is null)
                {
                    return null;
                }
                activity.Attendees.Remove(user);
               var result =  await _context.SaveChangesAsync() > 0 ;
                            if (result)
                            {
                                    return Result<Unit>.Success(Unit.Value);                                
                            }
                            return Result<Unit>.Failure("gaal");
              
            }
        }
    }
}