using System;
using System.Collections.Generic;
using System.Linq;
using System.Runtime.InteropServices;
using System.Threading.Tasks;
using Application.Core;
using Domain;
using MediatR;
using Persistence;

namespace Application.Activities
{
    public class Delete
    {
        public class Command : IRequest<Result<Unit>>
        {
            public Guid id{get;set;}
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
                var activity = await _context.Activities.FindAsync(request.id);
               
                _context.Remove(activity);

               var result =  await _context.SaveChangesAsync() > 0;
               if (!result)
               {
                return Result<Unit>.Failure("failed delte the activity");
               }
               return Result<Unit>.Success(Unit.Value);
            }
        }
    }
}